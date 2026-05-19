"use client";

import { motion } from "framer-motion";

type Orb = {
  color: string;
  size: number;
  opacity: number;
  blur: number;
  // figure-8 path (translate offsets relative to anchor, in px)
  path: { x: number[]; y: number[] };
  duration: number;
  anchor: { top: string; left: string };
};

const ORBS: Orb[] = [
  {
    color: "#a855f7",
    size: 820,
    opacity: 0.42,
    blur: 120,
    duration: 26,
    anchor: { top: "10%", left: "15%" },
    path: {
      x: [0, 140, 0, -140, 0],
      y: [0, -90, -160, -90, 0],
    },
  },
  {
    color: "#c026d3",
    size: 720,
    opacity: 0.35,
    blur: 110,
    duration: 30,
    anchor: { top: "55%", left: "70%" },
    path: {
      x: [0, -160, 0, 160, 0],
      y: [0, 120, 0, -120, 0],
    },
  },
  {
    color: "#5b21b6",
    size: 880,
    opacity: 0.45,
    blur: 130,
    duration: 22,
    anchor: { top: "70%", left: "20%" },
    path: {
      x: [0, 120, 200, 80, 0],
      y: [0, -80, 60, 140, 0],
    },
  },
];

export function AuroraGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0 }}
          animate={{ x: orb.path.x, y: orb.path.y }}
          transition={{
            duration: orb.duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            position: "absolute",
            top: orb.anchor.top,
            left: orb.anchor.left,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            marginTop: `-${orb.size / 2}px`,
            marginLeft: `-${orb.size / 2}px`,
            borderRadius: "9999px",
            background: `radial-gradient(circle at center, ${orb.color} 0%, ${orb.color}00 65%)`,
            opacity: orb.opacity,
            filter: `blur(${orb.blur}px)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
