"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: number;
  active?: boolean;
}

// Cubic ease-out
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp({
  end,
  duration = 1500,
  start = 0,
  active = true,
}: UseCountUpOptions) {
  const [value, setValue] = useState(active ? start : end);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      setValue(start + (end - start) * eased);
      if (t < 1) {
        rafId.current = requestAnimationFrame(tick);
      }
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [active, end, start, duration]);

  return value;
}
