import React, { useState, useMemo } from 'react';
import { Music2, Upload, Search, Play, Pause, Plus, Heart, Share2, Download, Trash2, Star, LayoutGrid, List } from 'lucide-react';
import { useAudioPlayer } from '../../lib/store/useAudioPlayer';

interface DNATrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  duration: string;
  artwork: string;
  dateAdded: string;
  energy: number;
}

// 30 MOCK TRACKS
const mockDNATracks: DNATrack[] = [
  { id: '1', title: 'I Am The God (Extended Mix)', artist: 'Chris Lake, NPC', genre: 'Progressive House', bpm: 134, key: 'F#m', duration: '7:12', artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', dateAdded: '2026-01-14', energy: 85 },
  { id: '2', title: 'Great Spirit feat. Hilight Tribe', artist: 'Armin van Buuren', genre: 'Trance', bpm: 138, key: 'G#m', duration: '6:58', artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', dateAdded: '2026-01-13', energy: 90 },
  { id: '3', title: "Se7en Seconds Until Thunder", artist: 'Pryda', genre: 'Techno', bpm: 134, key: 'D', duration: '7:45', artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400', dateAdded: '2026-01-12', energy: 88 },
  { id: '4', title: 'Midnight Resonance', artist: 'Adam Beyer', genre: 'Deep Tech', bpm: 126, key: 'Am', duration: '6:32', artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400', dateAdded: '2026-01-11', energy: 75 },
  { id: '5', title: 'Electric Dreams', artist: 'Joris Voorn', genre: 'Hard Techno', bpm: 128, key: 'Cm', duration: '7:15', artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', dateAdded: '2026-01-10', energy: 82 },
  { id: '6', title: 'Deep Horizon', artist: 'Maceo Plex', genre: 'Melodic House', bpm: 124, key: 'Em', duration: '8:01', artwork: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400', dateAdded: '2026-01-09', energy: 70 },
  { id: '7', title: 'Berlin Calling', artist: 'Paul Kalkbrenner', genre: 'Techno', bpm: 130, key: 'Bm', duration: '6:45', artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400', dateAdded: '2026-01-08', energy: 85 },
  { id: '8', title: 'Odyssey', artist: 'Tale Of Us', genre: 'Deep Tech', bpm: 122, key: 'F#m', duration: '7:30', artwork: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400', dateAdded: '2026-01-07', energy: 78 },
  { id: '9', title: 'Rave Culture', artist: 'W&W', genre: 'Hard Techno', bpm: 140, key: 'C#m', duration: '5:55', artwork: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=400', dateAdded: '2026-01-06', energy: 92 },
  { id: '10', title: 'Terminal 5', artist: 'Sasha', genre: 'Progressive House', bpm: 126, key: 'G', duration: '8:20', artwork: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400', dateAdded: '2026-01-05', energy: 80 },
  { id: '11', title: 'Warehouse Anthems', artist: 'Amelie Lens', genre: 'Techno', bpm: 132, key: 'Am', duration: '6:40', artwork: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', dateAdded: '2026-01-04', energy: 87 },
  { id: '12', title: 'Strobe (Extended)', artist: 'Deadmau5', genre: 'Progressive House', bpm: 128, key: 'Dm', duration: '10:32', artwork: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400', dateAdded: '2026-01-03', energy: 75 },
  { id: '13', title: 'Fire In My Soul', artist: 'Oliver Heldens', genre: 'Melodic House', bpm: 125, key: 'Fm', duration: '6:15', artwork: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400', dateAdded: '2026-01-02', energy: 83 },
  { id: '14', title: 'Your Mind', artist: 'Adam Beyer & Bart Skils', genre: 'Techno', bpm: 134, key: 'E', duration: '7:22', artwork: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', dateAdded: '2026-01-01', energy: 88 },
  { id: '15', title: 'Acid Eiffel', artist: 'Charlotte de Witte', genre: 'Hard Techno', bpm: 135, key: 'Gm', duration: '6:50', artwork: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', dateAdded: '2025-12-31', energy: 90 },
  { id: '16', title: 'Silence (Tiesto Remix)', artist: 'Delerium feat. Sarah', genre: 'Trance', bpm: 138, key: 'C#m', duration: '7:05', artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', dateAdded: '2025-12-30', energy: 85 },
  { id: '17', title: 'Move Your Body', artist: 'Marshall Jefferson', genre: 'Deep Tech', bpm: 124, key: 'Bm', duration: '6:28', artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400', dateAdded: '2025-12-29', energy: 80 },
  { id: '18', title: 'Hypercolour', artist: 'Fatboy Slim', genre: 'Techno', bpm: 129, key: 'F', duration: '7:18', artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400', dateAdded: '2025-12-28', energy: 82 },
  { id: '19', title: 'The Age of Love', artist: 'Age of Love', genre: 'Trance', bpm: 140, key: 'Am', duration: '6:45', artwork: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400', dateAdded: '2025-12-27', energy: 88 },
  { id: '20', title: 'Opus', artist: 'Eric Prydz', genre: 'Progressive House', bpm: 126, key: 'Dm', duration: '9:01', artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', dateAdded: '2025-12-26', energy: 77 },
  { id: '21', title: 'Bells of Revolution', artist: 'UMEK', genre: 'Techno', bpm: 133, key: 'G#m', duration: '6:55', artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400', dateAdded: '2025-12-25', energy: 86 },
  { id: '22', title: 'Elements', artist: 'Kolsch', genre: 'Melodic House', bpm: 122, key: 'Em', duration: '8:12', artwork: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400', dateAdded: '2025-12-24', energy: 72 },
  { id: '23', title: 'Pump Up The Jam', artist: 'Technotronic', genre: 'Hard Techno', bpm: 136, key: 'F#m', duration: '5:40', artwork: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', dateAdded: '2025-12-23', energy: 91 },
  { id: '24', title: 'Flashback', artist: 'Moguai', genre: 'Progressive House', bpm: 128, key: 'C', duration: '7:25', artwork: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=400', dateAdded: '2025-12-22', energy: 79 },
  { id: '25', title: 'Renaissance', artist: 'Solomun', genre: 'Deep Tech', bpm: 123, key: 'Gm', duration: '7:50', artwork: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400', dateAdded: '2025-12-21', energy: 74 },
  { id: '26', title: 'Digital Love', artist: 'Daft Punk', genre: 'Melodic House', bpm: 121, key: 'F', duration: '4:58', artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', dateAdded: '2025-12-20', energy: 76 },
  { id: '27', title: 'Space Date', artist: 'Mountain People', genre: 'Techno', bpm: 132, key: 'Dm', duration: '6:38', artwork: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400', dateAdded: '2025-12-19', energy: 84 },
  { id: '28', title: 'Blackout', artist: 'Black Sun Empire', genre: 'Hard Techno', bpm: 138, key: 'Cm', duration: '6:20', artwork: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', dateAdded: '2025-12-18', energy: 89 },
  { id: '29', title: 'Galaxia', artist: 'Moonbeam', genre: 'Trance', bpm: 138, key: 'Bm', duration: '7:08', artwork: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400', dateAdded: '2025-12-17', energy: 86 },
  { id: '30', title: 'Connected', artist: 'Stereo MCs', genre: 'Progressive House', bpm: 127, key: 'A', duration: '6:42', artwork: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', dateAdded: '2025-12-16', energy: 78 },
];

const DNATracksLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterGenre, setFilterGenre] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [favoriteTracks, setFavoriteTracks] = useState<Set<string>>(new Set());
  const { playTrack, addToQueue } = useAudioPlayer();

  const genres = useMemo(() => ['all', ...Array.from(new Set(mockDNATracks.map(t => t.genre)))], []);

  const filteredTracks = useMemo(() => {
    return mockDNATracks
      .filter(track => {
        const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = filterGenre === 'all' || track.genre === filterGenre;
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'dateAdded': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
          case 'title': return a.title.localeCompare(b.title);
          case 'artist': return a.artist.localeCompare(b.artist);
          case 'bpm': return b.bpm - a.bpm;
          case 'energy': return b.energy - a.energy;
          case 'key': return a.key.localeCompare(b.key);
          default: return 0;
        }
      });
  }, [searchQuery, sortBy, filterGenre]);

  const handlePreview = (track: DNATrack) => {
    if (playingId === track.id) {
      setPlayingId(null);
    } else {
      setPlayingId(track.id);
      playTrack({
        id: track.id,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork,
        duration: track.duration,
      });
    }
  };

  const handleAddToMix = (track: DNATrack) => {
    addToQueue({
      id: track.id,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork,
      duration: track.duration,
    });
  };

  const toggleFavorite = (id: string) => {
    setFavoriteTracks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedTracks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Energy dots (energy is 0-100, show as dots out of 10)
  const renderEnergyDots = (energy: number) => {
    const dots = Math.round(energy / 10);
    return (
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: i < dots ? '#ff5722' : '#333',
            }}
          />
        ))}
      </div>
    );
  };

  // Key color mapping
  const getKeyColor = (key: string) => {
    const colors: Record<string, string> = {
      'Am': '#00E5FF', 'Bm': '#7C4DFF', 'Cm': '#FF4081', 'Dm': '#FF9100',
      'Em': '#00E676', 'Fm': '#448AFF', 'Gm': '#FFEA00', 'F#m': '#E040FB',
      'G#m': '#00BFA5', 'C#m': '#FF6E40', 'A': '#00E5FF', 'B': '#7C4DFF',
      'C': '#FF4081', 'D': '#FF9100', 'E': '#00E676', 'F': '#448AFF', 'G': '#FFEA00',
    };
    return colors[key] || '#00E5FF';
  };

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>DNA Tracks Library</h2>
            <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0 0' }}>
              {filteredTracks.length} tracks • Your uploaded tracks with full metadata
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* List | Cards Toggle */}
            <div style={{
              display: 'flex',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', fontSize: '13px', fontWeight: 500,
                  border: 'none', cursor: 'pointer',
                  background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: viewMode === 'list' ? 'white' : 'rgba(255,255,255,0.6)',
                }}
              >
                <List size={14} /> List
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', fontSize: '13px', fontWeight: 500,
                  border: 'none', cursor: 'pointer',
                  background: viewMode === 'cards' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: viewMode === 'cards' ? 'white' : 'rgba(255,255,255,0.6)',
                }}
              >
                <LayoutGrid size={14} /> Cards
              </button>
            </div>

            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              background: '#00E5FF', color: '#000', border: 'none',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>
              <Upload size={14} /> Upload DNA Tracks
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Search DNA tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', paddingLeft: '36px', paddingRight: '12px', padding: '10px 12px 10px 36px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none',
              }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 12px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              color: 'white', fontSize: '13px', outline: 'none',
            }}
          >
            <option value="dateAdded">Date Added</option>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="bpm">BPM</option>
            <option value="energy">Energy</option>
            <option value="key">Key</option>
          </select>
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            style={{
              padding: '10px 12px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              color: 'white', fontSize: '13px', outline: 'none',
            }}
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre === 'all' ? 'All Genres' : genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ============================================ */}
      {/* LIST VIEW */}
      {/* ============================================ */}
      {viewMode === 'list' && (
        <div style={{ padding: '0 24px' }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 40px 40px 60px 1fr 180px 70px 60px 70px 90px 120px',
            alignItems: 'center',
            padding: '8px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: '11px',
            fontWeight: 600,
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            <div></div>{/* Checkbox */}
            <div></div>{/* Heart */}
            <div></div>{/* Play */}
            <div>ART</div>
            <div>TITLE</div>
            <div>ARTIST</div>
            <div style={{ textAlign: 'center' }}>BPM</div>
            <div style={{ textAlign: 'center' }}>KEY</div>
            <div style={{ textAlign: 'center' }}>TIME</div>
            <div>ENERGY</div>
            <div style={{ textAlign: 'center' }}>ACTIONS</div>
          </div>

          {/* Track Rows */}
          <div style={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
            {filteredTracks.map((track) => {
              const isPlaying = playingId === track.id;
              const isHovered = hoveredRow === track.id;
              const isSelected = selectedTracks.has(track.id);
              const isFavorite = favoriteTracks.has(track.id);

              return (
                <div
                  key={track.id}
                  onMouseEnter={() => setHoveredRow(track.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 40px 40px 60px 1fr 180px 70px 60px 70px 90px 120px',
                    alignItems: 'center',
                    padding: '8px 12px',
                    height: '64px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: isSelected ? 'rgba(255,87,34,0.1)' : isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Checkbox */}
                  <div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(track.id)}
                      style={{ accentColor: '#ff5722', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Heart */}
                  <div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite ? '#ff5722' : '#444', padding: '2px' }}
                    >
                      <Heart size={14} fill={isFavorite ? '#ff5722' : 'none'} />
                    </button>
                  </div>

                  {/* Play */}
                  <div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePreview(track); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: isPlaying ? '#ff5722' : '#888',
                        padding: '2px',
                      }}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} fill={isPlaying ? '#ff5722' : '#888'} />}
                    </button>
                  </div>

                  {/* Artwork */}
                  <div>
                    <img
                      src={track.artwork}
                      alt={track.title}
                      style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Title */}
                  <div style={{
                    fontSize: '14px', fontWeight: 600, color: 'white',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    paddingRight: '12px',
                  }}>
                    {track.title}
                  </div>

                  {/* Artist */}
                  <div style={{
                    fontSize: '13px', color: '#999',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {track.artist}
                  </div>

                  {/* BPM */}
                  <div style={{ textAlign: 'center', fontSize: '13px', color: '#ff5722', fontWeight: 600 }}>
                    {track.bpm}
                  </div>

                  {/* Key */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      padding: '2px 8px', borderRadius: '10px',
                      background: `${getKeyColor(track.key)}20`,
                      color: getKeyColor(track.key),
                    }}>
                      {track.key}
                    </span>
                  </div>

                  {/* Time */}
                  <div style={{ textAlign: 'center', fontSize: '13px', color: '#999' }}>
                    {track.duration}
                  </div>

                  {/* Energy */}
                  <div>{renderEnergyDots(track.energy)}</div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {isHovered && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '2px' }}
                          title="Share"
                        >
                          <Share2 size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '2px' }}
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddToMix(track); }}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#00E5FF', padding: '2px', display: 'flex', alignItems: 'center', gap: '2px',
                            fontSize: '12px', fontWeight: 600,
                          }}
                          title="Add to Mix"
                        >
                          <Plus size={14} /> Mix
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* CARD VIEW */}
      {/* ============================================ */}
      {viewMode === 'cards' && (
        <div style={{
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
        }}>
          {filteredTracks.map((track) => {
            const isPlaying = playingId === track.id;

            return (
              <div
                key={track.id}
                style={{
                  background: '#141414',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)'; }}
              >
                {/* Artwork */}
                <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                  <img
                    src={track.artwork}
                    alt={track.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Play overlay */}
                  <button
                    onClick={() => handlePreview(track)}
                    style={{
                      position: 'absolute', bottom: '8px', left: '8px',
                      background: '#ff5722', border: 'none', borderRadius: '50%',
                      width: '36px', height: '36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'white',
                      opacity: isPlaying ? 1 : 0.8,
                    }}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} fill="white" style={{ marginLeft: '2px' }} />}
                  </button>
                  {/* Energy badge */}
                  <div style={{
                    position: 'absolute', bottom: '8px', right: '8px',
                    background: 'rgba(0,0,0,0.7)', borderRadius: '4px',
                    padding: '2px 8px', fontSize: '12px', fontWeight: 600,
                    color: '#ff5722',
                  }}>
                    {track.energy}%
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '12px' }}>
                  <div style={{
                    fontSize: '14px', fontWeight: 600, color: 'white',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: '4px',
                  }}>
                    {track.title}
                  </div>
                  <div style={{
                    fontSize: '12px', color: '#888',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: '8px',
                  }}>
                    {track.artist}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#ff5722' }}>{track.bpm}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      padding: '1px 6px', borderRadius: '8px',
                      background: `${getKeyColor(track.key)}20`,
                      color: getKeyColor(track.key),
                    }}>
                      {track.key}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666', marginLeft: 'auto' }}>{track.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredTracks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
          <Music2 size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p style={{ fontSize: '16px' }}>No tracks found</p>
        </div>
      )}
    </div>
  );
};

export default DNATracksLibrary;
