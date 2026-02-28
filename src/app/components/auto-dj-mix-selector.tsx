import { useState } from "react";
import { Plus, Upload, X, GripVertical, Lock, Unlock, Play, Music } from "lucide-react";
import { Button } from "./ui/button";
import { AutoDJStylePanel } from "./auto-dj-style-panel";

interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  waveformData?: number[];
}

interface MixTrack extends Track {
  locked: boolean;
  playing: boolean;
  next: boolean;
}

const sampleTracks: Track[] = [
  { id: "1", title: "Midnight Grooves", artist: "DJ Shadow", bpm: 126, key: "Am", duration: "6:42" },
  { id: "2", title: "Warehouse Anthem", artist: "Underground Collective", bpm: 128, key: "Fm", duration: "7:15" },
  { id: "3", title: "Deep House Vibes", artist: "Soulful Sessions", bpm: 124, key: "Dm", duration: "5:58" },
  { id: "4", title: "Rolling Bassline", artist: "Low Frequency", bpm: 127, key: "Gm", duration: "6:30" },
  { id: "5", title: "Peak Time Energy", artist: "Night Shift", bpm: 130, key: "Em", duration: "7:02" },
  { id: "6", title: "Hypnotic Loop", artist: "Minimal Tech", bpm: 125, key: "Cm", duration: "6:18" },
  { id: "7", title: "Basement Sessions", artist: "Raw Collective", bpm: 129, key: "Bbm", duration: "6:55" },
  { id: "8", title: "Acid Dreams", artist: "303 Masters", bpm: 126, key: "Am", duration: "8:12" },
  { id: "9", title: "Tribal Rhythm", artist: "Afro House", bpm: 122, key: "Dm", duration: "7:28" },
  { id: "10", title: "Cosmic Journey", artist: "Space Disco", bpm: 124, key: "Fm", duration: "6:45" },
];

