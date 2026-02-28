import { useState, useEffect } from "react";
import { Play, ChevronDown, ChevronUp, Sparkles, Save, Edit, Settings, ChevronRight, X, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type CreateState = "idle" | "generating" | "complete";
type GenerationMode = "Auto" | "Use Preset" | "Custom Settings";

interface Preset {
  id: string;
  name: string;
  style: string;
  duration: string;
  tempo: number;
  energy: string;
  key: string;
}

const mockPresets: Preset[] = [
  {
    id: "1",
    name: "Peak Time Techno – Club Ready",
    style: "TECHNO (PEAK TIME / DRIVING / HARD)",
    duration: "7–8 minutes",
    tempo: 134,
    energy: "High",
    key: "Auto",
  },
  {
    id: "2",
    name: "Hypnotic Late Night",
    style: "TECHNO (RAW / DEEP / HYPNOTIC)",
    duration: "5–6 minutes",
    tempo: 126,
    energy: "Medium",
    key: "Auto",
  },
  {
    id: "3",
    name: "Deep House Groove",
    style: "DEEP HOUSE",
    duration: "5–6 minutes",
    tempo: 122,
    energy: "Medium",
    key: "Auto",
  },
  {
    id: "4",
    name: "Melodic Builder",
    style: "MELODIC HOUSE / TECHNO",
    duration: "7–8 minutes",
    tempo: 124,
    energy: "High",
    key: "Auto",
  },
  {
    id: "5",
    name: "DJ Tool – Transition Friendly",
    style: "DJ TOOLS",
    duration: "3–4 minutes",
    tempo: 128,
    energy: "Medium",
    key: "Auto",
  },
];

const genres = [
  "ALL",
  "HOUSE",
  "AFRO HOUSE",
  "AMAPIANO",
  "DEEP HOUSE",
  "TECH HOUSE",
  "JACKIN HOUSE",
  "SOULFUL / FUNK / DISCO",
  "NU DISCO",
  "MELODIC HOUSE / TECHNO",
  "INDIE DANCE",
  "PROGRESSIVE",
  "ELECTRO (CLASSIC / DETROIT / MODERN)",
  "TECHNO (PEAK TIME / DRIVING / HARD)",
  "TECHNO (RAW / DEEP / HYPNOTIC)",
  "HARD TECHNO",
  "MINIMAL / DEEP TECH",
  "ELECTRONICA",
  "GARAGE",
  "ELECTRO HOUSE",
  "BASS HOUSE",
  "FUTURE HOUSE",
  "TRANCE",
  "BREAKS",
  "DRUM & BASS",
  "DUBSTEP",
  "POP / DANCE",
  "MASHUPS / CLUB DANCE",
  "DJ TOOLS",
  "ORGANIC HOUSE / DOWNTEMPO",
  "CHILL OUT",
];

export function SimpleCreate() {
  const [createState, setCreateState] = useState<CreateState>("idle");
  const [prompt, setPrompt] = useState("");
  const [lyricsMode, setLyricsMode] = useState("Instrumental");
  const [lyrics, setLyrics] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("HOUSE");
  const [duration, setDuration] = useState("5–6 minutes");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatingStep, setGeneratingStep] = useState("Analyzing your prompt");
  const [generationMode, setGenerationMode] = useState<GenerationMode>("Auto");
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [presetDrawerOpen, setPresetDrawerOpen] = useState(false);
  
  // Custom settings
  const [customTempo, setCustomTempo] = useState<"Auto" | "Manual">("Auto");
  const [manualTempo, setManualTempo] = useState(128);
  const [customEnergy, setCustomEnergy] = useState("Medium");
  const [customKey, setCustomKey] = useState<"Auto" | "Select">("Auto");
  const [selectedKey, setSelectedKey] = useState("C");

  // Generating simulation
  useEffect(() => {
    if (createState === "generating") {
      const steps = [
        { text: "Analyzing your prompt", duration: 2000 },
        { text: "Applying style characteristics", duration: 2500 },
        { text: "Shaping groove and energy", duration: 3000 },
        { text: "Finalizing audio", duration: 2500 },
      ];

      let currentProgress = 0;
      let stepIndex = 0;
      setGeneratingStep(steps[0].text);

      const interval = setInterval(() => {
        currentProgress += 0.8;
        setProgress(currentProgress);

        if (currentProgress > 25 && stepIndex === 0) {
          stepIndex = 1;
          setGeneratingStep(steps[1].text);
        } else if (currentProgress > 50 && stepIndex === 1) {
          stepIndex = 2;
          setGeneratingStep(steps[2].text);
        } else if (currentProgress > 75 && stepIndex === 2) {
          stepIndex = 3;
          setGeneratingStep(steps[3].text);
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCreateState("complete");
            setProgress(0);
          }, 500);
        }
      }, 80);

      return () => clearInterval(interval);
    }
  }, [createState]);

  // Generating State
  if (createState === "generating") {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Simple Header */}
        <div className="border-b border-border px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-secondary" />
              </div>
              <h1 className="text-2xl font-medium">Syntax</h1>
            </div>
            <p className="text-sm text-muted-foreground">Audio Intelligence</p>
          </div>
        </div>

        {/* Generating Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-xl">
            <div className="bg-card/30 border border-border/50 rounded-lg p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
              </div>

              <h2 className="text-xl font-medium mb-2">Generating your track…</h2>
              <p className="text-sm text-muted-foreground mb-8">{generatingStep}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-background/50 border border-border/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-300 ease-linear rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete State
  if (createState === "complete") {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Simple Header */}
        <div className="border-b border-border px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-secondary" />
              </div>
              <h1 className="text-2xl font-medium">Syntax</h1>
            </div>
            <p className="text-sm text-muted-foreground">Audio Intelligence</p>
          </div>
        </div>

        {/* Complete Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <div className="bg-card/30 border border-border/50 rounded-lg p-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                  <Play className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="text-xl font-medium mb-2">Dark Hypnotic Groove</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  House · <span className="font-['IBM_Plex_Mono']">5:42</span>
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary">
                  <Sparkles className="w-3 h-3" />
                  Enhanced by Syntax Intelligence
                </div>
              </div>

              {/* Waveform Preview */}
              <div className="mb-8 h-24 bg-background/50 border border-border/30 rounded-lg flex items-center gap-0.5 px-4 overflow-hidden">
                {[...Array(60)].map((_, i) => {
                  const height = Math.sin(i / 3) * 25 + Math.random() * 20 + 30;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-secondary/40 rounded-sm"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="rounded-lg h-11">
                  <Save className="w-4 h-4 mr-2" />
                  Save to Library
                </Button>
                <Button variant="outline" className="rounded-lg h-11" onClick={() => setCreateState("idle")}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Prompt
                </Button>
                <Button variant="outline" className="rounded-lg h-11">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Tools
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Idle State - Main Creation Interface
  return (
    <div className="h-full flex flex-col bg-background overflow-auto relative">
      {/* Preset Drawer - Side Panel */}
      {presetDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setPresetDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border z-50 flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-medium">Presets</h3>
              <button
                onClick={() => setPresetDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-auto p-6 space-y-3">
              {mockPresets.map((preset) => (
                <div key={preset.id} className="bg-card/30 border border-border/50 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">{preset.name}</h4>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">
                        {preset.style}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground font-['IBM_Plex_Mono']">
                        {preset.duration}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div>
                      <div className="text-muted-foreground mb-1">Tempo</div>
                      <div className="font-['IBM_Plex_Mono']">{preset.tempo} BPM</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Energy</div>
                      <div>{preset.energy}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Key</div>
                      <div>{preset.key}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-secondary/20 text-foreground hover:bg-secondary/30 border border-secondary/30"
                      onClick={() => {
                        setSelectedPreset(preset);
                        setGenerationMode("Use Preset");
                        setShowAdvanced(true);
                        setPresetDrawerOpen(false);
                      }}
                    >
                      Apply
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="px-3">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Preset Button - Fixed Right Edge */}
      <button
        onClick={() => setPresetDrawerOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-card border border-border border-r-0 rounded-l-lg px-3 py-6 shadow-lg hover:bg-muted transition-colors z-30 flex items-center gap-2"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="text-sm font-medium tracking-wider">PRESETS</span>
        <ChevronRight className="w-4 h-4" style={{ transform: "rotate(90deg)" }} />
      </button>

      {/* Simple Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
            <h1 className="text-2xl font-medium">Syntax</h1>
          </div>
          <p className="text-sm text-muted-foreground">Audio Intelligence</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium mb-3">Create a Track</h2>
            <p className="text-muted-foreground">Describe it. Choose a style. Generate.</p>
          </div>

          {/* Form */}
          <div className="space-y-8">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium mb-3">Describe your track</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Dark hypnotic house groove with rolling bass, late-night club energy, subtle vocal chops…"
                className="min-h-32 resize-none rounded-lg border-border/50 bg-card/30 focus:border-secondary focus:ring-secondary"
              />
              <p className="text-xs text-muted-foreground mt-2">You can reference vibes, moods, or artists.</p>
            </div>

            {/* Lyrics Toggle */}
            <div>
              <label className="block text-sm font-medium mb-3">Lyrics</label>
              <div className="inline-flex rounded-lg border border-border/50 bg-card/30 p-1">
                <button
                  onClick={() => setLyricsMode("Instrumental")}
                  className={`px-6 py-2 rounded-md text-sm transition-colors ${
                    lyricsMode === "Instrumental"
                      ? "bg-secondary/20 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Instrumental
                </button>
                <button
                  onClick={() => setLyricsMode("With Lyrics")}
                  className={`px-6 py-2 rounded-md text-sm transition-colors ${
                    lyricsMode === "With Lyrics"
                      ? "bg-secondary/20 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  With Lyrics
                </button>
              </div>

              {lyricsMode === "With Lyrics" && (
                <div className="mt-4">
                  <Textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Verse, hook, or full lyrics (optional)…"
                    className="min-h-24 resize-none rounded-lg border-border/50 bg-card/30 focus:border-secondary focus:ring-secondary"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Leave blank for instrumental tracks.</p>
                </div>
              )}
            </div>

            {/* Genre Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Select a Style</label>
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border/50 bg-card/30 text-foreground appearance-none cursor-pointer focus:border-secondary focus:ring-secondary"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Track Length</label>
              <div className="flex gap-3">
                {["3–4 minutes", "5–6 minutes", "7–8 minutes"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setDuration(option)}
                    className={`flex-1 px-6 py-3 rounded-lg border text-sm transition-colors ${
                      duration === option
                        ? "bg-secondary/20 border-secondary/40 text-foreground"
                        : "bg-card/30 border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Toggle */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Advanced options
              </button>

              {showAdvanced && (
                <div className="mt-4 p-6 rounded-lg border border-border/50 bg-card/20 space-y-6">
                  {/* Generation Mode */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-3 tracking-wider">
                      GENERATION MODE
                    </label>
                    <div className="space-y-2">
                      {(["Auto", "Use Preset", "Custom Settings"] as GenerationMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setGenerationMode(mode)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-colors ${
                            generationMode === mode
                              ? "bg-secondary/20 border-secondary/40 text-foreground"
                              : "bg-background/50 border-border/30 text-muted-foreground hover:border-border hover:text-foreground"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              generationMode === mode ? "border-secondary" : "border-muted-foreground/50"
                            }`}
                          >
                            {generationMode === mode && <div className="w-2 h-2 rounded-full bg-secondary" />}
                          </div>
                          <span>{mode}</span>
                          {mode === "Auto" && <span className="ml-auto text-xs text-muted-foreground">(Recommended)</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preset Selection - Only shown when "Use Preset" is selected */}
                  {generationMode === "Use Preset" && (
                    <div className="pt-4 border-t border-border/30">
                      <label className="block text-xs font-medium text-muted-foreground mb-3 tracking-wider">
                        SELECT PRESET
                      </label>
                      <div className="relative mb-3">
                        <select
                          value={selectedPreset?.id || ""}
                          onChange={(e) => {
                            const preset = mockPresets.find((p) => p.id === e.target.value);
                            setSelectedPreset(preset || null);
                          }}
                          className="w-full h-12 px-4 rounded-lg border border-border/50 bg-background/50 text-foreground appearance-none cursor-pointer focus:border-secondary focus:ring-secondary"
                        >
                          <option value="">Select a preset...</option>
                          {mockPresets.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                              {preset.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                      <Button variant="outline" size="sm" className="w-full rounded-lg">
                        Manage Presets
                      </Button>
                    </div>
                  )}

                  {/* Custom Settings - Only shown when "Custom Settings" is selected */}
                  {generationMode === "Custom Settings" && (
                    <div className="pt-4 border-t border-border/30 space-y-4">
                      <label className="block text-xs font-medium text-muted-foreground mb-3 tracking-wider">
                        CUSTOM SETTINGS
                      </label>

                      {/* Tempo */}
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Tempo</label>
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => setCustomTempo("Auto")}
                            className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                              customTempo === "Auto"
                                ? "bg-secondary/20 border-secondary/40 text-foreground"
                                : "bg-background/50 border-border/30 text-muted-foreground hover:border-border"
                            }`}
                          >
                            Auto
                          </button>
                          <button
                            onClick={() => setCustomTempo("Manual")}
                            className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                              customTempo === "Manual"
                                ? "bg-secondary/20 border-secondary/40 text-foreground"
                                : "bg-background/50 border-border/30 text-muted-foreground hover:border-border"
                            }`}
                          >
                            Manual
                          </button>
                        </div>
                        {customTempo === "Manual" && (
                          <input
                            type="number"
                            value={manualTempo}
                            onChange={(e) => setManualTempo(parseInt(e.target.value) || 128)}
                            className="w-full h-10 px-4 rounded-lg border border-border/50 bg-background/50 text-foreground font-['IBM_Plex_Mono'] text-sm focus:border-secondary focus:ring-secondary"
                            placeholder="128"
                            min="80"
                            max="180"
                          />
                        )}
                      </div>

                      {/* Energy */}
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Energy</label>
                        <div className="flex gap-2">
                          {["Low", "Medium", "High"].map((level) => (
                            <button
                              key={level}
                              onClick={() => setCustomEnergy(level)}
                              className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                                customEnergy === level
                                  ? "bg-secondary/20 border-secondary/40 text-foreground"
                                  : "bg-background/50 border-border/30 text-muted-foreground hover:border-border"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Key */}
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Key</label>
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => setCustomKey("Auto")}
                            className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                              customKey === "Auto"
                                ? "bg-secondary/20 border-secondary/40 text-foreground"
                                : "bg-background/50 border-border/30 text-muted-foreground hover:border-border"
                            }`}
                          >
                            Auto
                          </button>
                          <button
                            onClick={() => setCustomKey("Select")}
                            className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                              customKey === "Select"
                                ? "bg-secondary/20 border-secondary/40 text-foreground"
                                : "bg-background/50 border-border/30 text-muted-foreground hover:border-border"
                            }`}
                          >
                            Select
                          </button>
                        </div>
                        {customKey === "Select" && (
                          <div className="relative">
                            <select
                              value={selectedKey}
                              onChange={(e) => setSelectedKey(e.target.value)}
                              className="w-full h-10 px-4 rounded-lg border border-border/50 bg-background/50 text-foreground appearance-none cursor-pointer focus:border-secondary focus:ring-secondary"
                            >
                              {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((key) => (
                                <option key={key} value={key}>
                                  {key}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-border/30">
                        <p className="text-xs text-muted-foreground">Powered by Syntax Audio Intelligence</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Primary Action */}
          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-secondary text-background hover:bg-secondary/90 rounded-lg px-12 h-14 text-base font-medium"
              onClick={() => setCreateState("generating")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              GENERATE TRACK
            </Button>
            <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-3">Takes ~2–3 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}