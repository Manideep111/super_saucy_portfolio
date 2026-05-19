"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIsClient } from "@/lib/useIsClient";

interface TextScrambleProps {
  text: string;
  duration?: number;
  className?: string;
  scrambleClassName?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export function TextScramble({
  text,
  duration = 600,
  className,
  scrambleClassName = "text-primary-light",
  as: Tag = "span",
}: TextScrambleProps) {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const [frame, setFrame] = useState<{ char: string; revealed: boolean }[]>(
    () =>
      Array.from(text, (ch) => ({
        char: ch,
        revealed: true,
      })),
  );
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!isClient || prefersReducedMotion) return;

    // Build a per-character reveal time. Whitespace reveals instantly.
    const indices = Array.from(text, (_ch, i) => i);
    const revealableIndices = indices.filter((i) => text[i].trim() !== "");
    const order = [...revealableIndices].sort(() => Math.random() - 0.5);
    const revealTimes = new Array<number>(text.length).fill(0);
    order.forEach((idx, n) => {
      revealTimes[idx] =
        (n / Math.max(1, order.length - 1)) * (duration * 0.85);
    });

    let start = 0;
    const tick = (now: number) => {
      if (start === 0) start = now;
      const elapsed = now - start;
      const next = Array.from(text, (ch, i) => {
        if (ch.trim() === "") return { char: ch, revealed: true };
        if (elapsed >= revealTimes[i]) return { char: ch, revealed: true };
        return { char: randomChar(), revealed: false };
      });
      setFrame(next);
      if (elapsed < duration) {
        rafId.current = requestAnimationFrame(tick);
      }
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [text, duration, isClient, prefersReducedMotion]);

  return (
    <Tag className={className} aria-label={text}>
      {frame.map((f, i) => (
        <span
          key={i}
          aria-hidden={!f.revealed}
          className={f.revealed ? undefined : scrambleClassName}
          style={f.revealed ? undefined : { opacity: 0.85 }}
        >
          {f.char}
        </span>
      ))}
    </Tag>
  );
}
