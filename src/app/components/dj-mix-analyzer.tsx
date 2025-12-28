import { useState } from "react";
import { Upload, Music, Play, Eye, Download, Save, FileText, Check, AlertCircle, Activity, Info } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
  {
    id: 1,
    name: "Space Date",
    artist: "Adam Beyer",
    bpm: 129,
    key: "4A",
    energy: 7,
    style: ["Deep Techno", "Hypnotic"],
    timeRange: "0:00 – 7:30",
  },
  {
    id: 2,
    name: "Teach Me",
    artist: "Amelie Lens",
    bpm: 130,
    key: "5A",
    energy: 8,
    style: ["Peak Techno", "Industrial"],
    timeRange: "7:30 – 15:00",
  },
  {
    id: 3,
    name: "Patterns",
    artist: "ANNA",
    bpm: 131,
    key: "6A",
    energy: 9,
    style: ["Peak Techno", "Hypnotic"],
    timeRange: "15:00 – 22:30",
  },
  {
    id: 4,
    name: "Drumcode ID",
    artist: "Unknown",
    bpm: 132,
    key: "6A",
    energy: 10,
    style: ["Peak Techno"],
    timeRange: "22:30 – 30:00",
  },
  {
    id: 5,
    name: "Acid Thunder",
    artist: "Chris Liebing",
    bpm: 131,
    key: "5A",
    energy: 9,
    style: ["Peak Techno", "Industrial"],
    timeRange: "30:00 – 37:30",
  },
  {
    id: 6,
    name: "Terminal",
    artist: "Len Faki",
    bpm: 130,
    key: "8B",
    energy: 8,
    style: ["Deep Techno"],
    timeRange: "37:30 – 45:00",
  },
  {
    id: 7,
    name: "Unhinged",
    artist: "I Hate Models",
    bpm: 133,
    key: "7A",
    energy: 10,
    style: ["Peak Techno", "Industrial"],
    timeRange: "45:00 – 52:30",
  },
  {
    id: 8,
    name: "Black Mesa",
    artist: "Pig&Dan",
    bpm: 131,
    key: "6A",
    energy: 9,
    style: ["Peak Techno", "Hypnotic"],
    timeRange: "52:30 – 60:00",
  },
  {
    id: 9,
    name: "Warehouse",
    artist: "Slam",
    bpm: 130,
    key: "5A",
    energy: 7,
    style: ["Deep Techno"],
    timeRange: "60:00 – 67:30",
  },
  {
    id: 10,
    name: "Basement",
    artist: "Perc",
    bpm: 129,
    key: "4A",
    energy: 6,
    style: ["Deep Techno", "Minimal"],
    timeRange: "67:30 – 75:00",
  },
  {
    id: 11,
    name: "After Hours",
    artist: "Dax J",
    bpm: 128,
    key: "4A",
    energy: 5,
    style: ["Deep Techno", "Minimal"],
    timeRange: "75:00 – 82:30",
  },
  {
    id: 12,
    name: "Last Call",
    artist: "Rebekah",
    bpm: 127,
    key: "4A",
    energy: 4,
    style: ["Deep Techno", "Minimal"],
    timeRange: "82:30 – 90:00",
  },
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

