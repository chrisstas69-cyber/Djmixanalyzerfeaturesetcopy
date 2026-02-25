import React, { useState } from 'react';
import { Play, Pause, MoreVertical, Star, Search, ChevronDown } from 'lucide-react';
import { UnifiedSidebar } from './UnifiedSidebar';

interface Track {
  id: string;
  artwork: string;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  duration: string;
  date: string;
  isFavorite: boolean;
}

interface ProfessionalLibraryProps {
  onBack?: () => void;
}

// Camelot wheel color mapping - professional colors
const getKeyColor = (key: string): string => {
  const keyColors: Record<string, string> = {
    '1A': '#E91E63', '1B': '#F06292',
    '2A': '#9C27B0', '2B': '#BA68C8',
    '3A': '#673AB7', '3B': '#9575CD',
    '4A': '#3F51B5', '4B': '#7986CB',
    '5A': '#2196F3', '5B': '#64B5F6',
    '6A': '#03A9F4', '6B': '#4FC3F7',
    '7A': '#00BCD4', '7B': '#4DD0E1',
    '8A': '#009688', '8B': '#4DB6AC',
    '9A': '#4CAF50', '9B': '#81C784',
    '10A': '#8BC34A', '10B': '#AED581',
    '11A': '#CDDC39', '11B': '#DCE775',
    '12A': '#FFC107', '12B': '#FFD54F'
  };
  return keyColors[key] || '#666666';
};

// Genre color mapping
const getGenreColor = (genre: string): { bg: string; text: string } => {
  const genreColors: Record<string, { bg: string; text: string }> = {
    'Techno': { bg: '#1E3A8A', text: '#60A5FA' },
    'Minimal': { bg: '#374151', text: '#9CA3AF' },
    'Deep House': { bg: '#581C87', text: '#A78BFA' },
    'Hard Techno': { bg: '#7F1D1D', text: '#F87171' },
    'Dub Techno': { bg: '#134E4A', text: '#5EEAD4' }
  };
  return genreColors[genre] || { bg: '#374151', text: '#9CA3AF' };
};

// Generate colorful waveform bars
const generateWaveformBars = (trackId: string): number[] => {
  const seed = trackId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bars: number[] = [];
  for (let i = 0; i < 100; i++) {
    const value = Math.sin(seed + i * 0.5) * 50 + 50 + Math.random() * 30;
    bars.push(Math.max(20, Math.min(100, value)));
  }
  return bars;
};

