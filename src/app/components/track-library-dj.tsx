import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, Search, Share2, Download, ChevronDown, ChevronUp, Music2, Trash2, Copy, FileDown, PlayCircle, Plus, Edit3, Files, X, Star, Filter, Sparkles, CheckSquare, Square } from "lucide-react";
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

// Column definition - SIMPLIFIED to requirements
type ColumnId = "checkbox" | "play" | "favorite" | "artwork" | "title" | "artist" | "bpm" | "key" | "time" | "energy" | "version" | "actions";

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
  tags?: string[];
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

// FIXED ROW HEIGHT
const ROW_HEIGHT = 40;

// Default columns (as specified)
const DEFAULT_COLUMNS: Column[] = [
  { id: "checkbox", label: "", width: 40, minWidth: 40, align: "center", visible: true },
  { id: "play", label: "", width: 40, minWidth: 40, align: "center", visible: true },
  { id: "favorite", label: "", width: 40, minWidth: 40, align: "center", visible: true },
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

  // Favorite tracks state
  const [favoriteTracks, setFavoriteTracks] = useState<Set<string>>(new Set());
  
  // Favorites filter toggle
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Energy filter
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<"title" | "bpm" | "time" | "energy" | "date" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Active DNA state
  const [activeDNA, setActiveDNA] = useState<ActiveDNAProfile | null>(null);

  // Load tracks and favorites from localStorage on component mount
  useEffect(() => {
    try {
      // Read "libraryTracks" from localStorage
      const libraryTracksStr = localStorage.getItem('libraryTracks');
      
      if (libraryTracksStr) {
        // Parse the stored tracks
        const savedTracks = JSON.parse(libraryTracksStr);
        
        // Merge saved tracks with MOCK_TRACKS
        const mergedTracks = [...MOCK_TRACKS, ...savedTracks];
        
        // Update the tracks state
        setTracks(mergedTracks);
      } else {
        // If no saved tracks, just use MOCK_TRACKS (already set as initial state)
        setTracks(MOCK_TRACKS);
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

  // Filter tracks by search, favorites, and energy
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
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
  }, [tracks, showFavoritesOnly, favoriteTracks, selectedEnergy, searchQuery]);

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
                <CheckSquare className="w-4 h-4 text-primary" fill="currentColor" />
              ) : (
                <Square className="w-4 h-4 text-white/30" />
              )}
            </button>
          </div>
        );

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

      case "favorite":
        const isFavorited = favoriteTracks.has(track.id);
        return (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(track.id);
              }}
              className="hover:text-primary transition-colors"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star 
                className={`w-4 h-4 ${isFavorited ? "fill-primary text-primary" : "text-white/30"}`}
                strokeWidth={isFavorited ? 0 : 1.5}
              />
            </button>
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
                  className="text-white/50 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportJSON(track);
                  }}
                  aria-label="Export as JSON"
                >
                  <FileDown className="w-3.5 h-3.5" strokeWidth={1.5} />
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
            {/* Favorites Only Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`h-9 px-4 bg-white/5 border rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showFavoritesOnly
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-white/10 text-white/80 hover:bg-white/10"
              }`}
              aria-label={showFavoritesOnly ? "Show all tracks" : "Show favorites only"}
            >
              <Star 
                className={`w-4 h-4 ${showFavoritesOnly ? "fill-primary text-primary" : "text-white/60"}`}
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 w-64 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Advanced Search Toggle */}
            <button
              onClick={() => {
                // Toggle advanced search panel (would need state for this)
                toast.info("Advanced search panel - coming soon!");
              }}
              className="h-9 px-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Advanced</span>
            </button>

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
        
        {/* Stats Summary Bar */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-4 text-xs text-white/60 font-['IBM_Plex_Mono']">
            <span className="text-white/80">{statsSummary.total} total</span>
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

      {/* Recommended Tracks Section */}
      {activeDNA && recommendedTracks.length > 0 && (
        <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['IBM_Plex_Mono']">
                Recommended for You
              </h2>
              <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                Based on {activeDNA.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {recommendedTracks.map((track) => (
              <div
                key={track.id}
                className="flex-shrink-0 w-64 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{track.title}</h3>
                    <p className="text-xs text-white/50 truncate">{track.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-xs text-white/40 font-['IBM_Plex_Mono']">
                  <span>{track.bpm} BPM</span>
                  <span>•</span>
                  <span>{track.key}</span>
                  <span>•</span>
                  <span>{track.duration}</span>
                </div>
                <button
                  onClick={() => {
                    // Add track to a mix - for now, show a toast
                    // In the future, this could open a mix selector or create a new mix
                    toast.success(`"${track.title}" added to mix queue`);
                  }}
                  className="w-full h-8 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to Mix</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeDNA && recommendedTracks.length === 0 && (
        <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>No tracks match your active DNA profile. Try adding more tracks to your library.</span>
          </div>
        </div>
      )}

      {!activeDNA && (
        <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Sparkles className="w-4 h-4" />
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
              className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5" />
              <span>Favorite</span>
            </button>
            <button
              onClick={handleBulkAddToMix}
              className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Mix</span>
            </button>
            <button
              onClick={handleExportMix}
              className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Playlist</span>
            </button>
            <button
              onClick={() => setExportSettingsOpen(true)}
              className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={handleBulkShare}
              className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
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

      {/* Table Container with Details Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table - Scrollable */}
        <div className={`flex-1 overflow-auto ${selectedTracks.length === 1 ? 'mr-80' : ''} transition-all duration-300`}>
        <table className="w-full border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-10 bg-[#0f0f14] border-b border-white/10">
            <tr style={{ height: `${ROW_HEIGHT}px` }}>
              {visibleColumns.map((column) => {
                const isSortable = column.id === "title" || column.id === "bpm" || column.id === "time" || column.id === "energy";
                const sortKey = column.id === "time" ? "time" : column.id === "title" ? "title" : column.id === "bpm" ? "bpm" : column.id === "energy" ? "energy" : null;
                const isSorted = sortColumn === sortKey;
                const allSelected = sortedTracks.length > 0 && selectedTracks.length === sortedTracks.length;
                const someSelected = selectedTracks.length > 0 && selectedTracks.length < sortedTracks.length;
                
                if (column.id === "checkbox") {
                  return (
                    <th
                      key={column.id}
                      className="px-3 text-center border-r border-white/5"
                      style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectAll();
                        }}
                        className="w-4 h-4 flex items-center justify-center"
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
                  key={column.id}
                  className={`px-3 text-left border-r border-white/5 last:border-r-0 ${
                    column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""
                    } ${isSortable ? "cursor-pointer hover:bg-white/5 transition-colors" : ""}`}
                  style={{ width: `${column.width}px`, minWidth: `${column.minWidth}px` }}
                    onClick={() => isSortable && sortKey && handleSort(sortKey)}
                >
                    <div className={`flex items-center gap-1.5 ${column.align === "center" ? "justify-center" : column.align === "right" ? "justify-end" : ""}`}>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-['IBM_Plex_Mono'] font-medium">
                    {column.label}
                  </span>
                      {isSortable && isSorted && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3 text-primary" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-primary" />
                        )
                      )}
                    </div>
                </th>
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
      
      {/* Export Settings Dialog */}
      <Dialog open={exportSettingsOpen} onOpenChange={setExportSettingsOpen}>
        <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-md">
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