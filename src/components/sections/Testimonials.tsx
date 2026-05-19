"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatarFrom: string;
  avatarTo: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Working with Lumen transformed our content strategy. Our engagement is up 340% in just two months.",
    name: "Sarah Chen",
    role: "Founder @ Lumen Studios",
    avatarFrom: "#a855f7",
    avatarTo: "#c026d3",
  },
  {
    quote:
      "Every cut feels intentional. Retention on our YouTube long-forms went from 32% to 58% — the editing did that.",
    name: "Marcus Holloway",
    role: "Creator @ Holloway Daily",
    avatarFrom: "#c084fc",
    avatarTo: "#7c3aed",
  },
  {
    quote:
      "We were drowning in raw footage. Now we ship one polished hero video a week and three shorts. Game changer.",
    name: "Priya Raman",
    role: "Head of Content @ Atlas Agency",
    avatarFrom: "#7c3aed",
    avatarTo: "#c026d3",
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
          {TESTIMONIALS.map((t) => (
            <motion.li key={t.name} variants={item}>
              <Card interactive className="h-full p-6 md:p-7">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <blockquote className="mt-5 text-base leading-relaxed text-text-primary">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-7 flex items-center gap-3">
                  <span
                    className="inline-block h-10 w-10 shrink-0 rounded-full ring-1 ring-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${t.avatarFrom} 0%, ${t.avatarTo} 100%)`,
                    }}
                    aria-hidden
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {t.name}
                    </span>
                    <span className="text-xs text-text-muted">{t.role}</span>
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
