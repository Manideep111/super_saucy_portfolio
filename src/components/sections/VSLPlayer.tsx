"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { CursorTrail } from "@/components/effects/CursorTrail";
import { cn } from "@/lib/cn";

// Replace with your YouTube video ID (the part after `v=` in the URL).
// Leave empty to keep the placeholder poster.
const VSL_YOUTUBE_ID = "";

export function VSLPlayer() {
  const [playing, setPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const hasVideo = VSL_YOUTUBE_ID.trim().length > 0;
  const handlePlay = () => {
    if (hasVideo) setPlaying(true);
  };

  return (
    <section id="vsl" className="relative flex justify-center px-6 pb-16 md:pb-24 lg:pb-32">
      <style>{`
        @keyframes vslBorderPulse {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(168,85,247,0.45),
              0 0 40px rgba(168,85,247,0.35),
              0 0 90px rgba(168,85,247,0.18);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(192,132,252,0.7),
              0 0 70px rgba(168,85,247,0.55),
              0 0 140px rgba(192,132,252,0.3);
          }
        }
        @keyframes vslRingPulse {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.7; }
          70%  { transform: translate(-50%, -50%) scale(1.6); opacity: 0;   }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0;   }
        }
        .vsl-card { animation: vslBorderPulse 4.5s ease-in-out infinite; }
        .vsl-card:hover:not(.vsl-playing) {
          transform: scale(1.01);
          animation-duration: 2.4s;
        }
        .vsl-card:hover:not(.vsl-playing) .vsl-play { transform: translate(-50%, -50%) scale(1.08); }
        .vsl-ring { animation: vslRingPulse 2.2s ease-out infinite; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[1000px]"
      >
        {/* underglow reflection */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 h-40 w-[85%] rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(168,85,247,0.45) 0%, rgba(168,85,247,0) 70%)",
            filter: "blur(40px)",
          }}
        />

        <div
          ref={cardRef}
          className={cn(
            "vsl-card group relative aspect-video w-full overflow-hidden rounded-3xl",
            "bg-gradient-to-br from-[#1a0d33] via-[#0d0818] to-[#2a0f3d]",
            "transition-transform duration-500 ease-out will-change-transform",
            playing && "vsl-playing",
          )}
        >
          <CursorTrail containerRef={cardRef} enabled={!playing} />

          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${VSL_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title="Video sales letter"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              {/* poster fallback gradient & subtle pattern */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.35) 0%, rgba(168,85,247,0) 55%), radial-gradient(circle at 75% 70%, rgba(192,38,211,0.3) 0%, rgba(192,38,211,0) 55%)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]"
              />
              <button
                type="button"
                onClick={handlePlay}
                aria-label={hasVideo ? "Play video" : "Video coming soon"}
                disabled={!hasVideo}
                className={cn(
                  "absolute inset-0 flex items-center justify-center focus-visible:outline-none",
                  hasVideo ? "cursor-pointer" : "cursor-not-allowed",
                )}
              >
                <span aria-hidden className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full">
                  <span
                    className="vsl-ring absolute left-1/2 top-1/2 block h-20 w-20 rounded-full"
                    style={{ border: "2px solid rgba(192,132,252,0.6)" }}
                  />
                  <span
                    className="vsl-ring absolute left-1/2 top-1/2 block h-20 w-20 rounded-full"
                    style={{ border: "2px solid rgba(192,132,252,0.45)", animationDelay: "0.9s" }}
                  />
                </span>
                <span
                  className={cn(
                    "vsl-play relative inline-flex h-20 w-20 items-center justify-center rounded-full",
                    "bg-gradient-primary text-white shadow-glow-md",
                    "transition-transform duration-500 ease-out will-change-transform",
                  )}
                  style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                >
                  <Play className="h-7 w-7 translate-x-0.5 fill-white" strokeWidth={0} />
                </span>
                {!hasVideo ? (
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/45 backdrop-blur-md px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-text-secondary">
                    Drop your YouTube ID in VSLPlayer.tsx
                  </span>
                ) : null}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
