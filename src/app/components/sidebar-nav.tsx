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
  User
} from "lucide-react";

interface SidebarNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function SidebarNav({ activeView, onNavigate }: SidebarNavProps) {
  const mainNavigation = [
    { id: "create-track-modern", label: "Create Track", icon: Sparkles },
    { id: "library-full", label: "Track Library", icon: Music },
    { id: "mixer", label: "Mixer", icon: Sliders },
    { id: "mixes", label: "My Mixes", icon: PlaySquare },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "history", label: "History", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "profile", label: "Profile", icon: User },
    { id: "dna", label: "DNA", icon: Dna },
    { id: "analysis", label: "Analysis", icon: Activity },
  ];

  const djTools = [
    { id: "dj-analyzer", label: "DJ Mix Analyzer", icon: Disc3 },
    { id: "auto-dj-mixer-pro-v3", label: "Auto DJ Mixer", icon: Sliders },
  ];

  const utility = [
    { id: "empty-states", label: "Empty States", icon: Layers },
  ];

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

        {/* DJ Tools Section */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground uppercase tracking-wider">
              DJ Tools
            </span>
          </div>
          {djTools.map((item) => {
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

        {/* Utility Section */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <span className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground uppercase tracking-wider">
              Utility
            </span>
          </div>
          {utility.map((item) => {
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