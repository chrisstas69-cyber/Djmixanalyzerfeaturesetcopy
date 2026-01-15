"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface WaveformPlayerProps {
  trackId: string;
  duration: string;
  bpm: number;
  keySignature: string;
  isActive: boolean;
}

// Generate waveform data
const generateWaveformData = (trackId: string, count: number = 80): number[] => {
  const seed = trackId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    const random = Math.sin(seed + i) * 10000;
    const normalized = (random - Math.floor(random));
    heights.push(20 + normalized * 60); // 20-80% range
  }
  return heights;
};

export function WaveformPlayer({ trackId, duration, bpm, keySignature, isActive }: WaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const waveformData = generateWaveformData(trackId);

  useEffect(() => {
    if (isPlaying && isActive) {
      const interval = setInterval(() => {
        setPlayheadPosition((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5; // Increment playhead
        });
      }, 100);
      return () => clearInterval(interval);
    } else if (!isPlaying) {
      setPlayheadPosition(0);
    }
  }, [isPlaying, isActive]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setPlayheadPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div>
      {/* Waveform */}
      <div
        className="relative cursor-pointer mb-4"
        style={{ height: '80px' }}
        onClick={handleWaveformClick}
      >
        {/* Waveform Bars */}
        <div className="absolute inset-0 flex items-end gap-0.5 px-2">
          {waveformData.map((height, i) => (
            <div
              key={i}
              style={{
                width: '2px',
                height: `${height}%`,
                background: isActive && isPlaying
                  ? `linear-gradient(to top, var(--orange), var(--orange-2))`
                  : `linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.6))`,
                borderRadius: '1px',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>

        {/* Playhead */}
        {isActive && isPlaying && (
          <div
            className="absolute top-0 bottom-0 w-0.5"
            style={{
              left: `${playheadPosition}%`,
              background: 'var(--orange)',
              boxShadow: '0 0 8px var(--orange)',
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* Controls and Metadata */}
      <div className="flex items-center gap-3 min-w-0 mb-4">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center rounded-full transition-colors cursor-pointer flex-shrink-0"
          style={{
            width: '40px',
            height: '40px',
            background: isActive && isPlaying ? 'var(--orange-2)' : 'var(--panel-2)',
            border: isActive && isPlaying ? 'none' : '1px solid var(--border)',
            color: isActive && isPlaying ? '#000' : 'var(--text-2)',
          }}
          onMouseEnter={(e) => {
            if (!isActive || !isPlaying) {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive || !isPlaying) {
              e.currentTarget.style.background = 'var(--panel-2)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }
          }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" fill="currentColor" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
          )}
        </button>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs min-w-0" style={{ color: 'var(--text-3)' }}>
          <span className="whitespace-nowrap">
            BPM: <span style={{ color: 'var(--cyan)', fontFamily: 'monospace', fontWeight: 600 }}>{bpm}</span>
          </span>
          <span className="whitespace-nowrap">
            Key: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{keySignature}</span>
          </span>
          <span className="whitespace-nowrap">
            Time: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{duration}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
