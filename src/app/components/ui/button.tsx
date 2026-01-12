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
          "bg-[var(--accent-cyan)] text-black font-semibold hover:bg-[var(--accent-cyan-hover)] hover:shadow-[var(--glow-cyan)] focus-visible:ring-[var(--accent-cyan)]",
        primaryOrange:
          "bg-[var(--accent-orange)] text-black font-semibold hover:bg-[var(--accent-orange-hover)] hover:shadow-[var(--glow-orange)] focus-visible:ring-[var(--accent-orange)]",
        secondary:
          "bg-[var(--surface-2)] text-[var(--text-1)] border border-[var(--border-1)] hover:bg-[var(--surface-3)] hover:border-[var(--border-2)] hover:shadow-[var(--shadow-sm)]",
        ghost:
          "text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] focus-visible:ring-[var(--accent-orange)]",
        outline:
          "border border-[var(--border-1)] bg-transparent text-[var(--text-1)] hover:bg-[var(--surface-1)] hover:border-[var(--border-2)] focus-visible:ring-[var(--accent-cyan)]",
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
