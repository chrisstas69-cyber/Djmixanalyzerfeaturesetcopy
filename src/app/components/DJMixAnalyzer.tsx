import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Link2,
  Play,
  Eye,
  Edit3,
  Music2,
  Download,
  Save,
  Sparkles,
  Loader2,
  CheckCircle,
  Youtube,
  Cloud
} from 'lucide-react';

interface AnalyzedTrack {
  id: string;
  number: number;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  energy: number; // 1-10
  style: string;
  startTime: number; // seconds
  endTime: number; // seconds
  confidence: number; // 0-1
}

type UploadTab = 'file' | 'youtube' | 'soundcloud';
type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'complete';

const exampleMixes = [
  { id: '1', name: 'Carl Cox - Space Ibiza 2023', url: 'https://soundcloud.com/example1' },
  { id: '2', name: 'Richie Hawtin - ENTER Week 10', url: 'https://soundcloud.com/example2' },
  { id: '3', name: 'Adam Beyer - Drumcode 500', url: 'https://youtube.com/example3' }
];

const analyzedTracks: AnalyzedTrack[] = [
  { id: '1', number: 1, name: 'Hypnotic Elements', artist: 'Unknown', bpm: 128, key: '4A', energy: 7, style: 'Deep Techno', startTime: 0, endTime: 450, confidence: 0.85 },
  { id: '2', number: 2, name: 'Warehouse Groove', artist: 'Unknown', bpm: 130, key: '5A', energy: 8, style: 'Techno', startTime: 405, endTime: 860, confidence: 0.92 },
  { id: '3', number: 3, name: 'Dark Matter', artist: 'Unknown', bpm: 128, key: '4A', energy: 9, style: 'Peak Techno', startTime: 810, endTime: 1275, confidence: 0.88 },
  { id: '4', number: 4, name: 'Industrial Pulse', artist: 'Unknown', bpm: 130, key: '5A', energy: 8, style: 'Techno', startTime: 1230, endTime: 1680, confidence: 0.79 },
  { id: '5', number: 5, name: 'Midnight Drive', artist: 'Unknown', bpm: 128, key: '6A', energy: 7, style: 'Deep Techno', startTime: 1635, endTime: 2100, confidence: 0.91 },
  { id: '6', number: 6, name: 'Hypnotic Groove', artist: 'Unknown', bpm: 129, key: '4A', energy: 8, style: 'Hypnotic', startTime: 2055, endTime: 2520, confidence: 0.86 },
  { id: '7', number: 7, name: 'Peak Energy', artist: 'Unknown', bpm: 130, key: '5A', energy: 10, style: 'Peak Techno', startTime: 2475, endTime: 2940, confidence: 0.94 },
  { id: '8', number: 8, name: 'Dark Warehouse', artist: 'Unknown', bpm: 128, key: '8B', energy: 9, style: 'Industrial', startTime: 2895, endTime: 3360, confidence: 0.83 },
  { id: '9', number: 9, name: 'Deep Underground', artist: 'Unknown', bpm: 127, key: '8B', energy: 7, style: 'Deep Techno', startTime: 3315, endTime: 3780, confidence: 0.89 },
  { id: '10', number: 10, name: 'Minimal Groove', artist: 'Unknown', bpm: 128, key: '8B', energy: 6, style: 'Minimal', startTime: 3735, endTime: 4200, confidence: 0.76 },
  { id: '11', number: 11, name: 'Building Energy', artist: 'Unknown', bpm: 129, key: '4A', energy: 8, style: 'Techno', startTime: 4155, endTime: 4620, confidence: 0.87 },
  { id: '12', number: 12, name: 'Final Peak', artist: 'Unknown', bpm: 130, key: '5A', energy: 9, style: 'Peak Techno', startTime: 4575, endTime: 5400, confidence: 0.92 }
];

