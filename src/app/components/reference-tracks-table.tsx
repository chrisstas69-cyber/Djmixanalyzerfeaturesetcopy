import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Play, Pause, Music2, GripVertical, CheckSquare, Square, ChevronDown, ChevronUp, Star, Search } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";

// Column definition - matching Track Library exactly
type ColumnId = "checkbox" | "play" | "favorite" | "artwork" | "title" | "artist" | "album" | "label" | "bpm" | "key" | "time" | "energy" | "dateAdded" | "actions";

interface Column {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  align: "left" | "center" | "right";
  visible: boolean;
}

interface ReferenceTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  label?: string;
  genre: string;
  bpm: number;
  key: string;
  duration: string;
  energy?: string;
  status: "Analyzed" | "Learning" | "Excluded";
  dateAdded: string;
  artwork?: string;
}

const ROW_HEIGHT = 40;
const ITEM_TYPE = "COLUMN";

// Default columns - matching Track Library exactly
const DEFAULT_COLUMNS: Column[] = [
  { id: "checkbox", label: "", width: 40, minWidth: 40, align: "center", visible: true },
  { id: "play", label: "", width: 40, minWidth: 40, align: "center", visible: true },
  { id: "favorite", label: "", width: 40, minWidth: 40, align: "center", visible: true },
  { id: "artwork", label: "ART", width: 48, minWidth: 48, align: "center", visible: true },
  { id: "title", label: "TITLE", width: 280, minWidth: 120, align: "left", visible: true },
  { id: "artist", label: "ARTIST", width: 200, minWidth: 120, align: "left", visible: true },
  { id: "album", label: "ALBUM", width: 180, minWidth: 100, align: "left", visible: true },
  { id: "label", label: "LABEL", width: 150, minWidth: 100, align: "left", visible: true },
  { id: "bpm", label: "BPM", width: 70, minWidth: 60, align: "center", visible: true },
  { id: "key", label: "KEY", width: 60, minWidth: 50, align: "center", visible: true },
  { id: "time", label: "TIME", width: 70, minWidth: 60, align: "center", visible: true },
  { id: "energy", label: "ENERGY", width: 90, minWidth: 70, align: "left", visible: true },
  { id: "dateAdded", label: "DATE ADDED", width: 120, minWidth: 100, align: "center", visible: true },
  { id: "actions", label: "ACTIONS", width: 90, minWidth: 80, align: "center", visible: true },
];

// Draggable Column Header Component - matching Track Library
function DraggableColumnHeader({
  column,
  index,
  moveColumn,
  onResizeStart,
  isSorted,
  sortDirection,
  onSort,
  allSelected,
  someSelected,
  onSelectAll,
}: {
  column: Column;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onResizeStart: (columnId: ColumnId, e: React.MouseEvent) => void;
  isSorted?: boolean;
  sortDirection?: "asc" | "desc";
  onSort?: () => void;
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: () => void;
}) {
  const ref = useRef<HTMLTableCellElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const isSortable = column.id === "title" || column.id === "bpm" || column.id === "time" || column.id === "energy" || column.id === "dateAdded";

  if (column.id === "checkbox") {
    return (
      <th
        ref={ref}
        className="px-3 text-center border-r border-white/5 relative"
        style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectAll?.();
          }}
          className="w-4 h-4 flex items-center justify-center mx-auto"
          aria-label={allSelected ? "Deselect all" : "Select all"}
        >
          {allSelected ? (
            <CheckSquare className="w-4 h-4 text-primary" fill="currentColor" />
          ) : someSelected ? (
            <div className="w-4 h-4 border-2 border-primary rounded bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded" />
            </div>
          ) : (
            <Square className="w-4 h-4 text-white/30" />
          )}
        </button>
      </th>
    );
  }

  return (
    <th
      ref={ref}
      className={`relative px-3 text-xs font-semibold uppercase tracking-wider text-white/60 border-r border-white/5 select-none ${
        isDragging ? "opacity-50" : ""
      } ${isSortable ? "cursor-pointer hover:bg-white/5 transition-colors" : ""}`}
      style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}
      onClick={onSort}
    >
      <div className={`flex items-center gap-1.5 ${column.align === "center" ? "justify-center" : column.align === "right" ? "justify-end" : ""}`}>
        <GripVertical className="w-3 h-3 text-white/20 cursor-move flex-shrink-0" />
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-['IBM_Plex_Mono'] font-medium">
          {column.label}
        </span>
        {isSortable && isSorted && (
          sortDirection === "asc" ? (
            <ChevronUp className="w-3 h-3 text-primary flex-shrink-0" />
          ) : (
            <ChevronDown className="w-3 h-3 text-primary flex-shrink-0" />
          )
        )}
      </div>
      {/* Resize Handle */}
      {(column.id === "artwork" || column.id === "title" || column.id === "artist" || column.id === "album" || column.id === "label" || column.id === "bpm" || column.id === "key" || column.id === "time" || column.id === "energy" || column.id === "dateAdded" || column.id === "actions") && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-20"
          onMouseDown={(e) => onResizeStart(column.id, e)}
        />
      )}
    </th>
  );
}