export function DJMixAnalyzer() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("empty");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tracksFound, setTracksFound] = useState(0);

  const handleUpload = () => {
    setAnalysisState("uploading");
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setAnalysisState("analyzing");
          setTracksFound(0);

          const analyzeInterval = setInterval(() => {
            setTracksFound((prevCount) => {
              if (prevCount >= 12) {
                clearInterval(analyzeInterval);
                setTimeout(() => {
                  setAnalysisState("complete");
                }, 500);
                return 12;
              }
              return prevCount + 1;
            });
          }, 300);

          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleExampleClick = (example: string) => {
    handleUpload();
  };

  if (analysisState === "error") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md">
          <div className="bg-card border border-destructive/50 rounded p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h3 className="font-['Inter'] mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Unable to analyze the mix. Please check the file format and try again.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setAnalysisState("empty")}
              >
                Try Again
              </Button>
              <Button className="bg-primary text-primary-foreground">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisState === "uploading") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="font-['Inter'] mb-2">Uploading mix...</h3>
            <Progress value={uploadProgress} className="mb-3" />
            <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
              {uploadProgress}% · Preparing analysis pipeline
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (analysisState === "analyzing") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="font-['Inter'] mb-2">Analyzing audio...</h3>
            <p className="font-['IBM_Plex_Mono'] text-sm text-primary mb-4">
              Identifying tracks... {tracksFound}/12 found
            </p>
            <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
              ~{Math.max(0, 3 - Math.floor(tracksFound / 4))} minutes remaining
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (analysisState === "complete") {
    return (
      <div className="flex h-full">
        <div className="flex-1 overflow-auto p-6">
          {/* Status Banner */}
          <div className="bg-primary/10 border border-primary/20 rounded p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-5 h-5 text-primary" />
              <h3 className="font-['Inter']">Analysis Complete!</h3>
            </div>
            <div className="grid grid-cols-5 gap-4 font-['IBM_Plex_Mono'] text-xs">
              <div>
                <div className="text-muted-foreground mb-1">TITLE</div>
                <div>Carl Cox — Space Ibiza 2023</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">DURATION</div>
                <div className="text-secondary">90:00</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">TRACKS FOUND</div>
                <div className="text-primary">12</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">AVG BPM</div>
                <div className="text-secondary">129</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">KEY RANGE</div>
                <div className="text-primary">4A – 8B</div>
              </div>
            </div>
          </div>

          {/* Tracks Table */}
          <div className="bg-card border border-border rounded overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/5">
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">#</TableHead>
                  <TableHead className="font-['IBM_Plex_Mono'] text-xs">TRACK NAME</TableHead>
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
                  <TableRow key={track.id} className="border-b border-border/50">
                    <TableCell className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                      {track.id.toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell className="font-['Inter'] text-sm">{track.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{track.artist}</TableCell>
                    <TableCell className="font-['IBM_Plex_Mono'] text-sm text-secondary">
                      {track.bpm}
                    </TableCell>
                    <TableCell className="font-['IBM_Plex_Mono'] text-sm text-primary">
                      {track.key}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-['IBM_Plex_Mono'] text-xs">{track.energy}/10</span>
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
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
                            className="font-['IBM_Plex_Mono'] text-xs px-1.5 py-0"
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 font-['IBM_Plex_Mono'] text-xs"
                        >
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
          <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border mt-6 -mx-6 px-6 py-4 flex items-center justify-between">
            <div className="flex gap-3">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create DJ Mix
              </Button>
              <Button variant="outline">Generate All Tracks</Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export Analysis
              </Button>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save to Library
              </Button>
            </div>
          </div>
        </div>

        {/* Right Insights Panel */}
        <div className="w-80 border-l border-border bg-card/30 p-4 overflow-auto">
          <h3 className="font-['Inter'] mb-4">Mix Insights</h3>

          {/* Energy Flow */}
          <div className="mb-6">
            <h4 className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-3">
              ENERGY FLOW
            </h4>
            <ResponsiveContainer width="100%" height={120}>
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
          <div className="mb-6">
            <h4 className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-3">
              KEY DISTRIBUTION
            </h4>
            <div className="space-y-2">
              {keyDistribution.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <span className="font-['IBM_Plex_Mono'] text-xs w-8 text-primary">
                    {item.key}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground w-8 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BPM Range */}
          <div className="mb-6">
            <h4 className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-3">
              BPM RANGE
            </h4>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={bpmRangeData}>
                <XAxis
                  dataKey="range"
                  stroke="#71717a"
                  tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }}
                />
                <Bar dataKey="count" fill="#ff9500" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Style Breakdown */}
          <div>
            <h4 className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-3">
              STYLE BREAKDOWN
            </h4>
            <div className="flex flex-wrap gap-2">
              {styleBreakdown.map((style) => (
                <Badge
                  key={style.name}
                  variant="outline"
                  className="font-['IBM_Plex_Mono'] text-xs px-2 py-1"
                >
                  {style.name} ({style.count})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-['Inter'] mb-2">DJ Mix Analyzer</h1>
          <p className="text-muted-foreground">
            Upload a DJ mix and AI will identify all tracks, analyze their DNA, and help you
            recreate the vibe.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upload" className="mb-6">
          <TabsList className="w-full grid grid-cols-3 bg-muted/10">
            <TabsTrigger value="upload" className="font-['IBM_Plex_Mono'] text-xs">
              Upload File
            </TabsTrigger>
            <TabsTrigger value="youtube" className="font-['IBM_Plex_Mono'] text-xs">
              YouTube Link
            </TabsTrigger>
            <TabsTrigger value="soundcloud" className="font-['IBM_Plex_Mono'] text-xs">
              SoundCloud Link
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-6">
            <div className="bg-card border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-['Inter'] mb-2">Drag & drop your DJ mix here</h3>
              <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-6">
                Supported formats: MP3, WAV, FLAC · Max size: 500 MB (2 hours)
              </p>
              <Button onClick={handleUpload} className="bg-primary text-primary-foreground">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="youtube" className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <input
                type="text"
                placeholder="Paste YouTube URL..."
                className="w-full bg-input border border-border rounded px-4 py-3 font-['IBM_Plex_Mono'] text-sm outline-none focus:border-primary transition-colors"
              />
              <Button onClick={handleUpload} className="w-full mt-4 bg-primary text-primary-foreground">
                Analyze from YouTube
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="soundcloud" className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <input
                type="text"
                placeholder="Paste SoundCloud URL..."
                className="w-full bg-input border border-border rounded px-4 py-3 font-['IBM_Plex_Mono'] text-sm outline-none focus:border-primary transition-colors"
              />
              <Button onClick={handleUpload} className="w-full mt-4 bg-primary text-primary-foreground">
                Analyze from SoundCloud
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Examples */}
        <div>
          <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mb-3 text-center">
            OR TRY AN EXAMPLE
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick("carl-cox")}
              className="font-['IBM_Plex_Mono'] text-xs"
            >
              Carl Cox — Space Ibiza 2023
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick("richie-hawtin")}
              className="font-['IBM_Plex_Mono'] text-xs"
            >
              Richie Hawtin — ENTER Week 10
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick("adam-beyer")}
              className="font-['IBM_Plex_Mono'] text-xs"
            >
              Adam Beyer — Drumcode 500
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}