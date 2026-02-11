import React, { useState } from "react";
import { Upload, Play, Eye, Download, Save, FileText, Check, AlertCircle, Activity, Music, Key, Zap, ArrowRightLeft, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

type AnalysisState = "empty" | "uploading" | "analyzing" | "complete" | "error";

interface Track {
  id: number;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  energy: number;
  style: string[];
  timeRange: string;
}

const mockTracks: Track[] = [
  { id: 1, name: "Space Date", artist: "Adam Beyer", bpm: 129, key: "4A", energy: 7, style: ["Deep Techno", "Hypnotic"], timeRange: "0:00 – 7:30" },
  { id: 2, name: "Teach Me", artist: "Amelie Lens", bpm: 130, key: "5A", energy: 8, style: ["Peak Techno", "Industrial"], timeRange: "7:30 – 15:00" },
  { id: 3, name: "Patterns", artist: "ANNA", bpm: 131, key: "6A", energy: 9, style: ["Peak Techno", "Hypnotic"], timeRange: "15:00 – 22:30" },
  { id: 4, name: "Drumcode ID", artist: "Unknown", bpm: 132, key: "6A", energy: 10, style: ["Peak Techno"], timeRange: "22:30 – 30:00" },
  { id: 5, name: "Acid Thunder", artist: "Chris Liebing", bpm: 131, key: "5A", energy: 9, style: ["Peak Techno", "Industrial"], timeRange: "30:00 – 37:30" },
  { id: 6, name: "Terminal", artist: "Len Faki", bpm: 130, key: "8B", energy: 8, style: ["Deep Techno"], timeRange: "37:30 – 45:00" },
  { id: 7, name: "Unhinged", artist: "I Hate Models", bpm: 133, key: "7A", energy: 10, style: ["Peak Techno", "Industrial"], timeRange: "45:00 – 52:30" },
  { id: 8, name: "Black Mesa", artist: "Pig&Dan", bpm: 131, key: "6A", energy: 9, style: ["Peak Techno", "Hypnotic"], timeRange: "52:30 – 60:00" },
  { id: 9, name: "Warehouse", artist: "Slam", bpm: 130, key: "5A", energy: 7, style: ["Deep Techno"], timeRange: "60:00 – 67:30" },
  { id: 10, name: "Basement", artist: "Perc", bpm: 129, key: "4A", energy: 6, style: ["Deep Techno", "Minimal"], timeRange: "67:30 – 75:00" },
  { id: 11, name: "After Hours", artist: "Dax J", bpm: 128, key: "4A", energy: 5, style: ["Deep Techno", "Minimal"], timeRange: "75:00 – 82:30" },
  { id: 12, name: "Last Call", artist: "Rebekah", bpm: 127, key: "4A", energy: 4, style: ["Deep Techno", "Minimal"], timeRange: "82:30 – 90:00" },
];

const energyFlowData = mockTracks.map((track, idx) => ({
  name: `${idx * 7.5}m`,
  energy: track.energy,
}));

const keyDistribution = [
  { key: "4A", count: 4, percentage: 33 },
  { key: "5A", count: 3, percentage: 25 },
  { key: "6A", count: 3, percentage: 25 },
  { key: "7A", count: 1, percentage: 8 },
  { key: "8B", count: 1, percentage: 8 },
];

const bpmRangeData = [
  { range: "126–128", count: 2 },
  { range: "129–131", count: 7 },
  { range: "132–134", count: 3 },
];

const styleBreakdown = [
  { name: "Peak Techno", count: 8 },
  { name: "Deep Techno", count: 7 },
  { name: "Hypnotic", count: 4 },
  { name: "Industrial", count: 3 },
  { name: "Minimal", count: 3 },
];

export function DJMixAnalyzerV2() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("empty");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    "Segmenting structure",
    "Detecting phrase boundaries",
    "Extracting BPM and groove",
    "Mapping energy curve",
  ];

  const handleUpload = () => {
    setAnalysisState("uploading");
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setAnalysisState("analyzing");
          setAnalysisStep(0);

          const analyzeInterval = setInterval(() => {
            setAnalysisStep((prevStep) => {
              if (prevStep >= 3) {
                clearInterval(analyzeInterval);
                setTimeout(() => {
                  setAnalysisState("complete");
                }, 800);
                return 3;
              }
              return prevStep + 1;
            });
          }, 800);

          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  if (analysisState === "error") {
    return (
      <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
        <div className="w-full max-w-[1600px] mx-auto flex-1 flex items-center justify-center py-16">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <div className="relative z-50 w-full max-w-lg mx-auto px-8">
          <div className="bg-card border border-destructive/30 rounded-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h3 className="font-['Roboto_Condensed'] mb-2 tracking-tight" style={{ fontWeight: 600 }}>
              Analysis Failed
            </h3>
            <p className="text-muted-foreground text-sm mb-6 font-['IBM_Plex_Mono']">
              Unable to process audio file. Check format and try again.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setAnalysisState("empty")}>
                Retry
              </Button>
              <Button className="bg-primary text-primary-foreground">Support</Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (analysisState === "uploading") {
    return (
      <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
        <div className="w-full max-w-[1600px] mx-auto flex-1 flex items-center justify-center py-16">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <div className="relative z-50 w-full max-w-lg mx-auto px-8">
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="font-['Roboto_Condensed'] mb-3 tracking-tight" style={{ fontWeight: 600 }}>
              Uploading mix
            </h3>
            <Progress value={uploadProgress} className="mb-3" />
            <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
              {uploadProgress}% · Preparing audio pipeline
            </p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (analysisState === "analyzing") {
    return (
      <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
        <div className="w-full max-w-[1600px] mx-auto flex-1 flex items-center justify-center py-16">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <div className="relative z-50 w-full max-w-lg mx-auto px-8">
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="font-['Roboto_Condensed'] mb-4 tracking-tight" style={{ fontWeight: 600 }}>
              Analyzing audio
            </h3>
            <div className="font-['IBM_Plex_Mono'] text-xs space-y-4 mb-6 text-left">
              {analysisSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 ${
                    idx < analysisStep
                      ? "text-primary"
                      : idx === analysisStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {idx < analysisStep ? (
                    <Check className="w-4 h-4" />
                  ) : idx === analysisStep ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
              ~{Math.max(0, 3 - analysisStep)} minutes remaining
            </p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (analysisState === "complete") {
    return (
      <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
        <div className="w-full max-w-[1600px] mx-auto px-8 py-16">
          <div className="flex gap-8">
            {/* Left Sidebar - Fixed Width */}
            <div className="w-[320px] flex-shrink-0">
              <div className="space-y-6">
                {/* Stat Card 1 - BPM Average */}
                <div className="bg-card border border-border rounded-sm p-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-5xl font-bold mb-2">128</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">BPM AVERAGE</div>
                  <div className="text-sm text-muted-foreground">Range: 126-130 BPM</div>
                </div>

                {/* Stat Card 2 - Key Changes */}
                <div className="bg-card border border-border rounded-sm p-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                    <Key className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-5xl font-bold mb-2">7</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">KEY CHANGES</div>
                  <div className="flex gap-2 flex-wrap">
                    {["4A", "5A", "6A", "7A", "8B"].map((key) => (
                      <Badge key={key} variant="outline" className="font-['IBM_Plex_Mono'] text-xs">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stat Card 3 - Energy Peaks */}
                <div className="bg-card border border-border rounded-sm p-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-5xl font-bold mb-2">4</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">ENERGY PEAKS</div>
                  <div className="text-sm text-muted-foreground">Avg Intensity: 78%</div>
                </div>

                {/* Stat Card 4 - Transitions */}
                <div className="bg-card border border-border rounded-sm p-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                    <ArrowRightLeft className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-5xl font-bold mb-2">24</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">TRANSITIONS</div>
                  <div className="text-sm text-muted-foreground">Smooth: 21 · Hard: 3</div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
              {/* Status Banner */}
              <div className="bg-primary/5 border border-primary/10 rounded-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <h3 className="font-['Roboto_Condensed'] tracking-tight" style={{ fontWeight: 600 }}>
                      Analysis Complete
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAnalysisState("empty")}
                    className="font-['Roboto_Condensed'] text-xs"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1.5" />
                    Upload New Mix
                  </Button>
                </div>
                <div className="grid grid-cols-5 gap-8 font-['IBM_Plex_Mono'] text-xs">
                  <div>
                    <div className="text-muted-foreground mb-1 tracking-wider">TITLE</div>
                    <div className="text-sm">Carl Cox — Space Ibiza</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 tracking-wider">DURATION</div>
                    <div className="text-secondary">90:00</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 tracking-wider">TRACKS</div>
                    <div className="text-primary">12</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 tracking-wider">AVG BPM</div>
                    <div className="text-secondary">130</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 tracking-wider">KEY RANGE</div>
                    <div className="text-primary">4A – 8B</div>
                  </div>
                </div>
              </div>

            {/* Tracks Table */}
            <div className="bg-card border border-border rounded-sm overflow-hidden mb-8">
              <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/5 hover:bg-muted/5">
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs h-10">#</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">TRACK</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">ARTIST</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">BPM</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">KEY</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">ENERGY</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">STYLE</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">TIME</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTracks.map((track) => (
                  <TableRow key={track.id} className="border-b border-border/30 hover:bg-muted/20">
                    <TableCell className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                      {track.id.toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell className="text-sm">{track.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{track.artist}</TableCell>
                    <TableCell className="font-['IBM_Plex_Mono'] text-sm text-secondary">
                      {track.bpm}
                    </TableCell>
                    <TableCell className="font-['IBM_Plex_Mono'] text-sm text-primary">
                      {track.key}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-['IBM_Plex_Mono'] text-xs w-8">{track.energy}/10</span>
                        <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${track.energy * 10}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {track.style.map((s, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="font-['IBM_Plex_Mono'] text-xs px-1.5 py-0 rounded-sm"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                      {track.timeRange}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 font-['IBM_Plex_Mono'] text-xs">
                          Generate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>

            {/* Bottom Actions */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border mt-8 py-6 flex items-center justify-between">
              <div className="flex gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-['Roboto_Condensed']">
                  Assemble Mix
                </Button>
                <Button variant="outline" className="font-['Roboto_Condensed']">
                  Generate All Tracks
                </Button>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="font-['IBM_Plex_Mono'] text-xs">
                  <FileText className="w-3 h-3 mr-1.5" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="font-['IBM_Plex_Mono'] text-xs">
                  <Save className="w-3 h-3 mr-1.5" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnalysisState("empty")}
                  className="font-['Roboto_Condensed'] text-xs"
                >
                  <Upload className="w-3 h-3 mr-1.5" />
                  New Analysis
                </Button>
              </div>
            </div>
          </div>

          {/* Right Insights Panel */}
          <div className="w-80 flex-shrink-0 border-l border-border bg-[#08080c] p-6 overflow-auto">
            <h3 className="font-['Roboto_Condensed'] mb-6 tracking-tight" style={{ fontWeight: 600 }}>
              Mix Insights
            </h3>

            {/* Energy Flow */}
            <div className="mb-8">
              <h4 className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
                ENERGY FLOW
              </h4>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={energyFlowData}>
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke="#71717a"
                  tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Distribution */}
          <div className="mb-8">
            <h4 className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              KEY DISTRIBUTION
            </h4>
            <div className="space-y-3">
              {keyDistribution.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <span className="font-['IBM_Plex_Mono'] text-xs w-8 text-primary">
                    {item.key}
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground w-10 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BPM Range */}
          <div className="mb-8">
            <h4 className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              BPM RANGE
            </h4>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={bpmRangeData}>
                <XAxis
                  dataKey="range"
                  stroke="#71717a"
                  tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }}
                />
                <YAxis stroke="#71717a" tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }} />
                <Bar dataKey="count" fill="#ff9500" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Style Breakdown */}
          <div>
            <h4 className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 tracking-wider">
              STYLE BREAKDOWN
            </h4>
            <div className="flex flex-wrap gap-3">
              {styleBreakdown.map((style) => (
                <Badge
                  key={style.name}
                  variant="outline"
                  className="font-['IBM_Plex_Mono'] text-xs px-2 py-1 rounded-sm"
                >
                  {style.name} ({style.count})
                </Badge>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // Empty State
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
      <div className="w-full max-w-[1600px] mx-auto flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Roboto_Condensed'] mb-3 tracking-tight text-3xl" style={{ fontWeight: 600 }}>
              DJ Mix Analyzer
            </h1>
            <p className="text-muted-foreground font-['IBM_Plex_Mono'] text-sm">
              Load a DJ mix for structural and energy analysis.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upload" className="mb-8">
          <TabsList className="w-full grid grid-cols-3 bg-muted/10 rounded-sm">
            <TabsTrigger value="upload" className="font-['IBM_Plex_Mono'] text-xs rounded-sm">
              Upload File
            </TabsTrigger>
            <TabsTrigger value="youtube" className="font-['IBM_Plex_Mono'] text-xs rounded-sm">
              YouTube Link
            </TabsTrigger>
            <TabsTrigger value="soundcloud" className="font-['IBM_Plex_Mono'] text-xs rounded-sm">
              SoundCloud Link
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-8">
            <div className="bg-card border-2 border-dashed border-border rounded-sm p-16 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
              <h3 className="font-['Roboto_Condensed'] mb-3 tracking-tight text-xl" style={{ fontWeight: 600 }}>
                Drag & drop your DJ mix here
              </h3>
              <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-8">
                MP3, WAV, FLAC · Max 500 MB (2 hours)
              </p>
              <Button onClick={handleUpload} className="bg-primary text-primary-foreground font-['Roboto_Condensed']">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="youtube" className="mt-8">
            <div className="bg-card border border-border rounded-sm p-8">
              <input
                type="text"
                placeholder="Paste YouTube URL..."
                className="w-full bg-input border border-border rounded-sm px-4 py-3 font-['IBM_Plex_Mono'] text-sm outline-none focus:border-primary transition-colors mb-6"
              />
              <Button onClick={handleUpload} className="w-full bg-primary text-primary-foreground font-['Roboto_Condensed']">
                Analyze from YouTube
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="soundcloud" className="mt-8">
            <div className="bg-card border border-border rounded-sm p-8">
              <input
                type="text"
                placeholder="Paste SoundCloud URL..."
                className="w-full bg-input border border-border rounded-sm px-4 py-3 font-['IBM_Plex_Mono'] text-sm outline-none focus:border-primary transition-colors mb-6"
              />
              <Button onClick={handleUpload} className="w-full bg-primary text-primary-foreground font-['Roboto_Condensed']">
                Analyze from SoundCloud
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Examples */}
        <div className="mt-12">
          <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-4 text-center tracking-wider">
            EXAMPLE MIXES
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpload}
              className="font-['IBM_Plex_Mono'] text-xs rounded-sm"
            >
              Carl Cox — Space Ibiza 2023
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpload}
              className="font-['IBM_Plex_Mono'] text-xs rounded-sm"
            >
              Richie Hawtin — ENTER Week 10
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpload}
              className="font-['IBM_Plex_Mono'] text-xs rounded-sm"
            >
              Adam Beyer — Drumcode 500
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
