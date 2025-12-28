import { useState } from "react";
import { X, Link2, Code, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: {
    title: string;
    artist: string;
    duration: string;
    shareUrl?: string;
  } | null;
}

export function ShareModal({ open, onOpenChange, track }: ShareModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(42); // Mock progress
  
  if (!open || !track) return null;
  
  const shareUrl = track.shareUrl || `https://syntax.audio/track/${Math.random().toString(36).substring(7)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${shareUrl}/embed" width="100%" height="180" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied");
  };

  const handleSocialShare = (platform: string) => {
    const urls = {
      x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out "${track.title}" by ${track.artist}`)}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support URL sharing
      tiktok: `https://www.tiktok.com/`,
    };
    
    if (platform === "instagram" || platform === "tiktok") {
      toast.info("Copy the link and paste it in your post");
      handleCopyLink();
    } else {
      window.open(urls[platform as keyof typeof urls], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#18181b] border border-white/10 w-full max-w-lg">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Share Track</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mini Player */}
          <div className="bg-black/40 border border-white/10 p-4 rounded">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">
                  {track.title}
                </h3>
                <p className="text-xs text-white/60 font-['IBM_Plex_Mono'] truncate">
                  {track.artist}
                </p>
              </div>
              
              <span className="text-xs text-white/40 font-['IBM_Plex_Mono'] flex-shrink-0">
                {track.duration}
              </span>
            </div>

            {/* Waveform Preview */}
            <div className="h-12 bg-black/60 border border-white/10 rounded overflow-hidden relative">
              {/* Simple waveform bars */}
              <div className="absolute inset-0 flex items-center gap-0.5 px-1">
                {Array.from({ length: 80 }).map((_, i) => {
                  const height = Math.random() * 60 + 20;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-white/20"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
              
              {/* Progress overlay */}
              <div 
                className="absolute inset-0 bg-primary/20 border-r-2 border-primary"
                style={{ width: `${progress}%` }}
              />
              
              {/* Playhead */}
              <div 
                className="absolute inset-y-0 w-0.5 bg-primary z-10"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Time */}
            <div className="flex items-center justify-between mt-2 text-[10px] text-white/40 font-['IBM_Plex_Mono']">
              <span>2:14</span>
              <span>-2:48</span>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-white/60 text-center">
            This link lets anyone listen — no account required.
          </p>

          {/* Copy Link - Primary Action */}
          <button
            onClick={handleCopyLink}
            className="w-full bg-primary text-black py-3 font-['IBM_Plex_Mono'] text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            Copy Link
          </button>

          {/* Embed - Secondary Action */}
          <button
            onClick={handleCopyEmbed}
            className="w-full bg-white/10 text-white py-2.5 font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center gap-2"
          >
            <Code className="w-4 h-4" />
            Copy Embed Code
          </button>

          {/* Social Sharing */}
          <div>
            <p className="text-xs text-white/40 font-['IBM_Plex_Mono'] uppercase tracking-wider mb-3">
              Share on
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialShare("x")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 py-3 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialShare("instagram")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 py-3 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialShare("tiktok")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 py-3 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}