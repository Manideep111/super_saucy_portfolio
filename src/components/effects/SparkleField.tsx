"use client";

import { useEffect, useState } from "react";

type Sparkle = {
  id: number;
  top: string;
  left: string;
  size: number;
  color: string;
  shape: "star" | "plus";
  duration: number;
};

const MAX_SPARKLES = 10;
const SPAWN_MIN = 500;
const SPAWN_MAX = 800;
const PURPLE = "#c084fc";
const WHITE = "#ffffff";

function makeSparkle(id: number): Sparkle {
  return {
    id,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 10 + Math.random() * 16,
    color: Math.random() < 0.55 ? PURPLE : WHITE,
    shape: Math.random() < 0.5 ? "star" : "plus",
    duration: 2.6 + Math.random() * 0.8,
  };
}

function SparkleSvg({ shape, color }: { shape: Sparkle["shape"]; color: string }) {
  if (shape === "plus") {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%" aria-hidden>
        <path
          d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
          fill={color}
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%" aria-hidden>
      <path
        d="M12 1 L13.6 9.4 L22 12 L13.6 14.6 L12 23 L10.4 14.6 L2 12 L10.4 9.4 Z M12 6 L11 11 L6 12 L11 13 L12 18 L13 13 L18 12 L13 11 Z"
        fill={color}
      />
    </svg>
  );
}

export function SparkleField() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let nextId = 0;
    setSparkles(Array.from({ length: MAX_SPARKLES }, () => makeSparkle(nextId++)));

    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN);
      timeoutId = setTimeout(() => {
        setSparkles((prev) => {
          if (prev.length === 0) return prev;
          // replace the oldest sparkle
          const [, ...rest] = prev;
          return [...rest, makeSparkle(nextId++)];
        });
        schedule();
      }, delay);
    };
    schedule();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <style>{`
        @keyframes sparkleLife {
          0%   { opacity: 0; transform: translateZ(0) scale(0.4) rotate(0deg); }
          25%  { opacity: 1; transform: translateZ(0) scale(1)   rotate(60deg); }
          75%  { opacity: 1; transform: translateZ(0) scale(1.1) rotate(140deg); }
          100% { opacity: 0; transform: translateZ(0) scale(0.6) rotate(180deg); }
        }
      `}</style>
      {sparkles.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            marginTop: `-${s.size / 2}px`,
            marginLeft: `-${s.size / 2}px`,
            willChange: "transform, opacity",
            animation: `sparkleLife ${s.duration}s ease-in-out forwards`,
            filter: s.color === PURPLE ? "drop-shadow(0 0 4px #a855f7)" : "drop-shadow(0 0 3px #ffffff)",
          }}
        >
          <SparkleSvg shape={s.shape} color={s.color} />
        </span>
      ))}
    </div>
  );
}
