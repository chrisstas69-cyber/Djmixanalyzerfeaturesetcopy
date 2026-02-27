import { CheckCircle2, Download } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface MixCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMix: (options: SaveOptions) => void;
  onExport?: () => void;
}

interface SaveOptions {
  exportType: "single" | "mix" | "session";
  formats: {
    wav24: boolean;
    wav16: boolean;
    mp3: boolean;
  };
  metadata: {
    bpm: boolean;
    key: boolean;
    beatGrid: boolean;
    hotCues: boolean;
  };
  stems: {
    enabled: boolean;
    drums: boolean;
    bass: boolean;
    music: boolean;
    vocals: boolean;
  };
  fileName: string;
}

// Hot Cue colors matching standard DJ software
const HOT_CUES = [
  { letter: "A", label: "Intro", color: "bg-red-500" },
  { letter: "B", label: "Mix In", color: "bg-blue-500" },
  { letter: "C", label: "Drop", color: "bg-green-500" },
  { letter: "D", label: "Breakdown", color: "bg-yellow-500" },
  { letter: "E", label: "Outro", color: "bg-purple-500" },
];

export function MixCompletionModal({ isOpen, onClose, onSaveMix, onExport }: MixCompletionModalProps) {
  const [exportType, setExportType] = useState<"single" | "mix" | "session">("mix");
  const [wav24, setWav24] = useState(true);
  const [wav16, setWav16] = useState(false);
  const [mp3, setMp3] = useState(false);
  const [includeBpm, setIncludeBpm] = useState(true);
  const [includeKey, setIncludeKey] = useState(true);
  const [includeBeatGrid, setIncludeBeatGrid] = useState(true);
  const [includeHotCues, setIncludeHotCues] = useState(true);
  
  const [exportStems, setExportStems] = useState(false);
  const [stemDrums, setStemDrums] = useState(true);
  const [stemBass, setStemBass] = useState(true);
  const [stemMusic, setStemMusic] = useState(true);
  const [stemVocals, setStemVocals] = useState(true);
  
  const [fileName, setFileName] = useState("{Artist} – {Track Name} – {Version}");

  if (!isOpen) return null;

  // Calculate estimated file size
  const calculateEstimatedSize = () => {
    let sizeMB = 0;
    if (wav24) sizeMB += 180;
    if (wav16) sizeMB += 90;
    if (mp3) sizeMB += 12;
    if (exportStems) {
      const stemCount = [stemDrums, stemBass, stemMusic, stemVocals].filter(Boolean).length;
      sizeMB += stemCount * 45;
    }
    return sizeMB;
  };

  // Generate file name preview
  const generatePreview = () => {
    return fileName
      .replace("{Artist}", "Amelie Lens")
      .replace("{Track Name}", "Teach Me")
      .replace("{Version}", "A")
      .replace("{BPM}", "130")
      .replace("{Key}", "5A");
  };

  const handleExport = () => {
    onSaveMix({
      exportType,
      formats: {
        wav24,
        wav16,
        mp3,
      },
      metadata: {
        bpm: includeBpm,
        key: includeKey,
        beatGrid: includeBeatGrid,
        hotCues: includeHotCues,
      },
      stems: {
        enabled: exportStems,
        drums: stemDrums,
        bass: stemBass,
        music: stemMusic,
        vocals: stemVocals,
      },
      fileName,
    });
    onExport?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-background border border-border w-full max-w-[680px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Export</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-6 space-y-8 overflow-auto flex-1">
          {/* Section 1: Export Type */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              Export Type
            </h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="exportType"
                  checked={exportType === "single"}
                  onChange={() => setExportType("single")}
                  className="w-4 h-4 mt-0.5 cursor-pointer accent-primary"
                />
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    Single Track
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="exportType"
                  checked={exportType === "mix"}
                  onChange={() => setExportType("mix")}
                  className="w-4 h-4 mt-0.5 cursor-pointer accent-primary"
                />
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    Full Mix (Rendered Audio)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="exportType"
                  checked={exportType === "session"}
                  onChange={() => setExportType("session")}
                  className="w-4 h-4 mt-0.5 cursor-pointer accent-primary"
                />
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    Replayable Session
                  </div>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-['IBM_Plex_Mono']">
              Sessions preserve all transitions and can be replayed later.
            </p>
          </div>

          {/* Section 2: Audio Format */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              Audio Format
            </h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={wav24}
                  onChange={(e) => setWav24(e.target.checked)}
                  className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                />
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    WAV (24-bit, 44.1kHz)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={wav16}
                  onChange={(e) => setWav16(e.target.checked)}
                  className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                />
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    WAV (16-bit)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={mp3}
                  onChange={(e) => setMp3(e.target.checked)}
                  className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                />
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    MP3 (320kbps)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: DJ Metadata */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              DJ Metadata
            </h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeBpm}
                  onChange={(e) => setIncludeBpm(e.target.checked)}
                  className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                />
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    Include BPM
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeKey}
                  onChange={(e) => setIncludeKey(e.target.checked)}
                  className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                />
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    Include Key (Camelot + Musical)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeBeatGrid}
                  onChange={(e) => setIncludeBeatGrid(e.target.checked)}
                  className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                />
                <div>
                  <div className={`text-sm font-medium group-hover:text-primary transition-colors ${
                    !includeBeatGrid ? "opacity-50" : ""
                  }`}>
                    Include Beat Grid
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeHotCues}
                  onChange={(e) => setIncludeHotCues(e.target.checked)}
                  disabled={!includeBeatGrid}
                  className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div>
                  <div className={`text-sm font-medium group-hover:text-primary transition-colors ${
                    !includeBeatGrid ? "opacity-50" : ""
                  }`}>
                    Include Hot Cues
                  </div>
                </div>
              </label>
            </div>

            {/* Hot Cue Mapping (View-Only) */}
            {includeHotCues && includeBeatGrid && (
              <div className="mt-4 p-4 bg-muted/20 border border-border/30 rounded-sm">
                <div className="text-xs font-['IBM_Plex_Mono'] text-muted-foreground mb-3 uppercase tracking-wider">
                  Hot Cue Mapping
                </div>
                <div className="space-y-2">
                  {HOT_CUES.map((cue) => (
                    <div key={cue.letter} className="flex items-center gap-3">
                      <div className={`w-6 h-6 ${cue.color} rounded-sm flex items-center justify-center text-white text-xs font-bold`}>
                        {cue.letter}
                      </div>
                      <span className="text-sm text-white/70 font-['IBM_Plex_Mono']">
                        {cue.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-3 font-['IBM_Plex_Mono']">
              Compatible with Rekordbox and CDJ workflows.
            </p>
          </div>

          {/* Section 4: Stem Export */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              Stem Export
            </h3>
            <label className="flex items-start gap-3 cursor-pointer group mb-4">
              <input
                type="checkbox"
                checked={exportStems}
                onChange={(e) => setExportStems(e.target.checked)}
                className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
              />
              <div>
                <div className="text-sm font-medium group-hover:text-primary transition-colors">
                  Export Stems (WAV)
                </div>
              </div>
            </label>

            {exportStems && (
              <div className="ml-7 space-y-3 pb-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={stemDrums}
                    onChange={(e) => setStemDrums(e.target.checked)}
                    className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                  />
                  <div className="text-sm text-white/80">Drums</div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={stemBass}
                    onChange={(e) => setStemBass(e.target.checked)}
                    className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                  />
                  <div className="text-sm text-white/80">Bass</div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={stemMusic}
                    onChange={(e) => setStemMusic(e.target.checked)}
                    className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                  />
                  <div className="text-sm text-white/80">Music</div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={stemVocals}
                    onChange={(e) => setStemVocals(e.target.checked)}
                    className="w-4 h-4 mt-0.5 bg-transparent border border-border cursor-pointer accent-primary"
                  />
                  <div className="text-sm text-white/80">Vocals / FX</div>
                </label>
              </div>
            )}

            {exportStems && (
              <p className="text-xs text-muted-foreground font-['IBM_Plex_Mono']">
                Stems are remix-ready and DJ-safe.
              </p>
            )}
          </div>

          {/* Section 5: File Naming */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              File Naming
            </h3>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 bg-card/30 border border-border rounded-sm text-sm font-['IBM_Plex_Mono'] text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="{Artist} – {Track Name} – {Version}"
            />
            <div className="mt-2 text-xs text-muted-foreground font-['IBM_Plex_Mono']">
              Available tokens: {"{Artist}"}, {"{Track Name}"}, {"{Version}"}, {"{BPM}"}, {"{Key}"}
            </div>
            <div className="mt-3 p-3 bg-muted/10 border border-border/30 rounded-sm">
              <div className="text-xs text-muted-foreground font-['IBM_Plex_Mono'] mb-1">
                Preview:
              </div>
              <div className="text-sm text-white/90 font-['IBM_Plex_Mono']">
                {generatePreview()}.wav
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-muted-foreground font-['IBM_Plex_Mono']">
            Estimated size: ~{calculateEstimatedSize()} MB
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="font-['IBM_Plex_Mono'] text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="font-['IBM_Plex_Mono'] text-sm"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}