import { useState } from "react";
import { HelpCircle, Book, MessageCircle, FileText, ChevronRight } from "lucide-react";

export function HelpPanel() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const faqItems = [
    {
      question: "How do I create a track?",
      answer: "Go to 'Create Track' in the sidebar, enter a description of the vibe you want, and click 'Generate a Track'. The AI will create 3 versions (A, B, C) for you to choose from."
    },
    {
      question: "What is DNA?",
      answer: "DNA is your musical profile. Upload reference tracks you love, and the system learns your style preferences. This helps recommend tracks that match your taste."
    },
    {
      question: "How do I share a mix?",
      answer: "In 'My Mixes', select a mix and click 'Share Mix'. This generates a shareable code that others can use to import your mix into their library."
    },
    {
      question: "Can I export my tracks?",
      answer: "Yes! Select tracks in the Track Library and click 'Export'. You can export as JSON, CSV, or M3U playlist format. Choose your preferred format in the export settings dialog."
    },
    {
      question: "How do favorites work?",
      answer: "Click the star icon next to any track to favorite it. Use the 'Favorites Only' toggle in the Track Library header to filter and view only your favorited tracks."
    },
    {
      question: "What formats can I export to?",
      answer: "You can export tracks as JSON (for backup/import), CSV (for spreadsheets), or M3U (for music players). Each format includes track metadata like BPM, key, and energy level."
    },
  ];

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Book,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">1. Create Your First Track</h3>
            <p className="text-xs text-white/60 mb-3">
              Navigate to "Create Track" and describe the vibe you want. The AI will generate 3 versions for you to choose from.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">2. Build Your Library</h3>
            <p className="text-xs text-white/60 mb-3">
              Save tracks you like to your library. Use favorites, filters, and search to organize your collection.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">3. Create Mixes</h3>
            <p className="text-xs text-white/60 mb-3">
              Group tracks together into mixes. Drag to reorder, add notes, and share with others.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">4. Mix & Perform</h3>
            <p className="text-xs text-white/60">
              Use the professional DJ mixer to blend tracks, adjust EQ, and create seamless transitions.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "features",
      title: "Key Features",
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">DNA Analysis</h3>
            <p className="text-xs text-white/60">
              Upload reference tracks to build your musical DNA. Get personalized track recommendations based on your style preferences.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Multi-Select & Bulk Actions</h3>
            <p className="text-xs text-white/60">
              Select multiple tracks using checkboxes, then perform bulk actions like delete, favorite, export, or add to mix.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Advanced Export</h3>
            <p className="text-xs text-white/60">
              Export tracks in multiple formats (JSON, CSV, M3U) with customizable metadata options.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Playback History</h3>
            <p className="text-xs text-white/60">
              Track your listening habits. See recently played tracks, most played tracks, and listening statistics.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      icon: MessageCircle,
      content: (
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-1">{item.question}</h3>
              <p className="text-xs text-white/60">{item.answer}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "changelog",
      title: "Changelog",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Version 1.0.0</h3>
            <ul className="text-xs text-white/60 space-y-1 list-disc list-inside">
              <li>Initial release with track creation and library management</li>
              <li>DNA analysis and personalized recommendations</li>
              <li>Professional DJ mixer with EQ controls and effects</li>
              <li>Mix creation and sharing</li>
              <li>Export options (JSON, CSV, M3U)</li>
              <li>Playback history and analytics</li>
              <li>Multi-select and bulk actions</li>
              <li>Onboarding tutorial for new users</li>
              <li>Dark/light theme support</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1">Help & Documentation</h1>
        <p className="text-xs text-white/40">
          Learn how to use Syntax Audio Intelligence
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                  className={`p-4 bg-white/5 border rounded-lg text-left transition-all hover:bg-white/10 ${
                    isActive ? "border-primary bg-primary/10" : "border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <h2 className="text-sm font-semibold text-white">{section.title}</h2>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-white/40 transition-transform ${
                        isActive ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Section Content */}
          {activeSection && (
            <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-xl">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4">Keyboard Shortcuts</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-white/60">Generate Track:</span>
                <kbd className="ml-2 px-2 py-1 bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+G
                </kbd>
              </div>
              <div>
                <span className="text-white/60">Save to Library:</span>
                <kbd className="ml-2 px-2 py-1 bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+S
                </kbd>
              </div>
              <div>
                <span className="text-white/60">Export Track:</span>
                <kbd className="ml-2 px-2 py-1 bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+E
                </kbd>
              </div>
              <div>
                <span className="text-white/60">Show Help:</span>
                <kbd className="ml-2 px-2 py-1 bg-white/10 border border-white/20 rounded font-['IBM_Plex_Mono']">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+?
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


