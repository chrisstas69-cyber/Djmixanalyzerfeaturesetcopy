import React, { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Waveform } from './ui/Waveform';
import { VerticalWaveform } from './ui/VerticalWaveform';
import { MutationButton } from './ui/MutationButton';
import { WarningBadge } from './ui/WarningBadge';
import { StarRating } from './ui/StarRating';

interface TrackVersion {
  id: string;
  label: string;
}

interface TrackCardProps {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  length: string;
  isExpanded: boolean;
  isPlaying: boolean;
  currentVersion: string;
  versions: TrackVersion[];
  mutatingButton?: string | null;
  warning?: {
    type: 'info' | 'advisory' | 'blocking';
    message: string;
  };
  onToggleExpand: () => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  onMutate: (type: string) => void;
  onVersionChange: (versionId: string) => void;
}

export function TrackCard({
  id,
  title,
  bpm,
  genre,
  length,
  isExpanded,
  isPlaying,
  currentVersion,
  versions,
  mutatingButton,
  warning,
  onToggleExpand,
  onTogglePlay,
  onRestart,
  onMutate,
  onVersionChange
}: TrackCardProps) {
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(3); // Default 3-star rating

  const mutations = [
    { id: 'bass', label: 'Mutate Bass' },
    { id: 'percussion', label: 'Reduce Percussion' },
    { id: 'groove', label: 'Change Groove' },
    { id: 'topend', label: 'Clean Top End' },
    { id: 'harmony', label: 'Change Harmony' },
    { id: 'darker', label: 'Darker Version' }
  ];

  // Simulate progress for demo
  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <motion.div
      layout
      className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:border-[var(--border-medium)] transition-colors"
    >
      {/* Collapsed state */}
      <div 
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggleExpand}
      >
        {/* Vertical waveform on the left */}
        <div className="w-16 flex-shrink-0">
          <VerticalWaveform 
            progress={progress / 100} 
            height={80}
            interactive={false}
          />
        </div>
        
        {/* Track info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[var(--text-primary)] truncate">{title}</h4>
          <p className="text-sm text-[var(--text-tertiary)]">
            {bpm} BPM • {genre} • {length}
          </p>
        </div>

        {/* Play button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className="w-10 h-10 rounded-full bg-[var(--accent-amber)] flex items-center justify-center hover:bg-[var(--accent-amber-hover)] transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-[var(--background)]" fill="currentColor" />
          ) : (
            <Play className="w-4 h-4 text-[var(--background)] ml-0.5" fill="currentColor" />
          )}
        </button>
      </div>

      {/* Expanded state */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-[var(--border-subtle)]"
          >
            <div className="p-6 space-y-6">
              {/* Large waveform */}
              <div className="space-y-3">
                <Waveform 
                  size="large" 
                  interactive 
                  progress={progress / 100}
                  variant={mutatingButton ? 'dimmed' : 'default'}
                />
                
                {/* Transport controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onTogglePlay}
                      className="w-10 h-10 rounded-full bg-[var(--accent-amber)] flex items-center justify-center hover:bg-[var(--accent-amber-hover)] transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-[var(--background)]" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 text-[var(--background)] ml-0.5" fill="currentColor" />
                      )}
                    </button>
                    <button
                      onClick={onRestart}
                      className="w-10 h-10 rounded-full bg-[var(--surface-panel)] flex items-center justify-center hover:bg-[var(--surface-charcoal)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-[var(--text-secondary)] font-mono tabular-nums ml-2">
                      {Math.floor((progress / 100) * 420)}s / 420s
                    </span>
                  </div>

                  {/* Version selector */}
                  <div className="flex items-center gap-1 bg-[var(--surface-panel)] rounded-lg p-1">
                    {versions.map((version) => (
                      <button
                        key={version.id}
                        onClick={() => onVersionChange(version.id)}
                        className={`px-3 py-1.5 rounded text-sm transition-all ${
                          currentVersion === version.id
                            ? 'bg-[var(--accent-amber)] text-[var(--background)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        Version {version.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {warning && (
                <WarningBadge
                  type={warning.type}
                  message={warning.message}
                  actions={[
                    { label: 'Auto-fix', onClick: () => console.log('Auto-fix') },
                    { label: 'Adjust controls', onClick: () => console.log('Adjust controls') }
                  ]}
                />
              )}

              {/* Mutation buttons */}
              <div>
                <h5 className="text-sm text-[var(--text-secondary)] mb-3">Mutations</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {mutations.map((mutation) => (
                    <MutationButton
                      key={mutation.id}
                      label={mutation.label}
                      state={
                        mutatingButton === mutation.id ? 'loading' :
                        mutatingButton ? 'disabled' :
                        'default'
                      }
                      onClick={() => onMutate(mutation.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Progress bar for mutations */}
              {mutatingButton && (
                <div className="space-y-2">
                  <div className="h-1 bg-[var(--surface-panel)] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[var(--accent-amber)]"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                </div>
              )}

              {/* Star rating */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <span className="text-sm text-[var(--text-secondary)]">Rate this track:</span>
                <StarRating
                  rating={rating}
                  onChange={setRating}
                  size="md"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}