import { useState, useEffect } from "react";
import { AutoDJMixCrate } from "./auto-dj-mix-crate";

type MixStyle = "smooth" | "club" | "hypnotic" | "aggressive";
type TransitionPhase = "stable" | "preparing" | "blending" | "completing";

interface MixStyleConfig {
  blendBars: number; // 8, 16, or 32 bars
  eqIntensity: number; // 0-10
  transitionSeconds: number; // seconds between transitions
}

const MIX_STYLES: Record<MixStyle, MixStyleConfig> = {
  smooth: { blendBars: 32, eqIntensity: 3, transitionSeconds: 30 },
  club: { blendBars: 16, eqIntensity: 6, transitionSeconds: 22 },
  hypnotic: { blendBars: 32, eqIntensity: 2, transitionSeconds: 35 },
  aggressive: { blendBars: 8, eqIntensity: 8, transitionSeconds: 18 },
};

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
  barsRemaining: number;
  currentTrack: string;
  artist: string;
  bpm: number;
  key: string;
  playing: boolean;
  active: boolean;
  effects: {
    echo: boolean;
    reverb: boolean;
    filter: boolean;
  };
  vuLevel: number; // 0-100 for VU meter
}

// Professional waveform generation - flat, data-driven
function generateProfessionalWaveform(samples: number, seed: number = 0) {
  const data: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    const position = i / samples;
    
    // Phrase structure (8-bar phrases)
    const phrasePosition = (i % 256) / 256;
    
    // Kick drums (4/4 pattern)
    const kickPos = i % 16;
    const isKick = kickPos === 0 || kickPos === 4 || kickPos === 8 || kickPos === 12;
    const kickAmp = isKick ? 0.85 : 0;
    
    // Snare/clap (on 2 and 4)
    const isSnare = kickPos === 6 || kickPos === 14;
    const snareAmp = isSnare ? 0.6 : 0;
    
    // Bassline (rolling, varies by phrase)
    const bassFreq = Math.sin((i + seed * 100) / 6) * 0.4;
    
    // Mids (synths, pads) - gradual evolution
    const midsAmp = Math.sin((i + seed * 50) / 12) * 0.25 + 0.25;
    
    // Highs (hi-hats, percussion)
    const hihatPattern = kickPos % 2 === 0 ? 0.15 : 0.08;
    const highsAmp = hihatPattern + Math.sin((i + seed * 25) / 3) * 0.1;
    
    // Breakdown/build sections (create dynamic variation)
    const section = Math.floor(position * 4);
    let energyMult = 1.0;
    
    if (section === 0) {
      // Intro/breakdown
      energyMult = 0.3 + phrasePosition * 0.4;
    } else if (section === 1) {
      // Build
      energyMult = 0.7 + phrasePosition * 0.3;
    } else if (section === 2) {
      // Peak/drop
      energyMult = 1.0;
    } else {
      // Outro/cooldown
      energyMult = 1.0 - phrasePosition * 0.5;
    }
    
    // Noise floor (always present)
    const noiseFloor = 0.04 + Math.random() * 0.02;
    
    // Combine all elements
    const amplitude = (kickAmp + snareAmp + bassFreq + midsAmp + highsAmp + noiseFloor) * energyMult;
    
    // Convert to percentage (with visible transients)
    const height = Math.max(5, Math.min(100, amplitude * 85));
    
    data.push(height);
  }
  
  return data;
}

