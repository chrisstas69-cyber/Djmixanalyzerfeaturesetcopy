import React, { useState } from 'react';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { CDJWaveform } from './CDJWaveform';

interface CDJWaveformShowcaseProps {
  onBack: () => void;
}

export function CDJWaveformShowcase({ onBack }: CDJWaveformShowcaseProps) {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [trackPositions, setTrackPositions] = useState<{ [key: string]: number }>({
    track1: 45,
    track2: 120,
    track3: 200,
  });

  const tracks = [
    {
      id: 'track1',
      title: 'Nocturnal Sequence - Deep House',
      duration: 420,
      sections: [
        { type: 'intro' as const, startTime: 0, endTime: 60, color: '#3b82f6' },
        { type: 'buildup' as const, startTime: 60, endTime: 120, color: '#22c55e' },
        { type: 'drop' as const, startTime: 120, endTime: 240, color: '#ff6b35' },
        { type: 'breakdown' as const, startTime: 240, endTime: 330, color: '#22c55e' },
        { type: 'outro' as const, startTime: 330, endTime: 420, color: '#3b82f6' },
      ]
    },
    {
      id: 'track2',
      title: 'Subsonic Ritual - Techno',
      duration: 480,
      sections: [
        { type: 'intro' as const, startTime: 0, endTime: 90, color: '#3b82f6' },
        { type: 'buildup' as const, startTime: 90, endTime: 150, color: '#22c55e' },
        { type: 'drop' as const, startTime: 150, endTime: 330, color: '#ff6b35' },
        { type: 'breakdown' as const, startTime: 330, endTime: 420, color: '#22c55e' },
        { type: 'outro' as const, startTime: 420, endTime: 480, color: '#3b82f6' },
      ]
    },
    {
      id: 'track3',
      title: 'Hypnotic Elements - Progressive',
      duration: 360,
      sections: [
        { type: 'intro' as const, startTime: 0, endTime: 45, color: '#3b82f6' },
        { type: 'buildup' as const, startTime: 45, endTime: 120, color: '#22c55e' },
        { type: 'drop' as const, startTime: 120, endTime: 240, color: '#ff6b35' },
        { type: 'breakdown' as const, startTime: 240, endTime: 300, color: '#22c55e' },
        { type: 'outro' as const, startTime: 300, endTime: 360, color: '#3b82f6' },
      ]
    }
  ];

  const togglePlay = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const handleSeek = (trackId: string, time: number) => {
    setTrackPositions(prev => ({
      ...prev,
      [trackId]: time
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <h1 className="text-4xl font-bold text-white mb-2">
          CDJ-3000 <span className="text-[#ff6b35]">Waveform Display</span>
        </h1>
        <p className="text-xl text-gray-400">
          Professional waveform with frequency-based color coding and real-time playback
        </p>
      </div>

      {/* Main Content */}
      <div className="py-12 px-8 max-w-7xl mx-auto">
        {/* Waveform Examples */}
        <div className="space-y-12">
          {tracks.map(track => (
            <div key={track.id} className="bg-[#0f0f0f] rounded-2xl p-8 border border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{track.title}</h2>
                  <p className="text-gray-400">Syntax Audio Intelligence</p>
                </div>
                <button
                  onClick={() => togglePlay(track.id)}
                  className="p-4 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white transition-colors"
                >
                  {playingTrack === track.id ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
              </div>

              <CDJWaveform
                duration={track.duration}
                currentTime={trackPositions[track.id]}
                isPlaying={playingTrack === track.id}
                onSeek={(time) => handleSeek(track.id, time)}
                showSections={true}
                height={180}
                sections={track.sections}
              />
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Professional Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">🌈</div>
              <h3 className="text-xl font-bold text-white mb-2">Frequency-Based Colors</h3>
              <p className="text-gray-400">
                Blue for bass, green for mids, yellow for high-mids, orange/red for peaks - just like CDJ-3000!
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Ultra High Resolution</h3>
              <p className="text-gray-400">
                800 data points for ultra-smooth, detailed waveform rendering that shows every kick, snare, and hi-hat.
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Interactive Seeking</h3>
              <p className="text-gray-400">
                Click anywhere to seek. Hover for instant timestamp tooltips. Perfect for precise DJing.
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-white mb-2">Mirrored Display</h3>
              <p className="text-gray-400">
                Dual mirrored waveform (top and bottom) like Pioneer CDJ-3000 for perfect visual balance.
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time Glow Effects</h3>
              <p className="text-gray-400">
                Energy peaks pulse and glow during playback. Passed sections stay bright, upcoming sections dimmed.
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">🎚️</div>
              <h3 className="text-xl font-bold text-white mb-2">Section Detection</h3>
              <p className="text-gray-400">
                Auto-detected intro, buildup, drop, breakdown, and outro sections displayed above waveform.
              </p>
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="mt-16 bg-gradient-to-r from-[#ff6b35] to-[#9333ea] rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Frequency Color Coding
          </h2>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#3b82f6' }} />
              <div className="text-left">
                <div className="text-white font-bold">Blue → Cyan</div>
                <div className="text-white/80 text-sm">Low Freq (Bass, Kicks)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#22c55e' }} />
              <div className="text-left">
                <div className="text-white font-bold">Green → Yellow</div>
                <div className="text-white/80 text-sm">Mid Freq (Synths, Vocals)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#ff6b35' }} />
              <div className="text-left">
                <div className="text-white font-bold">Orange → Red</div>
                <div className="text-white/80 text-sm">High Freq (Hi-hats, Peaks)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-16 grid grid-cols-3 gap-6">
          <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a] text-center">
            <div className="text-2xl font-bold text-white mb-2">800</div>
            <div className="text-gray-400">Data Points</div>
            <div className="text-sm text-gray-500 mt-1">Ultra high resolution</div>
          </div>
          <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a] text-center">
            <div className="text-2xl font-bold text-white mb-2">4</div>
            <div className="text-gray-400">Color Bands</div>
            <div className="text-sm text-gray-500 mt-1">Frequency-based</div>
          </div>
          <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a] text-center">
            <div className="text-2xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400">CDJ-3000 Quality</div>
            <div className="text-sm text-gray-500 mt-1">Professional grade</div>
          </div>
        </div>
      </div>
    </div>
  );
}
