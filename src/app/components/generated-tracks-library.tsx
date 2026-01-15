import React, { useState } from 'react';
import { Music2, Search, SlidersHorizontal, Sparkles } from 'lucide-react';

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
}

const mockGeneratedTracks: GeneratedTrack[] = [
  { id: '1', title: 'Synthetic Dreams', artist: 'AI Generated', genre: 'Progressive House', bpm: 128, key: 'Am', duration: '6:45', artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', dateCreated: '2026-01-14', energy: 82, aiModel: 'SYNTAX v1.0' },
  { id: '2', title: 'Digital Horizon', artist: 'AI Generated', genre: 'Techno', bpm: 132, key: 'Fm', duration: '7:20', artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', dateCreated: '2026-01-13', energy: 88, aiModel: 'SYNTAX v1.0' },
  { id: '3', title: 'Neon Pulse', artist: 'AI Generated', genre: 'Deep Tech', bpm: 125, key: 'C#m', duration: '6:55', artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400', dateCreated: '2026-01-12', energy: 76, aiModel: 'SYNTAX v1.0' },
  { id: '4', title: 'Electric Soul', artist: 'AI Generated', genre: 'Melodic House', bpm: 124, key: 'Dm', duration: '7:10', artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400', dateCreated: '2026-01-11', energy: 74, aiModel: 'SYNTAX v1.0' },
  { id: '5', title: 'Cyber Revolution', artist: 'AI Generated', genre: 'Hard Techno', bpm: 138, key: 'Gm', duration: '6:30', artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', dateCreated: '2026-01-10', energy: 91, aiModel: 'SYNTAX v1.0' },
  { id: '6', title: 'Aurora Waves', artist: 'AI Generated', genre: 'Trance', bpm: 140, key: 'Em', duration: '8:00', artwork: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400', dateCreated: '2026-01-09', energy: 85, aiModel: 'SYNTAX v1.0' },
];

const GeneratedTracksLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [filterGenre, setFilterGenre] = useState('all');

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
    <div className="flex flex-col h-full bg-[#0A0A0A]">
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
          </div>
        </div>
      </div>

      {/* Track Grid - IDENTICAL TO DNA TRACKS */}
      <div className="flex-1 overflow-y-auto px-16 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-6 gap-4">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className="group bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 hover:border-[#00E5FF]/50 transition-all cursor-pointer"
              >
                {/* Artwork */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#00E5FF]/20 to-[#FF6B00]/20">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2">
                      <Sparkles className="w-5 h-5 text-[#00E5FF]" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 bg-[#00E5FF] rounded-full hover:bg-[#00E5FF]/80 transition-colors">
                          <Music2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-[#00E5FF] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2 truncate">{track.aiModel}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-[#FF6B00]/20 text-[#FF6B00] rounded">{track.bpm} BPM</span>
                    <span className="px-2 py-0.5 bg-[#00E5FF]/20 text-[#00E5FF] rounded">{track.key}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{track.duration}</span>
                    <span className="text-[#00E5FF]">{track.energy}%</span>
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
    </div>
  );
};

export default GeneratedTracksLibrary;