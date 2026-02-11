import React from 'react';
import { TrendingUp, Users, Music, DollarSign, BarChart3, Clock } from 'lucide-react';

const AnalyticsPanel = () => {
  const stats = [
    { label: 'Total Plays', value: '24,583', change: '+12.3%', icon: Music, color: 'from-[#FF6B00] to-[#FF8C00]' },
    { label: 'Unique Listeners', value: '8,429', change: '+8.7%', icon: Users, color: 'from-[#00E5FF] to-[#00B8D4]' },
    { label: 'Revenue', value: '$3,847', change: '+15.2%', icon: DollarSign, color: 'from-[#FF6B00] to-[#00E5FF]' },
    { label: 'Avg Listen Time', value: '4:32', change: '+2.1%', icon: Clock, color: 'from-[#00E5FF] to-[#FF6B00]' },
  ];

  return (
    <div className="w-full flex justify-center py-16">
      <div className="w-full max-w-[1400px] px-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics & Stats</h1>
          <p className="text-gray-400">Track your performance and engagement</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-[#00E5FF]">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Chart Placeholder */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Performance Over Time</h2>
          <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg bg-black/20">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AnalyticsPanel };