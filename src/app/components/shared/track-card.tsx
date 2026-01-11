"use client";

import React from "react";
import { cn } from "../ui/utils";
import { Music2, Play, Pause, Heart, MoreVertical } from "lucide-react";

export interface TrackCardProps {
  title: string;
  artist: string;
  bpm: number;
  musicKey: string;
  duration: string;
  artwork?: string;
  energy?: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
  isSelected?: boolean;
  onPlay?: () => void;
  onFavorite?: () => void;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
}

export function TrackCard({
  title,
  artist,
  bpm,
  musicKey,
  duration,
  artwork,
  energy,
  isPlaying = false,
  isFavorite = false,
  isSelected = false,
  onPlay,
  onFavorite,
  onClick,
  onDragStart,
  className,
}: TrackCardProps) {
  return (
    <div
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer transition-all",
        "bg-[var(--bg-darker)] border",
        isSelected
          ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10"
          : "border-white/5 hover:border-white/10 hover:bg-[var(--bg-dark)]",
        isPlaying && "border-[var(--accent-cyan)]/50",
        className
      )}
      onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-3">
        {/* Artwork */}
        <div className="relative w-12 h-12 rounded bg-[var(--bg-medium)] overflow-hidden flex-shrink-0">
          {artwork ? (
            <img src={artwork} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 className="w-5 h-5 text-white/20" />
            </div>
          )}
          {/* Play Overlay */}
          {onPlay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity",
                "bg-black/60",
                isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate font-['Inter']">
            {title}
          </h4>
          <p className="text-xs text-white/50 truncate font-['Inter']">
            {artist}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-[var(--accent-cyan)] font-['Roboto_Mono']">
              {bpm} BPM
            </span>
            <span className="text-[10px] text-white/30">•</span>
            <span className="text-[10px] text-[var(--accent-cyan)] font-['Roboto_Mono']">
              {musicKey}
            </span>
            <span className="text-[10px] text-white/30">•</span>
            <span className="text-[10px] text-white/40 font-['Roboto_Mono']">
              {duration}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  isFavorite ? "fill-red-500 text-red-500" : "text-white/40"
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* Energy Badge */}
      {energy && (
        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-[var(--bg-medium)] text-white/50 font-['Rajdhani']">
            {energy}
          </span>
        </div>
      )}

      {/* Playing Indicator */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-cyan)]" />
      )}
    </div>
  );
}

export default TrackCard;

