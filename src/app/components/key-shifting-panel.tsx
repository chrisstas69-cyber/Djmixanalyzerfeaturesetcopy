import { useState } from "react";
import { Music, Play, RotateCcw, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

interface KeyShiftSettings {
  keyShift: number; // semitones: -12 to +12
  tempoChange: number; // percentage: -50% to +50%
  preserveQuality: boolean;
  algorithm: "standard" | "advanced" | "harmonic";
}

const KEY_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export function KeyShiftingPanel() {
  const [currentKey, setCurrentKey] = useState("Am");
  const [currentBPM, setCurrentBPM] = useState(128);
  const [settings, setSettings] = useState<KeyShiftSettings>({
    keyShift: 0,
    tempoChange: 0,
    preserveQuality: true,
    algorithm: "advanced",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewAvailable, setPreviewAvailable] = useState(false);

  const calculateNewKey = () => {
    // Simple key calculation (in production, this would use music theory)
    const baseKey = currentKey.replace("m", "").replace("M", "");
    const keyIndex = KEY_NAMES.indexOf(baseKey);
    if (keyIndex === -1) return currentKey;

    const newIndex = (keyIndex + settings.keyShift + 12) % 12;
    const isMinor = currentKey.includes("m");
    return KEY_NAMES[newIndex] + (isMinor ? "m" : "");
  };

  const calculateNewBPM = () => {
    return Math.round(currentBPM * (1 + settings.tempoChange / 100));
  };

  const handlePreview = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setPreviewAvailable(true);
      toast.success("Preview generated!");
    }, 2000);
  };

  const handleApply = () => {
    toast.success(
      `Key shifted ${settings.keyShift > 0 ? "+" : ""}${settings.keyShift} semitones, Tempo ${settings.tempoChange > 0 ? "+" : ""}${settings.tempoChange}%`
    );
  };

  const handleReset = () => {
    setSettings({
      keyShift: 0,
      tempoChange: 0,
      preserveQuality: true,
      algorithm: "advanced",
    });
    setPreviewAvailable(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Key Shifting & Harmonic Transposition
            </h1>
            <p className="text-xs text-white/40">
              Adjust pitch and tempo independently with advanced algorithms
            </p>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Current Track Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Current Track</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Key
                </label>
                <select
                  value={currentKey}
                  onChange={(e) => setCurrentKey(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  {KEY_NAMES.map((key) => (
                    <>
                      <option key={key} value={key}>
                        {key}
                      </option>
                      <option key={`${key}m`} value={`${key}m`}>
                        {key}m
                      </option>
                    </>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  BPM
                </label>
                <input
                  type="number"
                  value={currentBPM}
                  onChange={(e) => setCurrentBPM(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  min="60"
                  max="200"
                />
              </div>
            </div>
          </div>

          {/* Key Shifting */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Key Shifting</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Semitones: {settings.keyShift > 0 ? "+" : ""}
                  {settings.keyShift}
                </label>
                <Slider
                  value={[settings.keyShift]}
                  min={-12}
                  max={12}
                  step={1}
                  onValueChange={(value) =>
                    setSettings({ ...settings, keyShift: value[0] })
                  }
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>-12 (Octave Down)</span>
                  <span>0 (Original)</span>
                  <span>+12 (Octave Up)</span>
                </div>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60 mb-1">New Key</p>
                    <p className="text-lg font-bold text-primary font-['IBM_Plex_Mono']">
                      {calculateNewKey()}
                    </p>
                  </div>
                  <Music className="w-8 h-8 text-primary/40" />
                </div>
              </div>

              {/* Harmonic Transposition Suggestions */}
              {settings.keyShift !== 0 && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-xs text-white/60 mb-2">Harmonic Suggestions:</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      settings.keyShift - 1,
                      settings.keyShift,
                      settings.keyShift + 1,
                    ].map((shift) => {
                      if (shift === settings.keyShift) return null;
                      const keyIndex = KEY_NAMES.indexOf(currentKey.replace("m", ""));
                      const newIndex = (keyIndex + shift + 12) % 12;
                      const isMinor = currentKey.includes("m");
                      const suggestedKey = KEY_NAMES[newIndex] + (isMinor ? "m" : "");
                      return (
                        <button
                          key={shift}
                          onClick={() => setSettings({ ...settings, keyShift: shift })}
                          className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white/80"
                        >
                          {suggestedKey} ({shift > 0 ? "+" : ""}
                          {shift})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tempo Change */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Tempo Adjustment</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Tempo Change: {settings.tempoChange > 0 ? "+" : ""}
                  {settings.tempoChange.toFixed(1)}%
                </label>
                <Slider
                  value={[settings.tempoChange]}
                  min={-50}
                  max={50}
                  step={0.1}
                  onValueChange={(value) =>
                    setSettings({ ...settings, tempoChange: value[0] })
                  }
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>-50% (Half Speed)</span>
                  <span>0% (Original)</span>
                  <span>+50% (Double Speed)</span>
                </div>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60 mb-1">New BPM</p>
                    <p className="text-lg font-bold text-primary font-['IBM_Plex_Mono']">
                      {calculateNewBPM()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Processing Algorithm</h2>
            <div className="grid grid-cols-3 gap-3">
              {(["standard", "advanced", "harmonic"] as const).map((algo) => (
                <button
                  key={algo}
                  onClick={() => setSettings({ ...settings, algorithm: algo })}
                  className={`p-3 rounded-lg border transition-colors ${
                    settings.algorithm === algo
                      ? "bg-primary/20 border-primary text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <p className="text-sm font-semibold capitalize">{algo}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {algo === "standard"
                      ? "Fast processing"
                      : algo === "advanced"
                      ? "Best quality"
                      : "Harmonic preservation"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Options */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.preserveQuality}
                onChange={(e) =>
                  setSettings({ ...settings, preserveQuality: e.target.checked })
                }
                className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
              />
              <div>
                <p className="text-sm font-medium text-white">Preserve Audio Quality</p>
                <p className="text-xs text-white/60">
                  Use advanced algorithms to minimize artifacts and preserve audio fidelity
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePreview}
                disabled={isProcessing}
                className="flex-1 bg-primary hover:bg-primary/80 text-white"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Preview
                  </>
                )}
              </Button>
              {previewAvailable && (
                <Button
                  onClick={handleApply}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
              )}
            </div>
            {previewAvailable && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-400">
                  Preview ready! New key: {calculateNewKey()}, New BPM: {calculateNewBPM()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

