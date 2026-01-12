"use client";

import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Plus, Search, Zap, Volume2 } from 'lucide-react';

const sampleTracks = [
  { id: '1', title: 'I Am The God (Extended Mix)', artist: 'Ben Gold, Tempo Giusto', duration: '6:34', key: 'Am', mood: 'Energetic', bpm: 134, energy: 8 },
  { id: '2', title: 'Great Spirit feat. Hilight Tribe (Extended...)', artist: 'Armin van Buuren, Hilig...', duration: '7:37', key: 'Cm', mood: 'Uplifting', bpm: 138, energy: 9 },
  { id: '3', title: 'Se7en Seconds Until Thunder (Extended...)', artist: 'Anske Knights', duration: '7:16', key: 'Dm', mood: 'Dark', bpm: 134, energy: 7 },
  { id: '4', title: 'United feat. Ruben (Extended Mix)', artist: 'Armin van Buuren, Rube...', duration: '6:45', key: 'Em', mood: 'Progressive', bpm: 128, energy: 8 },
  { id: '5', title: 'Deep Resonance', artist: 'Underground Collective', duration: '8:12', key: 'Gm', mood: 'Deep', bpm: 124, energy: 6 },
  { id: '6', title: 'Industrial Echo', artist: 'Techno Warriors', duration: '6:58', key: 'Fm', mood: 'Aggressive', bpm: 135, energy: 9 },
  { id: '7', title: 'Progressive Journey', artist: 'Melodic Minds', duration: '7:45', key: 'Cm', mood: 'Melodic', bpm: 126, energy: 7 },
  { id: '8', title: 'Midnight Warehouse', artist: 'Berlin Underground', duration: '6:22', key: 'Am', mood: 'Dark', bpm: 132, energy: 8 },
  { id: '9', title: 'Solar Flare', artist: 'Cosmic DJs', duration: '5:58', key: 'Dm', mood: 'Euphoric', bpm: 140, energy: 10 },
  { id: '10', title: 'Subsonic Bass', artist: 'Low Frequency', duration: '7:03', key: 'Em', mood: 'Heavy', bpm: 130, energy: 7 },
];

const queueTracks = [
  { id: '1', title: 'I Am The God', artist: 'Ben Gold', bpm: 134 },
  { id: '2', title: 'Great Spirit', artist: 'Armin van Buuren', bpm: 138 },
  { id: '3', title: 'Se7en Seconds', artist: 'Anske Knights', bpm: 134 },
  { id: '4', title: 'United', artist: 'Armin van Buuren', bpm: 128 },
];

const deckTracks = [
  { title: 'I Am The God (Extended Mix)', artist: 'Ben Gold, Tempo Giusto' },
  { title: 'Great Spirit feat. Hilight Tribe', artist: 'Armin van Buuren' },
  { title: 'Se7en Seconds Until Thunder', artist: 'Anske Knights' },
];

function WaveformBars() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1px', height: '100%', padding: '0 8px' }}>
      {Array.from({ length: 150 }, (_, i) => {
        // Create more realistic waveform pattern
        const baseHeight = Math.sin(i * 0.15) * 20 + Math.random() * 25 + 35;
        return (
          <div
            key={i}
            style={{
              width: '2px',
              height: `${baseHeight}%`,
              background: 'linear-gradient(to top, #f5a623, #ff6b35)',
              borderRadius: '1px',
            }}
          />
        );
      })}
    </div>
  );
}

