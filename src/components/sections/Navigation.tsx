"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 200], [1, 0.92]);
  const blur = useTransform(scrollY, [0, 200], [16, 28]);
  const bgOpacity = useTransform(scrollY, [0, 200], [0.35, 0.65]);
  const backdropFilter = useTransform(blur, (v) => `blur(${v}px)`);
  const background = useTransform(
    bgOpacity,
    (v) => `rgba(13, 8, 24, ${v})`,
  );

  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        style={{ scale }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1100px,calc(100%-2rem))]"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Pill: logo + links */}
          <motion.nav
            style={{ background, backdropFilter, WebkitBackdropFilter: backdropFilter }}
            className={cn(
              "flex flex-1 items-center gap-2 rounded-full pl-2 pr-3 py-2",
              "border border-white/[0.08]",
              "shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
            )}
          >
            <Link
              href="/"
              aria-label="Home"
              className="flex items-center gap-2 pl-1 pr-3"
            >
              <span
                className={cn(
                  "relative inline-flex h-9 w-9 items-center justify-center rounded-full",
                  "bg-gradient-primary text-white",
                  "shadow-glow-sm",
                )}
              >
                <Sparkles className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="hidden sm:inline font-display text-sm font-semibold tracking-tight">
                Lumen<span className="text-primary-light">.</span>
              </span>
            </Link>

            <ul className="ml-2 hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-flex items-center rounded-full px-3.5 py-1.5",
                      "text-sm text-text-secondary hover:text-white",
                      "transition-colors hover:bg-white/[0.06]",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={cn(
                "ml-auto md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full",
                "border border-white/[0.08] text-white",
                "hover:bg-white/[0.06] transition-colors",
              )}
            >
              <Menu className="h-4 w-4" />
            </button>
          </motion.nav>

          <Button
            size="md"
            variant="primary"
            rightIcon={<ArrowUpRight className="h-4 w-4" />}
            className="hidden md:inline-flex shrink-0"
          >
            Book a Call
          </Button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
              onClick={() => setOpen(false)}
            />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between px-6 py-5">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow-sm">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="font-display text-base font-semibold">
                    Lumen<span className="text-primary-light">.</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-white hover:bg-white/[0.06]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
                className="flex flex-1 flex-col items-center justify-center gap-2 px-6"
              >
                {NAV_LINKS.map((link) => (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-gradient font-display text-4xl font-semibold tracking-tight"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="p-6">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowUpRight className="h-4 w-4" />}
                  onClick={() => setOpen(false)}
                >
                  Book a Call
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
