import { useState, useEffect } from "react";
import { Settings, Circle, Square, Download, Play, Plus, Shuffle, X, Check, AlertCircle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

type MixerState = "idle" | "mixing";

interface Track {
  id: number;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  energy: number;
  source: "AI" | "USER" | "URL";
  duration: string;
}

const queueTracks: Track[] = [
  { id: 1, name: "Basement Pressure", artist: "Unknown Artist", bpm: 128, key: "5A", energy: 7.8, source: "AI", duration: "6:32" },
  { id: 2, name: "Neon Pilgrims", artist: "Unknown Artist", bpm: 130, key: "4A", energy: 8.2, source: "AI", duration: "5:58" },
  { id: 3, name: "Steel Bloom", artist: "Unknown Artist", bpm: 130, key: "6A", energy: 9.1, source: "USER", duration: "7:14" },
  { id: 4, name: "Shadow Circuit", artist: "Unknown Artist", bpm: 131, key: "6A", energy: 9.5, source: "AI", duration: "6:05" },
  { id: 5, name: "Midnight Valve", artist: "Unknown Artist", bpm: 132, key: "8B", energy: 8.9, source: "URL", duration: "6:47" },
  { id: 6, name: "Low End Doctrine", artist: "Unknown Artist", bpm: 130, key: "5A", energy: 7.6, source: "AI", duration: "8:02" },
  { id: 7, name: "Signal Ritual", artist: "Unknown Artist", bpm: 128, key: "6A", energy: 8.1, source: "URL", duration: "5:41" },
  { id: 8, name: "Concrete Halo", artist: "Unknown Artist", bpm: 129, key: "7A", energy: 8.3, source: "AI", duration: "6:19" },
];

const timelineBlocks = [
  { name: "Basement Pressure", energy: 7.8 },
  { name: "Neon Pilgrims", energy: 8.2 },
  { name: "Steel Bloom", energy: 9.1 },
  { name: "Shadow Circuit", energy: 9.5 },
  { name: "Midnight Valve", energy: 8.9 },
  { name: "Low End Doctrine", energy: 7.6 },
];

interface VinylPlatterProps {
  track: Track;
  isPlaying: boolean;
  deckLabel: "A" | "B";
  color: string;
}

function VinylPlatter({ track, isPlaying, deckLabel, color }: VinylPlatterProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Platter - 256px for better fit */}
      <div className="relative w-64 h-64 mb-3">
        {/* Vinyl disc */}
        <div 
          className={`absolute inset-0 rounded-full transition-transform ${
            isPlaying ? "animate-spin" : ""
          }`}
          style={{ 
            animationDuration: deckLabel === "A" ? '2s' : '1.95s',
            background: "radial-gradient(circle at 35% 35%, #1a1a24 0%, #0d0d12 45%, #0a0a0f 100%)",
          }}
        >
          {/* Grooves */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{ 
                margin: `${5 + i * 5}px`,
                border: `1px solid ${color}08`,
              }}
            />
          ))}
          
          {/* Center label */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ margin: "90px" }}
          >
            <div 
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${color}15 0%, ${color}08 100%)`,
                border: `2px solid ${color}30`,
              }}
            >
              <div className="text-center px-2">
                <div className="text-xs mb-1 font-['IBM_Plex_Mono']" style={{ color }}>
                  SYNTAX
                </div>
                <div 
                  className="w-6 h-6 mx-auto mb-1 rounded-full border"
                  style={{
                    backgroundColor: `${color}20`,
                    borderColor: `${color}40`,
                  }}
                />
                <div className="text-xs font-['IBM_Plex_Mono']" style={{ color }}>
                  {deckLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spindle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-[#27272a] border-2 border-border shadow-xl" />
        </div>

        {/* Track info overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center mt-32">
            <div className="text-xs font-medium px-2">{track.name}</div>
          </div>
        </div>
      </div>

      {/* Compact track details */}
      <div className="text-center mb-2 w-64">
        <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
      </div>

      {/* Metrics - compact */}
      <div className="flex gap-4 font-['IBM_Plex_Mono'] text-xs mb-2">
        <div>
          <span className="text-muted-foreground">BPM </span>
          <span className="text-secondary">{track.bpm}</span>
        </div>
        <div>
          <span className="text-muted-foreground">KEY </span>
          <span className="text-primary">{track.key}</span>
        </div>
        <div>
          <span className="text-muted-foreground">E </span>
          <span className="text-foreground">{track.energy.toFixed(1)}</span>
        </div>
      </div>

      {/* Waveform strip - thinner */}
      <div className="w-64 h-6 bg-[#0a0a0f] border border-border rounded-sm flex items-center gap-0.5 px-1 overflow-hidden">
        {[...Array(64)].map((_, i) => {
          const height = Math.sin(i / 3) * 20 + Math.random() * 15 + 20;
          const isActive = isPlaying && i < 32;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-colors"
              style={{
                height: `${height}%`,
                backgroundColor: isActive ? color : "#27272a",
                opacity: isActive ? 0.7 : 0.3,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function AutoDJMixerV3() {
  const [mixerState, setMixerState] = useState<MixerState>("mixing");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transitionTime, setTransitionTime] = useState(30);
  
  // Mixer controls
  const [crossfader, setCrossfader] = useState([50]);
  const [deckAGain, setDeckAGain] = useState([75]);
  const [deckBGain, setDeckBGain] = useState([75]);
  const [deckAEqHi, setDeckAEqHi] = useState([50]);
  const [deckAEqMid, setDeckAEqMid] = useState([50]);
  const [deckAEqLow, setDeckAEqLow] = useState([50]);
  const [deckBEqHi, setDeckBEqHi] = useState([50]);
  const [deckBEqMid, setDeckBEqMid] = useState([50]);
  const [deckBEqLow, setDeckBEqLow] = useState([50]);
  const [deckAFilter, setDeckAFilter] = useState([50]);
  const [deckBFilter, setDeckBFilter] = useState([50]);

  const currentDeckA = queueTracks[0];
  const currentDeckB = queueTracks[1];

  useEffect(() => {
    if (isPlaying && mixerState === "mixing") {
      const interval = setInterval(() => {
        setTransitionTime((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, mixerState]);

  // Idle State
  if (mixerState === "idle") {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Compact Header */}
        <div className="border-b border-border px-6 py-3 flex items-center justify-between" style={{ height: "56px" }}>
          <div className="flex items-center gap-6">
            <div>
              <div className="font-['Roboto_Condensed'] text-sm tracking-wider" style={{ fontWeight: 600 }}>
                SYNTAX
              </div>
              <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                Audio Intelligence
              </div>
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <div className="font-['Roboto_Condensed'] tracking-tight" style={{ fontWeight: 600 }}>
                AUTO DJ MIXER
              </div>
              <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                System-Controlled Mixing
              </div>
            </div>
          </div>
        </div>

        {/* Idle Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-sm bg-card border-2 border-border flex items-center justify-center">
              <Play className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-['Roboto_Condensed'] mb-2 tracking-tight" style={{ fontWeight: 600 }}>
              AUTO DJ READY
            </h2>
            <p className="text-sm text-muted-foreground mb-6 font-['IBM_Plex_Mono']">
              Load tracks to begin system-controlled mixing.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-['Roboto_Condensed']"
              onClick={() => setMixerState("mixing")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Load Tracks
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Mixing State - LOCKED LAYOUT FOR 1440x900
  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Compact Top Bar - 56px */}
      <div className="border-b border-border px-6 py-2.5 flex items-center justify-between" style={{ height: "56px" }}>
        <div className="flex items-center gap-6">
          <div>
            <div className="font-['Roboto_Condensed'] text-sm tracking-wider" style={{ fontWeight: 600 }}>
              SYNTAX
            </div>
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
              Audio Intelligence
            </div>
          </div>
          <div className="h-6 w-px bg-border" />
          <div>
            <div className="font-['Roboto_Condensed'] tracking-tight" style={{ fontWeight: 600 }}>
              AUTO DJ MIXER
            </div>
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
              System-Controlled Mixing
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-7 px-2">
            <Settings className="w-3 h-3 mr-1" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`font-['IBM_Plex_Mono'] text-xs h-7 px-2 ${
              isRecording ? "text-destructive" : ""
            }`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Circle className={`w-3 h-3 mr-1 ${isRecording ? "fill-current" : ""}`} />
            Record
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="font-['IBM_Plex_Mono'] text-xs h-7 px-2"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <Square className="w-3 h-3 mr-1" />
            Stop
          </Button>
          <Button variant="ghost" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-7 px-2">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Compact System Status Strip - 56px */}
      <div className="bg-secondary/5 border-b border-secondary/10 px-6 py-2" style={{ height: "56px" }}>
        <div className="text-center space-y-0.5">
          <div className="font-['Roboto_Condensed'] text-sm tracking-wide" style={{ fontWeight: 500 }}>
            SYSTEM IS MIXING DECK A → DECK B
          </div>
          <div className="font-['IBM_Plex_Mono'] text-xs text-secondary">
            Transition: Bass Swap + Filter Sweep · Time remaining: 0:{transitionTime.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Main Content Area - 788px height remaining (900 - 56 - 56) */}
      <div className="flex overflow-hidden" style={{ height: "788px" }}>
        {/* Left Panel — Track Queue (320px) */}
        <div className="w-80 border-r border-border bg-[#08080c] flex flex-col">
          <div className="px-4 py-2 border-b border-border/50">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-[0.1em]">
              TRACK QUEUE
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {queueTracks.map((track, idx) => (
              <div
                key={track.id}
                className={`px-4 py-2.5 border-b border-border/30 hover:bg-muted/10 transition-colors cursor-pointer ${
                  idx === 0 ? "border-l-2 border-l-secondary bg-secondary/5" : 
                  idx === 1 ? "border-l-2 border-l-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-['IBM_Plex_Mono'] text-xs px-1.5 py-0.5 rounded-sm ${
                      track.source === "AI" ? "bg-primary/10 text-primary" :
                      track.source === "USER" ? "bg-secondary/10 text-secondary" :
                      "bg-muted/50 text-muted-foreground"
                    }`}>
                      {track.source}
                    </span>
                    {idx === 0 && <span className="font-['IBM_Plex_Mono'] text-xs text-secondary">A</span>}
                    {idx === 1 && <span className="font-['IBM_Plex_Mono'] text-xs text-primary">B</span>}
                  </div>
                </div>
                <div className="text-xs mb-1 leading-tight truncate">{track.name}</div>
                <div className="flex gap-2 font-['IBM_Plex_Mono'] text-xs">
                  <span className="text-secondary">{track.bpm}</span>
                  <span className="text-primary">{track.key}</span>
                  <span className="text-muted-foreground">{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border/50 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-7 font-['IBM_Plex_Mono'] text-xs px-2">
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <Shuffle className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Center Panel — Booth Area (Flexible, ~720px) */}
        <div className="flex-1 flex flex-col px-4 py-3">
          {/* Decks Row */}
          <div className="flex-1 flex items-start justify-center gap-4">
            {/* Deck A */}
            <div className="flex flex-col items-center">
              <div className="font-['Roboto_Condensed'] text-secondary mb-2 tracking-wider text-sm" style={{ fontWeight: 600 }}>
                DECK A
              </div>
              <VinylPlatter
                track={currentDeckA}
                isPlaying={isPlaying}
                deckLabel="A"
                color="#ff9500"
              />
            </div>

            {/* Center Mixer Strip - Compact */}
            <div className="w-44 flex flex-col justify-start pt-7">
              <div className="bg-[#0a0a0f] border border-border rounded-sm p-2.5 space-y-2.5">
                {/* Gain Controls */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1.5 text-center">
                      GAIN A
                    </div>
                    <Slider
                      value={deckAGain}
                      onValueChange={setDeckAGain}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-10 mx-auto"
                    />
                    <div className="text-center font-['IBM_Plex_Mono'] text-xs text-secondary mt-1">
                      {deckAGain[0]}
                    </div>
                  </div>
                  <div>
                    <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1.5 text-center">
                      GAIN B
                    </div>
                    <Slider
                      value={deckBGain}
                      onValueChange={setDeckBGain}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-10 mx-auto"
                    />
                    <div className="text-center font-['IBM_Plex_Mono'] text-xs text-primary mt-1">
                      {deckBGain[0]}
                    </div>
                  </div>
                </div>

                {/* EQ Section - Very Compact */}
                <div className="border-t border-border/30 pt-2.5">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-2 text-center tracking-wider">
                    EQ
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Deck A EQ */}
                    <div className="space-y-1.5">
                      <div>
                        <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1 text-center">HI</div>
                        <Slider value={deckAEqHi} onValueChange={setDeckAEqHi} max={100} step={1} orientation="vertical" className="h-6 mx-auto" />
                      </div>
                      <div>
                        <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1 text-center">MID</div>
                        <Slider value={deckAEqMid} onValueChange={setDeckAEqMid} max={100} step={1} orientation="vertical" className="h-6 mx-auto" />
                      </div>
                      <div>
                        <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1 text-center">LOW</div>
                        <Slider value={deckAEqLow} onValueChange={setDeckAEqLow} max={100} step={1} orientation="vertical" className="h-6 mx-auto" />
                      </div>
                    </div>
                    {/* Deck B EQ */}
                    <div className="space-y-1.5">
                      <div>
                        <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1 text-center">HI</div>
                        <Slider value={deckBEqHi} onValueChange={setDeckBEqHi} max={100} step={1} orientation="vertical" className="h-6 mx-auto" />
                      </div>
                      <div>
                        <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1 text-center">MID</div>
                        <Slider value={deckBEqMid} onValueChange={setDeckBEqMid} max={100} step={1} orientation="vertical" className="h-6 mx-auto" />
                      </div>
                      <div>
                        <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1 text-center">LOW</div>
                        <Slider value={deckBEqLow} onValueChange={setDeckBEqLow} max={100} step={1} orientation="vertical" className="h-6 mx-auto" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="border-t border-border/30 pt-2.5">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-2 text-center tracking-wider">
                    FILTER
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <Slider value={deckAFilter} onValueChange={setDeckAFilter} max={100} step={1} orientation="vertical" className="h-8 mx-auto" />
                      <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-1">A</div>
                    </div>
                    <div>
                      <Slider value={deckBFilter} onValueChange={setDeckBFilter} max={100} step={1} orientation="vertical" className="h-8 mx-auto" />
                      <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-1">B</div>
                    </div>
                  </div>
                </div>

                {/* VU Meters - Compact */}
                <div className="border-t border-border/30 pt-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1.5 text-center">VU A</div>
                      <div className="flex flex-col gap-0.5 h-10">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                              backgroundColor: i < 6 ? "#ff9500" : i < 7 ? "#a855f7" : "#ef4444",
                              opacity: i < 5 ? 0.9 : 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1.5 text-center">VU B</div>
                      <div className="flex flex-col gap-0.5 h-10">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                              backgroundColor: i < 6 ? "#a855f7" : i < 7 ? "#ff9500" : "#ef4444",
                              opacity: i < 4 ? 0.9 : 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crossfader - MUST BE VISIBLE */}
                <div className="border-t border-border/30 pt-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-secondary">A</span>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">CROSSFADER</span>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-primary">B</span>
                  </div>
                  <Slider value={crossfader} onValueChange={setCrossfader} max={100} step={1} />
                </div>
              </div>
            </div>

            {/* Deck B */}
            <div className="flex flex-col items-center">
              <div className="font-['Roboto_Condensed'] text-primary mb-2 tracking-wider text-sm" style={{ fontWeight: 600 }}>
                DECK B
              </div>
              <VinylPlatter
                track={currentDeckB}
                isPlaying={isPlaying}
                deckLabel="B"
                color="#a855f7"
              />
            </div>
          </div>

          {/* Mini Timeline at bottom */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-1.5 tracking-[0.1em]">
              MIX TIMELINE
            </div>
            <div className="flex gap-1 h-5 rounded-sm overflow-hidden bg-background/50">
              {timelineBlocks.map((block, idx) => {
                const energyColor = block.energy >= 9 ? "#a855f7" :
                                   block.energy >= 8 ? "#c084fc" :
                                   block.energy >= 7 ? "#ff9500" :
                                   "#8b5cf6";
                return (
                  <div
                    key={idx}
                    className="flex-1 relative group cursor-pointer transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: energyColor,
                      opacity: 0.15 + (block.energy / 10) * 0.6,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="font-['IBM_Plex_Mono'] text-xs text-white">
                        {block.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel — System Decisions (320px) */}
        <div className="w-80 border-l border-border bg-[#08080c] flex flex-col font-['IBM_Plex_Mono'] text-xs">
          <div className="px-4 py-2 border-b border-border/50">
            <div className="text-muted-foreground tracking-[0.1em]">SYSTEM DECISIONS</div>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2.5">
            <div className="flex gap-2 leading-relaxed">
              <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Phrase boundary detected (16 bars)</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">BPM aligned (130 → 128)</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Harmonic compatibility preserved (5A → 4A)</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <AlertCircle className="w-3 h-3 text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Low-end density detected — adjusting bass swap</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Energy slope maintained (rising)</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Transition window secured</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Monitoring phase alignment</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Crossfader curve applied (smooth)</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Filter sweep initiated at bar 24</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Next track queued (Steel Bloom)</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Headroom optimized (-2dB)</span>
            </div>
            <div className="flex gap-2 leading-relaxed">
              <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Preparing transition sequence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
