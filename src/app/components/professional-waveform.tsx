import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ProfessionalWaveformProps {
  track: {
    id: string;
    title: string;
    artist: string;
    bpm: number;
    duration: number;
    waveformData?: number[];
    cuePoints?: number[];
  } | null;
  currentTime: number;
  isPlaying: boolean;
  color: string;
  onSeek?: (time: number) => void;
  onAddCuePoint?: () => void;
  loopStart?: number | null;
  loopEnd?: number | null;
}

export default function ProfessionalWaveform({
  track,
  currentTime,
  isPlaying,
  color,
  onSeek,
  onAddCuePoint,
  loopStart,
  loopEnd
}: ProfessionalWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !track) return;

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

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // Waveform data
    const waveformData = track.waveformData || [];
    const barCount = Math.floor(waveformData.length * zoom);
    const barWidth = width / barCount;
    const centerY = height / 2;

    // Draw beat grid
    const beatsPerBar = 4;
    const totalBeats = (track.duration / 60) * track.bpm;
    const pixelsPerBeat = width / totalBeats;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
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

    // Draw loop region
    if (loopStart !== null && loopEnd !== null) {
      const loopStartX = (loopStart / track.duration) * width;
      const loopEndX = (loopEnd / track.duration) * width;
      ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.fillRect(loopStartX, 0, loopEndX - loopStartX, height);
      
      // Loop boundaries
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(loopStartX, 0);
      ctx.lineTo(loopStartX, height);
      ctx.moveTo(loopEndX, 0);
      ctx.lineTo(loopEndX, height);
      ctx.stroke();
    }

    // Draw waveform
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor(i / zoom);
      if (dataIndex >= waveformData.length) break;

      const amplitude = waveformData[dataIndex];
      const barHeight = amplitude * (height * 0.7);
      const x = i * barWidth;
      
      const progress = i / barCount;
      const currentProgress = currentTime / track.duration;
      const isPast = progress <= currentProgress;

      // Frequency-based coloring
      let barColor = color;
      if (progress < 0.2) {
        barColor = color === 'rgb(251, 146, 60)' ? '#dc2626' : '#3b82f6';
      } else if (progress > 0.8) {
        barColor = color === 'rgb(251, 146, 60)' ? '#fbbf24' : '#06b6d4';
      }

      ctx.fillStyle = isPast 
        ? barColor
        : barColor.replace('rgb', 'rgba').replace(')', ', 0.3)');

      ctx.fillRect(
        x,
        centerY - barHeight / 2,
        Math.max(1, barWidth - 0.5),
        barHeight
      );
    }

    // Draw cue points
    if (track.cuePoints && track.cuePoints.length > 0) {
      track.cuePoints.forEach((cueTime) => {
        const cueX = (cueTime / track.duration) * width;
        
        // Cue marker
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(cueX, 0);
        ctx.lineTo(cueX - 5, 10);
        ctx.lineTo(cueX + 5, 10);
        ctx.closePath();
        ctx.fill();
        
        // Cue line
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cueX, 10);
        ctx.lineTo(cueX, height);
        ctx.stroke();
      });
    }

    // Draw playhead
    const playheadX = (currentTime / track.duration) * width;
    
    // Playhead glow
    if (isPlaying) {
      const gradient = ctx.createRadialGradient(playheadX, height / 2, 0, playheadX, height / 2, 30);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(playheadX - 30, 0, 60, height);
    }

    // Playhead line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();

    // Playhead handle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(playheadX, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Time display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(playheadX - 30, height - 25, 60, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, playheadX, height - 12);

  }, [track, currentTime, isPlaying, color, zoom, loopStart, loopEnd]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !track || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const newTime = progress * track.duration;
    
    onSeek(newTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    setHoveredTime(progress * track.duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return (
      <div className="h-32 bg-black/40 rounded-lg flex items-center justify-center border border-gray-800">
        <p className="text-gray-600 text-sm">No waveform</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Waveform header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900/50 rounded-t-lg border border-gray-800 border-b-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xs text-gray-400 font-mono">
            {formatTime(currentTime)} / {formatTime(track.duration)}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-white font-semibold truncate">
            {track.title}
          </span>
          <span className="text-xs text-gray-500">-</span>
          <span className="text-xs text-gray-400 truncate">{track.artist}</span>
          <span className="text-xs text-cyan-400 font-mono ml-auto">{track.bpm} BPM</span>
        </div>
        
        {/* Zoom controls */}
        <div className="flex items-center gap-1 ml-3">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.5))}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Reset zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          {onAddCuePoint && (
            <button
              onClick={onAddCuePoint}
              className="ml-2 px-2 py-1 text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded transition-colors"
            >
              + CUE
            </button>
          )}
        </div>
      </div>

      {/* Waveform canvas */}
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredTime(null)}
        className="relative h-32 bg-black/40 rounded-b-lg cursor-pointer overflow-hidden border border-gray-800 border-t-0"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Hover time indicator */}
        {hoveredTime !== null && (
          <div
            className="absolute bottom-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-mono pointer-events-none"
            style={{
              left: `${(hoveredTime / track.duration) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {formatTime(hoveredTime)}
          </div>
        )}
      </div>
    </div>
  );
}
