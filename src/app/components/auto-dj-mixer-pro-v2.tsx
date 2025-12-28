import { useState, useEffect } from "react";
import { AutoDJMixCrate } from "./auto-dj-mix-crate";
import { Zap } from "lucide-react";

type MixStyle = "smooth" | "club" | "hypnotic" | "aggressive";

interface MixStyleConfig {
  blendLength: number; // in bars
  eqIntensity: number; // 1-10
  transitionFrequency: number; // seconds between transitions
  energyTolerance: number; // how much energy jump allowed
}

interface Knob {
  value: number;
  target: number;
}

interface Fader {
  value: number;
  target: number;
}

interface DeckState {
  gain: Knob;
  eqHigh: Knob;
  eqMid: Knob;
  eqLow: Knob;
  fader: Fader;
  timeRemaining: string;
  currentTrack: string;
  playing: boolean;
  active: boolean;
}

export function AutoDJMixerProV2() {
  const [crossfader, setCrossfader] = useState({ value: 20, target: 20 });
  const [waveformScrollA, setWaveformScrollA] = useState(0);
  const [waveformScrollB, setWaveformScrollB] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [harmonicLock, setHarmonicLock] = useState(false);
  
  // Check if user has active DNA (TODO: Connect to actual DNA state)
  const hasActiveDNA = false; // Set to true when DNA system is connected

  const [deckA, setDeckA] = useState<DeckState>({
    gain: { value: 75, target: 75 },
    eqHigh: { value: 50, target: 50 },
    eqMid: { value: 50, target: 50 },
    eqLow: { value: 50, target: 50 },
    fader: { value: 85, target: 85 },
    timeRemaining: "-01:42",
    currentTrack: "Hypnotic Groove",
    playing: true,
    active: true,
  });

  const [deckB, setDeckB] = useState<DeckState>({
    gain: { value: 72, target: 72 },
    eqHigh: { value: 50, target: 50 },
    eqMid: { value: 50, target: 50 },
    eqLow: { value: 50, target: 50 },
    fader: { value: 15, target: 15 },
    timeRemaining: "-05:18",
    currentTrack: "Warehouse Nights",
    playing: false,
    active: false,
  });

  // Very slow, smooth automation - ease-in-out only
  useEffect(() => {
    const interval = setInterval(() => {
      setCrossfader((prev) => {
        const diff = prev.target - prev.value;
        if (Math.abs(diff) < 0.1) return prev;
        // Very slow: 6-8 second transitions
        return { ...prev, value: prev.value + diff * 0.008 };
      });

      setDeckA((prev) => ({
        ...prev,
        gain: smoothKnob(prev.gain, 0.01),
        eqHigh: smoothKnob(prev.eqHigh, 0.008),
        eqMid: smoothKnob(prev.eqMid, 0.008),
        eqLow: smoothKnob(prev.eqLow, 0.008),
        fader: smoothFader(prev.fader, 0.01),
      }));

      setDeckB((prev) => ({
        ...prev,
        gain: smoothKnob(prev.gain, 0.01),
        eqHigh: smoothKnob(prev.eqHigh, 0.008),
        eqMid: smoothKnob(prev.eqMid, 0.008),
        eqLow: smoothKnob(prev.eqLow, 0.008),
        fader: smoothFader(prev.fader, 0.01),
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Slow waveform scrolling - calm, deliberate
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (deckA.playing) {
        setWaveformScrollA((prev) => (prev + (deckA.active ? 0.4 : 0.15)) % 100);
      }
      if (deckB.playing) {
        setWaveformScrollB((prev) => (prev + (deckB.active ? 0.4 : 0.15)) % 100);
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, [deckA.playing, deckB.playing, deckA.active, deckB.active]);

  // Professional mixing automation - slow, confident, deliberate
  useEffect(() => {
    const automationInterval = setInterval(() => {
      const now = Date.now();
      const cycle = (now / 24000) % 1; // Very slow 24-second cycle

      // Transition phase
      if (cycle > 0.65 && cycle < 0.85 && !isTransitioning) {
        setIsTransitioning(true);
        
        // Soft pulse at transition start (ONE delight moment)
        setHarmonicLock(true);
        setTimeout(() => setHarmonicLock(false), 1200);

        // One slow, committed crossfader motion
        setCrossfader((prev) => ({ ...prev, target: 75 }));
        
        // Bring in next deck - minimal, smooth
        setDeckB((prev) => ({ 
          ...prev, 
          playing: true,
          fader: { ...prev.fader, target: 78 },
          eqLow: { ...prev.eqLow, target: 46 },
        }));

        // Reduce outgoing deck - subtle
        setDeckA((prev) => ({
          ...prev,
          fader: { ...prev.fader, target: 22 },
          eqHigh: { ...prev.eqHigh, target: 35 },
        }));
      } else if (cycle > 0.88 || cycle < 0.1) {
        // Complete transition
        if (isTransitioning) {
          setIsTransitioning(false);
          setDeckA((prev) => ({ ...prev, active: false }));
          setDeckB((prev) => ({ ...prev, active: true }));
        }
      } else if (cycle > 0.2 && cycle < 0.55) {
        // Stable mixing phase - deck A dominant
        setCrossfader((prev) => ({ ...prev, target: 22 }));
        
        setDeckA((prev) => ({
          ...prev,
          active: true,
          fader: { ...prev.fader, target: 82 },
        }));
        
        setDeckB((prev) => ({
          ...prev,
          active: false,
          fader: { ...prev.fader, target: 12 },
        }));
      }

      // Rare, subtle EQ movements - each band independent
      const eqCycle = (now / 15000) % 1;
      
      // Small adjustments only (max ±4 from center)
      setDeckA((prev) => ({
        ...prev,
        eqHigh: { ...prev.eqHigh, target: 50 + Math.sin(eqCycle * Math.PI * 2) * 4 },
        eqMid: { ...prev.eqMid, target: 50 + Math.cos(eqCycle * Math.PI * 1.3) * 3 },
        eqLow: { ...prev.eqLow, target: 50 + Math.sin(eqCycle * Math.PI * 2.7) * 4 },
        gain: { ...prev.gain, target: 75 + Math.sin(eqCycle * Math.PI) * 2 },
      }));

      setDeckB((prev) => ({
        ...prev,
        eqHigh: { ...prev.eqHigh, target: 50 + Math.sin(eqCycle * Math.PI * 2 + 1) * 4 },
        eqMid: { ...prev.eqMid, target: 50 + Math.cos(eqCycle * Math.PI * 1.3 + 0.5) * 3 },
        eqLow: { ...prev.eqLow, target: 50 + Math.sin(eqCycle * Math.PI * 2.7 + 1.5) * 4 },
        gain: { ...prev.gain, target: 72 + Math.sin(eqCycle * Math.PI + 0.5) * 2 },
      }));
    }, 1200);

    return () => clearInterval(automationInterval);
  }, [isTransitioning]);

  const smoothKnob = (knob: Knob, speed: number): Knob => {
    const diff = knob.target - knob.value;
    if (Math.abs(diff) < 0.1) return knob;
    return { ...knob, value: knob.value + diff * speed };
  };

  const smoothFader = (fader: Fader, speed: number): Fader => {
    const diff = fader.target - fader.value;
    if (Math.abs(diff) < 0.1) return fader;
    return { ...fader, value: fader.value + diff * speed };
  };

  // Data-driven waveform - dense, varied, realistic
  const generateRealisticWaveform = (bars: number) => {
    const data = [];
    for (let i = 0; i < bars; i++) {
      // Kick drum pattern (every 4 beats)
      const kickPosition = i % 64;
      const isKick = kickPosition === 0 || kickPosition === 16 || kickPosition === 32 || kickPosition === 48;
      const kickAmp = isKick ? 0.4 : 0;

      // Bassline (rolling)
      const bassPhase = Math.sin(i / 8) * 0.3;
      
      // Mid-range frequencies
      const midFreq = Math.sin(i / 4) * 0.15 + Math.sin(i / 2.5) * 0.1;
      
      // High frequencies (percussion, hi-hats)
      const hihatPattern = i % 8 < 2 ? 0.12 : 0.05;
      const highFreq = (Math.random() - 0.5) * 0.08 + hihatPattern;
      
      // Transients (snare, claps)
      const isSnare = kickPosition === 24 || kickPosition === 56;
      const transient = isSnare ? 0.25 : 0;
      
      // Build/breakdown sections (quiet/loud variation)
      const section = Math.floor(i / 128) % 3;
      const energyMult = section === 0 ? 0.5 : section === 1 ? 0.75 : 1.0;
      
      // Noise floor
      const noiseFloor = 0.05;
      
      // Combine all frequencies
      const combined = (kickAmp + bassPhase + midFreq + highFreq + transient + noiseFloor) * energyMult;
      
      // Map to height (quiet sections = thinner, loud = dense)
      const height = Math.max(4, Math.min(100, combined * 120));
      
      data.push(height);
    }
    return data;
  };

  const waveformBarsA = generateRealisticWaveform(400);
  const waveformBarsB = generateRealisticWaveform(400);

  return (
    <div className="h-full flex bg-black">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold tracking-tight text-white">Auto DJ Mixer</h1>
            <p className="text-xs text-muted-foreground">Professional autonomous mixing system</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-6 bg-black">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Status - DNA Influenced */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-2 border border-border bg-black">
                <div className={`w-1.5 h-1.5 bg-primary transition-opacity duration-1000 ${
                  harmonicLock ? "opacity-100" : "opacity-50"
                }`} style={{ 
                  animation: harmonicLock ? 'pulse 1.2s ease-in-out' : 'none' 
                }} />
                <span className="text-xs text-white font-medium">
                  Mix in progress
                </span>
              </div>
              {hasActiveDNA && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Transitions guided by your DNA
                </p>
              )}
            </div>

            {/* Waveforms - Dense, Data-Driven */}
            <div className="border border-border bg-black p-6">
              {/* Deck A */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 border flex items-center justify-center text-xs font-medium transition-all duration-700 ${
                      deckA.active
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-black border-border text-muted-foreground"
                    }`}>
                      A
                    </div>
                    <div className={`text-sm transition-all duration-700 ${
                      deckA.active ? "text-white" : "text-white/50"
                    }`}>
                      {deckA.currentTrack}
                    </div>
                  </div>
                  <div className={`font-['IBM_Plex_Mono'] text-sm font-medium transition-all duration-700 ${
                    deckA.active ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {deckA.timeRemaining}
                  </div>
                </div>

                {/* Waveform Container */}
                <div className={`h-20 bg-black border overflow-hidden relative transition-all duration-1000 ${
                  deckA.active ? "border-border" : "border-border/50"
                }`}>
                  {/* Beat Grid - Minimal */}
                  <div className="absolute inset-0 flex">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-border/20"
                        style={{
                          borderRightWidth: i % 8 === 7 ? "1px" : "0.5px",
                          opacity: i % 8 === 7 ? 0.3 : 0.1,
                        }}
                      />
                    ))}
                  </div>

                  {/* Waveform - Scrolling, Dense Bars */}
                  <div className="absolute inset-0 flex items-center px-0.5">
                    <div
                      className="flex items-end h-full gap-px transition-transform duration-75"
                      style={{
                        transform: `translateX(-${waveformScrollA}%)`,
                        width: "200%",
                      }}
                    >
                      {waveformBarsA.concat(waveformBarsA).map((height, i) => (
                        <div key={i} className="flex-1 h-full flex items-center">
                          <div
                            className="w-full bg-primary transition-all duration-1000"
                            style={{ 
                              height: `${height}%`,
                              opacity: deckA.active ? 0.9 : 0.3,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Playhead - Fixed Center */}
                  <div className={`absolute inset-y-0 left-1/2 w-px bg-white z-10 transition-all duration-1000 ${
                    deckA.active ? "opacity-90" : "opacity-30"
                  }`} />
                </div>
              </div>

              {/* Deck B */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 border flex items-center justify-center text-xs font-medium transition-all duration-700 ${
                      deckB.active
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-black border-border text-muted-foreground"
                    }`}>
                      B
                    </div>
                    <div className={`text-sm transition-all duration-700 ${
                      deckB.active ? "text-white" : "text-white/50"
                    }`}>
                      {deckB.currentTrack}
                    </div>
                  </div>
                  <div className={`font-['IBM_Plex_Mono'] text-sm font-medium transition-all duration-700 ${
                    deckB.active ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {deckB.timeRemaining}
                  </div>
                </div>

                {/* Waveform Container */}
                <div className={`h-20 bg-black border overflow-hidden relative transition-all duration-1000 ${
                  deckB.active ? "border-border" : "border-border/50"
                }`}>
                  {/* Beat Grid */}
                  <div className="absolute inset-0 flex">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-border/20"
                        style={{
                          borderRightWidth: i % 8 === 7 ? "1px" : "0.5px",
                          opacity: i % 8 === 7 ? 0.3 : 0.1,
                        }}
                      />
                    ))}
                  </div>

                  {/* Waveform */}
                  <div className="absolute inset-0 flex items-center px-0.5">
                    <div
                      className="flex items-end h-full gap-px transition-transform duration-75"
                      style={{
                        transform: `translateX(-${waveformScrollB}%)`,
                        width: "200%",
                      }}
                    >
                      {waveformBarsB.concat(waveformBarsB).map((height, i) => (
                        <div key={i} className="flex-1 h-full flex items-center">
                          <div
                            className="w-full bg-primary transition-all duration-1000"
                            style={{ 
                              height: `${height}%`,
                              opacity: deckB.active ? 0.9 : 0.3,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Playhead */}
                  <div className={`absolute inset-y-0 left-1/2 w-px bg-white z-10 transition-all duration-1000 ${
                    deckB.active ? "opacity-90" : "opacity-30"
                  }`} />
                </div>
              </div>
            </div>

            {/* Mixer - Minimal Movement */}
            <div className="border border-border bg-black p-6">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-8 max-w-4xl mx-auto">
                {/* Channel A */}
                <div className="space-y-5">
                  <div className="text-center">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Channel A
                    </span>
                  </div>

                  {/* Gain */}
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Gain
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-muted border border-border" />
                        <div
                          className="absolute inset-1.5 bg-black border border-primary/40 transition-transform duration-[800ms] ease-in-out"
                          style={{
                            transform: `rotate(${(deckA.gain.value / 100) * 270 - 135}deg)`,
                          }}
                        >
                          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-primary" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground">
                            {Math.round(deckA.gain.value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EQ - Rare, Subtle Movement */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Hi", value: deckA.eqHigh.value },
                      { label: "Mid", value: deckA.eqMid.value },
                      { label: "Low", value: deckA.eqLow.value },
                    ].map((eq) => (
                      <div key={eq.label}>
                        <label className="block text-[10px] text-muted-foreground mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                          {eq.label}
                        </label>
                        <div className="flex justify-center">
                          <div className="relative w-11 h-11">
                            <div className="absolute inset-0 bg-muted border border-border" />
                            <div
                              className="absolute inset-1 bg-black border border-primary/30 transition-transform duration-[800ms] ease-in-out"
                              style={{
                                transform: `rotate(${(eq.value / 100) * 270 - 135}deg)`,
                              }}
                            >
                              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/80" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Volume Fader - Minimal Movement */}
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-10 h-36">
                        <div className="absolute inset-x-0 top-3 bottom-3 bg-muted border border-border" />
                        <div
                          className="absolute inset-x-0 h-6 bg-primary/80 border border-primary transition-all duration-[800ms] ease-in-out"
                          style={{
                            top: `${12 + (100 - deckA.fader.value) * 1.2}px`,
                          }}
                        >
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-white/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crossfader - One Slow Motion Per Transition */}
                <div className="flex flex-col items-center justify-end pb-6">
                  <label className="block text-[10px] text-muted-foreground mb-4 font-['IBM_Plex_Mono'] uppercase tracking-wider">
                    Crossfader
                  </label>
                  <div className="relative w-48 h-12">
                    <div className="absolute inset-y-0 left-3 right-3 top-1/2 -translate-y-1/2 h-3 bg-muted border border-border" />
                    <div
                      className="absolute top-0 w-10 h-12 bg-white/90 border border-white transition-all duration-[800ms] ease-in-out"
                      style={{
                        left: `${12 + (crossfader.value / 100) * 140}px`,
                      }}
                    >
                      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 space-y-0.5">
                        <div className="h-px bg-black/30" />
                        <div className="h-px bg-black/30" />
                        <div className="h-px bg-black/30" />
                      </div>
                    </div>
                    <div className="absolute -top-5 left-0 text-[10px] text-primary font-['IBM_Plex_Mono']">A</div>
                    <div className="absolute -top-5 right-0 text-[10px] text-primary font-['IBM_Plex_Mono']">B</div>
                  </div>
                </div>

                {/* Channel B */}
                <div className="space-y-5">
                  <div className="text-center">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Channel B
                    </span>
                  </div>

                  {/* Gain */}
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Gain
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-muted border border-border" />
                        <div
                          className="absolute inset-1.5 bg-black border border-primary/40 transition-transform duration-[800ms] ease-in-out"
                          style={{
                            transform: `rotate(${(deckB.gain.value / 100) * 270 - 135}deg)`,
                          }}
                        >
                          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-primary" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground">
                            {Math.round(deckB.gain.value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EQ */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Hi", value: deckB.eqHigh.value },
                      { label: "Mid", value: deckB.eqMid.value },
                      { label: "Low", value: deckB.eqLow.value },
                    ].map((eq) => (
                      <div key={eq.label}>
                        <label className="block text-[10px] text-muted-foreground mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                          {eq.label}
                        </label>
                        <div className="flex justify-center">
                          <div className="relative w-11 h-11">
                            <div className="absolute inset-0 bg-muted border border-border" />
                            <div
                              className="absolute inset-1 bg-black border border-primary/30 transition-transform duration-[800ms] ease-in-out"
                              style={{
                                transform: `rotate(${(eq.value / 100) * 270 - 135}deg)`,
                              }}
                            >
                              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/80" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Volume Fader */}
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-10 h-36">
                        <div className="absolute inset-x-0 top-3 bottom-3 bg-muted border border-border" />
                        <div
                          className="absolute inset-x-0 h-6 bg-primary/80 border border-primary transition-all duration-[800ms] ease-in-out"
                          style={{
                            top: `${12 + (100 - deckB.fader.value) * 1.2}px`,
                          }}
                        >
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-white/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Mix Crate */}
      <AutoDJMixCrate />
    </div>
  );
}