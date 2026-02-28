import { useState, useEffect, useMemo } from "react";
import { Slider } from "./ui/slider";
import { Volume2, Radio, Waves, Zap, ArrowRightLeft, Eye, Play, Pause, Music2, X, Download, Coins, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { CircularKnob } from "./circular-knob";
import { HardwareKnob } from "./hardware-knob";
import { VUMeter } from "./vu-meter";
import { WaveformVisualizer } from "./waveform-visualizer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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

interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: number;
  energy?: string;
  artwork?: string;
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
  trackId?: string; // ID of loaded track
  artwork?: string; // Track artwork
  energy?: string; // Track energy level
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

  // Track Selection Sidebar
  const [trackTab, setTrackTab] = useState<"dna" | "generated">("dna");
  const [dnaTracks, setDnaTracks] = useState<Track[]>([]);
  const [generatedTracks, setGeneratedTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [draggedTrack, setDraggedTrack] = useState<Track | null>(null);
  const [dragOverDeck, setDragOverDeck] = useState<"A" | "B" | null>(null);

  // Credits System
  const [credits, setCredits] = useState<number>(() => {
    const stored = localStorage.getItem('userCredits');
    return stored ? parseInt(stored, 10) : 10;
  });
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [trackToDownload, setTrackToDownload] = useState<Track | null>(null);

  const [deckA, setDeckA] = useState<DeckState>({
    gain: { value: 75, target: 75 },
    eqHigh: { value: 50, target: 50 },
    eqMid: { value: 50, target: 50 },
    eqLow: { value: 50, target: 50 },
    fader: { value: 85, target: 85 },
    barsRemaining: 28,
    currentTrack: "No Track Loaded",
    artist: "—",
    bpm: 0,
    key: "—",
    playing: false,
    active: false,
    effects: {
      echo: false,
      reverb: false,
      filter: false,
    },
    vuLevel: 0,
  });

  const [deckB, setDeckB] = useState<DeckState>({
    gain: { value: 72, target: 72 },
    eqHigh: { value: 50, target: 50 },
    eqMid: { value: 50, target: 50 },
    eqLow: { value: 50, target: 50 },
    fader: { value: 15, target: 15 },
    barsRemaining: 64,
    currentTrack: "No Track Loaded",
    artist: "—",
    bpm: 0,
    key: "—",
    playing: false,
    active: false,
    effects: {
      echo: false,
      reverb: false,
      filter: false,
    },
    vuLevel: 0,
  });

  // Load tracks from localStorage
  useEffect(() => {
    // Load DNA tracks (uploaded audio files)
    const loadDnaTracks = () => {
      try {
        const stored = localStorage.getItem('uploadedAudioFiles');
        if (stored) {
          const files = JSON.parse(stored);
          const tracks: Track[] = files.map((file: any) => ({
            id: file.id,
            title: file.title || file.name,
            artist: file.artist || "Unknown Artist",
            bpm: file.bpm || 128,
            key: file.key || "Am",
            duration: file.duration || 0,
            energy: file.energy || "Groove",
            artwork: file.artwork || "",
          }));
          setDnaTracks(tracks);
        }
      } catch (error) {
        console.error('Error loading DNA tracks:', error);
      }
    };

    // Load Generated tracks
    const loadGeneratedTracks = () => {
      try {
        const stored = localStorage.getItem('libraryTracks');
        if (stored) {
          const tracks = JSON.parse(stored);
          const formatted: Track[] = tracks.map((track: any) => ({
            id: track.id,
            title: track.title,
            artist: track.artist || "Unknown Artist",
            bpm: track.bpm || 128,
            key: track.key || "Am",
            duration: track.duration ? parseDuration(track.duration) : 0,
            energy: track.energy || "Groove",
            artwork: track.artwork || "",
          }));
          setGeneratedTracks(formatted);
        }
      } catch (error) {
        console.error('Error loading generated tracks:', error);
      }
    };

    loadDnaTracks();
    loadGeneratedTracks();
  }, []);

  // Parse duration string (e.g., "5:30") to seconds
  const parseDuration = (duration: string): number => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  // Load track to deck
  const loadTrackToDeck = (track: Track, deck: "A" | "B") => {
    if (deck === "A") {
      setDeckA(prev => ({
        ...prev,
        currentTrack: track.title,
        artist: track.artist,
        bpm: track.bpm,
        key: track.key,
        trackId: track.id,
        artwork: track.artwork,
        energy: track.energy,
        active: true,
        vuLevel: 75,
      }));
      toast.success(`Loaded "${track.title}" to Deck A`);
    } else {
      setDeckB(prev => ({
        ...prev,
        currentTrack: track.title,
        artist: track.artist,
        bpm: track.bpm,
        key: track.key,
        trackId: track.id,
        artwork: track.artwork,
        energy: track.energy,
        active: true,
        vuLevel: 25,
      }));
      toast.success(`Loaded "${track.title}" to Deck B`);
    }
    setSelectedTrack(track);
  };

  // Clear deck
  const clearDeck = (deck: "A" | "B") => {
    if (deck === "A") {
      setDeckA(prev => ({
        ...prev,
        currentTrack: "No Track Loaded",
        artist: "—",
        bpm: 0,
        key: "—",
        playing: false,
        active: false,
        trackId: undefined,
        artwork: undefined,
        energy: undefined,
        vuLevel: 0,
      }));
    } else {
      setDeckB(prev => ({
        ...prev,
        currentTrack: "No Track Loaded",
        artist: "—",
        bpm: 0,
        key: "—",
        playing: false,
        active: false,
        trackId: undefined,
        artwork: undefined,
        energy: undefined,
        vuLevel: 0,
      }));
    }
  };

  // Handle download
  const handleDownloadClick = (track: Track) => {
    if (credits < 1) {
      toast.error("Insufficient credits. Please upgrade to download tracks.");
      return;
    }
    setTrackToDownload(track);
    setDownloadDialogOpen(true);
  };

  const confirmDownload = () => {
    if (!trackToDownload || credits < 1) return;

    // Deduct credit
    const newCredits = credits - 1;
    setCredits(newCredits);
    localStorage.setItem('userCredits', newCredits.toString());

    // Simulate download (in production, this would trigger actual file download)
    toast.success(`Downloaded "${trackToDownload.title}"! ${newCredits} credits remaining.`);
    setDownloadDialogOpen(false);
    setTrackToDownload(null);
  };

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

  const currentTracks = trackTab === "dna" ? dnaTracks : generatedTracks;

  return (
    <div className="h-full flex bg-[#0D0D0D]">
      {/* LEFT SIDEBAR - Track Selection - Professional */}
      <div 
        className="w-[250px] flex flex-col flex-shrink-0"
        style={{
          background: '#1A1A1A',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-sm font-bold text-white uppercase tracking-wider font-['Rajdhani']"
            >TRACK LIBRARY</h2>
            <span 
              className="text-xs text-[#00D4FF] font-['JetBrains_Mono'] font-semibold"
            >{currentTracks.length}</span>
            </div>
            
          {/* Credits Display */}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-['JetBrains_Mono'] mb-3 ${
            credits < 5 ? 'text-[#FF9500] bg-[#FF9500]/10' : 'text-[#00D4FF] bg-[#00D4FF]/10'
          }`}>
            <Coins className="w-3 h-3" />
            <span className="font-semibold">{credits}</span>
          </div>
          
          {/* Tabs - Cyan Active */}
          <div className="flex gap-2">
                <button
              onClick={() => setTrackTab("dna")}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded transition-all font-['Rajdhani']"
              style={trackTab === "dna" ? {
                background: '#00D4FF',
                color: '#000',
              } : {
                background: '#242424',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              DNA Tracks
                </button>
            <button
              onClick={() => setTrackTab("generated")}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded transition-all font-['Rajdhani']"
              style={trackTab === "generated" ? {
                background: '#00D4FF',
                color: '#000',
              } : {
                background: '#242424',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Generated
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto">
          {currentTracks.length === 0 ? (
            <div className="p-6 text-center animate-breathing">
              {/* EQ Visualizer - Empty State */}
              <div className="flex items-end justify-center gap-1 h-12 mb-4 opacity-30">
                <div className="w-2 rounded-t eq-bar" style={{ animationDelay: '0s' }} />
                <div className="w-2 rounded-t eq-bar" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 rounded-t eq-bar" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 rounded-t eq-bar" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 rounded-t eq-bar" style={{ animationDelay: '0.05s' }} />
              </div>
              <Music2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-[#888888] mb-3 font-['Rajdhani']">
                {trackTab === "dna" 
                  ? "No DNA tracks uploaded yet"
                  : "No generated tracks yet"}
              </p>
              <button 
                className="text-xs text-[#00D4FF] hover:text-[#00B8E6] underline font-['Rajdhani'] font-semibold transition-all"
              >
                Upload Tracks
              </button>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {currentTracks.map((track) => (
                <div
                  key={track.id}
                  draggable
                  onDragStart={() => setDraggedTrack(track)}
                  onDragEnd={() => {
                    setDraggedTrack(null);
                    setDragOverDeck(null);
                  }}
                  onClick={() => {
                    setSelectedTrack(track);
                    // Auto-load to Deck A if empty, otherwise Deck B
                    if (deckA.bpm === 0) {
                      loadTrackToDeck(track, "A");
                    } else if (deckB.bpm === 0) {
                      loadTrackToDeck(track, "B");
                    }
                  }}
                  className={`p-2.5 rounded-lg cursor-pointer transition-all border ${
                    selectedTrack?.id === track.id
                      ? "bg-[#00D4FF]/20 border-[#00D4FF] shadow-lg shadow-[#00D4FF]/20"
                      : "bg-white/5 hover:bg-white/10 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {track.artwork ? (
                        <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music2 className="w-5 h-5 text-white/30" />
                      )}
          </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{track.title}</p>
                      <p className="text-[10px] text-white/60 truncate">{track.artist}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] text-white/50 font-['JetBrains_Mono']">{track.bpm}</span>
                        <span className="text-[9px] text-white/50">•</span>
                        <span className="text-[9px] text-white/50 font-['JetBrains_Mono']">{track.key}</span>
        </div>
                    </div>
                      </div>
                      </div>
              ))}
                    </div>
          )}
                  </div>
                </div>

      {/* RIGHT SIDE: PIONEER DJM-900NXS2 HARDWARE MIXER */}
      <div className="flex-1 flex flex-col overflow-hidden mixer-hardware-bg">
        {/* Professional DJ Hardware Mixer Interface */}
        <div className="flex-1 overflow-auto p-4">
          <div className="w-full max-w-[1400px] mx-auto">
            
            {/* Top Bar: Mode Selection & Status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1.5">
                {(["smooth", "club", "hypnotic", "aggressive"] as MixStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setMixStyle(style)}
                    className={`hw-mode-button ${mixStyle === style ? 'active' : 'inactive'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FF66' }} />
                <span className="text-[10px] text-white/70 font-['JetBrains_Mono']">{statusMessage}</span>
              </div>
            </div>

            {/* DECK LOADING SECTION */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* DECK A SLOT */}
              <div 
                className={`deck-slot p-3 rounded ${deckA.bpm > 0 ? 'loaded' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOverDeck("A"); }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedTrack) {
                    loadTrackToDeck(draggedTrack, "A");
                    setDraggedTrack(null);
                    setDragOverDeck(null);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="hw-label">DECK A</span>
                  <span className="hw-value text-[11px]">{deckA.bpm > 0 ? `${deckA.bpm} BPM` : '—'}</span>
                </div>
                {deckA.bpm > 0 ? (
                  <>
                    <div className="text-[11px] text-white truncate font-semibold mb-1">{deckA.currentTrack}</div>
                    <div className="text-[10px] text-[#888888] truncate mb-2">{deckA.artist}</div>
                    {/* Mini Waveform */}
                    <div className="flex items-end gap-[2px] h-8">
                      {Array.from({ length: 60 }, (_, i) => (
                        <div
                          key={i}
                          className="mini-waveform-bar"
                          style={{ height: `${20 + Math.random() * 80}%` }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <span className="text-[10px] text-[#666666]">Load Track</span>
                  </div>
                )}
              </div>

              {/* DECK B SLOT */}
              <div 
                className={`deck-slot p-3 rounded ${deckB.bpm > 0 ? 'loaded' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOverDeck("B"); }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedTrack) {
                    loadTrackToDeck(draggedTrack, "B");
                    setDraggedTrack(null);
                    setDragOverDeck(null);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="hw-label">DECK B</span>
                  <span className="hw-value text-[11px]">{deckB.bpm > 0 ? `${deckB.bpm} BPM` : '—'}</span>
                </div>
                {deckB.bpm > 0 ? (
                  <>
                    <div className="text-[11px] text-white truncate font-semibold mb-1">{deckB.currentTrack}</div>
                    <div className="text-[10px] text-[#888888] truncate mb-2">{deckB.artist}</div>
                    {/* Mini Waveform */}
                    <div className="flex items-end gap-[2px] h-8">
                      {Array.from({ length: 60 }, (_, i) => (
                        <div
                          key={i}
                          className="mini-waveform-bar"
                          style={{ height: `${20 + Math.random() * 80}%` }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <span className="text-[10px] text-[#666666]">Load Track</span>
                  </div>
                )}
              </div>
            </div>

            {/* MAIN HARDWARE MIXER: 3-Column Layout */}
            <div 
              className="grid grid-cols-[1fr_200px_1fr] gap-4 p-4 rounded-lg"
              style={{
                background: '#0A0A0A',
                border: '2px solid rgba(0,0,0,0.8)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)',
                maxHeight: '520px',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x < rect.width * 0.35) {
                  setDragOverDeck("A");
                } else if (x > rect.width * 0.65) {
                  setDragOverDeck("B");
                } else {
                  setDragOverDeck(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedTrack && dragOverDeck) {
                  loadTrackToDeck(draggedTrack, dragOverDeck);
                  setDraggedTrack(null);
                  setDragOverDeck(null);
                }
              }}
            >
              {/* CHANNEL A - LEFT STRIP */}
              <div className="channel-strip p-3 rounded flex flex-col">
                <span className="hw-label text-center mb-3">CHANNEL A</span>
                
                {/* GAIN KNOB */}
                <div className="flex justify-center mb-4">
                  <HardwareKnob
                    value={deckA.gain.value}
                    onChange={(val) => setDeckA(prev => ({ ...prev, gain: { ...prev.gain, target: val } }))}
                    size={70}
                    label="GAIN"
                    showValue={true}
                  />
                    </div>

                {/* 3-BAND EQ - VERTICAL */}
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <HardwareKnob
                      value={deckA.eqHigh.value}
                      onChange={(val) => setDeckA(prev => ({ ...prev, eqHigh: { ...prev.eqHigh, target: val } }))}
                      size={55}
                      label="HI"
                      showValue={false}
                      showCenterDetent={true}
                    />
                    <div className="eq-led" style={{ opacity: deckA.eqHigh.value !== 50 ? 1 : 0.3 }} />
                  </div>

                  <div className="flex items-center gap-2">
                    <HardwareKnob
                      value={deckA.eqMid.value}
                      onChange={(val) => setDeckA(prev => ({ ...prev, eqMid: { ...prev.eqMid, target: val } }))}
                      size={55}
                      label="MID"
                      showValue={false}
                      showCenterDetent={true}
                    />
                    <div className="eq-led" style={{ opacity: deckA.eqMid.value !== 50 ? 1 : 0.3 }} />
                </div>

                  <div className="flex items-center gap-2">
                    <HardwareKnob
                      value={deckA.eqLow.value}
                      onChange={(val) => setDeckA(prev => ({ ...prev, eqLow: { ...prev.eqLow, target: val } }))}
                      size={55}
                      label="LOW"
                      showValue={false}
                      showCenterDetent={true}
                    />
                    <div className="eq-led" style={{ opacity: deckA.eqLow.value !== 50 ? 1 : 0.3 }} />
                    </div>
              </div>

                {/* CHANNEL FADER */}
                <div className="flex flex-col items-center mt-auto">
                  <div className="hw-fader-track w-8 h-[100px] relative">
                    <div
                      className="hw-fader-cap absolute w-[30px] h-[12px] left-1/2 transform -translate-x-1/2 cursor-pointer"
                      style={{
                        top: `${100 - deckA.fader.value}%`,
                        transform: `translateX(-50%) translateY(-50%)`,
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startY = e.clientY;
                        const startValue = deckA.fader.value;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const deltaY = startY - moveEvent.clientY;
                          const newValue = Math.max(0, Math.min(100, startValue + (deltaY / 100) * 100));
                          setDeckA(prev => ({ ...prev, fader: { ...prev.fader, target: newValue } }));
                        };
                        
                        const handleMouseUp = () => {
                          window.removeEventListener('mousemove', handleMouseMove);
                          window.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                    </div>
                  <span className="hw-label mt-2">VOLUME</span>
                </div>
                      </div>

              {/* CENTER SECTION - VU METER & CROSSFADER */}
              <div className="flex flex-col items-center justify-between py-3">
                {/* VU METERS */}
                <div className="flex gap-6">
                  <VUMeter level={deckA.vuLevel} channelLabel="A" />
                  <VUMeter level={deckB.vuLevel} channelLabel="B" />
                </div>

                {/* CROSSFADER SECTION */}
                <div className="flex flex-col items-center gap-2 mt-auto">
                  <span className="hw-label">CROSSFADER</span>
                  
                  {/* Crossfader Curve Buttons */}
                  <div className="flex gap-1 mb-2">
                    {["SMOOTH", "FAST", "CUT"].map((curve) => (
                  <button
                        key={curve}
                        className="hw-mode-button inactive text-[8px] px-2 py-0.5"
                    >
                        {curve}
                    </button>
                    ))}
                      </div>
                  
                  <div className="flex items-center gap-3 w-full justify-center">
                    <span className="hw-value text-sm">A</span>
                    
                    {/* Crossfader Track */}
                    <div className="hw-crossfader-track w-[200px] h-6 relative">
                      <div
                        className="hw-crossfader-cap absolute w-[40px] h-5 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        style={{
                          left: `${crossfader.value}%`,
                          transform: `translateX(-50%) translateY(-50%)`,
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const startX = e.clientX;
                          const startValue = crossfader.value;
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            const deltaX = moveEvent.clientX - startX;
                            const newValue = Math.max(0, Math.min(100, startValue + (deltaX / 200) * 100));
                            setCrossfader({ value: newValue, target: newValue });
                          };
                          
                          const handleMouseUp = () => {
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          window.addEventListener('mousemove', handleMouseMove);
                          window.addEventListener('mouseup', handleMouseUp);
                        }}
                      />
                    </div>

                    <span className="hw-value text-sm">B</span>
                  </div>
                </div>
              </div>

              {/* CHANNEL B - RIGHT STRIP */}
              <div className="channel-strip p-3 rounded flex flex-col">
                <span className="hw-label text-center mb-3">CHANNEL B</span>
                
                {/* GAIN KNOB */}
                <div className="flex justify-center mb-4">
                  <HardwareKnob
                    value={deckB.gain.value}
                    onChange={(val) => setDeckB(prev => ({ ...prev, gain: { ...prev.gain, target: val } }))}
                    size={70}
                    label="GAIN"
                    showValue={true}
                  />
                </div>

                {/* 3-BAND EQ - VERTICAL */}
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <HardwareKnob
                      value={deckB.eqHigh.value}
                      onChange={(val) => setDeckB(prev => ({ ...prev, eqHigh: { ...prev.eqHigh, target: val } }))}
                      size={55}
                      label="HI"
                      showValue={false}
                      showCenterDetent={true}
                    />
                    <div className="eq-led" style={{ opacity: deckB.eqHigh.value !== 50 ? 1 : 0.3 }} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <HardwareKnob
                      value={deckB.eqMid.value}
                      onChange={(val) => setDeckB(prev => ({ ...prev, eqMid: { ...prev.eqMid, target: val } }))}
                      size={55}
                      label="MID"
                      showValue={false}
                      showCenterDetent={true}
                    />
                    <div className="eq-led" style={{ opacity: deckB.eqMid.value !== 50 ? 1 : 0.3 }} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <HardwareKnob
                      value={deckB.eqLow.value}
                      onChange={(val) => setDeckB(prev => ({ ...prev, eqLow: { ...prev.eqLow, target: val } }))}
                      size={55}
                      label="LOW"
                      showValue={false}
                      showCenterDetent={true}
                    />
                    <div className="eq-led" style={{ opacity: deckB.eqLow.value !== 50 ? 1 : 0.3 }} />
                  </div>
                </div>

                {/* CHANNEL FADER */}
                <div className="flex flex-col items-center mt-auto">
                  <div className="hw-fader-track w-8 h-[100px] relative">
                    <div
                      className="hw-fader-cap absolute w-[30px] h-[12px] left-1/2 transform -translate-x-1/2 cursor-pointer"
                      style={{
                        top: `${100 - deckB.fader.value}%`,
                        transform: `translateX(-50%) translateY(-50%)`,
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startY = e.clientY;
                        const startValue = deckB.fader.value;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const deltaY = startY - moveEvent.clientY;
                          const newValue = Math.max(0, Math.min(100, startValue + (deltaY / 100) * 100));
                          setDeckB(prev => ({ ...prev, fader: { ...prev.fader, target: newValue } }));
                        };
                        
                        const handleMouseUp = () => {
                          window.removeEventListener('mousemove', handleMouseMove);
                          window.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  </div>
                  <span className="hw-label mt-2">VOLUME</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download Confirmation Dialog */}
      <AlertDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <AlertDialogContent className="bg-[#18181b] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-lg">Download Track</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 mt-2">
              {trackToDownload && (
                <>
                  <p className="mb-3">
                    This will cost <strong className="text-orange-400">1 credit</strong>. You have <strong className={credits < 5 ? "text-orange-400" : "text-white"}>{credits} credits</strong> remaining.
                  </p>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-sm font-semibold text-white">{trackToDownload.title}</p>
                    <p className="text-xs text-white/60 mt-1">{trackToDownload.artist}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                      <span>{trackToDownload.bpm} BPM</span>
                      <span>•</span>
                      <span>{trackToDownload.key}</span>
                    </div>
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    onClick={() => {
                setDownloadDialogOpen(false);
                setTrackToDownload(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDownload}
              className="bg-primary hover:bg-primary/80 text-white"
            >
              Download (1 credit)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
