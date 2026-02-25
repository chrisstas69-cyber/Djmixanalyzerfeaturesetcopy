import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

interface SliderProps {
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  tooltip?: string;
}

export function Slider({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  tooltip
}: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
          {label}
          {tooltip && (
            <span className="group relative">
              <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeLinecap="round" d="M12 16v-4m0-4h.01" strokeWidth="2"/>
              </svg>
              <span className="absolute left-0 top-5 w-48 p-2 bg-[var(--surface-panel)] border border-[var(--border-medium)] rounded text-xs text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        {showValue && (
          <span className="text-sm text-[var(--text-primary)] font-mono tabular-nums">
            {value[0]}
            {value.length > 1 && ` - ${value[1]}`}
          </span>
        )}
      </div>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      >
        <SliderPrimitive.Track className="bg-[var(--surface-charcoal)] relative grow rounded-full h-1">
          <SliderPrimitive.Range className="absolute bg-[var(--accent-amber)] rounded-full h-full" />
        </SliderPrimitive.Track>
        {value.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="block w-4 h-4 bg-[var(--text-primary)] rounded-full hover:bg-[var(--accent-amber)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] transition-colors"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}
