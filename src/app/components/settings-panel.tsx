import { useState, useEffect } from "react";
import { Settings, Music, Monitor, Keyboard, Save } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "./ui/slider";

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

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1">Settings & Preferences</h1>
            <p className="text-xs text-white/40">
              Customize your DJ Mix Analyzer experience
            </p>
          </div>
          <button
            onClick={savePreferences}
            className="h-9 px-4 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">User Preferences</h2>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Default Duration</label>
                <div className="flex gap-2">
                  {["3–4 min", "5–6 min", "7–8 min"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setPreferences(prev => ({ ...prev, defaultDuration: option }))}
                      className={`flex-1 h-10 rounded-lg font-medium transition-all ${
                        preferences.defaultDuration === option
                          ? "bg-primary/20 border-primary text-primary border"
                          : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Default Genre</label>
                <select
                  value={preferences.defaultGenre}
                  onChange={(e) => setPreferences(prev => ({ ...prev, defaultGenre: e.target.value }))}
                  className="w-full h-10 px-4 rounded-lg border border-white/10 bg-black/40 text-white appearance-none cursor-pointer focus:border-primary/50 focus:ring-primary/20"
                >
                  <option value="House">House</option>
                  <option value="Techno">Techno</option>
                  <option value="Deep House">Deep House</option>
                  <option value="Ambient">Ambient</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Default Energy Level</label>
                <select
                  value={preferences.defaultEnergy}
                  onChange={(e) => setPreferences(prev => ({ ...prev, defaultEnergy: e.target.value }))}
                  className="w-full h-10 px-4 rounded-lg border border-white/10 bg-black/40 text-white appearance-none cursor-pointer focus:border-primary/50 focus:ring-primary/20"
                >
                  <option value="Rising">Rising</option>
                  <option value="Peak">Peak</option>
                  <option value="Building">Building</option>
                  <option value="Chill">Chill</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Auto-Save to Favorites</label>
                  <p className="text-xs text-white/50">Automatically favorite tracks when saved</p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, autoSaveToFavorites: !prev.autoSaveToFavorites }))}
                  className={`w-12 h-6 rounded-full transition-all ${
                    preferences.autoSaveToFavorites ? "bg-primary" : "bg-white/10"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.autoSaveToFavorites ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Display Settings</h2>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Theme</label>
                <div className="flex gap-2">
                  {(["dark", "light"] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setDisplaySettings(prev => ({ ...prev, theme }))}
                      className={`flex-1 h-10 rounded-lg font-medium transition-all capitalize ${
                        displaySettings.theme === theme
                          ? "bg-primary/20 border-primary text-primary border"
                          : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Font Size</label>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setDisplaySettings(prev => ({ ...prev, fontSize: size }))}
                      className={`flex-1 h-10 rounded-lg font-medium transition-all capitalize ${
                        displaySettings.fontSize === size
                          ? "bg-primary/20 border-primary text-primary border"
                          : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">View Mode</label>
                <div className="flex gap-2">
                  {(["compact", "expanded"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDisplaySettings(prev => ({ ...prev, viewMode: mode }))}
                      className={`flex-1 h-10 rounded-lg font-medium transition-all capitalize ${
                        displaySettings.viewMode === mode
                          ? "bg-primary/20 border-primary text-primary border"
                          : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Editor */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="space-y-3">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.action} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                    <span className="text-sm text-white/80">{shortcut.action}</span>
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
                          className="h-8 px-3 rounded border border-white/10 bg-black/40 text-white text-xs font-['IBM_Plex_Mono'] focus:border-primary/50 focus:ring-primary/20 outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveShortcut(shortcut.action)}
                          className="h-8 px-3 rounded bg-primary hover:bg-primary/80 text-white text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingShortcut(null);
                            setNewShortcut("");
                          }}
                          className="h-8 px-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <kbd className="px-2 py-1 text-xs font-semibold text-white bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                          {shortcut.shortcut}
                        </kbd>
                        {shortcut.editable && (
                          <button
                            onClick={() => startEditingShortcut(shortcut.action)}
                            className="text-xs text-white/50 hover:text-white transition-colors"
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
        </div>
      </div>
    </div>
  );
}

