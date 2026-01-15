"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Plus, X, ChevronDown, ChevronRight, Music } from "lucide-react";
import { PhotorealisticKnob } from "./photorealistic-knob";
import { ColorfulWaveform } from "./colorful-waveform";

// Types
interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  keyColor: string;
  standardKey: string;
  duration: number;
  energy: number;
  rating: number;
  artwork?: string;
  type: "dna" | "generated" | "uploaded";
}

interface DeckState {
  track: Track | null;
  isPlaying: boolean;
  isSynced: boolean;
  position: number;
  tempo: number;
  gain: number;
  eqHigh: number;
  eqMid: number;
  eqLow: number;
  filter: number;
  volume: number;
  vuLevel: number;
  cueActive: boolean;
}

// Camelot color mapping
const CAMELOT_COLORS: Record<string, string> = {
  "1A": "#FF6B6B", "1B": "#FF6B6B",
  "2A": "#FFB347", "2B": "#FFB347",
  "3A": "#FFFF66", "3B": "#FFFF66",
  "4A": "#98FB98", "4B": "#98FB98",
  "5A": "#87CEEB", "5B": "#87CEEB",
  "6A": "#DDA0DD", "6B": "#DDA0DD",
  "7A": "#FFB6C1", "7B": "#FFB6C1",
  "8A": "#F0E68C", "8B": "#F0E68C",
  "9A": "#98D8C8", "9B": "#98D8C8",
  "10A": "#B0C4DE", "10B": "#B0C4DE",
  "11A": "#DEB887", "11B": "#DEB887",
  "12A": "#F4A460", "12B": "#F4A460",
};

// Sample tracks
const SAMPLE_TRACKS: Track[] = [
  {
    id: "1",
    title: "Midnight Drive",
    artist: "Synthwave Dreams",
    bpm: 128,
    key: "8A",
    keyColor: CAMELOT_COLORS["8A"],
    standardKey: "Am",
    duration: 272,
    energy: 7,
    rating: 5,
    type: "generated",
    artwork: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    title: "Electric Pulse",
    artist: "DJ Quantum",
    bpm: 126,
    key: "11B",
    keyColor: CAMELOT_COLORS["11B"],
    standardKey: "F#m",
    duration: 318,
    energy: 8,
    rating: 4,
    type: "dna",
    artwork: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    title: "Bass Reactor",
    artist: "Low Frequency",
    bpm: 140,
    key: "3A",
    keyColor: CAMELOT_COLORS["3A"],
    standardKey: "Dm",
    duration: 225,
    energy: 9,
    rating: 4,
    type: "generated",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    title: "Cosmic Journey",
    artist: "Star Gazer",
    bpm: 132,
    key: "6B",
    keyColor: CAMELOT_COLORS["6B"],
    standardKey: "Gm",
    duration: 372,
    energy: 6,
    rating: 5,
    type: "dna",
    artwork: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    title: "Urban Nights",
    artist: "City Beats",
    bpm: 124,
    key: "10A",
    keyColor: CAMELOT_COLORS["10A"],
    standardKey: "Cm",
    duration: 295,
    energy: 5,
    rating: 3,
    type: "generated",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
  },
];

const INITIAL_DECK_STATE: DeckState = {
  track: null,
  isPlaying: false,
  isSynced: false,
  position: 0,
  tempo: 0,
  gain: 75,
  eqHigh: 50,
  eqMid: 50,
  eqLow: 50,
  filter: 50,
  volume: 85,
  vuLevel: 0,
  cueActive: false,
};

