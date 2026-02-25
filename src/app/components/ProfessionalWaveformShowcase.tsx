import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProfessionalWaveform } from './ProfessionalWaveform';

interface ProfessionalWaveformShowcaseProps {
  onBack: () => void;
}

export function ProfessionalWaveformShowcase({ onBack }: ProfessionalWaveformShowcaseProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <h1 className="text-4xl font-bold text-white mb-2">
          Professional <span className="text-[#ff6b35]">Waveform Display</span>
        </h1>
        <p className="text-xl text-gray-400">
          CDJ-3000 inspired waveform with frequency-based color coding
        </p>
      </div>

      {/* Main Content */}
      <div className="py-12">
        {/* Waveform Examples */}
        <div className="space-y-12">
          {/* Example 1: House Track */}
          <ProfessionalWaveform
            trackName="Nocturnal Sequence - Deep House"
            duration={420} // 7 minutes
            sections={[
              { type: 'intro', startTime: 0, endTime: 60, color: '#3b82f6' },
              { type: 'buildup', startTime: 60, endTime: 120, color: '#22c55e' },
              { type: 'drop', startTime: 120, endTime: 240, color: '#ff6b35' },
              { type: 'breakdown', startTime: 240, endTime: 330, color: '#22c55e' },
              { type: 'outro', startTime: 330, endTime: 420, color: '#3b82f6' },
            ]}
          />

          {/* Example 2: Techno Track */}
          <ProfessionalWaveform
            trackName="Subsonic Ritual - Techno"
            duration={480} // 8 minutes
            sections={[
              { type: 'intro', startTime: 0, endTime: 90, color: '#3b82f6' },
              { type: 'buildup', startTime: 90, endTime: 150, color: '#22c55e' },
              { type: 'drop', startTime: 150, endTime: 330, color: '#ff6b35' },
              { type: 'breakdown', startTime: 330, endTime: 420, color: '#22c55e' },
              { type: 'outro', startTime: 420, endTime: 480, color: '#3b82f6' },
            ]}
          />

          {/* Example 3: Progressive Track */}
          <ProfessionalWaveform
            trackName="Hypnotic Elements - Progressive"
            duration={360} // 6 minutes
            sections={[
              { type: 'intro', startTime: 0, endTime: 45, color: '#3b82f6' },
              { type: 'buildup', startTime: 45, endTime: 120, color: '#22c55e' },
              { type: 'drop', startTime: 120, endTime: 240, color: '#ff6b35' },
              { type: 'breakdown', startTime: 240, endTime: 300, color: '#22c55e' },
              { type: 'outro', startTime: 300, endTime: 360, color: '#3b82f6' },
            ]}
          />
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-8 mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Professional Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">🌈</div>
              <h3 className="text-xl font-bold text-white mb-2">Frequency-Based Colors</h3>
              <p className="text-gray-400">
                Blue for bass, green for mids, yellow for high-mids, and orange/red for peaks - just like CDJ-3000!
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Interactive Seeking</h3>
              <p className="text-gray-400">
                Click anywhere on the waveform to jump to that position. Hover to see timestamps instantly.
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Zoom Controls</h3>
              <p className="text-gray-400">
                Zoom in to see micro-details or zoom out for full track overview. Perfect for precise cueing.
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Section Markers</h3>
              <p className="text-gray-400">
                Auto-detected intro, buildup, drop, breakdown, and outro sections for easy navigation.
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Playback Controls</h3>
              <p className="text-gray-400">
                Speed control (0.5x - 1.5x), loop mode, volume control, and standard playback buttons.
              </p>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-white mb-2">Mirrored Display</h3>
              <p className="text-gray-400">
                Dual mirrored waveform (top and bottom) shows audio dynamics clearly - Pioneer CDJ style!
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="max-w-7xl mx-auto px-8 mt-16">
          <div className="bg-gradient-to-r from-[#ff6b35] to-[#9333ea] rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Better Than CDJ-3000, Mixed In Key & SoundCloud
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Professional waveform display with frequency-based color coding, interactive seeking, and AI-powered section detection
            </p>
            <div className="flex items-center justify-center gap-8 text-white">
              <div>
                <div className="text-4xl font-bold">500+</div>
                <div className="text-sm opacity-80">Data Points</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div>
                <div className="text-4xl font-bold">4</div>
                <div className="text-sm opacity-80">Frequency Bands</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div>
                <div className="text-4xl font-bold">180px</div>
                <div className="text-sm opacity-80">Waveform Height</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div>
                <div className="text-4xl font-bold">100%</div>
                <div className="text-sm opacity-80">Professional</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
