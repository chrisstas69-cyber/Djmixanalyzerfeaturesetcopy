import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Play, Pause, Search, Zap, Music2, GripVertical, CheckSquare, Square, ChevronDown, ChevronUp, Loader2, TrendingUp, Key, Upload, X } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { AudioPlayer } from "./audio-player";

// Column definition - matching Track Library
type ColumnId = "checkbox" | "play" | "artwork" | "title" | "artist" | "album" | "label" | "bpm" | "key" | "time" | "energy" | "dateAdded" | "actions";

interface Column {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  align: "left" | "center" | "right";
  visible: boolean;
}

interface AudioAnalysis {
  bpm: number;
  bpmConfidence: number;
  key: string;
  keyConfidence: number;
  energy: "Rising" | "Building" | "Peak" | "Chill" | "Groove" | "Steady";
  energyLevel: number;
  duration: number;
  mood?: string;
  harmonics?: {
    dominant: string[];
    compatibility: string[];
  };
  dnaProfile?: {
    bpm: number;
    key: string;
    energy: string;
    mood: string;
    brightness: number;
    dynamics: number;
  };
}

interface AudioFile {
  id: string;
  name: string;
  size: number;
  type: string;
  duration: number;
  data: string;
  uploadedAt: string;
  bpm?: number;
  key?: string;
  energy?: string;
  analysis?: AudioAnalysis;
  artwork?: string;
  artist?: string;
  album?: string;
  label?: string;
  title?: string;
}

const ROW_HEIGHT = 40;
const ITEM_TYPE = "COLUMN";

// Default columns - matching Track Library style
const DEFAULT_COLUMNS: Column[] = [
  { id: "checkbox", label: "", width: 40, minWidth: 40, align: "center", visible: true },
  { id: "play", label: "", width: 40, minWidth: 40, align: "center", visible: true },
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
  { id: "actions", label: "ACTIONS", width: 120, minWidth: 80, align: "center", visible: true },
];

// Mock detection functions
const detectBPM = async (audioData: string): Promise<{ bpm: number; confidence: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const bpm = Math.floor(Math.random() * 100) + 80;
  const confidence = Math.floor(Math.random() * 30) + 70;
  return { bpm, confidence };
};

const detectKey = async (audioData: string): Promise<{ key: string; confidence: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const modes = ["m", ""];
  const key = keys[Math.floor(Math.random() * keys.length)] + modes[Math.floor(Math.random() * modes.length)];
  const confidence = Math.floor(Math.random() * 25) + 75;
  return { key, confidence };
};

const detectEnergy = async (audioData: string, duration: number): Promise<{ energy: string; level: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const energies: Array<"Rising" | "Building" | "Peak" | "Chill" | "Groove" | "Steady"> = 
    ["Rising", "Building", "Peak", "Chill", "Groove", "Steady"];
  const energy = energies[Math.floor(Math.random() * energies.length)];
  const level = Math.floor(Math.random() * 40) + 60;
  return { energy, level };
};

const detectMood = async (audioData: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const moods = ["Happy", "Dark", "Melancholic", "Energetic", "Chill", "Aggressive", "Melodic"];
  return moods[Math.floor(Math.random() * moods.length)];
};

const analyzeHarmonics = async (audioData: string, detectedKey: string): Promise<{ dominant: string[]; compatibility: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const allKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const keyIndex = allKeys.findIndex(k => detectedKey.startsWith(k));
  const compatible = [
    allKeys[keyIndex],
    allKeys[(keyIndex + 7) % 12],
    allKeys[(keyIndex + 5) % 12],
  ];
  return {
    dominant: [detectedKey],
    compatibility: compatible,
  };
};

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
      {column.id !== "checkbox" && column.id !== "play" && column.id !== "favorite" && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-20"
          onMouseDown={(e) => onResizeStart(column.id, e)}
        />
      )}
    </th>
  );
}

