import { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronDown, ChevronUp, Sparkles, Save, Check, Sliders, RotateCcw, Info, History, Zap, Copy, Layers } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { generateAlbumArtwork } from "./album-art-generator";
import { WaveformPlayer } from "./waveform-player";
import { DNAPresetSelector } from "@/components/DNAPresetSelector";
import { MOCK_DNA_PRESETS } from "@/data/mockDNAPresets"; // required for preset promptHint lookup

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
  /** For future API: DNA preset used for generation */
  dnaPresetId?: string | null;
  /** For future API: "dna" | "prompt-only" */
  generationMethod?: "dna" | "prompt-only";
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
  "Acid House",
];

/** Genre templates: selecting one sets both genre and vibe prompt. */
const GENRE_TEMPLATES: Record<string, string> = {
  House: "Create a classic house track with warm basslines, soulful chord stabs, punchy 4/4 kick drums, and an uplifting groove. Energetic yet smooth.",
  Techno: "Create a dark, driving techno track with industrial textures, hypnotic loops, heavy kick drums, and a relentless mechanical energy. Raw and powerful.",
  "Deep House": "Create a deep house track with lush chords, subtle basslines, warm pads, and a late-night intimate atmosphere. Soulful and hypnotic.",
  Ambient: "Create an ambient track with ethereal textures, floating pads, minimal percussion, and a meditative atmosphere. Calm and spacious.",
  "Tech House": "Create a tech house track with groovy basslines, percussive loops, minimal vocals, and a driving underground club energy. Funky and hypnotic.",
  "Melodic Techno": "Create a melodic techno track with emotional synth leads, atmospheric pads, driving rhythms, and a euphoric yet dark energy. Cinematic and powerful.",
  Trance: "Create a trance track with soaring arpeggios, euphoric breakdowns, driving basslines, and an uplifting emotional journey. Epic and energetic.",
  Minimal: "Create a minimal techno track with sparse percussion, subtle textures, hypnotic repetition, and a stripped-back underground feel. Focused and meditative.",
  "Acid House": "Create an acid house track with squelchy 303 basslines, punchy drums, raw energy, and a classic Chicago warehouse vibe. Gritty and infectious.",
  "Afro House": "Create an afro house track with tribal percussion, warm organic textures, deep basslines, and a spiritual rhythmic energy. Earthy and hypnotic.",
};

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
  const [promptSource, setPromptSource] = useState<"active" | "preset">("preset");
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [pendingPromptSource, setPendingPromptSource] = useState<"active" | "preset" | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [dnaSectionExpanded, setDnaSectionExpanded] = useState(false);

  const dnaSectionRef = useRef<HTMLDivElement>(null);
  const hasScrolledToDnaRef = useRef(false);

  // Scroll DNA section into view once when on Vibe tab (idle) so it's not missed below the fold
  useEffect(() => {
    if (activeTab !== "vibe" || createState !== "idle" || hasScrolledToDnaRef.current) return;
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (dnaSectionRef.current && !hasScrolledToDnaRef.current) {
          hasScrolledToDnaRef.current = true;
          dnaSectionRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });
    return () => cancelAnimationFrame(t);
  }, [activeTab, createState]);
    
    // Check for lyrics from Lyric Lab on mount
    useEffect(() => {
      const lyricLabData = localStorage.getItem('lyricLabData');
      if (lyricLabData) {
        try {
          const data = JSON.parse(lyricLabData);
          // Only use data if it's recent (within last minute)
          if (data.timestamp && Date.now() - data.timestamp < 60000) {
            // Switch to lyrics tab
            setActiveTab("lyrics");
            // Set lyrics text
            setLyricsPrompt(data.lyrics || '');
            // Optionally set genre, BPM, key if they match
            if (data.genre && genres.includes(data.genre)) {
              setSelectedGenre(data.genre);
            }
            if (data.bpm && data.bpm >= 100 && data.bpm <= 180) {
              // BPM is set via duration in this component, so we skip it
            }
            if (data.key) {
              // Key could be set if there's a key selector
            }
            toast.success("Lyrics loaded from Lyric Lab");
            // Clear the data after using it
            localStorage.removeItem('lyricLabData');
          }
        } catch (error) {
          console.error('Error parsing lyric lab data:', error);
          localStorage.removeItem('lyricLabData');
        }
      }
    }, []);

    // Check for lyrics from Lyric Library on mount
    useEffect(() => {
      const lyricLibraryData = localStorage.getItem('lyricLibraryData');
      if (lyricLibraryData) {
        try {
          const data = JSON.parse(lyricLibraryData);
          // Only use data if it's recent (within last minute)
          if (data.timestamp && Date.now() - data.timestamp < 60000) {
            // Switch to lyrics tab
            setActiveTab("lyrics");
            // Set lyrics text
            setLyricsPrompt(data.lyrics || '');
            // Optionally set genre if it matches
            if (data.genre && genres.includes(data.genre)) {
              setSelectedGenre(data.genre);
            }
            toast.success("Lyrics loaded from Lyric Library");
            // Clear the data after using it
            localStorage.removeItem('lyricLibraryData');
          }
        } catch (error) {
          console.error('Error parsing lyric library data:', error);
          localStorage.removeItem('lyricLibraryData');
        }
      }
    }, []);
  
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

  // Genre template dropdown: when user selects a template, we set both genre and prompt
  const [selectedGenreTemplate, setSelectedGenreTemplate] = useState<string>("");

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
    
    // DNA attribution for future API
    const generationMethod: "dna" | "prompt-only" = selectedPresetId ? "dna" : "prompt-only";

    // Set generating state - this triggers the animated loading screen
    setCreateState("generating");
    setIsGenerating(true);

    // Simulate AI generation - wait 3 seconds
    setTimeout(() => {
      // Generate 3 track versions (include dnaPresetId and generationMethod for future API)
      const tracks: GeneratedTrack[] = ["A", "B", "C"].map((version) => ({
        id: version,
        label: `Version ${version}`,
        title: generateTrackTitle(prompt, version),
        bpm: generateBPM(),
        key: generateKey(),
        duration: generateDuration(),
        isPlaying: version === "A", // Version A starts as "NOW PLAYING"
        dnaPresetId: selectedPresetId ?? undefined,
        generationMethod,
      }));

      setGeneratedTracks(tracks);
      setIsGenerating(false);
      // After generation, show the results in the idle state (not complete state)
      setCreateState("idle");
    }, 3000);
  };


  const saveTrackToLibrary = (track: GeneratedTrack) => {
    try {
      const existingTracksStr = localStorage.getItem('libraryTracks');
      const existingTracks = existingTracksStr ? JSON.parse(existingTracksStr) : [];

      const version = (track.id === "A" || track.id === "B" || track.id === "C")
        ? track.id as "A" | "B" | "C"
        : "A" as "A" | "B" | "C";

      const energyLevels = ["Rising", "Peak", "Building", "Groove", "Steady", "Deep", "Chill"];
      const energy = energyLevels[Math.floor(Math.random() * energyLevels.length)];

      const artwork = generateAlbumArtwork(track.title, track.bpm, track.key, energy, version);

      const generationMethod = track.dnaPresetId ? "dna" : "prompt-only";
      const dnaPreset = track.dnaPresetId
        ? MOCK_DNA_PRESETS.find((p) => p.id === track.dnaPresetId)
        : null;
      const defaultRoyalty = { creator: 40, dnaArtist: 40, platform: 20 };

      const newTrack = {
        id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: track.title,
        artist: "You",
        bpm: track.bpm,
        key: track.key,
        duration: track.duration,
        energy,
        version,
        status: null as "NOW PLAYING" | "UP NEXT" | "READY" | "PLAYED" | null,
        dateAdded: new Date().toISOString().split("T")[0],
        artwork,
        dnaPresetId: track.dnaPresetId ?? undefined,
        dnaArtistName: dnaPreset?.artistName ?? undefined,
        dnaPresetName: dnaPreset?.presetName ?? undefined,
        generationMethod,
        royaltySplit: defaultRoyalty,
        promptUsed: userPrompt || undefined,
      };

      const updatedTracks = [...existingTracks, newTrack];
      localStorage.setItem("libraryTracks", JSON.stringify(updatedTracks));

      toast.success(`Saved "${track.title}" to Library`);
    } catch (error) {
      console.error("Error saving track to library:", error);
      toast.error("Failed to save track to library");
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
      setSelectedGenreTemplate("");
      setIsPromptFromDNA(true);
    }
  }, []);

  // Handle manual editing - removes DNA label and clears genre template selection
  const handleVibePromptChange = (value: string) => {
    setVibePrompt(value);
    setSelectedGenreTemplate("");
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
      setSelectedGenreTemplate("");
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
                    <button 
                      onClick={() => {
                        toast.info(`Extracting stems for ${version.title || `Version ${version.id}`}...`);
                        // TODO: Implement stem extraction logic
                      }}
                      className="flex-1 h-9 rounded-lg bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm text-white/50 hover:text-white/70 flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Extract Stems</span>
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
        <div className="h-full flex flex-col overflow-hidden" style={{ background: 'var(--bg-0)' }}>
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
                      color: 'var(--text)', 
                      marginBottom: '4px',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}>
                      Create Track
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>
                      Describe your vibe. We'll generate 3 versions.
                    </p>
        </div>

                  <div style={{
                    background: 'linear-gradient(180deg, var(--surface), var(--surface-2))',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}>
              {/* Tabs */}
                <div style={{ 
                  display: 'flex', 
                  background: 'var(--panel)', 
                  borderRadius: '8px', 
                  padding: '4px', 
                  marginBottom: generatedTracks.length > 0 ? '12px' : '20px' 
                }}>
                <button
                  onClick={() => setActiveTab("vibe")}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: activeTab === "vibe" ? 'linear-gradient(90deg, var(--orange), var(--orange-2))' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      color: activeTab === "vibe" ? '#000' : 'var(--text-3)',
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
                      background: activeTab === "lyrics" ? 'linear-gradient(90deg, #ff6b35, #ff8c00)' : 'transparent',
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
                {/* Genre Templates dropdown */}
                {activeTab === "vibe" && (
                  <div className={generatedTracks.length > 0 ? "mb-3" : "mb-4"}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-white/40" />
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Genre Templates</label>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedGenreTemplate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedGenreTemplate(value);
                          if (value && GENRE_TEMPLATES[value]) {
                            setSelectedGenre(value);
                            setVibePrompt(GENRE_TEMPLATES[value]);
                            toast.success(`Applied ${value} template`);
                          }
                        }}
                        className="w-full h-9 pl-3 pr-8 rounded-lg border border-white/10 bg-black/40 text-white text-sm appearance-none cursor-pointer focus:border-secondary/50 focus:ring-secondary/20 backdrop-blur-sm"
                      >
                        <option value="">Select a template…</option>
                        {Object.keys(GENRE_TEMPLATES).map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Prompt History Dropdown - always visible on vibe tab */}
                {activeTab === "vibe" && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <History className="w-4 h-4 text-white/40" />
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Prompt History</label>
                    </div>
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setVibePrompt(e.target.value);
                            setSelectedGenreTemplate("");
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

                {/* Choose DNA Preset - accordion closed by default; horizontal carousel when open */}
                {activeTab === "vibe" && (
                  <div ref={dnaSectionRef} className="mb-6">
                    {DNAPresetSelector ? (
                      <DNAPresetSelector
                        selectedId={selectedPresetId}
                        onSelect={(id) => {
                          setSelectedPresetId(id);
                          if (id) {
                            const preset = MOCK_DNA_PRESETS.find((p) => p.id === id);
                            if (preset?.promptHint) {
                              setVibePrompt(preset.promptHint);
                              setSelectedGenreTemplate("");
                              setIsPromptFromDNA(true);
                            }
                          }
                        }}
                        defaultExpanded={false}
                        expanded={dnaSectionExpanded}
                        onExpandedChange={setDnaSectionExpanded}
                      />
                    ) : (
                      <div className="rounded-lg border border-white/20 bg-white/5 p-4 text-white/70">
                        Loading presets...
                      </div>
                    )}
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

                {/* Selected DNA preset summary above Generate */}
                {activeTab === "vibe" && selectedPresetId && (() => {
                  const preset = MOCK_DNA_PRESETS.find((p) => p.id === selectedPresetId);
                  if (!preset) return null;
                  return (
                    <div
                      className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 mb-4"
                      style={{
                        background: "var(--panel)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {preset.imageUrl ? (
                          <img
                            src={preset.imageUrl}
                            alt={preset.artistName}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-white/80 font-bold text-sm"
                            style={{ background: "var(--panel-2)" }}
                          >
                            {preset.artistName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium text-white truncate">
                          Generating with: {preset.artistName} DNA
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDnaSectionExpanded(true)}
                        className="shrink-0 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  );
                })()}

                {/* Generate Button */}
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating}
                  style={{
                    width: '100%',
                    padding: generatedTracks.length > 0 ? '12px 20px' : '14px 24px',
                    background: isGenerating ? 'rgba(18, 200, 255, 0.5)' : 'var(--cyan)',
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
                    boxShadow: isGenerating ? 'none' : 'var(--glow-orange)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Sparkles style={{ width: '20px', height: '20px' }} />
                  <span>{isGenerating ? "Generating..." : "Generate Track"}</span>
                  </button>

              {/* Footer Note */}
                <p style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-3)', 
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
                  background: 'var(--panel-2)',
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
                          color: 'var(--text)', 
                          marginBottom: '8px',
                          fontFamily: 'Rajdhani, sans-serif',
                        }}>
                          Your Generated Tracks
                        </h2>
                        <p style={{ fontSize: '13px', color: '#888' }}>
                          Based on: "{userPrompt}"
                        </p>
                </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Version A - Top Left - NOW PLAYING */}
                        {(() => {
                          const trackA = generatedTracks.find(t => t.id === 'A');
                          if (!trackA) return null;
                          
                          return (
                            <div key="version-a" className="col-span-1">
                              <div 
                                className="relative overflow-hidden transition-all duration-200 cursor-pointer group" 
                                style={{ 
                                  background: 'var(--panel)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  border: '2px solid var(--orange-2)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.border = '2px solid var(--orange-2)';
                                  e.currentTarget.style.background = 'rgba(255, 107, 0, 0.15)';
                                  e.currentTarget.style.transform = 'scale(1.02)';
                                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.border = '2px solid var(--orange-2)';
                                  e.currentTarget.style.background = 'var(--panel)';
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                {/* NOW PLAYING Badge */}
                                <div style={{
                                  display: 'inline-block',
                                  background: 'var(--orange-2)',
                                  color: '#000',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  marginBottom: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  NOW PLAYING
                                </div>

                                {/* Version Label */}
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  marginBottom: '16px'
                                }}>
                                  <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    background: 'var(--orange-2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#000'
                                  }}>
                                    A
                          </div>
                          <div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text)' }}>
                                      Version A
                          </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-3)' }}>
                                      {trackA.label || 'Late-night, Warehouse, Underground'}
                        </div>
                          </div>
                      </div>

                                {/* Waveform Player */}
                                <WaveformPlayer
                                  trackId="version-a"
                                  duration={trackA.duration}
                                  bpm={trackA.bpm}
                                  keySignature={trackA.key}
                                  isActive={true}
                                />

                                {/* Action Buttons */}
                                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                  <button 
                                    onClick={() => saveTrackToLibrary(trackA)}
                                    style={{
                                      flex: 1,
                                      background: 'var(--border)',
                                      border: 'none',
                                      color: 'var(--text)',
                                      padding: '12px',
                                      borderRadius: '8px',
                                      fontSize: '15px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = 'var(--surface)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'var(--border)';
                                    }}
                                  >
                                    Save to Library
                                  </button>
                      </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Version B - Top Right */}
                        {(() => {
                          const trackB = generatedTracks.find(t => t.id === 'B');
                          if (!trackB) return null;
                          
                          return (
                            <div key="version-b" className="col-span-1">
                              <div 
                                className="relative overflow-hidden transition-all duration-200 cursor-pointer group" 
                                style={{ 
                                  background: 'var(--panel)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  border: '1px solid var(--border)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.border = '2px solid var(--orange-2)';
                                  e.currentTarget.style.background = 'rgba(255, 107, 0, 0.15)';
                                  e.currentTarget.style.transform = 'scale(1.02)';
                                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.border = '1px solid var(--border)';
                                  e.currentTarget.style.background = 'var(--panel)';
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  marginBottom: '16px'
                                }}>
                                  <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    background: 'var(--orange-2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#000'
                                  }}>
                                    B
                        </div>
                                  <div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text)' }}>
                                      Version B
                        </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-3)' }}>
                                      {trackB.label || 'Late-night, Warehouse, Underground'}
                                    </div>
                        </div>
                      </div>

                                <WaveformPlayer
                                  trackId="version-b"
                                  duration={trackB.duration}
                                  bpm={trackB.bpm}
                                  keySignature={trackB.key}
                                  isActive={false}
                                />

                                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <button
                                    onClick={() => saveTrackToLibrary(trackB)}
                                    style={{
                                      flex: 1,
                                      background: 'var(--border)',
                                      border: 'none',
                                      color: 'var(--text)',
                                      padding: '12px',
                                      borderRadius: '8px',
                                      fontSize: '15px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = 'var(--surface)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'var(--border)';
                                    }}
                                  >
                                    Save to Library
                      </button>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Version C - Bottom Left */}
                        {(() => {
                          const trackC = generatedTracks.find(t => t.id === 'C');
                          if (!trackC) return null;
                          
                          return (
                            <div key="version-c" className="col-span-1">
                              <div 
                                className="relative overflow-hidden transition-all duration-200 cursor-pointer group" 
                                style={{
                                  background: 'var(--panel)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  border: '1px solid var(--border)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.border = '2px solid var(--orange-2)';
                                  e.currentTarget.style.background = 'rgba(255, 107, 0, 0.15)';
                                  e.currentTarget.style.transform = 'scale(1.02)';
                                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.border = '1px solid var(--border)';
                                  e.currentTarget.style.background = 'var(--panel)';
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  marginBottom: '16px'
                                }}>
                                  <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    background: 'var(--orange-2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#000'
                                  }}>
                                    C
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text)' }}>
                                      Version C
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-3)' }}>
                                      {trackC.label || 'Late-night, Warehouse, Underground'}
                                    </div>
                                  </div>
                                </div>

                                <WaveformPlayer
                                  trackId="version-c"
                                  duration={trackC.duration}
                                  bpm={trackC.bpm}
                                  keySignature={trackC.key}
                                  isActive={false}
                                />

                                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                  <button 
                                    onClick={() => saveTrackToLibrary(trackC)}
                                    style={{
                                      flex: 1,
                                      background: 'var(--border)',
                                      border: 'none',
                                      color: 'var(--text)',
                                      padding: '12px',
                                      borderRadius: '8px',
                                      fontSize: '15px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = 'var(--surface)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'var(--border)';
                                    }}
                      >
                        Save to Library
                      </button>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Empty - Bottom Right */}
                        <div className="col-span-1" style={{
                          border: '2px dashed var(--border)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '300px',
                          opacity: 0.5
                        }}>
                          <span style={{ color: 'var(--text-3)', fontSize: '15px' }}>Reserved</span>
                    </div>
                </div>
                    </>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      color: 'var(--text-3)',
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