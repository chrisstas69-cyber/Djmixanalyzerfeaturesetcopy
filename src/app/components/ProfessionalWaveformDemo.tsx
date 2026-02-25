import React, { useState, useEffect } from 'react';
import { ProfessionalWaveformView } from './ProfessionalWaveformView';
import { ArrowLeft } from 'lucide-react';

interface ProfessionalWaveformDemoProps {
  onBack?: () => void;
}

export function ProfessionalWaveformDemo({ onBack }: ProfessionalWaveformDemoProps) {
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [currentTime1, setCurrentTime1] = useState(3);
  const [currentTime2, setCurrentTime2] = useState(45);
  const [tempo1, setTempo1] = useState(0);

  // Simulate playback for demo 1
  useEffect(() => {
    if (isPlaying1) {
      const interval = setInterval(() => {
        setCurrentTime1(prev => {
          if (prev >= 444) return 0;
          return prev + 0.5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying1]);

  // Simulate playback for demo 2
  useEffect(() => {
    if (isPlaying2) {
      const interval = setInterval(() => {
        setCurrentTime2(prev => {
          if (prev >= 408) return 0;
          return prev + 0.5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying2]);

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl text-[var(--text-primary)]">Professional Waveform View</h1>
          <p className="text-[var(--text-secondary)]">Professional DJ-grade waveform visualization</p>
        </div>

        {/* Full Display Section */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl text-[var(--text-primary)]">Full Display</h2>
            <span className="text-sm text-[var(--text-tertiary)]">Bottom player with full controls</span>
          </div>
          
          <ProfessionalWaveformView
            mode="full"
            bpm={128}
            musicalKey="4A"
            keyNotation="A minor"
            currentTime={currentTime1}
            totalTime={444}
            isPlaying={isPlaying1}
            tempo={tempo1}
            onPlay={() => setIsPlaying1(true)}
            onPause={() => setIsPlaying1(false)}
            onPrevious={() => {
              setCurrentTime1(0);
              setIsPlaying1(false);
            }}
            onNext={() => {
              setCurrentTime1(0);
              setIsPlaying1(false);
            }}
            onLoop={() => console.log('Loop toggled')}
            onSync={() => console.log('Sync activated')}
            onTempoChange={(value) => setTempo1(value)}
            onTempoReset={() => setTempo1(0)}
            onSeek={(position) => setCurrentTime1(position * 444)}
            onCueJump={(cue) => {
              setCurrentTime1(cue.position * 444);
              console.log(`Jumped to ${cue.label}`);
            }}
          />
        </div>

        {/* Compact Display Section */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl text-[var(--text-primary)]">Compact Display</h2>
            <span className="text-sm text-[var(--text-tertiary)]">Track card version</span>
          </div>
          
          <div className="space-y-3">
            <ProfessionalWaveformView
              mode="compact"
              bpm={128}
              musicalKey="6A"
              currentTime={currentTime2}
              totalTime={408}
              isPlaying={isPlaying2}
              onPlay={() => setIsPlaying2(true)}
              onPause={() => setIsPlaying2(false)}
              onSeek={(position) => setCurrentTime2(position * 408)}
            />

            <ProfessionalWaveformView
              mode="compact"
              bpm={132}
              musicalKey="8A"
              currentTime={125}
              totalTime={395}
              isPlaying={false}
              onPlay={() => console.log('Play track 2')}
              onPause={() => console.log('Pause track 2')}
            />

            <ProfessionalWaveformView
              mode="compact"
              bpm={124}
              musicalKey="5A"
              currentTime={67}
              totalTime={442}
              isPlaying={false}
              onPlay={() => console.log('Play track 3')}
              onPause={() => console.log('Pause track 3')}
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2">
            <h3 className="text-[var(--text-primary)] font-medium">Full Display Features</h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-1 list-disc list-inside">
              <li>BPM, Key, Time, and Remaining time display</li>
              <li>Tempo control with percentage display</li>
              <li>Full-width waveform with 120px height</li>
              <li>Color-coded sections (orange for intro/breakdown)</li>
              <li>4 color-coded cue points (Red, Green, Yellow, Blue)</li>
              <li>Playhead with smooth animation</li>
              <li>Transport controls (Play, Pause, Previous, Next)</li>
              <li>Loop and Sync buttons</li>
              <li>Clickable cue buttons for instant jumping</li>
              <li>Click waveform to seek</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-[var(--text-primary)] font-medium">Compact Display Features</h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-1 list-disc list-inside">
              <li>40px height mini waveform</li>
              <li>Play/Pause button on left</li>
              <li>Time counter (current / total)</li>
              <li>BPM and Key display</li>
              <li>Same cue points (scaled down)</li>
              <li>Clickable waveform for seeking</li>
              <li>Perfect for track lists</li>
            </ul>
          </div>
        </div>

        {/* Color Legend */}
        <div className="space-y-3 pt-8 border-t border-[var(--border-subtle)]">
          <h3 className="text-[var(--text-primary)] font-medium">Cue Point Colors</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#ff4444]" />
              <span className="text-sm text-[var(--text-secondary)]">Red - Intro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#44ff44]" />
              <span className="text-sm text-[var(--text-secondary)]">Green - Drop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#ffff44]" />
              <span className="text-sm text-[var(--text-secondary)]">Yellow - Breakdown</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#4444ff]" />
              <span className="text-sm text-[var(--text-secondary)]">Blue - Outro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}