import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Play, Pause, Music2, GripVertical } from "lucide-react";
import { toast } from "sonner";

// Column definition
type ColumnId = "checkbox" | "waveform" | "title" | "artist" | "album" | "genre" | "bpm" | "key" | "time" | "dateAdded" | "status";

interface Column {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  align: "left" | "center" | "right";
  flex?: boolean;
}

const ITEM_TYPE = "COLUMN";

// Default column order - matching Track Library style
const DEFAULT_COLUMNS: Column[] = [
  { id: "checkbox", label: "", width: 40, minWidth: 40, align: "center" },
  { id: "waveform", label: "WAVE", width: 200, minWidth: 120, align: "left" },
  { id: "title", label: "TITLE", width: 280, minWidth: 120, align: "left" },
  { id: "artist", label: "ARTIST", width: 200, minWidth: 100, align: "left" },
  { id: "album", label: "ALBUM", width: 180, minWidth: 100, align: "left" },
  { id: "genre", label: "GENRE", width: 120, minWidth: 80, align: "left" },
  { id: "bpm", label: "BPM", width: 70, minWidth: 50, align: "center" },
  { id: "key", label: "KEY", width: 60, minWidth: 50, align: "center" },
  { id: "time", label: "TIME", width: 70, minWidth: 50, align: "center" },
  { id: "dateAdded", label: "DATE ADDED", width: 120, minWidth: 100, align: "center" },
  { id: "status", label: "S", width: 80, minWidth: 60, align: "center" },
];

interface WaveformData {
  amplitudes: number[];
  bass: number[];
  mids: number[];
  highs: number[];
}

interface ReferenceTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  bpm: number;
  key: string;
  duration: string;
  status: "Analyzed" | "Learning" | "Excluded";
  waveformData: WaveformData;
  dateAdded: string;
  artwork?: string;
}

// Generate waveform data matching Track Library format
function generateWaveformData(): WaveformData {
  const samples = 70;
  const amplitudes: number[] = [];
  const bass: number[] = [];
  const mids: number[] = [];
  const highs: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    const position = i / samples;
    let amplitude = 0.3;
    
    if (position < 0.15) {
      amplitude = 0.2 + (position / 0.15) * 0.3;
    } else if (position < 0.3) {
      amplitude = 0.5 + ((position - 0.15) / 0.15) * 0.3;
    } else if (position < 0.6) {
      amplitude = 0.8 + Math.random() * 0.2;
    } else if (position < 0.75) {
      amplitude = 0.8 - ((position - 0.6) / 0.15) * 0.5;
    } else if (position < 0.85) {
      amplitude = 0.3 + ((position - 0.75) / 0.1) * 0.5;
    } else {
      amplitude = 0.8 - ((position - 0.85) / 0.15) * 0.6;
    }
    
    amplitude += (Math.random() - 0.5) * 0.15;
    amplitude = Math.max(0.05, Math.min(1, amplitude));
    
    let bassAmp = amplitude * (0.6 + Math.random() * 0.4);
    if (position > 0.3 && position < 0.6) bassAmp *= 1.2;
    
    let midsAmp = amplitude * (0.5 + Math.random() * 0.3);
    let highsAmp = amplitude * (0.3 + Math.random() * 0.4);
    if (Math.random() > 0.85) highsAmp *= 1.5;
    
    amplitudes.push(amplitude);
    bass.push(Math.max(0.05, Math.min(1, bassAmp)));
    mids.push(Math.max(0.05, Math.min(1, midsAmp)));
    highs.push(Math.max(0.05, Math.min(1, highsAmp)));
  }
  
  return { amplitudes, bass, mids, highs };
}

// Muted single-color waveform (no interaction)
function MutedWaveform({ data }: { data: WaveformData }) {
  const width = 120;
  const height = 16;
  const barWidth = width / data.amplitudes.length;
  const maxBarHeight = height;
  
  return (
    <svg 
      width={width} 
      height={height} 
      className="flex-shrink-0"
    >
      {data.amplitudes.map((amplitude, i) => {
        const x = i * barWidth;
        const barHeight = amplitude * maxBarHeight;
        const y = (height - barHeight) / 2;
        
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={Math.max(0.8, barWidth - 0.4)}
            height={barHeight}
            fill="#52525B"
            opacity={0.6}
          />
        );
      })}
    </svg>
  );
}

