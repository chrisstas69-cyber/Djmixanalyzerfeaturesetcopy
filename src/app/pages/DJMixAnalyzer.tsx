import React, { useState, useCallback, useRef } from 'react';
import { Play, Upload, Activity } from 'lucide-react';
import AnalysisProgress from '../components/mix-analyzer/AnalysisProgress';
import ArtistDNALibrary from '../components/mix-analyzer/ArtistDNALibrary';
import type { DNAProfile, MixAnalysis, Artist, DetectedTrack } from '../../types/mix-analyzer';

const MOCK_DETECTED_TRACKS: DetectedTrack[] = [
  { id: '1', timestamp: '0:00', name: 'Parallel Minds', artist: 'Alignment', bpm: 130, key: 'Am', duration: '7:12', energyLevel: 82 },
  { id: '2', timestamp: '7:12', name: 'Subterranean', artist: 'Truncate', bpm: 128, key: 'Fm', duration: '7:33', energyLevel: 78 },
  { id: '3', timestamp: '14:45', name: 'Vortex (Original Mix)', artist: 'Speedy J', bpm: 132, key: 'Cm', duration: '6:45', energyLevel: 91 },
  { id: '4', timestamp: '21:30', name: 'Acid Rain', artist: 'Chris Liebing', bpm: 134, key: 'Gm', duration: '6:45', energyLevel: 85 },
  { id: '5', timestamp: '28:15', name: 'Deep Signal', artist: 'Joeski', bpm: 126, key: 'Dm', duration: '7:15', energyLevel: 70 },
  { id: '6', timestamp: '35:00', name: 'Phase Shift', artist: 'Richie Hawtin', bpm: 130, key: 'Em', duration: '6:22', energyLevel: 88 },
  { id: '7', timestamp: '41:22', name: 'Warehouse Protocol', artist: 'Adam Beyer', bpm: 128, key: 'Bm', duration: '6:48', energyLevel: 80 },
  { id: '8', timestamp: '48:10', name: 'Oscillate', artist: 'Surgeon', bpm: 136, key: 'F#m', duration: '7:20', energyLevel: 94 },
  { id: '9', timestamp: '55:30', name: 'Midnight Circuit', artist: 'Blawan', bpm: 132, key: 'Am', duration: '6:45', energyLevel: 83 },
  { id: '10', timestamp: '62:15', name: 'Concrete Jungle', artist: 'Paula Temple', bpm: 138, key: 'Cm', duration: '6:45', energyLevel: 96 },
  { id: '11', timestamp: '69:00', name: 'Resonance', artist: 'Dax J', bpm: 130, key: 'Gm', duration: '6:45', energyLevel: 79 },
  { id: '12', timestamp: '75:45', name: 'Final Transmission', artist: 'Ancient Methods', bpm: 134, key: 'Dm', duration: '8:47', energyLevel: 87 },
];

function getMixTitleFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes('soundcloud')) return 'SoundCloud Mix';
    if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube Mix';
    if (host.includes('mixcloud')) return 'Mixcloud Mix';
    return 'Detected Mix';
  } catch {
    return 'Mix';
  }
}

function buildMockAnalysisFromUrl(url: string): MixAnalysis {
  return {
    duration: '1:24:32',
    bpmRange: [126, 138],
    keyProgression: ['Am', 'Fm', 'Cm', 'Gm', 'Dm', 'Em', 'Bm', 'F#m'],
    energyCurve: [70, 72, 78, 82, 85, 88, 85, 90, 88, 96, 87, 84],
    genreDistribution: [
      { genre: 'Techno', percentage: 55 },
      { genre: 'Industrial', percentage: 25 },
      { genre: 'Dark', percentage: 20 },
    ],
    detectedTracks: MOCK_DETECTED_TRACKS,
    dnaProfile: {
      id: 'this-mix-' + Date.now(),
      name: 'This Mix',
      date: new Date().toISOString(),
      bpmRange: [126, 138],
      trackCount: 12,
      dnaAttributes: {
        groove: 87,
        energy: 84,
        darkness: 76,
        hypnotic: 72,
        minimal: 68,
      },
      styleTags: ['Techno', 'Dark', 'Industrial'],
      mixingTechniques: ['Peak hour', 'Hard transitions', 'Industrial textures'],
      transitionAverage: '8-16 bars',
    },
  };
}

