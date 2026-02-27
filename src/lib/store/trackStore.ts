import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  genre?: string;
  duration: number;
  key?: string;
  artwork?: string;
  source: 'generated' | 'dna';
  waveformData?: number[];
  cuePoints?: number[];
}

interface DeckState {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  eqHigh: number;
  eqMid: number;
  eqLow: number;
  gain: number;
  filter: number;
  pitch: number;
  loopEnabled: boolean;
  loopStart: number | null;
  loopEnd: number | null;
}

interface TrackStore {
  generatedTracks: Track[];
  dnaTracks: Track[];
  selectedPool: Track[];
  deckA: DeckState;
  deckB: DeckState;
  crossfader: number;
  
  // Pool actions
  addToPool: (track: Track) => void;
  removeFromPool: (trackId: string) => void;
  clearPool: () => void;
  setPool: (tracks: Track[]) => void;
  reorderPool: (startIndex: number, endIndex: number) => void;
  
  // Deck actions
  loadTrackToDeck: (track: Track, deck: 'A' | 'B') => void;
  setDeckPlaying: (deck: 'A' | 'B', playing: boolean) => void;
  setDeckTime: (deck: 'A' | 'B', time: number) => void;
  setDeckVolume: (deck: 'A' | 'B', volume: number) => void;
  setDeckEQ: (deck: 'A' | 'B', band: 'high' | 'mid' | 'low', value: number) => void;
  setDeckGain: (deck: 'A' | 'B', gain: number) => void;
  setDeckFilter: (deck: 'A' | 'B', filter: number) => void;
  setDeckPitch: (deck: 'A' | 'B', pitch: number) => void;
  setDeckLoop: (deck: 'A' | 'B', enabled: boolean, start?: number, end?: number) => void;
  setCrossfader: (position: number) => void;
  addCuePoint: (deck: 'A' | 'B', time: number) => void;
}

// Generate mock waveform data
const generateWaveform = (): number[] => {
  const points = 200;
  const waveform: number[] = [];
  for (let i = 0; i < points; i++) {
    const base = Math.sin(i / 10) * 0.4 + 0.5;
    const variation = Math.random() * 0.3;
    waveform.push(Math.min(1, Math.max(0, base + variation)));
  }
  return waveform;
};

const initialDeckState: DeckState = {
  track: null,
  isPlaying: false,
  currentTime: 0,
  volume: 0.8,
  eqHigh: 0.5,
  eqMid: 0.5,
  eqLow: 0.5,
  gain: 0.5,
  filter: 0.5,
  pitch: 0,
  loopEnabled: false,
  loopStart: null,
  loopEnd: null
};

