import React, { useEffect, useRef, useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  duration: number;
  waveformData?: number[];
  cuePoints?: number[];
}

interface UnifiedMixingWaveformProps {
  deckATrack: Track | null;
  deckBTrack: Track | null;
  deckATime: number;
  deckBTime: number;
  deckAPlaying: boolean;
  deckBPlaying: boolean;
  crossfaderPosition: number; // -1 to 1, where 0 is center
  onSeekA: (time: number) => void;
  onSeekB: (time: number) => void;
}

export default function UnifiedMixingWaveform({
  deckATrack,
  deckBTrack,
  deckATime,
  deckBTime,
  deckAPlaying,
  deckBPlaying,
  crossfaderPosition,
  onSeekA,
  onSeekB
}: UnifiedMixingWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [hoveredDeck, setHoveredDeck] = useState<'A' | 'B' | null>(null);

  // Calculate opacity based on crossfader
  const deckAOpacity = crossfaderPosition <= 0 ? 1 : Math.max(0.4, 1 - crossfaderPosition);
  const deckBOpacity = crossfaderPosition >= 0 ? 1 : Math.max(0.4, 1 + crossfaderPosition);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;
    const topHeight = centerY - 2;
    const bottomHeight = centerY + 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, width, height);

    // Center line (mix point)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Determine which track to use for beat grid (use the longer one, or A if both null)
    const referenceTrack = deckATrack || deckBTrack;
    const maxDuration = referenceTrack 
      ? Math.max(deckATrack?.duration || 0, deckBTrack?.duration || 0)
      : 0;

    // Draw beat grid if we have a reference track
    if (referenceTrack && maxDuration > 0) {
      const beatsPerBar = 4;
      const totalBeats = (maxDuration / 60) * referenceTrack.bpm;
      const pixelsPerBeat = width / totalBeats;
      
      for (let i = 0; i < totalBeats; i++) {
        const x = i * pixelsPerBeat;
        if (i % beatsPerBar === 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Draw Deck A waveform (top half, pointing UP)
    if (deckATrack && deckATrack.waveformData) {
      const waveformData = deckATrack.waveformData;
      const barCount = Math.min(waveformData.length, Math.floor(width / 3));
      const barWidth = width / barCount;
      const trackProgress = deckATime / deckATrack.duration;

      ctx.globalAlpha = deckAOpacity;
      
      for (let i = 0; i < barCount; i++) {
        const amplitude = waveformData[Math.floor((i / barCount) * waveformData.length)];
        const barHeight = amplitude * (topHeight * 0.8);
        const x = i * barWidth;
        
        const progress = i / barCount;
        const isPast = progress <= trackProgress;

        // Orange gradient based on position
        let barColor = '#f97316';
        if (progress < 0.2) {
          barColor = '#dc2626';
        } else if (progress > 0.8) {
          barColor = '#fbbf24';
        }

        ctx.fillStyle = isPast ? barColor : 'rgba(249, 115, 22, 0.3)';
        ctx.fillRect(x, centerY - barHeight - 2, Math.max(1, barWidth - 0.5), barHeight);
      }

      // Draw Deck A playhead
      if (deckATrack.duration > 0) {
        const playheadX = (deckATime / deckATrack.duration) * width;
        
        // Playhead glow
        if (deckAPlaying) {
          const gradient = ctx.createRadialGradient(playheadX, topHeight / 2, 0, playheadX, topHeight / 2, 20);
          gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
          gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(playheadX - 20, 0, 40, topHeight);
        }

        // Playhead line
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, centerY - 2);
        ctx.stroke();

        // Playhead handle
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(playheadX, 8, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Deck A cue points
      if (deckATrack.cuePoints && deckATrack.cuePoints.length > 0) {
        deckATrack.cuePoints.forEach((cueTime) => {
          const cueX = (cueTime / deckATrack.duration) * width;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(cueX, 0);
          ctx.lineTo(cueX - 4, 8);
          ctx.lineTo(cueX + 4, 8);
          ctx.closePath();
          ctx.fill();
          
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cueX, 8);
          ctx.lineTo(cueX, centerY - 2);
          ctx.stroke();
        });
      }

      ctx.globalAlpha = 1;
    }

    // Draw Deck B waveform (bottom half, pointing DOWN)
    if (deckBTrack && deckBTrack.waveformData) {
      const waveformData = deckBTrack.waveformData;
      const barCount = Math.min(waveformData.length, Math.floor(width / 3));
      const barWidth = width / barCount;
      const trackProgress = deckBTime / deckBTrack.duration;

      ctx.globalAlpha = deckBOpacity;
      
      for (let i = 0; i < barCount; i++) {
        const amplitude = waveformData[Math.floor((i / barCount) * waveformData.length)];
        const barHeight = amplitude * ((height - bottomHeight) * 0.8);
        const x = i * barWidth;
        
        const progress = i / barCount;
        const isPast = progress <= trackProgress;

        // Cyan gradient based on position
        let barColor = '#06b6d4';
        if (progress < 0.2) {
          barColor = '#3b82f6';
        } else if (progress > 0.8) {
          barColor = '#22d3ee';
        }

        ctx.fillStyle = isPast ? barColor : 'rgba(6, 182, 212, 0.3)';
        ctx.fillRect(x, bottomHeight + 2, Math.max(1, barWidth - 0.5), barHeight);
      }

      // Draw Deck B playhead
      if (deckBTrack.duration > 0) {
        const playheadX = (deckBTime / deckBTrack.duration) * width;
        
        // Playhead glow
        if (deckBPlaying) {
          const gradient = ctx.createRadialGradient(playheadX, centerY + (height - centerY) / 2, 0, playheadX, centerY + (height - centerY) / 2, 20);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(playheadX - 20, bottomHeight, 40, height - bottomHeight);
        }

        // Playhead line
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, bottomHeight + 2);
        ctx.lineTo(playheadX, height);
        ctx.stroke();

        // Playhead handle
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(playheadX, height - 8, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Deck B cue points
      if (deckBTrack.cuePoints && deckBTrack.cuePoints.length > 0) {
        deckBTrack.cuePoints.forEach((cueTime) => {
          const cueX = (cueTime / deckBTrack.duration) * width;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(cueX, height);
          ctx.lineTo(cueX - 4, height - 8);
          ctx.lineTo(cueX + 4, height - 8);
          ctx.closePath();
          ctx.fill();
          
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cueX, height - 8);
          ctx.lineTo(cueX, bottomHeight + 2);
          ctx.stroke();
        });
      }

      ctx.globalAlpha = 1;
    }

    // Draw mix zone indicator (crossfade area)
    if (crossfaderPosition !== 0) {
      const fadeWidth = Math.abs(crossfaderPosition) * 50;
      ctx.fillStyle = crossfaderPosition > 0 
        ? 'rgba(249, 115, 22, 0.15)' 
        : 'rgba(6, 182, 212, 0.15)';
      ctx.fillRect(0, centerY - fadeWidth, width, fadeWidth * 2);
    }

  }, [deckATrack, deckBTrack, deckATime, deckBTime, deckAPlaying, deckBPlaying, crossfaderPosition, deckAOpacity, deckBOpacity]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const x = e.clientX - rect.left;
    const clickedDeck = y < rect.height / 2 ? 'A' : 'B';
    
    const progress = x / rect.width;
    
    if (clickedDeck === 'A' && deckATrack) {
      const newTime = progress * deckATrack.duration;
      onSeekA(newTime);
    } else if (clickedDeck === 'B' && deckBTrack) {
      const newTime = progress * deckBTrack.duration;
      onSeekB(newTime);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const x = e.clientX - rect.left;
    const hoverDeck = y < rect.height / 2 ? 'A' : 'B';
    
    setHoveredDeck(hoverDeck);
    const progress = x / rect.width;
    
    if (hoverDeck === 'A' && deckATrack) {
      setHoveredTime(progress * deckATrack.duration);
    } else if (hoverDeck === 'B' && deckBTrack) {
      setHoveredTime(progress * deckBTrack.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Waveform header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 rounded-t-lg border border-gray-800 border-b-0">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Deck A info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs text-white font-semibold truncate">
              {deckATrack ? `${deckATrack.title} - ${deckATrack.artist}` : 'No Track Loaded'}
            </span>
            {deckATrack && (
              <>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400 font-mono">
                  {formatTime(deckATime)} / {formatTime(deckATrack.duration)}
                </span>
                <span className="text-xs text-orange-400 font-mono ml-auto">{deckATrack.bpm} BPM</span>
              </>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-700" />

          {/* Deck B info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="text-xs text-white font-semibold truncate">
              {deckBTrack ? `${deckBTrack.title} - ${deckBTrack.artist}` : 'No Track Loaded'}
            </span>
            {deckBTrack && (
              <>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400 font-mono">
                  {formatTime(deckBTime)} / {formatTime(deckBTrack.duration)}
                </span>
                <span className="text-xs text-cyan-400 font-mono ml-auto">{deckBTrack.bpm} BPM</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Waveform canvas */}
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredTime(null);
          setHoveredDeck(null);
        }}
        className="relative h-[300px] bg-black/40 rounded-b-lg cursor-pointer overflow-hidden border border-gray-800 border-t-0"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Hover time indicator */}
        {hoveredTime !== null && hoveredDeck && (
          <div
            className={`absolute bottom-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-mono pointer-events-none ${
              hoveredDeck === 'A' ? 'text-orange-400' : 'text-cyan-400'
            }`}
            style={{
              left: `${((hoveredDeck === 'A' && deckATrack ? hoveredTime / deckATrack.duration : 
                          hoveredDeck === 'B' && deckBTrack ? hoveredTime / deckBTrack.duration : 0) * 100)}%`,
              transform: 'translateX(-50%)',
              bottom: hoveredDeck === 'A' ? 'auto' : '8px',
              top: hoveredDeck === 'A' ? '8px' : 'auto'
            }}
          >
            {formatTime(hoveredTime)}
          </div>
        )}

        {/* Mix point label */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/60 px-2 py-1 rounded text-xs text-gray-400 font-semibold pointer-events-none">
          MIX POINT
        </div>
      </div>
    </div>
  );
}
