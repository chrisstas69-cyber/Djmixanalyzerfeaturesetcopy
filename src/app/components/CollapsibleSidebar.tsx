import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Music2, 
  Library, 
  Dna, 
  ListMusic, 
  FlaskConical, 
  Settings, 
  Menu,
  Coins,
  ChevronLeft,
  ChevronRight,
  AudioWaveform,
  Maximize2,
  Disc3,
  Sparkles,
  Zap,
  Sliders,
  Search
} from 'lucide-react';

type View = 'landing' | 'generator' | 'library' | 'dna-library' | 'dashboard' | 'analysis' | 'settings' | 'waveform-demo' | 'professional-waveform' | 'cue-editor' | 'bottom-player' | 'auto-dj' | 'auto-dj-mixer' | 'dj-mix-analyzer' | 'education' | 'camelot-wheel';

interface NavItem {
  id: View;
  label: string;
  icon: React.ComponentType<any>;
}

interface CollapsibleSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  credits: number;
  userName: string;
  userAvatar?: string;
}

const navItems: NavItem[] = [
  { id: 'landing', label: 'Home', icon: Home },
  { id: 'generator', label: 'Create', icon: Music2 },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'dna-library', label: 'DNA Library', icon: Dna },
  { id: 'dashboard', label: 'Tracks', icon: ListMusic },
  { id: 'analysis', label: 'Analysis', icon: FlaskConical },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'waveform-demo', label: 'Waveform Demo', icon: AudioWaveform },
  { id: 'professional-waveform', label: 'Professional Waveform', icon: AudioWaveform },
  { id: 'cue-editor', label: 'Cue Editor', icon: Menu },
  { id: 'bottom-player', label: 'Bottom Player', icon: Maximize2 },
  { id: 'auto-dj', label: 'Auto DJ', icon: Sparkles },
  { id: 'auto-dj-mixer', label: 'Auto DJ Mixer', icon: Zap },
  { id: 'dj-mix-analyzer', label: 'DJ Mix Analyzer', icon: Search },
  { id: 'education', label: 'Education', icon: Sliders },
  { id: 'camelot-wheel', label: 'Camelot Wheel', icon: Disc3 },
];

export function CollapsibleSidebar({ 
  currentView, 
  onNavigate, 
  credits, 
  userName,
  userAvatar 
}: CollapsibleSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 240 : 60 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full bg-[#0a0a0a] border-r border-[#2a2a2a] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#2a2a2a]">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="logo-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#ff8555] flex items-center justify-center">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-[#ff6b35] text-lg tracking-tight" style={{ fontFamily: 'var(--font-logo)' }}>SYNTAX</span>
            </motion.div>
          ) : (
            <motion.div
              key="logo-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#ff8555] flex items-center justify-center mx-auto"
            >
              <Music2 className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8 rounded-lg hover:bg-[#1a1a1a] flex items-center justify-center text-[#808080] hover:text-white transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#ff6b35] text-white'
                    : 'text-[#808080] hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isExpanded ? '' : 'mx-auto'}`} />
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a1a]" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section - Credits & User */}
      <div className="border-t border-[#2a2a2a]">
        {/* Credits */}
        <div className={`p-3 border-b border-[#2a2a2a] ${isExpanded ? '' : 'flex justify-center'}`}>
          <div className="relative group">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] ${
              isExpanded ? '' : 'justify-center'
            }`}>
              <Coins className="w-4 h-4 text-[#ff6b35] flex-shrink-0" />
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <span className="text-sm font-medium text-white whitespace-nowrap">
                      {credits} credits
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tooltip for credits in collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50">
                {credits} credits
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a1a]" />
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-3">
          <div className="relative group">
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer ${
              isExpanded ? '' : 'justify-center'
            }`}>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8555] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden min-w-0 flex-1"
                  >
                    <p className="text-sm font-medium text-white truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-[#808080]">Pro Plan</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tooltip for user in collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50">
                <p className="text-white font-medium">{userName}</p>
                <p className="text-xs text-[#808080]">Pro Plan</p>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a1a]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}