import React, { useState, useEffect } from 'react';
import { Play, Pause, Share2, Download, MoreHorizontal, Heart, TrendingUp, Clock } from 'lucide-react';
import { useAudioPlayer } from '../../lib/store/useAudioPlayer';

interface Mix {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  plays: number;
  likes: number;
  shares: number;
  artwork: string;
  waveformData: number[];
  date: string;
  audioUrl?: string;
}

// Mock waveform data generator
const generateWaveform = (length: number = 100) => {
  return Array.from({ length }, () => Math.random() * 100);
};

const mockMixes: Mix[] = [
  {
    id: '1',
    title: 'Deep House Journey',
    subtitle: 'AUTO MIXER • 2D AGO',
    duration: '45:29',
    plays: 2847,
    likes: 342,
    shares: 89,
    artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400',
    waveformData: generateWaveform(),
    date: '2026-01-15',
  },
  {
    id: '2',
    title: 'Spiral Dreams',
    subtitle: 'AUTO MIXER • 4D AGO',
    duration: '38:15',
    plays: 1923,
    likes: 287,
    shares: 62,
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    waveformData: generateWaveform(),
    date: '2026-01-13',
  },
  {
    id: '3',
    title: 'Good Vibes Mix',
    subtitle: 'AUTO MIXER • 1W AGO',
    duration: '52:18',
    plays: 3421,
    likes: 456,
    shares: 124,
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    waveformData: generateWaveform(),
    date: '2026-01-10',
  },
  {
    id: '4',
    title: 'Midnight Sessions',
    subtitle: 'AUTO MIXER • 1W AGO',
    duration: '61:42',
    plays: 4156,
    likes: 523,
    shares: 156,
    artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    waveformData: generateWaveform(),
    date: '2026-01-08',
  },
  {
    id: '5',
    title: 'Sunrise Energy',
    subtitle: 'AUTO MIXER • 2W AGO',
    duration: '43:55',
    plays: 2134,
    likes: 298,
    shares: 71,
    artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
    waveformData: generateWaveform(),
    date: '2026-01-03',
  },
  {
    id: '6',
    title: 'Techno Odyssey',
    subtitle: 'AUTO MIXER • 2W AGO',
    duration: '47:22',
    plays: 2891,
    likes: 341,
    shares: 92,
    artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    waveformData: generateWaveform(),
    date: '2026-01-01',
  },
];

const MixesPanel = () => {
  const [playingMixId, setPlayingMixId] = useState<string | null>(null);
  const { playTrack, currentTrack, isPlaying, togglePlay, currentTime } = useAudioPlayer();
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [localDuration, setLocalDuration] = useState(0);
  
  // Calculate playback progress (0-100)
  const playbackProgress = localDuration > 0 ? (localCurrentTime / localDuration) * 100 : 0;

  const handlePlayPause = (mix: Mix) => {
    if (currentTrack?.id === mix.id) {
      togglePlay();
    } else {
      playTrack({
        id: mix.id,
        title: mix.title,
        artist: mix.subtitle,
        artwork: mix.artwork,
        duration: mix.duration,
        audioUrl: mix.audioUrl,
      });
      setPlayingMixId(mix.id);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0A0A0A]">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-16 py-8 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">My Mixes</h1>
          <p className="text-gray-400">Your Auto-Generated Sessions • {mockMixes.length} Mixes</p>
        </div>
      </div>

      {/* Scrollable Mix List */}
      <div className="flex-1 overflow-y-auto px-16 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="space-y-8 pb-24">
            {mockMixes.map((mix) => {
              const isCurrentlyPlaying = currentTrack?.id === mix.id && isPlaying;

              return (
                <div
                  key={mix.id}
                  className={`
                    rounded-lg p-6 transition-all
                    ${isCurrentlyPlaying 
                      ? 'bg-white/10 border-2 border-[#FF6B00] shadow-[0_0_30px_rgba(255,107,0,0.3)]' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/[0.15] hover:border-[#FF6B00]/50 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)]'
                    }
                  `}
                >
                  {/* Top Row: Info + Stats */}
                  <div className="flex items-start gap-6 mb-4">
                    {/* Artwork */}
                    <div className="flex-shrink-0">
                      <img
                        src={mix.artwork}
                        alt={mix.title}
                        className="w-40 h-40 rounded-lg object-cover"
                      />
                    </div>

                    {/* Title + Subtitle */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-white mb-1 truncate hover:text-[#FF6B00] transition-colors cursor-pointer">
                        {mix.title}
                      </h2>
                      <p className="text-sm text-gray-400 uppercase tracking-wide mb-4">
                        {mix.subtitle}
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
                          <span>{formatNumber(mix.plays)} plays</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-[#FF6B00]" />
                          <span>{formatNumber(mix.likes)} likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-gray-400" />
                          <span>{mix.shares} shares</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <Clock className="w-4 h-4" />
                          <span>{mix.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Waveform - Gray with Color Fill on Play */}
                  <div className="relative mb-4">
                    <div className="h-20 flex items-end gap-[2px] bg-black/30 rounded-lg p-2 overflow-hidden cursor-pointer">
                      {mix.waveformData.map((height, index) => {
                        const barProgress = (index / mix.waveformData.length) * 100;
                        const isPlayed = isCurrentlyPlaying && barProgress <= playbackProgress;
                        
                        // Determine color based on position for played bars
                        let playedColor = '#888888'; // Default gray
                        if (isPlayed) {
                          if (barProgress < 33) {
                            playedColor = '#FF6B00'; // Orange
                          } else if (barProgress < 66) {
                            playedColor = '#00E5FF'; // Cyan
                          } else {
                            playedColor = '#FF6B00'; // Orange
                          }
                        }
                        
                        return (
                          <div
                            key={index}
                            className="flex-1 rounded-sm transition-all"
                            style={{
                              height: `${height}%`,
                              backgroundColor: isPlayed ? playedColor : 'rgba(255, 255, 255, 0.15)',
                              minHeight: '4px',
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => handlePlayPause(mix)}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] transition-all"
                      >
                        {isCurrentlyPlaying ? (
                          <Pause className="w-5 h-5 text-white" fill="white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        )}
                      </button>

                      {/* Share Button */}
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-[#00E5FF]/50 transition-all">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Share</span>
                      </button>

                      {/* Download Button */}
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-[#00E5FF]/50 transition-all">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </button>
                    </div>

                    {/* More Options */}
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {mockMixes.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-[#00E5FF]/20 flex items-center justify-center mx-auto mb-6">
                <Play className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No mixes yet</h3>
              <p className="text-gray-400 mb-6">Create your first mix using the Auto DJ Mixer</p>
              <button className="px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] transition-all">
                Start Mixing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MixesPanel;
