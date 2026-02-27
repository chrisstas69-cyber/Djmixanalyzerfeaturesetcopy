import React from 'react';
import { Play, Share2, Heart, TrendingUp, Clock, Repeat2 } from 'lucide-react';
import { useAudioPlayer } from '../../lib/store/useAudioPlayer';
import { WaveformDisplay } from './waveform-display';

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

const parseDurationToSeconds = (dur: string): number => {
  const parts = dur.trim().split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
};

const MixesPanel = () => {
  const { playTrack, currentTrack, isPlaying, togglePlay, currentTime, durationSeconds } = useAudioPlayer();

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
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col h-full min-h-0" style={{ background: '#1a1a1a' }}>
      {/* Vertical list of tracks - no My Mixes header */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[1400px] mx-auto">
          {mockMixes.map((mix) => {
            const isCurrentlyPlaying = currentTrack?.id === mix.id && isPlaying;
            const durationSec = currentTrack?.id === mix.id ? durationSeconds : parseDurationToSeconds(mix.duration);
            const playbackProgress = durationSec > 0 ? currentTime / durationSec : 0.3;

            return (
              <div
                key={mix.id}
                className="transition-all"
                style={{ padding: '20px 0', borderBottom: '1px solid #2a2a2a' }}
              >
                {/* Row 1: Album art + track title */}
                <div className="flex items-center gap-4 mb-2">
                  <button
                    type="button"
                    onClick={() => handlePlayPause(mix)}
                    className="flex-shrink-0 rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
                  >
                    <img
                      src={mix.artwork}
                      alt={mix.title}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                  <h2 className="text-lg font-semibold truncate" style={{ color: '#ffffff' }}>
                    {mix.title}
                  </h2>
                </div>

                {/* Row 2: Stats - plays, likes, shares, duration - #9e9e9e 13px */}
                <div className="flex flex-wrap items-center gap-4 mb-3" style={{ color: '#9e9e9e', fontSize: 13 }}>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    {formatNumber(mix.plays)} plays
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    {formatNumber(mix.likes)} Likes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    {mix.shares} shares
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {mix.duration}
                  </span>
                </div>

                {/* Row 3: Waveform 60px, timestamp on right */}
                <div className="mb-3">
                  <WaveformDisplay
                    trackId={mix.id}
                    progress={isCurrentlyPlaying ? playbackProgress : 0.3}
                    timestamp={mix.duration}
                  />
                </div>

                {/* Row 4: Orange Share (with play icon) + heart/likes, repost/shares, clock/time */}
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded transition-opacity hover:opacity-90"
                    style={{
                      background: '#ff5722',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '6px 16px',
                      fontSize: 13,
                    }}
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    Share
                  </button>
                  <span className="flex items-center gap-1.5" style={{ color: '#9e9e9e', fontSize: 13 }}>
                    <Heart className="w-4 h-4" />
                    {formatNumber(mix.likes)} likes
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: '#9e9e9e', fontSize: 13 }}>
                    <Repeat2 className="w-4 h-4" />
                    {mix.shares} shares
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: '#9e9e9e', fontSize: 13 }}>
                    <Clock className="w-4 h-4" />
                    {mix.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {mockMixes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255,87,34,0.2)' }}>
              <Play className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No mixes yet</h3>
            <p className="text-gray-400 mb-6">Create your first mix using the Auto DJ Mixer</p>
            <button className="px-6 py-3 rounded-lg font-semibold text-black transition-opacity hover:opacity-90" style={{ background: '#ff5722' }}>
              Start Mixing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MixesPanel;
