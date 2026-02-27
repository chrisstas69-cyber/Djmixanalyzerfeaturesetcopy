interface PhotorealisticKnobProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  label: string;
  size?: "small" | "medium" | "large" | "xlarge";
  showValue?: boolean;
}

export function PhotorealisticKnob({
  value,
  onChange,
  label,
  size = "medium",
  showValue = true,
}: PhotorealisticKnobProps) {
  const sizeMap = {
    small: 45,
    medium: 50,
    large: 55,
    xlarge: 60,
  };
  
  const knobSize = sizeMap[size];
  const rotation = (value / 100) * 270 - 135; // -135deg to +135deg
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startValue = value;
    
    const handleMove = (moveEvent: MouseEvent) => {
      const delta = (startY - moveEvent.clientY) / 2;
      const newValue = Math.max(0, Math.min(100, startValue + delta));
      onChange(newValue);
    };
    
    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };
  
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#888] text-[9px] uppercase tracking-wider font-bold">
        {label}
      </span>
      
      <div
        className="relative cursor-pointer select-none"
        style={{ width: knobSize, height: knobSize }}
        onMouseDown={handleMouseDown}
      >
        {/* Spun aluminum knob body */}
        <div
          className="absolute inset-0 rounded-full transition-transform"
          style={{
            background: `
              radial-gradient(circle at 35% 35%, #666 0%, #333 30%, #1a1a1a 70%),
              conic-gradient(from 0deg, #444, #222, #444, #222, #444)
            `,
            boxShadow: `
              0 4px 8px rgba(0,0,0,0.6),
              inset 0 1px 2px rgba(255,255,255,0.1),
              inset 0 -1px 2px rgba(0,0,0,0.3)
            `,
            border: "2px solid #1a1a1a",
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* White indicator line */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              width: "2px",
              height: `${knobSize * 0.3}px`,
              top: "5px",
              background: "white",
              boxShadow: "0 0 4px rgba(255,255,255,0.5)",
              borderRadius: "1px",
            }}
          />
        </div>
      </div>
      
      {showValue && (
        <span className="text-[#00D4FF] text-[10px] font-['JetBrains_Mono'] font-bold">
          {Math.round(value)}
        </span>
      )}
    </div>
  );
}



