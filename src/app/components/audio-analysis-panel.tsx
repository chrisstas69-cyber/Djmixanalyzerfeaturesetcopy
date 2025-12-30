import { useState, useEffect, useRef } from "react";
import { Music, TrendingUp, Key, Zap, Upload, Play, Loader2, Dna, Heart, Smile } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { AudioPlayer } from "./audio-player";
import { WaveformVisualizer } from "./waveform-visualizer";

interface AudioAnalysis {
  bpm: number;
  bpmConfidence: number;
  key: string;
  keyConfidence: number;
  energy: "Rising" | "Building" | "Peak" | "Chill" | "Groove" | "Steady";
  energyLevel: number; // 0-100
  duration: number;
  mood?: string;
  harmonics?: {
    dominant: string[];
    compatibility: string[];
  };
  dnaProfile?: {
    bpm: number;
    key: string;
    energy: string;
    mood: string;
    brightness: number; // 0-100
    dynamics: number; // 0-100
  };
}

interface AudioFile {
  id: string;
  name: string;
  data: string;
  duration: number;
  analysis?: AudioAnalysis;
}

// Mock BPM detection (in real app, would use Web Audio API)
const detectBPM = async (audioData: string): Promise<{ bpm: number; confidence: number }> => {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock detection: random BPM between 80-180
  const bpm = Math.floor(Math.random() * 100) + 80;
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
  
  return { bpm, confidence };
};

// Mock Key Detection
const detectKey = async (audioData: string): Promise<{ key: string; confidence: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const modes = ["m", ""]; // minor, major
  const key = keys[Math.floor(Math.random() * keys.length)] + modes[Math.floor(Math.random() * modes.length)];
  const confidence = Math.floor(Math.random() * 25) + 75; // 75-100%
  
  return { key, confidence };
};

// Mock Energy Detection
const detectEnergy = async (audioData: string, duration: number): Promise<{ energy: string; level: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const energies: Array<"Rising" | "Building" | "Peak" | "Chill" | "Groove" | "Steady"> = 
    ["Rising", "Building", "Peak", "Chill", "Groove", "Steady"];
  const energy = energies[Math.floor(Math.random() * energies.length)];
  const level = Math.floor(Math.random() * 40) + 60; // 60-100%
  
  return { energy, level };
};

// Mock Mood Detection
const detectMood = async (audioData: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const moods = ["Happy", "Dark", "Melancholic", "Energetic", "Chill", "Aggressive", "Melodic"];
  return moods[Math.floor(Math.random() * moods.length)];
};

// Mock Harmonic Analysis
const analyzeHarmonics = async (audioData: string, detectedKey: string): Promise<{ dominant: string[]; compatibility: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const allKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const keyIndex = allKeys.findIndex(k => detectedKey.startsWith(k));
  
  // Harmonically compatible keys (circle of fifths)
  const compatible = [
    allKeys[keyIndex],
    allKeys[(keyIndex + 7) % 12], // Perfect fifth
    allKeys[(keyIndex + 5) % 12], // Perfect fourth
  ];
  
  return {
    dominant: [detectedKey],
    compatibility: compatible,
  };
};

