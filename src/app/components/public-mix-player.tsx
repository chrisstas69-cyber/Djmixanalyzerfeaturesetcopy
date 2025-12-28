import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  startTime: number;
  duration: number;
}

export function PublicMixPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  const mixData = {
    title: "Evening Session Mix",
    style: "Peak Hour",
    totalDuration: 2538, // 42:18 in seconds
    date: "December 25, 2024",
    creator: "Auto DJ",
  };

  const tracks: Track[] = [
    { id: "1", title: "Midnight Grooves", artist: "DJ Shadow", bpm: 126, key: "Am", startTime: 0, duration: 402 },
    { id: "2", title: "Hypnotic Groove", artist: "Underground Mix", bpm: 126, key: "Am", startTime: 402, duration: 440 },
    { id: "3", title: "Warehouse Nights", artist: "Extended", bpm: 128, key: "Fm", startTime: 842, duration: 390 },
    { id: "4", title: "Deep House Vibes", artist: "Soulful Sessions", bpm: 124, key: "Dm", startTime: 1232, duration: 358 },
    { id: "5", title: "Rolling Bassline", artist: "Low Frequency", bpm: 127, key: "Gm", startTime: 1590, duration: 390 },
    { id: "6", title: "Peak Time Energy", artist: "Night Shift", bpm: 130, key: "Em", startTime: 1980, duration: 558 },
  ];

  // Generate waveform data
  const waveformData = Array.from({ length: 200 }, (_, i) => {
    const section = Math.floor(i / 40) % 5;
    const energy = section === 0 ? 0.5 : section === 1 ? 0.7 : section === 2 ? 0.9 : section === 3 ? 0.85 : 0.6;
    const variation = Math.sin(i / 8) * 0.2 + Math.sin(i / 3) * 0.15;
    const transient = i % 10 === 0 ? Math.random() * 0.15 : 0;
    return Math.max(0.15, Math.min(1, energy + variation + transient));
  });

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= mixData.totalDuration) {
          setIsPlaying(false);
          return mixData.totalDuration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, mixData.totalDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = Math.floor(percentage * mixData.totalDuration);
    setCurrentTime(newTime);
  };

  const handleTrackClick = (startTime: number) => {
    setCurrentTime(startTime);
    setIsPlaying(true);
  };

  const getCurrentTrack = () => {
    return tracks.find(
      (track) => currentTime >= track.startTime && currentTime < track.startTime + track.duration
    );
  };

  const currentTrack = getCurrentTrack();
  const progress = (currentTime / mixData.totalDuration) * 100;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Section - Waveform & Controls */}
        <div className="border-b border-white/5 bg-gradient-to-b from-[#0a0a0f] to-black">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold tracking-tight">{mixData.title}</h1>
                <div className="px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/20">
                  <span className="text-xs font-medium text-secondary">{mixData.style}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/50">
                <span>{mixData.creator}</span>
                <span>·</span>
                <span>{formatTime(mixData.totalDuration)}</span>
                <span>·</span>
                <span>{tracks.length} tracks</span>
                <span>·</span>
                <span>{mixData.date}</span>
              </div>
            </div>

            {/* Waveform Display */}
            <div className="mb-6">
              <div
                ref={waveformRef}
                onClick={handleWaveformClick}
                className="h-32 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 rounded-xl overflow-hidden relative cursor-pointer group"
              >
                {/* Waveform Bars */}
                <div className="absolute inset-0 flex items-center px-2 gap-px">
                  {waveformData.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 h-full flex items-center transition-opacity group-hover:opacity-100"
                      style={{
                        opacity: (i / waveformData.length) * 100 < progress ? 0.9 : 0.3,
                      }}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-secondary via-secondary to-secondary/80"
                        style={{
                          height: `${height * 100}%`,
                          boxShadow:
                            (i / waveformData.length) * 100 < progress
                              ? "0 0 4px rgba(237, 137, 54, 0.3)"
                              : "none",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Progress Overlay */}
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none"
                  style={{ width: `${progress}%` }}
                />

                {/* Playhead */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow-lg shadow-white/50 z-10 pointer-events-none"
                  style={{ left: `${progress}%` }}
                />

                {/* Track Markers */}
                <div className="absolute inset-x-0 top-0 flex">
                  {tracks.map((track) => {
                    const position = (track.startTime / mixData.totalDuration) * 100;
                    return (
                      <div
                        key={track.id}
                        className="absolute inset-y-0 w-px bg-white/20"
                        style={{ left: `${position}%` }}
                      />
                    );
                  })}
                </div>

                {/* Current Track Indicator */}
                {currentTrack && (
                  <div className="absolute bottom-2 left-4 right-4 flex items-center gap-2 pointer-events-none">
                    <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur border border-white/10">
                      <span className="text-xs font-medium">
                        {currentTrack.title} · {currentTrack.artist}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              <div className="mt-4 flex items-center gap-6">
                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary hover:to-secondary border border-secondary/50 flex items-center justify-center shadow-lg shadow-secondary/20 transition-all hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white fill-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  )}
                </button>

                {/* Time Display */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-['IBM_Plex_Mono'] text-white/80 w-12">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-secondary/80 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-['IBM_Plex_Mono'] text-white/50 w-12 text-right">
                    {formatTime(mixData.totalDuration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tracklist */}
        <div className="flex-1 bg-black">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Tracklist
            </h2>
            <div className="space-y-1">
              {tracks.map((track, index) => {
                const isCurrentTrack = currentTrack?.id === track.id;
                const isHovered = hoveredTrack === track.id;

                return (
                  <button
                    key={track.id}
                    onClick={() => handleTrackClick(track.startTime)}
                    onMouseEnter={() => setHoveredTrack(track.id)}
                    onMouseLeave={() => setHoveredTrack(null)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group text-left ${
                      isCurrentTrack
                        ? "bg-secondary/10 border border-secondary/20"
                        : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    {/* Track Number */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-['IBM_Plex_Mono'] text-sm transition-colors ${
                        isCurrentTrack
                          ? "bg-secondary/20 border border-secondary/30 text-secondary"
                          : "bg-white/5 border border-white/10 text-white/50 group-hover:bg-white/10 group-hover:text-white/70"
                      }`}
                    >
                      {(index + 1).toString().padStart(2, "0")}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium mb-0.5 truncate transition-colors ${
                          isCurrentTrack
                            ? "text-secondary"
                            : "text-white/90 group-hover:text-white"
                        }`}
                      >
                        {track.title}
                      </div>
                      <div className="text-xs text-white/50 truncate">{track.artist}</div>
                    </div>

                    {/* Track Metadata */}
                    <div className="flex items-center gap-4 font-['IBM_Plex_Mono'] text-xs text-white/50">
                      <span className="w-12 text-center">{track.bpm}</span>
                      <span className="w-10 text-center">{track.key}</span>
                      <span className="w-16 text-right">{formatTime(track.duration)}</span>
                    </div>

                    {/* Timestamp */}
                    <div
                      className={`font-['IBM_Plex_Mono'] text-xs transition-colors ${
                        isCurrentTrack || isHovered ? "text-secondary" : "text-white/40"
                      }`}
                    >
                      {formatTime(track.startTime)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 bg-gradient-to-b from-black to-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 border border-white/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-secondary to-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Made with</p>
                <p className="text-sm font-semibold text-white/90">Syntax Audio Intelligence</p>
              </div>
            </div>

            {/* CTA Button */}
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary border border-secondary/50 text-white text-sm font-medium shadow-lg shadow-secondary/20 transition-all hover:scale-105">
              Create your own mix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
