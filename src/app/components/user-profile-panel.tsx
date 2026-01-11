"use client";

import { useState, useEffect } from "react";
import { User, Music, Star, TrendingUp, Key, Download, Save, Calendar, Edit3, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  username: string;
  favoriteGenre: string;
  djStyle: string;
  createdAt: string;
  bio?: string;
}

export function UserProfilePanel() {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    favoriteGenre: "House",
    djStyle: "Smooth",
    createdAt: new Date().toISOString(),
    bio: "",
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

  const memberSince = profile.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'January 2026';

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-darkest, #080808)' }}>
      {/* Header */}
      <div 
        className="px-8 py-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl font-semibold tracking-tight mb-1"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
            >
              Profile
            </h1>
            <p 
              className="text-sm"
              style={{ color: 'var(--text-secondary, #a0a0a0)' }}
            >
              Manage your profile and view your music DNA
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="h-10 px-5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              style={{ 
                background: 'var(--accent-primary, #00bcd4)', 
                color: 'var(--bg-darkest, #080808)',
                boxShadow: 'var(--shadow-glow-cyan, 0 0 20px rgba(0, 188, 212, 0.3))'
              }}
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Header Card */}
          <div 
            className="rounded-xl overflow-hidden"
            style={{ 
              background: 'var(--bg-card, #161616)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
            }}
          >
            {/* Cover Gradient */}
            <div 
              className="h-24 relative"
              style={{ 
                background: 'linear-gradient(135deg, var(--accent-primary, #00bcd4) 0%, var(--accent-secondary, #ff6b35) 100%)',
                opacity: 0.6
              }}
            />
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                {/* Avatar */}
                <div 
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ 
                    background: 'var(--bg-medium, #111111)',
                    border: '4px solid var(--bg-card, #161616)',
                    color: 'var(--accent-primary, #00bcd4)'
                  }}
                >
                  {profile.username ? profile.username[0].toUpperCase() : 'U'}
                </div>
                
                {/* Quick Stats */}
                <div className="flex-1 flex items-center justify-end gap-6 pb-2">
                  <div className="text-center">
                    <div 
                      className="text-xl font-bold"
                      style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary, #00bcd4)' }}
                    >
                      {stats.totalTracks}
                    </div>
                    <div 
                      className="text-xs uppercase tracking-wider"
                      style={{ color: 'var(--text-tertiary, #666666)' }}
                    >
                      Tracks
                    </div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="text-xl font-bold"
                      style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--waveform-orange, #ff6b35)' }}
                    >
                      {stats.totalMixes}
                    </div>
                    <div 
                      className="text-xs uppercase tracking-wider"
                      style={{ color: 'var(--text-tertiary, #666666)' }}
                    >
                      Mixes
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Name & Info */}
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    maxLength={30}
                    className="w-full h-11 px-4 rounded-lg text-lg font-semibold focus:outline-none"
                    style={{ 
                      background: 'var(--bg-dark, #0d0d0d)',
                      border: '1px solid var(--accent-primary, #00bcd4)',
                      color: 'var(--text-primary, #ffffff)'
                    }}
                  />
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Add a bio..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg text-sm resize-none focus:outline-none"
                    style={{ 
                      background: 'var(--bg-dark, #0d0d0d)',
                      border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                      color: 'var(--text-primary, #ffffff)'
                    }}
                  />
                </div>
              ) : (
                <>
                  <h2 
                    className="text-xl font-bold mb-1"
                    style={{ color: 'var(--text-primary, #ffffff)' }}
                  >
                    {profile.username || 'Set your username'}
                  </h2>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: 'var(--text-tertiary, #666666)' }}
                  >
                    {profile.bio || 'No bio yet'}
                  </p>
                </>
              )}
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    background: 'var(--accent-primary-subtle, rgba(0, 188, 212, 0.1))',
                    color: 'var(--accent-primary, #00bcd4)'
                  }}
                >
                  {profile.favoriteGenre}
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    background: 'rgba(255, 107, 53, 0.1)',
                    color: 'var(--waveform-orange, #ff6b35)'
                  }}
                >
                  {profile.djStyle} Style
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  style={{ 
                    background: 'var(--bg-medium, #111111)',
                    color: 'var(--text-tertiary, #666666)'
                  }}
                >
                  <Calendar className="w-3 h-3" />
                  Member since {memberSince}
                </span>
              </div>
              
              {/* Edit Actions */}
              {isEditing && (
                <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}>
                  <button
                    onClick={handleSave}
                    className="h-10 px-5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                    style={{ 
                      background: 'var(--accent-primary, #00bcd4)', 
                      color: 'var(--bg-darkest, #080808)'
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="h-10 px-5 rounded-lg text-sm font-medium transition-all"
                    style={{ 
                      background: 'var(--bg-medium, #111111)',
                      border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                      color: 'var(--text-secondary, #a0a0a0)'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Settings (when editing) */}
          {isEditing && (
            <div 
              className="rounded-xl p-6 space-y-6"
              style={{ 
                background: 'var(--bg-card, #161616)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
              }}
            >
              <h3 
                className="text-lg font-semibold"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
              >
                Preferences
              </h3>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                >
                  Favorite Genre
                </label>
                <select
                  value={profile.favoriteGenre}
                  onChange={(e) => setProfile(prev => ({ ...prev, favoriteGenre: e.target.value }))}
                  className="w-full h-10 px-4 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none"
                  style={{ 
                    background: 'var(--bg-dark, #0d0d0d)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                    color: 'var(--text-primary, #ffffff)'
                  }}
                >
                  <option value="House">House</option>
                  <option value="Techno">Techno</option>
                  <option value="Deep House">Deep House</option>
                  <option value="Ambient">Ambient</option>
                  <option value="Trance">Trance</option>
                  <option value="Dubstep">Dubstep</option>
                </select>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                >
                  DJ Style
                </label>
                <select
                  value={profile.djStyle}
                  onChange={(e) => setProfile(prev => ({ ...prev, djStyle: e.target.value }))}
                  className="w-full h-10 px-4 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none"
                  style={{ 
                    background: 'var(--bg-dark, #0d0d0d)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                    color: 'var(--text-primary, #ffffff)'
                  }}
                >
                  <option value="Smooth">Smooth</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Hypnotic">Hypnotic</option>
                  <option value="Club">Club</option>
                </select>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
            >
              Your Music DNA
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                className="rounded-xl p-5"
                style={{ 
                  background: 'var(--bg-card, #161616)',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'var(--accent-primary-subtle, rgba(0, 188, 212, 0.1))' }}
                >
                  <Music className="w-5 h-5" style={{ color: 'var(--accent-primary, #00bcd4)' }} />
                </div>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary, #ffffff)' }}
                >
                  {stats.totalTracks}
                </div>
                <div 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary, #666666)' }}
                >
                  Tracks Created
                </div>
              </div>

              <div 
                className="rounded-xl p-5"
                style={{ 
                  background: 'var(--bg-card, #161616)',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255, 107, 53, 0.1)' }}
                >
                  <Star className="w-5 h-5" style={{ color: 'var(--waveform-orange, #ff6b35)' }} />
                </div>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary, #ffffff)' }}
                >
                  {stats.totalMixes}
                </div>
                <div 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary, #666666)' }}
                >
                  Mixes Saved
                </div>
              </div>

              <div 
                className="rounded-xl p-5"
                style={{ 
                  background: 'var(--bg-card, #161616)',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(156, 39, 176, 0.1)' }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: '#9c27b0' }} />
                </div>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary, #ffffff)' }}
                >
                  {stats.favoriteEnergy}
                </div>
                <div 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary, #666666)' }}
                >
                  Favorite Energy
                </div>
              </div>

              <div 
                className="rounded-xl p-5"
                style={{ 
                  background: 'var(--bg-card, #161616)',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'rgba(76, 175, 80, 0.1)' }}
                >
                  <Key className="w-5 h-5" style={{ color: '#4caf50' }} />
                </div>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary, #ffffff)' }}
                >
                  {stats.mostUsedKey}
                </div>
                <div 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary, #666666)' }}
                >
                  Most Used Key
                </div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div 
            className="rounded-xl p-6 flex items-center justify-between"
            style={{ 
              background: 'var(--bg-card, #161616)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
            }}
          >
            <div>
              <h3 
                className="text-base font-semibold mb-1"
                style={{ color: 'var(--text-primary, #ffffff)' }}
              >
                Export Profile
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--text-tertiary, #666666)' }}
              >
                Download your profile data, stats, and music DNA as JSON
              </p>
            </div>
            <button
              onClick={handleExportProfile}
              className="h-10 px-5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={{ 
                background: 'var(--bg-medium, #111111)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                color: 'var(--text-secondary, #a0a0a0)'
              }}
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
