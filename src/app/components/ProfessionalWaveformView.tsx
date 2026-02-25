import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Radio } from 'lucide-react';
import { motion } from 'motion/react';

interface CuePoint {
  position: number; // 0-1
  color: 'red' | 'green' | 'yellow' | 'blue';
  label: string;
}

interface ProfessionalWaveformViewProps {
  mode?: 'full' | 'compact';
  bpm?: number;
  musicalKey?: string;
  keyNotation?: string;
  currentTime?: number; // in seconds
  totalTime?: number; // in seconds
  isPlaying?: boolean;
  tempo?: number; // percentage change
  onPlay?: () => void;
  onPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onLoop?: () => void;
  onSync?: () => void;
  onTempoChange?: (value: number) => void;
  onTempoReset?: () => void;
  onSeek?: (position: number) => void;
  onCueJump?: (cuePoint: CuePoint) => void;
}

export function ProfessionalWaveformView({
  mode = 'full',
  bpm = 128,
  musicalKey = '4A',
  keyNotation = 'A minor',
  currentTime = 3,
  totalTime = 444, // 7:24
  isPlaying = false,
  tempo = 0.0,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onLoop,
  onSync,
  onTempoChange,
  onTempoReset,
  onSeek,
  onCueJump
}: ProfessionalWaveformViewProps) {
  const [hoveredCue, setHoveredCue] = useState<number | null>(null);
  
  const progress = currentTime / totalTime;
  const remainingTime = totalTime - currentTime;

  // Cue points
  const cuePoints: CuePoint[] = [
    { position: 0.12, color: 'red', label: 'Intro' },
    { position: 0.35, color: 'green', label: 'Drop' },
    { position: 0.65, color: 'yellow', label: 'Breakdown' },
    { position: 0.85, color: 'blue', label: 'Outro' }
  ];

  const formatTime = (seconds: number, showSign: boolean = false) => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.floor(Math.abs(seconds) % 60);
    const sign = showSign && seconds < 0 ? '-' : '';
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCueColor = (color: string) => {
    switch (color) {
      case 'red': return '#ff4444';
      case 'green': return '#44ff44';
      case 'yellow': return '#ffff44';
      case 'blue': return '#4444ff';
      default: return '#ffffff';
    }
  };

  const WaveformDisplay = ({ height }: { height: number }) => {
    const bars = mode === 'full' ? 200 : 100;
    
    // Generate waveform data
    const waveformData = Array.from({ length: bars }, (_, i) => {
      const position = i / bars;
      const wave1 = Math.sin(position * Math.PI * 8) * 0.5 + 0.5;
      const wave2 = Math.sin(position * Math.PI * 3) * 0.3 + 0.7;
      const noise = Math.random() * 0.2;
      
      let amplitude = (wave1 * 0.4 + wave2 * 0.4 + noise * 0.2);
      
      // Create dynamic sections
      let sectionMultiplier = 1;
      let isIntro = false;
      let isBreakdown = false;
      
      if (position < 0.15) {
        sectionMultiplier = 0.5;
        isIntro = true;
      } else if (position > 0.15 && position < 0.35) {
        sectionMultiplier = 0.95;
      } else if (position > 0.35 && position < 0.65) {
        sectionMultiplier = 1.0;
      } else if (position > 0.65 && position < 0.85) {
        sectionMultiplier = 0.6;
        isBreakdown = true;
      } else if (position > 0.85) {
        sectionMultiplier = 0.4;
      }
      
      return {
        amplitude: amplitude * sectionMultiplier,
        isIntro,
        isBreakdown
      };
    });

    const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onSeek) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const position = x / rect.width;
      onSeek(position);
    };

    return (
      <div 
        className="relative w-full cursor-pointer"
        style={{ height: `${height}px` }}
        onClick={handleWaveformClick}
      >
        {/* Waveform bars */}
        <div className="flex items-center justify-between h-full">
          {waveformData.map((data, index) => {
            const position = index / bars;
            const isPast = position <= progress;
            
            let barColor = isPast ? '#666666' : '#333333';
            if (data.isIntro || data.isBreakdown) {
              barColor = isPast ? '#ff6b35' : '#ff6b35aa';
            }
            
            return (
              <div
                key={index}
                className="flex-1 mx-px flex items-center justify-center"
              >
                <div
                  style={{
                    width: '100%',
                    height: `${data.amplitude * 100}%`,
                    backgroundColor: barColor,
                    borderRadius: '1px',
                    transition: 'background-color 0.1s ease'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Cue point markers */}
        {cuePoints.map((cue, index) => (
          <div
            key={index}
            className="absolute top-0 bottom-0 w-0.5 cursor-pointer group"
            style={{
              left: `${cue.position * 100}%`,
              backgroundColor: getCueColor(cue.color)
            }}
            onMouseEnter={() => setHoveredCue(index)}
            onMouseLeave={() => setHoveredCue(null)}
            onClick={(e) => {
              e.stopPropagation();
              onCueJump?.(cue);
            }}
          >
            {/* Cue marker dots */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: getCueColor(cue.color) }}
            />
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: getCueColor(cue.color) }}
            />
            
            {/* Tooltip */}
            {hoveredCue === index && mode === 'full' && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-[var(--border-medium)] rounded text-xs whitespace-nowrap">
                {cue.label}
              </div>
            )}
          </div>
        ))}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#ff6b35] shadow-[0_0_8px_rgba(255,107,53,0.8)] z-10 pointer-events-none"
          style={{
            left: `${progress * 100}%`,
            transition: 'left 0.1s linear'
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#ff6b35] rounded-full shadow-[0_0_8px_rgba(255,107,53,1)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#ff6b35] rounded-full shadow-[0_0_8px_rgba(255,107,53,1)]" />
        </div>
      </div>
    );
  };

  if (mode === 'compact') {
    return (
      <div className="bg-[#0a0a0a] border border-[var(--border-medium)] rounded-lg p-4">
        <div className="flex items-center gap-4">
          {/* Play button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center hover:bg-[#ff8555] transition-colors flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* Compact waveform */}
          <div className="flex-1">
            <WaveformDisplay height={40} />
          </div>

          {/* Time and info */}
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-mono text-white">
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </div>
            <div className="text-xs text-[var(--text-tertiary)] mt-1">
              {bpm} BPM • {musicalKey}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-[var(--border-medium)] rounded-xl p-6 space-y-4">
      {/* Top metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">BPM</div>
            <div className="text-2xl font-bold text-[#ff6b35]">{bpm}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">KEY</div>
            <div className="text-2xl font-bold text-[#4499ff]">{musicalKey}</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{keyNotation}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">TIME</div>
            <div className="text-xl font-mono text-white">{formatTime(currentTime)} / {formatTime(totalTime)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">REMAIN</div>
            <div className="text-xl font-mono text-[#ff4444]">{formatTime(-remainingTime, true)}</div>
          </div>
        </div>

        {/* Tempo controls */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">TEMPO</div>
            <div className="text-xl font-mono text-white">{tempo >= 0 ? '+' : ''}{tempo.toFixed(1)}%</div>
          </div>
          <button
            onClick={onTempoReset}
            className="px-4 py-2 bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] text-[var(--text-primary)] rounded-lg transition-colors text-sm font-medium"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Waveform */}
      <div className="bg-black rounded-lg p-4">
        <WaveformDisplay height={120} />
      </div>

      {/* Transport controls and cue buttons */}
      <div className="flex items-center justify-between">
        {/* Transport controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="w-12 h-12 rounded-full bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] flex items-center justify-center transition-colors text-[var(--text-primary)]"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-16 h-16 rounded-full bg-[#ff6b35] hover:bg-[#ff8555] flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
            )}
          </button>

          <button
            onClick={onNext}
            className="w-12 h-12 rounded-full bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] flex items-center justify-center transition-colors text-[var(--text-primary)]"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <div className="w-px h-12 bg-[var(--border-subtle)] mx-2" />

          <button
            onClick={onLoop}
            className="w-12 h-12 rounded-full bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] flex items-center justify-center transition-colors text-[var(--text-secondary)] hover:text-[#ff6b35]"
          >
            <Repeat className="w-5 h-5" />
          </button>

          <button
            onClick={onSync}
            className="w-12 h-12 rounded-full bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] flex items-center justify-center transition-colors text-[var(--text-secondary)] hover:text-[#ff6b35]"
          >
            <Radio className="w-5 h-5" />
          </button>
        </div>

        {/* Cue buttons */}
        <div className="flex items-center gap-2">
          {cuePoints.map((cue, index) => (
            <button
              key={index}
              onClick={() => onCueJump?.(cue)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 border-2"
              style={{
                backgroundColor: getCueColor(cue.color),
                borderColor: getCueColor(cue.color),
                opacity: 0.9
              }}
              title={cue.label}
            >
              <span className="text-black font-bold text-sm">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
