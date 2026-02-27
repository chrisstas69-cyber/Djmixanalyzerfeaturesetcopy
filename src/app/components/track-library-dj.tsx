import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Play, Pause, Search, Share2, Download, ChevronDown, ChevronUp, Music2, Trash2, Copy, FileDown, PlayCircle, Plus, Edit3, Files, X, Star, Filter, Sparkles, CheckSquare, Square, GripVertical, RefreshCw, Image as ImageIcon, Upload, Loader2, Layers, Eye, EyeOff, Dna, LayoutGrid, List } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { generateAlbumArtwork } from "./album-art-generator";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { ShareModal } from "./share-modal";
import { ExportModal } from "./export-modal";
import { Checkbox } from "./ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TrackList } from "@/components/TrackList";
import { getSampleTracksWithDNA } from "@/data/mockTracksWithDNA";
import type { Track as DisplayTrack } from "@/data/mockTracksWithDNA";
// Column definition - SIMPLIFIED to requirements
type ColumnId = "artwork" | "title" | "waveform" | "artist" | "dna" | "bpm" | "key" | "time" | "energy" | "version" | "actions";

interface Column {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  align: "left" | "center" | "right";
  visible: boolean;
}

interface TrackRoyaltySplit {
  creator: number;
  dnaArtist: number;
  platform: number;
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
  tags?: string[];
  /** DNA attribution – show badge in library */
  dnaPresetId?: string;
  dnaArtistName?: string;
  dnaPresetName?: string;
  generationMethod?: "dna" | "prompt-only";
  royaltySplit?: TrackRoyaltySplit;
  /** Prompt used to generate this track (shown in detail panel) */
  promptUsed?: string;
}

interface ActiveDNAProfile {
  id: string;
  name: string;
  preferredBpm: number;
  dominantKeys: string[];
  avgEnergy: number;
  peakEnergy: number;
  bpmRange?: string;
  energyRange?: string;
  keyRange?: string;
}

// Fixed row height – Mixed In Key style
const ROW_HEIGHT = 52;

// Default columns (as specified)
const DEFAULT_COLUMNS: Column[] = [
  { id: "artwork", label: "ART", width: 70, minWidth: 70, align: "center", visible: true },
  { id: "title", label: "TITLE", width: 280, minWidth: 120, align: "left", visible: true },
  { id: "waveform", label: "WAVEFORM", width: 80, minWidth: 80, align: "center", visible: true },
  { id: "artist", label: "ARTIST", width: 200, minWidth: 120, align: "left", visible: true },
  { id: "dna", label: "DNA", width: 100, minWidth: 80, align: "center", visible: true },
  { id: "bpm", label: "BPM", width: 70, minWidth: 60, align: "center", visible: true },
  { id: "key", label: "KEY", width: 60, minWidth: 50, align: "center", visible: true },
  { id: "time", label: "TIME", width: 70, minWidth: 60, align: "center", visible: true },
  { id: "energy", label: "ENERGY", width: 90, minWidth: 70, align: "left", visible: true },
  { id: "version", label: "VERSION", width: 80, minWidth: 60, align: "center", visible: true },
  { id: "actions", label: "ACTIONS", width: 120, minWidth: 100, align: "center", visible: true },
];

const ITEM_TYPE = "COLUMN";

const ENERGY_STRING_TO_NUMBER: Record<string, number> = {
  Chill: 2, Deep: 3, Steady: 4, Groove: 5, Building: 6,
  Rising: 7, Peak: 8, Wild: 9, Driving: 9, Hard: 10,
  Minimal: 3, Ethereal: 4, Dark: 5, Melodic: 6,
};

function mapLibraryTrackToDisplayTrack(t: Track, isFavorite: boolean): DisplayTrack {
  const energyNum = ENERGY_STRING_TO_NUMBER[t.energy] ?? 5;
  return {
    id: t.id,
    title: t.title,
    artist: t.artist,
    artwork: t.artwork ?? null,
    bpm: t.bpm,
    key: t.key,
    duration: t.duration,
    energy: energyNum,
    genre: "House",
    isFavorite,
    createdAt: t.dateAdded,
    dnaPresetId: t.dnaPresetId,
    dnaArtistName: t.dnaArtistName,
    dnaPresetName: t.dnaPresetName,
    generationMethod: t.generationMethod ?? "prompt-only",
    royaltySplit: t.royaltySplit,
    promptUsed: t.promptUsed,
  };
}

const ENERGY_NUMBER_TO_STRING: Record<number, string> = {
  1: "Chill", 2: "Chill", 3: "Deep", 4: "Steady", 5: "Groove",
  6: "Building", 7: "Rising", 8: "Peak", 9: "Wild", 10: "Wild",
};

function mapDisplayTrackToLibraryTrack(d: DisplayTrack): Track {
  const energyStr = ENERGY_NUMBER_TO_STRING[d.energy] ?? "Groove";
  return {
    id: d.id,
    title: d.title,
    artist: d.artist,
    bpm: d.bpm,
    key: d.key,
    duration: d.duration,
    energy: energyStr,
    version: "A",
    status: null,
    dateAdded: d.createdAt,
    artwork: d.artwork ?? undefined,
    dnaPresetId: d.dnaPresetId,
    dnaArtistName: d.dnaArtistName,
    dnaPresetName: d.dnaPresetName,
    generationMethod: d.generationMethod,
    royaltySplit: d.royaltySplit,
    promptUsed: d.promptUsed,
  };
}

// Draggable Column Header Component
function DraggableColumnHeader({
  column,
  index,
  moveColumn,
  onResizeStart,
  isSorted,
  sortDirection,
  onSort,
  onToggleVisibility,
}: {
  column: Column;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onResizeStart: (columnId: ColumnId, e: React.MouseEvent) => void;
  isSorted?: boolean;
  sortDirection?: "asc" | "desc";
  onSort?: () => void;
  onToggleVisibility?: (columnId: ColumnId) => void;
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

  const isSortable = column.id === "title" || column.id === "bpm" || column.id === "time" || column.id === "energy";

  return (
    <th
      ref={ref}
      className={`relative px-3 font-semibold uppercase select-none cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      } ${isSortable ? "hover:bg-white/5 transition-colors" : ""}`}
      style={{
        fontSize: '11px',
        letterSpacing: '0.08em',
        color: '#555',
        borderRight: '1px solid var(--border)',
        width: `${column.width}px`,
        minWidth: `${column.minWidth}px`,
      }}
      onClick={onSort}
    >
      <div className={`flex items-center gap-1.5 ${column.align === "center" ? "justify-center" : column.align === "right" ? "justify-end" : ""}`}>
        <GripVertical className="w-3 h-3 cursor-move flex-shrink-0" style={{ color: '#555' }} />
        <span>
          {column.label}
        </span>
        {isSortable && isSorted && (
          sortDirection === "asc" ? (
            <ChevronUp className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--orange)' }} />
          ) : (
            <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--orange)' }} />
          )
        )}
        {onToggleVisibility && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(column.id);
            }}
            className="ml-auto p-0.5 rounded hover:bg-white/5 transition-colors"
            title={column.visible ? "Hide column" : "Show column"}
          >
            {column.visible ? (
              <Eye className="w-3 h-3" style={{ color: 'var(--text-3)' }} />
            ) : (
              <EyeOff className="w-3 h-3" style={{ color: 'var(--text-3)' }} />
            )}
          </button>
        )}
      </div>
      {/* Resize Handle */}
      {column.id !== "artwork" && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-20"
          onMouseDown={(e) => onResizeStart(column.id, e)}
        />
      )}
    </th>
  );
}

