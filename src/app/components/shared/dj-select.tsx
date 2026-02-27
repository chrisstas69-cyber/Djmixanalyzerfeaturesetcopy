"use client";

import React from "react";
import { cn } from "../ui/utils";
import { ChevronDown } from "lucide-react";

export interface DJSelectOption {
  value: string;
  label: string;
}

export interface DJSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: DJSelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DJSelect({
  value,
  onChange,
  options,
  label,
  placeholder = "Select...",
  className,
}: DJSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-11 px-4 pr-10 rounded-lg",
            "bg-[var(--bg-dark)] text-white text-sm",
            "border border-white/10",
            "appearance-none cursor-pointer",
            "focus:border-[var(--accent-cyan)] focus:outline-none focus:ring-0",
            "transition-all duration-200",
            "font-['Inter']"
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
      </div>
    </div>
  );
}

export default DJSelect;

