import React, { useState, useEffect } from "react";
import { SidebarNav } from "./components/sidebar-nav";
import { LandingHero } from "./components/landing-hero";
import { CreateTrackModern } from "./components/create-track-modern";
import { TrackLibraryDJ } from "./components/track-library-dj";
import DNAUnified from "./components/dna-unified";
import { AnalysisScreen } from "./components/analysis-screen";
import { DJMixAnalyzer } from "./components/dj-mix-analyzer";
import DJMixAnalyzerPage from "./pages/DJMixAnalyzer";
import { AutoDJMixerProV3 } from "./components/auto-dj-mixer-pro-v3";
import AutoDJMixerProfessional from "./components/auto-dj-mixer-professional";
import { AutoDJMixerPhotorealistic } from "./components/auto-dj-mixer-photorealistic";
import AutoDJMixerFigma from "./components/auto-dj-mixer-figma";
import AutoDJMixerClean from "./components/auto-dj-mixer-clean";
import { AutoDJMixSelector } from "./components/auto-dj-mix-selector";
import { MixComplete } from "./components/mix-complete";
import { SharePlayer, generateWaveformData } from "./components/share-player";
import { SessionSharePlayer } from "./components/session-share-player";
import { ExportShareDemo } from "./components/export-share-demo";
import { EmptyStatesDemo } from "./components/empty-states";
import { StatsPanel } from "./components/stats-panel";
import MixesPanel from "./components/mixes-panel";
import MyMixesTab from "./components/MyMixesTab";
import { HistoryPanel } from "./components/history-panel";
import { AnalyticsPanel } from "./components/analytics-panel";
import { AnalyticsStatsCombined } from "./components/analytics-stats-combined";
import { SettingsPanel } from "./components/settings-panel";
import SettingsPage from "./pages/Settings";
import { OnboardingModal } from "./components/onboarding-modal";
import { ErrorBoundary } from "./components/error-boundary";
import { HelpPanel } from "./components/help-panel";
import UserProfilePanel from "./components/user-profile-panel";
import { AudioUploadPanel } from "./components/audio-upload-panel";
import { AudioAnalysisPanel } from "./components/audio-analysis-panel";
import { EffectsRackPanel } from "./components/effects-rack-panel";
import { TimelineEditorPanel } from "./components/timeline-editor-panel";
import { AudioExportPanel } from "./components/audio-export-panel";
import { AudioLibraryPanel } from "./components/audio-library-panel";
import DNATracksLibrary from "./components/dna-tracks-library";
import { GeneratedTracksLibrary } from "./components/generated-tracks-library";
import AudioPlayerBar from "./components/audio-player-bar";
import { AuthProvider } from "./components/auth-system";
import { ActivityFeed } from "./components/activity-feed";
import { NotificationBell } from "./components/notifications-system";
import { LegalPages } from "./components/legal-pages";
import { BugFeedbackSystem } from "./components/bug-feedback-system";
import { LiveStreamingPanel } from "./components/live-streaming-panel";
import { HarmonicMixingAssistant } from "./components/harmonic-mixing-assistant";
import { BeatgridEditor } from "./components/beatgrid-editor";
import { CrossfadeEditor } from "./components/crossfade-editor";
import { FrequencyAnalyzer } from "./components/frequency-analyzer";
import { MasteringSuite } from "./components/mastering-suite";
import { PlatformIntegrations } from "./components/platform-integrations";
import { QuantizationPanel } from "./components/quantization-panel";
import { MIDIControllerPanel } from "./components/midi-controller-panel";
import { VinylEmulationPanel } from "./components/vinyl-emulation-panel";
import { AdvancedEffectsRack } from "./components/advanced-effects-rack";
import { KeyShiftingPanel } from "./components/key-shifting-panel";
import { ABTestingPanel } from "./components/ab-testing-panel";
import { PodcastRadioMode } from "./components/podcast-radio-mode";
import { AIVoiceAssistant } from "./components/ai-voice-assistant";
import { MarketplacePanel } from "./components/marketplace-panel";
import { RoyaltyRevenuePanel } from "./components/royalty-revenue-panel";
import { AIVoiceSeparation } from "./components/ai-voice-separation";
import { CollaborationAnalytics } from "./components/collaboration-analytics";
import { WaveformZoomAnalysis } from "./components/waveform-zoom-analysis";
import { NFTBlockchainPanel } from "./components/nft-blockchain-panel";
import { APIDocumentationPanel } from "./components/api-documentation-panel";
import { WhiteLabelPanel } from "./components/white-label-panel";
import { LyricLab } from "./components/lyric-lab";
import { LyricLibrary } from "./components/lyric-library";
import { Toaster } from "./components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { X, Search } from "lucide-react";