// Mock tracks with generated artwork; tag by source for tab filtering (generated / dna / uploaded)
const MOCK_TRACKS: Track[] = [
  { id: "1", title: "Untitled Track", artist: "Unknown Artist", bpm: 126, key: "Am", duration: "6:42", energy: "Rising", version: "A", status: null, dateAdded: "2023-12-01", artwork: generateAlbumArtwork("Untitled Track", 126, "Am", "Rising", "A"), generationMethod: "prompt-only" },
  { id: "2", title: "Hypnotic Groove", artist: "Underground Mix", bpm: 126, key: "Am", duration: "7:20", energy: "Peak", version: "B", status: "NOW PLAYING", dateAdded: "2023-12-02", artwork: generateAlbumArtwork("Hypnotic Groove", 126, "Am", "Peak", "B"), generationMethod: "prompt-only" },
  { id: "3", title: "Warehouse Nights", artist: "Berlin Basement", bpm: 128, key: "Fm", duration: "6:30", energy: "Building", version: "C", status: "UP NEXT", dateAdded: "2023-12-03", artwork: generateAlbumArtwork("Warehouse Nights", 128, "Fm", "Building", "C"), generationMethod: "prompt-only" },
  { id: "4", title: "Deep House Vibes", artist: "Soulful Sessions", bpm: 124, key: "Dm", duration: "5:58", energy: "Groove", version: "A", status: "READY", dateAdded: "2023-12-04", artwork: generateAlbumArtwork("Deep House Vibes", 124, "Dm", "Groove", "A"), generationMethod: "prompt-only" },
  { id: "5", title: "Rolling Bassline", artist: "Low Frequency", bpm: 127, key: "Gm", duration: "6:30", energy: "Steady", version: "B", status: null, dateAdded: "2023-12-05", artwork: generateAlbumArtwork("Rolling Bassline", 127, "Gm", "Steady", "B"), generationMethod: "prompt-only" },
  { id: "6", title: "Peak Time Energy", artist: "Night Shift", bpm: 130, key: "Em", duration: "7:02", energy: "Peak", version: "A", status: null, dateAdded: "2023-12-06", artwork: generateAlbumArtwork("Peak Time Energy", 130, "Em", "Peak", "A"), dnaPresetId: "dna1", dnaArtistName: "DNA Artist", generationMethod: "dna" },
  { id: "7", title: "Acid Reflections", artist: "303 Sessions", bpm: 132, key: "Cm", duration: "8:15", energy: "Wild", version: "C", status: null, dateAdded: "2023-12-07", artwork: generateAlbumArtwork("Acid Reflections", 132, "Cm", "Wild", "C"), dnaPresetId: "dna1", dnaArtistName: "DNA Artist", generationMethod: "dna" },
  { id: "8", title: "Late Night Dub", artist: "Echo Chamber", bpm: 122, key: "Am", duration: "7:45", energy: "Chill", version: "A", status: "PLAYED", dateAdded: "2023-12-08", artwork: generateAlbumArtwork("Late Night Dub", 122, "Am", "Chill", "A"), dnaPresetId: "dna2", dnaArtistName: "DNA Artist", generationMethod: "dna" },
  { id: "9", title: "Minimal Movement", artist: "Berlin Basement", bpm: 128, key: "Em", duration: "6:18", energy: "Minimal", version: "B", status: null, dateAdded: "2023-12-09", artwork: generateAlbumArtwork("Minimal Movement", 128, "Em", "Minimal", "B"), dnaPresetId: "dna2", dnaArtistName: "DNA Artist", generationMethod: "dna" },
  { id: "10", title: "Broken Beat", artist: "Fractured Rhythms", bpm: 140, key: "Fm", duration: "5:30", energy: "Driving", version: "C", status: null, dateAdded: "2023-12-10", artwork: generateAlbumArtwork("Broken Beat", 140, "Fm", "Driving", "C"), dnaPresetId: "dna2", dnaArtistName: "DNA Artist", generationMethod: "dna" },
  { id: "11", title: "Subterranean Flow", artist: "Deep State", bpm: 125, key: "Cm", duration: "6:55", energy: "Deep", version: "A", status: null, dateAdded: "2023-12-11", artwork: generateAlbumArtwork("Subterranean Flow", 125, "Cm", "Deep", "A") },
  { id: "12", title: "Dark Matter", artist: "Void Sessions", bpm: 129, key: "Gm", duration: "7:10", energy: "Dark", version: "B", status: null, dateAdded: "2023-12-12", artwork: generateAlbumArtwork("Dark Matter", 129, "Gm", "Dark", "B") },
  { id: "13", title: "Ethereal Groove", artist: "Cosmic Sounds", bpm: 124, key: "Dm", duration: "6:25", energy: "Ethereal", version: "A", status: null, dateAdded: "2023-12-13", artwork: generateAlbumArtwork("Ethereal Groove", 124, "Dm", "Ethereal", "A") },
  { id: "14", title: "Circuit Breaker", artist: "Voltage Control", bpm: 135, key: "Am", duration: "5:45", energy: "Hard", version: "C", status: null, dateAdded: "2023-12-14", artwork: generateAlbumArtwork("Circuit Breaker", 135, "Am", "Hard", "C") },
  { id: "15", title: "Analog Dreams", artist: "Modular Mind", bpm: 128, key: "Fm", duration: "7:30", energy: "Melodic", version: "B", status: null, dateAdded: "2023-12-15", artwork: generateAlbumArtwork("Analog Dreams", 128, "Fm", "Melodic", "B") },
];

export interface TrackLibraryDJProps {
  onNavigate?: (viewId: string) => void;
}