function DeckPanel({ deckNumber, track }: { deckNumber: number; track: { title: string; artist: string } }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: '56px',
      background: '#0d0d0d',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 12px',
      gap: '8px',
    }}>
      {/* Deck Label */}
      <div style={{ 
        width: '52px', 
        fontSize: '10px', 
        fontWeight: 600, 
        color: '#555', 
        letterSpacing: '0.5px',
        fontFamily: 'JetBrains Mono, monospace'
      }}>
        DECK {deckNumber}
      </div>
      
      {/* FX Button */}
      <button style={{
        width: '28px', 
        height: '28px', 
        background: '#1a1a1a', 
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '4px', 
        color: '#888', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        cursor: 'pointer'
      }}>
        <Volume2 size={14} />
      </button>
      
      {/* Transport Buttons */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {/* Sync button */}
        <button style={{
          width: '24px', 
          height: '24px', 
          background: '#1a1a1a', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px', 
          color: '#888', 
          fontSize: '9px', 
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          S
        </button>
        {/* Play */}
        <button style={{
          width: '24px', 
          height: '24px', 
          background: '#1a1a1a', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%', 
          color: '#888', 
          fontSize: '8px',
          cursor: 'pointer',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Play size={10} fill="#888" />
        </button>
        {/* Cue dots */}
        {[1, 2, 3, 4].map((i) => (
          <button key={i} style={{
            width: '24px', 
            height: '24px', 
            background: '#1a1a1a', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', 
            color: '#555', 
            fontSize: '8px',
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            ●
          </button>
        ))}
      </div>
      
      {/* Waveform Display */}
      <div style={{
        flex: 1, 
        height: '40px', 
        background: '#111', 
        borderRadius: '4px',
        position: 'relative', 
        overflow: 'hidden', 
        display: 'flex', 
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <WaveformBars />
        {/* Track info overlay */}
        <div style={{ 
          position: 'absolute', 
          right: '12px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          textAlign: 'right',
          background: 'linear-gradient(to right, transparent, rgba(17,17,17,0.9) 20%)',
          paddingLeft: '40px'
        }}>
          <span style={{ 
            display: 'block', 
            fontSize: '11px', 
            fontWeight: 500, 
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }}>
            {track.title}
          </span>
          <span style={{ 
            display: 'block', 
            fontSize: '10px', 
            color: '#888',
            whiteSpace: 'nowrap'
          }}>
            {track.artist}
          </span>
        </div>
      </div>
    </div>
  );
}

function EnergyDots({ level }: { level: number }) {
  return (
    <span style={{ fontSize: '6px', letterSpacing: '1px', display: 'inline-flex', gap: '1px' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} style={{ color: i < level ? '#00bcd4' : '#333' }}>●</span>
      ))}
    </span>
  );
}

function KeyBadge({ keyName }: { keyName: string }) {
  const colors: Record<string, string> = {
    'Am': '#00bcd4', 
    'Cm': '#e91e63', 
    'Dm': '#ff5722', 
    'Em': '#4caf50', 
    'Fm': '#9c27b0', 
    'Gm': '#ffc107'
  };
  const bg = colors[keyName] || '#00bcd4';
  const textColor = ['Gm'].includes(keyName) ? '#000' : '#fff';
  
  return (
    <span style={{
      display: 'inline-block', 
      padding: '2px 8px', 
      borderRadius: '4px',
      fontSize: '11px', 
      fontWeight: 500, 
      background: bg, 
      color: textColor,
      fontFamily: 'JetBrains Mono, monospace'
    }}>
      {keyName}
    </span>
  );
}

export default function AutoDJMixerFigma() {
  const [activeTab, setActiveTab] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#080808', 
      color: '#fff', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', 
      overflow: 'hidden'
    }}>
      {/* Timeline Ruler */}
      <div style={{
        height: '24px', 
        background: '#0a0a0a', 
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', 
        alignItems: 'center', 
        paddingLeft: '120px',
        flexShrink: 0
      }}>
        {Array.from({ length: 18 }, (_, i) => (
          <span 
            key={i} 
            style={{ 
              width: '50px', 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#555',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            {i}
          </span>
        ))}
      </div>

      {/* Decks */}
      <div style={{ flexShrink: 0 }}>
        {[1, 2, 3].map((num) => (
          <DeckPanel key={num} deckNumber={num} track={deckTracks[num - 1]} />
        ))}
      </div>

      {/* Mix Queue */}
      <div style={{ 
        padding: '12px 16px', 
        background: '#0a0a0a', 
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0
      }}>
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 600, 
              color: '#555', 
              letterSpacing: '1px',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              MIX QUEUE
            </span>
            <span style={{ 
              fontSize: '11px', 
              color: '#888',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {queueTracks.length} TRACKS
            </span>
          </div>
          
          {/* Transport Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button style={{ 
              width: '28px', 
              height: '28px', 
              background: '#1a1a1a', 
              border: 'none', 
              borderRadius: '50%', 
              color: '#888', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}>
              <SkipBack size={14} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(135deg, #ff6b35, #ffa500)', 
                border: 'none', 
                borderRadius: '50%', 
                color: '#000', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(255,107,53,0.4)',
                transition: 'all 0.2s'
              }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
            </button>
            <button style={{ 
              width: '28px', 
              height: '28px', 
              background: '#1a1a1a', 
              border: 'none', 
              borderRadius: '50%', 
              color: '#888', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}>
              <SkipForward size={14} />
            </button>
          </div>
          
          {/* Action Buttons */}
          <button 
            style={{ 
              padding: '6px 14px', 
              background: 'transparent', 
              border: '1px solid rgba(255,255,255,0.15)', 
              borderRadius: '6px', 
              color: '#fff', 
              fontSize: '12px', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ff6b35';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            Add tracks
          </button>
          <button style={{ 
            padding: '6px 14px', 
            background: 'linear-gradient(90deg, #ff6b35, #ff8c00)', 
            border: 'none', 
            borderRadius: '6px', 
            color: '#000', 
            fontSize: '12px', 
            fontWeight: 500, 
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(255,107,53,0.4)',
            transition: 'all 0.2s'
          }}>
            Automix
          </button>
        </div>
        
        {/* Queue Track Cards */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {queueTracks.map((track, index) => (
            <div key={track.id} style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '8px 12px',
              background: index === 0 ? 'rgba(255,107,53,0.1)' : '#111', 
              border: index === 0 ? '1px solid rgba(255,107,53,0.3)' : '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '6px', 
              minWidth: '180px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              {/* Album Art Placeholder */}
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '4px', 
                background: 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#fff', 
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {track.title}
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {track.artist}
                </span>
              </div>
              <span style={{ 
                fontSize: '11px', 
                color: '#00bcd4', 
                background: 'rgba(0,188,212,0.15)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 500,
                flexShrink: 0
              }}>
                {track.bpm}
              </span>
            </div>
          ))}
          {/* Add Track Button */}
          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '60px', 
            minWidth: '60px', 
            height: '56px',
            background: '#111', 
            border: '1px dashed rgba(255,255,255,0.15)',
            borderRadius: '6px', 
            color: '#555', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <Plus size={20} />
          </div>
        </div>
      </div>

      {/* Track Browser */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {/* Tabs & Search */}
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '8px 16px', 
          background: '#0a0a0a', 
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'all', label: 'ALL' },
              { key: 'dna', label: 'DNA TRACKS' },
              { key: 'generated', label: 'GENERATED' },
              { key: 'uploaded', label: 'UPLOADED' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '6px 12px', 
                  background: activeTab === tab.key ? 'linear-gradient(90deg, #ff6b35, #ff8c00)' : 'transparent',
                  border: 'none', 
                  borderRadius: '4px', 
                  color: activeTab === tab.key ? '#000' : '#888',
                  fontSize: '11px', 
                  fontWeight: 500, 
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Search Input */}
          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 12px',
            background: '#111', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '6px'
          }}>
            <Search size={14} color="#555" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks..."
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#fff', 
                fontSize: '12px', 
                outline: 'none', 
                width: '150px'
              }}
            />
          </div>
        </div>
        
        {/* Track Table */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '1200px' }}>
            <thead>
              <tr style={{ background: '#0d0d0d' }}>
                {['#', '', 'ART', 'TITLE', 'ARTIST', 'TIME', 'KEY', 'MOOD', 'TRANSITION', 'BASS', 'FILTER', 'EFFECT', 'BPM', 'ENERGY'].map((col, i) => (
                  <th key={col + i} style={{
                    textAlign: 'left', 
                    padding: '10px 8px', 
                    color: '#555', 
                    fontWeight: 500,
                    fontSize: '10px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)', 
                    position: 'sticky', 
                    top: 0, 
                    background: '#0d0d0d',
                    fontFamily: 'JetBrains Mono, monospace',
                    whiteSpace: 'nowrap'
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleTracks.map((track, index) => (
                <tr 
                  key={track.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Row Number */}
                  <td style={{ 
                    padding: '8px', 
                    color: '#555', 
                    width: '40px',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {index + 1}
                  </td>
                  
                  {/* Play Button */}
                  <td style={{ padding: '8px', width: '32px' }}>
                    <button style={{
                      width: '24px', 
                      height: '24px', 
                      background: 'transparent', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50%', 
                      color: '#888', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      <Play size={10} />
                    </button>
                  </td>
                  
                  {/* Album Art */}
                  <td style={{ padding: '8px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '4px', 
                      background: 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)' 
                    }} />
                  </td>
                  
                  {/* Title */}
                  <td style={{ 
                    padding: '8px', 
                    color: '#fff', 
                    fontWeight: 500, 
                    maxWidth: '220px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {track.title}
                  </td>
                  
                  {/* Artist */}
                  <td style={{ 
                    padding: '8px', 
                    color: '#888', 
                    maxWidth: '150px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {track.artist}
                  </td>
                  
                  {/* Duration */}
                  <td style={{ 
                    padding: '8px', 
                    color: '#888',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px'
                  }}>
                    {track.duration}
                  </td>
                  
                  {/* Key Badge */}
                  <td style={{ padding: '8px' }}>
                    <KeyBadge keyName={track.key} />
                  </td>
                  
                  {/* Mood */}
                  <td style={{ padding: '8px', color: '#888' }}>{track.mood}</td>
                  
                  {/* Transition */}
                  <td style={{ padding: '8px', color: '#888' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={12} color="#00bcd4" />
                      Auto
                    </span>
                  </td>
                  
                  {/* Bass */}
                  <td style={{ padding: '8px', color: '#555', fontSize: '11px' }}>BW 0</td>
                  
                  {/* Filter */}
                  <td style={{ padding: '8px', color: '#555' }}>-</td>
                  
                  {/* Effect */}
                  <td style={{ padding: '8px', color: '#555' }}>-</td>
                  
                  {/* BPM */}
                  <td style={{ 
                    padding: '8px', 
                    color: '#00bcd4', 
                    fontWeight: 500,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {track.bpm}
                  </td>
                  
                  {/* Energy Dots */}
                  <td style={{ padding: '8px' }}>
                    <EnergyDots level={track.energy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

