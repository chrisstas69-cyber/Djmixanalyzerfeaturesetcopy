import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, BarChart3, Radio } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

export function WaveformZoomAnalysis() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<{ start: number; end: number } | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [spectrumData, setSpectrumData] = useState<number[]>([]);
  const [transients, setTransients] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"waveform" | "spectrum" | "both">("both");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate mock waveform data
    const generateWaveform = () => {
      const data: number[] = [];
      for (let i = 0; i < 1000; i++) {
        const amplitude = Math.sin(i / 50) * 0.5 + Math.random() * 0.3;
        data.push(Math.max(0, Math.min(1, amplitude)));
      }
      return data;
    };

    // Generate mock spectrum data
    const generateSpectrum = () => {
      const data: number[] = [];
      for (let i = 0; i < 256; i++) {
        const freq = i * (22050 / 256);
        let amplitude = 0;
        if (freq < 200) amplitude = 0.8; // Bass
        else if (freq < 2000) amplitude = 0.6; // Mid
        else amplitude = 0.4; // Treble
        amplitude += (Math.random() - 0.5) * 0.2;
        data.push(Math.max(0, Math.min(1, amplitude)));
      }
      return data;
    };

    // Detect transients (peaks)
    const detectTransients = (data: number[]) => {
      const peaks: number[] = [];
      for (let i = 1; i < data.length - 1; i++) {
        if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > 0.7) {
          peaks.push(i);
        }
      }
      return peaks;
    };

    const waveform = generateWaveform();
    const spectrum = generateSpectrum();
    const detectedTransients = detectTransients(waveform);

    setWaveformData(waveform);
    setSpectrumData(spectrum);
    setTransients(detectedTransients);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || waveformData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw waveform
    if (viewMode === "waveform" || viewMode === "both") {
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const visibleSamples = Math.floor(waveformData.length / zoomLevel);
      const startSample = selectedRegion
        ? Math.floor(selectedRegion.start * waveformData.length)
        : 0;
      const endSample = selectedRegion
        ? Math.floor(selectedRegion.end * waveformData.length)
        : visibleSamples;

      for (let i = startSample; i < endSample; i++) {
        const x = ((i - startSample) / (endSample - startSample)) * width;
        const y = height / 2 - (waveformData[i] * height * 0.4);
        if (i === startSample) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw transients
      ctx.fillStyle = "#ef4444";
      transients.forEach((pos) => {
        if (pos >= startSample && pos <= endSample) {
          const x = ((pos - startSample) / (endSample - startSample)) * width;
          ctx.fillRect(x - 2, 0, 4, height);
        }
      });
    }

    // Draw spectrum
    if (viewMode === "spectrum" || viewMode === "both") {
      const spectrumHeight = viewMode === "both" ? height / 2 : height;
      const spectrumY = viewMode === "both" ? height / 2 : 0;

      ctx.fillStyle = "#3b82f6";
      spectrumData.forEach((amplitude, index) => {
        const x = (index / spectrumData.length) * width;
        const barHeight = amplitude * spectrumHeight * 0.8;
        ctx.fillRect(x, spectrumY + spectrumHeight - barHeight, width / spectrumData.length, barHeight);
      });
    }
  }, [waveformData, spectrumData, transients, zoomLevel, selectedRegion, viewMode]);

  const handleZoom = (delta: number) => {
    setZoomLevel(Math.max(0.1, Math.min(10, zoomLevel + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setSelectedRegion(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Waveform Zoom & Analysis
            </h1>
            <p className="text-xs text-white/40">
              Deep zoom, spectrum analyzer, and transient detection
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("waveform")}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === "waveform"
                    ? "bg-primary/20 border border-primary/50 text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                Waveform
              </button>
              <button
                onClick={() => setViewMode("spectrum")}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === "spectrum"
                    ? "bg-primary/20 border border-primary/50 text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                Spectrum
              </button>
              <button
                onClick={() => setViewMode("both")}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === "both"
                    ? "bg-primary/20 border border-primary/50 text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                Both
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Zoom Controls */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handleZoom(-0.1)}
                  size="sm"
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="flex-1 max-w-xs">
                  <Slider
                    value={[zoomLevel]}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setZoomLevel(value[0])}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={() => handleZoom(0.1)}
                  size="sm"
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono'] min-w-[60px]">
                  {zoomLevel.toFixed(1)}x
                </span>
                <Button
                  onClick={handleResetZoom}
                  size="sm"
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Waveform Canvas */}
          <div
            ref={containerRef}
            className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-auto"
          >
            <canvas
              ref={canvasRef}
              width={1200}
              height={400}
              className="w-full h-auto"
              style={{ cursor: "crosshair" }}
            />
          </div>

          {/* Analysis Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-white/40" />
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">Transients</span>
              </div>
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                {transients.length}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-white/40" />
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">Peak Freq</span>
              </div>
              <p className="text-2xl font-bold text-primary font-['IBM_Plex_Mono']">
                {spectrumData.length > 0
                  ? Math.round(
                      (spectrumData.indexOf(Math.max(...spectrumData)) * 22050) / 256
                    )
                  : 0}
                Hz
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">RMS Level</span>
              </div>
              <p className="text-2xl font-bold text-green-400 font-['IBM_Plex_Mono']">
                {waveformData.length > 0
                  ? (
                      Math.sqrt(
                        waveformData.reduce((sum, val) => sum + val * val, 0) /
                          waveformData.length
                      ) * 100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">Samples</span>
              </div>
              <p className="text-2xl font-bold text-blue-400 font-['IBM_Plex_Mono']">
                {waveformData.length}
              </p>
            </div>
          </div>

          {/* Frequency Bands */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Frequency Analysis</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-2">Bass (20-200 Hz)</p>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 transition-all"
                    style={{
                      width: `${
                        (spectrumData.slice(0, 3).reduce((a, b) => a + b, 0) / 3) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-white/40 mt-1 font-['IBM_Plex_Mono']">
                  {((spectrumData.slice(0, 3).reduce((a, b) => a + b, 0) / 3) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-2">Mid (200-2000 Hz)</p>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{
                      width: `${
                        (spectrumData.slice(3, 23).reduce((a, b) => a + b, 0) / 20) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-white/40 mt-1 font-['IBM_Plex_Mono']">
                  {((spectrumData.slice(3, 23).reduce((a, b) => a + b, 0) / 20) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-2">Treble (2000-20000 Hz)</p>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 transition-all"
                    style={{
                      width: `${
                        (spectrumData.slice(23).reduce((a, b) => a + b, 0) / (spectrumData.length - 23)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-white/40 mt-1 font-['IBM_Plex_Mono']">
                  {(
                    (spectrumData.slice(23).reduce((a, b) => a + b, 0) /
                      (spectrumData.length - 23)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

