import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl",
          "bg-surface/40 backdrop-blur-xl",
          "border border-white/[0.08]",
          "transition-all duration-300",
          interactive &&
            "hover:border-primary/40 hover:shadow-glow-sm hover:-translate-y-0.5",
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";
