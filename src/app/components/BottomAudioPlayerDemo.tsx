import React, { useState, useEffect } from 'react';
import { BottomAudioPlayer } from './BottomAudioPlayer';
import { ProfessionalWaveformView } from './ProfessionalWaveformView';
import { ArrowLeft } from 'lucide-react';

interface BottomAudioPlayerDemoProps {
  onBack?: () => void;
}

export function BottomAudioPlayerDemo({ onBack }: BottomAudioPlayerDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(31);
  const [volume, setVolume] = useState(0.75);
  const [isLooping, setIsLooping] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullWaveform, setShowFullWaveform] = useState(false);

  const totalTime = 444; // 7:24

  // Simulate playback
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalTime) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return totalTime;
          }
          return prev + 0.5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isLooping, totalTime]);

  return (
    <div className="min-h-screen bg-[var(--background)] pb-[100px]">
      {/* Demo Content */}
      <div className="p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl text-[var(--text-primary)]">Bottom Audio Player</h1>
            <p className="text-[var(--text-secondary)]">
              Full-width sticky player with waveform visualization
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3">
              <h3 className="text-lg text-[var(--text-primary)] font-semibold">Waveform Features</h3>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
                <li>Full-width horizontal waveform (50px height)</li>
                <li>Color-coded amplitude (orange for loud, gray for quiet)</li>
                <li>4 colored cue point markers (red, green, yellow, blue)</li>
                <li>Orange playhead with smooth animation</li>
                <li>Click anywhere to scrub/seek</li>
                <li>Hover to preview time position</li>
                <li>Click cue points to jump instantly</li>
              </ul>
            </div>

            <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3">
              <h3 className="text-lg text-[var(--text-primary)] font-semibold">Control Features</h3>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
                <li>Album art thumbnail (40px × 40px)</li>
                <li>Track name, BPM, Key, and Genre display</li>
                <li>Transport controls (Previous, Play/Pause, Next)</li>
                <li>Current time and total duration</li>
                <li>Volume slider with hover expansion</li>
                <li>Loop, Favorite, and More Options buttons</li>
                <li>Open Waveform View button (full display)</li>
              </ul>
            </div>

            <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3">
              <h3 className="text-lg text-[var(--text-primary)] font-semibold">Layout Details</h3>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
                <li>Fixed to bottom of screen (always visible)</li>
                <li>Full width (100vw)</li>
                <li>Total height: 100px (2 rows × 50px)</li>
                <li>Top row: Waveform visualization</li>
                <li>Bottom row: Controls and info</li>
                <li>Dark theme (#0a0a0a background)</li>
                <li>Orange accent (#ff6b35)</li>
                <li>Smooth hover interactions</li>
              </ul>
            </div>

            <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3">
              <h3 className="text-lg text-[var(--text-primary)] font-semibold">Interactions</h3>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
                <li>Click waveform to seek to position</li>
                <li>Hover waveform to see time preview</li>
                <li>Click cue markers to jump</li>
                <li>Play/Pause with spacebar (when focused)</li>
                <li>Volume slider expands on hover</li>
                <li>Mute/unmute with volume button</li>
                <li>Toggle loop and favorite states</li>
                <li>Open full waveform view modal</li>
              </ul>
            </div>
          </div>

          {/* Current State */}
          <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold mb-4">Current Player State</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff6b35]">
                  {isPlaying ? 'Playing' : 'Paused'}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff6b35]">
                  {Math.round(volume * 100)}%
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff6b35]">
                  {isLooping ? 'On' : 'Off'}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Loop</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff6b35]">
                  {isFavorite ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Favorite</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#ff6b35]/10 border border-[#ff6b35]/20 rounded-xl p-6">
            <h3 className="text-lg text-[#ff6b35] font-semibold mb-3">How to Use</h3>
            <ol className="text-sm text-[var(--text-secondary)] space-y-2 list-decimal list-inside">
              <li>The audio player is fixed to the bottom of your screen</li>
              <li>Click the Play button to start playback</li>
              <li>Click anywhere on the waveform to seek to that position</li>
              <li>Hover over the waveform to preview time positions</li>
              <li>Click colored cue point markers to jump to key moments</li>
              <li>Use Previous/Next buttons to change tracks</li>
              <li>Hover over the volume icon to expand the slider</li>
              <li>Click Loop button to enable continuous playback</li>
              <li>Click Star button to mark as favorite</li>
              <li>Click Maximize button to open full waveform view</li>
            </ol>
          </div>

          {/* Cue Points Legend */}
          <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold mb-4">Cue Points</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ff4444]" />
                <span className="text-sm text-[var(--text-secondary)]">Intro (0:53)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#44ff44]" />
                <span className="text-sm text-[var(--text-secondary)]">Drop (2:35)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ffff44]" />
                <span className="text-sm text-[var(--text-secondary)]">Breakdown (4:48)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#4444ff]" />
                <span className="text-sm text-[var(--text-secondary)]">Outro (6:18)</span>
              </div>
            </div>
          </div>

          {/* Sample Content (to show scrolling) */}
          <div className="space-y-4">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold">Sample Content</h3>
            <p className="text-[var(--text-secondary)]">
              Scroll down to see how the bottom player remains fixed to the bottom of the screen
              while the content scrolls behind it. This is a common pattern in music streaming apps
              like Spotify, Apple Music, and YouTube Music.
            </p>
            
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6">
                <h4 className="text-[var(--text-primary)] font-semibold mb-2">
                  Track {i + 1}
                </h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  {128 + i} BPM • {['Techno', 'House', 'Minimal', 'Deep House'][i % 4]} • 6:45
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Audio Player (Fixed) */}
      <BottomAudioPlayer
        trackTitle="Deep Techno Journey"
        bpm={128}
        musicalKey="4A"
        genre="Techno"
        currentTime={currentTime}
        totalTime={totalTime}
        isPlaying={isPlaying}
        volume={volume}
        isLooping={isLooping}
        isFavorite={isFavorite}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onPrevious={() => {
          setCurrentTime(0);
          console.log('Previous track');
        }}
        onNext={() => {
          setCurrentTime(0);
          console.log('Next track');
        }}
        onSeek={(position) => setCurrentTime(position * totalTime)}
        onVolumeChange={(newVolume) => setVolume(newVolume)}
        onToggleLoop={() => setIsLooping(!isLooping)}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
        onOpenWaveformView={() => setShowFullWaveform(true)}
        onMoreOptions={() => console.log('More options')}
      />

      {/* Full Waveform View Modal */}
      {showFullWaveform && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl">
            <ProfessionalWaveformView
              mode="full"
              bpm={128}
              musicalKey="4A"
              keyNotation="A minor"
              currentTime={currentTime}
              totalTime={totalTime}
              isPlaying={isPlaying}
              tempo={0}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onPrevious={() => setCurrentTime(0)}
              onNext={() => setCurrentTime(0)}
              onLoop={() => setIsLooping(!isLooping)}
              onSync={() => console.log('Sync')}
              onTempoChange={(value) => console.log('Tempo:', value)}
              onTempoReset={() => console.log('Reset tempo')}
              onSeek={(position) => setCurrentTime(position * totalTime)}
              onCueJump={(cue) => setCurrentTime(cue.position * totalTime)}
            />
            <button
              onClick={() => setShowFullWaveform(false)}
              className="mt-4 w-full px-6 py-3 bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] rounded-lg text-[var(--text-secondary)] font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
