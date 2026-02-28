import React from 'react';

const UserProfilePanel = () => {
  return (
    <div className="w-full flex justify-center py-16">
      <div className="w-full max-w-[1400px] px-16">
        {/* 1. TOP: Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-8 border-b border-white/10">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 p-1 shadow-2xl">
              <img src="https://picsum.photos/seed/alexriverstone/200/200" alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-[#0A0A0A]" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold text-white tracking-tight">Alex Riverstone</h1>
                <span className="bg-gradient-to-r from-[#FF6B00] to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pro</span>
              </div>
              <p className="text-gray-400">Electronic Music Producer • New York, NY</p>
            </div>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-lg font-medium transition border border-white/10">Edit Profile</button>
            <button className="bg-[#FF6B00] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-[0_0_20px_rgba(255,107,0,0.2)]">Export Data</button>
          </div>
        </div>

        {/* 2. MIDDLE: Stats Grid ("Music DNA") */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-white">Your Music DNA</h2>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            {[
              { label: "Tracks Created", val: "247", color: "text-[#FF6B00]" },
              { label: "Mixes Created", val: "38", color: "text-[#00E5FF]" },
              { label: "Tracks Saved", val: "1.5K", color: "text-purple-500" },
              { label: "Total Playtime", val: "342 hrs", color: "text-pink-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#121212] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 bg-white/5 rounded-xl ${stat.color} group-hover:bg-opacity-10 transition`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                  <span className="text-xs text-green-400 font-mono">+{Math.floor(Math.random()*10)}%</span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-bold text-white mt-2">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. BOTTOM: SPACED OUT SECTIONS */}
        {/* Added large mt-16 here for space down */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 pb-20">
          
          {/* Left: Production Stats (Increased internal spacing space-y-8) */}
          <div className="lg:col-span-1 bg-[#121212] border border-white/5 rounded-2xl p-10 flex flex-col justify-between">
            <h3 className="text-lg font-bold text-white mb-6">Production Stats</h3>
            <div className="space-y-8">
              {[
                { name: "Progressive House", pct: 65, color: "bg-[#FF6B00]" },
                { name: "Deep House", pct: 25, color: "bg-[#00E5FF]" },
                { name: "Techno", pct: 10, color: "bg-purple-500" }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-white font-bold">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase">Avg BPM</p>
                <p className="text-xl font-bold text-white">128</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Avg Key</p>
                <p className="text-xl font-bold text-white">C#m</p>
              </div>
            </div>
          </div>

          {/* Right: Production Trends (Increased p-10) */}
          <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-10 flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-white">Production Trends</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-white/10 rounded text-xs text-white hover:bg-white/20">Week</button>
                <button className="px-3 py-1 text-xs text-gray-500 hover:text-white">Month</button>
              </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between space-x-3 px-2 pb-6">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="flex-1 bg-gray-800 rounded-t-sm hover:bg-[#FF6B00] transition-colors cursor-pointer relative group" style={{height: `${30 + Math.random() * 60}%`}}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                    {Math.floor(Math.random() * 50)} Tracks
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono uppercase">
              <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePanel;
