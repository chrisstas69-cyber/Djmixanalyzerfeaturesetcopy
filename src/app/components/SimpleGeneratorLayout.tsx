import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ArrowLeft, Sparkles, Plus, ChevronDown, Upload, X, Home } from 'lucide-react';
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

interface Preset {
  id: string;
  emoji: string;
  name: string;
}

interface SimpleGeneratorLayoutProps {
  onBack: () => void;
}

export function SimpleGeneratorLayout({ onBack }: SimpleGeneratorLayoutProps) {
  const [musicDNAMode, setMusicDNAMode] = useState<'off' | 'my-dna' | 'custom'>('my-dna');
  const [selectedPreset, setSelectedPreset] = useState<string | null>('minimal');
  const [activeTags, setActiveTags] = useState<string[]>(['Hypnotic', 'Dark']);
  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [trackDescription, setTrackDescription] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; duration: string; format: string } | null>(null);
  
  // Custom mode - Audio DNA parameters
  const [genre, setGenre] = useState('Techno');
  const [subgenre, setSubgenre] = useState('Minimal');
  const [dub, setDub] = useState('Medium');
  const [energy, setEnergy] = useState(70);
  const [tempo, setTempo] = useState(128);
  const [tempoGroove, setTempoGroove] = useState('Straight');
  const [rhythmDensity, setRhythmDensity] = useState('Balanced');
  const [bassLowEnd, setBassLowEnd] = useState('Deep');
  const [harmonyTexture, setHarmonyTexture] = useState('Atmospheric');
  const [arrangement, setArrangement] = useState('Build-up');
  const [advanced, setAdvanced] = useState('Standard');
  
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Nocturnal Sequence',
      bpm: 128,
      genre: 'Techno • Minimal',
      length: '7:24',
      duration: 444,
      isPlaying: false,
      currentVersion: 'A',
      versions: [
        { id: 'A', label: 'Version A' },
        { id: 'B', label: 'Version B' },
        { id: 'C', label: 'Version C' },
      ]
    },
    {
      id: '2',
      title: 'Subsonic Ritual',
      bpm: 126,
      genre: 'Techno • Dub',
      length: '6:48',
      duration: 408,
      isPlaying: false,
      currentVersion: 'A',
      versions: [
        { id: 'A', label: 'Version A' },
        { id: 'B', label: 'Version B' },
        { id: 'C', label: 'Version C' },
      ]
    }
  ]);

  const presets: Preset[] = [
    { id: 'joeski', emoji: '🎧', name: 'Joeski Techno' },
    { id: 'minimal', emoji: '🌊', name: 'Minimal Dub' },
    { id: 'hard', emoji: '🔥', name: 'Hard Techno' },
    { id: 'deep', emoji: '🌙', name: 'Deep House' },
    { id: 'melodic', emoji: '🌌', name: 'Melodic Techno' },
    { id: 'peaktime', emoji: '⚡', name: 'Peak Time' },
  ];

  const styleTags = [
    'Hypnotic', 'Dark', 'Minimal', 'Driving',
    'Atmospheric', 'Groovy', 'Deep', 'Raw'
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

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedFile({
      name: 'dark_atmosphere.mp3',
      duration: '3:45',
      format: 'MP3'
    });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

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
          {musicDNAMode === 'custom' ? 'Custom' : 'Simple'} <span className="text-[#ff6b35]">Generator</span>
        </h1>
        <p className="text-gray-400">
          {musicDNAMode === 'custom' 
            ? 'Fine-tune every detail with advanced audio DNA parameters'
            : 'Quick and easy track generation with presets'
          }
        </p>
      </div>

      {/* Main Layout - Two Columns with 40px gap */}
      <div className="flex gap-10 p-8 max-w-[1800px] mx-auto">
        
        {/* LEFT COLUMN - 40% - Generation Controls */}
        <div className="w-[40%] flex-shrink-0">
          <div className="space-y-8">
            
            {/* SECTION 1: Audio DNA */}
            <div>
              <h2 className="text-white text-xl font-bold mb-5">Audio DNA</h2>
              
              {/* DNA Toggle - 3 tabs with 12px spacing */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setMusicDNAMode('off')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    musicDNAMode === 'off'
                      ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  Off
                </button>
                <button
                  onClick={() => setMusicDNAMode('my-dna')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    musicDNAMode === 'my-dna'
                      ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  My Music DNA
                </button>
                <button
                  onClick={() => setMusicDNAMode('custom')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    musicDNAMode === 'custom'
                      ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* SECTION 2: Presets OR Sliders (conditional based on Audio DNA mode) */}
            {musicDNAMode !== 'custom' ? (
              /* SHOW PRESETS when mode is "off" or "my-dna" */
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Presets</h3>
                
                {/* Preset Grid - 2 columns × 3 rows, 24px gap, 180px × 180px cards */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {presets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`h-[180px] rounded-xl bg-[#0f0f0f] border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                        selectedPreset === preset.id
                          ? 'border-[#ff6b35] shadow-lg shadow-[#ff6b35]/20'
                          : 'border-transparent hover:border-[#ff6b35]/50'
                      }`}
                    >
                      <div className="text-[50px]">{preset.emoji}</div>
                      <div className="text-white font-medium">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* SHOW AUDIO DNA SLIDERS when mode is "custom" */
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Audio DNA Parameters</h3>
                
                <div className="space-y-6 mb-8">
                  {/* Genre Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Genre</label>
                      <span className="text-gray-400 text-sm">{genre}</span>
                    </div>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Techno">Techno</option>
                      <option value="House">House</option>
                      <option value="Trance">Trance</option>
                      <option value="Progressive">Progressive</option>
                      <option value="Deep House">Deep House</option>
                      <option value="Tech House">Tech House</option>
                    </select>
                  </div>

                  {/* Subgenre Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Subgenre</label>
                      <span className="text-gray-400 text-sm">{subgenre}</span>
                    </div>
                    <select
                      value={subgenre}
                      onChange={(e) => setSubgenre(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Minimal">Minimal</option>
                      <option value="Peak Time">Peak Time</option>
                      <option value="Melodic">Melodic</option>
                      <option value="Dark">Dark</option>
                      <option value="Dub">Dub</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>

                  {/* Dub Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Dub</label>
                      <span className="text-gray-400 text-sm">{dub}</span>
                    </div>
                    <select
                      value={dub}
                      onChange={(e) => setDub(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Off">Off</option>
                      <option value="Light">Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Heavy">Heavy</option>
                    </select>
                  </div>

                  {/* Energy Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Energy</label>
                      <span className="text-[#ff6b35] font-bold">{energy}%</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={energy}
                        onChange={(e) => setEnergy(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-[#1a1a1a] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{
                          background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${energy}%, #1a1a1a ${energy}%, #1a1a1a 100%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Tempo Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Tempo</label>
                      <span className="text-[#ff6b35] font-bold">{tempo} BPM</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="80"
                        max="180"
                        value={tempo}
                        onChange={(e) => setTempo(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-[#1a1a1a] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{
                          background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${((tempo - 80) / (180 - 80)) * 100}%, #1a1a1a ${((tempo - 80) / (180 - 80)) * 100}%, #1a1a1a 100%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Tempo & Groove Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Tempo & Groove</label>
                      <span className="text-gray-400 text-sm">{tempoGroove}</span>
                    </div>
                    <select
                      value={tempoGroove}
                      onChange={(e) => setTempoGroove(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Straight">Straight</option>
                      <option value="Shuffle">Shuffle</option>
                      <option value="Swing">Swing</option>
                      <option value="Triplet">Triplet</option>
                    </select>
                  </div>

                  {/* Rhythm Density Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Rhythm Density</label>
                      <span className="text-gray-400 text-sm">{rhythmDensity}</span>
                    </div>
                    <select
                      value={rhythmDensity}
                      onChange={(e) => setRhythmDensity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Sparse">Sparse</option>
                      <option value="Balanced">Balanced</option>
                      <option value="Dense">Dense</option>
                    </select>
                  </div>

                  {/* Bass & Low End Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Bass & Low End</label>
                      <span className="text-gray-400 text-sm">{bassLowEnd}</span>
                    </div>
                    <select
                      value={bassLowEnd}
                      onChange={(e) => setBassLowEnd(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Deep">Deep</option>
                      <option value="Punchy">Punchy</option>
                      <option value="Rolling">Rolling</option>
                      <option value="Sub-heavy">Sub-heavy</option>
                    </select>
                  </div>

                  {/* Harmony & Texture Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Harmony & Texture</label>
                      <span className="text-gray-400 text-sm">{harmonyTexture}</span>
                    </div>
                    <select
                      value={harmonyTexture}
                      onChange={(e) => setHarmonyTexture(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Minimal">Minimal</option>
                      <option value="Atmospheric">Atmospheric</option>
                      <option value="Complex">Complex</option>
                      <option value="Layered">Layered</option>
                    </select>
                  </div>

                  {/* Arrangement Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Arrangement</label>
                      <span className="text-gray-400 text-sm">{arrangement}</span>
                    </div>
                    <select
                      value={arrangement}
                      onChange={(e) => setArrangement(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Linear">Linear</option>
                      <option value="Build-up">Build-up</option>
                      <option value="Peak-focused">Peak-focused</option>
                      <option value="Progressive">Progressive</option>
                    </select>
                  </div>

                  {/* Advanced Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-bold">Advanced</label>
                      <span className="text-gray-400 text-sm">{advanced}</span>
                    </div>
                    <select
                      value={advanced}
                      onChange={(e) => setAdvanced(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:border-[#ff6b35] focus:outline-none cursor-pointer"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Experimental">Experimental</option>
                      <option value="Classic">Classic</option>
                      <option value="Modern">Modern</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: Style Tags */}
            <div>
              <h3 className="text-white font-bold mb-3">Style Tags</h3>
              
              {/* Pill-shaped tag buttons with 10px gap */}
              <div className="flex flex-wrap gap-2.5">
                {styleTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      activeTags.includes(tag)
                        ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20'
                        : 'bg-[#0f0f0f] text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add new tag"
                    className="px-4 py-2 rounded-full font-medium bg-[#0f0f0f] border border-[#2a2a2a] text-white focus:border-[#ff6b35] focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (tagInput.trim() && !activeTags.includes(tagInput.trim())) {
                        setActiveTags([...activeTags, tagInput.trim()]);
                        setTagInput('');
                      }
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-[#ff6b35] text-white rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3.5: Describe Your Track (Optional) - Collapsible */}
            <div>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full flex items-center justify-between mb-3"
              >
                <h3 className="text-white font-bold">Describe Your Track</h3>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDescription ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showDescription && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <textarea
                        placeholder="[synth][140][a-minor][dark-vibe, melodic] Driving bassline, ethereal pads, cinematic breakdown at 2:15..."
                        value={trackDescription}
                        onChange={(e) => {
                          if (e.target.value.length <= 2000) {
                            setTrackDescription(e.target.value);
                          }
                        }}
                        maxLength={2000}
                        className="w-full h-[140px] bg-[#1a1a1a] border border-[#333] rounded-lg p-4 text-white text-sm placeholder:text-gray-500 resize-none focus:border-[#ff6b35] focus:outline-none"
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                        {trackDescription.length}/2000
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECTION 4: Optional Collapsed Sections */}
            <div className="space-y-4">
              {/* Add Lyrics (Optional) - Collapsible */}
              <div>
                <button
                  onClick={() => setShowLyrics(!showLyrics)}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-white font-bold">Add Lyrics (Optional)</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showLyrics ? 'rotate-180' : ''}`} />
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
                        placeholder="Enter lyrics, verse/chorus structure, or vocal ideas..."
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        className="w-full h-[180px] bg-[#1a1a1a] border border-[#333] rounded-lg p-4 text-white text-sm placeholder:text-gray-400 placeholder:italic resize-none focus:border-[#ff6b35] focus:outline-none font-mono"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reference Track (Optional) - Collapsed by default */}
              <div>
                <button
                  onClick={() => setShowReference(!showReference)}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-white font-bold">Reference Track (Optional)</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showReference ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showReference && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {uploadedFile ? (
                        /* UPLOADED FILE - Show file info with delete button */
                        <div className="h-[100px] bg-[#1a1a1a] border-2 border-[#333] rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium mb-1">{uploadedFile.name}</p>
                            <p className="text-gray-400 text-sm">{uploadedFile.format} • {uploadedFile.duration}</p>
                          </div>
                          <button
                            onClick={handleRemoveFile}
                            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors group"
                          >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                          </button>
                        </div>
                      ) : (
                        /* EMPTY STATE - Drag & drop upload area */
                        <button
                          onClick={handleFileUpload}
                          className="h-[100px] w-full bg-[#1a1a1a] border-2 border-dashed border-[#333] hover:border-[#ff6b35] rounded-lg transition-colors group"
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#ff6b35] mb-2 transition-colors" />
                            <p className="text-gray-400 group-hover:text-white text-sm transition-colors">
                              Drag & drop audio file or click to browse
                            </p>
                          </div>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* SECTION 5: Generate Button */}
            <div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-[60px] bg-[#ff6b35] hover:bg-[#ff8555] disabled:bg-[#2a2a2a] disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl shadow-lg shadow-[#ff6b35]/30 transition-all flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Generate Track
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - 60% - Generated Tracks */}
        <div className="flex-1">
          <div className="space-y-8">
            
            {/* Section Title */}
            <div>
              <h2 className="text-white text-xl font-bold mb-5">Generated Tracks</h2>
            </div>

            {/* Track Cards - Stacked Vertically with 30px gap */}
            {tracks.length > 0 ? (
              <div className="space-y-8">
                {tracks.map(track => (
                  <div
                    key={track.id}
                    className="bg-[#0f0f0f] rounded-2xl p-8 border border-[#2a2a2a]"
                  >
                    {/* Track Info */}
                    <div className="mb-5">
                      <h3 className="text-white text-2xl font-bold mb-2">{track.title}</h3>
                      <p className="text-[#888888] text-sm">
                        {track.bpm} BPM • {track.genre} • {track.length}
                      </p>
                    </div>

                    {/* Waveform - 120px height */}
                    <div className="mb-5">
                      <CDJWaveform
                        duration={track.duration}
                        currentTime={0}
                        isPlaying={track.isPlaying}
                        onSeek={(time) => console.log('Seek to:', time)}
                        showSections={true}
                        height={120}
                      />
                    </div>

                    {/* Playback Controls - Centered */}
                    <div className="flex flex-col items-center mb-4">
                      <button
                        onClick={() => togglePlayPause(track.id)}
                        className="flex items-center gap-3 px-8 py-4 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-bold transition-colors mb-2"
                      >
                        {track.isPlaying ? (
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
                        0:00 / {track.length}
                      </p>
                    </div>

                    {/* Version Tabs - 10px gap */}
                    <div className="flex gap-2.5">
                      {track.versions.map(version => (
                        <button
                          key={version.id}
                          onClick={() => changeVersion(track.id, version.id)}
                          className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            track.currentVersion === version.id
                              ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20'
                              : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                          }`}
                        >
                          {version.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-[#0f0f0f] rounded-2xl border border-[#2a2a2a]">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-white text-xl">No tracks yet</h3>
                  <p className="text-gray-400 max-w-sm">
                    Select a preset, choose your style tags, and click Generate Track
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