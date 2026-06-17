"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export type Category = "long" | "vsl" | "shorts" | "brand";

export type VideoExample = {
  id: string;
  category: Category;
  /** YouTube video ID (the part after `v=` in the URL). Leave "" for placeholder. */
  youtubeId: string;
  gradient: string;
};

const CATEGORY_LABEL: Record<Category, string> = {
  long: "Long-form",
  vsl: "VSL",
  shorts: "Short-Form",
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
        !playing && "hover:border-primary/40 hover:shadow-glow-md",
        !playing && "focus-within:border-primary/40 focus-within:shadow-glow-md",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: example.gradient }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] opacity-60"
      />

      {thumbnail && !playing ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt={`${CATEGORY_LABEL[example.category]} thumbnail`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${example.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={CATEGORY_LABEL[example.category]}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : null}

      {!playing ? (
        <>
          <div className="absolute right-3 top-3 z-10">
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

          {!hasVideo ? (
            <div className="absolute left-3 top-3 z-10">
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

          <button
            type="button"
            onClick={handlePlay}
            disabled={!hasVideo}
            aria-label={hasVideo ? "Play video" : "Video coming soon"}
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center rounded-2xl",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              hasVideo ? "cursor-pointer" : "cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                "inline-flex h-16 w-16 items-center justify-center rounded-full",
                "bg-gradient-primary text-white shadow-glow-md",
                "transition-transform duration-300 will-change-transform",
                hasVideo
                  ? "scale-95 group-hover:scale-100 group-focus-within:scale-100"
                  : "scale-90 opacity-40",
              )}
            >
              <Play className="h-6 w-6 translate-x-0.5 fill-white" strokeWidth={0} />
            </span>
          </button>
        </>
      ) : null}
    </div>
  );
}
