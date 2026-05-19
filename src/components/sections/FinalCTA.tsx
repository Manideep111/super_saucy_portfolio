"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { SparkleField } from "@/components/effects/SparkleField";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function FinalCTA() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const auroraY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-15%", "15%"],
  );
  const auroraX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-5%", "8%"],
  );

  return (
    <section id="contact" className="relative px-6 py-16 md:py-24 lg:py-32">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/[0.08] bg-surface-elevated"
      >
        {/* deep dark gradient base */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a0612 0%, #140b24 50%, #1a0d33 100%)",
          }}
        />

        {/* parallax aurora corner glow */}
        <motion.div
          aria-hidden
          style={{ y: auroraY, x: auroraX }}
          className="pointer-events-none absolute -right-32 -top-40 h-[700px] w-[700px] will-change-transform"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(168,85,247,0.55) 0%, rgba(168,85,247,0) 65%)",
              filter: "blur(80px)",
            }}
          />
        </motion.div>
        <motion.div
          aria-hidden
          style={{ y: auroraX, x: auroraY }}
          className="pointer-events-none absolute -bottom-40 -left-32 h-[600px] w-[600px] will-change-transform"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(192,38,211,0.4) 0%, rgba(192,38,211,0) 65%)",
              filter: "blur(80px)",
            }}
          />
        </motion.div>

        {/* sparkles inside the CTA card */}
        <SparkleField
          mode="absolute"
          count={16}
          spawnMin={400}
          spawnMax={700}
          sizeMin={8}
          sizeMax={20}
        />

        {/* edge inner glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            boxShadow:
              "inset 0 0 80px rgba(168,85,247,0.18), inset 0 0 1px rgba(192,132,252,0.3)",
          }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="relative flex flex-col items-center px-6 py-20 text-center md:px-12 md:py-28 lg:py-32"
        >
          <motion.h2
            variants={fade}
            className="text-gradient max-w-[20ch] font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
          >
            Let&rsquo;s Make Something Unforgettable
          </motion.h2>
          <motion.p
            variants={fade}
            className="mt-6 max-w-2xl text-base text-text-secondary md:text-lg"
          >
            Book a free 20-minute strategy call. No pitch, just a conversation
            about your vision.
          </motion.p>
          <motion.div variants={fade} className="mt-10">
            <Magnetic range={140} strength={0.3} max={14}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="px-10 hover:shadow-glow-lg"
              >
                Book Your Call
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
