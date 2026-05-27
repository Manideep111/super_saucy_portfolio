"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const MAIN_PAGES = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        d="M3 7.5A4.5 4.5 0 0 1 7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9Zm9 1.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm5-.4a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z"
      />
    </svg>
  );
}
function TwitterXIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M17.5 3h3.2l-7 8 8.3 10h-6.5l-5-6.6L4.7 21H1.5l7.5-8.6L1 3h6.6l4.6 6.1L17.5 3Zm-1.1 16h1.8L7.6 5H5.7l10.7 14Z"
      />
    </svg>
  );
}
function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6 1.1 6 0 4.88 0 3.5 0 2.12 1.1 1 2.48 1c1.38 0 2.5 1.12 2.5 2.5ZM.22 8h4.5v14h-4.5V8Zm7.78 0h4.32v1.92h.06c.6-1.13 2.07-2.32 4.26-2.32 4.55 0 5.39 3 5.39 6.9V22h-4.5v-6.78c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.6 1.77-2.6 3.59V22H8V8Z"
      />
    </svg>
  );
}

const SOCIAL: {
  label: string;
  href: string;
  Icon: (p: IconProps) => React.JSX.Element;
}[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/manideep.edits/",
    Icon: InstagramIcon,
  },
  {
    label: "Twitter (X)",
    href: "https://x.com/manideep_bade",
    Icon: TwitterXIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/manideep-bade/",
    Icon: LinkedinIcon,
  },
];

const linkClass = cn(
  "inline-flex items-center gap-2 text-sm text-text-secondary",
  "transition-colors duration-300 hover:text-white",
);

export function Footer() {
  return (
    <footer id="contact" className="relative px-6 pb-12 pt-16 md:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Link
              href="/"
              aria-label="Home"
              className="inline-flex items-center gap-2"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow-sm">
                <Sparkles className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="font-display text-base font-semibold">
                Manideep<span className="text-primary-light">.</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-text-secondary">
              Premium video editing for creators who mean business.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Main Pages
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {MAIN_PAGES.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Social
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-text-muted md:flex-row">
          <span>&copy; 2026 Manideep. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5">
            Made with
            <span className="text-primary-light" aria-hidden>
              &#9825;
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
