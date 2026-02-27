import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Play, Star, Share2, Download, X, List, LayoutGrid, Plus } from 'lucide-react';
import { useAudioPlayer } from '../../lib/store/useAudioPlayer';

interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  duration: string;
  artwork: string;
  dateCreated: string;
  energy: number;
  aiModel: string;
  prompt?: string;
  royaltySplit?: { creator: number; dnaArtist: number; platform: number };
}

const KEY_COLORS: Record<string, string> = {
  C: '#e11d48', 'C#': '#f97316', D: '#eab308', 'D#': '#84cc16', E: '#22c55e', F: '#14b8a6',
  'F#': '#06b6d4', G: '#3b82f6', 'G#': '#8b5cf6', A: '#a855f7', 'A#': '#d946ef', B: '#ec4899',
  Cm: '#64748b', 'C#m': '#475569', Dm: '#0ea5e9', 'D#m': '#6366f1', Em: '#a855f7', Fm: '#d946ef',
  'F#m': '#f43f5e', Gm: '#f97316', 'G#m': '#eab308', Am: '#22c55e', 'A#m': '#14b8a6', Bm: '#06b6d4',
};

// Camelot key colors for list view pills
const LIST_KEY_COLORS: Record<string, string> = {
  Am: '#FF6B6B', Em: '#FF8E53', Bm: '#FFA726', 'F#m': '#FFCC02', 'C#m': '#C6E03A', 'G#m': '#69D84F',
  Ebm: '#00D4FF', Bbm: '#00B4D8', Fm: '#0096C7', Cm: '#0077B6', Gm: '#023E8A', Dm: '#7B2FBE',
  A: '#FF6B6B88', E: '#FF8E5388', B: '#FFA72688', 'F#': '#FFCC0288', Db: '#C6E03A88', Ab: '#69D84F88',
  Eb: '#00D4FF88', Bb: '#00B4D888', F: '#0096C788', C: '#0077B688', G: '#023E8A88', D: '#7B2FBE88',
};

const ARTWORK_URLS = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
  'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
  'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400',
  'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=400',
];

