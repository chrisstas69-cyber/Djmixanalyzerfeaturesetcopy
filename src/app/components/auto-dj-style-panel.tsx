import { useState } from "react";
import { ChevronDown, ChevronUp, Lock, Unlock } from "lucide-react";

interface Preset {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

const presets: Preset[] = [
  {
    id: "safe-club",
    name: "Safe Club",
    description: "Smooth, reliable transitions for any crowd",
  },
  {
    id: "peak-hour",
    name: "Peak Hour",
    description: "High-energy mixing for maximum dancefloor impact",
  },
  {
    id: "hypnotic",
    name: "Hypnotic",
    description: "Long blends that build tension gradually",
  },
  {
    id: "experimental",
    name: "Experimental",
    description: "Unpredictable, creative mixing choices",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Fine-tune every parameter to your taste",
  },
];

export function AutoDJStylePanel() {
  const [selectedPreset, setSelectedPreset] = useState("safe-club");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedLocked, setAdvancedLocked] = useState(true);

  // Advanced controls state
  const [transitionLength, setTransitionLength] = useState(60);
  const [energyVariation, setEnergyVariation] = useState(40);
  const [eqCreativity, setEqCreativity] = useState(30);
  const [riskTolerance, setRiskTolerance] = useState(20);

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    
    // Lock advanced controls unless Custom preset
    if (presetId !== "custom") {
      setAdvancedLocked(true);
    } else {
      setAdvancedLocked(false);
    }

    // Load preset values
    switch (presetId) {
      case "safe-club":
        setTransitionLength(60);
        setEnergyVariation(40);
        setEqCreativity(30);
        setRiskTolerance(20);
        break;
      case "peak-hour":
        setTransitionLength(45);
        setEnergyVariation(70);
        setEqCreativity(50);
        setRiskTolerance(40);
        break;
      case "hypnotic":
        setTransitionLength(85);
        setEnergyVariation(25);
        setEqCreativity(60);
        setRiskTolerance(30);
        break;
      case "experimental":
        setTransitionLength(50);
        setEnergyVariation(80);
        setEqCreativity(85);
        setRiskTolerance(75);
        break;
    }
  };

  return (
    <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-base font-semibold mb-1">Auto DJ Style</h2>
        <p className="text-xs text-white/50">Choose how the system mixes your tracks.</p>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`group relative p-4 rounded-xl border transition-all text-left ${
                isSelected
                  ? "bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/40 shadow-lg shadow-secondary/20"
                  : "bg-gradient-to-br from-white/[0.04] to-white/[0.01] border-white/10 hover:border-white/20 hover:from-white/[0.06] hover:to-white/[0.02]"
              }`}
            >
              {/* Selection Glow */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary/10 to-transparent opacity-50 pointer-events-none" />
              )}

              {/* Content */}
              <div className="relative">
                <div className={`text-sm font-semibold mb-1.5 transition-colors ${
                  isSelected ? "text-secondary" : "text-white/90 group-hover:text-white"
                }`}>
                  {preset.name}
                </div>
                <div className={`text-xs leading-snug transition-colors ${
                  isSelected ? "text-white/70" : "text-white/50 group-hover:text-white/60"
                }`}>
                  {preset.description}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary shadow-lg shadow-secondary/50" />
              )}
            </button>
          );
        })}
      </div>

      {/* Advanced Controls Toggle */}
      <div className="border-t border-white/10 pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm"
        >
          <span className="font-medium">Fine-tune style</span>
          <div className="flex items-center gap-2">
            {advancedLocked && (
              <Lock className="w-3.5 h-3.5 text-white/40" />
            )}
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-white/60" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/60" />
            )}
          </div>
        </button>

        {/* Advanced Controls */}
        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 rounded-xl bg-black/30 border border-white/5">
            {/* Lock Notice */}
            {advancedLocked && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <Lock className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-white/60 leading-relaxed">
                  Advanced controls are locked to preserve the <span className="text-secondary font-medium">{presets.find(p => p.id === selectedPreset)?.name}</span> preset. Select <span className="text-white/80 font-medium">Custom</span> to adjust manually.
                </div>
              </div>
            )}

            {/* Sliders */}
            <div className={`space-y-4 transition-opacity ${advancedLocked ? "opacity-40 pointer-events-none" : ""}`}>
              {/* Transition Length */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-['IBM_Plex_Mono'] text-white/70 uppercase tracking-wider">
                    Transition Length
                  </label>
                  <span className="text-xs font-['IBM_Plex_Mono'] text-white/50">
                    {transitionLength}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={transitionLength}
                  onChange={(e) => !advancedLocked && setTransitionLength(Number(e.target.value))}
                  disabled={advancedLocked}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary/50 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-secondary/50 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/40">Quick</span>
                  <span className="text-xs text-white/40">Long</span>
                </div>
              </div>

              {/* Energy Variation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-['IBM_Plex_Mono'] text-white/70 uppercase tracking-wider">
                    Energy Variation
                  </label>
                  <span className="text-xs font-['IBM_Plex_Mono'] text-white/50">
                    {energyVariation}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={energyVariation}
                  onChange={(e) => !advancedLocked && setEnergyVariation(Number(e.target.value))}
                  disabled={advancedLocked}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary/50 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-secondary/50 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/40">Steady</span>
                  <span className="text-xs text-white/40">Dynamic</span>
                </div>
              </div>

              {/* EQ Creativity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-['IBM_Plex_Mono'] text-white/70 uppercase tracking-wider">
                    EQ Creativity
                  </label>
                  <span className="text-xs font-['IBM_Plex_Mono'] text-white/50">
                    {eqCreativity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={eqCreativity}
                  onChange={(e) => !advancedLocked && setEqCreativity(Number(e.target.value))}
                  disabled={advancedLocked}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary/50 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-secondary/50 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/40">Safe</span>
                  <span className="text-xs text-white/40">Bold</span>
                </div>
              </div>

              {/* Risk Tolerance */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-['IBM_Plex_Mono'] text-white/70 uppercase tracking-wider">
                    Risk Tolerance
                  </label>
                  <span className="text-xs font-['IBM_Plex_Mono'] text-white/50">
                    {riskTolerance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskTolerance}
                  onChange={(e) => !advancedLocked && setRiskTolerance(Number(e.target.value))}
                  disabled={advancedLocked}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary/50 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-secondary/50 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/40">Conservative</span>
                  <span className="text-xs text-white/40">Adventurous</span>
                </div>
              </div>
            </div>

            {/* Apply Custom Button */}
            {!advancedLocked && (
              <div className="pt-2">
                <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary border border-secondary/50 text-white text-sm font-medium shadow-lg shadow-secondary/20 transition-all">
                  Apply Custom Style
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
