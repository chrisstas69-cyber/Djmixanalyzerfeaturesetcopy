import React from "react";
import { Dna, Sparkles } from "lucide-react";
import type { Track } from "@/data/mockTracksWithDNA";

export interface TrackDetailViewProps {
  track: Track;
  onGenerateMore?: () => void;
}

export function TrackDetailView({ track, onGenerateMore }: TrackDetailViewProps) {
  const hasDNA = track.generationMethod === "dna" && track.dnaArtistName;
  const { royaltySplit } = track;

  return (
    <div className="p-4 space-y-6 text-left">
      <div>
        <h3 className="text-lg font-semibold text-white truncate">{track.title}</h3>
        <p className="text-sm text-white/60 truncate">{track.artist}</p>
        <p className="text-xs text-white/50 mt-1">
          {track.genre} · {track.bpm} BPM · {track.key} · {track.duration}
        </p>
      </div>

      {/* Attribution */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
        }}
      >
        <h4 className="text-xs font-medium text-white/50 uppercase tracking-wide">
          Attribution
        </h4>
        {hasDNA ? (
          <>
            <p className="text-sm text-white/90">
              Generated using{" "}
              <span className="font-medium text-white">
                {track.dnaPresetName ?? "DNA preset"}
              </span>{" "}
              by{" "}
              <span className="font-medium text-white">{track.dnaArtistName}</span>.
            </p>
            {royaltySplit && (
              <p className="text-xs text-white/70">
                Revenue: You {royaltySplit.creator}%, {track.dnaArtistName}{" "}
                {royaltySplit.dnaArtist}%, Syntax {royaltySplit.platform}%.
              </p>
            )}
            <div className="flex items-center gap-2 text-blue-400">
              <Dna className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">DNA preset used</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-white/70">Prompt only — no DNA preset used.</p>
        )}
      </div>

      {hasDNA && onGenerateMore && (
        <button
          type="button"
          onClick={onGenerateMore}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-colors"
          style={{
            background: "linear-gradient(180deg, var(--orange), var(--orange-2))",
            color: "var(--bg-0)",
          }}
        >
          <Sparkles className="w-4 h-4" />
          Generate more like this
        </button>
      )}
    </div>
  );
}

export default TrackDetailView;
