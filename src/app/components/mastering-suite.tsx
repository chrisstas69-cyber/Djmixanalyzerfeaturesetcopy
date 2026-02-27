import { useState } from "react";
import { Gauge, Volume2, TrendingUp, Download, Play, Pause } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

interface MasteringSettings {
  multibandCompressor: {
    enabled: boolean;
    low: { threshold: number; ratio: number };
    mid: { threshold: number; ratio: number };
    high: { threshold: number; ratio: number };
  };
  eq: {
    enabled: boolean;
    low: number;
    mid: number;
    high: number;
  };
  limiter: {
    enabled: boolean;
    threshold: number;
    ceiling: number;
  };
  reference: {
    enabled: boolean;
    trackId?: string;
  };
}

export function MasteringSuite() {
  const [settings, setSettings] = useState<MasteringSettings>({
    multibandCompressor: {
      enabled: true,
      low: { threshold: -12, ratio: 4 },
      mid: { threshold: -10, ratio: 3 },
      high: { threshold: -8, ratio: 2 },
    },
    eq: {
      enabled: true,
      low: 0,
      mid: 0,
      high: 0,
    },
    limiter: {
      enabled: true,
      threshold: -1,
      ceiling: 0,
    },
    reference: {
      enabled: false,
    },
  });

  const [meters, setMeters] = useState({
    lufs: -14.2,
    peak: -0.3,
    rms: -6.5,
    truePeak: -0.1,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleMaster = async () => {
    setIsProcessing(true);
    // Simulate mastering process
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Mastering complete!");
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Mastering Suite
            </h1>
            <p className="text-xs text-white/40">
              Professional mastering tools for final polish
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewing(!isPreviewing)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
            >
              {isPreviewing ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>
            <Button
              onClick={handleMaster}
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/80 text-white"
            >
              {isProcessing ? "Processing..." : "Master Track"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Meters */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">LUFS</span>
                <Gauge className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                {meters.lufs.toFixed(1)}
              </p>
              <p className="text-xs text-white/40 mt-1">Target: -14.0</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">Peak</span>
                <Volume2 className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                {meters.peak.toFixed(1)} dB
              </p>
              <p className="text-xs text-white/40 mt-1">Max: 0.0 dB</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">RMS</span>
                <TrendingUp className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                {meters.rms.toFixed(1)} dB
              </p>
              <p className="text-xs text-white/40 mt-1">Average level</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">True Peak</span>
                <Volume2 className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                {meters.truePeak.toFixed(1)} dB
              </p>
              <p className="text-xs text-white/40 mt-1">Inter-sample peak</p>
            </div>
          </div>

          {/* Multiband Compressor */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Multiband Compressor</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.multibandCompressor.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      multibandCompressor: {
                        ...settings.multibandCompressor,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                />
                <span className="text-sm text-white/80">Enabled</span>
              </label>
            </div>

            {settings.multibandCompressor.enabled && (
              <div className="grid grid-cols-3 gap-6">
                {(["low", "mid", "high"] as const).map((band) => (
                  <div key={band} className="space-y-4">
                    <h3 className="text-sm font-semibold text-white capitalize">{band} Band</h3>
                    <div>
                      <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                        Threshold: {settings.multibandCompressor[band].threshold} dB
                      </label>
                      <Slider
                        value={[settings.multibandCompressor[band].threshold]}
                        min={-30}
                        max={0}
                        step={0.5}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            multibandCompressor: {
                              ...settings.multibandCompressor,
                              [band]: {
                                ...settings.multibandCompressor[band],
                                threshold: value[0],
                              },
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                        Ratio: {settings.multibandCompressor[band].ratio}:1
                      </label>
                      <Slider
                        value={[settings.multibandCompressor[band].ratio]}
                        min={1}
                        max={20}
                        step={0.5}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            multibandCompressor: {
                              ...settings.multibandCompressor,
                              [band]: {
                                ...settings.multibandCompressor[band],
                                ratio: value[0],
                              },
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EQ */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Linear Phase EQ</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.eq.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      eq: { ...settings.eq, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                />
                <span className="text-sm text-white/80">Enabled</span>
              </label>
            </div>

            {settings.eq.enabled && (
              <div className="grid grid-cols-3 gap-6">
                {(["low", "mid", "high"] as const).map((band) => (
                  <div key={band}>
                    <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                      {band.toUpperCase()}: {settings.eq[band] > 0 ? "+" : ""}
                      {settings.eq[band].toFixed(1)} dB
                    </label>
                    <Slider
                      value={[settings.eq[band]]}
                      min={-12}
                      max={12}
                      step={0.1}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          eq: { ...settings.eq, [band]: value[0] },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Limiter */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Limiter</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.limiter.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      limiter: { ...settings.limiter, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                />
                <span className="text-sm text-white/80">Enabled</span>
              </label>
            </div>

            {settings.limiter.enabled && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Threshold: {settings.limiter.threshold} dB
                  </label>
                  <Slider
                    value={[settings.limiter.threshold]}
                    min={-6}
                    max={0}
                    step={0.1}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        limiter: { ...settings.limiter, threshold: value[0] },
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Ceiling: {settings.limiter.ceiling} dB
                  </label>
                  <Slider
                    value={[settings.limiter.ceiling]}
                    min={-3}
                    max={0}
                    step={0.1}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        limiter: { ...settings.limiter, ceiling: value[0] },
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reference Track */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Reference Track</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reference.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      reference: { ...settings.reference, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                />
                <span className="text-sm text-white/80">Compare</span>
              </label>
            </div>

            {settings.reference.enabled && (
              <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                <option>Select reference track...</option>
                <option>Professional Mix 1</option>
                <option>Professional Mix 2</option>
              </select>
            )}
          </div>

          {/* Export */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Export Mastered Version</h2>
            <div className="flex items-center gap-3">
              <select className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                <option>WAV 24-bit</option>
                <option>WAV 32-bit</option>
                <option>MP3 320 kbps</option>
                <option>MP3 256 kbps</option>
              </select>
              <Button className="bg-primary hover:bg-primary/80 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

