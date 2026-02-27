import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  audioUrl?: string;
  duration: string;
}

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  volume: number;
  currentTime: number;
  durationSeconds: number;

  // Actions
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  addToQueue: (track: Track) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (t: number) => void;
  setDurationSeconds: (d: number) => void;
  clearPlayer: () => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  volume: 0.7,
  currentTime: 0,
  durationSeconds: 0,

  playTrack: (track) => {
    set({ currentTrack: track, isPlaying: true });
  },
  
  pauseTrack: () => {
    set({ isPlaying: false });
  },
  
  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
  
  addToQueue: (track) => {
    set((state) => ({ queue: [...state.queue, track] }));
    // Optional: Alert user
    console.log(`Added "${track.title}" to queue`);
  },
  
  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  setCurrentTime: (t: number) => {
    set({ currentTime: t });
  },

  setDurationSeconds: (d: number) => {
    set({ durationSeconds: d });
  },

  clearPlayer: () => {
    set({ currentTrack: null, isPlaying: false, currentTime: 0, durationSeconds: 0 });
  },
}));
