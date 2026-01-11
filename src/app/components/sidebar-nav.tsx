import React, { useState } from "react";
import { 
  Sparkles, 
  Music, 
  Dna, 
  Disc3,
  Sliders,
  PlaySquare,
  BarChart3,
  Settings,
  User,
  DollarSign,
  Mic,
  Music2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function SidebarNav({ activeView, onNavigate }: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // MVP Navigation - Core features only
  const mainNavigation = [
    { id: "create-track-modern", label: "Create Track", icon: Sparkles },
    { id: "library-full", label: "Generated Tracks Library", icon: Music },
    { id: "dna-track-library", label: "DNA Tracks Library", icon: Dna },
    { id: "auto-dj-mixer-pro-v3", label: "Auto DJ Mixer", icon: Sliders },
    { id: "dj-analyzer", label: "DJ Mix Analyzer", icon: Disc3 },
    { id: "mixes", label: "My Mixes", icon: PlaySquare },
    { id: "lyric-lab", label: "Lyric Lab", icon: Mic },
    { id: "lyric-library", label: "Lyric Library", icon: Music2 },
    { id: "analytics-stats", label: "Analytics & Stats", icon: BarChart3 },
    { id: "royalty-revenue", label: "Royalty & Revenue", icon: DollarSign },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside 
      className={`h-screen flex flex-col transition-all duration-200 ease-in-out ${
        isCollapsed ? 'w-[60px]' : 'w-[220px]'
      }`}
      style={{ 
        background: 'var(--bg-darker, #0a0a0a)',
        borderRight: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
      }}
    >
      {/* Header / Logo Section */}
      <div 
        className="flex items-center justify-between p-4"
        style={{ borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}
      >
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div 
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ 
              background: 'var(--accent-primary, #00bcd4)',
              color: 'var(--bg-darkest, #080808)'
            }}
          >
            <span className="font-bold text-base">S</span>
          </div>
          
          {/* Logo Text */}
          {!isCollapsed && (
            <div className="flex flex-col">
              <span 
                className="text-base font-bold tracking-wide"
                style={{ color: 'var(--text-primary, #ffffff)', letterSpacing: '1px' }}
              >
                SYNTAX
              </span>
              <span 
                className="text-[9px] tracking-widest uppercase"
                style={{ color: 'var(--text-tertiary, #666666)', letterSpacing: '1.5px' }}
              >
                Audio Intelligence
              </span>
            </div>
          )}
        </div>
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ color: 'var(--text-secondary, #a0a0a0)' }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="space-y-0.5">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 transition-all duration-150 ${
                  isCollapsed ? 'px-4 py-2.5 justify-center' : 'px-4 py-2.5'
                }`}
                style={{
                  background: isActive ? 'var(--accent-primary-subtle, rgba(0, 188, 212, 0.1))' : 'transparent',
                  color: isActive ? 'var(--accent-primary, #00bcd4)' : 'var(--text-secondary, #a0a0a0)',
                  borderLeft: isActive ? '3px solid var(--accent-primary, #00bcd4)' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-light, #1a1a1a)';
                    e.currentTarget.style.color = 'var(--text-primary, #ffffff)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary, #a0a0a0)';
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-[13px] font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer / User Section */}
      <div 
        className="p-4 flex items-center gap-3"
        style={{ borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}
      >
        {/* User Avatar */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            background: 'var(--accent-primary, #00bcd4)',
            color: 'var(--bg-darkest, #080808)'
          }}
        >
          <span className="font-semibold text-xs">DJ</span>
        </div>
        
        {/* User Name */}
        {!isCollapsed && (
          <span 
            className="text-[13px] font-medium truncate"
            style={{ color: 'var(--text-primary, #ffffff)' }}
          >
            DJ User
          </span>
        )}
      </div>
    </aside>
  );
}
