import React from 'react';
import { Heart, MoreVertical, Dna } from 'lucide-react';

export interface TrackCardProps {
  id: string;
  title: string;
  artist: string;
  artwork?: string | null;
  bpm: number;
  /** Musical key (e.g. Am). Pass as musicalKey to avoid React's reserved key prop. */
  musicalKey?: string;
  key?: string;
  duration: string;
  energy: number;
  genre: string;
  isFavorite?: boolean;
  createdAt: string;
  /** DNA attribution – show badge when present */
  dnaPresetId?: string;
  dnaArtistName?: string;
  dnaPresetName?: string;
  generationMethod?: 'dna' | 'prompt-only';
  onPlay?: () => void;
  onFavorite?: () => void;
  onMore?: () => void;
  onShowDetail?: () => void;
}

export default function TrackCard({
  title,
  artist,
  artwork,
  bpm,
  musicalKey: musicalKeyProp,
  key: keyProp,
  duration,
  energy,
  genre,
  isFavorite = false,
  createdAt,
  dnaArtistName,
  dnaPresetName,
  generationMethod = 'prompt-only',
  onPlay,
  onFavorite,
  onMore,
  onShowDetail,
}: TrackCardProps) {
  const musicalKey = musicalKeyProp ?? keyProp ?? '–';
  const showDNABadge = generationMethod === 'dna' && dnaArtistName;
  const showPromptOnlyBadge = generationMethod === 'prompt-only';

  return (
    <div
      className="group relative rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm p-3 hover:border-cyan-500/30 transition-all cursor-pointer"
      onClick={onPlay}
    >
      {/* Artwork */}
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
        {/* DNA / Prompt-only attribution badge – top-right, opacity-90 */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90">
          {showDNABadge && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShowDetail?.();
              }}
              title={`Using: ${dnaArtistName} DNA${dnaPresetName ? ` (${dnaPresetName})` : ''}`}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
            >
              <Dna className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[80px]">{dnaArtistName}</span>
            </button>
          )}
          {showPromptOnlyBadge && !showDNABadge && (
            <span
              title="Generated from prompt only"
              className="px-2 py-1 rounded-full text-[10px] font-medium bg-gray-700/80 text-gray-300 border border-gray-600/50"
            >
              Prompt Only
            </span>
          )}
        </div>
      </div>

      {/* Info Row */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-white/90 truncate">{title}</div>
        <div className="text-xs text-white/50 truncate">{artist}</div>
      </div>

      {/* Metadata Badges */}
      <div className="flex items-center gap-1 mt-2">
        <span className="px-1 py-0.5 rounded text-xs bg-orange-500/15 border border-orange-500/30 text-orange-300 uppercase tracking-wide">
          {genre}
        </span>
        <span className="px-1 py-0.5 rounded text-xs bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
          {bpm} BPM
        </span>
        <span className="px-1 py-0.5 rounded text-xs bg-orange-500/15 border border-orange-500/30 text-orange-300">
          {musicalKey}
        </span>
        <span className="px-1 py-0.5 rounded text-xs bg-white/10 border border-white/20 text-white/70">
          {duration}
        </span>
      </div>

      {/* Energy Dots */}
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

      {/* Action Icons */}
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
            onShowDetail ? onShowDetail() : onMore?.();
          }}
          className="p-1 rounded text-white/70 hover:text-white hover:bg-white/5 transition"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
