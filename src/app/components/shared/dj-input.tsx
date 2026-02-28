"use client";

import React from "react";
import { cn } from "../ui/utils";
import { Search } from "lucide-react";

export interface DJInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "default" | "search";
  error?: string;
}

export const DJInput = React.forwardRef<HTMLInputElement, DJInputProps>(
  ({ label, variant = "default", error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">
            {label}
          </label>
        )}
        <div className="relative">
          {variant === "search" && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-11 px-4 rounded-lg",
              "bg-[var(--bg-dark)] text-white text-sm",
              "border border-white/10",
              "placeholder-white/30",
              "focus:border-[var(--accent-cyan)] focus:outline-none focus:ring-0",
              "transition-all duration-200",
              "font-['Inter']",
              variant === "search" && "pl-10",
              error && "border-[var(--status-error)] focus:border-[var(--status-error)]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--status-error)] font-['Inter']">{error}</p>
        )}
      </div>
    );
  }
);

DJInput.displayName = "DJInput";

export default DJInput;

