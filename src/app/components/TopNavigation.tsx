import React, { useState } from 'react';
import { Coins, ChevronDown } from 'lucide-react';

interface TopNavigationProps {
  currentTab: 'generator' | 'library' | 'dna-library' | 'tracks' | 'analysis';
  onTabChange: (tab: 'generator' | 'library' | 'dna-library' | 'tracks' | 'analysis') => void;
  credits: number;
  userName: string;
  userAvatar?: string;
  onSettings: () => void;
  onBilling: () => void;
  onAPIKeys: () => void;
  onLogout: () => void;
}

export function TopNavigation({
  currentTab,
  onTabChange,
  credits,
  userName,
  userAvatar,
  onSettings,
  onBilling,
  onAPIKeys,
  onLogout
}: TopNavigationProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const tabs = [
    { id: 'generator' as const, label: 'Generator' },
    { id: 'library' as const, label: 'Library' },
    { id: 'dna-library' as const, label: 'DNA Library' },
    { id: 'tracks' as const, label: 'Tracks' },
    { id: 'analysis' as const, label: 'Analysis' }
  ];

  return (
    <div className="h-[60px] bg-[#0a0a0a] border-b border-gray-800 flex-shrink-0">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ff6b35] rounded flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5 text-black"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <span className="text-[#ff6b35] tracking-wider font-semibold">SYNTAX</span>
        </div>

        {/* Center - Navigation Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-2 text-sm transition-colors ${
                currentTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
              {currentTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff6b35]" />
              )}
            </button>
          ))}
        </div>

        {/* Right - Credits + Profile */}
        <div className="flex items-center gap-4">
          {/* Credits */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-lg border border-gray-800">
            <Coins className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-sm text-white">{credits.toLocaleString()} credits</span>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#ff6b35] flex items-center justify-center">
                  <span className="text-sm text-black font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                isProfileMenuOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] rounded-lg border border-gray-800 shadow-xl z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm text-white font-medium">{userName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Pro Plan</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onSettings();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onBilling();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Billing
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onAPIKeys();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      API Keys
                    </button>
                  </div>
                  <div className="border-t border-gray-800">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#ff6b35] hover:bg-gray-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}