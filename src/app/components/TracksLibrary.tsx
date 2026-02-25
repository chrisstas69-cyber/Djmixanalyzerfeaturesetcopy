import React, { useState } from 'react';
import { Play, Pause, Download, MoreVertical, Star, Search, ChevronDown, Music, ArrowLeft } from 'lucide-react';

interface Track {
  id: string;
  coverArt?: string;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  duration: string;
  date: string;
  isFavorite: boolean;
}

interface TracksLibraryProps {
  onBack?: () => void;
}

// Camelot wheel color mapping
const getKeyColor = (key: string): string => {
  const keyColors: Record<string, string> = {
    '1A': '#E91E63', '1B': '#E91E63',
    '2A': '#9C27B0', '2B': '#9C27B0',
    '3A': '#673AB7', '3B': '#673AB7',
    '4A': '#3F51B5', '4B': '#3F51B5',
    '5A': '#2196F3', '5B': '#2196F3',
    '6A': '#03A9F4', '6B': '#03A9F4',
    '7A': '#00BCD4', '7B': '#00BCD4',
    '8A': '#009688', '8B': '#009688',
    '9A': '#4CAF50', '9B': '#4CAF50',
    '10A': '#8BC34A', '10B': '#8BC34A',
    '11A': '#CDDC39', '11B': '#CDDC39',
    '12A': '#FFC107', '12B': '#FFC107'
  };
  return keyColors[key] || '#666666';
};

export function TracksLibrary({ onBack }: TracksLibraryProps) {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'Nocturnal Sequence',
      artist: 'Syntax AI',
      bpm: 128,
      key: '8A',
      genre: 'Techno',
      duration: '7:24',
      date: '2 hours ago',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Subsonic Ritual',
      artist: 'Syntax AI',
      bpm: 126,
      key: '5A',
      genre: 'Minimal',
      duration: '6:48',
      date: '5 hours ago',
      isFavorite: false
    },
    {
      id: '3',
      name: 'Hypnotic Elements',
      artist: 'Syntax AI',
      bpm: 130,
      key: '12A',
      genre: 'Deep House',
      duration: '8:12',
      date: '1 day ago',
      isFavorite: true
    },
    {
      id: '4',
      name: 'Dark Matter Flow',
      artist: 'Syntax AI',
      bpm: 125,
      key: '3B',
      genre: 'Dub Techno',
      duration: '7:56',
      date: '2 days ago',
      isFavorite: false
    },
    {
      id: '5',
      name: 'Industrial Dawn',
      artist: 'Syntax AI',
      bpm: 132,
      key: '10A',
      genre: 'Hard Techno',
      duration: '6:32',
      date: '3 days ago',
      isFavorite: false
    }
  ]);

  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
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
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, isFavorite: !track.isFavorite } : track
      )
    );
  };

  const isEmpty = tracks.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-[60px]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#1a1a1a] border-2 border-gray-800 flex items-center justify-center">
                <Music className="w-12 h-12 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl mb-2">No tracks yet</h2>
                <p className="text-gray-400">Generate your first track in the generator</p>
              </div>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff7f4d] transition-colors"
              >
                Go to Generator
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-[60px]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Your Tracks</h1>
          <p className="text-gray-400">{tracks.length} tracks generated</p>
        </div>

        {/* Filters & Actions Bar */}
        <div className="mb-6 flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b35] transition-colors"
            />
          </div>

          {/* Filter Genre */}
          <div className="relative">
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors cursor-pointer"
            >
              <option value="all">All Genres</option>
              <option value="techno">Techno</option>
              <option value="house">House</option>
              <option value="minimal">Minimal</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors cursor-pointer"
            >
              <option value="date-newest">Date (Newest)</option>
              <option value="date-oldest">Date (Oldest)</option>
              <option value="name-az">Name (A-Z)</option>
              <option value="bpm-high">BPM (High-Low)</option>
              <option value="bpm-low">BPM (Low-High)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-[#0a0a0a]">
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedTracks.size === tracks.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-700 bg-[#1a1a1a] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                <th className="p-4 w-16"></th>
                <th className="text-left p-4 text-sm text-gray-400 font-normal">Track</th>
                <th className="text-left p-4 text-sm text-gray-400 font-normal">BPM</th>
                <th className="text-left p-4 text-sm text-gray-400 font-normal">Key</th>
                <th className="text-left p-4 text-sm text-gray-400 font-normal">Genre</th>
                <th className="text-left p-4 text-sm text-gray-400 font-normal">Duration</th>
                <th className="text-left p-4 text-sm text-gray-400 font-normal">Date</th>
                <th className="p-4 w-12"></th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr
                  key={track.id}
                  onMouseEnter={() => setHoveredTrack(track.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  className="border-b border-gray-800 hover:bg-[#0a0a0a]/50 transition-colors"
                >
                  {/* Checkbox */}
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedTracks.has(track.id)}
                      onChange={() => handleSelectTrack(track.id)}
                      className="w-4 h-4 rounded border-gray-700 bg-[#1a1a1a] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0 cursor-pointer"
                    />
                  </td>

                  {/* Cover Art */}
                  <td className="p-4">
                    <div className="relative w-[60px] h-[60px] bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden group">
                      {track.coverArt ? (
                        <img src={track.coverArt} alt={track.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                      {hoveredTrack === track.id && (
                        <button
                          onClick={() => handleTogglePlay(track.id)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity"
                        >
                          {playingTrack === track.id ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Track Name */}
                  <td className="p-4">
                    <div>
                      <div className="text-white text-sm mb-0.5">{track.name}</div>
                      <div className="text-gray-400 text-xs">{track.artist}</div>
                    </div>
                  </td>

                  {/* BPM */}
                  <td className="p-4">
                    <span className="text-sm text-white">{track.bpm}</span>
                  </td>

                  {/* Key (Color-coded) */}
                  <td className="p-4">
                    <span
                      className="inline-flex items-center justify-center px-3 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getKeyColor(track.key) }}
                    >
                      {track.key}
                    </span>
                  </td>

                  {/* Genre */}
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#0a0a0a] text-gray-300 border border-gray-800">
                      {track.genre}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="p-4">
                    <span className="text-sm text-gray-400">{track.duration}</span>
                  </td>

                  {/* Date */}
                  <td className="p-4">
                    <span className="text-sm text-gray-400">{track.date}</span>
                  </td>

                  {/* Favorite */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFavorite(track.id)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          track.isFavorite
                            ? 'fill-[#ff6b35] text-[#ff6b35]'
                            : 'text-gray-600 hover:text-gray-400'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenActionMenu(openActionMenu === track.id ? null : track.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openActionMenu === track.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenActionMenu(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a1a] rounded-lg border border-gray-800 shadow-xl z-20 overflow-hidden">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                              Download Stems
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                              Remix
                            </button>
                            <div className="border-t border-gray-800">
                              <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800 transition-colors">
                                Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <button className="text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            Previous
          </button>
          <span className="text-gray-400">Page 1 of 1</span>
          <button className="text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}