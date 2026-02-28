import { useState, useRef, useEffect } from "react";
import { Disc, RotateCcw, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

interface VinylState {
  isSpinning: boolean;
  speed: number; // -50% to +50% pitch bend
  scratchMode: "none" | "cue" | "scribble" | "transform";
  wearLevel: number; // 0-100 (noise level)
  brakeActive: boolean;
}

export function VinylEmulationPanel() {
  const [vinylState, setVinylState] = useState<VinylState>({
    isSpinning: false,
    speed: 0,
    scratchMode: "none",
    wearLevel: 0,
    brakeActive: false,
  });
  const [rotation, setRotation] = useState(0);
  const platterRef = useRef<HTMLDivElement>(null);
  const rotationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (vinylState.isSpinning) {
      const baseSpeed = 33.33; // RPM
      const adjustedSpeed = baseSpeed * (1 + vinylState.speed / 100);
      const rotationSpeed = (adjustedSpeed * 360) / 60; // degrees per second

      rotationIntervalRef.current = window.setInterval(() => {
        setRotation((prev) => (prev + rotationSpeed / 60) % 360);
      }, 16); // ~60fps
    } else {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    }

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, [vinylState.isSpinning, vinylState.speed]);

  const handleScratch = (mode: "cue" | "scribble" | "transform") => {
    setVinylState({ ...vinylState, scratchMode: mode });
    toast.info(`${mode.charAt(0).toUpperCase() + mode.slice(1)} scratch activated`);
  };

  const handleBrake = () => {
    setVinylState({ ...vinylState, brakeActive: !vinylState.brakeActive });
    if (!vinylState.brakeActive) {
      // Simulate pitch down on brake
      setVinylState((prev) => ({ ...prev, speed: Math.max(-50, prev.speed - 10) }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
          Vinyl Record Emulation
        </h1>
        <p className="text-xs text-white/40">
          Simulate turntable effects and vinyl manipulation
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Turntable Visualization */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Platter */}
                <div
                  ref={platterRef}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-gray-700"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: vinylState.isSpinning ? "none" : "transform 0.1s linear",
                  }}
                >
                  {/* Vinyl Grooves */}
                  <div className="absolute inset-4 rounded-full border-2 border-gray-600/30" />
                  <div className="absolute inset-8 rounded-full border border-gray-600/20" />
                  <div className="absolute inset-12 rounded-full border border-gray-600/20" />
                  <div className="absolute inset-16 rounded-full border border-gray-600/20" />

                  {/* Center Label */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                    <Disc className="w-8 h-8 text-white/40" />
                  </div>

                  {/* Wear/Noise Overlay */}
                  {vinylState.wearLevel > 0 && (
                    <div
                      className="absolute inset-0 rounded-full bg-black/40"
                      style={{ opacity: vinylState.wearLevel / 100 }}
                    />
                  )}
                </div>

                {/* Needle (Static) */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-gray-400 origin-top">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  setVinylState({ ...vinylState, isSpinning: !vinylState.isSpinning })
                }
                className="p-3 bg-primary hover:bg-primary/80 text-white rounded-full transition-colors"
              >
                {vinylState.isSpinning ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>
              <button
                onClick={() => {
                  setRotation(0);
                  setVinylState({ ...vinylState, isSpinning: false, speed: 0 });
                }}
                className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Pitch Bend */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Pitch Bend</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Speed: {vinylState.speed > 0 ? "+" : ""}
                  {vinylState.speed.toFixed(1)}%
                </label>
                <Slider
                  value={[vinylState.speed]}
                  min={-50}
                  max={50}
                  step={0.1}
                  onValueChange={(value) =>
                    setVinylState({ ...vinylState, speed: value[0] })
                  }
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>-50% (Slow)</span>
                  <span>0% (Normal)</span>
                  <span>+50% (Fast)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scratch Effects */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Scratch Effects</h2>
            <div className="grid grid-cols-3 gap-3">
              {(["cue", "scribble", "transform"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleScratch(mode)}
                  className={`p-4 rounded-lg border transition-colors ${
                    vinylState.scratchMode === mode
                      ? "bg-primary/20 border-primary text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <p className="text-sm font-semibold capitalize">{mode} Scratch</p>
                  <p className="text-xs text-white/40 mt-1">
                    {mode === "cue"
                      ? "Quick back-and-forth"
                      : mode === "scribble"
                      ? "Rapid forward motion"
                      : "Transform effect"}
                  </p>
                </button>
              ))}
            </div>
            {vinylState.scratchMode !== "none" && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary">
                  {vinylState.scratchMode.charAt(0).toUpperCase() +
                    vinylState.scratchMode.slice(1)}{" "}
                  scratch active. Move the platter to scratch.
                </p>
              </div>
            )}
          </div>

          {/* Vinyl Brake */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Vinyl Brake</h2>
              <button
                onClick={handleBrake}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  vinylState.brakeActive
                    ? "bg-red-500/20 border border-red-500/50 text-red-400"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {vinylState.brakeActive ? "Release Brake" : "Apply Brake"}
              </button>
            </div>
            <p className="text-xs text-white/60">
              Simulates stopping the platter with your hand, causing pitch to drop
            </p>
          </div>

          {/* Wear/Noise Effects */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Vinyl Wear & Noise</h2>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                Wear Level: {vinylState.wearLevel}%
              </label>
              <Slider
                value={[vinylState.wearLevel]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  setVinylState({ ...vinylState, wearLevel: value[0] })
                }
                className="w-full"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                <span>New (0%)</span>
                <span>Worn (50%)</span>
                <span>Heavy Wear (100%)</span>
              </div>
              <p className="text-xs text-white/50 mt-2">
                Simulates crackle, pops, and surface noise from old vinyl records
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

