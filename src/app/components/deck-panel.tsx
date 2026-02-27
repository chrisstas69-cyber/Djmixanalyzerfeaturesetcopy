import { Play, Pause, Circle } from "lucide-react";

interface DeckPanelProps {
  deckId: "A" | "B";
  track: {
    title: string;
    artist: string;
    bpm: number;
    key: string;
    duration: number;
    artwork?: string;
  } | null;
  isPlaying: boolean;
  isSynced: boolean;
  position: number; // 0-100
  tempo: number; // -8 to +8
  onPlay: () => void;
  onSync: () => void;
  onCue: () => void;
  onTempoChange: (value: number) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function DeckPanel({
  deckId,
  track,
  isPlaying,
  isSynced,
  position,
  tempo,
  onPlay,
  onSync,
  onCue,
  onTempoChange,
  onDrop,
}: DeckPanelProps) {
  const waveformBars = Array.from({ length: 100 }, () => Math.random() * 80 + 20);
  
  return (
    <div
      className={`flex-1 bg-[#111111] rounded-lg border-2 transition-all ${
        isPlaying ? "border-[#00D4FF]" : "border-[rgba(255,255,255,0.1)]"
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {track ? (
        <div className="p-2 h-full flex flex-col">
          {/* Header: Deck label and track info - single compact line */}
          <div className="flex items-center gap-2 mb-2">
            {/* Artwork - 60x60 */}
            <div className="w-[60px] h-[60px] bg-[#0a0a0a] rounded flex-shrink-0 overflow-hidden border border-white/10">
              {track.artwork ? (
                <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Circle className="w-5 h-5 text-white/20" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[#00D4FF] text-[11px] font-bold uppercase tracking-wider font-['Rajdhani']">
                  DECK {deckId}
                </span>
                {isSynced && (
                  <span className="text-[#00FF66] text-[9px] font-bold uppercase">SYNCED</span>
                )}
              </div>
              {/* Single line: Title | Artist | BPM | Key */}
              <div className="text-white text-[14px] font-bold truncate">
                {track.title} <span className="text-[#888888] font-normal">| {track.artist}</span> <span className="text-[#00D4FF] font-['JetBrains_Mono']">| {track.bpm} BPM</span> <span className="text-[#00D4FF] font-['JetBrains_Mono']">| {track.key}</span>
              </div>
            </div>
          </div>

          {/* Waveform Display - 50px */}
          <div className="relative bg-[#0a0a0a] rounded h-[50px] mb-2 overflow-hidden border border-white/5">
            {/* Time markers - more visible */}
            <div className="absolute top-1 left-2 right-2 flex justify-between text-[10px] text-[#666] font-['JetBrains_Mono'] z-10">
              <span>0:00</span>
              <span>1:00</span>
              <span>2:00</span>
              <span>3:00</span>
            </div>

            {/* Waveform bars */}
            <div className="absolute inset-0 flex items-center gap-[1px] px-2 pt-6">
              {waveformBars.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isPlaying ? "#00D4FF" : "#00D4FF60",
                    opacity: i < position ? 1 : 0.3,
                  }}
                />
              ))}
            </div>

            {/* Playhead - vertical white line */}
            <div
              className="absolute top-6 bottom-1 w-[2px] bg-white shadow-lg z-20 transition-all"
              style={{ left: `calc(2% + ${position}% * 0.96)` }}
            />
          </div>

          {/* Transport Controls - 28px height buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCue}
              className="w-[60px] h-[28px] bg-[#1a1a1a] text-white text-[12px] font-bold uppercase rounded hover:bg-[#252525] transition"
            >
              CUE
            </button>
            <button
              onClick={onPlay}
              className={`w-[70px] h-[28px] text-[12px] font-bold uppercase rounded transition flex items-center justify-center gap-1 ${
                isPlaying
                  ? "bg-[#00D4FF] text-black"
                  : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <button
              onClick={onSync}
              className={`w-[60px] h-[28px] text-[12px] font-bold uppercase rounded transition ${
                isSynced
                  ? "bg-[#00FF66] text-black"
                  : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
              }`}
            >
              SYNC
            </button>
            <span className="text-[#00D4FF] text-[12px] font-bold font-['JetBrains_Mono'] ml-auto">
              Tempo: {tempo > 0 ? "+" : ""}{tempo.toFixed(1)}%
            </span>
          </div>
        </div>
      ) : (
        // Empty deck state
        <div className="h-full flex items-center justify-center p-2">
          <div className="w-full h-full border-2 border-dashed border-[#333] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Circle className="w-10 h-10 text-white/10 mx-auto mb-2" />
              <p className="text-white/40 text-[13px] font-semibold mb-0.5">Drop track here</p>
              <p className="text-[#00D4FF] text-[11px] font-['Rajdhani'] uppercase font-bold">DECK {deckId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

