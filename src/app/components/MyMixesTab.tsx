import { useState } from 'react';
import { Play, Pause, Heart, Download, Share2, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Maximize2, Monitor } from 'lucide-react';

interface MixTrack {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  plays: string;
  likes: number;
  shares: number;
  duration: string;
  artwork: string;
  waveformHeights: number[];
}

const mockMixes: MixTrack[] = [
  {
    id: '1',
    title: 'Deep House Journey',
    subtitle: 'AUTO MIXER',
    timeAgo: '2D AGO',
    plays: '2.0K plays',
    likes: 342,
    shares: 89,
    duration: '45:18',
    artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400',
    waveformHeights: [30, 50, 40, 70, 100, 80, 60, 90, 40, 50, 30, 60, 80, 50, 40, 70, 90, 60, 40, 30, 50, 70, 90, 80, 60, 40, 30, 20, 40, 50, 60, 40, 55, 75, 45, 65, 85, 35, 55, 70, 45, 60, 80, 50, 35, 65, 75, 55, 40, 30, 50, 70, 85, 65, 45, 35, 25, 45, 55, 65],
  },
  {
    id: '2',
    title: 'Spiral Dreams',
    subtitle: 'AUTO MIXER',
    timeAgo: '4D AGO',
    plays: '1.0K plays',
    likes: 257,
    shares: 62,
    duration: '30:15',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    waveformHeights: [40, 60, 30, 80, 50, 40, 70, 20, 50, 30, 60, 40, 20, 50, 70, 90, 40, 30, 50, 60, 70, 40, 30, 50, 60, 40, 30, 20, 40, 50, 70, 90, 60, 40, 30, 55, 45, 65, 35, 75, 50, 40, 60, 80, 45, 35, 55, 70, 40, 30, 50, 65, 80, 55, 40, 30, 45, 60, 50, 35],
  },
  {
    id: '3',
    title: 'Good Vibes Mix',
    subtitle: 'AUTO MIXER',
    timeAgo: '1W AGO',
    plays: '3.4K plays',
    likes: 458,
    shares: 124,
    duration: '52:18',
    artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
    waveformHeights: [20, 40, 60, 40, 30, 50, 70, 40, 20, 50, 60, 80, 40, 20, 50, 70, 40, 20, 50, 60, 70, 80, 40, 30, 50, 60, 40, 30, 20, 40, 50, 70, 90, 60, 40, 30, 55, 45, 65, 75, 35, 50, 60, 40, 70, 85, 45, 55, 30, 40, 60, 75, 50, 35, 45, 65, 55, 40, 50, 30],
  },
];

