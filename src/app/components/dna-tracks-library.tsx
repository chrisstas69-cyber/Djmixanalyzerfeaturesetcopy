"use client";
import React, { useState } from 'react';
import { Play, Download, Share2, Trash2, Heart, MoreVertical, RefreshCw, Music2 } from 'lucide-react';
import { toast } from 'sonner';

export const DNATracksLibrary = () => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [hoveredArtwork, setHoveredArtwork] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const tracks = [
    { 
      id: '1', 
      title: 'I Am The God (Extended Mix)', 
      artist: 'Barn Gold, Tempo Giusto', 
      bpm: 134, 
      key: 'Am', 
      duration: '7:12', 
      energy: 9, 
      date: 'Jan 10, 2026',
      label: 'Armada Music',
      releaseDate: '2024',
      genre: 'Progressive House',
      format: 'WAV',
      fileName: 'barn_gold_i_am_the_god.wav',
      status: 'Ready'
    },
    { 
      id: '2', 
      title: 'Great Spirit feat. Hilight Tribe (Extended Mix)', 
      artist: 'Armin van Buuren, Hilight Tribe', 
      bpm: 138, 
      key: 'C#', 
      duration: '6:58', 
      energy: 10, 
      date: 'Jan 5, 2026',
      label: 'Armada Music',
      releaseDate: '2023',
      genre: 'Trance',
      format: 'FLAC',
      fileName: 'armin_great_spirit.flac',
      status: 'Ready'
    },
    { 
      id: '3', 
      title: 'Se7en Seconds Until Thunder (Extended Mix)', 
      artist: 'Anake Knights', 
      bpm: 134, 
      key: 'Cm', 
      duration: '7:45', 
      energy: 8, 
      date: 'Dec 28, 2025',
      label: 'Beatport Exclusive',
      releaseDate: '2024',
      genre: 'Techno',
      format: 'MP3',
      fileName: 'anake_seven_seconds.mp3',
      status: 'Ready'
    },
  ];

  // Generate waveform data for mini waveform
  const generateWaveform = (trackId: string, count: number = 40): number[] => {
    const seed = trackId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const heights: number[] = [];
    for (let i = 0; i < count; i++) {
      const random = Math.sin(seed + i) * 10000;
      const normalized = (random - Math.floor(random));
      heights.push(20 + normalized * 60); // 20-80% range
    }
    return heights;
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handlePlay = (trackId: string) => {
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
    toast.info(playingTrackId === trackId ? "Paused" : "Playing");
  };

  return (
    <div style={{ padding: '32px', background: 'var(--bg-0)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '8px' }}>
          DNA Tracks Library
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-3)' }}>
          Your uploaded tracks with full metadata
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search tracks..."
          style={{
            flex: 1,
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'var(--text)',
            fontSize: 'var(--font-size-base)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--orange)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        />
        <button 
          style={{
            background: 'var(--cyan-2)',
            border: 'none',
            color: '#000',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'brightness(1)';
          }}
        >
          Upload DNA Tracks
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--panel)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 100px 60px 80px 300px 200px 150px 100px 100px 100px 80px 100px 120px 120px 120px 100px',
          padding: '16px 24px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'bold',
          color: 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          <div></div>
          <div>Status</div>
          <div>Art</div>
          <div>Waveform</div>
          <div>Title</div>
          <div>Artist</div>
          <div>Label</div>
          <div>Release</div>
          <div>Genre</div>
          <div>BPM</div>
          <div>Key</div>
          <div>Duration</div>
          <div>Format</div>
          <div>File Name</div>
          <div>Energy</div>
          <div>Actions</div>
        </div>

        {/* Table Rows */}
        {tracks.map((track) => {
          const waveformHeights = generateWaveform(track.id);
          const isPlaying = playingTrackId === track.id;
          
          return (
            <div
              key={track.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 100px 60px 80px 300px 200px 150px 100px 100px 100px 80px 100px 120px 120px 120px 100px',
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                alignItems: 'center',
                transition: 'background 0.2s',
                cursor: 'pointer',
                background: 'var(--panel)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--panel)';
              }}
            >
              {/* Checkbox */}
              <input 
                type="checkbox" 
                checked={selectedTracks.includes(track.id)}
                onChange={() => toggleTrackSelection(track.id)}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  cursor: 'pointer',
                  accentColor: 'var(--orange)',
                }} 
              />

              {/* Status Badge */}
              <div style={{
                display: 'inline-block',
                background: track.status === 'Ready' ? 'var(--cyan-2)' : 'var(--text-3)',
                color: '#000',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '4px 10px',
                borderRadius: '12px',
                textAlign: 'center',
                width: 'fit-content',
              }}>
                {track.status}
              </div>

              {/* Cover Art */}
              <div 
                className="relative group"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, var(--orange) 0%, var(--cyan) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#000',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredArtwork(track.id)}
                onMouseLeave={() => setHoveredArtwork(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info("Regenerating artwork...");
                }}
              >
                <Music2 size={24} />
                {hoveredArtwork === track.id && (
                  <div 
                    className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md transition-opacity"
                    style={{
                      opacity: hoveredArtwork === track.id ? 1 : 0,
                    }}
                  >
                    <RefreshCw size={20} style={{ color: 'var(--text)' }} />
                  </div>
                )}
              </div>

              {/* Mini Waveform */}
              <div 
                className="flex items-end gap-0.5 cursor-pointer"
                style={{ 
                  width: '80px', 
                  height: '40px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(track.id);
                }}
              >
                {waveformHeights.map((height, i) => (
                  <div
                    key={i}
                    style={{
                      width: '2px',
                      height: `${height}%`,
                      background: isPlaying
                        ? `linear-gradient(to top, var(--orange), var(--orange-2))`
                        : `linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.6))`,
                      borderRadius: '1px',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>

              {/* Title */}
              <div style={{
                color: 'var(--text)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '600',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {track.title}
              </div>

              {/* Artist */}
              <div style={{
                color: 'var(--text-2)',
                fontSize: 'var(--font-size-sm)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {track.artist}
              </div>

              {/* Original Label */}
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-2)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {track.label}
              </div>

              {/* Release Date */}
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-3)',
              }}>
                {track.releaseDate}
              </div>

              {/* Genre Tags */}
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    background: track.genre === 'Progressive House' ? 'var(--orange-2)' : 
                                 track.genre === 'Trance' ? 'var(--cyan-2)' : 
                                 'var(--orange-2)',
                    color: '#000',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {track.genre}
                </span>
              </div>

              {/* BPM */}
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'monospace',
                background: 'var(--cyan-2)',
                padding: '4px 8px',
                borderRadius: '12px',
                textAlign: 'center',
                width: 'fit-content',
              }}>
                {track.bpm}
              </div>

              {/* Key */}
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'bold',
                color: '#000',
                background: track.key.includes('m') || track.key.includes('#') ? 'var(--orange-2)' : 'var(--cyan-2)',
                padding: '4px 8px',
                borderRadius: '12px',
                textAlign: 'center',
                width: 'fit-content',
              }}>
                {track.key}
              </div>

              {/* Duration */}
              <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-2)',
                fontFamily: 'monospace'
              }}>
                {track.duration}
              </div>

              {/* File Format */}
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-2)',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {track.format}
                </span>
              </div>

              {/* Original File Name */}
              <div 
                style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-3)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={track.fileName}
              >
                {track.fileName.length > 15 ? `${track.fileName.substring(0, 15)}...` : track.fileName}
              </div>

              {/* Energy (Bars) */}
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '16px',
                      background: i < track.energy ? 'var(--cyan)' : 'var(--border)',
                      borderRadius: '2px',
                    }}
                  />
                ))}
              </div>

              {/* Actions */}
              <div 
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-2)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-2)';
                  }}
                  onClick={() => toast.info("Downloading track...")}
                >
                  <Download size={18} />
                </button>
                <button 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-2)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-2)';
                  }}
                  onClick={() => toast.info("Sharing track...")}
                >
                  <Share2 size={18} />
                </button>
                <button 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-2)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface)';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-2)';
                  }}
                  onClick={() => toast.info("Deleting track...")}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
