import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Search,
  Sparkles,
  Upload,
  Play,
  Clock,
  Star,
  Music,
  Activity,
  Eye,
  Share2,
  X,
  Zap
} from 'lucide-react';
import { UnifiedSidebar } from './UnifiedSidebar';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [showOnboardingTip, setShowOnboardingTip] = useState(true);

  const recentTracks = [
    { id: 1, name: 'Nocturnal Sequence', genre: 'Techno', duration: '7:23', plays: 142, timestamp: '2 hours ago' },
    { id: 2, name: 'Subsonic Ritual', genre: 'Deep House', duration: '8:15', plays: 89, timestamp: '5 hours ago' },
    { id: 3, name: 'Hypnotic Elements', genre: 'Minimal', duration: '6:47', plays: 201, timestamp: '1 day ago' },
    { id: 4, name: 'Dark Matter Pulse', genre: 'Techno', duration: '7:58', plays: 134, timestamp: '2 days ago' }
  ];

  const recentActivity = [
    { action: "Generated 'Nocturnal Sequence'", time: '2 hours ago', icon: Music },
    { action: "Analyzed DJ mix 'Carl Cox - Space'", time: '5 hours ago', icon: Activity },
    { action: "Exported stems for 'Subsonic Ritual'", time: '1 day ago', icon: Upload }
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Unified Sidebar */}
      <UnifiedSidebar onNavigate={onNavigate} currentView="dashboard" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Welcome back, Stas! 👋</h1>
              <p className="text-gray-400">Saturday, December 20, 2025</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff6b35] rounded-full" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Search className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#9333ea] rounded-full cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Quick Actions - Enhanced with Header & Onboarding Tip */}
          <div className="mb-12">
            {/* Header with Sparkle Icon */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-[#ff6b35]" />
                <h2 className="text-3xl font-bold text-white">Start Creating</h2>
              </div>
            </div>
            <p className="text-gray-400 mb-6">Choose your generator to begin making music</p>

            {/* Onboarding Tip - Dismissible */}
            <AnimatePresence>
              {showOnboardingTip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-gradient-to-r from-[#ff6b35]/10 to-[#9333ea]/10 border border-[#ff6b35]/30 rounded-xl flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[#ff6b35] rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">Ready to create?</p>
                    <p className="text-sm text-gray-400">
                      Click "Create Track" to start generating your first AI track.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOnboardingTip(false)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-6">
              {/* Create Track Card */}
              <motion.button
                onClick={() => onNavigate('generator')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] hover:from-[#ff8555] hover:to-[#ff6b35] rounded-xl transition-all shadow-[0_0_25px_rgba(255,107,53,0.4)] flex flex-col items-center justify-center gap-3"
              >
                <Music className="w-8 h-8 text-white" />
                <div className="text-center">
                  <div className="text-white font-bold text-xl mb-1">Create Track</div>
                  <div className="text-white/70 text-sm">Generate with AI</div>
                </div>
              </motion.button>

              {/* Upload DJ Mix Card */}
              <motion.button
                onClick={() => onNavigate('dj-mix-analyzer')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] hover:from-[#ff8555] hover:to-[#ff6b35] rounded-xl transition-all shadow-[0_0_25px_rgba(255,107,53,0.4)] flex flex-col items-center justify-center gap-3"
              >
                <Upload className="w-8 h-8 text-white" />
                <div className="text-center">
                  <div className="text-white font-bold text-xl mb-1">Upload DJ Mix</div>
                  <div className="text-white/70 text-sm">Analyze complete sets</div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Recent Tracks */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recently Generated</h2>
              <a href="#library" className="text-[#ff6b35] hover:text-[#ff8555] font-medium">
                View All →
              </a>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {recentTracks.map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ y: -4 }}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer group relative"
                >
                  {/* Album Art with Play Button */}
                  <div className="aspect-square bg-gradient-to-br from-[#ff6b35] to-[#9333ea] relative">
                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 bg-[#ff6b35] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(255,107,53,0.5)]"
                      >
                        <Play className="w-7 h-7 text-white ml-1 fill-white" />
                      </motion.button>
                    </div>

                    {/* Bottom Overlay with Track Title & Actions */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-white font-bold text-base mb-3 line-clamp-1">
                        {track.name}
                      </div>
                      
                      {/* Quick Actions Row */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-3 py-2 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Play preview:', track.name);
                          }}
                        >
                          <Play className="w-3.5 h-3.5" />
                          Play
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('View analysis:', track.name);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium flex items-center justify-center transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Share:', track.name);
                          }}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="p-4">
                    <div className="text-white font-medium mb-2 truncate">{track.name}</div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="px-2 py-0.5 bg-[#ff6b35]/20 text-[#ff6b35] rounded text-xs font-medium">
                        {track.genre}
                      </span>
                      <span className="text-gray-400">{track.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {track.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats + Activity Grid */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {/* Stats Section */}
            <div className="col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Your Stats</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#1a1a1a] rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#ff6b35]/20 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-[#ff6b35]" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">23</div>
                      <div className="text-sm text-gray-400">Tracks Generated</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#9333ea]/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[#9333ea]" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">177</div>
                      <div className="text-sm text-gray-400">Tracks Remaining</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff6b35] w-[11.5%]" />
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4488ff]/20 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-[#4488ff]" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">2h 34m</div>
                      <div className="text-sm text-gray-400">Total Playtime</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">8</div>
                      <div className="text-sm text-gray-400">Favorites</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#ff6b35]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#ff6b35]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{item.action}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-6">
            <a
              href="#library"
              className="p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl border border-[#2a2a2a] hover:border-[#ff6b35] transition-colors group"
            >
              <div className="text-white font-medium mb-2 group-hover:text-[#ff6b35] transition-colors">
                View Full Library →
              </div>
              <p className="text-sm text-gray-400">Browse all your generated tracks</p>
            </a>
            
            <a
              href="#upgrade"
              className="p-6 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] rounded-xl shadow-[0_0_20px_rgba(255,107,53,0.3)] group"
            >
              <div className="text-white font-medium mb-2">
                Upgrade to DJ Plan →
              </div>
              <p className="text-sm text-white/80">Get unlimited tracks + Auto DJ</p>
            </a>
            
            <a
              href="#tutorial"
              className="p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl border border-[#2a2a2a] hover:border-[#ff6b35] transition-colors group"
            >
              <div className="text-white font-medium mb-2 group-hover:text-[#ff6b35] transition-colors">
                Watch Tutorial →
              </div>
              <p className="text-sm text-gray-400">Learn how to get the most out of Syntax</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}