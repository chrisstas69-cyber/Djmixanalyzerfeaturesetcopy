import { useState, useEffect } from "react";
import { X, Database, Zap } from "lucide-react";
import { Button } from "./ui/button";

type CreateState = "idle" | "rendering";

interface RadioGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

function RadioGroup({ options, selected, onChange }: RadioGroupProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 px-3 py-2 border rounded-sm font-['IBM_Plex_Mono'] text-xs transition-colors ${
            selected === option
              ? "bg-secondary/10 border-secondary/40 text-foreground"
              : "bg-background/50 border-border/50 text-muted-foreground hover:border-border"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

interface StructureBarProps {
  label: string;
  value: number;
}

function StructureBar({ label, value }: StructureBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-['IBM_Plex_Mono'] text-xs text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 bg-background/50 border border-border/30 rounded-sm overflow-hidden">
        <div className="h-full bg-secondary/60 rounded-sm" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function CreateTrack() {
  const [createState, setCreateState] = useState<CreateState>("idle");
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStep, setRenderStep] = useState("Resolving structure");

  // Active DNA
  const [activeDNA] = useState({
    name: "Basement Techno Core",
    source: "DJ Mix Analyzer",
    bpmRange: "126–132",
    keyRange: "4A–6A",
    energyRange: "7.6–9.1",
    status: "ACTIVE",
  });

  // Target parameters
  const [targetDuration, setTargetDuration] = useState("6:30");
  const [energyProfile, setEnergyProfile] = useState("Rising");
  const [introWeight] = useState(65);
  const [dropIntensity] = useState(85);
  const [outroDecay] = useState(40);

  // Render options
  const [renderQuality, setRenderQuality] = useState("Standard");
  const [outputFormat, setOutputFormat] = useState("WAV");

  // System preview
  const [preview] = useState({
    estimatedBpm: 128,
    expectedKeyCenter: "5A",
    energyCurve: "Rising",
    harmonicRisk: "Low",
    dnaConfidence: 0.91,
  });

  // Rendering simulation
  useEffect(() => {
    if (createState === "rendering") {
      const steps = [
        { step: "Resolving structure", duration: 2000 },
        { step: "Applying harmonic constraints", duration: 2500 },
        { step: "Shaping energy curve", duration: 3000 },
        { step: "Finalizing render", duration: 2500 },
      ];

      let currentProgress = 0;
      let stepIndex = 0;

      const interval = setInterval(() => {
        currentProgress += 1;
        setRenderProgress(currentProgress);

        // Update step based on progress
        if (currentProgress > 25 && stepIndex === 0) {
          stepIndex = 1;
          setRenderStep(steps[1].step);
        } else if (currentProgress > 50 && stepIndex === 1) {
          stepIndex = 2;
          setRenderStep(steps[2].step);
        } else if (currentProgress > 75 && stepIndex === 2) {
          stepIndex = 3;
          setRenderStep(steps[3].step);
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          // Reset to idle after completion
          setTimeout(() => {
            setCreateState("idle");
            setRenderProgress(0);
            setRenderStep("Resolving structure");
          }, 1000);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [createState]);

  // Rendering State
  if (createState === "rendering") {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-border px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Roboto_Condensed'] tracking-tight mb-1" style={{ fontWeight: 600 }}>
                CREATE TRACK
              </h1>
              <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
                System-Guided Generation
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-8" disabled>
                <X className="w-3 h-3 mr-1.5" />
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Rendering Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <div className="bg-card/30 border border-border/50 rounded-sm p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-secondary animate-pulse" />
                </div>
                <h2 className="font-['Roboto_Condensed'] mb-2 tracking-tight" style={{ fontWeight: 600 }}>
                  Rendering Track…
                </h2>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-background/50 border border-border/30 rounded-sm overflow-hidden mb-2">
                  <div
                    className="h-full bg-secondary transition-all duration-300 ease-linear"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between font-['IBM_Plex_Mono'] text-xs">
                  <span className="text-muted-foreground">{renderProgress}%</span>
                  <span className="text-secondary">{renderStep}</span>
                </div>
              </div>

              {/* Live Steps */}
              <div className="space-y-2 mb-6">
                <div
                  className={`flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs ${
                    renderProgress > 0 ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      renderProgress > 0 ? "bg-secondary" : "bg-muted-foreground/50"
                    }`}
                  />
                  <span>Resolving structure</span>
                </div>
                <div
                  className={`flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs ${
                    renderProgress > 25 ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      renderProgress > 25 ? "bg-secondary" : "bg-muted-foreground/50"
                    }`}
                  />
                  <span>Applying harmonic constraints</span>
                </div>
                <div
                  className={`flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs ${
                    renderProgress > 50 ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      renderProgress > 50 ? "bg-secondary" : "bg-muted-foreground/50"
                    }`}
                  />
                  <span>Shaping energy curve</span>
                </div>
                <div
                  className={`flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs ${
                    renderProgress > 75 ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      renderProgress > 75 ? "bg-secondary" : "bg-muted-foreground/50"
                    }`}
                  />
                  <span>Finalizing render</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-border/30 text-center">
                <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                  Estimated time remaining: ~{Math.ceil((100 - renderProgress) / 10)} minutes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Idle State - Creation Interface
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Roboto_Condensed'] tracking-tight mb-1" style={{ fontWeight: 600 }}>
              CREATE TRACK
            </h1>
            <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
              System-Guided Generation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-8">
              <X className="w-3 h-3 mr-1.5" />
              Cancel
            </Button>
            <Button variant="ghost" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-8" disabled>
              Save Preset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - DNA Selection */}
        <div className="w-80 border-r border-border bg-[#08080c] flex flex-col p-6">
          <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-[0.1em]">
            ACTIVE DNA
          </div>

          <div className="bg-card/30 border border-border/50 rounded-sm p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-['Roboto_Condensed'] mb-2 tracking-wide" style={{ fontWeight: 500 }}>
                  {activeDNA.name}
                </div>
                <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-3">
                  Derived from {activeDNA.source}
                </div>
              </div>
              <span className="font-['IBM_Plex_Mono'] text-xs px-2 py-1 rounded-sm bg-secondary/20 text-secondary flex-shrink-0">
                {activeDNA.status}
              </span>
            </div>
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground leading-relaxed space-y-1">
              <div>BPM {activeDNA.bpmRange}</div>
              <div className="text-primary">Keys {activeDNA.keyRange}</div>
              <div>Energy {activeDNA.energyRange}</div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full font-['IBM_Plex_Mono'] text-xs h-8">
            <Database className="w-3 h-3 mr-2" />
            Change DNA
          </Button>
        </div>

        {/* Center Panel - Target Parameters */}
        <div className="flex-1 flex flex-col p-6 overflow-auto">
          <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-6 tracking-[0.1em]">
            TARGET PARAMETERS
          </div>

          {/* Target Duration */}
          <div className="mb-8">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              TARGET DURATION
            </div>
            <div className="bg-card/30 border border-border/50 rounded-sm p-4">
              <RadioGroup
                options={["5:00", "6:00", "6:30", "7:00", "8:00"]}
                selected={targetDuration}
                onChange={setTargetDuration}
              />
            </div>
          </div>

          {/* Energy Target */}
          <div className="mb-8">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              ENERGY TARGET
            </div>
            <div className="bg-card/30 border border-border/50 rounded-sm p-4">
              <div className="mb-2 text-xs text-muted-foreground">Build Profile</div>
              <RadioGroup options={["Rising", "Plateau", "Peak Late"]} selected={energyProfile} onChange={setEnergyProfile} />
            </div>
          </div>

          {/* Structure Emphasis */}
          <div className="mb-6">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              STRUCTURE EMPHASIS
            </div>
            <div className="bg-card/30 border border-border/50 rounded-sm p-4 space-y-4">
              <StructureBar label="Intro Weight" value={introWeight} />
              <StructureBar label="Drop Intensity" value={dropIntensity} />
              <StructureBar label="Outro Decay" value={outroDecay} />
            </div>
          </div>
        </div>

        {/* Right Panel - Render Options */}
        <div className="w-80 border-l border-border bg-[#08080c] flex flex-col p-6">
          <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-6 tracking-[0.1em]">
            RENDER OPTIONS
          </div>

          {/* Render Quality */}
          <div className="mb-6">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              RENDER QUALITY
            </div>
            <div className="bg-card/30 border border-border/50 rounded-sm p-4">
              <RadioGroup options={["Draft", "Standard", "High"]} selected={renderQuality} onChange={setRenderQuality} />
            </div>
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              OUTPUT FORMAT
            </div>
            <div className="bg-card/30 border border-border/50 rounded-sm p-4">
              <RadioGroup options={["WAV", "FLAC"]} selected={outputFormat} onChange={setOutputFormat} />
            </div>
          </div>

          {/* Include Stems */}
          <div className="mb-6">
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              INCLUDE STEMS
            </div>
            <div className="bg-card/30 border border-border/50 rounded-sm p-4">
              <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground/50">Off</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - System Preview & Action */}
      <div className="border-t border-border bg-[#08080c]">
        <div className="px-6 py-4 flex items-end justify-between">
          {/* System Preview */}
          <div>
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-3 tracking-[0.1em]">
              SYSTEM PREVIEW
            </div>
            <div className="font-['IBM_Plex_Mono'] text-xs space-y-1.5">
              <div className="flex gap-8">
                <div>
                  <span className="text-muted-foreground">Estimated BPM: </span>
                  <span className="text-secondary">{preview.estimatedBpm}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Expected Key Center: </span>
                  <span className="text-primary">{preview.expectedKeyCenter}</span>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="text-muted-foreground">Energy Curve: </span>
                  <span className="text-foreground">{preview.energyCurve}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Harmonic Risk: </span>
                  <span className="text-foreground">{preview.harmonicRisk}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">DNA Confidence: </span>
                <span className="text-secondary">{preview.dnaConfidence.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Primary Action */}
          <div className="text-right">
            <Button
              size="lg"
              className="bg-secondary text-background hover:bg-secondary/90 font-['Roboto_Condensed'] px-8 h-12 mb-2"
              onClick={() => setCreateState("rendering")}
            >
              <Zap className="w-4 h-4 mr-2" />
              RENDER TRACK
            </Button>
            <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
              System will generate using active DNA and targets.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
