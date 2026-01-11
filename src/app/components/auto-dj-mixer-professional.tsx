"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PlayCircle, Pause, RotateCcw, Zap, Music, Plus, X, ChevronRight } from "lucide-react";

// Types
interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  album?: string;
  artwork?: string;
  waveformData?: number[];
  rating?: number;
  type: "dna" | "generated";
}

interface DeckState {
  track: Track | null;
  isPlaying: boolean;
  position: number;
  volume: number;
  gain: number;
  eqHigh: number;
  eqMid: number;
  eqLow: number;
  fx: number;
  isSynced: boolean;
  killHigh: boolean;
  killMid: boolean;
  killLow: boolean;
  cueActive: boolean;
}

// Sample tracks data
const sampleTracks: Track[] = [
  { id: "1", title: "Midnight Drive", artist: "Synthwave Dreams", bpm: 128, key: "8A", duration: "4:32", album: "Neon Nights", rating: 5, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "2", title: "Electric Pulse", artist: "DJ Quantum", bpm: 126, key: "11B", duration: "5:18", album: "Digital Horizons", rating: 4, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "3", title: "Bass Reactor", artist: "Low Frequency", bpm: 140, key: "3A", duration: "3:45", album: "Deep Impact", rating: 4, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "4", title: "Cosmic Journey", artist: "Star Gazer", bpm: 132, key: "6B", duration: "6:12", album: "Galaxy Quest", rating: 5, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "5", title: "Urban Nights", artist: "City Beats", bpm: 124, key: "10A", duration: "4:55", album: "Metro Sounds", rating: 3, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "6", title: "Sunset Boulevard", artist: "Chillwave", bpm: 118, key: "5A", duration: "5:42", album: "Summer Vibes", rating: 4, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "7", title: "Neon Dreams", artist: "Retro Future", bpm: 130, key: "2B", duration: "4:18", album: "80s Redux", rating: 5, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "8", title: "Deep Space", artist: "Orbital", bpm: 136, key: "9A", duration: "7:05", album: "Cosmos", rating: 4, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "9", title: "Rhythm Factory", artist: "Beat Machine", bpm: 128, key: "4B", duration: "4:22", album: "Industrial", rating: 3, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "10", title: "Crystal Clear", artist: "Pure Tone", bpm: 122, key: "7A", duration: "5:33", album: "Clarity", rating: 4, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "11", title: "Thunder Road", artist: "Storm Chasers", bpm: 145, key: "1A", duration: "3:58", album: "Lightning", rating: 5, type: "generated", waveformData: Array.from({ length: 100 }, () => Math.random()) },
  { id: "12", title: "Velvet Underground", artist: "Smooth Operator", bpm: 115, key: "12B", duration: "6:45", album: "Silk", rating: 4, type: "dna", waveformData: Array.from({ length: 100 }, () => Math.random()) },
];

// Compact Waveform Component - optimized for 720px height
function CompactWaveform({ data, position, color = "#00D4FF" }: { data: number[]; position: number; color?: string }) {
  return (
    <div className="relative w-full h-[40px] waveform-compact bg-[#0a0a0a] rounded overflow-hidden">
      {/* Time markers */}
      <div className="absolute top-0 left-0 right-0 h-3 flex justify-between px-2 text-[9px] text-[#666] font-['JetBrains_Mono']">
        <span>0:00</span>
        <span>1:00</span>
        <span>2:00</span>
        <span>3:00</span>
      </div>
      
      {/* Waveform bars */}
      <div className="absolute bottom-1 left-0 right-0 h-[26px] flex items-end gap-[1px] px-1">
        {data.slice(0, 80).map((value, i) => (
          <div
            key={i}
            className="flex-1 min-w-[1px]"
            style={{
              height: `${value * 100}%`,
              backgroundColor: i / 80 * 100 < position ? color : `${color}40`,
            }}
          />
        ))}
      </div>
      
      {/* Playhead */}
      <div
        className="absolute top-3 bottom-0 w-[2px] bg-white shadow-lg z-10"
        style={{ left: `${Math.max(2, Math.min(98, position))}%` }}
      />
    </div>
  );
}

