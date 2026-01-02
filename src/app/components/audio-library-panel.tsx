import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Play, Pause, Search, Trash2, Edit2, X, Music2, GripVertical, CheckSquare, Square, ChevronDown, ChevronUp, Upload, Sliders, Clock, Loader2, FolderOpen, Download } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { AudioPlayer } from "./audio-player";
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
  analysis?: any;
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
      {column.id !== "checkbox" && column.id !== "play" && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-20"
          onMouseDown={(e) => onResizeStart(column.id, e)}
        />
      )}
    </th>
  );
}

export function AudioLibraryPanel() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [playingFileId, setPlayingFileId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);
  const [sortColumn, setSortColumn] = useState<"title" | "bpm" | "time" | "energy" | "dateAdded" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [resizingColumn, setResizingColumn] = useState<ColumnId | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadFile, setCurrentUploadFile] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'uploading' | 'success' | 'error' }>({});
  const [dragActive, setDragActive] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleteConfirmed, setBulkDeleteConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

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
      const saved = localStorage.getItem('audioLibraryColumns');
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
    localStorage.setItem('audioLibraryColumns', JSON.stringify(columns));
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
            comparison = (a.bpm || 0) - (b.bpm || 0);
            break;
          case "time":
            comparison = (a.duration || 0) - (b.duration || 0);
            break;
          case "energy":
            comparison = (a.energy || "").localeCompare(b.energy || "");
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
      }
    }
  };

  const handleDelete = (fileId: string) => {
    const updated = files.filter((f) => f.id !== fileId);
    setFiles(updated);
    localStorage.setItem('uploadedAudioFiles', JSON.stringify(updated));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    }
    toast.success('File deleted');
  };

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_FORMATS = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];
  const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.flac', '.aiff', '.aif', '.m4a'];
  
  const isValidAudioFile = (file: File): boolean => {
    // Check by MIME type
    if (ALLOWED_FORMATS.includes(file.type)) return true;
    
    // Check by file extension (fallback for files without proper MIME type)
    const fileName = file.name.toLowerCase();
    return ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  };

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

  // Extract metadata from audio file (including artwork)
  const extractAudioMetadata = async (file: File): Promise<{
    title?: string;
    artist?: string;
    album?: string;
    artwork?: string;
    bpm?: number;
    key?: string;
    energy?: string;
  }> => {
    try {
      // Use jsmediatags library if available, otherwise use basic extraction
      // For now, we'll use a mock implementation that extracts from filename
      const filename = file.name.replace(/\.[^/.]+$/, "");
      const parts = filename.split(" - ");
      
      let title = filename;
      let artist = "Unknown Artist";
      let album = "";
      
      if (parts.length >= 2) {
        artist = parts[0].trim();
        title = parts.slice(1).join(" - ").trim();
      }
      
      // Try to extract album from path if available
      if (file.webkitRelativePath) {
        const pathParts = file.webkitRelativePath.split("/");
        if (pathParts.length > 1) {
          album = pathParts[pathParts.length - 2];
        }
      }
      
      // Generate artwork based on track metadata (using album art generator)
      // Dynamic import to avoid circular dependencies
      let artwork = "";
      try {
        const artModule = await import("./album-art-generator");
        if (artModule && typeof artModule.generateAlbumArtwork === 'function') {
          artwork = artModule.generateAlbumArtwork(
            title,
            128, // Default BPM
            "Am", // Default key
            "Groove", // Default energy
            "A" // Default version
          );
        } else {
          // Fallback: create a simple SVG if generation fails
          artwork = `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1a1a1a"/><text x="50" y="50" text-anchor="middle" fill="#666" font-size="12" font-family="Arial">${title.substring(0, 10)}</text></svg>`)}`;
        }
      } catch (error) {
        console.error('Error generating artwork:', error);
        // Fallback: create a simple SVG if import fails
        artwork = `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1a1a1a"/><text x="50" y="50" text-anchor="middle" fill="#666" font-size="12" font-family="Arial">${title.substring(0, 10)}</text></svg>`)}`;
      }
      
      return {
        title,
        artist,
        album,
        artwork,
        bpm: 128, // Will be analyzed later
        key: "Am", // Will be analyzed later
        energy: "Groove", // Will be analyzed later
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
      };
    }
  };

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setCurrentUploadFile("");
    setUploadStatus({});
    const newFiles: AudioFile[] = [];
    const totalFiles = fileList.length;
    const errors: string[] = [];
    const skipped: string[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileKey = `${file.name}-${i}`;
        
        // Update current file and progress
        setCurrentUploadFile(file.name);
        setUploadStatus(prev => ({ ...prev, [fileKey]: 'uploading' }));
        setUploadProgress(((i + 1) / totalFiles) * 100);
        
        try {
          // Validate file type (by extension or MIME type)
          if (!isValidAudioFile(file)) {
            console.warn(`Skipping file: ${file.name} (type: ${file.type})`);
            skipped.push(file.name);
            setUploadStatus(prev => ({ ...prev, [fileKey]: 'error' }));
            continue; // Skip invalid files but don't show error for each one
          }
          
          if (file.size > MAX_FILE_SIZE) {
            errors.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) - too large`);
            setUploadStatus(prev => ({ ...prev, [fileKey]: 'error' }));
            continue;
          }

          // Get duration
          let duration = 0;
          try {
            duration = await getFileDuration(file);
          } catch (err) {
            console.error('Error getting duration:', err);
            // Continue with duration 0 if we can't get it
          }

          // Extract metadata (including artwork)
          const metadata = await extractAudioMetadata(file);

          // Convert to base64 for storage
          const reader = new FileReader();
          const fileData = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          });

          const audioFile: AudioFile = {
            id: `audio-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
            name: file.name,
            size: file.size,
            type: file.type,
            duration,
            data: fileData,
            uploadedAt: new Date().toISOString(),
            title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: metadata.artist || "Unknown Artist",
            album: metadata.album || "",
            artwork: metadata.artwork || "",
            bpm: metadata.bpm || 128,
            key: metadata.key || "Am",
            energy: metadata.energy || "Groove",
          };

          newFiles.push(audioFile);
          setUploadStatus(prev => ({ ...prev, [fileKey]: 'success' }));
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          errors.push(`${file.name} - ${error instanceof Error ? error.message : 'Unknown error'}`);
          setUploadStatus(prev => ({ ...prev, [fileKey]: 'error' }));
          // Continue with next file
        }
      }

      // Update files state if we have any successful uploads
      if (newFiles.length > 0) {
        const updated = [...files, ...newFiles];
        setFiles(updated);
        // Save to localStorage - all files persist until deleted
        try {
          localStorage.setItem('uploadedAudioFiles', JSON.stringify(updated));
          
          // Show success message with details
          let message = `Successfully uploaded ${newFiles.length} of ${totalFiles} file(s)`;
          if (errors.length > 0) {
            message += `. ${errors.length} failed`;
          }
          if (skipped.length > 0) {
            message += `. ${skipped.length} skipped (invalid format)`;
          }
          toast.success(message);
          
          // Simulate DNA analysis
          setTimeout(() => {
            toast.success(`DNA analysis complete! ${newFiles.length} track(s) added to library.`);
          }, 2000);
        } catch (error) {
          console.error('Error saving to localStorage:', error);
          toast.error('Files uploaded but failed to save. They may not persist after refresh.');
        }
      } else if (totalFiles > 0) {
        let message = `No valid audio files were uploaded.`;
        if (errors.length > 0) {
          message += ` Errors: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`;
        }
        toast.warning(message);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setCurrentUploadFile("");
      // Clear upload status after a delay
      setTimeout(() => setUploadStatus({}), 3000);
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

  // Bulk delete with confirmation
  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;
    setBulkDeleteOpen(true);
  };

  const confirmBulkDelete = () => {
    const count = selectedFiles.length;
    const updated = files.filter((f) => !selectedFiles.includes(f.id));
    setFiles(updated);
    localStorage.setItem('uploadedAudioFiles', JSON.stringify(updated));
    
    // Clear selected file if it was deleted
    if (selectedFile && selectedFiles.includes(selectedFile.id)) {
      setSelectedFile(null);
    }
    
    setSelectedFiles([]);
    setBulkDeleteOpen(false);
    toast.success(`Deleted ${count} file(s)`);
  };

  const handleLoadToTimeline = (fileId: string) => {
    toast.success('Track loaded to Timeline Editor');
    // In a real app, this would add the track to the timeline
  };

  const handleLoadToMixer = (fileId: string) => {
    toast.success('Track loaded to Mixer');
    // In a real app, this would add the track to the mixer
  };

  // Export file with all metadata preserved
  const handleExport = (file: AudioFile) => {
    try {
      // Create export object with all metadata
      const exportData = {
        id: file.id,
        name: file.name,
        title: file.title,
        artist: file.artist,
        album: file.album,
        label: file.label,
        bpm: file.bpm,
        key: file.key,
        energy: file.energy,
        duration: file.duration,
        artwork: file.artwork, // Include artwork
        size: file.size,
        type: file.type,
        uploadedAt: file.uploadedAt,
        analysis: file.analysis,
        // Note: audio data (file.data) is base64 encoded and can be included if needed
        // For large files, you might want to exclude it or provide as separate download
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.title || file.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('File exported with all metadata');
    } catch (error) {
      console.error('Error exporting file:', error);
      toast.error('Failed to export file');
    }
  };

  // Bulk export selected files
  const handleBulkExport = () => {
    if (selectedFiles.length === 0) return;
    
    try {
      const filesToExport = files.filter(f => selectedFiles.includes(f.id));
      const exportData = {
        exportedAt: new Date().toISOString(),
        count: filesToExport.length,
        files: filesToExport.map(file => ({
          id: file.id,
          name: file.name,
          title: file.title,
          artist: file.artist,
          album: file.album,
          label: file.label,
          bpm: file.bpm,
          key: file.key,
          energy: file.energy,
          duration: file.duration,
          artwork: file.artwork, // Include artwork
          size: file.size,
          type: file.type,
          uploadedAt: file.uploadedAt,
          analysis: file.analysis,
        })),
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audio-library-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Exported ${selectedFiles.length} file(s) with all metadata`);
    } catch (error) {
      console.error('Error exporting files:', error);
      toast.error('Failed to export files');
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

  const visibleColumns = columns.filter((col) => col.visible);
  const allSelected = selectedFiles.length === filteredAndSortedFiles.length && filteredAndSortedFiles.length > 0;
  const someSelected = selectedFiles.length > 0 && selectedFiles.length < filteredAndSortedFiles.length;

  return (
    <div 
      className="h-full flex flex-col bg-[#0a0a0f]"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {dragActive && (
        <div className="fixed inset-0 z-50 bg-primary/20 border-4 border-dashed border-primary flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-xl font-semibold text-white">Drop audio files or folders here to upload</p>
            <p className="text-sm text-white/60 mt-2">MP3, WAV, or FLAC (max 50MB per file)</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">Audio Library</h1>
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
            {/* Upload Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="h-9 px-4 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Files</span>
                  </>
                )}
              </button>
              <button
                onClick={() => folderInputRef.current?.click()}
                disabled={uploading}
                className="h-9 px-4 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-white/10"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Upload Folder</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.flac,.aiff,.aif,.m4a,audio/*"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files);
                }
                if (e.target) e.target.value = ''; // Reset input
              }}
              className="hidden"
            />
            <input
              ref={folderInputRef}
              type="file"
              accept=".mp3,.wav,.flac,.aiff,.aif,.m4a,audio/*"
              multiple
              webkitdirectory=""
              directory=""
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files);
                }
                if (e.target) e.target.value = ''; // Reset input
              }}
              className="hidden"
            />
            {/* Upload Progress Bar */}
            {uploading && (
              <div className="px-6 py-3 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/80">
                        {currentUploadFile ? `Uploading: ${currentUploadFile}` : 'Processing files...'}
                      </span>
                      <span className="text-xs text-white/60">
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
                {Object.keys(uploadStatus).length > 0 && (
                  <div className="text-xs text-white/60 mt-2">
                    {Object.values(uploadStatus).filter(s => s === 'success').length} succeeded, {' '}
                    {Object.values(uploadStatus).filter(s => s === 'error').length} failed
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedFiles.length > 0 && (
        <div className="border-b border-white/5 px-6 py-3 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/80">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedFiles.forEach((id) => handleLoadToTimeline(id));
                setSelectedFiles([]);
              }}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Clock className="w-4 h-4 mr-2" />
              Load to Timeline
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedFiles.forEach((id) => handleLoadToMixer(id));
                setSelectedFiles([]);
              }}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Sliders className="w-4 h-4 mr-2" />
              Load to Mixer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedFiles.length})
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex overflow-hidden">
          <div className={`flex-1 overflow-auto ${selectedFile ? 'mr-80' : ''} transition-all duration-300`}>
            {filteredAndSortedFiles.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Music2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 mb-2">
                    {searchQuery ? "No files match your search" : "No audio files"}
                  </p>
                  <p className="text-sm text-white/40">
                    Upload audio files to see them here
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

                    return (
                      <tr
                        key={file.id}
                        onMouseEnter={() => setHoveredRow(file.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => setSelectedFile(file)}
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
                              <td key={column.id} className="px-3 text-center border-r border-white/5" style={{ verticalAlign: 'middle' }}>
                                <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden shadow-sm mx-auto">
                                  {file.artwork ? (
                                    <img 
                                      src={file.artwork} 
                                      alt={file.title || file.name} 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback if image fails to load
                                        e.currentTarget.style.display = 'none';
                                        const parent = e.currentTarget.parentElement;
                                        if (parent && !parent.querySelector('.fallback-icon')) {
                                          const icon = document.createElement('div');
                                          icon.className = 'fallback-icon w-full h-full flex items-center justify-center';
                                          const musicIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                          musicIcon.setAttribute('class', 'w-4 h-4 text-white/30');
                                          musicIcon.setAttribute('viewBox', '0 0 24 24');
                                          musicIcon.setAttribute('fill', 'none');
                                          musicIcon.setAttribute('stroke', 'currentColor');
                                          musicIcon.setAttribute('stroke-width', '2');
                                          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                          path.setAttribute('d', 'M9 18V5l12-2v13');
                                          musicIcon.appendChild(path);
                                          icon.appendChild(musicIcon);
                                          parent.appendChild(icon);
                                        }
                                      }}
                                    />
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
                                  {file.bpm || "-"}
                                </span>
                              </td>
                            );
                          }

                          if (column.id === "key") {
                            return (
                              <td key={column.id} className="px-3 text-center border-r border-white/5">
                                <span className="text-sm text-white/70 font-['IBM_Plex_Mono']">{file.key || "-"}</span>
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
                                <span className="text-xs text-white/60 truncate">{file.energy || "-"}</span>
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
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleExport(file);
                                        }}
                                        className="p-1.5 text-white/50 hover:text-white transition-colors"
                                        title="Export with metadata"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLoadToTimeline(file.id);
                                        }}
                                        className="p-1.5 text-white/50 hover:text-white transition-colors"
                                        title="Load to Timeline"
                                      >
                                        <Clock className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLoadToMixer(file.id);
                                        }}
                                        className="p-1.5 text-white/50 hover:text-white transition-colors"
                                        title="Load to Mixer"
                                      >
                                        <Sliders className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(file.id);
                                        }}
                                        className="p-1.5 text-white/50 hover:text-red-400 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
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

          {/* Details Panel */}
          {selectedFile && (
            <div className="w-80 border-l border-white/10 bg-[#0f0f14] flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['IBM_Plex_Mono']">
                  File Details
                </h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-4">
                <AudioPlayer
                  audioData={selectedFile.data}
                  title={selectedFile.title || selectedFile.name}
                  artist={selectedFile.artist || "Unknown Artist"}
                  duration={selectedFile.duration}
                  energy={selectedFile.energy as any}
                />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Size:</span>
                    <span className="text-white font-['IBM_Plex_Mono']">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Format:</span>
                    <span className="text-white font-['IBM_Plex_Mono']">
                      {selectedFile.type.split('/')[1].toUpperCase()}
                    </span>
                  </div>
                  {selectedFile.bpm && (
                    <div className="flex justify-between">
                      <span className="text-white/60">BPM:</span>
                      <span className="text-white font-['IBM_Plex_Mono']">{selectedFile.bpm}</span>
                    </div>
                  )}
                  {selectedFile.key && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Key:</span>
                      <span className="text-white font-['IBM_Plex_Mono']">{selectedFile.key}</span>
                    </div>
                  )}
                  {selectedFile.energy && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Energy:</span>
                      <span className="text-white">{selectedFile.energy}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DndProvider>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={(open) => {
        setBulkDeleteOpen(open);
        if (!open) setBulkDeleteConfirmed(false);
      }}>
        <AlertDialogContent className="bg-[#18181b] border-white/10 text-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-lg">
              Are you sure? Delete {selectedFiles.length} {selectedFiles.length === 1 ? 'track' : 'tracks'}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 mt-2">
              This action cannot be undone. This will permanently delete the selected track{selectedFiles.length !== 1 ? 's' : ''} from your library.
              {selectedFiles.length > 1 && (
                <div className="mt-3 text-sm">
                  <strong className="text-white/80">Selected tracks:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 max-h-32 overflow-y-auto">
                    {files.filter(f => selectedFiles.includes(f.id)).slice(0, 5).map(f => (
                      <li key={f.id} className="text-white/50">{f.title || f.name}</li>
                    ))}
                    {selectedFiles.length > 5 && (
                      <li className="text-white/40">...and {selectedFiles.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              onClick={() => {
                setBulkDeleteOpen(false);
                setBulkDeleteConfirmed(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setBulkDeleteConfirmed(true);
                confirmBulkDelete();
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Delete {selectedFiles.length} {selectedFiles.length === 1 ? 'Track' : 'Tracks'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

