"use client";

import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  X,
  Music,
  Key,
  Zap,
  ArrowRightLeft,
  Circle
} from "lucide-react";
import { AddTracksToMixModal } from "./add-tracks-to-mix-modal";

interface SelectedTrack {
  id: number;
  title: string;
  artist: string;
  bpm: number;
  key: string;
}

// Fake data for decks
const DECK_A = {
  title: "Midnight Resonance",
  artist: "Adam Beyer",
  key: "A#m",
  bpm: 132,
};

const DECK_B = {
  title: "Deep Horizon",
  artist: "Tale Of Us",
  key: "Dm",
  bpm: 124,
};

// Generate waveform bars
const generateWaveformBars = (count: number = 120): number[] => {
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    // Bass heavy on left (taller), mids center, highs right (shorter)
    const position = i / count;
    let height: number;
    if (position < 0.3) {
      // Left: bass heavy - 60-100%
      height = 60 + Math.random() * 40;
    } else if (position < 0.7) {
      // Center: mids - 40-80%
      height = 40 + Math.random() * 40;
    } else {
      // Right: highs - 30-70%
      height = 30 + Math.random() * 40;
    }
    bars.push(height);
  }
  return bars;
};

// Selected Tracks Pool Component
function SelectedTracksPool({ tracks, onRemoveTrack }: { tracks: SelectedTrack[]; onRemoveTrack: (id: number) => void }) {
  return (
    <div
      className="flex flex-col"
      style={{
        width: '30%',
        background: 'var(--surface-2)',
        borderLeft: '1px solid var(--border-strong)',
        padding: '20px',
        height: '100%',
      }}
    >
      {/* Header */}
      <div className="relative mb-4">
        <h3
          className="uppercase"
          style={{
            color: 'var(--text-2)',
            fontSize: '12px',
            letterSpacing: '1px',
            marginBottom: '16px',
          }}
        >
          SELECTED TRACKS POOL
        </h3>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="mb-2 transition-colors cursor-pointer"
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div className="flex items-start gap-3">
              {/* Number */}
              <span
                style={{
                  color: 'var(--text-3)',
                  fontSize: '14px',
                  width: '24px',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <div
                  className="truncate"
                  style={{
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '4px',
                  }}
                >
                  {track.title}
                </div>
                <div
                  className="truncate"
                  style={{
                    color: 'var(--text-3)',
                    fontSize: '12px',
                    marginBottom: '8px',
                  }}
                >
                  {track.artist}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Key Badge */}
                  <span
                    className="rounded-full"
                    style={{
                      background: track.key.includes('m') ? 'var(--orange-2)' : 'var(--cyan-2)',
                      color: '#000',
                      padding: '6px',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    {track.key}
                  </span>

                  {/* BPM Badge */}
                  <span
                    className="rounded-full font-mono"
                    style={{
                      background: 'var(--cyan-2)',
                      color: '#000',
                      padding: '6px',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    {track.bpm} BPM
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* NEXT IN PLAYLIST indicator */}
        {tracks.length > 0 && (
          <div
            className="mt-4"
            style={{
              background: 'var(--orange-2)',
              color: '#000',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            NEXT IN PLAYLIST
          </div>
        )}
      </div>
    </div>
  );
}

export default function AutoDJMixerFigma() {
  const [mode, setMode] = useState<"2-deck" | "4-deck">("2-deck");
  const [showAddTracksModal, setShowAddTracksModal] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeFX, setActiveFX] = useState<Set<string>>(new Set(["REVERB", "DELAY"]));
  const [crossfaderValue, setCrossfaderValue] = useState(50);
  const [eqPadValue, setEqPadValue] = useState(50);

  const handleAddTracks = (trackIds: number[]) => {
    // Convert track IDs to SelectedTrack objects
    // For demo purposes, create simple track objects
    const newTracks: SelectedTrack[] = trackIds.map((id, index) => ({
      id,
      title: `Track ${id}`,
      artist: "Artist",
      bpm: 128 + (index % 10),
      key: ["Am", "Cm", "Dm", "Em", "Fm", "Gm"][index % 6],
    }));
    setSelectedTracks([...selectedTracks, ...newTracks]);
  };

  const handleRemoveTrack = (id: number) => {
    setSelectedTracks(selectedTracks.filter(t => t.id !== id));
  };

  const toggleFX = (fxName: string) => {
    const newActive = new Set(activeFX);
    if (newActive.has(fxName)) {
      newActive.delete(fxName);
    } else {
      newActive.add(fxName);
    }
    setActiveFX(newActive);
  };

  const waveformBarsA = generateWaveformBars(120);
  const waveformBarsB = generateWaveformBars(120);

  return (
    <div className="h-full min-h-0 flex gap-6" style={{ background: 'var(--bg-0)' }}>
      {/* Main Mixer - 70% */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Mode Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setMode("2-deck")}
              className="rounded-lg transition-colors cursor-pointer"
              style={{
                background: mode === "2-deck" ? 'var(--cyan-2)' : 'transparent',
                color: mode === "2-deck" ? '#000' : 'var(--text-2)',
                border: mode === "2-deck" ? 'none' : '1px solid var(--border)',
                padding: '10px 20px',
                fontWeight: mode === "2-deck" ? 700 : 500,
                fontSize: '14px',
              }}
            >
              2-DECK MODE
            </button>
            <button
              onClick={() => setMode("4-deck")}
              className="rounded-lg transition-colors cursor-pointer"
              style={{
                background: mode === "4-deck" ? 'var(--cyan-2)' : 'transparent',
                color: mode === "4-deck" ? '#000' : 'var(--text-2)',
                border: mode === "4-deck" ? 'none' : '1px solid var(--border)',
                padding: '10px 20px',
                fontWeight: mode === "4-deck" ? 700 : 500,
                fontSize: '14px',
              }}
            >
              4-DECK MODE
            </button>
          </div>

          {/* ADD TRACKS Button */}
          <button
            onClick={() => setShowAddTracksModal(true)}
            className="rounded-lg transition-all cursor-pointer flex items-center gap-2"
            style={{
              background: 'var(--cyan-2)',
              color: '#000',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: 'var(--glow-cyan)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            ADD TRACKS
          </button>
        </div>

        {/* Waveform Decks */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Deck A - Orange */}
          <div
            className="relative rounded-lg"
            style={{
              minHeight: '140px',
              background: 'linear-gradient(to right, rgba(255, 106, 0, 0.08), transparent)',
              border: '1px solid rgba(255, 106, 0, 0.3)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            {/* Waveform Bars */}
            <div className="flex items-end gap-0.5 mb-2" style={{ height: '80px' }}>
              {waveformBarsA.map((height, i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    height: `${height}%`,
                    background: '#FF6A00',
                    borderRadius: '1px',
                  }}
                />
              ))}
            </div>

            {/* Track Info Overlay */}
            <div className="absolute top-4 left-4">
              <div
                style={{
                  color: 'var(--text)',
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                {DECK_A.title}
              </div>
              <div
                style={{
                  color: 'var(--text-3)',
                  fontSize: '13px',
                }}
              >
                {DECK_A.artist}
              </div>
            </div>

            {/* Key and BPM Overlay */}
            <div className="absolute top-4 right-4 text-right">
              <div
                className="inline-block rounded-full"
                style={{
                  background: 'var(--orange-2)',
                  color: '#000',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {DECK_A.key}
              </div>
              <div
                className="block mt-1"
                style={{
                  color: 'var(--text-3)',
                  fontSize: '11px',
                }}
              >
                {DECK_A.bpm} BPM
              </div>
            </div>
          </div>

          {/* Deck B - Cyan */}
          <div
            className="relative rounded-lg"
            style={{
              minHeight: '140px',
              background: 'linear-gradient(to left, rgba(0, 194, 255, 0.08), transparent)',
              border: '1px solid rgba(0, 194, 255, 0.3)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            {/* Waveform Bars */}
            <div className="flex items-end gap-0.5 mb-2" style={{ height: '80px' }}>
              {waveformBarsB.map((height, i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    height: `${height}%`,
                    background: '#00C2FF',
                    borderRadius: '1px',
                  }}
                />
              ))}
            </div>

            {/* Track Info Overlay */}
            <div className="absolute top-4 left-4">
              <div
                style={{
                  color: 'var(--text)',
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                {DECK_B.title}
              </div>
              <div
                style={{
                  color: 'var(--text-3)',
                  fontSize: '13px',
                }}
              >
                {DECK_B.artist}
              </div>
            </div>

            {/* Key and BPM Overlay */}
            <div className="absolute top-4 right-4 text-right">
              <div
                className="inline-block rounded-full"
                style={{
                  background: 'var(--cyan-2)',
                  color: '#000',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {DECK_B.key}
              </div>
              <div
                className="block mt-1"
                style={{
                  color: 'var(--text-3)',
                  fontSize: '11px',
                }}
              >
                {DECK_B.bpm} BPM
              </div>
            </div>
          </div>
        </div>

        {/* BPM Circles + Crossfader */}
        <div className="flex justify-center items-center gap-12 mb-10">
          {/* Left Circle - Deck A */}
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 40px rgba(255, 106, 0, 0.3)) drop-shadow(0 0 80px rgba(255, 106, 0, 0.15))' }}>
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke="var(--orange-2)"
                strokeWidth="4"
                strokeDasharray="503"
                strokeDashoffset="125"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="font-mono font-bold"
                style={{
                  color: 'var(--orange)',
                  fontSize: '56px',
                  fontWeight: 700,
                }}
              >
                {DECK_A.bpm}
              </div>
              <div
                style={{
                  color: 'var(--text-3)',
                  fontSize: '20px',
                  marginTop: '4px',
                }}
              >
                A
              </div>
            </div>
          </div>

          {/* Crossfader Controls */}
          <div className="flex flex-col items-center gap-4">
            {/* Top Knobs */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className="uppercase"
                  style={{
                    color: 'var(--text-3)',
                    fontSize: '10px',
                    marginBottom: '4px',
                  }}
                >
                  CUTS
                </div>
                <div
                  className="rounded-full relative"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--panel)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--text-2)' }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div
                  className="uppercase"
                  style={{
                    color: 'var(--text-3)',
                    fontSize: '10px',
                    marginBottom: '4px',
                  }}
                >
                  NOTE
                </div>
                <div
                  className="rounded-full"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--panel)',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>
            </div>

            {/* EQ Pad */}
            <div className="flex flex-col items-center">
              <div
                className="uppercase mb-2"
                style={{
                  color: 'var(--text-3)',
                  fontSize: '10px',
                }}
              >
                EQ PAD
              </div>
              <div 
                className="relative cursor-pointer"
                style={{ height: '100px', width: '6px' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
                  setEqPadValue(100 - percentage);
                }}
              >
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-full rounded-full"
                  style={{
                    background: 'var(--border)',
                  }}
                />
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                  style={{
                    width: '20px',
                    height: '20px',
                    background: 'var(--cyan-2)',
                    boxShadow: 'var(--glow-cyan)',
                    top: `calc(${100 - eqPadValue}% - 10px)`,
                  }}
                />
              </div>
            </div>

            {/* Main Crossfader */}
            <div className="relative" style={{ width: '240px', height: '6px' }}>
              <div
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-full rounded-full"
                style={{
                  background: 'var(--border)',
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={crossfaderValue}
                onChange={(e) => setCrossfaderValue(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: '24px',
                  height: '24px',
                  background: '#fff',
                  boxShadow: '0 0 10px rgba(255,255,255,0.3)',
                  left: `calc(${crossfaderValue}% - 12px)`,
                }}
              />
            </div>

            {/* Bottom Knobs */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className="rounded-full"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--panel)',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>
              <div className="text-center">
                <div
                  className="rounded-full"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--panel)',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>
            </div>

            {/* Record Button */}
            <div className="flex flex-col items-center mt-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className="rounded-full flex items-center justify-center transition-all cursor-pointer"
                style={{
                  width: '56px',
                  height: '56px',
                  background: isRecording ? '#ef4444' : '#7f1d1d',
                  border: isRecording ? '2px solid #ef4444' : '2px solid #991b1b',
                  boxShadow: isRecording 
                    ? '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.4)' 
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isRecording) {
                    e.currentTarget.style.background = '#991b1b';
                    e.currentTarget.style.borderColor = '#dc2626';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isRecording) {
                    e.currentTarget.style.background = '#7f1d1d';
                    e.currentTarget.style.borderColor = '#991b1b';
                  }
                }}
              >
                <Circle 
                  className={isRecording ? "animate-pulse" : ""}
                  style={{ 
                    width: '24px', 
                    height: '24px',
                    fill: isRecording ? '#ffffff' : '#ef4444',
                    color: isRecording ? '#ffffff' : '#ef4444',
                  }} 
                />
              </button>
              <span 
                className="text-xs uppercase mt-1"
                style={{ 
                  color: isRecording ? '#ef4444' : 'var(--text-3)',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                REC
              </span>
            </div>
          </div>

          {/* Right Circle - Deck B */}
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 40px rgba(0, 194, 255, 0.3)) drop-shadow(0 0 80px rgba(0, 194, 255, 0.15))' }}>
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke="var(--cyan-2)"
                strokeWidth="4"
                strokeDasharray="503"
                strokeDashoffset="125"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="font-mono font-bold"
                style={{
                  color: 'var(--cyan)',
                  fontSize: '56px',
                  fontWeight: 700,
                }}
              >
                {DECK_B.bpm}
              </div>
              <div
                style={{
                  color: 'var(--text-3)',
                  fontSize: '20px',
                  marginTop: '4px',
                }}
              >
                B
              </div>
            </div>
          </div>
        </div>

        {/* FX Grid */}
        <div className="grid grid-cols-4 gap-x-3 gap-y-4 max-w-md mx-auto mb-10">
          {["REVERB", "DELAY", "FILTER", "FLANGER", "ECHO", "PHASER", "BITCRUSH", "DISTORTION"].map((fx) => (
            <button
              key={fx}
              onClick={() => toggleFX(fx)}
              className="rounded transition-all cursor-pointer uppercase"
              style={{
                width: '110px',
                height: '40px',
                background: 'var(--panel)',
                border: activeFX.has(fx) ? (fx === "REVERB" ? '2px solid var(--orange-2)' : '2px solid var(--cyan-2)') : '1px solid var(--border)',
                borderRadius: '6px',
                color: activeFX.has(fx) ? (fx === "REVERB" ? 'var(--orange)' : 'var(--cyan)') : 'var(--text-2)',
                fontSize: '11px',
                letterSpacing: '0.8px',
                fontWeight: 600,
                boxShadow: activeFX.has(fx) ? (fx === "REVERB" ? 'var(--glow-orange)' : 'var(--glow-cyan)') : 'none',
              }}
              onMouseEnter={(e) => {
                if (!activeFX.has(fx)) {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.background = 'var(--surface)';
                }
              }}
              onMouseLeave={(e) => {
                if (!activeFX.has(fx)) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--panel)';
                }
              }}
            >
              {fx}
            </button>
          ))}
        </div>

        {/* Transport Controls */}
        <div className="flex justify-center items-center gap-5">
          <button
            className="rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{
              width: '44px',
              height: '44px',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-2)';
            }}
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full flex items-center justify-center transition-all cursor-pointer"
            style={{
              width: '68px',
              height: '68px',
              background: 'var(--cyan-2)',
              color: '#000',
              boxShadow: 'var(--glow-cyan), 0 0 30px rgba(0, 194, 255, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            className="rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{
              width: '44px',
              height: '44px',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-2)';
            }}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Selected Tracks Pool - 30% */}
      <SelectedTracksPool tracks={selectedTracks} onRemoveTrack={handleRemoveTrack} />

      {/* Track Picker Modal */}
      <AddTracksToMixModal
        isOpen={showAddTracksModal}
        onClose={() => setShowAddTracksModal(false)}
        onAddTracks={handleAddTracks}
      />
    </div>
  );
}