// Draggable Column Header Component
function DraggableColumnHeader({
  column,
  index,
  moveColumn,
  onResizeStart,
}: {
  column: Column;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onResizeStart: (columnId: ColumnId, e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const alignClass = 
    column.align === "center" ? "justify-center" :
    column.align === "right" ? "justify-end" : "";

  return (
    <div
      ref={ref}
      className={`relative flex items-center px-3 flex-shrink-0 cursor-grab active:cursor-grabbing select-none transition-all ${alignClass} ${
        isDragging ? "opacity-30 bg-primary/5" : ""
      } ${isOver ? "bg-primary/10" : ""}`}
      style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}
    >
      <div className="flex items-center gap-1.5 w-full">
        <GripVertical className="w-3 h-3 text-white/20 cursor-move flex-shrink-0" />
        {column.label && (
          <span className="text-[10px] font-['IBM_Plex_Mono'] text-white/40 uppercase tracking-wider font-medium">
            {column.label}
          </span>
        )}
      </div>
      {/* Resize Handle */}
      {column.id !== "checkbox" && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-20"
          onMouseDown={(e) => onResizeStart(column.id, e)}
        />
      )}
    </div>
  );
}

// Mock reference tracks (32 tracks)
const MOCK_REFERENCE_TRACKS: ReferenceTrack[] = Array.from({ length: 32 }, (_, i) => {
  const artists = ["DJ Shadow", "Underground Mix", "Berlin Basement", "Soulful Sessions", "Low Frequency", "Night Shift", "303 Sessions", "Echo Chamber"];
  const titles = ["Midnight Grooves", "Hypnotic Groove", "Warehouse Nights", "Deep House Vibes", "Rolling Bassline", "Peak Time Energy", "Acid Reflections", "Late Night Dub"];
  const albums = ["Endtroducing", "Deep Sessions Vol.1", "Concrete Dreams", "Soulful Deep", "Bass Culture", "After Hours", "Acid Archives", "Dub Collective"];
  const genres = ["House", "Techno", "Deep House", "Tech House", "Minimal", "Progressive", "Acid Techno", "Dub Techno"];
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
    genre: genres[i % genres.length],
    bpm: bpms[i % bpms.length],
    key: keys[i % keys.length],
    duration: randomDuration(),
    status: statuses[i % statuses.length],
    waveformData: generateWaveformData(),
    dateAdded: randomDate(),
  };
});

interface ReferenceTracksTableProps {
  onAddTracks: () => void;
}

