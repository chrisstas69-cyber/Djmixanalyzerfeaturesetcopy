"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  Copy, 
  Download, 
  RefreshCw, 
  Sparkles,
  ChevronDown,
  Save,
  Edit3,
  RotateCcw,
  Music2,
  Mic
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

// Types
interface LyricSection {
  type: "intro" | "verse1" | "hook" | "verse2" | "bridge" | "outro";
  label: string;
  bars: number;
  content: string;
}

interface GeneratedLyrics {
  id: string;
  sections: LyricSection[];
  wordCount: number;
  syllableCount: number;
  rhymeScheme: string;
  estimatedDuration: string;
}

interface LyricVibeSlider {
  id: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
}

// Constants
const GENRES = ["Techno", "House", "Deep House", "Minimal", "Progressive", "Trance", "Ambient"];
const SUBGENRES = ["Melodic", "Dark", "Industrial", "Organic", "Acid", "Peak Time"];
const CLUB_CONTEXTS = ["Peak Hour", "Warm-Up", "After Hours", "Sunset", "Underground"];
const KEYS = ["Am", "Cm", "Dm", "Em", "Fm", "Gm", "A", "C", "D", "E", "F", "G"];
const THEMES = ["Love", "Freedom", "Unity", "Rebellion", "Transcendence", "Technology", "Nature", "Urban Life"];

// Sample generated lyrics for demo
const SAMPLE_LYRICS: LyricSection[] = [
  {
    type: "intro",
    label: "Intro – 8 bars",
    bars: 8,
    content: "(Atmospheric pads, no vocals)"
  },
  {
    type: "verse1",
    label: "Verse 1 – 8 bars",
    bars: 8,
    content: `Lost in the rhythm of the night
Synthesized souls in neon light
Breaking through the static noise
Finding freedom in the choice`
  },
  {
    type: "hook",
    label: "Hook – 4 bars",
    bars: 4,
    content: `We are one, we are electric
Moving bodies, souls connected
Feel the bass, transcend the physical
This moment is mystical`
  },
  {
    type: "verse2",
    label: "Verse 2 – 8 bars",
    bars: 8,
    content: `Shadows dance on concrete walls
Echoes in these city halls
Underground we find our truth
Eternal sound, eternal youth`
  },
  {
    type: "bridge",
    label: "Bridge – 4 bars",
    bars: 4,
    content: `(Breakdown – instrumental build)`
  },
  {
    type: "outro",
    label: "Outro – 8 bars",
    bars: 8,
    content: `Fade into the morning light
We were alive tonight
Connected through the sound
Underground, we are found`
  }
];

