import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Target, Download, Upload, X, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from './ui/Button';

interface AnalysisViewProps {
  trackTitle: string;
  onBack: () => void;
  tasteMatch?: number;
}

type HealthStatus = 'club-ready' | 'borderline' | 'needs-adjustment';
type MetricVerdict = 'excellent' | 'good' | 'fair' | 'poor';

interface FrequencyBand {
  name: string;
  value: number;
  status: 'good' | 'fair' | 'attention';
}

interface Recommendation {
  type: 'info' | 'warning' | 'success';
  text: string;
}

export function AnalysisView({ trackTitle, onBack, tasteMatch }: AnalysisViewProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [referenceTrack, setReferenceTrack] = useState<string | null>(null);
  const [hoveredBand, setHoveredBand] = useState<number | null>(null);
  
  const healthStatus: HealthStatus = 'club-ready';
  
  const metrics = [
    {
      name: 'Groove Stability',
      verdict: 'excellent' as MetricVerdict,
      value: 94,
      description: 'Consistent rhythmic foundation',
      issue: null
    },
    {
      name: 'Low-End Coherence',
      verdict: 'good' as MetricVerdict,
      value: 87,
      description: 'Sub and bass relationship',
      issue: null
    },
    {
      name: 'Density Balance',
      verdict: 'fair' as MetricVerdict,
      value: 72,
      description: 'Element spacing and clarity',
      issue: 'High-frequency density may cause fatigue'
    },
    {
      name: 'Spectral Balance',
      verdict: 'excellent' as MetricVerdict,
      value: 91,
      description: 'Frequency distribution',
      issue: null
    }
  ];

  const healthConfig = {
    'club-ready': {
      color: 'text-[var(--success-green)]',
      bg: 'bg-[var(--success-green)]/10',
      border: 'border-[var(--success-green)]/30',
      label: 'Club-Ready'
    },
    'borderline': {
      color: 'text-[var(--accent-amber)]',
      bg: 'bg-[var(--accent-amber)]/10',
      border: 'border-[var(--accent-amber)]/30',
      label: 'Borderline'
    },
    'needs-adjustment': {
      color: 'text-[var(--warning-red)]',
      bg: 'bg-[var(--warning-red)]/10',
      border: 'border-[var(--warning-red)]/30',
      label: 'Needs Adjustment'
    }
  };

  const verdictIcons = {
    excellent: <TrendingUp className="w-4 h-4 text-[var(--success-green)]" />,
    good: <TrendingUp className="w-4 h-4 text-[var(--accent-amber)]" />,
    fair: <Minus className="w-4 h-4 text-[var(--accent-amber)]" />,
    poor: <TrendingDown className="w-4 h-4 text-[var(--warning-red)]" />
  };

  const config = healthConfig[healthStatus];

  const frequencyBands: FrequencyBand[] = [
    { name: 'Sub', value: 85, status: 'good' },
    { name: 'Bass', value: 78, status: 'good' },
    { name: 'Low Mid', value: 65, status: 'fair' },
    { name: 'Mid', value: 72, status: 'good' },
    { name: 'High Mid', value: 68, status: 'fair' },
    { name: 'High', value: 55, status: 'attention' }
  ];

  const recommendations: Recommendation[] = [
    { type: 'success', text: 'Groove Stability is excellent at 94%. Your rhythmic foundation is solid and club-ready.' },
    { type: 'success', text: 'Low-End Coherence is strong (87%). The sub and bass relationship is well-balanced.' },
    { type: 'warning', text: 'Reduce high-frequency density by 10-15%. Current level at 55% may cause listener fatigue over time.' },
    { type: 'info', text: 'Consider adding more sub-bass presence (currently 85%). Target 90%+ for deeper club impact.' },
    { type: 'info', text: 'Increase Low Mid frequency presence from 65% to 70% for more warmth and body.' },
    { type: 'warning', text: 'High Mid range at 68% is slightly low. Boost to 75% for better clarity and definition.' }
  ];

  const referenceFrequencyBands: FrequencyBand[] = [
    { name: 'Sub', value: 82, status: 'good' },
    { name: 'Bass', value: 80, status: 'good' },
    { name: 'Low Mid', value: 70, status: 'good' },
    { name: 'Mid', value: 75, status: 'good' },
    { name: 'High Mid', value: 72, status: 'good' },
    { name: 'High', value: 68, status: 'good' }
  ];

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceTrack(e.target.files[0].name);
      setShowComparison(true);
    }
  };

  const handleExportAnalysis = () => {
    // Simulate PDF download
    console.log('Exporting analysis as PDF...');
    alert('Analysis report will be downloaded as PDF (feature demo)');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-charcoal)]">
        <div className="max-w-5xl mx-auto p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generator
          </button>
          <h1 className="text-[var(--text-primary)] mb-2">Track Analysis</h1>
          <p className="text-[var(--text-secondary)]">{trackTitle}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Taste Match (if Music DNA is active) */}
        {tasteMatch !== undefined && (
          <div>
            <h2 className="text-[var(--text-primary)] mb-4">Taste Match</h2>
            <div className="p-6 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-amber)]/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-[var(--accent-amber)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[var(--text-primary)]">Match with Your Music DNA</h3>
                    <span className="text-2xl text-[var(--accent-amber)] font-mono tabular-nums">
                      {tasteMatch}%
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    {tasteMatch >= 80 && "This track closely aligns with your taste profile. Strong match across groove, density, and low-end characteristics."}
                    {tasteMatch >= 60 && tasteMatch < 80 && "Good alignment with your taste profile. Some characteristics match your preferences well."}
                    {tasteMatch < 60 && "This track differs from your typical taste profile. Consider adjusting parameters to better match your preferences."}
                  </p>
                  <div className="h-2 bg-[var(--surface-panel)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        tasteMatch >= 80
                          ? 'bg-[var(--success-green)]'
                          : tasteMatch >= 60
                          ? 'bg-[var(--accent-amber)]'
                          : 'bg-[var(--warning-red)]'
                      }`}
                      style={{ width: `${tasteMatch}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Track Health */}
        <div>
          <h2 className="text-[var(--text-primary)] mb-4">Track Health</h2>
          <div className={`p-6 rounded-xl border ${config.border} ${config.bg}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`${config.color} mb-1`}>{config.label}</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  All metrics within acceptable range
                </p>
              </div>
              <div className={`w-20 h-20 rounded-full ${config.bg} border-4 ${config.border} flex items-center justify-center`}>
                <span className={`text-2xl ${config.color}`}>✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <h2 className="text-[var(--text-primary)] mb-4">Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="p-5 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-[var(--text-primary)] mb-1">{metric.name}</h4>
                    <p className="text-xs text-[var(--text-tertiary)]">{metric.description}</p>
                  </div>
                  {verdictIcons[metric.verdict]}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-2 bg-[var(--surface-panel)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        metric.verdict === 'excellent' || metric.verdict === 'good'
                          ? 'bg-[var(--success-green)]'
                          : metric.verdict === 'fair'
                          ? 'bg-[var(--accent-amber)]'
                          : 'bg-[var(--warning-red)]'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs capitalize text-[var(--text-secondary)]">
                      {metric.verdict}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono tabular-nums">
                      {metric.value}%
                    </span>
                  </div>
                </div>

                {/* Issue */}
                {metric.issue && (
                  <div className="pt-3 border-t border-[var(--border-subtle)]">
                    <p className="text-xs text-[var(--warning-red)] mb-2">{metric.issue}</p>
                    <button className="text-xs text-[var(--accent-amber)] hover:text-[var(--accent-amber-hover)] transition-colors">
                      Jump to control →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Spectral Overview */}
        <div>
          <h2 className="text-[var(--text-primary)] mb-4">Spectral Balance</h2>
          <div className="p-6 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl">
            <div className="flex items-end justify-between h-40 gap-2">
              {frequencyBands.map((band, index) => {
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="relative w-full">
                      <div
                        className={`w-full bg-gradient-to-t ${
                          band.status === 'good'
                            ? 'from-[var(--success-green)] to-[var(--success-green)]/50'
                            : band.status === 'fair'
                            ? 'from-[var(--accent-amber)] to-[var(--accent-amber)]/50'
                            : 'from-[var(--warning-red)] to-[var(--warning-red)]/50'
                        } rounded-t transition-all duration-200 group-hover:opacity-80`}
                        style={{ height: `${band.value * 1.6}px` }}
                        onMouseEnter={() => setHoveredBand(index)}
                        onMouseLeave={() => setHoveredBand(null)}
                      />
                      {/* Tooltip on hover */}
                      {hoveredBand === index && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[var(--surface-panel)] border border-[var(--border-subtle)] rounded-lg shadow-lg whitespace-nowrap z-10">
                          <p className="text-xs text-[var(--text-primary)]">
                            {band.value}%
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)]">{band.name}</span>
                    <span className={`text-xs font-medium ${
                      band.status === 'good' ? 'text-[var(--success-green)]' :
                      band.status === 'fair' ? 'text-[var(--accent-amber)]' :
                      'text-[var(--warning-red)]'
                    }`}>
                      {band.status === 'good' ? 'Good' : band.status === 'fair' ? 'Fair' : 'Attention'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Frequency Analysis */}
        <div>
          <h2 className="text-[var(--text-primary)] mb-4">Detailed Frequency Analysis</h2>
          <div className="space-y-3">
            {frequencyBands.map((band, index) => (
              <div key={index} className="p-4 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--text-primary)] font-medium w-20">{band.name}</span>
                    <div className="flex-1 h-2 bg-[var(--surface-panel)] rounded-full overflow-hidden min-w-[200px]">
                      <div
                        className={`h-full transition-all duration-300 ${
                          band.status === 'good'
                            ? 'bg-[var(--success-green)]'
                            : band.status === 'fair'
                            ? 'bg-[var(--accent-amber)]'
                            : 'bg-[var(--warning-red)]'
                        }`}
                        style={{ width: `${band.value}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--text-tertiary)] font-mono tabular-nums">{band.value}%</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      band.status === 'good' ? 'bg-[var(--success-green)]/10 text-[var(--success-green)]' :
                      band.status === 'fair' ? 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]' :
                      'bg-[var(--warning-red)]/10 text-[var(--warning-red)]'
                    }`}>
                      {band.status === 'good' ? 'Good' : band.status === 'fair' ? 'Fair' : 'Needs Attention'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Feature */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[var(--text-primary)]">Track Comparison</h2>
            {!showComparison && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleReferenceUpload}
                  className="hidden"
                />
                <Button variant="secondary">
                  <Upload className="w-4 h-4 mr-2" />
                  Compare to Reference Track
                </Button>
              </label>
            )}
            {showComparison && referenceTrack && (
              <button
                onClick={() => {
                  setShowComparison(false);
                  setReferenceTrack(null);
                }}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--warning-red)] transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Remove Comparison
              </button>
            )}
          </div>

          {showComparison && referenceTrack ? (
            <div className="p-6 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-[var(--text-primary)] mb-1">Reference Track</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{referenceTrack}</p>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-2 gap-6">
                {/* Your Track */}
                <div>
                  <h4 className="text-sm text-[var(--text-primary)] mb-4">Your Track</h4>
                  <div className="space-y-3">
                    {frequencyBands.map((band, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[var(--text-tertiary)]">{band.name}</span>
                          <span className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">{band.value}%</span>
                        </div>
                        <div className="h-1.5 bg-[var(--surface-panel)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--accent-amber)]"
                            style={{ width: `${band.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reference Track */}
                <div>
                  <h4 className="text-sm text-[var(--text-primary)] mb-4">Reference Track</h4>
                  <div className="space-y-3">
                    {referenceFrequencyBands.map((band, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[var(--text-tertiary)]">{band.name}</span>
                          <span className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">{band.value}%</span>
                        </div>
                        <div className="h-1.5 bg-[var(--surface-panel)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--success-green)]"
                            style={{ width: `${band.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Differences */}
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <h4 className="text-sm text-[var(--text-primary)] mb-3">Key Differences</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-[var(--accent-amber)]" />
                    <span className="text-[var(--text-secondary)]">
                      Sub: {frequencyBands[0].value > referenceFrequencyBands[0].value ? '+' : ''}
                      {(frequencyBands[0].value - referenceFrequencyBands[0].value).toFixed(0)}%
                      {Math.abs(frequencyBands[0].value - referenceFrequencyBands[0].value) > 5 ? ' (increase sub presence)' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-[var(--accent-amber)]" />
                    <span className="text-[var(--text-secondary)]">
                      High: {frequencyBands[5].value > referenceFrequencyBands[5].value ? '+' : ''}
                      {(frequencyBands[5].value - referenceFrequencyBands[5].value).toFixed(0)}%
                      {Math.abs(frequencyBands[5].value - referenceFrequencyBands[5].value) > 5 ? ' (reduce high-frequency density)' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-[var(--surface-charcoal)] border-2 border-dashed border-[var(--border-subtle)] rounded-xl text-center">
              <Upload className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)] mb-2">Upload a reference track to compare</p>
              <p className="text-sm text-[var(--text-tertiary)]">See how your track stacks up against professional references</p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-[var(--text-primary)] mb-4">Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl">
                <div className="flex items-center gap-2">
                  {rec.type === 'info' && <Lightbulb className="w-4 h-4 text-[var(--accent-amber)]" />}
                  {rec.type === 'warning' && <AlertCircle className="w-4 h-4 text-[var(--warning-red)]" />}
                  {rec.type === 'success' && <CheckCircle className="w-4 h-4 text-[var(--success-green)]" />}
                  <p className="text-sm text-[var(--text-secondary)]">{rec.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleExportAnalysis}>Export Analysis</Button>
          <Button variant="secondary" onClick={onBack}>Back to Track</Button>
        </div>
      </div>
    </div>
  );
}