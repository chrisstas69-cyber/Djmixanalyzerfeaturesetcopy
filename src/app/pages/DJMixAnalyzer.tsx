import React, { useState } from 'react';
import UserDNALibrary from '../components/mix-analyzer/UserDNALibrary';
import UploadSection from '../components/mix-analyzer/UploadSection';
import AnalysisResults from '../components/mix-analyzer/AnalysisResults';
import ArtistDNALibrary from '../components/mix-analyzer/ArtistDNALibrary';
import type { DNAProfile, MixAnalysis, Artist } from '../../types/mix-analyzer';

export default function DJMixAnalyzer() {
  const [userProfiles, setUserProfiles] = useState<DNAProfile[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<MixAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

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
            {!currentAnalysis ? (
              <UploadSection 
                onFileUpload={handleFileUpload}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <AnalysisResults 
                analysis={currentAnalysis}
                onSaveProfile={handleSaveProfile}
                onGenerateMix={handleGenerateMix}
                onClose={() => setCurrentAnalysis(null)}
              />
            )}
          </div>

          {/* Right Sidebar - Artist DNA Library */}
          <div className="w-[30%] border-l border-white/10 bg-[#0F0F0F]">
            <ArtistDNALibrary 
              onSelectArtist={setSelectedArtist}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
