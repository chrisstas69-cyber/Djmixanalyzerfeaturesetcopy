import { useState } from "react";
import { X, Download, Link2 } from "lucide-react";
import { toast } from "sonner";

type ExportFormat = "mp3" | "wav";
type LoudnessProfile = "club" | "streaming" | "premaster";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: {
    title: string;
    artist: string;
    hasVocals?: boolean;
  } | null;
  isSession?: boolean; // Session export has additional options
}

export function ExportModal({ open, onOpenChange, track, isSession = false }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("wav");
  const [exportStems, setExportStems] = useState(false);
  const [includeCueSheet, setIncludeCueSheet] = useState(true);
  const [includeBeatGrid, setIncludeBeatGrid] = useState(true);
  const [includeKeyInfo, setIncludeKeyInfo] = useState(true);
  const [loudnessProfile, setLoudnessProfile] = useState<LoudnessProfile>("club");
  const [exportState, setExportState] = useState<"setup" | "ready">("setup");
  
  // Session-specific state
  const [sessionExportMode, setSessionExportMode] = useState<"single" | "full">("single");
  const [selectedVersion, setSelectedVersion] = useState<"A" | "B" | "C">("A");
  
  if (!open || !track) return null;

  const handleExport = () => {
    // Simulate export process
    toast.loading("Preparing export...");
    
    setTimeout(() => {
      setExportState("ready");
      toast.success("Export ready!");
    }, 2000);
  };

  const handleDownload = () => {
    toast.success("Download started");
    // In production, trigger actual download
  };

  const handleCopyShareLink = () => {
    const shareUrl = `https://syntax.audio/track/${Math.random().toString(36).substring(7)}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard");
  };

  // Ready state (post-export)
  if (exportState === "ready") {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#18181b] border border-white/10 w-full max-w-lg">
          {/* Header */}
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Export Ready</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Your export is ready
              </h3>
              <p className="text-sm text-white/60">
                You can re-export with different settings anytime.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full bg-primary text-black py-3 font-['IBM_Plex_Mono'] text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Files
              </button>

              <button
                onClick={handleCopyShareLink}
                className="w-full bg-white/10 text-white py-2.5 font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                Copy Share Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Setup state
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#18181b] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#18181b] z-10">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isSession ? "Export Session" : "Export Track"}
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              {track.title} • {track.artist}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Session Export Mode (if session) */}
          {isSession && (
            <div className="border border-white/10 bg-black/40 p-4 space-y-3">
              <h3 className="text-sm font-medium text-white font-['IBM_Plex_Mono'] uppercase tracking-wider">
                Export Mode
              </h3>
              
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sessionMode"
                    checked={sessionExportMode === "single"}
                    onChange={() => setSessionExportMode("single")}
                    className="mt-0.5 w-4 h-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-white group-hover:text-primary transition-colors">
                      Single Version
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Export one version (A, B, or C)
                    </div>
                    {sessionExportMode === "single" && (
                      <div className="flex gap-2 mt-2">
                        {(["A", "B", "C"] as const).map((v) => (
                          <button
                            key={v}
                            onClick={() => setSelectedVersion(v)}
                            className={`px-3 py-1.5 text-xs font-['IBM_Plex_Mono'] border transition-colors ${
                              selectedVersion === v
                                ? "bg-primary text-black border-primary"
                                : "bg-black text-white/60 border-white/20 hover:border-white/40"
                            }`}
                          >
                            Version {v}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sessionMode"
                    checked={sessionExportMode === "full"}
                    onChange={() => setSessionExportMode("full")}
                    className="mt-0.5 w-4 h-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-white group-hover:text-primary transition-colors">
                      Full Session Package
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      All versions + stems + cue sheets + metadata
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* SECTION 1: Quick Export */}
          <div className="border border-white/10 bg-black/40 p-4 space-y-3">
            <h3 className="text-sm font-medium text-white font-['IBM_Plex_Mono'] uppercase tracking-wider">
              Quick Export
            </h3>
            
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="format"
                  checked={format === "mp3"}
                  onChange={() => setFormat("mp3")}
                  className="w-4 h-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="text-sm text-white group-hover:text-primary transition-colors">
                    MP3 (320 kbps)
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="format"
                  checked={format === "wav"}
                  onChange={() => setFormat("wav")}
                  className="w-4 h-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="text-sm text-white group-hover:text-primary transition-colors">
                    WAV (24-bit)
                  </div>
                </div>
              </label>
            </div>

            <p className="text-xs text-white/60 italic">
              Most DJs choose WAV.
            </p>
          </div>

          {/* SECTION 2: Stem Export */}
          <div className="border border-white/10 bg-black/40 p-4 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={exportStems}
                onChange={(e) => setExportStems(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-white font-['IBM_Plex_Mono'] uppercase tracking-wider group-hover:text-primary transition-colors">
                  Export Stems (WAV Multitrack)
                </div>
                <p className="text-xs text-white/60 mt-1">
                  Clean, tempo-aligned stems for remixing and live sets.
                </p>
              </div>
            </label>

            {exportStems && (
              <div className="pl-7 space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80">Drums</span>
                  <span className="text-white/40 font-['IBM_Plex_Mono']">WAV • 24-bit</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80">Bass</span>
                  <span className="text-white/40 font-['IBM_Plex_Mono']">WAV • 24-bit</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80">Music</span>
                  <span className="text-white/40 font-['IBM_Plex_Mono']">WAV • 24-bit</span>
                </div>
                {track.hasVocals && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80">Vocals</span>
                    <span className="text-white/40 font-['IBM_Plex_Mono']">WAV • 24-bit</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80">FX</span>
                  <span className="text-white/40 font-['IBM_Plex_Mono']">WAV • 24-bit</span>
                </div>
                <p className="text-[10px] text-white/50 pt-2 italic">
                  BPM-aligned • Bar-aligned
                </p>
              </div>
            )}
          </div>

          {/* SECTION 3: DJ Data */}
          <div className="border border-white/10 bg-black/40 p-4 space-y-3">
            <h3 className="text-sm font-medium text-white font-['IBM_Plex_Mono'] uppercase tracking-wider">
              DJ Data
            </h3>
            
            <p className="text-xs text-white/60">
              Built for DJ prep and harmonic mixing.
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeCueSheet}
                  onChange={(e) => setIncludeCueSheet(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <div className="text-sm text-white group-hover:text-primary transition-colors">
                  Cue Sheet (TXT + PDF)
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeBeatGrid}
                  onChange={(e) => setIncludeBeatGrid(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <div className="text-sm text-white group-hover:text-primary transition-colors">
                  Beat Grid Info
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeKeyInfo}
                  onChange={(e) => setIncludeKeyInfo(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <div className="text-sm text-white group-hover:text-primary transition-colors">
                  Key Info (Camelot)
                </div>
              </label>
            </div>
          </div>

          {/* SECTION 4: Loudness Profile */}
          <div className="border border-white/10 bg-black/40 p-4 space-y-3">
            <h3 className="text-sm font-medium text-white font-['IBM_Plex_Mono'] uppercase tracking-wider">
              Loudness Profile
            </h3>
            
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="loudness"
                  checked={loudnessProfile === "club"}
                  onChange={() => setLoudnessProfile("club")}
                  className="mt-0.5 w-4 h-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="text-sm text-white group-hover:text-primary transition-colors">
                    Club / DJ
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    Optimized for club systems and DJ sets
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="loudness"
                  checked={loudnessProfile === "streaming"}
                  onChange={() => setLoudnessProfile("streaming")}
                  className="mt-0.5 w-4 h-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="text-sm text-white group-hover:text-primary transition-colors">
                    Streaming Safe
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    Meets Spotify, Apple Music, and YouTube standards
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="loudness"
                  checked={loudnessProfile === "premaster"}
                  onChange={() => setLoudnessProfile("premaster")}
                  className="mt-0.5 w-4 h-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="text-sm text-white group-hover:text-primary transition-colors">
                    Pre-Master
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    Uncompressed with headroom for additional mastering
                  </div>
                </div>
              </label>
            </div>

            <p className="text-xs text-white/60 italic">
              You can re-export anytime.
            </p>
          </div>

          {/* Primary Action */}
          <button
            onClick={handleExport}
            className="w-full bg-primary text-black py-3.5 font-['IBM_Plex_Mono'] text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            Export Files
          </button>
        </div>
      </div>
    </div>
  );
}