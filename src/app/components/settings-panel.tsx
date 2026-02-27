import React from 'react';
import { Settings, Bell, Shield, Palette, Zap } from 'lucide-react';

const SettingsPanel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] px-16 py-12">
      <div className="w-full max-w-[1400px]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your SYNTAX experience</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-[#FF6B00]" />
              <h2 className="text-xl font-semibold text-white">General</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Auto-save projects</p>
                  <p className="text-sm text-gray-400">Automatically save your work every 5 minutes</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-full h-full bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#00E5FF]" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email notifications</p>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-full h-full bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E5FF]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-[#FF6B00]" />
              <h2 className="text-xl font-semibold text-white">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Theme</label>
                <select className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50">
                  <option>Dark (Orange/Cyan)</option>
                  <option>Dark Classic</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#00E5FF]" />
              <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Profile visibility</p>
                  <p className="text-sm text-gray-400">Make your profile public</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-full h-full bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SettingsPanel };