import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ChevronDown, ChevronUp, X, Upload, Music, Play, Pause, Download, Share2, MoreVertical } from 'lucide-react';
import { UnifiedSidebar } from './UnifiedSidebar';

interface Track {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  duration: string;
  currentVersion: string;
  versions: Array<{ id: string; label: string }>;
}

interface ClassicGeneratorLayoutProps {
  onBack: () => void;
}

export function ClassicGeneratorLayout({ onBack }: ClassicGeneratorLayoutProps) {
  const [musicDNAMode, setMusicDNAMode] = useState<'off' | 'my-dna' | 'custom'>('off');
  const [trackDescription, setTrackDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [isInstrumental, setIsInstrumental] = useState(true);
  const [referenceTrack, setReferenceTrack] = useState<{
    name: string;
    bpm: number;
    key: string;
    genre: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      ]
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
      ]
    }
  ]);

  const suggestedTags = ['Hypnotic', 'Dark', 'Minimal', 'Driving', 'Atmospheric', 'Groovy', 'Deep', 'Raw'];

  // Auto-generate prompt based on DNA mode and selected tags
  const generatePrompt = () => {
    const baseStyle = 80;
    const creativity = 41;
    const structure = 'intro-buildup-drop-outro';
    
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
    }
    
    // Add selected tags to description
    if (tags.includes('Hypnotic')) description += 'hypnotic groove, ';
    if (tags.includes('Dark')) description += 'dark menacing atmosphere, ';
    if (tags.includes('Minimal')) description += 'stripped-down minimal arrangement, ';
    if (tags.includes('Driving')) description += 'driving four-to-the-floor rhythm, ';
    if (tags.includes('Atmospheric')) description += 'atmospheric pads and textures, ';
    if (tags.includes('Groovy')) description += 'groovy bassline, ';
    if (tags.includes('Deep')) description += 'deep sub-bass, ';
    if (tags.includes('Raw')) description += 'raw analog warmth, ';
    
    // Add technical details
    description += `${key} key, ${bpm} BPM, energetic pulse, warm analog saturation, tape compression, vintage equipment, cavernous deep reverb, dub techno echo, shadowy textures, sparse elements, neutral temperature, balanced spectrum.`;
    
    return `[style:${baseStyle}] [creativity:${creativity}] [structure:${structure}] ${description}`;
  };

  const [autoPrompt, setAutoPrompt] = useState(generatePrompt());
  const [manualEditMode, setManualEditMode] = useState(false);
  const [manualPrompt, setManualPrompt] = useState('');

  // Update auto-generated prompt whenever DNA mode or tags change
  React.useEffect(() => {
    if (!manualEditMode) {
      setAutoPrompt(generatePrompt());
    }
  }, [musicDNAMode, tags, manualEditMode]);

  const currentPrompt = manualEditMode ? manualPrompt : autoPrompt;

  const handleAddTag = (tag: string) => {
    if (tags.length < 10 && !tags.includes(tag) && tag.trim()) {
      setTags([...tags, tag.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceTrack({
        name: file.name,
        bpm: 126,
        key: 'A Minor',
        genre: 'Techno'
      });
    }
  };

  const handleRemoveReference = () => {
    setReferenceTrack(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newTrack: Track = {
        id: String(Date.now()),
        title: 'New Generation',
        bpm: 128,
        genre: 'Techno • Minimal',
        duration: '7:00',
        currentVersion: 'A',
        versions: [{ id: 'A', label: 'Version A' }]
      };
      setTracks(prev => [newTrack, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const handleVersionChange = (trackId: string, versionId: string) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId
          ? { ...track, currentVersion: versionId }
          : track
      )
    );
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Unified Sidebar */}
      <UnifiedSidebar onNavigate={onBack} currentView="generator" />

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN - Controls (40%) */}
        <div className="w-[40%] bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col">
          <div className="flex-1 overflow-y-auto p-10 space-y-8">
            {/* Audio DNA Section */}
            <div className="space-y-4">
              <label className="text-white font-medium">Audio DNA</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMusicDNAMode('off')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    musicDNAMode === 'off'
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  Off
                </button>
                <button
                  onClick={() => setMusicDNAMode('my-dna')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    musicDNAMode === 'my-dna'
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  My Music DNA
                </button>
                <button
                  onClick={() => setMusicDNAMode('custom')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    musicDNAMode === 'custom'
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Describe Your Track */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-white font-medium">Describe Your Track</label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-500 cursor-help" />
                  <div className="absolute left-0 top-6 w-64 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-sm text-gray-400">
                    Describe the style, mood, instruments, or vibe you want for your track
                  </div>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={trackDescription}
                  onChange={(e) => setTrackDescription(e.target.value)}
                  placeholder="e.g., Dark hypnotic techno with rolling bassline, crisp hi-hats, atmospheric pads, driving four-to-the-floor rhythm..."
                  maxLength={500}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition-colors resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {trackDescription.length} / 500
                </div>
              </div>
            </div>

            {/* Style Tags */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-white font-medium">Style Tags</label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-500 cursor-help" />
                  <div className="absolute left-0 top-6 w-64 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-sm text-gray-400">
                    Click tags to auto-generate your prompt. These define the mood and style of your track.
                  </div>
                </div>
              </div>

              {/* Active Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-full text-[#ff6b35]"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-[#ff6b35]/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Tags */}
              <div className="flex flex-wrap gap-2">
                {suggestedTags
                  .filter(tag => !tags.includes(tag))
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      disabled={tags.length >= 10}
                      className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-gray-400 hover:text-white hover:border-[#404040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
              {tags.length >= 10 && (
                <p className="text-xs text-gray-500">Maximum 10 tags reached</p>
              )}
            </div>

            {/* AI-Generated Prompt Preview Box */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-white font-medium">AI-Generated Prompt</label>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-500 cursor-help" />
                    <div className="absolute left-0 top-6 w-64 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-sm text-gray-400">
                      This technical prompt is automatically generated based on your DNA mode and selected tags.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setManualEditMode(!manualEditMode);
                    if (!manualEditMode) {
                      setManualPrompt(autoPrompt);
                    }
                  }}
                  className="text-xs px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-400 hover:text-white rounded-lg transition-colors border border-[#2a2a2a]"
                >
                  {manualEditMode ? 'Auto Mode' : 'Edit Manually'}
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={currentPrompt}
                  onChange={(e) => manualEditMode && setManualPrompt(e.target.value)}
                  readOnly={!manualEditMode}
                  maxLength={500}
                  rows={6}
                  className={`w-full px-5 py-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-gray-400 font-mono text-sm leading-relaxed focus:outline-none focus:border-[#ff6b35] transition-colors resize-none ${
                    !manualEditMode ? 'cursor-default' : ''
                  }`}
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                  {currentPrompt.length} / 500
                </div>
              </div>

              {!manualEditMode && tags.length === 0 && musicDNAMode === 'off' && (
                <p className="text-xs text-gray-500 italic">
                  💡 Select a DNA mode and click style tags to auto-generate your prompt
                </p>
              )}
            </div>

            {/* Add Lyrics (Collapsible) */}
            <div className="space-y-4">
              <button
                onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
                className="flex items-center justify-between w-full text-left group"
              >
                <span className="text-white font-medium">Add Lyrics (Optional)</span>
                {isLyricsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                )}
              </button>

              <AnimatePresence>
                {isLyricsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="instrumental"
                        checked={isInstrumental}
                        onChange={(e) => setIsInstrumental(e.target.checked)}
                        className="w-4 h-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-0 cursor-pointer"
                      />
                      <label htmlFor="instrumental" className="text-sm text-gray-400 cursor-pointer">
                        Instrumental (no vocals)
                      </label>
                    </div>

                    <div className="relative">
                      <textarea
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        disabled={isInstrumental}
                        placeholder="Enter your lyrics here..."
                        maxLength={1000}
                        rows={6}
                        className={`w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition-colors resize-none ${
                          isInstrumental ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                        {lyrics.length} / 1000
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reference Track (Collapsible) */}
            <div className="space-y-4">
              <button
                onClick={() => setIsReferenceExpanded(!isReferenceExpanded)}
                className="flex items-center justify-between w-full text-left group"
              >
                <span className="text-white font-medium">Reference Track (Optional)</span>
                {isReferenceExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                )}
              </button>

              <AnimatePresence>
                {isReferenceExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {!referenceTrack ? (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".mp3,.wav,.flac"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#2a2a2a] hover:border-[#404040] transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-white"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Reference Track
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Upload a track to match its style and vibe (MP3, WAV, FLAC • Max 50MB)
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#ff6b35]/10 rounded flex items-center justify-center">
                              <Music className="w-5 h-5 text-[#ff6b35]" />
                            </div>
                            <div>
                              <p className="text-white text-sm">{referenceTrack.name}</p>
                              <p className="text-xs text-gray-500">Analyzing track...</p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveReference}
                            className="text-gray-500 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">BPM</p>
                            <p className="text-white">{referenceTrack.bpm}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Key</p>
                            <p className="text-white">{referenceTrack.key}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Genre</p>
                            <p className="text-white">{referenceTrack.genre}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Generate Button - Fixed at bottom */}
          <div className="p-10 border-t border-[#1a1a1a]">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !trackDescription.trim()}
              className="w-full py-4 bg-[#ff6b35] hover:bg-[#ff8555] disabled:bg-[#2a2a2a] disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-lg shadow-[#ff6b35]/20"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Track'
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Generated Tracks (60%) */}
        <div className="flex-1 bg-[#0a0a0a] overflow-y-auto p-10">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-8">Generated Tracks</h2>

            {/* Tracks Stack Vertically */}
            <div className="space-y-8">
              {tracks.map((track) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0f0f0f] rounded-xl overflow-hidden border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors"
                >
                  {/* Track Header */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{track.bpm} BPM</span>
                          <span>•</span>
                          <span>{track.genre}</span>
                          <span>•</span>
                          <span>{track.duration}</span>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Waveform */}
                    <div className="relative h-[120px] bg-gradient-to-r from-[#ff6b35]/20 to-[#9333ea]/20 rounded-lg mb-6 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPlayingTrackId(playingTrackId === track.id ? null : track.id)}
                          className="w-16 h-16 bg-[#ff6b35] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(255,107,53,0.5)] transition-all"
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1 fill-white" />
                          )}
                        </motion.button>
                      </div>
                      {/* Simulated waveform bars */}
                      <div className="absolute inset-0 flex items-center gap-0.5 px-4">
                        {Array.from({ length: 100 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-[#ff6b35] to-[#9333ea] rounded-full opacity-40"
                            style={{
                              height: `${Math.random() * 80 + 20}%`
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Version Tabs */}
                    <div className="flex items-center gap-3 mb-6">
                      {track.versions.map((version) => (
                        <button
                          key={version.id}
                          onClick={() => handleVersionChange(track.id, version.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            track.currentVersion === version.id
                              ? 'bg-[#ff6b35] text-white'
                              : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                          }`}
                        >
                          {version.label}
                        </button>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {tracks.length === 0 && !isGenerating && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">No tracks yet</h3>
                  <p className="text-gray-400">
                    Describe your track and click Generate to create your first track
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}