// Compact Knob Component
function CompactKnob({ 
  value, 
  onChange, 
  label, 
  size = 50,
  showValue = true 
}: { 
  value: number; 
  onChange: (v: number) => void; 
  label: string;
  size?: number;
  showValue?: boolean;
}) {
  const rotation = (value / 100) * 270 - 135;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#666] text-[10px] uppercase font-['Rajdhani'] tracking-wider">{label}</span>
      <div
        className="relative cursor-pointer"
        style={{ width: size, height: size }}
        onMouseDown={(e) => {
          const startY = e.clientY;
          const startValue = value;
          
          const handleMove = (moveEvent: MouseEvent) => {
            const delta = (startY - moveEvent.clientY) / 2;
            const newValue = Math.max(0, Math.min(100, startValue + delta));
            onChange(newValue);
          };
          
          const handleUp = () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
          };
          
          window.addEventListener("mousemove", handleMove);
          window.addEventListener("mouseup", handleUp);
        }}
      >
        {/* Knob body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ 
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            border: '2px solid #3a3a3a',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* Indicator line */}
          <div className="absolute top-1 left-1/2 w-[2px] h-[30%] bg-white rounded-full transform -translate-x-1/2" />
        </div>
      </div>
      {showValue && (
        <span className="text-[#00D4FF] text-[11px] font-['JetBrains_Mono']">{Math.round(value)}</span>
      )}
    </div>
  );
}

// Compact VU Meter - optimized for 720px height
function CompactVUMeter({ level, label }: { level: number; label: string }) {
  const segments = 10; // Reduced from 12
  
  return (
    <div className="flex flex-col items-center gap-1 vu-meter-compact">
      <div className="flex flex-col-reverse gap-[2px]">
        {Array.from({ length: segments }, (_, i) => {
          const segmentLevel = ((i + 1) / segments) * 100;
          const isActive = level >= segmentLevel;
          let color = "#00FF66";
          if (i >= 8) color = "#FF3B30";
          else if (i >= 6) color = "#FF9500";
          
          return (
            <div
              key={i}
              className="w-3 h-[6px] rounded-sm transition-colors"
              style={{
                backgroundColor: isActive ? color : "#1a1a1a",
                boxShadow: isActive ? `0 0 4px ${color}50` : "none",
              }}
            />
          );
        })}
      </div>
      <span className="text-white/50 text-[9px] uppercase font-['Rajdhani']">{label}</span>
    </div>
  );
}

