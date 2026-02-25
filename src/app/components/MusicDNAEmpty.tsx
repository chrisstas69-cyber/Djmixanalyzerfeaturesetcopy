import React from 'react';
import { ArrowLeft, Upload, CircleDot } from 'lucide-react';
import { Button } from './ui/Button';

interface MusicDNAEmptyProps {
  onBack: () => void;
  onUpload: () => void;
  onSkip: () => void;
}

export function MusicDNAEmpty({ onBack, onUpload, onSkip }: MusicDNAEmptyProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-charcoal)]">
        <div className="max-w-3xl mx-auto p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] flex items-center justify-center">
              <CircleDot className="w-10 h-10 text-[var(--accent-amber)]" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-4">
            <h1 className="text-[var(--text-primary)]">Build Your Music DNA</h1>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Upload your favorite underground dance tracks to train a personal taste profile. 
              The system will analyze tempo, groove, density, low-end character, and arrangement 
              patterns to understand your sonic preferences.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl text-center">
              <div className="text-2xl text-[var(--accent-amber)] mb-2">100</div>
              <div className="text-xs text-[var(--text-tertiary)]">Max tracks</div>
            </div>
            <div className="p-4 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl text-center">
              <div className="text-2xl text-[var(--accent-amber)] mb-2">🔒</div>
              <div className="text-xs text-[var(--text-tertiary)]">Private</div>
            </div>
            <div className="p-4 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl text-center">
              <div className="text-2xl text-[var(--accent-amber)] mb-2">✓</div>
              <div className="text-xs text-[var(--text-tertiary)]">Never shared</div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-5 bg-[var(--surface-panel)] border border-[var(--border-subtle)] rounded-xl">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              <span className="text-[var(--text-primary)]">Note:</span> Your uploaded tracks are 
              analyzed locally and stored securely. No audio data is shared or used for any purpose 
              other than generating your personal taste profile. You can delete your library at any time.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-center">
            <Button 
              variant="primary" 
              onClick={onUpload}
              className="min-w-[180px]"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Tracks
            </Button>
            <Button 
              variant="ghost" 
              onClick={onSkip}
              className="min-w-[180px]"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
