import { useState } from "react";
import { X, Upload, Check, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

// Helper function to generate waveform data (matching Track Library format)
function generateWaveformData() {
  const samples = 70;
  const amplitudes: number[] = [];
  const bass: number[] = [];
  const mids: number[] = [];
  const highs: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    const position = i / samples;
    let amplitude = 0.3;
    
    if (position < 0.15) {
      amplitude = 0.2 + (position / 0.15) * 0.3;
    } else if (position < 0.3) {
      amplitude = 0.5 + ((position - 0.15) / 0.15) * 0.3;
    } else if (position < 0.6) {
      amplitude = 0.8 + Math.random() * 0.2;
    } else if (position < 0.75) {
      amplitude = 0.8 - ((position - 0.6) / 0.15) * 0.5;
    } else if (position < 0.85) {
      amplitude = 0.3 + ((position - 0.75) / 0.1) * 0.5;
    } else {
      amplitude = 0.8 - ((position - 0.85) / 0.15) * 0.6;
    }
    
    amplitude += (Math.random() - 0.5) * 0.15;
    amplitude = Math.max(0.05, Math.min(1, amplitude));
    
    let bassAmp = amplitude * (0.6 + Math.random() * 0.4);
    if (position > 0.3 && position < 0.6) bassAmp *= 1.2;
    
    let midsAmp = amplitude * (0.5 + Math.random() * 0.3);
    let highsAmp = amplitude * (0.3 + Math.random() * 0.4);
    if (Math.random() > 0.85) highsAmp *= 1.5;
    
    amplitudes.push(amplitude);
    bass.push(Math.max(0.05, Math.min(1, bassAmp)));
    mids.push(Math.max(0.05, Math.min(1, midsAmp)));
    highs.push(Math.max(0.05, Math.min(1, highsAmp)));
  }
  
  return { amplitudes, bass, mids, highs };
}

// Helper function to extract/generate metadata from uploaded file
function generateTrackMetadata(file: File, index: number) {
  // Extract filename without extension
  const fileNameWithoutExt = file.name.replace(/\.(mp3|wav)$/i, "");
  
  // Try to parse artist - title format if it exists
  const parts = fileNameWithoutExt.split(" - ");
  const artist = parts.length > 1 ? parts[0].trim() : "Unknown Artist";
  const title = parts.length > 1 ? parts.slice(1).join(" - ").trim() : fileNameWithoutExt;
  
  // Generate realistic metadata
  const genres = ["House", "Techno", "Deep House", "Tech House", "Minimal", "Progressive", "Acid Techno", "Dub Techno"];
  const keys = ["Am", "Bm", "Cm", "Dm", "Em", "Fm", "Gm", "C", "D", "E", "F", "G", "A", "B"];
  const bpms = [122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132];
  
  const randomGenre = genres[Math.floor(Math.random() * genres.length)];
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const randomBpm = bpms[Math.floor(Math.random() * bpms.length)];
  
  // Generate random duration between 5:00 and 8:00
  const durationSeconds = 300 + Math.floor(Math.random() * 180);
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  
  // Current date
  const today = new Date().toISOString().split("T")[0];
  
  return {
    id: `uploaded-${Date.now()}-${index}`,
    title,
    artist,
    album: "Uploaded Tracks",
    genre: randomGenre,
    bpm: randomBpm,
    key: randomKey,
    duration,
    status: null as const,
    source: "Uploaded" as const,
    waveformData: generateWaveformData(),
    dateAdded: today,
    cues: {
      A: true,   // Intro
      B: true,   // Mix In
      C: true,   // Drop
      D: true,   // Breakdown
      E: true,   // Outro
    },
    cuePositions: {
      A: 0.15,
      B: 0.3,
      C: 0.5,
      D: 0.7,
      E: 0.85,
    },
  };
}

interface UploadReferenceTracksModalProps {
  onClose: () => void;
  onAnalyze: (files: FileWithStatus[]) => void;
  onTracksUploaded?: (tracks: any[]) => void; // Callback for adding tracks to library
}

type UploadStatus = "queued" | "uploading" | "uploaded" | "failed";
type AnalysisStep = "tempo" | "harmonic" | "energy" | "structure";

interface FileWithStatus {
  file: File;
  status: UploadStatus;
  progress?: number;
}

