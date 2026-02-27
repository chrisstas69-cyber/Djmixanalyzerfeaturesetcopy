import { useState, useEffect, useRef } from "react";
import { BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Slider } from "./ui/slider";

interface FrequencyData {
  frequency: number; // Hz
  amplitude: number; // 0-1
}

export function FrequencyAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [frequencyData, setFrequencyData] = useState<FrequencyData[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);
  const [conflicts, setConflicts] = useState<Array<{ freq: number; severity: "low" | "medium" | "high" }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isAnalyzing) {
      // Generate mock frequency data
      const generateData = () => {
        const data: FrequencyData[] = [];
        for (let i = 20; i <= 20000; i *= 1.1) {
          // Logarithmic scale
          const amplitude = Math.random() * 0.8 + 0.1;
          data.push({ frequency: i, amplitude });
        }
        setFrequencyData(data);

        // Detect conflicts (frequencies with high amplitude)
        const detectedConflicts = data
          .filter((d) => d.amplitude > 0.7)
          .map((d) => ({
            freq: d.frequency,
            severity: d.amplitude > 0.9 ? "high" : d.amplitude > 0.8 ? "medium" : "low",
          }));
        setConflicts(detectedConflicts);
      };

      generateData();
      const interval = setInterval(generateData, 100);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  useEffect(() => {
    if (canvasRef.current && frequencyData.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const y = (height / 10) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw frequency spectrum
      ctx.strokeStyle = "var(--primary)";
      ctx.lineWidth = 2;
      ctx.beginPath();

      frequencyData.forEach((data, index) => {
        const x = (index / frequencyData.length) * width;
        const y = height - data.amplitude * height;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Highlight selected frequency
      if (selectedFrequency) {
        const index = frequencyData.findIndex(
          (d) => Math.abs(d.frequency - selectedFrequency) < 10
        );
        if (index !== -1) {
          const x = (index / frequencyData.length) * width;
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      }

      // Highlight conflicts
      conflicts.forEach((conflict) => {
        const index = frequencyData.findIndex(
          (d) => Math.abs(d.frequency - conflict.freq) < 10
        );
        if (index !== -1) {
          const x = (index / frequencyData.length) * width;
          ctx.fillStyle =
            conflict.severity === "high"
              ? "rgba(239,68,68,0.3)"
              : conflict.severity === "medium"
              ? "rgba(251,191,36,0.3)"
              : "rgba(34,197,94,0.3)";
          ctx.fillRect(x - 2, 0, 4, height);
        }
      });
    }
  }, [frequencyData, selectedFrequency, conflicts]);

  const frequencyBands = [
    { name: "Sub Bass", range: [20, 60], color: "#ef4444" },
    { name: "Bass", range: [60, 250], color: "#f97316" },
    { name: "Low Mid", range: [250, 500], color: "#eab308" },
    { name: "Mid", range: [500, 2000], color: "#22c55e" },
    { name: "High Mid", range: [2000, 4000], color: "#3b82f6" },
    { name: "Presence", range: [4000, 6000], color: "#8b5cf6" },
    { name: "Brilliance", range: [6000, 20000], color: "#ec4899" },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Frequency Analyzer
            </h1>
            <p className="text-xs text-white/40">
              Real-time frequency spectrum analysis
            </p>
          </div>
          <button
            onClick={() => setIsAnalyzing(!isAnalyzing)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAnalyzing
                ? "bg-red-500/20 border border-red-500/50 text-red-400"
                : "bg-primary/20 border border-primary/50 text-primary"
            }`}
          >
            {isAnalyzing ? "Stop Analysis" : "Start Analysis"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Spectrum Display */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Frequency Spectrum
              </h2>
              {conflicts.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{conflicts.length} potential conflicts detected</span>
                </div>
              )}
            </div>

            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="w-full h-64 bg-black/40 border border-white/10 rounded-lg"
              onClick={(e) => {
                if (canvasRef.current) {
                  const rect = canvasRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const index = Math.floor((x / rect.width) * frequencyData.length);
                  if (frequencyData[index]) {
                    setSelectedFrequency(frequencyData[index].frequency);
                  }
                }
              }}
            />

            {/* Frequency Labels */}
            <div className="mt-2 flex items-center justify-between text-xs text-white/40 font-['IBM_Plex_Mono']">
              <span>20 Hz</span>
              <span>200 Hz</span>
              <span>2 kHz</span>
              <span>20 kHz</span>
            </div>

            {/* Selected Frequency Info */}
            {selectedFrequency && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-white">
                  Selected: <span className="text-primary font-['IBM_Plex_Mono'] font-semibold">{selectedFrequency.toFixed(0)} Hz</span>
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {frequencyBands.find(
                    (band) =>
                      selectedFrequency >= band.range[0] &&
                      selectedFrequency <= band.range[1]
                  )?.name || "Unknown"}
                </p>
              </div>
            )}
          </div>

          {/* Frequency Bands */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Frequency Bands</h3>
            <div className="grid grid-cols-7 gap-2">
              {frequencyBands.map((band) => {
                const avgAmplitude =
                  frequencyData
                    .filter(
                      (d) =>
                        d.frequency >= band.range[0] && d.frequency <= band.range[1]
                    )
                    .reduce((sum, d) => sum + d.amplitude, 0) /
                  frequencyData.filter(
                    (d) => d.frequency >= band.range[0] && d.frequency <= band.range[1]
                  ).length || 0;

                return (
                  <div key={band.name} className="text-center">
                    <div className="h-32 bg-black/40 border border-white/10 rounded-lg relative overflow-hidden mb-2">
                      <div
                        className="absolute bottom-0 left-0 right-0 transition-all"
                        style={{
                          height: `${avgAmplitude * 100}%`,
                          backgroundColor: band.color,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                    <p className="text-xs text-white/80 font-semibold">{band.name}</p>
                    <p className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                      {band.range[0]}-{band.range[1]} Hz
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-semibold text-yellow-400">
                  Frequency Conflicts Detected
                </h3>
              </div>
              <div className="space-y-2">
                {conflicts.map((conflict, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                  >
                    <span className="text-sm text-white/80 font-['IBM_Plex_Mono']">
                      {conflict.freq.toFixed(0)} Hz
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        conflict.severity === "high"
                          ? "bg-red-500/20 text-red-400"
                          : conflict.severity === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {conflict.severity.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase Coherence */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Phase Coherence</h3>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Good</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Mono Compatibility</span>
                <span className="text-white font-['IBM_Plex_Mono']">85%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Stereo Width</span>
                <span className="text-white font-['IBM_Plex_Mono']">Normal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

