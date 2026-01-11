import { useState, useMemo, useEffect } from "react";
import { Music, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "./auth-system";

interface Key {
  name: string;
  camelot: string;
  compatible: string[];
  semitones: number;
}

// Camelot Wheel keys
const CAMELOT_KEYS: Key[] = [
  { name: "1A", camelot: "1A", compatible: ["1A", "1B", "2A", "12A"], semitones: 0 },
  { name: "1B", camelot: "1B", compatible: ["1B", "1A", "2B", "12B"], semitones: 0 },
  { name: "2A", camelot: "2A", compatible: ["2A", "2B", "1A", "3A"], semitones: 1 },
  { name: "2B", camelot: "2B", compatible: ["2B", "2A", "1B", "3B"], semitones: 1 },
  { name: "3A", camelot: "3A", compatible: ["3A", "3B", "2A", "4A"], semitones: 2 },
  { name: "3B", camelot: "3B", compatible: ["3B", "3A", "2B", "4B"], semitones: 2 },
  { name: "4A", camelot: "4A", compatible: ["4A", "4B", "3A", "5A"], semitones: 3 },
  { name: "4B", camelot: "4B", compatible: ["4B", "4A", "3B", "5B"], semitones: 3 },
  { name: "5A", camelot: "5A", compatible: ["5A", "5B", "4A", "6A"], semitones: 4 },
  { name: "5B", camelot: "5B", compatible: ["5B", "5A", "4B", "6B"], semitones: 4 },
  { name: "6A", camelot: "6A", compatible: ["6A", "6B", "5A", "7A"], semitones: 5 },
  { name: "6B", camelot: "6B", compatible: ["6B", "6A", "5B", "7B"], semitones: 5 },
  { name: "7A", camelot: "7A", compatible: ["7A", "7B", "6A", "8A"], semitones: 6 },
  { name: "7B", camelot: "7B", compatible: ["7B", "7A", "6B", "8B"], semitones: 6 },
  { name: "8A", camelot: "8A", compatible: ["8A", "8B", "7A", "9A"], semitones: 7 },
  { name: "8B", camelot: "8B", compatible: ["8B", "8A", "7B", "9B"], semitones: 7 },
  { name: "9A", camelot: "9A", compatible: ["9A", "9B", "8A", "10A"], semitones: 8 },
  { name: "9B", camelot: "9B", compatible: ["9B", "9A", "8B", "10B"], semitones: 8 },
  { name: "10A", camelot: "10A", compatible: ["10A", "10B", "9A", "11A"], semitones: 9 },
  { name: "10B", camelot: "10B", compatible: ["10B", "10A", "9B", "11B"], semitones: 9 },
  { name: "11A", camelot: "11A", compatible: ["11A", "11B", "10A", "12A"], semitones: 10 },
  { name: "11B", camelot: "11B", compatible: ["11B", "11A", "10B", "12B"], semitones: 10 },
  { name: "12A", camelot: "12A", compatible: ["12A", "12B", "11A", "1A"], semitones: 11 },
  { name: "12B", camelot: "12B", compatible: ["12B", "12A", "11B", "1B"], semitones: 11 },
];

// Traditional key to Camelot mapping
const KEY_TO_CAMELOT: Record<string, string> = {
  "Am": "1A", "Bbm": "2A", "Bm": "3A", "Cm": "4A", "C#m": "5A", "Dm": "6A",
  "D#m": "7A", "Em": "8A", "Fm": "9A", "F#m": "10A", "Gm": "11A", "G#m": "12A",
  "A": "1B", "Bb": "2B", "B": "3B", "C": "4B", "C#": "5B", "D": "6B",
  "D#": "7B", "E": "8B", "F": "9B", "F#": "10B", "G": "11B", "G#": "12B",
};

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
}

