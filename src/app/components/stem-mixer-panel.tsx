import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Volume2, VolumeX, Music2, Sliders, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface Stem {
  id: string;
  name: string;
  type: "drums" | "bass" | "vocals" | "synth" | "other";
  data: string; // base64 or blob URL
  volume: number; // 0-1
  pan: number; // -1 to 1 (left to right)
  muted: boolean;
  soloed: boolean;
  eq: {
    bass: number; // -12 to +12 dB
    mid: number;
    treble: number;
  };
}

const STEM_COLORS = {
  drums: "#ef4444", // red
  bass: "#3b82f6", // blue
  vocals: "#10b981", // green
  synth: "#8b5cf6", // purple
  other: "#6b7280", // gray
};

export function StemMixerPanel() {
  const [stems, setStems] = useState<Stem[]>([]);
  const [selectedStem, setSelectedStem] = useState<Stem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stems from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('uploadedStems');
      if (stored) {
        setStems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading stems:', error);
    }
  }, []);

  const handleStemUpload = async (file: File, type: Stem["type"]) => {
    try {
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const newStem: Stem = {
        id: `stem-${Date.now()}`,
        name: file.name,
        type,
        data: fileData,
        volume: 1,
        pan: 0,
        muted: false,
        soloed: false,
        eq: { bass: 0, mid: 0, treble: 0 },
      };

      const updated = [...stems, newStem];
      setStems(updated);
      localStorage.setItem('uploadedStems', JSON.stringify(updated));
      toast.success(`Uploaded ${type} stem`);
    } catch (error) {
      console.error('Error uploading stem:', error);
      toast.error('Failed to upload stem');
    }
  };

  const handleDelete = (id: string) => {
    const updated = stems.filter(s => s.id !== id);
    setStems(updated);
    localStorage.setItem('uploadedStems', JSON.stringify(updated));
    if (selectedStem?.id === id) {
      setSelectedStem(null);
    }
    toast.success('Stem deleted');
  };

  const updateStem = (id: string, updates: Partial<Stem>) => {
    const updated = stems.map(s => s.id === id ? { ...s, ...updates } : s);
    setStems(updated);
    localStorage.setItem('uploadedStems', JSON.stringify(updated));
    if (selectedStem?.id === id) {
      setSelectedStem(updated.find(s => s.id === id) || null);
    }
  };

  const toggleMute = (id: string) => {
    const stem = stems.find(s => s.id === id);
    if (stem) {
      updateStem(id, { muted: !stem.muted });
    }
  };

  const toggleSolo = (id: string) => {
    const stem = stems.find(s => s.id === id);
    if (stem) {
      const newSoloed = !stem.soloed;
      // If soloing this stem, unsolo others
      const updated = stems.map(s => ({
        ...s,
        soloed: s.id === id ? newSoloed : (newSoloed ? false : s.soloed),
      }));
      setStems(updated);
      localStorage.setItem('uploadedStems', JSON.stringify(updated));
      if (selectedStem?.id === id) {
        setSelectedStem(updated.find(s => s.id === id) || null);
      }
    }
  };

  const formatVolume = (vol: number): string => {
    if (vol === 0) return "-∞";
    const db = 20 * Math.log10(vol);
    return db > 0 ? `+${db.toFixed(1)}` : db.toFixed(1);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">Stem Mixer</h1>
            <p className="text-xs text-white/40">
              Upload and mix individual stems (drums, bass, vocals, synth)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={(e) => {
              // For demo, assign random types
              const types: Stem["type"][] = ["drums", "bass", "vocals", "synth", "other"];
              if (e.target.files) {
                Array.from(e.target.files).forEach((file, i) => {
                  handleStemUpload(file, types[i % types.length]);
                });
              }
            }}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary hover:bg-primary/80 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Stems
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {stems.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20">
            <Music2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">No stems uploaded</h2>
            <p className="text-white/60 mb-6">
              Upload individual stems to mix them together
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary hover:bg-primary/80 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Stem
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Channel Strips */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stems.map((stem) => {
                const color = STEM_COLORS[stem.type];
                const isActive = selectedStem?.id === stem.id;
                const isSoloActive = stems.some(s => s.soloed);
                const shouldPlay = isSoloActive ? stem.soloed : !stem.muted;

                return (
                  <div
                    key={stem.id}
                    className={`bg-white/5 border rounded-xl p-4 transition-all cursor-pointer ${
                      isActive ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                    }`}
                    onClick={() => setSelectedStem(stem)}
                  >
                    {/* Stem Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-white/60 uppercase font-['IBM_Plex_Mono']">
                          {stem.type}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(stem.id);
                        }}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stem Name */}
                    <h3 className="text-sm font-medium text-white truncate mb-4">
                      {stem.name}
                    </h3>

                    {/* Volume Fader */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/50 font-['IBM_Plex_Mono']">Volume</span>
                        <span className="text-xs text-white font-['IBM_Plex_Mono']">
                          {formatVolume(stem.volume)} dB
                        </span>
                      </div>
                      <div className="h-32 flex items-center">
                        <Slider
                          value={[stem.volume]}
                          min={0}
                          max={1}
                          step={0.01}
                          orientation="vertical"
                          onValueChange={(val) => updateStem(stem.id, { volume: val[0] })}
                          className="h-full"
                        />
                      </div>
                    </div>

                    {/* Pan Control */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/50 font-['IBM_Plex_Mono']">Pan</span>
                        <span className="text-xs text-white font-['IBM_Plex_Mono']">
                          {stem.pan === 0 ? "C" : stem.pan > 0 ? `R${stem.pan.toFixed(1)}` : `L${Math.abs(stem.pan).toFixed(1)}`}
                        </span>
                      </div>
                      <Slider
                        value={[stem.pan]}
                        min={-1}
                        max={1}
                        step={0.01}
                        onValueChange={(val) => updateStem(stem.id, { pan: val[0] })}
                      />
                    </div>

                    {/* Mute/Solo Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute(stem.id);
                        }}
                        className={`flex-1 py-2 rounded text-xs font-medium transition-all ${
                          stem.muted
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        {stem.muted ? <VolumeX className="w-4 h-4 mx-auto" /> : <Volume2 className="w-4 h-4 mx-auto" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSolo(stem.id);
                        }}
                        className={`flex-1 py-2 rounded text-xs font-medium transition-all ${
                          stem.soloed
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        S
                      </button>
                    </div>

                    {/* VU Meter */}
                    <div className="mt-4 h-2 bg-white/5 rounded overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${shouldPlay ? stem.volume * 100 : 0}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Stem EQ Controls */}
            {selectedStem && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  EQ Controls - {selectedStem.name}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {(["bass", "mid", "treble"] as const).map((band) => (
                    <div key={band}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/50 uppercase font-['IBM_Plex_Mono']">
                          {band}
                        </span>
                        <span className="text-xs text-white font-['IBM_Plex_Mono']">
                          {selectedStem.eq[band] > 0 ? "+" : ""}{selectedStem.eq[band].toFixed(1)} dB
                        </span>
                      </div>
                      <Slider
                        value={[selectedStem.eq[band]]}
                        min={-12}
                        max={12}
                        step={0.5}
                        onValueChange={(val) =>
                          updateStem(selectedStem.id, {
                            eq: { ...selectedStem.eq, [band]: val[0] },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