export function LyricLab() {
  // Source Type State
  const [sourceType, setSourceType] = useState<"manual" | "dna">("manual");
  
  // Input Controls State
  const [genre, setGenre] = useState("Techno");
  const [subgenre, setSubgenre] = useState("Melodic");
  const [clubContext, setClubContext] = useState("Peak Hour");
  const [bpm, setBpm] = useState(128);
  const [key, setKey] = useState("Am");
  const [vocalType, setVocalType] = useState<"male" | "female" | "pitched" | "robotic">("pitched");
  const [vocalDensity, setVocalDensity] = useState<"sparse" | "medium" | "busy">("medium");
  const [hookBars, setHookBars] = useState(4);
  const [verseBars, setVerseBars] = useState(8);
  
  // Lyric Vibes State (sliders 0-100, 50 = neutral)
  const [vibes, setVibes] = useState<LyricVibeSlider[]>([
    { id: "mood", leftLabel: "Dark", rightLabel: "Light", value: 55 },
    { id: "emotion", leftLabel: "Euphoric", rightLabel: "Melancholic", value: 48 },
    { id: "sensuality", leftLabel: "Sexy", rightLabel: "Platonic", value: 52 },
    { id: "energy", leftLabel: "Introspective", rightLabel: "Extroverted", value: 58 },
    { id: "complexity", leftLabel: "Minimal", rightLabel: "Maximal", value: 45 },
    { id: "abstraction", leftLabel: "Abstract", rightLabel: "Literal", value: 50 },
  ]);
  
  // Themes State
  const [selectedThemes, setSelectedThemes] = useState<string[]>(["Unity", "Transcendence"]);
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLyrics, setGeneratedLyrics] = useState<GeneratedLyrics | null>(null);
  const [activeSection, setActiveSection] = useState<string>("intro");
  
  // Generate Lyrics
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate stats
    const allContent = SAMPLE_LYRICS.map(s => s.content).join(" ");
    const words = allContent.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
    
    setGeneratedLyrics({
      id: `lyrics-${Date.now()}`,
      sections: SAMPLE_LYRICS,
      wordCount: words.length,
      syllableCount: syllables,
      rhymeScheme: "AABB",
      estimatedDuration: "180s"
    });
    
    setIsGenerating(false);
    toast.success("Lyrics generated successfully!");
  };
  
  // Simple syllable counter
  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    const vowels = word.match(/[aeiouy]+/g);
    return vowels ? vowels.length : 1;
  };
  
  // Copy lyrics to clipboard
  const copyToClipboard = () => {
    if (!generatedLyrics) return;
    const text = generatedLyrics.sections.map(s => `[${s.label}]\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Lyrics copied to clipboard!");
  };
  
  // Save to Library
  const saveToLibrary = () => {
    if (!generatedLyrics) return;
    
    try {
      const existingLyrics = JSON.parse(localStorage.getItem("lyricLibrary") || "[]");
      const newLyric = {
        id: generatedLyrics.id,
        title: `${genre} ${subgenre} Lyrics`,
        genre,
        subgenre,
        bpm,
        key,
        themes: selectedThemes,
        sections: generatedLyrics.sections,
        wordCount: generatedLyrics.wordCount,
        createdAt: new Date().toISOString(),
        dnaMatch: Math.floor(Math.random() * 15) + 85, // 85-99%
      };
      
      existingLyrics.push(newLyric);
      localStorage.setItem("lyricLibrary", JSON.stringify(existingLyrics));
      toast.success("Saved to Lyric Library!");
    } catch (error) {
      toast.error("Failed to save lyrics");
    }
  };
  
  // Toggle theme selection
  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };
  
  // Update vibe slider
  const updateVibe = (id: string, value: number) => {
    setVibes(prev => prev.map(v => v.id === id ? { ...v, value } : v));
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-darkest)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-6 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight mb-1 font-['Rajdhani']">Lyric Lab</h1>
          <p className="text-sm text-white/40">AI-Powered Lyric Generator for Underground Electronic Music</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Input Controls */}
        <div className="w-[55%] flex flex-col border-r border-white/5 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Source Type Toggle */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">
                Source Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSourceType("manual")}
                  className={`flex-1 h-12 rounded-lg font-semibold text-sm transition-all font-['Inter'] ${
                    sourceType === "manual"
                      ? "bg-[var(--accent-cyan)] text-black"
                      : "bg-[var(--bg-medium)] text-white/60 border border-white/10 hover:border-white/20"
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => setSourceType("dna")}
                  className={`flex-1 h-12 rounded-lg font-semibold text-sm transition-all font-['Inter'] ${
                    sourceType === "dna"
                      ? "bg-[var(--accent-cyan)] text-black"
                      : "bg-[var(--bg-medium)] text-white/60 border border-white/10 hover:border-white/20"
                  }`}
                >
                  DNA Library
                </button>
              </div>
            </div>

            {/* Control Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Genre */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">Genre</label>
                <div className="relative">
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-[var(--bg-dark)] border border-white/10 text-white text-sm appearance-none cursor-pointer focus:border-[var(--accent-cyan)] focus:outline-none font-['Inter']"
                  >
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>

              {/* BPM */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">BPM: {bpm}</label>
                <div className="relative h-11 flex items-center">
                  <input
                    type="range"
                    min="100"
                    max="180"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full h-2 bg-[var(--bg-medium)] rounded-full appearance-none cursor-pointer accent-[var(--accent-cyan)]"
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--accent-cyan)] shadow-[var(--shadow-glow-cyan)] pointer-events-none"
                    style={{ left: `calc(${((bpm - 100) / 80) * 100}% - 8px)` }}
                  />
                </div>
              </div>

              {/* Subgenre */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">Subgenre</label>
                <div className="relative">
                  <select
                    value={subgenre}
                    onChange={(e) => setSubgenre(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-[var(--bg-dark)] border border-white/10 text-white text-sm appearance-none cursor-pointer focus:border-[var(--accent-cyan)] focus:outline-none font-['Inter']"
                  >
                    {SUBGENRES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>

              {/* Key */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">Key</label>
                <div className="relative">
                  <select
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-[var(--bg-dark)] border border-white/10 text-white text-sm appearance-none cursor-pointer focus:border-[var(--accent-cyan)] focus:outline-none font-['Inter']"
                  >
                    {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>

              {/* Club Context */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">Club Context</label>
                <div className="relative">
                  <select
                    value={clubContext}
                    onChange={(e) => setClubContext(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-[var(--bg-dark)] border border-white/10 text-white text-sm appearance-none cursor-pointer focus:border-[var(--accent-cyan)] focus:outline-none font-['Inter']"
                  >
                    {CLUB_CONTEXTS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>

              {/* Vocal Density */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">Vocal Density</label>
                <div className="flex gap-2">
                  {(["sparse", "medium", "busy"] as const).map((density) => (
                    <button
                      key={density}
                      onClick={() => setVocalDensity(density)}
                      className={`flex-1 h-11 rounded-lg text-xs font-semibold capitalize transition-all font-['Inter'] ${
                        vocalDensity === density
                          ? "bg-[var(--accent-cyan)] text-black"
                          : "bg-[var(--bg-medium)] text-white/60 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vocal Type */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">Vocal Type</label>
              <div className="flex gap-2">
                {(["male", "female", "pitched", "robotic"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setVocalType(type)}
                    className={`flex-1 h-10 rounded-lg text-xs font-semibold capitalize transition-all font-['Inter'] ${
                      vocalType === type
                        ? "bg-[var(--accent-cyan)] text-black"
                        : "bg-[var(--bg-medium)] text-white/60 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Hook & Verse Bars */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">
                  Hook Bars: {hookBars}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="2"
                  value={hookBars}
                  onChange={(e) => setHookBars(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--bg-medium)] rounded-full appearance-none cursor-pointer accent-[var(--accent-orange)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider font-['Rajdhani']">
                  Verse Bars: {verseBars}
                </label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="4"
                  value={verseBars}
                  onChange={(e) => setVerseBars(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--bg-medium)] rounded-full appearance-none cursor-pointer accent-[var(--accent-orange)]"
                />
              </div>
            </div>

            {/* Lyric Vibes Section */}
            <div className="bg-[var(--bg-darker)] rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-4 font-['Rajdhani']">
                Lyric Vibes – Adjust emotional characteristics
              </h3>
              <div className="space-y-5">
                {vibes.map((vibe) => (
                  <div key={vibe.id} className="space-y-2">
                    <div className="flex justify-between text-xs text-white/50 font-['Inter']">
                      <span>{vibe.leftLabel}</span>
                      <span>{vibe.rightLabel}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={vibe.value}
                        onChange={(e) => updateVibe(vibe.id, Number(e.target.value))}
                        className="w-full h-1 bg-[var(--bg-medium)] rounded-full appearance-none cursor-pointer"
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent-cyan)] shadow-lg pointer-events-none"
                        style={{ left: `calc(${vibe.value}% - 6px)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Themes */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-white font-['Rajdhani']">Themes</label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => toggleTheme(theme)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all font-['Inter'] ${
                      selectedThemes.includes(theme)
                        ? "bg-[var(--accent-orange)] text-black"
                        : "bg-[var(--bg-medium)] text-white/60 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-14 rounded-xl bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-dim)] text-black font-bold text-base transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-['Inter'] shadow-[var(--shadow-glow-cyan)]"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "Generating Lyrics..." : "Generate Lyrics"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - Generated Lyrics */}
        <div className="w-[45%] flex flex-col bg-[var(--bg-darker)]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h2 className="text-lg font-semibold text-[var(--accent-orange)] font-['Rajdhani']">Generated Lyrics</h2>
            {generatedLyrics && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerate()}
                  className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={saveToLibrary}
                  className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition"
                  title="Save to Library"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Section Tabs */}
          {generatedLyrics && (
            <div className="flex flex-wrap gap-2 p-4 border-b border-white/5">
              {generatedLyrics.sections.map((section) => (
                <button
                  key={section.type}
                  onClick={() => setActiveSection(section.type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-['Inter'] ${
                    activeSection === section.type
                      ? "bg-[var(--bg-medium)] text-white border border-white/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {section.label.split(" – ")[0]} – {section.bars} bars
                </button>
              ))}
            </div>
          )}

          {/* Lyrics Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[var(--accent-cyan)]/20 border-t-[var(--accent-cyan)] rounded-full animate-spin" />
                  <Mic className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[var(--accent-cyan)]" />
                </div>
                <p className="mt-4 text-white/50 text-sm font-['Inter']">Generating lyrics...</p>
              </div>
            ) : generatedLyrics ? (
              <div className="space-y-6">
                {generatedLyrics.sections.map((section) => (
                  <div 
                    key={section.type}
                    className={`transition-opacity ${activeSection === section.type ? "opacity-100" : "opacity-40"}`}
                  >
                    <div className="text-xs text-[var(--accent-cyan)] font-semibold uppercase tracking-wider mb-2 font-['Rajdhani']">
                      [{section.label}]
                    </div>
                    <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-['Roboto_Mono']">
                      {section.content}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Music2 className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/30 text-sm font-['Inter']">
                  Configure your settings and click<br />"Generate Lyrics" to begin
                </p>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          {generatedLyrics && (
            <div className="p-4 border-t border-white/5 bg-[var(--bg-dark)]">
              <div className="flex items-center justify-between text-xs text-white/50 font-['Roboto_Mono']">
                <div className="flex gap-4">
                  <span>Words: <strong className="text-white">{generatedLyrics.wordCount}</strong></span>
                  <span>Syllables: <strong className="text-white">{generatedLyrics.syllableCount}</strong></span>
                </div>
                <div className="flex gap-4">
                  <span>Rhyme: <strong className="text-white">{generatedLyrics.rhymeScheme}</strong></span>
                  <span>Duration: <strong className="text-white">{generatedLyrics.estimatedDuration}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LyricLab;

