import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Upload,
  Share2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  Edit3,
  Save,
  Music,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube,
  Cloud
} from 'lucide-react';

type ExportFormat = 'mp3' | 'wav' | 'flac';
type ExportQuality = '320' | '256' | '192' | '128';
type TrackSource = 'ai' | 'user';

interface TrackInfo {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  source: TrackSource;
}

interface ExportMixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
}

interface ExportSettings {
  format: ExportFormat;
  quality: ExportQuality;
  title: string;
  artist: string;
  genre: string;
  year: string;
  normalize: boolean;
  fadeInOut: boolean;
}

const tracks: TrackInfo[] = [
  { id: '1', name: 'Hypnotic Elements', startTime: 0, endTime: 450, source: 'ai' },
  { id: '2', name: 'Warehouse Groove', startTime: 390, endTime: 855, source: 'ai' },
  { id: '3', name: 'My Production 1', startTime: 795, endTime: 1290, source: 'user' },
  { id: '4', name: 'Dark Matter', startTime: 1230, endTime: 1680, source: 'ai' },
  { id: '5', name: 'Carl Cox - Phuture 2000', startTime: 1620, endTime: 2100, source: 'user' },
  { id: '6', name: 'Industrial Pulse', startTime: 2040, endTime: 2490, source: 'ai' },
  { id: '7', name: 'My Production 2', startTime: 2430, endTime: 2910, source: 'user' },
  { id: '8', name: 'Peak Time', startTime: 2850, endTime: 3300, source: 'ai' },
  { id: '9', name: 'Classic Track', startTime: 3240, endTime: 3690, source: 'user' },
  { id: '10', name: 'Hypnotic Groove', startTime: 3630, endTime: 4080, source: 'ai' },
  { id: '11', name: 'Warehouse Vibe', startTime: 4020, endTime: 4500, source: 'ai' },
  { id: '12', name: 'Dark Energy', startTime: 4440, endTime: 5400, source: 'ai' },
];

