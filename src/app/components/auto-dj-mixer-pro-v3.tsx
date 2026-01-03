import { useState, useEffect, useMemo } from "react";
import { Slider } from "./ui/slider";
import { Volume2, Radio, Waves, Zap, ArrowRightLeft, Eye, Play, Pause, Music2, X, Download, Coins, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { CircularKnob } from "./circular-knob";
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
    <div className="h-full flex bg-[#1a1a1a]">
      {/* LEFT SIDEBAR - Track Selection (250px) */}
      <div className="w-[250px] bg-[#252525] border-r border-white/5 flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">TRACK LIBRARY</h2>
            <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">{currentTracks.length}</span>
            </div>
            
          {/* Credits Display */}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-['IBM_Plex_Mono'] mb-3 ${
            credits < 5 ? 'text-orange-400 bg-orange-400/10' : 'text-white/80 bg-white/5'
          }`}>
            <Coins className="w-3 h-3" />
            <span className="font-semibold">{credits}</span>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
                <button
              onClick={() => setTrackTab("dna")}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                trackTab === "dna"
                  ? "bg-[#FF7A00] text-white font-bold shadow-lg shadow-[#FF7A00]/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              DNA Tracks
                </button>
            <button
              onClick={() => setTrackTab("generated")}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                trackTab === "generated"
                  ? "bg-[#FF7A00] text-white font-bold shadow-lg shadow-[#FF7A00]/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Generated
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto">
          {currentTracks.length === 0 ? (
            <div className="p-6 text-center">
              <Music2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/60 mb-3">
                {trackTab === "dna" 
                  ? "No DNA tracks uploaded yet"
                  : "No generated tracks yet"}
              </p>
              <button className="text-xs text-primary hover:text-primary/80 underline">
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
                      ? "bg-[#FF7A00]/20 border-[#FF7A00] shadow-lg shadow-[#FF7A00]/20"
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
                        <span className="text-[9px] text-white/50 font-['IBM_Plex_Mono']">{track.bpm}</span>
                        <span className="text-[9px] text-white/50">•</span>
                        <span className="text-[9px] text-white/50 font-['IBM_Plex_Mono']">{track.key}</span>
        </div>
                    </div>
                      </div>
                      </div>
              ))}
                    </div>
          )}
                  </div>
                </div>

      {/* RIGHT SIDE: Professional Mixer - Skeuomorphic Hardware Design */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        {/* Professional DJ Mixer Interface - Realistic Hardware Aesthetic */}
        <div className="flex-1 overflow-auto p-6">
          <div className="w-full max-w-[2000px] mx-auto">
            {/* Top Section: Auto DJ Mixer Controls */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Auto DJ Mixer</h1>
                  <p className="text-xs text-white/50 font-['IBM_Plex_Mono'] uppercase tracking-wider">PROFESSIONAL AUTONOMOUS SYSTEM</p>
                </div>
                {/* Mix Style Buttons */}
                <div className="flex gap-2">
                  {(["smooth", "club", "hypnotic", "aggressive"] as MixStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setMixStyle(style)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all font-['IBM_Plex_Mono'] ${
                        mixStyle === style
                          ? "bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/30"
                          : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              {/* Beatmatching Status Bar */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 flex items-center gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_#22c55e]" />
                <span className="text-sm text-white/80 font-['IBM_Plex_Mono']">{statusMessage}</span>
              </div>
            </div>

            {/* Main Mixer Layout: Real DJ Hardware Style - Skeuomorphic Design */}
            <div 
              className="space-y-6 bg-[#1a1a1a] rounded-lg p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.1)]"
              style={{
                background: 'linear-gradient(135deg, #1f1f1f 0%, #1a1a1a 50%, #151515 100%)',
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
              {/* Deck A Section - Top to Bottom Layout */}
              <div className="grid grid-cols-[1fr_300px_1fr] gap-6">
                {/* DECK A - Orange Accents */}
                <div className={`space-y-4 transition-all ${
                  dragOverDeck === "A" ? "ring-2 ring-[#FF7A00]" : ""
                }`}>
                  {/* Track Info Box with Waveform - At Top */}
                  <div className="bg-[#1a1a1a] border-2 border-[#FF7A00]/30 rounded-lg p-4 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#FF7A00] rounded flex items-center justify-center shadow-lg shadow-[#FF7A00]/50">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white truncate">{deckA.currentTrack}</h3>
                        <p className="text-xs text-white/70 truncate">{deckA.artist}</p>
                  {deckA.bpm > 0 && (
                          <p className="text-xs text-white/60 font-['IBM_Plex_Mono'] mt-1">
                            {deckA.bpm} BPM • {deckA.key} {deckA.energy ? `• ${deckA.energy}` : ""}
                          </p>
                      )}
                </div>
                      <div className="text-xs text-[#FF7A00] font-['IBM_Plex_Mono'] font-bold">
                        {deckA.barsRemaining} bars
              </div>
                    </div>
                    {/* Mini Waveform in Track Box - Inset Screen Look */}
                    <div className="h-16 bg-[#050505] rounded-md border-b border-[#333] p-1.5 relative overflow-hidden shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]">
                      <div className="absolute inset-0 flex items-center gap-0.5">
                        {Array.from({ length: 80 }, (_, i) => {
                          const height = Math.random() * 60 + 15;
                          return (
                            <div
                              key={i}
                              className="flex-1 rounded-sm"
                              style={{
                                height: `${height}%`,
                                backgroundColor: deckA.playing ? "#FF7A00" : "#FF7A0040",
                                boxShadow: deckA.playing ? `0 0 2px #FF7A00` : "none",
                              }}
                            />
                          );
                        })}
                    </div>
                    </div>
                      </div>

                  {/* Large Prominent Waveform - Inset Screen */}
                  <div className="w-full h-[140px] bg-[#050505] rounded-md border-b border-[#333] p-3 relative overflow-hidden shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(0,0,0,0.8)]">
                    <div className="absolute inset-0 flex items-center gap-0.5">
                      {Array.from({ length: 200 }, (_, i) => {
                        const height = Math.random() * 85 + 15;
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-sm transition-all"
                            style={{
                              height: `${height}%`,
                              backgroundColor: deckA.playing ? "#FF7A00" : "#FF7A0040",
                              boxShadow: deckA.playing ? `0 0 4px #FF7A00, 0 0 8px #FF7A0040` : "none",
                            }}
                          />
                        );
                      })}
                      </div>
                    {deckA.playing && (
                      <div className="absolute inset-0 flex items-center pointer-events-none">
                        <div className="w-1 h-full bg-[#FF7A00] opacity-90 shadow-lg shadow-[#FF7A00]/50" style={{ left: `${waveformScrollA}%` }} />
                    </div>
                  )}
                </div>

                  {/* Mixer Controls Section - CHANNEL A - Realistic Hardware */}
                  <div className="bg-[#1a1a1a] border-2 border-white/10 rounded-lg p-6 shadow-xl">
                    <div className="text-center mb-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['IBM_Plex_Mono']">CHANNEL A</h4>
                    </div>
                    
                    <div className="space-y-6">
                      {/* GAIN Knob - Large */}
                      <div className="flex justify-center">
                  <CircularKnob
                    value={deckA.gain.value}
                    onChange={(val) => setDeckA(prev => ({ ...prev, gain: { ...prev.gain, target: val } }))}
                    size={90}
                          color="#FF7A00"
                    label="GAIN"
                    min={0}
                    max={100}
                  />
                  </div>

                      {/* EQ Section - Three Knobs with Toggle Buttons */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* HI */}
                        <div className="flex flex-col items-center space-y-2">
                          <CircularKnob
                            value={deckA.eqHigh.value}
                            onChange={(val) => setDeckA(prev => ({ ...prev, eqHigh: { ...prev.eqHigh, target: val } }))}
                            size={60}
                            color="#FF7A00"
                            label="HI"
                          min={0}
                          max={100}
                          />
                          <button className={`w-12 h-8 rounded border-2 text-xs font-bold font-['IBM_Plex_Mono'] transition-all ${
                            deckA.eqHigh.value !== 50 ? "bg-[#FF7A00]/20 border-[#FF7A00] text-[#FF7A00] shadow-[0_0_8px_#FF7A0040]" : "bg-white/5 border-white/10 text-white/40"
                          }`}>
                            HI
                          </button>
            </div>

                    {/* MID */}
                        <div className="flex flex-col items-center space-y-2">
                          <CircularKnob
                            value={deckA.eqMid.value}
                            onChange={(val) => setDeckA(prev => ({ ...prev, eqMid: { ...prev.eqMid, target: val } }))}
                            size={60}
                            color="#FF7A00"
                            label="MID"
                          min={0}
                          max={100}
                          />
                          <button className={`w-12 h-8 rounded border-2 text-xs font-bold font-['IBM_Plex_Mono'] transition-all ${
                            deckA.eqMid.value !== 50 ? "bg-[#FF7A00]/20 border-[#FF7A00] text-[#FF7A00] shadow-[0_0_8px_#FF7A0040]" : "bg-white/5 border-white/10 text-white/40"
                          }`}>
                            MID
                          </button>
                  </div>

                        {/* LOW */}
                        <div className="flex flex-col items-center space-y-2">
                          <CircularKnob
                            value={deckA.eqLow.value}
                            onChange={(val) => setDeckA(prev => ({ ...prev, eqLow: { ...prev.eqLow, target: val } }))}
                            size={60}
                            color="#FF7A00"
                            label="LOW"
                          min={0}
                          max={100}
                        />
                          <button className={`w-12 h-8 rounded border-2 text-xs font-bold font-['IBM_Plex_Mono'] transition-all ${
                            deckA.eqLow.value !== 50 ? "bg-[#FF7A00]/20 border-[#FF7A00] text-[#FF7A00] shadow-[0_0_8px_#FF7A0040]" : "bg-white/5 border-white/10 text-white/40"
                          }`}>
                            LOW
                          </button>
                        </div>
                        </div>

                      {/* VOLUME Fader - Realistic Metallic */}
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-xs text-white/70 uppercase font-['IBM_Plex_Mono'] font-bold">VOLUME</span>
                        {/* Fader Track - Black Slot with Deep Inset */}
                        <div className="h-40 w-10 bg-[#0a0a0a] rounded-lg p-1 relative shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(0,0,0,1)]">
                          {/* Fader Fill */}
                          <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                            <div
                              className="w-full bg-gradient-to-t from-[#FF7A00] to-[#FF7A00]/60 rounded transition-all shadow-[0_0_8px_#FF7A0040]"
                              style={{ height: `${deckA.fader.value}%` }}
                            />
                          </div>
                          {/* Fader Handle - Metallic Block */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 w-8 h-5 rounded cursor-grab active:cursor-grabbing shadow-lg"
                            style={{ 
                              bottom: `calc(${deckA.fader.value}% - 10px)`,
                              background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                              boxShadow: `
                                0 2px 4px rgba(0,0,0,0.6),
                                inset 0 1px 2px rgba(255,255,255,0.2),
                                inset 0 -1px 2px rgba(0,0,0,0.8)
                              `,
                            }}
                            onMouseDown={(e) => {
                              const handleMove = (moveEvent: MouseEvent) => {
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                if (!rect) return;
                                const y = rect.bottom - moveEvent.clientY;
                                const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
                                setDeckA(prev => ({ ...prev, fader: { ...prev.fader, target: percentage } }));
                              };
                              const handleUp = () => {
                                document.removeEventListener("mousemove", handleMove);
                                document.removeEventListener("mouseup", handleUp);
                              };
                              document.addEventListener("mousemove", handleMove);
                              document.addEventListener("mouseup", handleUp);
                            }}
                          >
                            {/* Grip Line */}
                            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-white/20 rounded" />
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>

                {/* CENTER SECTION - VU Meter and Crossfader - Realistic Hardware */}
              <div className="flex flex-col items-center justify-center space-y-8 py-8">
                  {/* VU Meter - Inset Display */}
                  <div className="w-full space-y-2">
                <div className="text-center">
                      <span className="text-xs text-white/60 uppercase font-['IBM_Plex_Mono']">VU METER</span>
                  </div>
                    <div className="h-64 w-10 bg-[#050505] border-b border-[#333] rounded-md p-1 flex flex-col-reverse gap-0.5 mx-auto shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]">
                      {Array.from({ length: 20 }, (_, i) => {
                        const level = Math.max(deckA.vuLevel, deckB.vuLevel);
                        const segmentLevel = (20 - i) * 5;
                        const isActive = level >= segmentLevel;
                        const color = segmentLevel > 80 ? "#ef4444" : segmentLevel > 60 ? "#f97316" : "#22c55e";
                        return (
                          <div
                            key={i}
                            className={`h-3 w-full rounded transition-all ${
                              isActive ? "opacity-100" : "opacity-20"
                            }`}
                            style={{ 
                              backgroundColor: isActive ? color : "#ffffff",
                              boxShadow: isActive ? `0 0 4px ${color}40` : "none",
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="text-center text-[10px] text-white/40 font-['IBM_Plex_Mono']">
                      -∞ dB
                  </div>
                </div>

                  {/* CROSSFADER - Realistic Track */}
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-base text-[#FF7A00] font-bold font-['IBM_Plex_Mono']" style={{ textShadow: '0 0 8px #FF7A0040' }}>A</span>
                      <span className="text-base text-[#9F00FF] font-bold font-['IBM_Plex_Mono']" style={{ textShadow: '0 0 8px #9F00FF40' }}>B</span>
                    </div>
                    {/* Crossfader Track - Black Slot */}
                    <div className="relative w-full h-14 bg-[#0a0a0a] rounded-lg p-2 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]">
                      {/* Gradient Background */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF7A00]/20 via-white/5 to-[#9F00FF]/20 opacity-50" />
                    <Slider
                      value={[crossfader.value]}
                      onValueChange={(val) => setCrossfader(prev => ({ ...prev, target: val[0] }))}
                      min={0}
                      max={100}
                      step={1}
                        className="w-full relative z-10"
                    />
                    </div>
                  </div>
                </div>

                {/* DECK B - Purple Accents */}
                <div className={`space-y-4 transition-all ${
                  dragOverDeck === "B" ? "ring-2 ring-[#9F00FF]" : ""
                }`}>
                  {/* Track Info Box with Waveform - At Top */}
                  <div className="bg-[#1a1a1a] border-2 border-[#9F00FF]/30 rounded-lg p-4 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#9F00FF] rounded flex items-center justify-center shadow-lg shadow-[#9F00FF]/50">
                        <span className="text-white font-bold text-sm">B</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white truncate">{deckB.currentTrack}</h3>
                        <p className="text-xs text-white/70 truncate">{deckB.artist}</p>
                        {deckB.bpm > 0 && (
                          <p className="text-xs text-white/60 font-['IBM_Plex_Mono'] mt-1">
                            {deckB.bpm} BPM • {deckB.key} {deckB.energy ? `• ${deckB.energy}` : ""}
                          </p>
                        )}
                </div>
                      <div className="text-xs text-[#9F00FF] font-['IBM_Plex_Mono'] font-bold">
                        {deckB.barsRemaining} bars
                </div>
              </div>
                    {/* Mini Waveform in Track Box - Inset Screen Look */}
                    <div className="h-16 bg-[#050505] rounded-md border-b border-[#333] p-1.5 relative overflow-hidden shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]">
                      <div className="absolute inset-0 flex items-center gap-0.5">
                        {Array.from({ length: 80 }, (_, i) => {
                          const height = Math.random() * 60 + 15;
                          return (
                            <div
                              key={i}
                              className="flex-1 rounded-sm"
                              style={{
                                height: `${height}%`,
                                backgroundColor: deckB.playing ? "#9F00FF" : "#9F00FF40",
                                boxShadow: deckB.playing ? `0 0 2px #9F00FF` : "none",
                              }}
                            />
                          );
                        })}
                        </div>
                      </div>
                  </div>

                  {/* Large Prominent Waveform - Inset Screen */}
                  <div className="w-full h-[140px] bg-[#050505] rounded-md border-b border-[#333] p-3 relative overflow-hidden shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(0,0,0,0.8)]">
                    <div className="absolute inset-0 flex items-center gap-0.5">
                      {Array.from({ length: 200 }, (_, i) => {
                        const height = Math.random() * 85 + 15;
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-sm transition-all"
                            style={{
                              height: `${height}%`,
                              backgroundColor: deckB.playing ? "#9F00FF" : "#9F00FF40",
                              boxShadow: deckB.playing ? `0 0 4px #9F00FF, 0 0 8px #9F00FF40` : "none",
                            }}
                          />
                        );
                      })}
                    </div>
                  {deckB.playing && (
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                        <div className="w-1 h-full bg-[#9F00FF] opacity-90 shadow-lg shadow-[#9F00FF]/50" style={{ left: `${waveformScrollB}%` }} />
                    </div>
                  )}
                </div>

                  {/* Mixer Controls Section - CHANNEL B - Realistic Hardware */}
                  <div className="bg-[#1a1a1a] border-2 border-white/10 rounded-lg p-6 shadow-xl">
                    <div className="text-center mb-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['IBM_Plex_Mono']">CHANNEL B</h4>
                </div>

                    <div className="space-y-6">
                      {/* GAIN Knob - Large */}
                      <div className="flex justify-center">
                  <CircularKnob
                    value={deckB.gain.value}
                    onChange={(val) => setDeckB(prev => ({ ...prev, gain: { ...prev.gain, target: val } }))}
                    size={90}
                          color="#9F00FF"
                    label="GAIN"
                    min={0}
                    max={100}
                  />
                        </div>

                      {/* EQ Section - Three Knobs with Toggle Buttons */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* HI */}
                        <div className="flex flex-col items-center space-y-2">
                          <CircularKnob
                            value={deckB.eqHigh.value}
                            onChange={(val) => setDeckB(prev => ({ ...prev, eqHigh: { ...prev.eqHigh, target: val } }))}
                            size={60}
                            color="#9F00FF"
                            label="HI"
                          min={0}
                          max={100}
                          />
                          <button className={`w-12 h-8 rounded border-2 text-xs font-bold font-['IBM_Plex_Mono'] transition-all ${
                            deckB.eqHigh.value !== 50 ? "bg-[#9F00FF]/20 border-[#9F00FF] text-[#9F00FF] shadow-[0_0_8px_#9F00FF40]" : "bg-white/5 border-white/10 text-white/40"
                          }`}>
                            HI
                          </button>
                  </div>

                    {/* MID */}
                        <div className="flex flex-col items-center space-y-2">
                          <CircularKnob
                            value={deckB.eqMid.value}
                            onChange={(val) => setDeckB(prev => ({ ...prev, eqMid: { ...prev.eqMid, target: val } }))}
                            size={60}
                            color="#9F00FF"
                            label="MID"
                          min={0}
                          max={100}
                          />
                          <button className={`w-12 h-8 rounded border-2 text-xs font-bold font-['IBM_Plex_Mono'] transition-all ${
                            deckB.eqMid.value !== 50 ? "bg-[#9F00FF]/20 border-[#9F00FF] text-[#9F00FF] shadow-[0_0_8px_#9F00FF40]" : "bg-white/5 border-white/10 text-white/40"
                          }`}>
                            MID
                          </button>
                  </div>

                        {/* LOW */}
                        <div className="flex flex-col items-center space-y-2">
                          <CircularKnob
                            value={deckB.eqLow.value}
                            onChange={(val) => setDeckB(prev => ({ ...prev, eqLow: { ...prev.eqLow, target: val } }))}
                            size={60}
                            color="#9F00FF"
                            label="LOW"
                          min={0}
                          max={100}
                        />
                          <button className={`w-12 h-8 rounded border-2 text-xs font-bold font-['IBM_Plex_Mono'] transition-all ${
                            deckB.eqLow.value !== 50 ? "bg-[#9F00FF]/20 border-[#9F00FF] text-[#9F00FF] shadow-[0_0_8px_#9F00FF40]" : "bg-white/5 border-white/10 text-white/40"
                          }`}>
                            LOW
                          </button>
                        </div>
                      </div>

                      {/* VOLUME Fader - Realistic Metallic */}
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-xs text-white/70 uppercase font-['IBM_Plex_Mono'] font-bold">VOLUME</span>
                        {/* Fader Track - Black Slot with Deep Inset */}
                        <div className="h-40 w-10 bg-[#0a0a0a] rounded-lg p-1 relative shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(0,0,0,1)]">
                          {/* Fader Fill */}
                          <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                            <div
                              className="w-full bg-gradient-to-t from-[#9F00FF] to-[#9F00FF]/60 rounded transition-all shadow-[0_0_8px_#9F00FF40]"
                              style={{ height: `${deckB.fader.value}%` }}
                            />
                          </div>
                          {/* Fader Handle - Metallic Block */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 w-8 h-5 rounded cursor-grab active:cursor-grabbing shadow-lg"
                            style={{ 
                              bottom: `calc(${deckB.fader.value}% - 10px)`,
                              background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                              boxShadow: `
                                0 2px 4px rgba(0,0,0,0.6),
                                inset 0 1px 2px rgba(255,255,255,0.2),
                                inset 0 -1px 2px rgba(0,0,0,0.8)
                              `,
                            }}
                            onMouseDown={(e) => {
                              const handleMove = (moveEvent: MouseEvent) => {
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                if (!rect) return;
                                const y = rect.bottom - moveEvent.clientY;
                                const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
                                setDeckB(prev => ({ ...prev, fader: { ...prev.fader, target: percentage } }));
                              };
                              const handleUp = () => {
                                document.removeEventListener("mousemove", handleMove);
                                document.removeEventListener("mouseup", handleUp);
                              };
                              document.addEventListener("mousemove", handleMove);
                              document.addEventListener("mouseup", handleUp);
                            }}
                          >
                            {/* Grip Line */}
                            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-white/20 rounded" />
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