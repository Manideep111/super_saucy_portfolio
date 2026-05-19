"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left"
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(90deg, #a855f7 0%, #c084fc 50%, #c026d3 100%)",
          boxShadow: "0 0 12px rgba(168,85,247,0.7)",
        }}
      />
    </motion.div>
  );
}
