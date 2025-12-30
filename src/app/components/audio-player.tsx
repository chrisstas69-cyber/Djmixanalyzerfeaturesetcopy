import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "./ui/slider";
import { WaveformVisualizer } from "./waveform-visualizer";

interface AudioPlayerProps {
  audioData?: string; // base64 or blob URL
  title?: string;
  artist?: string;
  duration?: number;
  energy?: "Rising" | "Building" | "Peak" | "Chill" | "Groove" | "Steady";
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export function AudioPlayer({
  audioData,
  title = "Track",
  artist = "Artist",
  duration = 0,
  energy = "Peak",
  onTimeUpdate,
  onEnded,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioData) {
      const audio = new Audio(audioData);
      audioRef.current = audio;

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        onTimeUpdate?.(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        onEnded?.();
      });

      return () => {
        audio.pause();
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
      };
    }
  }, [audioData, onTimeUpdate, onEnded]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      audioRef.current.play();
      intervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayDuration = duration || (audioRef.current?.duration || 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
      {/* Track Info */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        <p className="text-xs text-white/50 truncate">{artist}</p>
      </div>

      {/* Waveform */}
      <div className="w-full">
        <WaveformVisualizer
          audioData={audioData}
          energy={energy}
          width={800}
          height={80}
          barCount={120}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={displayDuration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-white/50 font-['IBM_Plex_Mono']">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(displayDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => skip(-10)}
          className="p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Skip back 10 seconds"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-3 bg-primary hover:bg-primary/80 text-white rounded-full transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>

        <button
          onClick={() => skip(10)}
          className="p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <div className="w-24">
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


