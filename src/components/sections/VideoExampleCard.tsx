"use client";

import { Eye, Heart, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type Platform = "youtube" | "tiktok" | "instagram";

export type VideoExample = {
  id: string;
  title: string;
  client: string;
  category: "long" | "shorts" | "brand";
  platform: Platform;
  views: string;
  likes: string;
  gradient: string;
  src?: string;
};

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          fill="currentColor"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"
        />
      </svg>
    );
  }
  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          fill="currentColor"
          d="M19.6 6.3a5.4 5.4 0 0 1-3.4-1.2 5.4 5.4 0 0 1-2-3.6h-3.4v13.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V8.7a6.2 6.2 0 1 0 5.4 6.1V9.2a8.8 8.8 0 0 0 5.3 1.8V7.6c-.5 0-1-.4-1.4-.5-.2-.2-.4-.5-.6-.8Z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        d="M3 7.5A4.5 4.5 0 0 1 7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9Zm9 1.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm5-.4a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z"
      />
    </svg>
  );
}

interface Props {
  example: VideoExample;
}

export function VideoExampleCard({ example }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.08]",
        "aspect-square sm:aspect-[4/5] lg:aspect-[9/16]",
        "bg-surface/40 backdrop-blur-xl",
        "transition-all duration-500 ease-out will-change-transform",
        "hover:scale-[1.03] hover:border-primary/40 hover:shadow-glow-md",
        "focus-within:scale-[1.03] focus-within:border-primary/40 focus-within:shadow-glow-md",
      )}
      tabIndex={0}
    >
      {/* gradient thumbnail */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: example.gradient }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] opacity-60"
      />

      {/* lazy-loaded video (only mounts when in view, plays on hover) */}
      {inView && example.src ? (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            hovered ? "opacity-100" : "opacity-0",
          )}
          muted
          loop
          playsInline
          preload="metadata"
          src={example.src}
        />
      ) : null}

      {/* bottom darkening for legibility */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/30"
      />

      {/* platform badge */}
      <div className="absolute right-3 top-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full",
            "border border-white/15 bg-black/45 backdrop-blur-md",
            "px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white",
          )}
        >
          <PlatformIcon platform={example.platform} />
          {example.platform === "youtube"
            ? "YouTube"
            : example.platform === "tiktok"
              ? "TikTok"
              : "IG"}
        </span>
      </div>

      {/* hover overlay */}
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

      {/* center play icon on hover */}
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "inline-flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-primary text-white shadow-glow-md",
          "opacity-0 transition-all duration-300",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          "scale-90 group-hover:scale-100 group-focus-within:scale-100",
        )}
      >
        <Play className="h-5 w-5 translate-x-0.5 fill-white" strokeWidth={0} />
      </div>
    </div>
  );
}
