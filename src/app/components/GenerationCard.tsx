import React from 'react';
import { Check, Loader } from 'lucide-react';

type StageStatus = 'pending' | 'active' | 'complete';

interface GenerationStage {
  name: string;
  status: StageStatus;
}

interface GenerationCardProps {
  stages: GenerationStage[];
  progress: number;
}

export function GenerationCard({ stages, progress }: GenerationCardProps) {
  return (
    <div className="bg-[var(--surface-charcoal)] border border-[var(--border-medium)] rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[var(--text-primary)]">Generating Track</h3>
        <span className="text-sm text-[var(--text-secondary)] font-mono tabular-nums">{Math.round(progress)}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--surface-panel)] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[var(--accent-amber)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stages */}
      <div className="space-y-2">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`
              w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
              ${stage.status === 'complete' ? 'bg-[var(--accent-amber)]' : ''}
              ${stage.status === 'active' ? 'bg-[var(--accent-amber)]/20 border border-[var(--accent-amber)]' : ''}
              ${stage.status === 'pending' ? 'bg-[var(--surface-panel)] border border-[var(--border-subtle)]' : ''}
            `}>
              {stage.status === 'complete' && <Check className="w-3 h-3 text-[var(--background)]" />}
              {stage.status === 'active' && <Loader className="w-3 h-3 text-[var(--accent-amber)] animate-spin" />}
            </div>
            <span className={`text-sm ${
              stage.status === 'complete' ? 'text-[var(--text-primary)]' :
              stage.status === 'active' ? 'text-[var(--text-primary)]' :
              'text-[var(--text-tertiary)]'
            }`}>
              {index + 1}. {stage.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}