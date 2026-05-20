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
  { id: "long", label: "Long-form" },
  { id: "shorts", label: "Shorts" },
  { id: "brand", label: "Brand" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const GRADIENTS = [
  "linear-gradient(135deg, #2a0f3d 0%, #6b21a8 50%, #c026d3 100%)",
  "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #db2777 100%)",
  "linear-gradient(135deg, #0c0a18 0%, #312e81 50%, #a855f7 100%)",
  "linear-gradient(135deg, #4a044e 0%, #7c3aed 50%, #f0abfc 100%)",
  "linear-gradient(135deg, #082f49 0%, #6b21a8 50%, #c026d3 100%)",
  "linear-gradient(135deg, #1a0d33 0%, #831843 50%, #f472b6 100%)",
];

const CLIENT_POOL = [
  "Built2Book",
  "Sell More Online",
  "TechnologyMatch",
  "DrenchmanSports",
  "Nui Brothers",
  "Prachi Jiwnani",
];

// 18 real YouTube IDs (6 per category). Replace any title / client /
// views / likes string here to taste — they're placeholders.
const LONG_IDS = [
  "i6KhOJdfPjc",
  "laeGU7esFIk",
  "aMImvnf1MDs",
  "z4AcDEDA_8g",
  "z4AcDEDA_8g",
  "ieGEFjEECOA",
];
const SHORT_IDS = [
  "0ICuMCTBAsU",
  "TzvAYIr91d4",
  "YTTAlPjGBcY",
  "CQChUfH-_VI",
  "sWX-Tmrtk50",
  "La-MLQ_wCXo",
];
const BRAND_IDS = [
  "ZOdPL_QV_dg",
  "LhXHoRl-icw",
  "Mt5-KlmMrGk",
  "6bEDeOOZPso",
  "2LOcopD00sY",
  "Vn_BH9RZ9Hg",
];

const LONG_STATS = [
  { views: "1.4M", likes: "62k" },
  { views: "2.1M", likes: "98k" },
  { views: "820k", likes: "41k" },
  { views: "640k", likes: "29k" },
  { views: "1.8M", likes: "75k" },
  { views: "510k", likes: "22k" },
];
const SHORT_STATS = [
  { views: "8.2M", likes: "410k" },
  { views: "3.6M", likes: "210k" },
  { views: "5.1M", likes: "260k" },
  { views: "1.9M", likes: "98k" },
  { views: "12M", likes: "780k" },
  { views: "2.4M", likes: "140k" },
];
const BRAND_STATS = [
  { views: "920k", likes: "44k" },
  { views: "1.1M", likes: "58k" },
  { views: "640k", likes: "31k" },
  { views: "1.3M", likes: "62k" },
  { views: "480k", likes: "21k" },
  { views: "780k", likes: "36k" },
];

function build(
  prefix: string,
  category: VideoExample["category"],
  label: string,
  ids: string[],
  stats: { views: string; likes: string }[],
): VideoExample[] {
  return ids.map((youtubeId, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${label} #${i + 1}`,
    client: CLIENT_POOL[i % CLIENT_POOL.length],
    category,
    youtubeId,
    views: stats[i].views,
    likes: stats[i].likes,
    gradient: GRADIENTS[i % GRADIENTS.length],
  }));
}

const EXAMPLES: VideoExample[] = [
  ...build("long", "long", "Long-Form", LONG_IDS, LONG_STATS),
  ...build("short", "shorts", "Short", SHORT_IDS, SHORT_STATS),
  ...build("brand", "brand", "Brand Film", BRAND_IDS, BRAND_STATS),
];

const card = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function VideoExamples() {
  const [filter, setFilter] = useState<FilterId>("long");

  const filtered = useMemo(
    () => EXAMPLES.filter((e) => e.category === filter),
    [filter],
  );

  // Long-form cards render 16:9; shorts + brand render vertical 9:16.
  const gridCols =
    filter === "long"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

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
          className={cn("mt-10 grid gap-5", gridCols)}
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
