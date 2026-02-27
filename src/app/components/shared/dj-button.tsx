"use client";

import React from "react";
import { cn } from "../ui/utils";

export interface DJButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function DJButton({
  variant = "primary",
  size = "md",
  glow = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: DJButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold font-['Inter'] rounded-lg
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-b from-[var(--accent-cyan)] to-[var(--accent-cyan-dim)]
      text-[var(--bg-darkest)] border-none
      hover:translate-y-[-1px]
      active:translate-y-0
      ${glow ? "shadow-[var(--shadow-glow-cyan)]" : ""}
    `,
    secondary: `
      bg-[var(--bg-medium)] text-white
      border border-white/10
      hover:bg-[var(--bg-light)] hover:border-white/20
    `,
    ghost: `
      bg-transparent text-white/60
      hover:text-white hover:bg-white/5
    `,
    danger: `
      bg-[var(--status-error)]/10 text-[var(--status-error)]
      border border-[var(--status-error)]/20
      hover:bg-[var(--status-error)]/20
    `,
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default DJButton;

