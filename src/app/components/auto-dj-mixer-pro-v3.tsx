import { useState, useEffect } from "react";
import { AutoDJMixCrate } from "./auto-dj-mix-crate";
import { Slider } from "./ui/slider";
import { Volume2, Radio, Waves, Zap, ArrowRightLeft, Eye, Play, Pause, Music2 } from "lucide-react";
import { toast } from "sonner";
import { CircularKnob } from "./circular-knob";
import { WaveformVisualizer } from "./waveform-visualizer";

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
  const [autoBlendActive, setAutoBlendActive] = useState(false);
  const [autoBlendProgress, setAutoBlendProgress] = useState(0);
  const [showTransitionPreview, setShowTransitionPreview] = useState(false);
  const [beatmatched, setBeatmatched] = useState(false);

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

  // Calculate EQ dB values (0-100 -> -12dB to +12dB)
  const eqToDb = (value: number) => {
    return ((value - 50) / 50) * 12;
  };

  return (
    <div className="h-full flex bg-[#1a1a1a]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Professional DJ Mixer Interface */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Main Layout: Deck A | Center | Deck B */}
            <div className="grid grid-cols-[1fr_320px_1fr] gap-6">
              
              {/* DECK A - Orange Accents */}
              <div className="bg-[#252525] rounded-lg border border-white/5 p-6 space-y-4">
                {/* Album Artwork */}
                <div className="flex justify-center">
                  <div className="w-[100px] h-[100px] bg-gradient-to-br from-[#FF8C00]/20 to-[#FF8C00]/10 border-2 border-[#FF8C00]/30 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                    <Music2 className="w-12 h-12 text-[#FF8C00]/50" />
                  </div>
                </div>

                {/* Track Info */}
                <div className="text-center space-y-1">
                  <h3 className="text-base font-semibold text-white truncate">{deckA.currentTrack}</h3>
                  <p className="text-sm text-white/70 truncate">{deckA.artist}</p>
                  <div className="flex items-center justify-center gap-3 mt-2 text-xs font-['IBM_Plex_Mono']">
                    <span className="text-[#FF8C00]">{deckA.bpm} BPM</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/70">{deckA.key}</span>
                  </div>
                </div>

                {/* Waveform */}
                <div className="w-full h-10 bg-black/40 rounded border border-white/10 p-1">
                  <WaveformVisualizer
                    energy={deckA.active ? "Peak" : "Steady"}
                    width={200}
                    height={40}
                    barCount={100}
                  />
                </div>

                {/* Volume Knob (Large) */}
                <div className="flex justify-center pt-2">
                  <CircularKnob
                    value={deckA.fader.value}
                    onChange={(val) => setDeckA(prev => ({ ...prev, fader: { ...prev.fader, target: val } }))}
                    size={100}
                    color="#FF8C00"
                    label="VOLUME"
                    min={0}
                    max={100}
                  />
                </div>

                {/* Gain Knob (Smaller) */}
                <div className="flex justify-center -mt-2">
                  <CircularKnob
                    value={deckA.gain.value}
                    onChange={(val) => setDeckA(prev => ({ ...prev, gain: { ...prev.gain, target: val } }))}
                    size={70}
                    color="#FF8C00"
                    label="GAIN"
                    min={0}
                    max={100}
                  />
                </div>

                {/* 3-Band EQ */}
                <div className="pt-4 space-y-4">
                  <div className="text-center">
                    <span className="text-[10px] text-white/60 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      EQUALIZER
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* LOW */}
                    <div className="flex flex-col items-center space-y-2">
                      <label className="text-[10px] text-white/60 uppercase font-['IBM_Plex_Mono']">LOW</label>
                      <div className="h-32 w-8 flex items-center justify-center">
                        <Slider
                          orientation="vertical"
                          value={[deckA.eqLow.value]}
                          onValueChange={(val) => setDeckA(prev => ({ ...prev, eqLow: { ...prev.eqLow, target: val[0] } }))}
                          min={0}
                          max={100}
                          step={1}
                          className="h-full"
                        />
                      </div>
                      <span className="text-[10px] text-[#FF8C00] font-['IBM_Plex_Mono'] font-bold">
                        {eqToDb(deckA.eqLow.value).toFixed(1)}dB
                      </span>
                    </div>

                    {/* MID */}
                    <div className="flex flex-col items-center space-y-2">
                      <label className="text-[10px] text-white/60 uppercase font-['IBM_Plex_Mono']">MID</label>
                      <div className="h-32 w-8 flex items-center justify-center">
                        <Slider
                          orientation="vertical"
                          value={[deckA.eqMid.value]}
                          onValueChange={(val) => setDeckA(prev => ({ ...prev, eqMid: { ...prev.eqMid, target: val[0] } }))}
                          min={0}
                          max={100}
                          step={1}
                          className="h-full"
                        />
                      </div>
                      <span className="text-[10px] text-[#FF8C00] font-['IBM_Plex_Mono'] font-bold">
                        {eqToDb(deckA.eqMid.value).toFixed(1)}dB
                      </span>
                    </div>

                    {/* HIGH */}
                    <div className="flex flex-col items-center space-y-2">
                      <label className="text-[10px] text-white/60 uppercase font-['IBM_Plex_Mono']">HIGH</label>
                      <div className="h-32 w-8 flex items-center justify-center">
                        <Slider
                          orientation="vertical"
                          value={[deckA.eqHigh.value]}
                          onValueChange={(val) => setDeckA(prev => ({ ...prev, eqHigh: { ...prev.eqHigh, target: val[0] } }))}
                          min={0}
                          max={100}
                          step={1}
                          className="h-full"
                        />
                      </div>
                      <span className="text-[10px] text-[#FF8C00] font-['IBM_Plex_Mono'] font-bold">
                        {eqToDb(deckA.eqHigh.value).toFixed(1)}dB
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CENTER CONTROLS */}
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                {/* BPM Display */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-white font-['IBM_Plex_Mono'] mb-1">
                    {deckA.bpm}
                  </div>
                  <div className="text-xs text-white/50 font-['IBM_Plex_Mono'] uppercase tracking-wider">
                    BPM
                  </div>
                </div>

                {/* Sync Button */}
                <button
                  onClick={() => {
                    const targetBPM = deckA.bpm;
                    setDeckB(prev => ({ ...prev, bpm: targetBPM }));
                    setBeatmatched(true);
                    toast.success("Synced! Both decks at " + targetBPM + " BPM");
                    setTimeout(() => setBeatmatched(false), 3000);
                  }}
                  className={`w-full h-12 rounded-lg border-2 text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 font-['IBM_Plex_Mono'] ${
                    beatmatched
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-white/5 hover:bg-white/10 border-white/20 text-white"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  SYNC
                </button>

                {/* Crossfader */}
                <div className="w-full space-y-3">
                  <label className="block text-xs text-white/60 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                    CROSSFADER
                  </label>
                  <div className="relative w-full h-20">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-3 bg-white/10 border-2 border-white/20 rounded-full" />
                    </div>
                    <Slider
                      value={[crossfader.value]}
                      onValueChange={(val) => setCrossfader(prev => ({ ...prev, target: val[0] }))}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="absolute -top-6 left-0 text-sm text-[#FF8C00] font-['IBM_Plex_Mono'] font-bold">A</div>
                    <div className="absolute -top-6 right-0 text-sm text-[#A855F7] font-['IBM_Plex_Mono'] font-bold">B</div>
                  </div>
                </div>

                {/* Play/Pause Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={() => setDeckA(prev => ({ ...prev, playing: !prev.playing }))}
                    className={`h-12 rounded-lg border-2 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 font-['IBM_Plex_Mono'] ${
                      deckA.playing
                        ? "bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]"
                        : "bg-white/5 hover:bg-white/10 border-white/20 text-white"
                    }`}
                  >
                    {deckA.playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    A
                  </button>
                  <button
                    onClick={() => setDeckB(prev => ({ ...prev, playing: !prev.playing }))}
                    className={`h-12 rounded-lg border-2 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 font-['IBM_Plex_Mono'] ${
                      deckB.playing
                        ? "bg-[#A855F7]/20 border-[#A855F7] text-[#A855F7]"
                        : "bg-white/5 hover:bg-white/10 border-white/20 text-white"
                    }`}
                  >
                    {deckB.playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    B
                  </button>
                </div>
              </div>

              {/* DECK B - Purple Accents */}
              <div className="bg-[#252525] rounded-lg border border-white/5 p-6 space-y-4">
                {/* Album Artwork */}
                <div className="flex justify-center">
                  <div className="w-[100px] h-[100px] bg-gradient-to-br from-[#A855F7]/20 to-[#A855F7]/10 border-2 border-[#A855F7]/30 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                    <Music2 className="w-12 h-12 text-[#A855F7]/50" />
                  </div>
                </div>

                {/* Track Info */}
                <div className="text-center space-y-1">
                  <h3 className="text-base font-semibold text-white truncate">{deckB.currentTrack}</h3>
                  <p className="text-sm text-white/70 truncate">{deckB.artist}</p>
                  <div className="flex items-center justify-center gap-3 mt-2 text-xs font-['IBM_Plex_Mono']">
                    <span className="text-[#A855F7]">{deckB.bpm} BPM</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/70">{deckB.key}</span>
                  </div>
                </div>

                {/* Waveform */}
                <div className="w-full h-10 bg-black/40 rounded border border-white/10 p-1">
                  <WaveformVisualizer
                    energy={deckB.active ? "Peak" : "Steady"}
                    width={200}
                    height={40}
                    barCount={100}
                  />
                </div>

                {/* Volume Knob (Large) */}
                <div className="flex justify-center pt-2">
                  <CircularKnob
                    value={deckB.fader.value}
                    onChange={(val) => setDeckB(prev => ({ ...prev, fader: { ...prev.fader, target: val } }))}
                    size={100}
                    color="#A855F7"
                    label="VOLUME"
                    min={0}
                    max={100}
                  />
                </div>

                {/* Gain Knob (Smaller) */}
                <div className="flex justify-center -mt-2">
                  <CircularKnob
                    value={deckB.gain.value}
                    onChange={(val) => setDeckB(prev => ({ ...prev, gain: { ...prev.gain, target: val } }))}
                    size={70}
                    color="#A855F7"
                    label="GAIN"
                    min={0}
                    max={100}
                  />
                </div>

                {/* 3-Band EQ */}
                <div className="pt-4 space-y-4">
                  <div className="text-center">
                    <span className="text-[10px] text-white/60 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      EQUALIZER
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* LOW */}
                    <div className="flex flex-col items-center space-y-2">
                      <label className="text-[10px] text-white/60 uppercase font-['IBM_Plex_Mono']">LOW</label>
                      <div className="h-32 w-8 flex items-center justify-center">
                        <Slider
                          orientation="vertical"
                          value={[deckB.eqLow.value]}
                          onValueChange={(val) => setDeckB(prev => ({ ...prev, eqLow: { ...prev.eqLow, target: val[0] } }))}
                          min={0}
                          max={100}
                          step={1}
                          className="h-full"
                        />
                      </div>
                      <span className="text-[10px] text-[#A855F7] font-['IBM_Plex_Mono'] font-bold">
                        {eqToDb(deckB.eqLow.value).toFixed(1)}dB
                      </span>
                    </div>

                    {/* MID */}
                    <div className="flex flex-col items-center space-y-2">
                      <label className="text-[10px] text-white/60 uppercase font-['IBM_Plex_Mono']">MID</label>
                      <div className="h-32 w-8 flex items-center justify-center">
                        <Slider
                          orientation="vertical"
                          value={[deckB.eqMid.value]}
                          onValueChange={(val) => setDeckB(prev => ({ ...prev, eqMid: { ...prev.eqMid, target: val[0] } }))}
                          min={0}
                          max={100}
                          step={1}
                          className="h-full"
                        />
                      </div>
                      <span className="text-[10px] text-[#A855F7] font-['IBM_Plex_Mono'] font-bold">
                        {eqToDb(deckB.eqMid.value).toFixed(1)}dB
                      </span>
                    </div>

                    {/* HIGH */}
                    <div className="flex flex-col items-center space-y-2">
                      <label className="text-[10px] text-white/60 uppercase font-['IBM_Plex_Mono']">HIGH</label>
                      <div className="h-32 w-8 flex items-center justify-center">
                        <Slider
                          orientation="vertical"
                          value={[deckB.eqHigh.value]}
                          onValueChange={(val) => setDeckB(prev => ({ ...prev, eqHigh: { ...prev.eqHigh, target: val[0] } }))}
                          min={0}
                          max={100}
                          step={1}
                          className="h-full"
                        />
                      </div>
                      <span className="text-[10px] text-[#A855F7] font-['IBM_Plex_Mono'] font-bold">
                        {eqToDb(deckB.eqHigh.value).toFixed(1)}dB
                      </span>
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