"use client";

import { motion } from "framer-motion";
import { Pill } from "@/components/ui/Pill";
import { SparkleField } from "@/components/effects/SparkleField";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroOffer() {
  return (
    <section
      id="hero"
      className="relative isolate flex flex-col items-center px-6 pt-32 pb-16 md:pt-44 md:pb-24 lg:pt-48 lg:pb-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-32 mx-auto h-[420px] max-w-3xl"
      >
        <SparkleField
          mode="absolute"
          count={14}
          spawnMin={300}
          spawnMax={550}
          sizeMin={6}
          sizeMax={18}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center text-center"
      >
        <motion.div variants={item}>
          <Pill>VIDEO EDITING FOR CREATORS</Pill>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-gradient mt-7 max-w-[20ch] font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          Raw footage <span className="text-primary-light">&rarr;</span> Scroll
          stopping visuals that drive results
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-2xl text-base text-text-secondary md:text-lg"
        >
          Premium video editing for creators, founders, and agencies who want
          to stop losing viewers in the first 3 seconds.
        </motion.p>
      </motion.div>
    </section>
  );
}
