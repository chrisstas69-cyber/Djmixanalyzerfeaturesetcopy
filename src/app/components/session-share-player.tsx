import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Repeat } from "lucide-react";

type Version = "A" | "B" | "C";

export function SessionSharePlayer() {
  const [activeVersion, setActiveVersion] = useState<Version>("A");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(372);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);

  const versions = {
    A: { title: "Midnight Grooves Extended Mix", artist: "DJ Shadow" },
    B: { title: "Midnight Grooves (Hypnotic Edit)", artist: "DJ Shadow" },
    C: { title: "Midnight Grooves (Peak Hour)", artist: "DJ Shadow" },
  };

  // Playback simulation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return duration;
            }
          }
          return prev + 0.1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, isLooping]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    setCurrentTime(percent * duration);
  };

  const handleVersionChange = (version: Version) => {
    setActiveVersion(version);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Generate waveform
  const generateRealisticWaveform = (bars: number) => {
    const data = [];
    for (let i = 0; i < bars; i++) {
      const kickPosition = i % 64;
      const isKick = kickPosition === 0 || kickPosition === 16 || kickPosition === 32 || kickPosition === 48;
      const kickAmp = isKick ? 0.4 : 0;
      const bassPhase = Math.sin(i / 8) * 0.3;
      const midFreq = Math.sin(i / 4) * 0.15 + Math.sin(i / 2.5) * 0.1;
      const hihatPattern = i % 8 < 2 ? 0.12 : 0.05;
      const highFreq = (Math.random() - 0.5) * 0.08 + hihatPattern;
      const isSnare = kickPosition === 24 || kickPosition === 56;
      const transient = isSnare ? 0.25 : 0;
      const section = Math.floor(i / 128) % 3;
      const energyMult = section === 0 ? 0.5 : section === 1 ? 0.75 : 1.0;
      const noiseFloor = 0.05;
      const combined = (kickAmp + bassPhase + midFreq + highFreq + transient + noiseFloor) * energyMult;
      const height = Math.max(4, Math.min(100, combined * 120));
      data.push(height);
    }
    return data;
  };

  const waveformData = generateRealisticWaveform(600);
  const progress = (currentTime / duration) * 100;

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold tracking-tight text-white">Session Share Player</h1>
          <p className="text-xs text-muted-foreground">Compare three AI-generated versions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-12 bg-black flex items-center justify-center">
        <div className="w-full max-w-3xl space-y-6">
          {/* Version Toggle Tabs */}
          <div className="flex items-center gap-2 border-b border-border">
            {(["A", "B", "C"] as Version[]).map((version) => (
              <button
                key={version}
                onClick={() => handleVersionChange(version)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                  activeVersion === version
                    ? "text-primary"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                Version {version}
                {activeVersion === version && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Track Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              {versions[activeVersion].title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {versions[activeVersion].artist}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70">
              <span>Generated with</span>
              <span className="font-medium">Syntax Audio Intelligence</span>
            </div>
          </div>

          {/* Player Container */}
          <div className="border border-border bg-black p-6 space-y-6">
            {/* Waveform */}
            <div
              ref={waveformRef}
              onClick={handleSeek}
              className="h-32 bg-black border border-border overflow-hidden relative cursor-pointer group"
            >
              {/* Beat Grid */}
              <div className="absolute inset-0 flex pointer-events-none">
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

              {/* Waveform Bars */}
              <div className="absolute inset-0 flex items-center px-0.5">
                <div className="flex items-end h-full w-full gap-px">
                  {waveformData.map((height, i) => {
                    const barProgress = (i / waveformData.length) * 100;
                    const isPlayed = barProgress < progress;

                    return (
                      <div key={i} className="flex-1 h-full flex items-center">
                        <div
                          className="w-full bg-primary transition-opacity duration-300"
                          style={{
                            height: `${height}%`,
                            opacity: isPlayed ? 0.9 : 0.3,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Playhead */}
              <div
                className="absolute inset-y-0 w-px bg-white z-10 transition-opacity duration-300 opacity-90"
                style={{ left: `${progress}%` }}
              />

              {/* Hover indicator */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-black fill-black" />
                ) : (
                  <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                )}
              </button>

              {/* Time */}
              <div className="flex items-center gap-2 font-['IBM_Plex_Mono'] text-sm text-white flex-shrink-0">
                <span>{formatTime(currentTime)}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{formatTime(duration)}</span>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Loop */}
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 transition-colors flex-shrink-0 ${
                  isLooping
                    ? "text-primary hover:text-primary/80"
                    : "text-muted-foreground hover:text-white"
                }`}
                title="Loop"
              >
                <Repeat className="w-4 h-4" />
              </button>

              {/* Volume */}
              <div
                className="relative flex-shrink-0"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-muted-foreground hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Volume Slider */}
                {showVolumeSlider && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-border p-2 animate-in fade-in duration-200">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        setIsMuted(false);
                      }}
                      className="h-24 w-8 slider vertical-slider cursor-pointer"
                      style={{
                        writingMode: "bt-lr",
                        WebkitAppearance: "slider-vertical",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Microtext */}
            <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
              <p>Switch between versions to compare different AI interpretations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
