import { useState } from "react";
import { Check, Download, Share2, Save, Music, Clock, Disc, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export function MixComplete() {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [shareGenerated, setShareGenerated] = useState(false);

  const mixDetails = {
    title: "Evening Session Mix",
    duration: "42:18",
    tracks: 6,
    savedAt: "2:34 PM",
    fileSize: "412 MB",
    date: "December 25, 2024",
  };

  const tracklist = [
    { title: "Midnight Grooves", artist: "DJ Shadow", duration: "6:42" },
    { title: "Hypnotic Groove", artist: "Underground Mix", duration: "7:20" },
    { title: "Warehouse Nights", artist: "Extended", duration: "6:30" },
    { title: "Deep House Vibes", artist: "Soulful Sessions", duration: "5:58" },
    { title: "Rolling Bassline", artist: "Low Frequency", duration: "6:30" },
    { title: "Peak Time Energy", artist: "Night Shift", duration: "7:02" },
  ];

  const handleSaveSession = () => {
    setSessionSaved(true);
    setTimeout(() => setSessionSaved(false), 3000);
  };

  const handleShare = () => {
    setShareGenerated(true);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold tracking-tight mb-0.5">Auto DJ Mixer</h1>
          <p className="text-xs text-white/40">Mix performance complete</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Completion Status */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 mb-4 shadow-lg shadow-secondary/10">
              <Check className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Mix Complete</h2>
            <p className="text-sm text-white/60 mb-1">
              Your performance has been captured and saved
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
              <Check className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-medium text-secondary">Saved as WAV</span>
            </div>
          </div>

          {/* Mix Details Card */}
          <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold mb-1">{mixDetails.title}</h3>
                <p className="text-xs text-white/50">Saved to Track Library · {mixDetails.savedAt}</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs font-['IBM_Plex_Mono'] text-white/70">{mixDetails.fileSize}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-0.5">Duration</div>
                  <div className="text-sm font-semibold font-['IBM_Plex_Mono']">{mixDetails.duration}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-0.5">Tracks</div>
                  <div className="text-sm font-semibold font-['IBM_Plex_Mono']">{mixDetails.tracks}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Disc className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-0.5">Style</div>
                  <div className="text-sm font-semibold">Safe Club</div>
                </div>
              </div>
            </div>

            {/* Waveform Preview */}
            <div className="h-20 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center gap-px px-2">
              {Array.from({ length: 120 }, () => Math.random() * 100).map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-secondary to-secondary/60"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {/* Save Session */}
            <button
              onClick={handleSaveSession}
              disabled={sessionSaved}
              className={`group relative p-4 rounded-xl border transition-all text-left ${
                sessionSaved
                  ? "bg-secondary/10 border-secondary/30"
                  : "bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10 hover:border-white/20 hover:from-white/[0.08] hover:to-white/[0.03]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${
                  sessionSaved
                    ? "bg-secondary/20 border-secondary/30"
                    : "bg-white/5 border-white/10 group-hover:bg-white/10"
                }`}>
                  {sessionSaved ? (
                    <Check className="w-5 h-5 text-secondary" />
                  ) : (
                    <Save className="w-5 h-5 text-white/60 group-hover:text-white/80" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold mb-1 transition-colors ${
                    sessionSaved ? "text-secondary" : "text-white/90 group-hover:text-white"
                  }`}>
                    {sessionSaved ? "Session Saved" : "Save Session"}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    Re-render or change style later
                  </div>
                </div>
              </div>
            </button>

            {/* Export */}
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="group relative p-4 rounded-xl border bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10 hover:border-white/20 hover:from-white/[0.08] hover:to-white/[0.03] transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all">
                  <Download className="w-5 h-5 text-white/60 group-hover:text-white/80" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white/90 group-hover:text-white mb-1 transition-colors">
                    Export
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    Download as WAV or MP3
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showExportOptions ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Share Mix */}
            <button
              onClick={handleShare}
              className="group relative p-4 rounded-xl border bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10 hover:border-white/20 hover:from-white/[0.08] hover:to-white/[0.03] transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all">
                  <Share2 className="w-5 h-5 text-white/60 group-hover:text-white/80" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white/90 group-hover:text-white mb-1 transition-colors">
                    Share Mix
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    Generate streaming link
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Export Options Dropdown */}
          {showExportOptions && (
            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-4 backdrop-blur-xl mb-6">
              <div className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
                Export Format
              </div>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-white/60 group-hover:text-white/80" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-white/90 group-hover:text-white">WAV (Lossless)</div>
                      <div className="text-xs text-white/50">Highest quality · {mixDetails.fileSize}</div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-secondary/10 border border-secondary/20">
                    <span className="text-xs font-medium text-secondary">Recommended</span>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-white/60 group-hover:text-white/80" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-white/90 group-hover:text-white">MP3 (320kbps)</div>
                      <div className="text-xs text-white/50">Compressed · ~62 MB</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Share Link Generated */}
          {shareGenerated && (
            <div className="bg-gradient-to-b from-primary/[0.08] to-primary/[0.02] border border-primary/20 rounded-2xl p-5 backdrop-blur-xl mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white/90 mb-1">
                    Shareable Link Generated
                  </div>
                  <div className="text-xs text-white/60 leading-relaxed mb-3">
                    Anyone with this link can stream your mix
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://syntaxaudio.fm/mix/evening-session-a7k2m"
                      className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-['IBM_Plex_Mono'] text-white/80 focus:outline-none focus:border-primary/40"
                    />
                    <Button
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/10 text-primary text-xs"
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>

              {/* Share Preview */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                <div className="text-xs text-white/50 mb-2">Preview</div>
                <div className="text-sm font-semibold mb-2">{mixDetails.title}</div>
                <div className="h-12 bg-black/50 rounded-lg overflow-hidden border border-white/10 flex items-center gap-px px-1 mb-2">
                  {Array.from({ length: 60 }, () => Math.random() * 100).map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="text-xs text-white/50">
                  {mixDetails.duration} · {mixDetails.tracks} tracks · {mixDetails.date}
                </div>
              </div>
            </div>
          )}

          {/* Tracklist */}
          <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <h3 className="text-sm font-semibold mb-4 text-white/80">Tracklist</h3>
            <div className="space-y-2">
              {tracklist.map((track, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-['IBM_Plex_Mono'] text-white/50">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/90 truncate">{track.title}</div>
                    <div className="text-xs text-white/50 truncate">{track.artist}</div>
                  </div>
                  <div className="text-xs font-['IBM_Plex_Mono'] text-white/50">
                    {track.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              className="border-white/20 hover:bg-white/5 text-sm"
            >
              Back to Library
            </Button>
            <Button className="bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary border border-secondary/50 text-white shadow-lg shadow-secondary/20 text-sm">
              Create Another Mix
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
