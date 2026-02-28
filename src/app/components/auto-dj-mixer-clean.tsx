import React, { useEffect, useState, useRef } from 'react';
import { X, Music, Play, Pause, RefreshCw } from 'lucide-react';
import TrackPickerModal from './track-picker-modal';
import UnifiedMixingWaveform from './unified-mixing-waveform';
import ChannelStrip from './channel-strip';
import TransportControls from './transport-controls';
import { useTrackStore } from '../../lib/store/trackStore';

export default function AutoDJMixerClean() {
  const {
    selectedPool,
    deckA,
    deckB,
    crossfader,
    loadTrackToDeck,
    setDeckPlaying,
    setDeckTime,
    setDeckVolume,
    setDeckEQ,
    setDeckGain,
    setDeckFilter,
    setDeckPitch,
    setDeckLoop,
    setCrossfader,
    addCuePoint,
    removeFromPool
  } = useTrackStore();

  const [showTrackPicker, setShowTrackPicker] = React.useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [isMixing, setIsMixing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Auto-load first 2 tracks
  useEffect(() => {
    if (selectedPool.length > 0 && !deckA.track) {
      loadTrackToDeck(selectedPool[0], 'A');
    }
    if (selectedPool.length > 1 && !deckB.track) {
      loadTrackToDeck(selectedPool[1], 'B');
    }
  }, [selectedPool, deckA.track, deckB.track, loadTrackToDeck]);

  // Playback simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (deckA.isPlaying && deckA.track) {
        const newTime = deckA.currentTime + 0.1;
        
        // Handle loop
        if (deckA.loopEnabled && deckA.loopStart !== null && deckA.loopEnd !== null) {
          if (newTime >= deckA.loopEnd) {
            setDeckTime('A', deckA.loopStart);
          } else {
            setDeckTime('A', Math.min(newTime, deckA.track.duration));
          }
        } else if (newTime >= deckA.track.duration) {
          setDeckPlaying('A', false);
          setDeckTime('A', 0);
        } else {
          setDeckTime('A', newTime);
        }
      }

      if (deckB.isPlaying && deckB.track) {
        const newTime = deckB.currentTime + 0.1;
        
        if (deckB.loopEnabled && deckB.loopStart !== null && deckB.loopEnd !== null) {
          if (newTime >= deckB.loopEnd) {
            setDeckTime('B', deckB.loopStart);
          } else {
            setDeckTime('B', Math.min(newTime, deckB.track.duration));
          }
        } else if (newTime >= deckB.track.duration) {
          setDeckPlaying('B', false);
          setDeckTime('B', 0);
        } else {
          setDeckTime('B', newTime);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [deckA.isPlaying, deckA.currentTime, deckA.loopEnabled, deckA.loopStart, deckA.loopEnd, deckA.track, deckB.isPlaying, deckB.currentTime, deckB.loopEnabled, deckB.loopStart, deckB.loopEnd, deckB.track, setDeckTime, setDeckPlaying]);

  const getGenreColor = (genre?: string): string => {
    const colors: Record<string, string> = {
      'Tech House': 'bg-orange-500',
      'Melodic Techno': 'bg-cyan-500',
      'Deep House': 'bg-blue-500',
      'Progressive House': 'bg-purple-500',
      'Techno': 'bg-red-500',
      'House': 'bg-green-500',
      'Afro House': 'bg-yellow-500'
    };
    return colors[genre || ''] || 'bg-gray-500';
  };

  const TrackRow = ({ index }: { index: number }) => {
    const track = selectedPool[index];
    
    return (
      <div className="px-2 py-1">
        <div
          className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-cyan-500/50 transition-all group cursor-pointer"
          onClick={() => {
            if (!deckA.track) loadTrackToDeck(track, 'A');
            else if (!deckB.track) loadTrackToDeck(track, 'B');
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-mono">{index + 1}</span>
                <h3 className="text-white font-semibold text-sm truncate">
                  {track.title}
                </h3>
              </div>
              <p className="text-gray-400 text-xs truncate mb-2">{track.artist}</p>
              <div className="flex gap-1.5 flex-wrap">
                {track.key && (
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    {track.key}
                  </span>
                )}
                {track.genre && (
                  <span className={`${getGenreColor(track.genre)} px-2 py-0.5 rounded-full text-[10px] text-white font-semibold`}>
                    {track.genre}
                  </span>
                )}
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                  {track.bpm}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromPool(track.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Calculate crossfader blend
  const deckAOpacity = crossfader <= 0 ? 1 : Math.max(0.3, 1 - crossfader);
  const deckBOpacity = crossfader >= 0 ? 1 : Math.max(0.3, 1 + crossfader);

  // Calculate BPM difference for sync indicator
  const deckABPM = deckA.track ? Math.round(deckA.track.bpm * (1 + deckA.pitch / 100)) : null;
  const deckBBPM = deckB.track ? Math.round(deckB.track.bpm * (1 + deckB.pitch / 100)) : null;
  const bpmDifference = deckABPM && deckBBPM ? Math.abs(deckABPM - deckBBPM) : null;
  const syncStatus = bpmDifference !== null
    ? bpmDifference <= 2 ? 'sync' // Green
    : bpmDifference <= 5 ? 'warning' // Yellow
    : 'out' // Red
    : null;

  // Auto-sync function
  const handleAutoSync = () => {
    if (!deckA.track || !deckB.track) return;
    
    const targetBPM = deckABPM || 0;
    const currentBPM = deckBBPM || 0;
    
    if (targetBPM === 0 || currentBPM === 0) return;
    
    // Calculate required pitch adjustment for Deck B to match Deck A
    const requiredPitch = ((targetBPM - deckB.track.bpm) / deckB.track.bpm) * 100;
    setDeckPitch('B', requiredPitch);
    
    setAutoSyncEnabled(true);
    setTimeout(() => setAutoSyncEnabled(false), 2000);
  };

  // Refs for mixing animation
  const mixingRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Automatic mixing simulation (fader movement)
  useEffect(() => {
    if (!isMixing || (!deckA.track || !deckB.track)) {
      // Stop animation
      if (mixingRef.current) {
        cancelAnimationFrame(mixingRef.current);
        mixingRef.current = null;
      }
      return;
    }
    
    // Reset start time when mixing begins
    startTimeRef.current = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000; // seconds
      
      // Create smooth mixing pattern: every 12 seconds, smoothly mix between decks
      // Using sine wave for smooth transitions
      const mixCycle = Math.sin((elapsed / 12) * Math.PI * 2); // 12 second cycle
      
      // Map sin wave (-1 to 1) to crossfader (-1 to 1) with smooth transition
      const newCrossfader = mixCycle;
      
      // Update crossfader
      setCrossfader(newCrossfader);
      
      // Simultaneously adjust volumes for smoother mixing
      // When crossfader moves to A (negative), deck A louder
      // When crossfader moves to B (positive), deck B louder
      const aVolume = newCrossfader <= 0 
        ? 0.8 
        : Math.max(0.35, 0.8 - (newCrossfader * 0.45));
      const bVolume = newCrossfader >= 0 
        ? 0.8 
        : Math.max(0.35, 0.8 + (newCrossfader * 0.45));
      
      setDeckVolume('A', aVolume);
      setDeckVolume('B', bVolume);
      
      // Subtle EQ adjustments during mix for more realistic feel
      const eqVariation = Math.sin(elapsed * 3) * 0.03; // Small variation
      setDeckEQ('A', 'low', Math.max(0.3, Math.min(0.7, 0.5 + eqVariation)));
      setDeckEQ('B', 'low', Math.max(0.3, Math.min(0.7, 0.5 - eqVariation)));
      
      // Continue animation if still mixing
      if (isMixing && deckA.track && deckB.track) {
        mixingRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    mixingRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (mixingRef.current) {
        cancelAnimationFrame(mixingRef.current);
        mixingRef.current = null;
      }
    };
  }, [isMixing, deckA.track, deckB.track, setCrossfader, setDeckVolume, setDeckEQ]);

  // Auto-start mixing when both decks are playing
  useEffect(() => {
    if (deckA.isPlaying && deckB.isPlaying && deckA.track && deckB.track) {
      setIsMixing(true);
    } else {
      setIsMixing(false);
    }
  }, [deckA.isPlaying, deckB.isPlaying, deckA.track, deckB.track]);

  return (
    <div 
      className="h-full min-h-0 bg-gradient-to-br from-[#0a0f1e] via-[#0f1729] to-[#0a0f1e] flex overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    >
      {/* Main Mixer Area */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Auto DJ Mixer</h1>
            <p className="text-gray-400 text-sm">Professional DAW Mixer & AI Track Generation</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTrackPicker(true)}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/25"
            >
              + ADD TRACKS
            </button>
          </div>
        </div>

        {/* Unified Waveform */}
        <div className="mb-6">
          <UnifiedMixingWaveform
            deckATrack={deckA.track}
            deckBTrack={deckB.track}
            deckATime={deckA.currentTime}
            deckBTime={deckB.currentTime}
            deckAPlaying={deckA.isPlaying}
            deckBPlaying={deckB.isPlaying}
            crossfaderPosition={crossfader}
            onSeekA={(time) => setDeckTime('A', time)}
            onSeekB={(time) => setDeckTime('B', time)}
          />
        </div>

        {/* Mixer Section */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
          {/* Deck A Controls */}
          <div className="grid grid-cols-2 gap-4">
            <ChannelStrip
              deck="A"
              volume={deckA.volume}
              eqHigh={deckA.eqHigh}
              eqMid={deckA.eqMid}
              eqLow={deckA.eqLow}
              gain={deckA.gain}
              filter={deckA.filter}
              onVolumeChange={(v) => setDeckVolume('A', v)}
              onEQChange={(band, v) => setDeckEQ('A', band, v)}
              onGainChange={(v) => setDeckGain('A', v)}
              onFilterChange={(v) => setDeckFilter('A', v)}
              color="#f97316"
            />
            <TransportControls
              deck="A"
              isPlaying={deckA.isPlaying}
              pitch={deckA.pitch}
              loopEnabled={deckA.loopEnabled}
              hasCuePoints={!!deckA.track?.cuePoints?.length}
              onPlayPause={() => setDeckPlaying('A', !deckA.isPlaying)}
              onPitchChange={(p) => setDeckPitch('A', p)}
              onLoopToggle={() => {
                if (!deckA.loopEnabled && deckA.track) {
                  const start = deckA.currentTime;
                  const end = Math.min(start + 16, deckA.track.duration);
                  setDeckLoop('A', true, start, end);
                } else {
                  setDeckLoop('A', false);
                }
              }}
              onPrevCue={() => {
                const cues = deckA.track?.cuePoints || [];
                const prev = cues.filter(c => c < deckA.currentTime).pop();
                if (prev !== undefined) setDeckTime('A', prev);
              }}
              onNextCue={() => {
                const cues = deckA.track?.cuePoints || [];
                const next = cues.find(c => c > deckA.currentTime);
                if (next !== undefined) setDeckTime('A', next);
              }}
              color="#f97316"
            />
          </div>

          {/* Center Crossfader */}
          <div className="w-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-cyan-500/30 p-8 backdrop-blur-sm">
            <style>{`
              @keyframes recPulse {
                from { box-shadow: 0 0 12px rgba(255,0,0,0.6), 0 0 24px rgba(255,0,0,0.2); }
                to   { box-shadow: 0 0 28px rgba(255,0,0,1), 0 0 48px rgba(255,0,0,0.5); }
              }
            `}</style>
            <div className="text-center mb-6 flex items-center justify-center gap-2">
              {isRecording && (
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" aria-hidden />
              )}
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                CROSSFADER
              </span>
            </div>

            {/* BPM Circles with Play Buttons */}
            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Deck A BPM Circle */}
              <div className="relative flex flex-col items-center gap-2">
                <div 
                  className="w-24 h-24 rounded-full border-4 border-orange-500 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-transparent shadow-2xl cursor-pointer hover:scale-105 transition-transform"
                  style={{ 
                    boxShadow: deckA.isPlaying ? '0 0 30px rgba(251, 146, 60, 0.5)' : 'none',
                    opacity: deckAOpacity,
                    transition: 'opacity 0.3s, box-shadow 0.3s, transform 0.2s'
                  }}
                  onClick={() => setDeckPlaying('A', !deckA.isPlaying)}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 font-mono leading-none">
                      {deckABPM || '--'}
                    </div>
                  </div>
                </div>
                {/* Play Button */}
                <button
                  onClick={() => setDeckPlaying('A', !deckA.isPlaying)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    deckA.isPlaying 
                      ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/50' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {deckA.isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
              </div>

              {/* Sync Indicator */}
              {syncStatus && (
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      syncStatus === 'sync' 
                        ? 'bg-green-500/20 border-green-500' 
                        : syncStatus === 'warning'
                        ? 'bg-yellow-500/20 border-yellow-500'
                        : 'bg-red-500/20 border-red-500'
                    }`}
                    title={
                      syncStatus === 'sync' 
                        ? `BPMs are synced (${bpmDifference} BPM difference)`
                        : syncStatus === 'warning'
                        ? `BPMs are close (${bpmDifference} BPM difference)`
                        : `BPMs are out of sync (${bpmDifference} BPM difference)`
                    }
                  >
                    {syncStatus === 'sync' ? (
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                    ) : syncStatus === 'warning' ? (
                      <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  {bpmDifference !== null && (
                    <span className={`text-xs font-mono font-bold ${
                      syncStatus === 'sync' ? 'text-green-400' 
                      : syncStatus === 'warning' ? 'text-yellow-400' 
                      : 'text-red-400'
                    }`}>
                      {bpmDifference} BPM
                    </span>
                  )}
                </div>
              )}

              {/* Deck B BPM Circle */}
              <div className="relative flex flex-col items-center gap-2">
                <div 
                  className="w-24 h-24 rounded-full border-4 border-cyan-500 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-transparent shadow-2xl cursor-pointer hover:scale-105 transition-transform"
                  style={{ 
                    boxShadow: deckB.isPlaying ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none',
                    opacity: deckBOpacity,
                    transition: 'opacity 0.3s, box-shadow 0.3s, transform 0.2s'
                  }}
                  onClick={() => setDeckPlaying('B', !deckB.isPlaying)}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 font-mono leading-none">
                      {deckBBPM || '--'}
                    </div>
                  </div>
                </div>
                {/* Play Button */}
                <button
                  onClick={() => setDeckPlaying('B', !deckB.isPlaying)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    deckB.isPlaying 
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/50' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {deckB.isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Crossfader Slider */}
            <div className="space-y-4">
              <input
                type="range"
                min="-100"
                max="100"
                value={crossfader * 100}
                onChange={(e) => setCrossfader(parseFloat(e.target.value) / 100)}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #374151 50%, #06b6d4 100%)`
                }}
              />
              
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>A</span>
                <span>CENTER</span>
                <span>B</span>
              </div>

              {/* Auto-Sync Button */}
              <button
                onClick={handleAutoSync}
                disabled={!deckA.track || !deckB.track || bpmDifference === 0}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  autoSyncEnabled
                    ? 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/50'
                    : syncStatus === 'sync'
                    ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400'
                    : syncStatus === 'warning'
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 text-gray-400'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
                title={
                  !deckA.track || !deckB.track
                    ? 'Load tracks to both decks'
                    : bpmDifference === 0
                    ? 'Tracks are already synced'
                    : `Sync Deck B to Deck A (${bpmDifference} BPM difference)`
                }
              >
                <RefreshCw 
                  className={`w-4 h-4 ${autoSyncEnabled ? 'animate-spin' : ''}`} 
                />
                AUTO SYNC
              </button>

              {/* REC button - Gemini-style hardware, centered in black section */}
              <div className="flex justify-center w-full" style={{ marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (isRecording) {
                      setIsRecording(false);
                      console.log('Mix recording saved');
                    } else {
                      setIsRecording(true);
                    }
                  }}
                  className="flex flex-col items-center cursor-pointer border-0 p-0 bg-transparent select-none"
                >
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #555, #1a1a1a, #000)',
                      boxShadow: '0 0 0 3px #333, 0 4px 20px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.08)',
                      position: 'relative',
                    }}
                  >
                    <span
                      className="rounded-full block"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: isRecording
                          ? 'radial-gradient(circle at 35% 35%, #ff8888, #ff0000, #aa0000)'
                          : 'radial-gradient(circle at 35% 35%, #ff6666, #cc0000, #880000)',
                        boxShadow: isRecording ? '0 0 12px rgba(255,0,0,0.6)' : '0 2px 8px rgba(200,0,0,0.5)',
                        ...(isRecording ? { animation: 'recPulse 1s ease-in-out infinite alternate' } : {}),
                      }}
                    />
                  </span>
                  <span
                    className="text-center text-white font-extrabold transition-colors duration-200"
                    style={{
                      background: isRecording ? '#ff0000' : '#cc0000',
                      fontSize: 13,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      padding: '6px 20px',
                      borderRadius: '0 0 8px 8px',
                      marginTop: -4,
                      boxShadow: isRecording ? '0 0 16px rgba(255,0,0,0.4)' : undefined,
                    }}
                  >
                    REC
                  </span>
                </button>
              </div>

              {/* Mixing Indicator */}
              {isMixing && (
                <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-semibold">AUTO MIXING ACTIVE</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Deck B Controls */}
          <div className="grid grid-cols-2 gap-4">
            <ChannelStrip
              deck="B"
              volume={deckB.volume}
              eqHigh={deckB.eqHigh}
              eqMid={deckB.eqMid}
              eqLow={deckB.eqLow}
              gain={deckB.gain}
              filter={deckB.filter}
              onVolumeChange={(v) => setDeckVolume('B', v)}
              onEQChange={(band, v) => setDeckEQ('B', band, v)}
              onGainChange={(v) => setDeckGain('B', v)}
              onFilterChange={(v) => setDeckFilter('B', v)}
              color="#06b6d4"
            />
            <TransportControls
              deck="B"
              isPlaying={deckB.isPlaying}
              pitch={deckB.pitch}
              loopEnabled={deckB.loopEnabled}
              hasCuePoints={!!deckB.track?.cuePoints?.length}
              onPlayPause={() => setDeckPlaying('B', !deckB.isPlaying)}
              onPitchChange={(p) => setDeckPitch('B', p)}
              onLoopToggle={() => {
                if (!deckB.loopEnabled && deckB.track) {
                  const start = deckB.currentTime;
                  const end = Math.min(start + 16, deckB.track.duration);
                  setDeckLoop('B', true, start, end);
                } else {
                  setDeckLoop('B', false);
                }
              }}
              onPrevCue={() => {
                const cues = deckB.track?.cuePoints || [];
                const prev = cues.filter(c => c < deckB.currentTime).pop();
                if (prev !== undefined) setDeckTime('B', prev);
              }}
              onNextCue={() => {
                const cues = deckB.track?.cuePoints || [];
                const next = cues.find(c => c > deckB.currentTime);
                if (next !== undefined) setDeckTime('B', next);
              }}
              color="#06b6d4"
            />
          </div>
        </div>
      </div>

      {/* Track Pool Sidebar */}
      <div className="w-80 bg-gray-900/50 border-l border-cyan-500/30 flex flex-col overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold uppercase text-sm tracking-wider">
              Selected Tracks Pool
            </h2>
            {selectedPool.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                {selectedPool.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {selectedPool.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 mb-4 text-sm">No tracks loaded</p>
                <button
                  onClick={() => setShowTrackPicker(true)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-sm font-semibold transition-all"
                >
                  + Add Tracks
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-gray-900/50"
              style={{ height: window.innerHeight - 180 }}
            >
              {selectedPool.map((track, index) => (
                <TrackRow key={track.id} index={index} />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setShowTrackPicker(true)}
            className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-semibold transition-all"
          >
            + Add More Tracks
          </button>
        </div>
      </div>

      <TrackPickerModal
        isOpen={showTrackPicker}
        onClose={() => setShowTrackPicker(false)}
      />
    </div>
  );
}
