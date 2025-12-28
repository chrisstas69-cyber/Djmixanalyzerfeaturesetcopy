import { useState } from "react";
import { X, Upload } from "lucide-react";

interface BuildDNAModalProps {
  onClose: () => void;
  onAnalyze: (files: File[]) => void;
}

export function BuildDNAModal({ onClose, onAnalyze }: BuildDNAModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      return ext === "wav" || ext === "aiff" || ext === "mp3";
    });

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleAnalyze = () => {
    if (selectedFiles.length > 0) {
      onAnalyze(selectedFiles);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#0A0A0A] border border-border w-[720px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-white tracking-tight">Build Your DJ DNA</h2>
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
          {/* Section 1 - Upload */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-['IBM_Plex_Mono'] font-medium mb-3">
              Upload
            </h3>
            <div
              className={`border-2 border-dashed rounded-sm transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/60 bg-muted/20"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <label className="block cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".wav,.aiff,.mp3"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="py-12 px-6 text-center">
                  <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-white/80 mb-2">Drop tracks here or browse files</p>
                  <p className="text-xs text-muted-foreground font-['IBM_Plex_Mono']">
                    WAV / AIFF / MP3
                  </p>
                </div>
              </label>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground font-['IBM_Plex_Mono'] mb-2">
                  {selectedFiles.length} track{selectedFiles.length !== 1 ? "s" : ""} selected
                </p>
                <div className="space-y-1 max-h-32 overflow-auto">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-white/60 font-['IBM_Plex_Mono'] bg-muted/20 px-3 py-1.5 rounded-sm"
                    >
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2 - What We Analyze */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-['IBM_Plex_Mono'] font-medium mb-3">
              What We Analyze
            </h3>
            <div className="bg-muted/10 border border-border/50 rounded-sm p-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-white/80">BPM ranges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-white/80">Energy flow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-white/80">Harmonic tendencies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-white/80">Arrangement structure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-white/80">Transition behavior</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 - Action */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-['IBM_Plex_Mono'] font-medium mb-3">
              Action
            </h3>
            <button
              onClick={handleAnalyze}
              disabled={selectedFiles.length === 0}
              className="w-full px-6 py-3 bg-primary text-black font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary mb-3"
            >
              Analyze Tracks
            </button>
            <p className="text-xs text-muted-foreground text-center">
              This runs once. Your DNA is reusable across tracks and mixes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
