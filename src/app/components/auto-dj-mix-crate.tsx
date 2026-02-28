import { useState } from "react";
import { GripVertical, Lock, Unlock, X, Plus, AlertCircle, Play, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface MixCrateTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  energy: string;
  version: "A" | "B" | "C";
  locked: boolean;
  isPlaying?: boolean;
  timeElapsed?: string;
  timeRemaining?: string;
  isSuggested?: boolean;
}

type EnergyCurveMode = "warm-up" | "build" | "peak" | "cooldown" | "custom";

interface AutoDJMixCrateProps {
  onTrackRemove?: (trackId: string) => void;
  onTrackReorder?: (tracks: MixCrateTrack[]) => void;
  onAutoAcceptToggle?: (enabled: boolean) => void;
}

// Mock data
const MOCK_TRACKS: MixCrateTrack[] = [
  {
    id: "playing-1",
    title: "Hypnotic Groove",
    artist: "Underground Mix",
    bpm: 126,
    key: "Am",
    energy: "Peak",
    version: "B",
    locked: true,
    isPlaying: true,
    timeElapsed: "3:42",
    timeRemaining: "3:38",
  },
  {
    id: "next-1",
    title: "Warehouse Nights",
    artist: "Berlin Basement",
    bpm: 128,
    key: "Fm",
    energy: "Building",
    version: "C",
    locked: true,
  },
  {
    id: "queue-1",
    title: "Deep House Vibes",
    artist: "Soulful Sessions",
    bpm: 124,
    key: "Dm",
    energy: "Groove",
    version: "A",
    locked: false,
  },
  {
    id: "queue-2",
    title: "Rolling Bassline",
    artist: "Low Frequency",
    bpm: 127,
    key: "Gm",
    energy: "Steady",
    version: "B",
    locked: false,
  },
  {
    id: "queue-3",
    title: "Peak Time Energy",
    artist: "Night Shift",
    bpm: 130,
    key: "Em",
    energy: "Peak",
    version: "A",
    locked: false,
  },
];

