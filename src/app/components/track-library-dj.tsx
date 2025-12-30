import { useState, useRef, useEffect } from "react";
import { Play, Search, Share2, Download, ChevronDown, Music2, Trash2, Copy, FileDown, PlayCircle, Plus, Edit3, Files, X } from "lucide-react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ShareModal } from "./share-modal";
import { ExportModal } from "./export-modal";

// Column definition - SIMPLIFIED to requirements
type ColumnId = "play" | "artwork" | "title" | "artist" | "bpm" | "key" | "time" | "energy" | "version" | "actions";

interface Column {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  align: "left" | "center" | "right";
  visible: boolean;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  energy: string;
  version: "A" | "B" | "C";
  status: "NOW PLAYING" | "UP NEXT" | "READY" | "PLAYED" | null;
  artwork?: string;
  dateAdded: string;
}

// FIXED ROW HEIGHT
const ROW_HEIGHT = 40;

// Default columns (as specified)
const DEFAULT_COLUMNS: Column[] = [
  { id: "play", label: "", width: 40, minWidth: 40, align: "center", visible: true },
  { id: "artwork", label: "ART", width: 48, minWidth: 48, align: "center", visible: true },
  { id: "title", label: "TITLE", width: 280, minWidth: 120, align: "left", visible: true },
  { id: "artist", label: "ARTIST", width: 200, minWidth: 120, align: "left", visible: true },
  { id: "bpm", label: "BPM", width: 70, minWidth: 60, align: "center", visible: true },
  { id: "key", label: "KEY", width: 60, minWidth: 50, align: "center", visible: true },
  { id: "time", label: "TIME", width: 70, minWidth: 60, align: "center", visible: true },
  { id: "energy", label: "ENERGY", width: 90, minWidth: 70, align: "left", visible: true },
  { id: "version", label: "VER", width: 50, minWidth: 50, align: "center", visible: true },
  { id: "actions", label: "ACTIONS", width: 90, minWidth: 80, align: "center", visible: true },
];

// Mock tracks
const MOCK_TRACKS: Track[] = [
  { id: "1", title: "Untitled Track", artist: "Unknown Artist", bpm: 126, key: "Am", duration: "6:42", energy: "Rising", version: "A", status: null, dateAdded: "2023-12-01" },
  { id: "2", title: "Hypnotic Groove", artist: "Underground Mix", bpm: 126, key: "Am", duration: "7:20", energy: "Peak", version: "B", status: "NOW PLAYING", dateAdded: "2023-12-02" },
  { id: "3", title: "Warehouse Nights", artist: "Berlin Basement", bpm: 128, key: "Fm", duration: "6:30", energy: "Building", version: "C", status: "UP NEXT", dateAdded: "2023-12-03" },
  { id: "4", title: "Deep House Vibes", artist: "Soulful Sessions", bpm: 124, key: "Dm", duration: "5:58", energy: "Groove", version: "A", status: "READY", dateAdded: "2023-12-04" },
  { id: "5", title: "Rolling Bassline", artist: "Low Frequency", bpm: 127, key: "Gm", duration: "6:30", energy: "Steady", version: "B", status: null, dateAdded: "2023-12-05" },
  { id: "6", title: "Peak Time Energy", artist: "Night Shift", bpm: 130, key: "Em", duration: "7:02", energy: "Peak", version: "A", status: null, dateAdded: "2023-12-06" },
  { id: "7", title: "Acid Reflections", artist: "303 Sessions", bpm: 132, key: "Cm", duration: "8:15", energy: "Wild", version: "C", status: null, dateAdded: "2023-12-07" },
  { id: "8", title: "Late Night Dub", artist: "Echo Chamber", bpm: 122, key: "Am", duration: "7:45", energy: "Chill", version: "A", status: "PLAYED", dateAdded: "2023-12-08" },
  { id: "9", title: "Minimal Movement", artist: "Berlin Basement", bpm: 128, key: "Em", duration: "6:18", energy: "Minimal", version: "B", status: null, dateAdded: "2023-12-09" },
  { id: "10", title: "Broken Beat", artist: "Fractured Rhythms", bpm: 140, key: "Fm", duration: "5:30", energy: "Driving", version: "C", status: null, dateAdded: "2023-12-10" },
  { id: "11", title: "Subterranean Flow", artist: "Deep State", bpm: 125, key: "Cm", duration: "6:55", energy: "Deep", version: "A", status: null, dateAdded: "2023-12-11" },
  { id: "12", title: "Dark Matter", artist: "Void Sessions", bpm: 129, key: "Gm", duration: "7:10", energy: "Dark", version: "B", status: null, dateAdded: "2023-12-12" },
  { id: "13", title: "Ethereal Groove", artist: "Cosmic Sounds", bpm: 124, key: "Dm", duration: "6:25", energy: "Ethereal", version: "A", status: null, dateAdded: "2023-12-13" },
  { id: "14", title: "Circuit Breaker", artist: "Voltage Control", bpm: 135, key: "Am", duration: "5:45", energy: "Hard", version: "C", status: null, dateAdded: "2023-12-14" },
  { id: "15", title: "Analog Dreams", artist: "Modular Mind", bpm: 128, key: "Fm", duration: "7:30", energy: "Melodic", version: "B", status: null, dateAdded: "2023-12-15" },
];

