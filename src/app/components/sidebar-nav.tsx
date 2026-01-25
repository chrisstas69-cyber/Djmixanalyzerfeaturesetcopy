"use client";

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
  ChevronRight,
  LogOut
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
    { id: "library-full", label: "Generated Tracks", icon: Music },
    { id: "dna-track-library", label: "DNA Tracks", icon: Dna },
    { id: "auto-dj-mixer-clean", label: "Auto DJ Mixer", icon: Sliders },
    { id: "dj-analyzer", label: "DJ Mix Analyzer", icon: Disc3 },
    { id: "mixes", label: "My Mixes", icon: PlaySquare },
    { id: "lyric-lab", label: "Lyric Lab", icon: Mic },
    { id: "lyric-library", label: "Lyric Library", icon: Music2 },
    { id: "analytics-stats", label: "Analytics & Stats", icon: BarChart3 },
    { id: "royalty-revenue", label: "Royalty & Revenue", icon: DollarSign },
  ];

  const bottomNavigation = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const sidebarWidth = isCollapsed ? '60px' : '220px';

  return (
    <aside 
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: '100vh',
        background: 'var(--panel-2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease-in-out, min-width 0.2s ease-in-out',
        flexShrink: 0,
      }}
    >
      {/* Header / Logo Section */}
      <div 
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo Icon */}
          <div 
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, var(--orange), var(--orange-2))',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 700,
              fontSize: '16px',
              flexShrink: 0,
              boxShadow: 'var(--glow-orange)',
            }}
          >
            S
          </div>
          
          {/* Logo Text */}
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span 
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, var(--orange), var(--orange-2))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '1px',
                  lineHeight: 1.2,
                }}
              >
          SYNTAX
              </span>
              <span 
                style={{
                  fontSize: '9px',
                  color: 'var(--text-3)',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}
              >
          Audio Intelligence
              </span>
            </div>
          )}
        </div>
        
        {/* Collapse Toggle */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: '24px',
              height: '24px',
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-3)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#888';
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          style={{
            width: '100%',
            padding: '12px 0',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface-1)';
            e.currentTarget.style.color = 'var(--text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#888';
          }}
        >
          <ChevronRight size={16} />
        </button>
      )}

        {/* Main Navigation */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '10px 0' : '10px 16px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  background: isActive ? 'rgba(255, 122, 24, 0.15)' : 'transparent',
                  color: isActive ? 'var(--orange)' : 'var(--text-3)',
                  border: 'none',
                  borderLeft: isActive ? '3px solid var(--orange)' : '3px solid transparent',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#111';
                    e.currentTarget.style.color = 'var(--text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#888';
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                {!isCollapsed && (
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div style={{ 
          height: '1px', 
          background: 'var(--border)', 
          margin: '12px 16px' 
        }} />

        {/* Bottom Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '10px 0' : '10px 16px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  background: isActive ? 'rgba(255, 122, 24, 0.15)' : 'transparent',
                  color: isActive ? 'var(--orange)' : 'var(--text-3)',
                  border: 'none',
                  borderLeft: isActive ? '3px solid var(--orange)' : '3px solid transparent',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#111';
                    e.currentTarget.style.color = 'var(--text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#888';
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                {!isCollapsed && (
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer / User Section */}
      <div 
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}
      >
        {/* User Avatar */}
        <div 
          style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, var(--orange), var(--orange-2))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 600,
            fontSize: '12px',
            flexShrink: 0,
          }}
        >
          DJ
          </div>
        
        {/* User Info */}
        {!isCollapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <span 
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              DJ User
            </span>
            <span 
              style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--text-3)',
              }}
            >
              Free Plan
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
