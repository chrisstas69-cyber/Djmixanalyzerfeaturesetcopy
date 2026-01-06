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
        <div className="p-4 h-full flex flex-col">
          {/* Header: Deck label and track info */}
          <div className="flex items-start gap-3 mb-3">
            {/* Artwork - 50x50 */}
            <div className="w-[50px] h-[50px] bg-[#0a0a0a] rounded flex-shrink-0 overflow-hidden border border-white/10">
              {track.artwork ? (
                <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Circle className="w-5 h-5 text-white/20" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#00D4FF] text-xs font-bold uppercase tracking-wider font-['Rajdhani']">
                  DECK {deckId}
                </span>
                {isSynced && (
                  <span className="text-[#00FF66] text-[10px] font-bold uppercase">SYNCED</span>
                )}
              </div>
              <h3 className="text-white text-sm font-bold truncate mb-0.5">{track.title}</h3>
              <p className="text-[#888888] text-xs truncate">{track.artist}</p>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-[#00D4FF] text-black text-xs font-bold px-2 py-0.5 rounded font-['JetBrains_Mono']">
                  {track.bpm} BPM
                </span>
                <span className="bg-[#252525] text-white text-xs font-bold px-2 py-0.5 rounded font-['JetBrains_Mono']">
                  {track.key}
                </span>
              </div>
            </div>
          </div>

          {/* Waveform Display */}
          <div className="relative bg-[#0a0a0a] rounded h-[80px] mb-3 overflow-hidden border border-white/5">
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

          {/* Transport Controls */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={onCue}
              className="px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-bold uppercase rounded hover:bg-[#252525] transition"
            >
              CUE
            </button>
            <button
              onClick={onPlay}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded transition flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition ${
                isSynced
                  ? "bg-[#00FF66] text-black"
                  : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
              }`}
            >
              SYNC
            </button>
          </div>

          {/* Tempo Slider */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/40 text-[10px] uppercase font-['Rajdhani']">TEMPO</span>
              <span className="text-[#00D4FF] text-xs font-bold font-['JetBrains_Mono']">
                {tempo > 0 ? "+" : ""}{tempo.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="-8"
              max="8"
              step="0.1"
              value={tempo}
              onChange={(e) => onTempoChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#252525] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00D4FF] [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      ) : (
        // Empty deck state
        <div className="h-full flex items-center justify-center p-4">
          <div className="w-full h-full border-2 border-dashed border-[#333] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Circle className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/40 text-sm font-semibold mb-1">Drop track here</p>
              <p className="text-white/20 text-xs">or double-click from library</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

