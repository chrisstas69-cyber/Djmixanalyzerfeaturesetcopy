import { useState, useEffect } from "react";
import { Play, Pause, Download } from "lucide-react";

interface SharePlayerProps {
  trackTitle: string;
  trackArtist: string;
  version?: "A" | "B" | "C";
  duration: number; // in seconds
  waveformData: WaveformData;
  isOwner?: boolean;
  onExport?: () => void;
  hasActiveDNA?: boolean;
}

interface WaveformData {
  amplitudes: number[];
  bass: number[];
  mids: number[];
  highs: number[];
}

export function SharePlayer({
  trackTitle,
  trackArtist,
  version,
  duration,
  waveformData,
  isOwner = false,
  onExport,
  hasActiveDNA = false,
}: SharePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timeElapsed = formatTime(currentTime);
  const timeRemaining = `-${formatTime(duration - currentTime)}`;
  const progress = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Metadata */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">
            {trackTitle}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-sm">{trackArtist}</span>
            {version && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-xs font-['IBM_Plex_Mono'] uppercase">
                  Version {version}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Waveform */}
        <div className="relative mb-6">
          <div
            className="w-full cursor-pointer relative"
            onClick={handleWaveformClick}
          >
            <ColorfulWaveform data={waveformData} progress={progress} />
          </div>

          {/* Progress overlay */}
          <div
            className="absolute top-0 left-0 h-full bg-black/40 pointer-events-none"
            style={{ width: `${100 - progress}%`, right: 0, left: "auto" }}
          />

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* DNA Attribution - Subtle, under waveform */}
        {hasActiveDNA && (
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground">
              Mixed using the creator's DNA.
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          {/* Time Elapsed */}
          <div className="text-sm font-['IBM_Plex_Mono'] text-white/70 tabular-nums min-w-[48px]">
            {timeElapsed}
          </div>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black fill-black" />
            ) : (
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            )}
          </button>

          {/* Time Remaining */}
          <div className="text-sm font-['IBM_Plex_Mono'] text-white/70 tabular-nums min-w-[48px] text-right">
            {timeRemaining}
          </div>
        </div>

        {/* Owner Export Button */}
        {isOwner && onExport && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onExport}
              className="px-4 py-2 border border-border hover:bg-muted transition-colors text-sm text-white/80 hover:text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Track</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Colorful Waveform Component (Rekordbox-style)
function ColorfulWaveform({
  data,
  progress,
}: {
  data: WaveformData;
  progress: number;
}) {
  const width = 1000;
  const height = 120;
  const barWidth = width / data.amplitudes.length;
  const maxBarHeight = height;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
      {data.amplitudes.map((_, i) => {
        const x = i * barWidth;
        const barProgress = (i / data.amplitudes.length) * 100;
        const isPast = barProgress <= progress;

        // Multi-band colorful waveform
        const bassHeight = data.bass[i] * maxBarHeight;
        const midsHeight = data.mids[i] * maxBarHeight;
        const highsHeight = data.highs[i] * maxBarHeight;

        const totalHeight = Math.max(bassHeight, midsHeight, highsHeight);
        const y = (height - totalHeight) / 2;

        const opacity = isPast ? 1 : 0.3;

        return (
          <g key={i}>
            {/* Bass layer (blue) */}
            <rect
              x={x}
              y={y + (totalHeight - bassHeight)}
              width={Math.max(1, barWidth - 0.5)}
              height={bassHeight}
              fill="#3B82F6"
              opacity={opacity * 0.85}
            />

            {/* Mids layer (green) */}
            <rect
              x={x}
              y={y + (totalHeight - midsHeight)}
              width={Math.max(1, barWidth - 0.5)}
              height={midsHeight}
              fill="#10B981"
              opacity={opacity * 0.8}
            />

            {/* Highs layer (yellow/orange) */}
            <rect
              x={x}
              y={y}
              width={Math.max(1, barWidth - 0.5)}
              height={highsHeight}
              fill="#F59E0B"
              opacity={opacity * 0.75}
            />
          </g>
        );
      })}
    </svg>
  );
}

// Helper to generate waveform data (for demo)
export function generateWaveformData(): WaveformData {
  const samples = 200;
  const amplitudes: number[] = [];
  const bass: number[] = [];
  const mids: number[] = [];
  const highs: number[] = [];

  for (let i = 0; i < samples; i++) {
    const position = i / samples;
    let amplitude = 0.3;

    // Overall amplitude envelope
    if (position < 0.15) {
      amplitude = 0.2 + (position / 0.15) * 0.3;
    } else if (position < 0.3) {
      amplitude = 0.5 + ((position - 0.15) / 0.15) * 0.3;
    } else if (position < 0.6) {
      amplitude = 0.8 + Math.random() * 0.2;
    } else if (position < 0.75) {
      amplitude = 0.8 - ((position - 0.6) / 0.15) * 0.5;
    } else if (position < 0.85) {
      amplitude = 0.3 + ((position - 0.75) / 0.1) * 0.5;
    } else {
      amplitude = 0.8 - ((position - 0.85) / 0.15) * 0.6;
    }

    amplitude += (Math.random() - 0.5) * 0.15;
    amplitude = Math.max(0.05, Math.min(1, amplitude));

    // Generate frequency bands
    let bassAmp = amplitude * (0.6 + Math.random() * 0.4);
    if (position > 0.3 && position < 0.6) bassAmp *= 1.2;

    let midsAmp = amplitude * (0.5 + Math.random() * 0.3);
    let highsAmp = amplitude * (0.3 + Math.random() * 0.4);
    if (Math.random() > 0.85) highsAmp *= 1.5;

    amplitudes.push(amplitude);
    bass.push(Math.max(0.05, Math.min(1, bassAmp)));
    mids.push(Math.max(0.05, Math.min(1, midsAmp)));
    highs.push(Math.max(0.05, Math.min(1, highsAmp)));
  }

  return { amplitudes, bass, mids, highs };
}