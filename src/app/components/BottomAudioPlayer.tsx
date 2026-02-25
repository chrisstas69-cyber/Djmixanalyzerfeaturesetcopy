import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Star,
  MoreHorizontal,
  Maximize2
} from 'lucide-react';

interface CuePoint {
  position: number; // 0-1
  color: 'red' | 'green' | 'yellow' | 'blue';
  label: string;
}

interface BottomAudioPlayerProps {
  trackTitle?: string;
  bpm?: number;
  musicalKey?: string;
  genre?: string;
  albumArt?: string;
  currentTime?: number; // in seconds
  totalTime?: number; // in seconds
  isPlaying?: boolean;
  volume?: number; // 0-1
  isLooping?: boolean;
  isFavorite?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
  onToggleLoop?: () => void;
  onToggleFavorite?: () => void;
  onOpenWaveformView?: () => void;
  onMoreOptions?: () => void;
}

export function BottomAudioPlayer({
  trackTitle = 'Deep Techno Journey',
  bpm = 128,
  musicalKey = '4A',
  genre = 'Techno',
  albumArt,
  currentTime = 31,
  totalTime = 444, // 7:24
  isPlaying = false,
  volume = 0.75,
  isLooping = false,
  isFavorite = false,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleLoop,
  onToggleFavorite,
  onOpenWaveformView,
  onMoreOptions
}: BottomAudioPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  const progress = currentTime / totalTime;

  const cuePoints: CuePoint[] = [
    { position: 0.12, color: 'red', label: 'Intro' },
    { position: 0.35, color: 'green', label: 'Drop' },
    { position: 0.65, color: 'yellow', label: 'Breakdown' },
    { position: 0.85, color: 'blue', label: 'Outro' }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = x / rect.width;
    onSeek?.(position);
  };

  const handleWaveformMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = x / rect.width;
    setHoveredPosition(position);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange?.(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Generate waveform data
  const bars = 200;
  const waveformData = Array.from({ length: bars }, (_, i) => {
    const position = i / bars;
    const wave1 = Math.sin(position * Math.PI * 8) * 0.5 + 0.5;
    const wave2 = Math.sin(position * Math.PI * 3) * 0.3 + 0.7;
    const noise = Math.random() * 0.2;
    
    let amplitude = (wave1 * 0.4 + wave2 * 0.4 + noise * 0.2);
    
    // Dynamic sections
    let sectionMultiplier = 1;
    let isLoud = false;
    
    if (position < 0.15) {
      sectionMultiplier = 0.5;
    } else if (position > 0.15 && position < 0.35) {
      sectionMultiplier = 0.95;
    } else if (position > 0.35 && position < 0.65) {
      sectionMultiplier = 1.0;
      isLoud = true;
    } else if (position > 0.65 && position < 0.85) {
      sectionMultiplier = 0.6;
    } else if (position > 0.85) {
      sectionMultiplier = 0.4;
    }
    
    return {
      amplitude: amplitude * sectionMultiplier,
      isLoud
    };
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[var(--border-medium)] z-40">
      {/* Waveform Row */}
      <div 
        className="relative h-[50px] cursor-pointer group"
        onClick={handleWaveformClick}
        onMouseMove={handleWaveformMouseMove}
        onMouseLeave={() => setHoveredPosition(null)}
      >
        {/* Waveform bars */}
        <div className="flex items-center justify-between h-full px-4">
          {waveformData.map((data, index) => {
            const position = index / bars;
            const isPast = position <= progress;
            
            let barColor = '#333333';
            if (isPast) {
              barColor = data.isLoud ? '#ff6b35' : '#666666';
            } else {
              barColor = data.isLoud ? '#ff6b3555' : '#333333';
            }
            
            return (
              <div
                key={index}
                className="flex-1 mx-px flex items-center justify-center"
              >
                <div
                  style={{
                    width: '100%',
                    height: `${data.amplitude * 80}%`,
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
            className="absolute top-0 bottom-0 w-1 cursor-pointer"
            style={{
              left: `${cue.position * 100}%`,
              backgroundColor: getCueColor(cue.color) + '88'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSeek?.(cue.position);
            }}
          >
            <div 
              className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: getCueColor(cue.color) }}
            />
          </div>
        ))}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#ff6b35] shadow-[0_0_8px_rgba(255,107,53,0.8)] pointer-events-none"
          style={{
            left: `${progress * 100}%`,
            transition: 'left 0.1s linear'
          }}
        >
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#ff6b35] rounded-full shadow-[0_0_6px_rgba(255,107,53,1)]" />
        </div>

        {/* Hover time indicator */}
        {hoveredPosition !== null && (
          <div
            className="absolute -top-8 px-2 py-1 bg-black border border-[var(--border-medium)] rounded text-xs text-white font-mono pointer-events-none"
            style={{
              left: `${hoveredPosition * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {formatTime(hoveredPosition * totalTime)}
          </div>
        )}
      </div>

      {/* Controls Row */}
      <div className="h-[50px] px-4 flex items-center justify-between gap-4">
        {/* Left: Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Album Art */}
          <div className="w-10 h-10 rounded bg-gradient-to-br from-[#ff6b35] to-[#ff8555] flex items-center justify-center flex-shrink-0">
            {albumArt ? (
              <img src={albumArt} alt={trackTitle} className="w-full h-full rounded object-cover" />
            ) : (
              <div className="text-white text-xs font-bold">SA</div>
            )}
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-bold truncate">{trackTitle}</div>
            <div className="text-[var(--text-tertiary)] text-xs truncate">
              {bpm} BPM • {musicalKey} • {genre}
            </div>
          </div>
        </div>

        {/* Center: Transport Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevious}
            className="w-8 h-8 rounded-full hover:bg-[var(--surface-panel)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4" fill="currentColor" />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-10 h-10 rounded-full bg-[#ff6b35] hover:bg-[#ff8555] flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            onClick={onNext}
            className="w-8 h-8 rounded-full hover:bg-[var(--surface-panel)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" fill="currentColor" />
          </button>

          <div className="text-xs font-mono text-[var(--text-secondary)] ml-2">
            {formatTime(currentTime)} / {formatTime(totalTime)}
          </div>
        </div>

        {/* Right: Utility Controls */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Volume */}
          <div className="flex items-center gap-2 group">
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-full hover:bg-[var(--surface-panel)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            
            <div className="w-0 opacity-0 group-hover:w-20 group-hover:opacity-100 transition-all duration-200 overflow-hidden">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-[var(--surface-panel)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff6b35] [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Loop */}
          <button
            onClick={onToggleLoop}
            className={`w-8 h-8 rounded-full hover:bg-[var(--surface-panel)] flex items-center justify-center transition-colors ${
              isLooping ? 'text-[#ff6b35]' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
            title="Loop"
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Favorite */}
          <button
            onClick={onToggleFavorite}
            className={`w-8 h-8 rounded-full hover:bg-[var(--surface-panel)] flex items-center justify-center transition-colors ${
              isFavorite ? 'text-[#ffff44]' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
            title="Favorite"
          >
            <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Open Waveform View */}
          <button
            onClick={onOpenWaveformView}
            className="w-8 h-8 rounded-full hover:bg-[var(--surface-panel)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors"
            title="Open Waveform View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* More Options */}
          <button
            onClick={onMoreOptions}
            className="w-8 h-8 rounded-full hover:bg-[var(--surface-panel)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors"
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
