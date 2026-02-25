import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Bot,
  User,
  Link2,
  Star,
  Play,
  Upload,
  Check,
  Loader2,
  AlertCircle,
  Youtube,
  Cloud,
  Music,
  Headphones,
  CheckCircle
} from 'lucide-react';

type TrackSource = 'ai' | 'user' | 'url';
type TabType = 'library' | 'upload' | 'url';
type FilterType = 'all' | 'ai' | 'user' | 'favorites';

interface LibraryTrack {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  duration: number;
  energy: number;
  source: TrackSource;
  isFavorite?: boolean;
}

interface UploadedFile {
  id: string;
  fileName: string;
  status: 'analyzing' | 'complete' | 'error';
  progress: number;
  bpm?: number;
  key?: string;
  duration?: number;
  energy?: number;
  error?: string;
}

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrack: (track: any) => void;
}

const libraryTracks: LibraryTrack[] = [
  { id: 'l1', name: 'Hypnotic Elements', artist: 'AI Generated', bpm: 128, key: '4A', duration: 450, energy: 0.7, source: 'ai' },
  { id: 'l2', name: 'Dark Matter', artist: 'AI Generated', bpm: 130, key: '5A', duration: 495, energy: 0.9, source: 'ai' },
  { id: 'l3', name: 'Warehouse Vibe', artist: 'AI Generated', bpm: 128, key: '6A', duration: 465, energy: 0.8, source: 'ai', isFavorite: true },
  { id: 'l4', name: 'My Production 1', artist: 'DJ User', bpm: 128, key: '4A', duration: 480, energy: 0.8, source: 'user', isFavorite: true },
  { id: 'l5', name: 'Classic Track', artist: 'DJ User', bpm: 130, key: '5A', duration: 450, energy: 0.7, source: 'user' },
  { id: 'l6', name: 'Deep Techno Vibe', artist: 'AI Generated', bpm: 127, key: '8B', duration: 420, energy: 0.6, source: 'ai' },
  { id: 'l7', name: 'Peak Energy', artist: 'AI Generated', bpm: 130, key: '5A', duration: 450, energy: 0.9, source: 'ai' },
  { id: 'l8', name: 'My Studio Mix', artist: 'DJ User', bpm: 129, key: '4A', duration: 510, energy: 0.75, source: 'user', isFavorite: true },
];

