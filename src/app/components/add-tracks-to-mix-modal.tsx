import { useState } from "react";
import { X, Music2, Upload } from "lucide-react";
import { Button } from "./ui/button";

interface Track {
  id: number;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  waveformData: number[];
  version?: string; // For generated tracks
  dnaContribution?: number; // For DNA reference tracks
  artwork?: string;
}

// Mock Generated Tracks
const GENERATED_TRACKS: Track[] = [
  {
    id: 1,
    title: "Dark Pulse",
    artist: "Generated",
    bpm: 129,
    key: "4A",
    duration: "6:32",
    version: "A",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 2,
    title: "Dark Pulse",
    artist: "Generated",
    bpm: 129,
    key: "4A",
    duration: "6:32",
    version: "B",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 3,
    title: "Dark Pulse",
    artist: "Generated",
    bpm: 129,
    key: "4A",
    duration: "6:32",
    version: "C",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 4,
    title: "Warehouse Echo",
    artist: "Generated",
    bpm: 130,
    key: "5A",
    duration: "7:15",
    version: "A",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 5,
    title: "Warehouse Echo",
    artist: "Generated",
    bpm: 130,
    key: "5A",
    duration: "7:15",
    version: "B",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 6,
    title: "Industrial Night",
    artist: "Generated",
    bpm: 131,
    key: "6A",
    duration: "6:48",
    version: "A",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 7,
    title: "Industrial Night",
    artist: "Generated",
    bpm: 131,
    key: "6A",
    duration: "6:48",
    version: "B",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 8,
    title: "Basement Groove",
    artist: "Generated",
    bpm: 128,
    key: "3A",
    duration: "7:02",
    version: "A",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
];

// Mock DNA Reference Tracks
const DNA_REFERENCE_TRACKS: Track[] = [
  {
    id: 101,
    title: "Space Date",
    artist: "Adam Beyer",
    bpm: 129,
    key: "4A",
    duration: "6:45",
    dnaContribution: 92,
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 102,
    title: "Teach Me",
    artist: "Amelie Lens",
    bpm: 130,
    key: "5A",
    duration: "7:12",
    dnaContribution: 88,
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 103,
    title: "Patterns",
    artist: "ANNA",
    bpm: 131,
    key: "6A",
    duration: "6:58",
    dnaContribution: 85,
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 104,
    title: "Acid Thunder",
    artist: "Chris Liebing",
    bpm: 131,
    key: "5A",
    duration: "7:24",
    dnaContribution: 78,
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 105,
    title: "Terminal",
    artist: "Len Faki",
    bpm: 130,
    key: "8B",
    duration: "6:33",
    dnaContribution: 72,
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
];

// Mock Uploaded Tracks
const UPLOADED_TRACKS: Track[] = [
  {
    id: 201,
    title: "my_track_01.wav",
    artist: "User Upload",
    bpm: 128,
    key: "2A",
    duration: "5:45",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 202,
    title: "dj_set_recording.mp3",
    artist: "User Upload",
    bpm: 130,
    key: "7A",
    duration: "6:15",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 203,
    title: "live_mix_2024.wav",
    artist: "User Upload",
    bpm: 132,
    key: "9A",
    duration: "8:22",
    waveformData: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
  },
];

// Mini Waveform Component
function MiniWaveform({ data, muted = false }: { data: number[]; muted?: boolean }) {
  return (
    <svg width="100" height="24" className="overflow-visible">
      {data.map((value, i) => {
        const barWidth = 100 / data.length;
        const barHeight = value * 24;
        const x = i * barWidth;
        const y = (24 - barHeight) / 2;
        
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth * 0.8}
            height={barHeight}
            className={muted ? "fill-muted-foreground/20" : "fill-primary/40"}
            rx={0.5}
          />
        );
      })}
    </svg>
  );
}

type TabType = "generated" | "dna" | "uploaded";

interface AddTracksToMixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTracks: (trackIds: number[]) => void;
}

