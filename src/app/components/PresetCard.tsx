import React from 'react';
import { motion } from 'motion/react';

interface PresetCardProps {
  emoji: string;
  name: string;
  isActive?: boolean;
  onClick: () => void;
}

export function PresetCard({ emoji, name, isActive = false, onClick }: PresetCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        w-full aspect-square rounded-lg p-4 flex flex-col items-center justify-center gap-2
        transition-all border
        ${isActive 
          ? 'bg-[#ff6b35] border-[#ff6b35] text-white' 
          : 'bg-[#1a1a1a] border-[#333333] text-white hover:border-[#ff6b35]'
        }
      `}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-medium text-center leading-tight">
        {name}
      </span>
    </motion.button>
  );
}
