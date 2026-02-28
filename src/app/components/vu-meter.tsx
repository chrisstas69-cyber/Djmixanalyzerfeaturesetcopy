interface VUMeterProps {
  level: number; // 0-100
  channelLabel: string; // "A" or "B"
}

export function VUMeter({ level, channelLabel }: VUMeterProps) {
  // 15 LED segments: 8 green, 4 orange, 3 red
  const segments = Array.from({ length: 15 }, (_, i) => {
    const segmentThreshold = ((i + 1) / 15) * 100;
    const isActive = level >= segmentThreshold;
    
    let color = "green";
    if (i >= 12) color = "red";    // Top 3 segments
    else if (i >= 8) color = "orange"; // Next 4 segments
    
    return { isActive, color };
  });

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="hw-label text-[9px]">{channelLabel}</span>
      <div className="flex flex-col-reverse gap-0">
        {segments.map((segment, i) => (
          <div
            key={i}
            className={`vu-led ${segment.isActive ? `active ${segment.color}` : ""}`}
          />
        ))}
      </div>
      <span className="hw-label text-[8px]">VU</span>
    </div>
  );
}

