import { useState, useEffect, useRef } from "react";
import { Radio, Video, MessageSquare, Settings, Circle, Square, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useAuth } from "./auth-system";

interface StreamConfig {
  platform: "twitch" | "youtube";
  title: string;
  description: string;
  category?: string;
  quality: "720p" | "1080p" | "auto";
  recordVOD: boolean;
  chatEnabled: boolean;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  platform: "twitch" | "youtube";
}

export function LiveStreamingPanel() {
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamConfig, setStreamConfig] = useState<StreamConfig>({
    platform: "twitch",
    title: "",
    description: "",
    quality: "auto",
    recordVOD: true,
    chatEnabled: true,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const streamIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isStreaming) {
      streamIntervalRef.current = window.setInterval(() => {
        setStreamDuration((prev) => prev + 1);
        // Simulate viewer count changes
        setViewerCount((prev) => {
          const change = Math.floor(Math.random() * 5) - 2;
          return Math.max(0, prev + change);
        });
        // Simulate chat messages
        if (Math.random() > 0.7) {
          const mockUsernames = ["DJFan123", "MusicLover", "StreamViewer", "MixMaster"];
          const mockMessages = [
            "Great mix!",
            "What track is this?",
            "🔥🔥🔥",
            "Can you play [track name]?",
            "Love the energy!",
          ];
          const newMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random()}`,
            username: mockUsernames[Math.floor(Math.random() * mockUsernames.length)],
            message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
            timestamp: new Date().toISOString(),
            platform: streamConfig.platform,
          };
          setChatMessages((prev) => [...prev.slice(-49), newMessage]);
        }
      }, 1000);
    } else {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    }

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [isStreaming, streamConfig.platform]);

  const handleStartStream = async () => {
    if (!user) {
      toast.error("Please sign in to start streaming");
      return;
    }

    if (!streamConfig.title) {
      toast.error("Please enter a stream title");
      return;
    }

    try {
      // In production, this would connect to Twitch/YouTube API
      setIsStreaming(true);
      setStreamDuration(0);
      setViewerCount(Math.floor(Math.random() * 10) + 1);
      setChatMessages([]);
      toast.success(`Streaming to ${streamConfig.platform} started!`);
    } catch (error) {
      console.error("Error starting stream:", error);
      toast.error("Failed to start stream");
    }
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
    toast.success("Stream ended");
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">Live Streaming</h1>
            <p className="text-xs text-white/40">
              Stream your mixes to Twitch or YouTube
            </p>
          </div>
          {isStreaming && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-white/80 font-['IBM_Plex_Mono']">
                  LIVE
                </span>
              </div>
              <div className="text-sm text-white/60 font-['IBM_Plex_Mono']">
                {formatDuration(streamDuration)}
              </div>
              <div className="flex items-center gap-1 text-sm text-white/60">
                <Users className="w-4 h-4" />
                <span>{viewerCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isStreaming ? (
            /* Stream Setup */
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="text-xs text-white/60 mb-2 block font-['IBM_Plex_Mono']">
                    Streaming Platform
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setStreamConfig({ ...streamConfig, platform: "twitch" })}
                      className={`flex-1 p-4 rounded-xl border transition-colors ${
                        streamConfig.platform === "twitch"
                          ? "bg-purple-500/20 border-purple-500/50 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <Radio className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Twitch</p>
                    </button>
                    <button
                      onClick={() => setStreamConfig({ ...streamConfig, platform: "youtube" })}
                      className={`flex-1 p-4 rounded-xl border transition-colors ${
                        streamConfig.platform === "youtube"
                          ? "bg-red-500/20 border-red-500/50 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <Video className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">YouTube</p>
                    </button>
                  </div>
                </div>

                {/* Stream Title */}
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Stream Title *
                  </label>
                  <Input
                    value={streamConfig.title}
                    onChange={(e) => setStreamConfig({ ...streamConfig, title: e.target.value })}
                    placeholder="My Live DJ Mix"
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Description
                  </label>
                  <textarea
                    value={streamConfig.description}
                    onChange={(e) => setStreamConfig({ ...streamConfig, description: e.target.value })}
                    placeholder="Describe your stream..."
                    rows={4}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>

                {/* Quality */}
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Stream Quality
                  </label>
                  <select
                    value={streamConfig.quality}
                    onChange={(e) => setStreamConfig({ ...streamConfig, quality: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="auto">Auto (Adaptive)</option>
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                  </select>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={streamConfig.recordVOD}
                      onChange={(e) => setStreamConfig({ ...streamConfig, recordVOD: e.target.checked })}
                      className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                    />
                    <span className="text-sm text-white/80">Record as VOD (Video on Demand)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={streamConfig.chatEnabled}
                      onChange={(e) => setStreamConfig({ ...streamConfig, chatEnabled: e.target.checked })}
                      className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                    />
                    <span className="text-sm text-white/80">Show chat in app</span>
                  </label>
                </div>

                {/* Start Stream Button */}
                <Button
                  onClick={handleStartStream}
                  className="w-full bg-primary hover:bg-primary/80 text-white h-12"
                  disabled={!streamConfig.title}
                >
                  <Radio className="w-5 h-5 mr-2" />
                  Start Live Stream
                </Button>
              </div>
            </div>
          ) : (
            /* Streaming View */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Stream Preview */}
              <div className="flex-1 bg-black flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-32 h-32 border-4 border-primary rounded-full flex items-center justify-center mb-4 mx-auto animate-spin" style={{ animationDuration: "3s" }}>
                    <Radio className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-white/60 text-sm">Streaming to {streamConfig.platform}</p>
                  <p className="text-white/40 text-xs mt-1 font-['IBM_Plex_Mono']">
                    {streamConfig.title}
                  </p>
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-400 font-['IBM_Plex_Mono']">LIVE</span>
                </div>
              </div>

              {/* Controls */}
              <div className="border-t border-white/5 px-6 py-4 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-red-400 fill-red-400" />
                    <span className="text-sm text-white/80 font-['IBM_Plex_Mono']">
                      {formatDuration(streamDuration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/60">{viewerCount} viewers</span>
                  </div>
                </div>
                <Button
                  onClick={handleStopStream}
                  variant="destructive"
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Stream
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {isStreaming && streamConfig.chatEnabled && (
          <div className="w-80 border-l border-white/5 bg-white/5 flex flex-col">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat
              </h3>
              <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                {streamConfig.platform}
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2">
              {chatMessages.length === 0 ? (
                <p className="text-sm text-white/40 text-center py-8">
                  No messages yet. Chat will appear here.
                </p>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <span className="font-semibold text-white">{msg.username}:</span>
                    <span className="text-white/70 ml-2">{msg.message}</span>
                  </div>
                ))
              )}
            </div>
            <div className="px-4 py-3 border-t border-white/5">
              <Input
                placeholder="Type a message..."
                className="bg-white/5 border-white/10 text-white text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    // In production, send to Twitch/YouTube chat API
                    toast.info("Chat message sent");
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

