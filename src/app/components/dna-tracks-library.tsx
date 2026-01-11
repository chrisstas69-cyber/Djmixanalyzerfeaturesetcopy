"use client";

import { useState, useRef } from "react";
import { Upload, Play, Pause, Search, Flame } from "lucide-react";

interface Track {
  id: string;
  number: number;
  artwork: string;
  title: string;
  artist: string;
  time: string;
  key: string;
  mood: string;
  transition: string;
  bass: string;
  filter: string;
  effect: string;
  bpm: number;
  energy: number;
}

// Key color mapping
const getKeyColor = (key: string): string => {
  const keyColors: Record<string, string> = {
    "A#m": "#00bcd4", // cyan
    "C#": "#00bcd4", // cyan
    "C#m": "#e91e63", // red/pink
    "E#m": "#4caf50", // green
    "Ebm": "#4caf50", // green
    "D#": "#ff6b35", // orange
    "F#": "#9c27b0", // purple
  };
  return keyColors[key] || "#00bcd4";
};

// Sample data
const sampleTracks: Track[] = [
  {
    id: "1",
    number: 1,
    artwork: "",
    title: "I Am The God (Extended Mix)",
    artist: "Barn Gold, Tempo Giusto",
    time: "6:34",
    key: "A#m",
    mood: "Energetic",
    transition: "auto",
    bass: "BM 0",
    filter: "-",
    effect: "-",
    bpm: 134,
    energy: 8,
  },
  {
    id: "2",
    number: 2,
    artwork: "",
    title: "Great Spirit feat. Hilight Tribe (Extended Mix)",
    artist: "Armin van Buuren, Hilig...",
    time: "7:37",
    key: "C#",
    mood: "Uplifting",
    transition: "auto",
    bass: "BM 0",
    filter: "-",
    effect: "-",
    bpm: 138,
    energy: 9,
  },
  {
    id: "3",
    number: 3,
    artwork: "",
    title: "Se7en Seconds Until Thunder (Extended Mix)",
    artist: "Anske Knights",
    time: "7:16",
    key: "C#m",
    mood: "Dark",
    transition: "auto",
    bass: "BM 0",
    filter: "-",
    effect: "-",
    bpm: 134,
    energy: 8,
  },
  {
    id: "4",
    number: 4,
    artwork: "",
    title: "United feat. Ruben (Extended Mix)",
    artist: "Armin van Buuren, Rube...",
    time: "6:45",
    key: "E#m",
    mood: "Progressive",
    transition: "auto",
    bass: "BM 0",
    filter: "-",
    effect: "-",
    bpm: 128,
    energy: 7,
  },
  {
    id: "5",
    number: 5,
    artwork: "",
    title: "Deep Resonance",
    artist: "Underground Collectives",
    time: "8:12",
    key: "D#",
    mood: "Deep",
    transition: "auto",
    bass: "BM 0",
    filter: "-",
    effect: "-",
    bpm: 124,
    energy: 6,
  },
  {
    id: "6",
    number: 6,
    artwork: "",
    title: "Industrial Echo",
    artist: "Techno Warriors",
    time: "6:58",
    key: "F#",
    mood: "Aggressive",
    transition: "auto",
    bass: "BM 0",
    filter: "-",
    effect: "-",
    bpm: 135,
    energy: 8,
  },
  {
    id: "7",
    number: 7,
    artwork: "",
    title: "Progressive Journey",
    artist: "Melodic Minds",
    time: "7:45",
    key: "C#",
    mood: "Melodic",
    transition: "auto",
    bass: "BM 0",
    filter: "-",
    effect: "-",
    bpm: 138,
    energy: 7,
  },
];

