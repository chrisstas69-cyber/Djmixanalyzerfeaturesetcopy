import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Key, 
  Settings as SettingsIcon, 
  ArrowLeft,
  Upload,
  Check,
  Edit2,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Save,
  Shield
} from 'lucide-react';
import { Button } from './ui/Button';

interface SettingsProps {
  onBack: () => void;
}

type Tab = 'account' | 'billing' | 'api-keys' | 'preferences';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
}

export function Settings({ onBack }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  
  // Account state
  const [fullName, setFullName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  // Preferences state
  const [defaultBpm, setDefaultBpm] = useState(128);
  const [defaultKey, setDefaultKey] = useState('A Minor');
  const [defaultGenre, setDefaultGenre] = useState('Deep House');
  const [defaultLength, setDefaultLength] = useState('6min');
  const [notifications, setNotifications] = useState({
    trackComplete: true,
    dnaComplete: true,
    weeklySummary: false
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_AbCdEf123456789XyZ',
      created: 'Jan 15, 2025',
      lastUsed: '2 hours ago'
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_123456789AbCdEfXyZ',
      created: 'Dec 10, 2024',
      lastUsed: '5 days ago'
    }
  ]);

  // Billing
  const invoices: Invoice[] = [
    { id: '1', date: 'Jan 1, 2025', amount: '$19.00', status: 'paid' },
    { id: '2', date: 'Dec 1, 2024', amount: '$19.00', status: 'paid' },
    { id: '3', date: 'Nov 1, 2024', amount: '$19.00', status: 'paid' },
    { id: '4', date: 'Oct 1, 2024', amount: '$19.00', status: 'paid' }
  ];

  const tabs = [
    { id: 'account' as Tab, label: 'Account', icon: User },
    { id: 'billing' as Tab, label: 'Billing', icon: CreditCard },
    { id: 'api-keys' as Tab, label: 'API Keys', icon: Key },
    { id: 'preferences' as Tab, label: 'Preferences', icon: SettingsIcon }
  ];

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleRevokeKey = (keyId: string) => {
    if (window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    }
  };

  const handleGenerateKey = () => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never'
    };
    setApiKeys([newKey, ...apiKeys]);
  };

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 7)}${'•'.repeat(12)}${key.slice(-4)}`;
  };

  const handleSavePreferences = () => {
    alert('Preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#808080] hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generator
          </button>
          <h1 className="text-white text-2xl">Settings</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#ff6b35] text-white'
                        : 'text-[#808080] hover:bg-[#1a1a1a] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white text-xl mb-1">Account Settings</h2>
                  <p className="text-[#808080] text-sm">Manage your account information and security</p>
                </div>

                {/* Profile Picture */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <label className="block text-white mb-4">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-[#808080]" />
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                        <div className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors inline-flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          {profilePicture ? 'Change Picture' : 'Upload Picture'}
                        </div>
                      </label>
                      <p className="text-xs text-[#808080] mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <label className="block text-white mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <label className="block text-white mb-2">Email Address</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                    />
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-500 rounded-lg">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-white mb-1">Password</label>
                      <p className="text-sm text-[#808080]">Last changed 3 months ago</p>
                    </div>
                    <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-6 border-t border-[#2a2a2a]">
                  <button className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                  <Button variant="primary">Save Changes</Button>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white text-xl mb-1">Billing & Subscription</h2>
                  <p className="text-[#808080] text-sm">Manage your subscription and payment methods</p>
                </div>

                {/* Current Plan */}
                <div className="p-6 bg-gradient-to-br from-[#ff6b35]/20 to-[#1a1a1a] border border-[#ff6b35]/30 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-lg mb-1">Pro Plan</h3>
                      <p className="text-2xl text-[#ff6b35] font-mono">$19<span className="text-sm text-[#808080]">/month</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors">
                        Upgrade
                      </button>
                      <button className="px-4 py-2 bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] rounded-lg transition-colors">
                        Downgrade
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#808080]">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Next billing date: February 1, 2025</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white mb-2">Payment Method</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-[#2a2a2a] rounded flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-[#808080]" />
                        </div>
                        <div>
                          <p className="text-white">•••• •••• •••• 4242</p>
                          <p className="text-sm text-[#808080]">Expires 12/26</p>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Billing History */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <h3 className="text-white mb-4">Billing History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#2a2a2a]">
                          <th className="text-left py-3 px-4 text-sm text-[#808080]">Date</th>
                          <th className="text-left py-3 px-4 text-sm text-[#808080]">Amount</th>
                          <th className="text-left py-3 px-4 text-sm text-[#808080]">Status</th>
                          <th className="text-right py-3 px-4 text-sm text-[#808080]">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map(invoice => (
                          <tr key={invoice.id} className="border-b border-[#2a2a2a] last:border-0">
                            <td className="py-3 px-4 text-white">{invoice.date}</td>
                            <td className="py-3 px-4 text-white">{invoice.amount}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                invoice.status === 'paid' 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : invoice.status === 'pending'
                                  ? 'bg-yellow-500/10 text-yellow-500'
                                  : 'bg-red-500/10 text-red-500'
                              }`}>
                                {invoice.status === 'paid' && <Check className="w-3 h-3" />}
                                <span className="capitalize">{invoice.status}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button className="text-[#ff6b35] hover:text-[#ff8555] transition-colors inline-flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cancel Subscription */}
                <div className="pt-6 border-t border-[#2a2a2a]">
                  <button className="text-red-500 hover:text-red-400 transition-colors">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white text-xl mb-1">API Keys</h2>
                    <p className="text-[#808080] text-sm">Manage your API keys for programmatic access</p>
                  </div>
                  <button
                    onClick={handleGenerateKey}
                    className="px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Generate New API Key
                  </button>
                </div>

                {/* API Keys List */}
                <div className="space-y-4">
                  {apiKeys.map(apiKey => (
                    <div key={apiKey.id} className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-white mb-2">{apiKey.name}</h3>
                          <div className="flex items-center gap-3 mb-3">
                            <code className="px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded text-sm text-[#808080] font-mono">
                              {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                            </code>
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="text-[#808080] hover:text-white transition-colors"
                            >
                              {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-[#808080]">
                            <span>Created: {apiKey.created}</span>
                            <span>Last used: {apiKey.lastUsed}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRevokeKey(apiKey.id)}
                          className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info Box */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm mb-1">Keep your API keys secure</p>
                      <p className="text-[#808080] text-xs">
                        Never share your API keys publicly or commit them to version control. 
                        Treat them like passwords and store them securely.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white text-xl mb-1">Preferences</h2>
                  <p className="text-[#808080] text-sm">Customize your default generation settings</p>
                </div>

                {/* Default BPM */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-white">Default BPM</label>
                    <span className="text-2xl text-[#ff6b35] font-mono">{defaultBpm}</span>
                  </div>
                  <input
                    type="range"
                    min="115"
                    max="150"
                    value={defaultBpm}
                    onChange={(e) => setDefaultBpm(Number(e.target.value))}
                    className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${((defaultBpm - 115) / 35) * 100}%, #2a2a2a ${((defaultBpm - 115) / 35) * 100}%, #2a2a2a 100%)`
                    }}
                  />
                  <div className="flex items-center justify-between mt-2 text-sm text-[#808080]">
                    <span>115</span>
                    <span>150</span>
                  </div>
                </div>

                {/* Default Key */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <label className="block text-white mb-2">Default Key</label>
                  <select
                    value={defaultKey}
                    onChange={(e) => setDefaultKey(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors cursor-pointer"
                  >
                    <option>C Major</option>
                    <option>A Minor</option>
                    <option>G Major</option>
                    <option>E Minor</option>
                    <option>D Major</option>
                    <option>B Minor</option>
                  </select>
                </div>

                {/* Default Genre */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <label className="block text-white mb-2">Default Genre</label>
                  <select
                    value={defaultGenre}
                    onChange={(e) => setDefaultGenre(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors cursor-pointer"
                  >
                    <option>Deep House</option>
                    <option>Tech House</option>
                    <option>Melodic Techno</option>
                    <option>Progressive House</option>
                    <option>Afro House</option>
                    <option>Minimal Techno</option>
                  </select>
                </div>

                {/* Default Track Length */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <label className="block text-white mb-2">Default Track Length</label>
                  <select
                    value={defaultLength}
                    onChange={(e) => setDefaultLength(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors cursor-pointer"
                  >
                    <option value="4min">4 minutes</option>
                    <option value="6min">6 minutes</option>
                    <option value="8min">8 minutes</option>
                  </select>
                </div>

                {/* Email Notifications */}
                <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                  <h3 className="text-white mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Track generation complete</p>
                        <p className="text-sm text-[#808080]">Get notified when your tracks finish generating</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.trackComplete}
                          onChange={(e) => setNotifications({ ...notifications, trackComplete: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b35]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">DNA training complete</p>
                        <p className="text-sm text-[#808080]">Get notified when your Music DNA finishes training</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.dnaComplete}
                          onChange={(e) => setNotifications({ ...notifications, dnaComplete: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b35]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Weekly summary</p>
                        <p className="text-sm text-[#808080]">Receive a weekly summary of your activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklySummary}
                          onChange={(e) => setNotifications({ ...notifications, weeklySummary: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b35]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-[#2a2a2a]">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Preferences
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
