import React, { useState, useEffect } from 'react';
import { WaveformDisplay } from './WaveformDisplay';
import { ArrowLeft } from 'lucide-react';

interface WaveformDemoProps {
  onBack: () => void;
}

export function WaveformDemo({ onBack }: WaveformDemoProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const duration = 444; // 7:24 in seconds

  const sampleCuePoints = [
    { id: '1', position: 15, color: 'red' as const, label: 'Intro' },
    { id: '2', position: 35, color: 'green' as const, label: 'Drop' },
    { id: '3', position: 60, color: 'yellow' as const, label: 'Break' },
    { id: '4', position: 85, color: 'blue' as const, label: 'Outro' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <div className="h-full bg-[var(--background)] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-charcoal)] sticky top-0 z-10">
        <div className="p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            CDJ-3000 Waveform Display
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Professional DJ-grade waveform visualization
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Full version */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Full Display (Bottom Player)
          </h2>
          <WaveformDisplay
            trackTitle="Nocturnal Sequence"
            bpm={128}
            musicalKey="A minor"
            camelotKey="4A"
            duration={duration}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            cuePoints={sampleCuePoints}
            variant="full"
          />
        </div>

        {/* Compact version in track card */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Compact Display (Track Card)
          </h2>
          <div className="max-w-xl">
            <WaveformDisplay
              trackTitle="Subsonic Ritual"
              bpm={126}
              musicalKey="E minor"
              camelotKey="9A"
              duration={408}
              currentTime={currentTime * 0.92}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              cuePoints={sampleCuePoints}
              variant="compact"
            />
          </div>
        </div>

        {/* Multiple track examples */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Track Library View
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Deep Sequence', bpm: 130, musicalKey: 'D minor', camelot: '7A' },
              { title: 'Analog Dreams', bpm: 124, musicalKey: 'G minor', camelot: '6A' },
              { title: 'Warehouse Echo', bpm: 132, musicalKey: 'C minor', camelot: '5A' },
            ].map((track, i) => (
              <div key={i} className="bg-[var(--surface-charcoal)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{track.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Techno • Minimal</p>
                  </div>
                </div>
                <WaveformDisplay
                  trackTitle={track.title}
                  bpm={track.bpm}
                  musicalKey={track.musicalKey}
                  camelotKey={track.camelot}
                  duration={360 + i * 30}
                  currentTime={0}
                  isPlaying={false}
                  onPlayPause={() => {}}
                  onSeek={() => {}}
                  cuePoints={[]}
                  variant="compact"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Features info */}
        <div className="bg-[var(--surface-charcoal)] rounded-lg p-6 border border-[var(--border-subtle)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            CDJ-3000 Features
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-2">Waveform Colors</h3>
              <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#0099ff]" />
                  Blue = Bass / Low frequencies
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#ff9900]" />
                  Orange = Mid frequencies
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#ffff00]" />
                  Yellow = High frequencies
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-2">Cue Points</h3>
              <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff0000]" />
                  Red = Cue 1 (Intro)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00ff00]" />
                  Green = Cue 2 (Drop)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffff00]" />
                  Yellow = Cue 3 (Break)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0099ff]" />
                  Blue = Cue 4 (Outro)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-2">Controls</h3>
              <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                <li>• Play/Pause with large center button</li>
                <li>• Previous/Next track navigation</li>
                <li>• Loop mode toggle</li>
                <li>• Tempo/pitch control (±16%)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-2">Interaction</h3>
              <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                <li>• Click waveform to scrub</li>
                <li>• Click cue points to jump</li>
                <li>• Hover for cue labels</li>
                <li>• Beat grid overlay</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}