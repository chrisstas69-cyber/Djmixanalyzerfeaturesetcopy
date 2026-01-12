"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Upload, Play, Pause, Search, GripVertical, ChevronDown, ChevronUp, Trash2, Star, MoreVertical, FolderOpen, FileAudio } from "lucide-react";
import { toast } from "sonner";

// Camelot Key Color Mapping (Mixed In Key style)
const CAMELOT_COLORS: Record<string, string> = {
  "1A": "#00bcd4", // cyan
  "2A": "#4caf50", // green
  "3A": "#ffeb3b", // yellow
  "4A": "#ff9800", // orange
  "5A": "#f44336", // red
  "6A": "#e91e63", // pink
  "7A": "#9c27b0", // purple
  "8A": "#673ab7", // deep purple
  "9A": "#3f51b5", // indigo
  "10A": "#2196f3", // blue
  "11A": "#00bcd4", // cyan
  "12A": "#4caf50", // green
  "1B": "#4caf50", // green
  "2B": "#ffeb3b", // yellow
  "3B": "#ff9800", // orange
  "4B": "#f44336", // red
  "5B": "#e91e63", // pink
  "6B": "#9c27b0", // purple
  "7B": "#673ab7", // deep purple
  "8B": "#3f51b5", // indigo
  "9B": "#2196f3", // blue
  "10B": "#00bcd4", // cyan
  "11B": "#4caf50", // green
  "12B": "#ffeb3b", // yellow
};

// Convert musical key to Camelot notation (simplified mapping)
const musicalKeyToCamelot: Record<string, string> = {
  "Am": "8A", "A#m": "3A", "Bbm": "3A", "Bm": "10A",
  "Cm": "5A", "C#m": "12A", "Dbm": "12A", "Dm": "7A",
  "D#m": "2A", "Ebm": "2A", "Em": "9A", "Fm": "4A",
  "F#m": "11A", "Gbm": "11A", "Gm": "6A", "G#m": "1A",
  "C": "8B", "C#": "3B", "Db": "3B", "D": "10B",
  "D#": "5B", "Eb": "5B", "E": "12B", "F": "7B",
  "F#": "2B", "Gb": "2B", "G": "9B", "G#": "4B", "Ab": "4B",
  "A": "11B", "A#": "6B", "Bb": "6B", "B": "1B",
};

const getCamelotKey = (musicalKey: string): string => {
  return musicalKeyToCamelot[musicalKey] || "1A";
};

const getCamelotColor = (camelotKey: string): string => {
  return CAMELOT_COLORS[camelotKey] || "#00bcd4";
};

// Column definitions
type ColumnId = "key" | "artwork" | "artist" | "title" | "standard" | "tempo" | "energy" | "rating" | "cuePoints" | "comment" | "delete";

interface Column {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  align: "left" | "center" | "right";
  visible: boolean;
}

const DEFAULT_COLUMNS: Column[] = [
  { id: "key", label: "Key", width: 70, minWidth: 60, align: "center", visible: true },
  { id: "artwork", label: "Cover Art", width: 60, minWidth: 50, align: "center", visible: true },
  { id: "artist", label: "Artist", width: 180, minWidth: 120, align: "left", visible: true },
  { id: "title", label: "Title", width: 250, minWidth: 150, align: "left", visible: true },
  { id: "standard", label: "Standard", width: 80, minWidth: 70, align: "center", visible: true },
  { id: "tempo", label: "Tempo", width: 80, minWidth: 70, align: "center", visible: true },
  { id: "energy", label: "Energy", width: 120, minWidth: 100, align: "left", visible: true },
  { id: "rating", label: "Rating", width: 100, minWidth: 80, align: "center", visible: true },
  { id: "cuePoints", label: "Cue Points", width: 100, minWidth: 80, align: "center", visible: true },
  { id: "comment", label: "Comment", width: 200, minWidth: 150, align: "left", visible: true },
  { id: "delete", label: "", width: 50, minWidth: 50, align: "center", visible: true },
];

