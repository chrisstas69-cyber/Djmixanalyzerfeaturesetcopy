import { useState, useEffect } from "react";
import { Play, Pause, Square, Settings, Download, Plus, Shuffle, X, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

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
  { id: 1, name: "Space Date", artist: "Adam Beyer", bpm: 129, key: "4A", energy: 7, source: "AI", duration: "7:30" },
  { id: 2, name: "Teach Me", artist: "Amelie Lens", bpm: 130, key: "5A", energy: 8, source: "AI", duration: "7:30" },
  { id: 3, name: "Patterns", artist: "ANNA", bpm: 131, key: "6A", energy: 9, source: "USER", duration: "7:30" },
  { id: 4, name: "Drumcode ID", artist: "Unknown", bpm: 132, key: "6A", energy: 10, source: "AI", duration: "7:30" },
  { id: 5, name: "Acid Thunder", artist: "Chris Liebing", bpm: 131, key: "5A", energy: 9, source: "URL", duration: "7:30" },
  { id: 6, name: "Terminal", artist: "Len Faki", bpm: 130, key: "8B", energy: 8, source: "AI", duration: "7:30" },
];

const timelineBlocks = [
  { name: "Space Date", duration: 7.5, energy: 7 },
  { name: "Teach Me", duration: 7.5, energy: 8 },
  { name: "Patterns", duration: 7.5, energy: 9 },
  { name: "Drumcode ID", duration: 7.5, energy: 10 },
  { name: "Acid Thunder", duration: 7.5, energy: 9 },
  { name: "Terminal", duration: 7.5, energy: 8 },
];

