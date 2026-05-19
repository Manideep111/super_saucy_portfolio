"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const variantStyles: Record<Variant, string> = {
  primary: cn(
    "bg-gradient-primary text-white",
    "shadow-glow-sm hover:shadow-glow-md",
    "hover:scale-[1.03] active:scale-[0.98]",
  ),
  secondary: cn(
    "bg-white/5 text-white backdrop-blur-xl",
    "border border-white/10 hover:border-primary/40",
    "hover:bg-white/10 hover:shadow-glow-sm",
    "hover:scale-[1.03] active:scale-[0.98]",
  ),
  ghost: cn(
    "bg-transparent text-text-secondary",
    "hover:text-white hover:bg-white/5",
  ),
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium",
          "transition-all duration-300 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          "will-change-transform",
          sizeStyles[size],
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
        <span>{children}</span>
        {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
      </button>
    );
  },
);

Button.displayName = "Button";
