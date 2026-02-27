import { useState } from "react";
import { X, FileAudio, Download, CheckCircle2, Layers, Check } from "lucide-react";

interface ExportMixModalProps {
  mixTitle?: string;
  onClose: () => void;
  onExport?: (format: "wav" | "mp3", includeStems: boolean, filenames: string[]) => void;
}

export function ExportMixModal({ 
  mixTitle = "Evening Session Mix", 
  onClose,
  onExport 
}: ExportMixModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"wav" | "mp3">("wav");
  const [includeStems, setIncludeStems] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const sanitizeFilename = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const getFilenames = () => {
    const base = sanitizeFilename(mixTitle);
    const files: string[] = [];
    
    // Main mix file
    files.push(`${base}.${selectedFormat}`);
    
    // Stems files if included
    if (includeStems) {
      files.push(`${base}-stems.zip`);
    }
    
    return files;
  };

  const filenames = getFilenames();

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      onExport?.(selectedFormat, includeStems, filenames);
      setIsExporting(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-white/10 flex items-center justify-center">
              <FileAudio className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Export Mix</h2>
              <p className="text-xs text-white/50 font-['IBM_Plex_Mono']">
                Professional-quality audio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Mix Title */}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
              Mix Title
            </label>
            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/90">{mixTitle}</p>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-3 uppercase tracking-wider">
              Main Mix Format
            </label>
            <div className="space-y-2">
              {/* WAV Option */}
              <button
                onClick={() => setSelectedFormat("wav")}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  selectedFormat === "wav"
                    ? "bg-secondary/10 border-secondary/30 shadow-lg shadow-secondary/10"
                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedFormat === "wav"
                        ? "border-secondary bg-secondary/20"
                        : "border-white/30"
                    }`}>
                      {selectedFormat === "wav" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white/90">WAV</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          selectedFormat === "wav"
                            ? "bg-secondary/20 text-secondary border border-secondary/30"
                            : "bg-white/10 text-white/60 border border-white/20"
                        }`}>
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-white/50 font-['IBM_Plex_Mono'] mt-1">
                        24-bit · 44.1 kHz · Uncompressed
                      </p>
                    </div>
                  </div>
                  {selectedFormat === "wav" && (
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-white/60 ml-8">
                  Lossless quality for CDJs, pro DJ software, and archival
                </p>
              </button>

              {/* MP3 Option */}
              <button
                onClick={() => setSelectedFormat("mp3")}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  selectedFormat === "mp3"
                    ? "bg-secondary/10 border-secondary/30 shadow-lg shadow-secondary/10"
                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedFormat === "mp3"
                        ? "border-secondary bg-secondary/20"
                        : "border-white/30"
                    }`}>
                      {selectedFormat === "mp3" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-sm text-white/90">MP3</span>
                      <p className="text-xs text-white/50 font-['IBM_Plex_Mono'] mt-1">
                        320 kbps · High Quality
                      </p>
                    </div>
                  </div>
                  {selectedFormat === "mp3" && (
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-white/60 ml-8">
                  Compressed format for streaming and mobile DJ apps
                </p>
              </button>
            </div>
          </div>

          {/* Stems Checkbox */}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-3 uppercase tracking-wider">
              Additional Export
            </label>
            <button
              onClick={() => setIncludeStems(!includeStems)}
              className={`w-full p-4 rounded-xl border transition-all text-left ${
                includeStems
                  ? "bg-secondary/10 border-secondary/30 shadow-lg shadow-secondary/10"
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    includeStems
                      ? "border-secondary bg-secondary/20"
                      : "border-white/30"
                  }`}>
                    {includeStems && (
                      <Check className="w-3.5 h-3.5 text-secondary stroke-[3]" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-white/90">Also export stems</span>
                    </div>
                    <p className="text-xs text-white/50 font-['IBM_Plex_Mono'] mb-2">
                      WAV Multitrack · 24-bit
                    </p>
                    <p className="text-xs text-white/60 leading-relaxed mb-3">
                      Exports remix-ready performance stems:
                    </p>
                    
                    {/* Stem List */}
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10">
                        <span className="text-xs font-['IBM_Plex_Mono'] text-white/70">Drums</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10">
                        <span className="text-xs font-['IBM_Plex_Mono'] text-white/70">Bass</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10">
                        <span className="text-xs font-['IBM_Plex_Mono'] text-white/70">Music</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10">
                        <span className="text-xs font-['IBM_Plex_Mono'] text-white/70">Vocals</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10">
                        <span className="text-xs font-['IBM_Plex_Mono'] text-white/70">FX</span>
                      </div>
                    </div>

                    {/* Expanded details when checked */}
                    {includeStems && (
                      <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10">
                        <div className="flex items-start gap-2">
                          <Layers className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-white/90 mb-1">
                              5 separate WAV files will be included
                            </p>
                            <p className="text-xs text-white/60">
                              Perfect for remixing, re-editing, and advanced production
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {includeStems && (
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                )}
              </div>
            </button>
          </div>

          {/* Filename Preview */}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
              Output Files
            </label>
            <div className="space-y-2">
              {filenames.map((filename, index) => (
                <div key={index} className="px-4 py-3 rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10">
                  <p className="text-sm font-['IBM_Plex_Mono'] text-secondary break-all">
                    {filename}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Assurance */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/[0.07] to-secondary/[0.05] border border-primary/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">
                  Professional Quality Guaranteed
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  All exports are mastered to industry standard and ready for immediate use in 
                  professional DJ software, CDJs, and streaming platforms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-white/5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white/90 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary border border-secondary/50 text-white text-sm font-medium shadow-lg shadow-secondary/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export {includeStems ? `${filenames.length} Files` : "Mix"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
