import React from 'react';
import { TrendingUp, TrendingDown, Clock, Download } from 'lucide-react';

const RoyaltyRevenuePanel = () => {
  // Mock data
  const statsData = [
    { label: 'TOTAL EARNINGS', value: '$47,582.50', color: 'text-[#00E5FF]', icon: '45', iconBg: 'bg-[#FF6B00]' },
    { label: 'THIS MONTH', value: '$8,245.80', color: 'text-[#00E5FF]', icon: 'up', iconBg: 'bg-transparent' },
    { label: 'LAST MONTH', value: '$6,892.30', color: 'text-white', icon: 'down', iconBg: 'bg-transparent' },
    { label: 'PENDING', value: '$2,156.40', color: 'text-[#FF6B00]', icon: 'clock', iconBg: 'bg-transparent' },
  ];

  const earningsData = [
    { name: 'Artist', amount: '$23,791.25', percentage: 50, color: 'bg-[#FF6B00]' },
    { name: 'User', amount: '$14,274.15', percentage: 30, color: 'bg-[#00E5FF]' },
    { name: 'Platform', amount: '$9,517.10', percentage: 20, color: 'bg-[#FF6B00]' },
  ];

  const downloadBreakdown = [
    { name: 'Ticket Joce', downloads: 975, earnings: '$18,250', color: 'bg-[#FF6B00]' },
    { name: 'Platiorl', downloads: 822, earnings: '$15,225', color: 'bg-[#00E5FF]' },
    { name: 'Sync', downloads: 909, earnings: '$9,225', color: 'bg-[#FF6B00]' },
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#0A0A0A]">
      
      {/* Scrollable Content Area - Full Height */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-16">
        
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white tracking-tight">Royalty & Revenue</h1>
          <p className="text-gray-500 mt-2">Track your earnings and revenue distribution</p>
        </div>

        {/* Top Stats Row - Generous Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-[#121212] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition">
              <div className="mb-6">
                {stat.icon === '45' && (
                  <div className="w-12 h-12 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white text-sm font-bold shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                    45
                  </div>
                )}
                {stat.icon === 'up' && (
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#00E5FF]" />
                  </div>
                )}
                {stat.icon === 'down' && (
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                {stat.icon === 'clock' && (
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">{stat.label}</p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* DNA Download Earnings Section - Generous Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Left: Progress Bars */}
          <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-10">
            <h2 className="text-2xl font-bold text-white mb-10">DNA Download Earnings</h2>
            
            <div className="space-y-10">
              {earningsData.map((item, index) => (
                <div key={index} className="border-l-4 border-white/10 pl-8">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-white font-semibold text-xl">{item.name}</span>
                    <span className="text-[#FF6B00] font-bold text-xl">{item.amount}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden mb-3">
                    <div 
                      className={`${item.color} h-full rounded-full transition-all duration-500`} 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-gray-500 text-sm">{item.percentage}% of total revenue</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pie Chart */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center">
            {/* Pie Chart Visualization */}
            <div className="relative w-56 h-56 mb-8">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Artist - 50% (orange) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#FF6B00"
                  strokeWidth="20"
                  strokeDasharray="125.6 251.2"
                  strokeDashoffset="0"
                />
                {/* User - 30% (cyan) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#00E5FF"
                  strokeWidth="20"
                  strokeDasharray="75.4 251.2"
                  strokeDashoffset="-125.6"
                />
                {/* Platform - 20% (blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="20"
                  strokeDasharray="50.2 251.2"
                  strokeDashoffset="-201"
                />
              </svg>
              
              {/* Percentage Labels on Chart */}
              <div className="absolute top-2 right-4 text-white text-sm font-bold">50%</div>
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 text-white text-sm font-bold">20%</div>
              <div className="absolute bottom-6 left-6 text-white text-sm font-bold">30%</div>
              
              {/* Side Labels */}
              <div className="absolute -right-20 top-2 text-gray-400 text-sm font-medium">Artist</div>
              <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">User</div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#FF6B00]" />
                  <span className="text-gray-400">Artist</span>
                </div>
                <p className="text-gray-500 text-xs">$23,791.25</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#00E5FF]" />
                  <span className="text-gray-400">User</span>
                </div>
                <p className="text-gray-500 text-xs">$14,274.15</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                  <span className="text-gray-400">Platform</span>
                </div>
                <p className="text-gray-500 text-xs">$9,517.10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Generous Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          {/* Left: DNA Download Breakdown Table */}
          <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-10">
            <h2 className="text-2xl font-bold text-white mb-8">DNA Download Breakdown</h2>
            
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-gray-500 text-xs font-bold uppercase tracking-widest pb-4 border-b border-white/5">
              <span>PRODUCEE</span>
              <span>DOWNLOADS</span>
              <span className="text-right">EARNINGS</span>
            </div>

            {/* Table Rows */}
            <div className="space-y-6">
              {downloadBreakdown.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-white font-medium text-lg">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span className="text-lg">{item.downloads}</span>
                    <span className="text-gray-500">Downloads</span>
                  </div>
                  <span className="text-[#00E5FF] font-bold text-lg text-right">{item.earnings}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Available Balance Card */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-10 flex flex-col">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Available Balance</h3>
            <p className="text-5xl font-bold text-white mb-10">$8,245.80</p>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Next Payout</span>
                <span className="text-white font-semibold">Jan 15, 3025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Minimum Threshold</span>
                <span className="text-white font-semibold">$50.00</span>
              </div>
            </div>

            <button className="mt-auto w-full flex items-center justify-center gap-3 py-4 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-semibold text-lg transition-all shadow-[0_0_30px_rgba(255,107,0,0.3)] hover:shadow-[0_0_40px_rgba(255,107,0,0.4)]">
              <Download className="w-5 h-5" />
              Download Statement
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export { RoyaltyRevenuePanel };
