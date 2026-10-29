import type { NextRequest } from "next/server";
import {
  REGIONS,
  SUBSCRIBER_RANGES,
  UPLOAD_WINDOWS,
  type ChannelLead,
  type LeadsError,
  type LeadsResponse,
} from "@/lib/leads/filters";

const API = "https://www.googleapis.com/youtube/v3";
// Each search page costs 100 quota units, so cap how many we scan per request.
const MAX_SEARCH_PAGES = 3;
const TARGET_LEADS = 20;

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const URL_RE = /https?:\/\/[^\s<>"')]+/gi;

class YouTubeError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

interface SearchItem {
  snippet: { channelId: string };
}

interface ChannelItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    country?: string;
    thumbnails?: Record<string, { url: string }>;
  };
  statistics: {
    viewCount?: string;
    subscriberCount?: string;
    hiddenSubscriberCount: boolean;
    videoCount?: string;
  };
  contentDetails?: { relatedPlaylists?: { uploads?: string } };
}

interface PlaylistItem {
  snippet: { title: string; resourceId: { videoId: string } };
  contentDetails: { videoId: string; videoPublishedAt?: string };
}

async function yt<T>(
  endpoint: string,
  params: Record<string, string | undefined>,
  key: string,
): Promise<T> {
  const url = new URL(`${API}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, v);
  }
  url.searchParams.set("key", key);

  const res = await fetch(url, { cache: "no-store" });
  const body = await res.json();
  if (!res.ok) {
    const reason = body?.error?.errors?.[0]?.reason;
    if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") {
      throw new YouTubeError(
        "YouTube API daily quota exhausted. It resets at midnight Pacific time.",
        429,
      );
    }
    throw new YouTubeError(
      body?.error?.message ?? `YouTube API request failed (${res.status})`,
      res.status,
    );
  }
  return body as T;
}

async function latestUpload(playlistId: string | undefined, key: string) {
  if (!playlistId) return null;
  try {
    const data = await yt<{ items?: PlaylistItem[] }>(
      "playlistItems",
      { part: "snippet,contentDetails", playlistId, maxResults: "1" },
      key,
    );
    const item = data.items?.[0];
    if (!item) return null;
    return {
      publishedAt: item.contentDetails.videoPublishedAt ?? null,
      title: item.snippet.title,
      videoId: item.contentDetails.videoId,
    };
  } catch {
    // Channels with no public uploads return 404 for their uploads playlist.
    return null;
  }
}

function toLead(
  channel: ChannelItem,
  upload: Awaited<ReturnType<typeof latestUpload>>,
): ChannelLead {
  const { snippet, statistics } = channel;
  const handle = snippet.customUrl ?? null;
  const thumbs = snippet.thumbnails ?? {};
  return {
    id: channel.id,
    title: snippet.title,
    handle,
    url: handle
      ? `https://www.youtube.com/${handle}`
      : `https://www.youtube.com/channel/${channel.id}`,
    thumbnail: (thumbs.medium ?? thumbs.default ?? thumbs.high)?.url ?? null,
    description: snippet.description,
    country: snippet.country ?? null,
    subscribers: statistics.hiddenSubscriberCount
      ? null
      : Number(statistics.subscriberCount ?? 0),
    views: Number(statistics.viewCount ?? 0),
    videos: Number(statistics.videoCount ?? 0),
    lastUploadAt: upload?.publishedAt ?? null,
    lastVideoTitle: upload?.title ?? null,
    lastVideoUrl: upload
      ? `https://www.youtube.com/watch?v=${upload.videoId}`
      : null,
    emails: [...new Set(snippet.description.match(EMAIL_RE) ?? [])],
    links: [...new Set(snippet.description.match(URL_RE) ?? [])].slice(0, 5),
  };
}

function fail(error: string, status: number) {
  return Response.json({ error } satisfies LeadsError, { status });
}

export async function GET(request: NextRequest) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return fail(
      "YOUTUBE_API_KEY is not set. Add it to .env.local (see .env.example) and restart the server.",
      500,
    );
  }

  const params = request.nextUrl.searchParams;
  const niche = params.get("niche")?.trim();
  if (!niche) return fail("Enter a niche to search for.", 400);

  const range =
    SUBSCRIBER_RANGES.find((r) => r.id === params.get("subs")) ??
    SUBSCRIBER_RANGES[0];
  const window =
    UPLOAD_WINDOWS.find((w) => w.id === params.get("upload")) ??
    UPLOAD_WINDOWS[0];
  const region =
    REGIONS.find((r) => r.code === params.get("region")) ?? REGIONS[0];
  const regionCode = region.code === "any" ? undefined : region.code;

  const cutoff = window.days
    ? new Date(Date.now() - window.days * 24 * 60 * 60 * 1000)
    : null;

  let pageToken = params.get("pageToken") ?? undefined;
  const seen = new Set<string>();
  const leads: ChannelLead[] = [];
  let scanned = 0;

  try {
    for (let page = 0; page < MAX_SEARCH_PAGES; page++) {
      // With an upload window, search recent *videos* in the niche: anyone who
      // posted one is by definition active. Otherwise search channels directly.
      const search = await yt<{ items?: SearchItem[]; nextPageToken?: string }>(
        "search",
        {
          part: "snippet",
          q: niche,
          type: cutoff ? "video" : "channel",
          maxResults: "50",
          regionCode,
          publishedAfter: cutoff?.toISOString(),
          pageToken,
        },
        key,
      );
      pageToken = search.nextPageToken;

      const ids = (search.items ?? [])
        .map((item) => item.snippet.channelId)
        .filter((id) => !seen.has(id) && seen.add(id));

      if (ids.length > 0) {
        const channels = await yt<{ items?: ChannelItem[] }>(
          "channels",
          {
            part: "snippet,statistics,contentDetails",
            id: ids.join(","),
            maxResults: "50",
          },
          key,
        );
        scanned += channels.items?.length ?? 0;

        const candidates = (channels.items ?? []).filter((c) => {
          if (range.id !== "any") {
            if (c.statistics.hiddenSubscriberCount) return false;
            const subs = Number(c.statistics.subscriberCount ?? 0);
            if (subs < range.min || subs >= range.max) return false;
          }
          // Most channels never set a country, so only drop explicit mismatches.
          if (regionCode && c.snippet.country && c.snippet.country !== regionCode) {
            return false;
          }
          return true;
        });

        const uploads = await Promise.all(
          candidates.map((c) =>
            latestUpload(c.contentDetails?.relatedPlaylists?.uploads, key),
          ),
        );

        candidates.forEach((c, i) => {
          const upload = uploads[i];
          if (cutoff) {
            const last = upload?.publishedAt ? new Date(upload.publishedAt) : null;
            if (!last || last < cutoff) return;
          }
          leads.push(toLead(c, upload));
        });
      }

      if (!pageToken || leads.length >= TARGET_LEADS) break;
    }
  } catch (err) {
    if (err instanceof YouTubeError) return fail(err.message, err.status);
    return fail("Something went wrong talking to YouTube.", 502);
  }

  return Response.json({
    leads,
    nextPageToken: pageToken ?? null,
    scanned,
  } satisfies LeadsResponse);
}
