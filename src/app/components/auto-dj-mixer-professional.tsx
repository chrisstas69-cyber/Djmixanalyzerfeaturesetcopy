import { useState, useEffect } from "react";
import { DeckPanel } from "./deck-panel";
import { MixerStrip } from "./mixer-strip";
import { TrackBrowser, Track } from "./track-browser";

interface DeckState {
  track: Track | null;
  isPlaying: boolean;
  isSynced: boolean;
  position: number;
  tempo: number;
  gain: number;
  eqHigh: number;
  eqMid: number;
  eqLow: number;
  volume: number;
  vuLevel: number;
}

const INITIAL_DECK_STATE: DeckState = {
  track: null,
  isPlaying: false,
  isSynced: false,
  position: 0,
  tempo: 0,
  gain: 75,
  eqHigh: 50,
  eqMid: 50,
  eqLow: 50,
  volume: 85,
  vuLevel: 0,
};

// Sample tracks for demo
const SAMPLE_TRACKS: Track[] = [
  {
    id: "1",
    title: "Deep House Mix",
    artist: "DJ Shadow",
    album: "Night Sessions",
    bpm: 124,
    key: "8A",
    duration: 240,
    type: "dna",
    rating: 4,
    artwork: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    title: "Tech Minimal Groove",
    artist: "Carl Cox",
    album: "Underground",
    bpm: 128,
    key: "11B",
    duration: 320,
    type: "generated",
    rating: 5,
    artwork: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    title: "Progressive Journey",
    artist: "Sasha",
    album: "Involver",
    bpm: 126,
    key: "5A",
    duration: 480,
    type: "dna",
    rating: 4,
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    title: "Techno Peak Time",
    artist: "Adam Beyer",
    album: "Drumcode",
    bpm: 132,
    key: "12A",
    duration: 360,
    type: "generated",
    rating: 5,
    artwork: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    title: "Melodic Breaks",
    artist: "Above & Beyond",
    album: "Anjunabeats",
    bpm: 120,
    key: "2B",
    duration: 420,
    type: "dna",
    rating: 3,
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
  },
];

export function AutoDJMixerProfessional() {
  const [deckA, setDeckA] = useState<DeckState>(INITIAL_DECK_STATE);
  const [deckB, setDeckB] = useState<DeckState>(INITIAL_DECK_STATE);
  const [crossfader, setCrossfader] = useState(50);
  const [draggedTrack, setDraggedTrack] = useState<Track | null>(null);

  // Load track to deck
  const loadTrackToDeck = (track: Track, deck: "A" | "B") => {
    const setter = deck === "A" ? setDeckA : setDeckB;
    setter((prev) => ({
      ...prev,
      track: { ...track },
      position: 0,
      isPlaying: false,
    }));
  };

  // Handle track double-click - load to first available deck
  const handleTrackDoubleClick = (track: Track) => {
    if (!deckA.track) {
      loadTrackToDeck(track, "A");
    } else if (!deckB.track) {
      loadTrackToDeck(track, "B");
    } else {
      // Both loaded, replace A
      loadTrackToDeck(track, "A");
    }
  };

  // Simulate playback position update
  useEffect(() => {
    const interval = setInterval(() => {
      if (deckA.isPlaying) {
        setDeckA((prev) => ({
          ...prev,
          position: prev.position >= 100 ? 0 : prev.position + 0.5,
          vuLevel: 50 + Math.random() * 40,
        }));
      }
      if (deckB.isPlaying) {
        setDeckB((prev) => ({
          ...prev,
          position: prev.position >= 100 ? 0 : prev.position + 0.5,
          vuLevel: 50 + Math.random() * 40,
        }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [deckA.isPlaying, deckB.isPlaying]);

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* TOP ZONE: DUAL DECKS (40% height) */}
      <div className="h-[40%] px-4 pt-4 flex gap-4">
        <DeckPanel
          deckId="A"
          track={deckA.track}
          isPlaying={deckA.isPlaying}
          isSynced={deckA.isSynced}
          position={deckA.position}
          tempo={deckA.tempo}
          onPlay={() =>
            setDeckA((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
          }
          onSync={() =>
            setDeckA((prev) => ({ ...prev, isSynced: !prev.isSynced }))
          }
          onCue={() => setDeckA((prev) => ({ ...prev, position: 0 }))}
          onTempoChange={(val) => setDeckA((prev) => ({ ...prev, tempo: val }))}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedTrack) {
              loadTrackToDeck(draggedTrack, "A");
              setDraggedTrack(null);
            }
          }}
        />

        <DeckPanel
          deckId="B"
          track={deckB.track}
          isPlaying={deckB.isPlaying}
          isSynced={deckB.isSynced}
          position={deckB.position}
          tempo={deckB.tempo}
          onPlay={() =>
            setDeckB((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
          }
          onSync={() =>
            setDeckB((prev) => ({ ...prev, isSynced: !prev.isSynced }))
          }
          onCue={() => setDeckB((prev) => ({ ...prev, position: 0 }))}
          onTempoChange={(val) => setDeckB((prev) => ({ ...prev, tempo: val }))}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedTrack) {
              loadTrackToDeck(draggedTrack, "B");
              setDraggedTrack(null);
            }
          }}
        />
      </div>

      {/* MIDDLE ZONE: MIXER STRIP (25% height) */}
      <div className="h-[25%]">
        <MixerStrip
          deckAGain={deckA.gain}
          deckAEqHigh={deckA.eqHigh}
          deckAEqMid={deckA.eqMid}
          deckAEqLow={deckA.eqLow}
          deckAVolume={deckA.volume}
          deckBGain={deckB.gain}
          deckBEqHigh={deckB.eqHigh}
          deckBEqMid={deckB.eqMid}
          deckBEqLow={deckB.eqLow}
          deckBVolume={deckB.volume}
          crossfader={crossfader}
          vuLevelA={deckA.vuLevel}
          vuLevelB={deckB.vuLevel}
          onDeckAGainChange={(val) =>
            setDeckA((prev) => ({ ...prev, gain: val }))
          }
          onDeckAEqChange={(band, val) =>
            setDeckA((prev) => ({
              ...prev,
              [`eq${band.charAt(0).toUpperCase() + band.slice(1)}`]: val,
            }))
          }
          onDeckAVolumeChange={(val) =>
            setDeckA((prev) => ({ ...prev, volume: val }))
          }
          onDeckBGainChange={(val) =>
            setDeckB((prev) => ({ ...prev, gain: val }))
          }
          onDeckBEqChange={(band, val) =>
            setDeckB((prev) => ({
              ...prev,
              [`eq${band.charAt(0).toUpperCase() + band.slice(1)}`]: val,
            }))
          }
          onDeckBVolumeChange={(val) =>
            setDeckB((prev) => ({ ...prev, volume: val }))
          }
          onCrossfaderChange={(val) => setCrossfader(val)}
        />
      </div>

      {/* BOTTOM ZONE: TRACK BROWSER (35% height, scrollable) */}
      <div className="h-[35%]">
        <TrackBrowser
          tracks={SAMPLE_TRACKS}
          onTrackDoubleClick={handleTrackDoubleClick}
          onTrackDragStart={(track) => setDraggedTrack(track)}
          onLoadToDeck={loadTrackToDeck}
        />
      </div>
    </div>
  );
}