export function AutoDJMixerProV3() {
  const [mixStyle, setMixStyle] = useState<MixStyle>("club");
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>("stable");
  const [barsUntilTransition, setBarsUntilTransition] = useState(12);
  const [statusMessage, setStatusMessage] = useState("Beatmatched — waiting for phrase boundary (12 bars)");
  
  const [crossfader, setCrossfader] = useState({ value: 20, target: 20 });
  const [waveformScrollA, setWaveformScrollA] = useState(0);
  const [waveformScrollB, setWaveformScrollB] = useState(0);

  const [deckA, setDeckA] = useState<DeckState>({
    gain: { value: 75, target: 75 },
    eqHigh: { value: 50, target: 50 },
    eqMid: { value: 50, target: 50 },
    eqLow: { value: 50, target: 50 },
    fader: { value: 85, target: 85 },
    barsRemaining: 28,
    currentTrack: "Hypnotic Groove",
    artist: "Underground Mix",
    bpm: 126,
    key: "Am",
    playing: true,
    active: true,
    effects: {
      echo: false,
      reverb: false,
      filter: false,
    },
    vuLevel: 75,
  });

  const [deckB, setDeckB] = useState<DeckState>({
    gain: { value: 72, target: 72 },
    eqHigh: { value: 50, target: 50 },
    eqMid: { value: 50, target: 50 },
    eqLow: { value: 50, target: 50 },
    fader: { value: 15, target: 15 },
    barsRemaining: 64,
    currentTrack: "Warehouse Nights",
    artist: "Berlin Basement",
    bpm: 128,
    key: "Fm",
    playing: false,
    active: false,
    effects: {
      echo: false,
      reverb: false,
      filter: false,
    },
    vuLevel: 25,
  });

  // Smooth interpolation for knobs and faders
  useEffect(() => {
    const interval = setInterval(() => {
      // Crossfader - slow easing
      setCrossfader((prev) => {
        const diff = prev.target - prev.value;
        if (Math.abs(diff) < 0.1) return prev;
        // Ease-in-out: slow at start/end, faster in middle
        const easing = 0.006; // Very slow for 8-10 second transitions
        return { ...prev, value: prev.value + diff * easing };
      });

      // Deck A controls
      setDeckA((prev) => ({
        ...prev,
        gain: smoothKnob(prev.gain, 0.012),
        eqHigh: smoothKnob(prev.eqHigh, 0.007),
        eqMid: smoothKnob(prev.eqMid, 0.007),
        eqLow: smoothKnob(prev.eqLow, 0.007),
        fader: smoothFader(prev.fader, 0.01),
      }));

      // Deck B controls
      setDeckB((prev) => ({
        ...prev,
        gain: smoothKnob(prev.gain, 0.012),
        eqHigh: smoothKnob(prev.eqHigh, 0.007),
        eqMid: smoothKnob(prev.eqMid, 0.007),
        eqLow: smoothKnob(prev.eqLow, 0.007),
        fader: smoothFader(prev.fader, 0.01),
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Waveform scrolling (realistic BPM-based speed)
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (deckA.playing) {
        // At 126 BPM: 126 beats/min = 2.1 beats/sec
        const bpmFactor = deckA.bpm / 126;
        const scrollSpeed = deckA.active ? 0.35 * bpmFactor : 0.12 * bpmFactor;
        setWaveformScrollA((prev) => (prev + scrollSpeed) % 100);
      }
      if (deckB.playing) {
        const bpmFactor = deckB.bpm / 128;
        const scrollSpeed = deckB.active ? 0.35 * bpmFactor : 0.12 * bpmFactor;
        setWaveformScrollB((prev) => (prev + scrollSpeed) % 100);
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, [deckA.playing, deckB.playing, deckA.active, deckB.active, deckA.bpm, deckB.bpm]);

  // Professional mixing automation - phrase-aligned
  useEffect(() => {
    const config = MIX_STYLES[mixStyle];
    
    const automationInterval = setInterval(() => {
      const now = Date.now();
      const cycle = (now / (config.transitionSeconds * 1000)) % 1;
      
      // Calculate bars until next transition
      const barsRemaining = Math.ceil((1 - cycle) * 16);
      setBarsUntilTransition(barsRemaining);

      // PREPARING PHASE (4 bars before transition)
      if (cycle > 0.75 && cycle < 0.80 && transitionPhase === "stable") {
        setTransitionPhase("preparing");
        setStatusMessage(`Preparing next track — waiting for phrase boundary (${barsRemaining} bars)`);
        
        // Preload and cue next deck
        setDeckB((prev) => ({ 
          ...prev, 
          playing: true,
        }));
      }
      
      // BLENDING PHASE (transition starts)
      else if (cycle > 0.80 && cycle < 0.92 && transitionPhase === "preparing") {
        setTransitionPhase("blending");
        
        const blendType = config.blendBars === 32 ? "long blend" : 
                          config.blendBars === 16 ? "standard blend" : "quick blend";
        const eqAction = config.eqIntensity > 6 ? "EQ sweep" : 
                        config.eqIntensity > 3 ? "EQ fade" : "minimal EQ";
        const timeRemaining = Math.ceil((0.92 - cycle) * config.transitionSeconds);
        
        setStatusMessage(`Transition: ${blendType} • ${eqAction} • time remaining: 0:${timeRemaining.toString().padStart(2, '0')}`);
        
        // Start crossfader motion (slow, committed)
        setCrossfader((prev) => ({ ...prev, target: 75 }));
        
        // Bring in next deck
        setDeckB((prev) => ({ 
          ...prev,
          fader: { ...prev.fader, target: 80 },
          eqLow: { ...prev.eqLow, target: 50 - config.eqIntensity * 0.5 },
        }));

        // Reduce outgoing deck
        setDeckA((prev) => ({
          ...prev,
          fader: { ...prev.fader, target: 25 },
          eqHigh: { ...prev.eqHigh, target: 50 - config.eqIntensity * 0.8 },
        }));
      }
      
      // COMPLETING PHASE (finish transition)
      else if (cycle > 0.92 && transitionPhase === "blending") {
        setTransitionPhase("completing");
        setStatusMessage("Transition complete — beatmatched");
        
        // Complete deck swap
        setDeckA((prev) => ({ ...prev, active: false }));
        setDeckB((prev) => ({ ...prev, active: true }));
        
        // Reset crossfader for next cycle
        setTimeout(() => {
          setCrossfader((prev) => ({ ...prev, target: 20 }));
          setDeckA((prev) => ({ 
            ...prev, 
            active: true,
            fader: { ...prev.fader, target: 85 },
            eqHigh: { ...prev.eqHigh, target: 50 },
          }));
          setDeckB((prev) => ({ 
            ...prev, 
            active: false,
            fader: { ...prev.fader, target: 15 },
            eqLow: { ...prev.eqLow, target: 50 },
          }));
        }, 1500);
      }
      
      // STABLE PHASE (normal mixing)
      else if (cycle < 0.75 && transitionPhase !== "stable") {
        setTransitionPhase("stable");
        const harmonicRelation = getHarmonicRelation(deckA.key, deckB.key);
        setStatusMessage(`Beatmatched — ${harmonicRelation} (${barsRemaining} bars)`);
      }

      // Subtle EQ movements during stable mixing (rare, gentle)
      if (transitionPhase === "stable") {
        const eqCycle = (now / 18000) % 1; // 18-second cycle
        
        setDeckA((prev) => ({
          ...prev,
          eqHigh: { ...prev.eqHigh, target: 50 + Math.sin(eqCycle * Math.PI * 2) * 3 },
          eqMid: { ...prev.eqMid, target: 50 + Math.cos(eqCycle * Math.PI * 1.5) * 2 },
          eqLow: { ...prev.eqLow, target: 50 + Math.sin(eqCycle * Math.PI * 2.3) * 3 },
        }));

        setDeckB((prev) => ({
          ...prev,
          eqHigh: { ...prev.eqHigh, target: 50 + Math.sin(eqCycle * Math.PI * 2 + 1) * 3 },
          eqMid: { ...prev.eqMid, target: 50 + Math.cos(eqCycle * Math.PI * 1.5 + 0.8) * 2 },
          eqLow: { ...prev.eqLow, target: 50 + Math.sin(eqCycle * Math.PI * 2.3 + 1.2) * 3 },
        }));
      }
    }, 200);

    return () => clearInterval(automationInterval);
  }, [mixStyle, transitionPhase, deckA.key, deckB.key]);

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

  const getHarmonicRelation = (keyA: string, keyB: string) => {
    // Simplified harmonic matching (would use Camelot wheel in production)
    const relations = [
      "perfect match",
      "harmonic match (±1 semitone)",
      "compatible (±2 semitones)",
      "energy match preserved",
    ];
    return relations[Math.floor(Math.random() * relations.length)];
  };

  // Generate professional waveforms
  const waveformDataA = generateProfessionalWaveform(800, 1);
  const waveformDataB = generateProfessionalWaveform(800, 2);

  return (
    <div className="h-full flex bg-black">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Mix Style Selector */}
        <div className="border-b border-white/10 px-6 py-3.5 flex-shrink-0 bg-black">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white mb-0.5">Auto DJ Mixer</h1>
              <p className="text-[10px] text-white/40 font-['IBM_Plex_Mono'] uppercase tracking-wider">
                Professional Autonomous System
              </p>
            </div>
            
            {/* Mix Style Preset Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 font-['IBM_Plex_Mono'] uppercase tracking-wider mr-2">
                Mix Style:
              </span>
              {(["smooth", "club", "hypnotic", "aggressive"] as MixStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setMixStyle(style)}
                  className={`px-3 py-1.5 text-xs font-['IBM_Plex_Mono'] uppercase tracking-wider border transition-colors ${
                    mixStyle === style
                      ? "bg-primary text-black border-primary"
                      : "bg-black text-white/60 border-white/20 hover:border-white/40 hover:text-white/80"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Strip */}
        <div className="border-b border-white/10 px-6 py-2.5 flex-shrink-0 bg-black">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${
                transitionPhase === "blending" ? "bg-primary animate-pulse" : "bg-white/40"
              }`} />
              <span className="text-xs text-white/70 font-['IBM_Plex_Mono']">
                {statusMessage}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-6 bg-black">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Waveforms - Stacked, Professional */}
            <div className="border border-white/10 bg-black">
              {/* Deck A Waveform */}
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 border flex items-center justify-center text-sm font-medium font-['IBM_Plex_Mono'] transition-all duration-500 ${
                      deckA.active
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-black border-white/20 text-white/40"
                    }`}>
                      A
                    </div>
                    <div>
                      <div className={`text-sm font-medium transition-all duration-500 ${
                        deckA.active ? "text-white" : "text-white/50"
                      }`}>
                        {deckA.currentTrack}
                      </div>
                      <div className="text-[10px] text-white/40 font-['IBM_Plex_Mono']">
                        {deckA.artist} • {deckA.bpm} BPM • {deckA.key}
                      </div>
                    </div>
                  </div>
                  <div className={`font-['IBM_Plex_Mono'] text-sm font-medium transition-all duration-500 ${
                    deckA.active ? "text-primary" : "text-white/40"
                  }`}>
                    {deckA.barsRemaining} bars
                  </div>
                </div>

                {/* Waveform Container - Flat, Data-Driven */}
                <div className={`h-16 bg-black border overflow-hidden relative transition-all duration-500 ${
                  deckA.active ? "border-white/20" : "border-white/10"
                }`}>
                  {/* Phrase markers (every 8 bars = every 32 pixels at this scale) */}
                  <div className="absolute inset-0 flex">
                    {[...Array(25)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-l border-white/10"
                        style={{
                          left: `${i * 4}%`,
                          borderLeftWidth: i % 2 === 0 ? "1px" : "0.5px",
                          opacity: i % 2 === 0 ? 0.3 : 0.15,
                        }}
                      />
                    ))}
                  </div>

                  {/* Waveform - Scrolling, Flat Bars */}
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="flex items-center h-full"
                      style={{
                        transform: `translateX(-${waveformScrollA}%)`,
                        width: "200%",
                      }}
                    >
                      {waveformDataA.concat(waveformDataA).map((height, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0"
                          style={{ width: "0.25%" }}
                        >
                          <div
                            className={`transition-all duration-500 ${
                              deckA.active ? "bg-primary" : "bg-primary/30"
                            }`}
                            style={{ 
                              height: `${height}%`,
                              width: "100%",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Playhead - Fixed Center */}
                  <div className={`absolute inset-y-0 left-1/2 w-0.5 z-10 transition-all duration-500 ${
                    deckA.active ? "bg-white opacity-90" : "bg-white/30 opacity-50"
                  }`} />
                </div>
              </div>

              {/* Deck B Waveform */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 border flex items-center justify-center text-sm font-medium font-['IBM_Plex_Mono'] transition-all duration-500 ${
                      deckB.active
                        ? "bg-purple-500/10 border-purple-500 text-purple-400"
                        : "bg-black border-white/20 text-white/40"
                    }`}>
                      B
                    </div>
                    <div>
                      <div className={`text-sm font-medium transition-all duration-500 ${
                        deckB.active ? "text-white" : "text-white/50"
                      }`}>
                        {deckB.currentTrack}
                      </div>
                      <div className="text-[10px] text-white/40 font-['IBM_Plex_Mono']">
                        {deckB.artist} • {deckB.bpm} BPM • {deckB.key}
                      </div>
                    </div>
                  </div>
                  <div className={`font-['IBM_Plex_Mono'] text-sm font-medium transition-all duration-500 ${
                    deckB.active ? "text-purple-400" : "text-white/40"
                  }`}>
                    {deckB.barsRemaining} bars
                  </div>
                </div>

                {/* Waveform Container */}
                <div className={`h-16 bg-black border overflow-hidden relative transition-all duration-500 ${
                  deckB.active ? "border-white/20" : "border-white/10"
                }`}>
                  {/* Phrase markers */}
                  <div className="absolute inset-0 flex">
                    {[...Array(25)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-l border-white/10"
                        style={{
                          left: `${i * 4}%`,
                          borderLeftWidth: i % 2 === 0 ? "1px" : "0.5px",
                          opacity: i % 2 === 0 ? 0.3 : 0.15,
                        }}
                      />
                    ))}
                  </div>

                  {/* Waveform */}
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="flex items-center h-full"
                      style={{
                        transform: `translateX(-${waveformScrollB}%)`,
                        width: "200%",
                      }}
                    >
                      {waveformDataB.concat(waveformDataB).map((height, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0"
                          style={{ width: "0.25%" }}
                        >
                          <div
                            className={`transition-all duration-500 ${
                              deckB.active ? "bg-purple-500" : "bg-purple-500/30"
                            }`}
                            style={{ 
                              height: `${height}%`,
                              width: "100%",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Playhead */}
                  <div className={`absolute inset-y-0 left-1/2 w-0.5 z-10 transition-all duration-500 ${
                    deckB.active ? "bg-white opacity-90" : "bg-white/30 opacity-50"
                  }`} />
                </div>
              </div>
            </div>

            {/* Mixer - Professional Two-Channel Layout */}
            <div className="border border-white/10 bg-black p-6">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-10 max-w-4xl mx-auto">
                {/* Channel A */}
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Channel A
                    </span>
                  </div>

                  {/* Gain */}
                  <div>
                    <label className="block text-[10px] text-white/40 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Gain
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-white/5 border border-white/20" />
                        <div
                          className="absolute inset-1.5 bg-black border border-primary/50 transition-transform duration-[900ms] ease-in-out"
                          style={{
                            transform: `rotate(${(deckA.gain.value / 100) * 270 - 135}deg)`,
                          }}
                        >
                          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-primary" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-['IBM_Plex_Mono'] text-white/50">
                            {Math.round(deckA.gain.value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Band EQ with Sliders */}
                  <div className="space-y-3">
                    {[
                      { label: "Bass", value: deckA.eqLow.value, onChange: (val: number[]) => setDeckA(prev => ({ ...prev, eqLow: { ...prev.eqLow, target: val[0] } })) },
                      { label: "Mid", value: deckA.eqMid.value, onChange: (val: number[]) => setDeckA(prev => ({ ...prev, eqMid: { ...prev.eqMid, target: val[0] } })) },
                      { label: "Treble", value: deckA.eqHigh.value, onChange: (val: number[]) => setDeckA(prev => ({ ...prev, eqHigh: { ...prev.eqHigh, target: val[0] } })) },
                    ].map((eq) => (
                      <div key={eq.label}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] text-white/40 font-['IBM_Plex_Mono'] uppercase tracking-wider">
                            {eq.label}
                          </label>
                          <span className="text-[9px] text-white/50 font-['IBM_Plex_Mono']">
                            {Math.round(eq.value - 50)}
                          </span>
                        </div>
                        <Slider
                          value={[eq.value]}
                          onValueChange={eq.onChange}
                          min={0}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* VU Meter */}
                  <div>
                    <label className="block text-[9px] text-white/40 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Level
                    </label>
                    <div className="h-20 bg-black border border-white/20 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-red-500 via-yellow-500 to-green-500 transition-all duration-100"
                          style={{ height: `${deckA.vuLevel}%` }}
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-between px-1 py-0.5">
                        {[100, 75, 50, 25, 0].map((level) => (
                          <div key={level} className="h-px bg-white/20" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Effect Buttons */}
                  <div>
                    <label className="block text-[9px] text-white/40 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Effects
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setDeckA(prev => ({ ...prev, effects: { ...prev.effects, echo: !prev.effects.echo } }))}
                        className={`h-7 text-[9px] font-['IBM_Plex_Mono'] uppercase transition-all ${
                          deckA.effects.echo 
                            ? "bg-primary/20 border-primary text-primary border" 
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Echo
                      </button>
                      <button
                        onClick={() => setDeckA(prev => ({ ...prev, effects: { ...prev.effects, reverb: !prev.effects.reverb } }))}
                        className={`h-7 text-[9px] font-['IBM_Plex_Mono'] uppercase transition-all ${
                          deckA.effects.reverb 
                            ? "bg-primary/20 border-primary text-primary border" 
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Reverb
                      </button>
                      <button
                        onClick={() => setDeckA(prev => ({ ...prev, effects: { ...prev.effects, filter: !prev.effects.filter } }))}
                        className={`h-7 text-[9px] font-['IBM_Plex_Mono'] uppercase transition-all ${
                          deckA.effects.filter 
                            ? "bg-primary/20 border-primary text-primary border" 
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Filter
                      </button>
                    </div>
                  </div>

                  {/* Channel Fader */}
                  <div>
                    <label className="block text-[10px] text-white/40 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-10 h-36">
                        <div className="absolute inset-x-0 top-3 bottom-3 bg-white/5 border border-white/20" />
                        <div
                          className="absolute inset-x-0 h-6 bg-primary/90 border border-primary transition-all duration-[900ms] ease-in-out"
                          style={{
                            top: `${12 + (100 - deckA.fader.value) * 1.2}px`,
                          }}
                        >
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-white/40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crossfader */}
                <div className="flex flex-col items-center justify-end pb-6">
                  <label className="block text-[10px] text-white/40 mb-4 font-['IBM_Plex_Mono'] uppercase tracking-wider">
                    Crossfader
                  </label>
                  <div className="relative w-52 h-12">
                    <div className="absolute inset-y-0 left-4 right-4 top-1/2 -translate-y-1/2 h-3 bg-white/5 border border-white/20" />
                    <div
                      className="absolute top-0 w-11 h-12 bg-white/95 border border-white transition-all duration-[900ms] ease-in-out shadow-lg"
                      style={{
                        left: `${16 + (crossfader.value / 100) * 152}px`,
                      }}
                    >
                      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 space-y-0.5">
                        <div className="h-px bg-black/30" />
                        <div className="h-px bg-black/30" />
                        <div className="h-px bg-black/30" />
                      </div>
                    </div>
                    <div className="absolute -top-6 left-0 text-[10px] text-primary font-['IBM_Plex_Mono']">A</div>
                    <div className="absolute -top-6 right-0 text-[10px] text-purple-400 font-['IBM_Plex_Mono']">B</div>
                  </div>
                </div>

                {/* Channel B */}
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Channel B
                    </span>
                  </div>

                  {/* Gain */}
                  <div>
                    <label className="block text-[10px] text-white/40 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Gain
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-white/5 border border-white/20" />
                        <div
                          className="absolute inset-1.5 bg-black border border-purple-500/50 transition-transform duration-[900ms] ease-in-out"
                          style={{
                            transform: `rotate(${(deckB.gain.value / 100) * 270 - 135}deg)`,
                          }}
                        >
                          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-purple-400" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-['IBM_Plex_Mono'] text-white/50">
                            {Math.round(deckB.gain.value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Band EQ with Sliders */}
                  <div className="space-y-3">
                    {[
                      { label: "Bass", value: deckB.eqLow.value, onChange: (val: number[]) => setDeckB(prev => ({ ...prev, eqLow: { ...prev.eqLow, target: val[0] } })) },
                      { label: "Mid", value: deckB.eqMid.value, onChange: (val: number[]) => setDeckB(prev => ({ ...prev, eqMid: { ...prev.eqMid, target: val[0] } })) },
                      { label: "Treble", value: deckB.eqHigh.value, onChange: (val: number[]) => setDeckB(prev => ({ ...prev, eqHigh: { ...prev.eqHigh, target: val[0] } })) },
                    ].map((eq) => (
                      <div key={eq.label}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] text-white/40 font-['IBM_Plex_Mono'] uppercase tracking-wider">
                            {eq.label}
                          </label>
                          <span className="text-[9px] text-white/50 font-['IBM_Plex_Mono']">
                            {Math.round(eq.value - 50)}
                          </span>
                        </div>
                        <Slider
                          value={[eq.value]}
                          onValueChange={eq.onChange}
                          min={0}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* VU Meter */}
                  <div>
                    <label className="block text-[9px] text-white/40 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Level
                    </label>
                    <div className="h-20 bg-black border border-white/20 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-red-500 via-yellow-500 to-green-500 transition-all duration-100"
                          style={{ height: `${deckB.vuLevel}%` }}
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-between px-1 py-0.5">
                        {[100, 75, 50, 25, 0].map((level) => (
                          <div key={level} className="h-px bg-white/20" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Effect Buttons */}
                  <div>
                    <label className="block text-[9px] text-white/40 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Effects
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setDeckB(prev => ({ ...prev, effects: { ...prev.effects, echo: !prev.effects.echo } }))}
                        className={`h-7 text-[9px] font-['IBM_Plex_Mono'] uppercase transition-all ${
                          deckB.effects.echo 
                            ? "bg-purple-500/20 border-purple-500 text-purple-400 border" 
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Echo
                      </button>
                      <button
                        onClick={() => setDeckB(prev => ({ ...prev, effects: { ...prev.effects, reverb: !prev.effects.reverb } }))}
                        className={`h-7 text-[9px] font-['IBM_Plex_Mono'] uppercase transition-all ${
                          deckB.effects.reverb 
                            ? "bg-purple-500/20 border-purple-500 text-purple-400 border" 
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Reverb
                      </button>
                      <button
                        onClick={() => setDeckB(prev => ({ ...prev, effects: { ...prev.effects, filter: !prev.effects.filter } }))}
                        className={`h-7 text-[9px] font-['IBM_Plex_Mono'] uppercase transition-all ${
                          deckB.effects.filter 
                            ? "bg-purple-500/20 border-purple-500 text-purple-400 border" 
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Filter
                      </button>
                    </div>
                  </div>

                  {/* Channel Fader */}
                  <div>
                    <label className="block text-[10px] text-white/40 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-10 h-36">
                        <div className="absolute inset-x-0 top-3 bottom-3 bg-white/5 border border-white/20" />
                        <div
                          className="absolute inset-x-0 h-6 bg-purple-500/90 border border-purple-500 transition-all duration-[900ms] ease-in-out"
                          style={{
                            top: `${12 + (100 - deckB.fader.value) * 1.2}px`,
                          }}
                        >
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-white/40" />
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
