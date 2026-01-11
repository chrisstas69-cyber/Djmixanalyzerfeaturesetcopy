"use client";

import { useState, useEffect } from "react";
import { Settings, Music, Monitor, Keyboard, Save, Volume2, Bell, Shield, Database } from "lucide-react";
import { toast } from "sonner";

interface UserPreferences {
  defaultDuration: string;
  defaultGenre: string;
  defaultEnergy: string;
  autoSaveToFavorites: boolean;
}

interface DisplaySettings {
  theme: "dark" | "light";
  fontSize: "small" | "medium" | "large";
  viewMode: "compact" | "expanded";
}

interface KeyboardShortcut {
  action: string;
  shortcut: string;
  editable: boolean;
}

export function SettingsPanel() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultDuration: "5–6 min",
    defaultGenre: "House",
    defaultEnergy: "Peak",
    autoSaveToFavorites: false,
  });

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: "dark",
    fontSize: "medium",
    viewMode: "expanded",
  });

  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([
    { action: "Generate Track", shortcut: "Cmd+G", editable: true },
    { action: "Save to Library", shortcut: "Cmd+S", editable: true },
    { action: "Export Track", shortcut: "Cmd+E", editable: true },
    { action: "Search Tracks", shortcut: "Cmd+/", editable: true },
    { action: "Show Help", shortcut: "Cmd+?", editable: true },
  ]);

  const [editingShortcut, setEditingShortcut] = useState<string | null>(null);
  const [newShortcut, setNewShortcut] = useState("");
  const [activeSection, setActiveSection] = useState("preferences");

  // Load settings from localStorage
  useEffect(() => {
    try {
      const prefsStr = localStorage.getItem('userPreferences');
      if (prefsStr) {
        setPreferences(JSON.parse(prefsStr));
      }

      const displayStr = localStorage.getItem('displaySettings');
      if (displayStr) {
        setDisplaySettings(JSON.parse(displayStr));
      }

      const shortcutsStr = localStorage.getItem('keyboardShortcuts');
      if (shortcutsStr) {
        setShortcuts(JSON.parse(shortcutsStr));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Apply theme globally
  useEffect(() => {
    const root = document.documentElement;
    if (displaySettings.theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [displaySettings.theme]);

  // Save preferences
  const savePreferences = () => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      localStorage.setItem('displaySettings', JSON.stringify(displaySettings));
      localStorage.setItem('keyboardShortcuts', JSON.stringify(shortcuts));
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    }
  };

  // Handle shortcut edit
  const startEditingShortcut = (action: string) => {
    const shortcut = shortcuts.find(s => s.action === action);
    if (shortcut) {
      setEditingShortcut(action);
      setNewShortcut(shortcut.shortcut);
    }
  };

  const saveShortcut = (action: string) => {
    setShortcuts(prev => prev.map(s => 
      s.action === action ? { ...s, shortcut: newShortcut } : s
    ));
    setEditingShortcut(null);
    setNewShortcut("");
    toast.success(`Shortcut updated for ${action}`);
  };

  const sections = [
    { id: "preferences", label: "Preferences", icon: Music },
    { id: "display", label: "Display", icon: Monitor },
    { id: "audio", label: "Audio", icon: Volume2 },
    { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "storage", label: "Storage", icon: Database },
  ];

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-darkest, #080808)' }}>
      {/* Header */}
      <div 
        className="px-8 py-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl font-semibold tracking-tight mb-1"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
            >
              Settings
            </h1>
            <p 
              className="text-sm"
              style={{ color: 'var(--text-secondary, #a0a0a0)' }}
            >
              Customize your SYNTAX experience
            </p>
          </div>
          <button
            onClick={savePreferences}
            className="h-10 px-5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            style={{ 
              background: 'var(--accent-primary, #00bcd4)', 
              color: 'var(--bg-darkest, #080808)',
              boxShadow: 'var(--shadow-glow-cyan, 0 0 20px rgba(0, 188, 212, 0.3))'
            }}
          >
            <Save className="w-4 h-4" />
            <span>Save All</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Settings Nav */}
        <div 
          className="w-56 flex-shrink-0 py-4 overflow-y-auto"
          style={{ 
            background: 'var(--bg-darker, #0a0a0a)',
            borderRight: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
          }}
        >
          <nav className="space-y-1 px-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeSection === section.id ? 'var(--accent-primary-subtle, rgba(0, 188, 212, 0.1))' : 'transparent',
                  color: activeSection === section.id ? 'var(--accent-primary, #00bcd4)' : 'var(--text-secondary, #a0a0a0)',
                  borderLeft: activeSection === section.id ? '3px solid var(--accent-primary, #00bcd4)' : '3px solid transparent'
                }}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* User Preferences */}
            {activeSection === "preferences" && (
              <div className="space-y-6">
                <h2 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
                >
                  User Preferences
                </h2>
                
                <div 
                  className="rounded-xl p-6 space-y-6"
                  style={{ 
                    background: 'var(--bg-card, #161616)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                  }}
                >
                  <div>
                    <label 
                      className="block text-sm font-medium mb-3"
                      style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                    >
                      Default Duration
                    </label>
                    <div className="flex gap-2">
                      {["3–4 min", "5–6 min", "7–8 min"].map((option) => (
                        <button
                          key={option}
                          onClick={() => setPreferences(prev => ({ ...prev, defaultDuration: option }))}
                          className="flex-1 h-10 rounded-lg text-sm font-medium transition-all"
                          style={{
                            background: preferences.defaultDuration === option ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
                            color: preferences.defaultDuration === option ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
                            border: `1px solid ${preferences.defaultDuration === option ? 'var(--accent-primary, #00bcd4)' : 'var(--border-subtle, rgba(255, 255, 255, 0.06))'}`
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-3"
                      style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                    >
                      Default Genre
                    </label>
                    <select
                      value={preferences.defaultGenre}
                      onChange={(e) => setPreferences(prev => ({ ...prev, defaultGenre: e.target.value }))}
                      className="w-full h-10 px-4 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none"
                      style={{ 
                        background: 'var(--bg-dark, #0d0d0d)',
                        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                        color: 'var(--text-primary, #ffffff)'
                      }}
                    >
                      <option value="House">House</option>
                      <option value="Techno">Techno</option>
                      <option value="Deep House">Deep House</option>
                      <option value="Ambient">Ambient</option>
                    </select>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-3"
                      style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                    >
                      Default Energy Level
                    </label>
                    <select
                      value={preferences.defaultEnergy}
                      onChange={(e) => setPreferences(prev => ({ ...prev, defaultEnergy: e.target.value }))}
                      className="w-full h-10 px-4 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none"
                      style={{ 
                        background: 'var(--bg-dark, #0d0d0d)',
                        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                        color: 'var(--text-primary, #ffffff)'
                      }}
                    >
                      <option value="Rising">Rising</option>
                      <option value="Peak">Peak</option>
                      <option value="Building">Building</option>
                      <option value="Chill">Chill</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1"
                        style={{ color: 'var(--text-primary, #ffffff)' }}
                      >
                        Auto-Save to Favorites
                      </label>
                      <p 
                        className="text-xs"
                        style={{ color: 'var(--text-tertiary, #666666)' }}
                      >
                        Automatically favorite tracks when saved
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, autoSaveToFavorites: !prev.autoSaveToFavorites }))}
                      className="w-12 h-6 rounded-full transition-all relative"
                      style={{
                        background: preferences.autoSaveToFavorites ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-lighter, #222222)'
                      }}
                    >
                      <div 
                        className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
                        style={{
                          background: 'var(--text-primary, #ffffff)',
                          transform: preferences.autoSaveToFavorites ? 'translateX(26px)' : 'translateX(2px)'
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeSection === "display" && (
              <div className="space-y-6">
                <h2 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
                >
                  Display Settings
                </h2>
                
                <div 
                  className="rounded-xl p-6 space-y-6"
                  style={{ 
                    background: 'var(--bg-card, #161616)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                  }}
                >
                  <div>
                    <label 
                      className="block text-sm font-medium mb-3"
                      style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                    >
                      Theme
                    </label>
                    <div className="flex gap-2">
                      {(["dark", "light"] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setDisplaySettings(prev => ({ ...prev, theme }))}
                          className="flex-1 h-10 rounded-lg text-sm font-medium capitalize transition-all"
                          style={{
                            background: displaySettings.theme === theme ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
                            color: displaySettings.theme === theme ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
                            border: `1px solid ${displaySettings.theme === theme ? 'var(--accent-primary, #00bcd4)' : 'var(--border-subtle, rgba(255, 255, 255, 0.06))'}`
                          }}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-3"
                      style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                    >
                      Font Size
                    </label>
                    <div className="flex gap-2">
                      {(["small", "medium", "large"] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setDisplaySettings(prev => ({ ...prev, fontSize: size }))}
                          className="flex-1 h-10 rounded-lg text-sm font-medium capitalize transition-all"
                          style={{
                            background: displaySettings.fontSize === size ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
                            color: displaySettings.fontSize === size ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
                            border: `1px solid ${displaySettings.fontSize === size ? 'var(--accent-primary, #00bcd4)' : 'var(--border-subtle, rgba(255, 255, 255, 0.06))'}`
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-3"
                      style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                    >
                      View Mode
                    </label>
                    <div className="flex gap-2">
                      {(["compact", "expanded"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setDisplaySettings(prev => ({ ...prev, viewMode: mode }))}
                          className="flex-1 h-10 rounded-lg text-sm font-medium capitalize transition-all"
                          style={{
                            background: displaySettings.viewMode === mode ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
                            color: displaySettings.viewMode === mode ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
                            border: `1px solid ${displaySettings.viewMode === mode ? 'var(--accent-primary, #00bcd4)' : 'var(--border-subtle, rgba(255, 255, 255, 0.06))'}`
                          }}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Settings */}
            {activeSection === "audio" && (
              <div className="space-y-6">
                <h2 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
                >
                  Audio Settings
                </h2>
                
                <div 
                  className="rounded-xl p-6 space-y-6"
                  style={{ 
                    background: 'var(--bg-card, #161616)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                  }}
                >
                  <div>
                    <label 
                      className="block text-sm font-medium mb-3"
                      style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                    >
                      Output Device
                    </label>
                    <select
                      className="w-full h-10 px-4 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none"
                      style={{ 
                        background: 'var(--bg-dark, #0d0d0d)',
                        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                        color: 'var(--text-primary, #ffffff)'
                      }}
                    >
                      <option>Default System Output</option>
                      <option>External Audio Interface</option>
                      <option>Headphones</option>
                    </select>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-3"
                      style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                    >
                      Audio Quality
                    </label>
                    <div className="flex gap-2">
                      {["Standard", "High", "Lossless"].map((quality) => (
                        <button
                          key={quality}
                          className="flex-1 h-10 rounded-lg text-sm font-medium transition-all"
                          style={{
                            background: quality === "High" ? 'var(--accent-primary, #00bcd4)' : 'var(--bg-medium, #111111)',
                            color: quality === "High" ? 'var(--bg-darkest, #080808)' : 'var(--text-secondary, #a0a0a0)',
                            border: `1px solid ${quality === "High" ? 'var(--accent-primary, #00bcd4)' : 'var(--border-subtle, rgba(255, 255, 255, 0.06))'}`
                          }}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Keyboard Shortcuts */}
            {activeSection === "shortcuts" && (
              <div className="space-y-6">
                <h2 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
                >
                  Keyboard Shortcuts
                </h2>
                
                <div 
                  className="rounded-xl p-6"
                  style={{ 
                    background: 'var(--bg-card, #161616)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                  }}
                >
                  <div className="space-y-3">
                    {shortcuts.map((shortcut) => (
                      <div 
                        key={shortcut.action} 
                        className="flex items-center justify-between py-3"
                        style={{ borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))' }}
                      >
                        <span 
                          className="text-sm"
                          style={{ color: 'var(--text-primary, #ffffff)' }}
                        >
                          {shortcut.action}
                        </span>
                        {editingShortcut === shortcut.action ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newShortcut}
                              onChange={(e) => setNewShortcut(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveShortcut(shortcut.action);
                                } else if (e.key === "Escape") {
                                  setEditingShortcut(null);
                                  setNewShortcut("");
                                }
                              }}
                              className="h-8 px-3 rounded text-xs focus:outline-none"
                              style={{ 
                                background: 'var(--bg-dark, #0d0d0d)',
                                border: '1px solid var(--accent-primary, #00bcd4)',
                                color: 'var(--text-primary, #ffffff)',
                                fontFamily: 'JetBrains Mono, monospace'
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => saveShortcut(shortcut.action)}
                              className="h-8 px-3 rounded text-xs font-medium"
                              style={{ 
                                background: 'var(--accent-primary, #00bcd4)', 
                                color: 'var(--bg-darkest, #080808)'
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingShortcut(null);
                                setNewShortcut("");
                              }}
                              className="h-8 px-3 rounded text-xs font-medium"
                              style={{ 
                                background: 'var(--bg-medium, #111111)',
                                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                                color: 'var(--text-secondary, #a0a0a0)'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <kbd 
                              className="px-2 py-1 text-xs font-semibold rounded"
                              style={{ 
                                background: 'var(--bg-lighter, #222222)',
                                border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.1))',
                                color: 'var(--text-primary, #ffffff)',
                                fontFamily: 'JetBrains Mono, monospace'
                              }}
                            >
                              {shortcut.shortcut}
                            </kbd>
                            {shortcut.editable && (
                              <button
                                onClick={() => startEditingShortcut(shortcut.action)}
                                className="text-xs transition-colors"
                                style={{ color: 'var(--accent-primary, #00bcd4)' }}
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <h2 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
                >
                  Notifications
                </h2>
                
                <div 
                  className="rounded-xl p-6 space-y-4"
                  style={{ 
                    background: 'var(--bg-card, #161616)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                  }}
                >
                  {["Track Generation Complete", "Mix Export Ready", "New Features", "System Updates"].map((item) => (
                    <div key={item} className="flex items-center justify-between py-2">
                      <span style={{ color: 'var(--text-primary, #ffffff)' }}>{item}</span>
                      <button
                        className="w-12 h-6 rounded-full transition-all relative"
                        style={{ background: 'var(--accent-primary, #00bcd4)' }}
                      >
                        <div 
                          className="absolute top-0.5 w-5 h-5 rounded-full"
                          style={{
                            background: 'var(--text-primary, #ffffff)',
                            transform: 'translateX(26px)'
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeSection === "privacy" && (
              <div className="space-y-6">
                <h2 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
                >
                  Privacy & Security
                </h2>
                
                <div 
                  className="rounded-xl p-6 space-y-4"
                  style={{ 
                    background: 'var(--bg-card, #161616)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                  }}
                >
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span style={{ color: 'var(--text-primary, #ffffff)' }}>Analytics</span>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary, #666666)' }}>
                        Help improve SYNTAX with usage data
                      </p>
                    </div>
                    <button
                      className="w-12 h-6 rounded-full transition-all relative"
                      style={{ background: 'var(--accent-primary, #00bcd4)' }}
                    >
                      <div 
                        className="absolute top-0.5 w-5 h-5 rounded-full"
                        style={{
                          background: 'var(--text-primary, #ffffff)',
                          transform: 'translateX(26px)'
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Storage */}
            {activeSection === "storage" && (
              <div className="space-y-6">
                <h2 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
                >
                  Storage & Data
                </h2>
                
                <div 
                  className="rounded-xl p-6 space-y-6"
                  style={{ 
                    background: 'var(--bg-card, #161616)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                  }}
                >
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: 'var(--text-secondary, #a0a0a0)' }}>Storage Used</span>
                      <span 
                        style={{ 
                          color: 'var(--accent-primary, #00bcd4)',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}
                      >
                        2.4 GB / 10 GB
                      </span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'var(--bg-medium, #111111)' }}
                    >
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '24%',
                          background: 'var(--accent-primary, #00bcd4)'
                        }}
                      />
                    </div>
                  </div>
                  
                  <button
                    className="w-full h-10 rounded-lg text-sm font-medium transition-all"
                    style={{ 
                      background: 'var(--bg-medium, #111111)',
                      border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                      color: 'var(--text-secondary, #a0a0a0)'
                    }}
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
