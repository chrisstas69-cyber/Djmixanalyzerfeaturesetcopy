import { useState, useEffect } from "react";
import { Plus, Trash2, FileDown, Music2, X, Play, Pause, Share2, Download, MessageSquare, Edit3, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { WaveformVisualizer } from "./waveform-visualizer";

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

interface Mix {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
  shareCode?: string;
  comments?: string;
}

export function MixesPanel() {
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [createMixOpen, setCreateMixOpen] = useState(false);
  const [mixName, setMixName] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
  const [selectedMix, setSelectedMix] = useState<Mix | null>(null);
  const [playingMixId, setPlayingMixId] = useState<string | null>(null);
  const [importCode, setImportCode] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [editingComments, setEditingComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [draggedTrackIndex, setDraggedTrackIndex] = useState<number | null>(null);
  const [dragOverTrackIndex, setDragOverTrackIndex] = useState<number | null>(null);
  const [breakdownOpen, setBreakdownOpen] = useState<string | null>(null); // Track which mix has breakdown open

  // Calculate total duration of a mix
  const calculateMixDuration = (tracks: Track[]): string => {
    const totalSeconds = tracks.reduce((sum, track) => {
      const parts = track.duration.split(":");
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return sum + (minutes * 60 + seconds);
    }, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle drag start for reordering tracks
  const handleDragStart = (index: number) => {
    setDraggedTrackIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTrackIndex === null || draggedTrackIndex === index) return;
    setDragOverTrackIndex(index);
  };

  // Handle drop to reorder tracks
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedTrackIndex === null || !selectedMix || draggedTrackIndex === dropIndex) {
      setDraggedTrackIndex(null);
      setDragOverTrackIndex(null);
      return;
    }

    const newTracks = [...selectedMix.tracks];
    const [draggedTrack] = newTracks.splice(draggedTrackIndex, 1);
    newTracks.splice(dropIndex, 0, draggedTrack);

    const updatedMix = {
      ...selectedMix,
      tracks: newTracks,
      updatedAt: new Date().toISOString(),
    };

    const updatedMixes = mixes.map(m => m.id === selectedMix.id ? updatedMix : m);
    setMixes(updatedMixes);
    setSelectedMix(updatedMix);
    localStorage.setItem('userMixes', JSON.stringify(updatedMixes));

    toast.success("Track order updated");
    setDraggedTrackIndex(null);
    setDragOverTrackIndex(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedTrackIndex(null);
    setDragOverTrackIndex(null);
  };

  // Remove track from mix
  const handleRemoveTrackFromMix = (trackId: string) => {
    if (!selectedMix) return;

    const updatedMix = {
      ...selectedMix,
      tracks: selectedMix.tracks.filter(t => t.id !== trackId),
      updatedAt: new Date().toISOString(),
    };

    const updatedMixes = mixes.map(m => m.id === selectedMix.id ? updatedMix : m);
    setMixes(updatedMixes);
    setSelectedMix(updatedMix);
    localStorage.setItem('userMixes', JSON.stringify(updatedMixes));

    toast.success("Track removed from mix");
  };

  // Generate share code from track IDs
  const generateShareCode = (tracks: Track[]): string => {
    const trackIds = tracks.map(t => t.id).join(',');
    const encoded = btoa(JSON.stringify({ trackIds, order: tracks.map(t => t.id) }));
    return encoded;
  };

  // Share mix
  const handleShareMix = (mix: Mix) => {
    const shareCode = mix.shareCode || generateShareCode(mix.tracks);
    const shareLink = `https://djmix.app/share/${shareCode}`;
    
    // Update mix with share code if not present
    if (!mix.shareCode) {
      const updatedMixes = mixes.map(m => 
        m.id === mix.id ? { ...m, shareCode } : m
      );
      setMixes(updatedMixes);
      localStorage.setItem('userMixes', JSON.stringify(updatedMixes));
    }
    
    navigator.clipboard.writeText(shareCode).then(() => {
      toast.success("Share code copied to clipboard!");
    }).catch(() => {
      toast.success(`Share code: ${shareCode}`);
    });
  };

  // Import mix from share code
  const handleImportMix = () => {
    if (!importCode.trim()) {
      toast.error("Please enter a share code");
      return;
    }

    try {
      const decoded = JSON.parse(atob(importCode));
      const trackIds = decoded.trackIds ? decoded.trackIds.split(',') : decoded.order;
      
      // Find tracks in library
      const importedTracks = trackIds
        .map((id: string) => availableTracks.find(t => t.id === id))
        .filter((t: Track | undefined): t is Track => t !== undefined);

      if (importedTracks.length === 0) {
        toast.error("No matching tracks found in your library");
        return;
      }

      // Create new mix from imported tracks
      const newMix: Mix = {
        id: `mix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `Imported Mix ${new Date().toLocaleDateString()}`,
        tracks: importedTracks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shareCode: importCode,
        comments: "Imported from share code",
      };

      const updatedMixes = [...mixes, newMix];
      setMixes(updatedMixes);
      localStorage.setItem('userMixes', JSON.stringify(updatedMixes));

      toast.success(`Imported mix with ${importedTracks.length} tracks`);
      setImportOpen(false);
      setImportCode("");
    } catch (error) {
      console.error('Error importing mix:', error);
      toast.error("Invalid share code. Please check and try again.");
    }
  };

  // Update mix comments
  const handleSaveComments = (mixId: string) => {
    const updatedMixes = mixes.map(m => 
      m.id === mixId ? { ...m, comments: commentText } : m
    );
    setMixes(updatedMixes);
    localStorage.setItem('userMixes', JSON.stringify(updatedMixes));
    setEditingComments(null);
    setCommentText("");
    toast.success("Comments saved");
  };

  // Load mixes and tracks from localStorage
  useEffect(() => {
    try {
      // Load mixes
      const mixesStr = localStorage.getItem('userMixes');
      if (mixesStr) {
        setMixes(JSON.parse(mixesStr));
      }

      // Load available tracks from library
      const libraryTracksStr = localStorage.getItem('libraryTracks');
      const libraryTracks: Track[] = libraryTracksStr ? JSON.parse(libraryTracksStr) : [];
      
      // Also load MOCK_TRACKS if needed (for demo purposes)
      // For now, just use libraryTracks
      setAvailableTracks(libraryTracks);
    } catch (error) {
      console.error('Error loading mixes:', error);
    }
  }, []);

  const handleCreateMix = () => {
    // Validate mix name
    const trimmedName = mixName.trim();
    if (!trimmedName) {
      toast.error("Please enter a mix name");
      return;
    }
    if (trimmedName.length > 50) {
      toast.error("Mix name is too long. Please keep it under 50 characters.");
      return;
    }
    if (trimmedName.length < 2) {
      toast.error("Mix name must be at least 2 characters long.");
      return;
    }

    // Check for duplicate mix names
    const duplicateMix = mixes.find(m => m.name.toLowerCase() === trimmedName.toLowerCase());
    if (duplicateMix) {
      toast.error("A mix with this name already exists. Please choose a different name.");
      return;
    }

    if (selectedTracks.length === 0) {
      toast.error("Please select at least one track");
      return;
    }
    if (selectedTracks.length > 100) {
      toast.error("Too many tracks selected. Please select up to 100 tracks.");
      return;
    }

    const newMix: Mix = {
      id: `mix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: mixName.trim(),
      tracks: selectedTracks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shareCode: generateShareCode(selectedTracks),
      comments: "",
    };

    const updatedMixes = [...mixes, newMix];
    setMixes(updatedMixes);
    localStorage.setItem('userMixes', JSON.stringify(updatedMixes));

    toast.success(`Created mix "${newMix.name}"`);
    setCreateMixOpen(false);
    setMixName("");
    setSelectedTracks([]);
  };

  const handleDeleteMix = (mixId: string) => {
    const updatedMixes = mixes.filter(m => m.id !== mixId);
    setMixes(updatedMixes);
    localStorage.setItem('userMixes', JSON.stringify(updatedMixes));
    toast.success("Mix deleted");
    if (selectedMix?.id === mixId) {
      setSelectedMix(null);
    }
  };

  const handleExportMix = (mix: Mix) => {
    const mixData = {
      id: mix.id,
      name: mix.name,
      tracks: mix.tracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        bpm: t.bpm,
        key: t.key,
        duration: t.duration,
        energy: t.energy,
        version: t.version,
      })),
      createdAt: mix.createdAt,
      updatedAt: mix.updatedAt,
    };

    const jsonString = JSON.stringify(mixData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mix.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported "${mix.name}" as JSON`);
  };

  const toggleTrackSelection = (track: Track) => {
    setSelectedTracks((prev) => {
      const isSelected = prev.some(t => t.id === track.id);
      if (isSelected) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-darkest, #080808)' }}>
      {/* Header */}
      <div 
        className="px-8 py-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl font-semibold tracking-tight mb-1"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
            >
              My Mixes
            </h1>
            <p style={{ color: 'var(--text-tertiary, #666666)' }} className="text-sm">
              {mixes.length} {mixes.length === 1 ? "mix" : "mixes"} created
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setImportOpen(true)}
              className="h-10 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={{ 
                background: 'var(--bg-medium, #111111)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                color: 'var(--text-secondary, #a0a0a0)'
              }}
            >
              <Download className="w-4 h-4" />
              <span>Import Mix</span>
            </button>
            <button
              onClick={() => setCreateMixOpen(true)}
              className="h-10 px-4 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              style={{ 
                background: 'var(--accent-primary, #00bcd4)', 
                color: 'var(--bg-darkest, #080808)',
                boxShadow: 'var(--shadow-glow-cyan, 0 0 20px rgba(0, 188, 212, 0.3))'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Mix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mixes List - SoundCloud Style */}
        <div className={`flex-1 overflow-auto ${selectedMix ? 'mr-80' : breakdownOpen ? 'mr-96' : ''} transition-all duration-300`}>
          {mixes.length === 0 ? (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <Music2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No mixes yet</p>
                <p className="text-sm text-white/40 mb-4">Create your first mix to get started</p>
                <button
                  onClick={() => setCreateMixOpen(true)}
                  className="h-9 px-4 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Mix</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {mixes.map((mix) => {
                const isPlaying = playingMixId === mix.id;
                const isSelected = selectedMix?.id === mix.id;
                const avgEnergy = mix.tracks.length > 0 
                  ? mix.tracks.reduce((sum, t) => {
                      const energyVal = t.energy === "Peak" ? 5 : t.energy === "Building" ? 4 : t.energy === "Rising" ? 3 : t.energy === "Groove" ? 3 : t.energy === "Steady" ? 2 : 1;
                      return sum + energyVal;
                    }, 0) / mix.tracks.length
                  : 3;
                const energyLevel = avgEnergy >= 4 ? "Peak" : avgEnergy >= 3 ? "Building" : avgEnergy >= 2 ? "Rising" : "Chill";
                
                return (
                  <div
                    key={mix.id}
                    className={`group relative bg-white/5 hover:bg-white/10 border-l-4 transition-all ${
                      isSelected ? "border-primary bg-primary/10" : "border-transparent"
                    }`}
                    onClick={() => setSelectedMix(mix)}
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Play Button Overlay */}
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingMixId(isPlaying ? null : mix.id);
                          }}
                          className="w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/30 flex items-center justify-center transition-all group-hover:scale-110"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-primary" />
                          ) : (
                            <Play className="w-5 h-5 text-primary ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Mix Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold truncate">{mix.name}</h3>
                          <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            {mix.tracks.length} tracks
                          </span>
                          <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            • {calculateMixDuration(mix.tracks)}
                          </span>
                        </div>
                        
                        {/* Waveform - Clickable for Track Breakdown */}
                        <div className="relative h-16 -mx-2 cursor-pointer" onClick={(e) => {
                          e.stopPropagation();
                          setBreakdownOpen(breakdownOpen === mix.id ? null : mix.id);
                        }}>
                          <WaveformVisualizer
                            energy={energyLevel as any}
                            width={800}
                            height={64}
                            barCount={200}
                          />
                          {/* Play Progress Overlay (when playing) */}
                          {isPlaying && (
                            <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                          )}
                          {/* Breakdown indicator */}
                          {breakdownOpen === mix.id && (
                            <div className="absolute inset-0 bg-primary/20 border-2 border-primary pointer-events-none" />
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-white/50 font-['IBM_Plex_Mono']">
                          <span>{new Date(mix.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{mix.tracks.reduce((sum, t) => sum + (t.bpm || 0), 0) / mix.tracks.length || 0} avg BPM</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportMix(mix);
                          }}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                          aria-label="Export mix"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMix(mix.id);
                          }}
                          className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                          aria-label="Delete mix"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Track Breakdown Sidebar - Shows when waveform is clicked */}
        {breakdownOpen && (() => {
          const breakdownMix = mixes.find(m => m.id === breakdownOpen);
          if (!breakdownMix) return null;
          
          // Calculate timestamps for each track
          let currentTime = 0;
          const trackTimestamps = breakdownMix.tracks.map((track) => {
            const parts = track.duration.split(":");
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            const trackDuration = minutes * 60 + seconds;
            const startTime = currentTime;
            const endTime = currentTime + trackDuration;
            currentTime = endTime;
            
            const formatTime = (seconds: number): string => {
              const mins = Math.floor(seconds / 60);
              const secs = Math.floor(seconds % 60);
              return `${mins}:${secs.toString().padStart(2, "0")}`;
            };
            
            return {
              track,
              startTime: formatTime(startTime),
              endTime: formatTime(endTime),
              duration: track.duration,
            };
          });
          
          return (
            <div className="w-96 border-l border-white/10 bg-[#0f0f14] flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['IBM_Plex_Mono']">
                  Track Breakdown
                </h2>
                <button
                  onClick={() => setBreakdownOpen(null)}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Close breakdown"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{breakdownMix.name}</h3>
                  <p className="text-xs text-white/50 font-['IBM_Plex_Mono']">
                    Total: {calculateMixDuration(breakdownMix.tracks)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {trackTimestamps.map((item, index) => (
                    <div
                      key={item.track.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-white/40 font-['IBM_Plex_Mono'] w-6">
                              {index + 1}
                            </span>
                            <h4 className="text-sm font-medium text-white truncate">{item.track.title}</h4>
                          </div>
                          <p className="text-xs text-white/50 truncate ml-8">{item.track.artist}</p>
                        </div>
                      </div>
                      <div className="ml-8 space-y-1">
                        <div className="flex items-center gap-4 text-xs text-white/40 font-['IBM_Plex_Mono']">
                          <span>⏱ {item.startTime} - {item.endTime}</span>
                          <span>•</span>
                          <span>{item.track.bpm} BPM</span>
                          <span>•</span>
                          <span>{item.track.key}</span>
                        </div>
                        <div className="text-xs text-white/30 font-['IBM_Plex_Mono']">
                          Duration: {item.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Mix Details Panel */}
        {selectedMix && (
          <div className="w-80 border-l border-white/10 bg-[#0f0f14] flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-['IBM_Plex_Mono']">
                Mix Details
              </h2>
              <button
                onClick={() => setSelectedMix(null)}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{selectedMix.name}</h3>
                <div className="flex items-center gap-4 text-xs text-white/50 font-['IBM_Plex_Mono']">
                  <span>
                    {selectedMix.tracks.length} {selectedMix.tracks.length === 1 ? "track" : "tracks"}
                  </span>
                  <span>•</span>
                  <span>Duration: {calculateMixDuration(selectedMix.tracks)}</span>
                </div>
              </div>

              <div className="space-y-2">
                {selectedMix.tracks.map((track, index) => (
                  <div
                    key={track.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 bg-white/5 rounded-lg border transition-all cursor-move ${
                      draggedTrackIndex === index
                        ? "opacity-50 border-primary"
                        : dragOverTrackIndex === index
                        ? "border-primary bg-primary/10"
                        : "border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-white/40 font-['IBM_Plex_Mono'] w-6">
                            {index + 1}
                          </span>
                          <h4 className="text-sm font-medium text-white truncate">{track.title}</h4>
                        </div>
                        <p className="text-xs text-white/50 truncate ml-8">{track.artist}</p>
                        <div className="flex items-center gap-3 mt-2 ml-8 text-xs text-white/40 font-['IBM_Plex_Mono']">
                          <span>{track.bpm} BPM</span>
                          <span>{track.key}</span>
                          <span>{track.duration}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTrackFromMix(track.id)}
                        className="ml-2 text-white/40 hover:text-red-400 transition-colors"
                        aria-label="Remove track from mix"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comments/Feedback Section */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Comments & Feedback
                  </h3>
                  {!editingComments && selectedMix.comments && (
                    <button
                      onClick={() => {
                        setEditingComments(selectedMix.id);
                        setCommentText(selectedMix.comments || "");
                      }}
                      className="text-xs text-white/60 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {editingComments === selectedMix.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add notes about this mix (e.g., 'Great for parties', 'Perfect for late night')..."
                      className="w-full h-24 px-3 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none resize-none text-sm"
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                        {commentText.length}/500 characters
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingComments(null);
                            setCommentText("");
                          }}
                          className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveComments(selectedMix.id)}
                          className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/80 text-white text-xs font-medium transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    {selectedMix.comments ? (
                      <p className="text-sm text-white/80 whitespace-pre-wrap">{selectedMix.comments}</p>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-white/40 mb-2">No comments yet</p>
                        <button
                          onClick={() => {
                            setEditingComments(selectedMix.id);
                            setCommentText("");
                          }}
                          className="text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                          Add comments
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Import Mix Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold mb-2">
              Import Mix
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm mb-4">
              Paste a share code to import a mix into your library
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Share Code</label>
              <Input
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="Paste share code here..."
                className="bg-black/40 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleImportMix}
                className="flex-1 bg-primary hover:bg-primary/80"
              >
                Import Mix
              </Button>
              <Button
                onClick={() => {
                  setImportOpen(false);
                  setImportCode("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Mix Dialog */}
      <Dialog open={createMixOpen} onOpenChange={setCreateMixOpen}>
        <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold mb-2">
              Create New Mix
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm mb-4">
              Select tracks and give your mix a name
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Mix Name Input */}
            <div>
              <label className="text-sm text-white/80 mb-2 block">Mix Name</label>
              <Input
                type="text"
                placeholder="My Awesome Mix"
                value={mixName}
                onChange={(e) => setMixName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Available Tracks */}
            <div className="flex-1 overflow-auto space-y-2">
              <label className="text-sm text-white/80 block">Select Tracks ({selectedTracks.length} selected)</label>
              {availableTracks.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <Music2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No tracks available. Add tracks to your library first.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-auto">
                  {availableTracks.map((track) => {
                    const isSelected = selectedTracks.some(t => t.id === track.id);
                    return (
                      <div
                        key={track.id}
                        onClick={() => toggleTrackSelection(track)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary/20 border-primary text-white"
                            : "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{track.title}</h4>
                            <p className="text-xs text-white/60 truncate">{track.artist}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-white/40 font-['IBM_Plex_Mono']">
                              <span>{track.bpm} BPM</span>
                              <span>{track.key}</span>
                              <span>{track.duration}</span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ml-3 ${
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-white/30"
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateMixOpen(false);
                  setMixName("");
                  setSelectedTracks([]);
                }}
                className="border-white/10 text-white/80 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateMix}
                className="bg-primary hover:bg-primary/80 text-white"
                disabled={!mixName.trim() || selectedTracks.length === 0}
              >
                Create Mix
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

