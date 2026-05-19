import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  dashes?: boolean;
}

export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  ({ className, dashes = true, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full",
          "px-4 py-1.5",
          "text-[11px] uppercase tracking-[0.2em] font-medium",
          "text-text-secondary",
          "bg-white/[0.03] border border-white/[0.08] backdrop-blur-md",
          className,
        )}
        {...props}
      >
        {dashes ? <span aria-hidden className="text-primary/70">—</span> : null}
        <span>{children}</span>
        {dashes ? <span aria-hidden className="text-primary/70">—</span> : null}
      </span>
    );
  },
);

Pill.displayName = "Pill";
