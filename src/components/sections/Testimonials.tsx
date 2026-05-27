"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";

type TestimonialImage = {
  src: string;
  alt: string;
};

// Drop the matching files into /public/images/testimonials/.
// See public/images/testimonials/README.md for sizing guidance.
const TESTIMONIAL_IMAGES: TestimonialImage[] = [
  {
    src: "/images/testimonials/testimonial-1.png",
    alt: "Upwork review — Video Editor and Motion Graphic Artist",
  },
  {
    src: "/images/testimonials/testimonial-2.png",
    alt: "Slack thread with client",
  },
  {
    src: "/images/testimonials/testimonial-3.png",
    alt: "WhatsApp client chat — exceptional work",
  },
  {
    src: "/images/testimonials/testimonial-4.png",
    alt: "Upwork reviews — SaaS launch and basketball edits",
  },
];

const AUTO_ADVANCE_MS = 5000;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const headerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Testimonials() {
  const [{ index, direction }, setSlide] = useState({
    index: 0,
    direction: 0,
  });
  const [paused, setPaused] = useState(false);

  const go = useCallback((step: number) => {
    setSlide((prev) => ({
      index:
        (prev.index + step + TESTIMONIAL_IMAGES.length) %
        TESTIMONIAL_IMAGES.length,
      direction: step,
    }));
  }, []);

  const goTo = useCallback((target: number) => {
    setSlide((prev) => ({
      index: target,
      direction: target === prev.index ? 0 : target > prev.index ? 1 : -1,
    }));
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setSlide((prev) => ({
        index: (prev.index + 1) % TESTIMONIAL_IMAGES.length,
        direction: 1,
      }));
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const current = TESTIMONIAL_IMAGES[index];

  return (
    <section
      id="testimonials"
      className="relative px-6 py-16 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={headerItem}>
            <Pill>WHAT CLIENTS SAY</Pill>
          </motion.div>
          <motion.h2
            variants={headerItem}
            className="text-gradient mt-6 max-w-[20ch] font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Results That Speak Louder Than Words
          </motion.h2>
        </motion.div>

        <div
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Slide stage — fixed height, image is object-contain so
              any aspect ratio renders without cropping. */}
          <div
            className={cn(
              "relative mx-auto h-[420px] sm:h-[520px] md:h-[600px] w-full max-w-3xl",
              "overflow-hidden rounded-2xl",
              "border border-white/[0.08] bg-surface/40 backdrop-blur-xl",
            )}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #1a0d33 0%, #0d0818 60%, #2a0f3d 100%)",
              }}
            />

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current.src}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center p-6 md:p-10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-glow-sm"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next arrows */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className={cn(
              "absolute left-2 top-[calc(50%-1.25rem)] z-10 -translate-y-1/2 md:-left-5",
              "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full",
              "border border-white/[0.1] bg-black/50 text-white backdrop-blur-md",
              "transition-all duration-300 hover:border-primary/40 hover:bg-black/70 hover:shadow-glow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className={cn(
              "absolute right-2 top-[calc(50%-1.25rem)] z-10 -translate-y-1/2 md:-right-5",
              "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full",
              "border border-white/[0.1] bg-black/50 text-white backdrop-blur-md",
              "transition-all duration-300 hover:border-primary/40 hover:bg-black/70 hover:shadow-glow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIAL_IMAGES.map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={active}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "w-8 bg-gradient-primary shadow-glow-sm"
                      : "w-2 bg-white/20 hover:bg-white/40",
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