const mockGeneratedTracks: GeneratedTrack[] = [
  { id: '1', title: 'Synthetic Dreams', artist: 'AI Generated', genre: 'Progressive House', bpm: 128, key: 'Am', duration: '6:45', artwork: ARTWORK_URLS[0], dateCreated: '2026-01-14', energy: 82, aiModel: 'SYNTAX v1.0', prompt: 'Create a progressive house track with lush chords, warm pads, and a driving 4/4 groove. Melodic and euphoric.', royaltySplit: { creator: 40, dnaArtist: 40, platform: 20 } },
  { id: '2', title: 'Digital Horizon', artist: 'AI Generated', genre: 'Techno', bpm: 132, key: 'Fm', duration: '7:20', artwork: ARTWORK_URLS[1], dateCreated: '2026-01-13', energy: 88, aiModel: 'SYNTAX v1.0', prompt: 'Dark techno with industrial percussion and hypnotic bassline.' },
  { id: '3', title: 'Neon Pulse', artist: 'AI Generated', genre: 'Deep Tech', bpm: 125, key: 'C#m', duration: '6:55', artwork: ARTWORK_URLS[2], dateCreated: '2026-01-12', energy: 76, aiModel: 'SYNTAX v1.0' },
  { id: '4', title: 'Electric Soul', artist: 'AI Generated', genre: 'Melodic House', bpm: 124, key: 'Dm', duration: '7:10', artwork: ARTWORK_URLS[3], dateCreated: '2026-01-11', energy: 74, aiModel: 'SYNTAX v1.0' },
  { id: '5', title: 'Cyber Revolution', artist: 'AI Generated', genre: 'Hard Techno', bpm: 138, key: 'Gm', duration: '6:30', artwork: ARTWORK_URLS[4], dateCreated: '2026-01-10', energy: 91, aiModel: 'SYNTAX v1.0' },
  { id: '6', title: 'Aurora Waves', artist: 'AI Generated', genre: 'Trance', bpm: 140, key: 'Em', duration: '8:00', artwork: ARTWORK_URLS[5], dateCreated: '2026-01-09', energy: 85, aiModel: 'SYNTAX v1.0' },
  { id: '7', title: 'Midnight Drive', artist: 'SYNTAX AI', genre: 'Progressive House', bpm: 126, key: 'Bm', duration: '6:52', artwork: ARTWORK_URLS[6], dateCreated: '2026-01-08', energy: 79, aiModel: 'SYNTAX v1.0' },
  { id: '8', title: 'Velvet Room', artist: 'AI Generated', genre: 'Deep House', bpm: 120, key: 'Ab', duration: '7:15', artwork: ARTWORK_URLS[7], dateCreated: '2026-01-07', energy: 68, aiModel: 'SYNTAX v1.0' },
  { id: '9', title: 'Circuit Breaker', artist: 'AI Generated', genre: 'Techno', bpm: 134, key: 'G#m', duration: '6:40', artwork: ARTWORK_URLS[8], dateCreated: '2026-01-06', energy: 87, aiModel: 'SYNTAX v1.0' },
  { id: '10', title: 'Fading Lights', artist: 'SYNTAX AI', genre: 'Melodic House', bpm: 122, key: 'F#m', duration: '7:08', artwork: ARTWORK_URLS[9], dateCreated: '2026-01-05', energy: 72, aiModel: 'SYNTAX v1.0' },
  { id: '11', title: 'Suburban Nights', artist: 'AI Generated', genre: 'Progressive House', bpm: 128, key: 'Ebm', duration: '6:58', artwork: ARTWORK_URLS[0], dateCreated: '2026-01-04', energy: 81, aiModel: 'SYNTAX v1.0' },
  { id: '12', title: 'Glass City', artist: 'AI Generated', genre: 'Deep Tech', bpm: 127, key: 'Cm', duration: '7:22', artwork: ARTWORK_URLS[1], dateCreated: '2026-01-03', energy: 84, aiModel: 'SYNTAX v1.0' },
  { id: '13', title: 'Pulse Width', artist: 'SYNTAX AI', genre: 'Techno', bpm: 136, key: 'Dm', duration: '6:35', artwork: ARTWORK_URLS[2], dateCreated: '2026-01-02', energy: 90, aiModel: 'SYNTAX v1.0' },
  { id: '14', title: 'Echo Chamber', artist: 'AI Generated', genre: 'Trance', bpm: 138, key: 'A', duration: '7:45', artwork: ARTWORK_URLS[3], dateCreated: '2026-01-01', energy: 86, aiModel: 'SYNTAX v1.0' },
  { id: '15', title: 'Low Frequency', artist: 'AI Generated', genre: 'Hard Techno', bpm: 142, key: 'Fm', duration: '6:18', artwork: ARTWORK_URLS[4], dateCreated: '2025-12-31', energy: 93, aiModel: 'SYNTAX v1.0' },
  { id: '16', title: 'Static Bliss', artist: 'SYNTAX AI', genre: 'Melodic House', bpm: 123, key: 'G', duration: '7:30', artwork: ARTWORK_URLS[5], dateCreated: '2025-12-30', energy: 75, aiModel: 'SYNTAX v1.0' },
  { id: '17', title: 'Neon Skies', artist: 'AI Generated', genre: 'Progressive House', bpm: 129, key: 'Bbm', duration: '6:48', artwork: ARTWORK_URLS[6], dateCreated: '2025-12-29', energy: 80, aiModel: 'SYNTAX v1.0' },
  { id: '18', title: 'Binary Love', artist: 'AI Generated', genre: 'Deep House', bpm: 118, key: 'Eb', duration: '7:55', artwork: ARTWORK_URLS[7], dateCreated: '2025-12-28', energy: 66, aiModel: 'SYNTAX v1.0' },
  { id: '19', title: 'Phantom Bass', artist: 'SYNTAX AI', genre: 'Techno', bpm: 131, key: 'Am', duration: '6:42', artwork: ARTWORK_URLS[8], dateCreated: '2025-12-27', energy: 83, aiModel: 'SYNTAX v1.0' },
  { id: '20', title: 'Dawn Breaker', artist: 'AI Generated', genre: 'Trance', bpm: 139, key: 'C#m', duration: '8:12', artwork: ARTWORK_URLS[9], dateCreated: '2025-12-26', energy: 88, aiModel: 'SYNTAX v1.0' },
  { id: '21', title: 'Concrete Jungle', artist: 'AI Generated', genre: 'Hard Techno', bpm: 137, key: 'Gm', duration: '6:25', artwork: ARTWORK_URLS[0], dateCreated: '2025-12-25', energy: 89, aiModel: 'SYNTAX v1.0' },
  { id: '22', title: 'Liquid State', artist: 'SYNTAX AI', genre: 'Melodic House', bpm: 124, key: 'D', duration: '7:02', artwork: ARTWORK_URLS[1], dateCreated: '2025-12-24', energy: 77, aiModel: 'SYNTAX v1.0' },
  { id: '23', title: 'Blackout Zone', artist: 'AI Generated', genre: 'Deep Tech', bpm: 126, key: 'F', duration: '6:50', artwork: ARTWORK_URLS[2], dateCreated: '2025-12-23', energy: 82, aiModel: 'SYNTAX v1.0' },
  { id: '24', title: 'Solar Flare', artist: 'AI Generated', genre: 'Progressive House', bpm: 130, key: 'Em', duration: '7:18', artwork: ARTWORK_URLS[3], dateCreated: '2025-12-22', energy: 85, aiModel: 'SYNTAX v1.0' },
  { id: '25', title: 'Zero Gravity', artist: 'SYNTAX AI', genre: 'Techno', bpm: 133, key: 'Bm', duration: '6:55', artwork: ARTWORK_URLS[4], dateCreated: '2025-12-21', energy: 86, aiModel: 'SYNTAX v1.0' },
  { id: '26', title: 'Crystal Method', artist: 'AI Generated', genre: 'Trance', bpm: 141, key: 'A', duration: '7:38', artwork: ARTWORK_URLS[5], dateCreated: '2025-12-20', energy: 91, aiModel: 'SYNTAX v1.0' },
  { id: '27', title: 'Dark Matter', artist: 'AI Generated', genre: 'Hard Techno', bpm: 135, key: 'Cm', duration: '6:33', artwork: ARTWORK_URLS[6], dateCreated: '2025-12-19', energy: 92, aiModel: 'SYNTAX v1.0' },
  { id: '28', title: 'Soft Focus', artist: 'SYNTAX AI', genre: 'Melodic House', bpm: 121, key: 'G#m', duration: '7:44', artwork: ARTWORK_URLS[7], dateCreated: '2025-12-18', energy: 70, aiModel: 'SYNTAX v1.0' },
  { id: '29', title: 'Rave Signal', artist: 'AI Generated', genre: 'Deep House', bpm: 125, key: 'Db', duration: '7:12', artwork: ARTWORK_URLS[8], dateCreated: '2025-12-17', energy: 78, aiModel: 'SYNTAX v1.0' },
  { id: '30', title: 'Final Sequence', artist: 'AI Generated', genre: 'Progressive House', bpm: 127, key: 'Am', duration: '6:59', artwork: ARTWORK_URLS[9], dateCreated: '2025-12-16', energy: 83, aiModel: 'SYNTAX v1.0' },
];

const GeneratedTracksLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [filterGenre, setFilterGenre] = useState('all');
  const [selectedTrack, setSelectedTrack] = useState<GeneratedTrack | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>(['play', 'art', 'title', 'artist', 'bpm', 'key', 'time', 'energy', 'date', 'actions']);
  const [shareModalTrack, setShareModalTrack] = useState<GeneratedTrack | null>(null);
  const [shareModalTab, setShareModalTab] = useState<'share' | 'embed' | 'message'>('share');
  const [shareMessage, setShareMessage] = useState('');
  const [shareTimeAt, setShareTimeAt] = useState('0:00');
  const [toastAddToMix, setToastAddToMix] = useState(false);
  const [regenerateImageOpen, setRegenerateImageOpen] = useState(false);
  const [regenerateImageDescription, setRegenerateImageDescription] = useState('');

  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    if (!toastAddToMix) return;
    const t = setTimeout(() => setToastAddToMix(false), 2000);
    return () => clearTimeout(t);
  }, [toastAddToMix]);

  const genres = ['all', ...Array.from(new Set(mockGeneratedTracks.map(t => t.genre)))];

  const filteredTracks = mockGeneratedTracks
    .filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = filterGenre === 'all' || track.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateCreated':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'bpm':
          return b.bpm - a.bpm;
        case 'energy':
          return b.energy - a.energy;
        default:
          return 0;
      }
    });

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
        {/* Header */}
      <div className="px-16 py-8 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                Generated Tracks
                <Sparkles className="w-8 h-8 text-[#00E5FF]" />
              </h1>
              <p className="text-gray-400">AI-generated tracks from your DNA library</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search generated tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00E5FF]/50"
              />
        </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
            >
              <option value="dateCreated">Date Created</option>
              <option value="title">Title</option>
              <option value="bpm">BPM</option>
              <option value="energy">Energy</option>
            </select>

            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>

            {/* List / Cards view toggle */}
            <div className="flex rounded-md overflow-hidden border border-[#222] bg-[#111]" style={{ border: '1px solid #222' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
                style={{
                  background: viewMode === 'list' ? '#1a1a1a' : '#111',
                  border: viewMode === 'list' ? '1px solid #00D4FF' : '1px solid #222',
                  color: viewMode === 'list' ? '#00D4FF' : '#555',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <List className="w-4 h-4" />
                List
          </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
                style={{
                  background: viewMode === 'cards' ? '#1a1a1a' : '#111',
                  border: viewMode === 'cards' ? '1px solid #00D4FF' : '1px solid #222',
                  color: viewMode === 'cards' ? '#00D4FF' : '#555',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <LayoutGrid className="w-4 h-4" />
                Cards
          </button>
            </div>
          </div>
        </div>
      </div>

      {/* List view - table */}
      {viewMode === 'list' && (
        <div
          className="flex-1 overflow-auto py-6"
          style={{ maxHeight: 'calc(100vh - 180px)', width: '100%', maxWidth: '100%', padding: '0 24px', boxSizing: 'border-box' }}
        >
          <div className="overflow-x-auto overflow-y-auto w-full" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <table className="w-full border-collapse" style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead className="sticky top-0 z-10" style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
                <tr>
                  <th className="uppercase text-left" style={{ fontSize: 11, color: '#444', letterSpacing: '0.08em', padding: '0 12px', height: 36, width: 40 }} />
                  <th className="uppercase text-left" style={{ fontSize: 11, color: '#444', letterSpacing: '0.08em', padding: '0 12px', height: 36, width: 40 }} />
                  {columns.map((colId, index) => {
                    const labels: Record<string, string> = { play: '', art: 'ART', title: 'TITLE', artist: 'ARTIST', bpm: 'BPM', key: 'KEY', time: 'TIME', energy: 'ENERGY', date: 'DATE', actions: 'ACTIONS' };
                    return (
                      <th
                        key={colId}
                        className="uppercase text-left select-none"
                        draggable
                        onDragStart={(e) => { e.dataTransfer.setData('text/plain', index.toString()); e.dataTransfer.effectAllowed = 'move'; (e.target as HTMLElement).style.cursor = 'grabbing'; }}
                        onDragEnd={(e) => { (e.target as HTMLElement).style.cursor = 'grab'; }}
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
                          const to = index;
                          if (from === to) return;
                          const newCols = [...columns];
                          newCols.splice(to, 0, newCols.splice(from, 1)[0]);
                          setColumns(newCols);
                        }}
                        style={{
                          fontSize: 11,
                          color: '#444',
                          letterSpacing: '0.08em',
                          padding: '0 12px',
                          height: 36,
                          cursor: 'grab',
                        }}
                      >
                        {labels[colId] ?? colId}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track, rowIndex) => {
                  const keyBg = LIST_KEY_COLORS[track.key] ?? '#00D4FF';
                  const filledDots = Math.round((track.energy / 100) * 8);
                  const isFav = favoriteIds.has(track.id);
                  const isPlaying = playingTrackId === track.id;
                  const renderCell = (colId: string) => {
                    switch (colId) {
                      case 'play':
                        return (
                          <td key="play" style={{ padding: '0 12px', width: 36, verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                setPlayingTrackId(track.id);
                                playTrack({ id: track.id, title: track.title, artist: track.artist, artwork: track.artwork, duration: track.duration });
                              }}
                              className="rounded-full flex items-center justify-center flex-shrink-0 border-0 bg-transparent cursor-pointer"
                              style={{ width: 28, height: 28, color: isPlaying ? '#00D4FF' : '#444' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#00D4FF'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = isPlaying ? '#00D4FF' : '#444'; }}
                              aria-label="Play"
                            >
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" style={{ color: 'inherit' }} />
          </button>
                          </td>
                        );
                      case 'art':
                        return (
                          <td key="art" style={{ padding: '0 12px', verticalAlign: 'middle' }}>
                            <img src={track.artwork} alt="" className="rounded object-cover" style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }} />
                          </td>
                        );
                      case 'title':
                        return (
                          <td key="title" style={{ padding: '0 12px', verticalAlign: 'middle', maxWidth: 200 }}>
                            <span className="block truncate" style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{track.title}</span>
                          </td>
                        );
                      case 'artist':
                        return (
                          <td key="artist" style={{ padding: '0 12px', verticalAlign: 'middle' }}>
                            <span className="block truncate" style={{ color: '#666', fontSize: 12 }}>{track.artist}</span>
                          </td>
                        );
                      case 'bpm':
                        return (
                          <td key="bpm" style={{ padding: '0 12px', verticalAlign: 'middle' }}>
                            <span className="font-bold rounded-full inline-block" style={{ background: '#00D4FF22', color: '#00D4FF', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{track.bpm}</span>
                          </td>
                        );
                      case 'key':
                        return (
                          <td key="key" style={{ padding: '0 12px', verticalAlign: 'middle' }}>
                            <span className="font-bold rounded-full inline-block" style={{ background: keyBg, color: keyBg.endsWith('88') ? '#fff' : '#000', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{track.key}</span>
                          </td>
                        );
                      case 'time':
                        return (
                          <td key="time" style={{ padding: '0 12px', color: '#555', fontSize: 12, verticalAlign: 'middle' }}>{track.duration}</td>
                        );
                      case 'energy':
                        return (
                          <td key="energy" style={{ padding: '0 12px', verticalAlign: 'middle' }}>
                            <div className="flex items-center gap-0.5" style={{ gap: 2 }}>
                              {Array.from({ length: 8 }).map((_, i) => (
                                <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i < filledDots ? '#00D4FF' : '#222' }} />
                              ))}
                            </div>
                          </td>
                        );
                      case 'date':
                        return (
                          <td key="date" style={{ padding: '0 12px', color: '#555', fontSize: 11, verticalAlign: 'middle' }}>{track.dateCreated}</td>
                        );
                      case 'actions':
                        return (
                          <td key="actions" style={{ padding: '0 12px', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5" style={{ gap: 6 }}>
                              <button type="button" onClick={() => setShareModalTrack(track)} className="rounded-full flex items-center justify-center flex-shrink-0 border cursor-pointer transition-colors" style={{ width: 28, height: 28, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00D4FF'; e.currentTarget.style.color = '#00D4FF'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666'; }} aria-label="Share"><Share2 className="w-3 h-3" /></button>
                              <button type="button" onClick={() => {}} className="rounded-full flex items-center justify-center flex-shrink-0 border cursor-pointer" style={{ width: 28, height: 28, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00D4FF'; e.currentTarget.style.color = '#00D4FF'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666'; }} aria-label="Download"><Download className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setToastAddToMix(true)} className="rounded-xl border cursor-pointer transition-colors flex items-center gap-1" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', fontSize: 10, padding: '4px 8px', borderRadius: 12 }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff6b2b'; e.currentTarget.style.color = '#ff6b2b'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666'; }}><Plus className="w-3 h-3" /> Mix</button>
                            </div>
                          </td>
                        );
                      default:
                        return <td key={colId} style={{ padding: '0 12px', verticalAlign: 'middle' }} />;
                    }
                  };
                  return (
                    <tr
                      key={track.id}
                      onClick={() => setSelectedTrack(track)}
                      className="cursor-pointer transition-colors"
                      style={{
                        height: 52,
                        background: rowIndex % 2 === 0 ? '#0d0d0d' : '#111111',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1a1a1a';
                        e.currentTarget.style.borderLeft = '2px solid #00D4FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = rowIndex % 2 === 0 ? '#0d0d0d' : '#111111';
                        e.currentTarget.style.borderLeft = 'none';
                      }}
                    >
                      <td style={{ padding: '0 12px', width: 40, verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="cursor-pointer" style={{ width: 16, height: 16, border: '1px solid #333', borderRadius: 3 }} />
                      </td>
                      <td style={{ padding: '0 12px', width: 40, verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setFavoriteIds((prev) => {
                              const n = new Set(prev);
                              if (n.has(track.id)) n.delete(track.id);
                              else n.add(track.id);
                              return n;
                            });
                          }}
                          className="p-0 border-0 bg-transparent cursor-pointer"
                          aria-label={isFav ? 'Unfavorite' : 'Favorite'}
                        >
                          <Star className="w-4 h-4" style={{ color: isFav ? '#FFD700' : '#333' }} fill={isFav ? '#FFD700' : 'transparent'} />
          </button>
                      </td>
                      {columns.map((colId) => renderCell(colId))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredTracks.length === 0 && (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No generated tracks yet</p>
            </div>
          )}
        </div>
      )}

      {/* Share modal (SoundCloud-style) */}
      {shareModalTrack && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 1000 }} onClick={() => { setShareModalTrack(null); setShareModalTab('share'); setShareMessage(''); setShareTimeAt('0:00'); }}>
          <div className="rounded-xl overflow-hidden border shadow-2xl" style={{ width: 480, background: '#1a1a1a', border: '1px solid #2a2a2a', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => { setShareModalTrack(null); setShareModalTab('share'); }} className="absolute border-0 bg-transparent cursor-pointer" style={{ top: 12, right: 16, color: '#555', fontSize: 18 }} aria-label="Close"><X className="w-5 h-5" /></button>
            <div className="flex border-b" style={{ background: '#111', borderBottom: '1px solid #2a2a2a' }}>
              {(['share', 'embed', 'message'] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => setShareModalTab(tab)} className="capitalize cursor-pointer border-0 bg-transparent" style={{ padding: '14px 24px', fontSize: 14, color: shareModalTab === tab ? '#fff' : '#666', borderBottom: shareModalTab === tab ? '2px solid #fff' : '2px solid transparent' }}>{tab}</button>
              ))}
            </div>
            {shareModalTab === 'share' && (
              <div style={{ padding: 20 }}>
                <div className="flex gap-3 mb-5" style={{ marginBottom: 20 }}>
                  <img src={shareModalTrack.artwork} alt="" className="rounded-lg flex-shrink-0" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate" style={{ fontSize: 13, fontWeight: 600 }}>{shareModalTrack.artist}</p>
                    <p className="text-gray-400 truncate" style={{ fontSize: 12 }}>{shareModalTrack.title}</p>
                    <div className="mt-1 flex items-center gap-2" style={{ height: 32 }}>
                      <div className="flex items-center gap-0.5" style={{ gap: 2 }}>{[1,2,3,4,5,6,7,8,9,10].map((i) => <span key={i} style={{ width: 3, height: 12 + (i % 3) * 4, background: '#555', borderRadius: 1 }} />)}</div>
                      <span className="text-gray-500 ml-auto" style={{ fontSize: 11 }}>{shareModalTrack.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-5" style={{ gap: 10, marginBottom: 20 }}>
                  {[{ name: 'Twitter', bg: '#1DA1F2', icon: '𝕏' }, { name: 'Facebook', bg: '#1877F2', icon: 'f' }, { name: 'Tumblr', bg: '#35465C', icon: 't' }, { name: 'Pinterest', bg: '#E60023', icon: 'P' }, { name: 'Email', bg: '#333', icon: '✉' }].map((s) => (
                    <button key={s.name} type="button" className="rounded-full flex items-center justify-center text-white cursor-pointer border-0" style={{ width: 44, height: 44, background: s.bg, fontSize: 18 }} title={s.name}>{s.icon}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2" style={{ gap: 8 }}>
                  <input readOnly value={`https://syntaxaudio.ai/track/${shareModalTrack.id}`} className="flex-1 rounded-lg border box-border" style={{ background: '#111', border: '1px solid #333', color: '#aaa', fontSize: 12, padding: '10px 14px' }} />
                  <span style={{ color: '#555', fontSize: 12, alignSelf: 'center' }}>at</span>
                  <input value={shareTimeAt} onChange={(e) => setShareTimeAt(e.target.value)} className="rounded-lg border box-border" style={{ background: '#111', border: '1px solid #333', color: '#aaa', fontSize: 12, padding: 10, width: 60 }} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#666', fontSize: 12, marginTop: 10 }}>
                  <input type="checkbox" className="rounded" />
                  <span>Shorten link</span>
                </label>
              </div>
            )}
            {shareModalTab === 'embed' && (
              <div style={{ padding: 20 }}>
                <textarea readOnly value={`<iframe src="https://syntaxaudio.ai/embed/${shareModalTrack.id}" width="100%" height="166" frameborder="0" allow="autoplay" />`} className="w-full rounded-lg border box-border resize-none" style={{ background: '#111', border: '1px solid #333', color: '#666', fontSize: 11, padding: 12, height: 80 }} />
              </div>
            )}
            {shareModalTab === 'message' && (
              <div style={{ padding: 20 }}>
                <textarea placeholder="Write a message..." value={shareMessage} onChange={(e) => setShareMessage(e.target.value)} className="w-full rounded-lg border box-border resize-none placeholder-gray-500" style={{ background: '#111', border: '1px solid #333', color: '#aaa', fontSize: 13, padding: 12, height: 80 }} />
                <button type="button" className="w-full rounded-lg border-0 cursor-pointer mt-2" style={{ background: '#333', color: '#fff', borderRadius: 8, padding: 10, marginTop: 10 }}>Send</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast: Added to DJ Mix */}
      {toastAddToMix && (
        <div className="fixed rounded-lg border flex items-center gap-2" style={{ bottom: 24, right: 24, background: '#1a1a1a', border: '1px solid #00D4FF', color: '#00D4FF', padding: '10px 16px', borderRadius: 8, fontSize: 12, zIndex: 9999 }}>
          Added to DJ Mix ✓
        </div>
      )}

      {/* Track Grid — cards view (only when viewMode === 'cards') */}
      {viewMode === 'cards' && (
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 180px)',
          overflowY: 'auto',
          padding: '32px 24px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
              gap: '16px',
            }}
          >
            {filteredTracks.map((track) => (
              <div
              key={track.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedTrack(track)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedTrack(track); } }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                  <img
                    src={track.artwork}
                    alt={track.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    className="absolute font-bold"
                    style={{
                      bottom: 8,
                      right: 6,
                      background: 'rgba(0,0,0,0.65)',
                      color: '#00E5FF',
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {track.energy}%
                  </span>
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 className="truncate" style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                    {track.title}
                  </h3>
                  <p className="truncate" style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
                    {track.artist}
                  </p>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                    <span style={{ background: 'rgba(255,107,0,0.2)', color: '#FF6B00', padding: '2px 8px', borderRadius: 20 }}>
                      {track.bpm} BPM
                    </span>
                    <span style={{ background: 'rgba(0,229,255,0.2)', color: '#00E5FF', padding: '2px 8px', borderRadius: 20 }}>
                      {track.key}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTracks.length === 0 && (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No generated tracks yet</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Side panel - fixed right, 220px, always visible when selected */}
      <div
        className="fixed top-0 right-0 h-full overflow-y-auto transition-transform duration-300 ease-out"
        style={{
          width: 220,
          background: '#111',
          borderLeft: '1px solid #1a1a1a',
          zIndex: 500,
          boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
          padding: 0,
          transform: selectedTrack ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {selectedTrack && (
          <>
            {/* 1. Artwork - full width, square, edge to edge; close + 🎨 overlay */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1' }}>
              <img src={selectedTrack.artwork} alt="" className="w-full h-full object-cover block" style={{ display: 'block' }} />
              <button
                type="button"
                onClick={() => setSelectedTrack(null)}
                className="absolute border-none cursor-pointer bg-transparent"
                style={{ top: 10, right: 10, color: '#555', fontSize: 16 }}
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setRegenerateImageOpen(true); }}
                className="absolute border font-normal cursor-pointer"
                style={{
                  bottom: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid #444',
                  color: '#aaa',
                  fontSize: 10,
                  padding: '5px 8px',
                  borderRadius: 6,
                }}
                title="Regenerate cover art"
              >
                🎨
              </button>
            </div>

            {/* 2. Info block - padding 16px */}
            <div style={{ padding: 16 }}>
              <h2 className="text-white truncate" style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{selectedTrack.title}</h2>
              <p className="text-[#666] truncate" style={{ fontSize: 12, marginBottom: 10 }}>{selectedTrack.artist}</p>
              <p className="text-[#555]" style={{ fontSize: 11, marginBottom: 14 }}>{selectedTrack.bpm} BPM · {selectedTrack.key} · {selectedTrack.duration}</p>

              {/* 3. Action buttons row */}
              <div className="flex items-center gap-2" style={{ gap: 8, marginBottom: 18 }}>
                <button
                  type="button"
                  onClick={() => playTrack({ id: selectedTrack.id, title: selectedTrack.title, artist: selectedTrack.artist, artwork: selectedTrack.artwork, duration: selectedTrack.duration })}
                  className="rounded-full flex items-center justify-center flex-shrink-0 text-black"
                  style={{ width: 36, height: 36, background: '#00D4FF', fontSize: 14 }}
                  aria-label="Play"
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </button>
                <button type="button" className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666' }} aria-label="Favorite">
                  <Star className="w-4 h-4" />
                </button>
                <button type="button" className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666' }} aria-label="Share">
                  <Share2 className="w-4 h-4" />
                </button>
                <button type="button" className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666' }} aria-label="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* 4. PROMPT USED */}
              <div style={{ marginBottom: 18 }}>
                <p className="uppercase" style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em', marginBottom: 6 }}>PROMPT USED</p>
                <div
                  className="italic"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #1a1a1a',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: '#666',
                    fontSize: 11,
                    lineHeight: 1.7,
                  }}
                >
                  {selectedTrack.prompt?.trim() || 'No prompt recorded for this track.'}
                </div>
              </div>

              {/* 5. ROYALTY SPLIT */}
              <div style={{ marginBottom: 20 }}>
                <p className="uppercase" style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em', marginBottom: 8 }}>ROYALTY SPLIT</p>
                <div className="flex justify-between" style={{ marginBottom: 4 }}><span style={{ color: '#666', fontSize: 12 }}>Creator</span><span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{selectedTrack.royaltySplit?.creator ?? 40}%</span></div>
                <div className="flex justify-between" style={{ marginBottom: 4 }}><span style={{ color: '#666', fontSize: 12 }}>DNA Artist</span><span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{selectedTrack.royaltySplit?.dnaArtist ?? 40}%</span></div>
                <div className="flex justify-between"><span style={{ color: '#666', fontSize: 12 }}>Platform</span><span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{selectedTrack.royaltySplit?.platform ?? 20}%</span></div>
              </div>

              {/* 6. Generate more like this */}
              <button
                type="button"
                className="w-full text-white font-bold flex items-center justify-center gap-2 cursor-pointer border-0"
                style={{
                  background: 'linear-gradient(90deg, #ff6b2b, #ff4500)',
                  borderRadius: 8,
                  padding: '12px 0',
                  fontSize: 13,
                }}
              >
                <Sparkles className="w-4 h-4" />
                Generate more like this
              </button>
            </div>
          </>
        )}
      </div>

      {/* Regenerate Cover Art modal */}
      {regenerateImageOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', zIndex: 1000 }}
          onClick={() => { setRegenerateImageOpen(false); setRegenerateImageDescription(''); }}
        >
          <div
            className="w-full max-w-[360px] mx-auto"
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 14,
              padding: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold mb-1" style={{ fontSize: 15, marginBottom: 6 }}>Regenerate Cover Art</h3>
            <p className="text-gray-400 mb-3" style={{ fontSize: 12, marginBottom: 14 }}>Costs 2 credits</p>
            <textarea
              placeholder="e.g. Dark underground club, neon lights..."
              value={regenerateImageDescription}
              onChange={(e) => setRegenerateImageDescription(e.target.value)}
              rows={4}
              className="w-full resize-none focus:outline-none focus:border-[#00D4FF]/50 mb-3 box-border"
              style={{
                background: '#111',
                border: '1px solid #333',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                padding: 12,
                marginBottom: 14,
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setRegenerateImageOpen(false); setRegenerateImageDescription(''); }}
                className="flex-1 rounded-lg border font-medium cursor-pointer"
                style={{ background: '#0d0d0d', borderColor: '#333', color: '#888', padding: 10 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { setRegenerateImageOpen(false); setRegenerateImageDescription(''); }}
                className="flex-[2] rounded-lg font-bold text-white flex items-center justify-center gap-2 cursor-pointer border-0"
                style={{
                  background: 'linear-gradient(90deg, #00c8ff, #0099ff)',
                  padding: 10,
                }}
              >
                <Sparkles className="w-4 h-4" />
                Generate Image (2 credits)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { GeneratedTracksLibrary };