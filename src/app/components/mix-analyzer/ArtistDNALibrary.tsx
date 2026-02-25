import React, { useState } from 'react';
import type { Artist, DNAProfile } from '../../../types/mix-analyzer';

interface Props {
  onSelectArtist: (artist: Artist) => void;
  thisMixProfile?: DNAProfile | null;
}

const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Joeski',
    photo: '🎧',
    genre: 'Tech House',
    averageBpm: 125,
    dnaAttributes: { groove: 88, energy: 75, darkness: 82, hypnotic: 91, minimal: 70 },
    signatureTechniques: ['Hypnotic loops', 'Deep basslines', 'Minimal builds']
  },
  {
    id: '2',
    name: 'Carl Cox',
    photo: '🎵',
    genre: 'Techno',
    averageBpm: 128,
    dnaAttributes: { groove: 92, energy: 95, darkness: 78, hypnotic: 85, minimal: 60 },
    signatureTechniques: ['High energy', 'Three deck mixing', 'Peak hour bangers']
  },
  {
    id: '3',
    name: 'Jamie Jones',
    photo: '🎶',
    genre: 'Tech House',
    averageBpm: 124,
    dnaAttributes: { groove: 95, energy: 72, darkness: 70, hypnotic: 88, minimal: 82 },
    signatureTechniques: ['Groovy basslines', 'Smooth transitions', 'Warm atmosphere']
  }
];

export default function ArtistDNALibrary({ onSelectArtist, thisMixProfile }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtists = MOCK_ARTISTS.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const attrs = thisMixProfile?.dnaAttributes;
  const groove = attrs?.groove ?? 87;
  const energy = attrs?.energy ?? 84;
  const darkness = attrs?.darkness ?? 76;
  const avgBpm = thisMixProfile?.bpmRange ? Math.round((thisMixProfile.bpmRange[0] + thisMixProfile.bpmRange[1]) / 2) : 128;
  const dominantKey = thisMixProfile?.styleTags?.length ? 'Am' : 'Am';
  const styleTags = thisMixProfile?.styleTags?.join(' · ') ?? 'Techno · Dark · Industrial';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold mb-4">Artist DNA Profiles</h2>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* THIS MIX DNA card - when analysis is present */}
      {thisMixProfile && (
        <div className="p-4 border-b border-white/10 bg-gradient-to-br from-cyan-500/10 to-orange-500/10">
          <div className="text-xs text-cyan-400 font-semibold mb-3 uppercase tracking-wider">THIS MIX</div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/50 w-16">Groove</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${groove}%` }} />
              </div>
              <span className="text-xs text-white/80 w-8">{groove}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/50 w-16">Energy</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${energy}%` }} />
              </div>
              <span className="text-xs text-white/80 w-8">{energy}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/50 w-16">Darkness</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${darkness}%` }} />
              </div>
              <span className="text-xs text-white/80 w-8">{darkness}%</span>
            </div>
          </div>
          <div className="text-xs text-white/60 mb-1">Avg BPM: <span className="text-white font-semibold">{avgBpm}</span></div>
          <div className="text-xs text-white/60 mb-2">Dominant Key: <span className="text-white font-semibold">{dominantKey}</span></div>
          <div className="text-xs text-white/50">{styleTags}</div>
        </div>
      )}

      {/* Featured Artist */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-br from-orange-500/5 to-purple-500/5">
        <div className="text-xs text-orange-400 font-semibold mb-3">ARTIST OF THE WEEK</div>
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-3xl flex-shrink-0">
            {MOCK_ARTISTS[0].photo}
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">{MOCK_ARTISTS[0].name}</h3>
            <p className="text-xs text-white/60 mb-2">{MOCK_ARTISTS[0].genre}</p>
            <button className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-medium transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Artists List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => onSelectArtist(artist)}
            className="group p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-orange-500/50 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                {artist.photo}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-0.5">{artist.name}</h3>
                <p className="text-xs text-white/60">{artist.genre}</p>
                <p className="text-xs text-white/40 mt-1">Avg: {artist.averageBpm} BPM</p>
              </div>
            </div>

            {/* Mini DNA Bars */}
            <div className="space-y-1.5">
              {Object.entries(artist.dnaAttributes).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40 w-14 capitalize">{key}</span>
                  <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Hover Actions */}
            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-medium transition-colors">
                Use DNA
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors">
                Compare
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Artist Button */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 text-sm transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request Artist
        </button>
      </div>
    </div>
  );
}