export function AudioAnalysisPanel() {
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [manualBPM, setManualBPM] = useState<number | null>(null);
  const [manualKey, setManualKey] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<AudioFile[]>([]);

  // Load uploaded files
  useEffect(() => {
    try {
      const stored = localStorage.getItem('uploadedAudioFiles');
      if (stored) {
        const files = JSON.parse(stored);
        setUploadedFiles(files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }, []);

  const handleFileSelect = (file: AudioFile) => {
    setSelectedFile(file);
    if (file.analysis) {
      setAnalysis(file.analysis);
      setManualBPM(file.analysis.bpm);
      setManualKey(file.analysis.key);
    } else {
      setAnalysis(null);
      setManualBPM(null);
      setManualKey("");
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    try {
      const [bpmResult, keyResult, energyResult, moodResult, harmonicsResult] = await Promise.all([
        detectBPM(selectedFile.data),
        detectKey(selectedFile.data),
        detectEnergy(selectedFile.data, selectedFile.duration),
        detectMood(selectedFile.data),
        detectKey(selectedFile.data).then(key => analyzeHarmonics(selectedFile.data, key.key)),
      ]);

      const detectedKey = manualKey || keyResult.key;
      const detectedBPM = manualBPM || bpmResult.bpm;

      const newAnalysis: AudioAnalysis = {
        bpm: detectedBPM,
        bpmConfidence: manualBPM ? 100 : bpmResult.confidence,
        key: detectedKey,
        keyConfidence: manualKey ? 100 : keyResult.confidence,
        energy: energyResult.energy as any,
        energyLevel: energyResult.level,
        duration: selectedFile.duration,
        mood: moodResult,
        harmonics: harmonicsResult,
        dnaProfile: {
          bpm: detectedBPM,
          key: detectedKey,
          energy: energyResult.energy,
          mood: moodResult,
          brightness: Math.floor(Math.random() * 40) + 60, // 60-100
          dynamics: Math.floor(Math.random() * 40) + 60, // 60-100
        },
      };

      setAnalysis(newAnalysis);

      // Save analysis to file
      const updatedFiles = uploadedFiles.map(f =>
        f.id === selectedFile.id ? { ...f, analysis: newAnalysis } : f
      );
      setUploadedFiles(updatedFiles);
      localStorage.setItem('uploadedAudioFiles', JSON.stringify(updatedFiles));

      toast.success("Analysis complete!");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const modes = ["", "m"];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1">Audio Analysis</h1>
        <p className="text-xs text-white/40">
          Detect BPM, key, and energy from uploaded audio files
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: File Selection & Analysis */}
          <div className="space-y-6">
            {/* File Selection */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Select Audio File</h2>
              {uploadedFiles.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 mb-2">No audio files uploaded</p>
                  <p className="text-sm text-white/40 mb-4">
                    Go to "Upload Audio" to upload files first
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleFileSelect(file)}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        selectedFile?.id === file.id
                          ? "bg-primary/20 border-primary"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">{file.name}</h3>
                          <p className="text-xs text-white/50 font-['IBM_Plex_Mono'] mt-1">
                            {Math.floor(file.duration / 60)}:{(file.duration % 60).toFixed(0).padStart(2, '0')}
                          </p>
                        </div>
                        {file.analysis && (
                          <div className="text-xs text-primary font-['IBM_Plex_Mono']">
                            {file.analysis.bpm} BPM • {file.analysis.key}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Analysis Controls */}
            {selectedFile && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Analysis</h2>
                  <Button
                    onClick={runAnalysis}
                    disabled={analyzing}
                    className="bg-primary hover:bg-primary/80 text-white"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                </div>

                {/* Manual Overrides */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Manual BPM Override
                    </label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[manualBPM || analysis?.bpm || 120]}
                        min={80}
                        max={180}
                        step={1}
                        onValueChange={(val) => setManualBPM(val[0])}
                        className="flex-1"
                      />
                      <span className="text-sm text-white font-['IBM_Plex_Mono'] w-16 text-right">
                        {manualBPM || analysis?.bpm || 120} BPM
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Manual Key Override
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {keys.map((key) => (
                        <div key={key} className="space-y-1">
                          <button
                            onClick={() => setManualKey(key)}
                            className={`w-full py-2 rounded text-xs font-medium transition-all ${
                              manualKey === key || (!manualKey && analysis?.key?.startsWith(key))
                                ? "bg-primary text-white"
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {key}
                          </button>
                          {modes.map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setManualKey(key + mode)}
                              className={`w-full py-1 rounded text-[10px] font-medium transition-all ${
                                manualKey === key + mode || (!manualKey && analysis?.key === key + mode)
                                  ? "bg-primary/80 text-white"
                                  : "bg-white/5 text-white/40 hover:bg-white/10"
                              }`}
                            >
                              {mode || "Maj"}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Results & Player */}
          <div className="space-y-6">
            {/* Analysis Results */}
            {analysis && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Analysis Results</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                        BPM
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {analysis.bpm}
                    </p>
                    <p className="text-xs text-white/40 mt-1 font-['IBM_Plex_Mono']">
                      {analysis.bpmConfidence}% confidence
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-primary" />
                      <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                        Key
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {analysis.key}
                    </p>
                    <p className="text-xs text-white/40 mt-1 font-['IBM_Plex_Mono']">
                      {analysis.keyConfidence}% confidence
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                        Energy
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-white font-['IBM_Plex_Mono']">
                        {analysis.energy}
                      </p>
                      <div className="flex-1 ml-4">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${analysis.energyLevel}%` }}
                          />
                        </div>
                        <p className="text-xs text-white/40 mt-1 text-right font-['IBM_Plex_Mono']">
                          {analysis.energyLevel}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Player */}
            {selectedFile && (
              <AudioPlayer
                audioData={selectedFile.data}
                title={selectedFile.name}
                duration={selectedFile.duration}
                energy={analysis?.energy || "Peak"}
              />
            )}

            {/* Empty State */}
            {!selectedFile && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <Music className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No file selected</p>
                <p className="text-sm text-white/40">
                  Select an audio file to view analysis and playback
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

