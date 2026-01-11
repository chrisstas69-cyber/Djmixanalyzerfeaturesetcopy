import { useState } from "react";
import { Grid, Lock, Unlock, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

interface QuantizationSettings {
  enabled: boolean;
  strength: number; // 0-100%
  swing: number; // -50% to +50%
  gridSize: "1/4" | "1/8" | "1/16" | "1/32";
  microTiming: number; // milliseconds adjustment
}

export function QuantizationPanel() {
  const [settings, setSettings] = useState<QuantizationSettings>({
    enabled: false,
    strength: 100,
    swing: 0,
    gridSize: "1/16",
    microTiming: 0,
  });

  const [isGridLocked, setIsGridLocked] = useState(false);

  const handleApply = () => {
    toast.success("Quantization applied!");
  };

  const handleReset = () => {
    setSettings({
      enabled: false,
      strength: 100,
      swing: 0,
      gridSize: "1/16",
      microTiming: 0,
    });
    setIsGridLocked(false);
    toast.info("Settings reset");
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Quantization & Grid Lock
            </h1>
            <p className="text-xs text-white/40">
              Perfect timing with beat quantization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleApply}
              size="sm"
              className="bg-primary hover:bg-primary/80 text-white"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Enable/Disable */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Enable Quantization</h3>
                <p className="text-xs text-white/60">
                  Snap events to the nearest beat grid
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary"
              />
            </label>
          </div>

          {settings.enabled && (
            <>
              {/* Strength */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <label className="text-xs text-white/60 mb-2 block font-['IBM_Plex_Mono']">
                  Quantization Strength: {settings.strength}%
                </label>
                <Slider
                  value={[settings.strength]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSettings({ ...settings, strength: value[0] })}
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>Soft (90%)</span>
                  <span>Hard (100%)</span>
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Lower values preserve more of the original timing
                </p>
              </div>

              {/* Grid Size */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <label className="text-xs text-white/60 mb-2 block font-['IBM_Plex_Mono']">
                  Grid Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["1/4", "1/8", "1/16", "1/32"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSettings({ ...settings, gridSize: size })}
                      className={`p-3 rounded-lg border transition-colors ${
                        settings.gridSize === size
                          ? "bg-primary/20 border-primary text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <p className="text-sm font-semibold font-['IBM_Plex_Mono']">{size}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Swing */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <label className="text-xs text-white/60 mb-2 block font-['IBM_Plex_Mono']">
                  Swing: {settings.swing > 0 ? "+" : ""}{settings.swing}%
                </label>
                <Slider
                  value={[settings.swing]}
                  min={-50}
                  max={50}
                  step={1}
                  onValueChange={(value) => setSettings({ ...settings, swing: value[0] })}
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>Straight (0%)</span>
                  <span>Heavy Swing (±50%)</span>
                </div>
              </div>

              {/* Micro Timing */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <label className="text-xs text-white/60 mb-2 block font-['IBM_Plex_Mono']">
                  Micro Timing Adjustment: {settings.microTiming > 0 ? "+" : ""}
                  {settings.microTiming}ms
                </label>
                <Slider
                  value={[settings.microTiming]}
                  min={-50}
                  max={50}
                  step={1}
                  onValueChange={(value) => setSettings({ ...settings, microTiming: value[0] })}
                  className="w-full"
                />
                <p className="text-xs text-white/50 mt-2">
                  Fine-tune timing in milliseconds
                </p>
              </div>

              {/* Grid Lock */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    {isGridLocked ? (
                      <Lock className="w-5 h-5 text-primary" />
                    ) : (
                      <Unlock className="w-5 h-5 text-white/40" />
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">Grid Lock</h3>
                      <p className="text-xs text-white/60">
                        Lock all events to the grid
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isGridLocked}
                    onChange={(e) => setIsGridLocked(e.target.checked)}
                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary"
                  />
                </label>
              </div>

              {/* Visual Grid Preview */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Grid Preview</h3>
                <div className="relative h-24 bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                  {/* Grid lines */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const isMainBeat = i % 4 === 0;
                    return (
                      <div
                        key={i}
                        className={`absolute top-0 bottom-0 ${
                          isMainBeat ? "bg-primary w-0.5" : "bg-white/20 w-px"
                        }`}
                        style={{ left: `${(i / 16) * 100}%` }}
                      />
                    );
                  })}
                  {/* Event markers */}
                  <div className="absolute top-1/2 left-[12%] transform -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full" />
                  <div className="absolute top-1/2 left-[45%] transform -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full" />
                  <div className="absolute top-1/2 left-[78%] transform -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full" />
                </div>
                <p className="text-xs text-white/40 mt-2 text-center">
                  Red dots show events before quantization
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

