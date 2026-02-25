import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  loadingText = 'Processing...',
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center transition-all duration-200 font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#E0AA3E] hover:bg-[#C6922B] text-black font-bold shadow-[0_0_15px_rgba(224,170,62,0.3)]",
    secondary: "bg-[#FFE59E] hover:bg-[#F0D07B] text-black font-bold",
    ghost: "bg-transparent hover:bg-[#141414] text-[#C8C8C8] hover:text-[#E0AA3E]",
    outline: "bg-transparent border border-[#333] hover:border-[#E0AA3E] text-[#E0AA3E]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded",
    md: "px-6 py-3 text-sm rounded",
    lg: "px-8 py-4 text-base rounded-md"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </span>
      ) : children}
    </button>
  );
};