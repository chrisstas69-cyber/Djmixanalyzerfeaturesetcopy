"use client";

import React, { useMemo } from "react";
import { cn } from "../ui/utils";

export interface FrequencyWaveformProps {
  /** Waveform data as array of values 0-1 */
  data: number[];
  /** Current playback position 0-100 */
  position?: number;
  /** Height of the waveform in pixels */
  height?: number;
  /** Show frequency coloring (bass=red, mid=orange, high=green) */
  frequencyColored?: boolean;
  /** Show playhead indicator */
  showPlayhead?: boolean;
  /** Show beat grid markers */
  showBeatGrid?: boolean;
  /** BPM for beat grid calculation */
  bpm?: number;
  /** Click handler for seeking */
  onSeek?: (position: number) => void;
  className?: string;
}

// Waveform color scheme based on frequency
const COLORS = {
  low: "var(--waveform-low)",    // #FF3366 - Bass frequencies
  mid: "var(--waveform-mid)",    // #FFAA00 - Mid frequencies
  high: "var(--waveform-high)",  // #00FF88 - High frequencies
  played: "var(--accent-cyan)",
  unplayed: "var(--bg-light)",
};

export function FrequencyWaveform({
  data,
  position = 0,
  height = 60,
  frequencyColored = true,
  showPlayhead = true,
  showBeatGrid = false,
  bpm = 128,
  onSeek,
  className,
}: FrequencyWaveformProps) {
  // Generate waveform bars
  const bars = useMemo(() => {
    if (!data || data.length === 0) {
      // Generate placeholder data if none provided
      return Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2);
    }
    return data;
  }, [data]);

  // Calculate beat positions for grid
  const beatPositions = useMemo(() => {
    if (!showBeatGrid || !bpm) return [];
    
    // Assuming 4-minute track duration for demo
    const trackDurationSeconds = 240;
    const beatsPerSecond = bpm / 60;
    const totalBeats = trackDurationSeconds * beatsPerSecond;
    const beatSpacing = 100 / totalBeats;
    
    // Show every 4th beat (bar markers)
    const positions: number[] = [];
    for (let i = 0; i < totalBeats; i += 4) {
      positions.push(i * beatSpacing);
    }
    return positions;
  }, [showBeatGrid, bpm]);

  // Get color based on position in waveform and frequency
  const getBarColor = (index: number, value: number) => {
    const barPosition = (index / bars.length) * 100;
    const isPlayed = barPosition < position;
    
    if (!frequencyColored) {
      return isPlayed ? COLORS.played : COLORS.unplayed;
    }
    
    // Simulate frequency distribution based on value and position
    // Higher values = more high frequency content
    // Lower values = more bass content
    if (value > 0.7) {
      return isPlayed ? COLORS.high : `${COLORS.high}40`;
    } else if (value > 0.4) {
      return isPlayed ? COLORS.mid : `${COLORS.mid}40`;
    } else {
      return isPlayed ? COLORS.low : `${COLORS.low}40`;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, newPosition)));
  };

  return (
    <div
      className={cn(
        "relative w-full rounded overflow-hidden bg-[var(--bg-darkest)]",
        onSeek && "cursor-pointer",
        className
      )}
      style={{ height }}
      onClick={handleClick}
    >
      {/* Beat Grid */}
      {showBeatGrid && (
        <div className="absolute inset-0 pointer-events-none">
          {beatPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-white/10"
              style={{ left: `${pos}%` }}
            />
          ))}
        </div>
      )}

      {/* Waveform Bars */}
      <div className="absolute inset-0 flex items-center gap-[1px] px-1">
        {bars.map((value, i) => (
          <div
            key={i}
            className="flex-1 min-w-[1px] rounded-sm transition-all duration-75"
            style={{
              height: `${Math.max(4, value * 100)}%`,
              backgroundColor: getBarColor(i, value),
            }}
          />
        ))}
      </div>

      {/* Playhead */}
      {showPlayhead && position > 0 && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          {/* Playhead glow */}
          <div className="absolute inset-0 w-2 -left-[3px] bg-white/20 blur-sm" />
        </div>
      )}

      {/* Played overlay for non-frequency colored mode */}
      {!frequencyColored && position > 0 && (
        <div
          className="absolute inset-y-0 left-0 bg-[var(--accent-cyan)]/10 pointer-events-none"
          style={{ width: `${position}%` }}
        />
      )}
    </div>
  );
}

export default FrequencyWaveform;

