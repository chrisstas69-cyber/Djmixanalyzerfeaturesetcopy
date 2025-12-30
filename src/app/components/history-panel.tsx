import { useState, useEffect, useMemo } from "react";
import { Clock, TrendingUp, Music2, Play, Calendar } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  energy: string;
  version: "A" | "B" | "C";
  status: "NOW PLAYING" | "UP NEXT" | "READY" | "PLAYED" | null;
  artwork?: string;
  dateAdded: string;
}

interface PlaybackHistoryEntry {
  trackId: string;
  timestamp: string;
  duration: number; // in seconds
}

interface TrackPlayStats {
  trackId: string;
  playCount: number;
  totalDuration: number;
  lastPlayed: string;
  track?: Track;
}

export function HistoryPanel() {
  const [history, setHistory] = useState<PlaybackHistoryEntry[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  // Load history and tracks from localStorage
  useEffect(() => {
    try {
      // Load playback history
      const historyStr = localStorage.getItem('playbackHistory');
      if (historyStr) {
        setHistory(JSON.parse(historyStr));
      }

      // Load tracks from library
      const libraryTracksStr = localStorage.getItem('libraryTracks');
      const libraryTracks: Track[] = libraryTracksStr ? JSON.parse(libraryTracksStr) : [];
      
      // Also load MOCK_TRACKS for demo
      const MOCK_TRACKS: Track[] = [
        { id: "1", title: "Midnight Drive", artist: "Neon Nights", bpm: 128, key: "Am", duration: "6:45", energy: "Peak", version: "A", status: null, dateAdded: "2023-12-01" },
        { id: "2", title: "Electric Pulse", artist: "Synth Wave", bpm: 130, key: "Fm", duration: "5:20", energy: "Rising", version: "B", status: null, dateAdded: "2023-12-02" },
        { id: "3", title: "Deep Resonance", artist: "Bass Drop", bpm: 125, key: "Gm", duration: "7:15", energy: "Building", version: "C", status: null, dateAdded: "2023-12-03" },
        { id: "4", title: "Urban Groove", artist: "City Lights", bpm: 132, key: "Em", duration: "6:00", energy: "Groove", version: "A", status: null, dateAdded: "2023-12-04" },
        { id: "5", title: "Rolling Bassline", artist: "Low Frequency", bpm: 127, key: "Gm", duration: "6:30", energy: "Steady", version: "B", status: null, dateAdded: "2023-12-05" },
      ];
      
      const existingIds = new Set(libraryTracks.map(t => t.id));
      const newMockTracks = MOCK_TRACKS.filter(t => !existingIds.has(t.id));
      setTracks([...libraryTracks, ...newMockTracks]);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  // Get recently played tracks (last 10)
  const recentlyPlayed = useMemo(() => {
    const sorted = [...history].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return sorted.slice(0, 10).map(entry => {
      const track = tracks.find(t => t.id === entry.trackId);
      return {
        ...entry,
        track,
      };
    }).filter(item => item.track); // Only include entries where track exists
  }, [history, tracks]);

  // Calculate play stats per track
  const trackPlayStats = useMemo(() => {
    const statsMap = new Map<string, TrackPlayStats>();

    history.forEach(entry => {
      const existing = statsMap.get(entry.trackId);
      if (existing) {
        existing.playCount += 1;
        existing.totalDuration += entry.duration;
        if (new Date(entry.timestamp) > new Date(existing.lastPlayed)) {
          existing.lastPlayed = entry.timestamp;
        }
      } else {
        statsMap.set(entry.trackId, {
          trackId: entry.trackId,
          playCount: 1,
          totalDuration: entry.duration,
          lastPlayed: entry.timestamp,
        });
      }
    });

    // Add track info to stats
    const statsArray = Array.from(statsMap.values()).map(stat => {
      const track = tracks.find(t => t.id === stat.trackId);
      return {
        ...stat,
        track,
      };
    }).filter(stat => stat.track); // Only include stats where track exists

    // Sort by play count (descending)
    return statsArray.sort((a, b) => b.playCount - a.playCount);
  }, [history, tracks]);

  // Calculate listening stats
  const listeningStats = useMemo(() => {
    const totalTracksPlayed = history.length;
    const totalDuration = history.reduce((sum, entry) => sum + entry.duration, 0);
    const avgDuration = totalTracksPlayed > 0 ? Math.round(totalDuration / totalTracksPlayed) : 0;
    
    // Format total duration as hours:minutes:seconds
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = totalDuration % 60;
    const formattedTotal = hours > 0 
      ? `${hours}h ${minutes}m ${seconds}s`
      : `${minutes}m ${seconds}s`;

    // Calculate most played genre (using energy as proxy)
    const energyCounts: Record<string, number> = {};
    history.forEach(entry => {
      const track = tracks.find(t => t.id === entry.trackId);
      if (track && track.energy) {
        energyCounts[track.energy] = (energyCounts[track.energy] || 0) + 1;
      }
    });
    const mostPlayedGenre = Object.entries(energyCounts).reduce((a, b) => 
      energyCounts[a[0]] > energyCounts[b[0]] ? a : b, 
      ["", 0]
    )[0] || "N/A";

    // Calculate favorite time of day
    const hourCounts: Record<number, number> = {};
    history.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const favoriteHour = Object.entries(hourCounts).reduce((a, b) => 
      hourCounts[parseInt(a[0])] > hourCounts[parseInt(b[0])] ? a : b, 
      ["0", 0]
    )[0];
    
    let favoriteTimeOfDay = "N/A";
    if (favoriteHour !== "0") {
      const hour = parseInt(favoriteHour);
      if (hour >= 5 && hour < 12) favoriteTimeOfDay = "Morning (5am-12pm)";
      else if (hour >= 12 && hour < 17) favoriteTimeOfDay = "Afternoon (12pm-5pm)";
      else if (hour >= 17 && hour < 21) favoriteTimeOfDay = "Evening (5pm-9pm)";
      else favoriteTimeOfDay = "Night (9pm-5am)";
    }

    return {
      totalTracksPlayed,
      totalDuration: formattedTotal,
      avgDuration: `${Math.floor(avgDuration / 60)}:${String(avgDuration % 60).padStart(2, '0')}`,
      mostPlayedGenre,
      favoriteTimeOfDay,
    };
  }, [history, tracks]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1">Playback History</h1>
        <p className="text-xs text-white/40">
          Track your listening activity and insights
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Listening Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                    Total Tracks Played
                  </p>
                  <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                    {listeningStats.totalTracksPlayed}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-400/10 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                    Total Listening Time
                  </p>
                  <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                    {listeningStats.totalDuration}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-400/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                    Avg Play Duration
                  </p>
                  <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                    {listeningStats.avgDuration}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-400/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                    Most Played Genre
                  </p>
                  <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                    {listeningStats.mostPlayedGenre}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-yellow-400/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                    Favorite Time
                  </p>
                  <p className="text-sm font-bold text-white font-['IBM_Plex_Mono']">
                    {listeningStats.favoriteTimeOfDay}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Played */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Recently Played</h2>
              <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                (Last 10 tracks)
              </span>
            </div>
            {recentlyPlayed.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <Music2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-1">No playback history yet</p>
                <p className="text-sm text-white/40">Start playing tracks to see your history here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentlyPlayed.map((entry, index) => (
                  <div
                    key={`${entry.trackId}-${entry.timestamp}`}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">
                            {entry.track?.title || "Unknown Track"}
                          </h3>
                          <p className="text-xs text-white/50 truncate">
                            {entry.track?.artist || "Unknown Artist"}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-white/40 font-['IBM_Plex_Mono']">
                            <span>{entry.track?.bpm} BPM</span>
                            <span>•</span>
                            <span>{entry.track?.key}</span>
                            <span>•</span>
                            <span>{formatDuration(entry.duration)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                          <p className="text-xs text-white/60 font-['IBM_Plex_Mono']">
                            {formatTimestamp(entry.timestamp)}
                          </p>
                          <p className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Played */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Most Played Tracks</h2>
            </div>
            {trackPlayStats.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <Music2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-1">No play statistics yet</p>
                <p className="text-sm text-white/40">Play tracks to see your most played list</p>
              </div>
            ) : (
              <div className="space-y-2">
                {trackPlayStats.map((stat, index) => (
                  <div
                    key={stat.trackId}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${
                          index === 0 ? "bg-primary/20 border border-primary text-primary" :
                          index === 1 ? "bg-yellow-400/20 border border-yellow-400 text-yellow-400" :
                          index === 2 ? "bg-orange-400/20 border border-orange-400 text-orange-400" :
                          "bg-white/5 border border-white/10 text-white/60"
                        }`}>
                          <span className="text-sm font-['IBM_Plex_Mono']">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">
                            {stat.track?.title || "Unknown Track"}
                          </h3>
                          <p className="text-xs text-white/50 truncate">
                            {stat.track?.artist || "Unknown Artist"}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-white/40 font-['IBM_Plex_Mono']">
                            <span>{stat.track?.bpm} BPM</span>
                            <span>•</span>
                            <span>{stat.track?.key}</span>
                            <span>•</span>
                            <span>{stat.track?.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 ml-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white font-['IBM_Plex_Mono']">
                            {stat.playCount}
                          </p>
                          <p className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            {stat.playCount === 1 ? "play" : "plays"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/60 font-['IBM_Plex_Mono']">
                            {formatTimestamp(stat.lastPlayed)}
                          </p>
                          <p className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            Last played
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

