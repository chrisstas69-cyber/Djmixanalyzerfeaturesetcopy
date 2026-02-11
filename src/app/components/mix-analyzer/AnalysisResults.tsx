import React from 'react';
import { X } from 'lucide-react';
import type { MixAnalysis, DNAProfile } from '../../../types/mix-analyzer';
import DNAVisualization from './DNAVisualization';

interface Props {
  analysis: MixAnalysis;
  onSaveProfile: (profile: DNAProfile) => void;
  onGenerateMix: () => void;
  onClose?: () => void;
}

export default function AnalysisResults({ analysis, onSaveProfile, onGenerateMix, onClose }: Props) {
  return (
    <div className="p-8 space-y-6">
      {/* Mix Overview Card */}
      <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Mix Overview</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Close mix overview"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Waveform */}
        <div className="h-32 rounded-xl bg-black/20 mb-4 overflow-hidden relative">
          <div className="absolute inset-0 flex items-end justify-around px-2 pb-2">
            {analysis.energyCurve.map((energy, i) => (
              <div
                key={i}
                className="w-full mx-px rounded-t"
                style={{
                  height: `${energy}%`,
                  background: `linear-gradient(to top, rgb(0, 217, 255), rgb(157, 78, 221))`
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/5">
            <div className="text-2xl font-bold text-orange-400">{analysis.duration}</div>
            <div className="text-xs text-white/60 mt-1">Duration</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <div className="text-2xl font-bold text-cyan-400">
              {analysis.bpmRange[0]}-{analysis.bpmRange[1]}
            </div>
            <div className="text-xs text-white/60 mt-1">BPM Range</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5">
            <div className="text-2xl font-bold text-purple-400">{analysis.dnaProfile.trackCount}</div>
            <div className="text-xs text-white/60 mt-1">Tracks</div>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold mb-3 text-white/80">Genre Distribution</h4>
          <div className="space-y-2">
            {analysis.genreDistribution.map(({ genre, percentage }) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="text-sm text-white/60 w-24">{genre}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-purple-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-white/80 w-12 text-right">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DNA Fingerprint Card - PROMINENT */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-2 border-orange-500/30 p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">DNA Fingerprint</h3>
          {analysis.matchedArtist && (
            <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">
              87% match with Joeski
            </div>
          )}
        </div>

        {/* DNA Visualization */}
        <DNAVisualization attributes={analysis.dnaProfile.dnaAttributes} />

        {/* Style Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {analysis.dnaProfile.styleTags.map(tag => (
            <span key={tag} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Mixing Style Analysis */}
      <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl">
        <h3 className="text-lg font-bold mb-4">Mixing Style Analysis</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">Transition Speed</span>
              <span className="text-sm text-orange-400 font-medium">{analysis.dnaProfile.transitionAverage}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2 text-white/80">Identified Techniques</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.dnaProfile.mixingTechniques.map(technique => (
                <span key={technique} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
                  {technique}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onGenerateMix}
          className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Generate Auto DJ Mix Using This DNA
        </button>
        
        <button
          onClick={() => onSaveProfile(analysis.dnaProfile)}
          className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold transition-all hover:scale-[1.02]"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
