import { useState, useEffect } from "react";
import { GripVertical, Lock, Check } from "lucide-react";

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

interface MixTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  status: "completed" | "playing" | "next" | "queued";
  locked: boolean;
}

export function AutoDJMixerPro() {
  const [crossfader, setCrossfader] = useState({ value: 20, target: 20 });
  const [waveformScrollA, setWaveformScrollA] = useState(0);
  const [waveformScrollB, setWaveformScrollB] = useState(0);
  const [transitionCountdown, setTransitionCountdown] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [deckA, setDeckA] = useState<DeckState>({
    gain: { value: 75, target: 75 },
    eqHigh: { value: 50, target: 50 },
    eqMid: { value: 50, target: 50 },
    eqLow: { value: 50, target: 50 },
    fader: { value: 85, target: 85 },
    timeRemaining: "-01:42",
    currentTrack: "Hypnotic Groove - Underground Mix",
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
    currentTrack: "Warehouse Nights - Extended",
    playing: false,
    active: false,
  });

  const [mixCrate, setMixCrate] = useState<MixTrack[]>([
    {
      id: "1",
      title: "Midnight Grooves",
      artist: "DJ Shadow",
      bpm: 126,
      key: "Am",
      duration: "6:42",
      status: "completed",
      locked: false,
    },
    {
      id: "2",
      title: "Hypnotic Groove",
      artist: "Underground Mix",
      bpm: 126,
      key: "Am",
      duration: "7:20",
      status: "playing",
      locked: false,
    },
    {
      id: "3",
      title: "Warehouse Nights",
      artist: "Extended",
      bpm: 128,
      key: "Fm",
      duration: "6:30",
      status: "next",
      locked: false,
    },
    {
      id: "4",
      title: "Deep House Vibes",
      artist: "Soulful Sessions",
      bpm: 124,
      key: "Dm",
      duration: "5:58",
      status: "queued",
      locked: false,
    },
    {
      id: "5",
      title: "Rolling Bassline",
      artist: "Low Frequency",
      bpm: 127,
      key: "Gm",
      duration: "6:30",
      status: "queued",
      locked: true,
    },
    {
      id: "6",
      title: "Peak Time Energy",
      artist: "Night Shift",
      bpm: 130,
      key: "Em",
      duration: "7:02",
      status: "queued",
      locked: false,
    },
  ]);

  const [draggedTrack, setDraggedTrack] = useState<number | null>(null);

  // Smooth automation with slower easing for human feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCrossfader((prev) => {
        const diff = prev.target - prev.value;
        if (Math.abs(diff) < 0.1) return prev;
        // Slower easing for 4-6 second transitions
        return { ...prev, value: prev.value + diff * 0.015 };
      });

      setDeckA((prev) => ({
        ...prev,
        gain: smoothKnob(prev.gain, 0.02),
        eqHigh: smoothKnob(prev.eqHigh, 0.015),
        eqMid: smoothKnob(prev.eqMid, 0.015),
        eqLow: smoothKnob(prev.eqLow, 0.015),
        fader: smoothFader(prev.fader, 0.02),
      }));

      setDeckB((prev) => ({
        ...prev,
        gain: smoothKnob(prev.gain, 0.02),
        eqHigh: smoothKnob(prev.eqHigh, 0.015),
        eqMid: smoothKnob(prev.eqMid, 0.015),
        eqLow: smoothKnob(prev.eqLow, 0.015),
        fader: smoothFader(prev.fader, 0.02),
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Waveform scrolling - faster for active deck
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (deckA.playing) {
        setWaveformScrollA((prev) => (prev + (deckA.active ? 0.8 : 0.3)) % 100);
      }
      if (deckB.playing) {
        setWaveformScrollB((prev) => (prev + (deckB.active ? 0.8 : 0.3)) % 100);
      }
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [deckA.playing, deckB.playing, deckA.active, deckB.active]);

  // Professional automation behavior - slower, more intentional
  useEffect(() => {
    const automationInterval = setInterval(() => {
      const now = Date.now();
      const cycle = (now / 18000) % 1; // Slower 18-second cycle

      // Transition phase detection
      if (cycle > 0.7 && cycle < 0.9 && !isTransitioning) {
        // Start transition
        setIsTransitioning(true);
        setTransitionCountdown(8);

        // Gradual crossfade
        setCrossfader((prev) => ({ ...prev, target: 70 + Math.random() * 10 }));
        
        // Bring in next deck
        setDeckB((prev) => ({ 
          ...prev, 
          playing: true,
          fader: { ...prev.fader, target: 75 + Math.random() * 10 },
          eqLow: { ...prev.eqLow, target: 45 + Math.random() * 10 },
        }));

        // Reduce outgoing deck
        setDeckA((prev) => ({
          ...prev,
          fader: { ...prev.fader, target: 20 + Math.random() * 10 },
          eqHigh: { ...prev.eqHigh, target: 30 + Math.random() * 10 },
        }));
      } else if (cycle > 0.9 || cycle < 0.1) {
        // Complete transition
        if (isTransitioning) {
          setIsTransitioning(false);
          setTransitionCountdown(null);
          
          // Switch active states
          setDeckA((prev) => ({ ...prev, active: false }));
          setDeckB((prev) => ({ ...prev, active: true }));
        }
      } else if (cycle > 0.3 && cycle < 0.5) {
        // Stable mixing phase
        setCrossfader((prev) => ({ ...prev, target: 25 + Math.random() * 10 }));
        
        setDeckA((prev) => ({
          ...prev,
          active: true,
          fader: { ...prev.fader, target: 80 + Math.random() * 8 },
        }));
        
        setDeckB((prev) => ({
          ...prev,
          active: false,
          fader: { ...prev.fader, target: 15 + Math.random() * 8 },
        }));
      }

      // Subtle EQ movements (calm, professional)
      const eqCycle = (now / 12000) % 1;
      
      setDeckA((prev) => ({
        ...prev,
        eqHigh: { ...prev.eqHigh, target: 48 + Math.sin(eqCycle * Math.PI * 2) * 8 },
        eqMid: { ...prev.eqMid, target: 50 + Math.cos(eqCycle * Math.PI * 1.5) * 6 },
        eqLow: { ...prev.eqLow, target: 52 + Math.sin(eqCycle * Math.PI * 3) * 10 },
        gain: { ...prev.gain, target: 74 + Math.random() * 4 },
      }));

      setDeckB((prev) => ({
        ...prev,
        eqHigh: { ...prev.eqHigh, target: 50 + Math.sin(eqCycle * Math.PI * 2 + 1) * 8 },
        eqMid: { ...prev.eqMid, target: 51 + Math.cos(eqCycle * Math.PI * 1.5 + 0.5) * 6 },
        eqLow: { ...prev.eqLow, target: 54 + Math.sin(eqCycle * Math.PI * 3 + 2) * 9 },
        gain: { ...prev.gain, target: 72 + Math.random() * 4 },
      }));
    }, 1000);

    return () => clearInterval(automationInterval);
  }, [isTransitioning]);

  // Transition countdown
  useEffect(() => {
    if (transitionCountdown !== null && transitionCountdown > 0) {
      const timer = setTimeout(() => {
        setTransitionCountdown(transitionCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [transitionCountdown]);

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

  // Generate realistic waveform data
  const generateRealisticWaveform = (deckId: "A" | "B", bars: number) => {
    const data = [];
    for (let i = 0; i < bars; i++) {
      const bassFreq = Math.sin(i / 12) * 0.35;
      const bassKick = i % 16 < 2 ? 0.25 : 0;
      const midFreq = Math.sin(i / 6) * 0.2 + Math.sin(i / 3.5) * 0.15;
      const highFreq = (Math.random() - 0.5) * 0.08 + Math.sin(i / 1.8) * 0.06;
      const transient = i % 8 === 0 ? Math.random() * 0.15 : 0;
      const section = Math.floor(i / 64) % 3;
      const energyMult = section === 0 ? 0.6 : section === 1 ? 0.85 : 1.0;
      const noiseFloor = 0.08;
      const combined = (bassFreq + bassKick + midFreq + highFreq + transient + noiseFloor) * energyMult;
      const height = Math.max(8, Math.min(100, combined * 100));
      data.push(height);
    }
    return data;
  };

  const waveformBarsA = generateRealisticWaveform("A", 300);
  const waveformBarsB = generateRealisticWaveform("B", 300);

  const handleDragStart = (index: number, track: MixTrack) => {
    if (track.status === "completed" || track.status === "playing" || track.status === "next" || track.locked) {
      return;
    }
    setDraggedTrack(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTrack === null || draggedTrack === index) return;

    const targetTrack = mixCrate[index];
    if (targetTrack.status !== "queued") return;

    const newCrate = [...mixCrate];
    const draggedItem = newCrate[draggedTrack];
    newCrate.splice(draggedTrack, 1);
    newCrate.splice(index, 0, draggedItem);
    setMixCrate(newCrate);
    setDraggedTrack(index);
  };

  const handleDragEnd = () => {
    setDraggedTrack(null);
  };

  const generateMiniWaveform = () => {
    return Array.from({ length: 40 }, () => Math.random() * 100);
  };

  return (
    <div className="h-full flex bg-[#0a0a0f]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold tracking-tight mb-0.5">Auto DJ Mixer</h1>
            <p className="text-xs text-white/40">Professional autonomous mixing system</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="max-w-6xl mx-auto">
            {/* System Status */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs text-white/70">
                  System is mixing — you're watching the performance
                </span>
              </div>
              
              {/* Transition Countdown */}
              {transitionCountdown !== null && transitionCountdown > 0 && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30">
                  <span className="text-xs text-primary font-['IBM_Plex_Mono']">
                    Transitioning in {transitionCountdown}s
                  </span>
                </div>
              )}
            </div>

            {/* Waveforms Section */}
            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-xl mb-4">
              {/* Deck A Waveform */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-semibold transition-all ${
                      deckA.active
                        ? "bg-gradient-to-br from-secondary/30 to-secondary/10 border-secondary/30 text-secondary"
                        : "bg-white/5 border-white/20 text-white/40"
                    }`}>
                      A
                    </div>
                    <div>
                      <div className={`text-xs font-medium transition-opacity ${
                        deckA.active ? "text-white/90" : "text-white/50"
                      }`}>
                        {deckA.currentTrack}
                      </div>
                    </div>
                  </div>
                  <div className={`font-['IBM_Plex_Mono'] text-sm font-medium transition-opacity ${
                    deckA.active ? "text-secondary" : "text-white/40"
                  }`}>
                    {deckA.timeRemaining}
                  </div>
                </div>

                <div className={`h-16 bg-black/80 border rounded-xl overflow-hidden relative transition-all ${
                  deckA.active ? "border-white/[0.12]" : "border-white/5"
                }`}>
                  <div className="absolute inset-0 flex">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r"
                        style={{
                          borderColor: i % 16 === 15 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                          borderRightWidth: i % 16 === 15 ? "1.5px" : "1px",
                        }}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="flex items-end h-full"
                      style={{
                        transform: `translateX(-${waveformScrollA}%)`,
                        width: "200%",
                      }}
                    >
                      {waveformBarsA.concat(waveformBarsA).map((height, i) => (
                        <div key={i} className="flex-1 h-full flex items-center">
                          <div
                            className="w-full bg-secondary transition-opacity duration-500"
                            style={{ 
                              height: `${height}%`,
                              opacity: deckA.active ? 0.85 : 0.35,
                              boxShadow: deckA.active ? "0 0 4px rgba(237, 137, 54, 0.3)" : "none"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`absolute inset-y-0 left-1/2 w-px bg-white z-10 transition-all ${
                    deckA.active ? "shadow-lg shadow-white/30" : "opacity-30"
                  }`} />

                  <div className="absolute top-0 inset-x-0 flex justify-around px-4">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-px h-1 transition-opacity ${
                          deckA.active ? "bg-secondary/50" : "bg-secondary/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Deck B Waveform */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-semibold transition-all ${
                      deckB.active
                        ? "bg-gradient-to-br from-primary/30 to-primary/10 border-primary/30 text-primary"
                        : "bg-white/5 border-white/20 text-white/40"
                    }`}>
                      B
                    </div>
                    <div>
                      <div className={`text-xs font-medium transition-opacity ${
                        deckB.active ? "text-white/90" : "text-white/50"
                      }`}>
                        {deckB.currentTrack}
                      </div>
                    </div>
                  </div>
                  <div className={`font-['IBM_Plex_Mono'] text-sm font-medium transition-opacity ${
                    deckB.active ? "text-primary" : "text-white/40"
                  }`}>
                    {deckB.timeRemaining}
                  </div>
                </div>

                <div className={`h-16 bg-black/80 border rounded-xl overflow-hidden relative transition-all ${
                  deckB.active ? "border-white/[0.12]" : "border-white/5"
                }`}>
                  <div className="absolute inset-0 flex">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r"
                        style={{
                          borderColor: i % 16 === 15 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                          borderRightWidth: i % 16 === 15 ? "1.5px" : "1px",
                        }}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="flex items-end h-full"
                      style={{
                        transform: `translateX(-${waveformScrollB}%)`,
                        width: "200%",
                      }}
                    >
                      {waveformBarsB.concat(waveformBarsB).map((height, i) => (
                        <div key={i} className="flex-1 h-full flex items-center">
                          <div
                            className="w-full bg-primary transition-opacity duration-500"
                            style={{ 
                              height: `${height}%`,
                              opacity: deckB.active ? 0.85 : 0.35,
                              boxShadow: deckB.active ? "0 0 4px rgba(168, 85, 247, 0.3)" : "none"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`absolute inset-y-0 left-1/2 w-px bg-white z-10 transition-all ${
                    deckB.active ? "shadow-lg shadow-white/30" : "opacity-30"
                  }`} />

                  <div className="absolute top-0 inset-x-0 flex justify-around px-4">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-px h-1 transition-opacity ${
                          deckB.active ? "bg-primary/50" : "bg-primary/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DJ Mixer Section */}
            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-6 max-w-4xl mx-auto">
                {/* Channel A */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20">
                      <span className="text-xs font-semibold text-secondary">Channel A</span>
                    </div>
                  </div>

                  {/* Gain Knob */}
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1.5 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Gain
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/20 shadow-inner" />
                        <div
                          className="absolute inset-1.5 rounded-full bg-gradient-to-br from-secondary/30 to-black/50 border border-secondary/40 shadow-lg transition-transform duration-100"
                          style={{
                            transform: `rotate(${(deckA.gain.value / 100) * 270 - 135}deg)`,
                          }}
                        >
                          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white rounded-full" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-['IBM_Plex_Mono'] text-white/60">
                            {Math.round(deckA.gain.value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EQ Section */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Hi", value: deckA.eqHigh.value },
                      { label: "Mid", value: deckA.eqMid.value },
                      { label: "Low", value: deckA.eqLow.value },
                    ].map((eq) => (
                      <div key={eq.label}>
                        <label className="block text-[10px] text-white/50 mb-1.5 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                          {eq.label}
                        </label>
                        <div className="flex justify-center">
                          <div className="relative w-11 h-11">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/20 shadow-inner" />
                            <div
                              className="absolute inset-1 rounded-full bg-gradient-to-br from-secondary/20 to-black/50 border border-secondary/30 shadow-lg transition-transform duration-100"
                              style={{
                                transform: `rotate(${(eq.value / 100) * 270 - 135}deg)`,
                              }}
                            >
                              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/80 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Volume Fader */}
                  <div>
                    <label className="block text-[10px] text-white/50 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-10 h-36">
                        <div className="absolute inset-x-0 top-3 bottom-3 bg-gradient-to-b from-white/5 to-white/10 border border-white/20 rounded-full shadow-inner" />
                        <div
                          className="absolute inset-x-0 h-6 bg-gradient-to-b from-secondary/60 to-secondary/40 border border-secondary/50 rounded-lg shadow-xl transition-all duration-100"
                          style={{
                            top: `${12 + (100 - deckA.fader.value) * 1.2}px`,
                          }}
                        >
                          <div className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 h-px bg-white/30" />
                          <div className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 mt-0.5 h-px bg-white/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center - Crossfader */}
                <div className="flex flex-col items-center justify-end pb-4">
                  <label className="block text-[10px] text-white/50 mb-3 font-['IBM_Plex_Mono'] uppercase tracking-wider">
                    Crossfader
                  </label>
                  <div className="relative w-48 h-12">
                    <div className="absolute inset-y-0 left-3 right-3 top-1/2 -translate-y-1/2 h-3 bg-gradient-to-r from-secondary/10 via-white/5 to-primary/10 border border-white/20 rounded-full shadow-inner" />
                    <div
                      className="absolute top-0 w-10 h-12 bg-gradient-to-b from-white/20 to-white/10 border border-white/30 rounded-xl shadow-2xl transition-all duration-100"
                      style={{
                        left: `${12 + (crossfader.value / 100) * 140}px`,
                      }}
                    >
                      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 space-y-0.5">
                        <div className="h-px bg-white/40" />
                        <div className="h-px bg-white/40" />
                        <div className="h-px bg-white/40" />
                      </div>
                    </div>
                    <div className="absolute -top-5 left-0 text-[10px] text-secondary font-['IBM_Plex_Mono']">A</div>
                    <div className="absolute -top-5 right-0 text-[10px] text-primary font-['IBM_Plex_Mono']">B</div>
                  </div>
                </div>

                {/* Channel B */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                      <span className="text-xs font-semibold text-primary">Channel B</span>
                    </div>
                  </div>

                  {/* Gain Knob */}
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1.5 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Gain
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/20 shadow-inner" />
                        <div
                          className="absolute inset-1.5 rounded-full bg-gradient-to-br from-primary/30 to-black/50 border border-primary/40 shadow-lg transition-transform duration-100"
                          style={{
                            transform: `rotate(${(deckB.gain.value / 100) * 270 - 135}deg)`,
                          }}
                        >
                          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white rounded-full" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-['IBM_Plex_Mono'] text-white/60">
                            {Math.round(deckB.gain.value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EQ Section */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Hi", value: deckB.eqHigh.value },
                      { label: "Mid", value: deckB.eqMid.value },
                      { label: "Low", value: deckB.eqLow.value },
                    ].map((eq) => (
                      <div key={eq.label}>
                        <label className="block text-[10px] text-white/50 mb-1.5 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                          {eq.label}
                        </label>
                        <div className="flex justify-center">
                          <div className="relative w-11 h-11">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/20 shadow-inner" />
                            <div
                              className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/20 to-black/50 border border-primary/30 shadow-lg transition-transform duration-100"
                              style={{
                                transform: `rotate(${(eq.value / 100) * 270 - 135}deg)`,
                              }}
                            >
                              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/80 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Volume Fader */}
                  <div>
                    <label className="block text-[10px] text-white/50 mb-2 text-center font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Volume
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-10 h-36">
                        <div className="absolute inset-x-0 top-3 bottom-3 bg-gradient-to-b from-white/5 to-white/10 border border-white/20 rounded-full shadow-inner" />
                        <div
                          className="absolute inset-x-0 h-6 bg-gradient-to-b from-primary/60 to-primary/40 border border-primary/50 rounded-lg shadow-xl transition-all duration-100"
                          style={{
                            top: `${12 + (100 - deckB.fader.value) * 1.2}px`,
                          }}
                        >
                          <div className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 h-px bg-white/30" />
                          <div className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 mt-0.5 h-px bg-white/30" />
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

      {/* Mix Crate - Right Side Panel */}
      <div className="w-72 border-l border-white/10 bg-[#0a0a0f] flex flex-col">
        <div className="border-b border-white/5 px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold">Mix Crate</h2>
            <div className="text-xs text-white/50 font-['IBM_Plex_Mono']">
              {mixCrate.length} tracks
            </div>
          </div>
          <p className="text-xs text-white/40">Live mixing in progress</p>
        </div>

        <div className="flex-1 overflow-auto p-3 space-y-2">
          {mixCrate.map((track, index) => {
            const isDraggable = track.status === "queued" && !track.locked;
            
            return (
              <div
                key={track.id}
                draggable={isDraggable}
                onDragStart={() => handleDragStart(index, track)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative bg-gradient-to-b border rounded-xl p-2.5 transition-all ${
                  track.status === "playing"
                    ? "from-secondary/10 to-secondary/5 border-secondary/40 shadow-lg shadow-secondary/10"
                    : track.status === "next"
                    ? "from-primary/8 to-primary/4 border-primary/30 shadow-md shadow-primary/5"
                    : track.status === "completed"
                    ? "from-white/[0.02] to-transparent border-white/5 opacity-50"
                    : "from-white/[0.04] to-white/[0.01] border-white/10 hover:border-white/20"
                } ${isDraggable ? "cursor-move" : "cursor-default"} ${
                  draggedTrack === index ? "opacity-50" : ""
                }`}
              >
                {/* Drag Handle */}
                {isDraggable && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-3 h-3 text-white/30" />
                  </div>
                )}

                {/* Status Icons */}
                <div className="absolute left-2.5 top-2.5">
                  {track.status === "completed" && (
                    <Check className="w-3 h-3 text-white/40" />
                  )}
                  {track.status === "playing" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  )}
                  {track.locked && track.status === "queued" && (
                    <Lock className="w-3 h-3 text-white/30" />
                  )}
                </div>

                <div className={isDraggable ? "pl-2" : "pl-4"}>
                  {/* Track Info */}
                  <div className="mb-1.5">
                    <div className={`text-xs font-medium truncate ${
                      track.status === "completed" ? "text-white/40" : "text-white/90"
                    }`}>
                      {track.title}
                    </div>
                    <div className={`text-xs truncate ${
                      track.status === "completed" ? "text-white/30" : "text-white/50"
                    }`}>
                      {track.artist}
                    </div>
                  </div>

                  {/* Mini Waveform */}
                  {track.status !== "completed" && (
                    <div className="mb-1.5 h-5 bg-black/50 rounded overflow-hidden flex items-center gap-px px-0.5">
                      {generateMiniWaveform().map((height, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${
                            track.status === "playing"
                              ? "bg-secondary/70"
                              : track.status === "next"
                              ? "bg-primary/60"
                              : "bg-white/30"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Track Metadata */}
                  <div className={`flex items-center gap-2 text-xs font-['IBM_Plex_Mono'] ${
                    track.status === "completed" ? "text-white/30" : "text-white/50"
                  }`}>
                    <span>{track.bpm}</span>
                    <span>{track.key}</span>
                    <span>{track.duration}</span>
                  </div>

                  {/* Status Labels */}
                  {track.status === "playing" && (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/20 border border-secondary/30">
                      <span className="text-xs text-secondary font-medium">Now Playing</span>
                    </div>
                  )}
                  {track.status === "next" && (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/20 border border-primary/30">
                      <span className="text-xs text-primary font-medium">Up Next</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
