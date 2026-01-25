import React from 'react';
import { Volume2 } from 'lucide-react';

interface ChannelStripProps {
  deck: 'A' | 'B';
  volume: number;
  eqHigh: number;
  eqMid: number;
  eqLow: number;
  gain: number;
  filter: number;
  onVolumeChange: (value: number) => void;
  onEQChange: (band: 'high' | 'mid' | 'low', value: number) => void;
  onGainChange: (value: number) => void;
  onFilterChange: (value: number) => void;
  color: string;
}

export default function ChannelStrip({
  deck,
  volume,
  eqHigh,
  eqMid,
  eqLow,
  gain,
  filter,
  onVolumeChange,
  onEQChange,
  onGainChange,
  onFilterChange,
  color
}: ChannelStripProps) {
  const isOrange = color === '#f97316';
  const bgColor = isOrange ? 'bg-orange-500' : 'bg-cyan-500';
  const bgColorLight = isOrange ? 'bg-orange-500/20' : 'bg-cyan-500/20';
  const textColor = isOrange ? 'text-orange-400' : 'text-cyan-400';
  const borderColor = isOrange ? 'border-orange-500/30' : 'border-cyan-500/30';

  const Knob = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void;
  }) => {
    const degrees = (value - 0.5) * 270;
    
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-12 h-12">
          {/* Knob background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner" />
          
          {/* Knob ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeDasharray={`${((value) * 125.6)} 125.6`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Knob indicator */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${degrees}deg)` }}
          >
            <div className={`w-1 h-5 ${bgColor} rounded-full shadow-lg`} style={{ marginTop: '-10px' }} />
          </div>
          
          {/* Interactive overlay */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
          {label}
        </span>
        <span className={`text-xs ${textColor} font-mono font-bold`}>
          {Math.round(value * 100)}
        </span>
      </div>
    );
  };

  const VerticalFader = ({ 
    value, 
    onChange 
  }: { 
    value: number; 
    onChange: (v: number) => void;
  }) => {
    const db = Math.round((value - 0.8) * 50);
    
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-12 h-40 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
          {/* Fader track */}
          <div className="absolute inset-x-2 inset-y-4">
            <div className="w-full h-full bg-gray-800 rounded-sm" />
            
            {/* Fill */}
            <div
              className={`absolute bottom-0 left-0 right-0 ${bgColor} rounded-sm transition-all`}
              style={{ height: `${value * 100}%` }}
            />
            
            {/* Fader thumb */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-10 h-4 bg-gradient-to-b from-gray-300 to-gray-500 rounded shadow-lg border border-gray-600 cursor-pointer"
              style={{ 
                bottom: `calc(${value * 100}% - 8px)`,
                boxShadow: `0 0 10px ${color}40`
              }}
            />
          </div>
          
          {/* Input overlay */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{ transform: 'rotate(180deg)' }}
          />
        </div>
        
        {/* Volume indicator */}
        <div className="flex flex-col items-center">
          <Volume2 className={`w-4 h-4 ${textColor} mb-1`} />
          <span className={`text-xs ${textColor} font-mono font-bold`}>
            {db > 0 ? '+' : ''}{db} dB
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl border ${borderColor} p-4 flex flex-col gap-6`}>
      {/* Deck label */}
      <div className="text-center">
        <div className={`text-sm font-bold ${textColor} uppercase tracking-wider mb-1`}>
          DECK {deck}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
      </div>

      {/* Volume Fader */}
      <div className="flex justify-center">
        <VerticalFader value={volume} onChange={onVolumeChange} />
      </div>

      {/* EQ Section */}
      <div>
        <div className="text-center mb-3">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Equalizer
          </span>
        </div>
        <div className="flex justify-around">
          <Knob label="High" value={eqHigh} onChange={(v) => onEQChange('high', v)} />
          <Knob label="Mid" value={eqMid} onChange={(v) => onEQChange('mid', v)} />
          <Knob label="Low" value={eqLow} onChange={(v) => onEQChange('low', v)} />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      {/* Gain & Filter */}
      <div className="flex justify-around">
        <Knob label="Gain" value={gain} onChange={onGainChange} />
        <Knob label="Filter" value={filter} onChange={onFilterChange} />
      </div>
    </div>
  );
}
