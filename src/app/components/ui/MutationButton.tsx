import React from 'react';
import { motion } from 'motion/react';

interface MutationButtonProps {
  label: string;
  state?: 'default' | 'active' | 'loading' | 'disabled';
  onClick?: () => void;
}

export function MutationButton({ label, state = 'default', onClick }: MutationButtonProps) {
  const isDisabled = state === 'disabled' || state === 'loading';
  
  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-lg border transition-all text-sm
        ${state === 'active' 
          ? 'bg-[var(--accent-amber)]/10 border-[var(--accent-amber)] text-[var(--accent-amber)]' 
          : 'bg-[var(--surface-charcoal)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)]'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      {state === 'loading' ? (
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Applying...
        </span>
      ) : (
        label
      )}
    </motion.button>
  );
}
