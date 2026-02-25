import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ChevronRight,
  ChevronDown,
  X,
  Play,
  Download,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Activity,
  Waves,
  Music2,
  Settings2,
  Upload,
  Edit3,
  GripVertical,
  Loader2
} from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  duration: number;
  energy: number; // 0-1
  albumArt?: string;
}

interface MixConfig {
  duration: number; // minutes
  energyFlow: 'build-up' | 'cool-down' | 'steady' | 'wave';
  transitionStyle: 'smooth' | 'quick' | 'creative';
  harmonicMixing: boolean;
  transitionDuration: number; // seconds
  eqStyle: 'bass-swap' | 'fade' | 'cut';
  effects: string[];
}

interface GeneratedMixTrack {
  track: Track;
  startTime: number;
  endTime: number;
  transitionType: string;
}

const sampleTracks: Track[] = [
  { id: '1', name: 'Nocturnal Sequence', artist: 'Dark Matter', bpm: 128, key: '4A', genre: 'Techno', duration: 444, energy: 0.7 },
  { id: '2', name: 'Subsonic Ritual', artist: 'The Collective', bpm: 126, key: '4A', genre: 'House', duration: 408, energy: 0.6 },
  { id: '3', name: 'Hypnotic Elements', artist: 'Pulse', bpm: 130, key: '5A', genre: 'Minimal', duration: 492, energy: 0.8 },
  { id: '4', name: 'Deep Resonance', artist: 'Sub Frequency', bpm: 124, key: '3A', genre: 'Deep House', duration: 372, energy: 0.5 },
  { id: '5', name: 'Ethereal Dawn', artist: 'Sunrise Collective', bpm: 125, key: '8B', genre: 'Progressive', duration: 438, energy: 0.7 },
  { id: '6', name: 'Midnight Drive', artist: 'Neon Lights', bpm: 128, key: '4A', genre: 'Techno', duration: 420, energy: 0.9 },
  { id: '7', name: 'Urban Pulse', artist: 'City Beats', bpm: 127, key: '5A', genre: 'Tech House', duration: 396, energy: 0.8 },
  { id: '8', name: 'Cosmic Journey', artist: 'Star Gazers', bpm: 126, key: '9B', genre: 'Progressive', duration: 462, energy: 0.6 },
];

type Step = 'select' | 'configure' | 'generate';

