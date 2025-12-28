import { useState, useEffect } from "react";
import { ArrowLeft, Dna, Zap, Activity, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceDot } from "recharts";

type AnalysisState = "empty" | "processing" | "complete";

interface StructureSegment {
  label: string;
  startTime: string;
  endTime: string;
  bars: number;
  confidence: number;
}

const energyFlowData = [
  { time: "0:00", energy: 3.2 },
  { time: "0:30", energy: 4.1 },
  { time: "1:00", energy: 5.3 },
  { time: "1:30", energy: 6.2 },
  { time: "2:00", energy: 7.1 },
  { time: "2:30", energy: 7.8 },
  { time: "3:00", energy: 8.4 },
  { time: "3:30", energy: 8.9 },
  { time: "4:00", energy: 9.1, peak: true },
  { time: "4:30", energy: 8.6 },
  { time: "5:00", energy: 7.9 },
  { time: "5:30", energy: 7.2 },
  { time: "6:00", energy: 6.1 },
  { time: "6:32", energy: 4.8 },
];

const structureSegments: StructureSegment[] = [
  { label: "Intro", startTime: "0:00", endTime: "1:04", bars: 16, confidence: 0.96 },
  { label: "Build", startTime: "1:04", endTime: "2:08", bars: 16, confidence: 0.93 },
  { label: "Drop", startTime: "2:08", endTime: "4:16", bars: 32, confidence: 0.98 },
  { label: "Break", startTime: "4:16", endTime: "5:20", bars: 16, confidence: 0.91 },
  { label: "Drop", startTime: "5:20", endTime: "6:00", bars: 10, confidence: 0.89 },
  { label: "Outro", startTime: "6:00", endTime: "6:32", bars: 8, confidence: 0.94 },
];

const analysisSteps = [
  "Segmenting structure",
  "Detecting phrase boundaries",
  "Extracting BPM and groove",
  "Resolving harmonic profile",
  "Mapping energy curve",
];

