import { useState } from "react";

interface MixerStripProps {
  deckAGain: number;
  deckAEqHigh: number;
  deckAEqMid: number;
  deckAEqLow: number;
  deckAVolume: number;
  deckBGain: number;
  deckBEqHigh: number;
  deckBEqMid: number;
  deckBEqLow: number;
  deckBVolume: number;
  crossfader: number;
  vuLevelA: number;
  vuLevelB: number;
  onDeckAGainChange: (value: number) => void;
  onDeckAEqChange: (band: "high" | "mid" | "low", value: number) => void;
  onDeckAVolumeChange: (value: number) => void;
  onDeckBGainChange: (value: number) => void;
  onDeckBEqChange: (band: "high" | "mid" | "low", value: number) => void;
  onDeckBVolumeChange: (value: number) => void;
  onCrossfaderChange: (value: number) => void;
}

function MixerKnob({
  value,
  onChange,
  label,
  size = 40,
}: {
  value: number;
  onChange: (val: number) => void;
  label: string;
  size?: number;
}) {
  const rotation = (value / 100) * 270 - 135;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative rounded-full cursor-pointer"
        style={{ width: size, height: size }}
        onMouseDown={(e) => {
          const startY = e.clientY;
          const startValue = value;
          
          const handleMove = (moveEvent: MouseEvent) => {
            const delta = startY - moveEvent.clientY;
            const newValue = Math.max(0, Math.min(100, startValue + delta * 0.5));
            onChange(newValue);
          };
          
          const handleUp = () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
          };
          
          window.addEventListener("mousemove", handleMove);
          window.addEventListener("mouseup", handleUp);
        }}
      >
        {/* Knob body - filled with gradient and depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ 
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            border: '2px solid #3a3a3a',
            boxShadow: '0 3px 6px rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.1)',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* Indicator line */}
          <div 
            className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[2px] rounded-full"
            style={{
              height: `${size * 0.35}px`,
              background: 'linear-gradient(to bottom, #ffffff, #cccccc)',
              boxShadow: '0 0 2px rgba(255,255,255,0.5)',
            }}
          />
        </div>
      </div>
      <span className="text-white/40 text-[10px] uppercase font-['Rajdhani'] tracking-wider">
        {label}
      </span>
    </div>
  );
}

function VUMeter({ level, label }: { level: number; label: string }) {
  const segments = 15;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-white/40 text-[9px] uppercase font-['Rajdhani']">{label}</span>
      <div className="flex flex-col-reverse gap-[2px]">
        {Array.from({ length: segments }, (_, i) => {
          const segmentLevel = ((i + 1) / segments) * 100;
          const isActive = level >= segmentLevel;
          let color = "#00FF66"; // Green
          if (i >= 12) color = "#FF3B30"; // Red
          else if (i >= 8) color = "#FF9500"; // Orange
          
          return (
            <div
              key={i}
              className="w-6 h-[6px] rounded-sm transition-all"
              style={{
                backgroundColor: isActive ? color : "#222",
                boxShadow: isActive ? `0 0 4px ${color}` : "none",
              }}
            />
          );
        })}
      </div>
      <span className="text-white/40 text-[8px] font-['JetBrains_Mono']">VU</span>
    </div>
  );
}