export const useTrackStore = create<TrackStore>((set) => ({
  generatedTracks: [
    {
      id: 'gen-1',
      title: 'Midnight Resonance',
      artist: 'Adam Beyer',
      bpm: 138,
      genre: 'Tech House',
      duration: 312,
      key: '6A',
      source: 'generated',
      waveformData: generateWaveform(),
      cuePoints: [30, 90, 180, 240]
    },
    {
      id: 'gen-2',
      title: 'Electric Dreams',
      artist: 'Charlotte de Witte',
      bpm: 136,
      genre: 'Melodic Techno',
      duration: 289,
      key: '8B',
      source: 'generated',
      waveformData: generateWaveform(),
      cuePoints: [25, 85, 170]
    },
    {
      id: 'gen-3',
      title: 'Neon Pulse',
      artist: 'Amelie Lens',
      bpm: 134,
      genre: 'Techno',
      duration: 267,
      key: '5A',
      source: 'generated',
      waveformData: generateWaveform(),
      cuePoints: [40, 120, 200]
    },
    {
      id: 'gen-4',
      title: 'Cosmic Journey',
      artist: 'AI Generated',
      bpm: 128,
      genre: 'Progressive House',
      duration: 345,
      key: '7B',
      source: 'generated',
      waveformData: generateWaveform(),
      cuePoints: [50, 150, 250]
    },
    {
      id: 'gen-5',
      title: 'Synthwave Dreams',
      artist: 'AI Generated',
      bpm: 124,
      genre: 'House',
      duration: 298,
      key: '9A',
      source: 'generated',
      waveformData: generateWaveform(),
      cuePoints: [35, 105, 210]
    }
  ],
  
  dnaTracks: [
    {
      id: 'dna-1',
      title: 'Deep Horizon',
      artist: 'Tale Of Us',
      bpm: 124,
      genre: 'Deep House',
      duration: 402,
      key: '6B',
      source: 'dna',
      waveformData: generateWaveform(),
      cuePoints: [45, 135, 270]
    },
    {
      id: 'dna-2',
      title: 'Sunrise Anthem',
      artist: 'Eric Prydz',
      bpm: 126,
      genre: 'Progressive House',
      duration: 378,
      key: '8A',
      source: 'dna',
      waveformData: generateWaveform(),
      cuePoints: [60, 180, 300]
    },
    {
      id: 'dna-3',
      title: 'Underground Movement',
      artist: 'Richie Hawtin',
      bpm: 132,
      genre: 'Techno',
      duration: 289,
      key: '4B',
      source: 'dna',
      waveformData: generateWaveform(),
      cuePoints: [30, 90, 180]
    },
    {
      id: 'dna-4',
      title: 'Lost In Time',
      artist: 'Stephan Bodzin',
      bpm: 122,
      genre: 'Melodic Techno',
      duration: 456,
      key: '7A',
      source: 'dna',
      waveformData: generateWaveform(),
      cuePoints: [70, 210, 350]
    },
    {
      id: 'dna-5',
      title: 'Velocity',
      artist: 'Solomun',
      bpm: 123,
      genre: 'Deep House',
      duration: 367,
      key: '5B',
      source: 'dna',
      waveformData: generateWaveform(),
      cuePoints: [55, 165, 275]
    },
    {
      id: 'dna-6',
      title: 'Aurora Waves',
      artist: 'Mind Against',
      bpm: 125,
      genre: 'Melodic Techno',
      duration: 334,
      key: '9B',
      source: 'dna',
      waveformData: generateWaveform(),
      cuePoints: [40, 120, 240]
    }
  ],
  
  selectedPool: [],
  deckA: initialDeckState,
  deckB: initialDeckState,
  crossfader: 0,
  
  addToPool: (track) =>
    set((state) => {
      if (state.selectedPool.some(t => t.id === track.id)) return state;
      return { selectedPool: [...state.selectedPool, track] };
    }),
  
  removeFromPool: (trackId) =>
    set((state) => ({
      selectedPool: state.selectedPool.filter(t => t.id !== trackId)
    })),
  
  clearPool: () => set({ selectedPool: [] }),
  
  setPool: (tracks) => set({ selectedPool: tracks }),
  
  reorderPool: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.selectedPool);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { selectedPool: result };
    }),
  
  loadTrackToDeck: (track, deck) =>
    set((state) => ({
      [deck === 'A' ? 'deckA' : 'deckB']: {
        ...initialDeckState,
        track,
        volume: 0.8,
        eqHigh: 0.5,
        eqMid: 0.5,
        eqLow: 0.5,
        gain: 0.5,
        filter: 0.5
      }
    })),
  
  setDeckPlaying: (deck, playing) =>
    set((state) => ({
      [deck === 'A' ? 'deckA' : 'deckB']: {
        ...(deck === 'A' ? state.deckA : state.deckB),
        isPlaying: playing
      }
    })),
  
  setDeckTime: (deck, time) =>
    set((state) => ({
      [deck === 'A' ? 'deckA' : 'deckB']: {
        ...(deck === 'A' ? state.deckA : state.deckB),
        currentTime: time
      }
    })),
  
  setDeckVolume: (deck, volume) =>
    set((state) => ({
      [deck === 'A' ? 'deckA' : 'deckB']: {
        ...(deck === 'A' ? state.deckA : state.deckB),
        volume
      }
    })),
  
  setDeckEQ: (deck, band, value) =>
    set((state) => {
      const deckState = deck === 'A' ? state.deckA : state.deckB;
      return {
        [deck === 'A' ? 'deckA' : 'deckB']: {
          ...deckState,
          [`eq${band.charAt(0).toUpperCase() + band.slice(1)}`]: value
        }
      };
    }),
  
  setDeckGain: (deck, gain) =>
    set((state) => ({
      [deck === 'A' ? 'deckA' : 'deckB']: {
        ...(deck === 'A' ? state.deckA : state.deckB),
        gain
      }
    })),
  
  setDeckFilter: (deck, filter) =>
    set((state) => ({
      [deck === 'A' ? 'deckA' : 'deckB']: {
        ...(deck === 'A' ? state.deckA : state.deckB),
        filter
      }
    })),
  
  setDeckPitch: (deck, pitch) =>
    set((state) => ({
      [deck === 'A' ? 'deckA' : 'deckB']: {
        ...(deck === 'A' ? state.deckA : state.deckB),
        pitch
      }
    })),
  
  setDeckLoop: (deck, enabled, start, end) =>
    set((state) => ({
      [deck === 'A' ? 'deckA' : 'deckB']: {
        ...(deck === 'A' ? state.deckA : state.deckB),
        loopEnabled: enabled,
        loopStart: start ?? null,
        loopEnd: end ?? null
      }
    })),
  
  setCrossfader: (position) => set({ crossfader: position }),
  
  addCuePoint: (deck, time) =>
    set((state) => {
      const deckState = deck === 'A' ? state.deckA : state.deckB;
      if (!deckState.track) return state;
      
      const track = { ...deckState.track };
      track.cuePoints = [...(track.cuePoints || []), time].sort((a, b) => a - b);
      
      return {
        [deck === 'A' ? 'deckA' : 'deckB']: {
          ...deckState,
          track
        }
      };
    })
}));