export function AudioAnalysisPanel() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [manualBPM, setManualBPM] = useState<number | null>(null);
  const [manualKey, setManualKey] = useState<string>("");
  const [playingFileId, setPlayingFileId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<"title" | "bpm" | "time" | "energy" | "dateAdded" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [resizingColumn, setResizingColumn] = useState<ColumnId | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Load files from localStorage
  useEffect(() => {
    const loadFiles = () => {
      try {
        const stored = localStorage.getItem('uploadedAudioFiles');
        if (stored) {
          const loaded = JSON.parse(stored);
          setFiles(loaded);
        }
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };

    loadFiles();
    // Listen for storage changes (when files are uploaded)
    window.addEventListener('storage', loadFiles);
    // Also check periodically in case of same-tab updates
    const interval = setInterval(loadFiles, 1000);
    
    return () => {
      window.removeEventListener('storage', loadFiles);
      clearInterval(interval);
    };
  }, []);

  // Load column configuration
  useEffect(() => {
    try {
      const saved = localStorage.getItem('audioAnalysisColumns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setColumns(parsed);
        }
      }
    } catch (e) {
      // Use defaults
    }
  }, []);

  // Save column configuration
  useEffect(() => {
    localStorage.setItem('audioAnalysisColumns', JSON.stringify(columns));
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

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = [...files];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          (file.title || file.name).toLowerCase().includes(query) ||
          (file.artist || "").toLowerCase().includes(query) ||
          (file.album || "").toLowerCase().includes(query) ||
          (file.label || "").toLowerCase().includes(query) ||
          file.bpm?.toString().includes(query) ||
          (file.key || "").toLowerCase().includes(query) ||
          (file.energy || "").toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (sortColumn) {
          case "title":
            comparison = (a.title || a.name).localeCompare(b.title || b.name);
            break;
          case "bpm":
            comparison = (a.bpm || a.analysis?.bpm || 0) - (b.bpm || b.analysis?.bpm || 0);
            break;
          case "time":
            comparison = (a.duration || 0) - (b.duration || 0);
            break;
          case "energy":
            comparison = (a.energy || a.analysis?.energy || "").localeCompare(b.energy || b.analysis?.energy || "");
            break;
          case "dateAdded":
            comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
            break;
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [files, searchQuery, sortColumn, sortDirection]);

  const handleSort = (column: "title" | "bpm" | "time" | "energy" | "dateAdded") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredAndSortedFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredAndSortedFiles.map((f) => f.id));
    }
  };

  const handlePlay = (fileId: string) => {
    if (playingFileId === fileId) {
      setPlayingFileId(null);
    } else {
      setPlayingFileId(fileId);
      const file = files.find((f) => f.id === fileId);
      if (file) {
        setSelectedFile(file);
        if (file.analysis) {
          setAnalysis(file.analysis);
          setManualBPM(file.analysis.bpm);
          setManualKey(file.analysis.key);
        } else {
          setAnalysis(null);
          setManualBPM(null);
          setManualKey("");
        }
      }
    }
  };

  const handleFileSelect = (file: AudioFile) => {
    setSelectedFile(file);
    if (file.analysis) {
      setAnalysis(file.analysis);
      setManualBPM(file.analysis.bpm);
      setManualKey(file.analysis.key);
    } else {
      setAnalysis(null);
      setManualBPM(null);
      setManualKey("");
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    try {
      const [bpmResult, keyResult, energyResult, moodResult, harmonicsResult] = await Promise.all([
        detectBPM(selectedFile.data),
        detectKey(selectedFile.data),
        detectEnergy(selectedFile.data, selectedFile.duration),
        detectMood(selectedFile.data),
        detectKey(selectedFile.data).then(key => analyzeHarmonics(selectedFile.data, key.key)),
      ]);

      const detectedKey = manualKey || keyResult.key;
      const detectedBPM = manualBPM || bpmResult.bpm;

      const newAnalysis: AudioAnalysis = {
        bpm: detectedBPM,
        bpmConfidence: manualBPM ? 100 : bpmResult.confidence,
        key: detectedKey,
        keyConfidence: manualKey ? 100 : keyResult.confidence,
        energy: energyResult.energy as any,
        energyLevel: energyResult.level,
        duration: selectedFile.duration,
        mood: moodResult,
        harmonics: harmonicsResult,
        dnaProfile: {
          bpm: detectedBPM,
          key: detectedKey,
          energy: energyResult.energy,
          mood: moodResult,
          brightness: Math.floor(Math.random() * 40) + 60,
          dynamics: Math.floor(Math.random() * 40) + 60,
        },
      };

      setAnalysis(newAnalysis);

      // Save analysis to file
      const updatedFiles = files.map(f =>
        f.id === selectedFile.id ? { ...f, analysis: newAnalysis, bpm: detectedBPM, key: detectedKey, energy: energyResult.energy } : f
      );
      setFiles(updatedFiles);
      localStorage.setItem('uploadedAudioFiles', JSON.stringify(updatedFiles));

      toast.success("Analysis complete!");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const modes = ["", "m"];

  const visibleColumns = columns.filter((col) => col.visible);
  const allSelected = selectedFiles.length === filteredAndSortedFiles.length && filteredAndSortedFiles.length > 0;
  const someSelected = selectedFiles.length > 0 && selectedFiles.length < filteredAndSortedFiles.length;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">Audio Analysis</h1>
            <p className="text-xs text-white/40">
              {filteredAndSortedFiles.length} files
              {selectedFiles.length > 0 && (
                <span className="ml-2 text-primary">
                  • {selectedFiles.length} selected
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
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 w-64 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex overflow-hidden">
          <div className={`flex-1 overflow-auto ${selectedFile ? 'mr-96' : ''} transition-all duration-300`}>
            {filteredAndSortedFiles.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 mb-2">
                    {searchQuery ? "No files match your search" : "No audio files uploaded"}
                  </p>
                  <p className="text-sm text-white/40">
                    Go to "Upload Audio" to upload files first
                  </p>
                </div>
              </div>
            ) : (
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
                  {filteredAndSortedFiles.map((file, index) => {
                    const isPlaying = playingFileId === file.id;
                    const isSelected = selectedFiles.includes(file.id);
                    const isHovered = hoveredRow === file.id;
                    const fileBPM = file.bpm || file.analysis?.bpm;
                    const fileKey = file.key || file.analysis?.key;
                    const fileEnergy = file.energy || file.analysis?.energy;

                    return (
                      <tr
                        key={file.id}
                        onMouseEnter={() => setHoveredRow(file.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => handleFileSelect(file)}
                        className={`border-b border-white/5 transition-colors cursor-pointer ${
                          selectedFile?.id === file.id ? "bg-primary/10" : isSelected ? "bg-primary/5" : isHovered ? "bg-white/5" : ""
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
                                    toggleFileSelection(file.id);
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
                                    handlePlay(file.id);
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

                          if (column.id === "artwork") {
                            return (
                              <td key={column.id} className="px-3 text-center border-r border-white/5">
                                <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden shadow-sm">
                                  {file.artwork ? (
                                    <img src={file.artwork} alt="" className="w-full h-full object-cover" />
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
                                  <span className="text-sm text-white truncate">{file.title || file.name}</span>
                                </div>
                              </td>
                            );
                          }

                          if (column.id === "artist") {
                            return (
                              <td key={column.id} className="px-3 border-r border-white/5">
                                <div className="h-full flex items-center truncate">
                                  <span className="text-sm text-white/70 truncate">{file.artist || "Unknown Artist"}</span>
                                </div>
                              </td>
                            );
                          }

                          if (column.id === "album") {
                            return (
                              <td key={column.id} className="px-3 border-r border-white/5">
                                <div className="h-full flex items-center truncate">
                                  <span className="text-sm text-white/60 truncate">{file.album || "-"}</span>
                                </div>
                              </td>
                            );
                          }

                          if (column.id === "label") {
                            return (
                              <td key={column.id} className="px-3 border-r border-white/5">
                                <div className="h-full flex items-center truncate">
                                  <span className="text-sm text-white/60 truncate">{file.label || "-"}</span>
                                </div>
                              </td>
                            );
                          }

                          if (column.id === "bpm") {
                            return (
                              <td key={column.id} className="px-3 text-center border-r border-white/5">
                                <span className="text-sm text-white/70 font-['IBM_Plex_Mono'] tabular-nums">
                                  {fileBPM || (file.analysis ? "-" : "?")}
                                </span>
                              </td>
                            );
                          }

                          if (column.id === "key") {
                            return (
                              <td key={column.id} className="px-3 text-center border-r border-white/5">
                                <span className="text-sm text-white/70 font-['IBM_Plex_Mono']">{fileKey || (file.analysis ? "-" : "?")}</span>
                              </td>
                            );
                          }

                          if (column.id === "time") {
                            return (
                              <td key={column.id} className="px-3 text-center border-r border-white/5">
                                <span className="text-sm text-white/60 font-['IBM_Plex_Mono'] tabular-nums">
                                  {formatDuration(file.duration)}
                                </span>
                              </td>
                            );
                          }

                          if (column.id === "energy") {
                            return (
                              <td key={column.id} className="px-3 border-r border-white/5">
                                <span className="text-xs text-white/60 truncate">{fileEnergy || (file.analysis ? "-" : "?")}</span>
                              </td>
                            );
                          }

                          if (column.id === "dateAdded") {
                            return (
                              <td key={column.id} className="px-3 text-center border-r border-white/5">
                                <span className="text-sm text-white/60 font-['IBM_Plex_Mono']">
                                  {formatDate(file.uploadedAt)}
                                </span>
                              </td>
                            );
                          }

                          if (column.id === "actions") {
                            return (
                              <td key={column.id} className="px-3 text-center border-r border-white/5">
                                <div className="h-full flex items-center justify-center gap-2">
                                  {isHovered && (
                                    <>
                                      {!file.analysis && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleFileSelect(file);
                                            runAnalysis();
                                          }}
                                          className="p-1.5 text-white/50 hover:text-primary transition-colors"
                                          title="Run Analysis"
                                        >
                                          <Zap className="w-4 h-4" />
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                            );
                          }

                          return null;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Analysis Panel */}
          {selectedFile && (
            <div className="w-96 border-l border-white/10 bg-[#0f0f14] flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['IBM_Plex_Mono']">
                  Analysis
                </h2>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setAnalysis(null);
                  }}
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Run Analysis Button */}
                <Button
                  onClick={runAnalysis}
                  disabled={analyzing}
                  className="w-full bg-primary hover:bg-primary/80 text-white"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>

                {/* Manual Overrides */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Manual BPM Override
                    </label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[manualBPM || analysis?.bpm || 120]}
                        min={80}
                        max={180}
                        step={1}
                        onValueChange={(val) => setManualBPM(val[0])}
                        className="flex-1"
                      />
                      <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                        {manualBPM || analysis?.bpm || 120} BPM
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Manual Key Override
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {keys.map((key) => (
                        <div key={key} className="space-y-1">
                          <button
                            onClick={() => setManualKey(key)}
                            className={`w-full py-2 rounded text-xs font-medium transition-all ${
                              manualKey === key || (!manualKey && analysis?.key?.startsWith(key))
                                ? "bg-primary text-white"
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {key}
                          </button>
                          {modes.map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setManualKey(key + mode)}
                              className={`w-full py-1 rounded text-[10px] font-medium transition-all ${
                                manualKey === key + mode || (!manualKey && analysis?.key === key + mode)
                                  ? "bg-primary/80 text-white"
                                  : "bg-white/5 text-white/40 hover:bg-white/10"
                              }`}
                            >
                              {mode || "Maj"}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                {analysis && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Results</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                            BPM
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                          {analysis.bpm}
                        </p>
                        <p className="text-xs text-white/40 mt-1 font-['IBM_Plex_Mono']">
                          {analysis.bpmConfidence}% confidence
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="w-4 h-4 text-primary" />
                          <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                            Key
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                          {analysis.key}
                        </p>
                        <p className="text-xs text-white/40 mt-1 font-['IBM_Plex_Mono']">
                          {analysis.keyConfidence}% confidence
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                            Energy
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-white font-['IBM_Plex_Mono']">
                            {analysis.energy}
                          </p>
                          <div className="flex-1 ml-4">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${analysis.energyLevel}%` }}
                              />
                            </div>
                            <p className="text-xs text-white/40 mt-1 text-right font-['IBM_Plex_Mono']">
                              {analysis.energyLevel}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Audio Player */}
                {selectedFile && (
                  <AudioPlayer
                    audioData={selectedFile.data}
                    title={selectedFile.title || selectedFile.name}
                    artist={selectedFile.artist || "Unknown Artist"}
                    duration={selectedFile.duration}
                    energy={analysis?.energy || "Peak"}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </DndProvider>
    </div>
  );
}
