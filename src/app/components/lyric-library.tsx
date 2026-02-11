"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Play, 
  Edit3, 
  Copy, 
  Trash2,
  Heart,
  Music2,
  Grid,
  List,
  ChevronDown,
  X,
  MoreVertical,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

// Types
interface LyricSection {
  type: string;
  label: string;
  bars: number;
  content: string;
}

interface SavedLyric {
  id: string;
  title: string;
  genre: string;
  subgenre?: string;
  bpm: number;
  key: string;
  themes: string[];
  sections: LyricSection[];
  wordCount: number;
  createdAt: string;
  dnaMatch: number;
  isFavorite?: boolean;
}

// Sample data for demo
const SAMPLE_LYRICS: SavedLyric[] = [
  {
    id: "1",
    title: "Techno Dreams #1",
    genre: "Techno",
    subgenre: "Melodic",
    bpm: 128,
    key: "Am",
    themes: ["Unity", "Transcendence"],
    sections: [
      { type: "verse1", label: "Verse 1", bars: 8, content: "Lost in the rhythm of the night\nSynthesized souls in neon light\nBreaking through the static noise\nFinding freedom in the choice" },
      { type: "hook", label: "Hook", bars: 4, content: "We are one, we are electric\nMoving bodies, souls connected" },
    ],
    wordCount: 45,
    createdAt: "2025-01-09T10:30:00Z",
    dnaMatch: 94,
    isFavorite: true,
  },
  {
    id: "2",
    title: "Underground Pulse",
    genre: "Techno",
    subgenre: "Dark",
    bpm: 132,
    key: "Dm",
    themes: ["Rebellion", "Urban Life"],
    sections: [
      { type: "verse1", label: "Verse 1", bars: 8, content: "Concrete walls and bassline calls\nEchoes in these empty halls\nFeel the frequency take control\nLet the underground fill your soul" },
      { type: "hook", label: "Hook", bars: 4, content: "Pulse, pulse, underground pulse\nDeep beneath, the rhythm results" },
    ],
    wordCount: 52,
    createdAt: "2025-01-06T14:20:00Z",
    dnaMatch: 88,
  },
  {
    id: "3",
    title: "House of Unity",
    genre: "House",
    subgenre: "Deep House",
    bpm: 124,
    key: "C",
    themes: ["Unity", "Love"],
    sections: [
      { type: "verse1", label: "Verse 1", bars: 8, content: "We are one on this floor tonight\nMoving together in the light\nHands up high, feel the vibe\nIn this house we come alive" },
      { type: "hook", label: "Hook", bars: 4, content: "Unity, unity, we rise\nTogether under disco skies" },
    ],
    wordCount: 48,
    createdAt: "2025-01-02T20:15:00Z",
    dnaMatch: 92,
  },
  {
    id: "4",
    title: "Minimal Minds",
    genre: "Minimal",
    bpm: 126,
    key: "Em",
    themes: ["Introspection", "Technology"],
    sections: [
      { type: "verse1", label: "Verse 1", bars: 8, content: "Less is more in this space\nSubtle shifts, infinite grace\nHypnotic loops, find your place\nSilence speaks in empty space" },
    ],
    wordCount: 30,
    createdAt: "2025-01-02T08:00:00Z",
    dnaMatch: 86,
  },
  {
    id: "5",
    title: "Deep Reflections",
    genre: "Deep House",
    bpm: 122,
    key: "Gm",
    themes: ["Love", "Nature"],
    sections: [
      { type: "verse1", label: "Verse 1", bars: 8, content: "Journey within, let go of the surface\nDeeper than deep, find your purpose\nMelodic waves wash over me\nIn this sound, I'm finally free" },
    ],
    wordCount: 35,
    createdAt: "2024-12-28T16:45:00Z",
    dnaMatch: 91,
  },
  {
    id: "6",
    title: "Progressive Journey",
    genre: "Progressive",
    bpm: 128,
    key: "Fm",
    themes: ["Freedom", "Transcendence"],
    sections: [
      { type: "verse1", label: "Verse 1", bars: 8, content: "Building slowly, layer by layer\nTake your time, be a player\nThe story unfolds as we go higher\nFeel the climb, feel the fire" },
    ],
    wordCount: 32,
    createdAt: "2024-12-21T22:30:00Z",
    dnaMatch: 89,
  },
];

const GENRES = ["All", "Techno", "House", "Minimal", "Deep House", "Progressive", "Trance"];
const MOODS = ["All", "Dark", "Light", "Euphoric", "Melancholic", "Energetic", "Chill"];
const SORT_OPTIONS = ["Recent", "A-Z", "Most Used", "DNA Match"];

interface LyricLibraryProps {
  onNavigate?: (view: string) => void;
}

