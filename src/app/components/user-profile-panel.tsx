import React from 'react';
import { User, Music, Heart, Settings } from 'lucide-react';

const UserProfilePanel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] px-16 py-12">
      <div className="w-full max-w-[1400px]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="col-span-1">
            <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#00E5FF] mx-auto mb-6 flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">DJ User</h2>
              <p className="text-gray-400 text-center mb-6">Producer • DJ</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-400">Tracks</span>
                  <span className="text-white font-semibold">127</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-400">Mixes</span>
                  <span className="text-white font-semibold">43</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-400">Followers</span>
                  <span className="text-white font-semibold">2,584</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="col-span-2 space-y-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-6">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value="user@example.com"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    value="DJ User"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                  <Music className="w-5 h-5 text-[#FF6B00]" />
                  <span className="text-gray-400">Created new track</span>
                  <span className="ml-auto text-sm text-gray-500">2h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                  <Heart className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-gray-400">Liked "Electric Dreams"</span>
                  <span className="ml-auto text-sm text-gray-500">5h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePanel;