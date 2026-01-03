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
  color = "#FF7A00",
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
  const fillDegrees = normalizedValue * 270; // How much of the ring is filled

  return (
    <div className="flex flex-col items-center space-y-2">
      {label && (
        <label className="text-[10px] text-white/60 uppercase tracking-wider font-['IBM_Plex_Mono'] font-bold">
          {label}
        </label>
      )}
      <div
        ref={knobRef}
        className="relative cursor-grab active:cursor-grabbing select-none drop-shadow-lg"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        {/* 1. The Colored Ring (Background) - Conic Gradient */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${color} ${fillDegrees}deg, #333 ${fillDegrees}deg 270deg, transparent 270deg)`,
            transform: 'rotate(225deg)',
            filter: `drop-shadow(0 2px 4px ${color}40)`,
          }}
        />

        {/* 2. The Knob Body (3D Cylinder Look) */}
        <div 
          className="relative rounded-full flex items-center justify-center z-10"
          style={{
            width: `${size * 0.85}px`,
            height: `${size * 0.85}px`,
            background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            boxShadow: `
              0 4px 8px rgba(0,0,0,0.6),
              inset 0 1px 2px rgba(255,255,255,0.2),
              inset 0 -2px 4px rgba(0,0,0,0.8)
            `,
          }}
        >
          {/* 3. The Indicator Line/Dot */}
          <div 
            className="absolute w-1 rounded-full bg-white origin-bottom"
            style={{
              height: `${size * 0.25}px`,
              top: `${size * 0.05}px`,
              transform: `translateX(-50%) rotate(${rotation}deg) translateY(2px)`,
              left: '50%',
              boxShadow: '0 0 2px rgba(255,255,255,0.8)',
            }}
          />
          
          {/* Center dot for grip */}
          <div 
            className="w-2 h-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.5)',
            }}
          />
        </div>
        
        {/* Value display */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span
              className="text-xs font-bold font-['IBM_Plex_Mono']"
              style={{ 
                color: '#fff',
                textShadow: `0 0 4px ${color}, 0 0 8px ${color}40`,
              }}
            >
              {Math.round(value)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