// VU Meter Component
function VUMeter({ level, label }: { level: number; label: string }) {
  const segments = 16;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-col-reverse gap-[2px] p-1 bg-[#0a0a0a] rounded">
        {Array.from({ length: segments }, (_, i) => {
          const segmentLevel = ((i + 1) / segments) * 100;
          const isActive = level >= segmentLevel;
          let color = "#00FF66";
          if (i >= 14) color = "#FF3B30";
          else if (i >= 10) color = "#FF9500";
          
          return (
            <div
              key={i}
              className="w-3 h-[6px] rounded-sm transition-all"
              style={{
                backgroundColor: isActive ? color : "#1a1a1a",
                boxShadow: isActive ? `0 0 4px ${color}80` : "none",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            />
          );
        })}
      </div>
      <span className="text-white/50 text-[9px] uppercase font-bold">{label}</span>
    </div>
  );
}

// LED Indicator
function LED({ active, color = "#00D4FF" }: { active: boolean; color?: string }) {
  return (
    <div
      className="w-2 h-2 rounded-full transition-all"
      style={{
        backgroundColor: active ? color : "#1a1a1a",
        boxShadow: active ? `0 0 6px ${color}, 0 0 12px ${color}80` : "none",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    />
  );
}

export function AutoDJMixerPhotorealistic() {
  const [deckA, setDeckA] = useState<DeckState>(INITIAL_DECK_STATE);
  const [deckB, setDeckB] = useState<DeckState>(INITIAL_DECK_STATE);
  const [mixQueue, setMixQueue] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [crossfader, setCrossfader] = useState(50);
  const [masterVolume, setMasterVolume] = useState(75);
  const [boothVolume, setBoothVolume] = useState(50);
  const [cueMix, setCueMix] = useState(50);
  const [cueLevel, setCueLevel] = useState(50);
  const [resonance, setResonance] = useState(50);
  const [showFxMenu, setShowFxMenu] = useState(false);
  const [filter, setFilter] = useState<"all" | "dna" | "generated" | "uploaded">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; track: Track } | null>(null);

  // Playback simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (deckA.isPlaying) {
        setDeckA((prev) => ({
          ...prev,
          position: prev.position >= 100 ? 0 : prev.position + 0.3,
          vuLevel: 50 + Math.random() * 40,
        }));
      } else {
        setDeckA((prev) => ({ ...prev, vuLevel: 0 }));
      }
      if (deckB.isPlaying) {
        setDeckB((prev) => ({
          ...prev,
          position: prev.position >= 100 ? 0 : prev.position + 0.3,
          vuLevel: 50 + Math.random() * 40,
        }));
      } else {
        setDeckB((prev) => ({ ...prev, vuLevel: 0 }));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [deckA.isPlaying, deckB.isPlaying]);

  // Close context menu
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const loadTrackToDeck = (track: Track, deck: "A" | "B") => {
    const setter = deck === "A" ? setDeckA : setDeckB;
    setter((prev) => ({
      ...prev,
      track: { ...track },
      position: 0,
      isPlaying: false,
    }));
  };

  const handleTrackDoubleClick = (track: Track) => {
    if (!deckA.track) {
      loadTrackToDeck(track, "A");
    } else if (!deckB.track) {
      loadTrackToDeck(track, "B");
    } else {
      loadTrackToDeck(track, "A");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms}`;
  };

  const filteredTracks = SAMPLE_TRACKS.filter((track) => {
    const matchesFilter = filter === "all" || track.type === filter;
    const matchesSearch =
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-[850px] bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* ZONE 1: MIX QUEUE - 60px */}
      <div className="h-[60px] bg-[#0a0a0a] border-b border-white/10 px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-[11px] font-bold uppercase tracking-wider">MIX QUEUE</span>
          <span className="text-[#888] text-[10px]">{mixQueue.length} tracks</span>
          <button
            onClick={() => setMixQueue([])}
            className="text-[#888] text-[10px] hover:text-white transition uppercase"
          >
            Clear All
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mixQueue.map((track, index) => (
            <div
              key={track.id}
              className="relative w-[45px] h-[45px] bg-[#111] rounded flex-shrink-0 cursor-pointer group"
              onClick={() => setMixQueue((prev) => prev.filter((t) => t.id !== track.id))}
            >
              {track.artwork ? (
                <img src={track.artwork} alt="" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-4 h-4 text-[#333]" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[11px] font-bold rounded">
                {index + 1}
              </div>
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded">
                <X className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
          
          {Array.from({ length: Math.max(0, 10 - mixQueue.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-[45px] h-[45px] border border-dashed border-[#333] rounded flex-shrink-0 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-[#333]" />
            </div>
          ))}
        </div>
      </div>

      {/* ZONE 2: DECKS - 200px */}
      <div className="h-[200px] flex gap-2 px-2 py-2">
        {[
          { deck: deckA, setDeck: setDeckA, id: "A" },
          { deck: deckB, setDeck: setDeckB, id: "B" },
        ].map(({ deck, setDeck, id }) => (
          <div
            key={id}
            className={`flex-1 bg-[#111] rounded-lg border-2 transition-all ${
              deck.isPlaying ? "border-[#00D4FF]" : "border-white/10"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              try {
                const trackData = e.dataTransfer.getData("application/json");
                if (trackData) {
                  loadTrackToDeck(JSON.parse(trackData), id as "A" | "B");
                }
              } catch (err) {
                console.error("Drop error:", err);
              }
            }}
          >
            {deck.track ? (
              <div className="p-2 h-full flex flex-col">
                {/* Top row */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#00D4FF] text-[11px] font-bold uppercase tracking-wider">
                    DECK {id}
                  </span>
                  <div className="flex items-center gap-1">
                    {deck.isPlaying ? (
                      <>
                        <Play className="w-3 h-3 text-[#00FF66] fill-[#00FF66]" />
                        <span className="text-[#00FF66] text-[10px] font-bold uppercase">PLAYING</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-3 h-3 text-[#888] fill-[#888]" />
                        <span className="text-[#888] text-[10px] font-bold uppercase">STOPPED</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Track info */}
                <div className="mb-1">
                  <div className="text-white text-[14px] font-bold truncate">{deck.track.artist}</div>
                  <div className="text-[#888] text-[13px] truncate">{deck.track.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#00D4FF] text-black text-[11px] font-bold px-2 py-0.5 rounded">
                      {deck.track.bpm} BPM
                    </span>
                    <span
                      className="text-white text-[11px] font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: deck.track.keyColor }}
                    >
                      {deck.track.key}
                    </span>
                    <span className="text-[#888] text-[11px]">
                      {formatTime(deck.track.duration)}
                    </span>
                  </div>
                </div>

                {/* Colorful waveform */}
                <div className="mb-1">
                  <ColorfulWaveform position={deck.position} isPlaying={deck.isPlaying} />
                </div>

                {/* Bottom row: Time, Tempo, BPM */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-[24px] font-['JetBrains_Mono'] font-bold">
                    {formatTime((deck.track.duration * deck.position) / 100)}
                  </span>
                  <span
                    className={`text-[14px] font-['JetBrains_Mono'] font-bold ${
                      deck.tempo > 0 ? "text-[#00FF66]" : deck.tempo < 0 ? "text-[#FF3B30]" : "text-[#888]"
                    }`}
                  >
                    {deck.tempo > 0 ? "+" : ""}{deck.tempo.toFixed(2)}%
                  </span>
                  <span className="text-[#00D4FF] text-[28px] font-bold">
                    {Math.round(deck.track.bpm * (1 + deck.tempo / 100))}
                  </span>
                </div>

                {/* Transport controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeck((prev) => ({ ...prev, cueActive: !prev.cueActive, position: 0 }))}
                    className={`h-[32px] px-4 text-[12px] font-bold uppercase rounded transition ${
                      deck.cueActive
                        ? "bg-[#FF9500] text-black"
                        : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
                    }`}
                  >
                    CUE
                  </button>
                  <button
                    onClick={() => setDeck((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
                    className={`h-[32px] px-4 text-[12px] font-bold uppercase rounded transition flex items-center gap-1 ${
                      deck.isPlaying
                        ? "bg-[#00D4FF] text-black"
                        : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
                    }`}
                  >
                    {deck.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {deck.isPlaying ? "PAUSE" : "PLAY"}
                  </button>
                  <button
                    onClick={() => setDeck((prev) => ({ ...prev, isSynced: !prev.isSynced }))}
                    className={`h-[32px] px-4 text-[12px] font-bold uppercase rounded transition ${
                      deck.isSynced
                        ? "bg-[#00FF66] text-black"
                        : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
                    }`}
                  >
                    SYNC
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Music className="w-12 h-12 text-white/10 mx-auto mb-2" />
                  <p className="text-white/40 text-[13px] font-semibold">Drop track here</p>
                  <p className="text-[#00D4FF] text-[11px] uppercase font-bold">DECK {id}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ZONE 3: PHOTOREALISTIC MIXER - 280px */}
      <div className="h-[280px] bg-[#0a0a0a] relative overflow-hidden">
        {/* Brushed metal texture background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%),
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.01) 1px, rgba(255,255,255,0.01) 2px)
            `,
          }}
        />
        
        {/* Wood side accents */}
        <div className="absolute left-0 top-0 bottom-0 w-[10px] bg-[#8B7355]" />
        <div className="absolute right-0 top-0 bottom-0 w-[10px] bg-[#8B7355]" />

        <div className="relative h-full flex items-stretch px-4 py-4 gap-4">
          {/* CHANNEL A */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[#888] text-[9px] uppercase tracking-wider font-bold">CHANNEL 1</span>
            
            <LED active={true} color="#4169E1" />
            
            <PhotorealisticKnob
              value={deckA.gain}
              onChange={(v) => setDeckA((prev) => ({ ...prev, gain: v }))}
              label="GAIN"
              size="large"
            />
            
            <LED active={deckA.vuLevel > 90} color="#FF3B30" />
            
            <PhotorealisticKnob
              value={deckA.eqHigh}
              onChange={(v) => setDeckA((prev) => ({ ...prev, eqHigh: v }))}
              label="HIGH"
              size="small"
            />
            
            <PhotorealisticKnob
              value={deckA.eqMid}
              onChange={(v) => setDeckA((prev) => ({ ...prev, eqMid: v }))}
              label="MID"
              size="small"
            />
            
            <PhotorealisticKnob
              value={deckA.eqLow}
              onChange={(v) => setDeckA((prev) => ({ ...prev, eqLow: v }))}
              label="LOW"
              size="small"
            />
            
            <button
              onClick={() => setDeckA((prev) => ({ ...prev, cueActive: !prev.cueActive }))}
              className={`w-12 h-6 text-[10px] font-bold uppercase rounded transition flex items-center justify-center gap-1 ${
                deckA.cueActive ? "bg-[#00D4FF] text-black" : "bg-[#1a1a1a] text-white"
              }`}
            >
              <LED active={deckA.cueActive} />
              CUE
            </button>
            
            <PhotorealisticKnob
              value={deckA.filter}
              onChange={(v) => setDeckA((prev) => ({ ...prev, filter: v }))}
              label="FILTER"
              size="large"
            />
          </div>

          {/* CENTER SECTION */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex gap-2 mb-2">
              <PhotorealisticKnob
                value={masterVolume}
                onChange={setMasterVolume}
                label="MASTER"
                size="medium"
              />
              <PhotorealisticKnob
                value={boothVolume}
                onChange={setBoothVolume}
                label="BOOTH"
                size="medium"
              />
            </div>

            <div className="flex gap-3">
              <VUMeter level={deckA.vuLevel} label="A" />
              <VUMeter level={deckB.vuLevel} label="B" />
            </div>

            <PhotorealisticKnob
              value={cueMix}
              onChange={setCueMix}
              label="CUE MIX"
              size="small"
            />

            <PhotorealisticKnob
              value={cueLevel}
              onChange={setCueLevel}
              label="CUE LEVEL"
              size="small"
            />

            <PhotorealisticKnob
              value={resonance}
              onChange={setResonance}
              label="RESONANCE"
              size="xlarge"
            />

            {/* Crossfader */}
            <div className="flex flex-col items-center gap-1 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[#00D4FF] text-[11px] font-bold">A</span>
                <div className="relative w-[160px] h-6 bg-[#0a0a0a] rounded border border-white/10">
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-[35px] h-5 rounded cursor-pointer"
                    style={{
                      left: `calc(${crossfader}% - 17px)`,
                      background: "linear-gradient(to bottom, #777, #555)",
                      border: "1px solid #666",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                    onMouseDown={(e) => {
                      const track = e.currentTarget.parentElement;
                      if (!track) return;
                      const handleMove = (moveEvent: MouseEvent) => {
                        const rect = track.getBoundingClientRect();
                        const x = moveEvent.clientX - rect.left;
                        const newValue = Math.max(0, Math.min(100, (x / rect.width) * 100));
                        setCrossfader(newValue);
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
                <span className="text-[#00D4FF] text-[11px] font-bold">B</span>
              </div>
            </div>

            {/* FX Button */}
            <div className="relative">
              <button
                onClick={() => setShowFxMenu(!showFxMenu)}
                className="px-4 py-1 bg-[#1a1a1a] text-white text-[11px] font-bold uppercase rounded hover:bg-[#252525] transition flex items-center gap-1"
              >
                FX <ChevronDown className="w-3 h-3" />
              </button>
              {showFxMenu && (
                <div className="absolute bottom-full mb-1 left-0 bg-[#1a1a1a] border border-white/10 rounded shadow-xl z-50 py-1 w-40">
                  {["Filter Sweep", "Echo Out", "Reverb Wash", "Backspin", "Brake"].map((fx) => (
                    <button
                      key={fx}
                      className="w-full px-3 py-1.5 text-left text-[11px] text-white hover:bg-[#00D4FF] hover:text-black transition"
                      onClick={() => setShowFxMenu(false)}
                    >
                      {fx}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CHANNEL B */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[#888] text-[9px] uppercase tracking-wider font-bold">CHANNEL 2</span>
            
            <LED active={true} color="#4169E1" />
            
            <PhotorealisticKnob
              value={deckB.gain}
              onChange={(v) => setDeckB((prev) => ({ ...prev, gain: v }))}
              label="GAIN"
              size="large"
            />
            
            <LED active={deckB.vuLevel > 90} color="#FF3B30" />
            
            <PhotorealisticKnob
              value={deckB.eqHigh}
              onChange={(v) => setDeckB((prev) => ({ ...prev, eqHigh: v }))}
              label="HIGH"
              size="small"
            />
            
            <PhotorealisticKnob
              value={deckB.eqMid}
              onChange={(v) => setDeckB((prev) => ({ ...prev, eqMid: v }))}
              label="MID"
              size="small"
            />
            
            <PhotorealisticKnob
              value={deckB.eqLow}
              onChange={(v) => setDeckB((prev) => ({ ...prev, eqLow: v }))}
              label="LOW"
              size="small"
            />
            
            <button
              onClick={() => setDeckB((prev) => ({ ...prev, cueActive: !prev.cueActive }))}
              className={`w-12 h-6 text-[10px] font-bold uppercase rounded transition flex items-center justify-center gap-1 ${
                deckB.cueActive ? "bg-[#00D4FF] text-black" : "bg-[#1a1a1a] text-white"
              }`}
            >
              <LED active={deckB.cueActive} />
              CUE
            </button>
            
            <PhotorealisticKnob
              value={deckB.filter}
              onChange={(v) => setDeckB((prev) => ({ ...prev, filter: v }))}
              label="FILTER"
              size="large"
            />
          </div>
        </div>
      </div>

      {/* ZONE 4: TRACK LIBRARY - MIXED IN KEY STYLE - 310px */}
      <div className="flex-1 h-[310px] flex flex-col bg-[#0d0d0d]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/10">
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
                className={`px-3 py-1 text-[11px] font-bold uppercase rounded transition ${
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
        <div className="flex items-center px-4 py-2 bg-[#1a1a1a] text-[#888] text-[10px] uppercase font-bold tracking-wider border-b border-white/5">
          <div className="w-[50px]">Key</div>
          <div className="w-[45px]">Art</div>
          <div className="flex-1 min-w-[120px]">Artist</div>
          <div className="flex-1 min-w-[120px]">Title</div>
          <div className="w-[60px]">Standard</div>
          <div className="w-[60px] text-center">Tempo</div>
          <div className="w-[70px] text-center">Energy</div>
          <div className="w-[80px] text-center">Rating</div>
        </div>

        {/* Track Rows */}
        <div className="flex-1 overflow-y-auto">
          {filteredTracks.map((track, index) => (
            <div
              key={track.id}
              className={`flex items-center px-4 py-2 h-[38px] border-b border-white/5 cursor-pointer transition ${
                selectedTrack === track.id
                  ? "bg-[#1a1a1a] border-l-[3px] border-l-[#00D4FF]"
                  : "border-l-[3px] border-l-transparent hover:bg-[#1a1a1a] hover:border-l-[#00D4FF]/50"
              } ${index % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#111]"}`}
              onClick={() => {
                setSelectedTrack(track.id);
                if (!mixQueue.find((t) => t.id === track.id)) {
                  setMixQueue((prev) => [...prev, track]);
                }
              }}
              onDoubleClick={() => handleTrackDoubleClick(track)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, track });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", JSON.stringify(track));
              }}
            >
              {/* Key badge */}
              <div
                className="w-[40px] h-[22px] rounded flex items-center justify-center text-white text-[11px] font-bold mr-2"
                style={{ backgroundColor: track.keyColor }}
              >
                {track.key}
              </div>

              {/* Artwork */}
              <div className="w-[35px] h-[35px] bg-[#1a1a1a] rounded overflow-hidden mr-2">
                {track.artwork ? (
                  <img src={track.artwork} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-4 h-4 text-[#333]" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-[120px] text-white text-[13px] truncate">{track.artist}</div>
              <div className="flex-1 min-w-[120px] text-[#888] text-[13px] truncate">{track.title}</div>
              <div className="w-[60px] text-[#888] text-[12px]">{track.standardKey}</div>
              <div className="w-[60px] text-[#00D4FF] text-[12px] font-['JetBrains_Mono'] text-center font-bold">
                {track.bpm}
              </div>
              
              {/* Energy dots */}
              <div className="w-[70px] flex justify-center gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => {
                  let color = "#4169E1";
                  if (i >= 7) color = "#FF3B30";
                  else if (i >= 4) color = "#FF9500";
                  else if (i >= 2) color = "#00FF66";
                  
                  return (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: i < track.energy ? color : "#1a1a1a",
                      }}
                    />
                  );
                })}
              </div>

              {/* Rating stars */}
              <div className="w-[80px] flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < track.rating ? "text-[#FF9500]" : "text-[#333]"}>
                    ★
                  </span>
                ))}
              </div>
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
              loadTrackToDeck(contextMenu.track, "A");
              setContextMenu(null);
            }}
          >
            <ChevronRight className="w-3 h-3" /> Load to Deck A
          </button>
          <button
            className="w-full px-4 py-2 text-left text-[12px] text-white hover:bg-[#00D4FF] hover:text-black transition flex items-center gap-2"
            onClick={() => {
              loadTrackToDeck(contextMenu.track, "B");
              setContextMenu(null);
            }}
          >
            <ChevronRight className="w-3 h-3" /> Load to Deck B
          </button>
          <button
            className="w-full px-4 py-2 text-left text-[12px] text-white hover:bg-[#00D4FF] hover:text-black transition flex items-center gap-2"
            onClick={() => {
              if (!mixQueue.find((t) => t.id === contextMenu.track.id)) {
                setMixQueue((prev) => [...prev, contextMenu.track]);
              }
              setContextMenu(null);
            }}
          >
            <Plus className="w-3 h-3" /> Add to Mix Queue
          </button>
        </div>
      )}
    </div>
  );
}



