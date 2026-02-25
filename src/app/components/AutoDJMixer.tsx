import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Settings,
  Circle,
  Square,
  Save,
  Plus,
  Shuffle,
  Trash2,
  Upload,
  Link2,
  Bot,
  User,
  X,
  GripVertical,
  CheckCircle,
  Clock,
  SkipBack,
  SkipForward,
  Search,
  Star,
  FileAudio,
  Check,
  AlertCircle,
  Loader2,
  Youtube,
  Cloud,
  Music,
  Headphones
} from 'lucide-react';
import { AddTrackModal } from './AddTrackModal';
import { ExportMixModal } from './ExportMixModal';

type TrackSource = 'ai' | 'user' | 'url';
type TrackStatus = 'played' | 'playing' | 'queued';

interface Track {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  duration: number;
  energy: number;
  source: TrackSource;
  status: TrackStatus;
}

interface DeckState {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  adjustedBPM: number;
  volume: number;
  eqHigh: number;
  eqMid: number;
  eqLow: number;
  filter: number;
}

interface MixSettings {
  transitionStyle: 'smooth' | 'quick' | 'creative';
  transitionDuration: 30 | 60 | 90;
  energyFlow: 'build-up' | 'steady' | 'cool-down';
  harmonicMixing: boolean;
  beatmatching: boolean;
}

const initialTracks: Track[] = [
  { id: '1', name: 'Hypnotic Elements', artist: 'AI Generated', bpm: 128, key: '4A', duration: 450, energy: 0.7, source: 'ai', status: 'played' },
  { id: '2', name: 'Warehouse Groove', artist: 'AI Generated', bpm: 130, key: '5A', duration: 465, energy: 0.8, source: 'ai', status: 'played' },
  { id: '3', name: 'My Production', artist: 'DJ User', bpm: 128, key: '4A', duration: 495, energy: 0.9, source: 'user', status: 'playing' },
  { id: '4', name: 'Industrial Pulse', artist: 'AI Generated', bpm: 130, key: '5A', duration: 450, energy: 0.8, source: 'ai', status: 'queued' },
  { id: '5', name: 'Carl Cox - Phuture 2000', artist: 'Carl Cox', bpm: 128, key: '6A', duration: 480, energy: 0.75, source: 'user', status: 'queued' },
  { id: '6', name: 'Dark Matter', artist: 'AI Generated', bpm: 128, key: '4A', duration: 465, energy: 0.85, source: 'ai', status: 'queued' },
  { id: '7', name: 'Midnight Drive', artist: 'AI Generated', bpm: 127, key: '8B', duration: 420, energy: 0.7, source: 'ai', status: 'queued' },
  { id: '8', name: 'Beatport Track #1', artist: 'Unknown', bpm: 130, key: '5A', duration: 390, energy: 0.8, source: 'url', status: 'queued' },
  { id: '9', name: 'Deep Underground', artist: 'AI Generated', bpm: 127, key: '8B', duration: 435, energy: 0.65, source: 'ai', status: 'queued' },
  { id: '10', name: 'Peak Energy', artist: 'AI Generated', bpm: 130, key: '5A', duration: 450, energy: 0.9, source: 'ai', status: 'queued' },
  { id: '11', name: 'Resident Mix Track', artist: 'Various', bpm: 129, key: '4A', duration: 465, energy: 0.75, source: 'url', status: 'queued' },
  { id: '12', name: 'Final Peak', artist: 'AI Generated', bpm: 130, key: '5A', duration: 480, energy: 0.85, source: 'ai', status: 'queued' },
];

