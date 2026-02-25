import React from 'react';

interface VerticalWaveformProps {
  progress?: number; // 0-1
  height?: number; // in pixels
  interactive?: boolean;
  onSeek?: (position: number) => void;
}

export function VerticalWaveform({ 
  progress = 0, 
  height = 100, 
  interactive = false,
  onSeek 
}: VerticalWaveformProps) {
  const bars = 150;
  
  // Generate waveform data (simulated amplitude)
  const waveformData = Array.from({ length: bars }, (_, i) => {
    const position = i / bars;
    
    // Create varied amplitude sections
    const wave1 = Math.sin(position * Math.PI * 6) * 0.5 + 0.5;
    const wave2 = Math.sin(position * Math.PI * 2) * 0.3 + 0.7;
    const noise = Math.random() * 0.2;
    
    // Combine for natural variation
    const amplitude = (wave1 * 0.4 + wave2 * 0.4 + noise * 0.2);
    
    // Create dynamic sections (intro quieter, drop louder, etc.)
    let sectionMultiplier = 1;
    if (position < 0.1) sectionMultiplier = 0.4; // Quiet intro
    else if (position > 0.15 && position < 0.3) sectionMultiplier = 0.9; // Build up
    else if (position > 0.3 && position < 0.7) sectionMultiplier = 1.0; // Main section
    else if (position > 0.7 && position < 0.85) sectionMultiplier = 0.85; // Breakdown
    else if (position > 0.85) sectionMultiplier = 0.5; // Outro
    
    return amplitude * sectionMultiplier;
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onSeek) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y / rect.height;
    onSeek(position);
  };

  const getBarColor = (amplitude: number, position: number) => {
    const isPast = position <= progress;
    
    if (!isPast) {
      return '#333333'; // Gray for unplayed sections
    }
    
    // Color based on amplitude (orange to yellow)
    if (amplitude > 0.7) {
      return '#ff6b35'; // Orange for loud
    } else if (amplitude > 0.4) {
      return '#ff9955'; // Orange-yellow for medium
    } else {
      return '#666666'; // Darker gray for quiet but played
    }
  };

  return (
    <div 
      className={`relative w-full ${interactive ? 'cursor-pointer' : ''}`}
      style={{ height: `${height}px` }}
      onClick={handleClick}
    >
      {/* Waveform bars */}
      <div className="flex justify-between h-full">
        {waveformData.map((amplitude, index) => {
          const position = index / bars;
          const barColor = getBarColor(amplitude, position);
          
          return (
            <div
              key={index}
              className="flex-1 mx-px flex items-center justify-center"
            >
              <div
                style={{
                  width: '100%',
                  height: `${amplitude * 100}%`,
                  backgroundColor: barColor,
                  borderRadius: '1px',
                  transition: 'background-color 0.15s ease'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Playhead - horizontal line */}
      {progress > 0 && (
        <div
          className="absolute left-0 right-0 h-0.5 bg-[#ff6b35] shadow-[0_0_4px_rgba(255,107,53,0.6)] z-10"
          style={{
            top: `${progress * 100}%`,
            transition: 'top 0.1s linear'
          }}
        >
          {/* Playhead markers on both sides */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#ff6b35] rounded-full shadow-[0_0_4px_rgba(255,107,53,0.8)]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#ff6b35] rounded-full shadow-[0_0_4px_rgba(255,107,53,0.8)]" />
        </div>
      )}
    </div>
  );
}
