import { useState } from "react";
import { Play, Pause, Filter, ArrowUpDown, Download, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Mix {
  id: string;
  name: string;
  duration: string;
  trackCount: number;
  key: string;
  status: "Ready" | "Draft" | "Processing";
  date: string; // Format: "12/23"
}

// Fake data - 8 mixes as specified
const FAKE_MIXES: Mix[] = [
  { id: "1", name: "Deep House Journey", duration: "16:18", trackCount: 129, key: "Am", status: "Ready", date: "12/23" },
  { id: "2", name: "Good Vibes", duration: "5:48", trackCount: 128, key: "Gm", status: "Ready", date: "12/19" },
  { id: "3", name: "Spiral Dreams", duration: "24:38", trackCount: 130, key: "Fm", status: "Draft", date: "12/12" },
  { id: "4", name: "House of Cuts", duration: "12:03", trackCount: 128, key: "Gm", status: "Ready", date: "12/05" },
  { id: "5", name: "Deep Dive", duration: "48:50", trackCount: 128, key: "Fm", status: "Processing", date: "11/28" },
  { id: "6", name: "Midnight Groove", duration: "9:12", trackCount: 124, key: "Gm", status: "Ready", date: "11/21" },
  { id: "7", name: "Urban Pulse", duration: "11:33", trackCount: 127, key: "B♭m", status: "Ready", date: "11/14" },
  { id: "8", name: "Techno Session 03", duration: "36:12", trackCount: 132, key: "F#m", status: "Draft", date: "11/07" },
];

// Generate waveform bars (150+ bars with random heights 20-80%)
const generateWaveform = (mixId: string, count: number = 150): number[] => {
  // Use mixId as seed for consistent waveform per mix
  const seed = mixId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    // Pseudo-random based on seed and index
    const random = Math.sin(seed + i) * 10000;
    const normalized = (random - Math.floor(random));
    heights.push(20 + normalized * 60); // 20-80% range
  }
  return heights;
};

export function MixesPanel() {
  const [mixes] = useState<Mix[]>(FAKE_MIXES);
  const [playingMixId, setPlayingMixId] = useState<string | null>(null);
  const [hoveredMix, setHoveredMix] = useState<string | null>(null);

  const handlePlay = (mixId: string) => {
    setPlayingMixId(playingMixId === mixId ? null : mixId);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
      {/* Header */}
      <div className="px-8 py-6 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-bold" style={{ color: 'var(--text)', fontWeight: 700 }}>
            My Mixes
          </h1>
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
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
              <Filter className="w-5 h-5" />
            </button>
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
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
              <ArrowUpDown className="w-5 h-5" />
            </button>
            <button
              className="h-10 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
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
              <Download className="w-4 h-4" />
              <span>Import Mix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mix List */}
      <div className="flex-1 overflow-auto">
        {mixes.map((mix) => {
          const waveformHeights = generateWaveform(mix.id);
          const isPlaying = playingMixId === mix.id;
          
          return (
            <div
              key={mix.id}
              className="flex items-center gap-4 transition-colors cursor-pointer relative"
              style={{
                background: isPlaying ? 'var(--surface)' : 'var(--panel)',
                borderBottom: '1px solid var(--border)',
                borderLeft: isPlaying ? '3px solid var(--orange)' : 'none',
                padding: '16px',
                minHeight: '100px',
                marginBottom: '20px',
              }}
              onMouseEnter={() => setHoveredMix(mix.id)}
              onMouseLeave={() => setHoveredMix(null)}
            >
              {/* Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(mix.id);
                }}
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-2)';
                  e.currentTarget.style.color = 'var(--cyan)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-2)';
                }}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </button>

              {/* Waveform Container */}
              <div className="flex-1 relative" style={{ height: '80px' }}>
                {/* Waveform Bars */}
                <div className="absolute inset-0 flex items-center gap-[1px] px-4 cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = (x / rect.width) * 100;
                  toast.info(`Scrubbing to ${Math.round(percentage)}%`);
                }}>
                  {waveformHeights.map((height, i) => (
                    <div
                      key={i}
                      style={{
                        width: '2px',
                        height: `${height}%`,
                        background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.6))`,
                        borderRadius: '1px',
                      }}
                    />
                  ))}
                </div>

                {/* Playhead (when playing) */}
                {isPlaying && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5"
                    style={{
                      left: '25%',
                      background: 'var(--orange)',
                      boxShadow: '0 0 8px var(--orange)',
                    }}
                  />
                )}

                {/* Mix Metadata Overlay */}
                <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-center pointer-events-none z-10">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>
                    {mix.name}
                  </h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>
                    {mix.duration} · {mix.trackCount} BPM · {mix.key}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: mix.status === "Ready" ? 'var(--cyan-2)' : mix.status === "Processing" ? 'var(--orange-2)' : 'var(--text-3)',
                    color: '#000',
                    fontSize: '12px',
                  }}
                >
                  {mix.status}
                </span>
              </div>

              {/* Date */}
              <div className="flex-shrink-0 w-12 text-right">
                <span style={{ color: 'var(--text-3)', fontSize: '13px' }}>
                  {mix.date}
                </span>
              </div>

              {/* Actions (on hover) */}
              {hoveredMix === mix.id && (
                <div className="flex-shrink-0 flex items-center gap-2 animate-in fade-in duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Sharing mix...");
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      border: '1px solid var(--border)',
                      color: 'var(--text-2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface)';
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-2)';
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Downloading mix...");
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      border: '1px solid var(--border)',
                      color: 'var(--text-2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface)';
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-2)';
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Deleting mix...");
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      border: '1px solid var(--border)',
                      color: 'var(--text-2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface)';
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-2)';
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
