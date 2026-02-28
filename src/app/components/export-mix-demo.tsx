import { useState } from "react";
import { ExportMixModal } from "./export-mix-modal";
import { Download } from "lucide-react";

export function ExportMixDemo() {
  const [showModal, setShowModal] = useState(false);

  const handleExport = (format: "wav" | "mp3", includeStems: boolean, filenames: string[]) => {
    console.log("Exporting:", { format, includeStems, filenames });
    // In a real app, this would trigger the actual export process
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-white/10 flex items-center justify-center mx-auto">
          <Download className="w-8 h-8 text-secondary" />
        </div>
        
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Export Mix Modal</h1>
          <p className="text-sm text-white/50">
            Click the button below to see the export modal
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary border border-secondary/50 text-white text-sm font-medium shadow-lg shadow-secondary/20 transition-all hover:scale-105"
        >
          Open Export Modal
        </button>

        <div className="pt-8 space-y-3 text-left">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <p className="text-xs text-white/60 mb-2 font-medium">Features:</p>
            <ul className="text-xs text-white/50 space-y-1.5 font-['IBM_Plex_Mono']">
              <li>• WAV (24-bit, 44.1 kHz) - Professional quality</li>
              <li>• MP3 (320 kbps) - Streaming optimized</li>
              <li>• Clear filename preview</li>
              <li>• Quality assurance message</li>
              <li>• Simple, trustworthy design</li>
            </ul>
          </div>
        </div>
      </div>

      {showModal && (
        <ExportMixModal
          mixTitle="Evening Session Mix"
          onClose={() => setShowModal(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
}