import React, { useState, useEffect } from "react";
import { SidebarNav } from "./components/sidebar-nav";
import { LandingHero } from "./components/landing-hero";
import { CreateTrackModern } from "./components/create-track-modern";
import { TrackLibraryDJ } from "./components/track-library-dj";
import { DNAUnified } from "./components/dna-unified";
import { AnalysisScreen } from "./components/analysis-screen";
import { DJMixAnalyzer } from "./components/dj-mix-analyzer";
import { AutoDJMixerProV3 } from "./components/auto-dj-mixer-pro-v3";
import { AutoDJMixSelector } from "./components/auto-dj-mix-selector";
import { MixComplete } from "./components/mix-complete";
import { SharePlayer, generateWaveformData } from "./components/share-player";
import { SessionSharePlayer } from "./components/session-share-player";
import { ExportShareDemo } from "./components/export-share-demo";
import { EmptyStatesDemo } from "./components/empty-states";
import { StatsPanel } from "./components/stats-panel";
import { MixesPanel } from "./components/mixes-panel";
import { HistoryPanel } from "./components/history-panel";
import { AnalyticsPanel } from "./components/analytics-panel";
import { SettingsPanel } from "./components/settings-panel";
import { Toaster } from "./components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { X } from "lucide-react";

export type ViewId =
  | "landing-hero"
  | "create-track-modern"
  | "library"
  | "library-full"
  | "library-pro"
  | "dna"
  | "analysis"
  | "dj-analyzer"
  | "auto-dj-mixer-pro-v3"
  | "auto-dj-mix-selector"
  | "mix-complete"
  | "share-player"
  | "session-share-player"
  | "export-share-demo"
  | "mixer"
  | "stats"
  | "mixes"
  | "history"
  | "analytics"
  | "settings"
  | "empty-states";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewId>("landing-hero");
  const [helpModalOpen, setHelpModalOpen] = useState(false);

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

  const renderView = () => {
    switch (currentView) {
      case "landing-hero":
        return <LandingHero />;
      case "create-track-modern":
        return <CreateTrackModern />;
      case "library":
      case "library-full":
      case "library-pro":
        return <TrackLibraryDJ />;
      case "dna":
        return <DNAUnified />;
      case "analysis":
        return <AnalysisScreen />;
      case "dj-analyzer":
        return <DJMixAnalyzer />;
      case "auto-dj-mixer-pro-v3":
        return <AutoDJMixerProV3 />;
      case "auto-dj-mix-selector":
        return <AutoDJMixSelector />;
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
      case "empty-states":
        return <EmptyStatesDemo />;
      case "mixer":
        return <AutoDJMixerProV3 />;
      case "stats":
        return <StatsPanel />;
      case "mixes":
        return <MixesPanel />;
      case "history":
        return <HistoryPanel />;
      case "analytics":
        return <AnalyticsPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <LandingHero />;
    }
  };

  return (
    <div className="size-full flex bg-background text-foreground relative overflow-hidden">
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

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(10,10,15,0.4) 100%)",
        }}
      />

      {/* Sidebar */}
      <SidebarNav activeView={currentView} onNavigate={(view) => setCurrentView(view as ViewId)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </div>
      
      {/* Toast notifications */}
      <Toaster />

      {/* Keyboard Shortcuts Help Modal */}
      <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-md">
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
    </div>
  );
}