export function TrackLibraryDJ() {
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [editingCell, setEditingCell] = useState<{ trackId: string; field: "title" | "artist" } | null>(null);
  const [editValue, setEditValue] = useState("");
  
  // Selection state
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  
  // Delete confirmation modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tracksToDelete, setTracksToDelete] = useState<string[]>([]);
  
  // Share and Export modals
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [modalTrack, setModalTrack] = useState<Track | null>(null);
  
  // Drag state
  const [draggedTracks, setDraggedTracks] = useState<Track[]>([]);
  
  // Playing track state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>("2"); // Default: track 2 is now playing

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter tracks by search
  const filteredTracks = tracks.filter((track) => {
    const query = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.bpm.toString().includes(query) ||
      track.key.toLowerCase().includes(query) ||
      track.energy.toLowerCase().includes(query)
    );
  });

  // ========================================
  // SELECTION LOGIC
  // ========================================
  
  const handleRowClick = (trackId: string, index: number, event: React.MouseEvent) => {
    // Don't select if editing
    if (editingCell) return;
    
    if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift+click: select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeIds = filteredTracks.slice(start, end + 1).map(t => t.id);
      setSelectedTracks(rangeIds);
    } else if (event.metaKey || event.ctrlKey) {
      // Cmd/Ctrl+click: toggle selection
      setSelectedTracks(prev => 
        prev.includes(trackId) 
          ? prev.filter(id => id !== trackId)
          : [...prev, trackId]
      );
      setLastSelectedIndex(index);
    } else {
      // Single click: select one
      setSelectedTracks([trackId]);
      setLastSelectedIndex(index);
    }
  };

  const handleDoubleClick = (trackId: string) => {
    // Double-click: Load into Auto DJ queue (not instant play)
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      toast.success(`Added "${track.title}" to Auto DJ queue`);
      // Here you would integrate with Auto DJ system
    }
  };

  // ========================================
  // KEYBOARD SHORTCUTS
  // ========================================
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement) return;
      
      const isMod = e.metaKey || e.ctrlKey;
      
      // Space: Play/Pause selected track
      if (e.code === "Space" && selectedTracks.length === 1) {
        e.preventDefault();
        const trackId = selectedTracks[0];
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
      
      // Enter: Load into Auto DJ Mix Crate
      if (e.key === "Enter" && selectedTracks.length > 0) {
        e.preventDefault();
        const selectedTrackObjects = tracks.filter(t => selectedTracks.includes(t.id));
        toast.success(`Added ${selectedTracks.length} track(s) to Auto DJ Mix`);
      }
      
      // Delete/Backspace: Remove from library
      if ((e.key === "Delete" || e.key === "Backspace") && selectedTracks.length > 0) {
        e.preventDefault();
        setTracksToDelete(selectedTracks);
        setDeleteConfirmOpen(true);
      }
      
      // Cmd/Ctrl+E: Export
      if (isMod && e.key === "e" && selectedTracks.length > 0) {
        e.preventDefault();
        setExportModalOpen(true);
        setModalTrack(tracks.find(t => t.id === selectedTracks[0]) || null);
      }
      
      // Cmd/Ctrl+C: Copy share link
      if (isMod && e.key === "c" && selectedTracks.length > 0) {
        e.preventDefault();
        setShareModalOpen(true);
        setModalTrack(tracks.find(t => t.id === selectedTracks[0]) || null);
      }
      
      // Cmd/Ctrl+A: Select all
      if (isMod && e.key === "a") {
        e.preventDefault();
        setSelectedTracks(filteredTracks.map(t => t.id));
        toast.info(`Selected all ${filteredTracks.length} tracks`);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTracks, tracks, filteredTracks, playingTrackId, editingCell]);

  // ========================================
  // CONTEXT MENU ACTIONS
  // ========================================
  
  const handlePlay = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      setPlayingTrackId(trackId);
      toast.success(`Playing "${track.title}"`);
    }
  };
  
  const handleLoadIntoAutoDJ = (trackIds: string[]) => {
    toast.success(`Added ${trackIds.length} track(s) to Auto DJ Mix`);
  };
  
  const handleAnalyze = (trackIds: string[]) => {
    toast.info(`Analyzing ${trackIds.length} track(s)...`);
  };
  
  const handleExport = (trackIds: string[]) => {
    setExportModalOpen(true);
    setModalTrack(tracks.find(t => t.id === trackIds[0]) || null);
  };
  
  const handleShare = (trackId: string) => {
    setShareModalOpen(true);
    setModalTrack(tracks.find(t => t.id === trackId) || null);
  };
  
  const handleRename = (trackId: string, field: "title" | "artist") => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      startEditing(trackId, field, track[field]);
    }
  };
  
  const handleDuplicate = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      const newTrack = { ...track, id: `${track.id}-copy-${Date.now()}`, title: `${track.title} (Copy)` };
      setTracks(prev => [...prev, newTrack]);
      toast.success(`Duplicated "${track.title}"`);
    }
  };
  
  const handleDeleteClick = (trackIds: string[]) => {
    setTracksToDelete(trackIds);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    setTracks(prev => prev.filter(t => !tracksToDelete.includes(t.id)));
    setSelectedTracks(prev => prev.filter(id => !tracksToDelete.includes(id)));
    toast.success(`Deleted ${tracksToDelete.length} track(s)`);
    setTracksToDelete([]);
    setDeleteConfirmOpen(false);
  };

  // ========================================
  // DRAG & DROP
  // ========================================
  
  const handleDragStart = (e: React.DragEvent, trackId: string) => {
    // If dragging a selected track, drag all selected tracks
    const tracksToDrag = selectedTracks.includes(trackId)
      ? tracks.filter(t => selectedTracks.includes(t.id))
      : [tracks.find(t => t.id === trackId)!];
    
    setDraggedTracks(tracksToDrag);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", JSON.stringify(tracksToDrag.map(t => t.id)));
    
    // Create custom drag preview
    const dragPreview = document.createElement("div");
    dragPreview.style.cssText = `
      position: absolute;
      top: -1000px;
      background: #18181b;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 8px 12px;
      border-radius: 6px;
      color: white;
      font-size: 12px;
      font-family: 'IBM Plex Mono';
    `;
    dragPreview.textContent = tracksToDrag.length === 1 
      ? tracksToDrag[0].title 
      : `${tracksToDrag.length} tracks`;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };
  
  const handleDragEnd = () => {
    setDraggedTracks([]);
  };

  // Handle inline editing
  const startEditing = (trackId: string, field: "title" | "artist", currentValue: string) => {
    setEditingCell({ trackId, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingCell) {
      setTracks((prev) =>
        prev.map((t) =>
          t.id === editingCell.trackId
            ? { ...t, [editingCell.field]: editValue }
            : t
        )
      );
      setEditingCell(null);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  // Toggle column visibility
  const toggleColumn = (columnId: ColumnId) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Render cell content
  const renderCell = (column: Column, track: Track, isHovered: boolean) => {
    const isNowPlaying = track.status === "NOW PLAYING";
    const isEditing = editingCell?.trackId === track.id && editingCell?.field === column.id;

    switch (column.id) {
      case "play":
        return (
          <div className="flex items-center justify-center h-full">
            {isNowPlaying && (
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
            {!isNowPlaying && isHovered && (
              <button className="hover:text-primary transition-colors">
                <Play className="w-3.5 h-3.5 fill-white/20" />
              </button>
            )}
          </div>
        );

      case "artwork":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              {track.artwork ? (
                <img src={track.artwork} alt="" className="w-full h-full object-cover" />
              ) : (
                <Music2 className="w-3.5 h-3.5 text-white/30" />
              )}
            </div>
          </div>
        );

      case "title":
        if (isEditing) {
          return (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
              className="w-full h-full bg-white/5 border border-primary px-2 text-sm text-white outline-none"
            />
          );
        }
        return (
          <div
            className="h-full flex items-center px-3 truncate cursor-text group/edit"
            onDoubleClick={() => startEditing(track.id, "title", track.title)}
            title={track.title}
          >
            <span className={`truncate text-sm ${isNowPlaying ? "text-primary font-medium" : "text-white"}`}>
              {track.title}
            </span>
          </div>
        );

      case "artist":
        if (isEditing) {
          return (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
              className="w-full h-full bg-white/5 border border-primary px-2 text-sm text-white outline-none"
            />
          );
        }
        return (
          <div
            className="h-full flex items-center px-3 truncate cursor-text"
            onDoubleClick={() => startEditing(track.id, "artist", track.artist)}
            title={track.artist}
          >
            <span className="truncate text-sm text-white/80">{track.artist}</span>
          </div>
        );

      case "bpm":
        return (
          <div className="h-full flex items-center justify-center">
            <span className="text-sm text-white/70 font-['IBM_Plex_Mono'] tabular-nums">
              {track.bpm}
            </span>
          </div>
        );

      case "key":
        return (
          <div className="h-full flex items-center justify-center">
            <span className="text-sm text-white/70 font-['IBM_Plex_Mono']">{track.key}</span>
          </div>
        );

      case "time":
        return (
          <div className="h-full flex items-center justify-center">
            <span className="text-sm text-white/60 font-['IBM_Plex_Mono'] tabular-nums">
              {track.duration}
            </span>
          </div>
        );

      case "energy":
        return (
          <div className="h-full flex items-center px-3">
            <span className="text-xs text-white/60 truncate">{track.energy}</span>
          </div>
        );

      case "version":
        return (
          <div className="h-full flex items-center justify-center">
            <span className="text-xs text-white/50 font-['IBM_Plex_Mono']">{track.version}</span>
          </div>
        );

      case "actions":
        return (
          <div className="h-full flex items-center justify-center gap-3">
            {isHovered && (
              <>
                <button
                  className="text-white/50 hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Share"
                >
                  <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                <button
                  className="text-white/50 hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Export"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                <button
                  className="text-white/50 hover:text-red-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick([track.id]);
                  }}
                  aria-label="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Get status badge
  const getStatusBadge = (status: Track["status"]) => {
    if (!status) return null;

    const styles = {
      "NOW PLAYING": "bg-primary/10 text-primary border border-primary",
      "UP NEXT": "bg-transparent text-white/80 border border-white/30",
      "READY": "bg-white/5 text-white/60 border border-white/10",
      "PLAYED": "bg-white/5 text-white/40 border border-white/10",
    };

    return (
      <div
        className={`inline-flex px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider font-['IBM_Plex_Mono'] ${styles[status]}`}
      >
        {status}
      </div>
    );
  };

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">Track Library</h1>
            <p className="text-xs text-white/40">
              {filteredTracks.length} tracks
              {selectedTracks.length > 0 && (
                <span className="ml-2 text-primary">
                  • {selectedTracks.length} selected
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 w-64 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Columns dropdown */}
            <div className="relative group">
              <button className="h-9 px-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2">
                <span>Columns</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-[#18181b] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-1">
                  {columns.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => toggleColumn(col.id)}
                      className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5 flex items-center gap-2"
                    >
                      <div className={`w-3 h-3 border ${col.visible ? "bg-primary border-primary" : "border-white/20"} rounded-sm`}>
                        {col.visible && (
                          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-['IBM_Plex_Mono'] text-xs uppercase">{col.label || col.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Keyboard shortcuts hint - only show when tracks are selected */}
        {selectedTracks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-4 text-[10px] text-white/30 font-['IBM_Plex_Mono'] uppercase tracking-wider">
              <span>Space: Play</span>
              <span>Enter: Add to Mix</span>
              <span>⌘C: Copy Link</span>
              <span>⌘E: Export</span>
              <span>Del: Delete</span>
            </div>
          </div>
        )}
      </div>

      {/* Table Container with Details Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table - Scrollable */}
        <div className={`flex-1 overflow-auto ${selectedTracks.length === 1 ? 'mr-80' : ''} transition-all duration-300`}>
          <table className="w-full border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-10 bg-[#0f0f14] border-b border-white/10">
            <tr style={{ height: `${ROW_HEIGHT}px` }}>
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className={`px-3 text-left border-r border-white/5 last:border-r-0 ${
                    column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""
                  }`}
                  style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}
                >
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-['IBM_Plex_Mono'] font-medium">
                    {column.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredTracks.map((track, index) => {
              const isSelected = selectedTracks.includes(track.id);
              const isPlaying = playingTrackId === track.id;
              
              return (
                <ContextMenu key={track.id}>
                  <ContextMenuTrigger asChild>
                    <tr
                      className={`
                        border-b border-white/5 transition-colors cursor-pointer
                        ${isSelected ? "bg-primary/10 hover:bg-primary/[0.12]" : "hover:bg-white/[0.02]"}
                        ${index % 2 === 0 && !isSelected ? "bg-black/20" : ""}
                        ${index % 2 !== 0 && !isSelected ? "bg-black/40" : ""}
                      `}
                      style={{ height: `${ROW_HEIGHT}px` }}
                      onMouseEnter={() => setHoveredRow(track.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={(e) => handleRowClick(track.id, index, e)}
                      onDoubleClick={() => handleDoubleClick(track.id)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, track.id)}
                      onDragEnd={handleDragEnd}
                    >
                      {visibleColumns.map((column) => (
                        <td
                          key={column.id}
                          className="border-r border-white/5 last:border-r-0 overflow-hidden"
                          style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px`, height: `${ROW_HEIGHT}px` }}
                        >
                          {column.id === "play" && track.status ? (
                            <div className="h-full flex items-center justify-between px-3">
                              {renderCell(column, track, hoveredRow === track.id)}
                              <div className="ml-2">{getStatusBadge(track.status)}</div>
                            </div>
                          ) : (
                            renderCell(column, track, hoveredRow === track.id)
                          )}
                        </td>
                      ))}
                    </tr>
                  </ContextMenuTrigger>
                  
                  {/* Context Menu */}
                  <ContextMenuContent className="w-56 bg-[#18181b] border-white/10">
                    <ContextMenuItem onClick={() => handlePlay(track.id)}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Play
                      <ContextMenuShortcut>Space</ContextMenuShortcut>
                    </ContextMenuItem>
                    
                    <ContextMenuItem onClick={() => handleLoadIntoAutoDJ(selectedTracks.length > 0 && selectedTracks.includes(track.id) ? selectedTracks : [track.id])}>
                      <Plus className="mr-2 h-4 w-4" />
                      Load into Auto DJ Mix
                      <ContextMenuShortcut>Enter</ContextMenuShortcut>
                    </ContextMenuItem>
                    
                    <ContextMenuSeparator />
                    
                    <ContextMenuItem onClick={() => handleAnalyze(selectedTracks.length > 0 && selectedTracks.includes(track.id) ? selectedTracks : [track.id])}>
                      <Music2 className="mr-2 h-4 w-4" />
                      Analyze
                    </ContextMenuItem>
                    
                    <ContextMenuItem onClick={() => handleExport(selectedTracks.length > 0 && selectedTracks.includes(track.id) ? selectedTracks : [track.id])}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Export
                      <ContextMenuShortcut>⌘E</ContextMenuShortcut>
                    </ContextMenuItem>
                    
                    <ContextMenuItem onClick={() => handleShare(track.id)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                      <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                    </ContextMenuItem>
                    
                    <ContextMenuSeparator />
                    
                    <ContextMenuItem onClick={() => handleRename(track.id, "title")}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Rename Title
                    </ContextMenuItem>
                    
                    <ContextMenuItem onClick={() => handleRename(track.id, "artist")}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Rename Artist
                    </ContextMenuItem>
                    
                    <ContextMenuItem onClick={() => handleDuplicate(track.id)}>
                      <Files className="mr-2 h-4 w-4" />
                      Duplicate
                    </ContextMenuItem>
                    
                    <ContextMenuSeparator />
                    
                    <ContextMenuItem 
                      variant="destructive"
                      onClick={() => handleDeleteClick(selectedTracks.length > 0 && selectedTracks.includes(track.id) ? selectedTracks : [track.id])}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                      <ContextMenuShortcut>Del</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </tbody>
        </table>

        {/* Empty state */}
        {filteredTracks.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              {searchQuery.trim() ? (
                <>
                  <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 mb-1">No tracks found</p>
                  <p className="text-sm text-white/40">Try adjusting your search.</p>
                </>
              ) : (
                <>
                  <Music2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">No tracks found</p>
                </>
              )}
            </div>
          </div>
        )}
        </div>

        {/* Track Details Panel */}
        {selectedTracks.length === 1 && (() => {
          const selectedTrack = tracks.find(t => t.id === selectedTracks[0]);
          if (!selectedTrack) return null;
          
          return (
            <div className="w-80 border-l border-white/10 bg-[#0f0f14] flex flex-col">
              {/* Panel Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['IBM_Plex_Mono']">
                  Track Details
                </h2>
                <button
                  onClick={() => setSelectedTracks([])}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Title & Artist */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1 truncate" title={selectedTrack.title}>
                    {selectedTrack.title}
                  </h3>
                  <p className="text-sm text-white/60 truncate" title={selectedTrack.artist}>
                    {selectedTrack.artist}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">BPM</span>
                    <span className="text-sm font-medium text-white font-['IBM_Plex_Mono']">{selectedTrack.bpm}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">Key</span>
                    <span className="text-sm font-medium text-white font-['IBM_Plex_Mono']">{selectedTrack.key}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">Duration</span>
                    <span className="text-sm font-medium text-white font-['IBM_Plex_Mono']">{selectedTrack.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">Energy</span>
                    <span className="text-sm font-medium text-white">{selectedTrack.energy}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">Version</span>
                    <span className="text-sm font-medium text-white font-['IBM_Plex_Mono']">{selectedTrack.version}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">Date Added</span>
                    <span className="text-sm font-medium text-white/80 font-['IBM_Plex_Mono']">{selectedTrack.dateAdded}</span>
                  </div>
                </div>

                {/* Status Badge */}
                {selectedTrack.status && (
                  <div className="pt-4">
                    <div className={`inline-flex px-3 py-1.5 text-xs font-medium uppercase tracking-wider font-['IBM_Plex_Mono'] rounded-lg border ${
                      selectedTrack.status === "NOW PLAYING" 
                        ? "bg-primary/10 text-primary border-primary" 
                        : selectedTrack.status === "UP NEXT"
                        ? "bg-transparent text-white/80 border-white/30"
                        : "bg-white/5 text-white/60 border-white/10"
                    }`}>
                      {selectedTrack.status}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
      
      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-[#18181b] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Track?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This action cannot be undone. This will permanently delete the selected track(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Share Modal */}
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} track={modalTrack} />
      
      {/* Export Modal */}
      <ExportModal open={exportModalOpen} onOpenChange={setExportModalOpen} track={modalTrack} />
    </div>
  );
}