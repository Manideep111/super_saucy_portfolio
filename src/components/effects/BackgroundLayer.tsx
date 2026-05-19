"use client";

import { AuroraGlow } from "./AuroraGlow";
import { MouseRipple } from "./MouseRipple";
import { SparkleField } from "./SparkleField";
import { StarfieldBackground } from "./StarfieldBackground";

export function BackgroundLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <AuroraGlow />
      <StarfieldBackground />
      <SparkleField />
      <MouseRipple />
    </div>
  );
}
