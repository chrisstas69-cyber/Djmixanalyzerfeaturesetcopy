import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Sliders } from 'lucide-react';

interface TransportControlsProps {
  deck: 'A' | 'B';
  isPlaying: boolean;
  pitch: number;
  loopEnabled: boolean;
  hasCuePoints: boolean;
  onPlayPause: () => void;
  onPitchChange: (pitch: number) => void;
  onLoopToggle: () => void;
  onPrevCue: () => void;
  onNextCue: () => void;
  color: string;
}

export default function TransportControls({
  deck,
  isPlaying,
  pitch,
  loopEnabled,
  hasCuePoints,
  onPlayPause,
  onPitchChange,
  onLoopToggle,
  onPrevCue,
  onNextCue,
  color
}: TransportControlsProps) {
  const isOrange = color === '#f97316';
  const bgColor = isOrange ? 'bg-orange-500' : 'bg-cyan-500';
  const textColor = isOrange ? 'text-orange-400' : 'text-cyan-400';
  const borderColor = isOrange ? 'border-orange-500/30' : 'border-cyan-500/30';

  return (
    <div className={`bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl border ${borderColor} p-4`}>
      {/* Deck label */}
      <div className="text-center mb-4">
        <div className={`text-sm font-bold ${textColor} uppercase tracking-wider`}>
          DECK {deck}
        </div>
      </div>

      {/* Transport buttons */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={onPrevCue}
          disabled={!hasCuePoints}
          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous cue point"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={onPlayPause}
          className={`${bgColor} hover:opacity-90 text-white rounded-full p-4 transition-all shadow-lg`}
          style={{ boxShadow: isPlaying ? `0 0 20px ${color}80` : 'none' }}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>

        <button
          onClick={onNextCue}
          disabled={!hasCuePoints}
          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next cue point"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Pitch control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Pitch
            </span>
          </div>
          <span className={`text-sm ${textColor} font-mono font-bold`}>
            {pitch > 0 ? '+' : ''}{pitch.toFixed(1)}%
          </span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="-50"
            max="50"
            step="0.1"
            value={pitch}
            onChange={(e) => onPitchChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                ${color} 0%, 
                ${color} ${((pitch + 50) / 100) * 100}%, 
                #374151 ${((pitch + 50) / 100) * 100}%, 
                #374151 100%)`
            }}
          />
          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-600 pointer-events-none" />
        </div>
        
        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
          <span>-50%</span>
          <span>0</span>
          <span>+50%</span>
        </div>
      </div>

      {/* Loop control */}
      <button
        onClick={onLoopToggle}
        className={`w-full py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          loopEnabled
            ? `${bgColor} text-white shadow-lg`
            : `bg-gray-800 text-gray-400 hover:text-white`
        }`}
      >
        <Repeat className="w-4 h-4" />
        Loop {loopEnabled ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
