"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  CirclePlay,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Film,
  Globe,
  LoaderCircle,
  Mail,
  Radar,
  Search,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  NICHE_SUGGESTIONS,
  REGIONS,
  SUBSCRIBER_RANGES,
  UPLOAD_WINDOWS,
  type ChannelLead,
  type LeadsError,
  type LeadsResponse,
} from "@/lib/leads/filters";

type SortKey = "relevance" | "subscribers" | "recent" | "views";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "subscribers", label: "Most subscribers" },
  { id: "recent", label: "Latest upload" },
  { id: "views", label: "Most views" },
];

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function timeAgo(iso: string | null) {
  if (!iso) return "Unknown";
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Infinity, "year"],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let value = seconds;
  for (const [size, unit] of steps) {
    if (Math.abs(value) < size) return rtf.format(-Math.round(value), unit);
    value /= size;
  }
  return "Unknown";
}

function flag(code: string | null) {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)),
  );
}

function toCsv(leads: ChannelLead[]) {
  const header = [
    "Channel",
    "Handle",
    "URL",
    "Subscribers",
    "Total views",
    "Videos",
    "Country",
    "Last upload",
    "Latest video",
    "Emails",
    "Links",
  ];
  const escape = (v: string | number | null) =>
    `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = leads.map((l) =>
    [
      l.title,
      l.handle,
      l.url,
      l.subscribers,
      l.views,
      l.videos,
      l.country,
      l.lastUploadAt,
      l.lastVideoUrl,
      l.emails.join(" "),
      l.links.join(" "),
    ]
      .map(escape)
      .join(","),
  );
  return [header.map(escape).join(","), ...rows].join("\n");
}

export function LeadScraper() {
  const [niche, setNiche] = useState("");
  const [subs, setSubs] = useState("any");
  const [upload, setUpload] = useState("1w");
  const [region, setRegion] = useState("any");

  const [leads, setLeads] = useState<ChannelLead[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [scanned, setScanned] = useState(0);
  const [loading, setLoading] = useState<"search" | "more" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [emailsOnly, setEmailsOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  async function run(pageToken?: string) {
    if (!niche.trim()) {
      setError("Enter a niche to search for.");
      return;
    }
    setLoading(pageToken ? "more" : "search");
    setError(null);

    const query = new URLSearchParams({ niche: niche.trim(), subs, upload, region });
    if (pageToken) query.set("pageToken", pageToken);

    try {
      const res = await fetch(`/api/leads?${query}`);
      const data = (await res.json()) as LeadsResponse | LeadsError;
      if ("error" in data) throw new Error(data.error);

      if (pageToken) {
        setLeads((prev) => {
          const known = new Set(prev.map((l) => l.id));
          return [...prev, ...data.leads.filter((l) => !known.has(l.id))];
        });
        setScanned((s) => s + data.scanned);
      } else {
        setLeads(data.leads);
        setScanned(data.scanned);
      }
      setNextPageToken(data.nextPageToken);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setLoading(null);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    run();
  }

  const visible = useMemo(() => {
    const list = emailsOnly ? leads.filter((l) => l.emails.length) : [...leads];
    if (sort === "subscribers") {
      list.sort((a, b) => (b.subscribers ?? -1) - (a.subscribers ?? -1));
    } else if (sort === "views") {
      list.sort((a, b) => b.views - a.views);
    } else if (sort === "recent") {
      list.sort(
        (a, b) =>
          new Date(b.lastUploadAt ?? 0).getTime() -
          new Date(a.lastUploadAt ?? 0).getTime(),
      );
    }
    return list;
  }, [leads, sort, emailsOnly]);

  const emailCount = leads.filter((l) => l.emails.length).length;

  function exportCsv() {
    const blob = new Blob([toCsv(visible)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `youtube-leads-${niche.trim().replace(/\s+/g, "-").toLowerCase() || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyEmails() {
    const emails = [...new Set(visible.flatMap((l) => l.emails))];
    await navigator.clipboard.writeText(emails.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative min-h-screen flex-1 bg-lilac-50 text-ink [color-scheme:light]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,var(--color-lilac-200),transparent_70%)]"
      />

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <header className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lilac-200 bg-white/70 px-3 py-1 text-xs font-medium text-lilac-700">
            <Radar className="size-3.5" />
            YouTube lead finder
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Lead Scraper
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            Find YouTube channels in any niche, filtered by size, how recently
            they uploaded, and where they are. Export the list or grab contact
            emails straight from channel bios.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-lilac-200 bg-white p-5 shadow-[0_10px_40px_-12px_rgba(125,95,220,0.25)] sm:p-7"
        >
          <div className="grid gap-7 lg:grid-cols-2">
            <Field icon={<Search className="size-4" />} label="Niche">
              <input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. personal finance, home workouts, AI tools"
                className="w-full rounded-xl border border-lilac-200 bg-lilac-50 px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-lilac-400 focus:bg-white focus:ring-4 focus:ring-lilac-200/60"
              />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {NICHE_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNiche(s)}
                    className="rounded-full bg-lilac-100 px-2.5 py-1 text-xs text-lilac-700 transition hover:bg-lilac-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            <Field icon={<Globe className="size-4" />} label="Region">
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-lilac-200 bg-lilac-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-lilac-400 focus:bg-white focus:ring-4 focus:ring-lilac-200/60"
                >
                  {REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.code === "any" ? "🌍" : flag(r.code)} {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-lilac-600" />
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Biases search toward the region and drops channels registered
                in a different country.
              </p>
            </Field>

            <Field icon={<Users className="size-4" />} label="Channel subscribers">
              <ChipGroup
                options={SUBSCRIBER_RANGES.map((r) => ({ id: r.id, label: r.label }))}
                value={subs}
                onChange={setSubs}
              />
            </Field>

            <Field icon={<Clock className="size-4" />} label="Last uploaded video">
              <ChipGroup
                options={UPLOAD_WINDOWS.map((w) => ({ id: w.id, label: w.label }))}
                value={upload}
                onChange={setUpload}
                tone="mint"
              />
            </Field>
          </div>

          <div className="mt-7 flex flex-col-reverse items-stretch gap-3 border-t border-lilac-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-soft">
              Each search uses up to ~450 units of your 10,000/day YouTube API
              quota.
            </p>
            <button
              type="submit"
              disabled={loading !== null}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-lilac-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(125,95,220,0.7)] transition hover:bg-lilac-600 disabled:opacity-60"
            >
              {loading === "search" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              {loading === "search" ? "Scraping…" : "Find channels"}
            </button>
          </div>
        </form>

        {error ? (
          <div className="mt-6 rounded-2xl border border-peach-deep/20 bg-peach px-5 py-4 text-sm text-peach-deep">
            {error}
          </div>
        ) : null}

        {loading === "search" ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-lilac-100 bg-white"
              />
            ))}
          </div>
        ) : searched ? (
          <section className="mt-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {visible.length} channel{visible.length === 1 ? "" : "s"}
                </h2>
                <p className="text-xs text-ink-soft">
                  {scanned} scanned · {emailCount} with a public email
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-lilac-200 bg-white px-3 py-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={emailsOnly}
                    onChange={(e) => setEmailsOnly(e.target.checked)}
                    className="accent-lilac-500"
                  />
                  Has email
                </label>
                <label className="relative inline-flex items-center gap-2 rounded-xl border border-lilac-200 bg-white px-3 py-2 text-xs font-medium">
                  <ArrowUpDown className="size-3.5 text-lilac-600" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="bg-transparent outline-none"
                  >
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <ToolbarButton onClick={copyEmails} disabled={!emailCount}>
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy emails"}
                </ToolbarButton>
                <ToolbarButton onClick={exportCsv} disabled={!visible.length}>
                  <Download className="size-3.5" />
                  Export CSV
                </ToolbarButton>
              </div>
            </div>

            {visible.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {visible.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-lilac-300 bg-white/60 px-6 py-12 text-center text-sm text-ink-soft">
                No channels matched these filters on this pass.
                {nextPageToken
                  ? " Try scanning further, or loosen the subscriber or upload filters."
                  : " Try loosening the subscriber or upload filters."}
              </div>
            )}

            {nextPageToken ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => run(nextPageToken)}
                  disabled={loading !== null}
                  className="inline-flex items-center gap-2 rounded-xl border border-lilac-300 bg-white px-5 py-2.5 text-sm font-medium text-lilac-700 transition hover:bg-lilac-100 disabled:opacity-60"
                >
                  {loading === "more" ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : null}
                  {loading === "more" ? "Scanning…" : "Scan more channels"}
                </button>
              </div>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <span className="grid size-7 place-items-center rounded-lg bg-lilac-100 text-lilac-600">
          {icon}
        </span>
        {label}
      </div>
      {children}
    </div>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
  tone = "lilac",
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  tone?: "lilac" | "mint";
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-xl border px-3.5 py-2 text-sm transition",
              active
                ? tone === "mint"
                  ? "border-mint-deep/30 bg-mint font-medium text-mint-deep"
                  : "border-lilac-400 bg-lilac-300 font-medium text-lilac-700"
                : "border-lilac-200 bg-white text-ink-soft hover:border-lilac-300 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ToolbarButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-xl border border-lilac-200 bg-white px-3 py-2 text-xs font-medium transition hover:border-lilac-300 hover:bg-lilac-100 disabled:opacity-50 disabled:hover:bg-white"
      {...props}
    >
      {children}
    </button>
  );
}

