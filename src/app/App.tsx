import { useState } from "react";
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
import { Toaster } from "./components/ui/sonner";

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
  | "empty-states";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewId>("landing-hero");

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
      <SidebarNav activeView={currentView} onNavigate={setCurrentView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}