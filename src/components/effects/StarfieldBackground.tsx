"use client";

import { useMemo } from "react";
import { useIsClient } from "@/lib/useIsClient";

type Star = {
  id: number;
  top: string;
  left: string;
  size: number;
  purple: boolean;
  glow: boolean;
  duration: number;
  delay: number;
  minOpacity: number;
};

const STAR_COUNT = 175;

function generateStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, id) => {
    const roll = Math.random();
    // 60% tiny, 30% small, 10% medium
    const size = roll < 0.6 ? 1 : roll < 0.9 ? 2 : 3;
    return {
      id,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size,
      glow: size === 3,
      purple: Math.random() < 0.18,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 4,
      minOpacity: 0.3 + Math.random() * 0.2,
    };
  });
}

export function StarfieldBackground() {
  const isClient = useIsClient();
  const stars = useMemo(() => (isClient ? generateStars() : []), [isClient]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--star-min, 0.3); transform: translateZ(0) scale(0.95); }
          50%      { opacity: 1;                    transform: translateZ(0) scale(1); }
        }
      `}</style>
      {stars.map((s) => {
        const color = s.purple ? "#c084fc" : "#ffffff";
        return (
          <span
            key={s.id}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: "9999px",
              backgroundColor: color,
              boxShadow: s.glow ? `0 0 6px ${color}` : undefined,
              willChange: "transform, opacity",
              animation: `starTwinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              ["--star-min" as never]: s.minOpacity,
            }}
          />
        );
      })}
    </div>
  );
}