export function TrackLibraryDJ(props?: TrackLibraryDJProps) {
  const { onNavigate } = props ?? {};
  const [activeTab, setActiveTab] = useState<"all" | "generated" | "dna" | "uploaded">("all");
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [trackDetailTrack, setTrackDetailTrack] = useState<Track | null>(null);
  const [columns, setColumns] = useState<Column[]>(() => {
    // Load column order and widths from localStorage
    const saved = localStorage.getItem('trackLibraryColumns');
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

  // Columns popover (floating, not hover)
  const [columnsPopoverOpen, setColumnsPopoverOpen] = useState(false);

  // Regenerate image modal (for track detail panel)
  const [regenerateImageOpen, setRegenerateImageOpen] = useState(false);
  const [regenerateImageDescription, setRegenerateImageDescription] = useState("");
  const [regenerateImageTrack, setRegenerateImageTrack] = useState<Track | null>(null);

  // Favorite tracks state
  const [favoriteTracks, setFavoriteTracks] = useState<Set<string>>(new Set());
  
  // Favorites filter toggle
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Energy filter
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<"title" | "bpm" | "time" | "energy" | "date" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active DNA state
  const [activeDNA, setActiveDNA] = useState<ActiveDNAProfile | null>(null);

  // Column reordering
  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      const [removed] = newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, removed);
      return newColumns;
    });
  }, []);

  // Column visibility toggle
  const toggleColumnVisibility = useCallback((columnId: ColumnId) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

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

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartX;
      const newWidth = Math.max(
        columns.find(c => c.id === resizingColumn)?.minWidth || 40,
        resizeStartWidth + deltaX
      );
      
      setColumns((prev) =>
        prev.map((col) =>
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

  // Save columns to localStorage
  useEffect(() => {
    localStorage.setItem('trackLibraryColumns', JSON.stringify(columns));
  }, [columns]);

  // Load tracks and favorites from localStorage on component mount
  useEffect(() => {
    try {
      const libraryTracksStr = localStorage.getItem('libraryTracks');

      if (libraryTracksStr) {
        const savedTracks = JSON.parse(libraryTracksStr);
        const mergedTracks = [...MOCK_TRACKS, ...savedTracks];
        setTracks(mergedTracks);
      } else {
        // No saved library: show MOCK_TRACKS + sample DNA tracks so users see DNA badges
        const samples = getSampleTracksWithDNA().slice(0, 8).map(mapDisplayTrackToLibraryTrack);
        setTracks([...MOCK_TRACKS, ...samples]);
      }

      // Load favorites from localStorage
      const favoritesStr = localStorage.getItem('favoriteTracks');
      if (favoritesStr) {
        const favoriteIds = JSON.parse(favoritesStr);
        setFavoriteTracks(new Set(favoriteIds));
      }

      // Load active DNA from localStorage
      const activeDNAStr = localStorage.getItem('activeDNA');
      if (activeDNAStr) {
        const dna: ActiveDNAProfile = JSON.parse(activeDNAStr);
        setActiveDNA(dna);
      } else {
        // Use mock DNA for demo purposes if no active DNA exists
        const mockDNA: ActiveDNAProfile = {
          id: "dna-demo",
          name: "Berlin Warehouse DNA",
          preferredBpm: 128,
          dominantKeys: ["Am", "Fm", "Gm", "Em"],
          avgEnergy: 7.8,
          peakEnergy: 8.9,
          bpmRange: "126-130",
          energyRange: "7.2-8.5",
          keyRange: "Am, Fm, Gm",
        };
        setActiveDNA(mockDNA);
      }
    } catch (error) {
      console.error('Error loading tracks from localStorage:', error);
      // On error, fall back to MOCK_TRACKS
      setTracks(MOCK_TRACKS);
    }
  }, []); // Empty dependency array - runs only on component mount

  // Toggle favorite status
  const toggleFavorite = (trackId: string) => {
    setFavoriteTracks((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
      } else {
        newFavorites.add(trackId);
      }
      // Save to localStorage
      localStorage.setItem('favoriteTracks', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };
  
  // Drag state
  const [draggedTracks, setDraggedTracks] = useState<Track[]>([]);
  
  // Playing track state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>("2"); // Default: track 2 is now playing
  
  // Playback state for details panel
  const [detailsPanelPlaying, setDetailsPanelPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Update current time when playing
  useEffect(() => {
    if (!detailsPanelPlaying || selectedTracks.length !== 1) return;
    
    const selectedTrack = tracks.find(t => t.id === selectedTracks[0]);
    if (!selectedTrack) return;
    
    const parseDuration = (duration: string): number => {
      const parts = duration.split(":");
      return parseInt(parts[0]) * 60 + parseInt(parts[1] || "0");
    };
    const totalSeconds = parseDuration(selectedTrack.duration);
    
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalSeconds) {
          setDetailsPanelPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [detailsPanelPlaying, selectedTracks, tracks]);
  
  // Reset current time when track changes
  useEffect(() => {
    setCurrentTime(0);
    setDetailsPanelPlaying(false);
  }, [selectedTracks]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter tracks by active tab, search, favorites, and energy
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      // Filter by active tab: all | generated | dna | uploaded
      if (activeTab === "generated") {
        if (track.generationMethod !== "prompt-only") return false;
      } else if (activeTab === "dna") {
        if (!track.dnaPresetId && track.generationMethod !== "dna") return false;
      } else if (activeTab === "uploaded") {
        if (track.generationMethod != null || track.dnaPresetId != null) return false;
      }
      // activeTab === "all" → no tab filter

      // First filter by favorites if toggle is on
      if (showFavoritesOnly && !favoriteTracks.has(track.id)) {
        return false;
      }
      
      // Filter by energy if selected
      if (selectedEnergy && track.energy.toLowerCase() !== selectedEnergy.toLowerCase()) {
        return false;
      }
      
      // Then filter by search query
      const query = searchQuery.toLowerCase();
      return (
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.bpm.toString().includes(query) ||
        track.key.toLowerCase().includes(query) ||
        track.energy.toLowerCase().includes(query)
      );
    });
  }, [tracks, activeTab, showFavoritesOnly, favoriteTracks, selectedEnergy, searchQuery]);

  // Get recommended tracks based on active DNA
  const recommendedTracks = useMemo(() => {
    if (!activeDNA) return [];

    return tracks.filter(track => {
      // Check BPM match (within ±5 BPM of preferred)
      const bpmMatch = Math.abs(track.bpm - activeDNA.preferredBpm) <= 5;
      
      // Check key match (matches one of dominant keys)
      const keyMatch = activeDNA.dominantKeys.some(dk => 
        track.key.toLowerCase() === dk.toLowerCase()
      );
      
      // Check energy match (map energy string to numeric range)
      // Energy strings like "Rising", "Peak", "Building" etc.
      // For simplicity, we'll match tracks with energy descriptors that suggest high energy
      const energyMatch = track.energy && (
        track.energy.toLowerCase().includes("peak") ||
        track.energy.toLowerCase().includes("rising") ||
        track.energy.toLowerCase().includes("building") ||
        track.energy.toLowerCase().includes("groove")
      );

      return bpmMatch && (keyMatch || energyMatch);
    }).slice(0, 5); // Limit to 5 recommendations
  }, [tracks, activeDNA]);

  // Sort filtered tracks
  const sortedTracks = useMemo(() => {
    return [...filteredTracks].sort((a, b) => {
      if (!sortColumn) return 0;
      
      let comparison = 0;
      
      switch (sortColumn) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "bpm":
          comparison = a.bpm - b.bpm;
          break;
        case "time":
          // Parse duration (format: "5:30" -> seconds)
          const parseDuration = (duration: string): number => {
            const parts = duration.split(":");
            return parseInt(parts[0]) * 60 + parseInt(parts[1] || "0");
          };
          comparison = parseDuration(a.duration) - parseDuration(b.duration);
          break;
        case "energy":
          // Energy is a string, so compare alphabetically
          comparison = a.energy.localeCompare(b.energy);
          break;
        case "date":
          // Sort by dateAdded (YYYY-MM-DD format)
          comparison = a.dateAdded.localeCompare(b.dateAdded);
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredTracks, sortColumn, sortDirection]);

  // Calculate stats for summary bar
  const statsSummary = useMemo(() => {
    const total = tracks.length;
    const favorited = favoriteTracks.size;
    const avgBPM = total > 0 
      ? Math.round(tracks.reduce((sum, t) => sum + t.bpm, 0) / total)
      : 0;
    
    // Find most played track (from playback history)
    const historyStr = localStorage.getItem('playbackHistory');
    if (historyStr) {
      try {
        const history = JSON.parse(historyStr);
        const playCounts: Record<string, number> = {};
        history.forEach((entry: { trackId: string }) => {
          playCounts[entry.trackId] = (playCounts[entry.trackId] || 0) + 1;
        });
        const mostPlayedId = Object.entries(playCounts).reduce((a, b) => 
          a[1] > b[1] ? a : b, 
          ["", 0]
        )[0];
        const mostPlayedTrack = tracks.find(t => t.id === mostPlayedId);
        return {
          total,
          favorited,
          avgBPM,
          mostPlayed: mostPlayedTrack?.title || "N/A",
        };
      } catch (e) {
        // If history parsing fails, continue without most played
      }
    }
    
    return {
      total,
      favorited,
      avgBPM,
      mostPlayed: "N/A",
    };
  }, [tracks, favoriteTracks]);

  // Handle column header click for sorting
  const handleSort = (column: "title" | "bpm" | "time" | "energy" | "date") => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle sort dropdown change
  const handleSortChange = (value: string) => {
    if (value === "none") {
      setSortColumn(null);
    } else {
      const [column, direction] = value.split("-");
      setSortColumn(column as "title" | "bpm" | "time" | "energy" | "date");
      setSortDirection(direction as "asc" | "desc");
    }
  };

  // ========================================
  // SELECTION LOGIC
  // ========================================
  
  const handleRowClick = (trackId: string, index: number, event: React.MouseEvent) => {
    // Don't select if editing
    if (editingCell) return;
    
    // Don't change selection if clicking on checkbox (handled separately)
    if ((event.target as HTMLElement).closest('button[aria-label*="Select"]')) {
      return;
    }
    
    if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift+click: select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeIds = sortedTracks.slice(start, end + 1).map(t => t.id);
      setSelectedTracks(rangeIds);
    } else if (event.metaKey || event.ctrlKey) {
      // Cmd/Ctrl+click: toggle selection
      toggleTrackSelection(trackId);
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
            // Track playback history
            trackPlaybackHistory(trackId, track.duration);
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
      
      // Track playback history
      trackPlaybackHistory(trackId, track.duration);
    }
  };
  
  // Track playback history
  const trackPlaybackHistory = (trackId: string, duration: string) => {
    try {
      // Parse duration (format: "5:30" -> seconds)
      const parseDuration = (duration: string): number => {
        const parts = duration.split(":");
        return parseInt(parts[0]) * 60 + parseInt(parts[1] || "0");
      };
      
      const durationSeconds = parseDuration(duration);
      
      // Create history entry
      const historyEntry = {
        trackId,
        timestamp: new Date().toISOString(),
        duration: durationSeconds,
      };
      
      // Load existing history
      const historyStr = localStorage.getItem('playbackHistory');
      const history: typeof historyEntry[] = historyStr ? JSON.parse(historyStr) : [];
      
      // Add new entry
      const updatedHistory = [...history, historyEntry];
      
      // Keep only last 1000 entries to prevent localStorage from getting too large
      const trimmedHistory = updatedHistory.slice(-1000);
      
      // Save back to localStorage
      localStorage.setItem('playbackHistory', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error tracking playback history:', error);
    }
  };
  
  const handleLoadIntoAutoDJ = (trackIds: string[]) => {
    toast.success(`Added ${trackIds.length} track(s) to Auto DJ Mix`);
  };
  
  const handleAnalyze = (trackIds: string[]) => {
    toast.info(`Analyzing ${trackIds.length} track(s)...`);
  };
  
  const handleExportJSON = (track: Track) => {
    const trackData = {
      title: track.title,
      artist: track.artist,
      bpm: track.bpm,
      key: track.key,
      duration: track.duration,
      energy: track.energy,
      version: track.version,
      dateAdded: track.dateAdded,
    };
    
    const jsonString = JSON.stringify(trackData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${track.title.replace(/[^a-z0-9]/gi, '_')}_${track.artist.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported "${track.title}" as JSON`);
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

  // File upload handler
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_FORMATS = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];

  const getFileDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        URL.revokeObjectURL(url);
        resolve(duration);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio metadata'));
      });
      
      audio.src = url;
    });
  };

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const newTracks: Track[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        // Validate
        if (!ALLOWED_FORMATS.includes(file.type)) {
          toast.error(`Unsupported format: ${file.type}. Please upload MP3, WAV, or FLAC files.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 50MB.`);
          continue;
        }

        // Get duration
        let duration = 0;
        try {
          duration = await getFileDuration(file);
        } catch (err) {
          console.error('Error getting duration:', err);
          toast.warning(`Could not determine duration for ${file.name}`);
        }

        // Extract title from filename (remove extension)
        const title = file.name.replace(/\.[^/.]+$/, "");
        
        // Generate artwork
        const { generateAlbumArtwork } = await import("./album-art-generator");
        const artwork = generateAlbumArtwork(
          title,
          128, // Default BPM
          "Am", // Default key
          "Groove", // Default energy
          "A" // Default version
        );

        const newTrack: Track = {
          id: `track-upload-${Date.now()}-${i}`,
          title,
          artist: "Uploaded",
          bpm: 128,
          key: "Am",
          duration: `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, "0")}`,
          energy: "Groove",
          version: "A",
          status: null,
          dateAdded: new Date().toISOString().split('T')[0],
          artwork,
        };

        newTracks.push(newTrack);
        setUploadProgress(((i + 1) / fileList.length) * 100);
      }

      if (newTracks.length > 0) {
        const updated = [...tracks, ...newTracks];
        setTracks(updated);
        
        // Save to localStorage
        const tracksToSave = updated.filter(t => !MOCK_TRACKS.some(m => m.id === t.id));
        localStorage.setItem('libraryTracks', JSON.stringify(tracksToSave));
        
        toast.success(`Uploaded ${newTracks.length} track(s) successfully`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };
  
  const handleDeleteClick = (trackIds: string[]) => {
    setTracksToDelete(trackIds);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    try {
    setTracks(prev => prev.filter(t => !tracksToDelete.includes(t.id)));
    setSelectedTracks(prev => prev.filter(id => !tracksToDelete.includes(id)));
      
      // Update localStorage
      const updatedTracks = tracks.filter(t => !tracksToDelete.includes(t.id));
      const tracksToSave = updatedTracks.filter(t => !MOCK_TRACKS.some(m => m.id === t.id));
      localStorage.setItem('libraryTracks', JSON.stringify(tracksToSave));
      
    toast.success(`Deleted ${tracksToDelete.length} track(s)`);
    setTracksToDelete([]);
    setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting tracks:', error);
      toast.error('Failed to delete tracks. Please try again.');
    }
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
      setTracks((prev) => {
        const next = prev.map((t) =>
          t.id === editingCell.trackId
            ? { ...t, [editingCell.field]: editValue }
            : t
        );
        localStorage.setItem("libraryTracks", JSON.stringify(next));
        return next;
      });
      if (trackDetailTrack?.id === editingCell.trackId) {
        setTrackDetailTrack((t) => (t ? { ...t, [editingCell!.field]: editValue } : null));
      }
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

  // Update track title/artist from card edit (persist to state + localStorage)
  const handleTrackTitleChange = useCallback((trackId: string, value: string) => {
    setTracks((prev) => {
      const next = prev.map((t) => (t.id === trackId ? { ...t, title: value } : t));
      localStorage.setItem("libraryTracks", JSON.stringify(next));
      return next;
    });
    if (trackDetailTrack?.id === trackId) setTrackDetailTrack((t) => (t ? { ...t, title: value } : null));
  }, [trackDetailTrack?.id]);

  const handleTrackArtistChange = useCallback((trackId: string, value: string) => {
    setTracks((prev) => {
      const next = prev.map((t) => (t.id === trackId ? { ...t, artist: value } : t));
      localStorage.setItem("libraryTracks", JSON.stringify(next));
      return next;
    });
    if (trackDetailTrack?.id === trackId) setTrackDetailTrack((t) => (t ? { ...t, artist: value } : null));
  }, [trackDetailTrack?.id]);

  // Regenerate artwork from description (2 credits)
  const handleRegenerateImage = useCallback(() => {
    if (!regenerateImageTrack) return;
    const desc = regenerateImageDescription.trim() || regenerateImageTrack.title;
    const newArtwork = generateAlbumArtwork(
      desc,
      regenerateImageTrack.bpm,
      regenerateImageTrack.key,
      regenerateImageTrack.energy,
      regenerateImageTrack.version
    );
    setTracks((prev) => {
      const next = prev.map((t) =>
        t.id === regenerateImageTrack.id ? { ...t, artwork: newArtwork } : t
      );
      localStorage.setItem("libraryTracks", JSON.stringify(next));
      return next;
    });
    if (trackDetailTrack?.id === regenerateImageTrack.id) {
      setTrackDetailTrack((t) => (t ? { ...t, artwork: newArtwork } : null));
    }
    setRegenerateImageOpen(false);
    setRegenerateImageDescription("");
    setRegenerateImageTrack(null);
    toast.success("Image generated (2 credits)");
  }, [regenerateImageTrack, regenerateImageDescription, trackDetailTrack?.id]);

  // Toggle track selection
  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks((prev) => {
      if (prev.includes(trackId)) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedTracks.length === sortedTracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(sortedTracks.map(t => t.id));
    }
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (selectedTracks.length === 0) return;
    setTracksToDelete(selectedTracks);
    setDeleteConfirmOpen(true);
  };

  const handleBulkFavorite = () => {
    if (selectedTracks.length === 0) return;
    setFavoriteTracks((prev) => {
      const newFavorites = new Set(prev);
      const allSelectedAreFavorites = selectedTracks.every(id => newFavorites.has(id));
      
      if (allSelectedAreFavorites) {
        // Unfavorite all
        selectedTracks.forEach(id => newFavorites.delete(id));
      } else {
        // Favorite all
        selectedTracks.forEach(id => newFavorites.add(id));
      }
      
      localStorage.setItem('favoriteTracks', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
    
    toast.success(
      selectedTracks.every(id => favoriteTracks.has(id))
        ? `Unfavorited ${selectedTracks.length} track(s)`
        : `Favorited ${selectedTracks.length} track(s)`
    );
  };

  // Export settings state
  const [exportSettingsOpen, setExportSettingsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "m3u">("json");
  const [includeMetadata, setIncludeMetadata] = useState({
    bpm: true,
    key: true,
    energy: true,
    duration: true,
    dateAdded: true,
  });

  // Export as CSV
  const handleExportCSV = (trackIds: string[]) => {
    const selectedTrackObjects = tracks.filter(t => trackIds.includes(t.id));
    
    // CSV header
    const headers = ["Title", "Artist"];
    if (includeMetadata.bpm) headers.push("BPM");
    if (includeMetadata.key) headers.push("Key");
    if (includeMetadata.energy) headers.push("Energy");
    if (includeMetadata.duration) headers.push("Duration");
    if (includeMetadata.dateAdded) headers.push("Date Added");
    
    // CSV rows
    const rows = selectedTrackObjects.map(t => {
      const row = [t.title, t.artist];
      if (includeMetadata.bpm) row.push(t.bpm.toString());
      if (includeMetadata.key) row.push(t.key);
      if (includeMetadata.energy) row.push(t.energy);
      if (includeMetadata.duration) row.push(t.duration);
      if (includeMetadata.dateAdded) row.push(t.dateAdded);
      return row.map(cell => `"${cell}"`).join(",");
    });
    
    const csvContent = [headers.map(h => `"${h}"`).join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tracks-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${trackIds.length} track(s) as CSV`);
  };

  // Export as M3U playlist
  const handleExportM3U = (trackIds: string[]) => {
    const selectedTrackObjects = tracks.filter(t => trackIds.includes(t.id));
    
    // M3U format: #EXTM3U header, then #EXTINF lines with duration and title, then file path
    const lines = ["#EXTM3U"];
    selectedTrackObjects.forEach(t => {
      const duration = t.duration.split(":").reduce((acc, val, idx) => {
        if (idx === 0) return parseInt(val) * 60;
        return acc + parseInt(val);
      }, 0);
      const title = `${t.artist} - ${t.title}`;
      const metadata = [
        `#EXTINF:${duration},${title}`,
        `#EXTINF-BPM:${t.bpm}`,
        `#EXTINF-KEY:${t.key}`,
        `#EXTINF-ENERGY:${t.energy}`,
        `file:///${t.title.replace(/[^a-z0-9]/gi, '_')}.mp3`
      ];
      lines.push(...metadata);
    });
    
    const m3uContent = lines.join("\n");
    const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `playlist-${new Date().toISOString().split('T')[0]}.m3u`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${trackIds.length} track(s) as M3U playlist`);
  };

  const handleBulkExport = () => {
    if (selectedTracks.length === 0) {
      setExportSettingsOpen(true);
      return;
    }
    
    const selectedTrackObjects = tracks.filter(t => selectedTracks.includes(t.id));
    
    if (exportFormat === "csv") {
      handleExportCSV(selectedTracks);
    } else if (exportFormat === "m3u") {
      handleExportM3U(selectedTracks);
    } else {
      // JSON export
      const exportData = selectedTrackObjects.map(t => {
        const data: any = {
          id: t.id,
          title: t.title,
          artist: t.artist,
        };
        if (includeMetadata.bpm) data.bpm = t.bpm;
        if (includeMetadata.key) data.key = t.key;
        if (includeMetadata.energy) data.energy = t.energy;
        if (includeMetadata.duration) data.duration = t.duration;
        if (includeMetadata.dateAdded) data.dateAdded = t.dateAdded;
        return data;
      });

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tracks-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${selectedTracks.length} track(s) as JSON`);
    }
  };

  const handleBulkAddToMix = () => {
    if (selectedTracks.length === 0) return;
    toast.success(`Added ${selectedTracks.length} track(s) to mix queue`);
    // In the future, this could open a mix selector or create a new mix
  };

  // Export Mix/Playlist format
  const handleExportMix = () => {
    if (selectedTracks.length === 0) {
      toast.error("Please select tracks to export as a mix");
      return;
    }
    
    const selectedTrackObjects = tracks.filter(t => selectedTracks.includes(t.id));
    const mixData = {
      name: `Mix ${new Date().toISOString().split('T')[0]}`,
      tracks: selectedTrackObjects.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        bpm: t.bpm,
        key: t.key,
        duration: t.duration,
        energy: t.energy,
        version: t.version,
      })),
      createdAt: new Date().toISOString(),
      trackCount: selectedTrackObjects.length,
    };

    const jsonString = JSON.stringify(mixData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `playlist-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${selectedTracks.length} track(s) as Playlist`);
  };

  // Share selected tracks (bulk)
  const handleBulkShare = () => {
    if (selectedTracks.length === 0) {
      toast.error("Please select tracks to share");
      return;
    }
    
    const selectedTrackObjects = tracks.filter(t => selectedTracks.includes(t.id));
    const shareData = {
      tracks: selectedTrackObjects.map(t => ({
        title: t.title,
        artist: t.artist,
        bpm: t.bpm,
        key: t.key,
      })),
      shareId: `mix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    // Generate shareable link (mock)
    const shareLink = `https://djmix.app/share/${shareData.shareId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success(`Share link copied to clipboard!`);
    }).catch(() => {
      // Fallback: show the link
      toast.success(`Share link: ${shareLink}`);
    });
  };

  // Render cell content
  const renderCell = (column: Column, track: Track, isHovered: boolean) => {
    const isNowPlaying = track.status === "NOW PLAYING";
    const isEditing = editingCell?.trackId === track.id && editingCell?.field === column.id;
    const isSelected = selectedTracks.includes(track.id);

    switch (column.id) {
      case "checkbox":
        return (
          <div className="h-full flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTrackSelection(track.id);
              }}
              className="w-4 h-4 flex items-center justify-center"
              aria-label={isSelected ? "Deselect track" : "Select track"}
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4" fill="currentColor" style={{ color: 'var(--orange)' }} />
              ) : (
                <Square className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
              )}
            </button>
          </div>
        );

      case "status":
        return (
          <div className="h-full flex items-center justify-center">
            {track.status ? (
              <span
                className="px-2 py-1 rounded-full text-xs font-medium uppercase"
                style={{
                  background: track.status === "NOW PLAYING" ? 'var(--orange-2)' : 
                              track.status === "UP NEXT" ? 'transparent' :
                              track.status === "READY" ? 'var(--cyan-2)' : 'var(--text-3)',
                  color: '#000',
                  border: track.status === "UP NEXT" ? '1px solid var(--orange)' : 'none',
                }}
              >
                {track.status}
              </span>
            ) : (
              <span style={{ color: 'var(--text-3)', fontSize: '12px' }}>-</span>
            )}
          </div>
        );

      case "waveform": {
        const isPlaying = playingTrackId === track.id;
        return (
          <div className="flex items-center justify-center h-full">
            <div
              className="flex items-end gap-[1px] h-6 w-[80px] transition-all duration-200"
              style={{
                opacity: isPlaying ? 1 : 0.25,
                filter: isPlaying ? 'none' : 'grayscale(80%)',
              }}
            >
              {Array.from({ length: 24 }).map((_, i) => {
                const height = 8 + (i % 4) * 3;
                const progress = i / 24;
                const color = progress < 0.5
                  ? `rgb(${0 + progress * 2 * 255}, ${229 - progress * 2 * 100}, 255)`
                  : `rgb(${255 - (progress - 0.5) * 2 * 255}, ${129 + (progress - 0.5) * 2 * 100}, ${255 - (progress - 0.5) * 2 * 255})`;
                return (
                  <div
                    key={i}
                    className="w-[2px] rounded-t"
                    style={{
                      height: `${height}px`,
                      backgroundColor: color,
                      animation: isPlaying ? `pulse 0.8s ease-in-out ${i * 30}ms infinite` : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      }

      case "artwork":
        return (
          <div 
            className="flex items-center justify-center h-full px-1 relative group"
          >
            <div className="w-[70px] h-[70px] rounded-sm flex items-center justify-center overflow-hidden shadow-sm relative" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              {track.artwork ? (
                <img 
                  src={track.artwork} 
                  alt={`${track.artist} - ${track.title}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-icon')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'fallback-icon w-full h-full flex items-center justify-center';
                      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                      icon.setAttribute('class', 'w-5 h-5');
                      icon.setAttribute('viewBox', '0 0 24 24');
                      icon.setAttribute('fill', 'none');
                      icon.setAttribute('stroke', 'currentColor');
                      icon.setAttribute('stroke-width', '2');
                      icon.setAttribute('style', 'color: var(--text-3)');
                      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                      path.setAttribute('d', 'M9 18V5l12-2v13');
                      icon.appendChild(path);
                      placeholder.appendChild(icon);
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              ) : (
                <Music2 className="w-5 h-5" style={{ color: 'var(--text-3)' }} />
              )}
              {/* Play Button Overlay */}
              <div 
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handlePlay(track.id);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-black/70 flex items-center justify-center border border-white/20 hover:bg-black/80 transition-all">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
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
            <span className={`truncate ${isNowPlaying ? "font-medium" : ""}`} style={{ color: isNowPlaying ? 'var(--orange)' : 'var(--text)', fontSize: 'var(--font-size-base)' }}>
              {track.title || "Untitled Track"}
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
            <span className="truncate" style={{ color: 'var(--text-2)', fontSize: 'var(--font-size-sm)' }}>{track.artist || "Unknown Artist"}</span>
          </div>
        );

      case "dna":
        if (track.generationMethod === "dna" && track.dnaArtistName) {
          return (
            <div className="h-full flex items-center justify-center px-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setTrackDetailTrack(track);
                }}
                title={`${track.dnaArtistName} DNA${track.dnaPresetName ? ` (${track.dnaPresetName})` : ""}`}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
              >
                <Dna className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[60px]">{track.dnaArtistName}</span>
              </button>
            </div>
          );
        }
        return (
          <div className="h-full flex items-center justify-center">
            <span style={{ color: "var(--text-3)", fontSize: "12px" }}>–</span>
          </div>
        );

      case "bpm":
        return (
          <div className="h-full flex items-center justify-center">
            <span className="px-2 py-0.5 rounded-full font-['IBM_Plex_Mono'] tabular-nums text-xs font-medium" style={{ background: '#00D4FF', color: '#000', fontSize: '12px' }}>
              {track.bpm}
            </span>
          </div>
        );

      case "key": {
        const keyColors: Record<string, string> = {
          C: '#e11d48', 'C#': '#f97316', D: '#eab308', 'D#': '#84cc16', E: '#22c55e', F: '#14b8a6',
          'F#': '#06b6d4', G: '#3b82f6', 'G#': '#8b5cf6', A: '#a855f7', 'A#': '#d946ef', B: '#ec4899',
          Cm: '#64748b', 'Cm#': '#475569', Dm: '#0ea5e9', 'Dm#': '#6366f1', Em: '#a855f7', Fm: '#d946ef',
          'Fm#': '#f43f5e', Gm: '#f97316', 'Gm#': '#eab308', Am: '#22c55e', 'Am#': '#14b8a6', Bm: '#06b6d4',
        };
        const keyBg = keyColors[track.key] ?? 'var(--cyan-2)';
        return (
          <div className="h-full flex items-center justify-center">
            <span
              className="px-2 py-0.5 rounded-full font-['IBM_Plex_Mono'] font-medium text-xs"
              style={{ background: keyBg, color: '#000', fontSize: '12px' }}
            >
              {track.key}
            </span>
          </div>
        );
      }

      case "time":
        return (
          <div className="h-full flex items-center justify-center">
            <span className="font-['IBM_Plex_Mono'] tabular-nums" style={{ color: 'var(--text-2)', fontSize: '13px' }}>
              {track.duration}
            </span>
          </div>
        );

      case "energy": {
        const energyMap: Record<string, number> = {
          "Chill": 1, "Deep": 2, "Steady": 2, "Groove": 3, "Building": 4,
          "Rising": 4, "Peak": 5, "Wild": 5, "Driving": 5, "Hard": 5,
          "Minimal": 2, "Ethereal": 3, "Dark": 3, "Melodic": 4
        };
        const energyValue = Math.min(5, Math.max(0, Math.round(((energyMap[track.energy] ?? 5) / 10) * 5)));
        return (
          <div className="h-full flex items-center px-2 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: i < energyValue ? '#00D4FF' : 'rgba(255, 255, 255, 0.15)',
                }}
              />
            ))}
          </div>
        );
      }

      case "version":
        return (
          <div className="h-full flex items-center justify-center">
            <span 
              className="px-2 py-1 rounded-full font-['IBM_Plex_Mono'] font-bold text-xs"
              style={{
                background: track.version === "A" ? 'var(--orange-2)' : track.version === "B" ? 'var(--cyan-2)' : 'rgba(255, 255, 255, 0.1)',
                color: track.version === "A" || track.version === "B" ? '#000' : 'var(--text-2)',
                fontSize: '12px',
              }}
            >
              {track.version}
            </span>
          </div>
        );

      case "actions":
        return (
          <div className="h-full flex items-center justify-center gap-2">
            {isHovered && (
              <>
                <button
                  className="transition-colors p-1.5 rounded hover:bg-white/5"
                  style={{ color: "var(--text-3)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--cyan)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-3)";
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTrackDetailTrack(track);
                  }}
                  aria-label="Track Detail"
                  title="Track Detail / Royalty"
                >
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  className="transition-colors p-1.5 rounded hover:bg-white/5"
                  style={{ color: 'var(--text-3)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-3)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalTrack(track);
                    setShareModalOpen(true);
                  }}
                  aria-label="Share"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  className="transition-colors p-1.5 rounded hover:bg-white/5"
                  style={{ color: 'var(--text-3)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-3)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalTrack(track);
                    setExportModalOpen(true);
                  }}
                  aria-label="Download"
                  title="Download"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  className="transition-colors p-1.5 rounded hover:bg-white/5"
                  style={{ color: 'var(--text-3)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#00E5FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-3)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info(`Extracting stems for ${track.title}...`);
                  }}
                  aria-label="Extract Stems"
                  title="Extract Stems"
                >
                  <Layers className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  className="transition-colors p-1.5 rounded hover:bg-red-500/10"
                  style={{ color: 'var(--text-3)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-3)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTracksToDelete([track.id]);
                    setDeleteConfirmOpen(true);
                  }}
                  aria-label="Delete"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
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
      "NOW PLAYING": "",
      "UP NEXT": "",
      "READY": "",
      "PLAYED": "",
    };

    return (
      <div
        className="inline-flex px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider font-['IBM_Plex_Mono'] rounded"
        style={{
          background: status === "NOW PLAYING" ? 'rgba(255, 122, 24, 0.1)' : status === "UP NEXT" ? 'transparent' : 'var(--panel)',
          color: status === "NOW PLAYING" ? 'var(--orange)' : status === "UP NEXT" ? 'var(--text-2)' : 'var(--text-3)',
          border: status === "NOW PLAYING" ? '1px solid var(--orange)' : status === "UP NEXT" ? '1px solid var(--border-strong)' : '1px solid var(--border)',
        }}
      >
        {status}
      </div>
    );
  };

  const visibleColumns = columns.filter((col) => col.visible);

  return (
      <div 
      className="h-full w-full min-w-0 flex flex-col"
      style={{ background: 'var(--bg-0)' }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {dragActive && (
        <div className="fixed inset-0 z-50 border-4 border-dashed flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(255, 122, 24, 0.2)', borderColor: 'var(--orange)' }}>
          <div className="text-center">
            <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--orange)' }} />
            <p className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Drop audio files here to upload</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-3)' }}>MP3, WAV, or FLAC (max 50MB)</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 backdrop-blur-xl flex-shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--panel-2)' }}>
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          {(["all", "generated", "dna", "uploaded"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer uppercase"
              style={{
                background: activeTab === tab ? 'var(--cyan-2)' : 'transparent',
                color: activeTab === tab ? '#000' : 'var(--text-2)',
                border: activeTab === tab ? 'none' : '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
            >
              {tab === "all" ? "ALL" : tab === "generated" ? "GENERATED" : tab === "dna" ? "DNA TRACKS" : "UPLOADED"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-shrink-0">
            <h1 className="text-xl font-semibold tracking-tight mb-1" style={{ fontSize: 'var(--font-size-xl)' }}>Generated Tracks Library</h1>
            <p className="text-xs" style={{ color: 'var(--text-3)', fontSize: 'var(--font-size-sm)' }}>
              {filteredTracks.length} tracks
              {selectedTracks.length > 0 && (
                <span className="ml-2" style={{ color: 'var(--orange)' }}>
                  • {selectedTracks.length} selected
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 min-w-0">
            {/* Upload Audio Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="h-9 px-4 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              style={{
                background: 'var(--cyan-2)',
                color: '#000',
              }}
              onMouseEnter={(e) => {
                if (!uploading) e.currentTarget.style.background = 'var(--cyan)';
              }}
              onMouseLeave={(e) => {
                if (!uploading) e.currentTarget.style.background = 'var(--cyan-2)';
              }}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Audio</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/flac,audio/x-flac"
              multiple
              onChange={(e) => {
                handleFileUpload(e.target.files);
                if (e.target) e.target.value = '';
              }}
              className="hidden"
            />
            {/* Upload Progress Bar */}
            {uploading && uploadProgress > 0 && (
              <div className="absolute top-full left-0 right-0 h-1 bg-white/10">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            {/* Favorites Only Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="h-9 px-4 border rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={{
                background: showFavoritesOnly ? 'rgba(255, 122, 24, 0.2)' : 'var(--panel)',
                borderColor: showFavoritesOnly ? 'var(--orange)' : 'var(--border)',
                color: showFavoritesOnly ? 'var(--orange)' : 'var(--text-2)',
              }}
              onMouseEnter={(e) => {
                if (!showFavoritesOnly) {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showFavoritesOnly) {
                  e.currentTarget.style.background = 'var(--panel)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
              aria-label={showFavoritesOnly ? "Show all tracks" : "Show favorites only"}
            >
              <Star 
                className="w-4 h-4"
                style={{
                  fill: showFavoritesOnly ? 'var(--orange)' : 'transparent',
                  color: showFavoritesOnly ? 'var(--orange)' : 'var(--text-3)',
                }}
                strokeWidth={showFavoritesOnly ? 0 : 1.5}
              />
              <span>Favorites Only</span>
            </button>

            {/* Energy Filter */}
            <div className="relative">
              <select
                value={selectedEnergy || ""}
                onChange={(e) => setSelectedEnergy(e.target.value || null)}
                className="h-9 pl-3 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
              >
                <option value="">All Energy</option>
                <option value="Rising">Rising</option>
                <option value="Building">Building</option>
                <option value="Peak">Peak</option>
                <option value="Chill">Chill</option>
                <option value="Groove">Groove</option>
                <option value="Steady">Steady</option>
                <option value="Deep">Deep</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortColumn ? `${sortColumn}-${sortDirection}` : "none"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-9 pl-3 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
              >
                <option value="none">Sort by...</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="bpm-asc">BPM (Low to High)</option>
                <option value="bpm-desc">BPM (High to Low)</option>
                <option value="time-asc">Duration (Short to Long)</option>
                <option value="time-desc">Duration (Long to Short)</option>
                <option value="energy-asc">Energy (A-Z)</option>
                <option value="energy-desc">Energy (Z-A)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="date-desc">Date (Newest First)</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-3)' }} />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 w-64 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--orange)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              />
            </div>

            {/* Advanced Search Toggle */}
            <button
              onClick={() => {
                // Toggle advanced search panel (would need state for this)
                toast.info("Advanced search panel - coming soon!");
              }}
              className="h-9 px-4 border rounded-lg text-sm transition-colors flex items-center gap-2"
              style={{
                background: 'var(--panel)',
                borderColor: 'var(--border)',
                color: 'var(--text-2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--panel)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <Filter className="w-4 h-4" />
              <span>Advanced</span>
            </button>

            {/* View mode: Table | Cards */}
            <div className="flex rounded-lg border border-white/10 overflow-hidden" style={{ background: "var(--panel)" }}>
              <button
                onClick={() => setViewMode("table")}
                className={`h-9 px-3 flex items-center gap-1.5 text-sm transition-colors ${viewMode === "table" ? "bg-white/10 text-white" : "text-white/60 hover:text-white/80"}`}
                title="Table view"
              >
                <List className="w-4 h-4" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`h-9 px-3 flex items-center gap-1.5 text-sm transition-colors ${viewMode === "cards" ? "bg-white/10 text-white" : "text-white/60 hover:text-white/80"}`}
                title="Card view with DNA badges"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Cards</span>
              </button>
            </div>

            {/* Columns – floating popover (table view) */}
            <Popover open={columnsPopoverOpen} onOpenChange={setColumnsPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="h-9 px-4 border rounded-lg text-sm transition-colors flex items-center gap-2"
                  style={{ background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
                >
                  <span>Columns</span>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-3)' }} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-52 p-2 rounded-lg border border-white/10 bg-[var(--panel)] shadow-xl z-[1000]"
                style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="py-1 max-h-80 overflow-y-auto">
                  {columns.map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5 text-sm"
                      style={{ color: 'var(--text-2)' }}
                    >
                      <Checkbox
                        checked={col.visible}
                        onCheckedChange={() => toggleColumn(col.id)}
                      />
                      <span className="font-['IBM_Plex_Mono'] text-xs uppercase">{col.label || col.id}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Stats Summary Bar */}
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4 text-xs font-['IBM_Plex_Mono']" style={{ color: 'var(--text-3)' }}>
            <span style={{ color: 'var(--text-2)' }}>{statsSummary.total} total</span>
            <span>•</span>
            <span>{statsSummary.favorited} favorited</span>
            <span>•</span>
            <span>Avg BPM: {statsSummary.avgBPM}</span>
            <span>•</span>
            <span>Most played: {statsSummary.mostPlayed}</span>
          </div>
        </div>
        
        {/* Keyboard shortcuts hint - only show when tracks are selected */}
        {selectedTracks.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-4 text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
              <span>Space: Play</span>
              <span>Enter: Add to Mix</span>
              <span>⌘C: Copy Link</span>
              <span>⌘E: Export</span>
              <span>Del: Delete</span>
            </div>
          </div>
        )}
      </div>

      {!activeDNA && (
        <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-3)' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
              <span>Activate your DNA to see personalized track recommendations.</span>
            </div>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {selectedTracks.length > 0 && (
        <div className="border-b border-white/5 px-6 py-3 bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white font-['IBM_Plex_Mono']">
              {selectedTracks.length} {selectedTracks.length === 1 ? "track" : "tracks"} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkFavorite}
              className="h-8 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--panel)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Favorite</span>
            </button>
            <button
              onClick={handleBulkAddToMix}
              className="h-8 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--panel)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Mix</span>
            </button>
            <button
              onClick={handleExportMix}
              className="h-8 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--panel)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Playlist</span>
            </button>
            <button
              onClick={() => setExportSettingsOpen(true)}
              className="h-8 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--panel)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={handleBulkShare}
              className="h-8 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--panel)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="h-8 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedTracks([])}
              className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors"
              aria-label="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Table or Cards Container with Details Panel */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex overflow-hidden min-h-0">
          {viewMode === "cards" ? (
            /* Cards view – scrollable grid, 5–6 per row */
            <div className="flex-1 min-w-0 min-h-0 overflow-y-auto p-6" style={{ overflowY: 'auto' }}>
              <TrackList
                tracks={sortedTracks.map((t) => mapLibraryTrackToDisplayTrack(t, favoriteTracks.has(t.id)))}
                playingTrackId={playingTrackId}
                onPlay={(track) => handlePlay(track.id)}
                onFavorite={(track) => toggleFavorite(track.id)}
                onShowDetail={(track) => setTrackDetailTrack(tracks.find((t) => t.id === track.id) ?? null)}
                onTitleChange={handleTrackTitleChange}
                onArtistChange={handleTrackArtistChange}
              />
            </div>
          ) : (
          /* Table - Scrollable */
          <div className={`flex-1 min-w-0 overflow-auto ${selectedTracks.length === 1 ? 'mr-80' : ''} transition-all duration-300`}>
          <table className="w-full border-collapse">
            {/* Sticky Header */}
            <thead className="sticky top-0 z-10" style={{ background: '#0d0d0d', borderBottom: '1px solid var(--border)' }}>
              <tr style={{ height: `${ROW_HEIGHT}px` }}>
                {visibleColumns.map((column, index) => {
                  const isSortable = column.id === "title" || column.id === "bpm" || column.id === "time" || column.id === "energy";
                  const sortKey = column.id === "time" ? "time" : column.id === "title" ? "title" : column.id === "bpm" ? "bpm" : column.id === "energy" ? "energy" : null;
                  const isSorted = sortColumn === sortKey;
                  
                  return (
                    <DraggableColumnHeader
                      key={column.id}
                      column={column}
                      index={index}
                      moveColumn={moveColumn}
                      onResizeStart={handleResizeStart}
                      isSorted={isSorted}
                      sortDirection={sortDirection}
                      onSort={() => {
                        if (isSortable && sortKey) {
                          handleSort(sortKey);
                        }
                      }}
                      onToggleVisibility={toggleColumnVisibility}
                    />
                  );
                })}
              </tr>
            </thead>

          {/* Table Body */}
          <tbody>
            {sortedTracks.map((track, index) => {
              const isSelected = selectedTracks.includes(track.id);
              const isPlaying = playingTrackId === track.id;
              
              return (
                <ContextMenu key={track.id}>
                  <ContextMenuTrigger asChild>
                    <tr
                      className="transition-colors cursor-pointer"
                      style={{ 
                        height: `${ROW_HEIGHT}px`,
                        background: isSelected ? '#1a1a1a' : (hoveredRow === track.id ? '#1a1a1a' : index % 2 === 0 ? '#111' : '#141414'),
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        borderLeft: (isPlaying || (hoveredRow === track.id)) ? '2px solid #00D4FF' : undefined,
                      }}
                      onMouseEnter={() => {
                        setHoveredRow(track.id);
                      }}
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
                          className="last:border-r-0 overflow-hidden"
                          style={{ 
                            borderRight: '1px solid var(--border)',
                            width: `${column.width}px`, 
                            minWidth: `${column.minWidth}px`, 
                            height: `${ROW_HEIGHT}px` 
                          }}
                        >
                          {renderCell(column, track, hoveredRow === track.id)}
                        </td>
                      ))}
                    </tr>
                  </ContextMenuTrigger>
                  
                  {/* Context Menu */}
                  <ContextMenuContent className="w-56 bg-[#18181b] border-white/10">
                    <ContextMenuItem onClick={() => setTrackDetailTrack(track)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Track Detail / Royalty
                    </ContextMenuItem>
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
        </div>
          )}

        {/* Track Details Panel (table view only) */}
        {viewMode === "table" && selectedTracks.length === 1 && (() => {
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
                {/* Album Artwork */}
                {selectedTrack.artwork ? (
                  <div className="relative group">
                    <img
                      src={selectedTrack.artwork}
                      alt={`${selectedTrack.title} artwork`}
                      className="w-full aspect-square object-cover rounded-xl border border-white/10"
                    />
                    <button
                      onClick={() => {
                        // Regenerate artwork
                        const newArtwork = generateAlbumArtwork(
                          selectedTrack.title,
                          selectedTrack.bpm,
                          selectedTrack.key,
                          selectedTrack.energy,
                          selectedTrack.version
                        );
                        const updatedTracks = tracks.map(t =>
                          t.id === selectedTrack.id ? { ...t, artwork: newArtwork } : t
                        );
                        setTracks(updatedTracks);
                        localStorage.setItem('libraryTracks', JSON.stringify(updatedTracks));
                        toast.success("Artwork regenerated!");
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/80 hover:bg-black/90 rounded-lg border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-white/10 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/30" />
                    <button
                      onClick={() => {
                        // Generate artwork
                        const newArtwork = generateAlbumArtwork(
                          selectedTrack.title,
                          selectedTrack.bpm,
                          selectedTrack.key,
                          selectedTrack.energy,
                          selectedTrack.version
                        );
                        const updatedTracks = tracks.map(t =>
                          t.id === selectedTrack.id ? { ...t, artwork: newArtwork } : t
                        );
                        setTracks(updatedTracks);
                        localStorage.setItem('libraryTracks', JSON.stringify(updatedTracks));
                        toast.success("Artwork generated!");
                      }}
                      className="absolute inset-0 flex items-center justify-center text-white/60 hover:text-white transition-colors text-sm"
                    >
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <span>Generate Artwork</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Title & Artist */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1 truncate" title={selectedTrack.title}>
                    {selectedTrack.title}
                  </h3>
                  <p className="text-sm text-white/60 truncate" title={selectedTrack.artist}>
                    {selectedTrack.artist}
                  </p>
                </div>

                {/* Playback Controls */}
                <div className="space-y-3">
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => {
                      setDetailsPanelPlaying(!detailsPanelPlaying);
                      if (!detailsPanelPlaying) {
                        setPlayingTrackId(selectedTrack.id);
                        // Track playback history
                        trackPlaybackHistory(selectedTrack.id, selectedTrack.duration);
                      }
                    }}
                    className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-medium transition-all bg-gradient-to-r from-primary to-primary/80 border border-primary/60 text-white shadow-primary/30 hover:shadow-primary/50"
                  >
                    {detailsPanelPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Play</span>
                      </>
                    )}
                  </button>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{
                          width: `${(() => {
                            const parseDuration = (duration: string): number => {
                              const parts = duration.split(":");
                              return parseInt(parts[0]) * 60 + parseInt(parts[1] || "0");
                            };
                            const totalSeconds = parseDuration(selectedTrack.duration);
                            return totalSeconds > 0 ? (currentTime / totalSeconds) * 100 : 0;
                          })()}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/50 font-['IBM_Plex_Mono']">
                      <span>
                        {(() => {
                          const minutes = Math.floor(currentTime / 60);
                          const seconds = Math.floor(currentTime % 60);
                          return `${minutes}:${seconds.toString().padStart(2, "0")}`;
                        })()}
                      </span>
                      <span>{selectedTrack.duration}</span>
                    </div>
                  </div>
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
      </DndProvider>
      
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

      {/* Track Detail – slide-out panel with large artwork, controls, royalty, Generate more like this */}
      <Sheet open={!!trackDetailTrack} onOpenChange={(open) => !open && setTrackDetailTrack(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col gap-0 border-l border-white/10 bg-[var(--panel)] text-[var(--text)] overflow-y-auto"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Track Detail</SheetTitle>
          </SheetHeader>
          {trackDetailTrack && (
            <div className="flex flex-col gap-6 pt-2">
              {/* Large artwork with New Image overlay */}
              <div className="relative w-full aspect-square max-w-[300px] mx-auto rounded-xl overflow-hidden bg-white/5">
                {trackDetailTrack.artwork ? (
                  <img src={trackDetailTrack.artwork} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="w-16 h-16 text-white/30" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setRegenerateImageTrack(trackDetailTrack);
                    setRegenerateImageDescription("");
                    setRegenerateImageOpen(true);
                  }}
                  className="absolute bottom-2 right-2 py-1.5 px-2.5 rounded-lg bg-black/60 text-white text-xs font-medium flex items-center gap-1 hover:bg-black/80 transition-colors"
                >
                  🎨 New Image
                </button>
              </div>
              {/* Editable title & artist */}
              <div>
                {editingCell?.trackId === trackDetailTrack.id && editingCell?.field === 'title' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                    autoFocus
                    className="w-full text-xl font-semibold bg-white/10 border border-white/20 rounded px-2 py-1 text-white outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-white truncate flex-1">{trackDetailTrack.title || 'Untitled'}</h2>
                    <button type="button" onClick={() => startEditing(trackDetailTrack.id, 'title', trackDetailTrack.title)} className="p-1 rounded text-white/40 hover:text-white/80" aria-label="Edit title">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {editingCell?.trackId === trackDetailTrack.id && editingCell?.field === 'artist' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                    autoFocus
                    className="w-full mt-1 text-sm bg-white/10 border border-white/20 rounded px-2 py-1 text-white/80 outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm text-white/60 truncate flex-1">{trackDetailTrack.artist || 'Unknown'}</p>
                    <button type="button" onClick={() => startEditing(trackDetailTrack.id, 'artist', trackDetailTrack.artist)} className="p-1 rounded text-white/40 hover:text-white/80" aria-label="Edit artist">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-white/50 mt-1">{trackDetailTrack.bpm} BPM · {trackDetailTrack.key} · {trackDetailTrack.duration}</p>
              </div>
              {/* Full controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    handlePlay(trackDetailTrack.id);
                  }}
                  className="h-12 w-12 rounded-full bg-[var(--cyan-2)] text-black flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  {playingTrackId === trackDetailTrack.id ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 fill-black ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => toggleFavorite(trackDetailTrack.id)}
                  className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                    favoriteTracks.has(trackDetailTrack.id) ? "text-orange-400 bg-orange-500/20" : "text-white/70 hover:text-white bg-white/5"
                  }`}
                >
                  <Star className={`w-6 h-6 ${favoriteTracks.has(trackDetailTrack.id) ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={() => {
                    setModalTrack(trackDetailTrack);
                    setShareModalOpen(true);
                  }}
                  className="h-12 w-12 rounded-full bg-white/5 text-white/80 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setModalTrack(trackDetailTrack);
                    setExportModalOpen(true);
                  }}
                  className="h-12 w-12 rounded-full bg-white/5 text-white/80 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
              {/* PROMPT USED */}
              <div>
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">PROMPT USED</p>
                <div className="rounded-lg p-3 bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 italic whitespace-pre-wrap break-words">
                    {trackDetailTrack.promptUsed?.trim() || "No prompt recorded for this track."}
                  </p>
                </div>
              </div>
              {/* ROYALTY SPLIT */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">ROYALTY SPLIT</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Creator</span>
                    <span className="text-white font-medium">{trackDetailTrack.royaltySplit?.creator ?? 40}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">DNA Artist</span>
                    <span className="text-white font-medium">{trackDetailTrack.royaltySplit?.dnaArtist ?? 40}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Platform</span>
                    <span className="text-white font-medium">{trackDetailTrack.royaltySplit?.platform ?? 20}%</span>
                  </div>
                </div>
              </div>
              {/* Generate more like this */}
              {onNavigate && (
                <button
                  onClick={() => {
                    onNavigate("create-track-modern");
                    setTrackDetailTrack(null);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--orange)] to-[var(--orange-2)] text-black font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate more like this
                </button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Regenerate Cover Art Dialog */}
      <Dialog
        open={regenerateImageOpen}
        onOpenChange={(open) => {
          setRegenerateImageOpen(open);
          if (!open) {
            setRegenerateImageDescription("");
            setRegenerateImageTrack(null);
          }
        }}
      >
        <DialogContent className="max-w-md" style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold">Regenerate Cover Art</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              Costs 2 credits
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              placeholder="Describe the image you want..."
              value={regenerateImageDescription}
              onChange={(e) => setRegenerateImageDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-[var(--cyan-2)] resize-none"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => {
                setRegenerateImageOpen(false);
                setRegenerateImageTrack(null);
                setRegenerateImageDescription("");
              }}
              className="h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRegenerateImage}
              className="h-9 px-4 rounded-lg bg-[var(--cyan-2)] hover:opacity-90 text-black text-sm font-medium flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Image (2 credits)
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Settings Dialog */}
      <Dialog open={exportSettingsOpen} onOpenChange={setExportSettingsOpen}>
        <DialogContent className="max-w-md" style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold mb-2">
              Export Settings
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm mb-4">
              Choose export format and metadata options
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Export Format</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="json"
                    checked={exportFormat === "json"}
                    onChange={(e) => setExportFormat(e.target.value as "json" | "csv" | "m3u")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-white/80">JSON</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="csv"
                    checked={exportFormat === "csv"}
                    onChange={(e) => setExportFormat(e.target.value as "json" | "csv" | "m3u")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-white/80">CSV</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="m3u"
                    checked={exportFormat === "m3u"}
                    onChange={(e) => setExportFormat(e.target.value as "json" | "csv" | "m3u")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-white/80">M3U Playlist</span>
                </label>
              </div>
            </div>
            
            {/* Metadata Options (only for JSON and CSV) */}
            {exportFormat !== "m3u" && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Include Metadata</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeMetadata.bpm}
                      onCheckedChange={(checked) => setIncludeMetadata(prev => ({ ...prev, bpm: checked as boolean }))}
                    />
                    <span className="text-sm text-white/80">BPM</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeMetadata.key}
                      onCheckedChange={(checked) => setIncludeMetadata(prev => ({ ...prev, key: checked as boolean }))}
                    />
                    <span className="text-sm text-white/80">Key</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeMetadata.energy}
                      onCheckedChange={(checked) => setIncludeMetadata(prev => ({ ...prev, energy: checked as boolean }))}
                    />
                    <span className="text-sm text-white/80">Energy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeMetadata.duration}
                      onCheckedChange={(checked) => setIncludeMetadata(prev => ({ ...prev, duration: checked as boolean }))}
                    />
                    <span className="text-sm text-white/80">Duration</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeMetadata.dateAdded}
                      onCheckedChange={(checked) => setIncludeMetadata(prev => ({ ...prev, dateAdded: checked as boolean }))}
                    />
                    <span className="text-sm text-white/80">Date Added</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <button
              onClick={() => setExportSettingsOpen(false)}
              className="h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleBulkExport();
                setExportSettingsOpen(false);
              }}
              className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-medium transition-colors"
            >
              Export {selectedTracks.length > 0 ? `${selectedTracks.length} ` : ""}Track{selectedTracks.length !== 1 ? "s" : ""}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}