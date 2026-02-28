import React, { useState, useMemo } from 'react';
import {
  Music2,
  Upload,
  Search,
  Play,
  Pause,
  Plus,
  LayoutGrid,
  List,
  Heart,
  Share2,
  Download,
} from 'lucide-react';
import { useAudioPlayer } from '../../lib/store/useAudioPlayer';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

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
  { id: '16', title: 'Silence (Tiësto Remix)', artist: 'Delerium feat. Sarah', genre: 'Trance', bpm: 138, key: 'C#m', duration: '7:05', artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', dateAdded: '2025-12-30', energy: 85 },
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

/** Minor keys: red/pink. Major keys: blue/cyan. White text, 11px, pill 32x22 */
function getKeyBadgeStyle(key: string): { background: string; color: string } {
  const isMinor = key.endsWith('m');
  return {
    background: isMinor ? '#e91e63' : '#00bcd4',
    color: '#ffffff',
  };
}

const COLUMNS: { id: string; label: string; width: number }[] = [
  { id: 'checkbox', label: '', width: 40 },
  { id: 'heart', label: '', width: 40 },
  { id: 'play', label: '', width: 40 },
  { id: 'art', label: 'ART', width: 70 },
  { id: 'title', label: 'TITLE', width: 280 },
  { id: 'artist', label: 'ARTIST', width: 150 },
  { id: 'bpm', label: 'BPM', width: 80 },
  { id: 'key', label: 'KEY', width: 80 },
  { id: 'time', label: 'TIME', width: 80 },
  { id: 'energy', label: 'ENERGY', width: 120 },
  { id: 'dateAdded', label: 'DATE', width: 120 },
  { id: 'actions', label: 'ACTIONS', width: 120 },
];

const DNATracksLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterGenre, setFilterGenre] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [detailTrack, setDetailTrack] = useState<DNATrack | null>(null);

  const { playTrack, addToQueue, currentTrack, isPlaying, togglePlay } = useAudioPlayer();

  const genres = useMemo(() => ['all', ...Array.from(new Set(mockDNATracks.map((t) => t.genre)))], []);

  const filteredTracks = useMemo(() => {
    return mockDNATracks
      .filter((track) => {
        const matchesSearch =
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = filterGenre === 'all' || track.genre === filterGenre;
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'dateAdded':
            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
          case 'title':
            return a.title.localeCompare(b.title);
          case 'artist':
            return a.artist.localeCompare(b.artist);
          case 'bpm':
            return b.bpm - a.bpm;
          case 'energy':
            return b.energy - a.energy;
          case 'key':
            return a.key.localeCompare(b.key);
          default:
            return 0;
        }
      });
  }, [searchQuery, sortBy, filterGenre]);

  const handlePreview = (track: DNATrack) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork,
      duration: track.duration,
    });
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

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const energyDots = (energy: number) => Math.min(10, Math.max(0, Math.round(energy / 10)));

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'transparent' }}>
      {/* Header */}
      <div className="px-16 py-8 border-b" style={{ borderBottomColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">DNA Tracks Library</h1>
              <p className="text-[#9e9e9e]">Your uploaded tracks with full metadata</p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#ff5722' }}
            >
              <Upload className="w-5 h-5" />
              Upload DNA Tracks
            </button>
          </div>

          {/* Search, sort, genre, List|Cards toggle */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9e9e9e]" />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-white placeholder-[#9e9e9e] focus:outline-none focus:ring-1 focus:ring-[#ff5722]/50"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#ff5722]/50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}
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
              className="px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#ff5722]/50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g === 'all' ? 'All Genres' : g}
                </option>
              ))}
            </select>

            {/* List | Cards toggle - exactly like Generated Tracks: labeled buttons, border-white/10 */}
            <div className="flex rounded-lg border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5 ${
                  viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/80'
                }`}
              >
                <List className="w-4 h-4" aria-hidden />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5 ${
                  viewMode === 'cards' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/80'
                }`}
              >
                <LayoutGrid className="w-4 h-4" aria-hidden />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-8 pb-36 px-8">
        <div className="max-w-[1400px] mx-auto">
          {viewMode === 'list' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ background: 'transparent', tableLayout: 'fixed' }}>
                <colgroup>
                  {COLUMNS.map((col) => (
                    <col key={col.id} style={{ width: col.width }} />
                  ))}
                </colgroup>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.id}
                        className="text-left uppercase font-semibold py-2 px-3 whitespace-nowrap"
                        style={{
                          fontSize: 11,
                          letterSpacing: '0.08em',
                          color: '#9e9e9e',
                          width: col.width,
                          minWidth: col.id === 'title' ? 200 : col.width,
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTracks.map((track) => {
                    const isPlayingRow = currentTrack?.id === track.id && isPlaying;
                    const isSelected = selectedIds.has(track.id);
                    const isFav = favoriteIds.has(track.id);
                    const dots = energyDots(track.energy);
                    const keyStyle = getKeyBadgeStyle(track.key);
                    return (
                      <tr
                        key={track.id}
                        onClick={() => setDetailTrack(track)}
                        className="cursor-pointer transition-colors"
                        style={{
                          height: 44,
                          background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <td className="px-3 align-middle" style={{ width: 40 }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            onClick={(e) => toggleSelect(track.id, e)}
                            className="cursor-pointer rounded"
                            style={{ width: 16, height: 16, accentColor: '#ff5722' }}
                          />
                        </td>
                        <td className="px-3 align-middle" style={{ width: 40 }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(track.id, e)}
                            className="p-0 border-0 bg-transparent cursor-pointer"
                            aria-label={isFav ? 'Unfavorite' : 'Favorite'}
                          >
                            <Heart
                              className="w-4 h-4"
                              style={{ color: isFav ? '#ff5722' : '#9e9e9e' }}
                              fill={isFav ? '#ff5722' : 'transparent'}
                            />
                          </button>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 40 }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() =>
                              isPlayingRow ? togglePlay() : handlePreview(track)
                            }
                            className="rounded-full flex items-center justify-center border-0 bg-transparent cursor-pointer hover:opacity-80"
                            style={{ width: 28, height: 28, color: isPlayingRow ? '#ff5722' : '#9e9e9e' }}
                            aria-label="Play"
                          >
                            {isPlayingRow ? (
                              <Pause className="w-3.5 h-3.5" fill="currentColor" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 70 }}>
                          <img
                            src={track.artwork}
                            alt=""
                            className="rounded object-cover flex-shrink-0"
                            style={{ width: 60, height: 60, borderRadius: 4 }}
                          />
                        </td>
                        <td className="px-3 align-middle" style={{ minWidth: 200 }}>
                          <span className="block text-white font-medium" style={{ fontSize: 13 }}>
                            {track.title}
                          </span>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 150 }}>
                          <span className="block truncate text-[#9e9e9e]" style={{ fontSize: 12 }}>
                            {track.artist}
                          </span>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 80 }}>
                          <span
                            className="font-bold rounded px-2 py-0.5"
                            style={{ color: '#ff5722', fontSize: 12 }}
                          >
                            {track.bpm}
                          </span>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 80 }}>
                          <span
                            className="inline-flex items-center justify-center rounded-full font-medium text-white"
                            style={{
                              ...keyStyle,
                              fontSize: 11,
                              width: 32,
                              height: 22,
                              minWidth: 32,
                            }}
                          >
                            {track.key}
                          </span>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 80 }}>
                          <span className="text-[#9e9e9e]" style={{ fontSize: 12 }}>
                            {track.duration}
                          </span>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 120 }}>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <span
                                key={i}
                                style={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  background: i < dots ? '#ff5722' : 'rgba(255,255,255,0.2)',
                                }}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 120 }}>
                          <span className="text-[#9e9e9e]" style={{ fontSize: 11 }}>
                            {track.dateAdded}
                          </span>
                        </td>
                        <td className="px-3 align-middle" style={{ width: 120 }} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-full flex items-center justify-center border cursor-pointer transition-colors hover:border-[#ff5722] hover:text-[#ff5722]"
                              style={{
                                width: 28,
                                height: 28,
                                background: 'transparent',
                                borderColor: 'rgba(255,255,255,0.2)',
                                color: '#9e9e9e',
                              }}
                              aria-label="Share"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="rounded-full flex items-center justify-center border cursor-pointer transition-colors hover:border-[#ff5722] hover:text-[#ff5722]"
                              style={{
                                width: 28,
                                height: 28,
                                background: 'transparent',
                                borderColor: 'rgba(255,255,255,0.2)',
                                color: '#9e9e9e',
                              }}
                              aria-label="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddToMix(track)}
                              className="rounded-lg border cursor-pointer transition-colors flex items-center gap-1 hover:border-[#ff5722] hover:text-white/80 text-white/60"
                              style={{
                                background: 'transparent',
                                borderColor: 'rgba(255,255,255,0.2)',
                                fontSize: 11,
                                padding: '4px 8px',
                              }}
                            >
                              <Plus className="w-3 h-3" /> Mix
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'cards' && (
            <div className="grid grid-cols-6 gap-4">
              {filteredTracks.map((track) => {
                const isPlayingCard = currentTrack?.id === track.id && isPlaying;
                return (
                  <div
                    key={track.id}
                    className="rounded-lg overflow-hidden border transition-all cursor-pointer hover:border-white/20"
                    style={{
                      background: 'transparent',
                      borderColor: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={track.artwork}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-semibold text-white"
                        style={{ background: 'rgba(0,0,0,0.7)' }}
                      >
                        {track.energy}%
                      </div>
                      <button
                        type="button"
                        onClick={() => (isPlayingCard ? togglePlay() : handlePreview(track))}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ background: '#ff5722' }}
                        >
                          {isPlayingCard ? (
                            <Pause className="w-5 h-5" fill="currentColor" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                          )}
                        </div>
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm truncate mb-0.5">{track.title}</h3>
                      <p className="text-[#9e9e9e] text-xs truncate mb-2">{track.artist}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{ background: 'rgba(255,87,34,0.25)', color: '#ff5722' }}
                        >
                          {track.bpm} BPM
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{ background: 'rgba(0,188,212,0.25)', color: '#00bcd4' }}
                        >
                          {track.key}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredTracks.length === 0 && (
            <div className="text-center py-20">
              <Music2 className="w-16 h-16 text-[#9e9e9e] mx-auto mb-4" />
              <p className="text-[#9e9e9e] text-lg">No tracks found</p>
            </div>
          )}
        </div>
      </div>

      <Sheet open={!!detailTrack} onOpenChange={(open) => !open && setDetailTrack(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col gap-0 border-l border-white/10 overflow-y-auto"
          style={{ background: '#1a1a1a' }}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Track Detail</SheetTitle>
          </SheetHeader>
          {detailTrack && (
            <div className="flex flex-col gap-6 pt-6 px-2">
              <div className="w-full aspect-square max-w-[280px] mx-auto rounded-xl overflow-hidden bg-white/5">
                <img src={detailTrack.artwork} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{detailTrack.title}</h2>
                <p className="text-sm text-[#9e9e9e] mt-0.5">{detailTrack.artist}</p>
                <p className="text-xs text-[#9e9e9e] mt-1">
                  {detailTrack.bpm} BPM · {detailTrack.key} · {detailTrack.duration}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9e9e9e]">Energy:</span>
                <span className="text-[#ff5722] font-medium">{detailTrack.energy}%</span>
              </div>
              <div>
                <span className="text-xs text-[#9e9e9e]">Genre:</span>
                <span
                  className="ml-2 text-xs rounded-full px-2 py-0.5"
                  style={{ background: 'rgba(255,87,34,0.25)', color: '#ff5722' }}
                >
                  {detailTrack.genre}
                </span>
              </div>
              <p className="text-xs text-[#9e9e9e]">Date added: {detailTrack.dateAdded}</p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handlePreview(detailTrack)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white text-sm font-semibold hover:opacity-90"
                  style={{ background: '#ff5722' }}
                >
                  <Play className="w-4 h-4" fill="white" />
                  Preview
                </button>
                <button
                  onClick={() => handleAddToMix(detailTrack)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-white text-sm font-semibold hover:opacity-90"
                  style={{ borderColor: '#ff5722', color: '#ff5722' }}
                >
                  <Plus className="w-4 h-4" />
                  Add to Mix
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DNATracksLibrary;
