"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  range?: number;
  strength?: number;
  max?: number;
  className?: string;
}

export function Magnetic({
  children,
  range = 100,
  strength = 0.25,
  max = 10,
  className,
}: MagneticProps) {
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = wrapperRef.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < range) {
        const falloff = 1 - dist / range;
        let tx = dx * strength * falloff;
        let ty = dy * strength * falloff;
        if (Math.abs(tx) > max) tx = Math.sign(tx) * max;
        if (Math.abs(ty) > max) ty = Math.sign(ty) * max;
        target.current.x = tx;
        target.current.y = ty;
      } else {
        target.current.x = 0;
        target.current.y = 0;
      }
    };

    const handleLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    const tick = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.18;
      c.y += (t.y - c.y) * 0.18;
      el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("blur", handleLeave);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("blur", handleLeave);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      el.style.transform = "";
    };
  }, [range, strength, max, prefersReducedMotion]);

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={{
        display: "inline-block",
        willChange: "transform",
      }}
    >
      {children}
    </span>
  );
}
