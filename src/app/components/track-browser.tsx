import { useState } from "react";
import { Music2, Search } from "lucide-react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  bpm: number;
  key: string;
  duration: number;
  artwork?: string;
  rating?: number;
  type?: "dna" | "generated";
}

interface TrackBrowserProps {
  tracks: Track[];
  onTrackDoubleClick: (track: Track) => void;
  onTrackDragStart: (track: Track) => void;
  onLoadToDeck?: (track: Track, deck: "A" | "B") => void;
}

export function TrackBrowser({
  tracks,
  onTrackDoubleClick,
  onTrackDragStart,
  onLoadToDeck,
}: TrackBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "dna" | "generated">("all");
  const [sortColumn, setSortColumn] = useState<keyof Track | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; track: Track } | null>(null);

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      searchQuery === "" ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterType === "all" || track.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  const handleSort = (column: keyof Track) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Close context menu when clicking anywhere
  const handleClick = () => {
    if (contextMenu) setContextMenu(null);
  };

  return (
    <div className="bg-[#0a0a0a] h-full flex flex-col" onClick={handleClick}>
      {/* Header with search and filters */}
      <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 text-xs font-bold uppercase rounded transition ${
              filterType === "all"
                ? "bg-[#00D4FF] text-black"
                : "bg-[#111] text-white/60 hover:text-white"
            }`}
          >
            All ({tracks.length})
          </button>
          <button
            onClick={() => setFilterType("dna")}
            className={`px-3 py-1 text-xs font-bold uppercase rounded transition ${
              filterType === "dna"
                ? "bg-[#00D4FF] text-black"
                : "bg-[#111] text-white/60 hover:text-white"
            }`}
          >
            DNA Tracks
          </button>
          <button
            onClick={() => setFilterType("generated")}
            className={`px-3 py-1 text-xs font-bold uppercase rounded transition ${
              filterType === "generated"
                ? "bg-[#00D4FF] text-black"
                : "bg-[#111] text-white/60 hover:text-white"
            }`}
          >
            Generated
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111] text-white text-sm rounded border border-[rgba(255,255,255,0.1)] focus:border-[#00D4FF] focus:outline-none w-[300px]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          {/* Table Header - Sticky */}
          <thead className="sticky top-0 bg-[#1a1a1a] z-10">
            <tr className="border-b border-[rgba(255,255,255,0.1)]">
              <th className="text-left px-4 py-2 w-12"></th>
              <th
                className="text-left px-4 py-2 text-white/60 text-xs uppercase font-bold cursor-pointer hover:text-white transition font-['Rajdhani']"
                onClick={() => handleSort("title")}
              >
                Title {sortColumn === "title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-left px-4 py-2 text-white/60 text-xs uppercase font-bold cursor-pointer hover:text-white transition font-['Rajdhani']"
                onClick={() => handleSort("artist")}
              >
                Artist {sortColumn === "artist" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="text-left px-4 py-2 text-white/60 text-xs uppercase font-bold font-['Rajdhani']">
                Album
              </th>
              <th
                className="text-left px-4 py-2 text-white/60 text-xs uppercase font-bold cursor-pointer hover:text-white transition font-['Rajdhani']"
                onClick={() => handleSort("bpm")}
              >
                BPM {sortColumn === "bpm" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-left px-4 py-2 text-white/60 text-xs uppercase font-bold cursor-pointer hover:text-white transition font-['Rajdhani']"
                onClick={() => handleSort("key")}
              >
                Key {sortColumn === "key" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-left px-4 py-2 text-white/60 text-xs uppercase font-bold cursor-pointer hover:text-white transition font-['Rajdhani']"
                onClick={() => handleSort("duration")}
              >
                Duration {sortColumn === "duration" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="text-left px-4 py-2 text-white/60 text-xs uppercase font-bold font-['Rajdhani']">
                Rating
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedTracks.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <Music2 className="w-12 h-12 text-white/10 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">No tracks found</p>
                  <p className="text-white/20 text-xs mt-1">
                    {searchQuery ? "Try a different search" : "Upload some tracks to get started"}
                  </p>
                </td>
              </tr>
            ) : (
              sortedTracks.map((track) => (
                <tr
                  key={track.id}
                  className={`border-b border-[rgba(255,255,255,0.05)] cursor-pointer transition ${
                    selectedTrack === track.id
                      ? "bg-[#1a1a1a] border-l-[3px] border-l-[#00D4FF]"
                      : hoveredTrack === track.id
                      ? "bg-[#1a1a1a] border-l-[3px] border-l-[#00D4FF]/50"
                      : "border-l-[3px] border-l-transparent hover:bg-[#151515]"
                  }`}
                  onMouseEnter={() => setHoveredTrack(track.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  onClick={() => setSelectedTrack(track.id)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onTrackDoubleClick(track);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextMenu({ x: e.clientX, y: e.clientY, track });
                  }}
                  draggable
                  onDragStart={() => onTrackDragStart(track)}
                >
                  {/* Artwork */}
                  <td className="px-4 py-2">
                    <div className="w-10 h-10 bg-[#111] rounded overflow-hidden flex-shrink-0">
                      {track.artwork ? (
                        <img
                          src={track.artwork}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music2 className="w-5 h-5 text-white/20" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-2">
                    <p className="text-white text-sm font-bold truncate">{track.title}</p>
                  </td>

                  {/* Artist */}
                  <td className="px-4 py-2">
                    <p className="text-[#888] text-sm truncate">{track.artist}</p>
                  </td>

                  {/* Album */}
                  <td className="px-4 py-2">
                    <p className="text-[#888] text-sm truncate">{track.album || "—"}</p>
                  </td>

                  {/* BPM */}
                  <td className="px-4 py-2">
                    <span className="text-[#00D4FF] text-sm font-bold font-['JetBrains_Mono']">
                      {track.bpm}
                    </span>
                  </td>

                  {/* Key */}
                  <td className="px-4 py-2">
                    <span className="text-[#00D4FF] text-sm font-bold font-['JetBrains_Mono']">
                      {track.key}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-2">
                    <span className="text-[#888] text-sm font-['JetBrains_Mono']">
                      {formatDuration(track.duration)}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-sm ${
                            track.rating && i < track.rating ? "bg-[#FF9500]" : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-[#1a1a1a] border border-[rgba(255,255,255,0.2)] rounded shadow-xl z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#00D4FF] hover:text-black transition"
              onClick={() => {
                if (onLoadToDeck) {
                  onLoadToDeck(contextMenu.track, "A");
                } else {
                  onTrackDoubleClick(contextMenu.track);
                }
                setContextMenu(null);
              }}
            >
              Load to Deck A
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#00D4FF] hover:text-black transition"
              onClick={() => {
                if (onLoadToDeck) {
                  onLoadToDeck(contextMenu.track, "B");
                } else {
                  onTrackDoubleClick(contextMenu.track);
                }
                setContextMenu(null);
              }}
            >
              Load to Deck B
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