export function MixerStrip({
  deckAGain,
  deckAEqHigh,
  deckAEqMid,
  deckAEqLow,
  deckAVolume,
  deckBGain,
  deckBEqHigh,
  deckBEqMid,
  deckBEqLow,
  deckBVolume,
  crossfader,
  vuLevelA,
  vuLevelB,
  onDeckAGainChange,
  onDeckAEqChange,
  onDeckAVolumeChange,
  onDeckBGainChange,
  onDeckBEqChange,
  onDeckBVolumeChange,
  onCrossfaderChange,
}: MixerStripProps) {
  const [crossfaderCurve, setCrossfaderCurve] = useState<"smooth" | "sharp" | "cut">("smooth");

  return (
    <div className="bg-[#111111] border-t border-b border-[rgba(255,255,255,0.1)] py-4">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-center gap-8">
          {/* CHANNEL A */}
          <div className="flex flex-col items-center gap-3">
            {/* Channel Label */}
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest font-['Rajdhani']">CH A</span>
            
            <MixerKnob value={deckAGain} onChange={onDeckAGainChange} label="GAIN" size={50} />
            
            <div className="flex gap-2">
              <MixerKnob value={deckAEqHigh} onChange={(val) => onDeckAEqChange("high", val)} label="HI" />
              <MixerKnob value={deckAEqMid} onChange={(val) => onDeckAEqChange("mid", val)} label="MID" />
              <MixerKnob value={deckAEqLow} onChange={(val) => onDeckAEqChange("low", val)} label="LOW" />
            </div>

            {/* Volume Fader - taller */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="relative w-8 h-[140px] bg-[#0a0a0a] rounded border border-white/10">
                {/* Fader fill */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00D4FF] to-[#00D4FF80] rounded-b transition-all"
                  style={{ height: `${deckAVolume}%` }}
                />
                {/* Fader cap - lighter for visibility */}
                <div
                  className="absolute w-[36px] h-3 left-1/2 transform -translate-x-1/2 rounded cursor-pointer shadow-lg"
                  style={{ 
                    top: `${100 - deckAVolume}%`, 
                    transform: `translateX(-50%) translateY(-50%)`,
                    background: 'linear-gradient(to bottom, #666, #444)',
                    border: '1px solid #555',
                  }}
                  onMouseDown={(e) => {
                    const handleMove = (moveEvent: MouseEvent) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (!rect) return;
                      const y = rect.bottom - moveEvent.clientY;
                      const newValue = Math.max(0, Math.min(100, (y / rect.height) * 100));
                      onDeckAVolumeChange(newValue);
                    };
                    
                    const handleUp = () => {
                      window.removeEventListener("mousemove", handleMove);
                      window.removeEventListener("mouseup", handleUp);
                    };
                    
                    window.addEventListener("mousemove", handleMove);
                    window.addEventListener("mouseup", handleUp);
                  }}
                />
              </div>
              {/* A label below fader */}
              <span className="text-[#00D4FF] text-lg font-bold font-['Rajdhani']">A</span>
            </div>
          </div>

          {/* CENTER: VU METERS & CROSSFADER */}
          <div className="flex flex-col items-center gap-4">
            {/* VU Meters */}
            <div className="flex gap-4">
              <VUMeter level={vuLevelA} label="L" />
              <VUMeter level={vuLevelB} label="R" />
            </div>

            {/* Crossfader curve buttons */}
            <div className="flex gap-1">
              {(["smooth", "sharp", "cut"] as const).map((curve) => (
                <button
                  key={curve}
                  onClick={() => setCrossfaderCurve(curve)}
                  className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded transition ${
                    crossfaderCurve === curve
                      ? "bg-[#00D4FF] text-black"
                      : "bg-[#1a1a1a] text-white/40 hover:text-white/60"
                  }`}
                >
                  {curve}
                </button>
              ))}
            </div>

            {/* Crossfader */}
            <div className="flex items-center gap-3">
              <span className="text-[#00D4FF] text-sm font-bold font-['Rajdhani']">A</span>
              <div className="relative w-[200px] h-8 bg-[#0a0a0a] rounded border border-white/10">
                {/* Crossfader cap - lighter for visibility */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-10 h-6 rounded cursor-pointer shadow-lg"
                  style={{ 
                    left: `${crossfader}%`, 
                    transform: `translateX(-50%) translateY(-50%)`,
                    background: 'linear-gradient(to bottom, #777, #555)',
                    border: '1px solid #666',
                  }}
                  onMouseDown={(e) => {
                    const handleMove = (moveEvent: MouseEvent) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (!rect) return;
                      const x = moveEvent.clientX - rect.left;
                      const newValue = Math.max(0, Math.min(100, (x / rect.width) * 100));
                      onCrossfaderChange(newValue);
                    };
                    
                    const handleUp = () => {
                      window.removeEventListener("mousemove", handleMove);
                      window.removeEventListener("mouseup", handleUp);
                    };
                    
                    window.addEventListener("mousemove", handleMove);
                    window.addEventListener("mouseup", handleUp);
                  }}
                />
              </div>
              <span className="text-[#00D4FF] text-sm font-bold font-['Rajdhani']">B</span>
            </div>
            <span className="text-white/40 text-[10px] uppercase font-['Rajdhani'] tracking-wider">
              CROSSFADER
            </span>
          </div>

          {/* CHANNEL B */}
          <div className="flex flex-col items-center gap-3">
            {/* Channel Label */}
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest font-['Rajdhani']">CH B</span>
            
            <MixerKnob value={deckBGain} onChange={onDeckBGainChange} label="GAIN" size={50} />
            
            <div className="flex gap-2">
              <MixerKnob value={deckBEqHigh} onChange={(val) => onDeckBEqChange("high", val)} label="HI" />
              <MixerKnob value={deckBEqMid} onChange={(val) => onDeckBEqChange("mid", val)} label="MID" />
              <MixerKnob value={deckBEqLow} onChange={(val) => onDeckBEqChange("low", val)} label="LOW" />
            </div>

            {/* Volume Fader - taller */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="relative w-8 h-[140px] bg-[#0a0a0a] rounded border border-white/10">
                {/* Fader fill */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00D4FF] to-[#00D4FF80] rounded-b transition-all"
                  style={{ height: `${deckBVolume}%` }}
                />
                {/* Fader cap - lighter for visibility */}
                <div
                  className="absolute w-[36px] h-3 left-1/2 transform -translate-x-1/2 rounded cursor-pointer shadow-lg"
                  style={{ 
                    top: `${100 - deckBVolume}%`, 
                    transform: `translateX(-50%) translateY(-50%)`,
                    background: 'linear-gradient(to bottom, #666, #444)',
                    border: '1px solid #555',
                  }}
                  onMouseDown={(e) => {
                    const handleMove = (moveEvent: MouseEvent) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (!rect) return;
                      const y = rect.bottom - moveEvent.clientY;
                      const newValue = Math.max(0, Math.min(100, (y / rect.height) * 100));
                      onDeckBVolumeChange(newValue);
                    };
                    
                    const handleUp = () => {
                      window.removeEventListener("mousemove", handleMove);
                      window.removeEventListener("mouseup", handleUp);
                    };
                    
                    window.addEventListener("mousemove", handleMove);
                    window.addEventListener("mouseup", handleUp);
                  }}
                />
              </div>
              {/* B label below fader */}
              <span className="text-[#00D4FF] text-lg font-bold font-['Rajdhani']">B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

