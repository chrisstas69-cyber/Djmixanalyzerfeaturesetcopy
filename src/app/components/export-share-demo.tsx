import { useState } from "react";
import { Download, Share2, Save } from "lucide-react";
import { ExportModal } from "./export-modal";
import { ShareModal } from "./share-modal";

export function ExportShareDemo() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold tracking-tight text-white">Export + Share System</h1>
          <p className="text-xs text-muted-foreground">Professional file export and listening link distribution</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-8 bg-black">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Core Rule */}
          <div className="border border-border bg-black p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Core Rule</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Share2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Share = Listening Link</div>
                  <div className="text-xs text-muted-foreground">
                    Public player URL for streaming, no files included
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Export = Ownership Files</div>
                  <div className="text-xs text-muted-foreground">
                    Audio files (MP3/WAV), stems, DJ data for download
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-primary mt-4 font-['IBM_Plex_Mono']">
              Never mix them in the same UI.
            </p>
          </div>

          {/* Save Options */}
          <div className="border border-border bg-black p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Save Options</h2>
            <div className="space-y-4">
              <div className="border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Save className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-white">Save as Track</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Saves the selected version (A, B, or C) as a single track entry.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Editable Title + Artist</li>
                  <li>• Defaults: "Untitled Track" + "Artist Name"</li>
                  <li>• No forced naming</li>
                  <li>• Inline edit anywhere</li>
                </ul>
              </div>

              <div className="border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Save className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-white">Save as Session</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Saves the entire A/B/C generation set as a replayable session.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Contains Version A, B, C</li>
                  <li>• Prompt + settings snapshot</li>
                  <li>• Timestamp</li>
                  <li>• Replayable/regenerable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Demo Actions */}
          <div className="border border-primary bg-black p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Try the Modals</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Open Export Modal
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-6 py-3 border border-border hover:bg-muted text-white text-sm font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Open Share Modal
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Notice how Export focuses on file formats and DJ data, while Share focuses on the listening link.
            </p>
          </div>

          {/* Export Modal Features */}
          <div className="border border-border bg-black p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Export Modal</h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-white font-medium">Section 1: Quick Export</div>
                <div className="text-xs text-muted-foreground">MP3 (320 kbps) / WAV (24-bit) — radio buttons</div>
              </div>
              <div>
                <div className="text-white font-medium">Section 2: Stems</div>
                <div className="text-xs text-muted-foreground">
                  ☐ Export stems (Drums, Bass, Music, Vocals, FX) — checkbox
                </div>
              </div>
              <div>
                <div className="text-white font-medium">Section 3: DJ Data</div>
                <div className="text-xs text-muted-foreground">
                  ☑ Cue Sheet, Beat Grid, Key Info — checked by default
                </div>
              </div>
              <div>
                <div className="text-white font-medium">Section 4: Loudness Profile</div>
                <div className="text-xs text-muted-foreground">
                  Club/DJ (default), Streaming Safe, Pre-Master — radio buttons
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-white font-medium">Post-Export State</div>
                <div className="text-xs text-muted-foreground">
                  "Export ready" → Download + Copy Share Link buttons
                </div>
              </div>
            </div>
          </div>

          {/* Share Modal Features */}
          <div className="border border-border bg-black p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Share Modal</h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-white font-medium">Player Preview</div>
                <div className="text-xs text-muted-foreground">
                  Mini waveform + play/pause + time display
                </div>
              </div>
              <div>
                <div className="text-white font-medium">Copy Link (Primary)</div>
                <div className="text-xs text-muted-foreground">
                  Orange button — main action
                </div>
              </div>
              <div>
                <div className="text-white font-medium">Embed (Secondary)</div>
                <div className="text-xs text-muted-foreground">
                  Embed code textarea with copy button
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-primary font-medium text-xs font-['IBM_Plex_Mono']">
                  No technical metadata, no file formats, no export options
                </div>
              </div>
            </div>
          </div>

          {/* Library Organization */}
          <div className="border border-border bg-black p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Library Organization</h2>
            <div className="space-y-2">
              <div className="text-sm text-white">Track Library tabs:</div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-primary text-black text-xs font-medium">Tracks</div>
                <div className="px-3 py-1.5 border border-border text-xs font-medium text-white">Sessions</div>
                <div className="px-3 py-1.5 border border-border text-xs font-medium text-white">Auto DJ Mixes</div>
              </div>
              <div className="text-xs text-muted-foreground mt-3 font-['IBM_Plex_Mono']">
                Consistent columns: Title | Artist | BPM | Key | Time | Actions
              </div>
            </div>
          </div>

          {/* Session Share Player */}
          <div className="border border-border bg-black p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Session Share Player</h2>
            <p className="text-sm text-muted-foreground mb-4">
              When sharing a session, users can toggle between Version A, B, and C.
            </p>
            <div className="space-y-2 text-xs">
              <div className="text-white">• A/B/C toggle tabs at top of player</div>
              <div className="text-white">• Same clean listening UI</div>
              <div className="text-white">• No export options inside share view</div>
              <div className="text-white">• Compare different AI interpretations</div>
            </div>
            <div className="mt-4">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Navigate to session share player
                }}
                className="text-xs text-primary hover:underline"
              >
                View Session Share Player example →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        trackTitle="Midnight Grooves Extended Mix"
        trackArtist="DJ Shadow"
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        trackTitle="Midnight Grooves Extended Mix"
        trackArtist="DJ Shadow"
        shareUrl="https://syntax.audio/share/abc123"
      />
    </div>
  );
}
