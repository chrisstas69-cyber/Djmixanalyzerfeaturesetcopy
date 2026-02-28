import { useState, useRef, useEffect } from "react";
import { Mic, Radio as RadioIcon, Play, Pause, Square, Download, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  artwork?: string;
  duration: number;
  recordedAt: string;
  published: boolean;
}

export function PodcastRadioMode() {
  const [mode, setMode] = useState<"podcast" | "radio">("podcast");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [episodeData, setEpisodeData] = useState({
    title: "",
    description: "",
    artwork: "",
  });
  const recordingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    toast.info("Recording started");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success("Recording stopped");
  };

  const handleSaveEpisode = () => {
    if (!episodeData.title) {
      toast.error("Please enter an episode title");
      return;
    }

    const newEpisode: PodcastEpisode = {
      id: `episode-${Date.now()}`,
      title: episodeData.title,
      description: episodeData.description,
      artwork: episodeData.artwork,
      duration: recordingTime,
      recordedAt: new Date().toISOString(),
      published: false,
    };

    setEpisodes([...episodes, newEpisode]);
    setCurrentEpisode(newEpisode);
    setEpisodeData({ title: "", description: "", artwork: "" });
    setRecordingTime(0);
    toast.success("Episode saved!");
  };

  const handlePublish = (episodeId: string, platform: "apple" | "spotify" | "both") => {
    toast.success(`Publishing to ${platform === "both" ? "Apple Podcasts & Spotify" : platform === "apple" ? "Apple Podcasts" : "Spotify"}...`);
    setEpisodes(episodes.map((e) => (e.id === episodeId ? { ...e, published: true } : e)));
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Podcast & Radio Mode
            </h1>
            <p className="text-xs text-white/40">
              Record, edit, and publish podcast episodes and radio shows
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("podcast")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                mode === "podcast"
                  ? "bg-primary/20 border border-primary/50 text-white"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              <Mic className="w-4 h-4 inline mr-2" />
              Podcast
            </button>
            <button
              onClick={() => setMode("radio")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                mode === "radio"
                  ? "bg-primary/20 border border-primary/50 text-white"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              <RadioIcon className="w-4 h-4 inline mr-2" />
              Radio
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Recording Interface */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {mode === "podcast" ? "Record Podcast Episode" : "Record Radio Show"}
            </h2>

            {/* Recording Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {!isRecording ? (
                <Button
                  onClick={handleStartRecording}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-8 py-4"
                >
                  <Mic className="w-6 h-6 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    <span className="text-sm text-red-400 font-['IBM_Plex_Mono']">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                  <Button
                    onClick={handleStopRecording}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop Recording
                  </Button>
                </>
              )}
            </div>

            {/* Episode Metadata */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  {mode === "podcast" ? "Episode Title" : "Show Title"} *
                </label>
                <Input
                  value={episodeData.title}
                  onChange={(e) => setEpisodeData({ ...episodeData, title: e.target.value })}
                  placeholder={mode === "podcast" ? "Episode 1: Introduction" : "Morning Show - Jan 15"}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Description
                </label>
                <textarea
                  value={episodeData.description}
                  onChange={(e) => setEpisodeData({ ...episodeData, description: e.target.value })}
                  placeholder="Describe this episode..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Artwork URL (optional)
                </label>
                <Input
                  value={episodeData.artwork}
                  onChange={(e) => setEpisodeData({ ...episodeData, artwork: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Intro/Outro Templates */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-sm font-semibold text-white mb-3">Intro/Outro Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-sm text-white">
                  <p className="font-medium">Standard Intro</p>
                  <p className="text-xs text-white/60">Welcome to [Show Name]...</p>
                </button>
                <button className="p-2 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-sm text-white">
                  <p className="font-medium">Standard Outro</p>
                  <p className="text-xs text-white/60">Thanks for listening...</p>
                </button>
              </div>
            </div>

            <Button
              onClick={handleSaveEpisode}
              disabled={!episodeData.title || recordingTime === 0}
              className="w-full mt-4 bg-primary hover:bg-primary/80 text-white"
            >
              Save Episode
            </Button>
          </div>

          {/* Episodes List */}
          {episodes.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Saved Episodes</h2>
              <div className="space-y-3">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {episode.artwork && (
                        <img
                          src={episode.artwork}
                          alt={episode.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">{episode.title}</h3>
                        <p className="text-xs text-white/60 mb-2 line-clamp-2">
                          {episode.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span>{formatTime(episode.duration)}</span>
                          <span>{new Date(episode.recordedAt).toLocaleDateString()}</span>
                          {episode.published && (
                            <span className="text-green-400">Published</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                          <Play className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => handlePublish(episode.id, "both")}
                          disabled={episode.published}
                          className="px-3 py-1.5 bg-primary/20 border border-primary/50 rounded-lg hover:bg-primary/30 text-primary text-xs disabled:opacity-50"
                        >
                          {episode.published ? "Published" : "Publish"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publishing Options */}
          {currentEpisode && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Publish Episode</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePublish(currentEpisode.id, "apple")}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-left"
                >
                  <p className="text-sm font-semibold text-white mb-1">Apple Podcasts</p>
                  <p className="text-xs text-white/60">Publish to Apple Podcasts directory</p>
                </button>
                <button
                  onClick={() => handlePublish(currentEpisode.id, "spotify")}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-left"
                >
                  <p className="text-sm font-semibold text-white mb-1">Spotify</p>
                  <p className="text-xs text-white/60">Publish to Spotify Podcasts</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

