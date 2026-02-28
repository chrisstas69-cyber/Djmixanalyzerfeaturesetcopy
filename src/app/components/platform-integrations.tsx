import { useState } from "react";
import { Music, Search, Download, Upload, ExternalLink, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useAuth } from "./auth-system";

type Platform = "soundcloud" | "bandcamp" | "youtube-music";

interface PlatformTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  platform: Platform;
  url: string;
  artwork?: string;
  bpm?: number;
  key?: string;
}

export function PlatformIntegrations({ platform }: { platform: Platform }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlatformTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [importedTracks, setImportedTracks] = useState<PlatformTrack[]>([]);

  const platformNames = {
    "soundcloud": "SoundCloud",
    "bandcamp": "Bandcamp",
    "youtube-music": "YouTube Music",
  };

  const handleConnect = () => {
    // In production, this would open OAuth flow
    setIsConnected(true);
    toast.success(`Connected to ${platformNames[platform]}!`);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate API search
    setTimeout(() => {
      const mockResults: PlatformTrack[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${platform}-${Date.now()}-${i}`,
        title: `Track ${i + 1}`,
        artist: `Artist ${i + 1}`,
        duration: `${Math.floor(Math.random() * 3) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`,
        platform,
        url: `https://${platform}.com/track-${i}`,
        bpm: Math.floor(Math.random() * 40) + 120,
        key: ["Am", "Cm", "Fm", "Gm"][Math.floor(Math.random() * 4)],
      }));
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleImport = (track: PlatformTrack) => {
    try {
      // Add to library
      const libraryTracksStr = localStorage.getItem("libraryTracks");
      const libraryTracks = libraryTracksStr ? JSON.parse(libraryTracksStr) : [];

      const newTrack = {
        id: `imported-${track.id}`,
        title: track.title,
        artist: track.artist,
        bpm: track.bpm || 128,
        key: track.key || "Am",
        duration: track.duration,
        energy: "Building",
        version: "A" as const,
        status: null,
        dateAdded: new Date().toISOString().split("T")[0],
        artwork: track.artwork,
      };

      libraryTracks.push(newTrack);
      localStorage.setItem("libraryTracks", JSON.stringify(libraryTracks));
      setImportedTracks([...importedTracks, track]);
      toast.success(`Imported "${track.title}"`);
    } catch (error) {
      console.error("Error importing track:", error);
      toast.error("Failed to import track");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              {platformNames[platform]} Integration
            </h1>
            <p className="text-xs text-white/40">
              Search, import, and sync tracks from {platformNames[platform]}
            </p>
          </div>
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              className="bg-primary hover:bg-primary/80 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Connect {platformNames[platform]}
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Connected</span>
            </div>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Music className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">
              Connect to {platformNames[platform]}
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Connect your {platformNames[platform]} account to search, import, and sync tracks
              directly into your library.
            </p>
            <Button
              onClick={handleConnect}
              className="bg-primary hover:bg-primary/80 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Connect Account
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder={`Search ${platformNames[platform]}...`}
                    className="pl-9 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white mb-4">
                  Search Results ({searchResults.length})
                </h2>
                <div className="space-y-2">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {track.artwork && (
                          <img
                            src={track.artwork}
                            alt={track.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {track.title}
                          </p>
                          <p className="text-xs text-white/60 truncate">{track.artist}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-white/40">
                            <span>{track.duration}</span>
                            {track.bpm && <span>BPM: {track.bpm}</span>}
                            {track.key && <span>Key: {track.key}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleImport(track)}
                            size="sm"
                            variant="outline"
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                          >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Import
                          </Button>
                          <a
                            href={track.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-white/60" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Imported Tracks */}
            {importedTracks.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white mb-4">
                  Recently Imported ({importedTracks.length})
                </h2>
                <div className="space-y-2">
                  {importedTracks.map((track) => (
                    <div
                      key={track.id}
                      className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{track.title}</p>
                        <p className="text-xs text-white/60">{track.artist}</p>
                      </div>
                      <span className="text-xs text-green-400 font-['IBM_Plex_Mono']">
                        Imported
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

