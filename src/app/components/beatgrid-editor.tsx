import { useState, useRef, useEffect } from "react";
import { Grid, Play, Pause, RotateCcw, Save, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

interface BeatGrid {
  trackId: string;
  bpm: number;
  firstBeat: number; // Time in seconds where first beat occurs
  beats: number[]; // Array of beat positions in seconds
}

interface BeatgridEditorProps {
  trackId: string;
  trackTitle: string;
  trackDuration: number;
  currentBPM?: number;
  onSave?: (beatgrid: BeatGrid) => void;
}

export function BeatgridEditor({
  trackId,
  trackTitle,
  trackDuration,
  currentBPM = 128,
  onSave,
}: BeatgridEditorProps) {
  const [bpm, setBPM] = useState(currentBPM);
  const [firstBeat, setFirstBeat] = useState(0);
  const [beats, setBeats] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedBeat, setSelectedBeat] = useState<number | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Generate initial beat grid
    generateBeatGrid();
  }, [bpm, firstBeat, trackDuration]);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = window.setInterval(() => {
        setPlayhead((prev) => {
          const next = prev + 0.1;
          return next >= trackDuration ? 0 : next;
        });
      }, 100);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, trackDuration]);

  const generateBeatGrid = () => {
    const beatInterval = 60 / bpm; // Seconds per beat
    const newBeats: number[] = [];
    let currentBeat = firstBeat;

    while (currentBeat <= trackDuration) {
      newBeats.push(currentBeat);
      currentBeat += beatInterval;
    }

    setBeats(newBeats);
  };

  const handleBPMChange = (newBPM: number) => {
    setBPM(newBPM);
    generateBeatGrid();
  };

  const handleFirstBeatChange = (time: number) => {
    setFirstBeat(time);
    generateBeatGrid();
  };

  const handleBeatDrag = (beatIndex: number, newTime: number) => {
    const newBeats = [...beats];
    newBeats[beatIndex] = Math.max(0, Math.min(trackDuration, newTime));
    newBeats.sort((a, b) => a - b);
    setBeats(newBeats);
  };

  const handleSync = () => {
    // Auto-detect BPM and first beat
    // In production, this would use audio analysis
    toast.info("Syncing beatgrid...");
    setTimeout(() => {
      const detectedBPM = currentBPM;
      const detectedFirstBeat = 0;
      setBPM(detectedBPM);
      setFirstBeat(detectedFirstBeat);
      generateBeatGrid();
      toast.success("Beatgrid synced!");
    }, 1000);
  };

  const handleSave = () => {
    const beatgrid: BeatGrid = {
      trackId,
      bpm,
      firstBeat,
      beats,
    };

    // Save to localStorage
    try {
      const beatgridsStr = localStorage.getItem("beatgrids");
      const beatgrids: Record<string, BeatGrid> = beatgridsStr
        ? JSON.parse(beatgridsStr)
        : {};
      beatgrids[trackId] = beatgrid;
      localStorage.setItem("beatgrids", JSON.stringify(beatgrids));
      onSave?.(beatgrid);
      toast.success("Beatgrid saved!");
    } catch (error) {
      console.error("Error saving beatgrid:", error);
      toast.error("Failed to save beatgrid");
    }
  };

  const pixelsPerSecond = 50 * zoom;
  const waveformWidth = trackDuration * pixelsPerSecond;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Beatgrid Editor
            </h1>
            <p className="text-xs text-white/40">{trackTitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSync}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Sync
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-primary hover:bg-primary/80 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-white/5 px-6 py-4 bg-white/5 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>
          <div className="text-sm text-white/60 font-['IBM_Plex_Mono']">
            {Math.floor(playhead / 60)}:
            {(Math.floor(playhead % 60)).toString().padStart(2, "0")} /{" "}
            {Math.floor(trackDuration / 60)}:
            {(Math.floor(trackDuration % 60)).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="flex-1 max-w-xs">
          <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
            BPM: {bpm.toFixed(1)}
          </label>
          <Slider
            value={[bpm]}
            min={60}
            max={200}
            step={0.1}
            onValueChange={(value) => handleBPMChange(value[0])}
            className="w-full"
          />
        </div>

        <div className="flex-1 max-w-xs">
          <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
            First Beat: {firstBeat.toFixed(2)}s
          </label>
          <Slider
            value={[firstBeat]}
            min={0}
            max={Math.min(10, trackDuration)}
            step={0.01}
            onValueChange={(value) => handleFirstBeatChange(value[0])}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
          >
            <ZoomOut className="w-4 h-4 text-white" />
          </button>
          <span className="text-xs text-white/60 font-['IBM_Plex_Mono'] w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
          >
            <ZoomIn className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Waveform & Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="relative" style={{ width: `${waveformWidth}px`, minWidth: "100%" }}>
          {/* Waveform Background */}
          <div
            ref={waveformRef}
            className="relative h-32 bg-white/5 border border-white/10 rounded-lg overflow-hidden"
            style={{ width: `${waveformWidth}px` }}
          >
            {/* Mock Waveform */}
            <svg width={waveformWidth} height={128} className="absolute inset-0">
              {Array.from({ length: 200 }).map((_, i) => {
                const x = (i / 200) * waveformWidth;
                const amplitude = Math.random() * 0.5 + 0.3;
                const height = amplitude * 128;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={(128 - height) / 2}
                    width={waveformWidth / 200}
                    height={height}
                    fill="rgba(255, 255, 255, 0.2)"
                  />
                );
              })}
            </svg>

            {/* Beat Grid Lines */}
            {beats.map((beat, index) => {
              const x = beat * pixelsPerSecond;
              const isMainBeat = index % 4 === 0;
              return (
                <div
                  key={index}
                  className={`absolute top-0 bottom-0 w-0.5 ${
                    isMainBeat ? "bg-primary" : "bg-white/20"
                  }`}
                  style={{ left: `${x}px` }}
                  draggable
                  onDrag={(e) => {
                    const rect = waveformRef.current?.getBoundingClientRect();
                    if (rect) {
                      const newX = (e.clientX - rect.left) / pixelsPerSecond;
                      handleBeatDrag(index, newX);
                    }
                  }}
                >
                  {isMainBeat && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[10px] text-white/60 font-['IBM_Plex_Mono']">
                      {Math.floor(beat / 60)}:
                      {(Math.floor(beat % 60)).toString().padStart(2, "0")}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ left: `${playhead * pixelsPerSecond}px` }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
            </div>
          </div>

          {/* Beat Markers */}
          <div className="mt-2 flex items-center gap-2 text-xs text-white/60 font-['IBM_Plex_Mono']">
            <Grid className="w-4 h-4" />
            <span>{beats.length} beats detected</span>
            <span className="text-white/40">•</span>
            <span>Beat interval: {(60 / bpm).toFixed(2)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