export function AddTracksToMixModal({ isOpen, onClose, onAddTracks }: AddTracksToMixModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("generated");
  const [selectedTracks, setSelectedTracks] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const currentTracks = 
    activeTab === "generated" ? GENERATED_TRACKS :
    activeTab === "dna" ? DNA_REFERENCE_TRACKS :
    UPLOADED_TRACKS;

  const toggleTrack = (id: number) => {
    const newSelected = new Set(selectedTracks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTracks(newSelected);
  };

  const handleAddToMix = () => {
    onAddTracks(Array.from(selectedTracks));
    setSelectedTracks(new Set());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-background border border-border rounded-sm w-full max-w-[720px] flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Add Tracks to Mix</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-border">
          <div className="inline-flex bg-muted/30 rounded-sm p-1 gap-1">
            <button
              onClick={() => setActiveTab("generated")}
              className={`px-4 py-2 text-xs font-['IBM_Plex_Mono'] rounded-sm transition-all duration-200 ease-in-out ${
                activeTab === "generated"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-white hover:opacity-80"
              }`}
            >
              Generated Tracks
            </button>
            <button
              onClick={() => setActiveTab("dna")}
              className={`px-4 py-2 text-xs font-['IBM_Plex_Mono'] rounded-sm transition-all duration-200 ease-in-out ${
                activeTab === "dna"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-white hover:opacity-80"
              }`}
            >
              Reference Tracks (DNA)
            </button>
            <button
              onClick={() => setActiveTab("uploaded")}
              className={`px-4 py-2 text-xs font-['IBM_Plex_Mono'] rounded-sm transition-all duration-200 ease-in-out ${
                activeTab === "uploaded"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-white hover:opacity-80"
              }`}
            >
              Uploaded Files
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          {/* Drop Zone - Only for Uploaded Files Tab */}
          {activeTab === "uploaded" && (
            <div className="px-6 py-4 border-b border-border">
              <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-sm p-8 text-center transition-colors cursor-pointer bg-muted/10 hover:bg-muted/20">
                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-['IBM_Plex_Mono'] mb-1">
                  Drop audio files here to include in this mix
                </p>
                <p className="text-xs text-muted-foreground/70 font-['IBM_Plex_Mono']">
                  Session-only · Does not affect DNA
                </p>
              </div>
            </div>
          )}

          <table className="w-full">
            <thead className="sticky top-0 bg-background border-b border-border">
              <tr>
                {activeTab === "uploaded" ? (
                  <>
                    <th className="text-left px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Filename
                      </span>
                    </th>
                    <th className="text-center px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        BPM
                      </span>
                    </th>
                    <th className="text-center px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Key
                      </span>
                    </th>
                    <th className="text-center px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Duration
                      </span>
                    </th>
                    <th className="text-center px-4 py-3 w-16">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Select
                      </span>
                    </th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Waveform
                      </span>
                    </th>
                    <th className="text-left px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Title
                      </span>
                    </th>
                    <th className="text-left px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Artist
                      </span>
                    </th>
                    <th className="text-center px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        BPM
                      </span>
                    </th>
                    <th className="text-center px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Key
                      </span>
                    </th>
                    <th className="text-center px-4 py-3">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Duration
                      </span>
                    </th>
                    {activeTab === "generated" && (
                      <th className="text-center px-4 py-3">
                        <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                          Version
                        </span>
                      </th>
                    )}
                    {activeTab === "dna" && (
                      <th className="text-center px-4 py-3">
                        <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                          DNA %
                        </span>
                      </th>
                    )}
                    <th className="text-center px-4 py-3 w-16">
                      <span className="text-[10px] font-['IBM_Plex_Mono'] text-muted-foreground uppercase tracking-wider">
                        Select
                      </span>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentTracks.map((track) => (
                <tr
                  key={track.id}
                  className={`border-b border-border/50 transition-all duration-200 ease-in-out cursor-pointer ${
                    selectedTracks.has(track.id) ? "bg-primary/5" : "hover:bg-muted/20"
                  }`}
                  onClick={() => toggleTrack(track.id)}
                >
                  {activeTab === "uploaded" ? (
                    <>
                      <td className="px-4 py-3">
                        <span className="text-sm text-white/90 font-['IBM_Plex_Mono']">
                          {track.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-white/90 font-['IBM_Plex_Mono']">
                          {track.bpm}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-white/90 font-['IBM_Plex_Mono']">
                          {track.key}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-white/70 font-['IBM_Plex_Mono']">
                          {track.duration}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 bg-transparent border border-border rounded-sm cursor-pointer accent-primary"
                          checked={selectedTracks.has(track.id)}
                          onChange={() => toggleTrack(track.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <MiniWaveform data={track.waveformData} muted={activeTab === "dna"} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-white/90 font-['IBM_Plex_Mono']">
                          {track.title}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-white/70 font-['IBM_Plex_Mono']">
                          {track.artist}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-white/90 font-['IBM_Plex_Mono']">
                          {track.bpm}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-white/90 font-['IBM_Plex_Mono']">
                          {track.key}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-white/70 font-['IBM_Plex_Mono']">
                          {track.duration}
                        </span>
                      </td>
                      {activeTab === "generated" && (
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs font-['IBM_Plex_Mono'] rounded-sm">
                            {track.version}
                          </span>
                        </td>
                      )}
                      {activeTab === "dna" && (
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs font-['IBM_Plex_Mono'] rounded-sm">
                            {track.dnaContribution}%
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 bg-transparent border border-border rounded-sm cursor-pointer accent-primary"
                          checked={selectedTracks.has(track.id)}
                          onChange={() => toggleTrack(track.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-['IBM_Plex_Mono']">
            {activeTab === "dna" ? (
              "These tracks influence mix style"
            ) : (
              `Selected: ${selectedTracks.size} tracks`
            )}
          </div>
          <Button
            onClick={handleAddToMix}
            disabled={selectedTracks.size === 0}
            className="font-['IBM_Plex_Mono'] text-sm"
          >
            Add to Mix
          </Button>
        </div>
      </div>
    </div>
  );
}