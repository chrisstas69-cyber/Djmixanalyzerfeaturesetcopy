import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Play, 
  Pause,
  Download,
  Trash2,
  Upload,
  Filter,
  ChevronDown,
  Music
} from 'lucide-react';
import { UnifiedSidebar } from './UnifiedSidebar';

interface UploadedTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  duration: string;
  uploadDate: string;
  artwork?: string;
}

interface DNALibraryProps {
  onBack: () => void;
  onLoadPreset: (presetId: string) => void;
}

export function DNALibrary({ onBack, onLoadPreset }: DNALibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedBPM, setSelectedBPM] = useState('All BPM');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  // Mock uploaded tracks - in real app, this would come from user's uploaded collection
  const [uploadedTracks] = useState<UploadedTrack[]>([
    {
      id: '1',
      title: 'Deep Sequence',
      artist: 'Unknown Artist',
      bpm: 128,
      key: '8A',
      genre: 'Techno',
      duration: '7:24',
      uploadDate: '2 months ago',
      artwork: 'from-[#ff6b35] to-[#9333ea]'
    },
    {
      id: '2',
      title: 'Hypnotic Flow',
      artist: 'Unknown Artist',
      bpm: 125,
      key: '5A',
      genre: 'Minimal',
      duration: '6:48',
      uploadDate: '2 months ago',
      artwork: 'from-[#9333ea] to-[#3b82f6]'
    },
    {
      id: '3',
      title: 'Dark Matter',
      artist: 'Unknown Artist',
      bpm: 130,
      key: '10B',
      genre: 'House',
      duration: '8:12',
      uploadDate: '2 months ago',
      artwork: 'from-[#ef4444] to-[#f97316]'
    },
    {
      id: '4',
      title: 'Subsonic Bass',
      artist: 'Unknown Artist',
      bpm: 126,
      key: '3A',
      genre: 'Dub Techno',
      duration: '7:36',
      uploadDate: '2 months ago',
      artwork: 'from-[#10b981] to-[#06b6d4]'
    },
    {
      id: '5',
      title: 'Midnight Drive',
      artist: 'Unknown Artist',
      bpm: 124,
      key: '12A',
      genre: 'Deep House',
      duration: '6:52',
      uploadDate: '2 months ago',
      artwork: 'from-[#8b5cf6] to-[#ec4899]'
    },
    {
      id: '6',
      title: 'Industrial Rhythm',
      artist: 'Unknown Artist',
      bpm: 132,
      key: '7B',
      genre: 'Techno',
      duration: '7:18',
      uploadDate: '2 months ago',
      artwork: 'from-[#f59e0b] to-[#ef4444]'
    },
    {
      id: '7',
      title: 'Ethereal Waves',
      artist: 'Unknown Artist',
      bpm: 120,
      key: '2A',
      genre: 'Ambient',
      duration: '9:24',
      uploadDate: '2 months ago',
      artwork: 'from-[#06b6d4] to-[#8b5cf6]'
    },
    {
      id: '8',
      title: 'Groove Foundation',
      artist: 'Unknown Artist',
      bpm: 122,
      key: '9A',
      genre: 'House',
      duration: '6:36',
      uploadDate: '2 months ago',
      artwork: 'from-[#ec4899] to-[#f97316]'
    }
  ]);

  const toggleSelectTrack = (trackId: string) => {
    setSelectedTracks(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTracks.length === uploadedTracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(uploadedTracks.map(t => t.id));
    }
  };

  const isEmpty = uploadedTracks.length === 0;

  // Empty State - No tracks uploaded yet
  if (isEmpty) {
    return (
      <div className="flex h-screen bg-[#0a0a0a]">
        <UnifiedSidebar onNavigate={onBack} currentView="dna-library" />
        
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] px-8 py-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">DNA Library</h1>
              <p className="text-gray-400">Your uploaded music collection</p>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex items-center justify-center min-h-[600px] p-8">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">No Tracks Uploaded Yet</h2>
              <p className="text-gray-400 mb-6">
                Upload your music collection to build your Music DNA profile
              </p>
              <button
                onClick={() => {
                  console.log('Navigate to upload');
                  // Would navigate to upload page
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#ff8555] hover:from-[#ff8555] hover:to-[#ff6b35] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#ff6b35]/30"
              >
                Upload Tracks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <UnifiedSidebar onNavigate={onBack} currentView="dna-library" />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">DNA Library</h1>
              <p className="text-gray-400">{uploadedTracks.length} tracks uploaded and analyzed</p>
            </div>
            <button className="px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-medium rounded-lg transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Tracks
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search tracks, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b35]"
              />
            </div>
            
            <button className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-white hover:border-[#ff6b35] transition-colors flex items-center gap-2">
              {selectedGenre}
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-white hover:border-[#ff6b35] transition-colors flex items-center gap-2">
              {selectedBPM}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Table */}
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#1a1a1a] border-b border-[#2a2a2a] text-sm font-medium text-gray-400">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTracks.length === uploadedTracks.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-600 text-[#ff6b35] focus:ring-[#ff6b35] bg-[#0f0f0f]"
                />
              </div>
              <div className="col-span-1">ARTWORK</div>
              <div className="col-span-3">TRACK</div>
              <div className="col-span-2">ARTIST</div>
              <div className="col-span-1">BPM</div>
              <div className="col-span-1">KEY</div>
              <div className="col-span-1">GENRE</div>
              <div className="col-span-1">TIME</div>
              <div className="col-span-1">DATE</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#1a1a1a]">
              {uploadedTracks.map((track) => (
                <div
                  key={track.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#1a1a1a] transition-colors group"
                >
                  {/* Checkbox */}
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTracks.includes(track.id)}
                      onChange={() => toggleSelectTrack(track.id)}
                      className="w-4 h-4 rounded border-gray-600 text-[#ff6b35] focus:ring-[#ff6b35] bg-[#0f0f0f]"
                    />
                  </div>

                  {/* Artwork */}
                  <div className="col-span-1 flex items-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${track.artwork} rounded-lg relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                        <button
                          onClick={() => setPlayingTrackId(playingTrackId === track.id ? null : track.id)}
                          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Track */}
                  <div className="col-span-3 flex items-center">
                    <span className="text-white font-medium truncate">{track.title}</span>
                  </div>

                  {/* Artist */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-400 truncate">{track.artist}</span>
                  </div>

                  {/* BPM */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400">{track.bpm}</span>
                  </div>

                  {/* Key */}
                  <div className="col-span-1 flex items-center">
                    <span className="px-2 py-1 bg-[#ff6b35]/20 text-[#ff6b35] rounded text-xs font-medium">
                      {track.key}
                    </span>
                  </div>

                  {/* Genre */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400 text-sm truncate">{track.genre}</span>
                  </div>

                  {/* Duration */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400 text-sm">{track.duration}</span>
                  </div>

                  {/* Upload Date */}
                  <div className="col-span-1 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{track.uploadDate}</span>
                    
                    {/* Actions (visible on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <button
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTracks.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
              <span className="text-white">
                {selectedTracks.length} track{selectedTracks.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#0f0f0f] hover:bg-[#222] text-gray-400 hover:text-white rounded-lg transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-lg transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
