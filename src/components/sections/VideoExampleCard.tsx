"use client";

import { Eye, Heart, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export type Category = "long" | "vsl" | "shorts" | "brand";

export type VideoExample = {
  id: string;
  title: string;
  client: string;
  category: Category;
  /** YouTube video ID (the part after `v=` in the URL). Leave "" for placeholder. */
  youtubeId: string;
  views: string;
  likes: string;
  gradient: string;
};

const CATEGORY_LABEL: Record<Category, string> = {
  long: "Long-form",
  vsl: "VSL",
  shorts: "Short",
  brand: "Brand",
};

interface Props {
  example: VideoExample;
}

export function VideoExampleCard({ example }: Props) {
  const [playing, setPlaying] = useState(false);
  const hasVideo = example.youtubeId.trim().length > 0;
  const thumbnail = hasVideo
    ? `https://i.ytimg.com/vi/${example.youtubeId}/hqdefault.jpg`
    : null;

  const handlePlay = () => {
    if (hasVideo) setPlaying(true);
  };

  // Long-form and VSL render 16:9. Shorts and brand render vertical 9:16.
  const isLandscape =
    example.category === "long" || example.category === "vsl";
  const aspectClass = isLandscape ? "aspect-video" : "aspect-[9/16]";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.08]",
        aspectClass,
        "bg-surface/40 backdrop-blur-xl",
        "transition-all duration-500 ease-out will-change-transform",
        !playing && "hover:scale-[1.03] hover:border-primary/40 hover:shadow-glow-md",
        !playing && "focus-within:scale-[1.03] focus-within:border-primary/40 focus-within:shadow-glow-md",
      )}
    >
      {/* gradient base (also fallback when no thumbnail) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: example.gradient }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] opacity-60"
      />

      {/* YT thumbnail (covers the gradient when an ID is set) */}
      {thumbnail && !playing ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt={`${example.title} thumbnail`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* playing iframe */}
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${example.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={example.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : null}

      {/* poster-state overlays (hidden once playing) */}
      {!playing ? (
        <>
          {/* bottom darkening for legibility */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/30"
          />

          {/* category badge */}
          <div className="absolute right-3 top-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full",
                "border border-white/15 bg-black/45 backdrop-blur-md",
                "px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white",
              )}
            >
              {CATEGORY_LABEL[example.category]}
            </span>
          </div>

          {/* "coming soon" hint for empty placeholders */}
          {!hasVideo ? (
            <div className="absolute left-3 top-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full",
                  "border border-primary/40 bg-primary/15 backdrop-blur-md",
                  "px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary-light",
                )}
              >
                Coming Soon
              </span>
            </div>
          ) : null}

          {/* hover overlay with metadata */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-end p-5",
              "bg-gradient-to-t from-black/85 via-black/30 to-black/0",
              "opacity-0 transition-opacity duration-300",
              "group-hover:opacity-100 group-focus-within:opacity-100",
            )}
          >
            <div className="text-sm font-medium text-white">{example.title}</div>
            <div className="mt-1 text-xs text-text-muted">{example.client}</div>
            <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {example.views}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5" />
                {example.likes}
              </span>
            </div>
          </div>

          {/* click-to-play button (covers the whole card) */}
          <button
            type="button"
            onClick={handlePlay}
            disabled={!hasVideo}
            aria-label={hasVideo ? `Play ${example.title}` : "Video coming soon"}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl",
              hasVideo ? "cursor-pointer" : "cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                "inline-flex h-14 w-14 items-center justify-center rounded-full",
                "bg-gradient-primary text-white shadow-glow-md",
                "transition-all duration-300 will-change-transform",
                hasVideo
                  ? "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
                  : "opacity-40 scale-90",
              )}
            >
              <Play className="h-5 w-5 translate-x-0.5 fill-white" strokeWidth={0} />
            </span>
          </button>
        </>
      ) : null}
    </div>
  );
}
