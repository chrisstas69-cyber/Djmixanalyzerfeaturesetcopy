"use client";
import React, { useState } from 'react';
import { Play, Download, Share2, Trash2, Heart, MoreVertical, RefreshCw, Music2 } from 'lucide-react';
import { toast } from 'sonner';

export const GeneratedTracksLibrary = () => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [hoveredArtwork, setHoveredArtwork] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const tracks = [
    { id: '1', title: 'Untitled Track', artist: 'Unknown Artist', bpm: 126, key: 'Am', duration: '6:42', energy: 8, date: '2 days ago', status: 'Ready' },
    { id: '2', title: 'Hypnotic Groove', artist: 'Underground Mix', bpm: 124, key: 'Fm', duration: '7:28', energy: 9, date: '3 days ago', status: 'Ready' },
    { id: '3', title: 'Warehouse Nights', artist: 'Berlin Basement', bpm: 128, key: 'Gm', duration: '6:38', energy: 7, date: '5 days ago', status: 'Ready' },
    { id: '4', title: 'Deep House Vibes', artist: 'Soulful Sessions', bpm: 122, key: 'Cm', duration: '5:58', energy: 6, date: '1 week ago', status: 'Ready' },
    { id: '5', title: 'Rolling Bassline', artist: 'Low Frequency', bpm: 127, key: 'Dm', duration: '6:39', energy: 8, date: '1 week ago', status: 'Ready' },
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
          Generated Tracks Library
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-3)' }}>
          63 tracks
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
            background: 'var(--orange-2)',
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
          Upload Audio
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
          gridTemplateColumns: '50px 100px 60px 80px 300px 200px 100px 80px 100px 120px 120px 100px',
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
          <div>BPM</div>
          <div>Key</div>
          <div>Duration</div>
          <div>Energy</div>
          <div>Date</div>
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
                gridTemplateColumns: '50px 100px 60px 80px 300px 200px 100px 80px 100px 120px 120px 100px',
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

              {/* Title (Editable) */}
              <input
                type="text"
                defaultValue={track.title}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: track.title === 'Untitled Track' ? 'var(--orange-2)' : 'var(--text)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'text',
                  width: '100%',
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.border = '1px solid var(--orange)';
                  e.currentTarget.style.borderRadius = '4px';
                  e.currentTarget.style.padding = '4px 8px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.border = 'none';
                  e.currentTarget.style.padding = '0';
                }}
              />

              {/* Artist (Editable) */}
              <input
                type="text"
                defaultValue={track.artist}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-2)',
                  fontSize: 'var(--font-size-sm)',
                  outline: 'none',
                  cursor: 'text',
                  width: '100%',
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.border = '1px solid var(--orange)';
                  e.currentTarget.style.borderRadius = '4px';
                  e.currentTarget.style.padding = '4px 8px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.border = 'none';
                  e.currentTarget.style.padding = '0';
                }}
              />

              {/* BPM */}
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'bold',
                color: 'var(--cyan)',
                fontFamily: 'monospace',
                background: 'var(--cyan-2)',
                color: '#000',
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

              {/* Date */}
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-3)' }}>
                {track.date}
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