export function ProfessionalLibrary({ onBack }: ProfessionalLibraryProps) {
  const [tracks] = useState<Track[]>([
    {
      id: '1',
      artwork: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      name: 'Nocturnal Sequence',
      artist: 'Syntax AI',
      bpm: 128,
      key: '8A',
      genre: 'Techno',
      duration: '7:24',
      date: '3 hours ago',
      isFavorite: true
    },
    {
      id: '2',
      artwork: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      name: 'Subsonic Ritual',
      artist: 'Syntax AI',
      bpm: 135,
      key: '5A',
      genre: 'Minimal',
      duration: '6:48',
      date: '5 hours ago',
      isFavorite: false
    },
    {
      id: '3',
      artwork: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      name: 'Hypnotic Shimmer',
      artist: 'Syntax AI',
      bpm: 123,
      key: '10B',
      genre: 'Deep House',
      duration: '8:12',
      date: '1 day ago',
      isFavorite: true
    },
    {
      id: '4',
      artwork: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      name: 'Dark Matter Rise',
      artist: 'Syntax AI',
      bpm: 128,
      key: '3A',
      genre: 'Dub Techno',
      duration: '7:36',
      date: '1 day ago',
      isFavorite: false
    },
    {
      id: '5',
      artwork: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      name: 'Industrial Dawn',
      artist: 'Syntax AI',
      bpm: 133,
      key: '6A',
      genre: 'Hard Techno',
      duration: '6:33',
      date: '2 days ago',
      isFavorite: false
    }
  ]);

  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [favoriteTracks, setFavoriteTracks] = useState<Set<string>>(
    new Set(tracks.filter(t => t.isFavorite).map(t => t.id))
  );
  const [sortBy, setSortBy] = useState('date-newest');
  const [filterGenre, setFilterGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const handleSelectAll = () => {
    if (selectedTracks.size === tracks.length) {
      setSelectedTracks(new Set());
    } else {
      setSelectedTracks(new Set(tracks.map(t => t.id)));
    }
  };

  const handleSelectTrack = (trackId: string) => {
    const newSelected = new Set(selectedTracks);
    if (newSelected.has(trackId)) {
      newSelected.delete(trackId);
    } else {
      newSelected.add(trackId);
    }
    setSelectedTracks(newSelected);
  };

  const handleTogglePlay = (trackId: string) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  const handleToggleFavorite = (trackId: string) => {
    const newFavorites = new Set(favoriteTracks);
    if (newFavorites.has(trackId)) {
      newFavorites.delete(trackId);
    } else {
      newFavorites.add(trackId);
    }
    setFavoriteTracks(newFavorites);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Unified Sidebar */}
      <UnifiedSidebar onNavigate={onBack || (() => {})} currentView="library" />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Section */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-10 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Your Tracks</h1>
            <p className="text-gray-400">{tracks.length} tracks stored in your library</p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search tracks, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition-colors"
              />
            </div>

            {/* Genre Filter */}
            <div className="relative">
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors cursor-pointer"
              >
                <option value="all">All Genres</option>
                <option value="techno">Techno</option>
                <option value="minimal">Minimal</option>
                <option value="deep-house">Deep House</option>
                <option value="dub-techno">Dub Techno</option>
                <option value="hard-techno">Hard Techno</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors cursor-pointer"
              >
                <option value="date-newest">Date (Newest)</option>
                <option value="date-oldest">Date (Oldest)</option>
                <option value="name-az">Name (A-Z)</option>
                <option value="bpm-high">BPM (High-Low)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0a0a0a] z-10">
              <tr className="border-b border-[#1a1a1a]">
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedTracks.size === tracks.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-[#2a2a2a] bg-[#0f0f0f] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 w-20"></th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BPM</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waveform</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => {
                const waveformBars = generateWaveformBars(track.id);
                const genreStyle = getGenreColor(track.genre);
                
                return (
                  <tr
                    key={track.id}
                    onMouseEnter={() => setHoveredTrack(track.id)}
                    onMouseLeave={() => setHoveredTrack(null)}
                    className={`border-b border-[#1a1a1a] transition-colors h-[60px] ${
                      selectedTracks.has(track.id)
                        ? 'bg-[#ff6b35]/10'
                        : 'hover:bg-[#0f0f0f]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-6">
                      <input
                        type="checkbox"
                        checked={selectedTracks.has(track.id)}
                        onChange={() => handleSelectTrack(track.id)}
                        className="w-4 h-4 rounded border-[#2a2a2a] bg-[#0f0f0f] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0 cursor-pointer"
                      />
                    </td>

                    {/* Artwork */}
                    <td className="px-6">
                      <div
                        className="w-[60px] h-[60px] rounded-lg"
                        style={{ background: track.artwork }}
                      />
                    </td>

                    {/* Track Name */}
                    <td className="px-6">
                      <div className="text-white font-medium truncate max-w-[200px]">
                        {track.name}
                      </div>
                    </td>

                    {/* Artist */}
                    <td className="px-6">
                      <div className="text-gray-400 text-sm">{track.artist}</div>
                    </td>

                    {/* BPM */}
                    <td className="px-6">
                      <div className="text-white font-bold text-right">{track.bpm}</div>
                    </td>

                    {/* Key */}
                    <td className="px-6">
                      <div
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-bold"
                        style={{ backgroundColor: getKeyColor(track.key) }}
                      >
                        {track.key}
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="px-6">
                      <div
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: genreStyle.bg, color: genreStyle.text }}
                      >
                        {track.genre}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-6">
                      <div className="text-gray-400 text-sm font-mono">{track.duration}</div>
                    </td>

                    {/* Waveform */}
                    <td className="px-6">
                      <div className="relative h-[40px] w-[200px]">
                        <div className="absolute inset-0 flex items-center gap-0.5">
                          {waveformBars.map((height, i) => {
                            const colorIndex = Math.floor((i / waveformBars.length) * 7);
                            const colors = [
                              '#9333EA', // purple
                              '#3B82F6', // blue
                              '#06B6D4', // cyan
                              '#10B981', // green
                              '#FBBF24', // yellow
                              '#F97316', // orange
                              '#EF4444'  // red
                            ];
                            return (
                              <div
                                key={i}
                                className="flex-1 rounded-full opacity-70"
                                style={{
                                  height: `${height}%`,
                                  backgroundColor: colors[colorIndex]
                                }}
                              />
                            );
                          })}
                        </div>

                        {/* Play button overlay on hover */}
                        {hoveredTrack === track.id && (
                          <button
                            onClick={() => handleTogglePlay(track.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg"
                          >
                            <div className="w-10 h-10 bg-[#ff6b35] rounded-full flex items-center justify-center">
                              {playingTrack === track.id ? (
                                <Pause className="w-5 h-5 text-white" />
                              ) : (
                                <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                              )}
                            </div>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6">
                      <div className="text-gray-400 text-sm">{track.date}</div>
                    </td>

                    {/* Favorite */}
                    <td className="px-6">
                      <button
                        onClick={() => handleToggleFavorite(track.id)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            favoriteTracks.has(track.id)
                              ? 'fill-[#ff6b35] text-[#ff6b35]'
                              : 'text-gray-600 hover:text-gray-400'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-6">
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionMenu(openActionMenu === track.id ? null : track.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {openActionMenu === track.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenActionMenu(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-[#0f0f0f] rounded-lg border border-[#1a1a1a] shadow-xl z-20 overflow-hidden">
                              <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#1a1a1a] transition-colors">
                                Download
                              </button>
                              <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#1a1a1a] transition-colors">
                                Download Stems
                              </button>
                              <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#1a1a1a] transition-colors">
                                Add to Playlist
                              </button>
                              <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#1a1a1a] transition-colors">
                                Remix
                              </button>
                              <div className="border-t border-[#1a1a1a]">
                                <button className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-[#1a1a1a] transition-colors">
                                  Delete
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