export function AnalysisScreen() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("complete");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (analysisState === "processing") {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setAnalysisState("complete"), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % analysisSteps.length);
      }, 1200);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      };
    }
  }, [analysisState]);

  // Empty State
  if (analysisState === "empty") {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Roboto_Condensed'] tracking-tight mb-1" style={{ fontWeight: 600 }}>
                ANALYSIS
              </h1>
              <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
                Structural · Harmonic · Energy
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-8 rounded-sm">
                <ArrowLeft className="w-3 h-3 mr-1.5" />
                Back to Library
              </Button>
            </div>
          </div>
        </div>

        {/* Empty Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-sm bg-card border border-border flex items-center justify-center">
              <Activity className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-['Roboto_Condensed'] mb-2 tracking-tight" style={{ fontWeight: 600 }}>
              NO ANALYSIS AVAILABLE
            </h2>
            <p className="text-sm text-muted-foreground mb-6 font-['IBM_Plex_Mono']">
              This artifact has not been analyzed yet.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-['Roboto_Condensed']"
              onClick={() => setAnalysisState("processing")}
            >
              <Activity className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Processing State
  if (analysisState === "processing") {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Roboto_Condensed'] tracking-tight mb-1" style={{ fontWeight: 600 }}>
                ANALYSIS
              </h1>
              <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
                Structural · Harmonic · Energy
              </p>
            </div>
          </div>
        </div>

        {/* Processing Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <div className="bg-card border border-border rounded-sm p-8">
              <h2 className="font-['Roboto_Condensed'] mb-6 text-center tracking-tight" style={{ fontWeight: 600 }}>
                Analyzing Audio…
              </h2>

              {/* Progress Bar */}
              <div className="mb-6">
                <Progress value={progress} className="h-1" />
                <div className="flex justify-between mt-2 font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                  <span>{progress}%</span>
                  <span>Complete</span>
                </div>
              </div>

              {/* Live Steps */}
              <div className="space-y-2 mb-6 font-['IBM_Plex_Mono'] text-sm">
                {analysisSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`transition-all ${
                      idx === currentStep
                        ? "text-secondary"
                        : idx < currentStep
                        ? "text-muted-foreground/50"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>

              {/* Time Remaining */}
              <div className="text-center font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                Estimated time remaining: ~{Math.max(0, Math.ceil((100 - progress) / 50))} minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete State
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Roboto_Condensed'] tracking-tight mb-1" style={{ fontWeight: 600 }}>
              ANALYSIS
            </h1>
            <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
              Structural · Harmonic · Energy
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-8 rounded-sm">
              <ArrowLeft className="w-3 h-3 mr-1.5" />
              Back to Library
            </Button>
            <Button variant="outline" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-8 rounded-sm">
              <Dna className="w-3 h-3 mr-1.5" />
              Create DNA
            </Button>
            <Button variant="outline" size="sm" className="font-['IBM_Plex_Mono'] text-xs h-8 rounded-sm">
              <Zap className="w-3 h-3 mr-1.5" />
              Render Track
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 flex gap-6">
          {/* Left Panel — Summary */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="font-['Roboto_Condensed'] mb-4 tracking-tight" style={{ fontWeight: 600 }}>
                SUMMARY
              </h3>
              <div className="space-y-3 font-['IBM_Plex_Mono'] text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BPM:</span>
                  <span className="text-secondary">128.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Key:</span>
                  <span className="text-primary">5A (Minor)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Energy (Avg):</span>
                  <span className="text-foreground">7.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Energy (Peak):</span>
                  <span className="text-foreground">9.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-foreground">06:32</span>
                </div>
                <div className="flex justify-between border-t border-border/30 pt-3">
                  <span className="text-muted-foreground">Dynamic Range:</span>
                  <span className="text-foreground">Medium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className="flex-1">
            {/* Energy Flow */}
            <div className="bg-card border border-border rounded-sm p-4 mb-6">
              <h3 className="font-['Roboto_Condensed'] mb-4 tracking-tight" style={{ fontWeight: 600 }}>
                ENERGY FLOW
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={energyFlowData}>
                  <XAxis
                    dataKey="time"
                    stroke="#71717a"
                    tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }}
                    tickLine={false}
                    axisLine={{ stroke: "#27272a" }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#71717a"
                    tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }}
                    tickLine={false}
                    axisLine={{ stroke: "#27272a" }}
                    ticks={[0, 2, 4, 6, 8, 10]}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                  />
                  {energyFlowData
                    .filter((d) => d.peak)
                    .map((d, idx) => (
                      <ReferenceDot
                        key={idx}
                        x={d.time}
                        y={d.energy}
                        r={4}
                        fill="#ff9500"
                        stroke="none"
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
              <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-3">
                Peak intensity reached at 04:12
              </p>
            </div>

            {/* Structure Timeline */}
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="font-['Roboto_Condensed'] mb-4 tracking-tight" style={{ fontWeight: 600 }}>
                STRUCTURE
              </h3>
              
              {/* Timeline Bar */}
              <div className="flex h-12 rounded-sm overflow-hidden mb-4 border border-border/50">
                {structureSegments.map((segment, idx) => {
                  const totalBars = structureSegments.reduce((acc, s) => acc + s.bars, 0);
                  const widthPercent = (segment.bars / totalBars) * 100;
                  
                  return (
                    <div
                      key={idx}
                      className="relative group cursor-pointer transition-all hover:opacity-90"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor:
                          idx % 2 === 0
                            ? "rgba(168, 85, 247, 0.1)"
                            : "rgba(255, 149, 0, 0.1)",
                        borderRight: idx < structureSegments.length - 1 ? "1px solid #27272a" : "none",
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-['IBM_Plex_Mono'] text-xs text-foreground">
                          {segment.label}
                        </span>
                        <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          {segment.bars}b
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Segment Details */}
              <div className="space-y-2">
                {structureSegments.map((segment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between font-['IBM_Plex_Mono'] text-xs pb-2 border-b border-border/30 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-foreground w-16">{segment.label}</span>
                      <span className="text-muted-foreground">
                        {segment.startTime} – {segment.endTime}
                      </span>
                      <span className="text-muted-foreground">{segment.bars} bars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${segment.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-8">
                        {Math.round(segment.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel — Harmonic Profile */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="font-['Roboto_Condensed'] mb-4 tracking-tight" style={{ fontWeight: 600 }}>
                HARMONIC PROFILE
              </h3>
              
              {/* Camelot Wheel (simplified) */}
              <div className="mb-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <span className="font-['IBM_Plex_Mono'] text-primary">5A</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 font-['IBM_Plex_Mono'] text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-2 tracking-wider">
                    COMPATIBLE KEYS
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm text-xs">
                      4A
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm text-xs">
                      6A
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm text-xs">
                      5B
                    </span>
                  </div>
                </div>

                <div className="border-t border-border/30 pt-3">
                  <p className="text-xs text-muted-foreground">
                    High harmonic compatibility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel — System Notes */}
        <div className="px-6 pb-6">
          <div className="bg-[#0a0a0f] border border-border rounded-sm p-4">
            <h3 className="font-['Roboto_Condensed'] mb-3 tracking-tight" style={{ fontWeight: 600 }}>
              SYSTEM NOTES
            </h3>
            <div className="space-y-2 font-['IBM_Plex_Mono'] text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Phrase boundaries detected (16 bars)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">BPM stabilized at 128.0</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Harmonic profile resolved (5A)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Energy slope identified as rising</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Suitable for long blends</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
