import React from 'react';
import { 
  Home, 
  Zap, 
  Folder, 
  Briefcase, 
  BarChart3, 
  Dna, 
  Activity, 
  Sliders, 
  Scissors, 
  Download, 
  Disc3, 
  SlidersHorizontal,
  Music,
  Flame
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  subItem?: {
    label: string;
    icon: React.ReactNode;
  };
}

interface ProfessionalSidebarProps {
  onNavigate?: (itemId: string) => void;
}

export function ProfessionalSidebar({ onNavigate }: ProfessionalSidebarProps) {
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'HOME',
      icon: <Home className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'create',
      label: 'CREATE',
      icon: <Zap className="w-4 h-4" />,
      isActive: true,
      subItem: {
        label: 'Generator',
        icon: <Activity className="w-3.5 h-3.5" />
      }
    },
    {
      id: 'library',
      label: 'LIBRARY',
      icon: <Folder className="w-4 h-4" />,
      isActive: true,
      subItem: {
        label: 'My Library',
        icon: <Music className="w-3.5 h-3.5" />
      }
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      icon: <Briefcase className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'analysis',
      label: 'ANALYSIS',
      icon: <BarChart3 className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'dna',
      label: 'MY MUSIC DNA',
      icon: <Dna className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'waveforms',
      label: 'WAVEFORMS DEMO',
      icon: <Activity className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'mastering',
      label: 'PROFESSIONAL MASTERING',
      icon: <Sliders className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'cue-editor',
      label: 'CUE EDITOR',
      icon: <Scissors className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'bottom-ripper',
      label: 'BOTTOM RIPPER',
      icon: <Download className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'edit-dj',
      label: 'EDIT DJ',
      icon: <Disc3 className="w-4 h-4" />,
      isActive: false,
    },
    {
      id: 'auto-dj',
      label: 'AUTO DJ MIXER',
      icon: <SlidersHorizontal className="w-4 h-4" />,
      isActive: false,
    },
  ];

  return (
    <div className="w-[240px] h-[1080px] bg-[#121212] flex flex-col">
      
      {/* TOP SECTION - Logo */}
      <div className="h-[80px] bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center pl-6">
        <div className="flex items-center gap-3">
          {/* Flame Icon with Orange/Red Gradient */}
          <div className="relative">
            <Flame className="w-8 h-8 text-[#ff6b35]" fill="#ff6b35" />
          </div>
          
          {/* SYNTAX Text */}
          <div className="flex items-center">
            <span className="text-white font-bold text-2xl">SYN</span>
            <span className="text-[#ff6b35] font-bold text-2xl">TAX</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 overflow-y-auto pt-5 pb-5">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <div key={item.id}>
              {/* Main Navigation Item */}
              <button
                onClick={() => onNavigate?.(item.id)}
                className={`w-full h-[44px] flex items-center gap-3 px-4 py-3 transition-colors relative ${
                  item.isActive
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]/50'
                }`}
              >
                {/* Active Left Border */}
                {item.isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6b35]" />
                )}
                
                {/* Icon */}
                <div className={item.isActive ? 'text-[#ff6b35]' : 'text-[#888888]'}>
                  {item.icon}
                </div>
                
                {/* Label */}
                <span className={`text-sm ${item.isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>

              {/* Sub-Item (if exists and parent is active) */}
              {item.subItem && item.isActive && (
                <button
                  onClick={() => onNavigate?.(`${item.id}-sub`)}
                  className="w-full h-[36px] flex items-center gap-2 pl-12 py-2 text-[#888888] hover:text-white transition-colors"
                >
                  {/* Sub-item Icon */}
                  <div className="text-[#888888]">
                    {item.subItem.icon}
                  </div>
                  
                  {/* Sub-item Label */}
                  <span className="text-sm">
                    {item.subItem.label}
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* BOTTOM SECTION */}
      <div className="bg-[#0a0a0a] border-t border-[#1a1a1a] p-5">
        {/* Credits Badge */}
        <div className="mb-5 flex justify-center">
          <div 
            className="w-[200px] h-[48px] rounded-[24px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)',
              boxShadow: '0px 4px 12px rgba(255, 107, 53, 0.3)'
            }}
          >
            <span className="text-white font-bold text-sm">💰 450 credits</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-[#ff6b35] overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
              <span className="text-white text-lg font-bold">JD</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <p className="text-white font-bold">John Doe</p>
            <p className="text-[#666666] text-xs">john@syntax.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
