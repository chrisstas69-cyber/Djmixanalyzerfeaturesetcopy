import { useState } from "react";
import { DNALibrary } from "./dna-library";
import { MyDNA } from "./my-dna";

type DNATab = "library" | "active";

export function DNAUnified() {
  const [activeTab, setActiveTab] = useState<DNATab>("active");

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tabs */}
      <div className="border-b border-border px-6 pt-3.5">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("library")}
            className={`font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider pb-3 border-b-2 transition-colors ${
              activeTab === "library"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            DNA Library
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider pb-3 border-b-2 transition-colors ${
              activeTab === "active"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            Active DNA
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "library" && <DNALibrary />}
        {activeTab === "active" && <MyDNA />}
      </div>
    </div>
  );
}
