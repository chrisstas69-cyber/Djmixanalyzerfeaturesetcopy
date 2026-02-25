import React from 'react';
import { motion } from 'motion/react';

interface ModeToggleProps {
  mode: 'simple' | 'custom';
  onChange: (mode: 'simple' | 'custom') => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-center py-4 px-6 border-b border-[var(--border-subtle)] bg-[var(--surface-charcoal)]">
      <div className="inline-flex rounded-lg bg-[#0a0a0a] p-1 border border-[#2a2a2a]">
        <button
          onClick={() => onChange('simple')}
          className="relative px-6 py-2 text-sm font-medium transition-colors rounded-md"
        >
          {mode === 'simple' && (
            <motion.div
              layoutId="mode-toggle-bg"
              className="absolute inset-0 bg-[#ff6b35] rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className={`relative z-10 transition-colors ${
            mode === 'simple' ? 'text-white' : 'text-[#808080]'
          }`}>
            Simple
          </span>
        </button>
        
        <button
          onClick={() => onChange('custom')}
          className="relative px-6 py-2 text-sm font-medium transition-colors rounded-md"
        >
          {mode === 'custom' && (
            <motion.div
              layoutId="mode-toggle-bg"
              className="absolute inset-0 bg-[#ff6b35] rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className={`relative z-10 transition-colors ${
            mode === 'custom' ? 'text-white' : 'text-[#808080]'
          }`}>
            Custom
          </span>
        </button>
      </div>
    </div>
  );
}
