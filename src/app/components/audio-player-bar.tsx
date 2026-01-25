import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../../lib/store/useAudioPlayer';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

const AudioPlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    togglePlay,
    setVolume,
    clearPlayer,
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
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
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

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] border-t border-white/10 z-50">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="h-full max-w-screen-2xl mx-auto px-6 flex items-center gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-[250px]">
          <img
            src={currentTrack.artwork}
            alt={currentTrack.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{currentTrack.title}</p>
            <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" fill="white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            )}
          </button>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl flex items-center gap-3">
            <span className="text-xs text-gray-400 min-w-[40px] text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FF6B00]"
            />
            <span className="text-xs text-gray-400 min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 min-w-[150px]">
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              setVolume(isMuted ? 0.7 : 0);
            }}
            className="text-gray-400 hover:text-white transition-colors"
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
            className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Close */}
        <button onClick={clearPlayer} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayerBar;
