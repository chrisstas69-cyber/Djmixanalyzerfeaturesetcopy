"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Music, Users, Calendar, Clock } from "lucide-react";
import { StatsPanel } from "./stats-panel";
import { AnalyticsPanel } from "./analytics-panel";

export function AnalyticsStatsCombined() {
  const [activeTab, setActiveTab] = useState<"stats" | "analytics">("stats");

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-darkest, #080808)' }}>
      {/* Header with Tabs */}
      <div 
        className="px-8 py-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 
              className="text-2xl font-semibold tracking-tight mb-1"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
            >
              Analytics & Stats
            </h1>
            <p 
              className="text-sm"
              style={{ color: 'var(--text-secondary, #a0a0a0)' }}
            >
              Insights into your music library and usage
            </p>
          </div>
          
          {/* Quick Stats Summary */}
          <div className="flex gap-6">
            <div className="text-right">
              <div 
                className="text-2xl font-bold"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary, #00bcd4)' }}
              >
                247
              </div>
              <div 
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary, #666666)' }}
              >
                Total Tracks
              </div>
            </div>
            <div className="text-right">
              <div 
                className="text-2xl font-bold"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--waveform-orange, #ff6b35)' }}
              >
                45
              </div>
              <div 
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary, #666666)' }}
              >
                Total Mixes
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("stats")}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            style={{ 
              background: activeTab === "stats" ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
              color: activeTab === "stats" ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
              border: `1px solid ${activeTab === "stats" ? 'var(--accent-primary, #00bcd4)' : 'var(--border-subtle, rgba(255, 255, 255, 0.06))'}`,
              boxShadow: activeTab === "stats" ? 'var(--shadow-glow-cyan, 0 0 20px rgba(0, 188, 212, 0.3))' : 'none'
            }}
          >
            <BarChart3 className="w-4 h-4" />
            Stats Overview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            style={{ 
              background: activeTab === "analytics" ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
              color: activeTab === "analytics" ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
              border: `1px solid ${activeTab === "analytics" ? 'var(--accent-primary, #00bcd4)' : 'var(--border-subtle, rgba(255, 255, 255, 0.06))'}`,
              boxShadow: activeTab === "analytics" ? 'var(--shadow-glow-cyan, 0 0 20px rgba(0, 188, 212, 0.3))' : 'none'
            }}
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