export function UploadReferenceTracksModal({
  onClose,
  onAnalyze,
  onTracksUploaded,
}: UploadReferenceTracksModalProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<AnalysisStep>("tempo");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      return ext === "wav" || ext === "mp3";
    });

    const newFiles: FileWithStatus[] = droppedFiles.map((file) => ({
      file,
      status: "queued",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
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
      const selectedFiles = Array.from(e.target.files);
      const newFiles: FileWithStatus[] = selectedFiles.map((file) => ({
        file,
        status: "queued",
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRetry = (index: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status: "queued" } : f))
    );
  };

  const handleAnalyze = () => {
    if (files.length > 0) {
      setIsAnalyzing(true);
      
      // Simulate analysis progress
      let progress = 0;
      const steps: AnalysisStep[] = ["tempo", "harmonic", "energy", "structure"];
      let stepIndex = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            // Generate track metadata for all uploaded files
            const uploadedTracks = files.map((fileWithStatus, idx) => 
              generateTrackMetadata(fileWithStatus.file, idx)
            );
            
            // Add tracks to library if callback is provided
            if (onTracksUploaded) {
              onTracksUploaded(uploadedTracks);
            }
            
            onAnalyze(files);
            onClose();
          }, 500);
        }
        
        setAnalysisProgress(Math.min(progress, 100));
        
        // Update step based on progress
        if (progress < 25) {
          setCurrentStep("tempo");
        } else if (progress < 50) {
          setCurrentStep("harmonic");
        } else if (progress < 75) {
          setCurrentStep("energy");
        } else {
          setCurrentStep("structure");
        }
      }, 400);
    }
  };

  const getStepStatus = (step: AnalysisStep): "active" | "completed" | "pending" => {
    const steps: AnalysisStep[] = ["tempo", "harmonic", "energy", "structure"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const getStepText = (step: AnalysisStep): string => {
    switch (step) {
      case "tempo":
        return "Detecting tempo & rhythm";
      case "harmonic":
        return "Mapping harmonic patterns";
      case "energy":
        return "Learning energy flow";
      case "structure":
        return "Extracting structure & transitions";
    }
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case "queued":
        return <div className="w-3 h-3 rounded-full border border-muted-foreground/50" />;
      case "uploading":
        return (
          <div className="w-3 h-3 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
        );
      case "uploaded":
        return <Check className="w-3 h-3 text-secondary" />;
      case "failed":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
  };

  const getStatusText = (status: UploadStatus) => {
    switch (status) {
      case "queued":
        return "Queued";
      case "uploading":
        return "Uploading";
      case "uploaded":
        return "Uploaded";
      case "failed":
        return "Failed";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={isAnalyzing ? undefined : onClose}
    >
      <div
        className="bg-[#0A0A0A] border border-border w-[720px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight mb-1">
              {isAnalyzing ? "Analyzing Your Music" : "Upload Reference Tracks"}
            </h2>
            {!isAnalyzing && (
              <p className="text-xs text-muted-foreground">
                These tracks are used only to learn your musical preferences.
              </p>
            )}
          </div>
          {!isAnalyzing && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
          {isAnalyzing ? (
            // Analysis Progress View
            <div className="py-12">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                {(["tempo", "harmonic", "energy", "structure"] as AnalysisStep[]).map((step) => {
                  const status = getStepStatus(step);
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 text-sm ${
                        status === "active"
                          ? "text-white"
                          : status === "completed"
                          ? "text-white/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {status === "completed" && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                        {status === "active" && (
                          <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                        )}
                        {status === "pending" && (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 flex-shrink-0" />
                        )}
                      </div>
                      <span>{getStepText(step)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Upload View
            <>
              {/* Upload Zone */}
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
                    accept=".wav,.mp3"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="py-16 px-6 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-white/80 mb-2">Drop audio files here</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground font-['IBM_Plex_Mono']">
                      MP3, WAV • Up to 100 tracks
                    </p>
                  </div>
                </label>
              </div>

              {/* Track List Preview */}
              {files.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground font-['IBM_Plex_Mono'] uppercase tracking-wider">
                      Queued Tracks
                    </p>
                    <p className="text-xs text-muted-foreground font-['IBM_Plex_Mono']">
                      {files.length} {files.length === 1 ? "track" : "tracks"}
                    </p>
                  </div>
                  <div className="space-y-1 max-h-64 overflow-auto bg-background/50 border border-border/50 rounded-sm p-3">
                    {files.map((fileWithStatus, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 bg-card/30 rounded-sm hover:bg-card/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getStatusIcon(fileWithStatus.status)}
                          <span className="text-xs text-white/70 font-['IBM_Plex_Mono'] truncate">
                            {fileWithStatus.file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className={`text-xs font-['IBM_Plex_Mono'] ${
                              fileWithStatus.status === "uploaded"
                                ? "text-secondary"
                                : fileWithStatus.status === "failed"
                                ? "text-red-500"
                                : fileWithStatus.status === "uploading"
                                ? "text-secondary/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {getStatusText(fileWithStatus.status)}
                          </span>
                          {fileWithStatus.status === "failed" && (
                            <button
                              onClick={() => handleRetry(idx)}
                              className="text-muted-foreground hover:text-white transition-colors"
                              aria-label="Retry upload"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(idx)}
                            className="text-muted-foreground hover:text-white transition-colors"
                            aria-label="Remove track"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border flex-shrink-0">
          {isAnalyzing ? (
            <>
              <p className="text-xs text-muted-foreground mr-auto">
                This usually takes a few minutes depending on track count.
              </p>
              <Button
                variant="outline"
                onClick={onClose}
                className="font-['IBM_Plex_Mono'] text-xs"
              >
                Run in Background
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="font-['IBM_Plex_Mono'] text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={files.length === 0}
                className="bg-primary text-black font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary font-['IBM_Plex_Mono'] text-xs"
              >
                Analyze & Create DNA
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}