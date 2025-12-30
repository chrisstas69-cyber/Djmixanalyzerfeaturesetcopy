import { useState, useEffect, useMemo } from "react";
import { Music, TrendingUp, Clock, BarChart3, Play, Star } from "lucide-react";

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
  duration: number;
}

export function AnalyticsPanel() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playbackHistory, setPlaybackHistory] = useState<PlaybackHistoryEntry[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<string[]>([]);

  // Load data from localStorage
  useEffect(() => {
    try {
      // Load tracks
      const libraryTracksStr = localStorage.getItem('libraryTracks');
      const libraryTracks: Track[] = libraryTracksStr ? JSON.parse(libraryTracksStr) : [];
      setTracks(libraryTracks);

      // Load playback history
      const historyStr = localStorage.getItem('playbackHistory');
      if (historyStr) {
        setPlaybackHistory(JSON.parse(historyStr));
      }

      // Load favorites
      const favoritesStr = localStorage.getItem('favoriteTracks');
      if (favoritesStr) {
        setFavoriteTracks(JSON.parse(favoritesStr));
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  }, []);

  // Calculate personal stats
  const personalStats = useMemo(() => {
    const tracksCreated = tracks.length;
    const tracksSaved = tracks.length; // Same as created for now
    const totalMixingTime = playbackHistory.reduce((sum, entry) => sum + entry.duration, 0);
    const hours = Math.floor(totalMixingTime / 3600);
    const minutes = Math.floor((totalMixingTime % 3600) / 60);
    const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    // Most used genre (using energy as proxy)
    const energyCounts: Record<string, number> = {};
    tracks.forEach(track => {
      energyCounts[track.energy] = (energyCounts[track.energy] || 0) + 1;
    });
    const mostUsedGenre = Object.entries(energyCounts).reduce((a, b) => 
      energyCounts[a[0]] > energyCounts[b[0]] ? a : b, 
      ["", 0]
    )[0] || "N/A";

    // Average BPM
    const avgBPM = tracks.length > 0
      ? Math.round(tracks.reduce((sum, t) => sum + t.bpm, 0) / tracks.length)
      : 0;

    return {
      tracksCreated,
      tracksSaved,
      mostUsedGenre,
      avgBPM,
      totalMixingTime: formattedTime,
    };
  }, [tracks, playbackHistory]);

  // Usage chart data (last 7 days)
  const usageChartData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count tracks created on this day
      const tracksCreated = tracks.filter(t => t.dateAdded === dateStr).length;
      
      // Count plays on this day
      const plays = playbackHistory.filter(h => {
        const playDate = new Date(h.timestamp).toISOString().split('T')[0];
        return playDate === dateStr;
      }).length;
      
      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tracksCreated,
        plays,
      });
    }
    
    return days;
  }, [tracks, playbackHistory]);

  // Top 5 most played tracks
  const topTracks = useMemo(() => {
    const playCounts: Record<string, number> = {};
    
    playbackHistory.forEach(entry => {
      playCounts[entry.trackId] = (playCounts[entry.trackId] || 0) + 1;
    });
    
    const sorted = Object.entries(playCounts)
      .map(([trackId, count]) => {
        const track = tracks.find(t => t.id === trackId);
        return { track, count };
      })
      .filter(item => item.track)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return sorted;
  }, [playbackHistory, tracks]);

  const maxTracks = Math.max(...usageChartData.map(d => d.tracksCreated), 1);
  const maxPlays = Math.max(...usageChartData.map(d => d.plays), 1);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1">Analytics Dashboard</h1>
        <p className="text-xs text-white/40">
          Insights into your music creation and listening habits
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Personal Stats */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Personal Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Tracks Created
                    </p>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {personalStats.tracksCreated}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-400/10 rounded-lg">
                    <Star className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Tracks Saved
                    </p>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {personalStats.tracksSaved}
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
                      Most Used Genre
                    </p>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {personalStats.mostUsedGenre}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-green-400/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Average BPM
                    </p>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {personalStats.avgBPM}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-yellow-400/10 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Total Mixing Time
                    </p>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {personalStats.totalMixingTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Chart */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Usage Chart (Last 7 Days)</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-end justify-between gap-2 h-64">
                {usageChartData.map((day, index) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center gap-1 h-full justify-end">
                      {/* Tracks Created Bar */}
                      <div
                        className="w-full bg-primary rounded-t transition-all"
                        style={{ height: `${(day.tracksCreated / maxTracks) * 100}%` }}
                      />
                      {/* Plays Bar */}
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all"
                        style={{ height: `${(day.plays / maxPlays) * 100}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/60 font-['IBM_Plex_Mono']">{day.dayName}</p>
                      <p className="text-[10px] text-white/40 font-['IBM_Plex_Mono']">
                        {day.tracksCreated} tracks
                      </p>
                      <p className="text-[10px] text-white/40 font-['IBM_Plex_Mono']">
                        {day.plays} plays
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Tracks Widget */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Top 5 Most Played Tracks</h2>
            {topTracks.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <Play className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-1">No play data yet</p>
                <p className="text-sm text-white/40">Start playing tracks to see your top tracks here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {topTracks.map((item, index) => (
                  <div
                    key={item.track?.id}
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
                            {item.track?.title || "Unknown Track"}
                          </h3>
                          <p className="text-xs text-white/50 truncate">
                            {item.track?.artist || "Unknown Artist"}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-white/40 font-['IBM_Plex_Mono']">
                            <span>{item.track?.bpm} BPM</span>
                            <span>•</span>
                            <span>{item.track?.key}</span>
                            <span>•</span>
                            <span>{item.track?.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 ml-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white font-['IBM_Plex_Mono']">
                            {item.count}
                          </p>
                          <p className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            {item.count === 1 ? "play" : "plays"}
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

