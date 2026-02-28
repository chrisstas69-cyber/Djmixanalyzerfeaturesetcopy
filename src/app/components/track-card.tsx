// src/components/TrackCard.tsx
import React from 'react';
import { Heart, MoreVertical } from 'lucide-react';

interface TrackCardProps {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  bpm: number;
  key: string;
  duration: string;
  energy: number;
  genre: string;
  isFavorite?: boolean;
  onPlay?: () => void;
  onFavorite?: () => void;
  onMore?: () => void;
}

export default function TrackCard({
  title,
  artist,
  artwork,
  bpm,
  key,
  duration,
  energy,
  genre,
  isFavorite = false,
  onPlay,
  onFavorite,
  onMore,
}: TrackCardProps) {
  return (
    <div
      className="group relative rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm p-3 hover:border-cyan-400/50 hover:shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all duration-200 cursor-pointer"
      onClick={onPlay}
    >
      <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2 bg-gradient-to-br from-orange-500/10 to-cyan-500/10">
        {artwork ? (
          <img src={artwork} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m12-7h6m-6 7h6m6-7a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-xs font-medium text-white/90 truncate">{title}</div>
        <div className="text-xs text-white/50 truncate">{artist}</div>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <span className="px-1 py-0.5 rounded text-xs bg-orange-500/15 border border-orange-500/30 text-orange-300 uppercase tracking-wide">
          {genre}
        </span>
        <span className="px-1 py-0.5 rounded text-xs bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
          {bpm} BPM
        </span>
        <span className="px-1 py-0.5 rounded text-xs bg-orange-500/15 border border-orange-500/30 text-orange-300">
          {key}
        </span>
        <span className="px-1 py-0.5 rounded text-xs bg-white/10 border border-white/20 text-white/70">
          {duration}
        </span>
      </div>

      <div className="flex items-center gap-0.5 mt-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 w-1 rounded-full ${
              i < energy
                ? i < 3
                  ? 'bg-cyan-500'
                  : i < 7
                  ? 'bg-orange-500'
                  : 'bg-red-500'
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.();
          }}
          className={`p-1 rounded transition ${
            isFavorite
              ? 'text-orange-300 bg-orange-500/15'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMore?.();
          }}
          className="p-1 rounded text-white/70 hover:text-white hover:bg-white/5 transition"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}