"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { useCountUp } from "@/lib/useCountUp";

type Metric = {
  end: number;
  prefix?: string;
  suffix: string;
  label: string;
};

const METRICS: Metric[] = [
  { end: 340, suffix: "%", label: "Engagement increase" },
  { end: 12, suffix: "M+", label: "Views generated" },
  { end: 48, suffix: "hr", label: "Avg. turnaround" },
];

function MetricValue({
  metric,
  active,
}: {
  metric: Metric;
  active: boolean;
}) {
  const value = useCountUp({
    end: metric.end,
    duration: 1500,
    active,
  });
  return (
    <div className="text-gradient font-display text-3xl font-semibold leading-none md:text-4xl">
      {metric.prefix}
      {Math.round(value)}
      {metric.suffix}
    </div>
  );
}

function MetricsRow() {
  const rowRef = useRef<HTMLUListElement | null>(null);
  const inView = useInView(rowRef, { once: true, margin: "-80px" });
  return (
    <ul
      ref={rowRef}
      className="mt-10 grid grid-cols-3 gap-3 md:gap-5"
    >
      {METRICS.map((m) => (
        <li
          key={m.label}
          className={cn(
            "rounded-2xl border border-white/[0.08] bg-surface/40 backdrop-blur-xl",
            "px-4 py-5 md:px-5 md:py-6",
            "transition-colors duration-300 hover:border-primary/40",
          )}
        >
          <MetricValue metric={m} active={inView} />
          <div className="mt-2 text-xs leading-snug text-text-muted md:text-sm">
            {m.label}
          </div>
        </li>
      ))}
    </ul>
  );
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function CaseStudy() {
  return (
    <section id="case-study" className="relative px-6 py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={item}>
            <Pill>CASE STUDY</Pill>
          </motion.div>
          <motion.h2
            variants={item}
            className="text-gradient mt-6 max-w-[24ch] font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            How We Helped [Client] 10x Their Views
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
          className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12"
        >
          {/* LEFT — media */}
          <motion.div variants={item} className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px]"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.32) 0%, rgba(168,85,247,0) 65%)",
                filter: "blur(40px)",
              }}
            />
            <div
              className={cn(
                "group relative aspect-[4/5] w-full overflow-hidden rounded-3xl",
                "border border-white/[0.08] bg-surface/40 backdrop-blur-xl",
                "shadow-glow-md transition-all duration-500",
                "hover:border-primary/40 hover:shadow-glow-lg",
              )}
            >
              <video
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/case-study-poster.jpg"
              >
                <source src="/videos/case-study.mp4" type="video/mp4" />
              </video>

              {/* gradient fallback if no video */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "linear-gradient(135deg, #2a0f3d 0%, #0d0818 50%, #4a1d6a 100%)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/0 to-background/40"
              />

              <div className="absolute left-5 top-5">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full",
                    "border border-white/15 bg-black/40 backdrop-blur-md",
                    "px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white",
                  )}
                >
                  <span className="block h-1.5 w-1.5 rounded-full bg-primary shadow-glow-sm" />
                  Case Study
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — writeup */}
          <motion.div variants={item} className="flex flex-col">
            <span
              className={cn(
                "inline-flex w-fit items-center gap-2 rounded-full",
                "border border-white/[0.08] bg-white/[0.03] px-3 py-1",
                "text-xs font-medium tracking-wide text-text-secondary",
              )}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "linear-gradient(135deg, #a855f7, #c026d3)" }}
              />
              Lumen Studios
            </span>

            <h3 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              From 2k to 200k followers in 90 days.
            </h3>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-text-secondary">
              <p>
                Lumen came to us with a library of beautifully-shot raw footage
                and zero retention. Viewers were dropping off in the first
                eight seconds. We rebuilt their hook framework, recut their
                top-performing concepts, and shipped a steady pipeline of
                short-form anchored to the long-form flagship.
              </p>
              <p>
                Over 90 days we produced 14 long-form hero videos and 86
                shorts, each engineered around a tested first-frame, a
                three-beat hook, and an emotionally-loaded payoff. We treated
                every cut as a hypothesis and iterated on retention curves
                weekly.
              </p>
              <p>
                By the end of the engagement, average watch time more than
                doubled, the channel crossed 200k followers, and the team had
                a repeatable framework they could run with internally.
              </p>
            </div>

            <MetricsRow />


            <div className="mt-10">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Read the full breakdown
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