export function AddTrackModal({ isOpen, onClose, onAddTrack }: AddTrackModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [urlAnalyzing, setUrlAnalyzing] = useState(false);
  const [urlTrack, setUrlTrack] = useState<LibraryTrack | null>(null);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [suggestedPosition, setSuggestedPosition] = useState(6);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSourceIcon = (source: TrackSource) => {
    switch (source) {
      case 'ai': return <Bot className="w-4 h-4 text-[#ff6b35]" />;
      case 'user': return <User className="w-4 h-4 text-[#4488ff]" />;
      case 'url': return <Link2 className="w-4 h-4 text-[#44ff44]" />;
    }
  };

  const filteredTracks = libraryTracks.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'ai' && track.source === 'ai') ||
      (filter === 'user' && track.source === 'user') ||
      (filter === 'favorites' && track.isFavorite);
    return matchesSearch && matchesFilter;
  });

  const toggleTrack = (id: string) => {
    const newSelected = new Set(selectedTracks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTracks(newSelected);
  };

  const handleUpload = () => {
    // Simulate file upload
    const newFiles: UploadedFile[] = [
      { id: 'u1', fileName: 'My Production 1.mp3', status: 'analyzing', progress: 0 },
      { id: 'u2', fileName: 'Classic Track.wav', status: 'analyzing', progress: 0 }
    ];
    setUploadedFiles(newFiles);

    // Simulate analysis
    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => 
        f.id === 'u1' 
          ? { ...f, status: 'complete', progress: 100, bpm: 128, key: '4A', duration: 480, energy: 0.8 }
          : { ...f, progress: 67 }
      ));
    }, 2000);

    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => 
        f.id === 'u2' 
          ? { ...f, status: 'complete', progress: 100, bpm: 130, key: '5A', duration: 450, energy: 0.7 }
          : f
      ));
    }, 4000);
  };

  const handleAnalyzeUrl = () => {
    setUrlAnalyzing(true);
    setTimeout(() => {
      setUrlTrack({
        id: 'url1',
        name: 'Carl Cox - Phuture 2000',
        artist: 'Carl Cox',
        bpm: 128,
        key: '6A',
        duration: 480,
        energy: 0.9,
        source: 'url'
      });
      setUrlAnalyzing(false);
      setShowAISuggestion(true);
    }, 3000);
  };

  const handleAddToMix = () => {
    if (activeTab === 'library' && selectedTracks.size > 0) {
      setShowAISuggestion(true);
    } else if (activeTab === 'upload' && uploadedFiles.every(f => f.status === 'complete')) {
      setShowAISuggestion(true);
    } else if (activeTab === 'url' && urlTrack) {
      // Already showing AI suggestion
    }
  };

  const hasSelectedTracks = () => {
    if (activeTab === 'library') return selectedTracks.size > 0;
    if (activeTab === 'upload') return uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'complete');
    if (activeTab === 'url') return urlTrack !== null;
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-2xl mb-1">Add Track to Mix</h2>
            <p className="text-[#808080] text-sm">Mix AI-generated tracks with your own collection</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg text-[#808080] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2a2a2a]">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'library'
                ? 'bg-[#1a1a1a] text-white border-b-2 border-[#ff6b35]'
                : 'text-[#808080] hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            From Library
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-[#1a1a1a] text-white border-b-2 border-[#ff6b35]'
                : 'text-[#808080] hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-[#1a1a1a] text-white border-b-2 border-[#ff6b35]'
                : 'text-[#808080] hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            From URL
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: FROM LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:border-[#ff6b35]"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-[#808080] hover:bg-[#2a2a2a]'
                  }`}
                >
                  All Tracks
                </button>
                <button
                  onClick={() => setFilter('ai')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    filter === 'ai'
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-[#808080] hover:bg-[#2a2a2a]'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  AI Generated
                </button>
                <button
                  onClick={() => setFilter('user')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    filter === 'user'
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-[#808080] hover:bg-[#2a2a2a]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  User Uploads
                </button>
                <button
                  onClick={() => setFilter('favorites')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    filter === 'favorites'
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-[#808080] hover:bg-[#2a2a2a]'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Favorites
                </button>
              </div>

              {/* Track List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTracks.map(track => (
                  <div
                    key={track.id}
                    onClick={() => toggleTrack(track.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTracks.has(track.id)
                        ? 'bg-[#ff6b35]/10 border-[#ff6b35]'
                        : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                        selectedTracks.has(track.id)
                          ? 'bg-[#ff6b35] border-[#ff6b35]'
                          : 'border-[#808080]'
                      }`}>
                        {selectedTracks.has(track.id) && <Check className="w-3 h-3 text-white" />}
                      </div>

                      {/* Mini Waveform */}
                      <div className="w-16 h-12 bg-[#0a0a0a] rounded flex-shrink-0">
                        <svg className="w-full h-full p-1">
                          {[...Array(12)].map((_, i) => (
                            <rect
                              key={i}
                              x={i * 4}
                              y={6 - Math.random() * 4}
                              width="3"
                              height={Math.random() * 8}
                              fill={track.source === 'ai' ? '#ff6b35' : '#4488ff'}
                              opacity={0.6}
                            />
                          ))}
                        </svg>
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-white font-medium">{track.name}</div>
                          {getSourceIcon(track.source)}
                          {track.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                        </div>
                        <div className="text-[#808080] text-sm mb-2">{track.artist}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[#ff6b35] font-mono">{track.bpm} BPM</span>
                          <span className="text-[#4488ff] font-mono">{track.key}</span>
                          <span className="text-[#808080]">{formatTime(track.duration)}</span>
                          <span className="text-[#808080]">Energy: {Math.round(track.energy * 10)}/10</span>
                        </div>
                      </div>

                      {/* Preview Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-white text-sm transition-colors flex items-center gap-2 flex-shrink-0"
                      >
                        <Play className="w-3 h-3" />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {uploadedFiles.length === 0 ? (
                <div
                  onClick={handleUpload}
                  className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-12 text-center hover:border-[#ff6b35] transition-colors cursor-pointer"
                >
                  <Upload className="w-16 h-16 text-[#808080] mx-auto mb-4" />
                  <p className="text-white text-lg font-medium mb-2">Drag & drop your tracks here</p>
                  <p className="text-[#808080] text-sm mb-4">or</p>
                  <button className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors">
                    Browse Files
                  </button>
                  <div className="mt-4 text-[#808080] text-sm space-y-1">
                    <div>Supported: MP3, WAV, FLAC</div>
                    <div>Max size: 50 MB per file</div>
                    <div>Max files: 10 at once</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white font-medium mb-4">
                    <Bot className="w-5 h-5 text-[#ff6b35]" />
                    Analyzing tracks...
                  </div>

                  {uploadedFiles.map(file => (
                    <div
                      key={file.id}
                      className={`p-4 rounded-lg border ${
                        file.status === 'complete'
                          ? 'bg-[#44ff44]/10 border-[#44ff44]'
                          : file.status === 'error'
                          ? 'bg-red-500/10 border-red-500'
                          : 'bg-[#1a1a1a] border-[#2a2a2a]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {file.status === 'complete' && <CheckCircle className="w-5 h-5 text-[#44ff44] flex-shrink-0 mt-0.5" />}
                        {file.status === 'analyzing' && <Loader2 className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5 animate-spin" />}
                        {file.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}

                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">{file.fileName}</div>
                          
                          {file.status === 'analyzing' && (
                            <div className="space-y-2">
                              <div className="text-[#808080] text-sm">Analyzing... {file.progress}%</div>
                              <div className="w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#ff6b35] transition-all duration-500"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {file.status === 'complete' && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-[#ff6b35] font-mono">{file.bpm} BPM</span>
                                <span className="text-[#4488ff] font-mono">{file.key}</span>
                                <span className="text-[#808080]">{formatTime(file.duration || 0)}</span>
                                <span className="text-[#808080]">Energy: {Math.round((file.energy || 0) * 10)}/10</span>
                              </div>
                              <div className="flex items-center gap-2 text-[#44ff44] text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Compatible with mix!
                              </div>
                            </div>
                          )}

                          {file.status === 'error' && (
                            <div className="text-red-500 text-sm">{file.error}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-[#808080] text-sm">
                    Analyzed: {uploadedFiles.filter(f => f.status === 'complete').length}/{uploadedFiles.length} tracks
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FROM URL */}
          {activeTab === 'url' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                  <input
                    type="text"
                    placeholder="Paste track URL (e.g., soundcloud.com/artist/track)"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-[#808080] text-sm font-medium">Supported Platforms:</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-[#808080] text-sm">
                      <Youtube className="w-4 h-4 text-red-500" />
                      YouTube
                    </div>
                    <div className="flex items-center gap-2 text-[#808080] text-sm">
                      <Cloud className="w-4 h-4 text-[#ff6b35]" />
                      SoundCloud
                    </div>
                    <div className="flex items-center gap-2 text-[#808080] text-sm">
                      <Music className="w-4 h-4 text-[#ff6b35]" />
                      Mixcloud
                    </div>
                    <div className="flex items-center gap-2 text-[#808080] text-sm">
                      <Headphones className="w-4 h-4 text-[#44ff44]" />
                      Spotify
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeUrl}
                  disabled={urlAnalyzing || !urlInput}
                  className="w-full px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {urlAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Track'
                  )}
                </button>
              </div>

              {urlTrack && (
                <div className="bg-[#44ff44]/10 border border-[#44ff44] rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#44ff44] font-bold">
                    <CheckCircle className="w-5 h-5" />
                    Track Found!
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-[#808080] text-sm">Track</div>
                      <div className="text-white font-medium text-lg">{urlTrack.name}</div>
                    </div>
                    <div>
                      <div className="text-[#808080] text-sm">Artist</div>
                      <div className="text-white">{urlTrack.artist}</div>
                    </div>
                    <div>
                      <div className="text-[#808080] text-sm">Duration</div>
                      <div className="text-white">{formatTime(urlTrack.duration)}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#44ff44]/30">
                    <div className="flex items-center gap-2 text-white font-medium mb-3">
                      <Bot className="w-5 h-5 text-[#ff6b35]" />
                      AI Analysis:
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-[#808080]">BPM</div>
                        <div className="text-[#ff6b35] font-mono">{urlTrack.bpm}</div>
                      </div>
                      <div>
                        <div className="text-[#808080]">Key</div>
                        <div className="text-[#4488ff] font-mono">{urlTrack.key}</div>
                      </div>
                      <div>
                        <div className="text-[#808080]">Energy</div>
                        <div className="text-white">{Math.round(urlTrack.energy * 10)}/10</div>
                      </div>
                      <div>
                        <div className="text-[#808080]">Style</div>
                        <div className="text-white">Peak Time Techno</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#44ff44] text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Compatible with your mix!
                  </div>

                  <button className="w-full px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Preview (30s)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AI Suggestion Panel */}
          {showAISuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-r from-[#ff6b35]/20 to-transparent border-l-4 border-[#ff6b35] rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Bot className="w-6 h-6 text-[#ff6b35]" />
                AI Suggestion
              </div>

              <div className="space-y-3">
                <div className="text-white text-lg font-medium">
                  "Place this track at position #{suggestedPosition}"
                </div>

                <div>
                  <div className="text-[#808080] text-sm mb-2">Reason:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#44ff44]" />
                      <span className="text-white">BPM matches (128)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#44ff44]" />
                      <span className="text-white">Key is compatible (4A → 5A)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#44ff44]" />
                      <span className="text-white">Energy flow is perfect (builds up)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#44ff44]" />
                      <span className="text-white">Style matches surrounding tracks</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[#808080] text-sm mb-2 block">Position in mix:</label>
                  <select
                    value={suggestedPosition}
                    onChange={(e) => setSuggestedPosition(Number(e.target.value))}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Position {i + 1} {i + 1 === 6 ? '(AI Recommended ⭐)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="text-[#808080] text-sm mb-2">Preview mix order:</div>
                  <div className="space-y-1 text-sm">
                    <div className="text-[#808080]">Track 5: Industrial Pulse (AI)</div>
                    <div className="text-[#ff6b35] font-medium flex items-center gap-2">
                      → Track 6: Your Track (USER)
                      <span className="px-2 py-0.5 bg-[#ff6b35] rounded text-white text-xs">NEW!</span>
                    </div>
                    <div className="text-[#808080]">Track 7: Dark Matter (AI)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex-1 px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors">
                    Use AI Suggestion
                  </button>
                  <button className="flex-1 px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors">
                    Choose Manually
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2a2a2a] flex items-center justify-between">
          <div className="text-[#808080] text-sm">
            {activeTab === 'library' && `Selected: ${selectedTracks.size} track${selectedTracks.size !== 1 ? 's' : ''}`}
            {activeTab === 'upload' && uploadedFiles.length > 0 && `Analyzed: ${uploadedFiles.filter(f => f.status === 'complete').length}/${uploadedFiles.length} tracks`}
            {activeTab === 'url' && urlTrack && 'Track ready to add'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToMix}
              disabled={!hasSelectedTracks()}
              className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Mix
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
