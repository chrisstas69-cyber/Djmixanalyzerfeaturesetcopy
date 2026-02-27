import { useState, useEffect } from "react";
import { Play, Pause, Square, Volume2, Info, Download } from "lucide-react";
import { Button } from "./ui/button";
import { MixCompletionModal } from "./mix-completion-modal";
import { ExportProgressToast } from "./export-progress-toast";
import { RekordboxWaveform } from "./rekordbox-waveform";

interface Track {
  id: number;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  waveformData: number[];
}

interface MixCrateTrack extends Track {
  status: "NOW" | "NEXT" | "QUEUED";
}

// Mock mix crate data
const MOCK_MIX_CRATE: MixCrateTrack[] = [
  {
    id: 1,
    title: "Space Date",
    artist: "Adam Beyer",
    bpm: 129,
    key: "4A",
    duration: "6:45",
    status: "NOW",
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 2,
    title: "Teach Me",
    artist: "Amelie Lens",
    bpm: 130,
    key: "5A",
    duration: "7:12",
    status: "NEXT",
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 3,
    title: "Patterns",
    artist: "ANNA",
    bpm: 131,
    key: "6A",
    duration: "6:58",
    status: "QUEUED",
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 4,
    title: "Acid Thunder",
    artist: "Chris Liebing",
    bpm: 131,
    key: "5A",
    duration: "7:24",
    status: "QUEUED",
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 5,
    title: "Terminal",
    artist: "Len Faki",
    bpm: 130,
    key: "8B",
    duration: "6:33",
    status: "QUEUED",
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.2),
  },
];

