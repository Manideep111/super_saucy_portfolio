"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import {
  VideoExampleCard,
  type VideoExample,
} from "./VideoExampleCard";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "long", label: "Long-form" },
  { id: "shorts", label: "Shorts" },
  { id: "brand", label: "Brand" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

// Six gradient combos cycled across cards for visual variety while
// thumbnails are missing. Once a real youtubeId is set, the YT
// thumbnail covers the gradient.
const GRADIENTS = [
  "linear-gradient(135deg, #2a0f3d 0%, #6b21a8 50%, #c026d3 100%)",
  "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #db2777 100%)",
  "linear-gradient(135deg, #0c0a18 0%, #312e81 50%, #a855f7 100%)",
  "linear-gradient(135deg, #4a044e 0%, #7c3aed 50%, #f0abfc 100%)",
  "linear-gradient(135deg, #082f49 0%, #6b21a8 50%, #c026d3 100%)",
  "linear-gradient(135deg, #1a0d33 0%, #831843 50%, #f472b6 100%)",
];

// Cycle real client names across placeholder cards.
const CLIENT_POOL = [
  "Built2Book",
  "Sell More Online",
  "TechnologyMatch",
  "DrenchmanSports",
  "Nui Brothers",
  "Prachi Jiwnani",
];

type Seed = {
  prefix: string;
  category: VideoExample["category"];
  baseViews: string[];
  baseLikes: string[];
};

const SEEDS: Seed[] = [
  {
    prefix: "long",
    category: "long",
    baseViews: ["1.4M", "2.1M", "820k", "640k", "1.8M", "510k"],
    baseLikes: ["62k", "98k", "41k", "29k", "75k", "22k"],
  },
  {
    prefix: "short",
    category: "shorts",
    baseViews: ["8.2M", "3.6M", "5.1M", "1.9M", "12M", "2.4M"],
    baseLikes: ["410k", "210k", "260k", "98k", "780k", "140k"],
  },
  {
    prefix: "brand",
    category: "brand",
    baseViews: ["920k", "1.1M", "640k", "1.3M", "480k", "780k"],
    baseLikes: ["44k", "58k", "31k", "62k", "21k", "36k"],
  },
];

const EXAMPLES: VideoExample[] = SEEDS.flatMap((seed) =>
  Array.from({ length: 6 }, (_, i) => {
    const labelMap = {
      long: "Long-Form",
      shorts: "Short",
      brand: "Brand Film",
    } as const;
    return {
      id: `${seed.prefix}-${i + 1}`,
      title: `${labelMap[seed.category]} #${i + 1}`,
      client: CLIENT_POOL[i % CLIENT_POOL.length],
      category: seed.category,
      youtubeId: "",
      views: seed.baseViews[i],
      likes: seed.baseLikes[i],
      gradient: GRADIENTS[i % GRADIENTS.length],
    };
  }),
);

const card = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function VideoExamples() {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? EXAMPLES
        : EXAMPLES.filter((e) => e.category === filter),
    [filter],
  );

  return (
    <section id="work" className="relative px-6 py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={card}>
            <Pill>PORTFOLIO</Pill>
          </motion.div>
          <motion.h2
            variants={card}
            className="text-gradient mt-6 max-w-[20ch] font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Work That Moves People
          </motion.h2>
          <motion.p
            variants={card}
            className="mt-5 max-w-2xl text-base text-text-secondary md:text-lg"
          >
            A glimpse at recent projects across YouTube, short-form, and brand
            work.
          </motion.p>
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active
                    ? "bg-gradient-primary border-transparent text-white shadow-glow-sm"
                    : "border-white/[0.08] bg-white/[0.03] text-text-secondary hover:text-white hover:border-primary/40 hover:bg-white/[0.06]",
                )}
                aria-pressed={active}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <motion.ul
          key={filter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((example) => (
            <motion.li key={example.id} variants={card}>
              <VideoExampleCard example={example} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