interface Track {
  id: string;
  artwork?: string;
  artist: string;
  title: string;
  standardKey: string; // Musical notation (Dm, F#m, etc.)
  camelotKey: string; // Camelot notation (7A, 11A, etc.)
  tempo: number; // BPM
  energy: number; // 1-10
  rating: number; // 1-8 stars
  cuePoints: number;
  comment: string;
  duration?: string;
  dateAdded?: string;
}

interface UploadFile {
  file: File;
  progress: number;
  status: "queued" | "uploading" | "completed" | "error";
  id: string;
}

const ITEM_TYPE = "column";

// Sample tracks with Camelot keys
const sampleTracks: Track[] = [
  {
    id: "1",
    artist: "Barn Gold, Tempo Giusto",
    title: "I Am The God (Extended Mix)",
    standardKey: "A#m",
    camelotKey: "3A",
    tempo: 134,
    energy: 8,
    rating: 7,
    cuePoints: 4,
    comment: "",
    duration: "6:34",
  },
  {
    id: "2",
    artist: "Armin van Buuren, Hilight Tribe",
    title: "Great Spirit feat. Hilight Tribe (Extended Mix)",
    standardKey: "C#",
    camelotKey: "3B",
    tempo: 138,
    energy: 9,
    rating: 8,
    cuePoints: 5,
    comment: "",
    duration: "7:37",
  },
  {
    id: "3",
    artist: "Anske Knights",
    title: "Se7en Seconds Until Thunder (Extended Mix)",
    standardKey: "C#m",
    camelotKey: "12A",
    tempo: 134,
    energy: 8,
    rating: 6,
    cuePoints: 3,
    comment: "",
    duration: "7:16",
  },
];

function DraggableColumnHeader({
  column,
  index,
  moveColumn,
  onResizeStart,
  isSorted,
  sortDirection,
  onSort,
  onContextMenu,
}: {
  column: Column;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onResizeStart: (columnId: ColumnId, e: React.MouseEvent) => void;
  isSorted?: boolean;
  sortDirection?: "asc" | "desc";
  onSort?: () => void;
  onContextMenu: (e: React.MouseEvent, columnId: ColumnId) => void;
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

  const isSortable = column.id === "title" || column.id === "artist" || column.id === "tempo" || column.id === "energy" || column.id === "rating";

  return (
    <th
      ref={ref}
      className={`relative px-3 text-xs font-semibold uppercase tracking-wider text-white/60 border-r border-white/5 select-none ${
        isDragging ? "opacity-50" : ""
      } ${isSortable ? "cursor-pointer hover:bg-white/5 transition-colors" : ""}`}
      style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}
      onClick={onSort}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, column.id);
      }}
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
      {column.id !== "delete" && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-20"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onResizeStart(column.id, e);
          }}
        />
      )}
    </th>
  );
}

