import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  Edit2, 
  Trash2, 
  Play, 
  Pause,
  Download,
  Save,
  Bot,
  User
} from 'lucide-react';

interface CuePoint {
  id: string;
  position: number; // 0-1
  time: number; // in seconds
  label: string;
  color: 'red' | 'green' | 'yellow' | 'blue' | 'purple';
  type: 'auto' | 'custom';
}

interface CuePointEditorProps {
  trackTitle?: string;
  trackDuration?: number; // in seconds
  initialCuePoints?: CuePoint[];
  onClose?: () => void;
  onSave?: (cuePoints: CuePoint[]) => void;
}

export function CuePointEditor({
  trackTitle = 'Deep Techno Journey',
  trackDuration = 444, // 7:24
  initialCuePoints = [],
  onClose,
  onSave
}: CuePointEditorProps) {
  const [cuePoints, setCuePoints] = useState<CuePoint[]>(initialCuePoints.length > 0 ? initialCuePoints : [
    { id: '1', position: 0.0, time: 0, label: 'Intro', color: 'red', type: 'auto' },
    { id: '2', position: 0.21, time: 92, label: 'Build', color: 'red', type: 'auto' },
    { id: '3', position: 0.37, time: 165, label: 'First Drop', color: 'green', type: 'auto' },
    { id: '4', position: 0.58, time: 255, label: 'Breakdown', color: 'yellow', type: 'auto' },
    { id: '5', position: 0.75, time: 330, label: 'Main Drop', color: 'blue', type: 'auto' }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editTime, setEditTime] = useState('');

  const progress = currentTime / trackDuration;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeString: string): number => {
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    const mins = parseInt(parts[0]) || 0;
    const secs = parseInt(parts[1]) || 0;
    return mins * 60 + secs;
  };

  const getCueColor = (color: string) => {
    switch (color) {
      case 'red': return '#ff4444';
      case 'green': return '#44ff44';
      case 'yellow': return '#ffff44';
      case 'blue': return '#4444ff';
      case 'purple': return '#ff44ff';
      default: return '#ffffff';
    }
  };

  const addCuePoint = () => {
    const newCue: CuePoint = {
      id: Date.now().toString(),
      position: progress,
      time: currentTime,
      label: 'New Cue',
      color: 'purple',
      type: 'custom'
    };
    setCuePoints([...cuePoints, newCue].sort((a, b) => a.position - b.position));
  };

  const deleteCuePoint = (id: string) => {
    setCuePoints(cuePoints.filter(cue => cue.id !== id));
  };

  const startEdit = (cue: CuePoint) => {
    setEditingId(cue.id);
    setEditLabel(cue.label);
    setEditTime(formatTime(cue.time));
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    const newTime = parseTime(editTime);
    const newPosition = newTime / trackDuration;
    
    setCuePoints(cuePoints.map(cue => 
      cue.id === editingId 
        ? { ...cue, label: editLabel, time: newTime, position: newPosition }
        : cue
    ).sort((a, b) => a.position - b.position));
    
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = x / rect.width;
    const time = position * trackDuration;
    setCurrentTime(time);
  };

  const handleExport = (format: 'rekordbox' | 'serato' | 'traktor') => {
    console.log(`Exporting to ${format}`, cuePoints);
    // In a real app, this would generate the appropriate XML/NML file
    alert(`Exporting ${cuePoints.length} cue points to ${format.toUpperCase()}...`);
  };

  const WaveformDisplay = () => {
    const bars = Math.floor(200 * zoom);
    
    const waveformData = Array.from({ length: bars }, (_, i) => {
      const position = i / bars;
      const wave1 = Math.sin(position * Math.PI * 8) * 0.5 + 0.5;
      const wave2 = Math.sin(position * Math.PI * 3) * 0.3 + 0.7;
      const noise = Math.random() * 0.2;
      
      let amplitude = (wave1 * 0.4 + wave2 * 0.4 + noise * 0.2);
      
      // Dynamic sections
      let sectionMultiplier = 1;
      if (position < 0.15) sectionMultiplier = 0.5;
      else if (position > 0.15 && position < 0.37) sectionMultiplier = 0.95;
      else if (position > 0.37 && position < 0.58) sectionMultiplier = 1.0;
      else if (position > 0.58 && position < 0.75) sectionMultiplier = 0.6;
      else if (position > 0.75) sectionMultiplier = 0.9;
      
      return amplitude * sectionMultiplier;
    });

    return (
      <div 
        className="relative w-full cursor-crosshair"
        style={{ height: '200px' }}
        onClick={handleWaveformClick}
      >
        {/* Time ruler */}
        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-[var(--text-tertiary)] font-mono">
          {Array.from({ length: 9 }, (_, i) => {
            const time = (trackDuration / 8) * i;
            return (
              <span key={i}>{formatTime(time)}</span>
            );
          })}
        </div>

        {/* Waveform bars */}
        <div className="flex items-center justify-between h-full">
          {waveformData.map((amplitude, index) => {
            const position = index / bars;
            const isPast = position <= progress;
            
            return (
              <div
                key={index}
                className="flex-1 mx-px flex items-center justify-center"
              >
                <div
                  style={{
                    width: '100%',
                    height: `${amplitude * 100}%`,
                    backgroundColor: isPast ? '#666666' : '#333333',
                    borderRadius: '1px',
                    transition: 'background-color 0.1s ease'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Cue point markers */}
        {cuePoints.map((cue) => (
          <div
            key={cue.id}
            className="absolute top-0 bottom-0 w-1 cursor-pointer hover:w-1.5 transition-all group"
            style={{
              left: `${cue.position * 100}%`,
              backgroundColor: getCueColor(cue.color)
            }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentTime(cue.time);
            }}
          >
            {/* Top marker */}
            <div 
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{ backgroundColor: getCueColor(cue.color) }}
            />
            {/* Bottom marker */}
            <div 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{ backgroundColor: getCueColor(cue.color) }}
            />
            
            {/* Label tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-[var(--border-medium)] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {cue.label}
            </div>
          </div>
        ))}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#ff6b35] shadow-[0_0_8px_rgba(255,107,53,0.8)] z-10 pointer-events-none"
          style={{
            left: `${progress * 100}%`,
            transition: 'left 0.1s linear'
          }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ff6b35] rounded-full shadow-[0_0_8px_rgba(255,107,53,1)]" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ff6b35] rounded-full shadow-[0_0_8px_rgba(255,107,53,1)]" />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0a0a] border border-[var(--border-medium)] rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-2xl text-[var(--text-primary)] font-bold">Cue Point Editor</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{trackTitle} • {formatTime(trackDuration)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-[var(--surface-panel)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform Section */}
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-[#ff6b35] hover:bg-[#ff8555] flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-black" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                )}
              </button>
              <div>
                <div className="text-2xl font-mono text-[var(--text-primary)]">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  {formatTime(trackDuration - currentTime)} remaining
                </div>
              </div>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Zoom:</span>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                disabled={zoom <= 0.5}
                className="w-10 h-10 rounded-lg bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] flex items-center justify-center text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-mono text-[var(--text-primary)] w-12 text-center">
                {(zoom * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                disabled={zoom >= 3}
                className="w-10 h-10 rounded-lg bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] flex items-center justify-center text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Waveform */}
          <div className="bg-black rounded-lg p-6">
            <WaveformDisplay />
          </div>
        </div>

        {/* Cue Points List */}
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[var(--text-primary)] font-semibold">
              Cue Points ({cuePoints.length})
            </h3>
            <button
              onClick={addCuePoint}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Cue Point
            </button>
          </div>

          {/* Table */}
          <div className="bg-[var(--surface-panel)] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="text-left text-xs text-[var(--text-tertiary)] font-medium px-4 py-3 w-12">Color</th>
                  <th className="text-left text-xs text-[var(--text-tertiary)] font-medium px-4 py-3">Label</th>
                  <th className="text-left text-xs text-[var(--text-tertiary)] font-medium px-4 py-3 w-32">Time</th>
                  <th className="text-left text-xs text-[var(--text-tertiary)] font-medium px-4 py-3 w-24">Type</th>
                  <th className="text-right text-xs text-[var(--text-tertiary)] font-medium px-4 py-3 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {cuePoints.map((cue) => (
                    <motion.tr
                      key={cue.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-charcoal)] transition-colors"
                    >
                      {/* Color */}
                      <td className="px-4 py-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: getCueColor(cue.color) }}
                        />
                      </td>

                      {/* Label */}
                      <td className="px-4 py-3">
                        {editingId === cue.id ? (
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="w-full px-3 py-1.5 bg-[var(--surface-charcoal)] border border-[var(--border-medium)] rounded text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ff6b35]"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm text-[var(--text-primary)]">{cue.label}</span>
                        )}
                      </td>

                      {/* Time */}
                      <td className="px-4 py-3">
                        {editingId === cue.id ? (
                          <input
                            type="text"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            placeholder="MM:SS"
                            className="w-full px-3 py-1.5 bg-[var(--surface-charcoal)] border border-[var(--border-medium)] rounded text-[var(--text-primary)] text-sm font-mono focus:outline-none focus:border-[#ff6b35]"
                          />
                        ) : (
                          <span className="text-sm font-mono text-[var(--text-primary)]">
                            {formatTime(cue.time)}
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {cue.type === 'auto' ? (
                            <>
                              <Bot className="w-4 h-4 text-[var(--text-tertiary)]" />
                              <span className="text-xs text-[var(--text-tertiary)]">Auto</span>
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 text-[#ff6b35]" />
                              <span className="text-xs text-[#ff6b35]">Custom</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {editingId === cue.id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="px-3 py-1.5 bg-[#ff6b35] hover:bg-[#ff8555] rounded text-xs text-white font-medium transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1.5 bg-[var(--surface-charcoal)] hover:bg-[var(--surface-panel)] rounded text-xs text-[var(--text-secondary)] font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(cue)}
                                className="w-8 h-8 rounded hover:bg-[var(--surface-charcoal)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteCuePoint(cue.id)}
                                className="w-8 h-8 rounded hover:bg-[var(--surface-charcoal)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[#ff4444] transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Options */}
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <h3 className="text-lg text-[var(--text-primary)] font-semibold mb-4">Export Options</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExport('rekordbox')}
              className="flex items-center gap-2 px-4 py-3 bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] rounded-lg text-[var(--text-primary)] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export to Rekordbox</span>
            </button>
            <button
              onClick={() => handleExport('serato')}
              className="flex items-center gap-2 px-4 py-3 bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] rounded-lg text-[var(--text-primary)] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export to Serato</span>
            </button>
            <button
              onClick={() => handleExport('traktor')}
              className="flex items-center gap-2 px-4 py-3 bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] rounded-lg text-[var(--text-primary)] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export to Traktor</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[var(--surface-panel)] hover:bg-[var(--surface-charcoal)] rounded-lg text-[var(--text-secondary)] font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave?.(cuePoints);
              onClose?.();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