export function AutoDJMixCrate({ onTrackRemove, onTrackReorder, onAutoAcceptToggle }: AutoDJMixCrateProps) {
  const [tracks, setTracks] = useState<MixCrateTrack[]>(MOCK_TRACKS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [energyCurveMode, setEnergyCurveMode] = useState<EnergyCurveMode>("build");
  const [autoAccept, setAutoAccept] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(true);

  // Suggested next track (AI recommendation)
  const suggestedTrack: MixCrateTrack | null = showSuggestion ? {
    id: "suggested-1",
    title: "Acid Reflections",
    artist: "303 Sessions",
    bpm: 132,
    key: "Cm",
    energy: "Wild",
    version: "C",
    locked: false,
    isSuggested: true,
  } : null;

  const nowPlaying = tracks.find(t => t.isPlaying);
  const upcomingTracks = tracks.filter(t => !t.isPlaying);

  const handleDragStart = (index: number) => {
    const track = upcomingTracks[index];
    if (track?.locked) {
      toast.error("Cannot move locked tracks");
      return;
    }
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const track = upcomingTracks[index];
    if (track?.locked) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedUpcoming = [...upcomingTracks];
    const [draggedTrack] = reorderedUpcoming.splice(draggedIndex, 1);
    reorderedUpcoming.splice(dropIndex, 0, draggedTrack);

    const newTracks = nowPlaying ? [nowPlaying, ...reorderedUpcoming] : reorderedUpcoming;
    setTracks(newTracks);
    onTrackReorder?.(newTracks);
    
    toast.success("Track order updated");
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const toggleLock = (trackId: string) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, locked: !t.locked } : t
    ));
    const track = tracks.find(t => t.id === trackId);
    toast.success(`Track ${track?.locked ? "unlocked" : "locked"}`);
  };

  const removeTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track?.locked) {
      toast.error("Cannot remove locked tracks");
      return;
    }
    setTracks(prev => prev.filter(t => t.id !== trackId));
    onTrackRemove?.(trackId);
    toast.success("Track removed from queue");
  };

  const acceptSuggestion = () => {
    if (suggestedTrack) {
      const newTrack = { ...suggestedTrack, isSuggested: false };
      setTracks(prev => [...prev, newTrack]);
      setShowSuggestion(false);
      toast.success(`Added "${newTrack.title}" to queue`);
      
      // Show next suggestion after a delay
      setTimeout(() => setShowSuggestion(true), 2000);
    }
  };

  const dismissSuggestion = () => {
    setShowSuggestion(false);
    toast.info("Suggestion dismissed");
    // Show next suggestion after a delay
    setTimeout(() => setShowSuggestion(true), 3000);
  };

  const toggleAutoAccept = () => {
    const newValue = !autoAccept;
    setAutoAccept(newValue);
    onAutoAcceptToggle?.(newValue);
    toast.success(`Auto-accept ${newValue ? "enabled" : "disabled"}`);
  };

  const getEnergyCurveColor = (mode: EnergyCurveMode) => {
    const colors = {
      "warm-up": "text-blue-400",
      "build": "text-primary",
      "peak": "text-red-400",
      "cooldown": "text-purple-400",
      "custom": "text-white/60",
    };
    return colors[mode];
  };

  return (
    <div className="w-[360px] h-full flex flex-col bg-black border-l border-white/10">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3.5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-['IBM_Plex_Mono'] uppercase tracking-wider text-white">
            Mix Crate
          </h2>
          <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
            {upcomingTracks.length} queued
          </span>
        </div>

        {/* Energy Curve Mode */}
        <div className="flex items-center gap-1.5">
          {(["warm-up", "build", "peak", "cooldown", "custom"] as EnergyCurveMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setEnergyCurveMode(mode)}
              className={`flex-1 px-2 py-1.5 text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider border rounded transition-colors ${
                energyCurveMode === mode
                  ? `${getEnergyCurveColor(mode)} border-current bg-current/10`
                  : "text-white/40 border-white/10 hover:border-white/20"
              }`}
            >
              {mode.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Auto-Accept Toggle */}
        <div className="mt-3 flex items-center justify-between px-2 py-2 bg-white/5 rounded border border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-white/80 font-['IBM_Plex_Mono']">Auto-Accept</span>
          </div>
          <button
            onClick={toggleAutoAccept}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              autoAccept ? "bg-primary" : "bg-white/20"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                autoAccept ? "left-[18px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Now Playing */}
      {nowPlaying && (
        <div className="border-b border-white/10 px-4 py-3 bg-primary/5 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-primary">
              Now Playing
            </span>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium text-white truncate">
              {nowPlaying.title}
            </h3>
            <p className="text-xs text-white/60 truncate font-['IBM_Plex_Mono']">
              {nowPlaying.artist}
            </p>
            
            <div className="flex items-center gap-3 text-[10px] text-white/50 font-['IBM_Plex_Mono']">
              <span>{nowPlaying.bpm} BPM</span>
              <span>{nowPlaying.key}</span>
              <span>{nowPlaying.energy}</span>
              <span className="px-1.5 py-0.5 bg-white/10 rounded-sm">{nowPlaying.version}</span>
            </div>

            {/* Time Progress */}
            {nowPlaying.timeElapsed && nowPlaying.timeRemaining && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[9px] text-white/40 font-['IBM_Plex_Mono'] mb-1">
                  <span>{nowPlaying.timeElapsed}</span>
                  <span>-{nowPlaying.timeRemaining}</span>
                </div>
                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: "52%" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preparing Next Indicator */}
          {upcomingTracks.length > 0 && upcomingTracks[0].locked && (
            <div className="mt-2 flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded border border-white/10">
              <Clock className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-white/60 font-['IBM_Plex_Mono']">
                Preparing: {upcomingTracks[0].title}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Queue */}
      <div className="flex-1 overflow-auto">
        {upcomingTracks.map((track, index) => {
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;
          
          return (
            <div
              key={track.id}
              draggable={!track.locked}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                border-b border-white/5 px-4 py-3 transition-all
                ${isDragging ? "opacity-50" : ""}
                ${isDragOver ? "bg-primary/10 border-primary/30" : "hover:bg-white/[0.02]"}
                ${track.locked ? "bg-white/[0.02]" : ""}
              `}
            >
              <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div className="flex-shrink-0 mt-1">
                  {track.locked ? (
                    <Lock className="w-3.5 h-3.5 text-white/30" />
                  ) : (
                    <GripVertical className="w-3.5 h-3.5 text-white/30 cursor-grab active:cursor-grabbing" />
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-white truncate">
                        {track.title}
                      </h3>
                      <p className="text-xs text-white/60 truncate font-['IBM_Plex_Mono']">
                        {track.artist}
                      </p>
                    </div>
                    
                    {/* Position Badge */}
                    <span className="flex-shrink-0 text-[10px] font-['IBM_Plex_Mono'] text-white/40">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 text-[10px] text-white/50 font-['IBM_Plex_Mono'] mb-2">
                    <span>{track.bpm} BPM</span>
                    <span>•</span>
                    <span>{track.key}</span>
                    <span>•</span>
                    <span>{track.energy}</span>
                    <span className="px-1.5 py-0.5 bg-white/10 rounded-sm">{track.version}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLock(track.id)}
                      className="text-white/40 hover:text-white transition-colors"
                      title={track.locked ? "Unlock track" : "Lock track"}
                    >
                      {track.locked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </button>
                    
                    {!track.locked && (
                      <button
                        onClick={() => removeTrack(track.id)}
                        className="text-white/40 hover:text-red-400 transition-colors"
                        title="Remove from queue"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {/* Compatibility Indicator */}
                    {index === 0 && nowPlaying && (
                      <div className="ml-auto flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-[9px] text-white/40 font-['IBM_Plex_Mono']">
                          Compatible
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Suggestion */}
        {suggestedTrack && (
          <div className="border-b border-white/5 px-4 py-3 bg-primary/5 border-l-2 border-l-primary">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-primary">
                    Suggested Next
                  </span>
                </div>

                <h3 className="text-sm text-white/80 truncate">
                  {suggestedTrack.title}
                </h3>
                <p className="text-xs text-white/50 truncate font-['IBM_Plex_Mono']">
                  {suggestedTrack.artist}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-white/40 font-['IBM_Plex_Mono'] mt-1.5">
                  <span>{suggestedTrack.bpm} BPM</span>
                  <span>•</span>
                  <span>{suggestedTrack.key}</span>
                  <span>•</span>
                  <span>{suggestedTrack.energy}</span>
                  <span className="px-1.5 py-0.5 bg-white/10 rounded-sm">{suggestedTrack.version}</span>
                </div>

                {/* Suggestion Reason */}
                <div className="mt-2 flex items-start gap-1.5 text-[10px] text-white/40">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span className="font-['IBM_Plex_Mono']">
                    Harmonic match (+3 semitones), energy builds naturally
                  </span>
                </div>

                {/* Accept/Dismiss Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={acceptSuggestion}
                    className="flex-1 px-3 py-1.5 bg-primary text-black text-xs font-['IBM_Plex_Mono'] uppercase tracking-wider hover:bg-primary/90 transition-colors rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={dismissSuggestion}
                    className="px-3 py-1.5 bg-white/10 text-white/60 text-xs font-['IBM_Plex_Mono'] uppercase tracking-wider hover:bg-white/20 transition-colors rounded"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {upcomingTracks.length === 0 && !suggestedTrack && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Plus className="w-8 h-8 text-white/20 mb-3" />
            <p className="text-sm text-white/40 text-center mb-1">
              Queue is empty
            </p>
            <p className="text-xs text-white/30 text-center font-['IBM_Plex_Mono']">
              Add tracks from your library
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/10 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] text-white/40 font-['IBM_Plex_Mono']">
          <span>{tracks.filter(t => t.locked).length} locked</span>
          <span>Energy: {energyCurveMode}</span>
        </div>
      </div>
    </div>
  );
}
