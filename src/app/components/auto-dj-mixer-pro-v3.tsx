import { useState, useEffect } from "react";
import { AutoDJMixCrate } from "./auto-dj-mix-crate";
import { Slider } from "./ui/slider";
import { Volume2, Radio, Waves, Zap, ArrowRightLeft, Eye, Play, Pause, Music2 } from "lucide-react";
import { toast } from "sonner";

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

  // Generate professional waveforms
  const waveformDataA = generateProfessionalWaveform(800, 1);
  const waveformDataB = generateProfessionalWaveform(800, 2);

  return (
    <div className="h-full flex bg-black">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Clean Minimal Header - Algoriddim Style */}
        <div className="border-b border-white/10 px-8 py-4 flex-shrink-0 bg-black">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight text-white">Mixer</h1>
            <div className="flex items-center gap-3">
              {(["smooth", "club", "hypnotic", "aggressive"] as MixStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setMixStyle(style)}
                  className={`px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                    mixStyle === style
                      ? "text-primary border-b-2 border-primary"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Clean Two-Deck Layout */}
        <div className="flex-1 overflow-auto px-8 py-8 bg-black">
          <div className="max-w-7xl mx-auto">
            {/* Minimal Algoriddim-Style Mixer - MVP */}
            <div className="max-w-6xl mx-auto">
              {/* Top: BPM Display + Sync Button */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white font-['IBM_Plex_Mono'] mb-1">
                    {deckA.bpm}
                  </div>
                  <div className="text-xs text-white/50 font-['IBM_Plex_Mono'] uppercase tracking-wider">
                    BPM
                  </div>
                </div>
                <button
                  onClick={() => {
                    const targetBPM = deckA.bpm;
                    setDeckB(prev => ({ ...prev, bpm: targetBPM }));
                    setBeatmatched(true);
                    toast.success("Synced! Both decks at " + targetBPM + " BPM");
                    setTimeout(() => setBeatmatched(false), 3000);
                  }}
                  className={`h-12 px-6 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                    beatmatched
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-white/5 hover:bg-white/10 border-white/20 text-white"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  <span>{beatmatched ? "Synced!" : "Sync"}</span>
                </button>
              </div>

              {/* Main Mixer: Left Deck | Center Crossfader | Right Deck */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-start">
                {/* Deck A - Minimal */}
                <div className="space-y-6">
                  {/* Album Art + Track Name */}
                  <div className="text-center space-y-3">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-xl flex items-center justify-center overflow-hidden">
                      <Music2 className="w-16 h-16 text-primary/50" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{deckA.currentTrack}</h3>
                      <p className="text-sm text-white/60">{deckA.artist}</p>
                    </div>
                  </div>

                  {/* Volume Slider Only */}
                  <div className="space-y-2">
                    <label className="block text-xs text-white/60 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[deckA.fader.value]}
                        onValueChange={(val) => setDeckA(prev => ({ ...prev, fader: { ...prev.fader, target: val[0] } }))}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-xs text-white/50 font-['IBM_Plex_Mono']">
                        {Math.round(deckA.fader.value)}%
                      </div>
                    </div>
                  </div>

                  {/* Play/Pause Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setDeckA(prev => ({ ...prev, playing: !prev.playing }))}
                      className="w-16 h-16 rounded-full bg-primary/20 hover:bg-primary/30 border-2 border-primary flex items-center justify-center transition-all"
                    >
                      {deckA.playing ? (
                        <Pause className="w-8 h-8 text-primary" />
                      ) : (
                        <Play className="w-8 h-8 text-primary ml-1" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Center: Crossfader - Large & Prominent */}
                <div className="flex flex-col items-center justify-center space-y-6 pt-16">
                  <div className="w-full max-w-xs">
                    <label className="block text-xs text-white/60 mb-4 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Crossfader
                    </label>
                    <div className="relative w-full h-16">
                      <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-4 bg-white/10 border-2 border-white/20 rounded-full" />
                      <Slider
                        value={[crossfader.value]}
                        onValueChange={(val) => setCrossfader(prev => ({ ...prev, target: val[0] }))}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="absolute -top-8 left-0 text-sm text-primary font-['IBM_Plex_Mono'] font-bold">A</div>
                      <div className="absolute -top-8 right-0 text-sm text-purple-400 font-['IBM_Plex_Mono'] font-bold">B</div>
                    </div>
                  </div>
                </div>

                {/* Deck B - Minimal */}
                <div className="space-y-6">
                  {/* Album Art + Track Name */}
                  <div className="text-center space-y-3">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center overflow-hidden">
                      <Music2 className="w-16 h-16 text-purple-400/50" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{deckB.currentTrack}</h3>
                      <p className="text-sm text-white/60">{deckB.artist}</p>
                    </div>
                  </div>

                  {/* Volume Slider Only */}
                  <div className="space-y-2">
                    <label className="block text-xs text-white/60 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[deckB.fader.value]}
                        onValueChange={(val) => setDeckB(prev => ({ ...prev, fader: { ...prev.fader, target: val[0] } }))}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-xs text-white/50 font-['IBM_Plex_Mono']">
                        {Math.round(deckB.fader.value)}%
                      </div>
                    </div>
                  </div>

                  {/* Play/Pause Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setDeckB(prev => ({ ...prev, playing: !prev.playing }))}
                      className="w-16 h-16 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border-2 border-purple-500 flex items-center justify-center transition-all"
                    >
                      {deckB.playing ? (
                        <Pause className="w-8 h-8 text-purple-400" />
                      ) : (
                        <Play className="w-8 h-8 text-purple-400 ml-1" />
                      )}
                    </button>
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