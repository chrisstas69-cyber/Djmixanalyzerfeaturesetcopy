"use client";

import React, { useState } from "react";
import {
  Share2, 
  Download,
  Music,
  Key,
  Zap,
  ArrowRightLeft,
  Play,
  Pause
} from "lucide-react";
import { toast } from "sonner";

export function DJMixAnalyzer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeToggle, setActiveToggle] = useState<"low" | "high">("low");

  // Generate waveform bars (150+ bars with varying heights)
  const generateWaveformBars = () => {
    const bars: { height: number; color: "orange" | "cyan" }[] = [];
    let currentSection = Math.random() > 0.5 ? "high" : "low";
    
    for (let i = 0; i < 160; i++) {
      // Change section every 20-40 bars
      if (i % Math.floor(20 + Math.random() * 20) === 0 && i > 0) {
        currentSection = currentSection === "high" ? "low" : "high";
      }
      
      if (currentSection === "high") {
        // High energy: heights 60%-100%, orange color
        bars.push({
          height: 60 + Math.random() * 40,
          color: "orange"
        });
      } else {
        // Low energy: heights 20%-60%, cyan color
        bars.push({
          height: 20 + Math.random() * 40,
          color: "cyan"
        });
      }
    }
    
    return bars;
  };

  const waveformBars = generateWaveformBars();

    return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
      {/* Page Header */}
      <div className="px-8 py-6 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-[32px] font-bold mb-1" style={{ color: 'var(--text)', fontWeight: 700 }}>
              DJ Mix Analyzer
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-3)', fontSize: '14px' }}>
              Deep House Journey — Generated 12/23/2025
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.info("Share mix")}
              className="h-9 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text-2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => toast.info("Export report")}
              className="h-9 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
              style={{
                background: 'var(--cyan-2)',
                color: '#000',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Flex Layout 30% / 70% */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - 30% */}
        <div className="w-[30%] border-r overflow-y-auto" style={{ borderRight: '1px solid var(--border)' }}>
          <div className="p-6 space-y-4">
            {/* Card 1 - BPM AVERAGE */}
            <div
              className="rounded-lg p-5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'var(--orange-2)',
                }}
              >
                <Music className="w-5 h-5" style={{ color: '#000' }} />
              </div>
              <div className="text-5xl font-bold mb-1" style={{ color: 'var(--text)', fontSize: '48px', fontWeight: 700 }}>
                128
          </div>
              <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)', fontSize: '11px', letterSpacing: '1px' }}>
                BPM AVERAGE
        </div>
              <div className="text-sm" style={{ color: 'var(--text-3)', fontSize: '13px' }}>
                Range: 126-130 BPM
      </div>
            </div>

            {/* Card 2 - KEY CHANGES */}
            <div
              className="rounded-lg p-5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'var(--orange-2)',
                }}
              >
                <Key className="w-5 h-5" style={{ color: '#000' }} />
              </div>
              <div className="text-5xl font-bold mb-1" style={{ color: 'var(--text)', fontSize: '48px', fontWeight: 700 }}>
                7
              </div>
              <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)', fontSize: '11px', letterSpacing: '1px' }}>
                KEY CHANGES
              </div>
              <div className="flex gap-2 flex-wrap">
                {["Am", "C", "Dm"].map((key) => (
                  <span
                    key={key}
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'var(--cyan-2)',
                      color: '#000',
                      fontSize: '11px',
                      padding: '6px',
                    }}
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 3 - ENERGY PEAKS */}
            <div
              className="rounded-lg p-5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'var(--cyan-2)',
                }}
              >
                <Zap className="w-5 h-5" style={{ color: '#000' }} />
              </div>
              <div className="text-5xl font-bold mb-1" style={{ color: 'var(--text)', fontSize: '48px', fontWeight: 700 }}>
                4
              </div>
              <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)', fontSize: '11px', letterSpacing: '1px' }}>
                ENERGY PEAKS
              </div>
              <div className="text-sm" style={{ color: 'var(--text-3)', fontSize: '13px' }}>
                Avg Intensity: 78%
            </div>
          </div>

            {/* Card 4 - TRANSITIONS */}
            <div
              className="rounded-lg p-5"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'var(--orange-2)',
                }}
              >
                <ArrowRightLeft className="w-5 h-5" style={{ color: '#000' }} />
                      </div>
              <div className="text-5xl font-bold mb-1" style={{ color: 'var(--text)', fontSize: '48px', fontWeight: 700 }}>
                24
                      </div>
              <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)', fontSize: '11px', letterSpacing: '1px' }}>
                TRANSITIONS
          </div>
              <div className="text-sm" style={{ color: 'var(--text-3)', fontSize: '13px' }}>
                Smooth: 21 · Hard: 3
            </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - 70% */}
        <div className="w-[70%] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 600 }}>
                Waveform Analysis
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveToggle("low")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  style={{
                    background: activeToggle === "low" ? 'var(--cyan-2)' : 'transparent',
                    border: activeToggle === "low" ? 'none' : `1px solid ${activeToggle === "low" ? 'var(--cyan)' : 'var(--border)'}`,
                    color: activeToggle === "low" ? '#000' : 'var(--text-2)',
                  }}
                  onMouseEnter={(e) => {
                    if (activeToggle !== "low") {
                      e.currentTarget.style.background = 'var(--surface)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeToggle !== "low") {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  Low Energy
                </button>
                <button
                  onClick={() => setActiveToggle("high")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  style={{
                    background: activeToggle === "high" ? 'var(--orange-2)' : 'transparent',
                    border: activeToggle === "high" ? 'none' : `1px solid ${activeToggle === "high" ? 'var(--orange)' : 'var(--border)'}`,
                    color: activeToggle === "high" ? '#000' : 'var(--text-2)',
                  }}
                  onMouseEnter={(e) => {
                    if (activeToggle !== "high") {
                      e.currentTarget.style.background = 'var(--surface)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeToggle !== "high") {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  High Energy
                </button>
              </div>
          </div>

            {/* Chart Container */}
            <div
              className="rounded-lg relative"
              style={{
                background: '#000',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                height: '400px',
              }}
            >
              {/* Timeline */}
              <div className="absolute top-2.5 left-5 right-5 flex justify-between" style={{ top: '10px' }}>
                {["0:00", "3:00", "6:00", "9:00", "12:00", "15:00"].map((time) => (
                  <span key={time} className="text-xs" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                    {time}
                  </span>
              ))}
          </div>

              {/* Waveform Bars */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end gap-0.5" style={{ height: '300px', bottom: '20px' }}>
                {waveformBars.map((bar, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 rounded-t"
                    style={{
                      width: '3px',
                      height: `${bar.height}%`,
                      background: bar.color === "orange" ? '#FF6A00' : '#00C2FF',
                      borderRadius: '1px 1px 0 0',
                    }}
                  />
                ))}
          </div>

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-5"
                style={{
                  left: '15%',
                  width: '2px',
                  background: '#fff',
                  bottom: '20px',
                }}
              />
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                <span className="text-xs uppercase" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                  DURATION:
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text)', fontSize: '14px' }}>
                  15:18
                </span>
          </div>
              <div className="flex items-center gap-1">
                <span className="text-xs uppercase" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                  TRACKS:
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text)', fontSize: '14px' }}>
                  12
                </span>
        </div>
              <div className="flex items-center gap-1">
                <span className="text-xs uppercase" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                  DNA MATCH:
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--cyan)', fontSize: '14px' }}>
                  94%
                </span>
      </div>
              <div className="flex items-center gap-1">
                <span className="text-xs uppercase" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
                  QUALITY:
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text)', fontSize: '14px' }}>
                  8.5/10
                </span>
        </div>
            </div>

            {/* Play Button */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  toast.info(isPlaying ? "Paused" : "Playing");
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  background: 'var(--cyan-2)',
                  color: '#000',
                  boxShadow: 'var(--glow-cyan)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </button>
              <span className="text-sm" style={{ color: 'var(--text-2)', fontSize: '14px' }}>
                2:23 / 15:18
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DJMixAnalyzer;
