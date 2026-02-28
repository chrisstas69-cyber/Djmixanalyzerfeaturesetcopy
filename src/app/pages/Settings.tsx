import React, { useState } from 'react';
import { ChevronDown, Cloud, Trash2 } from 'lucide-react';

type TabId = 'playback' | 'display' | 'notifications' | 'privacy' | 'storage';

interface SettingsState {
  // Playback
  defaultDuration: '30s' | '1min' | '3min' | '5min';
  defaultGenre: string;
  defaultEnergyLevel: string;
  autoSave: boolean;
  enableCrossfade: boolean;
  enableFadeOut: boolean;
  
  // Display
  theme: 'dark' | 'darker';
  particleEffects: boolean;
  glowEffects: boolean;
  animations: boolean;
  
  // Notifications
  trackComplete: boolean;
  mixReady: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  
  // Privacy
  profileVisibility: string;
  showStats: boolean;
  allowAnalytics: boolean;
  
  // Storage
  externalStorage: boolean;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('playback');
  const [settings, setSettings] = useState<SettingsState>({
    defaultDuration: '3min',
    defaultGenre: 'Progressive House',
    defaultEnergyLevel: 'High (7-10)',
    autoSave: true,
    enableCrossfade: false,
    enableFadeOut: false,
    theme: 'dark',
    particleEffects: true,
    glowEffects: true,
    animations: true,
    trackComplete: true,
    mixReady: true,
    systemUpdates: false,
    emailNotifications: true,
    profileVisibility: 'Public',
    showStats: true,
    allowAnalytics: true,
    externalStorage: false,
  });

