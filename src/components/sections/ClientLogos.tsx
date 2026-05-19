"use client";

import { cn } from "@/lib/cn";

const LOGOS = [
  "Lumen",
  "Atlas",
  "Halo",
  "Northwind",
  "Holloway",
  "Pinecast",
  "Tempo",
  "Orbit",
  "Verge",
  "Saturn Labs",
];

function Logo({ name }: { name: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap",
        "font-display text-lg font-semibold tracking-tight",
        "text-text-secondary/80 hover:text-white",
        "transition-colors duration-300",
      )}
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: "linear-gradient(135deg, #a855f7, #c026d3)" }}
      />
      {name}
    </span>
  );
}

export function ClientLogos() {
  return (
    <section
      aria-label="Clients and publications"
      className="relative px-6 py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-text-muted">
          As seen in / Clients include
        </p>

        <div className="group relative overflow-hidden">
          {/* edge fades */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
          />

          <style>{`
            @keyframes clientMarquee {
              from { transform: translate3d(0, 0, 0); }
              to   { transform: translate3d(-50%, 0, 0); }
            }
            .client-track { animation: clientMarquee 40s linear infinite; }
            .group:hover .client-track { animation-play-state: paused; }
            @media (prefers-reduced-motion: reduce) {
              .client-track { animation: none; }
            }
          `}</style>

          <div className="client-track flex w-max items-center gap-12 will-change-transform md:gap-16">
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <Logo key={`${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
