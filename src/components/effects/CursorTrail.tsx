"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, type RefObject } from "react";

interface CursorTrailProps {
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
  particleCount?: number;
  spawnEvery?: number;
}

type Particle = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
};

const COLORS = ["#c084fc", "#a855f7", "#e9d5ff"];

export function CursorTrail({
  containerRef,
  enabled = true,
  particleCount = 30,
  spawnEvery = 30,
}: CursorTrailProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;
    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer) return;

    const particles: Particle[] = [];
    let mouse: { x: number; y: number } | null = null;
    let lastSpawn = 0;
    let rafId: number | null = null;

    const onEnter = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouse = null;
    };

    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    const spawn = () => {
      if (!mouse) return;
      if (particles.length >= particleCount) {
        const recycled = particles.shift();
        if (recycled) {
          recycled.el.remove();
        }
      }
      const el = document.createElement("span");
      const size = 4 + Math.random() * 6;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.cssText = `
        position:absolute;
        left:0; top:0;
        width:${size}px; height:${size}px;
        border-radius:9999px;
        background:radial-gradient(circle at center, ${color}, ${color}00 70%);
        pointer-events:none;
        will-change:transform,opacity;
        mix-blend-mode:screen;
      `;
      layer.appendChild(el);
      particles.push({
        el,
        x: mouse.x + (Math.random() - 0.5) * 6,
        y: mouse.y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.2,
        life: 0,
        ttl: 700 + Math.random() * 500,
        size,
      });
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;

      if (mouse && now - lastSpawn > spawnEvery) {
        spawn();
        lastSpawn = now;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;
        const t = p.life / p.ttl;
        if (t >= 1) {
          p.el.remove();
          particles.splice(i, 1);
          continue;
        }
        const opacity = Math.sin((1 - t) * Math.PI);
        const scale = 0.6 + (1 - t) * 0.7;
        p.el.style.transform = `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0) scale(${scale})`;
        p.el.style.opacity = String(opacity);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
      particles.forEach((p) => p.el.remove());
    };
  }, [containerRef, enabled, particleCount, spawnEvery, prefersReducedMotion]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 2 }}
    />
  );
}
