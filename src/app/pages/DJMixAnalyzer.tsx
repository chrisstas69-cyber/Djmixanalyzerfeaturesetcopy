import React, { useState, useCallback } from 'react';
import UserDNALibrary from '../components/mix-analyzer/UserDNALibrary';
import UploadSection from '../components/mix-analyzer/UploadSection';
import AnalysisResults from '../components/mix-analyzer/AnalysisResults';
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

interface PageProps {
  onNavigate?: (view: string) => void;
}

export default function DJMixAnalyzer({ onNavigate }: PageProps) {
  const [userProfiles, setUserProfiles] = useState<DNAProfile[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<MixAnalysis | null>(null);
  const [analysisUrl, setAnalysisUrl] = useState<string | null>(null);
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'loading' | 'results'>('idle');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const handleAnalysisProgressComplete = useCallback(() => {
    if (analysisUrl) {
      setCurrentAnalysis(buildMockAnalysisFromUrl(analysisUrl));
      setAnalysisPhase('results');
    }
  }, [analysisUrl]);

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    // Simulate analysis - replace with real API call
    setTimeout(() => {
      // Mock analysis result
      const mockAnalysis: MixAnalysis = {
        duration: '1:23:45',
        bpmRange: [122, 128],
        keyProgression: ['Am', 'Dm', 'Em'],
        energyCurve: [65, 70, 75, 80, 85, 90, 85, 80],
        genreDistribution: [
          { genre: 'Tech House', percentage: 60 },
          { genre: 'Deep House', percentage: 30 },
          { genre: 'Minimal', percentage: 10 }
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
            minimal: 65
          },
          styleTags: ['Deep', 'Hypnotic', 'Peak Hour'],
          mixingTechniques: ['Harmonic mixing', 'Energy building', 'Loop layering'],
          transitionAverage: '16-32 bars'
        }
      };
      setCurrentAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleSaveProfile = (profile: DNAProfile) => {
    setUserProfiles([profile, ...userProfiles]);
    // TODO: Save to backend/localStorage
  };

  const handleGenerateMix = () => {
    // TODO: Navigate to mixer with DNA profile
    console.log('Generate mix with DNA:', currentAnalysis?.dnaProfile);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1600px] px-8">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#1A1A1A]/50 backdrop-blur-xl">
          <div className="py-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">DJ Mix Analyzer</h1>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold">
                SYNTAX Audio Intelligence
              </span>
            </div>
            <p className="text-white/60 mt-2">Analyze mix structure and generate DNA profiles</p>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Sidebar - User DNA Library - Fixed Width */}
          <div className="w-[320px] flex-shrink-0 border-r border-white/10 bg-[#0F0F0F]">
            <UserDNALibrary 
              profiles={userProfiles}
              onSelectProfile={(profile) => console.log('Selected:', profile)}
            />
          </div>

          {/* Center - Upload & Analysis - Flexible */}
          <div className="flex-1 overflow-y-auto">
            {analysisPhase === 'loading' && analysisUrl ? (
              <AnalysisProgress url={analysisUrl} onComplete={handleAnalysisProgressComplete} />
            ) : !currentAnalysis ? (
              <UploadSection
                onFileUpload={handleFileUpload}
                onAnalyzeUrl={(url) => {
                  setAnalysisUrl(url);
                  setAnalysisPhase('loading');
                }}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <AnalysisResults
                analysis={currentAnalysis}
                mixTitle={analysisUrl ? getMixTitleFromUrl(analysisUrl) : undefined}
                onSaveProfile={handleSaveProfile}
                onGenerateMix={handleGenerateMix}
                onClose={() => {
                  setCurrentAnalysis(null);
                  setAnalysisUrl(null);
                  setAnalysisPhase('idle');
                }}
                onNavigateToCreateTrack={(prompt) => {
                  onNavigate?.('create-track-modern');
                  if (prompt) sessionStorage.setItem('createTrackPrefillPrompt', prompt);
                }}
              />
            )}
          </div>

          {/* Right Sidebar - Artist DNA Library */}
          <div className="w-[30%] border-l border-white/10 bg-[#0F0F0F]">
            <ArtistDNALibrary
              onSelectArtist={setSelectedArtist}
              thisMixProfile={currentAnalysis?.dnaProfile ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
