
export enum Page {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  DNA_LOADING = 'DNA_LOADING',
  DNA_REPORT = 'DNA_REPORT',
  GENERATOR = 'GENERATOR',
  LIBRARY = 'LIBRARY',
  SETTINGS = 'SETTINGS',
  ARCHITECTURE = 'ARCHITECTURE'
}

export enum BrandColor {
  JET_BLACK = '#000000',
  DEEP_GRAY = '#101010',
  SYNTAX_GOLD = '#E0AA3E',
  SYNTAX_PALE_GOLD = '#FFE59E',
  MINIMAL_WHITE = '#F8F8F8',
  DARK_SLATE = '#141414',
  GRAY_MIST = '#C8C8C8',
  METALLIC_SILVER = '#D9D9D9',
}

export interface Track {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'analyzing' | 'complete';
  progress: number;
  date: string;
  dnaName?: string;
  duration?: string;
  bpm?: number;
  key?: string;
  genre?: string; // Added genre for folder organization
}

export interface DNAProfile {
  rhythm: number;
  harmonic: number;
  texture: number;
  drums: number;
  emotion: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  dnaUsed: string;
  date: string;
  duration: string;
  coverColor: string;
}

export interface SavedPrompt {
  id: string;
  text: string;
  genre: string;
  rating: number; // 1-5
  createdAt: string;
  bpm: number;
  key: string;
}