export function LyricLibrary({ onNavigate }: LyricLibraryProps) {
  const [lyrics, setLyrics] = useState<SavedLyric[]>(SAMPLE_LYRICS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLyric, setSelectedLyric] = useState<SavedLyric | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load saved lyrics from localStorage on mount
  useEffect(() => {
    try {
      const savedLyrics = localStorage.getItem("lyricLibrary");
      if (savedLyrics) {
        const parsed = JSON.parse(savedLyrics);
        // Merge with sample data, avoiding duplicates
        const merged = [...SAMPLE_LYRICS];
        parsed.forEach((lyric: SavedLyric) => {
          if (!merged.find(l => l.id === lyric.id)) {
            merged.push(lyric);
          }
        });
        setLyrics(merged);
      }
    } catch (error) {
      console.error("Error loading lyrics:", error);
    }
  }, []);

  // Filter and sort lyrics
  const filteredLyrics = useMemo(() => {
    let result = [...lyrics];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        l =>
          l.title.toLowerCase().includes(term) ||
          l.genre.toLowerCase().includes(term) ||
          l.themes.some(t => t.toLowerCase().includes(term))
      );
    }

    // Genre filter
    if (selectedGenre !== "All") {
      result = result.filter(l => l.genre === selectedGenre);
    }

    // Sort
    switch (sortBy) {
      case "A-Z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Most Used":
        result.sort((a, b) => b.dnaMatch - a.dnaMatch);
        break;
      case "DNA Match":
        result.sort((a, b) => b.dnaMatch - a.dnaMatch);
        break;
      case "Recent":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [lyrics, searchTerm, selectedGenre, sortBy]);

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  };

  // Format date as "Jan 10, 2026"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Format duration from BPM (rough estimate)
  const formatDuration = (bpm: number) => {
    const beats = 128; // Assume ~128 beats for average lyric
    const minutes = Math.floor(beats / bpm);
    const seconds = Math.round((beats / bpm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setLyrics(prev =>
      prev.map(l =>
        l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
      )
    );
  };

  // Delete lyric
  const deleteLyric = (id: string) => {
    setLyrics(prev => prev.filter(l => l.id !== id));
    toast.success("Lyric deleted");
    setShowPreview(false);
  };

  // Copy lyrics to clipboard
  const copyLyrics = (lyric: SavedLyric) => {
    const text = lyric.sections.map(s => `[${s.label}]\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Lyrics copied to clipboard!");
  };

  // Use lyric in track creation
  const handleUseInTrack = (lyric: SavedLyric) => {
    // Extract full lyric text
    const lyricText = lyric.sections.map(s => `[${s.label}]\n${s.content}`).join("\n\n");
    
    // Store in localStorage with timestamp (similar to lyricLabData pattern)
    const lyricLibraryData = {
      lyrics: lyricText,
      genre: lyric.genre,
      bpm: lyric.bpm,
      key: lyric.key,
      timestamp: Date.now(),
    };
    localStorage.setItem('lyricLibraryData', JSON.stringify(lyricLibraryData));
    
    // Navigate to create track view
    if (onNavigate) {
      onNavigate('create-track-modern');
      toast.success("Lyrics loaded! Switching to Create Track...");
    } else {
      toast.error("Navigation not available");
    }
    
    // Close preview modal if open
    setShowPreview(false);
  };

  // Get preview text (first few lines)
  const getPreviewText = (lyric: SavedLyric) => {
    const firstSection = lyric.sections[0];
    if (!firstSection) return "";
    const lines = firstSection.content.split("\n").slice(0, 3);
    return lines.join("\n") + (firstSection.content.split("\n").length > 3 ? "..." : "");
  };

  // Get badge color based on genre
  const getGenreBadgeColor = (genre: string) => {
    const colors: Record<string, string> = {
      Techno: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
      House: "border-orange-500/30 bg-orange-500/10 text-orange-300",
      Minimal: "border-purple-500/30 bg-purple-500/10 text-purple-300",
      "Deep House": "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      Progressive: "border-pink-500/30 bg-pink-500/10 text-pink-300",
      Trance: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    };
    return colors[genre] || "border-white/20 bg-white/5 text-white/60";
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-darkest)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-6 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight mb-1 font-['Rajdhani']">Lyric Library</h1>
          <p className="text-sm text-white/40">Your Collection of AI-Generated Lyrics</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-8 py-4 border-b border-white/5 space-y-4">
        {/* Genre Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all font-['Inter'] ${
                selectedGenre === genre
                  ? "bg-[var(--accent-cyan)] text-black"
                  : "bg-[var(--bg-medium)] text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Search, Sort, View Toggle */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search lyrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--bg-dark)] border border-white/10 text-white text-sm placeholder-white/30 focus:border-[var(--accent-cyan)] focus:outline-none font-['Inter']"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-lg bg-[var(--bg-dark)] border border-white/10 text-white text-sm appearance-none cursor-pointer focus:border-[var(--accent-cyan)] focus:outline-none font-['Inter']"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-white/10 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[var(--bg-medium)] text-white" : "text-white/40 hover:text-white"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-[var(--bg-medium)] text-white" : "text-white/40 hover:text-white"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Create New Button */}
            <button
              onClick={() => onNavigate?.("lyric-lab")}
              className="h-10 px-4 rounded-lg bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-dim)] text-black font-semibold text-sm flex items-center gap-2 transition-all font-['Inter']"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        {filteredLyrics.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Music2 className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-lg font-semibold text-white/40 mb-2 font-['Rajdhani']">No lyrics found</h3>
            <p className="text-sm text-white/30 mb-6 font-['Inter']">
              {searchTerm || selectedGenre !== "All"
                ? "Try adjusting your filters"
                : "Create your first lyrics in Lyric Lab"}
            </p>
            <button
              onClick={() => onNavigate?.("lyric-lab")}
              className="px-6 py-3 rounded-lg bg-[var(--accent-cyan)] text-black font-semibold text-sm flex items-center gap-2 font-['Inter']"
            >
              <Sparkles className="w-4 h-4" />
              Create Lyrics
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredLyrics.map(lyric => (
              <div
                key={lyric.id}
                onClick={() => {
                  setSelectedLyric(lyric);
                  setShowPreview(true);
                }}
                className="group bg-[var(--bg-darker)] rounded-xl border border-white/5 hover:border-white/10 p-5 cursor-pointer transition-all hover:bg-[var(--bg-dark)]"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 style={{ 
                      fontSize: '20px',
                      fontWeight: 'bold', 
                      color: 'var(--text)', 
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {lyric.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getGenreBadgeColor(lyric.genre)}`}>
                        {lyric.genre}
                      </span>
                      {lyric.themes.slice(0, 1).map(theme => (
                        <span key={theme} className="text-[10px] text-white/40 font-['Inter']">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-[var(--status-success)] font-['Inter']">
                      {lyric.dnaMatch}%
                    </span>
                    <span className="text-[10px] text-white/40 font-['Inter']">DNA</span>
                  </div>
                </div>

                {/* Lyrics Preview */}
                <p className="font-['Inter'] italic" style={{
                  fontSize: '16px',
                  color: 'var(--text-2)',
                  lineHeight: '1.6',
                  marginTop: '12px',
                  marginBottom: '16px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  "{getPreviewText(lyric)}"
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="font-['Inter']" style={{ fontSize: '15px', color: 'var(--text-3)' }}>
                    {lyric.bpm} BPM • {lyric.key} • {formatDate(lyric.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(lyric.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        lyric.isFavorite 
                          ? "text-red-500" 
                          : "text-white/30 hover:text-white/60 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${lyric.isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-[10px] text-white/30 mt-2 font-['Inter']">
                  {formatRelativeTime(lyric.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedLyric && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="bg-[var(--bg-darker)] rounded-2xl border border-white/10 w-full max-w-3xl min-h-[600px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-white font-['Rajdhani']">{selectedLyric.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getGenreBadgeColor(selectedLyric.genre)}`}>
                    {selectedLyric.genre}
                  </span>
                  <span className="text-xs text-white/40 font-['Inter']">{selectedLyric.bpm} BPM • {selectedLyric.key}</span>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {selectedLyric.sections.map((section, index) => (
                  <div key={index}>
                    <div className="text-xs text-[var(--accent-cyan)] font-semibold uppercase tracking-wider mb-2 font-['Rajdhani']">
                      [{section.label} – {section.bars} bars]
                    </div>
                    <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-['Inter']">
                      {section.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/5 bg-[var(--bg-dark)] flex-shrink-0">
              <div className="flex items-center gap-3 text-xs text-white/40 font-['Inter']">
                <span>{selectedLyric.wordCount} words</span>
                <span>•</span>
                <span>DNA Match: <strong className="text-[var(--status-success)]">{selectedLyric.dnaMatch}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toast.success("Preview playing...");
                  }}
                  className="h-10 px-4 rounded-lg bg-[var(--accent-cyan)] text-black font-semibold text-sm flex items-center gap-2 font-['Inter']"
                >
                  <Play className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => handleUseInTrack(selectedLyric)}
                  className="h-10 px-4 rounded-lg bg-[var(--bg-medium)] text-white font-semibold text-sm flex items-center gap-2 border border-white/10 hover:border-white/20 transition font-['Inter']"
                >
                  <Music2 className="w-4 h-4" />
                  Use in Track
                </button>
                <button
                  onClick={() => copyLyrics(selectedLyric)}
                  className="h-10 px-4 rounded-lg bg-[var(--bg-medium)] text-white font-semibold text-sm flex items-center gap-2 border border-white/10 hover:border-white/20 transition font-['Inter']"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => deleteLyric(selectedLyric.id)}
                  className="h-10 px-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition font-['Inter']"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LyricLibrary;

