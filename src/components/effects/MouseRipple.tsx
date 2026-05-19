"use client";

import { useEffect, useRef } from "react";

const SIZE = 400;
const LERP = 0.12;
const FADE_IN = 0.05;
const FADE_OUT = 0.06;

export function MouseRipple() {
  const ref = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: -9999, y: -9999, active: false });
  const current = useRef({ x: -9999, y: -9999, opacity: 0 });
  const initialized = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      target.current.active = true;
      if (!initialized.current) {
        current.current.x = e.clientX;
        current.current.y = e.clientY;
        initialized.current = true;
      }
    };
    const onLeave = () => {
      target.current.active = false;
    };
    const onEnter = () => {
      target.current.active = true;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    window.addEventListener("blur", onLeave);
    window.addEventListener("focus", onEnter);

    const tick = () => {
      const t = target.current;
      const c = current.current;
      c.x += (t.x - c.x) * LERP;
      c.y += (t.y - c.y) * LERP;
      const targetOpacity = t.active ? 1 : 0;
      c.opacity += (targetOpacity - c.opacity) * (t.active ? FADE_IN : FADE_OUT);

      el.style.transform = `translate3d(${c.x - SIZE / 2}px, ${c.y - SIZE / 2}px, 0)`;
      el.style.opacity = String(c.opacity);

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("focus", onEnter);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 1, mixBlendMode: "screen" }}
    >
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at center, rgba(192,132,252,0.55) 0%, rgba(168,85,247,0.35) 30%, rgba(168,85,247,0) 70%)",
          opacity: 0,
          willChange: "transform, opacity",
          transform: "translate3d(-9999px, -9999px, 0)",
        }}
      />
    </div>
  );
}
