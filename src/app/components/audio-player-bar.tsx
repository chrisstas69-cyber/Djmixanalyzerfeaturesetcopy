import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../../lib/store/useAudioPlayer';
import { Play, Pause, Volume2, VolumeX, Shuffle, SkipBack, SkipForward, Repeat, Download, Monitor, ListMusic, Heart, Maximize2 } from 'lucide-react';

const AudioPlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    togglePlay,
    setVolume,
    clearPlayer,
    setCurrentTime: setStoreCurrentTime,
    setDurationSeconds,
  } = useAudioPlayer();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Handle play/pause logic
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      setDuration(d);
      setDurationSeconds(d);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const t = audioRef.current.currentTime;
      setCurrentTime(t);
      setStoreCurrentTime(t);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingSeconds = Math.max(0, duration - currentTime);
  const remainingFormatted = `-${formatTime(remainingSeconds)}`;

  if (!currentTrack) return null;

  const whiteIconClass = 'text-white hover:opacity-90 transition-opacity';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{ height: 80, background: '#ff5722', padding: '0 20px' }}
    >
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Left: 50x50 art, title 14px bold, artist 12px opacity 0.8, heart */}
      <div className="flex items-center gap-3 min-w-[220px]">
        <img
          src={currentTrack.artwork}
          alt={currentTrack.title}
          className="w-[50px] h-[50px] rounded object-cover flex-shrink-0"
          style={{ borderRadius: 4 }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold truncate" style={{ fontSize: 14 }}>{currentTrack.title}</p>
          <p className="truncate" style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{currentTrack.artist}</p>
        </div>
        <button type="button" className="p-1.5 rounded-full hover:bg-white/10 transition-colors" aria-label="Like">
          <Heart className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Center: shuffle, prev, play 48px, next, repeat; progress + 0:00 / -52:18 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1.5 min-w-0 max-w-2xl mx-4">
        <div className="flex items-center gap-2">
          <button type="button" className={`p-1.5 ${whiteIconClass}`} aria-label="Shuffle">
            <Shuffle className="w-5 h-5" />
          </button>
          <button type="button" className={`p-1.5 ${whiteIconClass}`} aria-label="Previous">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:opacity-95 transition-opacity text-[#ff5722] flex-shrink-0"
            style={{ width: 48, height: 48 }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            )}
          </button>
          <button type="button" className={`p-1.5 ${whiteIconClass}`} aria-label="Next">
            <SkipForward className="w-5 h-5" />
          </button>
          <button type="button" className={`p-1.5 ${whiteIconClass}`} aria-label="Repeat">
            <Repeat className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-white min-w-[36px] tabular-nums">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-white/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <span className="text-xs text-white min-w-[44px] tabular-nums text-right">{remainingFormatted}</span>
        </div>
      </div>

      {/* Right: download, cast, queue, volume + slider, expand */}
      <div className="flex items-center gap-2 min-w-[180px]">
        <button type="button" className={`p-1.5 ${whiteIconClass}`} aria-label="Download">
          <Download className="w-5 h-5" />
        </button>
        <button type="button" className={`p-1.5 ${whiteIconClass}`} aria-label="Cast">
          <Monitor className="w-5 h-5" />
        </button>
        <button type="button" className={`p-1.5 ${whiteIconClass}`} aria-label="Queue">
          <ListMusic className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              setVolume(isMuted ? 0.7 : 0);
            }}
            className={whiteIconClass}
            aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 rounded-full appearance-none cursor-pointer bg-white/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
        <button type="button" onClick={clearPlayer} className={`p-1.5 ${whiteIconClass}`} aria-label="Expand">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayerBar;
