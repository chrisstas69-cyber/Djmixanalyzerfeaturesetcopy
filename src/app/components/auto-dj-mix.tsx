import { Zap, Music, Settings, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const presetMixes = [
  {
    id: 1,
    name: "Peak Hour Energy",
    description: "High-energy techno journey from 128 to 134 BPM",
    duration: "90 min",
    tracks: 12,
    energy: "8-10",
    style: ["Peak Techno", "Industrial"],
    bpmRange: "128-134",
    keyStart: "4A",
  },
  {
    id: 2,
    name: "Deep Warehouse",
    description: "Hypnotic deep techno with minimal progression",
    duration: "120 min",
    tracks: 16,
    energy: "5-7",
    style: ["Deep Techno", "Minimal", "Hypnotic"],
    bpmRange: "126-130",
    keyStart: "8A",
  },
  {
    id: 3,
    name: "After Hours",
    description: "Closing set energy with gradual comedown",
    duration: "75 min",
    tracks: 10,
    energy: "7-4",
    style: ["Deep Techno", "Minimal"],
    bpmRange: "125-128",
    keyStart: "1A",
  },
  {
    id: 4,
    name: "Industrial Assault",
    description: "Hard-hitting industrial techno with relentless energy",
    duration: "60 min",
    tracks: 8,
    energy: "9-10",
    style: ["Industrial", "Peak Techno"],
    bpmRange: "132-138",
    keyStart: "9A",
  },
];

export function AutoDJMix() {
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="font-['Roboto_Condensed'] tracking-tight" style={{ fontWeight: 600 }}>
              Auto DJ Mix
            </h1>
          </div>
          <p className="text-muted-foreground font-['IBM_Plex_Mono'] text-sm">
            Generate complete DJ mixes from your track library or DNA preferences
          </p>
        </div>

        {/* Create New Mix */}
        <div className="bg-card border border-border rounded-sm p-6 mb-8">
          <h2 className="font-['Roboto_Condensed'] mb-4 tracking-tight" style={{ fontWeight: 600 }}>
            Create New Mix
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 tracking-wider">
                DURATION (MINUTES)
              </label>
              <input
                type="number"
                placeholder="90"
                className="w-full bg-input border border-border rounded-sm px-4 py-2 font-['IBM_Plex_Mono'] text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 tracking-wider">
                TARGET BPM RANGE
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="128"
                  className="flex-1 bg-input border border-border rounded-sm px-4 py-2 font-['IBM_Plex_Mono'] text-sm outline-none focus:border-primary transition-colors"
                />
                <span className="text-muted-foreground self-center">—</span>
                <input
                  type="number"
                  placeholder="132"
                  className="flex-1 bg-input border border-border rounded-sm px-4 py-2 font-['IBM_Plex_Mono'] text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 tracking-wider">
              ENERGY PROGRESSION
            </label>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" className="font-['IBM_Plex_Mono'] text-xs rounded-sm">
                Build Up (3→10)
              </Button>
              <Button variant="outline" className="font-['IBM_Plex_Mono'] text-xs rounded-sm">
                Peak Hour (8→10)
              </Button>
              <Button variant="outline" className="font-['IBM_Plex_Mono'] text-xs rounded-sm">
                Comedown (10→3)
              </Button>
              <Button variant="outline" className="font-['IBM_Plex_Mono'] text-xs rounded-sm">
                Custom
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <label className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground block mb-2 tracking-wider">
              STYLE PREFERENCES
            </label>
            <div className="flex gap-2 flex-wrap">
              {["Deep Techno", "Peak Techno", "Hypnotic", "Industrial", "Minimal", "Acid"].map(
                (style) => (
                  <Badge
                    key={style}
                    variant="outline"
                    className="font-['IBM_Plex_Mono'] text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors rounded-sm"
                  >
                    {style}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-['Roboto_Condensed']">
              <Zap className="w-4 h-4 mr-2" />
              Generate Mix
            </Button>
            <Button variant="outline" className="font-['Roboto_Condensed']">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </Button>
          </div>
        </div>

        {/* Preset Mixes */}
        <div>
          <h2 className="font-['Roboto_Condensed'] mb-4 tracking-tight" style={{ fontWeight: 600 }}>
            Preset Mixes
          </h2>
          <div className="grid gap-4">
            {presetMixes.map((preset) => (
              <div
                key={preset.id}
                className="bg-card border border-border rounded-sm p-5 hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-['Roboto_Condensed'] mb-1 group-hover:text-primary transition-colors tracking-tight" style={{ fontWeight: 600 }}>
                      {preset.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-['Roboto_Condensed']"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
                <div className="flex gap-6 font-['IBM_Plex_Mono'] text-xs">
                  <div>
                    <span className="text-muted-foreground">DURATION: </span>
                    <span className="text-secondary">{preset.duration}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">TRACKS: </span>
                    <span className="text-primary">{preset.tracks}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ENERGY: </span>
                    <span className="text-foreground">{preset.energy}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {preset.style.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="font-['IBM_Plex_Mono'] text-xs px-1.5 py-0 rounded-sm"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}