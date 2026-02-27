import React, { useState } from 'react';
import type { DNAProfile } from '../../../types/mix-analyzer';

interface Props {
  profiles: DNAProfile[];
  onSelectProfile: (profile: DNAProfile) => void;
}

export default function UserDNALibrary({ profiles, onSelectProfile }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">My DNA Profiles</h2>
          <div className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
            {profiles.length}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search your profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
          />
          <svg className="absolute right-3 top-3 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Profiles List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-white/60 text-sm">Analyze your first mix to build your DNA library</p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className="group p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-orange-500/50 cursor-pointer transition-all hover:scale-[1.02]"
            >
              {/* Thumbnail & Info */}
              <div className="flex gap-3 mb-3">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate mb-1">{profile.name}</h3>
                  <p className="text-xs text-white/40">{new Date(profile.date).toLocaleDateString()}</p>
                  <div className="flex gap-1 mt-2">
                    {profile.styleTags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-orange-500/20 text-orange-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-3 text-xs text-white/60 mb-3">
                <span>{profile.bpmRange[0]}-{profile.bpmRange[1]} BPM</span>
                <span>•</span>
                <span>{profile.trackCount} tracks</span>
              </div>

              {/* Mini DNA Visualization */}
              <div className="space-y-1.5">
                {Object.entries(profile.dnaAttributes).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 w-16 capitalize">{key}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-purple-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/60 w-8 text-right">{value}%</span>
                  </div>
                ))}
              </div>

              {/* Hover Actions */}
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-medium transition-colors">
                  Load
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors">
                  Compare
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Button */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Analyze New Mix
        </button>
      </div>
    </div>
  );
}
