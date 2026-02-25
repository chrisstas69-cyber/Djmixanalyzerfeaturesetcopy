import React from 'react';
import {
  Home,
  Music,
  Library,
  Activity,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
  TrendingUp,
  GraduationCap,
  AudioWaveform,
  Menu,
  Maximize2,
  Disc3
} from 'lucide-react';

interface UnifiedSidebarProps {
  onNavigate: (view: string) => void;
  currentView?: string;
}

export function UnifiedSidebar({ onNavigate, currentView = 'dashboard' }: UnifiedSidebarProps) {
  const isActive = (view: string) => currentView === view;

  return (
    <aside className="w-60 bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          {/* Flame Icon in Rounded Square */}
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <span className="text-2xl">🔥</span>
          </div>
          {/* Logo Text */}
          <div className="text-xl font-bold tracking-tight">
            <span className="text-white">SYN</span>
            <span className="text-[#ff6b35]">TAX</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Home - Primary Button with Sparkle */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('dashboard')
              ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5" />
            Home
          </div>
          {isActive('dashboard') && <Sparkles className="w-4 h-4" />}
        </button>

        {/* GENERATORS SECTION */}
        <div className="pt-8 pb-2">
          <p className="text-xs text-gray-600 font-medium px-4">GENERATORS</p>
        </div>

        <button
          onClick={() => onNavigate('generator')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('generator')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Music className="w-5 h-5" />
          Create
        </button>

        {/* LIBRARY SECTION */}
        <div className="pt-8 pb-2">
          <p className="text-xs text-gray-600 font-medium px-4">LIBRARY</p>
        </div>

        <button
          onClick={() => onNavigate('library')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('library')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Library className="w-5 h-5" />
          Track Library
        </button>

        <button
          onClick={() => onNavigate('music-dna-profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('music-dna-profile') || isActive('music-dna-empty')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Activity className="w-5 h-5" />
          My Music DNA
        </button>

        <button
          onClick={() => {
            console.log('🔵 DNA Library clicked - navigating to dna-library');
            onNavigate('dna-library');
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('dna-library')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Activity className="w-5 h-5" />
          DNA Library
        </button>

        {/* ANALYSIS & DJ TOOLS SECTION */}
        <div className="pt-8 pb-2">
          <p className="text-xs text-gray-600 font-medium px-4">ANALYSIS & DJ TOOLS</p>
        </div>

        <button
          onClick={() => onNavigate('dj-mix-analyzer')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('dj-mix-analyzer')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          DJ Mix Analyzer
        </button>

        <button
          onClick={() => onNavigate('auto-dj-mixer')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('auto-dj-mixer')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          Auto DJ Mixer
        </button>

        <button
          onClick={() => onNavigate('camelot-wheel')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('camelot-wheel')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Disc3 className="w-5 h-5" />
          Camelot Wheel
        </button>

        {/* WAVEFORM TOOLS SECTION */}
        <div className="pt-8 pb-2">
          <p className="text-xs text-gray-600 font-medium px-4">WAVEFORM TOOLS</p>
        </div>

        <button
          onClick={() => onNavigate('cdj-waveform')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('cdj-waveform')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <AudioWaveform className="w-5 h-5" />
          CDJ Waveform
        </button>

        <button
          onClick={() => onNavigate('waveform-demo')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('waveform-demo')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <AudioWaveform className="w-5 h-5" />
          Waveform Demo
        </button>

        <button
          onClick={() => onNavigate('professional-waveform')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('professional-waveform')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <AudioWaveform className="w-5 h-5" />
          Pro Waveform
        </button>

        <button
          onClick={() => onNavigate('professional-waveform-showcase')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('professional-waveform-showcase')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <AudioWaveform className="w-5 h-5" />
          Pro Waveform Showcase
        </button>

        <button
          onClick={() => onNavigate('cue-editor')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('cue-editor')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Menu className="w-5 h-5" />
          Cue Editor
        </button>

        <button
          onClick={() => onNavigate('bottom-player')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('bottom-player')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Maximize2 className="w-5 h-5" />
          Bottom Player
        </button>

        <button
          onClick={() => onNavigate('auto-dj')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('auto-dj')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          Auto DJ Mix
        </button>

        {/* ACCOUNT SECTION */}
        <div className="pt-8 pb-2">
          <p className="text-xs text-gray-600 font-medium px-4">ACCOUNT</p>
        </div>

        <button
          onClick={() => onNavigate('education')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('education')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          Learn
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('settings')
              ? 'bg-[#ff6b35] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
        >
          <CreditCard className="w-5 h-5" />
          Billing
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#9333ea] rounded-full" />
          <div className="flex-1">
            <div className="text-white font-medium">Stas</div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#ff6b35] text-white px-2 py-0.5 rounded-full font-medium">Pro</span>
              <span className="text-xs text-gray-400">450 credits</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}