export function DJMixAnalyzer() {
  const [activeTab, setActiveTab] = useState<UploadTab>('file');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [tracksFound, setTracksFound] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [soundcloudUrl, setSoundcloudUrl] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnalyze = () => {
    setAnalysisState('uploading');
    setUploadProgress(0);

    // Simulate upload
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setAnalysisState('analyzing');
          
          // Start analysis
          const analysisInterval = setInterval(() => {
            setAnalysisProgress(prev => {
              const newProgress = prev + 5;
              setTracksFound(Math.floor((newProgress / 100) * 12));
              
              if (newProgress >= 100) {
                clearInterval(analysisInterval);
                setTimeout(() => {
                  setAnalysisState('complete');
                }, 500);
              }
              return newProgress;
            });
          }, 300);
          
          return prev;
        }
        return prev + 10;
      });
    }, 200);
  };

  const averageBPM = Math.round(analyzedTracks.reduce((sum, t) => sum + t.bpm, 0) / analyzedTracks.length);

  return (
    <div className="h-screen bg-[#0a0a0a] flex overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-6 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">DJ Mix Analyzer</h1>
            <p className="text-[#808080]">Upload a DJ mix and AI will identify all tracks, analyze their DNA, and help you recreate the vibe</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {analysisState === 'idle' && (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Upload Tabs */}
                <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl overflow-hidden">
                  {/* Tab Headers */}
                  <div className="flex border-b border-[#2a2a2a]">
                    <button
                      onClick={() => setActiveTab('file')}
                      className={`flex-1 px-6 py-4 font-medium transition-colors ${
                        activeTab === 'file'
                          ? 'bg-[#1a1a1a] text-white border-b-2 border-[#ff6b35]'
                          : 'text-[#808080] hover:text-white'
                      }`}
                    >
                      📁 Upload File
                    </button>
                    <button
                      onClick={() => setActiveTab('youtube')}
                      className={`flex-1 px-6 py-4 font-medium transition-colors ${
                        activeTab === 'youtube'
                          ? 'bg-[#1a1a1a] text-white border-b-2 border-[#ff6b35]'
                          : 'text-[#808080] hover:text-white'
                      }`}
                    >
                      ▶️ YouTube Link
                    </button>
                    <button
                      onClick={() => setActiveTab('soundcloud')}
                      className={`flex-1 px-6 py-4 font-medium transition-colors ${
                        activeTab === 'soundcloud'
                          ? 'bg-[#1a1a1a] text-white border-b-2 border-[#ff6b35]'
                          : 'text-[#808080] hover:text-white'
                      }`}
                    >
                      🔊 SoundCloud Link
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-8">
                    {activeTab === 'file' && (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-12 text-center hover:border-[#ff6b35] transition-colors cursor-pointer">
                          <Upload className="w-16 h-16 text-[#808080] mx-auto mb-4" />
                          <p className="text-white text-lg font-medium mb-2">Drag & drop your DJ mix here</p>
                          <p className="text-[#808080] text-sm mb-4">Supported formats: MP3, WAV, FLAC · Max size: 500 MB (2 hours)</p>
                          <button
                            onClick={handleAnalyze}
                            className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors"
                          >
                            Browse Files
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'youtube' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-4">
                          <Youtube className="w-6 h-6 text-red-500 flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Paste YouTube link (e.g., youtube.com/watch?v=abc123)"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="flex-1 bg-transparent text-white placeholder-[#808080] focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleAnalyze}
                          className="w-full px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors"
                        >
                          Analyze Mix
                        </button>
                      </div>
                    )}

                    {activeTab === 'soundcloud' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-4">
                          <Cloud className="w-6 h-6 text-[#ff6b35] flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Paste SoundCloud link (e.g., soundcloud.com/artist/mix-name)"
                            value={soundcloudUrl}
                            onChange={(e) => setSoundcloudUrl(e.target.value)}
                            className="flex-1 bg-transparent text-white placeholder-[#808080] focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleAnalyze}
                          className="w-full px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors"
                        >
                          Analyze Mix
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Example Mixes */}
                <div>
                  <p className="text-[#808080] text-sm mb-3">Try an example:</p>
                  <div className="flex flex-wrap gap-3">
                    {exampleMixes.map((mix) => (
                      <button
                        key={mix.id}
                        onClick={handleAnalyze}
                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white text-sm transition-colors"
                      >
                        {mix.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(analysisState === 'uploading' || analysisState === 'analyzing') && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-12 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <Loader2 className="w-24 h-24 text-[#ff6b35] animate-spin" />
                    <Sparkles className="w-10 h-10 text-white absolute inset-0 m-auto" />
                  </div>

                  {analysisState === 'uploading' && (
                    <>
                      <h3 className="text-2xl font-bold text-white mb-2">🎵 Uploading mix...</h3>
                      <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden mt-6">
                        <motion.div
                          className="h-full bg-[#ff6b35]"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-[#808080] mt-3">{uploadProgress}%</p>
                    </>
                  )}

                  {analysisState === 'analyzing' && (
                    <>
                      <h3 className="text-2xl font-bold text-white mb-2">🤖 Analyzing audio...</h3>
                      <p className="text-[#808080] mb-6">🔍 Identifying tracks... {tracksFound}/12 found</p>
                      <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#ff6b35]"
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-[#808080] mt-3">~3 minutes remaining</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {analysisState === 'complete' && (
              <div className="space-y-6">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-[#ff6b35]/20 to-transparent border-l-4 border-[#ff6b35] rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-[#ff6b35]" />
                    <h2 className="text-2xl font-bold text-white">Analysis Complete!</h2>
                  </div>
                  <div className="grid grid-cols-5 gap-6 text-sm">
                    <div>
                      <div className="text-[#808080]">Title</div>
                      <div className="text-white font-medium">Carl Cox - Space Ibiza 2023</div>
                    </div>
                    <div>
                      <div className="text-[#808080]">Duration</div>
                      <div className="text-white font-medium">{formatTime(5400)}</div>
                    </div>
                    <div>
                      <div className="text-[#808080]">Tracks Found</div>
                      <div className="text-white font-medium">{analyzedTracks.length}</div>
                    </div>
                    <div>
                      <div className="text-[#808080]">Average BPM</div>
                      <div className="text-white font-medium">{averageBPM}</div>
                    </div>
                    <div>
                      <div className="text-[#808080]">Key Range</div>
                      <div className="text-white font-medium">4A - 8B</div>
                    </div>
                  </div>
                </div>

                {/* Track List */}
                <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#2a2a2a]">
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">#</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">Track Name</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">Artist</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">BPM</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">Key</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">Energy</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">Style</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">Time</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-[#808080] uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyzedTracks.map((track, index) => (
                          <tr key={track.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                            <td className="px-4 py-3 text-[#808080] font-mono">{track.number}</td>
                            <td className="px-4 py-3 text-white font-medium">{track.name}</td>
                            <td className="px-4 py-3 text-[#808080]">{track.artist}</td>
                            <td className="px-4 py-3 text-[#ff6b35] font-mono">{track.bpm}</td>
                            <td className="px-4 py-3 text-[#4488ff] font-mono">{track.key}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden max-w-[60px]">
                                  <div 
                                    className="h-full bg-[#ff6b35]"
                                    style={{ width: `${(track.energy / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-white text-sm">{track.energy}/10</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#808080]">{track.style}</td>
                            <td className="px-4 py-3 text-[#808080] font-mono text-sm">
                              {formatTime(track.startTime)} - {formatTime(track.endTime)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1.5 rounded hover:bg-[#2a2a2a] text-[#808080] hover:text-white transition-colors">
                                  <Play className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded hover:bg-[#2a2a2a] text-[#808080] hover:text-white transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="px-3 py-1 bg-[#ff6b35] hover:bg-[#ff8555] rounded text-white text-xs font-medium transition-colors">
                                  Generate
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate All Tracks
                    </button>
                    <button className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors flex items-center gap-2">
                      <Music2 className="w-5 h-5" />
                      Create DJ Mix
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Analysis
                    </button>
                    <button className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save to Library
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Mix Insights */}
        {analysisState === 'complete' && (
          <div className="w-80 bg-[#0f0f0f] border-l border-[#2a2a2a] p-6 overflow-y-auto space-y-6">
            <h3 className="text-white font-bold text-lg">Mix Insights</h3>

            {/* Energy Flow Graph */}
            <div className="space-y-3">
              <h4 className="text-sm text-[#808080] font-bold">Energy Flow</h4>
              <div className="h-32 bg-[#1a1a1a] rounded-lg p-4">
                <svg className="w-full h-full">
                  <polyline
                    points="0,80 20,70 40,60 60,50 80,40 100,35 120,30 140,40 160,50 180,55 200,60 220,65 240,75 260,80"
                    fill="none"
                    stroke="#ff6b35"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between text-xs text-[#808080]">
                <span>0:00</span>
                <span>45:00</span>
                <span>90:00</span>
              </div>
            </div>

            {/* Key Distribution */}
            <div className="space-y-3">
              <h4 className="text-sm text-[#808080] font-bold">Key Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">4A</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff6b35]" style={{ width: '25%' }} />
                    </div>
                    <span className="text-sm text-[#808080] w-8">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">5A</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff6b35]" style={{ width: '33%' }} />
                    </div>
                    <span className="text-sm text-[#808080] w-8">33%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">6A</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff6b35]" style={{ width: '17%' }} />
                    </div>
                    <span className="text-sm text-[#808080] w-8">17%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">8B</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff6b35]" style={{ width: '25%' }} />
                    </div>
                    <span className="text-sm text-[#808080] w-8">25%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BPM Range */}
            <div className="space-y-3">
              <h4 className="text-sm text-[#808080] font-bold">BPM Range</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white w-24">126-128</span>
                  <div className="flex-1 h-8 bg-[#1a1a1a] rounded overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#ff6b35]" style={{ width: '33%' }} />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">4</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white w-24">129-131</span>
                  <div className="flex-1 h-8 bg-[#1a1a1a] rounded overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#ff6b35]" style={{ width: '50%' }} />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">6</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white w-24">132-134</span>
                  <div className="flex-1 h-8 bg-[#1a1a1a] rounded overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#ff6b35]" style={{ width: '17%' }} />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Style Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm text-[#808080] font-bold">Style Breakdown</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-[#ff6b35] rounded-full text-white text-sm font-medium">Deep Techno (5)</span>
                <span className="px-3 py-1.5 bg-[#ff6b35]/80 rounded-full text-white text-sm font-medium">Peak Techno (4)</span>
                <span className="px-3 py-1.5 bg-[#ff6b35]/60 rounded-full text-white text-sm font-medium">Hypnotic (3)</span>
                <span className="px-3 py-1.5 bg-[#ff6b35]/40 rounded-full text-white text-sm font-medium">Industrial (2)</span>
                <span className="px-3 py-1.5 bg-[#ff6b35]/20 rounded-full text-white text-sm font-medium">Minimal (1)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
