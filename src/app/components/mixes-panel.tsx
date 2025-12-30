import { useState, useEffect } from "react";
import { Plus, Trash2, FileDown, Music2, X, Play, Pause, Share2, Download, MessageSquare } from "lucide-react";
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
    if (!mixName.trim()) {
      toast.error("Please enter a mix name");
      return;
    }

    if (selectedTracks.length === 0) {
      toast.error("Please select at least one track");
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
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">My Mixes</h1>
            <p className="text-xs text-white/40">
              {mixes.length} {mixes.length === 1 ? "mix" : "mixes"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setImportOpen(true)}
              className="h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Import Mix</span>
            </button>
            <button
              onClick={() => setCreateMixOpen(true)}
              className="h-9 px-4 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Mix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mixes List */}
        <div className={`flex-1 overflow-auto p-6 ${selectedMix ? 'mr-80' : ''} transition-all duration-300`}>
          {mixes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mixes.map((mix) => (
                <div
                  key={mix.id}
                  className={`bg-white/5 border rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer ${
                    selectedMix?.id === mix.id ? "border-primary bg-primary/10" : "border-white/10"
                  }`}
                  onClick={() => setSelectedMix(mix)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1 truncate">{mix.name}</h3>
                      <p className="text-xs text-white/50 font-['IBM_Plex_Mono']">
                        {mix.tracks.length} {mix.tracks.length === 1 ? "track" : "tracks"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMix(mix.id);
                      }}
                      className="text-white/40 hover:text-red-400 transition-colors ml-2"
                      aria-label="Delete mix"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingMixId(playingMixId === mix.id ? null : mix.id);
                      }}
                      className="flex-1 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      {playingMixId === mix.id ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportMix(mix);
                      }}
                      className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                      aria-label="Export mix"
                    >
                      <FileDown className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-white/30 mt-3 font-['IBM_Plex_Mono']">
                    Created {new Date(mix.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

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
                <p className="text-xs text-white/50 font-['IBM_Plex_Mono']">
                  {selectedMix.tracks.length} {selectedMix.tracks.length === 1 ? "track" : "tracks"}
                </p>
              </div>

              <div className="space-y-2">
                {selectedMix.tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
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
                    </div>
                  </div>
                ))}
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

