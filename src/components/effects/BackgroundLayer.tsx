"use client";

import { AuroraGlow } from "./AuroraGlow";

export function BackgroundLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <AuroraGlow />
    </div>
  );
}
