"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Play, 
  Pause, 
  Music, 
  Plus, 
  X, 
  ChevronRight, 
  SkipBack, 
  SkipForward,
  Search,
  Upload
} from "lucide-react";

// Types
interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  mood?: string;
  transition?: string;
  bass?: string;
  filter?: string;
  effect?: string;
  energy?: number;
  album?: string;
  artwork?: string;
  waveformData?: number[];
  type: "dna" | "generated" | "uploaded";
}

interface DeckState {
  track: Track | null;
  isPlaying: boolean;
  position: number;
  isSynced: boolean;
}

// Sample tracks data with more fields
const sampleTracks: Track[] = [
  { id: "1", title: "Midnight Drive", artist: "Synthwave Dreams", bpm: 128, key: "Am", duration: "4:32", mood: "Dark", transition: "Smooth", bass: "Heavy", filter: "LP", effect: "Reverb", energy: 7, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "2", title: "Electric Pulse", artist: "DJ Quantum", bpm: 126, key: "Cm", duration: "5:18", mood: "Euphoric", transition: "Cut", bass: "Mid", filter: "HP", effect: "Delay", energy: 8, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "3", title: "Bass Reactor", artist: "Low Frequency", bpm: 140, key: "Dm", duration: "3:45", mood: "Aggressive", transition: "Build", bass: "Heavy", filter: "BP", effect: "Distort", energy: 9, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "4", title: "Cosmic Journey", artist: "Star Gazer", bpm: 132, key: "Em", duration: "6:12", mood: "Uplifting", transition: "Smooth", bass: "Light", filter: "None", effect: "Chorus", energy: 6, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "5", title: "Urban Nights", artist: "City Beats", bpm: 124, key: "Fm", duration: "4:55", mood: "Chill", transition: "Fade", bass: "Mid", filter: "LP", effect: "Flanger", energy: 5, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "6", title: "Sunset Boulevard", artist: "Chillwave", bpm: 118, key: "Am", duration: "5:42", mood: "Melancholic", transition: "Smooth", bass: "Light", filter: "None", effect: "Reverb", energy: 4, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "7", title: "Neon Dreams", artist: "Retro Future", bpm: 130, key: "Gm", duration: "4:18", mood: "Energetic", transition: "Drop", bass: "Heavy", filter: "HP", effect: "Bit Crush", energy: 8, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "8", title: "Deep Space", artist: "Orbital", bpm: 136, key: "Am", duration: "7:05", mood: "Dark", transition: "Build", bass: "Mid", filter: "BP", effect: "Phaser", energy: 7, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "9", title: "Rhythm Factory", artist: "Beat Machine", bpm: 128, key: "Cm", duration: "4:22", mood: "Industrial", transition: "Cut", bass: "Heavy", filter: "LP", effect: "Gate", energy: 9, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "10", title: "Crystal Clear", artist: "Pure Tone", bpm: 122, key: "Dm", duration: "5:33", mood: "Uplifting", transition: "Smooth", bass: "Light", filter: "None", effect: "Delay", energy: 6, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "11", title: "Thunder Road", artist: "Storm Chasers", bpm: 145, key: "Em", duration: "3:58", mood: "Aggressive", transition: "Drop", bass: "Heavy", filter: "HP", effect: "Distort", energy: 10, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "12", title: "Velvet Underground", artist: "Smooth Operator", bpm: 115, key: "Fm", duration: "6:45", mood: "Chill", transition: "Fade", bass: "Light", filter: "LP", effect: "Chorus", energy: 3, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
];

// Energy dots component
function EnergyDots({ level }: { level: number }) {
  return (
    <span className="text-[8px] tracking-[1px]" style={{ color: 'var(--accent-primary, #00bcd4)' }}>
      {'●'.repeat(level)}{'○'.repeat(10 - level)}
    </span>
  );
}

// Key badge component
function KeyBadge({ keyName }: { keyName: string }) {
  const keyColors: Record<string, string> = {
    'Am': '#00bcd4',
    'Bm': '#9c27b0',
    'Cm': '#e91e63',
    'Dm': '#ff5722',
    'Em': '#4caf50',
    'Fm': '#9c27b0',
    'Gm': '#ffeb3b',
  };
  
  const bgColor = keyColors[keyName] || '#00bcd4';
  const textColor = ['Gm', 'Am', 'Em'].includes(keyName) ? '#080808' : '#ffffff';
  
  return (
    <span 
      className="px-2 py-0.5 rounded text-[11px] font-medium"
      style={{ background: bgColor, color: textColor }}
    >
      {keyName}
    </span>
  );
}

// Waveform component for deck
function DeckWaveform({ 
  data, 
  position, 
  color = "#ff6b35" 
}: { 
  data: number[]; 
  position: number; 
  color?: string;
}) {
  return (
    <div className="relative w-full h-full flex items-center overflow-hidden">
      <div className="absolute inset-0 flex items-center gap-[1px] px-2">
        {data.slice(0, 120).map((value, i) => (
          <div
            key={i}
            className="flex-1 min-w-[2px]"
            style={{
              height: `${value * 80}%`,
              backgroundColor: i / 120 * 100 < position ? color : `${color}40`,
              borderRadius: '1px',
            }}
          />
        ))}
      </div>
      
      {/* Playhead */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
        style={{ 
          left: `${Math.max(1, Math.min(99, position))}%`,
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
        }}
      />
    </div>
  );
}

// Deck Panel Component
function DeckPanel({
  deckNumber,
  deck,
  onPlay,
  onSync,
  onDrop,
  waveformColor,
}: {
  deckNumber: number;
  deck: DeckState;
  onPlay: () => void;
  onSync: () => void;
  onDrop: (track: Track) => void;
  waveformColor: string;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`h-14 flex items-center gap-2 px-2 transition-all ${
        isDragOver ? 'bg-[#1a1a1a]' : ''
      }`}
      style={{ 
        background: 'var(--bg-dark, #0d0d0d)',
        borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        try {
          const trackData = e.dataTransfer.getData("application/json");
          if (trackData) {
            onDrop(JSON.parse(trackData));
          }
        } catch (err) {
          console.error("Drop error:", err);
        }
      }}
    >
      {/* Deck Label */}
      <div 
        className="w-12 text-[10px] font-semibold flex-shrink-0"
        style={{ color: 'var(--text-tertiary, #666666)' }}
      >
        DECK {deckNumber}
      </div>

      {/* Transport Controls */}
      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={onSync}
          className="w-10 h-6 rounded text-[10px] font-semibold transition-colors"
          style={{
            background: deck.isSynced ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
            color: deck.isSynced ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
            border: deck.isSynced ? 'none' : '1px solid var(--border-medium, rgba(255, 255, 255, 0.1))'
          }}
        >
          SYNC
        </button>
        <button
          onClick={onPlay}
          className="w-7 h-6 rounded flex items-center justify-center transition-colors"
          style={{
            background: deck.isPlaying ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
            color: deck.isPlaying ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
            border: deck.isPlaying ? 'none' : '1px solid var(--border-medium, rgba(255, 255, 255, 0.1))'
          }}
        >
          {deck.isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>
      </div>

      {/* Waveform */}
      <div 
        className="flex-1 h-10 rounded relative overflow-hidden"
        style={{ background: 'var(--bg-medium, #111111)' }}
      >
        {deck.track ? (
          <>
            <DeckWaveform 
              data={deck.track.waveformData || []} 
              position={deck.position} 
              color={waveformColor}
            />
            {/* Track Info Overlay */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-right">
              <div className="text-[11px] font-medium text-white">{deck.track.title}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-secondary, #a0a0a0)' }}>
                {deck.track.artist}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[11px]" style={{ color: 'var(--text-tertiary, #666666)' }}>
              Drop track here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Mix Queue Component
function MixQueue({
  tracks,
  onRemove,
  onClear,
  onPlayAll,
  isPlaying,
}: {
  tracks: Track[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onPlayAll: () => void;
  isPlaying: boolean;
}) {
  return (
    <div 
      className="px-4 py-3"
      style={{ 
        background: 'var(--bg-darker, #0a0a0a)',
        borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-3">
        <span 
          className="text-[11px] font-semibold tracking-wide"
          style={{ color: 'var(--text-tertiary, #666666)' }}
        >
          MIX QUEUE
        </span>
        <span 
          className="text-[11px]"
          style={{ color: 'var(--text-secondary, #a0a0a0)' }}
        >
          {tracks.length} TRACKS
        </span>
        
        {/* Playback controls */}
        <div className="flex items-center gap-1">
          <button 
            className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: 'var(--text-secondary, #a0a0a0)' }}
          >
            <SkipBack size={14} />
          </button>
          <button 
            onClick={onPlayAll}
            className="w-7 h-7 rounded flex items-center justify-center transition-colors"
            style={{ 
              background: isPlaying ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
              color: isPlaying ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)'
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button 
            className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: 'var(--text-secondary, #a0a0a0)' }}
          >
            <SkipForward size={14} />
          </button>
        </div>
        
        <div className="flex-1" />
        
        <button 
          className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
          style={{ 
            background: 'transparent',
            color: 'var(--text-primary, #ffffff)',
            border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.1))'
          }}
        >
          Add tracks
        </button>
        <button 
          className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
          style={{ 
            background: 'var(--accent-primary, #00bcd4)',
            color: 'var(--bg-darkest, #080808)'
          }}
        >
          Automix
        </button>
      </div>
      
      {/* Track Cards */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-2 px-2 py-2 rounded min-w-[160px] flex-shrink-0 group"
            style={{ background: 'var(--bg-medium, #111111)' }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/json", JSON.stringify(track));
            }}
          >
            {/* Artwork */}
            <div 
              className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--bg-light, #1a1a1a)' }}
            >
              {track.artwork ? (
                <img src={track.artwork} alt="" className="w-full h-full object-cover rounded" />
              ) : (
                <Music size={14} style={{ color: 'var(--text-tertiary, #666666)' }} />
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-white truncate">{track.title}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--text-secondary, #a0a0a0)' }}>
                {track.artist}
              </div>
            </div>
            
            {/* BPM */}
            <span 
              className="text-[10px] font-mono flex-shrink-0"
              style={{ color: 'var(--accent-primary, #00bcd4)' }}
            >
              {track.bpm}
            </span>
            
            {/* Remove button (on hover) */}
            <button
              onClick={() => onRemove(track.id)}
              className="w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ 
                background: 'var(--bg-light, #1a1a1a)',
                color: 'var(--text-secondary, #a0a0a0)'
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        {/* Empty slots */}
        {tracks.length < 8 && (
          <div 
            className="w-[160px] h-[52px] rounded border border-dashed flex items-center justify-center flex-shrink-0"
            style={{ borderColor: 'var(--border-medium, rgba(255, 255, 255, 0.1))' }}
          >
            <Plus size={16} style={{ color: 'var(--text-tertiary, #666666)' }} />
          </div>
        )}
      </div>
    </div>
  );
}

// Track Browser Component
function TrackBrowser({
  tracks,
  selectedTrack,
  onTrackSelect,
  onTrackDoubleClick,
  onAddToQueue,
  onLoadToDeck,
}: {
  tracks: Track[];
  selectedTrack: string | null;
  onTrackSelect: (id: string) => void;
  onTrackDoubleClick: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  onLoadToDeck: (track: Track, deck: 1 | 2 | 3) => void;
}) {
  const [filter, setFilter] = useState<"all" | "dna" | "generated" | "uploaded">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; track: Track } | null>(null);

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesFilter = filter === "all" || track.type === filter;
      const matchesSearch = 
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [tracks, filter, searchTerm]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with tabs and search */}
      <div 
        className="flex items-center justify-between px-4 py-2"
        style={{ background: 'var(--bg-darker, #0a0a0a)' }}
      >
        {/* Tabs */}
        <div className="flex gap-1">
          {[
            { id: "all", label: "ALL" },
            { id: "dna", label: "DNA TRACKS" },
            { id: "generated", label: "GENERATED" },
            { id: "uploaded", label: "UPLOADED" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
              style={{
                background: filter === tab.id ? 'var(--accent-primary, #00bcd4)' : 'transparent',
                color: filter === tab.id ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search 
            size={14} 
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-tertiary, #666666)' }}
          />
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px] pl-8 pr-3 py-1.5 rounded text-[12px] outline-none"
            style={{ 
              background: 'var(--bg-dark, #0d0d0d)',
              color: 'var(--text-primary, #ffffff)',
              border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.1))'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[12px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-dark, #0d0d0d)' }}>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>#</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>ART</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>TITLE</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>ARTIST</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>TIME</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>KEY</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>MOOD</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>TRANSITION</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>BASS</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>FILTER</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>EFFECT</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>BPM</th>
              <th className="text-left py-2 px-3 font-medium text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>ENERGY</th>
            </tr>
          </thead>
          <tbody>
            {filteredTracks.map((track, index) => (
              <tr
                key={track.id}
                className="cursor-pointer transition-colors"
                style={{
                  background: selectedTrack === track.id ? 'var(--bg-light, #1a1a1a)' : 'transparent',
                  borderLeft: selectedTrack === track.id ? '3px solid var(--accent-primary, #00bcd4)' : '3px solid transparent'
                }}
                onClick={() => onTrackSelect(track.id)}
                onDoubleClick={() => onTrackDoubleClick(track)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, track });
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/json", JSON.stringify(track));
                }}
                onMouseEnter={(e) => {
                  if (selectedTrack !== track.id) {
                    e.currentTarget.style.background = 'var(--bg-light, #1a1a1a)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTrack !== track.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <td className="py-2 px-3" style={{ color: 'var(--text-tertiary, #666666)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{index + 1}</td>
                <td className="py-2 px-3" style={{ borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'var(--bg-medium, #111111)' }}
                  >
                    {track.artwork ? (
                      <img src={track.artwork} alt="" className="w-full h-full object-cover rounded" />
                    ) : (
                      <Music size={12} style={{ color: 'var(--text-tertiary, #666666)' }} />
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 font-medium text-white" style={{ borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.title}</td>
                <td className="py-2 px-3" style={{ color: 'var(--text-secondary, #a0a0a0)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.artist}</td>
                <td className="py-2 px-3 font-mono" style={{ color: 'var(--text-secondary, #a0a0a0)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.duration}</td>
                <td className="py-2 px-3" style={{ borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>
                  <KeyBadge keyName={track.key} />
                </td>
                <td className="py-2 px-3" style={{ color: 'var(--text-secondary, #a0a0a0)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.mood || '-'}</td>
                <td className="py-2 px-3" style={{ color: 'var(--text-secondary, #a0a0a0)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.transition || '-'}</td>
                <td className="py-2 px-3" style={{ color: 'var(--text-secondary, #a0a0a0)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.bass || '-'}</td>
                <td className="py-2 px-3" style={{ color: 'var(--text-secondary, #a0a0a0)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.filter || '-'}</td>
                <td className="py-2 px-3" style={{ color: 'var(--text-secondary, #a0a0a0)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.effect || '-'}</td>
                <td className="py-2 px-3 font-mono font-medium" style={{ color: 'var(--accent-primary, #00bcd4)', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>{track.bpm}</td>
                <td className="py-2 px-3" style={{ borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>
                  <EnergyDots level={track.energy || 5} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed rounded shadow-xl py-1 z-50"
          style={{ 
            left: contextMenu.x, 
            top: contextMenu.y,
            background: 'var(--bg-light, #1a1a1a)',
            border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.1))'
          }}
        >
          <button
            className="w-full px-4 py-2 text-left text-[12px] text-white flex items-center gap-2 transition-colors hover:bg-[#00bcd4] hover:text-black"
            onClick={() => {
              onLoadToDeck(contextMenu.track, 1);
              setContextMenu(null);
            }}
          >
            <ChevronRight size={12} /> Load to Deck 1
          </button>
          <button
            className="w-full px-4 py-2 text-left text-[12px] text-white flex items-center gap-2 transition-colors hover:bg-[#00bcd4] hover:text-black"
            onClick={() => {
              onLoadToDeck(contextMenu.track, 2);
              setContextMenu(null);
            }}
          >
            <ChevronRight size={12} /> Load to Deck 2
          </button>
          <button
            className="w-full px-4 py-2 text-left text-[12px] text-white flex items-center gap-2 transition-colors hover:bg-[#00bcd4] hover:text-black"
            onClick={() => {
              onLoadToDeck(contextMenu.track, 3);
              setContextMenu(null);
            }}
          >
            <ChevronRight size={12} /> Load to Deck 3
          </button>
          <div className="my-1" style={{ borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }} />
          <button
            className="w-full px-4 py-2 text-left text-[12px] text-white flex items-center gap-2 transition-colors hover:bg-[#00bcd4] hover:text-black"
            onClick={() => {
              onAddToQueue(contextMenu.track);
              setContextMenu(null);
            }}
          >
            <Plus size={12} /> Add to Queue
          </button>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function AutoDJMixerProfessional() {
  const [tracks] = useState<Track[]>(sampleTracks);
  const [mixQueue, setMixQueue] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isQueuePlaying, setIsQueuePlaying] = useState(false);

  const [deck1, setDeck1] = useState<DeckState>({
    track: null,
    isPlaying: false,
    position: 0,
    isSynced: false,
  });

  const [deck2, setDeck2] = useState<DeckState>({
    track: null,
    isPlaying: false,
    position: 0,
    isSynced: false,
  });

  const [deck3, setDeck3] = useState<DeckState>({
    track: null,
    isPlaying: false,
    position: 0,
    isSynced: false,
  });

  // Playback animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (deck1.isPlaying && deck1.track) {
        setDeck1((prev) => ({ ...prev, position: (prev.position + 0.15) % 100 }));
      }
      if (deck2.isPlaying && deck2.track) {
        setDeck2((prev) => ({ ...prev, position: (prev.position + 0.15) % 100 }));
      }
      if (deck3.isPlaying && deck3.track) {
        setDeck3((prev) => ({ ...prev, position: (prev.position + 0.15) % 100 }));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [deck1.isPlaying, deck2.isPlaying, deck3.isPlaying]);

  const loadTrackToDeck = useCallback((track: Track, deck: 1 | 2 | 3) => {
    const newState = { track, position: 0, isPlaying: false, isSynced: false };
    if (deck === 1) setDeck1((prev) => ({ ...prev, ...newState }));
    else if (deck === 2) setDeck2((prev) => ({ ...prev, ...newState }));
    else setDeck3((prev) => ({ ...prev, ...newState }));
  }, []);

  const handleTrackDoubleClick = useCallback((track: Track) => {
    if (!deck1.track) loadTrackToDeck(track, 1);
    else if (!deck2.track) loadTrackToDeck(track, 2);
    else if (!deck3.track) loadTrackToDeck(track, 3);
  }, [deck1.track, deck2.track, deck3.track, loadTrackToDeck]);

  const addToQueue = useCallback((track: Track) => {
    setMixQueue((prev) => {
      if (prev.find((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setMixQueue((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  return (
    <div 
      className="flex flex-col h-full overflow-hidden"
      style={{ background: 'var(--bg-darkest, #080808)' }}
    >
      {/* Timeline Header */}
      <div 
        className="h-6 flex items-center pl-[120px]"
        style={{ 
          background: 'var(--bg-dark, #0d0d0d)',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
        }}
      >
        {Array.from({ length: 18 }, (_, i) => (
          <span 
            key={i} 
            className="w-[50px] text-center text-[10px]"
            style={{ color: 'var(--text-tertiary, #666666)' }}
          >
            {i}
          </span>
        ))}
      </div>

      {/* Decks */}
      <DeckPanel
        deckNumber={1}
        deck={deck1}
        onPlay={() => setDeck1((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
        onSync={() => setDeck1((prev) => ({ ...prev, isSynced: !prev.isSynced }))}
        onDrop={(track) => loadTrackToDeck(track, 1)}
        waveformColor="#ff6b35"
      />
      <DeckPanel
        deckNumber={2}
        deck={deck2}
        onPlay={() => setDeck2((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
        onSync={() => setDeck2((prev) => ({ ...prev, isSynced: !prev.isSynced }))}
        onDrop={(track) => loadTrackToDeck(track, 2)}
        waveformColor="#f5a623"
      />
      <DeckPanel
        deckNumber={3}
        deck={deck3}
        onPlay={() => setDeck3((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
        onSync={() => setDeck3((prev) => ({ ...prev, isSynced: !prev.isSynced }))}
        onDrop={(track) => loadTrackToDeck(track, 3)}
        waveformColor="#00bcd4"
      />

      {/* Mix Queue */}
      <MixQueue
        tracks={mixQueue}
        onRemove={removeFromQueue}
        onClear={() => setMixQueue([])}
        onPlayAll={() => setIsQueuePlaying(!isQueuePlaying)}
        isPlaying={isQueuePlaying}
      />

      {/* Track Browser */}
      <TrackBrowser
        tracks={tracks}
        selectedTrack={selectedTrack}
        onTrackSelect={setSelectedTrack}
        onTrackDoubleClick={handleTrackDoubleClick}
        onAddToQueue={addToQueue}
        onLoadToDeck={loadTrackToDeck}
      />
    </div>
  );
}
