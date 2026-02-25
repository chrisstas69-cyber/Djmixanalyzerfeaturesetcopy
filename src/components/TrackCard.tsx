import React, { useState, useRef, useEffect } from 'react';
import { Heart, MoreVertical, Dna, Play, Pencil } from 'lucide-react';

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
  /** When true, show playing state and waveform */
  isPlaying?: boolean;
  onPlay?: () => void;
  onFavorite?: () => void;
  onMore?: () => void;
  onShowDetail?: () => void;
  onTitleChange?: (value: string) => void;
  onArtistChange?: (value: string) => void;
}

export default function TrackCard({
  id,
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
  isPlaying = false,
  onPlay,
  onFavorite,
  onMore,
  onShowDetail,
  onTitleChange,
  onArtistChange,
}: TrackCardProps) {
  const [hover, setHover] = useState(false);
  const [editField, setEditField] = useState<'title' | 'artist' | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const musicalKey = musicalKeyProp ?? keyProp ?? '–';
  const showDNABadge = generationMethod === 'dna' && dnaArtistName;
  const showPromptOnlyBadge = generationMethod === 'prompt-only';
  const showOverlay = hover || isPlaying;
  const waveformActive = isPlaying;

  useEffect(() => {
    if (editField) {
      setEditValue(editField === 'title' ? title : artist);
      inputRef.current?.focus();
    }
  }, [editField, title, artist]);

  const saveEdit = () => {
    if (editField === 'title' && editValue.trim() !== '' && onTitleChange) {
      onTitleChange(editValue.trim());
    }
    if (editField === 'artist' && onArtistChange) {
      onArtistChange(editValue.trim());
    }
    setEditField(null);
    setEditValue('');
  };

  return (
    <div
      className="group relative rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm p-2.5 hover:border-cyan-500/30 transition-all cursor-pointer w-full max-w-[220px] flex flex-col"
      style={{ height: 260 }}
      onClick={() => !editField && onShowDetail?.()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Artwork */}
      <div className="relative w-full flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-orange-500/10 to-cyan-500/10" style={{ aspectRatio: '1' }}>
        {artwork ? (
          <img src={artwork} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m12-7h6m-6 7h6m6-7a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
        )}
        {/* Play button overlay – hover or playing */}
        {showOverlay && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            </div>
          </div>
        )}
        {/* Waveform strip – always visible; dim when idle, bright when playing */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6 px-1 flex items-end justify-center gap-0.5 bg-gradient-to-t from-black/70 to-transparent transition-all duration-200"
          style={{
            opacity: waveformActive ? 1 : 0.25,
            filter: waveformActive ? 'none' : 'grayscale(80%)',
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`w-0.5 rounded-full bg-cyan-400/90 min-h-[2px] min-w-[2px] ${waveformActive ? 'animate-pulse' : ''}`}
              style={{
                height: `${20 + Math.sin(i * 0.8) * 12 + (i % 3) * 4}%`,
                animationDelay: waveformActive ? `${i * 40}ms` : undefined,
              }}
            />
          ))}
        </div>
        {/* DNA / Prompt-only attribution badge – top-right, opacity-90 */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 z-10">
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

      {/* Info Row – editable title & artist with pencil */}
      <div className="space-y-0.5 mt-1.5 flex-1 min-h-0 flex flex-col">
        {editField === 'title' ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') { setEditField(null); setEditValue(''); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-white outline-none w-full"
          />
        ) : (
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs font-medium text-white/90 truncate flex-1">{title || 'Untitled'}</span>
            {(onTitleChange != null) && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setEditField('title'); }}
                className="flex-shrink-0 p-0.5 rounded text-white/40 hover:text-white/80 transition-colors"
                aria-label="Edit title"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
        {editField === 'artist' ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') { setEditField(null); setEditValue(''); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-white/80 outline-none w-full"
          />
        ) : (
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs text-white/50 truncate flex-1">{artist || 'Unknown'}</span>
            {(onArtistChange != null) && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setEditField('artist'); }}
                className="flex-shrink-0 p-0.5 rounded text-white/40 hover:text-white/80 transition-colors"
                aria-label="Edit artist"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Metadata Badges – compact */}
      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
        <span className="px-1 py-0.5 rounded text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
          {bpm}
        </span>
        <span className="px-1 py-0.5 rounded text-[10px] bg-white/10 border border-white/20 text-white/70">
          {musicalKey}
        </span>
        <span className="px-1 py-0.5 rounded text-[10px] bg-white/10 border border-white/20 text-white/60">
          {duration}
        </span>
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
