export interface DNAPreset {
  id: string;
  artistName: string;
  presetName: string;
  genre: string;
  useCount: number;
  /** Artist/preset promo image URL */
  imageUrl?: string;
  /** For applying preset to vibe prompt in Create Track */
  promptHint?: string;
  /** For "Newest" sort */
  createdAt?: string;
}

export const MOCK_DNA_PRESETS: DNAPreset[] = [
  {
    id: "joeski-deep-house",
    artistName: "Joeski",
    presetName: "Joeski Deep House",
    genre: "Tech House",
    useCount: 1247,
    imageUrl: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400",
    promptHint: "Deep house grooves, rolling bass, tech house percussion.",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "mjc-hypnotic",
    artistName: "Maya Jane Coles",
    presetName: "MJC Hypnotic",
    genre: "Deep Tech",
    useCount: 892,
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400",
    promptHint: "Hypnotic deep tech, minimal grooves, atmospheric layers.",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "carl-cox-techno-energy",
    artistName: "Carl Cox",
    presetName: "Techno Energy",
    genre: "Techno",
    useCount: 2103,
    imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a5526a4?w=400",
    promptHint: "High-energy techno, driving kicks, peak-time energy.",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "nicole-moudaber-dark-techno",
    artistName: "Nicole Moudaber",
    presetName: "Dark Techno",
    genre: "Techno",
    useCount: 1456,
    imageUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400",
    promptHint: "Dark techno, industrial textures, relentless groove.",
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "hot-since-82-melodic-house",
    artistName: "Hot Since 82",
    presetName: "Melodic House",
    genre: "Melodic House",
    useCount: 734,
    imageUrl: "https://images.unsplash.com/photo-1571265893274-7a98841f6d7f?w=400",
    promptHint: "Melodic house, emotional progressions, warm basslines.",
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "jamie-jones-paradise-grooves",
    artistName: "Jamie Jones",
    presetName: "Paradise Grooves",
    genre: "Tech House",
    useCount: 1891,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    promptHint: "Paradise-style tech house, groovy bass, sunny vibes.",
    createdAt: "2024-01-08T10:00:00Z",
  },
  {
    id: "ame-emotional-techno",
    artistName: "Âme",
    presetName: "Emotional Techno",
    genre: "Melodic Techno",
    useCount: 567,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    promptHint: "Emotional melodic techno, lush chords, storytelling.",
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "maceo-plex-cosmic-techno",
    artistName: "Maceo Plex",
    presetName: "Cosmic Techno",
    genre: "Techno",
    useCount: 1234,
    imageUrl: "https://images.unsplash.com/photo-1514525253440-b39345208668?w=400",
    promptHint: "Cosmic techno, spacey synths, deep and hypnotic.",
    createdAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "black-coffee-afro-house",
    artistName: "Black Coffee",
    presetName: "Afro House",
    genre: "Afro House",
    useCount: 1654,
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=400",
    promptHint: "Afro house, organic percussion, soulful grooves.",
    createdAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "charlotte-de-witte-raw-techno",
    artistName: "Charlotte de Witte",
    presetName: "Raw Techno",
    genre: "Techno",
    useCount: 1987,
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400",
    promptHint: "Raw techno, driving energy, dark and powerful.",
    createdAt: "2024-01-03T10:00:00Z",
  },
];
