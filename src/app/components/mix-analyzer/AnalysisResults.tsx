import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import type { MixAnalysis, DNAProfile, DetectedTrack } from '../../../types/mix-analyzer';
import DNAVisualization from './DNAVisualization';

const KEY_COLORS: Record<string, string> = {
  C: '#e11d48', 'C#': '#f97316', D: '#eab308', 'D#': '#84cc16', E: '#22c55e', F: '#14b8a6',
  'F#': '#06b6d4', G: '#3b82f6', 'G#': '#8b5cf6', A: '#a855f7', 'A#': '#d946ef', B: '#ec4899',
  Cm: '#64748b', 'C#m': '#475569', Dm: '#0ea5e9', 'D#m': '#6366f1', Em: '#a855f7', Fm: '#d946ef',
  'F#m': '#f43f5e', Gm: '#f97316', 'G#m': '#eab308', Am: '#22c55e', 'A#m': '#14b8a6', Bm: '#06b6d4',
};

interface Props {
  analysis: MixAnalysis;
  mixTitle?: string;
  onSaveProfile: (profile: DNAProfile) => void;
  onGenerateMix: () => void;
  onClose?: () => void;
  onNavigateToCreateTrack?: (prompt?: string) => void;
}

export default function AnalysisResults({ analysis, mixTitle, onSaveProfile, onGenerateMix, onClose, onNavigateToCreateTrack }: Props) {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const tracks = analysis.detectedTracks ?? [];
  const avgBpm = analysis.bpmRange ? Math.round((analysis.bpmRange[0] + analysis.bpmRange[1]) / 2) : 128;
  const keyRange = analysis.keyProgression?.length
    ? `${analysis.keyProgression[0]} → ${analysis.keyProgression[analysis.keyProgression.length - 1]}`
    : 'Am → Fm';

  return (
    <div className="p-8 space-y-6">
      {/* Analyze New Mix link */}
      {onClose && (
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Analyze New Mix
        </button>
      )}

      {/* Mix Overview Card */}
      <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{mixTitle ? `${mixTitle} — Overview` : 'Mix Overview'}</h3>
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

      {/* Results panel with tracklist when we have detected tracks */}
      {tracks.length > 0 && (
        <>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4 text-sm">
              <div>
                <div className="text-white/50 uppercase tracking-wider text-xs mb-0.5">MIX TITLE</div>
                <div className="font-semibold text-white">{mixTitle || 'Detected Mix'}</div>
              </div>
              <div>
                <div className="text-white/50 uppercase tracking-wider text-xs mb-0.5">DURATION</div>
                <div className="font-semibold text-white">{analysis.duration}</div>
              </div>
              <div>
                <div className="text-white/50 uppercase tracking-wider text-xs mb-0.5">TRACKS DETECTED</div>
                <div className="font-semibold text-white">{tracks.length}</div>
              </div>
              <div>
                <div className="text-white/50 uppercase tracking-wider text-xs mb-0.5">AVG BPM</div>
                <div className="font-semibold text-white">{avgBpm}</div>
              </div>
              <div>
                <div className="text-white/50 uppercase tracking-wider text-xs mb-0.5">KEY RANGE</div>
                <div className="font-semibold text-white">{keyRange}</div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-white/10" style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <th className="text-left py-3 px-2 text-xs uppercase text-white/50 font-semibold" style={{ letterSpacing: '0.08em' }}>#</th>
                    <th className="text-left py-3 px-2 text-xs uppercase text-white/50 font-semibold" style={{ letterSpacing: '0.08em' }}>Title</th>
                    <th className="text-left py-3 px-2 text-xs uppercase text-white/50 font-semibold" style={{ letterSpacing: '0.08em' }}>Artist</th>
                    <th className="text-left py-3 px-2 text-xs uppercase text-white/50 font-semibold" style={{ letterSpacing: '0.08em' }}>BPM</th>
                    <th className="text-left py-3 px-2 text-xs uppercase text-white/50 font-semibold" style={{ letterSpacing: '0.08em' }}>Key</th>
                    <th className="text-left py-3 px-2 text-xs uppercase text-white/50 font-semibold" style={{ letterSpacing: '0.08em' }}>Energy</th>
                    <th className="text-left py-3 px-2 text-xs uppercase text-white/50 font-semibold" style={{ letterSpacing: '0.08em' }}>Time</th>
                    <th className="text-left py-3 px-2 text-xs uppercase text-white/50 font-semibold" style={{ letterSpacing: '0.08em' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, rowIndex) => {
                    const isHovered = hoveredRowId === track.id;
                    const rowBg = rowIndex % 2 === 0 ? '#0d0d0d' : '#111';
                    const filled = Math.round((track.energyLevel / 100) * 5);
                    const keyBg = KEY_COLORS[track.key] ?? '#00D4FF';
                    return (
                      <tr
                        key={track.id}
                        onMouseEnter={() => setHoveredRowId(track.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        style={{
                          height: 48,
                          background: isHovered ? '#1a1a1a' : rowBg,
                          borderLeft: isHovered ? '2px solid #00D4FF' : undefined,
                        }}
                      >
                        <td className="px-2 text-white/70 text-sm">{rowIndex + 1}</td>
                        <td className="px-2 text-white text-sm truncate">{track.name}</td>
                        <td className="px-2 text-white/70 text-sm truncate">{track.artist ?? '—'}</td>
                        <td className="px-2">
                          <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{ background: '#00D4FF22', color: '#00D4FF' }}>{track.bpm}</span>
                        </td>
                        <td className="px-2">
                          <span className="text-xs rounded-full px-2 py-0.5 font-medium" style={{ background: keyBg, color: '#000' }}>{track.key}</span>
                        </td>
                        <td className="px-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <span
                                key={i}
                                className="rounded-full"
                                style={{ width: 6, height: 6, background: i <= filled ? '#00D4FF' : '#222' }}
                              />
                            ))}
                            <span className="text-xs text-white/60 ml-1">{track.energyLevel}%</span>
                          </div>
                        </td>
                        <td className="px-2 text-white/60 text-sm">{track.timestamp}</td>
                        <td className="px-2">
                          <button
                            type="button"
                            onClick={() => onNavigateToCreateTrack?.(`Generate a track similar to "${track.name}" by ${track.artist}`)}
                            className="text-xs font-medium px-2 py-1.5 rounded-md border transition-colors"
                            style={{ background: 'transparent', borderColor: '#00D4FF', color: '#00D4FF' }}
                          >
                            Generate Similar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={onGenerateMix}
                className="w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #00D4FF, #00a8cc)' }}
              >
                ✦ Generate All {tracks.length} Tracks
              </button>
              <button
                type="button"
                className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 text-white/80 border transition-colors hover:bg-white/5"
                style={{ background: '#0d0d0d', borderColor: '#333' }}
              >
                ⬇ Export Tracklist
              </button>
            </div>
          </div>
        </>
      )}

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
