export interface TrackRoyaltySplit {
  creator: number;
  dnaArtist: number;
  platform: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork?: string | null;
  bpm: number;
  key: string;
  duration: string;
  energy: number;
  genre: string;
  isFavorite?: boolean;
  createdAt: string;
  /** DNA attribution */
  dnaPresetId?: string;
  dnaArtistName?: string;
  dnaPresetName?: string;
  generationMethod: "dna" | "prompt-only";
  royaltySplit?: TrackRoyaltySplit;
  /** Prompt used to generate this track */
  promptUsed?: string;
}

const defaultRoyalty: TrackRoyaltySplit = {
  creator: 40,
  dnaArtist: 40,
  platform: 20,
};

/** Sample tracks with DNA attribution for badges and detail view */
export function getSampleTracksWithDNA(): Track[] {
  const samples: Track[] = [
    {
      id: "track-joeski",
      title: "Deep Groove",
      artist: "You",
      bpm: 124,
      key: "Am",
      duration: "6:42",
      energy: 7,
      genre: "Tech House",
      artwork: null,
      isFavorite: false,
      createdAt: new Date().toLocaleDateString(),
      dnaPresetId: "joeski-deep-house",
      dnaArtistName: "Joeski",
      dnaPresetName: "Joeski Deep House",
      generationMethod: "dna",
      royaltySplit: defaultRoyalty,
    },
    {
      id: "track-mjc",
      title: "Hypnotic Drift",
      artist: "You",
      bpm: 122,
      key: "Dm",
      duration: "7:18",
      energy: 6,
      genre: "Deep Tech",
      artwork: null,
      isFavorite: false,
      createdAt: new Date().toLocaleDateString(),
      dnaPresetId: "mjc-hypnotic",
      dnaArtistName: "Maya Jane Coles",
      dnaPresetName: "MJC Hypnotic",
      generationMethod: "dna",
      royaltySplit: defaultRoyalty,
    },
    {
      id: "track-prompt-only",
      title: "Custom Vibe",
      artist: "You",
      bpm: 128,
      key: "Fm",
      duration: "5:55",
      energy: 8,
      genre: "Techno",
      artwork: null,
      isFavorite: false,
      createdAt: new Date().toLocaleDateString(),
      generationMethod: "prompt-only",
    },
    {
      id: "track-carl-cox",
      title: "Peak Time",
      artist: "You",
      bpm: 130,
      key: "Em",
      duration: "6:20",
      energy: 9,
      genre: "Techno",
      artwork: null,
      isFavorite: false,
      createdAt: new Date().toLocaleDateString(),
      dnaPresetId: "carl-cox-techno-energy",
      dnaArtistName: "Carl Cox",
      dnaPresetName: "Techno Energy",
      generationMethod: "dna",
      royaltySplit: defaultRoyalty,
    },
  ];

  const genres = ["Techno", "House", "Trance", "Deep Tech"];
  const artists = ["Underground Artist", "Berlin DJ", "AI Mix"];
  const extra = Array.from({ length: 26 }, (_, i) => ({
    id: `track-${i + 4}`,
    title: `Track ${i + 5}`,
    artist: artists[i % artists.length],
    bpm: 120 + (i % 20),
    key: "Am",
    duration: "6:30",
    energy: 5 + (i % 5),
    genre: genres[i % genres.length],
    artwork: null as string | null,
    isFavorite: false,
    createdAt: new Date().toLocaleDateString(),
    generationMethod: "prompt-only" as const,
  }));

  return [...samples, ...extra];
}