export function ExportMixModal({ isOpen, onClose, onExport }: ExportMixModalProps) {
  const [format, setFormat] = useState<ExportFormat>('mp3');
  const [quality, setQuality] = useState<ExportQuality>('320');
  const [title, setTitle] = useState('Carl Cox Style Mix');
  const [artist, setArtist] = useState('Your Name');
  const [genre, setGenre] = useState('Techno');
  const [year, setYear] = useState('2025');
  const [normalize, setNormalize] = useState(true);
  const [fadeInOut, setFadeInOut] = useState(true);
  const [showTrackList, setShowTrackList] = useState(false);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = 5400; // 90:00
  const aiTracks = tracks.filter(t => t.source === 'ai').length;
  const userTracks = tracks.filter(t => t.source === 'user').length;
  const aiPercentage = Math.round((aiTracks / tracks.length) * 100);
  const userPercentage = Math.round((userTracks / tracks.length) * 100);

  const getFileSize = () => {
    if (format === 'mp3') return quality === '320' ? '210 MB' : quality === '256' ? '170 MB' : quality === '192' ? '130 MB' : '90 MB';
    if (format === 'wav') return '950 MB';
    if (format === 'flac') return '480 MB';
    return '210 MB';
  };

  const handleExport = () => {
    onExport({
      format,
      quality,
      title,
      artist,
      genre,
      year,
      normalize,
      fadeInOut
    });
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
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-[#44ff44] mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Your DJ Mix is Ready!</span>
              </div>
              <h2 className="text-white font-bold text-2xl mb-2">{title} - {tracks.length} Tracks</h2>
              <div className="flex items-center gap-6 text-sm text-[#808080]">
                <div>Duration: <span className="text-white font-mono">{formatTime(totalDuration)}</span></div>
                <div>Tracks: <span className="text-white">{tracks.length}</span> ({aiTracks} 🤖 + {userTracks} 👤)</div>
                <div>Transitions: <span className="text-white">{tracks.length - 1}</span></div>
                <div>Generated: <span className="text-white">Dec 20, 2025</span></div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg text-[#808080] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mix Composition */}
          <div className="flex items-center gap-6">
            {/* Pie Chart */}
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#ff6b35"
                  strokeWidth="16"
                  strokeDasharray={`${aiPercentage * 2.51} 251`}
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#4488ff"
                  strokeWidth="16"
                  strokeDasharray={`${userPercentage * 2.51} 251`}
                  strokeDashoffset={-aiPercentage * 2.51}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white font-bold text-sm">{tracks.length}</div>
                  <div className="text-[#808080] text-xs">tracks</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#ff6b35]" />
                  <span className="text-[#808080] text-sm">AI-generated tracks</span>
                </div>
                <span className="text-white font-medium">{aiTracks} ({aiPercentage}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4488ff]" />
                  <span className="text-[#808080] text-sm">User tracks</span>
                </div>
                <span className="text-white font-medium">{userTracks} ({userPercentage}%)</span>
              </div>
            </div>
          </div>

          {/* Waveform Preview */}
          <div className="mt-4">
            <div className="text-[#808080] text-xs mb-2">Full Mix Preview</div>
            <div className="h-20 bg-[#0a0a0a] rounded-lg relative overflow-hidden">
              {tracks.map((track) => {
                const startPercent = (track.startTime / totalDuration) * 100;
                const widthPercent = ((track.endTime - track.startTime) / totalDuration) * 100;
                const color = track.source === 'ai' ? '#ff6b35' : '#4488ff';

                return (
                  <div
                    key={track.id}
                    className="absolute top-0 bottom-0"
                    style={{
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`,
                      backgroundColor: color,
                      opacity: 0.6
                    }}
                  >
                    {/* Mini waveform bars */}
                    <div className="h-full flex items-center gap-0.5 px-1">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-white rounded-full"
                          style={{ height: `${30 + Math.random() * 70}%`, opacity: 0.4 }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Export Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Export Settings</h3>

            {/* Format */}
            <div>
              <label className="text-white text-sm font-medium mb-3 block">Format</label>
              <div className="space-y-2">
                <button
                  onClick={() => setFormat('mp3')}
                  className={`w-full p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                    format === 'mp3'
                      ? 'bg-[#ff6b35]/10 border-[#ff6b35]'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    format === 'mp3' ? 'border-[#ff6b35]' : 'border-[#808080]'
                  }`}>
                    {format === 'mp3' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b35]" />}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-white font-medium">MP3 (320kbps)</div>
                    <div className="text-[#808080] text-sm">Recommended - Best compatibility</div>
                  </div>
                </button>

                <button
                  onClick={() => setFormat('wav')}
                  className={`w-full p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                    format === 'wav'
                      ? 'bg-[#ff6b35]/10 border-[#ff6b35]'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    format === 'wav' ? 'border-[#ff6b35]' : 'border-[#808080]'
                  }`}>
                    {format === 'wav' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b35]" />}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-white font-medium">WAV (Lossless)</div>
                    <div className="text-[#808080] text-sm">High quality - Larger file size</div>
                  </div>
                </button>

                <button
                  onClick={() => setFormat('flac')}
                  className={`w-full p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                    format === 'flac'
                      ? 'bg-[#ff6b35]/10 border-[#ff6b35]'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    format === 'flac' ? 'border-[#ff6b35]' : 'border-[#808080]'
                  }`}>
                    {format === 'flac' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b35]" />}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-white font-medium">FLAC (Compressed Lossless)</div>
                    <div className="text-[#808080] text-sm">Best of both worlds</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quality (only for MP3) */}
            {format === 'mp3' && (
              <div>
                <label className="text-white text-sm font-medium mb-3 block">Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as ExportQuality)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b35]"
                >
                  <option value="320">320kbps (Best)</option>
                  <option value="256">256kbps (High)</option>
                  <option value="192">192kbps (Medium)</option>
                  <option value="128">128kbps (Low)</option>
                </select>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Artist</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                />
              </div>
            </div>

            {/* Cover Art */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Cover Art</label>
              <button className="w-full p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white transition-colors flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-[#808080]" />
                <div className="text-left">
                  <div className="text-white text-sm font-medium">Upload custom cover art</div>
                  <div className="text-[#808080] text-xs">Or use auto-generated artwork</div>
                </div>
              </button>
            </div>

            {/* Normalization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-medium">Normalize audio</div>
                  <div className="text-[#808080] text-xs">Recommended - Ensures consistent volume</div>
                </div>
                <button
                  onClick={() => setNormalize(!normalize)}
                  className={`w-14 h-7 rounded-full transition-colors ${
                    normalize ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                    normalize ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-medium">Add fade in/out</div>
                  <div className="text-[#808080] text-xs">3 seconds smooth fade at start and end</div>
                </div>
                <button
                  onClick={() => setFadeInOut(!fadeInOut)}
                  className={`w-14 h-7 rounded-full transition-colors ${
                    fadeInOut ? 'bg-[#ff6b35]' : 'bg-[#2a2a2a]'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                    fadeInOut ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Share Options</h3>

            {/* Direct Upload */}
            <div>
              <div className="text-[#808080] text-sm mb-3">Direct Upload</div>
              <div className="space-y-2">
                <button className="w-full p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-[#ff6b35]" />
                  <div className="text-left flex-1">
                    <div className="text-white font-medium">Upload to SoundCloud</div>
                  </div>
                </button>
                <button className="w-full p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors flex items-center gap-3">
                  <Music className="w-5 h-5 text-[#4488ff]" />
                  <div className="text-left flex-1">
                    <div className="text-white font-medium">Upload to Mixcloud</div>
                  </div>
                </button>
                <button className="w-full p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors flex items-center gap-3">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <div className="text-left flex-1">
                    <div className="text-white font-medium">Upload to YouTube</div>
                  </div>
                </button>
              </div>
              <div className="text-[#808080] text-xs mt-2">Connect your accounts in Settings</div>
            </div>

            {/* Download */}
            <div className="bg-gradient-to-r from-[#ff6b35]/20 to-transparent border-l-4 border-[#ff6b35] rounded-lg p-4">
              <button
                onClick={handleExport}
                className="w-full px-6 py-4 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-bold transition-colors flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download Mix
              </button>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-[#808080]">File size:</span>
                <span className="text-white font-mono">{getFileSize()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#808080]">Estimated time:</span>
                <span className="text-white">30 seconds</span>
              </div>
            </div>

            {/* Share Link */}
            <div>
              <div className="text-[#808080] text-sm mb-3">Share Link</div>
              <button className="w-full p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg transition-colors flex items-center gap-3">
                <Share2 className="w-5 h-5 text-[#ff6b35]" />
                <div className="text-left flex-1">
                  <div className="text-white font-medium">Generate Share Link</div>
                  <div className="text-[#808080] text-xs">syntax-audio.ai/mix/abc123</div>
                </div>
              </button>
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm text-[#808080] cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a]" defaultChecked />
                  Allow downloads
                </label>
                <label className="flex items-center gap-2 text-sm text-[#808080] cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a]" defaultChecked />
                  Show track list
                </label>
              </div>
            </div>
          </div>

          {/* Mix Details - Collapsible */}
          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
            <button
              onClick={() => setShowTrackList(!showTrackList)}
              className="w-full p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors flex items-center justify-between"
            >
              <span className="text-white font-bold">Mix Details</span>
              {showTrackList ? (
                <ChevronUp className="w-5 h-5 text-[#808080]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#808080]" />
              )}
            </button>

            <AnimatePresence>
              {showTrackList && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-6">
                    {/* Track List */}
                    <div>
                      <div className="text-white font-medium mb-3">Track List</div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {tracks.map((track, index) => (
                          <div
                            key={track.id}
                            className="flex items-center gap-3 p-2 bg-[#0a0a0a] rounded text-sm"
                          >
                            <div className="text-[#808080] font-mono w-6">{index + 1}.</div>
                            <div className="flex-1 text-white">{track.name}</div>
                            <div className="text-[#808080] font-mono">
                              {formatTime(track.startTime)} - {formatTime(track.endTime)}
                            </div>
                            <div className="flex-shrink-0">
                              {track.source === 'ai' ? (
                                <Bot className="w-4 h-4 text-[#ff6b35]" />
                              ) : (
                                <User className="w-4 h-4 text-[#4488ff]" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transitions */}
                    <div>
                      <div className="text-white font-medium mb-2">Transitions</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[#808080]">Total transitions:</span>
                          <span className="text-white">{tracks.length - 1} smooth transitions</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#808080]">Average duration:</span>
                          <span className="text-white">60 seconds</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#808080]">Techniques used:</span>
                          <span className="text-white">Bass swap, Filter sweep, Quick cut</span>
                        </div>
                      </div>
                    </div>

                    {/* Energy Flow Graph */}
                    <div>
                      <div className="text-white font-medium mb-3">Energy Flow</div>
                      <div className="h-24 bg-[#0a0a0a] rounded-lg relative">
                        <svg className="w-full h-full p-2">
                          <path
                            d="M 10 80 Q 100 60, 200 40 T 380 20 T 560 40 Q 650 60, 740 80"
                            fill="none"
                            stroke="url(#energyGradient)"
                            strokeWidth="3"
                            className="drop-shadow-[0_0_8px_rgba(255,107,53,0.6)]"
                          />
                          <defs>
                            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.5" />
                              <stop offset="50%" stopColor="#ff6b35" stopOpacity="1" />
                              <stop offset="100%" stopColor="#4488ff" stopOpacity="0.5" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute bottom-2 left-2 text-xs text-[#808080]">0:00</div>
                        <div className="absolute bottom-2 left-1/3 text-xs text-[#808080]">30:00<br/>Build-up</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-[#ff6b35] font-medium">60:00<br/>Peak</div>
                        <div className="absolute bottom-2 right-1/3 text-xs text-[#808080]">Cool-down</div>
                        <div className="absolute bottom-2 right-2 text-xs text-[#808080]">90:00</div>
                      </div>
                    </div>

                    {/* Mix Composition Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="text-[#808080] text-xs mb-1">AI-generated</div>
                        <div className="text-white font-bold text-lg">{aiTracks} tracks ({aiPercentage}%)</div>
                      </div>
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="text-[#808080] text-xs mb-1">User uploads</div>
                        <div className="text-white font-bold text-lg">{userTracks} tracks ({userPercentage}%)</div>
                      </div>
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="text-[#808080] text-xs mb-1">Total duration</div>
                        <div className="text-white font-bold text-lg">{formatTime(totalDuration)}</div>
                      </div>
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="text-[#808080] text-xs mb-1">Average BPM</div>
                        <div className="text-white font-bold text-lg">128</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save to Library
            </button>
            <button className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white transition-colors flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Mix
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Mix
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
