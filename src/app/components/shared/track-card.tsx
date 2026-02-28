"use client";

import React from "react";
import { Music2, Heart, Play, MoreVertical } from "lucide-react";

export interface TrackCardProps {
  id?: string;
  title: string;
  artist: string;
  artwork?: string;
  bpm: number;
  key: string;
  duration: string;
  energy: number; // 1-10
  genre?: string;
  isFavorite?: boolean;
  isPlaying?: boolean;
  isSelected?: boolean;
  onPlay?: () => void;
  onFavorite?: () => void;
  onMore?: () => void;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
}

export function TrackCard({
  title,
  artist,
  artwork,
  bpm,
  key: musicalKey,
  duration,
  energy,
  genre,
  isFavorite = false,
  isPlaying = false,
  isSelected = false,
  onPlay,
  onFavorite,
  onMore,
  onClick,
  onDragStart,
  className,
}: TrackCardProps) {
  return (
    <div
      className={`group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_24px_rgba(34,211,238,0.15)] ${
        isSelected ? "border-cyan-500/50 bg-cyan-500/10" : ""
      } ${isPlaying ? "border-orange-500/50" : ""} ${className || ""}`}
      onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
    >
      {/* Artwork / Icon */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-orange-500/20 to-cyan-500/20 mb-4">
        {artwork ? (
          <img src={artwork} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 className="h-16 w-16 text-white/30" />
          </div>
        )}
        {/* Play button overlay */}
        {onPlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="h-16 w-16 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_24px_rgba(249,115,22,0.5)]">
              <Play className="h-8 w-8 text-black fill-black" />
            </div>
          </button>
        )}
      </div>

      {/* Track Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white/90 truncate">{title}</h3>
          <p className="text-sm text-white/50 truncate">{artist}</p>
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {genre && (
            <span className="px-2 py-1 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-medium uppercase tracking-wide">
              {genre}
            </span>
          )}
          <span className="px-2 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            {bpm} BPM
          </span>
          <span className="px-2 py-1 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-semibold">
            {musicalKey}
          </span>
          <span className="px-2 py-1 rounded-md bg-white/10 border border-white/20 text-white/70 text-xs">
            {duration}
          </span>
        </div>

        {/* Energy Visualization */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < energy
                  ? i < 3
                    ? "bg-cyan-500"
                    : i < 7
                    ? "bg-orange-500"
                    : "bg-red-500"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className={`p-2 rounded-lg transition ${
                isFavorite
                  ? "bg-orange-500/20 text-orange-300"
                  : "hover:bg-white/5 text-white/70 hover:text-white"
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          )}
          {onMore && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMore();
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackCard;

