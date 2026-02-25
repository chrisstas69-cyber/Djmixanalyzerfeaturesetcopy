import React from 'react';
import { ArrowUpRight, Play, Heart, Music, BarChart3, MapPin } from 'lucide-react';

const AnalyticsStatsCombined = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8 font-sans">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-zinc-500">Real-time insights into your music performance.</p>
        </div>

        {/* 1. HEADLINES (STATS CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Plays', val: '129', trend: '+12%', icon: Play, color: 'text-orange-500' },
            { label: 'Total Likes', val: '46', trend: '+5%', icon: Heart, color: 'text-red-500' },
            { label: 'Tracks Created', val: '46', trend: '+2', icon: Music, color: 'text-blue-500' },
            { label: 'Top Genre', val: 'Groove', trend: 'Trending', icon: BarChart3, color: 'text-purple-500' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
            <div key={i} className="bg-[#1a1a1a] border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-zinc-900 ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  {stat.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.val}</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">{stat.label}</div>
            </div>
          );
          })}
        </div>

        {/* 2. MAIN STAGE (CHART) */}
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Audience Growth</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">7 Days</button>
              <button className="px-4 py-2 bg-zinc-900 rounded-lg text-sm font-medium text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">30 Days</button>
            </div>
          </div>
          
          {/* Mock Chart Area */}
          <div className="h-64 w-full flex items-end justify-between gap-1 relative overflow-hidden">
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none"></div>
             
             {/* Bars */}
             {Array.from({ length: 40 }).map((_, i) => {
               const height = 30 + Math.random() * 70;
               return (
                 <div 
                    key={i} 
                    className="flex-1 bg-orange-500 rounded-t-sm hover:bg-orange-400 transition-colors"
                    style={{ height: `${height}%`, opacity: 0.6 + (Math.random() * 0.4) }}
                 ></div>
               )
             })}
          </div>
          <div className="flex justify-between text-xs text-zinc-600 mt-4 border-t border-zinc-800 pt-4">
             <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* 3. DEEP DIVE (SPLIT SECTION) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Top Tracks Leaderboard */}
          <div className="lg:col-span-8 bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Top Performing Tracks</h3>
            <div className="space-y-4">
              {[
                { title: 'Midnight Resonance', artist: 'Adam Beyer', plays: '1,240' },
                { title: 'Electric Dreams', artist: 'Charlotte de Witte', plays: '1,120' },
                { title: 'Deep Horizon', artist: 'Tale Of Us', plays: '980' },
                { title: 'Neon Pulse', artist: 'Amelie Lens', plays: '850' },
                { title: 'Cosmic Journey', artist: 'AI Generated', plays: '720' },
              ].map((track, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-900/50 transition-colors group">
                  <div className="w-8 text-center font-bold text-zinc-500 text-lg">#{i + 1}</div>
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-bold text-white group-hover:text-orange-500 transition-colors">{track.title}</div>
                    <div className="text-xs text-zinc-500">{track.artist}</div>
                  </div>
                  <div className="hidden sm:block w-24 h-8 opacity-30">
                     {/* Mini Sparkline */}
                     <div className="flex items-end gap-[1px] h-full">
                        {Array.from({ length: 15 }).map((_, j) => (
                           <div key={j} className="flex-1 bg-white" style={{ height: `${Math.random() * 100}%`}}></div>
                        ))}
                     </div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="font-bold">{track.plays}</div>
                    <div className="text-xs text-zinc-500">plays</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demographics / Extra Stats */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Top Locations</h3>
                <div className="space-y-4">
                  {[
                    { city: 'Miami, US', val: 85 },
                    { city: 'London, UK', val: 65 },
                    { city: 'Berlin, DE', val: 45 },
                  ].map((loc) => (
                    <div key={loc.city}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-zinc-500"/> {loc.city}</span>
                        <span className="text-zinc-400">{loc.val}%</span>
                      </div>
                      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${loc.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1">Pro Tip</h3>
                  <p className="text-sm text-orange-100 mb-4">Upload tracks on Fridays at 6PM for 2x more engagement.</p>
                  <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-bold shadow-lg">Schedule Upload</button>
                </div>
                <Music className="absolute -bottom-4 -right-4 w-32 h-32 text-orange-500 opacity-50 rotate-12" />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export { AnalyticsStatsCombined };
