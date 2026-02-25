// Import polyfills first
import '../polyfills';

import React, { useState } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { TrackCard } from './components/TrackCard';
import { GenerationCard } from './components/GenerationCard';
import { ContextPanel } from './components/ContextPanel';
import { AnalysisView } from './components/AnalysisView';
import { DNALibrary } from './components/DNALibrary';
import { Dashboard } from './components/Dashboard';
import { MusicDNAEmpty } from './components/MusicDNAEmpty';
import { MusicDNAUpload } from './components/MusicDNAUpload';
import { MusicDNAAnalysis } from './components/MusicDNAAnalysis';
import { MusicDNAProfile } from './components/MusicDNAProfile';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { SignUpPage } from './components/SignUpPage';
import { LoginPage } from './components/LoginPage';
import { TopNavigation } from './components/TopNavigation';
import { TracksLibrary } from './components/TracksLibrary';
import { ProfessionalLibrary } from './components/ProfessionalLibrary';
import { Settings } from './components/Settings';
import { PromptSection } from './components/PromptSection';
import { ModeToggle } from './components/ModeToggle';
import { CollapsibleSidebar } from './components/CollapsibleSidebar';
import { WaveformDemo } from './components/WaveformDemo';
import { ProfessionalWaveformDemo } from './components/ProfessionalWaveformDemo';
import { ProfessionalWaveformShowcase } from './components/ProfessionalWaveformShowcase';
import { CleanGeneratorLayout } from './components/CleanGeneratorLayout';
import { SimpleGeneratorLayout } from './components/SimpleGeneratorLayout';
import { CDJWaveformShowcase } from './components/CDJWaveformShowcase';
import { CuePointEditorDemo } from './components/CuePointEditorDemo';
import { BottomAudioPlayerDemo } from './components/BottomAudioPlayerDemo';
import { AutoDJMix } from './components/AutoDJMix';
import { AutoDJMixer } from './components/AutoDJMixer';
import { DJMixAnalyzer } from './components/DJMixAnalyzer';
import { CamelotWheel } from './components/CamelotWheel';
import { EducationPage } from './components/EducationPage';
import { Library, LayoutGrid, ChartArea, CircleDot } from 'lucide-react';
import { UnifiedSidebar } from './components/UnifiedSidebar';
import { ClassicGeneratorLayout } from './components/ClassicGeneratorLayout';
import { ImprovedGeneratorLayout } from './components/ImprovedGeneratorLayout';

type View = 'landing' | 'pricing' | 'signup' | 'login' | 'generator' | 'library' | 'analysis' | 'dna-library' | 'dashboard' | 'tracks' | 'music-dna-empty' | 'music-dna-upload' | 'music-dna-analysis' | 'music-dna-profile' | 'settings' | 'waveform-demo' | 'professional-waveform' | 'professional-waveform-showcase' | 'cdj-waveform' | 'clean-generator' | 'simple-generator' | 'cue-editor' | 'bottom-player' | 'auto-dj' | 'auto-dj-mixer' | 'dj-mix-analyzer' | 'camelot-wheel' | 'education';

