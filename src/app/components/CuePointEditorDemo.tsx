import React, { useState } from 'react';
import { CuePointEditor } from './CuePointEditor';
import { Edit3, ArrowLeft } from 'lucide-react';

interface CuePointEditorDemoProps {
  onBack?: () => void;
}

export function CuePointEditorDemo({ onBack }: CuePointEditorDemoProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [savedCuePoints, setSavedCuePoints] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl text-[var(--text-primary)]">Cue Point Editor</h1>
          <p className="text-[var(--text-secondary)]">Professional cue point management for DJ software</p>
        </div>

        {/* Demo Track Card */}
        <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-[var(--text-primary)] font-bold">Deep Techno Journey</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                128 BPM • Techno • 7:24 • {savedCuePoints.length} cue points
              </p>
            </div>
            <button
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2 px-4 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Cue Points
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold">Waveform Features</h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
              <li>Large 200px horizontal waveform display</li>
              <li>Time ruler showing minutes and seconds</li>
              <li>Zoom controls (50% to 300%)</li>
              <li>Color-coded cue point markers</li>
              <li>Orange playhead with smooth animation</li>
              <li>Click anywhere to seek to that position</li>
              <li>Hover over cue points to see labels</li>
              <li>Click cue markers to jump to that time</li>
            </ul>
          </div>

          <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold">Cue Point Management</h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
              <li>Table view with all cue points</li>
              <li>Auto-generated cue points (🤖 Auto)</li>
              <li>Custom user cue points (👤 Custom)</li>
              <li>Edit labels inline</li>
              <li>Edit time position (MM:SS format)</li>
              <li>Delete unwanted cue points</li>
              <li>Add custom cue points at playhead</li>
              <li>5 colors: Red, Green, Yellow, Blue, Purple</li>
            </ul>
          </div>

          <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold">Export Options</h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
              <li>Export to Rekordbox (XML format)</li>
              <li>Export to Serato (NML format)</li>
              <li>Export to Traktor (NML format)</li>
              <li>Download files with cue point data</li>
              <li>Compatible with major DJ software</li>
              <li>Preserve all cue point metadata</li>
            </ul>
          </div>

          <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold">Auto-Generated Cues</h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
              <li>🔴 Intro - Track start point</li>
              <li>🔴 Build - Energy build-up section</li>
              <li>🟢 First Drop - Main drop/climax</li>
              <li>🟡 Breakdown - Breakdown/bridge</li>
              <li>🔵 Main Drop - Final drop/peak</li>
              <li>AI-detected based on track analysis</li>
            </ul>
          </div>
        </div>

        {/* Color Legend */}
        <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6">
          <h3 className="text-lg text-[var(--text-primary)] font-semibold mb-4">Cue Point Colors</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ff4444]" />
              <span className="text-sm text-[var(--text-secondary)]">Red - Intro/Build</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#44ff44]" />
              <span className="text-sm text-[var(--text-secondary)]">Green - Drop/Peak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ffff44]" />
              <span className="text-sm text-[var(--text-secondary)]">Yellow - Breakdown</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#4444ff]" />
              <span className="text-sm text-[var(--text-secondary)]">Blue - Outro/Main</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ff44ff]" />
              <span className="text-sm text-[var(--text-secondary)]">Purple - Custom</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#ff6b35]/10 border border-[#ff6b35]/20 rounded-xl p-6">
          <h3 className="text-lg text-[#ff6b35] font-semibold mb-3">How to Use</h3>
          <ol className="text-sm text-[var(--text-secondary)] space-y-2 list-decimal list-inside">
            <li>Click "Edit Cue Points" button above to open the editor</li>
            <li>Use Play/Pause to preview the track</li>
            <li>Click on the waveform to seek to any position</li>
            <li>Click "Add Custom Cue Point" to add a cue at the current position</li>
            <li>Click cue markers on the waveform to jump to that time</li>
            <li>Use Edit button to change label and time</li>
            <li>Use Delete button to remove unwanted cues</li>
            <li>Use Zoom controls to get a closer view</li>
            <li>Export to your preferred DJ software format</li>
            <li>Click "Save Changes" to confirm your edits</li>
          </ol>
        </div>

        {/* Stats */}
        {savedCuePoints.length > 0 && (
          <div className="bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl p-6">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold mb-4">Saved Cue Points</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ff6b35]">{savedCuePoints.length}</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Total Cues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ff6b35]">
                  {savedCuePoints.filter(c => c.type === 'auto').length}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Auto-Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ff6b35]">
                  {savedCuePoints.filter(c => c.type === 'custom').length}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Custom</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ff6b35]">
                  {new Set(savedCuePoints.map(c => c.color)).size}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Colors Used</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cue Point Editor Modal */}
      {showEditor && (
        <CuePointEditor
          trackTitle="Deep Techno Journey"
          trackDuration={444}
          onClose={() => setShowEditor(false)}
          onSave={(cuePoints) => {
            setSavedCuePoints(cuePoints);
            console.log('Saved cue points:', cuePoints);
          }}
        />
      )}
    </div>
  );
}