import { useState } from "react";
import { Music, Download, Settings, Play, Pause } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

interface Stem {
  id: string;
  type: "vocals" | "drums" | "bass" | "other";
  isolated: boolean;
  quality: number; // 0-100
  audioUrl?: string;
}

export function AIVoiceSeparation() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [stems, setStems] = useState<Stem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [selectedStem, setSelectedStem] = useState<Stem | null>(null);

  const handleProcess = async () => {
    if (!selectedFile) {
      toast.error("Please select a track first");
      return;
    }

    setIsProcessing(true);
    toast.info("Processing audio... This may take a few minutes.");

    // Simulate AI processing
    setTimeout(() => {
      const newStems: Stem[] = [
        { id: "stem-1", type: "vocals", isolated: true, quality: quality, audioUrl: "mock" },
        { id: "stem-2", type: "drums", isolated: true, quality: quality, audioUrl: "mock" },
        { id: "stem-3", type: "bass", isolated: true, quality: quality, audioUrl: "mock" },
        { id: "stem-4", type: "other", isolated: true, quality: quality, audioUrl: "mock" },
      ];
      setStems(newStems);
      setIsProcessing(false);
      toast.success("Stem separation complete!");
    }, 3000);
  };

  const handleDownloadStem = (stem: Stem) => {
    toast.success(`Downloading ${stem.type} stem...`);
    // In production, this would download the actual audio file
  };

  const stemColors = {
    vocals: "text-pink-400",
    drums: "text-red-400",
    bass: "text-blue-400",
    other: "text-purple-400",
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              AI Voice Separation
            </h1>
            <p className="text-xs text-white/40">
              Isolate vocals, drums, bass, and other instruments using AI
            </p>
          </div>
          <Button
            onClick={handleProcess}
            disabled={isProcessing || !selectedFile}
            className="bg-primary hover:bg-primary/80 text-white"
          >
            {isProcessing ? "Processing..." : "Separate Stems"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* File Selection */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select Track</h2>
            <div className="flex items-center gap-4">
              <select
                value={selectedFile || ""}
                onChange={(e) => setSelectedFile(e.target.value || null)}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="">Select a track...</option>
                <option value="track-1">Track 1 - Example</option>
                <option value="track-2">Track 2 - Example</option>
              </select>
              {selectedFile && (
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                    <Play className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quality Settings */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Isolation Quality</h2>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                Quality: {quality}%
              </label>
              <Slider
                value={[quality]}
                min={50}
                max={100}
                step={1}
                onValueChange={(value) => setQuality(value[0])}
                className="w-full"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                <span>Faster (50%)</span>
                <span>Balanced (75%)</span>
                <span>Best Quality (100%)</span>
              </div>
              <p className="text-xs text-white/50 mt-2">
                Higher quality preserves more of the original audio but takes longer to process
              </p>
            </div>
          </div>

          {/* Stems Display */}
          {stems.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Isolated Stems</h2>
              <div className="grid grid-cols-2 gap-4">
                {stems.map((stem) => (
                  <div
                    key={stem.id}
                    onClick={() => setSelectedStem(stem)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedStem?.id === stem.id
                        ? "bg-primary/20 border-primary"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Music className={`w-5 h-5 ${stemColors[stem.type]}`} />
                        <h3 className="text-sm font-semibold text-white capitalize">
                          {stem.type}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadStem(stem);
                          }}
                          className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10"
                        >
                          <Download className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Isolation Quality</span>
                        <span className="text-white font-['IBM_Plex_Mono']">{stem.quality}%</span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${stem.quality}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 h-16 bg-black/40 border border-white/10 rounded-lg relative overflow-hidden">
                      {/* Mock Waveform */}
                      <svg width="100%" height="100%" className="absolute inset-0">
                        {Array.from({ length: 50 }).map((_, i) => {
                          const amplitude = Math.random() * 0.6 + 0.2;
                          const x = (i / 50) * 100;
                          return (
                            <rect
                              key={i}
                              x={`${x}%`}
                              y={50 - amplitude * 30}
                              width="2%"
                              height={amplitude * 60}
                              fill={stemColors[stem.type].replace("text-", "").replace("-400", "")}
                              opacity={0.6}
                            />
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Stem Preview */}
          {selectedStem && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {selectedStem.type.charAt(0).toUpperCase() + selectedStem.type.slice(1)} Stem
              </h2>
              <div className="space-y-4">
                <div className="h-32 bg-black/40 border border-white/10 rounded-lg relative overflow-hidden">
                  {/* Larger Waveform */}
                  <svg width="100%" height="100%" className="absolute inset-0">
                    {Array.from({ length: 200 }).map((_, i) => {
                      const amplitude = Math.random() * 0.7 + 0.15;
                      const x = (i / 200) * 100;
                      return (
                        <rect
                          key={i}
                          x={`${x}%`}
                          y={50 - amplitude * 40}
                          width="0.5%"
                          height={amplitude * 80}
                          fill={stemColors[selectedStem.type].replace("text-", "").replace("-400", "").replace("pink", "#ec4899").replace("red", "#ef4444").replace("blue", "#3b82f6").replace("purple", "#8b5cf6")}
                          opacity={0.8}
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-primary hover:bg-primary/80 text-white rounded-full">
                    <Play className="w-5 h-5" />
                  </button>
                  <Button
                    onClick={() => handleDownloadStem(selectedStem)}
                    className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Stem
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-2">About AI Voice Separation</h3>
            <p className="text-xs text-white/60 mb-2">
              Our AI uses advanced machine learning to isolate individual stems from mixed audio.
              Higher quality settings use more processing power but produce better separation results.
            </p>
            <p className="text-xs text-white/60">
              Note: Perfect isolation is not always possible, especially with heavily processed or
              low-quality source material.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

