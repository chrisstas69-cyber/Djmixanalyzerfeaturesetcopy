import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Music, Check, Loader2, X, Eye, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { parseBlob } from 'music-metadata-browser';

interface MusicDNAUploadProps {
  onBack: () => void;
  onViewProfile: () => void;
}

type TrackStatus = 'uploading' | 'analyzing' | 'ready' | 'error';
type TrainingState = 'idle' | 'ready' | 'training' | 'complete';

interface UploadedTrack {
  id: string;
  name: string;
  size: string;
  status: TrackStatus;
  progress?: number;
  file?: File;
  metadata?: {
    title: string;
    artist: string;
    bpm: number;
    key?: string;
    genre?: string;
    duration: number;
    bitrate: number;
    sampleRate: number;
  };
}

export function MusicDNAUpload({ onBack, onViewProfile }: MusicDNAUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [trainingState, setTrainingState] = useState<TrainingState>('idle');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(10);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const processFiles = async (files: File[]) => {
    // Filter for audio files
    const audioFiles = files.filter(file => 
      file.type.startsWith('audio/') || 
      file.name.match(/\.(mp3|wav|flac|m4a|aac|ogg)$/i)
    );

    if (audioFiles.length === 0) {
      alert('Please upload audio files (MP3, WAV, FLAC, etc.)');
      return;
    }

    // Check total track limit
    if (tracks.length + audioFiles.length > 100) {
      alert(`You can only upload up to 100 tracks. You have ${tracks.length} tracks already.`);
      return;
    }

    // Set uploading state
    setIsUploading(true);
    setUploadProgress({ current: 0, total: audioFiles.length });

    // Add tracks with "uploading" status
    const newTracks: UploadedTrack[] = audioFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      status: 'uploading' as TrackStatus,
      progress: 0,
      file
    }));

    setTracks(prev => [...prev, ...newTracks]);

    // Process each file
    for (let i = 0; i < newTracks.length; i++) {
      setUploadProgress({ current: i + 1, total: audioFiles.length });
      await uploadAndAnalyzeTrack(newTracks[i]);
    }

    // Upload complete
    setIsUploading(false);
    setUploadProgress({ current: 0, total: 0 });
  };

  const uploadAndAnalyzeTrack = async (track: UploadedTrack & { file?: File }) => {
    if (!track.file) return;

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, progress: i } : t
        ));
      }

      // Change to analyzing status
      setTracks(prev => prev.map(t => 
        t.id === track.id ? { ...t, status: 'analyzing' as TrackStatus, progress: 0 } : t
      ));

      // Extract metadata
      const metadata = await parseBlob(track.file);
      
      // Simulate analysis progress
      for (let i = 0; i <= 100; i += 25) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, progress: i } : t
        ));
      }

      // Mark as ready with metadata
      setTracks(prev => prev.map(t => 
        t.id === track.id ? { 
          ...t, 
          status: 'ready' as TrackStatus, 
          metadata: {
            title: metadata.common.title || track.name,
            artist: metadata.common.artist,
            bpm: metadata.common.bpm,
            key: metadata.common.key,
            genre: metadata.common.genre,
            duration: metadata.format.duration,
            bitrate: metadata.format.bitrate,
            sampleRate: metadata.format.sampleRate
          }
        } : t
      ));
    } catch (error) {
      console.error('Error processing file:', error);
      setTracks(prev => prev.map(t => 
        t.id === track.id ? { ...t, status: 'error' as TrackStatus } : t
      ));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleRemoveTrack = (trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const getStatusDisplay = (track: UploadedTrack) => {
    switch (track.status) {
      case 'uploading':
        return (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-[var(--accent-amber)] animate-spin" />
            <span className="text-sm text-[var(--text-tertiary)]">
              Uploading {track.progress}%
            </span>
          </div>
        );
      case 'analyzing':
        return (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-[var(--accent-amber)] animate-spin" />
            <span className="text-sm text-[var(--text-tertiary)]">
              Analyzing {track.progress}%
            </span>
          </div>
        );
      case 'ready':
        return (
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[var(--success-green)]" />
            <span className="text-sm text-[var(--text-secondary)]">Ready</span>
          </div>
        );
      case 'error':
        return (
          <span className="text-sm text-[var(--warning-red)]">Failed</span>
        );
    }
  };

  const readyCount = tracks.filter(t => t.status === 'ready').length;
  const canViewProfile = readyCount >= 3;

  const handleStartTraining = async () => {
    setTrainingState('training');
    setTrainingProgress(0);
    setEstimatedTimeRemaining(10);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const newProgress = prev + 2;
        
        // Update estimated time
        setEstimatedTimeRemaining(Math.max(0, Math.ceil((100 - newProgress) / 10)));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTrainingState('complete');
        }
        
        return Math.min(newProgress, 100);
      });
    }, 100);
  };

  const handleCancelUpload = () => {
    // Cancel ongoing uploads
    setTracks(prev => prev.filter(t => t.status === 'ready' || t.status === 'error'));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-charcoal)]">
        <div className="max-w-5xl mx-auto p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[var(--text-primary)] mb-2">My Music DNA</h1>
              <p className="text-[var(--text-secondary)]">
                {readyCount} of {tracks.length} tracks analyzed • {100 - tracks.length} slots remaining
              </p>
            </div>
            {canViewProfile && (
              <Button 
                variant="secondary" 
                onClick={onViewProfile}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-colors
              ${isDragging 
                ? 'border-[var(--accent-amber)] bg-[var(--accent-amber)]/5' 
                : 'border-[var(--border-subtle)] bg-[var(--surface-charcoal)] hover:border-[var(--accent-amber)]/50'
              }
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-panel)] flex items-center justify-center">
                <Upload className="w-8 h-8 text-[var(--text-tertiary)]" />
              </div>
              <div>
                <p className="text-[var(--text-primary)] mb-1">
                  Drag and drop audio files here
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  or <button onClick={handleBrowseClick} className="text-[var(--accent-amber)] hover:text-[var(--accent-amber-hover)]">browse files</button>
                </p>
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">
                Supports WAV, MP3, FLAC • Max 100 tracks
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*,.mp3,.wav,.flac,.m4a,.aac,.ogg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Upload Progress Indicator */}
          {isUploading && uploadProgress.total > 0 && (
            <div className="p-5 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-[var(--accent-amber)] animate-spin" />
                  <span className="text-[var(--text-primary)]">
                    Uploading {uploadProgress.current} of {uploadProgress.total} tracks...
                  </span>
                </div>
                <button
                  onClick={handleCancelUpload}
                  className="px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--warning-red)] transition-colors"
                >
                  Cancel
                </button>
              </div>
              <div className="h-2 bg-[var(--surface-panel)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-amber)] transition-all duration-300"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Track List */}
          {tracks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[var(--text-primary)]">Uploaded Tracks</h2>
                <span className="text-sm text-[var(--text-tertiary)]">
                  {readyCount} / {tracks.length} tracks uploaded
                </span>
              </div>

              <div className="space-y-2">
                {tracks.map(track => (
                  <div
                    key={track.id}
                    className="p-4 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Track Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[var(--surface-panel)] flex items-center justify-center flex-shrink-0">
                          <Music className="w-5 h-5 text-[var(--text-tertiary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] truncate mb-1">
                            {track.name}
                          </p>
                          {track.status === 'ready' && track.metadata ? (
                            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                              {track.metadata.bpm && (
                                <span className="px-2 py-0.5 bg-[var(--surface-panel)] rounded">
                                  {Math.round(track.metadata.bpm)} BPM
                                </span>
                              )}
                              {track.metadata.key && (
                                <span className="px-2 py-0.5 bg-[var(--surface-panel)] rounded">
                                  {track.metadata.key}
                                </span>
                              )}
                              {track.metadata.genre && track.metadata.genre[0] && (
                                <span className="px-2 py-0.5 bg-[var(--surface-panel)] rounded">
                                  {track.metadata.genre[0]}
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-[var(--text-tertiary)]">
                              {track.size}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-3">
                        {getStatusDisplay(track)}
                        {track.status === 'ready' && (
                          <button
                            onClick={() => handleRemoveTrack(track.id)}
                            className="text-[var(--text-tertiary)] hover:text-[var(--warning-red)] transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(track.status === 'uploading' || track.status === 'analyzing') && (
                      <div className="mt-3 h-1 bg-[var(--surface-panel)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent-amber)] transition-all duration-300"
                          style={{ width: `${track.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          {!canViewProfile && tracks.length > 0 && (
            <div className="p-5 bg-[var(--surface-panel)] border border-[var(--border-subtle)] rounded-xl">
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--accent-amber)]">Tip:</span> Upload at least 3 tracks 
                to generate your Music DNA profile. More tracks provide more accurate personalization.
              </p>
            </div>
          )}

          {/* Training States */}
          {canViewProfile && trainingState === 'idle' && (
            <div className="p-6 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl text-center">
              <p className="text-[var(--text-primary)] mb-4">
                {readyCount} tracks uploaded. Ready to train your DNA!
              </p>
              <Button variant="primary" onClick={handleStartTraining}>
                Start Training
              </Button>
            </div>
          )}

          {trainingState === 'training' && (
            <div className="p-6 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 text-[var(--accent-amber)] animate-spin" />
                <p className="text-[var(--text-primary)]">
                  Training your DNA... This may take 5-10 minutes
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="h-2 bg-[var(--surface-panel)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-amber)] transition-all duration-300"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
              </div>
              
              <p className="text-sm text-[var(--text-tertiary)] text-center">
                ~{estimatedTimeRemaining} minutes left
              </p>
            </div>
          )}

          {trainingState === 'complete' && (
            <div className="p-6 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-xl text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-[var(--success-green)]" />
                <p className="text-[var(--text-primary)]">
                  Training complete! Your DNA is ready to use.
                </p>
              </div>
              <Button variant="primary" onClick={onBack}>
                Go to Generator
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}