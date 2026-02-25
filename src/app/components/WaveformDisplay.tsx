import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Gauge,
  Plus,
  Minus
} from 'lucide-react';

interface CuePoint {
  id: string;
  position: number; // 0-100
  color: 'red' | 'green' | 'yellow' | 'blue';
  label: string;
}

interface WaveformDisplayProps {
  trackTitle: string;
  bpm: number;
  musicalKey: string;
  camelotKey: string;
  duration: number; // in seconds
  currentTime?: number; // in seconds
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSeek?: (position: number) => void;
  cuePoints?: CuePoint[];
  variant?: 'full' | 'compact' | 'inline';
}

export function WaveformDisplay({
  trackTitle,
  bpm,
  musicalKey,
  camelotKey,
  duration,
  currentTime = 0,
  isPlaying = false,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  cuePoints = [],
  variant = 'full'
}: WaveformDisplayProps) {
  const [playhead, setPlayhead] = useState((currentTime / duration) * 100);
  const [tempo, setTempo] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Generate waveform data (simulated)
  const generateWaveformData = () => {
    const bars = variant === 'compact' ? 100 : 200;
    return Array.from({ length: bars }, (_, i) => {
      const position = i / bars;
      const beatPhase = (position * duration * (bpm / 60)) % 1;
      const isKick = beatPhase < 0.1;
      
      // Simulate frequency distribution
      const bass = Math.random() * 0.6 + (isKick ? 0.4 : 0);
      const mid = Math.random() * 0.5;
      const high = Math.random() * 0.3;
      
      return {
        bass,
        mid,
        high,
        total: Math.max(bass, mid, high)
      };
    });
  };

  const [waveformData] = useState(generateWaveformData());

  useEffect(() => {
    setPlayhead((currentTime / duration) * 100);
  }, [currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || !onSeek) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    setPlayhead(position);
    onSeek((position / 100) * duration);
  };

  const handleCuePointClick = (position: number) => {
    if (onSeek) {
      setPlayhead(position);
      onSeek((position / 100) * duration);
    }
  };

  const getCueColor = (color: string) => {
    switch (color) {
      case 'red': return '#ff0000';
      case 'green': return '#00ff00';
      case 'yellow': return '#ffff00';
      case 'blue': return '#0099ff';
      default: return '#ff6b35';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] p-3 space-y-2">
        {/* Compact waveform */}
        <div 
          ref={waveformRef}
          className="h-16 relative cursor-pointer"
          onClick={handleWaveformClick}
        >
          {/* Waveform bars */}
          <div className="flex items-end justify-between h-full gap-[1px]">
            {waveformData.map((bar, i) => {
              const isPast = (i / waveformData.length) * 100 < playhead;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]">
                  {/* High frequencies */}
                  <div 
                    style={{ 
                      height: `${bar.high * 100}%`,
                      backgroundColor: isPast ? '#ffff00' : '#555555'
                    }}
                    className="w-full transition-colors"
                  />
                  {/* Mid frequencies */}
                  <div 
                    style={{ 
                      height: `${bar.mid * 100}%`,
                      backgroundColor: isPast ? '#ff9900' : '#444444'
                    }}
                    className="w-full transition-colors"
                  />
                  {/* Bass frequencies */}
                  <div 
                    style={{ 
                      height: `${bar.bass * 100}%`,
                      backgroundColor: isPast ? '#0099ff' : '#333333'
                    }}
                    className="w-full transition-colors"
                  />
                </div>
              );
            })}
          </div>

          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-[#ff6b35] z-10"
            style={{ left: `${playhead}%` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#ff6b35] rounded-full border-2 border-black" />
          </div>

          {/* Cue points */}
          {cuePoints.map(cue => (
            <div
              key={cue.id}
              className="absolute top-0 bottom-0 w-[2px] cursor-pointer hover:w-1 transition-all"
              style={{ 
                left: `${cue.position}%`,
                backgroundColor: getCueColor(cue.color)
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCuePointClick(cue.position);
              }}
            >
              <div 
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-black"
                style={{ backgroundColor: getCueColor(cue.color) }}
              />
            </div>
          ))}
        </div>

        {/* Controls and info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onPlayPause}
              className="w-8 h-8 rounded-full bg-[#ff6b35] hover:bg-[#ff8555] flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              )}
            </button>
            <div className="text-xs text-[#888]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="text-[#ff6b35] font-bold">{bpm} BPM</div>
            <div className="text-[#00aaff] font-bold">{camelotKey}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] overflow-hidden">
      {/* Top info bar */}
      <div className="bg-[#141414] border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs text-[#888] mb-1">BPM</div>
            <div className="text-2xl font-bold text-[#ff6b35] tabular-nums">{bpm}</div>
          </div>
          <div>
            <div className="text-xs text-[#888] mb-1">KEY</div>
            <div className="text-lg font-bold text-[#00aaff]">{camelotKey} <span className="text-sm text-[#888]">({musicalKey})</span></div>
          </div>
          <div>
            <div className="text-xs text-[#888] mb-1">TIME</div>
            <div className="text-lg font-mono text-white tabular-nums">
              {formatTime(currentTime)} <span className="text-[#666]">/</span> {formatTime(duration)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#888] mb-1">REMAIN</div>
            <div className="text-lg font-mono text-[#ff6b35] tabular-nums">
              -{formatTime(duration - currentTime)}
            </div>
          </div>
        </div>

        {/* Tempo control */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-[#888]">TEMPO</div>
          <button
            onClick={() => setTempo(Math.max(-16, tempo - 1))}
            className="w-7 h-7 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors"
          >
            <Minus className="w-3 h-3 text-[#888]" />
          </button>
          <div className="w-16 text-center">
            <div className={`text-lg font-mono font-bold tabular-nums ${
              tempo === 0 ? 'text-white' : tempo > 0 ? 'text-[#00ff00]' : 'text-[#ff0000]'
            }`}>
              {tempo > 0 ? '+' : ''}{tempo.toFixed(1)}%
            </div>
          </div>
          <button
            onClick={() => setTempo(Math.min(16, tempo + 1))}
            className="w-7 h-7 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors"
          >
            <Plus className="w-3 h-3 text-[#888]" />
          </button>
          <button
            onClick={() => setTempo(0)}
            className="px-3 py-1 text-xs bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded transition-colors text-[#888]"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Main waveform */}
      <div className="px-6 py-6">
        <div 
          ref={waveformRef}
          className="h-32 relative cursor-pointer"
          onClick={handleWaveformClick}
        >
          {/* Beat grid */}
          {Array.from({ length: Math.floor((duration * bpm) / 60) }).map((_, i) => {
            const position = (i / Math.floor((duration * bpm) / 60)) * 100;
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-[1px] bg-[#222]"
                style={{ left: `${position}%` }}
              />
            );
          })}

          {/* Waveform bars */}
          <div className="flex items-end justify-between h-full gap-[2px]">
            {waveformData.map((bar, i) => {
              const position = (i / waveformData.length) * 100;
              const isPast = position < playhead;
              const isNearPlayhead = Math.abs(position - playhead) < 2;
              
              return (
                <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]">
                  {/* High frequencies */}
                  <div 
                    style={{ 
                      height: `${bar.high * 100}%`,
                      backgroundColor: isPast ? '#ffff00' : '#444444',
                      boxShadow: isNearPlayhead && isPast ? '0 0 4px #ffff00' : 'none'
                    }}
                    className="w-full transition-all"
                  />
                  {/* Mid frequencies */}
                  <div 
                    style={{ 
                      height: `${bar.mid * 100}%`,
                      backgroundColor: isPast ? '#ff9900' : '#393939',
                      boxShadow: isNearPlayhead && isPast ? '0 0 4px #ff9900' : 'none'
                    }}
                    className="w-full transition-all"
                  />
                  {/* Bass frequencies */}
                  <div 
                    style={{ 
                      height: `${bar.bass * 100}%`,
                      backgroundColor: isPast ? '#0099ff' : '#2a2a2a',
                      boxShadow: isNearPlayhead && isPast ? '0 0 4px #0099ff' : 'none'
                    }}
                    className="w-full transition-all"
                  />
                </div>
              );
            })}
          </div>

          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-[3px] bg-[#ff6b35] z-20 shadow-[0_0_10px_rgba(255,107,53,0.6)]"
            style={{ left: `${playhead}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ff6b35] rounded-full border-2 border-black shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ff6b35] rounded-full border-2 border-black shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
          </div>

          {/* Cue points */}
          {cuePoints.map(cue => (
            <div
              key={cue.id}
              className="absolute top-0 bottom-0 w-[3px] cursor-pointer hover:w-1.5 transition-all z-10 group"
              style={{ 
                left: `${cue.position}%`,
                backgroundColor: getCueColor(cue.color),
                boxShadow: `0 0 8px ${getCueColor(cue.color)}80`
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCuePointClick(cue.position);
              }}
            >
              <div 
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-black"
                style={{ 
                  backgroundColor: getCueColor(cue.color),
                  boxShadow: `0 0 6px ${getCueColor(cue.color)}`
                }}
              />
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-black"
                style={{ 
                  backgroundColor: getCueColor(cue.color),
                  boxShadow: `0 0 6px ${getCueColor(cue.color)}`
                }}
              />
              {/* Cue point label tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-[#2a2a2a] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {cue.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mini waveform overview */}
        <div 
          className="h-8 mt-4 relative cursor-pointer"
          onClick={handleWaveformClick}
        >
          <div className="flex items-end justify-between h-full gap-[1px]">
            {waveformData.map((bar, i) => (
              <div 
                key={i}
                style={{ 
                  height: `${bar.total * 100}%`,
                  backgroundColor: '#333333'
                }}
                className="flex-1"
              />
            ))}
          </div>

          {/* Current position indicator */}
          <div 
            className="absolute top-0 bottom-0 bg-[#ff6b35] opacity-30"
            style={{ 
              left: `${Math.max(0, playhead - 2)}%`,
              width: '4%'
            }}
          />

          {/* Cue points on mini waveform */}
          {cuePoints.map(cue => (
            <div
              key={cue.id}
              className="absolute top-0 bottom-0 w-[2px]"
              style={{ 
                left: `${cue.position}%`,
                backgroundColor: getCueColor(cue.color)
              }}
            />
          ))}
        </div>
      </div>

      {/* Control buttons */}
      <div className="bg-[#141414] border-t border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevious}
            className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors"
          >
            <SkipBack className="w-5 h-5 text-white fill-white" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-14 h-14 rounded-full bg-[#ff6b35] hover:bg-[#ff8555] flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(255,107,53,0.4)]"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-white fill-white" />
            ) : (
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            )}
          </button>

          <button
            onClick={onNext}
            className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors"
          >
            <SkipForward className="w-5 h-5 text-white fill-white" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isLooping 
                ? 'bg-[#ff6b35] text-white' 
                : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#888]'
            }`}
          >
            <Repeat className="w-5 h-5" />
          </button>

          <button
            className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors"
          >
            <Gauge className="w-5 h-5 text-[#888]" />
          </button>
        </div>

        {/* Cue point buttons */}
        <div className="flex items-center gap-2">
          {['red', 'green', 'yellow', 'blue'].map((color, i) => (
            <button
              key={color}
              className="w-8 h-8 rounded border-2 border-[#2a2a2a] hover:border-[#3a3a3a] flex items-center justify-center text-xs font-bold transition-colors"
              style={{ 
                backgroundColor: getCueColor(color as any),
                color: color === 'yellow' ? '#000' : '#fff'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}