function LeadCard({ lead }: { lead: ChannelLead }) {
  return (
    <article className="flex flex-col rounded-2xl border border-lilac-100 bg-white p-5 transition hover:border-lilac-300 hover:shadow-[0_10px_30px_-14px_rgba(125,95,220,0.45)]">
      <div className="flex items-start gap-4">
        {lead.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lead.thumbnail}
            alt=""
            referrerPolicy="no-referrer"
            className="size-14 shrink-0 rounded-full border-2 border-lilac-200 object-cover"
          />
        ) : (
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-lilac-200 font-display text-lg font-semibold text-lilac-700">
            {lead.title.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <a
            href={lead.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex max-w-full items-center gap-1.5 font-semibold hover:text-lilac-600"
          >
            <span className="truncate">{lead.title}</span>
            <ExternalLink className="size-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
          </a>
          <p className="truncate text-xs text-ink-soft">
            {lead.handle ?? "No handle"}
            {lead.country ? ` · ${flag(lead.country)} ${lead.country}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Stat className="bg-lilac-100 text-lilac-700" icon={<Users className="size-3.5" />}>
          {lead.subscribers === null ? "Hidden" : compact.format(lead.subscribers)} subs
        </Stat>
        <Stat className="bg-mint text-mint-deep" icon={<Clock className="size-3.5" />}>
          {timeAgo(lead.lastUploadAt)}
        </Stat>
        <Stat className="bg-lilac-50 text-ink-soft" icon={<Film className="size-3.5" />}>
          {compact.format(lead.videos)} videos
        </Stat>
        <Stat className="bg-lilac-50 text-ink-soft" icon={<Eye className="size-3.5" />}>
          {compact.format(lead.views)} views
        </Stat>
      </div>

      {lead.description ? (
        <p className="mt-4 line-clamp-2 text-sm text-ink-soft">{lead.description}</p>
      ) : null}

      <div className="mt-auto space-y-2 pt-4">
        {lead.lastVideoUrl ? (
          <a
            href={lead.lastVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-ink-soft hover:text-lilac-600"
          >
            <CirclePlay className="size-3.5 shrink-0 text-lilac-500" />
            <span className="truncate">{lead.lastVideoTitle}</span>
          </a>
        ) : null}
        {lead.emails.length ? (
          <div className="flex flex-wrap gap-1.5">
            {lead.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-peach px-2.5 py-1 text-xs font-medium text-peach-deep hover:brightness-95"
              >
                <Mail className="size-3.5" />
                {email}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function Stat({
  icon,
  className,
  children,
}: {
  icon: ReactNode;
  className: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium", className)}>
      {icon}
      {children}
    </span>
  );
}