export default function MyMixesTab() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [bottomPlayerTrack, setBottomPlayerTrack] = useState<MixTrack>(mockMixes[0]);
  const [isBottomPlaying, setIsBottomPlaying] = useState(false);

  const togglePlay = (mix: MixTrack) => {
    if (playingId === mix.id) {
      setPlayingId(null);
      setIsBottomPlaying(false);
    } else {
      setPlayingId(mix.id);
      setBottomPlayerTrack(mix);
      setIsBottomPlaying(true);
    }
  };

  const toggleLike = (id: string) => {
    setLikedTracks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', color: 'white', position: 'relative', paddingBottom: '120px' }}>
      {/* HEADER */}
      <div style={{ padding: '32px 32px 0 32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', margin: 0 }}>My Mixes</h2>
        <p style={{ fontSize: '14px', color: '#888', margin: '4px 0 24px 0' }}>
          Your Auto-Generated Sessions • {mockMixes.length} Mixes
        </p>
      </div>

      {/* TRACK LIST */}
      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {mockMixes.map((mix) => {
          const isPlaying = playingId === mix.id;
          const isLiked = likedTracks.has(mix.id);

          return (
            <div key={mix.id} style={{
              background: '#141414',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              {/* TOP ROW: Artwork + Info + Waveform */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {/* ARTWORK */}
                <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden' }}>
                  <img
                    src={mix.artwork}
                    alt={mix.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* INFO + WAVEFORM */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title */}
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'white', margin: '0 0 4px 0' }}>
                    {mix.title}
                  </h3>

                  {/* Stats Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#999', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#ff5722' }}>▶</span> {mix.plays}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ♥ {mix.likes} Likes
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ↗ {mix.shares} shares
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⏱ {mix.duration}
                    </span>
                  </div>

                  {/* WAVEFORM - ORANGE */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '2px',
                    height: '60px',
                    width: '100%',
                    position: 'relative',
                  }}>
                    {mix.waveformHeights.map((h, i) => {
                      const progress = isPlaying ? 0.4 : 0; // 40% played when playing
                      const barProgress = i / mix.waveformHeights.length;
                      const isPlayed = barProgress < progress;

                      return (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: `${h}%`,
                            backgroundColor: isPlayed ? '#ff5722' : '#ff8a65',
                            opacity: isPlayed ? 1 : 0.6,
                            borderRadius: '1px',
                            minWidth: '2px',
                          }}
                        />
                      );
                    })}
                    {/* Duration label on right */}
                    <span style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      fontSize: '11px',
                      color: '#888',
                    }}>
                      {mix.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: Play + Share + Download + Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                {/* Orange Play/Share Button */}
                <button
                  onClick={() => togglePlay(mix)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ff5722',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} fill="white" />}
                  Share
                </button>

                {/* Stats */}
                <span style={{ fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#ff5722' }}>▶</span> {mix.plays}
                </span>
                <span style={{ fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ♥ {mix.likes} likes
                </span>
                <span style={{ fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ↗ {mix.shares} shares
                </span>
                <span style={{ fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⏱ {mix.duration}
                </span>

                {/* Right side actions */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => toggleLike(mix.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isLiked ? '#ff5722' : '#666',
                      padding: '4px',
                    }}
                  >
                    <Heart size={18} fill={isLiked ? '#ff5722' : 'none'} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}>
                    <Download size={18} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}>
                    <Repeat size={18} />
                  </button>
                  <button style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    color: '#999',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}>
                    ••• Repostss
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* FIXED BOTTOM PLAYER BAR - ORANGE */}
      {/* ============================================ */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0D0D0D 100%)',
        borderTop: '1px solid rgba(255,87,34,0.3)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        zIndex: 1000,
      }}>
        {/* Track Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '250px', flexShrink: 0 }}>
          <img
            src={bottomPlayerTrack.artwork}
            alt={bottomPlayerTrack.title}
            style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{bottomPlayerTrack.title}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{bottomPlayerTrack.subtitle}</div>
          </div>
          <button
            onClick={() => toggleLike(bottomPlayerTrack.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: likedTracks.has(bottomPlayerTrack.id) ? '#ff5722' : '#666', padding: '4px' }}
          >
            <Heart size={16} fill={likedTracks.has(bottomPlayerTrack.id) ? '#ff5722' : 'none'} />
          </button>
        </div>

        {/* Center Controls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {/* Playback Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
              <Shuffle size={16} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <SkipBack size={20} fill="white" />
            </button>
            <button
              onClick={() => setIsBottomPlaying(!isBottomPlaying)}
              style={{
                background: '#ff5722',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              {isBottomPlaying ? <Pause size={18} /> : <Play size={18} fill="white" style={{ marginLeft: '2px' }} />}
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <SkipForward size={20} fill="white" />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '600px' }}>
            <span style={{ fontSize: '11px', color: '#888', minWidth: '35px', textAlign: 'right' }}>0:00</span>
            <div style={{ flex: 1, height: '4px', background: '#333', borderRadius: '2px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '0%', height: '100%', background: '#ff5722', borderRadius: '2px' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#888', minWidth: '35px' }}>-{bottomPlayerTrack.duration}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '200px', justifyContent: 'flex-end' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <Download size={16} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <Monitor size={16} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <Volume2 size={16} />
          </button>
          <div style={{ width: '80px', height: '4px', background: '#333', borderRadius: '2px' }}>
            <div style={{ width: '70%', height: '100%', background: '#ff5722', borderRadius: '2px' }} />
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