interface Track {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  length: string;
  isExpanded: boolean;
  isPlaying: boolean;
  currentVersion: string;
  versions: Array<{ id: string; label: string }>;
  mutatingButton?: string | null;
  warning?: {
    type: 'info' | 'advisory' | 'blocking';
    message: string;
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    // Check URL hash to determine initial view
    const hash = window.location.hash.slice(1);
    if (hash === 'dashboard') return 'dashboard';
    return 'dashboard'; // Changed to show dashboard by default
  });
  const [generatorMode, setGeneratorMode] = useState<'simple' | 'custom'>('simple');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contextPanelOpen, setContextPanelOpen] = useState(false);
  const [musicDNAMode, setMusicDNAMode] = useState<'off' | 'my-dna' | 'custom'>('off');
  const [hasMusicDNAProfile, setHasMusicDNAProfile] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Nocturnal Sequence',
      bpm: 128,
      genre: 'Techno • Minimal',
      length: '7:24',
      isExpanded: false,
      isPlaying: false,
      currentVersion: 'A',
      versions: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' }
      ]
    },
    {
      id: '2',
      title: 'Subsonic Ritual',
      bpm: 126,
      genre: 'Techno • Dub',
      length: '6:48',
      isExpanded: false,
      isPlaying: false,
      currentVersion: 'A',
      versions: [
        { id: 'A', label: 'A' }
      ],
      warning: {
        type: 'advisory',
        message: 'Percussion density is higher than typical for this style.'
      }
    }
  ]);

  const [generationStages, setGenerationStages] = useState([
    { name: 'Rhythm & Groove', status: 'pending' as const },
    { name: 'Bass & Sub', status: 'pending' as const },
    { name: 'Harmony & Texture', status: 'pending' as const },
    { name: 'Arrangement', status: 'pending' as const },
    { name: 'Final Balance', status: 'pending' as const }
  ]);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation process
    const stages = [...generationStages];
    let currentStage = 0;
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + 2;
        
        // Update stages
        const stageProgress = Math.floor(newProgress / 20);
        if (stageProgress > currentStage && currentStage < stages.length) {
          if (currentStage > 0) {
            stages[currentStage - 1].status = 'complete';
          }
          stages[currentStage].status = 'active';
          setGenerationStages([...stages]);
          currentStage = stageProgress;
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          stages[stages.length - 1].status = 'complete';
          setGenerationStages([...stages]);
          
          // Add new track
          setTimeout(() => {
            const newTrack: Track = {
              id: String(Date.now()),
              title: 'New Generation',
              bpm: 128,
              genre: 'Techno • Minimal',
              length: '7:00',
              isExpanded: true,
              isPlaying: false,
              currentVersion: 'A',
              versions: [{ id: 'A', label: 'A' }]
            };
            setTracks(prev => [newTrack, ...prev]);
            setIsGenerating(false);
            
            // Reset stages
            setTimeout(() => {
              setGenerationStages([
                { name: 'Rhythm & Groove', status: 'pending' },
                { name: 'Bass & Sub', status: 'pending' },
                { name: 'Harmony & Texture', status: 'pending' },
                { name: 'Arrangement', status: 'pending' },
                { name: 'Final Balance', status: 'pending' }
              ]);
            }, 500);
          }, 500);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 50);
  };

  const handleToggleExpand = (trackId: string) => {
    setTracks(prev =>
      prev.map(track => ({
        ...track,
        isExpanded: track.id === trackId ? !track.isExpanded : false
      }))
    );
    
    // Open context panel when expanding
    const track = tracks.find(t => t.id === trackId);
    if (track && !track.isExpanded) {
      setContextPanelOpen(true);
    }
  };

  const handleTogglePlay = (trackId: string) => {
    setTracks(prev =>
      prev.map(track => ({
        ...track,
        isPlaying: track.id === trackId ? !track.isPlaying : false
      }))
    );
  };

  const handleRestart = (trackId: string) => {
    console.log('Restart track:', trackId);
  };

  const handleMutate = (trackId: string, mutationType: string) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId
          ? { ...track, mutatingButton: mutationType }
          : track
      )
    );

    // Simulate mutation
    setTimeout(() => {
      setTracks(prev =>
        prev.map(track => {
          if (track.id === trackId) {
            const newVersionLabel = String.fromCharCode(65 + track.versions.length);
            return {
              ...track,
              mutatingButton: null,
              versions: [...track.versions, { id: newVersionLabel, label: newVersionLabel }],
              currentVersion: newVersionLabel
            };
          }
          return track;
        })
      );
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

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setCurrentView('dashboard')}
        onLogin={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignUpPage
        onSignUp={(email, password, name) => {
          console.log('Sign up:', { email, password, name });
          setCurrentView('generator');
        }}
        onSwitchToLogin={() => setCurrentView('login')}
        onGoogleSignUp={() => {
          console.log('Google sign up');
          setCurrentView('generator');
        }}
      />
    );
  }

  if (currentView === 'login') {
    return (
      <LoginPage
        onLogin={(email, password) => {
          console.log('Login:', { email, password });
          setCurrentView('generator');
        }}
        onSwitchToSignUp={() => setCurrentView('signup')}
        onGoogleLogin={() => {
          console.log('Google login');
          setCurrentView('generator');
        }}
        onForgotPassword={() => {
          console.log('Forgot password');
        }}
      />
    );
  }

  if (currentView === 'pricing') {
    return (
      <PricingPage 
        onBack={() => setCurrentView('landing')}
        onSelectPlan={(plan) => {
          console.log('Selected plan:', plan);
          setCurrentView('generator');
        }}
      />
    );
  }

  if (currentView === 'analysis') {
    return (
      <AnalysisView
        trackTitle="Nocturnal Sequence"
        onBack={() => setCurrentView('generator')}
        tasteMatch={musicDNAMode === 'my-dna' ? 87 : undefined}
      />
    );
  }

  if (currentView === 'dna-library') {
    console.log('✅ DNA Library view activated');
    return (
      <DNALibrary
        onBack={() => setCurrentView('dashboard')}
        onLoadPreset={(presetId) => {
          console.log('Load preset:', presetId);
          setCurrentView('generator');
        }}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard
        onNavigate={(view: any) => setCurrentView(view)}
      />
    );
  }

  if (currentView === 'music-dna-empty') {
    return (
      <MusicDNAEmpty
        onBack={() => setCurrentView('dashboard')}
        onUpload={() => setCurrentView('music-dna-upload')}
        onSkip={() => setCurrentView('generator')}
      />
    );
  }

  if (currentView === 'music-dna-upload') {
    return (
      <MusicDNAUpload
        onBack={() => setCurrentView('dashboard')}
        onViewProfile={() => {
          setHasMusicDNAProfile(true);
          setCurrentView('music-dna-profile');
        }}
      />
    );
  }

  if (currentView === 'music-dna-analysis') {
    return (
      <MusicDNAAnalysis
        onBack={() => setCurrentView('music-dna-upload')}
        trackName="Deep_Sequence_128.wav"
      />
    );
  }

  if (currentView === 'music-dna-profile') {
    return (
      <MusicDNAProfile
        onBack={() => setCurrentView('dashboard')}
        onUseProfile={() => {
          setMusicDNAMode('my-dna');
          setCurrentView('generator');
        }}
      />
    );
  }

  if (currentView === 'library') {
    return (
      <TracksLibrary
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <Settings
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'waveform-demo') {
    return (
      <WaveformDemo
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'professional-waveform') {
    return (
      <ProfessionalWaveformDemo
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'professional-waveform-showcase') {
    return (
      <ProfessionalWaveformShowcase
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'cdj-waveform') {
    return (
      <CDJWaveformShowcase
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'clean-generator') {
    return (
      <CleanGeneratorLayout
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'simple-generator') {
    return (
      <SimpleGeneratorLayout
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'cue-editor') {
    return (
      <CuePointEditorDemo
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'bottom-player') {
    return (
      <BottomAudioPlayerDemo
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'auto-dj') {
    return (
      <AutoDJMix
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'auto-dj-mixer') {
    return (
      <AutoDJMixer
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'dj-mix-analyzer') {
    return (
      <DJMixAnalyzer
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'camelot-wheel') {
    return (
      <CamelotWheel />
    );
  }

  if (currentView === 'education') {
    return (
      <EducationPage />
    );
  }

  // Classic Generator View - Use new improved two-column layout
  if (currentView === 'generator') {
    return (
      <ImprovedGeneratorLayout
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="h-screen flex bg-[var(--background)]">
      {/* Unified Sidebar - Always visible */}
      <UnifiedSidebar
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mode Toggle - Only show on generator page */}
        {currentView === 'generator' && (
          <ModeToggle
            mode={generatorMode}
            onChange={(mode) => {
              setGeneratorMode(mode);
              localStorage.setItem('generatorMode', mode);
            }}
          />
        )}

        {/* Generator Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Controls (only in Custom mode) */}
          {generatorMode === 'custom' && currentView === 'generator' && (
            <ControlsPanel 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
              musicDNAMode={musicDNAMode}
              onMusicDNAChange={setMusicDNAMode}
            />
          )}

          {/* Center Panel - Prompt & Generation */}
          {currentView === 'generator' && (
            <div className={generatorMode === 'simple' ? 'flex-1 max-w-3xl mx-auto' : 'w-[400px] flex-shrink-0'}>
              <PromptSection
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                autoGeneratedPrompt="[style:80] [creativity:41] [structure:intro-verse-bridge-verse-outro] Stripped-down, spacious, deep atmospheric dub chords, A Minor key, 125 BPM, driving four-to-the-floor, energetic pulse, warm analog saturation, tape compression, vintage equipment, cavernous deep reverb, dub techno echo, dark menacing atmosphere, shadowy textures, stripped-down minimal arrangement, sparse elements, neutral temperature, balanced spectrum."
              />
            </div>
          )}

          {/* Right Panel - Track Feed (only in Custom mode) */}
          {generatorMode === 'custom' && currentView === 'generator' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Track Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isGenerating && (
                  <GenerationCard stages={generationStages} progress={generationProgress} />
                )}

                {tracks.map(track => (
                  <TrackCard
                    key={track.id}
                    {...track}
                    onToggleExpand={() => handleToggleExpand(track.id)}
                    onTogglePlay={() => handleTogglePlay(track.id)}
                    onRestart={() => handleRestart(track.id)}
                    onMutate={(type) => handleMutate(track.id, type)}
                    onVersionChange={(versionId) => handleVersionChange(track.id, versionId)}
                  />
                ))}

                {tracks.length === 0 && !isGenerating && (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-[var(--surface-charcoal)] flex items-center justify-center">
                        <LayoutGrid className="w-8 h-8 text-[var(--text-tertiary)]" />
                      </div>
                      <h3 className="text-[var(--text-primary)]">No tracks yet</h3>
                      <p className="text-sm text-[var(--text-secondary)] max-w-sm">
                        Configure your parameters and click Generate Track
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Context Panel */}
          <ContextPanel
            isOpen={contextPanelOpen}
            onClose={() => setContextPanelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}