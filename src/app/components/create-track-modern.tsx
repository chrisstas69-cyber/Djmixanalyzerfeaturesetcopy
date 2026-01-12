import { useState, useEffect } from "react";
import { Play, Pause, ChevronDown, ChevronUp, Sparkles, Save, Check, Sliders, RotateCcw, Info, History, Zap, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { generateAlbumArtwork } from "./album-art-generator";

type CreateState = "idle" | "generating" | "complete";
type ActiveTab = "vibe" | "lyrics";

interface TrackVersion {
  id: string;
  label: string;
  title: string;
  artist: string;
  duration: string;
  playing: boolean;
  saved: boolean;
}

interface GeneratedTrack {
  id: string;
  label: string;
  title: string;
  bpm: number;
  key: string;
  duration: string;
  isPlaying: boolean;
}

const genres = [
  "House",
  "Afro House",
  "Amapiano",
  "Deep House",
  "Tech House",
  "Jackin House",
  "Soulful House",
  "Nu Disco",
  "Melodic Techno",
  "Indie Dance",
  "Progressive House",
  "Electro",
  "Peak Time Techno",
  "Deep Techno",
  "Hard Techno",
  "Minimal",
  "Organic House",
  "Garage",
  "Breaks",
  "Drum & Bass",
  "Trance",
  "Downtempo",
  "DJ Tools",
];

export function CreateTrackModern() {
  const [createState, setCreateState] = useState<CreateState>("idle");
  const [activeTab, setActiveTab] = useState<ActiveTab>("vibe");
  const [vibePrompt, setVibePrompt] = useState("");
  const [lyricsPrompt, setLyricsPrompt] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("House");
  const [duration, setDuration] = useState("5–6 min");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  
  // DNA prompt generation state
  const [isPromptFromDNA, setIsPromptFromDNA] = useState(false);
  const [promptSource, setPromptSource] = useState<"active" | "preset">("active");
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [pendingPromptSource, setPendingPromptSource] = useState<"active" | "preset" | null>(null);
  
  // Mock Active DNA (TODO: Connect to actual DNA state)
  const hasActiveDNA = true; // Set to true for demo
  const activeDNA = hasActiveDNA ? {
    name: "Berlin Underground",
    genre: "Deep House",
    energy: "Rising",
    groove: "Hypnotic",
    harmonic: "Dark Minor",
    mood: ["Late-night", "Warehouse", "Underground", "Minimal"]
  } : null;

  // Available DNA presets for dropdown
  const dnaPresets = [
    { id: "active", name: "Active DNA" },
    { id: "berlin", name: "Berlin Underground" },
    { id: "detroit", name: "Detroit Techno" },
    { id: "chicago", name: "Chicago House" },
    { id: "london", name: "London Garage" },
  ];
  
  // Advanced sliders (hidden for v1)
  const [energyBias, setEnergyBias] = useState(50);
  const [grooveTightness, setGrooveTightness] = useState(50);
  const [bassWeight, setBassWeight] = useState(50);
  const [vocalPresence, setVocalPresence] = useState(20);
  const [mixPolish, setMixPolish] = useState(80);

  // Track versions
  const [versions, setVersions] = useState<TrackVersion[]>([
    {
      id: "A",
      label: "Version A",
      title: "Untitled Track",
      artist: "Artist Name",
      duration: "5:42",
      playing: false,
      saved: false,
    },
    {
      id: "B",
      label: "Version B",
      title: "Untitled Track",
      artist: "Artist Name",
      duration: "5:38",
      playing: false,
      saved: false,
    },
    {
      id: "C",
      label: "Version C",
      title: "Untitled Track",
      artist: "Artist Name",
      duration: "5:45",
      playing: false,
      saved: false,
    },
  ]);

  // Generating simulation
  useEffect(() => {
    if (createState === "generating") {
      let currentProgress = 0;
      let stepIndex = 0;
      const interval = setInterval(() => {
        currentProgress += 1.2;
        setProgress(currentProgress);
        
        // Update step index for cycling status
        stepIndex = Math.floor(currentProgress / 33) % 3;

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCreateState("complete");
            setProgress(0);
          }, 500);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [createState]);

  // Load prompt history from localStorage
  useEffect(() => {
    try {
      const historyStr = localStorage.getItem('promptHistory');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        setPromptHistory(history);
      }
    } catch (error) {
      console.error('Error loading prompt history:', error);
    }
  }, []);

  // Save prompt to history
  const savePromptToHistory = (prompt: string) => {
    if (!prompt.trim()) return;
    
    try {
      const historyStr = localStorage.getItem('promptHistory');
      let history: string[] = historyStr ? JSON.parse(historyStr) : [];
      
      // Remove if already exists
      history = history.filter(p => p !== prompt);
      
      // Add to beginning
      history.unshift(prompt);
      
      // Keep only last 10
      history = history.slice(0, 10);
      
      localStorage.setItem('promptHistory', JSON.stringify(history));
      setPromptHistory(history);
    } catch (error) {
      console.error('Error saving prompt history:', error);
    }
  };

  // Quick templates
  const templates = {
    House: "Create a classic house track with a groovy bassline, uplifting piano chords, and soulful vocals. Perfect for peak time dance floors.",
    Techno: "Generate a driving techno track with heavy kick drums, dark atmospheric pads, and industrial percussion. Raw and powerful energy.",
    "Deep House": "Make a deep house track with smooth bass, warm pads, subtle percussion, and a laid-back groove. Perfect for late night vibes.",
    Ambient: "Create an ambient track with ethereal textures, floating pads, minimal percussion, and a meditative atmosphere. Calm and spacious."
  };

  // Apply template
  const applyTemplate = (templateName: keyof typeof templates) => {
    setVibePrompt(templates[templateName]);
    toast.success(`Applied ${templateName} template`);
  };

  // Generate status messages based on progress
  const getStatusMessage = (versionOffset: number) => {
    const step = Math.floor(progress / 33 + versionOffset) % 3;
    const messages = ["Analyzing prompt", "Building arrangement", "Mixing & leveling"];
    return messages[step];
  };

  const togglePlay = (versionId: string) => {
    setVersions((prev) =>
      prev.map((v) => ({
        ...v,
        playing: v.id === versionId ? !v.playing : false,
      }))
    );
  };

  const updateVersion = (versionId: string, field: "title" | "artist", value: string) => {
    setVersions((prev) => prev.map((v) => (v.id === versionId ? { ...v, [field]: value } : v)));
  };

  const saveVersion = (versionId: string) => {
    setVersions((prev) => prev.map((v) => (v.id === versionId ? { ...v, saved: true } : v)));
  };

  // Generate track title from prompt
  const generateTrackTitle = (prompt: string, version: string): string => {
    if (!prompt.trim()) return `Untitled Track ${version}`;
    
    // Extract key words from prompt
    const words = prompt.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (words.length === 0) return `Untitled Track ${version}`;
    
    // Create a title from first few meaningful words
    const titleWords = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1));
    return `${titleWords.join(" ")} ${version}`;
  };

  // Generate random BPM between 120-140
  const generateBPM = (): number => {
    return Math.floor(Math.random() * 21) + 120; // 120-140
  };

  // Generate random key
  const generateKey = (): string => {
    const keys = ["Am", "Cm", "Fm", "Gm"];
    return keys[Math.floor(Math.random() * keys.length)];
  };

  // Generate random duration between 5:00-7:00
  const generateDuration = (): string => {
    const totalSeconds = Math.floor(Math.random() * 121) + 300; // 300-420 seconds (5:00-7:00)
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleGenerate = (saveToHistory: boolean = true) => {
    if (isGenerating) return;
    
    // Validate input
    const prompt = vibePrompt.trim();
    if (prompt.length === 0) {
      toast.error("Please enter a track description or vibe");
      return;
    }
    if (prompt.length > 500) {
      toast.error("Prompt is too long. Please keep it under 500 characters.");
      return;
    }
    
    // Store the user's prompt
    setUserPrompt(prompt || "Untitled Track");
    
    // Save to history if requested
    if (saveToHistory) {
      savePromptToHistory(prompt);
    }
    
    // Set generating state - this triggers the animated loading screen
    setCreateState("generating");
    setIsGenerating(true);
    
    // Simulate AI generation - wait 3 seconds
    setTimeout(() => {
      // Generate 3 track versions
      const tracks: GeneratedTrack[] = ["A", "B", "C"].map((version) => ({
        id: version,
        label: `Version ${version}`,
        title: generateTrackTitle(prompt, version),
        bpm: generateBPM(),
        key: generateKey(),
        duration: generateDuration(),
        isPlaying: version === "A", // Version A starts as "NOW PLAYING"
      }));
      
      setGeneratedTracks(tracks);
      setIsGenerating(false);
      // After generation, show the results in the idle state (not complete state)
      setCreateState("idle");
    }, 3000);
  };


  const saveTrackToLibrary = (track: GeneratedTrack) => {
    try {
      // Read existing tracks from localStorage first
      const existingTracksStr = localStorage.getItem('libraryTracks');
      const existingTracks = existingTracksStr ? JSON.parse(existingTracksStr) : [];
      
      // Extract version - track.id is already "A", "B", or "C"
      const version = (track.id === "A" || track.id === "B" || track.id === "C") 
        ? track.id as "A" | "B" | "C"
        : "A" as "A" | "B" | "C";
      
      // Generate energy as string (matching Track interface - using similar values to MOCK_TRACKS)
      const energyLevels = ["Rising", "Peak", "Building", "Groove", "Steady", "Deep", "Chill"];
      const energy = energyLevels[Math.floor(Math.random() * energyLevels.length)];
      
      // Generate unique album artwork based on track metadata
      const artwork = generateAlbumArtwork(track.title, track.bpm, track.key, energy, version);
      
      // Create track object matching Track interface exactly
      const newTrack = {
        id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: track.title,
        artist: "You",
        bpm: track.bpm,
        key: track.key,
        duration: track.duration,
        energy: energy,
        version: version,
        status: null as "NOW PLAYING" | "UP NEXT" | "READY" | "PLAYED" | null,
        dateAdded: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        artwork: artwork, // Add generated artwork
      };
      
      // Append new track to existing array
      const updatedTracks = [...existingTracks, newTrack];
      
      // Save back to localStorage with key "libraryTracks"
      localStorage.setItem('libraryTracks', JSON.stringify(updatedTracks));
      
      toast.success(`Saved "${track.title}" to Library`);
    } catch (error) {
      console.error('Error saving track to library:', error);
      toast.error('Failed to save track to library');
    }
  };

  const handleReset = () => {
    setCreateState("idle");
    setVersions((prev) =>
      prev.map((v) => ({
        ...v,
        title: "Untitled Track",
        artist: "Artist Name",
        playing: false,
        saved: false,
      }))
    );
    // Clear generated tracks
    setGeneratedTracks([]);
    setUserPrompt("");
    setIsGenerating(false);
  };

  // Generate prompt text from DNA
  const generatePromptFromDNA = (dna: typeof activeDNA) => {
    if (!dna) return "";
    
    const moodStr = dna.mood.join(", ").toLowerCase();
    const energyDescriptor = dna.energy.toLowerCase();
    const grooveDescriptor = dna.groove.toLowerCase();
    const harmonicDescriptor = dna.harmonic.toLowerCase().replace("minor", "").trim();
    
    return `${moodStr} ${dna.genre.toLowerCase()} groove with rolling bass, ${grooveDescriptor} percussion, ${energyDescriptor} energy curve, ${harmonicDescriptor} melodic elements, deep underground feel.`;
  };

  // Auto-populate prompt on mount if DNA exists
  useEffect(() => {
    if (hasActiveDNA && activeDNA && vibePrompt === "" && createState === "idle") {
      const generatedPrompt = generatePromptFromDNA(activeDNA);
      setVibePrompt(generatedPrompt);
      setIsPromptFromDNA(true);
    }
  }, []);

  // Handle manual editing - removes DNA label
  const handleVibePromptChange = (value: string) => {
    setVibePrompt(value);
    if (isPromptFromDNA) {
      setIsPromptFromDNA(false);
    }
  };

  // Handle prompt source change
  const handlePromptSourceChange = (newSource: "active" | "preset") => {
    if (vibePrompt.trim() !== "") {
      // Show confirmation if there's existing text
      setPendingPromptSource(newSource);
      setShowReplaceConfirm(true);
    } else {
      // No text, change immediately
      applyPromptSource(newSource);
    }
  };

  // Apply the new prompt source
  const applyPromptSource = (source: "active" | "preset") => {
    setPromptSource(source);
    if (hasActiveDNA && activeDNA) {
      const generatedPrompt = generatePromptFromDNA(activeDNA);
      setVibePrompt(generatedPrompt);
      setIsPromptFromDNA(true);
    }
    setShowReplaceConfirm(false);
    setPendingPromptSource(null);
  };

  // Cancel prompt source change
  const cancelPromptSourceChange = () => {
    setShowReplaceConfirm(false);
    setPendingPromptSource(null);
  };

  // Generating State
  if (createState === "generating") {
    return (
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-darkest, #080808)' }}>
        {/* Header */}
        <div 
          className="px-8 py-6"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}>Create Track</h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary, #666666)' }}>Describe your vibe. We'll generate 3 versions.</p>
          </div>
        </div>

        {/* Generating Content */}
        <div className="flex-1 flex items-center justify-center py-12 px-8">
          <div className="w-full max-w-6xl">
            {/* Title Card */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-3">Cooking your track…</h2>
              <p className="text-white/50">Creating 3 versions</p>
            </div>

            {/* Three Placeholder Cards */}
            <div className="grid grid-cols-3 gap-6">
              {["A", "B", "C"].map((version, index) => (
                <div
                  key={version}
                  className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                >
                  {/* Version Label */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      {/* Animated glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-primary/40 rounded-xl blur-lg animate-pulse" />
                      {/* Badge */}
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-primary/20 border border-secondary/40 flex items-center justify-center font-semibold backdrop-blur-xl">
                        {version}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Version {version}</div>
                      <div className="text-sm text-white/40">{getStatusMessage(index)}</div>
                    </div>
                  </div>

                  {/* Animated Waveform Placeholder */}
                  <div className="mb-6 h-32 bg-black/60 border border-white/10 rounded-xl overflow-hidden relative backdrop-blur-xl">
                    {/* Animated waveform bars */}
                    <div className="absolute inset-0 flex items-center gap-px px-3">
                      {[...Array(70)].map((_, i) => {
                        // Create animated pattern
                        const animationDelay = i * 0.02;
                        const baseHeight = 30 + Math.sin(i / 5 + progress / 10) * 20 + Math.random() * 15;
                        const pulse = Math.sin(progress / 10 + i / 3) * 0.3 + 0.7;
                        const height = baseHeight * pulse;

                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col justify-center gap-0.5 transition-all duration-200"
                            style={{
                              transitionDelay: `${animationDelay}s`,
                            }}
                          >
                            {/* Top half */}
                            <div
                              className="w-full bg-gradient-to-t from-secondary/60 via-secondary/40 to-secondary/20 rounded-sm transition-all duration-300"
                              style={{ height: `${height / 2}%` }}
                            />
                            {/* Bottom half (mirrored) */}
                            <div
                              className="w-full bg-gradient-to-b from-secondary/60 via-secondary/40 to-secondary/20 rounded-sm transition-all duration-300"
                              style={{ height: `${height / 2}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Scanning line effect */}
                    <div
                      className="absolute inset-y-0 w-1 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-1000 ease-linear"
                      style={{ left: `${(progress % 100)}%` }}
                    />
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: "200ms" }} />
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: "400ms" }} />
                    </div>
                    <span className="text-sm text-white/50 font-medium">{getStatusMessage(index)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete State - Version Selection
  if (createState === "complete") {
    const versionDescriptions = {
      A: "Groove / Safe",
      B: "Peak / Energy",
      C: "Experimental",
    };

    return (
      <div className="h-full flex flex-col overflow-auto" style={{ background: 'var(--bg-darkest, #080808)' }}>
        {/* Header */}
        <div 
          className="px-8 py-6"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}>Create Track</h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary, #666666)' }}>Describe your vibe. We'll generate 3 versions.</p>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 py-10 px-8">
          <div className="max-w-6xl mx-auto">
            {/* Result Headline */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}>Choose your version</h2>
              <p style={{ color: 'var(--text-secondary, #a0a0a0)' }}>Preview, edit, and save your favorite</p>
            </div>

            {/* Version Cards */}
            <div className="grid grid-cols-3 gap-5 mb-8">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="group bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all backdrop-blur-xl"
                >
                  {/* Header */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-lg font-semibold">Version {version.id}</h3>
                      <span className="text-sm text-secondary">
                        {versionDescriptions[version.id as keyof typeof versionDescriptions]}
                      </span>
                    </div>
                  </div>

                  {/* CDJ-Style Horizontal Waveform */}
                  <div className="mb-5">
                    <div className="h-20 bg-black/70 border border-white/[0.15] rounded-xl overflow-hidden relative backdrop-blur-sm shadow-inner">
                      {/* Waveform */}
                      <div className="absolute inset-0 flex items-center px-2">
                        {[...Array(120)].map((_, i) => {
                          const bassPattern = Math.sin(i / 8) * 0.35;
                          const midPattern = Math.sin(i / 4) * 0.25;
                          const highPattern = Math.random() * 0.12;
                          const energy = version.id === "A" ? 0.7 : version.id === "B" ? 0.9 : 0.75;
                          const height = (bassPattern + midPattern + highPattern + 0.45) * energy * 100;

                          return (
                            <div key={i} className="flex-1 h-full flex items-center justify-center px-px">
                              <div
                                className="w-full bg-gradient-to-t from-secondary via-secondary/70 to-secondary/40 rounded-sm shadow-sm shadow-secondary/20"
                                style={{ height: `${height}%` }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Playhead */}
                      {version.playing && (
                        <div
                          className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-primary via-white to-primary shadow-lg shadow-primary/50 z-10"
                          style={{ left: "35%" }}
                        />
                      )}

                      {/* Timecode Display */}
                      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                        <span className="text-xs font-['IBM_Plex_Mono'] text-white/60 px-1.5 py-0.5 bg-black/60 rounded backdrop-blur-sm">
                          {version.playing ? "02:15" : "00:00"}
                        </span>
                        <span className="text-xs font-['IBM_Plex_Mono'] text-white/60 px-1.5 py-0.5 bg-black/60 rounded backdrop-blur-sm">
                          {version.duration}
                        </span>
                      </div>

                      {/* Playback overlay */}
                      {version.playing && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"
                          style={{ width: "35%" }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Play Button - DOMINANT */}
                  <div className="mb-5">
                    <button
                      onClick={() => togglePlay(version.id)}
                      className={`relative group/play w-full h-16 rounded-xl flex items-center justify-center gap-3 transition-all font-semibold shadow-xl ${
                        version.playing
                          ? "bg-gradient-to-r from-primary to-primary/80 border border-primary/60 text-white shadow-primary/30"
                          : "bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary border border-secondary/50 shadow-secondary/30"
                      }`}
                    >
                      {/* Glow */}
                      <div
                        className={`absolute inset-0 rounded-xl blur-xl transition-opacity ${
                          version.playing
                            ? "bg-primary opacity-40 group-hover/play:opacity-50"
                            : "bg-secondary opacity-30 group-hover/play:opacity-40"
                        }`}
                      />

                      {version.playing ? (
                        <>
                          <Pause className="relative w-6 h-6" />
                          <span className="relative text-lg">Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="relative w-6 h-6" />
                          <span className="relative text-lg">Play</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Editable Metadata */}
                  <div className="space-y-2.5 mb-5">
                    <Input
                      value={version.title}
                      onChange={(e) => updateVersion(version.id, "title", e.target.value)}
                      className="h-11 bg-black/50 border-white/[0.12] focus:border-secondary/40 focus:ring-secondary/20 rounded-lg text-base placeholder:text-white/30 backdrop-blur-sm"
                      placeholder="Track title..."
                    />
                    <Input
                      value={version.artist}
                      onChange={(e) => updateVersion(version.id, "artist", e.target.value)}
                      className="h-11 bg-black/50 border-white/[0.12] focus:border-secondary/40 focus:ring-secondary/20 rounded-lg text-base placeholder:text-white/30 backdrop-blur-sm"
                      placeholder="Artist name..."
                    />
                  </div>

                  {/* Primary Save Button */}
                  <div className="mb-4">
                    <button
                      onClick={() => saveVersion(version.id)}
                      disabled={version.saved}
                      className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                        version.saved
                          ? "bg-white/[0.08] text-white/50 border border-white/15 cursor-default"
                          : "bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white shadow-sm"
                      }`}
                    >
                      {version.saved ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Saved to Library</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Save to Library</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Secondary Actions (Subtle) */}
                  <div className="flex gap-2">
                    <button className="flex-1 h-9 rounded-lg bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm text-white/50 hover:text-white/70 flex items-center justify-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button className="flex-1 h-9 rounded-lg bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm text-white/50 hover:text-white/70 flex items-center justify-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                  
                  {/* DNA Indicator Microcopy - Bottom left, subtle */}
                  {hasActiveDNA && (
                    <div className="mt-4">
                      <p className="text-xs text-white/40">
                        Shaped by your DNA
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Action */}
            <div className="text-center pt-4">
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="rounded-xl border-white/20 hover:bg-white/5 px-10 h-12"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate New Versions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Idle State - Input Form
  return (
    <>
      <div className="h-full flex flex-col overflow-hidden" style={{ background: '#080808' }}>
        {/* Main Content */}
        <div style={{ flex: 1, padding: '24px 32px', overflow: 'hidden', minHeight: 0 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', height: '100%' }}>
            {/* Main Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 500px',
              gap: '32px',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden'
            }}>
              {/* Left Column - Main Input */}
              <div style={{
                overflowY: 'auto',
                paddingRight: '16px',
              }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                  <h1 style={{ 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#fff', 
                    marginBottom: '4px',
                    fontFamily: 'Rajdhani, sans-serif',
                  }}>
                    Create Track
                  </h1>
                  <p style={{ fontSize: '14px', color: '#888' }}>
                    Describe your vibe. We'll generate 3 versions.
                  </p>
                </div>

                <div style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                }}>
              {/* Tabs */}
              <div style={{ 
                display: 'flex', 
                background: '#111', 
                borderRadius: '8px', 
                padding: '4px', 
                marginBottom: generatedTracks.length > 0 ? '12px' : '20px' 
              }}>
                <button
                  onClick={() => setActiveTab("vibe")}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: activeTab === "vibe" ? '#00bcd4' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: activeTab === "vibe" ? '#000' : '#888',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Vibe / Prompt
                </button>
                <button
                  onClick={() => setActiveTab("lyrics")}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: activeTab === "lyrics" ? '#00bcd4' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: activeTab === "lyrics" ? '#000' : '#888',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Lyrics (optional)
                </button>
              </div>

              {/* Prompt Box */}
              <div className="mb-8">
                {/* Quick Templates */}
                {activeTab === "vibe" && (
                  <div className={generatedTracks.length > 0 ? "mb-3" : "mb-4"}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-white/40" />
                      <label className="text-xs font-medium text-white/50">Quick Templates</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(templates) as Array<keyof typeof templates>).map((templateName) => (
                        <button
                          key={templateName}
                          onClick={() => applyTemplate(templateName)}
                          className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white text-xs font-medium transition-all"
                        >
                          {templateName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prompt History Dropdown */}
                {activeTab === "vibe" && promptHistory.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <History className="w-4 h-4 text-white/40" />
                      <label className="text-xs font-medium text-white/50">Prompt History</label>
                    </div>
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setVibePrompt(e.target.value);
                            toast.success("Prompt loaded from history");
                          }
                        }}
                        className="w-full h-9 pl-3 pr-8 rounded-lg border border-white/10 bg-black/40 text-white text-sm appearance-none cursor-pointer focus:border-secondary/50 focus:ring-secondary/20 backdrop-blur-sm"
                        defaultValue=""
                      >
                        <option value="">Select a previous prompt...</option>
                        {promptHistory.map((prompt, index) => (
                          <option key={index} value={prompt}>
                            {prompt.length > 60 ? `${prompt.substring(0, 60)}...` : prompt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Prompt Source Dropdown - Only show if DNA exists */}
                {hasActiveDNA && activeTab === "vibe" && (
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-white/50">Prompt Source</label>
                    <div className="relative">
                      <select
                        value={promptSource}
                        onChange={(e) => handlePromptSourceChange(e.target.value as "active" | "preset")}
                        className="h-8 pl-3 pr-8 rounded-lg border border-white/10 bg-black/40 text-white text-xs appearance-none cursor-pointer focus:border-secondary/50 focus:ring-secondary/20 backdrop-blur-sm"
                      >
                        <option value="active">Active DNA</option>
                        <option value="preset">Choose DNA preset…</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* "Generated from your DNA" label - Only shows if prompt is from DNA and user hasn't edited */}
                {isPromptFromDNA && activeTab === "vibe" && (
                  <p className="text-[10px] text-white/40 mb-2 ml-1">
                    Generated from your DNA
                  </p>
                )}

                {activeTab === "vibe" ? (
                  <Textarea
                    value={vibePrompt}
                    onChange={(e) => handleVibePromptChange(e.target.value)}
                    placeholder="Late-night warehouse groove, rolling bass, hypnotic drums…"
                    className={generatedTracks.length > 0 ? "min-h-32 resize-none rounded-2xl border-white/10 bg-black/40 focus:border-secondary/50 focus:ring-secondary/20 text-base placeholder:text-white/30 backdrop-blur-sm" : "min-h-48 resize-none rounded-2xl border-white/10 bg-black/40 focus:border-secondary/50 focus:ring-secondary/20 text-base placeholder:text-white/30 backdrop-blur-sm"}
                  />
                ) : (
                  <Textarea
                    value={lyricsPrompt}
                    onChange={(e) => setLyricsPrompt(e.target.value)}
                    placeholder="Enter lyrics, verses, or vocal ideas here (optional)…"
                    className="min-h-48 resize-none rounded-2xl border-white/10 bg-black/40 focus:border-secondary/50 focus:ring-secondary/20 text-base placeholder:text-white/30 backdrop-blur-sm"
                  />
                )}
                
                {/* DNA Influence Microcopy - Only shows if Active DNA exists */}
                {hasActiveDNA && (
                  <p className="text-xs text-white/40 mt-2.5 ml-1">
                    Using your active DNA to guide groove, energy, and structure.
                  </p>
                )}
                
                <p className="text-sm text-white/40 mt-3 ml-1">
                  {activeTab === "vibe" ? "Lyrics optional. Vibe matters most." : "Leave blank for instrumental."}
                </p>
              </div>

              {/* Controls Row */}
              <div className={generatedTracks.length > 0 ? "grid grid-cols-3 gap-3 mb-4" : "grid grid-cols-3 gap-4 mb-6"}>
                {/* Genre Dropdown */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-white/60 mb-2 ml-1">Genre</label>
                  <div className="relative">
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-foreground appearance-none cursor-pointer focus:border-secondary/50 focus:ring-secondary/20 backdrop-blur-sm"
                    >
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>

                {/* Duration Segmented Control */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/60 mb-2 ml-1">Duration</label>
                  <div className="flex gap-2 h-12 p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur-sm">
                    {["3–4 min", "5–6 min", "7–8 min"].map((option) => (
                      <button
                        key={option}
                        onClick={() => setDuration(option)}
                        className={`flex-1 rounded-lg font-medium transition-all ${
                          duration === option
                            ? "bg-gradient-to-r from-secondary/30 to-primary/20 border border-secondary/40 text-white shadow-lg"
                            : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced options disabled for v1 - enable in v2 */}
              {/* 
              <div className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                  Advanced
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-6 p-6 rounded-2xl border border-white/10 bg-black/30 space-y-5 backdrop-blur-sm">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-white/70">Energy Bias</label>
                        <div className="flex gap-4 text-xs text-white/40">
                          <span>Safe</span>
                          <span>Wild</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={energyBias}
                        onChange={(e) => setEnergyBias(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-secondary [&::-webkit-slider-thumb]:to-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/50"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-white/70">Groove Tightness</label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={grooveTightness}
                        onChange={(e) => setGrooveTightness(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-secondary [&::-webkit-slider-thumb]:to-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/50"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-white/70">Bass Weight</label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bassWeight}
                        onChange={(e) => setBassWeight(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-secondary [&::-webkit-slider-thumb]:to-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/50"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-white/70">Vocal Presence</label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={vocalPresence}
                        onChange={(e) => setVocalPresence(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-secondary [&::-webkit-slider-thumb]:to-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/50"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-white/70">Mix Polish</label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mixPolish}
                        onChange={(e) => setMixPolish(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-secondary [&::-webkit-slider-thumb]:to-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/50"
                      />
                    </div>
                  </div>
                )}
              </div>
              */}

              {/* Generate Button */}
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  padding: generatedTracks.length > 0 ? '12px 20px' : '14px 24px',
                  background: isGenerating ? 'rgba(0,188,212,0.5)' : '#00bcd4',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '20px',
                  boxShadow: isGenerating ? 'none' : '0 0 30px rgba(0,188,212,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <Sparkles style={{ width: '20px', height: '20px' }} />
                <span>{isGenerating ? "Generating..." : "Generate Track"}</span>
              </button>

              {/* Footer Note */}
              <p style={{ 
                fontSize: '13px', 
                color: '#555', 
                textAlign: 'center', 
                marginTop: '16px' 
              }}>
                Generates 3 versions (A/B/C). Choose one to save.
              </p>
              </div>
              </div>

              {/* Right Column - Generated Tracks */}
              <div style={{ 
                overflowY: 'auto', 
                height: '100%',
                background: '#0a0a0a',
                borderRadius: '12px',
                padding: '24px'
              }}>

                {/* Generated Tracks Display */}
                {generatedTracks.length > 0 ? (
                  <>
                    <div style={{ marginBottom: '20px' }}>
                      <h2 style={{ 
                        fontSize: '20px', 
                        fontWeight: 600, 
                        color: '#fff', 
                        marginBottom: '8px',
                        fontFamily: 'Rajdhani, sans-serif',
                      }}>
                        Your Generated Tracks
                      </h2>
                      <p style={{ fontSize: '13px', color: '#888' }}>
                        Based on: "{userPrompt}"
                      </p>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '16px' 
                    }}>
                  {generatedTracks.map((track) => (
                    <div
                      key={track.id}
                      style={{
                        background: track.isPlaying ? 'rgba(255,107,53,0.1)' : '#111',
                        border: track.isPlaying ? '1px solid #ff6b35' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Version Label and NOW PLAYING Badge */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        marginBottom: '12px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            background: '#ff6b35',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '14px',
                          }}>
                            {track.id}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>
                            {track.label}
                          </span>
                        </div>
                        {track.isPlaying && (
                          <span style={{
                            padding: '4px 8px',
                            background: '#ff6b35',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#fff',
                            textTransform: 'uppercase',
                          }}>
                            NOW PLAYING
                          </span>
                        )}
                      </div>

                      {/* Track Title */}
                      <h3 style={{ 
                        fontSize: '13px', 
                        color: '#fff', 
                        marginBottom: '12px', 
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {track.title}
                      </h3>

                      {/* Track Details */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px', 
                        fontSize: '12px', 
                        color: '#888', 
                        marginBottom: '12px' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>BPM</span>
                          <span style={{ color: '#00bcd4', fontFamily: 'JetBrains Mono, monospace' }}>{track.bpm}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Key</span>
                          <span style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>{track.key}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Duration</span>
                          <span style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>{track.duration}</span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <button
                        onClick={() => {
                          setGeneratedTracks((prev) =>
                            prev.map((t) => ({
                              ...t,
                              isPlaying: t.id === track.id ? !t.isPlaying : false,
                            }))
                          );
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: track.isPlaying ? '#00bcd4' : 'transparent',
                          border: track.isPlaying ? 'none' : '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '6px',
                          color: track.isPlaying ? '#000' : '#fff',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                        }}
                      >
                        {track.isPlaying ? (
                          <>
                            <Pause style={{ width: '16px', height: '16px' }} />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play style={{ width: '16px', height: '16px' }} />
                            <span>Play</span>
                          </>
                        )}
                      </button>

                      <button 
                        onClick={() => {
                          try {
                            // 1) Create proper track object with all required fields
                            const version = (track.id === "A" || track.id === "B" || track.id === "C") 
                              ? track.id as "A" | "B" | "C"
                              : "A" as "A" | "B" | "C";
                            
                            const energyLevels = ["Rising", "Peak", "Building", "Groove", "Steady", "Deep", "Chill"];
                            const energy = energyLevels[Math.floor(Math.random() * energyLevels.length)];
                            
                            const newTrack = {
                              id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                              title: track.title,
                              artist: "You",
                              bpm: track.bpm,
                              key: track.key,
                              duration: track.duration,
                              energy: energy,
                              version: version,
                              status: null as "NOW PLAYING" | "UP NEXT" | "READY" | "PLAYED" | null,
                              dateAdded: new Date().toISOString().split('T')[0],
                            };
                            
                            // 2) Read existing libraryTracks from localStorage
                            const existingTracksStr = localStorage.getItem('libraryTracks');
                            const existingTracks = existingTracksStr ? JSON.parse(existingTracksStr) : [];
                            
                            // 3) Append the new track to the array
                            const updatedTracks = [...existingTracks, newTrack];
                            
                            // 4) Write the updated array back to localStorage
                            localStorage.setItem('libraryTracks', JSON.stringify(updatedTracks));
                            
                            // 5) Show success toast
                            toast.success(`Saved "${track.title}" to Library`);
                          } catch (error) {
                            console.error('Error saving track to library:', error);
                            toast.error('Failed to save track to library');
                          }
                        }}
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          padding: '10px',
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Save to Library
                      </button>
                      
                    </div>
                  ))}
                    </div>
                  </>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    color: '#666',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '14px', marginBottom: '8px' }}>No tracks generated yet</p>
                    <p style={{ fontSize: '12px' }}>Generate tracks to see them here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replace Prompt Confirmation Modal */}
      {showReplaceConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-white/[0.12] to-white/[0.06] border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4 backdrop-blur-xl shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">Replace current prompt?</h3>
            <p className="text-sm text-white/60 mb-6">
              This will replace your existing text with a new prompt generated from the selected DNA.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelPromptSourceChange}
                className="flex-1 h-11 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => applyPromptSource(pendingPromptSource || "active")}
                className="flex-1 h-11 rounded-xl bg-primary text-black font-medium hover:bg-primary/90 transition-all"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}