export type ViewId =
  | "landing-hero"
  | "create-track-modern"
  | "library"
  | "library-full"
  | "library-pro"
  | "dna-track-library" // New MVP view for uploaded/analyzed tracks
  | "analytics-stats" // Merged Analytics & Stats
  | "lyric-lab" // AI Lyric Generator
  | "lyric-library" // Saved Lyrics Collection
  | "dna"
  | "analysis"
  | "dj-analyzer"
  | "auto-dj-mixer-pro-v3"
  | "auto-dj-mixer-clean"
  | "auto-dj-mix-selector"
  | "mix-complete"
  | "share-player"
  | "session-share-player"
  | "export-share-demo"
  | "stats"
  | "mixes"
  | "history"
  | "analytics"
  | "settings"
  | "help"
  | "profile"
  | "audio-upload"
  | "audio-analysis"
  | "effects-rack"
  | "timeline-editor"
  | "audio-export"
  | "audio-library"
  | "activity-feed"
  | "terms"
  | "privacy"
  | "cookies"
  | "dmca"
  | "contact"
  | "feedback"
  | "live-streaming"
  | "harmonic-mixing"
  | "beatgrid-editor"
  | "crossfade-editor"
  | "frequency-analyzer"
  | "mastering-suite"
  | "soundcloud"
  | "bandcamp"
  | "youtube-music"
  | "quantization"
  | "midi-controller"
  | "vinyl-emulation"
  | "advanced-effects"
  | "key-shifting"
  | "ab-testing"
  | "podcast-radio"
  | "ai-voice-assistant"
  | "marketplace"
  | "royalty-revenue"
  | "ai-voice-separation"
  | "collaboration-analytics"
  | "waveform-zoom"
  | "nft-blockchain"
  | "api-documentation"
  | "white-label"
  | "empty-states";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewId>("landing-hero");
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Check if user has seen onboarding on first load
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setOnboardingOpen(true);
    }
  }, []);

  // Handle loading sample data
  const handleLoadSampleData = () => {
    // Trigger a refresh of the track library if it's open
    if (currentView === "library-full" || currentView === "library") {
      window.location.reload();
    }
  };

  // Listen for Cmd+? (Mac) or Ctrl+? (Windows) to show keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === "?") {
        e.preventDefault();
        setHelpModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOnboardingClose = () => {
    setOnboardingOpen(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const renderView = () => {
    switch (currentView) {
      case "landing-hero":
        return <LandingHero onNavigate={(view) => setCurrentView(view as ViewId)} />;
      case "create-track-modern":
        return <CreateTrackModern />;
      case "library-full":
        return <GeneratedTracksLibrary />;
      case "library":
      case "library-pro":
        return <TrackLibraryDJ key="track-library" onNavigate={(id) => setCurrentView(id as ViewId)} />;
      case "dna":
        return <DNAUnified />;
      case "analysis":
        return <AnalysisScreen />;
      case "dj-analyzer":
        return <DJMixAnalyzerPage onNavigate={(id) => setCurrentView(id as ViewId)} />;
      case "auto-dj-mixer-pro-v3":
        return (
          <div className="h-full w-full min-h-0 min-w-0 flex flex-col overflow-hidden">
            <AutoDJMixerFigma />
          </div>
        );
      case "auto-dj-mixer-clean":
        return (
          <div className="h-full w-full min-h-0 min-w-0 flex flex-col overflow-hidden">
            <AutoDJMixerClean />
          </div>
        );
      case "auto-dj-mix-selector":
        return (
          <div className="h-full w-full min-h-0 min-w-0 flex flex-col overflow-hidden">
            <AutoDJMixSelector />
          </div>
        );
      case "mix-complete":
        return <MixComplete />;
      case "share-player":
        return (
          <SharePlayer
            trackTitle="Hypnotic Groove"
            trackArtist="Underground Mix"
            version="B"
            duration={440}
            waveformData={generateWaveformData()}
            isOwner={true}
            onExport={() => console.log("Export clicked")}
            hasActiveDNA={true}
          />
        );
      case "session-share-player":
        return <SessionSharePlayer />;
      case "export-share-demo":
        return <ExportShareDemo />;
      // MVP Routes
      case "analytics-stats":
        return <AnalyticsStatsCombined />;
      case "dna-track-library":
        return <DNATracksLibrary />;
      case "royalty-revenue":
        return <RoyaltyRevenuePanel />;
      case "lyric-lab":
        return <LyricLab onNavigate={(view) => setCurrentView(view as ViewId)} />;
      case "lyric-library":
        return <LyricLibrary onNavigate={(view) => setCurrentView(view as ViewId)} />;
      // Legacy routes (kept for backward compatibility, not in sidebar)
      case "empty-states":
        return <EmptyStatesDemo />;
      case "stats":
        return <StatsPanel />;
      case "mixes":
        return (
          <div className="h-full w-full min-h-0 min-w-0 flex flex-col overflow-hidden">
            <MixesPanel />
          </div>
        );
      case "history":
        return <HistoryPanel />;
      case "analytics":
        return <AnalyticsPanel />;
      case "settings":
        return <SettingsPage />;
      case "help":
        return <HelpPanel />;
      case "profile":
        return <UserProfilePanel />;
      // Hidden features for future releases (commented out, not deleted)
      /*
      case "audio-upload":
        return <AudioUploadPanel onNavigate={(view) => setCurrentView(view as ViewId)} />;
      case "audio-analysis":
        return <AudioAnalysisPanel />;
      case "effects-rack":
        return <EffectsRackPanel />;
      case "timeline-editor":
        return <TimelineEditorPanel />;
      case "audio-export":
        return <AudioExportPanel />;
      case "audio-library":
        return <AudioLibraryPanel />;
      */
      // Hidden features for future releases (commented out, not deleted)
      /*
      case "activity-feed":
        return <ActivityFeed />;
      case "audio-upload":
        return <AudioUploadPanel onNavigate={(view) => setCurrentView(view as ViewId)} />;
      case "audio-analysis":
        return <AudioAnalysisPanel />;
      case "audio-export":
        return <AudioExportPanel />;
      case "effects-rack":
        return <EffectsRackPanel />;
      case "timeline-editor":
        return <TimelineEditorPanel />;
      case "live-streaming":
        return <LiveStreamingPanel />;
      case "beatgrid-editor":
        return (
          <BeatgridEditor
            trackId="demo-track"
            trackTitle="Demo Track"
            trackDuration={300}
            currentBPM={128}
          />
        );
      case "crossfade-editor":
        return <CrossfadeEditor />;
      case "frequency-analyzer":
        return <FrequencyAnalyzer />;
      case "mastering-suite":
        return <MasteringSuite />;
      case "midi-controller":
        return <MIDIControllerPanel />;
      case "vinyl-emulation":
        return <VinylEmulationPanel />;
      case "advanced-effects":
        return <AdvancedEffectsRack />;
      case "key-shifting":
        return <KeyShiftingPanel />;
      case "ab-testing":
        return <ABTestingPanel />;
      case "ai-voice-assistant":
        return <AIVoiceAssistant />;
      case "waveform-zoom":
        return <WaveformZoomAnalysis />;
      case "nft-blockchain":
        return <NFTBlockchainPanel />;
      case "white-label":
        return <WhiteLabelPanel />;
      case "harmonic-mixing":
        return <HarmonicMixingAssistant />;
      case "soundcloud":
        return <PlatformIntegrations platform="soundcloud" />;
      case "bandcamp":
        return <PlatformIntegrations platform="bandcamp" />;
      case "youtube-music":
        return <PlatformIntegrations platform="youtube-music" />;
      case "quantization":
        return <QuantizationPanel />;
      case "podcast-radio":
        return <PodcastRadioMode />;
      case "marketplace":
        return <MarketplacePanel />;
      case "ai-voice-separation":
        return <AIVoiceSeparation />;
      case "collaboration-analytics":
        return <CollaborationAnalytics />;
      case "api-documentation":
        return <APIDocumentationPanel />;
      */
      // Legal pages and utility routes (keep accessible)
      case "terms":
        return <LegalPages page="terms" />;
      case "privacy":
        return <LegalPages page="privacy" />;
      case "cookies":
        return <LegalPages page="cookies" />;
      case "dmca":
        return <LegalPages page="dmca" />;
      case "contact":
        return <LegalPages page="contact" />;
      case "feedback":
        return <BugFeedbackSystem />;
      default:
        return <LandingHero />;
    }
  };

  return (
    <AuthProvider>
      <div className="syntax-app-bg size-full flex relative overflow-hidden min-h-screen">
      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      
      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-50"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />


      {/* Sidebar */}
      <SidebarNav activeView={currentView} onNavigate={(view) => setCurrentView(view as ViewId)} />

      {/* Main Content */}
      <ErrorBoundary>
        <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative syntax-main-content" style={{ marginLeft: 0 }}>
          {/* Header: 56px, search center, right: bell + DJ User + Free Plan + avatar */}
          <header
            className="flex-shrink-0 flex items-center justify-between w-full px-6"
            style={{
              height: 56,
              background: '#1a1a1a',
              borderBottom: '1px solid #2a2a2a',
            }}
          >
            <div className="flex-1 flex justify-center">
              <div
                className="relative flex items-center"
                style={{
                  width: 400,
                  height: 40,
                  background: '#2a2a2a',
                  borderRadius: 20,
                  paddingLeft: 40,
                }}
              >
                <Search className="absolute left-3 w-5 h-5 flex-shrink-0" style={{ color: '#9e9e9e' }} />
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full h-full bg-transparent border-none outline-none text-sm pr-4"
                  style={{ color: '#ffffff' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <NotificationBell />
              <span className="text-sm font-medium" style={{ color: '#ffffff' }}>DJ User</span>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#2a2a2a', color: '#9e9e9e' }}>Free Plan</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs"
                style={{ background: '#ff5722', color: '#fff' }}
              >
                DJ
              </div>
            </div>
          </header>
          <div className="flex-1 min-h-0 min-w-0 w-full overflow-auto" style={{ paddingBottom: 100 }}>
            {renderView()}
          </div>
        </div>
      </ErrorBoundary>
      
      {/* Toast notifications */}
      <Toaster />

      {/* Keyboard Shortcuts Help Modal */}
      <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogContent className="bg-[var(--panel)] border-[var(--border)] text-[var(--text)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold mb-2">
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm mb-4">
              Press these shortcuts to quickly navigate and perform actions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/80 text-sm">Generate Track</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-white bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+G
              </kbd>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/80 text-sm">Save to Library</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-white bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+S
              </kbd>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/80 text-sm">Export Track</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-white bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+E
              </kbd>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/80 text-sm">Search Tracks</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-white bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+/
              </kbd>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/80 text-sm">Show Help</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-white bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+?
              </kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Onboarding Modal */}
      <OnboardingModal
        open={onboardingOpen}
        onClose={handleOnboardingClose}
        onLoadSampleData={handleLoadSampleData}
      />

      {/* Global Audio Player Bar */}
      <AudioPlayerBar />
      </div>
    </AuthProvider>
  );
}