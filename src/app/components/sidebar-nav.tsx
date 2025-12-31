import { 
  Home, 
  Sparkles, 
  Music, 
  Dna, 
  Activity,
  Disc3,
  Sliders,
  Zap,
  Disc,
  Play,
  Download,
  Layers,
  BarChart3,
  PlaySquare,
  Clock,
  TrendingUp,
  Settings,
  HelpCircle,
  User,
  Upload,
  BarChart,
  Radio,
  FileDown,
  FolderOpen,
  Rss,
  Radio as RadioIcon,
  Music2,
  Grid,
  BarChart3 as BarChart3Icon,
  Gauge,
  Plug,
  Music4,
  GitBranch,
  Mic,
  Store,
  DollarSign,
  Scissors,
  Users as UsersIcon,
  ZoomIn,
  Coins,
  Code,
  Palette
} from "lucide-react";

interface SidebarNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function SidebarNav({ activeView, onNavigate }: SidebarNavProps) {
  // MVP Navigation - Core features only
  const mainNavigation = [
    { id: "create-track-modern", label: "Create Track", icon: Sparkles },
    { id: "library-full", label: "Generated Tracks Library", icon: Music },
    { id: "dna-track-library", label: "DNA Track Library", icon: Dna },
    { id: "mixes", label: "My Mixes", icon: PlaySquare },
    { id: "auto-dj-mixer-pro-v3", label: "Auto DJ Mixer", icon: Sliders },
    { id: "dj-analyzer", label: "DJ Mix Analyzer", icon: Disc3 },
    { id: "analytics-stats", label: "Analytics & Stats", icon: BarChart3 },
    { id: "royalty-revenue", label: "Royalty & Revenue", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  // Hidden features for future releases (commented out, not deleted)
  /*
  const hiddenFeatures = [
    { id: "effects-rack", label: "Effects Rack", icon: Radio },
    { id: "timeline-editor", label: "Timeline Editor", icon: Clock },
    { id: "live-streaming", label: "Live Streaming", icon: RadioIcon },
    { id: "beatgrid-editor", label: "Beatgrid Editor", icon: Grid },
    { id: "crossfade-editor", label: "Crossfade Editor", icon: TrendingUp },
    { id: "frequency-analyzer", label: "Frequency Analyzer", icon: BarChart3Icon },
    { id: "mastering-suite", label: "Mastering Suite", icon: Gauge },
    { id: "midi-controller", label: "MIDI Controller", icon: Plug },
    { id: "vinyl-emulation", label: "Vinyl Emulation", icon: Disc },
    { id: "advanced-effects", label: "Advanced Effects", icon: Layers },
    { id: "key-shifting", label: "Key Shifting", icon: Music4 },
    { id: "ab-testing", label: "A/B Testing", icon: GitBranch },
    { id: "ai-voice-assistant", label: "AI Voice Assistant", icon: Mic },
    { id: "waveform-zoom", label: "Waveform Zoom & Analysis", icon: ZoomIn },
    { id: "nft-blockchain", label: "NFT & Blockchain", icon: Coins },
    { id: "white-label", label: "White Label", icon: Palette },
    { id: "history", label: "History", icon: Clock },
    { id: "activity-feed", label: "Activity Feed", icon: Rss },
    { id: "audio-upload", label: "Upload Audio", icon: Upload },
    { id: "audio-analysis", label: "Audio Analysis", icon: BarChart },
    { id: "audio-export", label: "Audio Export", icon: FileDown },
    { id: "podcast-radio", label: "Podcast & Radio", icon: Mic },
    { id: "marketplace", label: "Marketplace", icon: Store },
    { id: "ai-voice-separation", label: "AI Voice Separation", icon: Scissors },
    { id: "collaboration-analytics", label: "Collaboration Analytics", icon: UsersIcon },
    { id: "api-documentation", label: "API Documentation", icon: Code },
    { id: "dna", label: "DNA", icon: Dna },
    { id: "analysis", label: "Analysis", icon: Activity },
  ];
  */

  // Hidden DJ Tools for future releases
  /*
  const djTools = [
    { id: "dj-analyzer", label: "DJ Mix Analyzer", icon: Disc3 },
  ];
  */

  // Hidden Utility for future releases
  /*
  const utility = [
    { id: "empty-states", label: "Empty States", icon: Layers },
  ];
  */

  return (
    <div className="w-64 bg-black border-r border-border h-screen flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-border">
        <h2 className="font-['Roboto_Condensed'] tracking-tight text-white" style={{ fontWeight: 600 }}>
          SYNTAX
        </h2>
        <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-1 tracking-wide uppercase">
          Audio Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-6 overflow-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${
                  activeView === item.id
                    ? "bg-primary text-black"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-['Inter'] text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* DJ Tools Section - HIDDEN FOR MVP - Removed for clarity */}
        {/* Utility Section - HIDDEN FOR MVP - Removed for clarity */}
      </nav>

      {/* Status Footer - HIDDEN FOR V1: Not wired to backend */}
      {/*
      <div className="p-4 border-t border-border">
        <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>STATUS</span>
            <span className="text-primary">ONLINE</span>
          </div>
          <div className="flex justify-between">
            <span>API</span>
            <span className="text-primary">READY</span>
          </div>
        </div>
      </div>
      */}
    </div>
  );
}