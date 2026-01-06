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
  color = "#00D4FF",
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
        <label 
          className="text-[10px] text-white/60 uppercase tracking-widest font-['Rajdhani'] font-bold"
          style={{ letterSpacing: '1px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          {label}
        </label>
      )}
      <div
        ref={knobRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ 
          width: size, 
          height: size,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.9)) drop-shadow(0 4px 6px rgba(0,0,0,0.8))',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Outer ring bezel - adds depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.08),
              inset 0 -2px 4px rgba(0,0,0,0.9),
              0 2px 8px rgba(0,0,0,0.8)
            `,
          }}
        />
        
        {/* 1. The Colored Ring (Background) - Conic Gradient - THICKER & MORE PROMINENT */}
        <div 
          className="absolute rounded-full"
          style={{
            inset: `${size * 0.04}px`,
            background: `conic-gradient(
              from 225deg,
              ${color} 0deg,
              ${color} ${fillDegrees}deg,
              #1a1a1a ${fillDegrees}deg,
              #1a1a1a 270deg,
              transparent 270deg
            )`,
            transform: 'rotate(225deg)',
            boxShadow: `
              0 0 12px ${color}60,
              0 0 24px ${color}30,
              inset 0 2px 4px rgba(0,0,0,0.6)
            `,
          }}
        />

        {/* 2. The Knob Body (3D Cylinder Look) - DARKER & MORE BEVELED */}
        <div 
          className="absolute rounded-full flex items-center justify-center z-10"
          style={{
            inset: `${size * 0.12}px`,
            background: 'linear-gradient(145deg, #4a4a4a 0%, #2a2a2a 25%, #1a1a1a 50%, #0f0f0f 75%, #080808 100%)',
            boxShadow: `
              0 8px 16px rgba(0,0,0,0.9),
              0 4px 8px rgba(0,0,0,0.8),
              inset 0 2px 6px rgba(255,255,255,0.12),
              inset 0 -4px 8px rgba(0,0,0,0.95),
              inset 0 0 4px rgba(0,0,0,0.6)
            `,
          }}
        >
          {/* Top highlight arc for 3D effect */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className="absolute"
              style={{
                top: '2%',
                left: '15%',
                right: '15%',
                height: '30%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                borderRadius: '50% 50% 0 0',
              }}
            />
          </div>
          
          {/* Rim highlight */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.08) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
          
          {/* 3. The Indicator Line - THICKER & MORE VISIBLE */}
          <div 
            className="absolute origin-bottom"
            style={{
              width: `${size * 0.06}px`,
              height: `${size * 0.22}px`,
              top: `${size * 0.06}px`,
              left: '50%',
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              background: 'linear-gradient(180deg, #fff 0%, #e0e0e0 100%)',
              borderRadius: `${size * 0.03}px`,
              boxShadow: `
                0 0 6px rgba(255,255,255,0.9),
                0 0 12px rgba(255,255,255,0.6),
                0 2px 4px rgba(0,0,0,0.5)
              `,
            }}
          />
          
          {/* Center recessed cap with grip texture */}
          <div 
            className="absolute rounded-full"
            style={{
              width: `${size * 0.2}px`,
              height: `${size * 0.2}px`,
              background: 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)',
              boxShadow: `
                inset 0 3px 6px rgba(0,0,0,0.9),
                inset 0 -1px 2px rgba(255,255,255,0.05),
                0 1px 2px rgba(0,0,0,0.5)
              `,
            }}
          />
        </div>
        
        {/* Value display - Glowing Text */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span
              className="text-[10px] font-bold font-['JetBrains_Mono'] tabular-nums"
              style={{ 
                color: '#fff',
                textShadow: `
                  0 0 10px ${color},
                  0 0 20px ${color}80,
                  0 1px 3px rgba(0,0,0,0.9)
                `,
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

