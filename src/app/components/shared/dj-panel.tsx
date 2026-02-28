"use client";

import React from "react";
import { cn } from "../ui/utils";

export interface DJPanelProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: "default" | "elevated" | "bordered";
  className?: string;
  children: React.ReactNode;
}

export function DJPanel({
  title,
  subtitle,
  actions,
  variant = "default",
  className,
  children,
}: DJPanelProps) {
  const variantStyles = {
    default: "bg-[var(--bg-darker)] border-[var(--border-subtle)]",
    elevated: "bg-[var(--bg-dark)] border-white/10 shadow-[var(--shadow-md)]",
    bordered: "bg-transparent border-white/10",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        variantStyles[variant],
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-white font-['Rajdhani'] tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-white/40 mt-0.5 font-['Inter']">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default DJPanel;