export function AutoDJMixSelector() {
  const [showLibrary, setShowLibrary] = useState(false);
  const [mixCrate, setMixCrate] = useState<MixTrack[]>([
    {
      id: "1",
      title: "Midnight Grooves",
      artist: "DJ Shadow",
      bpm: 126,
      key: "Am",
      duration: "6:42",
      locked: false,
      playing: true,
      next: false,
    },
    {
      id: "2",
      title: "Warehouse Anthem",
      artist: "Underground Collective",
      bpm: 128,
      key: "Fm",
      duration: "7:15",
      locked: false,
      playing: false,
      next: true,
    },
  ]);
  const [draggedTrack, setDraggedTrack] = useState<number | null>(null);

  const addTrackToMix = (track: Track) => {
    const exists = mixCrate.find((t) => t.id === track.id);
    if (!exists) {
      setMixCrate([
        ...mixCrate,
        { ...track, locked: false, playing: false, next: false },
      ]);
    }
  };

  const removeTrack = (id: string) => {
    setMixCrate(mixCrate.filter((t) => t.id !== id));
  };

  const toggleLock = (id: string) => {
    setMixCrate(
      mixCrate.map((t) => (t.id === id ? { ...t, locked: !t.locked } : t))
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedTrack(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTrack === null || draggedTrack === index) return;

    const newCrate = [...mixCrate];
    const draggedItem = newCrate[draggedTrack];
    newCrate.splice(draggedTrack, 1);
    newCrate.splice(index, 0, draggedItem);
    setMixCrate(newCrate);
    setDraggedTrack(index);
  };

  const handleDragEnd = () => {
    setDraggedTrack(null);
  };

  const generateMiniWaveform = () => {
    return Array.from({ length: 40 }, () => Math.random() * 100);
  };

  return (
    <div className="h-full flex bg-[#0a0a0f]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold tracking-tight mb-0.5">Auto DJ Mix</h1>
            <p className="text-xs text-white/40">Build your mix from your track library</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Select Tracks Section */}
            <div>
              <h2 className="text-sm font-semibold mb-3 text-white/80">Select Tracks for Mix</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLibrary(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 hover:from-secondary/30 hover:to-secondary/20 transition-all text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add from Track Library
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  Upload / Add Tracks
                </button>
              </div>
            </div>

            {/* Auto DJ Style Panel */}
            <AutoDJStylePanel />

            {/* Create Mix Section */}
            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-sm font-semibold mb-3 text-white/80">Create New Mix</h2>
              <p className="text-xs text-white/50 mb-4">
                {mixCrate.length} tracks selected · Ready to start mixing
              </p>
              <Button
                disabled={mixCrate.length < 2}
                className="bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary border border-secondary/50 text-white shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Auto DJ Mix
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mix Crate - Persistent Side Panel */}
      <div className="w-80 border-l border-white/10 bg-[#0a0a0f] flex flex-col">
        {/* Crate Header */}
        <div className="border-b border-white/5 px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold">Mix Crate</h2>
            <div className="text-xs text-white/50 font-['IBM_Plex_Mono']">
              {mixCrate.length} tracks
            </div>
          </div>
          <p className="text-xs text-white/40">Drag to reorder</p>
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {mixCrate.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Music className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-sm text-white/50 mb-1">No tracks in mix crate</p>
              <p className="text-xs text-white/30">Add tracks from your library to start</p>
            </div>
          ) : (
            mixCrate.map((track, index) => (
              <div
                key={track.id}
                draggable={!track.locked}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] border rounded-xl p-3 transition-all ${
                  track.playing
                    ? "border-secondary/40 bg-secondary/5"
                    : track.next
                    ? "border-primary/30 bg-primary/5"
                    : "border-white/10 hover:border-white/20"
                } ${!track.locked ? "cursor-move" : "cursor-default"} ${
                  draggedTrack === index ? "opacity-50" : ""
                }`}
              >
                {/* Drag Handle */}
                {!track.locked && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-white/30" />
                  </div>
                )}

                {/* Status Indicator */}
                {track.playing && (
                  <div className="absolute left-3 top-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  </div>
                )}

                <div className="pl-3">
                  {/* Track Info */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-xs font-medium text-white/90 truncate">
                        {track.title}
                      </div>
                      <div className="text-xs text-white/50 truncate">{track.artist}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleLock(track.id)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        {track.locked ? (
                          <Lock className="w-3 h-3 text-white/40" />
                        ) : (
                          <Unlock className="w-3 h-3 text-white/30" />
                        )}
                      </button>
                      <button
                        onClick={() => removeTrack(track.id)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <X className="w-3 h-3 text-white/40 hover:text-white/70" />
                      </button>
                    </div>
                  </div>

                  {/* Mini Waveform */}
                  <div className="mb-2 h-6 bg-black/50 rounded overflow-hidden flex items-center gap-px px-1">
                    {generateMiniWaveform().map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-secondary/60"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>

                  {/* Track Metadata */}
                  <div className="flex items-center gap-3 text-xs font-['IBM_Plex_Mono'] text-white/50">
                    <span>{track.bpm} BPM</span>
                    <span>{track.key}</span>
                    <span>{track.duration}</span>
                  </div>

                  {/* Status Label */}
                  {track.playing && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/20 border border-secondary/30">
                      <span className="text-xs text-secondary font-medium">Now Playing</span>
                    </div>
                  )}
                  {track.next && !track.playing && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/20 border border-primary/30">
                      <span className="text-xs text-primary font-medium">Up Next</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Track Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-b from-[#1a1a1f] to-[#0a0a0f] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Track Library</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Select tracks to add to your mix
                </p>
              </div>
              <button
                onClick={() => setShowLibrary(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Track List */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-2">
                {sampleTracks.map((track) => {
                  const inCrate = mixCrate.find((t) => t.id === track.id);
                  return (
                    <div
                      key={track.id}
                      className={`group flex items-center gap-4 p-3 rounded-xl border transition-all ${
                        inCrate
                          ? "bg-secondary/10 border-secondary/30"
                          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                      }`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={!!inCrate}
                        onChange={() => {
                          if (inCrate) {
                            removeTrack(track.id);
                          } else {
                            addTrackToMix(track);
                          }
                        }}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-secondary checked:border-secondary cursor-pointer"
                      />

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white/90 truncate">
                          {track.title}
                        </div>
                        <div className="text-xs text-white/50 truncate">{track.artist}</div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs font-['IBM_Plex_Mono'] text-white/50">
                        <span className="w-12 text-right">{track.bpm}</span>
                        <span className="w-10 text-center">{track.key}</span>
                        <span className="w-14 text-right">{track.duration}</span>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => {
                          if (inCrate) {
                            removeTrack(track.id);
                          } else {
                            addTrackToMix(track);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          inCrate
                            ? "bg-white/10 text-white/60 border border-white/20"
                            : "bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30"
                        }`}
                      >
                        {inCrate ? "Remove" : "Add to Mix"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="text-xs text-white/50">
                {mixCrate.length} tracks in mix crate
              </div>
              <Button
                onClick={() => setShowLibrary(false)}
                variant="outline"
                className="border-white/20 hover:bg-white/5"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}