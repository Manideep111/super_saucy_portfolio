"use client";

import { motion } from "framer-motion";
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
    alt: "Client testimonial 1",
  },
  {
    src: "/images/testimonials/testimonial-2.png",
    alt: "Client testimonial 2",
  },
  {
    src: "/images/testimonials/testimonial-3.png",
    alt: "Client testimonial 3",
  },
];

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Testimonials() {
  return (
    <section id="testimonials" className="relative px-6 py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={item}>
            <Pill>WHAT CLIENTS SAY</Pill>
          </motion.div>
          <motion.h2
            variants={item}
            className="text-gradient mt-6 max-w-[20ch] font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Results That Speak Louder Than Words
          </motion.h2>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TESTIMONIAL_IMAGES.map((t) => (
            <motion.li key={t.src} variants={item}>
              <figure
                className={cn(
                  "group relative h-full overflow-hidden rounded-2xl",
                  "border border-white/[0.08] bg-surface/40 backdrop-blur-xl",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-sm",
                )}
              >
                {/* Gradient placeholder so the card still looks themed if
                    the image is missing during development. */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a0d33 0%, #0d0818 60%, #2a0f3d 100%)",
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.src}
                  alt={t.alt}
                  loading="lazy"
                  className="relative block aspect-[4/5] w-full object-cover"
                />
              </figure>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
