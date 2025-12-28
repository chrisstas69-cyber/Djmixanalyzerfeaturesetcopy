import { useState, useEffect } from "react";
import { Play, Pause, ChevronDown, ChevronUp, Sparkles, Save, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

type CreateState = "idle" | "generating" | "complete";

interface TrackVersion {
  id: string;
  label: string;
  description: string;
  title: string;
  artist: string;
  duration: string;
  playing: boolean;
  saved: boolean;
}

const genres = [
  "House",
  "Afro House",
  "Amapiano",
  "Deep House",
  "Tech House",
  "Jackin House",
  "Soulful/Funk/Disco",
  "Nu Disco",
  "Melodic House/Techno",
  "Indie Dance",
  "Progressive",
  "Electro",
  "Techno (Peak/Driving)",
  "Techno (Raw/Hypnotic)",
  "Hard Techno",
  "Minimal/Deep Tech",
  "Organic House/Downtempo",
  "Garage",
  "Breaks",
  "Drum & Bass",
  "Trance",
  "Chill Out",
  "DJ Tools",
];

export function CreateTrackPrimary() {
  const [createState, setCreateState] = useState<CreateState>("idle");
  const [prompt, setPrompt] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("House");
  const [duration, setDuration] = useState("5–6 minutes");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [progress, setProgress] = useState(0);

  // Advanced options
  const [energyBias, setEnergyBias] = useState("Medium");
  const [grooveTightness, setGrooveTightness] = useState("Medium");
  const [atmosphere, setAtmosphere] = useState("Warm");

  // Track versions
  const [versions, setVersions] = useState<TrackVersion[]>([
    {
      id: "A",
      label: "Version A",
      description: "Groove / Safe",
      title: "Untitled",
      artist: "Unknown Artist",
      duration: "5:42",
      playing: false,
      saved: false,
    },
    {
      id: "B",
      label: "Version B",
      description: "Peak / Energy",
      title: "Untitled",
      artist: "Unknown Artist",
      duration: "5:38",
      playing: false,
      saved: false,
    },
    {
      id: "C",
      label: "Version C",
      description: "Experimental",
      title: "Untitled",
      artist: "Unknown Artist",
      duration: "5:45",
      playing: false,
      saved: false,
    },
  ]);

  // Generating simulation
  useEffect(() => {
    if (createState === "generating") {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);

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

  const handleGenerate = () => {
    setCreateState("generating");
  };

  const handleReset = () => {
    setCreateState("idle");
    setVersions((prev) =>
      prev.map((v) => ({
        ...v,
        title: "Untitled",
        artist: "Unknown Artist",
        playing: false,
        saved: false,
      }))
    );
  };

  // Generating State
  if (createState === "generating") {
    return (
      <div className="h-full flex flex-col bg-[#0a0a0f]">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-6 bg-black/40">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-medium mb-1">Create Track</h1>
            <p className="text-sm text-white/50">Describe your idea and Syntax will generate multiple versions.</p>
          </div>
        </div>

        {/* Generating Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-xl text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-secondary animate-pulse" />
            </div>

            <h2 className="text-2xl font-medium mb-3">Generating your track…</h2>
            <p className="text-white/60 mb-12">Creating three unique versions</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <p className="font-['IBM_Plex_Mono'] text-sm text-white/50">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>
    );
  }

  // Complete State - Version Selection
  if (createState === "complete") {
    return (
      <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-6 bg-black/40">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-medium mb-1">Create Track</h1>
            <p className="text-sm text-white/50">Describe your idea and Syntax will generate multiple versions.</p>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 py-12 px-8">
          <div className="max-w-6xl mx-auto">
            {/* Result Headline */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium mb-3">Your track is ready — choose a version</h2>
              <p className="text-white/60">Each version offers a different interpretation of your idea</p>
            </div>

            {/* Version Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="bg-gradient-to-b from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
                >
                  {/* Version Label */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 flex items-center justify-center font-medium">
                        {version.id}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{version.label}</div>
                        <div className="text-sm text-white/50">{version.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Waveform Display - CDJ-3000 Style */}
                  <div className="mb-6 h-32 bg-black/40 border border-white/10 rounded-xl overflow-hidden relative">
                    {/* Waveform */}
                    <div className="absolute inset-0 flex items-center gap-px px-3">
                      {[...Array(80)].map((_, i) => {
                        // Create realistic waveform pattern
                        const bassPattern = Math.sin(i / 8) * 0.3;
                        const midPattern = Math.sin(i / 4) * 0.2;
                        const highPattern = Math.random() * 0.15;
                        const energy = version.id === "A" ? 0.6 : version.id === "B" ? 0.85 : 0.7;
                        const height = (bassPattern + midPattern + highPattern + 0.4) * energy * 100;

                        return (
                          <div key={i} className="flex-1 flex flex-col justify-center gap-0.5">
                            {/* Top half */}
                            <div
                              className="w-full bg-gradient-to-t from-secondary/80 to-secondary/40 rounded-sm"
                              style={{ height: `${height / 2}%` }}
                            />
                            {/* Bottom half (mirrored) */}
                            <div
                              className="w-full bg-gradient-to-b from-secondary/80 to-secondary/40 rounded-sm"
                              style={{ height: `${height / 2}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Playback Progress Overlay */}
                    {version.playing && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div
                          className="h-full bg-gradient-to-r from-primary/30 to-transparent border-r-2 border-primary"
                          style={{ width: "40%" }}
                        />
                      </div>
                    )}

                    {/* Duration Badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 border border-white/20 rounded text-xs font-['IBM_Plex_Mono'] text-white/80">
                      {version.duration}
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => togglePlay(version.id)}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-secondary/90 to-secondary/70 hover:from-secondary hover:to-secondary/80 border border-secondary/50 flex items-center justify-center gap-2 transition-all font-medium"
                    >
                      {version.playing ? (
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
                  </div>

                  {/* Editable Fields */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5 ml-1">Track Title</label>
                      <Input
                        value={version.title}
                        onChange={(e) => updateVersion(version.id, "title", e.target.value)}
                        className="h-10 bg-black/40 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 rounded-lg"
                        placeholder="Enter title..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5 ml-1">Artist Name</label>
                      <Input
                        value={version.artist}
                        onChange={(e) => updateVersion(version.id, "artist", e.target.value)}
                        className="h-10 bg-black/40 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 rounded-lg"
                        placeholder="Enter artist..."
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={() => saveVersion(version.id)}
                    disabled={version.saved}
                    className={`w-full h-11 rounded-xl transition-all ${
                      version.saved
                        ? "bg-white/10 text-white/60 border border-white/20 cursor-default"
                        : "bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20"
                    }`}
                  >
                    {version.saved ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Saved to Library
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save to Library
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>

            {/* Generate New Button */}
            <div className="text-center">
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="rounded-xl border-white/20 hover:bg-white/5 px-8"
              >
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
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-6 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium mb-1">Create Track</h1>
          <p className="text-sm text-white/50">Describe your idea and Syntax will generate multiple versions.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Form */}
          <div className="space-y-8">
            {/* Prompt Input - PRIMARY FOCUS */}
            <div>
              <label className="block text-base font-medium mb-4">Describe your track</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your track — vibe, mood, lyrics, or feeling&#10;Example: hypnotic afro house groove with warm bass and tribal percussion"
                className="min-h-40 resize-none rounded-2xl border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] focus:border-secondary/50 focus:ring-secondary/20 text-base placeholder:text-white/30"
              />
              <p className="text-sm text-white/40 mt-3 ml-1">
                Supports both instrumental prompts and lyrical ideas
              </p>
            </div>

            {/* Genre Selector */}
            <div>
              <label className="block text-base font-medium mb-4">Genre</label>
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] text-foreground appearance-none cursor-pointer focus:border-secondary/50 focus:ring-secondary/20 text-base"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-base font-medium mb-4">Duration</label>
              <div className="flex gap-4">
                {["3–4 minutes", "5–6 minutes", "7–8 minutes"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setDuration(option)}
                    className={`flex-1 h-14 rounded-2xl border text-base font-medium transition-all ${
                      duration === option
                        ? "bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary/40 text-foreground"
                        : "bg-gradient-to-b from-white/[0.07] to-white/[0.03] border-white/10 text-white/60 hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options - Collapsed by Default */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Advanced (optional)
              </button>

              {showAdvanced && (
                <div className="mt-6 p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] space-y-6">
                  {/* Energy Bias */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-3">Energy Bias</label>
                    <div className="flex gap-3">
                      {["Low", "Medium", "High"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setEnergyBias(level)}
                          className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${
                            energyBias === level
                              ? "bg-secondary/20 border-secondary/40 text-foreground"
                              : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Groove Tightness */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-3">Groove Tightness</label>
                    <div className="flex gap-3">
                      {["Loose", "Medium", "Tight"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setGrooveTightness(level)}
                          className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${
                            grooveTightness === level
                              ? "bg-secondary/20 border-secondary/40 text-foreground"
                              : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Atmosphere */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-3">Atmosphere</label>
                    <div className="flex gap-3">
                      {["Dry", "Warm", "Wide"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setAtmosphere(level)}
                          className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${
                            atmosphere === level
                              ? "bg-secondary/20 border-secondary/40 text-foreground"
                              : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-12 text-center">
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary/90 border border-secondary/50 text-background rounded-2xl px-16 h-16 text-lg font-medium shadow-lg shadow-secondary/20"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Generate Track
            </Button>
            <p className="font-['IBM_Plex_Mono'] text-sm text-white/40 mt-4">Creates 3 unique versions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
