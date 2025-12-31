import { useState } from "react";
import { Plus, Upload, Download, Lock, Copy, Archive, Database, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { UploadReferenceTracksModal } from "./upload-reference-tracks-modal";
import { ReferenceTracksTable } from "./reference-tracks-table";

type ViewState = "empty" | "tracks" | "dna-profiles";

interface DNAObject {
  id: string;
  name: string;
  source: "TRACK" | "MIX" | "SESSION";
  bpmRange: string;
  keyRange: string;
  energyRange: string;
  status: "ACTIVE" | "READY" | "ARCHIVED";
  createdFrom: string;
  lastUpdated: string;
  artifactCount: number;
  mixCount: number;
  confidenceScore: number;
  locked: boolean;
  usageRenders: number;
  usageLiveMixes: number;
  
  // Profile data
  preferredBpm: number;
  stability: string;
  dominantKeys: string[];
  compatibleDrift: string;
  conflictRisk: string;
  curveType: string;
  avgEnergy: number;
  peakEnergy: number;
  transitions: string[];
  riskTolerance: string;
}

export function DNALibrary() {
  const [showUploadReferenceTracksModal, setShowUploadReferenceTracksModal] = useState(false);
  
  // Start with tracks view to show Reference Tracks table
  const [viewState, setViewState] = useState<ViewState>("tracks");
  
  // Mock DNA objects - will be populated only after successful upload + analysis
  const [dnaObjects, setDnaObjects] = useState<DNAObject[]>([
    {
      id: "dna-1",
      name: "Berlin Warehouse DNA",
      source: "TRACK",
      bpmRange: "126-130",
      keyRange: "Am, Fm, Gm",
      energyRange: "7.2-8.5",
      status: "ACTIVE",
      createdFrom: "32 reference tracks",
      lastUpdated: "2024-01-15",
      artifactCount: 32,
      mixCount: 12,
      confidenceScore: 0.89,
      locked: false,
      usageRenders: 45,
      usageLiveMixes: 8,
      preferredBpm: 128,
      stability: "Tight (±2 BPM)",
      dominantKeys: ["Am", "Fm", "Gm", "Em"],
      compatibleDrift: "±3 semitones",
      conflictRisk: "Low",
      curveType: "Progressive build",
      avgEnergy: 7.8,
      peakEnergy: 8.9,
      transitions: ["Long blend (32 bars)", "EQ-driven cuts", "Bass swap transitions"],
      riskTolerance: "Conservative",
    },
    {
      id: "dna-2",
      name: "Deep House Sessions",
      source: "TRACK",
      bpmRange: "122-125",
      keyRange: "Dm, Am, Cm",
      energyRange: "5.5-7.0",
      status: "READY",
      createdFrom: "28 reference tracks",
      lastUpdated: "2024-01-10",
      artifactCount: 28,
      mixCount: 8,
      confidenceScore: 0.82,
      locked: false,
      usageRenders: 23,
      usageLiveMixes: 4,
      preferredBpm: 123,
      stability: "Moderate (±3 BPM)",
      dominantKeys: ["Dm", "Am", "Cm", "Gm"],
      compatibleDrift: "±4 semitones",
      conflictRisk: "Medium",
      curveType: "Wave pattern",
      avgEnergy: 6.2,
      peakEnergy: 7.5,
      transitions: ["Smooth fade (16 bars)", "Filter sweeps", "Atmospheric layering"],
      riskTolerance: "Moderate",
    },
  ]);
  
  const [selectedDNA, setSelectedDNA] = useState<DNAObject | null>(dnaObjects[0]);

  const handleAnalyzeTracks = (files: File[]) => {
    console.log("Analyzing tracks:", files);
    // TODO: Implement actual DNA building logic
    setViewState("dna-profiles");
  };

  // Empty State
  if (viewState === "empty") {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Empty Content - Centered */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-lg">
            <h2 className="text-2xl font-['Roboto_Condensed'] tracking-tight text-white mb-3" style={{ fontWeight: 600 }}>
              Build Your Sound DNA
            </h2>
            <p className="text-sm text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
              Upload tracks you love. We'll analyze them to learn your musical preferences.
            </p>
            <Button
              variant="default"
              className="font-['IBM_Plex_Mono'] text-xs h-10 px-6"
              onClick={() => setShowUploadReferenceTracksModal(true)}
            >
              Upload Reference Tracks
            </Button>
            <p className="text-xs text-muted-foreground font-['IBM_Plex_Mono'] mt-4">
              MP3 or WAV • Up to 100 tracks
            </p>
          </div>
        </div>

        {/* Upload Reference Tracks Modal */}
        {showUploadReferenceTracksModal && (
          <UploadReferenceTracksModal
            onClose={() => setShowUploadReferenceTracksModal(false)}
            onAnalyze={(filesWithStatus) => {
              console.log("Analyzing reference tracks:", filesWithStatus);
              // TODO: Implement actual DNA creation logic
              setViewState("active");
            }}
          />
        )}
      </div>
    );
  }

  // Active State - Full Library (Reference Tracks View)
  if (viewState === "tracks") {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-[#0a0a0f]">
        {/* Reference Tracks Table */}
        <ReferenceTracksTable 
          onAddTracks={() => setShowUploadReferenceTracksModal(true)}
        />

        {/* Upload Reference Tracks Modal */}
        {showUploadReferenceTracksModal && (
          <UploadReferenceTracksModal
            onClose={() => setShowUploadReferenceTracksModal(false)}
            onAnalyze={(filesWithStatus) => {
              console.log("Analyzing reference tracks:", filesWithStatus);
              // TODO: Implement actual DNA creation logic
            }}
          />
        )}
      </div>
    );
  }

  // DNA Profiles View - Split Layout
  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Top Navigation */}
      <div className="border-b border-border px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewState("dna-profiles")}
            className={`px-4 py-2 text-xs font-['IBM_Plex_Mono'] transition-colors ${
              viewState === "dna-profiles"
                ? "text-white border-b-2 border-primary"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            DNA Profiles
          </button>
          <button
            onClick={() => setViewState("tracks")}
            className={`px-4 py-2 text-xs font-['IBM_Plex_Mono'] transition-colors ${
              viewState === "tracks"
                ? "text-white border-b-2 border-primary"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Reference Tracks
          </button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - DNA List */}
        <div className="w-80 border-r border-border flex flex-col bg-black">
          {/* DNA List Header */}
          <div className="px-4 py-3 border-b border-border flex-shrink-0">
            <p className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
              DNA Profiles
            </p>
          </div>

          {/* DNA List */}
          <div className="flex-1 overflow-auto">
            {dnaObjects.map((dna) => (
              <button
                key={dna.id}
                onClick={() => setSelectedDNA(dna)}
                className={`w-full px-4 py-3.5 border-b border-border text-left transition-colors ${
                  selectedDNA?.id === dna.id
                    ? "bg-primary/10 border-l-2 border-l-primary"
                    : "hover:bg-muted/20"
                }`}
              >
                {/* DNA Name */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-white pr-2 leading-tight">
                    {dna.name}
                  </h3>
                  {dna.status === "ACTIVE" && (
                    <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[9px] font-['IBM_Plex_Mono'] font-medium tracking-wider rounded-sm flex-shrink-0">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Track Count */}
                <p className="text-xs text-muted-foreground mb-1.5">
                  {dna.artifactCount} reference tracks
                </p>

                {/* Confidence */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${dna.confidenceScore * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-['IBM_Plex_Mono'] text-primary">
                    {(dna.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Add DNA Button */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full font-['IBM_Plex_Mono'] text-xs"
              onClick={() => setShowUploadReferenceTracksModal(true)}
            >
              <Plus className="w-3 h-3 mr-1.5" />
              Create DNA
            </Button>
          </div>
        </div>

        {/* MAIN PANEL - DNA Details */}
        {selectedDNA && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* DNA Header with Actions */}
            <div className="px-6 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-white mb-1">
                    {selectedDNA.name}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Learned from {selectedDNA.artifactCount} reference tracks
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant={selectedDNA.status === "ACTIVE" ? "outline" : "default"}
                    size="sm"
                    className="font-['IBM_Plex_Mono'] text-xs"
                    disabled={selectedDNA.status === "ACTIVE"}
                  >
                    <Activity className="w-3 h-3 mr-1.5" />
                    {selectedDNA.status === "ACTIVE" ? "Active" : "Activate DNA"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-['IBM_Plex_Mono'] text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1.5" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-['IBM_Plex_Mono'] text-xs"
                  >
                    <Archive className="w-3 h-3 mr-1.5" />
                    Archive
                  </Button>
                </div>
              </div>
            </div>

            {/* DNA Summary Cards */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 gap-4 max-w-5xl">
                {/* Tempo Range Card */}
                <div className="bg-card/30 border border-border/50 rounded-sm p-4">
                  <h3 className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider mb-3">
                    Tempo Range
                  </h3>
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Range</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white">
                        {selectedDNA.bpmRange} BPM
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Preferred</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white">
                        {selectedDNA.preferredBpm} BPM
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Stability</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white/80">
                        {selectedDNA.stability}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Preferences Card */}
                <div className="bg-card/30 border border-border/50 rounded-sm p-4">
                  <h3 className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider mb-3">
                    Key Preferences
                  </h3>
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Dominant Keys</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white">
                        {selectedDNA.dominantKeys.join(" · ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Compatible Drift</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white/80">
                        {selectedDNA.compatibleDrift}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Conflict Risk</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white/80">
                        {selectedDNA.conflictRisk}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Energy Profile Card */}
                <div className="bg-card/30 border border-border/50 rounded-sm p-4">
                  <h3 className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider mb-3">
                    Energy Profile
                  </h3>
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Average Energy</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white">
                        {selectedDNA.avgEnergy.toFixed(1)} / 10
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Peak Energy</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white">
                        {selectedDNA.peakEnergy.toFixed(1)} / 10
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Curve Type</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white/80">
                        {selectedDNA.curveType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Structure Tendencies Card */}
                <div className="bg-card/30 border border-border/50 rounded-sm p-4">
                  <h3 className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider mb-3">
                    Structure Tendencies
                  </h3>
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-1">Preferred Transitions</p>
                      <div className="space-y-1">
                        {selectedDNA.transitions.map((transition, idx) => (
                          <p key={idx} className="text-xs font-['IBM_Plex_Mono'] text-white/80">
                            • {transition}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/80 mb-0.5">Risk Tolerance</p>
                      <p className="text-sm font-['IBM_Plex_Mono'] text-white/80">
                        {selectedDNA.riskTolerance}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Reference Tracks Modal */}
      {showUploadReferenceTracksModal && (
        <UploadReferenceTracksModal
          onClose={() => setShowUploadReferenceTracksModal(false)}
          onAnalyze={(filesWithStatus) => {
            console.log("Analyzing reference tracks:", filesWithStatus);
            // TODO: Implement actual DNA creation logic
          }}
        />
      )}
    </div>
  );
}