export default function DNATracksLibrary() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [tracks] = useState<Track[]>(sampleTracks);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // TODO: Process uploaded files and extract metadata
      console.log("Files selected:", files);
    }
  };

  const handlePlay = (trackId: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredTracks = tracks.filter((track) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query)
    );
  });

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let comparison = 0;
    switch (sortColumn) {
      case "number":
        comparison = a.number - b.number;
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "artist":
        comparison = a.artist.localeCompare(b.artist);
        break;
      case "time":
        const parseTime = (time: string) => {
          const parts = time.split(":");
          return parseInt(parts[0]) * 60 + parseInt(parts[1] || "0");
        };
        comparison = parseTime(a.time) - parseTime(b.time);
        break;
      case "bpm":
        comparison = a.bpm - b.bpm;
        break;
      case "energy":
        comparison = a.energy - b.energy;
        break;
      case "mood":
        comparison = a.mood.localeCompare(b.mood);
        break;
      default:
        return 0;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const renderEnergyDots = (energy: number) => {
    return (
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: i < energy ? "#00bcd4" : "rgba(0, 188, 212, 0.2)",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#0a0a0a",
        }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["ALL", "DNA TRACKS", "GENERATED", "UPLOADED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px",
                background: activeTab === tab ? "#00bcd4" : "transparent",
                color: activeTab === tab ? "#000" : "#a0a0a0",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top Actions Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Search Bar */}
          <div
            style={{
              position: "relative",
              flex: 1,
              maxWidth: "400px",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
              }}
            />
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                background: "#111",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "13px",
              }}
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#00bcd4",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <Upload size={16} />
            Upload DNA Tracks
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Info Banner */}
      <div
        style={{
          padding: "12px 32px",
          background: "rgba(0, 188, 212, 0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontSize: "13px",
          color: "#00bcd4",
        }}
      >
        Your DNA Library: Upload your own tracks to build your unique musical
        profile. Our AI analyzes your music DNA (genre, style, energy, mood) to
        generate tracks that match your taste.
      </div>

      {/* Table Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 32px 20px",
        }}
      >
        {/* Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          {/* Table Header */}
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                position: "sticky",
                top: 0,
                background: "#0a0a0a",
                zIndex: 10,
              }}
            >
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("number")}
              >
                #
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ART
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("title")}
              >
                TITLE
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("artist")}
              >
                ARTIST
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("time")}
              >
                TIME
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("key")}
              >
                KEY
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("mood")}
              >
                MOOD
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                TRANSITION
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                BASS
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                FILTER
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                EFFECT
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("bpm")}
              >
                BPM
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#a0a0a0",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("energy")}
              >
                ENERGY
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedTracks.map((track, index) => (
              <tr
                key={track.id}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: index % 2 === 0 ? "#0a0a0a" : "#0d0d0d",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    index % 2 === 0 ? "#0a0a0a" : "#0d0d0d";
                }}
              >
                {/* # */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#666",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  {track.number}
                </td>

                {/* ART */}
                <td style={{ padding: "12px 8px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#111",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {track.artwork ? (
                      <img
                        src={track.artwork}
                        alt={track.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(135deg, #00bcd4 0%, #00838f 100%)",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {track.title.charAt(0)}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(track.id);
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.6)",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        opacity: playingTrackId === track.id ? 1 : 0,
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        if (playingTrackId !== track.id) {
                          e.currentTarget.style.opacity = "0";
                        }
                      }}
                    >
                      {playingTrackId === track.id ? (
                        <Pause size={16} style={{ color: "#fff" }} />
                      ) : (
                        <Play size={16} style={{ color: "#fff" }} />
                      )}
                    </button>
                  </div>
                </td>

                {/* TITLE */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  {track.title}
                </td>

                {/* ARTIST */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#a0a0a0",
                  }}
                >
                  {track.artist}
                </td>

                {/* TIME */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#a0a0a0",
                    fontFamily: "monospace",
                  }}
                >
                  {track.time}
                </td>

                {/* KEY */}
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      background: getKeyColor(track.key),
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: "monospace",
                    }}
                  >
                    {track.key}
                  </span>
                </td>

                {/* MOOD */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#a0a0a0",
                  }}
                >
                  {track.mood}
                </td>

                {/* TRANSITION */}
                <td style={{ padding: "12px 8px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#ff6b35",
                    }}
                  >
                    <Flame size={12} />
                    <span style={{ fontSize: "12px" }}>auto</span>
                  </div>
                </td>

                {/* BASS */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#a0a0a0",
                    fontSize: "12px",
                  }}
                >
                  {track.bass}
                </td>

                {/* FILTER */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#666",
                    fontSize: "12px",
                  }}
                >
                  {track.filter}
                </td>

                {/* EFFECT */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#666",
                    fontSize: "12px",
                  }}
                >
                  {track.effect}
                </td>

                {/* BPM */}
                <td
                  style={{
                    padding: "12px 8px",
                    color: "#00bcd4",
                    fontFamily: "monospace",
                    fontWeight: 500,
                  }}
                >
                  {track.bpm}
                </td>

                {/* ENERGY */}
                <td style={{ padding: "12px 8px" }}>
                  {renderEnergyDots(track.energy)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