export function ReferenceTracksTable({ onAddTracks }: ReferenceTracksTableProps) {
  const [tracks] = useState<ReferenceTrack[]>(MOCK_REFERENCE_TRACKS);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState<Column[]>(() => {
    // Load column order and widths from localStorage
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
  
  // Playback state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  // ========================================
  // KEYBOARD SHORTCUTS
  // ========================================
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement) return;
      
      // Space: Play/Pause selected track (only if one track selected)
      if (e.code === "Space" && selectedTracks.size === 1) {
        e.preventDefault();
        const trackId = Array.from(selectedTracks)[0];
        const track = tracks.find(t => t.id === trackId);
        if (track) {
          if (playingTrackId === trackId) {
            setPlayingTrackId(null);
            toast.info("Paused");
          } else {
            setPlayingTrackId(trackId);
            toast.success(`Playing "${track.title}"`);
          }
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTracks, tracks, playingTrackId]);

  const handlePlayToggle = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      if (playingTrackId === trackId) {
        setPlayingTrackId(null);
        toast.info("Paused");
      } else {
        setPlayingTrackId(trackId);
        toast.success(`Playing "${track.title}"`);
      }
    }
  };

  const handleRemoveSelected = () => {
    console.log("Remove selected:", Array.from(selectedTracks));
    // TODO: Implement track removal
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragColumn = columns[dragIndex];
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, dragColumn);
      return newColumns;
    });
  }, [columns]);

  // Column resizing
  const handleResizeStart = (columnId: ColumnId, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const column = columns.find(c => c.id === columnId);
    if (column) {
      setResizingColumn(columnId);
      setResizeStartX(e.clientX);
      setResizeStartWidth(column.width);
    }
  };

  // Save column order and widths to localStorage
  useEffect(() => {
    localStorage.setItem('dnaLibraryColumns', JSON.stringify(columns));
  }, [columns]);

  // Handle column resizing
  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX;
      const newWidth = Math.max(
        columns.find(c => c.id === resizingColumn)?.minWidth || 50,
        resizeStartWidth + diff
      );
      
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === resizingColumn ? { ...col, width: newWidth } : col
        )
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
  }, [resizingColumn, resizeStartX, resizeStartWidth, columns]);

  // Render cell content based on column
  const renderCellContent = (column: Column, track: ReferenceTrack, isSelected: boolean, isHovered: boolean) => {
    const alignClass = 
      column.align === "center" ? "justify-center" :
      column.align === "right" ? "justify-end" : "";
    
    const isPlaying = playingTrackId === track.id;

    switch (column.id) {
      case "checkbox":
        return (
          <div key={column.id} className="px-3 flex items-center justify-center flex-shrink-0 gap-2" style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            {/* Play/Pause Button - Shown on hover or when playing */}
            {(isHovered || isPlaying) && (
              <button
                onClick={(e) => handlePlayToggle(track.id, e)}
                className={`transition-colors ${isPlaying ? "text-primary" : "text-white/60 hover:text-white"}`}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white/20" />
                )}
              </button>
            )}
            {/* Checkbox - Hidden when play button shows */}
            {!isHovered && !isPlaying && (
              <input
                type="checkbox"
                className="w-3 h-3 bg-transparent border border-border rounded-sm cursor-pointer accent-primary"
                checked={isSelected}
                onChange={() => toggleTrackSelection(track.id)}
              />
            )}
          </div>
        );

      case "waveform":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            {/* Cover Art */}
            <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
              {track.artwork ? (
                <img 
                  src={track.artwork} 
                  alt={`${track.artist} - ${track.title}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Music2 className="w-4 h-4 text-white/30" />
              )}
            </div>
            <MutedWaveform data={track.waveformData} />
          </div>
        );

      case "title":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 min-w-0 truncate ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span className={`text-xs truncate font-['IBM_Plex_Mono'] ${isPlaying ? "text-primary font-medium" : "text-white/90"}`}>
              {track.title}
            </span>
          </div>
        );

      case "artist":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 min-w-0 truncate ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span className="text-xs text-white/70 truncate font-['IBM_Plex_Mono']">
              {track.artist}
            </span>
          </div>
        );

      case "album":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 min-w-0 truncate ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span className="text-xs text-white/70 truncate font-['IBM_Plex_Mono']">
              {track.album}
            </span>
          </div>
        );

      case "genre":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 min-w-0 truncate ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span className="text-xs text-white/70 truncate font-['IBM_Plex_Mono']">
              {track.genre}
            </span>
          </div>
        );

      case "bpm":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span className="text-xs text-white/90 font-['IBM_Plex_Mono']">
              {track.bpm}
            </span>
          </div>
        );

      case "key":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span className="text-xs text-white/90 font-['IBM_Plex_Mono']">
              {track.key}
            </span>
          </div>
        );

      case "time":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span className="text-xs text-white/70 font-['IBM_Plex_Mono']">
              {track.duration}
            </span>
          </div>
        );

      case "dateAdded":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">
              {track.dateAdded}
            </span>
          </div>
        );

      case "status":
        return (
          <div key={column.id} className={`px-3 flex items-center flex-shrink-0 ${alignClass}`} style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}>
            <span
              className={`text-[10px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-sm ${
                track.status === "Analyzed"
                  ? "bg-primary/20 text-primary"
                  : track.status === "Learning"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {track.status}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col bg-black">
        {/* Top Bar */}
        <div className="border-b border-border px-6 py-3.5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-['IBM_Plex_Mono'] text-white">
              Reference Tracks ({tracks.length})
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setColumns(DEFAULT_COLUMNS)}
                className="px-3 py-2 text-xs font-['IBM_Plex_Mono'] border border-border hover:bg-muted text-muted-foreground hover:text-white transition-colors"
              >
                Reset Columns
              </button>
              <Button
                variant="outline"
                size="sm"
                className="font-['IBM_Plex_Mono'] text-xs h-8"
                onClick={onAddTracks}
              >
                Add Tracks
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-['IBM_Plex_Mono'] text-xs h-8"
                onClick={handleRemoveSelected}
                disabled={selectedTracks.size === 0}
              >
                Remove Selected
              </Button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            {/* Table Header - Sticky */}
            <div className="sticky top-0 bg-black border-b border-border z-10 flex items-center" style={{ height: "36px" }}>
              {columns.map((column, index) => (
                <DraggableColumnHeader
                  key={column.id}
                  column={column}
                  index={index}
                  moveColumn={moveColumn}
                  onResizeStart={handleResizeStart}
                />
              ))}
            </div>

            {/* Table Body - Tracks */}
            <div>
              {tracks.map((track) => {
                const isHovered = hoveredRow === track.id;
                const isSelected = selectedTracks.has(track.id);

                return (
                  <div
                    key={track.id}
                    className={`flex items-center border-b border-border transition-colors ${
                      isSelected ? "bg-primary/[0.05]" : ""
                    } hover:bg-muted/20`}
                    style={{ height: "44px" }}
                    onMouseEnter={() => setHoveredRow(track.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {columns.map((column) => renderCellContent(column, track, isSelected, isHovered))}
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {tracks.length === 0 && (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <p className="text-sm">No reference tracks found</p>
                  <p className="text-xs mt-1">Upload tracks to build your DNA</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}