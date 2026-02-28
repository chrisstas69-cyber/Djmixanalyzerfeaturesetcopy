"use client";

import React, { useMemo, useState, useCallback } from "react";

const BAR_COUNT = 200;
const BAR_WIDTH = 2;
const BAR_GAP = 1;
const PLAYED_COLOR = "#ff5722";
const UNPLAYED_COLOR = "#4a4a4a";

/** Seeded random for consistent per-track waveform shape */
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

interface WaveformDisplayProps {
  /** Unique id (e.g. track id) for seeded random heights */
  trackId: string;
  /** Progress 0–1: fraction of bars shown as played (orange) */
  progress?: number;
  /** Optional timestamp string shown on the right (e.g. "43:19") */
  timestamp?: string;
  className?: string;
}

export function WaveformDisplay({
  trackId,
  progress = 0.3,
  timestamp,
  className = "",
}: WaveformDisplayProps) {
  const seed = useMemo(() => {
    let h = 0;
    for (let i = 0; i < trackId.length; i++) h = (h << 5) - h + trackId.charCodeAt(i);
    return Math.abs(h) || 1;
  }, [trackId]);

  const heights = useMemo(() => {
    const random = seededRandom(seed);
    return Array.from({ length: BAR_COUNT }, () => 0.1 + random() * 0.9);
  }, [seed]);

  const [hoverX, setHoverX] = useState<number | null>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoverX(e.clientX - rect.left);
    },
    []
  );
  const onMouseLeave = useCallback(() => setHoverX(null), []);

  return (
    <div
      className={`flex items-center w-full relative ${className}`}
      style={{ height: 60 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex-1 flex items-center min-w-0 h-full" style={{ gap: BAR_GAP }}>
        {heights.map((h, i) => {
          const isPlayed = (i + 1) / BAR_COUNT <= progress;
          return (
            <div
              key={i}
              style={{
                width: BAR_WIDTH,
                height: `${Math.max(10, h * 100)}%`,
                borderRadius: 1,
                backgroundColor: isPlayed ? PLAYED_COLOR : UNPLAYED_COLOR,
              }}
            />
          );
        })}
      </div>
      {timestamp != null && (
        <span
          className="flex-shrink-0 ml-2 tabular-nums"
          style={{ fontSize: 13, color: "#9e9e9e" }}
        >
          {timestamp}
        </span>
      )}
      {hoverX != null && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: hoverX,
            width: 1,
            background: "rgba(255,255,255,0.6)",
          }}
        />
      )}
    </div>
  );
}
