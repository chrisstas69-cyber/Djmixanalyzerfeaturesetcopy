import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { StatsPanel } from "./stats-panel";
import { AnalyticsPanel } from "./analytics-panel";

export function AnalyticsStatsCombined() {
  const [activeTab, setActiveTab] = useState<"stats" | "analytics">("stats");

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header with Tabs */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Analytics & Stats
            </h1>
            <p className="text-xs text-white/40">
              Insights into your music library and usage
            </p>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeTab === "stats"
                ? "bg-primary/20 border border-primary/50 text-white"
                : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Stats
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeTab === "analytics"
                ? "bg-primary/20 border border-primary/50 text-white"
                : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "stats" ? <StatsPanel /> : <AnalyticsPanel />}
      </div>
    </div>
  );
}