const DNA_BAR_CONFIG: { key: keyof DNAProfile['dnaAttributes']; label: string; color: string; placeholder: number }[] = [
  { key: 'groove', label: 'Groove', color: 'from-orange-500 to-red-500', placeholder: 85 },
  { key: 'energy', label: 'Energy', color: 'from-orange-400 to-yellow-500', placeholder: 72 },
  { key: 'darkness', label: 'Darkness', color: 'from-purple-600 to-indigo-900', placeholder: 91 },
  { key: 'hypnotic', label: 'Hypnotic', color: 'from-blue-500 to-purple-500', placeholder: 78 },
  { key: 'minimal', label: 'Minimal', color: 'from-zinc-400 to-zinc-600', placeholder: 65 },
];

interface PageProps {
  onNavigate?: (view: string) => void;
}

export default function DJMixAnalyzer({ onNavigate }: PageProps) {
  const [userProfiles, setUserProfiles] = useState<DNAProfile[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<MixAnalysis | null>(null);
  const [analysisUrl, setAnalysisUrl] = useState<string | null>(null);
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'loading' | 'results'>('idle');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profileTab, setProfileTab] = useState<'my' | 'artist'>('my');
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleAnalysisProgressComplete = useCallback(() => {
    if (analysisUrl) {
      setCurrentAnalysis(buildMockAnalysisFromUrl(analysisUrl));
      setAnalysisPhase('results');
    }
  }, [analysisUrl]);

  const handleAnalyzeUrl = () => {
    const url = urlInputRef.current?.value?.trim();
    if (url) {
      setAnalysisUrl(url);
      setAnalysisPhase('loading');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const mockAnalysis: MixAnalysis = {
        duration: '1:23:45',
        bpmRange: [122, 128],
        keyProgression: ['Am', 'Dm', 'Em'],
        energyCurve: [65, 70, 75, 80, 85, 90, 85, 80],
        genreDistribution: [
          { genre: 'Tech House', percentage: 60 },
          { genre: 'Deep House', percentage: 30 },
          { genre: 'Minimal', percentage: 10 },
        ],
        detectedTracks: [],
        dnaProfile: {
          id: Date.now().toString(),
          name: file.name,
          date: new Date().toISOString(),
          bpmRange: [122, 128],
          trackCount: 24,
          dnaAttributes: {
            groove: 85,
            energy: 72,
            darkness: 91,
            hypnotic: 78,
            minimal: 65,
          },
          styleTags: ['Deep', 'Hypnotic', 'Peak Hour'],
          mixingTechniques: ['Harmonic mixing', 'Energy building', 'Loop layering'],
          transitionAverage: '16-32 bars',
        },
      };
      setCurrentAnalysis(mockAnalysis);
      setAnalysisPhase('results');
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes('audio') || file.type.includes('video'))) {
      handleFileUpload(file);
    }
  };

  const handleSaveProfile = (profile: DNAProfile) => {
    setUserProfiles([profile, ...userProfiles]);
  };

  const handleGenerateMix = () => {
    onNavigate?.('auto-dj-mixer-clean');
  };

  const handleCloseResults = () => {
    setCurrentAnalysis(null);
    setAnalysisUrl(null);
    setAnalysisPhase('idle');
  };

  const dna = currentAnalysis?.dnaProfile?.dnaAttributes;
  const genrePrimary = currentAnalysis?.genreDistribution?.[0];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8 font-sans overflow-y-auto">
      {/* Section A: Input Deck */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Input Deck</h2>
        <div className="relative flex items-center mb-4">
          <input
            ref={urlInputRef}
            type="text"
            placeholder="Paste SoundCloud, Mixcloud, or YouTube URL..."
            className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-full py-4 px-6 text-zinc-300 focus:outline-none focus:border-orange-500 transition-colors text-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeUrl()}
          />
          <button
            type="button"
            onClick={handleAnalyzeUrl}
            disabled={analysisPhase === 'loading'}
            className="absolute right-2 bg-[#ff5722] hover:bg-orange-600 text-white font-bold py-2 px-8 rounded-full transition-all disabled:opacity-50"
          >
            Analyze
          </button>
        </div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="w-full border-2 border-dashed border-zinc-800 rounded-xl py-8 flex flex-col items-center justify-center text-zinc-500 hover:border-zinc-700 transition-colors cursor-pointer bg-[#1a1a1a]/30"
        >
          <Upload className="w-8 h-8 mb-2 opacity-50" />
          <p>Or drag & drop audio files (MP3, WAV) to extract DNA</p>
        </div>
      </section>

      {/* Section B: DNA Lab (Hero) or Loading */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">DNA Lab</h2>

        {analysisPhase === 'loading' && analysisUrl ? (
          <AnalysisProgress url={analysisUrl} onComplete={handleAnalysisProgressComplete} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: DNA Fingerprint */}
            <div className="md:col-span-7 bg-[#1a1a1a] rounded-2xl p-8 border border-zinc-800">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-orange-500" /> DNA Fingerprint
              </h3>

              <div className="space-y-6">
                {DNA_BAR_CONFIG.map((config) => {
                  const val = dna ? dna[config.key] : config.placeholder;
                  const valStr = `${val}%`;
                  return (
                    <div key={config.key}>
                      <div className="flex justify-between text-sm mb-2 font-medium text-zinc-300">
                        <span>{config.label}</span>
                        <span>{valStr}</span>
                      </div>
                      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
                          style={{ width: valStr }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2 mt-8">
                {(currentAnalysis?.dnaProfile?.styleTags ?? ['Deep', 'Hypnotic', 'Peak Hour']).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md border border-zinc-700 text-xs text-zinc-400 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Mix Overview + CTA */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-zinc-800 flex-1">
                <h3 className="text-xl font-semibold mb-4 text-white">Mix Overview</h3>

                <div className="h-24 w-full bg-gradient-to-b from-purple-500/20 to-transparent flex items-end gap-1 mb-6">
                  {(currentAnalysis?.energyCurve ?? Array.from({ length: 40 }, () => Math.random() * 60 + 30)).map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-purple-500 rounded-t-sm opacity-60"
                        style={{ height: `${typeof h === 'number' ? h : 50}%` }}
                      />
                    )
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <div className="text-orange-500 font-bold text-lg">
                      {currentAnalysis?.duration ?? '1:23:45'}
                    </div>
                    <div className="text-xs text-zinc-500">Duration</div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <div className="text-blue-400 font-bold text-lg">
                      {currentAnalysis?.bpmRange ? `${currentAnalysis.bpmRange[0]}-${currentAnalysis.bpmRange[1]}` : '122-128'}
                    </div>
                    <div className="text-xs text-zinc-500">BPM Range</div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3">
                    <div className="text-purple-400 font-bold text-lg">
                      {currentAnalysis?.dnaProfile?.trackCount ?? 24}
                    </div>
                    <div className="text-xs text-zinc-500">Tracks</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-4">
                  <span className="text-zinc-400">Genre Distribution</span>
                  <span className="text-white font-medium">
                    {genrePrimary ? `${genrePrimary.genre} (${genrePrimary.percentage}%)` : 'Tech House (60%)'}
                  </span>
                </div>

                {currentAnalysis && (
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => currentAnalysis?.dnaProfile && handleSaveProfile(currentAnalysis.dnaProfile)}
                      className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                    >
                      Save as DNA profile
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseResults}
                      className="text-zinc-500 hover:text-white text-sm"
                    >
                      Clear & analyze another
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleGenerateMix}
                className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white py-5 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(255,87,34,0.4)] hover:shadow-[0_0_30px_rgba(255,87,34,0.6)] transition-all uppercase tracking-wide flex items-center justify-center gap-2 group"
              >
                <Play className="fill-current w-5 h-5 group-hover:scale-110 transition-transform" />
                Generate Auto DJ Mix Using This DNA
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Section C: Profile Library */}
      <section className="max-w-6xl mx-auto">
        <div className="flex gap-6 mb-6 border-b border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => setProfileTab('my')}
            className={`pb-2 px-1 transition-colors ${
              profileTab === 'my' ? 'text-orange-500 font-semibold border-b-2 border-orange-500' : 'text-zinc-500 hover:text-white'
            }`}
          >
            My Profiles
          </button>
          <button
            type="button"
            onClick={() => setProfileTab('artist')}
            className={`pb-2 px-1 transition-colors ${
              profileTab === 'artist' ? 'text-orange-500 font-semibold border-b-2 border-orange-500' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Artist Profiles
          </button>
        </div>

        {profileTab === 'my' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {userProfiles.length === 0 ? (
              <p className="col-span-full text-zinc-500 py-8">No saved DNA profiles yet. Analyze a mix and save it.</p>
            ) : (
              userProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-[#1a1a1a] p-4 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-purple-500/30" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white truncate">{profile.name}</div>
                      <div className="text-xs text-zinc-500">
                        Avg: {profile.bpmRange[0]}-{profile.bpmRange[1]} BPM
                      </div>
                    </div>
                  </div>
                  <div className="h-8 flex items-end gap-[2px] opacity-40 group-hover:opacity-100 transition-opacity">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-zinc-400 rounded-t-sm"
                        style={{ height: `${(profile.dnaAttributes.energy / 100) * 50 + Math.sin(i * 0.5) * 30 + 30}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <ArtistDNALibrary
            onSelectArtist={() => {}}
            thisMixProfile={currentAnalysis?.dnaProfile ?? null}
          />
        )}
      </section>
    </div>
  );
}