export default function DNATracksLibrary() {
  const [activeTab, setActiveTab] = useState<"ALL" | "DNA TRACKS" | "GENERATED" | "UPLOADED">("DNA TRACKS");
  const [tracks, setTracks] = useState<Track[]>(sampleTracks);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<"title" | "artist" | "tempo" | "energy" | "rating" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columns, setColumns] = useState<Column[]>(() => {
    const saved = localStorage.getItem('dnaTracksColumns');
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
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; columnId: ColumnId } | null>(null);
  const [contextMenuRow, setContextMenuRow] = useState<{ x: number; y: number; trackId: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Save column order and widths to localStorage
  useEffect(() => {
    localStorage.setItem('dnaTracksColumns', JSON.stringify(columns));
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

  const handleSort = (column: "title" | "artist" | "tempo" | "energy" | "rating") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFolder = () => {
    folderInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const acceptedTypes = ['.mp3', '.wav', '.flac', '.m4a', '.aiff'];
    const validFiles = Array.from(files).filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedTypes.includes(ext);
    });

    if (validFiles.length === 0) {
      toast.error("Please select valid audio files (MP3, WAV, FLAC, M4A, AIFF)");
      return;
    }

    const newUploadFiles: UploadFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: "queued" as const,
      id: Math.random().toString(36).substr(2, 9),
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);

    // Simulate upload progress
    newUploadFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (uploadId: string) => {
    setUploadFiles(prev => prev.map(uf => uf.id === uploadId ? { ...uf, status: "uploading" } : uf));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadFiles(prev => {
          const updated = prev.map(uf => {
            if (uf.id === uploadId) {
              return { ...uf, progress: 100, status: "completed" as const };
            }
            return uf;
          });
          // After completion, add track to library (simulate)
          setTimeout(() => {
            const uploadFile = updated.find(uf => uf.id === uploadId);
            if (uploadFile) {
              const newTrack: Track = {
                id: Math.random().toString(36).substr(2, 9),
                artist: uploadFile.file.name.split('.')[0],
                title: uploadFile.file.name,
                standardKey: "Am",
                camelotKey: "8A",
                tempo: 128,
                energy: 5,
                rating: 5,
                cuePoints: 0,
                comment: "",
                dateAdded: new Date().toISOString().split('T')[0],
              };
              setTracks(prev => [...prev, newTrack]);
              toast.success(`Uploaded "${uploadFile.file.name}"`);
            }
            setUploadFiles(prev => prev.filter(uf => uf.id !== uploadId));
          }, 500);
          return updated;
        });
      } else {
        setUploadFiles(prev => prev.map(uf => uf.id === uploadId ? { ...uf, progress } : uf));
      }
    }, 200);
  };

  const handleToggleColumnVisibility = (columnId: ColumnId) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
    setContextMenu(null);
  };

  const handleColumnContextMenu = (e: React.MouseEvent, columnId: ColumnId) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, columnId });
  };

  const handleRowContextMenu = (e: React.MouseEvent, trackId: string) => {
    e.preventDefault();
    setContextMenuRow({ x: e.clientX, y: e.clientY, trackId });
  };

  const handleDeleteTrack = (trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
    setSelectedTracks(prev => {
      const next = new Set(prev);
      next.delete(trackId);
      return next;
    });
    toast.success("Track deleted");
    setContextMenuRow(null);
  };

  const handleAnalyzeTrack = (trackId: string) => {
    toast.info("Analyzing track...");
    setContextMenuRow(null);
  };

  const handleExportTrack = (trackId: string) => {
    toast.info("Exporting track...");
    setContextMenuRow(null);
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter(track => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.standardKey.toLowerCase().includes(query) ||
        track.camelotKey.toLowerCase().includes(query)
      );
    });
  }, [tracks, searchQuery]);

  const sortedTracks = useMemo(() => {
    if (!sortColumn) return filteredTracks;

    return [...filteredTracks].sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "artist":
          comparison = a.artist.localeCompare(b.artist);
          break;
        case "tempo":
          comparison = a.tempo - b.tempo;
          break;
        case "energy":
          comparison = a.energy - b.energy;
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredTracks, sortColumn, sortDirection]);

  const visibleColumns = columns.filter(col => col.visible);

  const renderEnergyDots = (energy: number) => {
    return (
      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: i < energy ? "#00bcd4" : "rgba(0, 188, 212, 0.2)",
            }}
          />
        ))}
      </div>
    );
  };

  const renderRating = (rating: number) => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            style={{
              fill: i < rating ? "#ffeb3b" : "none",
              color: i < rating ? "#ffeb3b" : "#666",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          color: "#fff",
          overflow: "hidden",
        }}
        onClick={() => {
          setContextMenu(null);
          setContextMenuRow(null);
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            padding: "20px 32px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "#0a0a0a",
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {(["ALL", "DNA TRACKS", "GENERATED", "UPLOADED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 16px",
                  background: activeTab === tab ? "#00bcd4" : "transparent",
                  color: activeTab === tab ? "#000" : "#a0a0a0",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Top Actions Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            {/* Search Bar */}
            <div
              style={{
                position: "relative",
                flex: 1,
                maxWidth: "400px",
              }}
            >
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "13px",
                }}
              />
            </div>

            {/* Upload Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleSelectFiles}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
              >
                <FileAudio size={16} />
                Select Files
              </button>
              <button
                onClick={handleUploadFolder}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
              >
                <FolderOpen size={16} />
                Upload Folder
              </button>
              <button
                onClick={handleSelectFiles}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  background: "#00bcd4",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Upload size={16} />
                Upload DNA Tracks
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.flac,.m4a,.aiff,audio/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <input
              ref={folderInputRef}
              type="file"
              webkitdirectory=""
              accept=".mp3,.wav,.flac,.m4a,.aiff,audio/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Upload Progress */}
          {uploadFiles.length > 0 && (
            <div style={{ marginTop: "16px", padding: "12px", background: "#111", borderRadius: "6px" }}>
              <div style={{ marginBottom: "8px", fontSize: "12px", color: "#a0a0a0" }}>
                Uploading {uploadFiles.length} file{uploadFiles.length > 1 ? "s" : ""}...
              </div>
              {uploadFiles.map(uploadFile => (
                <div key={uploadFile.id} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "11px", color: "#888" }}>
                    <span>{uploadFile.file.name}</span>
                    <span>{Math.round(uploadFile.progress)}%</span>
                  </div>
                  <div style={{ height: "4px", background: "#222", borderRadius: "2px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${uploadFile.progress}%`,
                        background: "#00bcd4",
                        transition: "width 0.2s",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div
          style={{
            padding: "12px 32px",
            background: "rgba(0, 188, 212, 0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: "13px",
            color: "#00bcd4",
          }}
        >
          Your DNA Library: Upload your own tracks to build your unique musical
          profile. Our AI analyzes your music DNA (genre, style, energy, mood) to
          generate tracks that match your taste.
        </div>

        {/* Table Container */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 32px 20px",
            position: "relative",
          }}
        >
          {/* Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 4px",
              fontSize: "13px",
            }}
          >
            {/* Table Header */}
            <thead>
              <tr
                style={{
                  background: "#0a0a0a",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                {visibleColumns.map((column, index) => (
                  <DraggableColumnHeader
                    key={column.id}
                    column={column}
                    index={index}
                    moveColumn={moveColumn}
                    onResizeStart={handleResizeStart}
                    isSorted={sortColumn === column.id}
                    sortDirection={sortColumn === column.id ? sortDirection : undefined}
                    onSort={column.id === "title" || column.id === "artist" || column.id === "tempo" || column.id === "energy" || column.id === "rating" ? () => handleSort(column.id as any) : undefined}
                    onContextMenu={handleColumnContextMenu}
                  />
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {sortedTracks.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                    No tracks found
                  </td>
                </tr>
              ) : (
                sortedTracks.map((track, index) => {
                  const isSelected = selectedTracks.has(track.id);
                  const isPlaying = playingTrackId === track.id;
                  const isHovered = hoveredRow === track.id;

                  return (
                    <tr
                      key={track.id}
                      style={{
                        background: isSelected ? "rgba(0,188,212,0.15)" : index % 2 === 0 ? "#0a0a0a" : "#0d0d0d",
                        transition: "background 0.15s",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={() => setHoveredRow(track.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => {
                        if (selectedTracks.has(track.id)) {
                          setSelectedTracks(prev => {
                            const next = new Set(prev);
                            next.delete(track.id);
                            return next;
                          });
                        } else {
                          setSelectedTracks(prev => new Set(prev).add(track.id));
                        }
                      }}
                      onDoubleClick={() => {
                        setPlayingTrackId(isPlaying ? null : track.id);
                        if (!isPlaying) {
                          toast.success(`Playing "${track.title}"`);
                        }
                      }}
                      onContextMenu={(e) => handleRowContextMenu(e, track.id)}
                    >
                      {visibleColumns.map(column => {
                        if (column.id === "key") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", textAlign: "center" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  background: getCamelotColor(track.camelotKey),
                                  color: ["3A", "4A", "5A", "6A", "7A", "8A", "9A", "10A", "11A", "12A", "1A", "2A"].includes(track.camelotKey) ? "#000" : "#fff",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  fontFamily: "monospace",
                                }}
                              >
                                {track.camelotKey}
                              </span>
                            </td>
                          );
                        }
                        if (column.id === "artwork") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", textAlign: "center" }}>
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background: "#111",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  position: "relative",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  margin: "0 auto",
                                }}
                              >
                                {track.artwork ? (
                                  <img src={track.artwork} alt={track.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                                ) : (
                                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #00bcd4 0%, #00838f 100%)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: "12px", fontWeight: 600 }}>
                                    {track.title.charAt(0)}
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayingTrackId(isPlaying ? null : track.id);
                                    if (!isPlaying) toast.success(`Playing "${track.title}"`);
                                  }}
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(0,0,0,0.6)",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    opacity: isPlaying || isHovered ? 1 : 0,
                                    transition: "opacity 0.15s",
                                  }}
                                >
                                  {isPlaying ? <Pause size={16} style={{ color: "#fff" }} /> : <Play size={16} style={{ color: "#fff" }} />}
                                </button>
                              </div>
                            </td>
                          );
                        }
                        if (column.id === "artist") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", color: "#a0a0a0" }}>
                              {track.artist}
                            </td>
                          );
                        }
                        if (column.id === "title") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", color: "#fff", fontWeight: 500 }}>
                              {track.title}
                            </td>
                          );
                        }
                        if (column.id === "standard") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", textAlign: "center", color: "#a0a0a0", fontFamily: "monospace", fontSize: "12px" }}>
                              {track.standardKey}
                            </td>
                          );
                        }
                        if (column.id === "tempo") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", textAlign: "center", color: "#00bcd4", fontFamily: "monospace", fontWeight: 500 }}>
                              {track.tempo}
                            </td>
                          );
                        }
                        if (column.id === "energy") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px" }}>
                              {renderEnergyDots(track.energy)}
                            </td>
                          );
                        }
                        if (column.id === "rating") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", textAlign: "center" }}>
                              {renderRating(track.rating)}
                            </td>
                          );
                        }
                        if (column.id === "cuePoints") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", textAlign: "center", color: "#a0a0a0", fontFamily: "monospace" }}>
                              {track.cuePoints}
                            </td>
                          );
                        }
                        if (column.id === "comment") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", color: "#888", fontSize: "12px" }}>
                              {track.comment || "-"}
                            </td>
                          );
                        }
                        if (column.id === "delete") {
                          return (
                            <td key={column.id} style={{ padding: "12px 8px", textAlign: "center" }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTrack(track.id);
                                }}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#666",
                                  cursor: "pointer",
                                  padding: "4px",
                                  borderRadius: "4px",
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(244,67,54,0.2)";
                                  e.currentTarget.style.color = "#f44336";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "#666";
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
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

        {/* Column Context Menu */}
        {contextMenu && (
          <div
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              padding: "4px",
              zIndex: 1000,
              minWidth: "150px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleToggleColumnVisibility(contextMenu.columnId)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: "#fff",
                textAlign: "left",
                fontSize: "13px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {columns.find(c => c.id === contextMenu.columnId)?.visible ? "Hide Column" : "Show Column"}
            </button>
          </div>
        )}

        {/* Row Context Menu */}
        {contextMenuRow && (
          <div
            style={{
              position: "fixed",
              left: contextMenuRow.x,
              top: contextMenuRow.y,
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              padding: "4px",
              zIndex: 1000,
              minWidth: "150px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleAnalyzeTrack(contextMenuRow.trackId)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: "#fff",
                textAlign: "left",
                fontSize: "13px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Analyze
            </button>
            <button
              onClick={() => handleExportTrack(contextMenuRow.trackId)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: "#fff",
                textAlign: "left",
                fontSize: "13px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Export
            </button>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <button
              onClick={() => handleDeleteTrack(contextMenuRow.trackId)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: "#f44336",
                textAlign: "left",
                fontSize: "13px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(244,67,54,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}