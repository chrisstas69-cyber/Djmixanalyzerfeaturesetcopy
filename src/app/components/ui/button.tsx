import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-0)]",
  {
    variants: {
      variant: {
        primaryCyan:
          "bg-gradient-to-b from-[rgba(18,200,255,0.95)] to-[rgba(18,200,255,0.78)] text-[#041017] font-semibold border border-[rgba(75,224,255,0.35)] shadow-[var(--glow-cyan)] hover:from-[rgba(75,224,255,0.95)] hover:to-[rgba(18,200,255,0.85)] focus-visible:ring-[var(--cyan)]",
        primaryOrange:
          "bg-gradient-to-b from-[rgba(255,122,24,0.95)] to-[rgba(255,122,24,0.78)] text-[#140A02] font-semibold border border-[rgba(255,154,61,0.35)] shadow-[var(--glow-orange)] hover:from-[rgba(255,154,61,0.95)] hover:to-[rgba(255,122,24,0.85)] focus-visible:ring-[var(--orange)]",
        secondary:
          "bg-[rgba(10,16,28,0.55)] text-[var(--text)] border border-[var(--border-strong)] hover:bg-[rgba(10,16,28,0.70)] hover:border-[rgba(255,255,255,0.22)]",
        ghost:
          "text-[var(--text-2)] hover:bg-[rgba(10,16,28,0.55)] hover:text-[var(--text)] focus-visible:ring-[var(--orange)]",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[rgba(10,16,28,0.55)] hover:border-[var(--border-strong)] focus-visible:ring-[var(--cyan)]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-6 has-[>svg]:px-4 text-base",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primaryCyan",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
