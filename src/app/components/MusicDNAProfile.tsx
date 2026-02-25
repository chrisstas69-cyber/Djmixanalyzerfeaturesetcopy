import React, { useState } from 'react';
import { ArrowLeft, Music, Zap, Piano, Sparkles, Library, RefreshCw, Play } from 'lucide-react';

interface MusicDNAProfileProps {
  onBack: () => void;
  onUseProfile: () => void;
}

export function MusicDNAProfile({ onBack, onUseProfile }: MusicDNAProfileProps) {
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  // Sample data for the DNA profile
  const profileData = {
    trackCount: 127,
    lastAnalyzed: '2 days ago',
    genres: [
      { name: 'Techno', percentage: 68 },
      { name: 'Minimal', percentage: 52 },
      { name: 'Deep House', percentage: 38 },
      { name: 'Dub Techno', percentage: 22 },
      { name: 'Hard Techno', percentage: 15 },
      { name: 'Melodic Techno', percentage: 12 }
    ],
    bpm: {
      average: 127,
      range: '118-135',
      preferred: '125-130',
      mostCommon: { bpm: 128, count: 24 }
    },
    keys: [
      { key: 'A Minor', camelot: '8A', percentage: 32 },
      { key: 'D Minor', camelot: '7A', percentage: 28 },
      { key: 'G Minor', camelot: '6A', percentage: 18 }
    ],
    styleDNA: [
      { style: 'Hypnotic', percentage: 82 },
      { style: 'Dark', percentage: 76 },
      { style: 'Minimal', percentage: 68 },
      { style: 'Driving', percentage: 54 },
      { style: 'Atmospheric', percentage: 48 },
      { style: 'Groovy', percentage: 36 },
      { style: 'Deep', percentage: 28 },
      { style: 'Raw', percentage: 18 }
    ]
  };

  const handleReanalyze = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      setIsReanalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Music DNA</h1>
            <p className="text-gray-400">
              Your Musical Profile - Analyzed from {profileData.trackCount} tracks
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last analyzed: {profileData.lastAnalyzed}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* Analysis Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* CARD 1: Genre Preferences */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Genre Preferences</h2>
                  <p className="text-sm text-gray-400">Your top genres</p>
                </div>
              </div>

              <div className="space-y-4">
                {profileData.genres.map((genre, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{genre.name}</span>
                      <span className="text-sm font-bold text-white">{genre.percentage}%</span>
                    </div>
                    <div className="h-2.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555] rounded-full transition-all duration-500"
                        style={{ width: `${genre.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 2: BPM Analysis */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">BPM Preferences</h2>
                  <p className="text-sm text-gray-400">Your tempo range</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1a1a1a] rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Average BPM</div>
                    <div className="text-2xl font-bold text-white">{profileData.bpm.average}</div>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Full Range</div>
                    <div className="text-2xl font-bold text-white">{profileData.bpm.range}</div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Preferred Range</div>
                  <div className="text-xl font-bold text-white">{profileData.bpm.preferred} BPM</div>
                </div>

                <div className="bg-gradient-to-r from-[#ff6b35]/10 to-[#ff8555]/10 border border-[#ff6b35]/20 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Most Common</div>
                  <div className="text-lg font-bold text-[#ff6b35]">
                    {profileData.bpm.mostCommon.bpm} BPM ({profileData.bpm.mostCommon.count} tracks)
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: Key Preferences */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] rounded-xl flex items-center justify-center">
                  <Piano className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Key Preferences</h2>
                  <p className="text-sm text-gray-400">Your top keys</p>
                </div>
              </div>

              <div className="space-y-4">
                {profileData.keys.map((keyData, index) => (
                  <div
                    key={index}
                    className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{keyData.camelot}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{keyData.key}</div>
                        <div className="text-xs text-gray-500">Camelot: {keyData.camelot}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{keyData.percentage}%</div>
                      <div className="text-xs text-gray-500">of tracks</div>
                    </div>
                  </div>
                ))}

                <div className="bg-gradient-to-r from-[#ff6b35]/10 to-[#ff8555]/10 border border-[#ff6b35]/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">
                    Harmonic mixing compatible keys identified
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 4: Style Characteristics */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Style DNA</h2>
                  <p className="text-sm text-gray-400">Your characteristics</p>
                </div>
              </div>

              <div className="space-y-3">
                {profileData.styleDNA.map((style, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-300">{style.style}</span>
                      <span className="text-sm font-bold text-white">{style.percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555] rounded-full transition-all duration-500"
                        style={{ width: `${style.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Primary Action - Generate Tracks */}
            <button
              onClick={onUseProfile}
              className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555] hover:from-[#ff8555] hover:to-[#ff6b35] text-white font-medium py-5 px-6 rounded-xl transition-all shadow-lg shadow-[#ff6b35]/30 group"
            >
              <div className="flex items-center justify-center gap-3">
                <Play className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold text-lg">Generate Tracks Based on My DNA</div>
                  <div className="text-sm opacity-90">Generate AI tracks matching your style</div>
                </div>
              </div>
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'dna-library' }))}
                className="bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-white font-medium py-4 px-6 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-center gap-3">
                  <Library className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="text-left">
                    <div className="font-medium">View My DNA Library</div>
                    <div className="text-sm text-gray-400">See all {profileData.trackCount} uploaded tracks</div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleReanalyze}
                disabled={isReanalyzing}
                className="bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-white font-medium py-4 px-6 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-3">
                  <RefreshCw className={`w-5 h-5 text-gray-400 group-hover:text-white transition-colors ${isReanalyzing ? 'animate-spin' : ''}`} />
                  <div className="text-left">
                    <div className="font-medium">
                      {isReanalyzing ? 'Re-Analyzing...' : 'Re-Analyze Tracks'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {isReanalyzing ? 'Processing your music' : 'Update analysis with latest uploads'}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
