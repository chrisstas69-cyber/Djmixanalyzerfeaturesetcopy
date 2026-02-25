import React from 'react';
import { motion } from 'motion/react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonState = 'default' | 'disabled' | 'loading';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  state?: ButtonState;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  state = 'default', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg transition-all duration-200 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[var(--accent-amber)] text-[var(--background)] hover:bg-[var(--accent-amber-hover)]",
    secondary: "bg-[var(--surface-charcoal)] text-[var(--text-primary)] border border-[var(--border-medium)] hover:bg-[var(--surface-panel)]",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-charcoal)]"
  };

  const isDisabled = state === 'disabled' || state === 'loading';

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={state === 'loading' ? 'opacity-0' : ''}>
        {children}
      </span>
    </motion.button>
  );
}
