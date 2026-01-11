"use client";

import React from "react";
import { cn } from "../ui/utils";

export interface DJSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  variant?: "cyan" | "orange";
  className?: string;
}

export function DJSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  variant = "cyan",
  className,
}: DJSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const thumbColor = variant === "cyan" 
    ? "var(--accent-cyan)" 
    : "var(--accent-orange)";
  
  const glowColor = variant === "cyan"
    ? "var(--shadow-glow-cyan)"
    : "var(--shadow-glow-orange)";

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-xs font-semibold text-white font-['Roboto_Mono']">
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div className="w-full h-1 bg-[var(--bg-medium)] rounded-full overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${percentage}%`,
              backgroundColor: thumbColor,
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none transition-all"
          style={{
            left: `calc(${percentage}% - 8px)`,
            backgroundColor: thumbColor,
            boxShadow: glowColor,
          }}
        />
      </div>
    </div>
  );
}

export default DJSlider;

