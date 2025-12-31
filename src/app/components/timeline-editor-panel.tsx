import { useState, useRef, useEffect } from "react";
import { Play, Pause, ZoomIn, ZoomOut, Clock, Music2, Flag, Repeat, GripVertical, Plus, X } from "lucide-react";
import { Slider } from "./ui/slider";
import { WaveformVisualizer } from "./waveform-visualizer";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

interface TimelineTrack {
  id: string;
  name: string;
  startTime: number; // seconds
  duration: number;
  audioData?: string;
  energy?: "Rising" | "Building" | "Peak" | "Chill" | "Groove" | "Steady";
  fadeIn?: number; // seconds
  fadeOut?: number; // seconds
}

interface CuePoint {
  id: string;
  time: number;
  label?: string;
}

interface LoopRegion {
  id: string;
  startTime: number;
  endTime: number;
  active: boolean;
}

interface AudioFile {
  id: string;
  name: string;
  duration: number;
  data: string;
  energy?: string;
  artwork?: string;
  artist?: string;
  title?: string;
}

export function TimelineEditorPanel() {
  const [tracks, setTracks] = useState<TimelineTrack[]>([]);
  const [zoom, setZoom] = useState(1); // 1x to 10x
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalDuration, setTotalDuration] = useState(300); // 5 minutes default
  const [cuePoints, setCuePoints] = useState<CuePoint[]>([]);
  const [loopRegions, setLoopRegions] = useState<LoopRegion[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [draggingTrack, setDraggingTrack] = useState<string | null>(null);
  const [addTracksOpen, setAddTracksOpen] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<AudioFile[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Load available files and tracks from Audio Library
  useEffect(() => {
    const loadFiles = () => {
      try {
        const stored = localStorage.getItem('uploadedAudioFiles');
        if (stored) {
          const files = JSON.parse(stored);
          setAvailableFiles(files);
          
          // Convert to timeline tracks
          const timelineTracks: TimelineTrack[] = files.map((file: any, index: number) => ({
            id: `track-${file.id}`,
            name: file.title || file.name,
            startTime: index * 60, // Space tracks 1 minute apart
            duration: file.duration || 180,
            audioData: file.data,
            energy: file.energy || "Peak",
            fadeIn: 0,
            fadeOut: 0,
          }));
          setTracks(timelineTracks);
          
          // Calculate total duration
          const maxEnd = timelineTracks.length > 0 
            ? Math.max(...timelineTracks.map(t => t.startTime + t.duration), 300)
            : 300;
          setTotalDuration(maxEnd);
        }
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };

    loadFiles();
    // Listen for storage changes
    window.addEventListener('storage', loadFiles);
    // Check periodically for same-tab updates
    const interval = setInterval(loadFiles, 1000);
    
    return () => {
      window.removeEventListener('storage', loadFiles);
      clearInterval(interval);
    };
  }, []);

  const pixelsPerSecond = 10 * zoom;
  const timelineWidth = totalDuration * pixelsPerSecond;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (trackId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingTrack(trackId);
  };

  const handleAddCuePoint = () => {
    const newCue: CuePoint = {
      id: `cue-${Date.now()}`,
      time: playhead,
      label: `Cue ${cuePoints.length + 1}`,
    };
    setCuePoints([...cuePoints, newCue]);
  };

  const handleCreateLoop = () => {
    // Create loop from current playhead to 8 bars later (assuming 128 BPM)
    const barDuration = (60 / 128) * 4; // 4 beats per bar
    const loopStart = playhead;
    const loopEnd = playhead + (barDuration * 8);
    
    const newLoop: LoopRegion = {
      id: `loop-${Date.now()}`,
      startTime: loopStart,
      endTime: loopEnd,
      active: false,
    };
    setLoopRegions([...loopRegions, newLoop]);
  };

  const toggleLoop = (loopId: string) => {
    setLoopRegions(prev =>
      prev.map(loop =>
        loop.id === loopId ? { ...loop, active: !loop.active } : { ...loop, active: false }
      )
    );
  };

  const updateTrackFade = (trackId: string, type: "fadeIn" | "fadeOut", value: number) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, [type]: value } : track
      )
    );
  };

  const handleAddTrack = (file: AudioFile) => {
    // Find the end of the last track
    const lastTrackEnd = tracks.length > 0
      ? Math.max(...tracks.map(t => t.startTime + t.duration))
      : 0;

    const newTrack: TimelineTrack = {
      id: `track-${file.id}-${Date.now()}`,
      name: file.title || file.name,
      startTime: lastTrackEnd + 5, // Add 5 seconds gap
      duration: file.duration || 180,
      audioData: file.data,
      energy: file.energy || "Peak",
      fadeIn: 0,
      fadeOut: 0,
    };

    setTracks([...tracks, newTrack]);
    
    // Update total duration
    const newEnd = newTrack.startTime + newTrack.duration;
    if (newEnd > totalDuration) {
      setTotalDuration(newEnd);
    }

    toast.success(`Added "${newTrack.name}" to timeline`);
  };

  const handleDragFromLibrary = (file: AudioFile, e: React.DragEvent) => {
    e.preventDefault();
    handleAddTrack(file);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">Timeline Editor</h1>
            <p className="text-xs text-white/40">
              Arrange and edit your tracks on a timeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setAddTracksOpen(true)}
              className="bg-primary hover:bg-primary/80 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tracks
            </Button>
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-white/60" />
            </button>
            <span className="text-xs text-white/60 font-['IBM_Plex_Mono'] w-12 text-center">
              {zoom.toFixed(1)}x
            </span>
            <button
              onClick={() => setZoom(Math.min(10, zoom + 0.5))}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={handleAddCuePoint}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              title="Add Cue Point"
            >
              <Flag className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={handleCreateLoop}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              title="Create Loop Region"
            >
              <Repeat className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto relative" ref={timelineRef}>
        <div className="min-w-full" style={{ width: `${timelineWidth}px` }}>
          {/* Time Ruler */}
          <div className="sticky top-0 z-10 bg-[#0a0a0f] border-b border-white/10 h-12 flex items-center">
            <div className="relative w-full h-full">
              {Array.from({ length: Math.ceil(totalDuration / 10) + 1 }).map((_, i) => {
                const time = i * 10;
                const x = time * pixelsPerSecond;
                return (
                  <div
                    key={i}
                    className="absolute top-0 h-full border-l border-white/10"
                    style={{ left: `${x}px` }}
                  >
                    <span className="absolute top-1 left-1 text-[10px] text-white/40 font-['IBM_Plex_Mono']">
                      {formatTime(time)}
                    </span>
                  </div>
                );
              })}
              
              {/* Playhead */}
              <div
                className="absolute top-0 h-full w-0.5 bg-primary z-20 transition-all"
                style={{ left: `${playhead * pixelsPerSecond}px` }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary" />
              </div>
            </div>
          </div>

          {/* Tracks */}
          <div className="space-y-2 p-4">
            {tracks.length === 0 ? (
              <div className="text-center py-20">
                <Music2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No tracks on timeline</p>
                <p className="text-sm text-white/40">
                  Upload audio files to see them on the timeline
                </p>
              </div>
            ) : (
              tracks.map((track) => {
                const left = track.startTime * pixelsPerSecond;
                const width = track.duration * pixelsPerSecond;
                
                return (
                  <div
                    key={track.id}
                    className={`relative h-24 bg-white/5 border rounded-lg overflow-hidden cursor-move transition-all ${
                      selectedTrack === track.id
                        ? "border-primary bg-primary/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    style={{
                      marginLeft: `${left}px`,
                      width: `${width}px`,
                    }}
                    onMouseDown={(e) => {
                      handleDragStart(track.id, e);
                      setSelectedTrack(track.id);
                    }}
                  >
                    <div className="absolute inset-0 p-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <GripVertical className="w-3 h-3 text-white/40" />
                          <h3 className="text-xs font-medium text-white truncate">
                            {track.name}
                          </h3>
                        </div>
                        <span className="text-[10px] text-white/40 font-['IBM_Plex_Mono']">
                          {formatTime(track.startTime)}
                        </span>
                      </div>
                      <div className="h-12 relative">
                        <WaveformVisualizer
                          audioData={track.audioData}
                          energy={track.energy}
                          width={width}
                          height={48}
                          barCount={Math.floor(width / 4)}
                        />
                        {/* Fade In Indicator */}
                        {track.fadeIn && track.fadeIn > 0 && (
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-black/60 to-transparent"
                            style={{ width: `${(track.fadeIn / track.duration) * 100}%` }}
                          />
                        )}
                        {/* Fade Out Indicator */}
                        {track.fadeOut && track.fadeOut > 0 && (
                          <div
                            className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-black/60 to-transparent"
                            style={{ width: `${(track.fadeOut / track.duration) * 100}%` }}
                          />
          )}
        </div>
      </div>

      {/* Add Tracks Dialog */}
      <Dialog open={addTracksOpen} onOpenChange={setAddTracksOpen}>
        <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold mb-2">
              Add Tracks to Timeline
            </DialogTitle>
          </DialogHeader>
          
          <div className="overflow-auto max-h-[60vh]">
            {availableFiles.length === 0 ? (
              <div className="text-center py-12">
                <Music2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No audio files available</p>
                <p className="text-sm text-white/40">
                  Go to "Upload Audio" to upload files first
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableFiles.map((file) => {
                  const isOnTimeline = tracks.some(t => t.id.startsWith(`track-${file.id}`));
                  
                  return (
                    <div
                      key={file.id}
                      draggable={!isOnTimeline}
                      onDragStart={(e) => {
                        if (!isOnTimeline) {
                          e.dataTransfer.setData('audioFile', JSON.stringify(file));
                        }
                      }}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        isOnTimeline
                          ? "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50"
                      }`}
                      onClick={() => {
                        if (!isOnTimeline) {
                          handleAddTrack(file);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                          {file.artwork ? (
                            <img src={file.artwork} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Music2 className="w-6 h-6 text-white/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">{file.title || file.name}</h3>
                          {file.artist && (
                            <p className="text-xs text-white/50 truncate">{file.artist}</p>
                          )}
                          <p className="text-xs text-white/40 font-['IBM_Plex_Mono'] mt-1">
                            {Math.floor(file.duration / 60)}:{(file.duration % 60).toFixed(0).padStart(2, '0')}
                          </p>
                        </div>
                        {isOnTimeline && (
                          <div className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            Added
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <Button
              onClick={() => setAddTracksOpen(false)}
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
})
            )}
          </div>
        </div>
      </div>

      {/* Selected Track Controls */}
      {selectedTrack && (
        <div className="border-t border-white/5 px-6 py-4 bg-gradient-to-t from-black/60 to-transparent flex-shrink-0">
          {(() => {
            const track = tracks.find(t => t.id === selectedTrack);
            if (!track) return null;
            return (
              <div className="mb-4 space-y-4">
                <h3 className="text-sm font-semibold text-white">Fade Controls - {track.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2">
                      Fade In: {track.fadeIn?.toFixed(1) || 0}s
                    </label>
                    <Slider
                      value={[track.fadeIn || 0]}
                      max={2}
                      step={0.1}
                      onValueChange={(val) => updateTrackFade(track.id, "fadeIn", val[0])}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">
                      Fade Out: {track.fadeOut?.toFixed(1) || 0}s
                    </label>
                    <Slider
                      value={[track.fadeOut || 0]}
                      max={2}
                      step={0.1}
                      onValueChange={(val) => updateTrackFade(track.id, "fadeOut", val[0])}
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Transport Controls */}
      <div className="border-t border-white/5 px-6 py-4 bg-gradient-to-t from-black/60 to-transparent flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <div className="flex-1">
            <Slider
              value={[playhead]}
              max={totalDuration}
              step={0.1}
              onValueChange={(val) => setPlayhead(val[0])}
            />
            <div className="flex items-center justify-between text-xs text-white/50 font-['IBM_Plex_Mono'] mt-1">
              <span>{formatTime(playhead)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Flag className="w-4 h-4" />
              <span className="font-['IBM_Plex_Mono']">{cuePoints.length} cues</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Repeat className="w-4 h-4" />
              <span className="font-['IBM_Plex_Mono']">{loopRegions.length} loops</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Clock className="w-4 h-4" />
              <span className="font-['IBM_Plex_Mono']">{tracks.length} tracks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