// Dual Waveform Display Component
function DualWaveformDisplay({ deckA, deckB, progress }: { deckA: Track; deckB: Track; progress: number }) {
  return (
    <div className="flex-1 bg-black border border-border/50 p-6">
      {/* Deck A Waveform */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span className="text-xs font-['IBM_Plex_Mono'] text-cyan-400">DECK A</span>
          </div>
          <div className="text-xs font-['IBM_Plex_Mono'] text-white/70">
            {deckA.title} — {deckA.artist}
          </div>
        </div>
        <RekordboxWaveform
          waveformData={deckA.waveformData}
          color="cyan"
          playheadPosition={progress}
          showPlayhead={true}
          height={80}
        />
      </div>

      {/* Deck B Waveform */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-xs font-['IBM_Plex_Mono'] text-primary">DECK B</span>
          </div>
          <div className="text-xs font-['IBM_Plex_Mono'] text-white/70">
            {deckB.title} — {deckB.artist}
          </div>
        </div>
        <RekordboxWaveform
          waveformData={deckB.waveformData}
          color="orange"
          playheadPosition={progress * 0.3}
          showPlayhead={true}
          height={80}
        />
      </div>
    </div>
  );
}

// Mix Crate Sidebar
function MixCrateSidebar({ tracks }: { tracks: MixCrateTrack[] }) {
  return (
    <div className="w-80 bg-black border-l border-border/50 flex flex-col">
      <div className="px-4 py-3 border-b border-border/50">
        <h3 className="text-sm uppercase tracking-tight text-muted-foreground font-['IBM_Plex_Mono']">
          Mix Crate
        </h3>
      </div>
      <div className="flex-1 overflow-auto">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`px-4 py-2.5 border-b border-border/30 transition-colors duration-200 ${
              track.status === "NOW" ? "bg-primary/10" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex-1">
                <div className="text-sm text-white mb-0.5 tracking-tight leading-tight">
                  {track.title}
                </div>
                <div className="text-xs text-white/50 font-['IBM_Plex_Mono'] tracking-tight">
                  {track.artist}
                </div>
              </div>
              <div>
                {track.status === "NOW" && (
                  <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-['IBM_Plex_Mono'] rounded-sm tracking-tight">
                    NOW
                  </span>
                )}
                {track.status === "NEXT" && (
                  <span className="inline-block px-2 py-0.5 bg-white/10 text-white/70 text-[10px] font-['IBM_Plex_Mono'] rounded-sm tracking-tight">
                    NEXT
                  </span>
                )}
                {track.status === "QUEUED" && (
                  <span className="inline-block px-2 py-0.5 bg-transparent text-white/30 text-[10px] font-['IBM_Plex_Mono'] rounded-sm tracking-tight">
                    QUEUED
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-['IBM_Plex_Mono'] text-white/40 tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <span>{track.bpm}</span>
              <span>·</span>
              <span>{track.key}</span>
              <span>·</span>
              <span>{track.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Locked Controls Section
function LockedControlsSection({ crossfaderPosition }: { crossfaderPosition: number }) {
  return (
    <div className="bg-card/30 border-t border-border/50 p-4">
      <div className="flex items-center gap-8 max-w-4xl mx-auto">
        {/* Deck A Volume */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground">DECK A</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-500/50" />
            <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500/40 w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Crossfader */}
        <div className="flex-1">
          <div className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground text-center mb-2">
            CROSSFADER
          </div>
          <div className="relative h-2 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500/40 to-orange-500/40"
              style={{ width: `${crossfaderPosition}%` }}
            ></div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-primary/50 rounded-full shadow-lg"
              style={{ 
                left: `calc(${crossfaderPosition}% - 8px)`,
                transition: 'left 800ms cubic-bezier(0.4, 0, 0.2, 1)' // Slow, deliberate crossfade
              }}
            ></div>
          </div>
        </div>

        {/* Deck B Volume */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground">DECK B</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-orange-500/50" />
            <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500/40 w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AutoDJActiveMix() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(35);
  const [crossfaderPosition, setCrossfaderPosition] = useState(65);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.1; // Slower, steadier progression
      });
      
      // Slow, deliberate crossfader movement
      setCrossfaderPosition((prev) => {
        if (prev >= 95) return 5;
        return prev + 0.02; // Much slower, professional crossfade
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentTrack = MOCK_MIX_CRATE.find(t => t.status === "NOW")!;
  const nextTrack = MOCK_MIX_CRATE.find(t => t.status === "NEXT")!;

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Top Banner */}
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-['IBM_Plex_Mono'] text-white/90">
              Mix in progress
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card/50 rounded-sm border border-border/30 cursor-pointer transition-all duration-200 ease-in-out hover:border-primary/50 group">
            <Info className="w-3.5 h-3.5 text-muted-foreground transition-colors duration-200 ease-in-out group-hover:text-primary" />
            <span className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground transition-colors duration-200 ease-in-out group-hover:text-primary">
              DNA: Basement Techno Core
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Waveforms and Controls */}
          <div className="flex-1 flex flex-col">
            {/* Dual Waveforms */}
            <DualWaveformDisplay deckA={currentTrack} deckB={nextTrack} progress={progress} />

            {/* Locked Controls */}
            <LockedControlsSection crossfaderPosition={crossfaderPosition} />

            {/* Transport Controls */}
            <div className="bg-card/30 border-t border-border/50 px-6 py-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant={isPlaying ? "outline" : "default"}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="font-['IBM_Plex_Mono'] text-xs"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 mr-1.5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      Play
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="font-['IBM_Plex_Mono'] text-xs"
                >
                  <Square className="w-3.5 h-3.5 mr-1.5" />
                  Stop
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="font-['IBM_Plex_Mono'] text-xs"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Mix Crate Sidebar */}
          <MixCrateSidebar tracks={MOCK_MIX_CRATE} />
        </div>
      </div>

      {/* Export Modal */}
      <MixCompletionModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onSaveMix={(options) => {
          console.log("Export options:", options);
        }}
        onExport={() => {
          setShowExportToast(true);
        }}
      />

      {/* Export Progress Toast */}
      <ExportProgressToast
        isVisible={showExportToast}
        onDismiss={() => setShowExportToast(false)}
      />
    </>
  );
}