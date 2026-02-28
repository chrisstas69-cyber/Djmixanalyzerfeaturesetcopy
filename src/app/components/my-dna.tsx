import { useState } from "react";
import { Info, Lock, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

type DNAState = "empty" | "active";

interface ActiveDNAProfile {
  id: string;
  name: string;
  artifactCount: number;
  confidenceScore: number;
  bpmRange: string;
  dominantKeys: string[];
  avgEnergy: number;
  peakEnergy: number;
}

interface IndustrialToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  readOnly?: boolean;
}

function IndustrialToggle({ label, enabled, onChange, readOnly = false }: IndustrialToggleProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 border rounded-sm transition-colors ${
        enabled
          ? "bg-secondary/10 border-secondary/40 text-foreground"
          : "bg-background/50 border-border/50 text-muted-foreground"
      } ${readOnly ? "opacity-60 cursor-default" : "cursor-pointer"}`}
      onClick={() => !readOnly && onChange(!enabled)}
    >
      <span className="font-['IBM_Plex_Mono'] text-xs">{label}</span>
      <div
        className={`w-8 h-4 rounded-sm border flex items-center transition-all ${
          enabled
            ? "bg-secondary/30 border-secondary/60 justify-end"
            : "bg-background border-border/50 justify-start"
        }`}
      >
        <div
          className={`w-3 h-3 rounded-sm mx-0.5 transition-colors ${
            enabled ? "bg-secondary" : "bg-muted-foreground/50"
          }`}
        />
      </div>
    </div>
  );
}

interface RadioGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

function RadioGroup({ options, selected, onChange, readOnly = false }: RadioGroupProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => !readOnly && onChange(option)}
          disabled={readOnly}
          className={`flex-1 px-3 py-2 border rounded-sm font-['IBM_Plex_Mono'] text-xs transition-colors ${
            selected === option
              ? "bg-secondary/10 border-secondary/40 text-foreground"
              : "bg-background/50 border-border/50 text-muted-foreground"
          } ${readOnly ? "opacity-60 cursor-default" : "hover:border-border cursor-pointer"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function MyDNA() {
  // Start with empty state - no active DNA until user uploads reference tracks
  const [dnaState, setDNAState] = useState<DNAState>("empty");
  
  // No mock DNA data - will only exist after real upload + analysis
  const [activeDNA, setActiveDNA] = useState<ActiveDNAProfile | null>(null);

  // Tempo controls
  const [minBpm, setMinBpm] = useState([126]);
  const [maxBpm, setMaxBpm] = useState([132]);
  const [preferredBpm] = useState(128);

  // Energy controls
  const [avgEnergy] = useState(7.6);
  const [peakEnergy, setPeakEnergy] = useState([9.1]);

  // Tolerance
  const [dynamicTolerance, setDynamicTolerance] = useState("Medium");

  // Harmonic controls
  const [dominantKey] = useState("5A");
  const [compatibleKeys] = useState(["4A", "6A", "8A"]);
  const [harmonicStrictness, setHarmonicStrictness] = useState([50]);
  const [conflictAllowance] = useState("±1");

  // Transition toggles
  const [longBlends, setLongBlends] = useState(true);
  const [bassSwaps, setBassSwaps] = useState(true);
  const [filterSweeps, setFilterSweeps] = useState(true);
  const [hardCuts, setHardCuts] = useState(false);
  const [transitionLength, setTransitionLength] = useState("Medium");

  // System response
  const [energyReactionSpeed, setEnergyReactionSpeed] = useState("Balanced");
  const [phraseAlignment, setPhraseAlignment] = useState("Preferred");

  // Empty State
  if (dnaState === "empty" || !activeDNA) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Empty Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-sm bg-card border-2 border-border/30 flex items-center justify-center">
              <Lock className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <h2 className="font-['Roboto_Condensed'] mb-2 tracking-tight" style={{ fontWeight: 600 }}>
              No Active DNA
            </h2>
            <p className="text-sm text-muted-foreground mb-4 font-['IBM_Plex_Mono'] leading-relaxed">
              Upload reference tracks in the DNA Library tab.<br />
              Then activate a DNA profile to view it here.
            </p>
            <div className="mt-6 p-4 bg-secondary/5 border border-secondary/20 rounded-sm text-left">
              <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground uppercase tracking-wider mb-2">
                DNA Creation Flow
              </div>
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <span className="text-secondary">1.</span>
                  <span>Upload music → DNA Library tab</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">2.</span>
                  <span>System analyzes your taste</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">3.</span>
                  <span>Activate DNA → View here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active State - Calibration Interface
  return (
    <div className="h-full flex flex-col bg-background overflow-auto">
      {/* Header */}
      <div className="border-b border-border px-6 py-6">
        <h1 className="text-2xl font-semibold mb-2 tracking-tight">
          Active DNA
        </h1>
        <p className="text-sm text-muted-foreground">
          This DNA influences future track generation and auto-mixing behavior.
        </p>
      </div>

      {/* DNA Profile Name & Status */}
      <div className="mx-6 mt-6 bg-card/30 border border-border/50 rounded-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium mb-1">{activeDNA.name}</div>
            <div className="text-xs text-muted-foreground">
              Derived from reference upload
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-['IBM_Plex_Mono'] text-xs px-2 py-1 rounded-sm bg-secondary/20 text-secondary">
              ACTIVE
            </span>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Confidence
              </div>
              <div className="font-['IBM_Plex_Mono'] text-xs text-secondary">
                {(activeDNA.confidenceScore * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="px-6 py-6 space-y-6">
        {/* Tempo Profile */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-['Roboto_Condensed'] tracking-tight" style={{ fontWeight: 600 }}>
              TEMPO PROFILE
            </h3>
            <Lock className="w-3 h-3 text-muted-foreground/50" />
          </div>
          <div className="bg-card/30 border border-border/50 rounded-sm p-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Range
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-white/90">
                  {minBpm[0]}–{maxBpm[0]} BPM
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Preferred
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-secondary">
                  {preferredBpm} BPM
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Tolerance
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-white/90">
                  {dynamicTolerance}
                </div>
              </div>
            </div>
            
            {/* Locked Slider Visualization */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">BPM Range</span>
                <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                  {minBpm[0]}–{maxBpm[0]}
                </span>
              </div>
              <div className="h-1.5 bg-background/50 rounded-sm relative overflow-hidden">
                <div
                  className="absolute h-full bg-secondary/30 rounded-sm"
                  style={{
                    left: `${((minBpm[0] - 100) / 50) * 100}%`,
                    width: `${((maxBpm[0] - minBpm[0]) / 50) * 100}%`,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-secondary"
                  style={{
                    left: `${((preferredBpm - 100) / 50) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-muted-foreground">100</span>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-muted-foreground">150</span>
              </div>
            </div>
          </div>
        </div>

        {/* Harmonic Profile */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-['Roboto_Condensed'] tracking-tight" style={{ fontWeight: 600 }}>
              HARMONIC PROFILE
            </h3>
            <Lock className="w-3 h-3 text-muted-foreground/50" />
          </div>
          <div className="bg-card/30 border border-border/50 rounded-sm p-4">
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Dominant Key
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-secondary">
                  {dominantKey}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Conflict Allowance
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-white/90">
                  {conflictAllowance} key step
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                Compatible Keys
              </div>
              <div className="flex gap-2">
                {compatibleKeys.map((key) => (
                  <span
                    key={key}
                    className="font-['IBM_Plex_Mono'] text-xs px-3 py-1.5 rounded-sm bg-secondary/10 border border-secondary/20 text-secondary"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>

            {/* Locked Strictness Indicator */}
            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Harmonic Strictness</span>
                <span className="font-['IBM_Plex_Mono'] text-xs text-white/90">
                  {harmonicStrictness[0] < 33 ? "Strict" : harmonicStrictness[0] < 66 ? "Balanced" : "Adaptive"}
                </span>
              </div>
              <div className="h-1.5 bg-background/50 rounded-sm relative overflow-hidden">
                <div
                  className="absolute h-full bg-secondary/30 rounded-sm"
                  style={{ width: `${harmonicStrictness[0]}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-muted-foreground">Strict</span>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-muted-foreground">Adaptive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Curve */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-['Roboto_Condensed'] tracking-tight" style={{ fontWeight: 600 }}>
              ENERGY CURVE
            </h3>
            <Lock className="w-3 h-3 text-muted-foreground/50" />
          </div>
          <div className="bg-card/30 border border-border/50 rounded-sm p-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Average
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-white/90">
                  {avgEnergy.toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Peak
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-secondary">
                  {peakEnergy[0].toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Reaction Speed
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-white/90">
                  {energyReactionSpeed}
                </div>
              </div>
            </div>

            {/* Simple Energy Bar Visualization */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Energy Range</span>
                <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                  {avgEnergy.toFixed(1)}–{peakEnergy[0].toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 bg-background/50 rounded-sm relative overflow-hidden">
                <div
                  className="absolute h-full bg-secondary/30 rounded-sm"
                  style={{
                    left: `${(avgEnergy / 10) * 100}%`,
                    width: `${((peakEnergy[0] - avgEnergy) / 10) * 100}%`,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-secondary"
                  style={{
                    left: `${(peakEnergy[0] / 10) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-muted-foreground">0</span>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-muted-foreground">10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transition Behavior */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-['Roboto_Condensed'] tracking-tight" style={{ fontWeight: 600 }}>
              TRANSITION BEHAVIOR
            </h3>
            <Lock className="w-3 h-3 text-muted-foreground/50" />
          </div>
          <div className="bg-card/30 border border-border/50 rounded-sm p-4">
            <div className="mb-4">
              <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-3">
                Preferred Techniques
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Long Blends", enabled: longBlends },
                  { label: "Bass Swaps", enabled: bassSwaps },
                  { label: "Filter Sweeps", enabled: filterSweeps },
                  { label: "Hard Cuts", enabled: hardCuts },
                ].map((technique) => (
                  <div
                    key={technique.label}
                    className={`px-3 py-1.5 rounded-sm border text-xs font-['IBM_Plex_Mono'] ${
                      technique.enabled
                        ? "bg-secondary/10 border-secondary/30 text-secondary"
                        : "bg-background/50 border-border/50 text-muted-foreground"
                    }`}
                  >
                    {technique.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/30">
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Transition Length
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-white/90">
                  {transitionLength}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider mb-2">
                  Phrase Alignment
                </div>
                <div className="font-['IBM_Plex_Mono'] text-sm text-white/90">
                  {phraseAlignment}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-border px-6 py-4 bg-[#08080c] mt-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Changes affect future renders only.</span>
        </div>
      </div>
    </div>
  );
}