import React, { useState } from 'react';
import { Music2, Upload, Search } from 'lucide-react';

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

const DNATracksLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterGenre, setFilterGenre] = useState('all');

  const genres = ['all', ...Array.from(new Set(mockDNATracks.map(t => t.genre)))];

  const filteredTracks = mockDNATracks
    .filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              <h1 className="text-4xl font-bold text-white mb-2">DNA Tracks Library</h1>
              <p className="text-gray-400">Your uploaded tracks with full metadata</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] transition-all">
              <Upload className="w-5 h-5" />
              Upload DNA Tracks
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tracks..."
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
              <option value="dateAdded">Date Added</option>
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

      {/* Track Grid */}
      <div className="flex-1 overflow-y-auto px-16 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-6 gap-4">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className="group bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 hover:border-[#FF6B00]/50 transition-all cursor-pointer"
              >
                {/* Artwork */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#FF6B00]/20 to-[#00E5FF]/20">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 bg-[#FF6B00] rounded-full hover:bg-[#FF8C00] transition-colors">
                          <Music2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-[#FF6B00] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2 truncate">{track.artist}</p>
                  
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
              <Music2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No tracks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { DNATracksLibrary };