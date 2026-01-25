import React from 'react';

interface Props {
  attributes: {
    groove: number;
    energy: number;
    darkness: number;
    hypnotic: number;
    minimal: number;
  };
}

const DNA_COLORS = {
  groove: { from: '#FF6B35', to: '#FF0000' },
  energy: { from: '#FFD700', to: '#FF6B35' },
  darkness: { from: '#9D4EDD', to: '#000000' },
  hypnotic: { from: '#00D9FF', to: '#9D4EDD' },
  minimal: { from: '#888888', to: '#FFFFFF' }
};

const DNA_ICONS = {
  groove: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  energy: 'M13 10V3L4 14h7v7l9-11h-7z',
  darkness: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  hypnotic: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4',
  minimal: 'M20 12H4'
};

export default function DNAVisualization({ attributes }: Props) {
  return (
    <div className="space-y-4">
      {Object.entries(attributes).map(([key, value]) => {
        const colors = DNA_COLORS[key as keyof typeof DNA_COLORS];
        return (
          <div key={key} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={DNA_ICONS[key as keyof typeof DNA_ICONS]} />
                  </svg>
                </div>
                <span className="text-sm font-semibold capitalize text-white/90">{key}</span>
              </div>
              <span className="text-sm font-bold text-white">{value}%</span>
            </div>
            
            <div className="h-3 rounded-full bg-white/5 overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{
                  width: `${value}%`,
                  background: `linear-gradient(to right, ${colors.from}, ${colors.to})`
                }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{
                    animation: 'shimmer 2s infinite',
                    transform: 'translateX(-100%)'
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
