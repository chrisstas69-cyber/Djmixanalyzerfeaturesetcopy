import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WaveformSection {
  type: 'intro' | 'buildup' | 'drop' | 'breakdown' | 'outro';
  startTime: number;
  endTime: number;
  color: string;
}

interface CDJWaveformProps {
  duration?: number; // Total duration in seconds
  currentTime?: number; // Current playback position
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  showSections?: boolean;
  showControls?: boolean;
  height?: number;
  sections?: WaveformSection[];
  className?: string;
}

export function CDJWaveform({
  duration = 240,
  currentTime = 0,
  isPlaying = false,
  onSeek,
  showSections = true,
  showControls = false,
  height = 180,
  sections = [
    { type: 'intro', startTime: 0, endTime: 30, color: '#3b82f6' },
    { type: 'buildup', startTime: 30, endTime: 90, color: '#22c55e' },
    { type: 'drop', startTime: 90, endTime: 150, color: '#ff6b35' },
    { type: 'breakdown', startTime: 150, endTime: 210, color: '#22c55e' },
    { type: 'outro', startTime: 210, endTime: 240, color: '#3b82f6' },
  ],
  className = ''
}: CDJWaveformProps) {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Generate ultra-realistic waveform data (CDJ-3000 quality)
  const generateWaveformData = () => {
    const dataPoints = 800; // Ultra high resolution for smoothness
    const data: Array<{ amplitude: number; color: string; frequency: 'low' | 'mid' | 'high' }> = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const time = (i / dataPoints) * duration;
      const section = sections.find(s => time >= s.startTime && time < s.endTime);
      
      // Determine base amplitude based on section
      let baseAmplitude = 0.5;
      let frequencyBias: 'low' | 'mid' | 'high' = 'mid';
      
      if (section?.type === 'intro' || section?.type === 'outro') {
        baseAmplitude = 0.25 + (Math.random() * 0.2);
        frequencyBias = 'low';
      } else if (section?.type === 'buildup') {
        const progress = (time - section.startTime) / (section.endTime - section.startTime);
        baseAmplitude = 0.3 + (progress * 0.5) + (Math.random() * 0.2);
        frequencyBias = progress > 0.7 ? 'high' : 'mid';
      } else if (section?.type === 'drop') {
        baseAmplitude = 0.75 + (Math.random() * 0.25);
        frequencyBias = 'high';
      } else if (section?.type === 'breakdown') {
        baseAmplitude = 0.35 + (Math.random() * 0.25);
        frequencyBias = 'mid';
      }
      
      // Add realistic variations (kick drums every 4 beats at 128 BPM)
      const bpm = 128;
      const beatDuration = 60 / bpm;
      const beatPosition = (time % beatDuration) / beatDuration;
      
      // Kick drum simulation (every beat)
      if (beatPosition < 0.1) {
        baseAmplitude = Math.max(baseAmplitude, 0.8);
        frequencyBias = 'low';
      }
      
      // Hi-hat simulation (offbeat)
      if (beatPosition > 0.4 && beatPosition < 0.5) {
        if (section?.type === 'drop') {
          baseAmplitude = Math.max(baseAmplitude, 0.6);
          frequencyBias = 'high';
        }
      }
      
      // Add micro variations for realism
      const microVariation = Math.sin(i * 0.3) * 0.08;
      const randomVariation = (Math.random() - 0.5) * 0.12;
      
      const finalAmplitude = Math.max(0.05, Math.min(1, baseAmplitude + microVariation + randomVariation));
      
      // Determine color based on frequency and amplitude
      let color = '#3b82f6'; // Default blue (low)
      
      if (frequencyBias === 'high' || finalAmplitude > 0.7) {
        // High frequency or energy peaks = orange to red
        color = finalAmplitude > 0.85 ? '#ef4444' : '#ff6b35';
      } else if (frequencyBias === 'mid' || (finalAmplitude > 0.4 && finalAmplitude <= 0.7)) {
        // Mid frequency = green to yellow
        color = finalAmplitude > 0.55 ? '#eab308' : '#22c55e';
      } else {
        // Low frequency = blue to cyan
        color = finalAmplitude > 0.35 ? '#06b6d4' : '#3b82f6';
      }
      
      data.push({
        amplitude: finalAmplitude,
        color,
        frequency: frequencyBias
      });
    }
    
    return data;
  };

  const waveformData = generateWaveformData();

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || !onSeek) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const seekTime = percentage * duration;
    onSeek(seekTime);
  };

  const handleWaveformHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setHoverTime(percentage * duration);
    setHoverX(x);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = currentTime / duration;

  return (
    <div className={`relative ${className}`}>
      {/* Section Markers - Above Waveform */}
      {showSections && (
        <div className="relative h-7 mb-2 flex items-center">
          {sections.map((section, idx) => {
            const left = (section.startTime / duration) * 100;
            const width = ((section.endTime - section.startTime) / duration) * 100;
            return (
              <div
                key={idx}
                className="absolute text-xs font-semibold uppercase tracking-wide"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                }}
              >
                <div
                  className="inline-block px-2 py-1 rounded"
                  style={{
                    backgroundColor: `${section.color}20`,
                    color: section.color,
                    border: `1px solid ${section.color}40`
                  }}
                >
                  {section.type}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Waveform Container */}
      <div
        ref={waveformRef}
        className="relative bg-[#0a0a0a] rounded-lg overflow-hidden cursor-pointer"
        style={{ height: `${height}px` }}
        onClick={handleWaveformClick}
        onMouseMove={handleWaveformHover}
        onMouseLeave={() => setHoverTime(null)}
      >
        {/* Beat Grid Lines - Every 30 seconds */}
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
          {Array.from({ length: Math.ceil(duration / 30) + 1 }).map((_, i) => {
            const x = (i * 30 / duration) * 100;
            return (
              <line
                key={i}
                x1={`${x}%`}
                y1="0"
                x2={`${x}%`}
                y2="100%"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Center Line (CDJ-3000 style) */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 z-10" />

        {/* Waveform Bars - Ultra Detailed */}
        <div className="absolute inset-0 flex items-center px-1">
          {waveformData.map((point, index) => {
            const isPassed = (index / waveformData.length) <= progress;
            const barHeight = point.amplitude * (height * 0.42); // Max 42% of total height (leaves room for center line)
            const barOpacity = isPassed ? 1 : 0.5;
            
            return (
              <div
                key={index}
                className="flex-1 relative"
                style={{
                  minWidth: '1px',
                  maxWidth: '3px',
                }}
              >
                {/* Top Half (Mirrored) */}
                <motion.div
                  className="absolute bottom-1/2 w-full rounded-t-sm"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: point.color,
                    opacity: barOpacity,
                    filter: isPassed 
                      ? `drop-shadow(0 0 ${point.amplitude > 0.7 ? 3 : 1}px ${point.color})` 
                      : 'none',
                  }}
                  animate={isPassed && isPlaying && point.amplitude > 0.7 ? {
                    filter: [
                      `drop-shadow(0 0 2px ${point.color})`,
                      `drop-shadow(0 0 4px ${point.color})`,
                      `drop-shadow(0 0 2px ${point.color})`
                    ]
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isPassed && isPlaying && point.amplitude > 0.7 ? Infinity : 0,
                    ease: 'easeInOut'
                  }}
                />
                
                {/* Bottom Half (Mirrored) */}
                <motion.div
                  className="absolute top-1/2 w-full rounded-b-sm"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: point.color,
                    opacity: barOpacity,
                    filter: isPassed 
                      ? `drop-shadow(0 0 ${point.amplitude > 0.7 ? 3 : 1}px ${point.color})` 
                      : 'none',
                  }}
                  animate={isPassed && isPlaying && point.amplitude > 0.7 ? {
                    filter: [
                      `drop-shadow(0 0 2px ${point.color})`,
                      `drop-shadow(0 0 4px ${point.color})`,
                      `drop-shadow(0 0 2px ${point.color})`
                    ]
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isPassed && isPlaying && point.amplitude > 0.7 ? Infinity : 0,
                    ease: 'easeInOut'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Playback Indicator (Needle) - CDJ-3000 Style */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 z-20"
          style={{
            left: `${progress * 100}%`,
            background: 'linear-gradient(to bottom, #ff6b35 0%, #ff6b35 100%)',
            boxShadow: '0 0 10px #ff6b35, 0 0 20px #ff6b3580, 0 0 30px #ff6b3540'
          }}
          animate={isPlaying ? {
            opacity: [1, 0.8, 1],
            boxShadow: [
              '0 0 10px #ff6b35, 0 0 20px #ff6b3580, 0 0 30px #ff6b3540',
              '0 0 15px #ff6b35, 0 0 30px #ff6b3580, 0 0 45px #ff6b3540',
              '0 0 10px #ff6b35, 0 0 20px #ff6b3580, 0 0 30px #ff6b3540'
            ]
          } : {}}
          transition={{
            duration: 1,
            repeat: isPlaying ? Infinity : 0,
            ease: 'easeInOut'
          }}
        />

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoverTime !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute px-3 py-1.5 bg-white text-black text-xs font-bold rounded shadow-lg pointer-events-none z-30"
              style={{
                left: `${hoverX}px`,
                top: '-40px',
                transform: 'translateX(-50%)'
              }}
            >
              {formatTime(hoverTime)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Time Markers - Below Waveform */}
      <div className="relative h-5 flex items-center mt-1">
        {Array.from({ length: Math.ceil(duration / 30) + 1 }).map((_, i) => {
          const time = i * 30;
          if (time > duration) return null;
          return (
            <div
              key={i}
              className="absolute text-xs text-gray-500 font-mono"
              style={{
                left: `${(time / duration) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {formatTime(time)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
