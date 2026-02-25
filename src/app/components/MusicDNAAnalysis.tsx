import React from 'react';
import { ArrowLeft, Check, Loader2, Clock } from 'lucide-react';
import { Button } from './ui/Button';

interface MusicDNAAnalysisProps {
  onBack: () => void;
  trackName: string;
}

type AnalysisStage = 'complete' | 'active' | 'pending';

interface AnalysisItem {
  name: string;
  status: AnalysisStage;
  description: string;
}

export function MusicDNAAnalysis({ onBack, trackName }: MusicDNAAnalysisProps) {
  const analysisItems: AnalysisItem[] = [
    {
      name: 'Tempo Analysis',
      status: 'complete',
      description: 'BPM detection and timing stability'
    },
    {
      name: 'Groove Extraction',
      status: 'complete',
      description: 'Swing, shuffle, and rhythmic feel'
    },
    {
      name: 'Density Mapping',
      status: 'active',
      description: 'Element spacing and frequency balance'
    },
    {
      name: 'Low End Character',
      status: 'pending',
      description: 'Sub, bass, and low-mid relationships'
    },
    {
      name: 'Arrangement Structure',
      status: 'pending',
      description: 'Section detection and progression analysis'
    }
  ];

  const getStatusIcon = (status: AnalysisStage) => {
    switch (status) {
      case 'complete':
        return <Check className="w-5 h-5 text-[var(--success-green)]" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-[var(--accent-amber)] animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-[var(--text-tertiary)]" />;
    }
  };

  const completedCount = analysisItems.filter(item => item.status === 'complete').length;
  const progress = (completedCount / analysisItems.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-charcoal)]">
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-[var(--text-primary)] mb-2">Analyzing Track</h1>
            <p className="text-[var(--text-secondary)]">{trackName}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Overall Progress */}
          <div className="p-6 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[var(--text-primary)]">Analysis Progress</h2>
              <span className="text-sm text-[var(--text-secondary)] font-mono tabular-nums">
                {completedCount}/{analysisItems.length} complete
              </span>
            </div>
            <div className="h-2 bg-[var(--surface-panel)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-amber)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Analysis Checklist */}
          <div>
            <h2 className="text-[var(--text-primary)] mb-4">Analysis Steps</h2>
            <div className="space-y-3">
              {analysisItems.map((item, index) => (
                <div
                  key={index}
                  className={`
                    p-5 bg-[var(--surface-charcoal)] border rounded-xl transition-all
                    ${item.status === 'active' 
                      ? 'border-[var(--accent-amber)] shadow-lg shadow-[var(--accent-amber)]/5' 
                      : 'border-[var(--border-subtle)]'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${item.status === 'active' 
                        ? 'bg-[var(--accent-amber)]/10' 
                        : 'bg-[var(--surface-panel)]'
                      }
                    `}>
                      {getStatusIcon(item.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-[var(--text-primary)]">{item.name}</h3>
                        {item.status === 'complete' && (
                          <span className="text-xs text-[var(--success-green)]">
                            Complete
                          </span>
                        )}
                        {item.status === 'active' && (
                          <span className="text-xs text-[var(--accent-amber)]">
                            Processing...
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-5 bg-[var(--surface-panel)] border border-[var(--border-subtle)] rounded-xl">
            <p className="text-sm text-[var(--text-secondary)]">
              This process analyzes the sonic characteristics of your track to build your 
              personalized Music DNA profile. Analysis typically takes 30-60 seconds per track.
            </p>
          </div>

          {/* Actions */}
          {progress === 100 && (
            <div className="flex gap-3">
              <Button variant="primary" onClick={onBack}>
                View Results
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
