import { useState, useEffect } from "react";
import { User, Music, Star, TrendingUp, Key, Download, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface UserProfile {
  username: string;
  favoriteGenre: string;
  djStyle: string;
  createdAt: string;
}

export function UserProfilePanel() {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    favoriteGenre: "House",
    djStyle: "Smooth",
    createdAt: new Date().toISOString(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalMixes: 0,
    favoriteEnergy: "N/A",
    mostUsedKey: "N/A",
  });

  // Load profile from localStorage
  useEffect(() => {
    try {
      const profileStr = localStorage.getItem('userProfile');
      if (profileStr) {
        const saved = JSON.parse(profileStr);
        setProfile(saved);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  // Load stats
  useEffect(() => {
    try {
      const libraryTracksStr = localStorage.getItem('libraryTracks');
      const libraryTracks = libraryTracksStr ? JSON.parse(libraryTracksStr) : [];
      
      const mixesStr = localStorage.getItem('userMixes');
      const mixes = mixesStr ? JSON.parse(mixesStr) : [];

      // Calculate favorite energy
      const energyCounts: Record<string, number> = {};
      libraryTracks.forEach((track: any) => {
        energyCounts[track.energy] = (energyCounts[track.energy] || 0) + 1;
      });
      const favoriteEnergy = Object.entries(energyCounts).reduce((a, b) => 
        energyCounts[a[0]] > energyCounts[b[0]] ? a : b, 
        ["", 0]
      )[0] || "N/A";

      // Calculate most used key
      const keyCounts: Record<string, number> = {};
      libraryTracks.forEach((track: any) => {
        keyCounts[track.key] = (keyCounts[track.key] || 0) + 1;
      });
      const mostUsedKey = Object.entries(keyCounts).reduce((a, b) => 
        keyCounts[a[0]] > keyCounts[b[0]] ? a : b, 
        ["", 0]
      )[0] || "N/A";

      setStats({
        totalTracks: libraryTracks.length,
        totalMixes: mixes.length,
        favoriteEnergy,
        mostUsedKey,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const handleSave = () => {
    // Validate
    if (!profile.username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    if (profile.username.length > 30) {
      toast.error("Username must be 30 characters or less");
      return;
    }

    try {
      const updated = {
        ...profile,
        createdAt: profile.createdAt || new Date().toISOString(),
      };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      setProfile(updated);
      setIsEditing(false);
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile");
    }
  };

  const handleExportProfile = () => {
    try {
      const profileData = {
        profile,
        stats,
        exportedAt: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(profileData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profile-${profile.username || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Profile exported successfully!");
    } catch (error) {
      console.error('Error exporting profile:', error);
      toast.error("Failed to export profile");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">User Profile</h1>
            <p className="text-xs text-white/40">
              Manage your profile and view your music DNA
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="h-9 px-4 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Form */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    maxLength={30}
                    className="w-full h-10 px-4 rounded-lg border border-white/10 bg-black/40 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
                  />
                ) : (
                  <p className="text-sm text-white/80 font-['IBM_Plex_Mono']">
                    {profile.username || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Favorite Genre</label>
                {isEditing ? (
                  <select
                    value={profile.favoriteGenre}
                    onChange={(e) => setProfile(prev => ({ ...prev, favoriteGenre: e.target.value }))}
                    className="w-full h-10 px-4 rounded-lg border border-white/10 bg-black/40 text-white appearance-none cursor-pointer focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
                  >
                    <option value="House">House</option>
                    <option value="Techno">Techno</option>
                    <option value="Deep House">Deep House</option>
                    <option value="Ambient">Ambient</option>
                    <option value="Trance">Trance</option>
                    <option value="Dubstep">Dubstep</option>
                  </select>
                ) : (
                  <p className="text-sm text-white/80 font-['IBM_Plex_Mono']">
                    {profile.favoriteGenre}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">DJ Style</label>
                {isEditing ? (
                  <select
                    value={profile.djStyle}
                    onChange={(e) => setProfile(prev => ({ ...prev, djStyle: e.target.value }))}
                    className="w-full h-10 px-4 rounded-lg border border-white/10 bg-black/40 text-white appearance-none cursor-pointer focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
                  >
                    <option value="Smooth">Smooth</option>
                    <option value="Aggressive">Aggressive</option>
                    <option value="Hypnotic">Hypnotic</option>
                    <option value="Club">Club</option>
                  </select>
                ) : (
                  <p className="text-sm text-white/80 font-['IBM_Plex_Mono']">
                    {profile.djStyle}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary/80 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Stats */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      {stats.totalTracks}
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
                      Mixes Saved
                    </p>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {stats.totalMixes}
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
                      Favorite Energy
                    </p>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {stats.favoriteEnergy}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-green-400/10 rounded-lg">
                    <Key className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-['IBM_Plex_Mono']">
                      Most Used Key
                    </p>
                    <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                      {stats.mostUsedKey}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Profile Card */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Export Profile</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-sm text-white/60 mb-4">
                Export your profile data including stats, preferences, and music DNA as a JSON file.
              </p>
              <Button
                onClick={handleExportProfile}
                className="bg-primary hover:bg-primary/80 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Profile Card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


