import { useState, useEffect } from "react";
import { Sliders, Radio, Waves, Gauge, Power, Music2 } from "lucide-react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface EQSettings {
  enabled: boolean;
  lowFreq: number; // Hz
  lowGain: number; // dB
  midFreq: number;
  midGain: number;
  midQ: number;
  highFreq: number;
  highGain: number;
}

interface ReverbSettings {
  enabled: boolean;
  roomSize: number; // 0-1
  wet: number; // 0-1
  dry: number; // 0-1
  decay: number; // seconds
  preDelay: number; // seconds
}

interface DelaySettings {
  enabled: boolean;
  time: number; // seconds or note value
  feedback: number; // 0-1
  wet: number; // 0-1
  syncToBPM: boolean;
  bpm: number;
}

interface CompressionSettings {
  enabled: boolean;
  threshold: number; // dB
  ratio: number; // 1:1 to 8:1
  attack: number; // ms
  release: number; // ms
  makeupGain: number; // dB
}

interface AudioFile {
  id: string;
  name: string;
  duration: number;
  data: string;
  bpm?: number;
  key?: string;
  energy?: string;
  analysis?: any;
  artwork?: string;
  artist?: string;
  title?: string;
}

export function EffectsRackPanel() {
  const [uploadedFiles, setUploadedFiles] = useState<AudioFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);

  // Load uploaded files
  useEffect(() => {
    const loadFiles = () => {
      try {
        const stored = localStorage.getItem('uploadedAudioFiles');
        if (stored) {
          const files = JSON.parse(stored);
          setUploadedFiles(files);
          if (files.length > 0 && !selectedFile) {
            setSelectedFile(files[0]);
          }
        }
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };

    loadFiles();
    // Listen for storage changes (when files are uploaded)
    window.addEventListener('storage', loadFiles);
    // Also check periodically in case of same-tab updates
    const interval = setInterval(loadFiles, 1000);
    
    return () => {
      window.removeEventListener('storage', loadFiles);
      clearInterval(interval);
    };
  }, [selectedFile]);

  const [eq, setEq] = useState<EQSettings>({
    enabled: false,
    lowFreq: 80,
    lowGain: 0,
    midFreq: 1000,
    midGain: 0,
    midQ: 1,
    highFreq: 8000,
    highGain: 0,
  });

  const [reverb, setReverb] = useState<ReverbSettings>({
    enabled: false,
    roomSize: 0.5,
    wet: 0.3,
    dry: 0.7,
    decay: 2,
    preDelay: 0.02,
  });

  const [delay, setDelay] = useState<DelaySettings>({
    enabled: false,
    time: 0.25,
    feedback: 0.3,
    wet: 0.2,
    syncToBPM: true,
    bpm: 128,
  });

  const [compression, setCompression] = useState<CompressionSettings>({
    enabled: false,
    threshold: -12,
    ratio: 4,
    attack: 10,
    release: 100,
    makeupGain: 0,
  });

  const eqPresets = [
    { name: "Bright", lowGain: 0, midGain: 2, highGain: 4 },
    { name: "Dark", lowGain: 2, midGain: 0, highGain: -2 },
    { name: "Neutral", lowGain: 0, midGain: 0, highGain: 0 },
    { name: "Bass Boost", lowGain: 6, midGain: 0, highGain: 0 },
  ];

  const applyEQPreset = (preset: typeof eqPresets[0]) => {
    setEq(prev => ({
      ...prev,
      lowGain: preset.lowGain,
      midGain: preset.midGain,
      highGain: preset.highGain,
    }));
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">Effects Rack</h1>
            <p className="text-xs text-white/40">
              Apply effects to selected audio files
            </p>
          </div>
          {selectedFile && (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <Music2 className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-white font-medium">{selectedFile.title || selectedFile.name}</p>
                {selectedFile.artist && (
                  <p className="text-xs text-white/50">{selectedFile.artist}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* File Selection */}
          {uploadedFiles.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
              <Music2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-2">No audio files uploaded</p>
              <p className="text-sm text-white/40 mb-4">
                Go to "Upload Audio" to upload files first
              </p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Select Audio File</h2>
              <div className="grid grid-cols-2 gap-3">
                {uploadedFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      setSelectedFile(file);
                      toast.success(`Selected "${file.title || file.name}"`);
                    }}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedFile?.id === file.id
                        ? "bg-primary/20 border-primary"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden">
                        {file.artwork ? (
                          <img src={file.artwork} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Music2 className="w-5 h-5 text-white/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">{file.title || file.name}</h3>
                        {file.artist && (
                          <p className="text-xs text-white/50 truncate">{file.artist}</p>
                        )}
                        <p className="text-xs text-white/40 font-['IBM_Plex_Mono'] mt-1">
                          {Math.floor(file.duration / 60)}:{(file.duration % 60).toFixed(0).padStart(2, '0')}
                          {file.bpm && ` • ${file.bpm} BPM`}
                          {file.key && ` • ${file.key}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedFile && (
            <>
          {/* EQ */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEq(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`p-2 rounded-lg transition-all ${
                    eq.enabled ? "bg-primary/20 text-primary" : "bg-white/5 text-white/40"
                  }`}
                >
                  <Power className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-primary" />
                    Parametric EQ
                  </h2>
                  <p className="text-xs text-white/50">3-band parametric equalizer</p>
                </div>
              </div>
            </div>

            {eq.enabled && (
              <div className="space-y-6">
                {/* EQ Presets */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Presets</label>
                  <div className="flex gap-2">
                    {eqPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        onClick={() => applyEQPreset(preset)}
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* EQ Bands */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/50 uppercase font-['IBM_Plex_Mono']">Low</span>
                      <span className="text-xs text-white font-['IBM_Plex_Mono']">
                        {eq.lowGain > 0 ? "+" : ""}{eq.lowGain.toFixed(1)} dB
                      </span>
                    </div>
                    <Slider
                      value={[eq.lowGain]}
                      min={-12}
                      max={12}
                      step={0.5}
                      onValueChange={(val) => setEq(prev => ({ ...prev, lowGain: val[0] }))}
                    />
                    <p className="text-[10px] text-white/40 mt-1 font-['IBM_Plex_Mono']">
                      {eq.lowFreq} Hz
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/50 uppercase font-['IBM_Plex_Mono']">Mid</span>
                      <span className="text-xs text-white font-['IBM_Plex_Mono']">
                        {eq.midGain > 0 ? "+" : ""}{eq.midGain.toFixed(1)} dB
                      </span>
                    </div>
                    <Slider
                      value={[eq.midGain]}
                      min={-12}
                      max={12}
                      step={0.5}
                      onValueChange={(val) => setEq(prev => ({ ...prev, midGain: val[0] }))}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-white/40 font-['IBM_Plex_Mono']">Freq:</span>
                      <Slider
                        value={[eq.midFreq]}
                        min={200}
                        max={5000}
                        step={50}
                        onValueChange={(val) => setEq(prev => ({ ...prev, midFreq: val[0] }))}
                        className="flex-1"
                      />
                      <span className="text-[10px] text-white/40 font-['IBM_Plex_Mono'] w-12 text-right">
                        {eq.midFreq} Hz
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/50 uppercase font-['IBM_Plex_Mono']">High</span>
                      <span className="text-xs text-white font-['IBM_Plex_Mono']">
                        {eq.highGain > 0 ? "+" : ""}{eq.highGain.toFixed(1)} dB
                      </span>
                    </div>
                    <Slider
                      value={[eq.highGain]}
                      min={-12}
                      max={12}
                      step={0.5}
                      onValueChange={(val) => setEq(prev => ({ ...prev, highGain: val[0] }))}
                    />
                    <p className="text-[10px] text-white/40 mt-1 font-['IBM_Plex_Mono']">
                      {eq.highFreq} Hz
                    </p>
                  </div>
                </div>

                {/* Frequency Response Curve (Visual) */}
                <div className="h-32 bg-black/40 rounded border border-white/10 p-2">
                  <svg width="100%" height="100%" className="overflow-visible">
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white/20" strokeWidth="1" />
                    <polyline
                      points={`0,${50 - eq.lowGain * 2}% 33%,${50 - eq.midGain * 2}% 66%,${50 - eq.midGain * 2}% 100%,${50 - eq.highGain * 2}%`}
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Reverb */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReverb(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`p-2 rounded-lg transition-all ${
                    reverb.enabled ? "bg-primary/20 text-primary" : "bg-white/5 text-white/40"
                  }`}
                >
                  <Power className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-primary" />
                    Reverb
                  </h2>
                  <p className="text-xs text-white/50">Spatial audio effect</p>
                </div>
              </div>
            </div>

            {reverb.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Room Size</label>
                  <div className="flex gap-2">
                    {["Small", "Medium", "Large", "Hall"].map((size) => (
                      <Button
                        key={size}
                        onClick={() => {
                          const sizes = [0.3, 0.5, 0.7, 0.9];
                          setReverb(prev => ({ ...prev, roomSize: sizes[["Small", "Medium", "Large", "Hall"].indexOf(size)] }));
                        }}
                        variant="outline"
                        className={`flex-1 text-xs ${
                          (size === "Small" && reverb.roomSize < 0.4) ||
                          (size === "Medium" && reverb.roomSize >= 0.4 && reverb.roomSize < 0.6) ||
                          (size === "Large" && reverb.roomSize >= 0.6 && reverb.roomSize < 0.8) ||
                          (size === "Hall" && reverb.roomSize >= 0.8)
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-white/5 border-white/10 text-white/60"
                        }`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Wet/Dry Mix</label>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/50">Wet</span>
                        <span className="text-xs text-white font-['IBM_Plex_Mono']">
                          {(reverb.wet * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        value={[reverb.wet]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(val) => setReverb(prev => ({ ...prev, wet: val[0], dry: 1 - val[0] }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Decay Time</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[reverb.decay]}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onValueChange={(val) => setReverb(prev => ({ ...prev, decay: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                      {reverb.decay.toFixed(1)}s
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Pre-Delay</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[reverb.preDelay]}
                      min={0}
                      max={0.1}
                      step={0.001}
                      onValueChange={(val) => setReverb(prev => ({ ...prev, preDelay: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                      {(reverb.preDelay * 1000).toFixed(0)}ms
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delay */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDelay(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`p-2 rounded-lg transition-all ${
                    delay.enabled ? "bg-primary/20 text-primary" : "bg-white/5 text-white/40"
                  }`}
                >
                  <Power className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Waves className="w-5 h-5 text-primary" />
                    Delay
                  </h2>
                  <p className="text-xs text-white/50">Echo and repeat effect</p>
                </div>
              </div>
            </div>

            {delay.enabled && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={delay.syncToBPM}
                    onChange={(e) => setDelay(prev => ({ ...prev, syncToBPM: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label className="text-sm text-white/70">Sync to BPM</label>
                </div>

                {delay.syncToBPM ? (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Note Value</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["1/4", "1/8", "1/16", "1/32"].map((note) => {
                        const noteValues: Record<string, number> = {
                          "1/4": 0.25,
                          "1/8": 0.125,
                          "1/16": 0.0625,
                          "1/32": 0.03125,
                        };
                        const calculatedTime = (60 / delay.bpm) * (1 / parseFloat(note.split('/')[1]));
                        return (
                          <Button
                            key={note}
                            onClick={() => setDelay(prev => ({ ...prev, time: calculatedTime }))}
                            variant="outline"
                            className={`text-xs ${
                              Math.abs(delay.time - calculatedTime) < 0.01
                                ? "bg-primary/20 border-primary text-primary"
                                : "bg-white/5 border-white/10 text-white/60"
                            }`}
                          >
                            {note}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Delay Time</label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[delay.time]}
                        min={0.01}
                        max={1}
                        step={0.01}
                        onValueChange={(val) => setDelay(prev => ({ ...prev, time: val[0] }))}
                        className="flex-1"
                      />
                      <span className="text-sm text-white font-['IBM_Plex_Mono'] w-20 text-right">
                        {delay.time.toFixed(2)}s
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Feedback</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[delay.feedback]}
                      min={0}
                      max={0.9}
                      step={0.01}
                      onValueChange={(val) => setDelay(prev => ({ ...prev, feedback: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                      {(delay.feedback * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Wet/Dry Mix</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[delay.wet]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(val) => setDelay(prev => ({ ...prev, wet: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                      {(delay.wet * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compression */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCompression(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`p-2 rounded-lg transition-all ${
                    compression.enabled ? "bg-primary/20 text-primary" : "bg-white/5 text-white/40"
                  }`}
                >
                  <Power className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-primary" />
                    Compression
                  </h2>
                  <p className="text-xs text-white/50">Dynamic range control</p>
                </div>
              </div>
            </div>

            {compression.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Threshold</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[compression.threshold]}
                      min={-40}
                      max={0}
                      step={1}
                      onValueChange={(val) => setCompression(prev => ({ ...prev, threshold: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                      {compression.threshold} dB
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Ratio</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[compression.ratio]}
                      min={1}
                      max={8}
                      step={0.5}
                      onValueChange={(val) => setCompression(prev => ({ ...prev, ratio: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-20 text-right">
                      {compression.ratio.toFixed(1)}:1
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Attack</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[compression.attack]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(val) => setCompression(prev => ({ ...prev, attack: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                      {compression.attack}ms
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Release</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[compression.release]}
                      min={10}
                      max={500}
                      step={10}
                      onValueChange={(val) => setCompression(prev => ({ ...prev, release: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                      {compression.release}ms
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Make-up Gain</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[compression.makeupGain]}
                      min={0}
                      max={12}
                      step={0.5}
                      onValueChange={(val) => setCompression(prev => ({ ...prev, makeupGain: val[0] }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                      +{compression.makeupGain.toFixed(1)} dB
                    </span>
                  </div>
                </div>

                {/* Gain Reduction Meter */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">Gain Reduction</label>
                  <div className="h-4 bg-white/10 rounded overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{
                        width: `${Math.min(100, Math.abs(compression.threshold) * 2)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

