import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Upload, 
  Music, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Save,
  Pin,
  Sparkles
} from 'lucide-react';
import { UnifiedSidebar } from './UnifiedSidebar';

interface SavedPreset {
  id: string;
  name: string;
  dnaMode: 'off' | 'my-dna' | 'custom';
  styleTags: string[];
  bpm: number;
  key: string;
  prompt: string;
  createdAt: string;
}

interface Track {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  duration: string;
  currentVersion: string;
  versions: Array<{ id: string; label: string }>;
  styleTags: string[];
  dnaMode: 'off' | 'my-dna' | 'custom';
  prompt: string;
}

interface ImprovedGeneratorLayoutProps {
  onBack: () => void;
}

export function ImprovedGeneratorLayout({ onBack }: ImprovedGeneratorLayoutProps) {
  const [musicDNAMode, setMusicDNAMode] = useState<'off' | 'my-dna' | 'custom'>('off');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [presetToSave, setPresetToSave] = useState<Track | null>(null);
  const [presetName, setPresetName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([
    {
      id: '1',
      name: 'Joeski Techno Style',
      dnaMode: 'my-dna',
      styleTags: ['Hypnotic', 'Dark', 'Minimal'],
      bpm: 128,
      key: 'A Minor',
      prompt: '[style:80] [creativity:41] Hypnotic minimal techno with dark atmosphere...',
      createdAt: '2 days ago'
    }
  ]);

  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Nocturnal Sequence',
      bpm: 128,
      genre: 'Techno • Minimal',
      duration: '7:24',
      currentVersion: 'A',
      versions: [
        { id: 'A', label: 'Version A' },
        { id: 'B', label: 'Version B' },
        { id: 'C', label: 'Version C' }
      ],
      styleTags: ['Hypnotic', 'Dark', 'Minimal'],
      dnaMode: 'off',
      prompt: '[style:80] [creativity:41] Hypnotic minimal techno with dark atmosphere...'
    },
    {
      id: '2',
      title: 'Subsonic Ritual',
      bpm: 126,
      genre: 'Techno • Dub',
      duration: '6:48',
      currentVersion: 'A',
      versions: [
        { id: 'A', label: 'Version A' }
      ],
      styleTags: ['Deep', 'Atmospheric'],
      dnaMode: 'my-dna',
      prompt: '[style:80] [creativity:41] Deep atmospheric dub techno...'
    }
  ]);

  const availableTags = ['Hypnotic', 'Dark', 'Minimal', 'Driving', 'Atmospheric', 'Groovy', 'Deep', 'Raw'];

  // Auto-generate prompt based on DNA mode and selected tags
  const generatePrompt = () => {
    const baseStyle = 80;
    const creativity = 41;
    const structure = 'intro-buildup-drop-breakdown-outro';
    
    let bpm = 127;
    let key = 'A Minor';
    let description = '';
    
    // Adjust based on Music DNA mode
    if (musicDNAMode === 'my-dna') {
      bpm = 126;
      key = 'A Minor';
      description += 'Deep atmospheric dub techno, ';
    } else if (musicDNAMode === 'custom') {
      bpm = 128;
      key = 'C Minor';
      description += 'Custom tailored techno, ';
    } else {
      description += 'Stripped-down techno, ';
    }
    
    // Add selected tags to description
    if (selectedTags.includes('Hypnotic')) description += 'hypnotic groove, ';
    if (selectedTags.includes('Dark')) description += 'dark menacing atmosphere, ';
    if (selectedTags.includes('Minimal')) description += 'stripped-down minimal arrangement, ';
    if (selectedTags.includes('Driving')) description += 'driving four-to-the-floor rhythm, ';
    if (selectedTags.includes('Atmospheric')) description += 'atmospheric pads and textures, ';
    if (selectedTags.includes('Groovy')) description += 'groovy bassline, ';
    if (selectedTags.includes('Deep')) description += 'deep sub-bass, ';
    if (selectedTags.includes('Raw')) description += 'raw analog warmth, ';
    
    // Add technical details
    description += `${key} key, ${bpm} BPM, energetic pulse, warm analog saturation, tape compression, vintage equipment, cavernous deep reverb, dub techno echo, shadowy textures, sparse elements, neutral temperature, balanced spectrum.`;
    
    return `[style:${baseStyle}] [creativity:${creativity}] [structure:${structure}] ${description}`;
  };

  const autoPrompt = generatePrompt();
  const charCount = autoPrompt.length;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      const newTrack: Track = {
        id: String(Date.now()),
        title: 'New Generation',
        bpm: 128,
        genre: 'Techno • Minimal',
        duration: '7:00',
        currentVersion: 'A',
        versions: [{ id: 'A', label: 'Version A' }],
        styleTags: [...selectedTags],
        dnaMode: musicDNAMode,
        prompt: autoPrompt
      };
      
      setTracks(prev => [newTrack, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const handleSaveAsPreset = (track: Track) => {
    setPresetToSave(track);
    setPresetName(`${track.title} Style`);
    setShowSavePresetModal(true);
  };

  const confirmSavePreset = () => {
    if (!presetToSave || !presetName.trim()) return;

    const newPreset: SavedPreset = {
      id: String(Date.now()),
      name: presetName,
      dnaMode: presetToSave.dnaMode,
      styleTags: presetToSave.styleTags,
      bpm: presetToSave.bpm,
      key: 'A Minor',
      prompt: presetToSave.prompt,
      createdAt: 'Just now'
    };

    setSavedPresets(prev => [newPreset, ...prev]);
    setShowSavePresetModal(false);
    setPresetToSave(null);
    setPresetName('');
  };

  const loadPreset = (preset: SavedPreset) => {
    setMusicDNAMode(preset.dnaMode);
    setSelectedTags(preset.styleTags);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Unified Sidebar */}
      <UnifiedSidebar onNavigate={onBack} currentView="generator" />

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN - 40% */}
        <div className="w-[40%] border-r border-[#1a1a1a] overflow-y-auto p-8">
          {/* Audio DNA Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-white font-semibold">Audio DNA</h3>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Off = Generic AI, My Music DNA = Based on your uploaded tracks
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setMusicDNAMode('off')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  musicDNAMode === 'off'
                    ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222]'
                }`}
              >
                Off
              </button>
              <button
                onClick={() => setMusicDNAMode('my-dna')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  musicDNAMode === 'my-dna'
                    ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222]'
                }`}
              >
                My Music DNA
              </button>
              <button
                onClick={() => setMusicDNAMode('custom')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  musicDNAMode === 'custom'
                    ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222]'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Style Tags Section */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4">Style Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* AI-Generated Prompt Preview */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-white font-semibold">AI-Generated Prompt</h3>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  This prompt is automatically generated based on your DNA mode and style tags
                </div>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                value={autoPrompt}
                readOnly
                className="w-full h-32 p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-gray-400 text-sm font-mono resize-none focus:outline-none"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                {charCount} / 500
              </div>
            </div>
          </div>

          {/* Optional Sections */}
          <div className="mb-8 space-y-3">
            <button
              onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] hover:bg-[#222] rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <span>+ Add Lyrics (Optional)</span>
              {isLyricsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <AnimatePresence>
              {isLyricsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Enter your lyrics here..."
                    className="w-full h-24 p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 resize-none focus:outline-none focus:border-[#ff6b35]"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsReferenceExpanded(!isReferenceExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] hover:bg-[#222] rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <span>+ Reference Track (Optional)</span>
              {isReferenceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <AnimatePresence>
              {isReferenceExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-[#2a2a2a] hover:border-[#ff6b35] rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Upload className="w-6 h-6" />
                      <p className="text-sm">Upload reference track</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-[60px] bg-gradient-to-r from-[#ff6b35] to-[#ff8555] hover:from-[#ff8555] hover:to-[#ff6b35] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#ff6b35]/30 hover:shadow-[#ff6b35]/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Music className="w-5 h-5" />
                Generate Track
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN - 60% */}
        <div className="w-[60%] overflow-y-auto p-8">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Generated Tracks</h2>
            <p className="text-gray-400">Your recent generations and saved presets</p>
          </div>

          {/* Saved Presets Section */}
          {savedPresets.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Pin className="w-5 h-5 text-[#ff6b35]" />
                <h3 className="text-white font-semibold">Your Saved Presets</h3>
              </div>
              
              <div className="space-y-4">
                {savedPresets.map(preset => (
                  <motion.div
                    key={preset.id}
                    whileHover={{ y: -2 }}
                    className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold mb-1">{preset.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{preset.bpm} BPM</span>
                          <span>•</span>
                          <span>{preset.styleTags.join(', ')}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{preset.createdAt}</span>
                    </div>
                    
                    <button
                      onClick={() => loadPreset(preset)}
                      className="w-full px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-medium rounded-lg transition-colors"
                    >
                      Use This Preset
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Tracks Section */}
          <div>
            {tracks.length === 0 && !isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-white font-semibold mb-2">No Tracks Generated Yet</h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  Select your style tags and click Generate Track to create music
                </p>
                <p className="text-sm text-gray-500">
                  Tip: Save your favorite prompts as presets for quick access!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <Sparkles className="w-6 h-6 text-[#ff6b35] animate-spin" />
                      <div>
                        <h3 className="text-white font-semibold">Generating Track...</h3>
                        <p className="text-sm text-gray-400">This may take a few moments</p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[#0f0f0f] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555]"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3, ease: 'linear' }}
                      />
                    </div>
                  </motion.div>
                )}

                {tracks.map(track => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden"
                  >
                    {/* Track Header */}
                    <div className="p-6 border-b border-[#2a2a2a]">
                      <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{track.bpm} BPM</span>
                        <span>•</span>
                        <span>{track.genre}</span>
                        <span>•</span>
                        <span>{track.duration}</span>
                      </div>
                    </div>

                    {/* Waveform Placeholder */}
                    <div className="h-32 bg-gradient-to-r from-[#ff6b35]/20 via-[#9333ea]/20 to-[#ff6b35]/20 flex items-center justify-center">
                      <div className="text-gray-600 text-sm">Waveform Visualization</div>
                    </div>

                    {/* Playback Controls */}
                    <div className="p-6 border-b border-[#2a2a2a]">
                      <div className="flex items-center justify-center mb-3">
                        <button
                          onClick={() => setPlayingTrackId(playingTrackId === track.id ? null : track.id)}
                          className="w-12 h-12 bg-[#ff6b35] hover:bg-[#ff8555] rounded-full flex items-center justify-center transition-colors"
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-1" />
                          )}
                        </button>
                      </div>
                      <div className="text-center text-sm text-gray-400">
                        0:00 / {track.duration}
                      </div>
                    </div>

                    {/* Versions */}
                    <div className="p-6 border-b border-[#2a2a2a]">
                      <div className="flex gap-2">
                        {track.versions.map(version => (
                          <button
                            key={version.id}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              track.currentVersion === version.id
                                ? 'bg-[#ff6b35] text-white'
                                : 'bg-[#0f0f0f] text-gray-400 hover:text-white hover:bg-[#222]'
                            }`}
                          >
                            {version.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 flex gap-3">
                      <button
                        onClick={() => handleSaveAsPreset(track)}
                        className="flex-1 px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save as Preset
                      </button>
                      <button className="flex-1 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button className="flex-1 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Preset Modal */}
      <AnimatePresence>
        {showSavePresetModal && presetToSave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSavePresetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Save This Prompt as Preset</h3>
                <button
                  onClick={() => setShowSavePresetModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Name your preset:</label>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35]"
                  placeholder="e.g., Joeski Techno Style"
                />
              </div>

              <div className="mb-6 p-4 bg-[#0f0f0f] rounded-lg space-y-2 text-sm">
                <p className="text-gray-400">This will save:</p>
                <p className="text-white">• DNA Mode: <span className="text-[#ff6b35]">{presetToSave.dnaMode === 'off' ? 'Off' : presetToSave.dnaMode === 'my-dna' ? 'My Music DNA' : 'Custom'}</span></p>
                <p className="text-white">• Style Tags: <span className="text-[#ff6b35]">{presetToSave.styleTags.join(', ') || 'None'}</span></p>
                <p className="text-white">• BPM: <span className="text-[#ff6b35]">{presetToSave.bpm}</span></p>
                <p className="text-white">• Full prompt configuration</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSavePresetModal(false)}
                  className="flex-1 px-4 py-3 bg-[#0f0f0f] hover:bg-[#222] text-gray-400 hover:text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSavePreset}
                  disabled={!presetName.trim()}
                  className="flex-1 px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Preset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
