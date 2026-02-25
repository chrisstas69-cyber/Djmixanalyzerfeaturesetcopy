import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronDown, Plus, ArrowLeft, Home, X } from 'lucide-react';
import { CDJWaveform } from './CDJWaveform';

interface Track {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  length: string;
  duration: number;
  isPlaying: boolean;
  currentVersion: string;
  versions: Array<{ id: string; label: string }>;
}

interface CleanGeneratorLayoutProps {
  onBack: () => void;
}

export function CleanGeneratorLayout({ onBack }: CleanGeneratorLayoutProps) {
  const [musicDNAMode, setMusicDNAMode] = useState<'off' | 'my-dna' | 'custom'>('my-dna');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [useAIPrompt, setUseAIPrompt] = useState(false);
  const [description, setDescription] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>(['Hypnotic', 'Dark']);
  const [tagInput, setTagInput] = useState('');
  const [showLyrics, setShowLyrics] = useState(false);
  const [showReference, setShowReference] = useState(false);
  
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Nocturnal Sequence',
      bpm: 128,
      genre: 'Techno • Minimal',
      length: '7:08',
      duration: 428,
      isPlaying: false,
      currentVersion: 'A',
      versions: [
        { id: 'A', label: 'Version A' },
        { id: 'B', label: 'Version B' },
        { id: 'C', label: 'Version C' },
      ]
    }
  ]);

  const [previousTracks] = useState([
    {
      id: '2',
      title: 'Subsonic Ritual',
      bpm: 126,
      genre: 'Techno • Dub',
      length: '6:48',
      duration: 408
    },
    {
      id: '3',
      title: 'Hypnotic Elements',
      bpm: 124,
      genre: 'Minimal • Deep',
      length: '8:12',
      duration: 492
    }
  ]);

  const presets = [
    { id: 'joeski', emoji: '🎧', name: 'Joeski Techno' },
    { id: 'minimal', emoji: '🌊', name: 'Minimal Dub' },
    { id: 'hard', emoji: '🔥', name: 'Hard Techno' },
    { id: 'deep', emoji: '🌙', name: 'Deep House' },
  ];

  const styleTags = [
    'Hypnotic', 'Dark', 'Minimal', 'Driving',
    'Atmospheric', 'Industrial', 'Groovy', 'Deep',
    'Energetic', 'Melodic', 'Raw', 'Progressive'
  ];

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const togglePlayPause = (trackId: string) => {
    setTracks(prev => 
      prev.map(track => ({
        ...track,
        isPlaying: track.id === trackId ? !track.isPlaying : false
      }))
    );
  };

  const changeVersion = (trackId: string, versionId: string) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId
          ? { ...track, currentVersion: versionId }
          : track
      )
    );
  };

  // Calculate form completion
  const hasPreset = selectedPreset !== null;
  const hasDescription = description.trim().length > 0;
  const hasTags = activeTags.length > 0;
  
  const requiredFields = [hasPreset || hasDescription, hasTags];
  const completedFields = requiredFields.filter(Boolean).length;
  const totalRequired = requiredFields.length;
  const isFormComplete = completedFields === totalRequired;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">
          Custom <span className="text-[#ff6b35]">Generator</span>
        </h1>
        <p className="text-gray-400">
          Create professional dance music with advanced controls
        </p>
      </div>

      {/* Main Layout - Two Columns with 40px gap */}
      <div className="flex gap-10 p-8 max-w-[1800px] mx-auto">
        
        {/* LEFT COLUMN - 40% - Generation Controls */}
        <div className="w-[40%] flex-shrink-0">
          <div className="space-y-10">
            
            {/* SECTION 1: Audio DNA */}
            <div>
              <h2 className="text-white text-xl font-bold mb-2">Audio DNA</h2>
              <p className="text-gray-400 text-sm mb-8">Configure generation parameters</p>
              
              {/* DNA Toggle - 3 tabs with 10px spacing */}
              <div className="flex gap-2.5 mb-8">
                <button
                  onClick={() => setMusicDNAMode('off')}
                  className={`flex-1 px-5 py-3 rounded-lg font-medium transition-all ${
                    musicDNAMode === 'off'
                      ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30'
                      : 'bg-[#0f0f0f] text-gray-400 hover:text-white'
                  }`}
                >
                  Off
                </button>
                <button
                  onClick={() => setMusicDNAMode('my-dna')}
                  className={`flex-1 px-5 py-3 rounded-lg font-medium transition-all ${
                    musicDNAMode === 'my-dna'
                      ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30'
                      : 'bg-[#0f0f0f] text-gray-400 hover:text-white'
                  }`}
                >
                  My Music DNA
                </button>
                <button
                  onClick={() => setMusicDNAMode('custom')}
                  className={`flex-1 px-5 py-3 rounded-lg font-medium transition-all ${
                    musicDNAMode === 'custom'
                      ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30'
                      : 'bg-[#0f0f0f] text-gray-400 hover:text-white'
                  }`}
                >
                  Custom
                </button>
              </div>

              {/* Presets - Only show if "My Music DNA" is selected - 2x2 grid with 20px gap */}
              {musicDNAMode === 'my-dna' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-5 mb-8"
                >
                  {presets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`p-6 rounded-xl bg-[#0f0f0f] border-2 transition-all ${
                        selectedPreset === preset.id
                          ? 'border-[#ff6b35] shadow-lg shadow-[#ff6b35]/20'
                          : 'border-transparent hover:border-[#ff6b35]/50'
                      }`}
                    >
                      <div className="text-4xl mb-3">{preset.emoji}</div>
                      <div className="text-white font-medium text-sm">{preset.name}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* SECTION 2: Describe Your Track */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Describe Your Track</h3>
              
              {/* Large textarea - 170px height with character counter */}
              <div className="relative mb-5">
                <textarea
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 2000) {
                      setDescription(e.target.value);
                    }
                  }}
                  maxLength={2000}
                  placeholder="[synth][140][a-minor][dark-vibe, melodic] Driving bassline, ethereal pads, cinematic breakdown at 2:15..."
                  className="w-full h-[170px] bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-5 pb-10 text-white text-base resize-none focus:border-[#ff6b35] focus:outline-none transition-colors"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {description.length}/2000
                </div>
              </div>

              {/* AI Prompt Toggle - Switch with 30px margin-bottom */}
              <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg mb-8">
                <span className="text-white font-medium">Use AI-Generated Prompt</span>
                <button
                  onClick={() => setUseAIPrompt(!useAIPrompt)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    useAIPrompt ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-5 h-5 bg-white rounded-full"
                    animate={{ left: useAIPrompt ? '30px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* SECTION 3: Style Tags - Interactive with Suggestions */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Style Tags</h3>
              
              {/* Selected Tags Display */}
              {activeTags.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {activeTags.map(tag => (
                    <motion.div
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20 font-medium"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Tag Input */}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && tagInput.trim() !== '') {
                    if (!activeTags.includes(tagInput.trim())) {
                      setActiveTags([...activeTags, tagInput.trim()]);
                    }
                    setTagInput('');
                  }
                }}
                placeholder="Type to add tags or select from below..."
                className="w-full px-5 py-3 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] text-white placeholder:text-gray-500 focus:border-[#ff6b35] focus:outline-none transition-colors mb-3"
              />

              {/* Popular Tag Suggestions */}
              <div className="mb-2">
                <p className="text-gray-500 text-xs mb-2">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                  {styleTags
                    .filter(tag => !activeTags.includes(tag))
                    .slice(0, 8)
                    .map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-[#0f0f0f] text-gray-400 hover:text-white hover:bg-[#1a1a1a] border border-transparent hover:border-[#ff6b35]/30 transition-all"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* SECTION 4: Optional Fields (Collapsed) */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className="w-full flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Lyrics (Optional)</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showLyrics ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showLyrics && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      placeholder="Enter lyrics here..."
                      className="w-full h-[100px] bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4 text-white resize-none focus:border-[#ff6b35] focus:outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowReference(!showReference)}
                className="w-full flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Reference Track (Optional)</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showReference ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showReference && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-[#0f0f0f] border-2 border-dashed border-[#2a2a2a] rounded-lg text-center">
                      <p className="text-gray-400 mb-3">Drop audio file here</p>
                      <button className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors">
                        Browse Files
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECTION 5: Generate Buttons */}
            <div className="space-y-5">
              {/* Form Progress Indicator */}
              {!isFormComplete && (
                <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-[#1a1a1a]">
                  <span className="text-gray-400 text-sm">
                    {completedFields} of {totalRequired} required fields complete
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: totalRequired }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < completedFields ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Generate Button - 60px height, orange, glowing */}
              <button 
                disabled={!isFormComplete}
                className={`w-full h-[60px] text-white font-bold text-lg rounded-lg shadow-lg transition-all ${
                  isFormComplete
                    ? 'bg-[#ff6b35] hover:bg-[#ff8555] shadow-[#ff6b35]/30 cursor-pointer'
                    : 'bg-[#2a2a2a] cursor-not-allowed opacity-50'
                }`}
              >
                Generate Track
              </button>
              
              {/* Secondary Button - 50px height, orange border */}
              <button className="w-full h-[50px] bg-transparent border-2 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 font-bold rounded-lg transition-all">
                Advanced Settings
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - 60% - Generated Tracks */}
        <div className="flex-1">
          <div className="space-y-10">
            
            {/* New Generation Section */}
            <div>
              <h2 className="text-white text-xl font-bold mb-5">New Generation</h2>
              
              {/* Large Track Card - 30px padding, 16px radius */}
              {tracks.length > 0 && (
                <div className="bg-[#0f0f0f] rounded-2xl p-8 border border-[#2a2a2a] mb-8">
                  {/* Track Info - 20px margin-bottom */}
                  <div className="mb-5">
                    <h3 className="text-white text-2xl font-bold mb-2">{tracks[0].title}</h3>
                    <p className="text-gray-400 text-sm">
                      {tracks[0].bpm} BPM • {tracks[0].genre} • {tracks[0].length}
                    </p>
                  </div>

                  {/* Waveform - 180px height, 20px margin-bottom */}
                  <div className="mb-5">
                    <CDJWaveform
                      duration={tracks[0].duration}
                      currentTime={0}
                      isPlaying={tracks[0].isPlaying}
                      onSeek={(time) => console.log('Seek to:', time)}
                      showSections={true}
                      height={180}
                    />
                  </div>

                  {/* Playback Controls - Centered, 20px margin-bottom */}
                  <div className="flex flex-col items-center mb-5">
                    <button
                      onClick={() => togglePlayPause(tracks[0].id)}
                      className="flex items-center gap-3 px-8 py-4 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-bold transition-colors mb-2"
                    >
                      {tracks[0].isPlaying ? (
                        <>
                          <Pause className="w-6 h-6" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6" />
                          Play
                        </>
                      )}
                    </button>
                    <p className="text-gray-400 text-sm">
                      0s / {tracks[0].duration}s
                    </p>
                  </div>

                  {/* Version Tabs - 10px spacing, 20px margin-bottom */}
                  <div className="flex gap-2.5 mb-5">
                    {tracks[0].versions.map(version => (
                      <button
                        key={version.id}
                        onClick={() => changeVersion(tracks[0].id, version.id)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          tracks[0].currentVersion === version.id
                            ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20'
                            : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                        }`}
                      >
                        {version.label}
                      </button>
                    ))}
                  </div>

                  {/* Mutations - 2 rows, 3 columns, 15px gap */}
                  <div>
                    <h4 className="text-white font-bold mb-4">Mutations</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        'Mutate Bass',
                        'Reduce Percussion',
                        'Change Groove',
                        'Clean Top End',
                        'Change Harmony',
                        'Darker Version'
                      ].map(mutation => (
                        <button
                          key={mutation}
                          className="px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-transparent hover:border-[#ff6b35] rounded-lg text-white text-sm font-medium transition-all"
                        >
                          {mutation}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Previous Generations Section */}
            <div>
              <h2 className="text-white text-lg font-bold mb-5">Previous Generations</h2>
              
              {/* Compact Track Cards - 20px padding, 20px margin-bottom */}
              <div className="space-y-5">
                {previousTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-[#0f0f0f] rounded-xl p-5 border border-[#2a2a2a] hover:border-[#ff6b35]/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">{track.title}</h4>
                        <p className="text-gray-400 text-sm">
                          {track.bpm} BPM • {track.genre} • {track.length}
                        </p>
                      </div>
                      <button className="p-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg transition-colors">
                        <Play className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* Mini Waveform - 80px height */}
                    <div className="h-[80px] bg-[#0a0a0a] rounded-lg overflow-hidden">
                      <div className="h-full flex items-center gap-px px-2">
                        {Array.from({ length: 120 }).map((_, i) => {
                          const height = Math.random() * 70 + 10;
                          const colors = ['#3b82f6', '#22c55e', '#eab308', '#ff6b35'];
                          const color = colors[Math.floor(Math.random() * colors.length)];
                          return (
                            <div
                              key={i}
                              className="flex-1 relative"
                            >
                              <div
                                className="absolute bottom-1/2 w-full rounded-sm"
                                style={{
                                  height: `${height / 2}px`,
                                  backgroundColor: color,
                                  opacity: 0.8
                                }}
                              />
                              <div
                                className="absolute top-1/2 w-full rounded-sm"
                                style={{
                                  height: `${height / 2}px`,
                                  backgroundColor: color,
                                  opacity: 0.8
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}