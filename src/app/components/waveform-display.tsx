import React, { useEffect, useRef } from 'react';

interface WaveformDisplayProps {
  trackId: string;
  color: string;
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
}

export default function WaveformDisplay({ 
  trackId, 
  color, 
  currentTime, 
  duration,
  onSeek 
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate waveform data (in production, this would come from actual audio analysis)
  const generateWaveform = (samples: number = 200): number[] => {
    const waveform: number[] = [];
    for (let i = 0; i < samples; i++) {
      // Create varied waveform with peaks and valleys
      const base = Math.sin(i / 10) * 0.5 + 0.5;
      const noise = Math.random() * 0.3;
      waveform.push(Math.min(1, base + noise));
    }
    return waveform;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Generate waveform
    const waveform = generateWaveform(200);
    const barWidth = width / waveform.length;
    const centerY = height / 2;

    // Draw waveform bars
    waveform.forEach((amplitude, i) => {
      const x = i * barWidth;
      const barHeight = amplitude * (height * 0.8);
      
      // Determine color based on playhead position
      const progress = currentTime / duration;
      const barProgress = i / waveform.length;
      const isPastPlayhead = barProgress <= progress;

      ctx.fillStyle = isPastPlayhead 
        ? color 
        : color.replace('rgb', 'rgba').replace(')', ', 0.3)');

      // Draw bar (centered vertically)
      ctx.fillRect(
        x,
        centerY - barHeight / 2,
        Math.max(1, barWidth - 1),
        barHeight
      );
    });

    // Draw playhead
    const playheadX = (currentTime / duration) * width;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();

    // Draw playhead circle at top
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(playheadX, 8, 6, 0, Math.PI * 2);
    ctx.fill();

  }, [currentTime, duration, color, trackId]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const newTime = progress * duration;
    
    onSeek(newTime);
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleClick}
      className="relative w-full h-16 bg-black/40 rounded cursor-pointer overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
