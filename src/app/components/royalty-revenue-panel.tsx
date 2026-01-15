import React from 'react';
import { DollarSign, TrendingUp, Users, Download } from 'lucide-react';

const RoyaltyRevenuePanel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] px-16 py-12">
      <div className="w-full max-w-[1400px]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Royalty & Revenue</h1>
          <p className="text-gray-400">Track your earnings and revenue splits</p>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-[#FF6B00]" />
              <span className="text-sm text-[#00E5FF]">+12.5%</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-white">$3,847.50</p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-[#00E5FF]" />
              <span className="text-sm text-[#FF6B00]">+8.3%</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Active DJs</p>
            <p className="text-3xl font-bold text-white">127</p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-[#FF6B00]" />
              <span className="text-sm text-[#00E5FF]">+15.7%</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">This Month</p>
            <p className="text-3xl font-bold text-white">$894.20</p>
          </div>
        </div>

        {/* Revenue Split */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Revenue Split Model</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-black/30 rounded-lg border border-white/10">
              <p className="text-4xl font-bold text-[#FF6B00] mb-2">30%</p>
              <p className="text-gray-400">Creators</p>
            </div>
            <div className="text-center p-6 bg-black/30 rounded-lg border border-white/10">
              <p className="text-4xl font-bold text-[#00E5FF] mb-2">50%</p>
              <p className="text-gray-400">DJs</p>
            </div>
            <div className="text-center p-6 bg-black/30 rounded-lg border border-white/10">
              <p className="text-4xl font-bold text-white mb-2">20%</p>
              <p className="text-gray-400">Platform</p>
            </div>
          </div>
        </div>

        {/* Download Statement */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Monthly Statement</h3>
              <p className="text-gray-400 text-sm">Download your detailed earnings report</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] transition-all">
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RoyaltyRevenuePanel };