import { useState } from "react";
import { X } from "lucide-react";

interface ExportTrackModalProps {
  trackTitle: string;
  trackArtist: string;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  hasActiveDNA?: boolean;
}

export interface ExportOptions {
  formats: {
    mp3: boolean;
    wav: boolean;
    stems: boolean;
  };
  metadata: {
    rekordboxCues: boolean;
    bpmKeyGrid: boolean;
    beatGrid: boolean;
  };
  fileNaming: string;
}

export function ExportTrackModal({ trackTitle, trackArtist, onClose, onExport, hasActiveDNA }: ExportTrackModalProps) {
  const [formats, setFormats] = useState({
    mp3: false,
    wav: false,
    stems: false,
  });

  const [metadata, setMetadata] = useState({
    rekordboxCues: false,
    bpmKeyGrid: false,
    beatGrid: false,
  });

  const [fileNaming, setFileNaming] = useState(`{Artist} – {Track Name} – {Version}`);

  const handleExport = () => {
    onExport({ formats, metadata, fileNaming });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#0A0A0A] border border-border w-[640px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-white tracking-tight">Export Track</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-8">
          {/* Section 1 - Audio Format */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-['IBM_Plex_Mono'] font-medium mb-3">
              Audio Format
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formats.mp3}
                  onChange={(e) => setFormats({ ...formats, mp3: e.target.checked })}
                  className="w-4 h-4 bg-muted border border-border checked:bg-primary checked:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  MP3 (320kbps)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formats.wav}
                  onChange={(e) => setFormats({ ...formats, wav: e.target.checked })}
                  className="w-4 h-4 bg-muted border border-border checked:bg-primary checked:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  WAV (24-bit)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formats.stems}
                  onChange={(e) => setFormats({ ...formats, stems: e.target.checked })}
                  className="w-4 h-4 bg-muted border border-border checked:bg-primary checked:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  STEMS (Drums / Bass / Music / Vocals)
                </span>
              </label>
            </div>
          </div>

          {/* Section 2 - DJ Metadata */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-['IBM_Plex_Mono'] font-medium mb-3">
              DJ Metadata
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={metadata.rekordboxCues}
                  onChange={(e) => setMetadata({ ...metadata, rekordboxCues: e.target.checked })}
                  className="w-4 h-4 bg-muted border border-border checked:bg-primary checked:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  Include Rekordbox Cue Points
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={metadata.bpmKeyGrid}
                  onChange={(e) => setMetadata({ ...metadata, bpmKeyGrid: e.target.checked })}
                  className="w-4 h-4 bg-muted border border-border checked:bg-primary checked:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  Include BPM / Key / Grid
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={metadata.beatGrid}
                  onChange={(e) => setMetadata({ ...metadata, beatGrid: e.target.checked })}
                  className="w-4 h-4 bg-muted border border-border checked:bg-primary checked:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  Include Beat Grid
                </span>
              </label>
            </div>
          </div>

          {/* Section 3 - File Naming */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-['IBM_Plex_Mono'] font-medium mb-3">
              File Naming
            </h3>
            <input
              type="text"
              value={fileNaming}
              onChange={(e) => setFileNaming(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted border border-border text-sm text-white font-['IBM_Plex_Mono'] focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {/* DNA Reassurance - Conditional */}
          {hasActiveDNA && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Cue points and structure reflect your active DNA.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/80 hover:text-white border border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm bg-primary text-black font-medium hover:bg-primary/90 transition-colors"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}