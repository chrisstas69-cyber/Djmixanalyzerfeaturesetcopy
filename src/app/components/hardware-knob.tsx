import { useState, useRef, useEffect } from "react";

interface HardwareKnobProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: number; // diameter in pixels
  label?: string;
  showValue?: boolean;
  showCenterDetent?: boolean; // Shows notch at 12 o'clock for center position
}

export function HardwareKnob({
  value,
  onChange,
  min = 0,
  max = 100,
  size = 70,
  label,
  showValue = true,
  showCenterDetent = false,
}: HardwareKnobProps) {
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
      
      let angle = Math.atan2(deltaY, deltaX);
      let degrees = (angle * 180) / Math.PI;
      degrees = (degrees + 90 + 360) % 360;
      degrees = degrees > 180 ? degrees - 360 : degrees;
      
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

  const normalizedValue = (value - min) / (max - min);
  const rotation = normalizedValue * 270 - 135;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <label className="hw-label">
          {label}
        </label>
      )}
      <div
        ref={knobRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        {/* Chrome Ring */}
        <div className="hw-knob-ring" />
        
        {/* Knob Body */}
        <div 
          className="hw-knob absolute inset-0"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Center Detent Notch (for EQ knobs) */}
          {showCenterDetent && (
            <div className="center-detent" />
          )}
          
          {/* Indicator Line */}
          <div className="hw-knob-indicator" />
        </div>
        
        {/* Value Display Below */}
        {showValue && (
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
            <span className="hw-value text-[10px]">
              {Math.round(value)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

