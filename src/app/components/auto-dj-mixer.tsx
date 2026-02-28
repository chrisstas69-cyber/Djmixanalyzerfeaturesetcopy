import { useState, useEffect } from "react";
import { Disc3, Play, Pause, Square, Settings, Download, Volume2, Filter, Sliders, Activity, Check, AlertTriangle, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Progress } from "./ui/progress";
import { AddTracksToMixModal } from "./add-tracks-to-mix-modal";
import { AutoDJActiveMix } from "./auto-dj-active-mix";
import { MixCompletionModal } from "./mix-completion-modal";
import { ExportProgressToast } from "./export-progress-toast";

interface Track {
  id: number;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  energy: number;
}

const queueTracks: Track[] = [
  { id: 1, name: "Space Date", artist: "Adam Beyer", bpm: 129, key: "4A", energy: 7 },
  { id: 2, name: "Teach Me", artist: "Amelie Lens", bpm: 130, key: "5A", energy: 8 },
  { id: 3, name: "Patterns", artist: "ANNA", bpm: 131, key: "6A", energy: 9 },
  { id: 4, name: "Drumcode ID", artist: "Unknown", bpm: 132, key: "6A", energy: 10 },
  { id: 5, name: "Acid Thunder", artist: "Chris Liebing", bpm: 131, key: "5A", energy: 9 },
  { id: 6, name: "Terminal", artist: "Len Faki", bpm: 130, key: "8B", energy: 8 },
];

const timelineBlocks = [
  { name: "Space Date", duration: 7.5, energy: 7, color: "#a855f7" },
  { name: "Teach Me", duration: 7.5, energy: 8, color: "#c084fc" },
  { name: "Patterns", duration: 7.5, energy: 9, color: "#e879f9" },
  { name: "Drumcode ID", duration: 7.5, energy: 10, color: "#f0abfc" },
  { name: "Acid Thunder", duration: 7.5, energy: 9, color: "#e879f9" },
  { name: "Terminal", duration: 7.5, energy: 8, color: "#c084fc" },
];

export function AutoDJMixer() {
  // Start with empty state - no tracks in queue
  const [hasTracksInQueue, setHasTracksInQueue] = useState(false);
  const [showAddTracksModal, setShowAddTracksModal] = useState(false);
  const [showMixCompletionModal, setShowMixCompletionModal] = useState(false);

  const handleAddTracks = (trackIds: number[]) => {
    console.log("Added tracks:", trackIds);
    setHasTracksInQueue(true);
  };

  // Empty State - Onboarding
  if (!hasTracksInQueue) {
    return (
      <>
        <div className="h-full flex items-center justify-center bg-background">
          <div className="text-center max-w-lg px-6">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-sm bg-card border-2 border-border/30 flex items-center justify-center">
              <Disc3 className="w-12 h-12 text-primary/60" />
            </div>

            {/* Headline */}
            <h1 className="text-2xl font-semibold mb-3 tracking-tight text-white">
              Build a Mix Automatically
            </h1>

            {/* Subtext */}
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Add tracks from your library, generated tracks, or DNA reference tracks.
            </p>

            {/* Primary Button */}
            <Button
              size="lg"
              className="font-['IBM_Plex_Mono'] text-sm mb-6"
              onClick={() => setShowAddTracksModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tracks to Mix
            </Button>

            {/* Secondary Text */}
            <p className="text-xs text-muted-foreground/70 font-['IBM_Plex_Mono']">
              Auto DJ uses your active DNA to mix intelligently.
            </p>
          </div>
        </div>

        {/* Add Tracks Modal */}
        <AddTracksToMixModal
          isOpen={showAddTracksModal}
          onClose={() => setShowAddTracksModal(false)}
          onAddTracks={handleAddTracks}
        />
      </>
    );
  }

  // Active State - Full Mixer Interface
  return (
    <>
      <AutoDJActiveMix />

      {/* Mix Completion Modal */}
      <MixCompletionModal
        isOpen={showMixCompletionModal}
        onClose={() => setShowMixCompletionModal(false)}
        onSaveMix={(options) => {
          console.log("Export options:", options);
        }}
      />
    </>
  );
}