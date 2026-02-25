import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Heart,
  Share2,
  Download,
  Search,
  TrendingUp,
  Clock,
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
  Monitor,
  Volume2,
  VolumeX,
  Maximize2,
  ListMusic,
} from 'lucide-react';
import { useAudioPlayer } from '../../lib/store/useAudioPlayer';

interface MixTrack {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  plays: number;
  likes: number;
  shares: number;
  artwork: string;
  playedPercent?: number; // 0–1 for waveform
}

const MIXES: MixTrack[] = [
  { id: '1', title: 'Deep House Journey', subtitle: 'AUTO MIXER • 2d ago', duration: '45:29', plays: 2847, likes: 342, shares: 89, artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop', playedPercent: 0.35 },
  { id: '2', title: 'Spiral Dreams', subtitle: 'AUTO MIXER • 5d ago', duration: '38:15', plays: 1923, likes: 287, shares: 62, artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop', playedPercent: 0 },
  { id: '3', title: 'Good Vibes Mix', subtitle: 'AUTO MIXER • 1w ago', duration: '52:10', plays: 3421, likes: 456, shares: 124, artwork: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=200&auto=format&fit=crop', playedPercent: 0 },
  { id: '4', title: 'Midnight Sessions', subtitle: 'AUTO MIXER • 1w ago', duration: '61:42', plays: 4156, likes: 523, shares: 156, artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400', playedPercent: 0 },
  { id: '5', title: 'Neon Pulse Mix', subtitle: 'AUTO MIXER • 2w ago', duration: '48:20', plays: 2100, likes: 312, shares: 78, artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400', playedPercent: 0 },
  { id: '6', title: 'Underground Vibes', subtitle: 'AUTO MIXER • 2w ago', duration: '44:55', plays: 1890, likes: 278, shares: 65, artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', playedPercent: 0 },
];

const WAVEFORM_BARS = 32;
function formatStat(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
/** Deterministic bar heights per track id */
function getBarHeights(seed: string): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  const r = () => {
    h = (h * 9301 + 49297) % 233280;
    return h / 233280;
  };
  return Array.from({ length: WAVEFORM_BARS }, () => 20 + r() * 50 + r() * 30);
}

export default function MyMixesTab() {
  const { playTrack, currentTrack, isPlaying, togglePlay, currentTime, durationSeconds, setCurrentTime, setDurationSeconds, volume, setVolume, clearPlayer } = useAudioPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(console.error);
    else audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handlePlayPause = (mix: MixTrack) => {
    if (currentTrack?.id === mix.id) {
      togglePlay();
    } else {
      playTrack({
        id: mix.id,
        title: mix.title,
        artist: mix.subtitle,
        artwork: mix.artwork,
        duration: mix.duration,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const duration = currentTrack ? durationSeconds : 0;
  const remaining = Math.max(0, duration - currentTime);
  const remainingStr = `-${formatTime(remaining)}`;

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: '#1a1a1a', paddingBottom: '100px' }}>
      {/* Centered search - no My Mixes h2 */}
      <div className="flex-shrink-0 flex justify-center px-6 py-4">
        <div
          className="relative flex items-center rounded-full"
          style={{
            width: 400,
            height: 40,
            background: '#2a2a2a',
            paddingLeft: 40,
          }}
        >
          <Search className="absolute left-3 w-5 h-5 text-[#9e9e9e]" />
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none text-sm pr-4 text-white placeholder-[#9e9e9e]"
          />
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 pb-4">
        <div className="flex flex-col gap-4">
          {MIXES.map((mix) => {
            const isCurrent = currentTrack?.id === mix.id && isPlaying;
            const progress = isCurrent && durationSeconds > 0 ? currentTime / durationSeconds : (mix.playedPercent ?? 0);
            const barHeights = getBarHeights(mix.id);

            return (
              <div
                key={mix.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.06)] transition-all hover:bg-white/5"
                style={{ background: 'transparent' }}
              >
                {/* Artwork + play */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={mix.artwork}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handlePlayPause(mix)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: '#ff5722' }}
                    >
                      {isCurrent ? (
                        <Pause className="w-5 h-5" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Title, stats, waveform, Share */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h4 className="text-white truncate font-semibold mb-1" style={{ fontSize: 22 }}>
                    {mix.title}
                  </h4>
                  {/* Stats row: plays • likes • shares • duration */}
                  <div className="flex flex-wrap items-center gap-2 mb-2" style={{ fontSize: 13, color: '#9e9e9e' }}>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {formatStat(mix.plays)} plays
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {formatStat(mix.likes)} likes
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" />
                      {formatStat(mix.shares)} shares
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {mix.duration}
                    </span>
                  </div>

                  {/* Waveform: ALL bars - played = #ff5722 (orange), unplayed = #4a4a4a (dark grey). No cyan/teal. */}
                  <div className="h-10 w-full flex items-center gap-[2px] overflow-hidden mb-2">
                    {barHeights.map((h, i) => {
                      const barProgress = (i + 1) / WAVEFORM_BARS;
                      const played = barProgress <= progress;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-sm min-w-[2px] transition-colors"
                          style={{
                            height: `${Math.max(15, h)}%`,
                            backgroundColor: played ? '#ff5722' : '#4a4a4a',
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Orange Share button with play icon (below waveform, left) */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded transition-opacity hover:opacity-90 text-white"
                      style={{
                        background: '#ff5722',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 16px',
                        fontSize: 13,
                      }}
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Far right: pill "Repostss" */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    className="rounded-full p-2 text-[#9e9e9e] hover:text-white transition-colors"
                    aria-label="Like"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-xl px-3 py-1.5 text-white transition-colors hover:bg-white/15"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  >
                    Repostss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        onLoadedMetadata={() => {
          if (audioRef.current) setDurationSeconds(audioRef.current.duration);
        }}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
      />
      {/* Fixed bottom player bar - ALWAYS visible, orange #ff5722 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '220px',
          right: 0,
          height: '80px',
          backgroundColor: '#ff5722',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          zIndex: 50,
          gap: '16px',
        }}
      >
        <img src={currentTrack?.artwork ?? MIXES[0].artwork} alt="" style={{ width: 50, height: 50, borderRadius: 4, objectFit: 'cover' }} />
        <div>
          <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>
            {currentTrack?.title ?? 'Deep House Journey'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>AUTO MIXER</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button type="button" style={{ color: 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} aria-label="Shuffle">⟲</button>
            <button type="button" style={{ color: 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} aria-label="Previous">⏮</button>
            <button
              type="button"
              onClick={togglePlay}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'white',
                color: '#ff5722',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button type="button" style={{ color: 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} aria-label="Next">⏭</button>
            <button type="button" style={{ color: 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} aria-label="Repeat">⟳</button>
          </div>
          <div style={{ width: '100%', maxWidth: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{formatTime(currentTime)}</span>
            <div style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }}>
              <div
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: 'white',
                  borderRadius: 2,
                }}
              />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{duration > 0 ? `-${formatTime(duration - currentTime)}` : '-52:18'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Volume">🔊</button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            style={{ width: 80, accentColor: 'white' }}
          />
        </div>
      </div>
    </div>
  );
}