  const handleReset = () => {
    setSettings({
      defaultDuration: '3min',
      defaultGenre: 'Progressive House',
      defaultEnergyLevel: 'High (7-10)',
      autoSave: true,
      enableCrossfade: false,
      enableFadeOut: false,
      theme: 'dark',
      particleEffects: true,
      glowEffects: true,
      animations: true,
      trackComplete: true,
      mixReady: true,
      systemUpdates: false,
      emailNotifications: true,
      profileVisibility: 'Public',
      showStats: true,
      allowAnalytics: true,
      externalStorage: false,
    });
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange 
  }: { 
    enabled: boolean; 
    onChange: (enabled: boolean) => void;
  }) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`
          w-11 h-6 rounded-full transition-all duration-300
          ${enabled ? 'bg-[#00D9FF]' : 'bg-white/20'}
          peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00D9FF]/50
        `}>
          <div className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `} />
        </div>
      </label>
    );
  };

  const Dropdown = ({ 
    value, 
    options, 
    onChange 
  }: { 
    value: string; 
    options: string[]; 
    onChange: (value: string) => void;
  }) => {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-[#00D9FF]/50 transition-colors"
        >
          {options.map(option => (
            <option key={option} value={option} className="bg-[#0A0E1A]">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
      </div>
    );
  };

  const renderPlaybackTab = () => (
    <div className="space-y-10">
      {/* Default Duration */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <label className="block text-sm text-white/80 mb-2">Default Duration</label>
        <div className="flex gap-6">
          {(['30s', '1min', '3min', '5min'] as const).map((duration) => (
            <button
              key={duration}
              onClick={() => setSettings({ ...settings, defaultDuration: duration })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                settings.defaultDuration === duration
                  ? 'bg-[#00D9FF] text-white'
                  : 'bg-white/5 text-white/60 hover:text-white/80'
              }`}
            >
              {duration}
            </button>
          ))}
        </div>
      </div>

      {/* Default Genre */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <label className="block text-sm text-white/80 mb-2">Default Genre</label>
        <Dropdown
          value={settings.defaultGenre}
          options={['Progressive House', 'Tech House', 'Deep House', 'Techno', 'Melodic Techno']}
          onChange={(value) => setSettings({ ...settings, defaultGenre: value })}
        />
      </div>

      {/* Default Energy Level */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <label className="block text-sm text-white/80 mb-2">Default Energy Level</label>
        <Dropdown
          value={settings.defaultEnergyLevel}
          options={['Low (1-3)', 'Medium (4-6)', 'High (7-10)']}
          onChange={(value) => setSettings({ ...settings, defaultEnergyLevel: value })}
        />
      </div>

      {/* Auto-save */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Auto-save</label>
            <p className="text-xs text-white/40">Automatically save your work as you create</p>
          </div>
          <ToggleSwitch
            enabled={settings.autoSave}
            onChange={(enabled) => setSettings({ ...settings, autoSave: enabled })}
          />
        </div>
      </div>

      {/* Enable crossfade */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Enable crossfade</label>
            <p className="text-xs text-white/40">Smooth transitions between tracks</p>
          </div>
          <ToggleSwitch
            enabled={settings.enableCrossfade}
            onChange={(enabled) => setSettings({ ...settings, enableCrossfade: enabled })}
          />
        </div>
      </div>

      {/* Enable fade out */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Enable fade out</label>
            <p className="text-xs text-white/40">Fade tracks out at the end</p>
          </div>
          <ToggleSwitch
            enabled={settings.enableFadeOut}
            onChange={(enabled) => setSettings({ ...settings, enableFadeOut: enabled })}
          />
        </div>
      </div>
    </div>
  );

  const renderDisplayTab = () => (
    <div className="space-y-10">
      {/* Theme */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <label className="block text-sm text-white/80 mb-4">Theme</label>
        <div className="flex gap-6">
          <button
            onClick={() => setSettings({ ...settings, theme: 'dark' })}
            className={`flex-1 py-4 rounded-lg font-medium transition-all ${
              settings.theme === 'dark'
                ? 'bg-[#00D9FF] text-white'
                : 'bg-white/5 text-white/60 hover:text-white/80'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setSettings({ ...settings, theme: 'darker' })}
            className={`flex-1 py-4 rounded-lg font-medium transition-all ${
              settings.theme === 'darker'
                ? 'bg-[#00D9FF] text-white'
                : 'bg-white/5 text-white/60 hover:text-white/80'
            }`}
          >
            Darker
          </button>
        </div>
      </div>

      {/* Visual Effects */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Particle Effects</label>
            <p className="text-xs text-white/40">Add visual effects to enhance the user experience</p>
          </div>
          <ToggleSwitch
            enabled={settings.particleEffects}
            onChange={(enabled) => setSettings({ ...settings, particleEffects: enabled })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Glow Effects</label>
            <p className="text-xs text-white/40">Add glowing elements to the interface</p>
          </div>
          <ToggleSwitch
            enabled={settings.glowEffects}
            onChange={(enabled) => setSettings({ ...settings, glowEffects: enabled })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Animations</label>
            <p className="text-xs text-white/40">Enable smooth animations for a better user experience</p>
          </div>
          <ToggleSwitch
            enabled={settings.animations}
            onChange={(enabled) => setSettings({ ...settings, animations: enabled })}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-10">
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Track Complete</label>
            <p className="text-xs text-white/40">Notify when a track is complete</p>
          </div>
          <ToggleSwitch
            enabled={settings.trackComplete}
            onChange={(enabled) => setSettings({ ...settings, trackComplete: enabled })}
          />
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Mix Ready</label>
            <p className="text-xs text-white/40">Notify when a mix is ready</p>
          </div>
          <ToggleSwitch
            enabled={settings.mixReady}
            onChange={(enabled) => setSettings({ ...settings, mixReady: enabled })}
          />
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">System Updates</label>
            <p className="text-xs text-white/40">Notify about system updates</p>
          </div>
          <ToggleSwitch
            enabled={settings.systemUpdates}
            onChange={(enabled) => setSettings({ ...settings, systemUpdates: enabled })}
          />
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Email Notifications</label>
            <p className="text-xs text-white/40">Receive notifications via email</p>
          </div>
          <ToggleSwitch
            enabled={settings.emailNotifications}
            onChange={(enabled) => setSettings({ ...settings, emailNotifications: enabled })}
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-10">
      {/* Profile Visibility */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <label className="block text-sm text-white/80 mb-2">Profile Visibility</label>
        <Dropdown
          value={settings.profileVisibility}
          options={['Public', 'Private', 'Friends Only']}
          onChange={(value) => setSettings({ ...settings, profileVisibility: value })}
        />
      </div>

      {/* Show Stats */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Show Stats</label>
            <p className="text-xs text-white/40">Display statistics on your profile</p>
          </div>
          <ToggleSwitch
            enabled={settings.showStats}
            onChange={(enabled) => setSettings({ ...settings, showStats: enabled })}
          />
        </div>
      </div>

      {/* Allow Analytics */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Allow Analytics</label>
            <p className="text-xs text-white/40">Allow the collection of usage data</p>
          </div>
          <ToggleSwitch
            enabled={settings.allowAnalytics}
            onChange={(enabled) => setSettings({ ...settings, allowAnalytics: enabled })}
          />
        </div>
      </div>
    </div>
  );

  const renderStorageTab = () => (
    <div className="space-y-10">
      {/* Storage Usage */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <label className="block text-sm text-white/80 mb-2">Storage Usage</label>
        <p className="text-xs text-white/40 mb-4">2.4 GB used of 10 GB total</p>
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            style={{ width: '24%' }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-white/60">0 GB</span>
          <span className="text-xs font-medium text-[#00D9FF]">24.0% used</span>
          <span className="text-xs text-white/60">10 GB</span>
        </div>
      </div>

      {/* Clear Cache */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-white/80 mb-1">Clear Cache</label>
            <p className="text-xs text-white/40">Free up space by clearing temporary files</p>
          </div>
          <button className="px-4 py-2.5 rounded-lg border border-[#00D9FF] text-white text-sm font-medium hover:bg-[#00D9FF]/10 transition-colors">
            CLEAR
          </button>
        </div>
      </div>

      {/* External Storage */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-white/60" />
            <div>
              <label className="block text-sm text-white/80 mb-1">External Storage</label>
              <p className="text-xs text-white/40">Link external drives or cloud storage to expand capacity</p>
            </div>
          </div>
          <ToggleSwitch
            enabled={settings.externalStorage}
            onChange={(enabled) => setSettings({ ...settings, externalStorage: enabled })}
          />
        </div>
      </div>

      {/* Delete All Data */}
      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm text-red-400 mb-1">Delete All Data</label>
            <p className="text-xs text-white/40">Permanently removes all tracks, mixes, and settings</p>
          </div>
          <button className="px-4 py-2.5 rounded-lg border border-orange-500 text-white text-sm font-medium hover:bg-orange-500/10 transition-colors">
            DELETE
          </button>
        </div>
      </div>
    </div>
  );

  const tabs: { id: TabId; label: string }[] = [
    { id: 'playback', label: 'Playback' },
    { id: 'display', label: 'Display' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'storage', label: 'Storage' },
  ];

  return (
    <div className="w-full flex justify-center py-16">
      <div className="w-full max-w-[1400px] px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/20 hover:text-white/40 hover:bg-white/10 transition-colors"
          >
            Reset to Default
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-white/40 text-sm mb-8">Professional DAW Mixer & AI Track Generation</p>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-[#00D9FF]'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00D9FF]" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mb-8 max-w-[1100px] mx-auto">
          {activeTab === 'playback' && renderPlaybackTab()}
          {activeTab === 'display' && renderDisplayTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'privacy' && renderPrivacyTab()}
          {activeTab === 'storage' && renderStorageTab()}
        </div>

        {/* Apply Changes Button */}
        <div className="flex justify-end">
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:scale-[1.02] transition-transform"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
