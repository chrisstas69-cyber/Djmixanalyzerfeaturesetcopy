interface RekordboxWaveformProps {
  waveformData: number[];
  color: "gray" | "orange" | "purple" | "cyan";
  playheadPosition?: number;
  showPlayhead?: boolean;
  height?: number;
  className?: string;
}

const COLOR_MAP = {
  gray: "fill-white/20",
  orange: "fill-primary",
  purple: "fill-purple-500",
  cyan: "fill-cyan-500",
};

const PLAYHEAD_COLOR_MAP = {
  gray: "bg-white/40",
  orange: "bg-primary",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
};

export function RekordboxWaveform({
  waveformData,
  color,
  playheadPosition = 0,
  showPlayhead = false,
  height = 80,
  className = "",
}: RekordboxWaveformProps) {
  return (
    <div className={`relative bg-black border border-border/30 rounded-sm overflow-hidden ${className}`} style={{ height: `${height}px` }}>
      <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
        {waveformData.map((value, i) => {
          const x = (i / waveformData.length) * 100;
          const lineHeight = value * 100;
          const y = (100 - lineHeight) / 2;
          
          return (
            <rect
              key={i}
              x={`${x}%`}
              y={`${y}%`}
              width={`${100 / waveformData.length}%`}
              height={`${lineHeight}%`}
              className={COLOR_MAP[color]}
            />
          );
        })}
      </svg>
      {showPlayhead && (
        <div
          className={`absolute top-0 bottom-0 w-0.5 ${PLAYHEAD_COLOR_MAP[color]}`}
          style={{ left: `${playheadPosition}%` }}
        />
      )}
    </div>
  );
}