export function AutoDJMix() {
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [mixConfig, setMixConfig] = useState<MixConfig>({
    duration: 60,
    energyFlow: 'build-up',
    transitionStyle: 'smooth',
    harmonicMixing: true,
    transitionDuration: 60,
    eqStyle: 'bass-swap',
    effects: ['Filter Sweeps']
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedMix, setGeneratedMix] = useState<GeneratedMixTrack[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectAll = () => {
    setSelectedTracks([...sampleTracks]);
  };

  const handleAIChoose = () => {
    // AI selects 5-6 tracks that work well together
    const aiSelected = sampleTracks.filter(t => ['1', '2', '3', '5', '6'].includes(t.id));
    setSelectedTracks(aiSelected);
  };

  const toggleTrack = (track: Track) => {
    if (selectedTracks.find(t => t.id === track.id)) {
      setSelectedTracks(selectedTracks.filter(t => t.id !== track.id));
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const removeTrack = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter(t => t.id !== trackId));
  };

  const handleGenerateMix = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('generate');

    const steps = [
      'Analyzing track DNA...',
      'Finding harmonic matches...',
      'Optimizing energy flow...',
      'Creating transitions...',
      'Finalizing mix...'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setGenerationProgress(progress);
      setGenerationStep(steps[Math.floor(progress / 20) - 1] || steps[0]);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          generateMixTracks();
        }, 500);
      }
    }, 800);
  };

  const generateMixTracks = () => {
    let currentTime = 0;
    const tracks: GeneratedMixTrack[] = [];
    
    selectedTracks.forEach((track, index) => {
      const transitionOverlap = index > 0 ? mixConfig.transitionDuration : 0;
      const startTime = currentTime - transitionOverlap;
      const endTime = startTime + track.duration;
      
      tracks.push({
        track,
        startTime,
        endTime,
        transitionType: index === 0 ? 'Intro' : mixConfig.transitionStyle === 'smooth' ? 'Smooth Blend' : mixConfig.transitionStyle === 'quick' ? 'Quick Cut' : 'Creative Effect'
      });
      
      currentTime = endTime;
    });

    setGeneratedMix(tracks);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    if (generatedMix.length === 0) return 0;
    return generatedMix[generatedMix.length - 1].endTime;
  };

  const getEnergyFlowIcon = (flow: string) => {
    switch (flow) {
      case 'build-up': return <TrendingUp className="w-4 h-4" />;
      case 'cool-down': return <TrendingDown className="w-4 h-4" />;
      case 'steady': return <Activity className="w-4 h-4" />;
      case 'wave': return <Waves className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#ff6b35]" />
            Create Your AI DJ Mix
          </h1>
          <p className="text-[#808080] mt-1">
            {currentStep === 'select' && 'Select tracks or let AI choose for you'}
            {currentStep === 'configure' && 'Configure your perfect mix settings'}
            {currentStep === 'generate' && (isGenerating ? 'Generating your AI-powered mix...' : 'Your AI-generated mix is ready!')}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                currentStep === 'select' ? 'bg-[#ff6b35] text-white' : 
                currentStep !== 'select' ? 'bg-[#ff6b35] text-white' : 'bg-[#1a1a1a] text-[#808080]'
              }`}>
                {currentStep !== 'select' ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <div>
                <div className={`text-sm font-medium ${currentStep === 'select' ? 'text-white' : 'text-[#808080]'}`}>
                  Select Tracks
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#808080]" />

            {/* Step 2 */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                currentStep === 'configure' ? 'bg-[#ff6b35] text-white' : 
                currentStep === 'generate' ? 'bg-[#ff6b35] text-white' : 'bg-[#1a1a1a] text-[#808080]'
              }`}>
                {currentStep === 'generate' ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <div>
                <div className={`text-sm font-medium ${currentStep === 'configure' ? 'text-white' : 'text-[#808080]'}`}>
                  Configure Mix
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#808080]" />

            {/* Step 3 */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                currentStep === 'generate' ? 'bg-[#ff6b35] text-white' : 'bg-[#1a1a1a] text-[#808080]'
              }`}>
                3
              </div>
              <div>
                <div className={`text-sm font-medium ${currentStep === 'generate' ? 'text-white' : 'text-[#808080]'}`}>
                  Generate & Export
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SelectTracksStep
                  tracks={sampleTracks}
                  selectedTracks={selectedTracks}
                  onToggleTrack={toggleTrack}
                  onSelectAll={handleSelectAll}
                  onAIChoose={handleAIChoose}
                  onRemoveTrack={removeTrack}
                  onNext={() => setCurrentStep('configure')}
                />
              </motion.div>
            )}

            {currentStep === 'configure' && (
              <motion.div
                key="configure"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ConfigureMixStep
                  config={mixConfig}
                  onConfigChange={setMixConfig}
                  showAdvanced={showAdvanced}
                  onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                  onBack={() => setCurrentStep('select')}
                  onGenerate={handleGenerateMix}
                  selectedCount={selectedTracks.length}
                />
              </motion.div>
            )}

            {currentStep === 'generate' && (
              <motion.div
                key="generate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GenerateExportStep
                  isGenerating={isGenerating}
                  progress={generationProgress}
                  currentStep={generationStep}
                  generatedMix={generatedMix}
                  totalDuration={getTotalDuration()}
                  energyFlow={mixConfig.energyFlow}
                  isPlaying={isPlaying}
                  onPlay={() => setIsPlaying(!isPlaying)}
                  formatTime={formatTime}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Step 1: Select Tracks
interface SelectTracksStepProps {
  tracks: Track[];
  selectedTracks: Track[];
  onToggleTrack: (track: Track) => void;
  onSelectAll: () => void;
  onAIChoose: () => void;
  onRemoveTrack: (id: string) => void;
  onNext: () => void;
}

function SelectTracksStep({
  tracks,
  selectedTracks,
  onToggleTrack,
  onSelectAll,
  onAIChoose,
  onRemoveTrack,
  onNext
}: SelectTracksStepProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSelectAll}
          className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white text-sm font-medium transition-colors"
        >
          Select All
        </button>
        <button
          onClick={onAIChoose}
          className="px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Let AI Choose
        </button>
        <div className="flex-1" />
        <div className="text-sm text-[#808080]">
          {selectedTracks.length} track{selectedTracks.length !== 1 ? 's' : ''} selected
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Tracks */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Available Tracks</h3>
          <div className="space-y-2">
            {tracks.map((track) => {
              const isSelected = selectedTracks.find(t => t.id === track.id);
              return (
                <div
                  key={track.id}
                  onClick={() => onToggleTrack(track)}
                  className={`bg-[#0f0f0f] border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                      : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#ff6b35] border-[#ff6b35]'
                        : 'border-[#808080]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Album Art */}
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-[#ff6b35] to-[#ff8555] flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-white" />
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{track.name}</div>
                      <div className="text-[#808080] text-sm truncate">{track.artist}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="text-[#ff6b35] font-mono">{track.bpm} BPM</span>
                        <span className="text-[#4488ff] font-mono">{track.key}</span>
                        <span className="text-[#808080]">{track.genre}</span>
                      </div>
                    </div>

                    {/* Energy Bar */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs text-[#808080]">Energy</div>
                      <div className="w-20 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#44ff44] via-[#ffaa00] to-[#ff4444]"
                          style={{ width: `${track.energy * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tracks */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Selected Tracks ({selectedTracks.length})</h3>
          {selectedTracks.length === 0 ? (
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-8 text-center">
              <Music2 className="w-12 h-12 text-[#808080] mx-auto mb-3" />
              <p className="text-[#808080]">No tracks selected yet</p>
              <p className="text-[#808080] text-sm mt-1">Select tracks from the left or let AI choose</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3 flex items-center gap-3 hover:border-[#3a3a3a] transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-[#808080] cursor-move" />
                  <div className="w-8 h-8 rounded bg-[#1a1a1a] flex items-center justify-center text-[#808080] text-sm font-mono">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{track.name}</div>
                    <div className="text-[#808080] text-xs truncate">{track.artist}</div>
                  </div>
                  <button
                    onClick={() => onRemoveTrack(track.id)}
                    className="w-6 h-6 rounded hover:bg-[#1a1a1a] flex items-center justify-center text-[#808080] hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-6 border-t border-[#2a2a2a]">
        <button
          onClick={onNext}
          disabled={selectedTracks.length === 0}
          className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] disabled:bg-[#1a1a1a] disabled:text-[#808080] rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          Next: Configure Mix
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Step 2: Configure Mix
interface ConfigureMixStepProps {
  config: MixConfig;
  onConfigChange: (config: MixConfig) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onBack: () => void;
  onGenerate: () => void;
  selectedCount: number;
}

function ConfigureMixStep({
  config,
  onConfigChange,
  showAdvanced,
  onToggleAdvanced,
  onBack,
  onGenerate,
  selectedCount
}: ConfigureMixStepProps) {
  const getEnergyFlowGraph = () => {
    const points = 50;
    let values: number[] = [];
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      let value = 0.5;
      
      switch (config.energyFlow) {
        case 'build-up':
          value = 0.3 + (progress * 0.6);
          break;
        case 'cool-down':
          value = 0.9 - (progress * 0.6);
          break;
        case 'steady':
          value = 0.6;
          break;
        case 'wave':
          value = 0.5 + Math.sin(progress * Math.PI * 2) * 0.3;
          break;
      }
      
      values.push(value);
    }
    
    return values;
  };

  const energyGraph = getEnergyFlowGraph();

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Settings */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold mb-4">Mix Settings</h3>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm text-[#808080]">Duration</label>
            <select
              value={config.duration}
              onChange={(e) => onConfigChange({ ...config, duration: parseInt(e.target.value) })}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b35] cursor-pointer"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
            </select>
          </div>

          {/* Energy Flow */}
          <div className="space-y-2">
            <label className="text-sm text-[#808080]">Energy Flow</label>
            <select
              value={config.energyFlow}
              onChange={(e) => onConfigChange({ ...config, energyFlow: e.target.value as any })}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b35] cursor-pointer"
            >
              <option value="build-up">Build Up (Low → High)</option>
              <option value="cool-down">Cool Down (High → Low)</option>
              <option value="steady">Steady</option>
              <option value="wave">Wave (Up & Down)</option>
            </select>
          </div>

          {/* Transition Style */}
          <div className="space-y-2">
            <label className="text-sm text-[#808080]">Transition Style</label>
            <select
              value={config.transitionStyle}
              onChange={(e) => onConfigChange({ ...config, transitionStyle: e.target.value as any })}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b35] cursor-pointer"
            >
              <option value="smooth">Smooth (long blends)</option>
              <option value="quick">Quick (short cuts)</option>
              <option value="creative">Creative (effects & filters)</option>
            </select>
          </div>

          {/* Harmonic Mixing */}
          <div className="flex items-center justify-between bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-3">
            <div>
              <div className="text-white text-sm font-medium">Harmonic Mixing</div>
              <div className="text-xs text-[#808080]">Use Camelot wheel for key-compatible transitions</div>
            </div>
            <button
              onClick={() => onConfigChange({ ...config, harmonicMixing: !config.harmonicMixing })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config.harmonicMixing ? 'bg-[#ff6b35]' : 'bg-[#1a1a1a]'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                config.harmonicMixing ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Advanced Options */}
          <div className="pt-4">
            <button
              onClick={onToggleAdvanced}
              className="w-full flex items-center justify-between text-white hover:text-[#ff6b35] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Advanced Options
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-4">
                    {/* Transition Duration */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#808080]">Transition Duration</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="30"
                          max="120"
                          step="10"
                          value={config.transitionDuration}
                          onChange={(e) => onConfigChange({ ...config, transitionDuration: parseInt(e.target.value) })}
                          className="flex-1 h-2 bg-[#1a1a1a] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff6b35] [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <span className="text-white font-mono text-sm w-16">{config.transitionDuration}s</span>
                      </div>
                    </div>

                    {/* EQ Style */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#808080]">EQ Style</label>
                      <select
                        value={config.eqStyle}
                        onChange={(e) => onConfigChange({ ...config, eqStyle: e.target.value as any })}
                        className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b35] cursor-pointer"
                      >
                        <option value="bass-swap">Bass Swap</option>
                        <option value="fade">Fade</option>
                        <option value="cut">Cut</option>
                      </select>
                    </div>

                    {/* Effects */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#808080]">Effects</label>
                      <div className="flex flex-wrap gap-2">
                        {['Filter Sweeps', 'Reverb', 'Delay', 'Echo'].map((effect) => {
                          const isActive = config.effects.includes(effect);
                          return (
                            <button
                              key={effect}
                              onClick={() => {
                                if (isActive) {
                                  onConfigChange({ ...config, effects: config.effects.filter(e => e !== effect) });
                                } else {
                                  onConfigChange({ ...config, effects: [...config.effects, effect] });
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? 'bg-[#ff6b35] text-white'
                                  : 'bg-[#1a1a1a] text-[#808080] hover:text-white'
                              }`}
                            >
                              {effect}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Energy Flow Visualization */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold mb-4">Energy Flow Preview</h3>
          
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6">
            <div className="h-48 flex items-end justify-between gap-1">
              {energyGraph.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-[#ff6b35] to-[#ff8555] rounded-t"
                  style={{ height: `${value * 100}%` }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-[#808080]">
              <span>Start</span>
              <span>Middle</span>
              <span>End</span>
            </div>
          </div>

          {/* Mix Summary */}
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6 space-y-4">
            <h4 className="text-white font-semibold">Mix Summary</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#808080]">Selected Tracks</span>
                <span className="text-white font-mono">{selectedCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#808080]">Target Duration</span>
                <span className="text-white font-mono">{config.duration} min</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#808080]">Transition Style</span>
                <span className="text-white capitalize">{config.transitionStyle}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#808080]">Harmonic Mixing</span>
                <span className={config.harmonicMixing ? 'text-[#44ff44]' : 'text-[#808080]'}>
                  {config.harmonicMixing ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              {config.effects.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#808080]">Effects</span>
                  <span className="text-white text-sm">{config.effects.length} active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#2a2a2a]">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={onGenerate}
          className="px-8 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors flex items-center gap-2 text-lg"
        >
          <Sparkles className="w-5 h-5" />
          Generate Mix
        </button>
      </div>
    </div>
  );
}

// Step 3: Generate & Export
interface GenerateExportStepProps {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  generatedMix: GeneratedMixTrack[];
  totalDuration: number;
  energyFlow: string;
  isPlaying: boolean;
  onPlay: () => void;
  formatTime: (seconds: number) => string;
}

function GenerateExportStep({
  isGenerating,
  progress,
  currentStep,
  generatedMix,
  totalDuration,
  energyFlow,
  isPlaying,
  onPlay,
  formatTime
}: GenerateExportStepProps) {
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative w-24 h-24 mx-auto">
            <Loader2 className="w-24 h-24 text-[#ff6b35] animate-spin" />
            <Sparkles className="w-10 h-10 text-white absolute inset-0 m-auto" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">AI is creating your mix...</h3>
            <p className="text-[#808080]">{currentStep}</p>
          </div>

          <div className="space-y-2">
            <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-sm text-[#808080] font-mono">{progress}%</div>
          </div>
        </div>
      </div>
    );
  }

  // Generate waveform visualization
  const waveformBars = 200;
  const waveformData = Array.from({ length: waveformBars }, (_, i) => {
    const position = i / waveformBars;
    
    // Find which track this position belongs to
    let trackEnergy = 0.5;
    for (const mixTrack of generatedMix) {
      const trackStart = mixTrack.startTime / totalDuration;
      const trackEnd = mixTrack.endTime / totalDuration;
      
      if (position >= trackStart && position <= trackEnd) {
        trackEnergy = mixTrack.track.energy;
        break;
      }
    }
    
    const wave = Math.sin(position * Math.PI * 16) * 0.3;
    const noise = Math.random() * 0.2;
    return (trackEnergy + wave + noise) * 0.8;
  });

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-[#ff6b35]/20 to-transparent border-l-4 border-[#ff6b35] rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#ff6b35] flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Your AI-Generated Mix is Ready!</h3>
            <p className="text-[#808080]">Listen, export, or upload to your favorite platforms</p>
          </div>
        </div>
      </div>

      {/* Waveform */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold">Full Mix Waveform</h4>
          <div className="text-sm text-[#808080] font-mono">{formatTime(totalDuration)}</div>
        </div>
        
        <div className="h-32 bg-[#0a0a0a] rounded-lg overflow-hidden flex items-center justify-between px-2">
          {waveformData.map((amplitude, index) => (
            <div
              key={index}
              className="flex-1 mx-px flex items-center justify-center"
            >
              <div
                style={{
                  width: '100%',
                  height: `${amplitude * 100}%`,
                  backgroundColor: '#ff6b35',
                  borderRadius: '1px'
                }}
              />
            </div>
          ))}
        </div>

        {/* Track Markers */}
        <div className="relative h-8 mt-2">
          {generatedMix.map((mixTrack, index) => {
            const startPercent = (mixTrack.startTime / totalDuration) * 100;
            const width = ((mixTrack.endTime - mixTrack.startTime) / totalDuration) * 100;
            
            return (
              <div
                key={index}
                className="absolute top-0 h-full border-l-2 border-[#ff6b35] cursor-pointer group"
                style={{ left: `${startPercent}%`, width: `${width}%` }}
              >
                <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {mixTrack.track.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Play Button */}
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={onPlay}
            className="w-16 h-16 rounded-full bg-[#ff6b35] hover:bg-[#ff8555] flex items-center justify-center text-white transition-all hover:scale-105"
          >
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Track List */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Mix Timeline</h4>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {generatedMix.map((mixTrack, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 hover:border-[#2a2a2a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#ff6b35] flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {mixTrack.track.name}
                    </div>
                    <div className="text-[#808080] text-xs">
                      {formatTime(mixTrack.startTime)} - {formatTime(mixTrack.endTime)}
                    </div>
                  </div>
                  <div className="text-[#ff6b35] text-xs">
                    {mixTrack.transitionType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mix Info & Export */}
        <div className="space-y-6">
          {/* Mix Info */}
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Mix Information</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#808080]">Total Duration</span>
                <span className="text-white font-mono">{formatTime(totalDuration)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#808080]">Tracks</span>
                <span className="text-white font-mono">{generatedMix.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#808080]">Transitions</span>
                <span className="text-white font-mono">{generatedMix.length - 1} smooth blends</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#808080]">Energy Flow</span>
                <span className="text-white capitalize flex items-center gap-2">
                  {energyFlow === 'build-up' && '▂▃▅▇█'}
                  {energyFlow === 'cool-down' && '█▇▅▃▂'}
                  {energyFlow === 'steady' && '▅▅▅▅▅'}
                  {energyFlow === 'wave' && '▂▅█▅▂'}
                </span>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Export Options</h4>
            
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download MP3
              </button>
              
              <button className="w-full px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download WAV
              </button>
              
              <button className="w-full px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download FLAC
              </button>
            </div>
          </div>

          {/* Upload to Platforms */}
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Upload to Platforms</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                SoundCloud
              </button>
              
              <button className="px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Mixcloud
              </button>
              
              <button className="px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                YouTube
              </button>
              
              <button className="px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Spotify
              </button>
            </div>
          </div>

          {/* Edit Mix */}
          <button className="w-full px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2">
            <Edit3 className="w-5 h-5" />
            Edit Mix Manually
          </button>
        </div>
      </div>
    </div>
  );
}
