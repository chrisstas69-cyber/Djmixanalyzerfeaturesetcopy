interface ColorfulWaveformProps {
  position: number; // 0-100
  isPlaying: boolean;
}

export function ColorfulWaveform({ position, isPlaying }: ColorfulWaveformProps) {
  // Generate frequency-based waveform data
  const bars = Array.from({ length: 120 }, (_, i) => ({
    low: Math.random() * 60 + 40,    // Bass (red/orange)
    mid: Math.random() * 50 + 30,    // Mids (green/yellow)
    high: Math.random() * 40 + 20,   // Highs (blue/cyan)
  }));
  
  return (
    <div className="relative w-full h-[100px] bg-[#0a0a0a] rounded overflow-hidden border border-white/5">
      {/* Beat grid markers */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-r border-white/5"
            style={{ borderRightWidth: i % 4 === 0 ? "1px" : "0.5px" }}
          />
        ))}
      </div>
      
      {/* Frequency-colored waveform bars */}
      <div className="absolute inset-0 flex items-end gap-[1px] px-1 pb-6">
        {bars.map((bar, i) => {
          const progress = (i / bars.length) * 100;
          const isPast = progress < position;
          const opacity = isPast ? 1 : 0.3;
          
          return (
            <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]">
              {/* High frequencies - blue/cyan */}
              <div
                style={{
                  height: `${bar.high}%`,
                  backgroundColor: isPlaying ? "#00D4FF" : "#00D4FF80",
                  opacity,
                }}
              />
              {/* Mid frequencies - green/yellow */}
              <div
                style={{
                  height: `${bar.mid}%`,
                  backgroundColor: isPlaying ? "#00FF66" : "#00FF6680",
                  opacity,
                }}
              />
              {/* Low frequencies - red/orange */}
              <div
                style={{
                  height: `${bar.low}%`,
                  backgroundColor: isPlaying ? "#FF9500" : "#FF950080",
                  opacity,
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Playhead with glow */}
      <div
        className="absolute top-0 bottom-6 w-[2px] bg-white z-20 transition-all"
        style={{
          left: `${Math.max(1, Math.min(99, position))}%`,
          boxShadow: "0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(255,255,255,0.4)",
        }}
      />
      
      {/* Time markers */}
      <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-between px-2 text-[10px] text-[#666] font-['JetBrains_Mono'] items-center">
        <span>-3:00</span>
        <span>-2:00</span>
        <span>-1:00</span>
        <span>0:00</span>
      </div>
    </div>
  );
}



