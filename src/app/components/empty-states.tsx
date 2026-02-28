import { Music, Library, Disc, FolderOpen, CheckCircle2, Sparkles, Upload, Zap } from "lucide-react";
import { useState } from "react";

interface EmptyStateProps {
  variant: "create-track" | "track-library" | "auto-dj-mixer" | "mix-crate" | "post-mix";
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export function EmptyState({ variant, onPrimaryAction, onSecondaryAction }: EmptyStateProps) {
  const states = {
    "create-track": {
      icon: Music,
      iconColor: "text-primary",
      iconBg: "bg-black",
      headline: "Track Generator",
      description: "Describe your sound. Generate professional music.",
      primaryLabel: "Create Track",
      primaryIcon: Music,
      secondaryLabel: null,
      secondaryIcon: null,
    },
    "track-library": {
      icon: Library,
      iconColor: "text-primary",
      iconBg: "bg-black",
      headline: "Track Library",
      description: "Your created and uploaded tracks appear here.",
      primaryLabel: "Create Track",
      primaryIcon: Music,
      secondaryLabel: null,
      secondaryIcon: null,
    },
    "auto-dj-mixer": {
      icon: Disc,
      iconColor: "text-primary",
      iconBg: "bg-black",
      headline: "Auto DJ Mixer",
      description: "Select tracks. The mixer handles transitions automatically.",
      primaryLabel: "Choose Tracks",
      primaryIcon: Library,
      secondaryLabel: null,
      secondaryIcon: null,
    },
    "mix-crate": {
      icon: FolderOpen,
      iconColor: "text-primary",
      iconBg: "bg-black",
      headline: "Mix Crate",
      description: "Add tracks from your library to queue the mix.",
      primaryLabel: "Browse Library",
      primaryIcon: Library,
      secondaryLabel: null,
      secondaryIcon: null,
    },
    "post-mix": {
      icon: CheckCircle2,
      iconColor: "text-primary",
      iconBg: "bg-black",
      headline: "Mix Complete",
      description: "Your mix is ready to export or share.",
      primaryLabel: "Create Another Mix",
      primaryIcon: Disc,
      secondaryLabel: null,
      secondaryIcon: null,
    },
  };

  const state = states[variant];
  const IconComponent = state.icon;
  const PrimaryIconComponent = state.primaryIcon;
  const SecondaryIconComponent = state.secondaryIcon;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`w-20 h-20 ${state.iconBg} border border-border flex items-center justify-center`}>
            <IconComponent className={`w-10 h-10 ${state.iconColor}`} />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {state.headline}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {state.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 pt-2">
          {/* Primary Action */}
          <button
            onClick={onPrimaryAction}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black text-sm font-medium transition-all"
          >
            {PrimaryIconComponent && <PrimaryIconComponent className="w-4 h-4" />}
            <span>{state.primaryLabel}</span>
          </button>

          {/* Secondary Action */}
          {state.secondaryLabel && (
            <button
              onClick={onSecondaryAction}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-border text-muted-foreground hover:text-white text-sm font-medium transition-all"
            >
              {SecondaryIconComponent && <SecondaryIconComponent className="w-4 h-4" />}
              <span>{state.secondaryLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Demo component showing all empty states
export function EmptyStatesDemo() {
  const [activeState, setActiveState] = useState<EmptyStateProps["variant"]>("create-track");

  const states: Array<{ id: EmptyStateProps["variant"]; label: string }> = [
    { id: "create-track", label: "Create Track" },
    { id: "track-library", label: "Track Library" },
    { id: "auto-dj-mixer", label: "Auto DJ Mixer" },
    { id: "mix-crate", label: "Mix Crate" },
    { id: "post-mix", label: "Post-Mix" },
  ];

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold tracking-tight text-white">Empty States</h1>
          <p className="text-xs text-muted-foreground">Professional empty state designs for all key areas</p>
        </div>
      </div>

      {/* State Selector */}
      <div className="border-b border-border px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setActiveState(state.id)}
              className={`px-4 py-2 text-xs font-medium transition-all ${
                activeState === state.id
                  ? "bg-primary text-black"
                  : "border border-border text-muted-foreground hover:text-white"
              }`}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State Display */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto h-full">
          <EmptyState
            variant={activeState}
            onPrimaryAction={() => console.log("Primary action:", activeState)}
            onSecondaryAction={() => console.log("Secondary action:", activeState)}
          />
        </div>
      </div>

      {/* Info Panel */}
      <div className="border-t border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="p-4 border border-border bg-muted">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider font-['IBM_Plex_Mono']">Design Principles</p>
            <ul className="text-xs text-muted-foreground space-y-1 font-['IBM_Plex_Mono']">
              <li>• High-contrast professional system</li>
              <li>• True black backgrounds</li>
              <li>• White primary text</li>
              <li>• Orange accent (sparingly)</li>
              <li>• No gradients, no glow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}