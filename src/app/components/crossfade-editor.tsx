import { useState } from "react";
import { TrendingUp, Play, Pause } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

type CrossfadeCurve = "linear" | "exponential" | "s-curve" | "custom";

interface CrossfadeConfig {
  length: number; // in beats
  curve: CrossfadeCurve;
  eqAutomation: boolean;
  filterSweep: boolean;
}

export function CrossfadeEditor() {
  const [config, setConfig] = useState<CrossfadeConfig>({
    length: 8, // 8 bars
    curve: "s-curve",
    eqAutomation: true,
    filterSweep: false,
  });
  const [isPreviewing, setIsPreviewing] = useState(false);

  const drawCurve = (curve: CrossfadeCurve, width: number, height: number) => {
    const points: Array<{ x: number; y: number }> = [];
    const steps = 100;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      let y = 0;

      switch (curve) {
        case "linear":
          y = (i / steps) * height;
          break;
        case "exponential":
          y = Math.pow(i / steps, 2) * height;
          break;
        case "s-curve":
          const t = i / steps;
          y = (t * t * (3 - 2 * t)) * height; // Smoothstep
          break;
        case "custom":
          // Custom curve (user-defined)
          y = (i / steps) * height;
          break;
      }

      points.push({ x, y });
    }

    return points;
  };

  const curvePoints = drawCurve(config.curve, 400, 100);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
          Crossfade Editor
        </h1>
        <p className="text-xs text-white/40">
          Customize your transition curves and automation
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Curve Visualization */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Crossfade Curve</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreviewing(!isPreviewing)}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                >
                  {isPreviewing ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Curve Graph */}
            <div className="relative h-48 bg-black/40 border border-white/10 rounded-lg overflow-hidden">
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Grid */}
                <defs>
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Curve */}
                <polyline
                  points={curvePoints
                    .map((p) => `${p.x},${200 - p.y}`)
                    .join(" ")}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3"
                />

                {/* Deck A (fading out) */}
                <polyline
                  points={`0,100 ${curvePoints.map((p) => `${p.x},${100 - p.y / 2}`).join(" ")}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Deck B (fading in) */}
                <polyline
                  points={`${curvePoints.map((p) => `${p.x},${100 + p.y / 2}`).join(" ")} 400,100`}
                  fill="none"
                  stroke="rgba(139,92,246,0.3)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Labels */}
                <text x="10" y="30" fill="rgba(255,255,255,0.6)" fontSize="12">
                  Deck A (Out)
                </text>
                <text x="10" y="170" fill="rgba(139,92,246,0.6)" fontSize="12">
                  Deck B (In)
                </text>
              </svg>
            </div>

            {/* Curve Type Selection */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {(["linear", "exponential", "s-curve", "custom"] as CrossfadeCurve[]).map(
                (curveType) => (
                  <button
                    key={curveType}
                    onClick={() => setConfig({ ...config, curve: curveType })}
                    className={`p-3 rounded-lg border transition-colors ${
                      config.curve === curveType
                        ? "bg-primary/20 border-primary text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-sm font-semibold capitalize">{curveType}</p>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-6">
            {/* Length */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="text-xs text-white/60 mb-2 block font-['IBM_Plex_Mono']">
                Crossfade Length: {config.length} beats
              </label>
              <Slider
                value={[config.length]}
                min={1}
                max={32}
                step={1}
                onValueChange={(value) => setConfig({ ...config, length: value[0] })}
                className="w-full"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                <span>1 beat</span>
                <span>32 beats</span>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.eqAutomation}
                  onChange={(e) =>
                    setConfig({ ...config, eqAutomation: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                />
                <span className="text-sm text-white/80">EQ Automation</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.filterSweep}
                  onChange={(e) =>
                    setConfig({ ...config, filterSweep: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                />
                <span className="text-sm text-white/80">Filter Sweep</span>
              </label>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Save as Preset</h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Preset name..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/80 text-white"
                onClick={() => toast.success("Preset saved!")}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

