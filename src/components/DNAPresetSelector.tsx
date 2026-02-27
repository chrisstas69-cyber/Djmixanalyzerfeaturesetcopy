import { useState, useMemo } from "react";
import { CheckCircle, Music, Search, Filter, ChevronDown, ChevronRight, Info } from "lucide-react";
import { DNAPresetCard } from "./DNAPresetCard";
import { MOCK_DNA_PRESETS } from "@/data/mockDNAPresets";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

const GENRE_OPTIONS = [
  "All",
  "Tech House",
  "Techno",
  "Deep House",
  "Melodic House",
  "Deep Tech",
  "Melodic Techno",
  "Afro House",
] as const;

type SortOption = "mostUsed" | "newest" | "aToZ";

export interface DNAPresetSelectorProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

const SKELETON_CARD_WIDTH = 200;
const SKELETON_IMAGE_HEIGHT = Math.round((SKELETON_CARD_WIDTH * 9) / 16);

function SkeletonCardCompact() {
  return (
    <div
      className="shrink-0 rounded-xl overflow-hidden bg-gray-900 animate-pulse"
      style={{ width: SKELETON_CARD_WIDTH }}
    >
      <div className="w-full bg-gray-800" style={{ height: SKELETON_IMAGE_HEIGHT }} />
      <div className="p-2.5 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 bg-gray-800 rounded-full w-20" />
          <div className="h-3 bg-gray-800 rounded w-12 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function DNAPresetSelector({
  selectedId,
  onSelect,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
}: DNAPresetSelectorProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;
  const setExpanded = (value: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof value === "function" ? value(expanded) : value;
    if (onExpandedChange) onExpandedChange(next);
    if (!isControlled) setInternalExpanded(next);
  };
  const [genreFilter, setGenreFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("mostUsed");
  const [loading, setLoading] = useState(false);

  const selectedPreset = useMemo(
    () => (selectedId ? MOCK_DNA_PRESETS.find((p) => p.id === selectedId) : null),
    [selectedId]
  );

  const filteredAndSorted = useMemo(() => {
    let list = [...MOCK_DNA_PRESETS];
    if (genreFilter !== "All") {
      list = list.filter((p) => p.genre === genreFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) => p.artistName.toLowerCase().includes(q));
    }
    if (sortBy === "mostUsed") {
      list.sort((a, b) => b.useCount - a.useCount);
    } else if (sortBy === "newest") {
      list.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
    } else {
      list.sort((a, b) => a.artistName.localeCompare(b.artistName));
    }
    return list;
  }, [genreFilter, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCardCompact key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-white/5"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
        }}
      >
        <span className="flex items-center gap-2 text-white font-medium">
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-white/60 shrink-0" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white/60 shrink-0" />
          )}
          Choose DNA Preset
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex text-white/50 hover:text-white/80 transition-colors cursor-help focus:outline-none"
                onClick={(e) => e.stopPropagation()}
                aria-label="What is DNA preset?"
              >
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px]">
              Select an artist style to guide the groove and structure.
            </TooltipContent>
          </Tooltip>
        </span>
        {!expanded && (
          <span className="text-sm text-white/60 truncate max-w-[240px]">
            {selectedPreset
              ? `${selectedPreset.artistName} – ${selectedPreset.presetName}`
              : "No preset selected"}
          </span>
        )}
      </button>

      {expanded && (
        <div className="space-y-4 pt-2">
          {selectedPreset && (
            <div
              className="flex items-center justify-between gap-4 rounded-lg px-4 py-2.5"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle className="w-4 h-4 shrink-0 text-[#3b82f6]" />
                <span className="text-sm font-medium text-white truncate">
                  Selected: {selectedPreset.artistName} – {selectedPreset.presetName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="shrink-0 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
              >
                Clear Selection
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-40 min-w-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input
                type="text"
                placeholder="Search artist"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-lg border border-white/10 bg-gray-900 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/30 transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-white/40" />
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-white/10 bg-gray-900 text-white text-sm focus:outline-none focus:border-[#3b82f6]/50 appearance-none cursor-pointer"
              >
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 px-3 rounded-lg border border-white/10 bg-gray-900 text-white text-sm focus:outline-none focus:border-[#3b82f6]/50 appearance-none cursor-pointer"
            >
              <option value="mostUsed">Most Used</option>
              <option value="newest">Newest</option>
              <option value="aToZ">A–Z</option>
            </select>
          </div>

          {filteredAndSorted.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 rounded-xl text-center"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
              }}
            >
              <Music className="w-10 h-10 text-white/30 mb-3" />
              <p className="text-white/70 font-medium text-sm">No presets match your filters</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
              {filteredAndSorted.map((preset) => (
                <DNAPresetCard
                  key={preset.id}
                  preset={preset}
                  selected={preset.id === selectedId}
                  onSelect={() => onSelect(preset.id === selectedId ? null : preset.id)}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
