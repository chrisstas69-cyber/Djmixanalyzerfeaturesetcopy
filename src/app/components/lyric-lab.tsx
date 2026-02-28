"use client";

import React, { useState } from "react";
import { 
  Play, 
  Copy, 
  Download, 
  RefreshCw, 
  Sparkles,
  ChevronDown,
  Save,
  X,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface LyricLabProps {
  onNavigate?: (view: string) => void;
}

const GENRES = ["Progressive House", "Techno", "House", "Deep House", "Minimal", "Trance"];
const KEYS = ["C#m", "Am", "Cm", "Dm", "Em", "Fm", "Gm", "A", "C", "D", "E", "F", "G"];
const VOICE_CONTEXTS = ["Energetic & Uplifting", "Dark & Mysterious", "Emotional & Melodic", "Aggressive & Powerful"];

// Fake lyrics content
const FAKE_LYRICS = {
  verse1: `Dancing through the shadows of the night
Feel the energy, burning bright
Chasing dreams under neon lights
We're alive, we're infinite tonight`,
  preChorus: `Every heartbeat synchronizing
To the pulse that keeps us rising
Higher than we've ever been
Let the journey now begin`,
  chorus: `We are free, we are wild
Dancing through the sound
Feel the bass, feel the power
This is our moment now
Breaking chains, touching stars
Nothing can hold us down
We are infinite, we are boundless
Hear the thunder pound`,
  verse2: `Electric skies and endless possibility
Moving forward with intensity
Feel the rhythm of our destiny
This is where we're meant to be`
};

export function LyricLab({ onNavigate }: LyricLabProps) {
  const [generationMode, setGenerationMode] = useState<"Auto" | "Prompt">("Auto");
  const [genre, setGenre] = useState("Progressive House");
  const [key, setKey] = useState("C#m");
  const [bpm, setBpm] = useState(128);
  const [voiceContext, setVoiceContext] = useState("Energetic & Uplifting");
  const [vocalDensity, setVocalDensity] = useState(60);
  const [keywords, setKeywords] = useState<string[]>(["energy", "freedom", "night"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [hasGenerated, setHasGenerated] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [promptText, setPromptText] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleCopy = () => {
    const lyricsText = `[Verse 1]\n${FAKE_LYRICS.verse1}\n\n[Pre-Chorus]\n${FAKE_LYRICS.preChorus}\n\n[Chorus]\n${FAKE_LYRICS.chorus}\n\n[Verse 2]\n${FAKE_LYRICS.verse2}`;
    navigator.clipboard.writeText(lyricsText);
    toast.success("Copied to clipboard!");
  };

  const handleSave = () => {
    toast.success("Saved to library!");
  };

  const handleUseInCreateTrack = () => {
    const lyricsText = `[Verse 1]\n${FAKE_LYRICS.verse1}\n\n[Pre-Chorus]\n${FAKE_LYRICS.preChorus}\n\n[Chorus]\n${FAKE_LYRICS.chorus}\n\n[Verse 2]\n${FAKE_LYRICS.verse2}`;
    localStorage.setItem('lyricLabData', JSON.stringify({
      lyrics: lyricsText,
        genre,
        bpm,
        key,
      timestamp: Date.now(),
    }));
    if (onNavigate) {
      onNavigate('create-track-modern');
    }
    toast.success("Opening Create Track with lyrics...");
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
      {/* Header */}
      <div className="px-8 py-6 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Lyric Lab</h1>
      </div>

      {/* Main Content - Max Width Container */}
      <div className="flex-1 overflow-auto" style={{ padding: '32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Two Column Layout */}
          <div className="flex" style={{ gap: '32px' }}>
            {/* LEFT COLUMN - 40% */}
            <div className="flex-shrink-0" style={{ width: '40%' }}>
              <div style={{ padding: '24px' }}>
            {/* Header */}
            <h2 className="text-sm uppercase tracking-wider" style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '20px' }}>
              Lyric Controls
            </h2>

            {/* Generation Mode Tabs */}
            <div className="flex gap-2" style={{ marginBottom: '24px' }}>
              {(["Auto", "Prompt"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setGenerationMode(mode)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  style={{
                    background: generationMode === mode ? 'var(--cyan-2)' : 'transparent',
                    color: generationMode === mode ? '#000' : 'var(--text-2)',
                    border: generationMode === mode ? 'none' : '1px solid var(--border)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                  onMouseEnter={(e) => {
                    if (generationMode !== mode) {
                      e.currentTarget.style.background = 'var(--surface)';
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (generationMode !== mode) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* PROMPT MODE */}
            {generationMode === "Prompt" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Auto-Optimize Toggle */}
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '4px' }}>
                      Auto-Optimize Prompt
                    </div>
                    <div style={{ fontSize: '15px', color: 'var(--text-3)' }}>
                      AI will restructure your prompt for best output quality
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '28px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={autoOptimize}
                      onChange={(e) => setAutoOptimize(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} 
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: autoOptimize ? 'var(--cyan-2)' : 'var(--border)',
                      borderRadius: '28px',
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        height: '20px',
                        width: '20px',
                        left: autoOptimize ? '32px' : '4px',
                        bottom: '4px',
                        background: '#000',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }} />
                    </span>
                  </label>
                </div>

                {/* Big Text Area */}
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe the lyrics you want... Example: Write energetic lyrics about freedom and dancing under neon lights, progressive house style"
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'var(--text)',
                    fontSize: '17px',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--orange)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                />

                {/* Generate Button */}
                <button 
                  onClick={() => {
                    setHasGenerated(true);
                    toast.success("Lyrics generated!");
                  }}
                  style={{
                    background: 'var(--cyan-2)',
                    border: 'none',
                    color: '#000',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--glow-cyan)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                >
                  <span>✨</span>
                  Generate Lyrics
                </button>
              </div>
            )}

            {/* Auto Mode Controls */}
            {generationMode === "Auto" && (
              <>

                {/* Genre Dropdown */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="uppercase block mb-1.5" style={{ color: 'var(--text-3)', fontSize: 'var(--font-size-sm)' }}>
                    GENRE
                  </label>
                  <div className="relative">
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg appearance-none cursor-pointer outline-none"
                      style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontSize: 'var(--font-size-base)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--orange)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                  </div>
                </div>

                {/* Key Dropdown */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="text-xs uppercase block mb-1.5" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                    KEY
                  </label>
                  <div className="relative">
                    <select
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg appearance-none cursor-pointer outline-none"
                      style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontSize: 'var(--font-size-base)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--orange)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                  </div>
                </div>

                {/* BPM Slider */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                      BPM
                    </label>
                    <span className="font-bold font-mono text-right" style={{ color: 'var(--cyan)', fontSize: '26px', fontWeight: 700 }}>
                      {bpm}
                    </span>
                  </div>
                  <div className="relative h-1" style={{ background: 'var(--border)', borderRadius: '4px' }}>
                    <input
                      type="range"
                      min="100"
                      max="180"
                      value={bpm}
                      onChange={(e) => setBpm(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
                      style={{
                        left: `calc(${((bpm - 100) / 80) * 100}% - 8px)`,
                        background: 'var(--cyan-2)',
                        boxShadow: 'var(--glow-cyan)',
                      }}
                    />
                  </div>
                </div>

                {/* Voice Context Dropdown */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="text-xs uppercase block mb-1.5" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                    VOICE CONTEXT
                  </label>
                  <div className="relative">
                    <select
                      value={voiceContext}
                      onChange={(e) => setVoiceContext(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg appearance-none cursor-pointer outline-none"
                      style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontSize: 'var(--font-size-base)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--orange)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      {VOICE_CONTEXTS.map(vc => <option key={vc} value={vc}>{vc}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                  </div>
                </div>

                {/* Vocal Density Slider */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                      VOCAL DENSITY
                    </label>
                    <span className="font-bold text-right" style={{ color: 'var(--orange)', fontSize: '20px' }}>
                      {vocalDensity}%
                    </span>
                  </div>
                  <div className="relative h-1" style={{ background: 'var(--border)', borderRadius: '4px' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vocalDensity}
                      onChange={(e) => setVocalDensity(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
                      style={{
                        left: `calc(${vocalDensity}% - 8px)`,
                        background: 'var(--orange-2)',
                        boxShadow: 'var(--glow-orange)',
                      }}
                    />
                  </div>
                </div>

                {/* Keywords Section */}
                <div style={{ marginBottom: '32px' }}>
                  <label className="text-xs uppercase block mb-2" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                    KEYWORDS
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '16px',
                      padding: '16px',
                      background: 'var(--surface)',
                      borderRadius: '8px',
                      border: '1px solid var(--surface-2)',
                    }}
                  >
                    {keywords.map((keyword, i) => (
                      <div
                        key={i}
                        className="font-medium flex items-center gap-2"
                        style={{
                          padding: '8px 16px',
                          fontSize: '14px',
                          background: 'var(--surface-2)',
                          borderRadius: '20px',
                          color: 'var(--text)',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--orange)';
                          e.currentTarget.style.color = 'var(--bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--surface-2)';
                          e.currentTarget.style.color = 'var(--text)';
                        }}
                      >
                        <span>{keyword}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveKeyword(keyword);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddKeyword();
                        }
                      }}
                      placeholder="Add keyword..."
                      className="flex-1 outline-none"
                      style={{
                        height: '40px',
                        padding: '12px',
                        background: 'var(--panel)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        fontSize: '14px',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--orange)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    />
                    <button
                      onClick={handleAddKeyword}
                      className="font-medium transition-colors cursor-pointer"
                      style={{
                        padding: '12px 20px',
                        background: 'var(--cyan-2)',
                        color: '#000',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={() => {
                    setHasGenerated(true);
                    toast.success("Lyrics generated!");
                  }}
                  className="w-full rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--orange-2)',
                    color: '#000',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 700,
                    height: '50px',
                    boxShadow: 'var(--glow-orange)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                >
                  Generate Lyrics
                </button>
              </>
            )}
              </div>
            </div>

            {/* RIGHT COLUMN - 60% */}
            <div className="flex-1" style={{ minWidth: 0 }}>
              <div style={{ padding: '24px' }}>
          {/* Header */}
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 600 }}>
              Generated Lyrics
            </h2>

            {/* Lyrics Container */}
            <div
              className="rounded-lg overflow-y-auto"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                padding: '24px',
                maxHeight: '600px',
              }}
            >
              {/* Verse 1 */}
              <div style={{ marginBottom: '24px' }}>
                <div className="font-bold mb-2" style={{ color: 'var(--cyan)', fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                  [Verse 1]
                </div>
                <div className="leading-relaxed font-mono" style={{ color: 'var(--text)', fontSize: 'var(--font-size-base)', fontFamily: "'Roboto Mono', monospace", lineHeight: 1.8 }}>
                  {FAKE_LYRICS.verse1}
                </div>
          </div>

              {/* Pre-Chorus */}
              <div style={{ marginBottom: '24px' }}>
                <div className="text-sm font-bold mb-2" style={{ color: 'var(--cyan)', fontSize: '14px', fontWeight: 700 }}>
                  [Pre-Chorus]
            </div>
                <div className="text-[15px] leading-relaxed font-mono" style={{ color: 'var(--text)', fontFamily: "'Roboto Mono', monospace", lineHeight: 1.8 }}>
                  {FAKE_LYRICS.preChorus}
                </div>
              </div>

              {/* Chorus */}
              <div style={{ marginBottom: '24px' }}>
                <div className="text-sm font-bold mb-2" style={{ color: 'var(--cyan)', fontSize: '14px', fontWeight: 700 }}>
                  [Chorus]
                    </div>
                <div className="text-[15px] leading-relaxed font-mono" style={{ color: 'var(--text)', fontFamily: "'Roboto Mono', monospace", lineHeight: 1.8 }}>
                  {FAKE_LYRICS.chorus}
              </div>
          </div>

              {/* Verse 2 */}
              <div style={{ marginBottom: '24px' }}>
                <div className="text-sm font-bold mb-2" style={{ color: 'var(--cyan)', fontSize: '14px', fontWeight: 700 }}>
                  [Verse 2]
                </div>
                <div className="text-[15px] leading-relaxed font-mono" style={{ color: 'var(--text)', fontFamily: "'Roboto Mono', monospace", lineHeight: 1.8 }}>
                  {FAKE_LYRICS.verse2}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleUseInCreateTrack}
                className="flex-1 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                style={{
                  background: 'var(--orange-2)',
                  color: '#000',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                <ArrowRight className="w-4 h-4" />
                Use Lyrics in Create Track
              </button>
              <button
                onClick={handleCopy}
                className="h-10 px-5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <Copy className="w-4 h-4" />
                Copy Lyrics
              </button>
              <button
                onClick={handleSave}
                className="h-10 px-5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <Save className="w-4 h-4" />
                Save to Library
              </button>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LyricLab;
