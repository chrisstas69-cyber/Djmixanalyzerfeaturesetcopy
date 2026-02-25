import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, ZoomIn, ZoomOut } from 'lucide-react';
import { CDJWaveform } from './CDJWaveform';

interface WaveformSection {
  type: 'intro' | 'buildup' | 'drop' | 'breakdown' | 'outro';
  startTime: number; // in seconds
  endTime: number;
  color: string;
}

interface ProfessionalWaveformProps {
  duration?: number; // Total track duration in seconds
  trackName?: string;
  sections?: WaveformSection[];
}

export function ProfessionalWaveform({ 
  duration = 240, // 4 minutes default
  trackName = "Nocturnal Sequence",
  sections = [
    { type: 'intro', startTime: 0, endTime: 30, color: '#3b82f6' },
    { type: 'buildup', startTime: 30, endTime: 90, color: '#22c55e' },
    { type: 'drop', startTime: 90, endTime: 150, color: '#ff6b35' },
    { type: 'breakdown', startTime: 150, endTime: 210, color: '#22c55e' },
    { type: 'outro', startTime: 210, endTime: 240, color: '#3b82f6' },
  ]
}: ProfessionalWaveformProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Generate realistic waveform data based on sections
  const generateWaveformData = () => {
    const points = 500; // High resolution
    const data: number[] = [];
    
    for (let i = 0; i < points; i++) {
      const time = (i / points) * duration;
      const section = sections.find(s => time >= s.startTime && time < s.endTime);
      
      // Base amplitude based on section type
      let baseAmplitude = 0.5;
      if (section?.type === 'intro' || section?.type === 'outro') {
        baseAmplitude = 0.3 + (Math.random() * 0.2);
      } else if (section?.type === 'buildup') {
        const progress = (time - section.startTime) / (section.endTime - section.startTime);
        baseAmplitude = 0.4 + (progress * 0.4) + (Math.random() * 0.2);
      } else if (section?.type === 'drop') {
        baseAmplitude = 0.8 + (Math.random() * 0.2);
      } else if (section?.type === 'breakdown') {
        baseAmplitude = 0.4 + (Math.random() * 0.3);
      }
      
      // Add micro variations for realism
      const microVariation = Math.sin(i * 0.5) * 0.1;
      const randomVariation = (Math.random() - 0.5) * 0.15;
      
      data.push(Math.max(0.1, Math.min(1, baseAmplitude + microVariation + randomVariation)));
    }
    
    return data;
  };

  const waveformData = generateWaveformData();

  // Get color for specific time position
  const getColorForTime = (time: number, amplitude: number): string => {
    const section = sections.find(s => time >= s.startTime && time < s.endTime);
    
    // Frequency-based color coding
    if (amplitude < 0.3) {
      return '#3b82f6'; // Blue (low frequency)
    } else if (amplitude < 0.6) {
      return '#22c55e'; // Green (mid frequency)
    } else if (amplitude < 0.8) {
      return '#eab308'; // Yellow (high-mid frequency)
    } else {
      return '#ff6b35'; // Orange/Red (high frequency/peaks)
    }
  };

  // Playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + (speed * 0.1);
        if (next >= duration) {
          if (loop) {
            return 0;
          } else {
            setIsPlaying(false);
            return duration;
          }
        }
        return next;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying, duration, speed, loop]);

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
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

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const renderWaveform = () => {
    const visibleData = waveformData;
    const barWidth = 100 / visibleData.length;
    const progress = currentTime / duration;

    return (
      <div className="relative">
        {/* Section markers */}
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-2 px-4">
          {sections.map((section, idx) => {
            const left = (section.startTime / duration) * 100;
            const width = ((section.endTime - section.startTime) / duration) * 100;
            return (
              <div
                key={idx}
                className="absolute px-3 py-1 text-xs font-medium rounded-full"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: `${section.color}20`,
                  color: section.color,
                  border: `1px solid ${section.color}40`
                }}
              >
                {section.type.toUpperCase()}
              </div>
            );
          })}
        </div>

        {/* Waveform container */}
        <div
          ref={waveformRef}
          className="relative mt-12 bg-[#0a0a0a] rounded-lg overflow-hidden cursor-pointer"
          style={{ height: '180px' }}
          onClick={handleWaveformClick}
          onMouseMove={handleWaveformHover}
          onMouseLeave={() => setHoverTime(null)}
        >
          {/* Grid lines */}
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

          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-20" />

          {/* Waveform bars */}
          <div className="absolute inset-0 flex items-center">
            {visibleData.map((amplitude, index) => {
              const time = (index / visibleData.length) * duration;
              const color = getColorForTime(time, amplitude);
              const isPassed = (index / visibleData.length) <= progress;
              const barHeight = amplitude * 70; // Max 70px (half of 180px - margins)
              
              return (
                <div
                  key={index}
                  className="flex-1 relative"
                  style={{ 
                    opacity: isPassed ? 1 : 0.6,
                    filter: isPassed ? `drop-shadow(0 0 4px ${color})` : 'none'
                  }}
                >
                  {/* Top half (mirrored) */}
                  <div
                    className="absolute bottom-1/2 w-full"
                    style={{
                      height: `${barHeight}px`,
                      backgroundColor: color,
                      borderRadius: '2px 2px 0 0',
                    }}
                  />
                  {/* Bottom half (mirrored) */}
                  <div
                    className="absolute top-1/2 w-full"
                    style={{
                      height: `${barHeight}px`,
                      backgroundColor: color,
                      borderRadius: '0 0 2px 2px',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Playback indicator */}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-[#ff6b35]"
            style={{
              left: `${progress * 100}%`,
              boxShadow: '0 0 10px #ff6b35, 0 0 20px #ff6b3580'
            }}
            animate={{
              opacity: isPlaying ? [1, 0.7, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: isPlaying ? Infinity : 0,
              ease: 'easeInOut'
            }}
          />

          {/* Hover tooltip */}
          <AnimatePresence>
            {hoverTime !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute px-3 py-1 bg-white text-black text-sm font-medium rounded shadow-lg pointer-events-none"
                style={{
                  left: `${hoverX}px`,
                  top: '-35px',
                  transform: 'translateX(-50%)'
                }}
              >
                {formatTime(hoverTime)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Time markers */}
        <div className="relative h-6 flex items-center justify-between px-2 text-xs text-gray-500">
          {Array.from({ length: Math.ceil(duration / 30) + 1 }).map((_, i) => {
            const time = i * 30;
            if (time > duration) return null;
            return (
              <div key={i} className="absolute" style={{ left: `${(time / duration) * 100}%` }}>
                {formatTime(time)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Track info */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{trackName}</h2>
            <p className="text-gray-400">Syntax Audio Intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-white font-medium px-3">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Waveform */}
        {renderWaveform()}

        {/* Control bar */}
        <div className="mt-6 bg-[#0f0f0f] rounded-xl p-6">
          <div className="flex items-center justify-between">
            {/* Left: Playback controls */}
            <div className="flex items-center gap-3">
              <button className="p-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-4 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button className="p-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={() => setLoop(!loop)}
                className={`p-3 rounded-lg transition-colors ${
                  loop ? 'bg-[#ff6b35] text-white' : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => {
                    const speeds = [0.5, 0.75, 1, 1.25, 1.5];
                    const currentIndex = speeds.indexOf(speed);
                    const nextIndex = (currentIndex + 1) % speeds.length;
                    setSpeed(speeds[nextIndex]);
                  }}
                  className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white font-medium transition-colors"
                >
                  ⚡ {speed}x
                </button>
              </div>
            </div>

            {/* Center: Time display */}
            <div className="text-white font-medium text-lg">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Right: Volume control */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-white" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-32 h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${volume}%, #2a2a2a ${volume}%, #2a2a2a 100%)`
                }}
              />
              <span className="text-white font-medium w-12 text-right">{volume}%</span>
            </div>
          </div>
        </div>

        {/* Waveform legend */}
        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
            <span className="text-gray-400 text-sm">Low Freq (Bass)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-gray-400 text-sm">Mid Freq (Synths)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
            <span className="text-gray-400 text-sm">High-Mid Freq</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff6b35' }} />
            <span className="text-gray-400 text-sm">High Freq (Peaks)</span>
          </div>
        </div>
      </div>
    </div>
  );
}