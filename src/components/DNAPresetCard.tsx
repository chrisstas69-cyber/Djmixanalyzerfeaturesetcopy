import { CheckCircle } from "lucide-react";
import type { DNAPreset } from "@/data/mockDNAPresets";

function getInitials(artistName: string): string {
  const words = artistName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatUseCount(n: number): string {
  return n.toLocaleString() + " uses";
}

export interface DNAPresetCardProps {
  preset: DNAPreset;
  selected: boolean;
  onSelect: () => void;
  /** Compact variant for horizontal carousel (smaller card) */
  compact?: boolean;
}

const CARD_WIDTH = 320;
const CARD_WIDTH_COMPACT = 200;
const IMAGE_HEIGHT_16_9 = Math.round((CARD_WIDTH * 9) / 16);
const IMAGE_HEIGHT_COMPACT = Math.round((CARD_WIDTH_COMPACT * 9) / 16);

export function DNAPresetCard({ preset, selected, onSelect, compact }: DNAPresetCardProps) {
  const initials = getInitials(preset.artistName);
  const width = compact ? CARD_WIDTH_COMPACT : CARD_WIDTH;
  const imageHeight = compact ? IMAGE_HEIGHT_COMPACT : IMAGE_HEIGHT_16_9;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="shrink-0 rounded-xl overflow-hidden bg-gray-900 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-0)]"
      style={{
        width: `${width}px`,
        boxShadow: selected
          ? "0 0 0 2px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.4)"
          : undefined,
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-gray-800"
        style={{ height: `${imageHeight}px` }}
      >
        {preset.imageUrl ? (
          <>
            <img
              src={preset.imageUrl}
              alt={preset.artistName}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
              }}
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white/80 font-bold text-3xl"
            style={{
              background: "linear-gradient(180deg, var(--panel), var(--panel-2))",
            }}
          >
            {initials}
          </div>
        )}
        {selected && (
          <span className="absolute top-2 right-2 z-10 text-[#3b82f6] drop-shadow-lg">
            <CheckCircle className={compact ? "w-5 h-5" : "w-8 h-8"} strokeWidth={2} />
          </span>
        )}
      </div>

      <div className={compact ? "p-2.5 text-left" : "p-4 text-left"}>
        <p className={compact ? "text-sm font-bold text-white truncate" : "text-lg font-bold text-white truncate"}>
          {preset.artistName}
        </p>
        <p className={compact ? "text-xs truncate text-white/70 mt-0.5" : "text-sm truncate text-white/70 mt-0.5"}>
          {preset.presetName}
        </p>
        <div className={`flex items-center justify-between gap-2 flex-wrap ${compact ? "mt-2" : "mt-3"}`}>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {preset.genre}
          </span>
          <span className="text-xs text-white/50 ml-auto">
            {formatUseCount(preset.useCount)}
          </span>
        </div>
      </div>
    </button>
  );
}
