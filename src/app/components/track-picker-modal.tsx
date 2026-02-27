import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { useTrackStore, Track } from '../../lib/store/trackStore';

interface TrackPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrackPickerModal({ isOpen, onClose }: TrackPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'generated' | 'dna'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelection, setLocalSelection] = useState<Set<string>>(new Set());
  
  const { generatedTracks, dnaTracks, selectedPool, setPool } = useTrackStore();

  const allTracks = useMemo(() => [
    ...generatedTracks,
    ...dnaTracks
  ], [generatedTracks, dnaTracks]);

  const tabFiltered = useMemo(() => {
    if (activeTab === 'generated') return generatedTracks;
    if (activeTab === 'dna') return dnaTracks;
    return allTracks;
  }, [activeTab, generatedTracks, dnaTracks, allTracks]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tabFiltered;
    const query = searchQuery.toLowerCase();
    return tabFiltered.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.artist.toLowerCase().includes(query) ||
      t.genre?.toLowerCase().includes(query) ||
      t.key?.toLowerCase().includes(query)
    );
  }, [tabFiltered, searchQuery]);

  React.useEffect(() => {
    if (isOpen) {
      setLocalSelection(new Set(selectedPool.map(t => t.id)));
    }
  }, [isOpen, selectedPool]);

  if (!isOpen) return null;

  const toggleTrack = (trackId: string) => {
    setLocalSelection(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  };

  const handleDone = () => {
    const selectedTracks = allTracks.filter(t => localSelection.has(t.id));
    setPool(selectedTracks);
    onClose();
  };

  const getGenreColor = (genre?: string): string => {
    const colors: Record<string, string> = {
      'Tech House': 'bg-orange-500',
      'Melodic Techno': 'bg-cyan-500',
      'Deep House': 'bg-blue-500',
      'Progressive House': 'bg-purple-500',
      'Techno': 'bg-red-500',
      'House': 'bg-green-500',
      'Afro House': 'bg-yellow-500'
    };
    return colors[genre || ''] || 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0f1e] border border-cyan-500/30 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Track Picker</h2>
            <p className="text-sm text-gray-400 mt-1">
              {filtered.length} track{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            ALL ({allTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('generated')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'generated'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            GENERATED ({generatedTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('dna')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'dna'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            DNA TRACKS ({dnaTracks.length})
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, artist, genre, or key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 min-h-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tracks found</p>
            </div>
          ) : (
            filtered.map((track) => {
              const isSelected = localSelection.has(track.id);
              return (
                <button
                  key={track.id}
                  onClick={() => toggleTrack(track.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-2 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-gray-900/30 border-2 border-transparent hover:bg-gray-800/50 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-cyan-500 border-cyan-500' 
                        : 'border-gray-600'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <h3 className="text-white font-semibold truncate">{track.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {track.key && (
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-mono font-bold">
                        {track.key}
                      </span>
                    )}
                    {track.genre && (
                      <span className={`${getGenreColor(track.genre)} px-3 py-1 rounded-full text-xs font-semibold text-white`}>
                        {track.genre}
                      </span>
                    )}
                    <span className="text-cyan-400 font-mono font-bold text-sm bg-cyan-500/10 px-3 py-1 rounded-full">
                      {track.bpm}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-6 border-t border-cyan-500/20 bg-gray-900/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">
              {localSelection.size} track{localSelection.size !== 1 ? 's' : ''} selected
            </p>
            {localSelection.size > 0 && (
              <button
                onClick={() => setLocalSelection(new Set())}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <button
            onClick={handleDone}
            disabled={localSelection.size === 0}
            className={`w-full py-3.5 rounded-lg font-bold text-lg transition-all ${
              localSelection.size > 0
                ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Done ({localSelection.size} selected)
          </button>
        </div>
      </div>
    </div>
  );
}
