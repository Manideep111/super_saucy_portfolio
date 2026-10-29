"use client";

import { useReducedMotion } from "framer-motion";
import { AuroraGlow } from "./AuroraGlow";
import { SparkleField } from "./SparkleField";

export function BackgroundLayer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <AuroraGlow />
      {prefersReducedMotion ? null : <SparkleField />}
    </div>
  );
}
