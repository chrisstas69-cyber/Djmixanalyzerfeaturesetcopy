"use client";

import React from "react";
import { cn } from "../ui/utils";

export interface DJBadgeProps {
  variant?: "default" | "cyan" | "orange" | "success" | "warning" | "error";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

export function DJBadge({
  variant = "default",
  size = "sm",
  children,
  className,
}: DJBadgeProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold uppercase tracking-wider
    font-['Rajdhani'] rounded
  `;

  const variantStyles = {
    default: "bg-[var(--bg-medium)] text-white/60",
    cyan: "bg-[var(--accent-cyan-glow)] text-[var(--accent-cyan)]",
    orange: "bg-[var(--accent-orange-glow)] text-[var(--accent-orange)]",
    success: "bg-[var(--status-success)]/20 text-[var(--status-success)]",
    warning: "bg-[var(--status-warning)]/20 text-[var(--status-warning)]",
    error: "bg-[var(--status-error)]/20 text-[var(--status-error)]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export default DJBadge;