// Compact Deck Panel
function CompactDeckPanel({
  deck,
  deckId,
  onPlay,
  onCue,
  onSync,
  onDrop,
}: {
  deck: DeckState;
  deckId: "A" | "B";
  onPlay: () => void;
  onCue: () => void;
  onSync: () => void;
  onDrop: (track: Track) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  
  return (
    <div
      className={`flex-1 bg-[#111111] rounded p-3 border transition-all ${
        deck.isPlaying ? "border-[#00D4FF]/50" : "border-white/5"
      } ${isDragOver ? "border-[#00D4FF] bg-[#0a0a0a]" : ""}`}
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
      {deck.track ? (
        <>
          {/* Track Info Row */}
          <div className="flex items-center gap-3 mb-2">
            {/* Artwork */}
            <div className="w-[60px] h-[60px] bg-[#1a1a1a] rounded overflow-hidden flex-shrink-0">
              {deck.track.artwork ? (
                <img src={deck.track.artwork} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-[#333]" />
                </div>
              )}
            </div>
            
            {/* Track Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[14px]">
                <span className="text-[#00D4FF] text-[11px] font-bold font-['Rajdhani']">DECK {deckId}</span>
              </div>
              <div className="text-white font-bold text-[14px] truncate">{deck.track.title}</div>
              <div className="flex items-center gap-3 text-[13px]">
                <span className="text-[#888] truncate">{deck.track.artist}</span>
                <span className="text-[#00D4FF] font-['JetBrains_Mono']">{deck.track.bpm} BPM</span>
                <span className="text-[#00D4FF] font-['JetBrains_Mono']">{deck.track.key}</span>
              </div>
            </div>
          </div>
          
          {/* Waveform */}
          <CompactWaveform 
            data={deck.track.waveformData || []} 
            position={deck.position} 
          />
          
          {/* Transport Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onCue}
              className={`px-4 py-1.5 text-[12px] font-bold font-['Rajdhani'] uppercase rounded transition ${
                deck.cueActive ? "bg-[#00D4FF] text-black" : "bg-[#1a1a1a] text-white border border-white/10"
              }`}
              style={{ width: 60, height: 28 }}
            >
              CUE
            </button>
            <button
              onClick={onPlay}
              className={`px-4 py-1.5 text-[12px] font-bold font-['Rajdhani'] uppercase rounded transition flex items-center justify-center gap-1 ${
                deck.isPlaying ? "bg-[#00D4FF] text-black" : "bg-[#1a1a1a] text-white border border-white/10"
              }`}
              style={{ width: 70, height: 28 }}
            >
              {deck.isPlaying ? <Pause className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
              {deck.isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <button
              onClick={onSync}
              className={`px-4 py-1.5 text-[12px] font-bold font-['Rajdhani'] uppercase rounded transition ${
                deck.isSynced ? "bg-[#00FF66] text-black" : "bg-[#1a1a1a] text-white border border-white/10"
              }`}
              style={{ width: 60, height: 28 }}
            >
              SYNC
            </button>
            <span className="text-[#00D4FF] text-[12px] font-['JetBrains_Mono'] ml-auto">
              Tempo: +0%
            </span>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[#333] rounded py-8">
          <Music className="w-8 h-8 text-[#333] mb-2" />
          <span className="text-[#666] text-[13px]">Drop track here</span>
          <span className="text-[#00D4FF] text-[11px] font-['Rajdhani']">DECK {deckId}</span>
        </div>
      )}
    </div>
  );
}

// Compact Mixer Strip
function CompactMixerStrip({
  deckA,
  deckB,
  crossfader,
  crossfaderCurve,
  onDeckAChange,
  onDeckBChange,
  onCrossfaderChange,
  onCrossfaderCurveChange,
}: {
  deckA: DeckState;
  deckB: DeckState;
  crossfader: number;
  crossfaderCurve: "smooth" | "sharp" | "cut";
  onDeckAChange: (updates: Partial<DeckState>) => void;
  onDeckBChange: (updates: Partial<DeckState>) => void;
  onCrossfaderChange: (v: number) => void;
  onCrossfaderCurveChange: (curve: "smooth" | "sharp" | "cut") => void;
}) {
  const vuLevelA = deckA.isPlaying ? 60 + Math.random() * 30 : 0;
  const vuLevelB = deckB.isPlaying ? 60 + Math.random() * 30 : 0;
  
  // Channel Section Component
  const ChannelSection = ({ 
    deck, 
    onChange, 
    label 
  }: { 
    deck: DeckState; 
    onChange: (u: Partial<DeckState>) => void; 
    label: string 
  }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-white text-[11px] font-bold font-['Rajdhani']">{label}</span>
      
      {/* GAIN Knob */}
      <CompactKnob 
        value={deck.gain} 
        onChange={(v) => onChange({ gain: v })} 
        label="GAIN" 
        size={50}
      />
      
      {/* EQ Knobs Row */}
      <div className="flex gap-2">
        <CompactKnob value={deck.eqHigh} onChange={(v) => onChange({ eqHigh: v })} label="HI" size={40} />
        <CompactKnob value={deck.eqMid} onChange={(v) => onChange({ eqMid: v })} label="MID" size={40} />
        <CompactKnob value={deck.eqLow} onChange={(v) => onChange({ eqLow: v })} label="LOW" size={40} />
      </div>
      
      {/* Kill Switches */}
      <div className="flex gap-1">
        {["killHigh", "killMid", "killLow"].map((key) => (
          <button
            key={key}
            onClick={() => onChange({ [key]: !deck[key as keyof DeckState] })}
            className={`w-5 h-5 text-[9px] font-bold rounded transition ${
              deck[key as keyof DeckState] ? "bg-[#FF3B30] text-white" : "bg-[#1a1a1a] text-[#666] border border-white/10"
            }`}
          >
            X
          </button>
        ))}
      </div>
      
      {/* FX Knob */}
      <CompactKnob value={deck.fx} onChange={(v) => onChange({ fx: v })} label="FX" size={40} />
      
      {/* Volume Fader - Compact */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-2 h-[60px] bg-[#0a0a0a] rounded fader-track-compact">
          <div
            className="absolute bottom-0 left-0 right-0 rounded"
            style={{ 
              height: `${deck.volume}%`,
              background: 'linear-gradient(to top, #00D4FF40, #00D4FF20)',
            }}
          />
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-[18px] h-[25px] rounded cursor-pointer"
            style={{ 
              bottom: `calc(${deck.volume}% - 12px)`,
              background: 'linear-gradient(to bottom, #666, #444)',
              border: '1px solid #555',
            }}
            onMouseDown={(e) => {
              const track = e.currentTarget.parentElement;
              if (!track) return;
              
              const handleMove = (moveEvent: MouseEvent) => {
                const rect = track.getBoundingClientRect();
                const y = rect.bottom - moveEvent.clientY;
                const newValue = Math.max(0, Math.min(100, (y / rect.height) * 100));
                onChange({ volume: newValue });
              };
              
              const handleUp = () => {
                window.removeEventListener("mousemove", handleMove);
                window.removeEventListener("mouseup", handleUp);
              };
              
              window.addEventListener("mousemove", handleMove);
              window.addEventListener("mouseup", handleUp);
            }}
          />
        </div>
        
        {/* CUE Button */}
        <button
          onClick={() => onChange({ cueActive: !deck.cueActive })}
          className={`w-10 h-6 text-[10px] font-bold font-['Rajdhani'] rounded transition ${
            deck.cueActive ? "bg-[#00D4FF] text-black" : "bg-[#1a1a1a] text-white border border-white/10"
          }`}
        >
          CUE
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="bg-[#111111] rounded p-3 border-y border-white/5 channel-strip-compact">
      <div className="flex items-start justify-between gap-3">
        {/* Channel A */}
        <ChannelSection deck={deckA} onChange={onDeckAChange} label="CH A" />
        
        {/* Center Section */}
        <div className="flex flex-col items-center gap-3">
          {/* VU Meters */}
          <div className="flex gap-4">
            <CompactVUMeter level={vuLevelA} label="A" />
            <CompactVUMeter level={vuLevelB} label="B" />
          </div>
          
          {/* Crossfader */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-white text-[11px] font-['Rajdhani']">A</span>
              <div className="relative w-[180px] h-6 bg-[#0a0a0a] rounded border border-white/10">
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-[35px] h-5 rounded cursor-pointer"
                  style={{ 
                    left: `calc(${crossfader}% - 17px)`,
                    background: 'linear-gradient(to bottom, #777, #555)',
                    border: '1px solid #666',
                  }}
                  onMouseDown={(e) => {
                    const track = e.currentTarget.parentElement;
                    if (!track) return;
                    
                    const handleMove = (moveEvent: MouseEvent) => {
                      const rect = track.getBoundingClientRect();
                      const x = moveEvent.clientX - rect.left;
                      const newValue = Math.max(0, Math.min(100, (x / rect.width) * 100));
                      onCrossfaderChange(newValue);
                    };
                    
                    const handleUp = () => {
                      window.removeEventListener("mousemove", handleMove);
                      window.removeEventListener("mouseup", handleUp);
                    };
                    
                    window.addEventListener("mousemove", handleMove);
                    window.addEventListener("mouseup", handleUp);
                  }}
                />
              </div>
              <span className="text-white text-[11px] font-['Rajdhani']">B</span>
            </div>
            
            {/* Curve Buttons */}
            <div className="flex gap-1">
              {(["smooth", "sharp", "cut"] as const).map((curve) => (
                <button
                  key={curve}
                  onClick={() => onCrossfaderCurveChange(curve)}
                  className={`px-3 py-1 text-[10px] font-bold font-['Rajdhani'] uppercase rounded transition ${
                    crossfaderCurve === curve
                      ? "bg-[#00D4FF] text-black"
                      : "bg-[#1a1a1a] text-[#666] border border-white/10"
                  }`}
                  style={{ width: 55, height: 22 }}
                >
                  {curve}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Channel B */}
        <ChannelSection deck={deckB} onChange={onDeckBChange} label="CH B" />
      </div>
    </div>
  );
}

// Track Library with Mix Queue
function CompactTrackLibrary({
  tracks,
  mixQueue,
  selectedTrack,
  onTrackSelect,
  onTrackDoubleClick,
  onAddToQueue,
  onRemoveFromQueue,
  onClearQueue,
  onLoadToDeck,
}: {
  tracks: Track[];
  mixQueue: Track[];
  selectedTrack: string | null;
  onTrackSelect: (id: string) => void;
  onTrackDoubleClick: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  onRemoveFromQueue: (trackId: string) => void;
  onClearQueue: () => void;
  onLoadToDeck: (track: Track, deck: "A" | "B") => void;
}) {
  const [filter, setFilter] = useState<"all" | "dna" | "generated">("all");
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
    <div className="flex flex-col h-full bg-[#0D0D0D]">
      {/* Mix Queue Section */}
      <div className="h-[80px] bg-[#0a0a0a] border-t border-white/5 p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-[12px] font-bold font-['Rajdhani']">
            MIX QUEUE ({mixQueue.length} tracks selected)
          </span>
          <button
            onClick={onClearQueue}
            className="text-[#888] text-[11px] hover:text-white transition"
          >
            Clear All
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mixQueue.map((track, index) => (
            <div
              key={track.id}
              className="relative w-[50px] h-[50px] bg-[#1a1a1a] rounded flex-shrink-0 cursor-pointer group"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", JSON.stringify(track));
              }}
              onClick={() => onRemoveFromQueue(track.id)}
            >
              {track.artwork ? (
                <img src={track.artwork} alt="" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-4 h-4 text-[#333]" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[12px] font-bold rounded">
                {index + 1}
              </div>
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded">
                <X className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 12 - mixQueue.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-[50px] h-[50px] border border-dashed border-[#333] rounded flex-shrink-0 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-[#333]" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Track Table Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with filters and search */}
        <div className="flex items-center justify-between p-2 bg-[#111111] border-y border-white/5">
          <div className="flex gap-1">
            {[
              { id: "all", label: `ALL (${tracks.length})` },
              { id: "dna", label: "DNA TRACKS" },
              { id: "generated", label: "GENERATED" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`px-3 py-1 text-[11px] font-bold font-['Rajdhani'] uppercase rounded transition ${
                  filter === tab.id
                    ? "bg-[#00D4FF] text-black"
                    : "text-[#888] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px] px-3 py-1 bg-[#1a1a1a] border border-white/10 rounded text-[12px] text-white placeholder-[#666] focus:border-[#00D4FF] focus:outline-none"
          />
        </div>
        
        {/* Table Header */}
        <div className="flex items-center px-2 py-1 bg-[#1a1a1a] text-[#888] text-[11px] uppercase font-['Rajdhani'] tracking-wider border-b border-white/5">
          <div className="w-[50px]"></div>
          <div className="flex-1 min-w-[150px]">Title</div>
          <div className="w-[120px]">Artist</div>
          <div className="w-[70px] text-center">BPM</div>
          <div className="w-[50px] text-center">Key</div>
          <div className="w-[70px] text-center">Duration</div>
          <div className="w-[100px]">Album</div>
        </div>
        
        {/* Track Rows */}
        <div className="flex-1 overflow-y-auto">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className={`flex items-center px-2 py-1 border-b border-white/5 cursor-pointer transition h-[50px] ${
                selectedTrack === track.id
                  ? "bg-[#1a1a1a] border-l-[3px] border-l-[#00D4FF]"
                  : "border-l-[3px] border-l-transparent hover:bg-[#1a1a1a] hover:border-l-[#00D4FF]/50"
              }`}
              onClick={() => {
                onTrackSelect(track.id);
                onAddToQueue(track);
              }}
              onDoubleClick={() => onTrackDoubleClick(track)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, track });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", JSON.stringify(track));
              }}
            >
              {/* Artwork */}
              <div className="w-[40px] h-[40px] bg-[#1a1a1a] rounded overflow-hidden flex-shrink-0 mr-2">
                {track.artwork ? (
                  <img src={track.artwork} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-4 h-4 text-[#333]" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-[150px] text-white text-[13px] font-bold truncate">{track.title}</div>
              <div className="w-[120px] text-[#888] text-[13px] truncate">{track.artist}</div>
              <div className="w-[70px] text-[#00D4FF] text-[12px] font-['JetBrains_Mono'] text-center">{track.bpm}</div>
              <div className="w-[50px] text-[#00D4FF] text-[12px] font-['JetBrains_Mono'] text-center">{track.key}</div>
              <div className="w-[70px] text-[#888] text-[12px] font-['JetBrains_Mono'] text-center">{track.duration}</div>
              <div className="w-[100px] text-[#888] text-[12px] truncate">{track.album}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-[#1a1a1a] border border-white/10 rounded shadow-xl z-50 py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="w-full px-4 py-2 text-left text-[12px] text-white hover:bg-[#00D4FF] hover:text-black transition flex items-center gap-2"
            onClick={() => {
              onLoadToDeck(contextMenu.track, "A");
              setContextMenu(null);
            }}
          >
            <ChevronRight className="w-3 h-3" /> Load to Deck A
          </button>
          <button
            className="w-full px-4 py-2 text-left text-[12px] text-white hover:bg-[#00D4FF] hover:text-black transition flex items-center gap-2"
            onClick={() => {
              onLoadToDeck(contextMenu.track, "B");
              setContextMenu(null);
            }}
          >
            <ChevronRight className="w-3 h-3" /> Load to Deck B
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
  
  const [deckA, setDeckA] = useState<DeckState>({
    track: null,
    isPlaying: false,
    position: 0,
    volume: 80,
    gain: 50,
    eqHigh: 50,
    eqMid: 50,
    eqLow: 50,
    fx: 0,
    isSynced: false,
    killHigh: false,
    killMid: false,
    killLow: false,
    cueActive: false,
  });
  
  const [deckB, setDeckB] = useState<DeckState>({
    track: null,
    isPlaying: false,
    position: 0,
    volume: 80,
    gain: 50,
    eqHigh: 50,
    eqMid: 50,
    eqLow: 50,
    fx: 0,
    isSynced: false,
    killHigh: false,
    killMid: false,
    killLow: false,
    cueActive: false,
  });
  
  const [crossfader, setCrossfader] = useState(50);
  const [crossfaderCurve, setCrossfaderCurve] = useState<"smooth" | "sharp" | "cut">("smooth");
  
  // Playback animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (deckA.isPlaying && deckA.track) {
        setDeckA((prev) => ({ ...prev, position: (prev.position + 0.2) % 100 }));
      }
      if (deckB.isPlaying && deckB.track) {
        setDeckB((prev) => ({ ...prev, position: (prev.position + 0.2) % 100 }));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [deckA.isPlaying, deckB.isPlaying]);
  
  const loadTrackToDeck = useCallback((track: Track, deck: "A" | "B") => {
    if (deck === "A") {
      setDeckA((prev) => ({ ...prev, track, position: 0, isPlaying: false }));
    } else {
      setDeckB((prev) => ({ ...prev, track, position: 0, isPlaying: false }));
    }
  }, []);
  
  const handleTrackDoubleClick = useCallback((track: Track) => {
    if (!deckA.track) {
      loadTrackToDeck(track, "A");
    } else if (!deckB.track) {
      loadTrackToDeck(track, "B");
    }
  }, [deckA.track, deckB.track, loadTrackToDeck]);
  
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
    <div className="flex flex-col h-[720px] max-h-[720px] bg-[#0D0D0D] overflow-hidden mixer-compact">
      {/* ZONE 1: DECKS - 160px (reduced from 180px) */}
      <div className="h-[160px] flex gap-2 p-2">
        <CompactDeckPanel
          deck={deckA}
          deckId="A"
          onPlay={() => setDeckA((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
          onCue={() => setDeckA((prev) => ({ ...prev, cueActive: !prev.cueActive }))}
          onSync={() => setDeckA((prev) => ({ ...prev, isSynced: !prev.isSynced }))}
          onDrop={(track) => loadTrackToDeck(track, "A")}
        />
        <CompactDeckPanel
          deck={deckB}
          deckId="B"
          onPlay={() => setDeckB((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
          onCue={() => setDeckB((prev) => ({ ...prev, cueActive: !prev.cueActive }))}
          onSync={() => setDeckB((prev) => ({ ...prev, isSynced: !prev.isSynced }))}
          onDrop={(track) => loadTrackToDeck(track, "B")}
        />
      </div>
      
      {/* ZONE 2: MIXER - 180px (reduced from 200px) */}
      <div className="h-[180px]">
        <CompactMixerStrip
          deckA={deckA}
          deckB={deckB}
          crossfader={crossfader}
          crossfaderCurve={crossfaderCurve}
          onDeckAChange={(updates) => setDeckA((prev) => ({ ...prev, ...updates }))}
          onDeckBChange={(updates) => setDeckB((prev) => ({ ...prev, ...updates }))}
          onCrossfaderChange={setCrossfader}
          onCrossfaderCurveChange={setCrossfaderCurve}
        />
      </div>
      
      {/* ZONE 3: TRACK LIBRARY - 380px (reduced from 420px) */}
      <div className="flex-1 h-[380px]">
        <CompactTrackLibrary
          tracks={tracks}
          mixQueue={mixQueue}
          selectedTrack={selectedTrack}
          onTrackSelect={setSelectedTrack}
          onTrackDoubleClick={handleTrackDoubleClick}
          onAddToQueue={addToQueue}
          onRemoveFromQueue={removeFromQueue}
          onClearQueue={() => setMixQueue([])}
          onLoadToDeck={loadTrackToDeck}
        />
      </div>
    </div>
  );
}