export function AutoDJMixer() {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [showExportMix, setShowExportMix] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const [mixSettings, setMixSettings] = useState<MixSettings>({
    transitionStyle: 'smooth',
    transitionDuration: 60,
    energyFlow: 'build-up',
    harmonicMixing: true,
    beatmatching: true
  });

  const [currentMixTime, setCurrentMixTime] = useState(930); // 15:30
  const currentTrack = tracks.find(t => t.status === 'playing');
  const currentTrackIndex = tracks.findIndex(t => t.status === 'playing');
  const nextTrack = tracks[currentTrackIndex + 1];

  const [deckA, setDeckA] = useState<DeckState>({
    track: tracks[1],
    isPlaying: true,
    currentTime: 435,
    adjustedBPM: 128.0,
    volume: 0.45,
    eqHigh: 0.6,
    eqMid: 0.8,
    eqLow: 0.9,
    filter: 0.4
  });

  const [deckB, setDeckB] = useState<DeckState>({
    track: tracks[2],
    isPlaying: true,
    currentTime: 30,
    adjustedBPM: 128.0,
    volume: 0.55,
    eqHigh: 0.7,
    eqMid: 0.4,
    eqLow: 0.3,
    filter: 0.6
  });

  const [crossfader, setCrossfader] = useState(0.55);

  // Simulate AI adjustments
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDeckA(prev => ({
        ...prev,
        eqHigh: Math.max(0, Math.min(1, prev.eqHigh + (Math.random() - 0.5) * 0.05)),
        eqMid: Math.max(0, Math.min(1, prev.eqMid + (Math.random() - 0.5) * 0.05)),
        eqLow: Math.max(0, Math.min(1, prev.eqLow + (Math.random() - 0.5) * 0.05)),
        currentTime: prev.currentTime + 1
      }));

      setDeckB(prev => ({
        ...prev,
        eqHigh: Math.max(0, Math.min(1, prev.eqHigh + (Math.random() - 0.5) * 0.05)),
        eqMid: Math.max(0, Math.min(1, prev.eqMid + (Math.random() - 0.5) * 0.05)),
        eqLow: Math.max(0, Math.min(1, prev.eqLow + (Math.random() - 0.5) * 0.05)),
        currentTime: prev.currentTime + 1
      }));

      setCrossfader(prev => Math.max(0, Math.min(1, prev + (Math.random() - 0.5) * 0.02)));
      setCurrentMixTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0);
  const aiTracks = tracks.filter(t => t.source === 'ai').length;
  const userTracks = tracks.filter(t => t.source === 'user').length;
  const urlTracks = tracks.filter(t => t.source === 'url').length;

  const getSourceIcon = (source: TrackSource) => {
    switch (source) {
      case 'ai': return <Bot className="w-4 h-4 text-[#ff6b35]" />;
      case 'user': return <User className="w-4 h-4 text-[#4488ff]" />;
      case 'url': return <Link2 className="w-4 h-4 text-[#44ff44]" />;
    }
  };

  const getSourceLabel = (source: TrackSource) => {
    switch (source) {
      case 'ai': return 'AI';
      case 'user': return 'USER';
      case 'url': return 'URL';
    }
  };

  const getStatusIcon = (status: TrackStatus) => {
    switch (status) {
      case 'played': return <CheckCircle className="w-4 h-4 text-[#44ff44]" />;
      case 'playing': return <Play className="w-4 h-4 text-[#ff6b35]" />;
      case 'queued': return <Clock className="w-4 h-4 text-[#808080]" />;
    }
  };

  const removeTrack = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
  };

  const shuffleTracks = () => {
    const queued = tracks.filter(t => t.status === 'queued');
    const shuffled = [...queued].sort(() => Math.random() - 0.5);
    setTracks([
      ...tracks.filter(t => t.status !== 'queued'),
      ...shuffled
    ]);
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Track List */}
        <div className="w-80 bg-[#0f0f0f] border-r border-[#2a2a2a] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[#2a2a2a]">
            <h2 className="text-white font-bold mb-3">Track Queue</h2>
            <button
              onClick={() => setShowAddTrack(true)}
              className="w-full px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Track
            </button>
          </div>

          {/* Track List */}
          <div className="flex-1 overflow-y-auto">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`group p-3 border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors ${
                  track.status === 'playing' ? 'bg-[#1a1a1a]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="w-4 h-4 text-[#808080] mt-1 flex-shrink-0 cursor-move" />
                  
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(track.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-white text-sm font-medium truncate">{track.name}</div>
                      <div className="flex-shrink-0">{getSourceIcon(track.source)}</div>
                    </div>
                    <div className="text-[#808080] text-xs truncate mb-2">{track.artist}</div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#ff6b35] font-mono">{track.bpm} BPM</span>
                      <span className="text-[#4488ff] font-mono">{track.key}</span>
                      <span className="text-[#808080]">{formatTime(track.duration)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeTrack(track.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#2a2a2a] rounded text-[#808080] hover:text-red-500 transition-all flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-[#2a2a2a] space-y-2">
            <button
              onClick={shuffleTracks}
              className="w-full px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle Queue
            </button>
            <button
              onClick={() => setTracks([])}
              className="w-full px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Controls */}
          <div className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-4 py-2 bg-[#ff6b35] rounded-lg text-white font-bold text-sm">
                    AUTO DJ
                  </div>
                  <span className="text-[#808080] text-sm">AI is mixing your tracks automatically</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white'
                  }`}
                >
                  <Circle className={`w-4 h-4 ${isRecording ? 'fill-white' : ''}`} />
                  {isRecording ? 'Recording...' : 'Record'}
                </button>

                <button className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Stop
                </button>

                <button
                  onClick={() => setShowExportMix(true)}
                  className="px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Export Mix
                </button>
              </div>
            </div>

            {/* Mix Info */}
            <div className="flex items-center gap-8 text-sm">
              <div>
                <span className="text-[#808080]">Duration: </span>
                <span className="text-white font-mono">{formatTime(totalDuration)}</span>
              </div>
              <div>
                <span className="text-[#808080]">Tracks: </span>
                <span className="text-white font-medium">{tracks.length}</span>
                <span className="text-[#808080] ml-2">({aiTracks} 🤖 + {userTracks} 👤 + {urlTracks} 🔗)</span>
              </div>
              <div>
                <span className="text-[#808080]">Transitions: </span>
                <span className="text-white font-medium">{tracks.length - 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#ff6b35]">🤖 AI is mixing...</span>
                <span className="text-white font-medium">Track {currentTrackIndex + 1} of {tracks.length}</span>
              </div>
            </div>
          </div>

          {/* Center - Mixing Visualization */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Current Transition */}
            <div className="bg-gradient-to-r from-[#ff6b35]/20 to-transparent border-l-4 border-[#ff6b35] rounded-lg p-6">
              <h3 className="text-2xl font-bold text-white mb-3">
                🤖 AI is mixing Track {currentTrackIndex} → Track {currentTrackIndex + 1}
              </h3>
              <div className="flex items-center gap-6 text-sm mb-4">
                <div>
                  <span className="text-[#808080]">Transition: </span>
                  <span className="text-white font-medium">Bass Swap + Filter Sweep</span>
                </div>
                <div>
                  <span className="text-[#808080]">Time remaining: </span>
                  <span className="text-white font-medium">30 seconds</span>
                </div>
              </div>
              <div className="w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#ff6b35]"
                  animate={{ width: '45%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Deck Visualizations */}
            <div className="grid grid-cols-2 gap-6">
              {/* Deck A */}
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-[#808080] mb-1">DECK A</div>
                    <div className="text-white font-bold">{deckA.track?.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getSourceIcon(deckA.track?.source || 'ai')}
                      <span className="text-[#808080] text-xs">{getSourceLabel(deckA.track?.source || 'ai')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#ff6b35] font-mono text-sm">130 → 128 BPM</div>
                    <div className="text-[#4488ff] font-mono text-sm">{deckA.track?.key}</div>
                  </div>
                </div>

                {/* Waveform */}
                <div className="h-24 bg-[#1a1a1a] rounded-lg mb-4 relative overflow-hidden">
                  <svg className="w-full h-full">
                    {[...Array(80)].map((_, i) => {
                      const height = 30 + Math.random() * 40;
                      return (
                        <rect
                          key={i}
                          x={i * 4}
                          y={40 - height / 2}
                          width="3"
                          height={height}
                          fill="#ff6b35"
                          opacity={0.6}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white" />
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-[#808080]">Time: {formatTime(deckA.currentTime)} / {formatTime(deckA.track?.duration || 0)}</span>
                  <span className="text-[#ff6b35]">Volume: {Math.round(deckA.volume * 100)}%</span>
                </div>

                {/* EQ Bars */}
                <div className="grid grid-cols-3 gap-2">
                  {['HIGH', 'MID', 'LOW'].map((label, idx) => {
                    const value = idx === 0 ? deckA.eqHigh : idx === 1 ? deckA.eqMid : deckA.eqLow;
                    return (
                      <div key={label} className="text-center">
                        <div className="text-xs text-[#808080] mb-1">{label}</div>
                        <div className="flex items-center gap-0.5 justify-center">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-6 rounded-sm transition-colors ${
                                i < value * 8 ? 'bg-[#ff6b35]' : 'bg-[#1a1a1a]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deck B */}
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-[#808080] mb-1">DECK B</div>
                    <div className="text-white font-bold">{deckB.track?.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getSourceIcon(deckB.track?.source || 'user')}
                      <span className="text-[#808080] text-xs">{getSourceLabel(deckB.track?.source || 'user')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#4488ff] font-mono text-sm">128 BPM</div>
                    <div className="text-[#4488ff] font-mono text-sm">{deckB.track?.key}</div>
                  </div>
                </div>

                {/* Waveform */}
                <div className="h-24 bg-[#1a1a1a] rounded-lg mb-4 relative overflow-hidden">
                  <svg className="w-full h-full">
                    {[...Array(80)].map((_, i) => {
                      const height = 30 + Math.random() * 40;
                      return (
                        <rect
                          key={i}
                          x={i * 4}
                          y={40 - height / 2}
                          width="3"
                          height={height}
                          fill="#4488ff"
                          opacity={0.6}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-white" />
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-[#808080]">Time: {formatTime(deckB.currentTime)} / {formatTime(deckB.track?.duration || 0)}</span>
                  <span className="text-[#4488ff]">Volume: {Math.round(deckB.volume * 100)}%</span>
                </div>

                {/* EQ Bars */}
                <div className="grid grid-cols-3 gap-2">
                  {['HIGH', 'MID', 'LOW'].map((label, idx) => {
                    const value = idx === 0 ? deckB.eqHigh : idx === 1 ? deckB.eqMid : deckB.eqLow;
                    return (
                      <div key={label} className="text-center">
                        <div className="text-xs text-[#808080] mb-1">{label}</div>
                        <div className="flex items-center gap-0.5 justify-center">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-6 rounded-sm transition-colors ${
                                i < value * 8 ? 'bg-[#4488ff]' : 'bg-[#1a1a1a]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Crossfader & Volume Meters */}
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">Crossfader & Volume</h4>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <div className="text-xs text-[#808080] mb-2 text-center">CROSSFADER</div>
                  <div className="relative h-12 bg-[#1a1a1a] rounded-lg">
                    <div className="absolute inset-0 flex items-center px-2">
                      <div className="flex-1 h-1 bg-gradient-to-r from-[#ff6b35] to-transparent" />
                      <div className="flex-1 h-1 bg-gradient-to-l from-[#4488ff] to-transparent" />
                    </div>
                    <motion.div
                      className="absolute top-1 bottom-1 w-16 bg-[#ff6b35] rounded-lg shadow-[0_0_12px_rgba(255,107,53,0.8)]"
                      animate={{ left: `calc(${crossfader * 100}% - 32px)` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#808080] mt-1">
                    <span>A</span>
                    <span>CENTER</span>
                    <span>B</span>
                  </div>
                </div>

                {/* Volume Meters */}
                <div className="flex items-center gap-6">
                  {['A', 'B', 'MASTER'].map((label, idx) => {
                    const volume = idx === 0 ? deckA.volume : idx === 1 ? deckB.volume : 0.7;
                    return (
                      <div key={label} className="flex flex-col items-center gap-2">
                        <div className="text-xs text-[#808080]">{label}</div>
                        <div className="w-10 h-32 bg-[#1a1a1a] rounded overflow-hidden flex flex-col-reverse p-1">
                          {[...Array(16)].map((_, i) => {
                            const isActive = i < volume * 16;
                            let color = '#333333';
                            if (isActive) {
                              if (i > 13) color = '#ff4444';
                              else if (i > 11) color = '#ffaa00';
                              else color = '#44ff44';
                            }
                            return (
                              <div
                                key={i}
                                className="flex-1 mb-0.5 transition-colors rounded-sm"
                                style={{ backgroundColor: color }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Timeline */}
          <div className="bg-[#0f0f0f] border-t border-[#2a2a2a] p-4">
            {/* Timeline */}
            <div className="mb-4">
              <div className="h-16 bg-[#1a1a1a] rounded-lg relative overflow-hidden">
                {tracks.map((track, index) => {
                  const startPercent = (tracks.slice(0, index).reduce((sum, t) => sum + t.duration, 0) / totalDuration) * 100;
                  const widthPercent = (track.duration / totalDuration) * 100;
                  const color = track.source === 'ai' ? '#ff6b35' : track.source === 'user' ? '#4488ff' : '#44ff44';

                  return (
                    <div
                      key={track.id}
                      className="absolute top-0 bottom-0 border-r border-[#0a0a0a]"
                      style={{
                        left: `${startPercent}%`,
                        width: `${widthPercent}%`,
                        backgroundColor: color,
                        opacity: 0.6
                      }}
                    >
                      <div className="p-2 text-xs text-white truncate">{track.name}</div>
                    </div>
                  );
                })}
                {/* Playhead */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white"
                  style={{ left: `${(currentMixTime / totalDuration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#808080] mt-1">
                <span>0:00</span>
                <span>{formatTime(currentMixTime)} / {formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="p-2 hover:bg-[#1a1a1a] rounded-lg text-[#808080] hover:text-white transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 bg-[#ff6b35] hover:bg-[#ff8555] rounded-full text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="p-2 hover:bg-[#1a1a1a] rounded-lg text-[#808080] hover:text-white transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Insights */}
        <div className="w-80 bg-[#0f0f0f] border-l border-[#2a2a2a] p-6 overflow-y-auto space-y-6">
          <h3 className="text-white font-bold text-lg">AI Insights</h3>

          {/* Current Transition */}
          <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-2">
            <div className="text-[#ff6b35] font-bold text-sm mb-3">Current Transition</div>
            <div className="text-white text-sm">🤖 AI is mixing Track {currentTrackIndex} → Track {currentTrackIndex + 1}</div>
            {currentTrack?.source === 'user' && (
              <div className="text-[#4488ff] text-sm">Track {currentTrackIndex + 1} is a user upload</div>
            )}
            <div className="text-[#808080] text-xs space-y-1 mt-3">
              <div>Beatmatching: 130 → 128 BPM (Track {currentTrackIndex} adjusted)</div>
              <div>Harmonic mix: 5A → 4A (compatible)</div>
              <div>Transition: Bass swap + filter sweep</div>
              <div>Duration: 60 seconds</div>
              <div>Energy: 8/10 → 9/10 (building up)</div>
            </div>
          </div>

          {/* Next Transition */}
          {nextTrack && (
            <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-2">
              <div className="text-white font-bold text-sm mb-3">Next Transition</div>
              <div className="text-white text-sm">
                Next: Track {currentTrackIndex + 1} ({getSourceLabel(currentTrack?.source || 'ai')}) → Track {currentTrackIndex + 2} ({getSourceLabel(nextTrack.source)})
              </div>
              <div className="text-[#808080] text-xs space-y-1 mt-3">
                <div>BPM: {currentTrack?.bpm} → {nextTrack.bpm}</div>
                <div>Key: {currentTrack?.key} → {nextTrack.key} (harmonic match)</div>
                <div>Transition: Quick cut + reverb</div>
                <div>Duration: 30 seconds</div>
              </div>
            </div>
          )}

          {/* AI Decisions */}
          <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-2">
            <div className="text-white font-bold text-sm mb-3">AI Decisions</div>
            <div className="text-xs text-[#808080] space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-[#44ff44]">✅</span>
                <span>Adjusted Track {currentTrackIndex} BPM (130 → 128)</span>
              </div>
              {currentTrack?.source === 'user' && (
                <div className="flex items-start gap-2">
                  <span className="text-[#44ff44]">✅</span>
                  <span>Analyzed user track (Track {currentTrackIndex + 1})</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-[#44ff44]">✅</span>
                <span>Used bass swap technique</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#44ff44]">✅</span>
                <span>Applied filter sweep</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#44ff44]">✅</span>
                <span>Maintained energy flow</span>
              </div>
            </div>
          </div>

          {/* Mix Composition */}
          <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-3">
            <div className="text-white font-bold text-sm mb-3">Mix Composition</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#ff6b35]" />
                  <span className="text-[#808080]">AI tracks</span>
                </div>
                <span className="text-white font-medium">{aiTracks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4488ff]" />
                  <span className="text-[#808080]">User tracks</span>
                </div>
                <span className="text-white font-medium">{userTracks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#44ff44]" />
                  <span className="text-[#808080]">URL tracks</span>
                </div>
                <span className="text-white font-medium">{urlTracks}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
                <span className="text-white font-bold">Total</span>
                <span className="text-white font-bold">{tracks.length} tracks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#808080]">Duration</span>
                <span className="text-white font-mono">{formatTime(totalDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Track Modal */}
      <AnimatePresence>
        {showAddTrack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            onClick={() => setShowAddTrack(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-8 max-w-2xl w-full"
            >
              <h3 className="text-white font-bold text-xl mb-6">Add Track to Mix</h3>
              
              <div className="space-y-4">
                <button className="w-full p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors flex items-center gap-4">
                  <Upload className="w-8 h-8 text-[#4488ff]" />
                  <div className="text-left">
                    <div className="text-white font-medium">Upload Audio File</div>
                    <div className="text-[#808080] text-sm">MP3, WAV, FLAC</div>
                  </div>
                </button>

                <button className="w-full p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors flex items-center gap-4">
                  <Link2 className="w-8 h-8 text-[#44ff44]" />
                  <div className="text-left">
                    <div className="text-white font-medium">Paste URL</div>
                    <div className="text-[#808080] text-sm">YouTube, SoundCloud, Beatport</div>
                  </div>
                </button>

                <button className="w-full p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors flex items-center gap-4">
                  <Bot className="w-8 h-8 text-[#ff6b35]" />
                  <div className="text-left">
                    <div className="text-white font-medium">Generate AI Track</div>
                    <div className="text-[#808080] text-sm">Create new track with AI</div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowAddTrack(false)}
                className="w-full mt-6 px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-8 max-w-2xl w-full"
            >
              <h3 className="text-white font-bold text-xl mb-6">Mix Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-white text-sm font-medium mb-3 block">Transition Style</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['smooth', 'quick', 'creative'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setMixSettings({ ...mixSettings, transitionStyle: style })}
                        className={`px-4 py-3 rounded-lg capitalize transition-colors ${
                          mixSettings.transitionStyle === style
                            ? 'bg-[#ff6b35] text-white'
                            : 'bg-[#1a1a1a] text-[#808080] hover:bg-[#2a2a2a]'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-3 block">Transition Duration</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([30, 60, 90] as const).map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setMixSettings({ ...mixSettings, transitionDuration: duration })}
                        className={`px-4 py-3 rounded-lg transition-colors ${
                          mixSettings.transitionDuration === duration
                            ? 'bg-[#ff6b35] text-white'
                            : 'bg-[#1a1a1a] text-[#808080] hover:bg-[#2a2a2a]'
                        }`}
                      >
                        {duration}s
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-3 block">Energy Flow</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['build-up', 'steady', 'cool-down'] as const).map((flow) => (
                      <button
                        key={flow}
                        onClick={() => setMixSettings({ ...mixSettings, energyFlow: flow })}
                        className={`px-4 py-3 rounded-lg capitalize transition-colors ${
                          mixSettings.energyFlow === flow
                            ? 'bg-[#ff6b35] text-white'
                            : 'bg-[#1a1a1a] text-[#808080] hover:bg-[#2a2a2a]'
                        }`}
                      >
                        {flow.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm font-medium">Harmonic Mixing</label>
                    <button
                      onClick={() => setMixSettings({ ...mixSettings, harmonicMixing: !mixSettings.harmonicMixing })}
                      className={`w-14 h-7 rounded-full transition-colors ${
                        mixSettings.harmonicMixing ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                        mixSettings.harmonicMixing ? 'translate-x-8' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm font-medium">Beatmatching</label>
                    <button
                      onClick={() => setMixSettings({ ...mixSettings, beatmatching: !mixSettings.beatmatching })}
                      className={`w-14 h-7 rounded-full transition-colors ${
                        mixSettings.beatmatching ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                        mixSettings.beatmatching ? 'translate-x-8' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-8 px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors"
              >
                Save Settings
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Mix Modal */}
      <ExportMixModal
        isOpen={showExportMix}
        onClose={() => setShowExportMix(false)}
        onExport={(settings) => {
          console.log('Exporting with settings:', settings);
          setShowExportMix(false);
        }}
      />
    </div>
  );
}