// Mock reference tracks (32 tracks)
const MOCK_REFERENCE_TRACKS: ReferenceTrack[] = Array.from({ length: 32 }, (_, i) => {
  const artists = ["DJ Shadow", "Underground Mix", "Berlin Basement", "Soulful Sessions", "Low Frequency", "Night Shift", "303 Sessions", "Echo Chamber"];
  const titles = ["Midnight Grooves", "Hypnotic Groove", "Warehouse Nights", "Deep House Vibes", "Rolling Bassline", "Peak Time Energy", "Acid Reflections", "Late Night Dub"];
  const albums = ["Endtroducing", "Deep Sessions Vol.1", "Concrete Dreams", "Soulful Deep", "Bass Culture", "After Hours", "Acid Archives", "Dub Collective"];
  const labels = ["Warp Records", "Ninja Tune", "Ostgut Ton", "Innervisions", "Perlon", "Drumcode", "Clone", "Basic Channel"];
  const genres = ["House", "Techno", "Deep House", "Tech House", "Minimal", "Progressive", "Acid Techno", "Dub Techno"];
  const energies = ["Rising", "Building", "Peak", "Chill", "Groove", "Steady"];
  const keys = ["Am", "Bm", "Cm", "Dm", "Em", "Fm", "Gm", "C", "D", "E", "F", "G", "A", "B"];
  const bpms = [122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132];
  const statuses: ("Analyzed" | "Learning" | "Excluded")[] = ["Analyzed", "Analyzed", "Analyzed", "Learning", "Excluded"];
  
  const randomDuration = () => {
    const minutes = 5 + Math.floor(Math.random() * 3);
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  
  const randomDate = () => {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };
  
  return {
    id: `ref-${i + 1}`,
    title: titles[i % titles.length] + (i > 7 ? ` ${Math.floor(i / 8) + 1}` : ""),
    artist: artists[i % artists.length],
    album: albums[i % albums.length],
    label: labels[i % labels.length],
    genre: genres[i % genres.length],
    bpm: bpms[i % bpms.length],
    key: keys[i % keys.length],
    duration: randomDuration(),
    energy: energies[i % energies.length],
    status: statuses[i % statuses.length],
    dateAdded: randomDate(),
  };
});

interface ReferenceTracksTableProps {
  onAddTracks: () => void;
}

export function ReferenceTracksTable({ onAddTracks }: ReferenceTracksTableProps) {
  const [tracks] = useState<ReferenceTrack[]>(MOCK_REFERENCE_TRACKS);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<Set<string>>(new Set());
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [columns, setColumns] = useState<Column[]>(() => {
    const saved = localStorage.getItem('dnaLibraryColumns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_COLUMNS;
      }
    }
    return DEFAULT_COLUMNS;
  });
  const [resizingColumn, setResizingColumn] = useState<ColumnId | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [sortColumn, setSortColumn] = useState<"title" | "bpm" | "time" | "energy" | "dateAdded" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dnaFavoriteTracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFavoriteTracks(new Set(parsed));
      }
    } catch (e) {
      // Use empty set
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('dnaFavoriteTracks', JSON.stringify(Array.from(favoriteTracks)));
  }, [favoriteTracks]);

  // Save column order and widths to localStorage
  useEffect(() => {
    localStorage.setItem('dnaLibraryColumns', JSON.stringify(columns));
  }, [columns]);

  // Column resizing
  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX;
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === resizingColumn) {
            const newWidth = Math.max(col.minWidth, resizeStartWidth + diff);
            return { ...col, width: newWidth };
          }
          return col;
        })
      );
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  const handleResizeStart = (columnId: ColumnId, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(columnId);
    setResizeStartX(e.clientX);
    const column = columns.find((c) => c.id === columnId);
    if (column) {
      setResizeStartWidth(column.width);
    }
  };

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      const draggedColumn = newColumns[dragIndex];
      newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, draggedColumn);
      return newColumns;
    });
  }, []);

  // Filter and sort tracks
  const filteredAndSortedTracks = useMemo(() => {
    let filtered = [...tracks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query) ||
          track.album.toLowerCase().includes(query) ||
          (track.label || "").toLowerCase().includes(query) ||
          track.bpm.toString().includes(query) ||
          track.key.toLowerCase().includes(query) ||
          (track.energy || "").toLowerCase().includes(query) ||
          track.genre.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (sortColumn) {
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "bpm":
            comparison = a.bpm - b.bpm;
            break;
          case "time":
            const parseDuration = (duration: string) => {
              const parts = duration.split(":");
              return parseInt(parts[0]) * 60 + parseInt(parts[1] || "0");
            };
            comparison = parseDuration(a.duration) - parseDuration(b.duration);
            break;
          case "energy":
            comparison = (a.energy || "").localeCompare(b.energy || "");
            break;
          case "dateAdded":
            comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
            break;
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [tracks, searchQuery, sortColumn, sortDirection]);

  const handleSort = (column: "title" | "bpm" | "time" | "energy" | "dateAdded") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTracks.length === filteredAndSortedTracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(filteredAndSortedTracks.map((t) => t.id));
    }
  };

  const toggleFavorite = (trackId: string) => {
    setFavoriteTracks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const handlePlay = (trackId: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
      const track = tracks.find((t) => t.id === trackId);
      if (track) {
        toast.success(`Playing "${track.title}"`);
      }
    }
  };

  const handleRemoveSelected = () => {
    if (selectedTracks.length === 0) return;
    toast.success(`Removed ${selectedTracks.length} track(s)`);
    setSelectedTracks([]);
    // In a real app, this would remove tracks from the DNA library
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const visibleColumns = columns.filter((col) => col.visible);
  const allSelected = selectedTracks.length === filteredAndSortedTracks.length && filteredAndSortedTracks.length > 0;
  const someSelected = selectedTracks.length > 0 && selectedTracks.length < filteredAndSortedTracks.length;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col bg-[#0a0a0f]">
        {/* Top Bar - Matching Track Library */}
        <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">DNA Reference Tracks</h1>
              <p className="text-xs text-white/40">
                {filteredAndSortedTracks.length} tracks
                {selectedTracks.length > 0 && (
                  <span className="ml-2 text-primary">
                    • {selectedTracks.length} selected
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="font-['IBM_Plex_Mono'] text-xs h-8 bg-white/5 border-white/10 text-white hover:bg-white/10"
                onClick={onAddTracks}
              >
                Add Tracks
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-['IBM_Plex_Mono'] text-xs h-8 bg-white/5 border-white/10 text-white hover:bg-white/10"
                onClick={handleRemoveSelected}
                disabled={selectedTracks.length === 0}
              >
                Remove Selected
              </Button>
            </div>
          </div>
          
          {/* Search Bar - Matching Track Library */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0a0a0f] border-b border-white/10">
              <tr>
                {visibleColumns.map((column, index) => (
                <DraggableColumnHeader
                  key={column.id}
                  column={column}
                  index={index}
                  moveColumn={moveColumn}
                    onResizeStart={handleResizeStart}
                    isSorted={sortColumn === column.id}
                    sortDirection={sortDirection}
                    onSort={column.id === "title" || column.id === "bpm" || column.id === "time" || column.id === "energy" || column.id === "dateAdded" ? () => handleSort(column.id as any) : undefined}
                    allSelected={allSelected}
                    someSelected={someSelected}
                    onSelectAll={toggleSelectAll}
                />
              ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTracks.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Music2 className="w-16 h-16 text-white/20 mb-4" />
                      <p className="text-white/60 mb-2">
                        {searchQuery ? "No tracks match your search" : "No reference tracks found"}
                      </p>
                      <p className="text-sm text-white/40">
                        {searchQuery ? "Try adjusting your search" : "Upload tracks to build your DNA"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedTracks.map((track) => {
                const isHovered = hoveredRow === track.id;
                const isSelected = selectedTracks.includes(track.id);
                const isPlaying = playingTrackId === track.id;
                const isFavorite = favoriteTracks.has(track.id);

                return (
                  <tr
                    key={track.id}
                    onMouseEnter={() => setHoveredRow(track.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`border-b border-white/5 transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/10" : isHovered ? "bg-white/5" : ""
                    }`}
                    style={{ height: `${ROW_HEIGHT}px` }}
                  >
                    {visibleColumns.map((column) => {
                      if (column.id === "checkbox") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTrackSelection(track.id);
                              }}
                              className="w-4 h-4 flex items-center justify-center mx-auto"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-primary" fill="currentColor" />
                              ) : (
                                <Square className="w-4 h-4 text-white/30" />
                              )}
                            </button>
                          </td>
                        );
                      }

                      if (column.id === "play") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlay(track.id);
                              }}
                              className="w-6 h-6 flex items-center justify-center mx-auto text-white/60 hover:text-white transition-colors"
                            >
                              {isPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        );
                      }

                      if (column.id === "favorite") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(track.id);
                              }}
                              className="w-4 h-4 flex items-center justify-center mx-auto text-white/30 hover:text-yellow-400 transition-colors"
                            >
                              {isFavorite ? (
                                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        );
                      }

                      if (column.id === "artwork") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden shadow-sm">
                              {track.artwork ? (
                                <img src={track.artwork} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Music2 className="w-4 h-4 text-white/30" />
                              )}
                            </div>
                          </td>
                        );
                      }

                      if (column.id === "title") {
                        return (
                          <td key={column.id} className="px-3 border-r border-white/5">
                            <div className="h-full flex items-center truncate">
                              <span className="text-sm text-white truncate">{track.title}</span>
                            </div>
                          </td>
                        );
                      }

                      if (column.id === "artist") {
                        return (
                          <td key={column.id} className="px-3 border-r border-white/5">
                            <div className="h-full flex items-center truncate">
                              <span className="text-sm text-white/70 truncate">{track.artist}</span>
                            </div>
                          </td>
                        );
                      }

                      if (column.id === "album") {
                        return (
                          <td key={column.id} className="px-3 border-r border-white/5">
                            <div className="h-full flex items-center truncate">
                              <span className="text-sm text-white/60 truncate">{track.album}</span>
                            </div>
                          </td>
                        );
                      }

                      if (column.id === "label") {
                        return (
                          <td key={column.id} className="px-3 border-r border-white/5">
                            <div className="h-full flex items-center truncate">
                              <span className="text-sm text-white/60 truncate">{track.label || "-"}</span>
                            </div>
                          </td>
                        );
                      }

                      if (column.id === "bpm") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <span className="text-sm text-white/70 font-['IBM_Plex_Mono'] tabular-nums">
                              {track.bpm}
                            </span>
                          </td>
                        );
                      }

                      if (column.id === "key") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <span className="text-sm text-white/70 font-['IBM_Plex_Mono']">{track.key}</span>
                          </td>
                        );
                      }

                      if (column.id === "time") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <span className="text-sm text-white/60 font-['IBM_Plex_Mono'] tabular-nums">
                              {track.duration}
                            </span>
                          </td>
                        );
                      }

                      if (column.id === "energy") {
                        return (
                          <td key={column.id} className="px-3 border-r border-white/5">
                            <span className="text-xs text-white/60 truncate">{track.energy || "-"}</span>
                          </td>
                        );
                      }

                      if (column.id === "dateAdded") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <span className="text-sm text-white/60 font-['IBM_Plex_Mono']">
                              {formatDate(track.dateAdded)}
                            </span>
                          </td>
                        );
                      }

                      if (column.id === "actions") {
                        return (
                          <td key={column.id} className="px-3 text-center border-r border-white/5">
                            <div className="h-full flex items-center justify-center gap-2">
                              {isHovered && (
                                <span
                                  className={`text-[10px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-sm ${
                                    track.status === "Analyzed"
                                      ? "bg-primary/20 text-primary"
                                      : track.status === "Learning"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : "bg-white/10 text-white/60"
                                  }`}
                                >
                                  {track.status}
                                </span>
                              )}
                  </div>
                          </td>
                        );
                      }

                      return null;
                    })}
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DndProvider>
  );
}
