"use client";
import React from 'react';
import { Play, Share2, Download, Trash2, TrendingUp } from 'lucide-react';

interface Mix {
  id: string;
  title: string;
  duration: string;
  createdAt: string;
  plays: number;
  bpm: number;
  key: string;
  energy: string;
}

export default function MyMixesPage() {
  const mixes: Mix[] = [
    {
      id: '1',
      title: 'Deep House Journey',
      duration: '16:18',
      createdAt: '2 hours ago',
      plays: 48592,
      bpm: 124,
      key: 'Am',
      energy: 'Peak',
    },
    {
      id: '2',
      title: 'Good Vibes',
      duration: '5:48',
      createdAt: '5 hours ago',
      plays: 12847,
      bpm: 126,
      key: 'Dm',
      energy: 'Groove',
    },
    {
      id: '3',
      title: 'Spiral Dreams',
      duration: '24:38',
      createdAt: '1 day ago',
      plays: 34219,
      bpm: 128,
      key: 'Fm',
      energy: 'Peak',
    },
    {
      id: '4',
      title: 'House of Cuts',
      duration: '12:03',
      createdAt: '2 days ago',
      plays: 8765,
      bpm: 130,
      key: 'Cm',
      energy: 'Driving',
    },
    {
      id: '5',
      title: 'Deep Dive',
      duration: '48:59',
      createdAt: '3 days ago',
      plays: 56234,
      bpm: 122,
      key: 'Gm',
      energy: 'Minimal',
    },
    {
      id: '6',
      title: 'Midnight Groove',
      duration: '9:12',
      createdAt: '1 week ago',
      plays: 19876,
      bpm: 125,
      key: 'Am',
      energy: 'Groove',
    },
  ];

  // Generate realistic waveform data
  const generateWaveform = (length: number = 200) => {
    return Array.from({ length }, () => Math.random() * 100);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[1400px] px-16 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white/90">My Mixes</h1>
          <p className="text-sm text-white/55 mt-2">Your DJ mix creations</p>
        </div>

        {/* Mixes List */}
        <div className="space-y-6">
          {mixes.map((mix) => {
            const waveformData = generateWaveform();

            return (
              <div
                key={mix.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 space-y-4 hover:border-cyan-500/30 transition-all"
              >
                {/* TITLE ROW - ABOVE WAVEFORM */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white/90">{mix.title}</h3>
                    <p className="text-sm text-white/50 mt-1">
                      {mix.duration} • {mix.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* ALWAYS VISIBLE BUTTONS */}
                    <button className="p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-cyan-300 transition">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-cyan-300 transition">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-orange-300 transition">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* FULL-WIDTH PROFESSIONAL WAVEFORM */}
                <div className="relative w-full h-24 rounded-lg overflow-hidden bg-black/20 border border-white/5">
                  {/* Detailed waveform bars spanning full width */}
                  <div className="flex items-end h-full gap-[1px]">
                    {waveformData.map((height, i) => {
                      // Color based on height (frequency representation)
                      let bgGradient;
                      if (height > 70) {
                        bgGradient = 'linear-gradient(to top, #06b6d4, #22d3ee)'; // Cyan - high freq
                      } else if (height > 40) {
                        bgGradient = 'linear-gradient(to top, #f97316, #fb923c)'; // Orange - mid freq
                      } else {
                        bgGradient = 'rgba(255,255,255,0.25)'; // White - low freq
                      }

                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm"
                          style={{
                            height: `${height}%`,
                            background: bgGradient,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Playhead indicator (can be dynamic) */}
                  <div className="absolute top-0 bottom-0 left-1/4 w-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />

                  {/* Play button overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_24px_rgba(249,115,22,0.5)]">
                      <Play className="h-6 w-6 text-black fill-black ml-1" />
                    </div>
                  </div>
                </div>

                {/* METADATA ROW BELOW - CLEAN AND PROFESSIONAL */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-white/60">
                    <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 font-medium">
                      {mix.bpm} BPM
                    </span>
                    <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 font-medium">
                      {mix.key}
                    </span>
                    <span className="px-3 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300 font-medium">
                      {mix.energy}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">{mix.plays.toLocaleString()} plays</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
