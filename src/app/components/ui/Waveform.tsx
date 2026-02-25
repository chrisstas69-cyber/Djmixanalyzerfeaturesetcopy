import React from 'react';

interface WaveformProps {
  size?: 'mini' | 'large';
  interactive?: boolean;
  progress?: number;
  variant?: 'default' | 'dimmed';
}

export function Waveform({ size = 'mini', interactive = false, progress = 0, variant = 'default' }: WaveformProps) {
  const bars = size === 'mini' ? 60 : 120;
  const heights = Array.from({ length: bars }, (_, i) => {
    const position = i / bars;
    const wave = Math.sin(position * Math.PI * 4) * 0.5 + 0.5;
    const random = Math.random() * 0.3;
    return (wave * 0.7 + random * 0.3) * 100;
  });

  const barWidth = size === 'mini' ? 2 : 3;
  const barGap = size === 'mini' ? 1 : 2;

  return (
    <div className={`flex items-center gap-px ${size === 'mini' ? 'h-8' : 'h-24'} ${interactive ? 'cursor-pointer' : ''}`}>
      {heights.map((height, index) => {
        const position = index / bars;
        const isPlayed = progress > position;
        const opacity = variant === 'dimmed' ? 0.3 : 1;
        
        return (
          <div
            key={index}
            className="transition-all duration-150"
            style={{
              width: `${barWidth}px`,
              height: `${height}%`,
              backgroundColor: isPlayed 
                ? `rgba(244, 176, 0, ${opacity})` 
                : `rgba(255, 255, 255, ${0.15 * opacity})`,
              borderRadius: '1px',
              marginRight: index < bars - 1 ? `${barGap}px` : '0'
            }}
          />
        );
      })}
    </div>
  );
}
