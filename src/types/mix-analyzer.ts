export interface DNAProfile {
  id: string;
  name: string;
  date: string;
  thumbnail?: string;
  bpmRange: [number, number];
  trackCount: number;
  dnaAttributes: {
    groove: number;
    energy: number;
    darkness: number;
    hypnotic: number;
    minimal: number;
  };
  styleTags: string[];
  mixingTechniques: string[];
  transitionAverage: string;
}

export interface Artist {
  id: string;
  name: string;
  photo: string;
  genre: string;
  averageBpm: number;
  dnaAttributes: {
    groove: number;
    energy: number;
    darkness: number;
    hypnotic: number;
    minimal: number;
  };
  bio?: string;
  signatureTechniques: string[];
}

export interface DetectedTrack {
  id: string;
  timestamp: string;
  name: string;
  artist?: string;
  bpm: number;
  key: string;
  duration: string;
  energyLevel: number;
}

export interface MixAnalysis {
  duration: string;
  bpmRange: [number, number];
  keyProgression: string[];
  energyCurve: number[];
  genreDistribution: { genre: string; percentage: number }[];
  detectedTracks: DetectedTrack[];
  dnaProfile: DNAProfile;
  matchedArtist?: { artistId: string; confidence: number };
}