export function AutoDJMixerV2() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(30);
  const [crossfader, setCrossfader] = useState([50]);
  const [deckAVolume, setDeckAVolume] = useState([75]);
  const [deckBVolume, setDeckBVolume] = useState([75]);
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
    if (isPlaying) {
      const interval = setInterval(() => {
        setTransitionProgress((prev) => Math.max(0, prev - 0.5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Status Banner */}
      <div className="bg-secondary/5 border-b border-secondary/10 px-6 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <div className="font-['IBM_Plex_Mono'] text-xs">
              <span className="text-muted-foreground">SYSTEM IS MIXING</span>
              <span className="text-foreground mx-2">DECK A → DECK B</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-secondary mx-2">Bass Swap + Filter Sweep</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-foreground ml-2">0:{transitionProgress.toFixed(0).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-7 font-['IBM_Plex_Mono'] text-xs">
              <Settings className="w-3 h-3 mr-1.5" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="h-7 font-['IBM_Plex_Mono'] text-xs text-destructive">
              <Square className="w-3 h-3 mr-1.5" />
              Stop
            </Button>
            <Button variant="ghost" size="sm" className="h-7 font-['IBM_Plex_Mono'] text-xs">
              <Download className="w-3 h-3 mr-1.5" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Track Queue (Crate Style) */}
        <div className="w-72 border-r border-border bg-[#08080c] flex flex-col">
          <div className="px-4 py-3 border-b border-border/50">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-[0.1em]">
              TRACK QUEUE
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {queueTracks.map((track, idx) => (
              <div
                key={track.id}
                className={`px-4 py-3 border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer ${
                  idx === 0 ? "border-l-2 border-l-primary bg-primary/5" : 
                  idx === 1 ? "border-l-2 border-l-secondary bg-secondary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-['IBM_Plex_Mono'] text-xs px-1.5 py-0.5 rounded ${
                      track.source === "AI" ? "bg-primary/10 text-primary" :
                      track.source === "USER" ? "bg-secondary/10 text-secondary" :
                      "bg-muted/50 text-muted-foreground"
                    }`}>
                      {track.source}
                    </span>
                    {idx === 0 && <span className="font-['IBM_Plex_Mono'] text-xs text-primary">A</span>}
                    {idx === 1 && <span className="font-['IBM_Plex_Mono'] text-xs text-secondary">B</span>}
                  </div>
                </div>
                <div className="text-sm mb-1 leading-tight">{track.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{track.artist}</div>
                <div className="flex gap-3 font-['IBM_Plex_Mono'] text-xs">
                  <span className="text-secondary">{track.bpm}</span>
                  <span className="text-primary">{track.key}</span>
                  <span className="text-muted-foreground">E{track.energy}</span>
                  <span className="text-muted-foreground">{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border/50 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-8 font-['IBM_Plex_Mono'] text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Shuffle className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Center: Dual Deck System */}
        <div className="flex-1 flex flex-col">
          {/* Decks Row */}
          <div className="flex-1 flex">
            {/* Deck A */}
            <div className="flex-1 border-r border-border p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="font-['Roboto_Condensed'] tracking-wider text-primary" style={{ fontWeight: 600 }}>
                  DECK A
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-8 w-8 p-0"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>

              {/* Vinyl Platter - More Realistic */}
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="relative w-72 h-72">
                  {/* Vinyl disc */}
                  <div 
                    className={`absolute inset-0 rounded-full transition-transform ${
                      isPlaying ? "animate-spin" : ""
                    }`}
                    style={{ 
                      animationDuration: '2s',
                      background: "radial-gradient(circle at 30% 30%, #1a1a24 0%, #0d0d12 40%, #0a0a0f 100%)",
                    }}
                  >
                    {/* Grooves */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 rounded-full"
                        style={{ 
                          margin: `${8 + i * 8}px`,
                          border: "1px solid rgba(168,85,247,0.03)",
                        }}
                      />
                    ))}
                    
                    {/* Center label */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ margin: "96px" }}
                    >
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{
                          background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)",
                          border: "2px solid rgba(168,85,247,0.2)",
                        }}
                      >
                        <div className="text-center">
                          <div className="text-xs mb-1 text-primary font-['IBM_Plex_Mono']">SYNTAX</div>
                          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-primary/20 border border-primary/30" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spindle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 rounded-full bg-muted border border-border shadow-lg" />
                  </div>

                  {/* Track info overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center mt-32">
                      <div className="text-sm mb-1">{currentDeckA.name}</div>
                      <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                        {currentDeckA.artist}
                      </div>
                      <div className="flex gap-2 justify-center mt-2 font-['IBM_Plex_Mono'] text-xs">
                        <span className="text-secondary">{currentDeckA.bpm}</span>
                        <span className="text-primary">{currentDeckA.key}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deck A Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
                      GAIN
                    </label>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-primary">
                      {deckAVolume[0]}
                    </span>
                  </div>
                  <Slider value={deckAVolume} onValueChange={setDeckAVolume} max={100} step={1} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 text-center">
                      HI
                    </label>
                    <Slider
                      value={deckAEqHi}
                      onValueChange={setDeckAEqHi}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-20 mx-auto"
                    />
                    <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-2">
                      {deckAEqHi[0]}
                    </div>
                  </div>
                  <div>
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 text-center">
                      MID
                    </label>
                    <Slider
                      value={deckAEqMid}
                      onValueChange={setDeckAEqMid}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-20 mx-auto"
                    />
                    <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-2">
                      {deckAEqMid[0]}
                    </div>
                  </div>
                  <div>
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 text-center">
                      LOW
                    </label>
                    <Slider
                      value={deckAEqLow}
                      onValueChange={setDeckAEqLow}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-20 mx-auto"
                    />
                    <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-2">
                      {deckAEqLow[0]}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
                      FILTER
                    </label>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-primary">
                      {deckAFilter[0]}
                    </span>
                  </div>
                  <Slider value={deckAFilter} onValueChange={setDeckAFilter} max={100} step={1} />
                </div>
              </div>
            </div>

            {/* Deck B */}
            <div className="flex-1 p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="font-['Roboto_Condensed'] tracking-wider text-secondary" style={{ fontWeight: 600 }}>
                  DECK B
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>

              {/* Vinyl Platter */}
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="relative w-72 h-72">
                  <div 
                    className={`absolute inset-0 rounded-full transition-transform ${
                      isPlaying ? "animate-spin" : ""
                    }`}
                    style={{ 
                      animationDuration: '1.95s',
                      background: "radial-gradient(circle at 30% 30%, #1a1a24 0%, #0d0d12 40%, #0a0a0f 100%)",
                    }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 rounded-full"
                        style={{ 
                          margin: `${8 + i * 8}px`,
                          border: "1px solid rgba(255,149,0,0.03)",
                        }}
                      />
                    ))}
                    
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ margin: "96px" }}
                    >
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{
                          background: "radial-gradient(circle, rgba(255,149,0,0.1) 0%, rgba(255,149,0,0.05) 100%)",
                          border: "2px solid rgba(255,149,0,0.2)",
                        }}
                      >
                        <div className="text-center">
                          <div className="text-xs mb-1 text-secondary font-['IBM_Plex_Mono']">SYNTAX</div>
                          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-secondary/20 border border-secondary/30" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 rounded-full bg-muted border border-border shadow-lg" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center mt-32">
                      <div className="text-sm mb-1">{currentDeckB.name}</div>
                      <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                        {currentDeckB.artist}
                      </div>
                      <div className="flex gap-2 justify-center mt-2 font-['IBM_Plex_Mono'] text-xs">
                        <span className="text-secondary">{currentDeckB.bpm}</span>
                        <span className="text-primary">{currentDeckB.key}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deck B Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
                      GAIN
                    </label>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-secondary">
                      {deckBVolume[0]}
                    </span>
                  </div>
                  <Slider value={deckBVolume} onValueChange={setDeckBVolume} max={100} step={1} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 text-center">
                      HI
                    </label>
                    <Slider
                      value={deckBEqHi}
                      onValueChange={setDeckBEqHi}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-20 mx-auto"
                    />
                    <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-2">
                      {deckBEqHi[0]}
                    </div>
                  </div>
                  <div>
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 text-center">
                      MID
                    </label>
                    <Slider
                      value={deckBEqMid}
                      onValueChange={setDeckBEqMid}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-20 mx-auto"
                    />
                    <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-2">
                      {deckBEqMid[0]}
                    </div>
                  </div>
                  <div>
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 text-center">
                      LOW
                    </label>
                    <Slider
                      value={deckBEqLow}
                      onValueChange={setDeckBEqLow}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-20 mx-auto"
                    />
                    <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-2">
                      {deckBEqLow[0]}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
                      FILTER
                    </label>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-secondary">
                      {deckBFilter[0]}
                    </span>
                  </div>
                  <Slider value={deckBFilter} onValueChange={setDeckBFilter} max={100} step={1} />
                </div>
              </div>
            </div>
          </div>

          {/* Crossfader Section */}
          <div className="border-t border-b border-border bg-[#08080c] px-8 py-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="font-['IBM_Plex_Mono'] text-xs text-primary tracking-wider">A</span>
                <span className="font-['Roboto_Condensed'] text-xs text-muted-foreground tracking-[0.2em]">
                  CROSSFADER
                </span>
                <span className="font-['IBM_Plex_Mono'] text-xs text-secondary tracking-wider">B</span>
              </div>
              <Slider value={crossfader} onValueChange={setCrossfader} max={100} step={1} />
              
              {/* VU Meters with tick marks */}
              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-primary">DECK A</span>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">-6dB</span>
                  </div>
                  <div className="flex gap-0.5 h-3">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${
                          i < 14 ? "bg-primary" :
                          i < 20 ? "bg-secondary" :
                          "bg-destructive/30"
                        }`}
                        style={{
                          opacity: i < 14 ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['-60', '-36', '-12', '-6', '0'].map((db, i) => (
                      <span key={i} className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-secondary">DECK B</span>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">-8dB</span>
                  </div>
                  <div className="flex gap-0.5 h-3">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${
                          i < 12 ? "bg-secondary" :
                          i < 18 ? "bg-primary" :
                          "bg-destructive/30"
                        }`}
                        style={{
                          opacity: i < 12 ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['-60', '-36', '-12', '-6', '0'].map((db, i) => (
                      <span key={i} className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Journey Timeline */}
          <div className="bg-muted/10 px-6 py-4">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-3 tracking-[0.1em]">
              ENERGY JOURNEY
            </div>
            <div className="flex gap-1 h-14 rounded-sm overflow-hidden bg-background/50">
              {timelineBlocks.map((block, idx) => {
                const energyColor = block.energy >= 9 ? "#a855f7" :
                                   block.energy >= 7 ? "#c084fc" :
                                   block.energy >= 5 ? "#8b5cf6" :
                                   "#6d28d9";
                return (
                  <div
                    key={idx}
                    className="flex-1 relative group cursor-pointer transition-all hover:opacity-90"
                    style={{
                      backgroundColor: energyColor,
                      opacity: 0.2 + (block.energy / 10) * 0.6,
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="font-['IBM_Plex_Mono'] text-xs text-white">
                        {block.name.split(' ')[0]}
                      </span>
                      <span className="font-['IBM_Plex_Mono'] text-xs text-white/70">
                        E:{block.energy}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Terminal-Style System Decisions */}
        <div className="w-80 border-l border-border bg-[#08080c] flex flex-col font-['IBM_Plex_Mono'] text-xs">
          <div className="px-4 py-3 border-b border-border/50">
            <div className="text-muted-foreground tracking-[0.1em]">SYSTEM DECISIONS</div>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Current Transition */}
            <div>
              <div className="text-primary mb-3 tracking-wider">CURRENT TRANSITION</div>
              <div className="space-y-1.5 text-muted-foreground leading-relaxed">
                <div className="flex justify-between">
                  <span>Beatmatch</span>
                  <span className="text-foreground">129→130 BPM</span>
                </div>
                <div className="flex justify-between">
                  <span>Harmonic</span>
                  <span className="text-primary">4A→5A ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Technique</span>
                  <span className="text-foreground">Bass Swap</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="text-secondary">32 bars</span>
                </div>
                <div className="flex justify-between">
                  <span>Energy</span>
                  <span className="text-foreground">7→8</span>
                </div>
              </div>
            </div>

            {/* Next Transition */}
            <div>
              <div className="text-secondary mb-3 tracking-wider">NEXT TRANSITION</div>
              <div className="space-y-1.5 text-muted-foreground leading-relaxed">
                <div className="flex justify-between">
                  <span>Next Track</span>
                  <span className="text-foreground">Patterns</span>
                </div>
                <div className="flex justify-between">
                  <span>BPM Target</span>
                  <span className="text-secondary">130→131</span>
                </div>
                <div className="flex justify-between">
                  <span>Key Target</span>
                  <span className="text-primary">5A→6A</span>
                </div>
                <div className="flex justify-between">
                  <span>Technique</span>
                  <span className="text-foreground">Filter Sweep</span>
                </div>
                <div className="flex justify-between">
                  <span>Timing</span>
                  <span className="text-foreground">Phrase 16</span>
                </div>
              </div>
            </div>

            {/* AI Decisions Log */}
            <div>
              <div className="text-muted-foreground mb-3 tracking-wider">AI DECISIONS</div>
              <div className="space-y-2 leading-relaxed">
                <div className="flex gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Tempo lock engaged 129.5 BPM</span>
                </div>
                <div className="flex gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Phrase boundary detected 4:32</span>
                </div>
                <div className="flex gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Bass swap initiated bar 65</span>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="w-3 h-3 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Filter sweep scheduled +16 bars</span>
                </div>
                <div className="flex gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Headroom optimized -2dB</span>
                </div>
                <div className="flex gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Phase alignment confirmed</span>
                </div>
              </div>
            </div>

            {/* Mix Composition */}
            <div>
              <div className="text-muted-foreground mb-3 tracking-wider">MIX COMPOSITION</div>
              <div className="space-y-1.5 text-muted-foreground leading-relaxed">
                <div className="flex justify-between">
                  <span>AI tracks</span>
                  <span className="text-primary">4</span>
                </div>
                <div className="flex justify-between">
                  <span>User tracks</span>
                  <span className="text-secondary">1</span>
                </div>
                <div className="flex justify-between">
                  <span>URL tracks</span>
                  <span className="text-foreground">1</span>
                </div>
                <div className="flex justify-between border-t border-border/30 pt-1.5 mt-1.5">
                  <span>Total</span>
                  <span className="text-foreground">6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