export function HarmonicMixingAssistant() {
  const { user } = useAuth();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showCircle, setShowCircle] = useState(true);

  // Load tracks from localStorage
  useEffect(() => {
    try {
      const tracksStr = localStorage.getItem("libraryTracks");
      if (tracksStr) {
        const allTracks: Track[] = JSON.parse(tracksStr);
        setTracks(allTracks);
      }
    } catch (error) {
      console.error("Error loading tracks:", error);
    }
  }, []);

  const currentCamelot = useMemo(() => {
    if (!currentTrack) return null;
    return KEY_TO_CAMELOT[currentTrack.key] || null;
  }, [currentTrack]);

  const compatibleKeys = useMemo(() => {
    if (!currentCamelot) return [];
    const key = CAMELOT_KEYS.find((k) => k.camelot === currentCamelot);
    return key?.compatible || [];
  }, [currentCamelot]);

  const suggestedTracks = useMemo(() => {
    if (!currentCamelot || !compatibleKeys.length) return [];
    return tracks.filter((track) => {
      const trackCamelot = KEY_TO_CAMELOT[track.key];
      return trackCamelot && compatibleKeys.includes(trackCamelot);
    });
  }, [tracks, compatibleKeys, currentCamelot]);

  const getKeyColor = (camelot: string) => {
    if (!currentCamelot) return "bg-white/5";
    if (camelot === currentCamelot) return "bg-primary/30 border-primary";
    if (compatibleKeys.includes(camelot)) return "bg-green-500/20 border-green-500/50";
    return "bg-white/5 border-white/10";
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Harmonic Mixing Assistant
            </h1>
            <p className="text-xs text-white/40">
              Find harmonically compatible tracks using the Camelot Wheel
            </p>
          </div>
          <button
            onClick={() => setShowCircle(!showCircle)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10"
          >
            {showCircle ? "Show List" : "Show Wheel"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Current Track Selection */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="text-xs text-white/60 mb-2 block font-['IBM_Plex_Mono']">
              Current Track
            </label>
            <select
              value={currentTrack?.id || ""}
              onChange={(e) => {
                const track = tracks.find((t) => t.id === e.target.value);
                setCurrentTrack(track || null);
              }}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="">Select a track...</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.artist} - {track.title} ({track.key}, {track.bpm} BPM)
                </option>
              ))}
            </select>
            {currentTrack && (
              <div className="mt-3 flex items-center gap-4 text-sm">
                <div>
                  <span className="text-white/60">Key: </span>
                  <span className="text-white font-semibold">{currentTrack.key}</span>
                </div>
                <div>
                  <span className="text-white/60">Camelot: </span>
                  <span className="text-primary font-['IBM_Plex_Mono'] font-semibold">
                    {currentCamelot}
                  </span>
                </div>
                <div>
                  <span className="text-white/60">BPM: </span>
                  <span className="text-white font-semibold">{currentTrack.bpm}</span>
                </div>
              </div>
            )}
          </div>

          {showCircle ? (
            /* Camelot Wheel Visualization */
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h2 className="text-lg font-semibold text-white mb-6 text-center">
                Camelot Wheel
              </h2>
              <div className="relative w-full max-w-2xl mx-auto aspect-square">
                {/* Wheel Container */}
                <div className="relative w-full h-full">
                  {CAMELOT_KEYS.map((key, index) => {
                    const angle = (index * 360) / CAMELOT_KEYS.length;
                    const radius = 40; // percentage
                    const x = 50 + radius * Math.cos((angle - 90) * (Math.PI / 180));
                    const y = 50 + radius * Math.sin((angle - 90) * (Math.PI / 180));

                    return (
                      <button
                        key={key.camelot}
                        onClick={() => setSelectedKey(key.camelot)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 flex items-center justify-center text-sm font-['IBM_Plex_Mono'] font-semibold transition-all ${
                          getKeyColor(key.camelot)
                        } ${selectedKey === key.camelot ? "ring-2 ring-primary scale-110" : ""}`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                        }}
                      >
                        {key.camelot}
                      </button>
                    );
                  })}
                  {/* Center Info */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="w-24 h-24 bg-white/5 border-2 border-white/10 rounded-full flex items-center justify-center">
                      <div>
                        <p className="text-xs text-white/60 mb-1">Current</p>
                        <p className="text-lg font-bold text-primary font-['IBM_Plex_Mono']">
                          {currentCamelot || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/30 border border-primary rounded-full" />
                  <span>Current Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded-full" />
                  <span>Compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/5 border border-white/10 rounded-full" />
                  <span>Incompatible</span>
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">All Keys</h2>
              <div className="grid grid-cols-6 gap-2">
                {CAMELOT_KEYS.map((key) => (
                  <button
                    key={key.camelot}
                    onClick={() => setSelectedKey(key.camelot)}
                    className={`p-3 rounded-lg border-2 text-sm font-['IBM_Plex_Mono'] font-semibold transition-all ${
                      getKeyColor(key.camelot)
                    } ${selectedKey === key.camelot ? "ring-2 ring-primary" : ""}`}
                  >
                    {key.camelot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Tracks */}
          {currentTrack && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Harmonically Compatible Tracks
                </h2>
                <span className="text-sm text-white/60 font-['IBM_Plex_Mono']">
                  {suggestedTracks.length} matches
                </span>
              </div>
              {suggestedTracks.length === 0 ? (
                <p className="text-sm text-white/60 text-center py-8">
                  No compatible tracks found. Try adding more tracks to your library.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {suggestedTracks.map((track) => {
                    const trackCamelot = KEY_TO_CAMELOT[track.key];
                    const isPerfectMatch = trackCamelot === currentCamelot;
                    const bpmDiff = Math.abs(track.bpm - currentTrack.bpm);

                    return (
                      <div
                        key={track.id}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white">
                              {track.artist} - {track.title}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-white/60">
                              <span>
                                Key: <span className="text-white">{track.key}</span>
                              </span>
                              <span>
                                Camelot:{" "}
                                <span className="text-primary font-['IBM_Plex_Mono']">
                                  {trackCamelot}
                                </span>
                              </span>
                              <span>
                                BPM: <span className="text-white">{track.bpm}</span>
                                {bpmDiff > 0 && (
                                  <span className="text-white/40 ml-1">
                                    ({bpmDiff > 0 ? "+" : ""}
                                    {bpmDiff})
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isPerfectMatch && (
                              <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-['IBM_Plex_Mono']">
                                Perfect Match
                              </div>
                            )}
                            {bpmDiff > 5 && (
                              <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>BPM diff</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Key Compatibility Info */}
          {currentCamelot && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3">Compatibility Rules</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p>
                  <span className="text-primary font-semibold">Perfect Match:</span> Same Camelot
                  key (e.g., {currentCamelot} → {currentCamelot})
                </p>
                <p>
                  <span className="text-green-400 font-semibold">Harmonic Match:</span> Same number,
                  different letter (e.g., {currentCamelot} → {currentCamelot[0] + (currentCamelot[1] === "A" ? "B" : "A")})
                </p>
                <p>
                  <span className="text-blue-400 font-semibold">Energy Match:</span> Adjacent
                  numbers, same letter (e.g., {currentCamelot} → {CAMELOT_KEYS.find((k) => k.camelot === currentCamelot)?.compatible[2] || "N/A"})
                </p>
                <p className="text-xs text-white/50 mt-3">
                  Tip: Mixing harmonically compatible keys creates smoother transitions and prevents
                  key clashes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

