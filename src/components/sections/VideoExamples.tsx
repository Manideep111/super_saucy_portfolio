"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import {
  VideoExampleCard,
  type VideoExample,
} from "./VideoExampleCard";

const FILTERS = [
  { id: "long", label: "Long-form" },
  { id: "vsl", label: "VSL" },
  { id: "shorts", label: "Short-Form" },
  { id: "brand", label: "Brand" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const PER_PAGE: Record<FilterId, number> = {
  long: 3,
  vsl: 3,
  shorts: 5,
  brand: 5,
};

const GRID_COLS: Record<FilterId, string> = {
  long: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  vsl: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  shorts: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  brand: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};

const GRADIENTS = [
  "linear-gradient(135deg, #2a0f3d 0%, #6b21a8 50%, #c026d3 100%)",
  "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #db2777 100%)",
  "linear-gradient(135deg, #0c0a18 0%, #312e81 50%, #a855f7 100%)",
  "linear-gradient(135deg, #4a044e 0%, #7c3aed 50%, #f0abfc 100%)",
  "linear-gradient(135deg, #082f49 0%, #6b21a8 50%, #c026d3 100%)",
  "linear-gradient(135deg, #1a0d33 0%, #831843 50%, #f472b6 100%)",
];

const LONG_IDS = [
  "i6KhOJdfPjc",
  "laeGU7esFIk",
  "aMImvnf1MDs",
  "z4AcDEDA_8g",
  "z4AcDEDA_8g",
  "ieGEFjEECOA",
];
const VSL_IDS = ["9hQQk0JDGzk", "MJZzI_W_5zQ", "iYQi2BPrcYg"];
const SHORT_IDS = [
  "pqY3LL0p1GU",
  "7gGOVTiqmwM",
  "JRhtn79_QG4",
  "gQMQuSKikTQ",
  "UnccksHzrNI",
  "H6cJybjjlrw",
  "X_l4j6kwg3w",
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

function build(
  prefix: string,
  category: VideoExample["category"],
  ids: string[],
): VideoExample[] {
  return ids.map((youtubeId, i) => ({
    id: `${prefix}-${i + 1}`,
    category,
    youtubeId,
    gradient: GRADIENTS[i % GRADIENTS.length],
  }));
}

const EXAMPLES: VideoExample[] = [
  ...build("long", "long", LONG_IDS),
  ...build("vsl", "vsl", VSL_IDS),
  ...build("short", "shorts", SHORT_IDS),
  ...build("brand", "brand", BRAND_IDS),
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
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

export function VideoExamples() {
  const [state, setState] = useState<{
    filter: FilterId;
    pageIndex: number;
    direction: number;
  }>({ filter: "long", pageIndex: 0, direction: 0 });

  const filtered = useMemo(
    () => EXAMPLES.filter((e) => e.category === state.filter),
    [state.filter],
  );

  const perPage = PER_PAGE[state.filter];
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice(
    state.pageIndex * perPage,
    (state.pageIndex + 1) * perPage,
  );

  const changeFilter = useCallback((next: FilterId) => {
    setState({ filter: next, pageIndex: 0, direction: 0 });
  }, []);

  const go = useCallback((step: number) => {
    setState((prev) => {
      const len = EXAMPLES.filter((e) => e.category === prev.filter).length;
      const pages = Math.max(1, Math.ceil(len / PER_PAGE[prev.filter]));
      if (pages <= 1) return prev;
      return {
        ...prev,
        pageIndex: (prev.pageIndex + step + pages) % pages,
        direction: step,
      };
    });
  }, []);

  const goTo = useCallback((target: number) => {
    setState((prev) => ({
      ...prev,
      pageIndex: target,
      direction:
        target === prev.pageIndex ? 0 : target > prev.pageIndex ? 1 : -1,
    }));
  }, []);

  const currentFilter = FILTERS.find((f) => f.id === state.filter)!;
  const showControls = totalPages > 1;
  const gridCols = GRID_COLS[state.filter];

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
          <motion.div variants={headerItem}>
            <Pill>PORTFOLIO</Pill>
          </motion.div>
          <motion.h2
            variants={headerItem}
            className="text-gradient mt-6 max-w-[20ch] font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Work That Moves People
          </motion.h2>
          <motion.p
            variants={headerItem}
            className="mt-5 max-w-2xl text-base text-text-secondary md:text-lg"
          >
            A glimpse at recent projects across YouTube, short-form, and brand
            work.
          </motion.p>
        </motion.div>

        {/* Filter pills (kept from prior design — purple gradient on active) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => {
            const active = state.filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => changeFilter(f.id)}
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

        {/* Section header: outlined pill + decorative divider line */}
        <div className="mt-12 flex items-center gap-4">
          <span
            className={cn(
              "inline-flex items-center rounded-full",
              "border border-primary/50 bg-primary/[0.08] backdrop-blur-md",
              "px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-light",
            )}
          >
            {currentFilter.label}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/40 via-primary/15 to-transparent" />
        </div>

        {/* Bounding box around the paginated grid */}
        <div className="relative mt-4">
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl",
              "border border-white/[0.08] bg-surface/30 backdrop-blur-xl",
              "p-5 sm:p-6 md:p-8",
              "shadow-[inset_0_0_60px_rgba(168,85,247,0.06)]",
            )}
          >
            <AnimatePresence custom={state.direction} mode="wait">
              <motion.div
                key={`${state.filter}-${state.pageIndex}`}
                custom={state.direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn("grid gap-4 md:gap-5", gridCols)}
              >
                {pageItems.map((example) => (
                  <VideoExampleCard key={example.id} example={example} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Lateral arrows (purple-tinted to match the screenshot-1 theme) */}
          {showControls ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous page"
                className={cn(
                  "absolute left-2 top-1/2 z-20 -translate-y-1/2 md:-left-5",
                  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full",
                  "border border-white/[0.1] bg-black/55 text-white backdrop-blur-md",
                  "transition-all duration-300 hover:border-primary/40 hover:bg-black/75 hover:shadow-glow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next page"
                className={cn(
                  "absolute right-2 top-1/2 z-20 -translate-y-1/2 md:-right-5",
                  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full",
                  "border border-white/[0.1] bg-black/55 text-white backdrop-blur-md",
                  "transition-all duration-300 hover:border-primary/40 hover:bg-black/75 hover:shadow-glow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>

        {/* Pagination dots (only when there's more than one page) */}
        {showControls ? (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const active = i === state.pageIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={active}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "w-6 bg-primary shadow-glow-sm"
                      : "w-2 bg-white/25 hover:bg-white/40",
                  )}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
