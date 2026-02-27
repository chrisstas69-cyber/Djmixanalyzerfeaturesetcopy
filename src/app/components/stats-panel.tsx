import { useState, useEffect } from "react";
import { Music, Star, TrendingUp, Hash, Key } from "lucide-react";

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

export function StatsPanel() {
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalFavorites: 0,
    averageBPM: 0,
    mostCommonEnergy: "",
    mostCommonKey: "",
  });

  useEffect(() => {
    try {
      // Load tracks from localStorage
      const libraryTracksStr = localStorage.getItem('libraryTracks');
      const libraryTracks: Track[] = libraryTracksStr ? JSON.parse(libraryTracksStr) : [];

      // Load favorites from localStorage
      const favoritesStr = localStorage.getItem('favoriteTracks');
      const favoriteIds: string[] = favoritesStr ? JSON.parse(favoritesStr) : [];

      // Calculate stats
      const totalTracks = libraryTracks.length;
      const totalFavorites = favoriteIds.length;

      // Calculate average BPM
      const averageBPM = totalTracks > 0
        ? Math.round(libraryTracks.reduce((sum, track) => sum + track.bpm, 0) / totalTracks)
        : 0;

      // Find most common energy (using energy as genre proxy)
      const energyCounts: Record<string, number> = {};
      libraryTracks.forEach(track => {
        energyCounts[track.energy] = (energyCounts[track.energy] || 0) + 1;
      });
      const mostCommonEnergy = Object.entries(energyCounts).reduce((a, b) => 
        energyCounts[a[0]] > energyCounts[b[0]] ? a : b, 
        ["", 0]
      )[0] || "N/A";

      // Find most common key
      const keyCounts: Record<string, number> = {};
      libraryTracks.forEach(track => {
        keyCounts[track.key] = (keyCounts[track.key] || 0) + 1;
      });
      const mostCommonKey = Object.entries(keyCounts).reduce((a, b) => 
        keyCounts[a[0]] > keyCounts[b[0]] ? a : b, 
        ["", 0]
      )[0] || "N/A";

      setStats({
        totalTracks,
        totalFavorites,
        averageBPM,
        mostCommonEnergy,
        mostCommonKey,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const statCards = [
    {
      label: "Total Tracks Created",
      value: stats.totalTracks,
      icon: Music,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      label: "Total Favorites",
      value: stats.totalFavorites,
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20",
    },
    {
      label: "Average BPM",
      value: stats.averageBPM || "N/A",
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      label: "Most Common Energy",
      value: stats.mostCommonEnergy || "N/A",
      icon: Hash,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
    {
      label: "Most Common Key",
      value: stats.mostCommonKey || "N/A",
      icon: Key,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1">Stats Dashboard</h1>
        <p className="text-xs text-white/40">
          Insights into your music library
        </p>
      </div>

      {/* Stats Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color} font-['IBM_Plex_Mono']`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

