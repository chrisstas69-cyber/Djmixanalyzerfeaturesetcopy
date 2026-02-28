import { useState, useEffect } from "react";
import { Download, FileAudio, FileText, Music2, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface AudioFile {
  id: string;
  name: string;
  data: string;
  duration: number;
  size: number;
  type: string;
  bpm?: number;
  key?: string;
  energy?: string;
}

interface ExportSettings {
  format: "wav" | "mp3";
  quality: 128 | 192 | 320; // kbps for MP3
  normalize: boolean;
  targetLoudness: number; // dB
  includeMetadata: boolean;
}

export function AudioExportPanel() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: "mp3",
    quality: 192,
    normalize: false,
    targetLoudness: -3,
    includeMetadata: true,
  });
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Load files from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('uploadedAudioFiles');
      if (stored) {
        setFiles(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }, []);

  const handleExport = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to export");
      return;
    }

    setExporting(true);
    setExportProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const fileId = selectedFiles[i];
        const file = files.find(f => f.id === fileId);
        if (!file) continue;

        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real implementation, this would:
        // 1. Decode audio buffer
        // 2. Apply normalization if enabled
        // 3. Encode to selected format (WAV/MP3)
        // 4. Add metadata if enabled
        // 5. Create download

        // Mock export - create a download link
        const exportData = {
          name: file.name,
          format: exportSettings.format,
          quality: exportSettings.quality,
          bpm: file.bpm,
          key: file.key,
          energy: file.energy,
          normalized: exportSettings.normalize,
          targetLoudness: exportSettings.targetLoudness,
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.replace(/\.[^/.]+$/, "")}.${exportSettings.format === "wav" ? "wav" : "mp3"}.json`;
        link.click();
        URL.revokeObjectURL(url);

        setExportProgress(((i + 1) / selectedFiles.length) * 100);
      }

      toast.success(`Exported ${selectedFiles.length} file(s) as ${exportSettings.format.toUpperCase()}`);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Export failed");
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAll = () => {
    setSelectedFiles(files.map(f => f.id));
  };

  const deselectAll = () => {
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimateFileSize = (duration: number, format: string, quality: number): string => {
    // Rough estimates
    if (format === "wav") {
      const mb = (duration * 44100 * 2 * 2) / (1024 * 1024); // 44.1kHz, 16-bit, stereo
      return `${mb.toFixed(1)} MB`;
    } else {
      const mb = (duration * quality * 1000) / (8 * 1024 * 1024);
      return `${mb.toFixed(1)} MB`;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1">Audio Export</h1>
        <p className="text-xs text-white/40">
          Export audio files in WAV or MP3 format
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: File Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Select Files ({selectedFiles.length} selected)
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={selectAll}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs"
                  >
                    Select All
                  </Button>
                  <Button
                    onClick={deselectAll}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs"
                  >
                    Deselect All
                  </Button>
                </div>
              </div>

              {files.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                  <FileAudio className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 mb-2">No audio files available</p>
                  <p className="text-sm text-white/40">
                    Upload audio files first to export them
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => {
                    const isSelected = selectedFiles.includes(file.id);
                    return (
                      <div
                        key={file.id}
                        onClick={() => toggleFileSelection(file.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary/20 border-primary"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-white/30"
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white truncate">
                              {file.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-white/50 font-['IBM_Plex_Mono']">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{formatDuration(file.duration)}</span>
                              {file.bpm && (
                                <>
                                  <span>•</span>
                                  <span>{file.bpm} BPM</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            {file.type.split('/')[1].toUpperCase()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Export Settings */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Export Settings</h2>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setExportSettings(prev => ({ ...prev, format: "wav" }))}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      exportSettings.format === "wav"
                        ? "bg-primary/20 border-primary text-primary border"
                        : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    WAV
                  </button>
                  <button
                    onClick={() => setExportSettings(prev => ({ ...prev, format: "mp3" }))}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      exportSettings.format === "mp3"
                        ? "bg-primary/20 border-primary text-primary border"
                        : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    MP3
                  </button>
                </div>
              </div>

              {/* Quality (MP3 only) */}
              {exportSettings.format === "mp3" && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Quality: {exportSettings.quality} kbps
                  </label>
                  <div className="flex gap-2">
                    {[128, 192, 320].map((q) => (
                      <button
                        key={q}
                        onClick={() => setExportSettings(prev => ({ ...prev, quality: q as any }))}
                        className={`flex-1 py-2 rounded text-xs font-medium transition-all ${
                          exportSettings.quality === q
                            ? "bg-primary/20 border-primary text-primary border"
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Normalization */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white/70">Normalization</label>
                  <button
                    onClick={() => setExportSettings(prev => ({ ...prev, normalize: !prev.normalize }))}
                    className={`w-12 h-6 rounded-full transition-all ${
                      exportSettings.normalize ? "bg-primary" : "bg-white/10"
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      exportSettings.normalize ? "translate-x-6" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
                {exportSettings.normalize && (
                  <div className="mt-3">
                    <label className="block text-xs text-white/50 mb-2">
                      Target Loudness: {exportSettings.targetLoudness} dB
                    </label>
                    <Slider
                      value={[exportSettings.targetLoudness]}
                      min={-12}
                      max={0}
                      step={0.5}
                      onValueChange={(val) => setExportSettings(prev => ({ ...prev, targetLoudness: val[0] }))}
                    />
                  </div>
                )}
              </div>

              {/* Include Metadata */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/70">Include Metadata</label>
                  <button
                    onClick={() => setExportSettings(prev => ({ ...prev, includeMetadata: !prev.includeMetadata }))}
                    className={`w-12 h-6 rounded-full transition-all ${
                      exportSettings.includeMetadata ? "bg-primary" : "bg-white/10"
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      exportSettings.includeMetadata ? "translate-x-6" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
                <p className="text-xs text-white/40 mt-1">
                  Embed BPM, key, and energy data
                </p>
              </div>

              {/* File Size Estimate */}
              {selectedFiles.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-2">Estimated Size</p>
                  <p className="text-sm text-white font-['IBM_Plex_Mono']">
                    {selectedFiles.reduce((sum, id) => {
                      const file = files.find(f => f.id === id);
                      if (!file) return sum;
                      const size = estimateFileSize(file.duration, exportSettings.format, exportSettings.quality);
                      return sum + parseFloat(size);
                    }, 0).toFixed(1)} MB total
                  </p>
                </div>
              )}

              {/* Export Button */}
              <Button
                onClick={handleExport}
                disabled={exporting || selectedFiles.length === 0}
                className="w-full bg-primary hover:bg-primary/80 text-white"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting... {Math.round(exportProgress)}%
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {exporting && (
                <div className="space-y-2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

