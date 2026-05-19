"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";

const FAQS: { q: string; a: string }[] = [
  {
    q: "What types of videos do you edit?",
    a: "Long-form YouTube, short-form (TikTok / Reels / Shorts), brand films, course content, podcast highlight reels, and motion-design-heavy launch videos. If it's about telling a story with footage, it's in scope.",
  },
  {
    q: "How long does a typical project take?",
    a: "Most short-form deliverables turn around in 48 hours. A standard long-form edit lands in 4–6 days. Hero brand pieces with custom motion design run 2–3 weeks depending on scope.",
  },
  {
    q: "Do I need to provide raw footage?",
    a: "Yes — but we'll guide you on what we need. Most clients upload to a shared Frame.io or Dropbox; we organize, transcribe, and tag everything before we start cutting so nothing gets lost.",
  },
  {
    q: "What's your pricing structure?",
    a: "Project-based for one-offs and monthly retainers for ongoing work. Retainers start at a fixed number of deliverables per month with priority turnaround. Full breakdown happens on the call.",
  },
  {
    q: "How many revisions are included?",
    a: "Two structural revision rounds and unlimited small tweaks (color, copy, swaps) on every project. We'd rather get it right than gatekeep changes.",
  },
  {
    q: "Can you handle ongoing monthly work?",
    a: "That's what we do best. Most clients are on a monthly retainer with predictable output: a hero long-form, a batch of shorts, and the supporting assets. We act like an embedded edit team.",
  },
  {
    q: "Do you offer a satisfaction guarantee?",
    a: "Yes. If your first deliverable doesn't meet the brief after the included revisions, you don't pay for it. We'd rather earn the relationship than hold an invoice.",
  },
];

const headerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section
      id="faq"
      className="relative px-6 py-16 md:py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        {/* LEFT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col items-start"
        >
          <motion.div variants={headerItem}>
            <Pill>FAQ</Pill>
          </motion.div>
          <motion.h2
            variants={headerItem}
            className="text-gradient mt-6 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Questions, Answered
          </motion.h2>
          <motion.p
            variants={headerItem}
            className="mt-5 max-w-md text-base text-text-secondary md:text-lg"
          >
            Everything you need to know before we hop on a call.
          </motion.p>
          <motion.div variants={headerItem} className="mt-8">
            <Magnetic>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowUpRight className="h-4 w-4" />}
              >
                Get in Touch
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* RIGHT — accordion */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="flex flex-col gap-3"
        >
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            const panelId = `${baseId}-faq-${i}`;
            return (
              <motion.li
                key={faq.q}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1] as const,
                    },
                  },
                }}
              >
                <div
                  className={cn(
                    "rounded-xl border bg-surface/40 backdrop-blur-xl",
                    "transition-colors duration-300",
                    open
                      ? "border-primary/40 shadow-glow-sm"
                      : "border-white/[0.08] hover:border-primary/30",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl",
                      "px-5 py-4 text-left md:px-6 md:py-5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    )}
                  >
                    <span className="text-sm font-medium text-white md:text-base">
                      {faq.q}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        "border transition-all duration-300",
                        open
                          ? "border-primary/50 bg-primary/15 text-white rotate-45"
                          : "border-white/[0.1] text-text-secondary",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        key="panel"
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.22 },
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-text-secondary md:px-6 md:pb-6 md:text-base">
                          {faq.a}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
