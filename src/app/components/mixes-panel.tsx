import React, { useState } from "react";
import { Play, Pause, Download, Share2, Trash2, Filter, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

interface Mix {
  id: string;
  name: string;
  duration: string;
  trackCount: number;
  key: string;
  status: "Ready" | "Draft" | "Processing";
  date: string;
}

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

const generateWaveform = (mixId: string, count: number = 200): number[] => {
  const seed = mixId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    const random = Math.sin(seed + i) * 10000;
    const normalized = (random - Math.floor(random));
    heights.push(20 + normalized * 60);
  }
  return heights;
};

export function MixesPanel() {
  const [mixes] = useState<Mix[]>(FAKE_MIXES);
  const [playingMixId, setPlayingMixId] = useState<string | null>(null);
  const [hoveredMix, setHoveredMix] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<Record<string, number>>({});

  const handlePlay = (mixId: string) => {
    setPlayingMixId(playingMixId === mixId ? null : mixId);
    if (playingMixId !== mixId) {
      setPlaybackProgress(prev => ({ ...prev, [mixId]: prev[mixId] || 0 }));
    }
  };

  const handleWaveformClick = (mixId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPlaybackProgress(prev => ({ ...prev, [mixId]: percentage }));
    toast.info(`Scrubbing to ${Math.round(percentage)}%`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col px-16 py-8" style={{ background: 'var(--bg-0)' }}>
      {/* Header */}
      <div className="flex-shrink-0 mb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-4xl font-bold">My Mixes</h1>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition">
              <Filter className="w-5 h-5 text-white/70" />
            </button>
            <button className="w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition">
              <ArrowUpDown className="w-5 h-5 text-white/70" />
            </button>
            <button className="h-10 px-4 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white text-sm font-medium transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Import Mix
            </button>
          </div>
        </div>
      </div>

      {/* Mix List - Full Width Cards */}
      <div className="flex-1 overflow-auto space-y-4">
        {mixes.map((mix) => {
          const waveformHeights = generateWaveform(mix.id);
          const isPlaying = playingMixId === mix.id;
          const progress = playbackProgress[mix.id] || 0;
          const totalSeconds = 240; // Mock duration
          const currentSeconds = (progress / 100) * totalSeconds;
          
          return (
            <div
              key={mix.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 transition-all hover:border-orange-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_24px_rgba(249,115,22,0.1)]"
              onMouseEnter={() => setHoveredMix(mix.id)}
              onMouseLeave={() => setHoveredMix(null)}
            >
              {/* Top: Title + Duration */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-2xl font-bold">{mix.name}</h3>
                <div className="text-white/60 text-sm font-medium">{mix.duration}</div>
              </div>

              {/* Full-Width Waveform */}
              <div
                className="w-full h-24 rounded-xl bg-black/20 border border-white/5 relative cursor-pointer overflow-hidden mb-4"
                onClick={(e) => handleWaveformClick(mix.id, e)}
              >
                <div className="absolute inset-0 flex items-center gap-px px-2">
                  {waveformHeights.map((height, i) => {
                    const barProgress = (i / waveformHeights.length) * 100;
                    const isPast = barProgress <= progress;
                    return (
                      <div
                        key={i}
                        className="flex-1 h-full flex items-center"
                        style={{
                          opacity: isPast ? 1 : 0.4,
                        }}
                      >
                        <div
                          className="w-full rounded-sm"
                          style={{
                            height: `${height}%`,
                            background: isPast
                              ? 'linear-gradient(to top, #ff7a45, #00ffff)'
                              : 'linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.5))',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                
                {/* Playhead */}
                {isPlaying && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    style={{ left: `${progress}%` }}
                  />
                )}
              </div>

              {/* Playback Controls + Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => handlePlay(mix.id)}
                    className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-400 flex items-center justify-center transition shadow-[0_0_16px_rgba(249,115,22,0.3)]"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-black fill-black" />
                    ) : (
                      <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                    )}
                  </button>

                  {/* Time Display */}
                  <div className="text-white/80 text-sm font-medium font-mono">
                    {formatTime(currentSeconds)} / {mix.duration}
                  </div>

                  {/* Scrubber */}
                  <div className="flex-1 max-w-xs h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-cyan-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions (always visible on hover, or always visible) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.info("Sharing mix...")}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition"
                  >
                    <Share2 className="w-4 h-4 text-white/70" />
                  </button>
                  <button
                    onClick={() => toast.info("Downloading mix...")}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition"
                  >
                    <Download className="w-4 h-4 text-white/70" />
                  </button>
                  <button
                    onClick={() => toast.info("Deleting mix...")}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-red-500/20 hover:border-red-500/30 flex items-center justify-center transition"
                  >
                    <Trash2 className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
