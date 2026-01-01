import { useState, useRef, useEffect } from "react";

interface CircularKnobProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: number; // diameter in pixels
  color?: string;
  label?: string;
  showValue?: boolean;
}

export function CircularKnob({
  value,
  onChange,
  min = 0,
  max = 100,
  size = 80,
  color = "#FF8C00",
  label,
  showValue = true,
}: CircularKnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);

  const normalizeValue = (val: number) => {
    return Math.max(min, Math.min(max, val));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!knobRef.current) return;
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Calculate angle from center (in radians)
      let angle = Math.atan2(deltaY, deltaX);
      
      // Convert to degrees and adjust: start from top (270° = 0 value), clockwise
      // -135° to +135° rotation range (270 degrees total)
      let degrees = (angle * 180) / Math.PI;
      degrees = (degrees + 90 + 360) % 360; // Normalize: 0° at top
      degrees = degrees > 180 ? degrees - 360 : degrees; // Convert to -180 to 180
      
      // Map -135° to +135° to 0-1 (where -135° = min, +135° = max)
      const normalizedAngle = (degrees + 135) / 270;
      const clampedAngle = Math.max(0, Math.min(1, normalizedAngle));
      const newValue = min + clampedAngle * (max - min);
      onChange(normalizeValue(newValue));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onChange, min, max]);

  // Convert value to rotation angle (0-270 degrees)
  const normalizedValue = (value - min) / (max - min);
  const rotation = normalizedValue * 270 - 135; // -135 to +135 degrees

  return (
    <div className="flex flex-col items-center space-y-2">
      {label && (
        <label className="text-[10px] text-white/60 uppercase tracking-wider font-['IBM_Plex_Mono']">
          {label}
        </label>
      )}
      <div
        ref={knobRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4"
          style={{
            borderColor: `${color}40`,
            background: `radial-gradient(circle at 30% 30%, ${color}15, transparent)`,
          }}
        />
        
        {/* Indicator */}
        <div
          className="absolute top-2 left-1/2 w-1 h-3 rounded-full transition-transform duration-100 origin-bottom"
          style={{
            backgroundColor: color,
            transform: `translateX(-50%) rotate(${rotation}deg) translateY(${size * 0.15}px)`,
          }}
        />
        
        {/* Center dot */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        
        {/* Value display */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xs font-bold font-['IBM_Plex_Mono']"
              style={{ color }}
            >
              {Math.round(value)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

