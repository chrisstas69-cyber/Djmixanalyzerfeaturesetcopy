import { Music, Library, Dna, User, Activity } from "lucide-react";

interface PlaceholderViewProps {
  viewId: string;
}

export function PlaceholderView({ viewId }: PlaceholderViewProps) {
  const viewConfig: Record<string, { icon: React.ComponentType<any>; title: string; description: string }> = {
    create: {
      icon: Music,
      title: "Create Track",
      description: "Generate music with AI based on your creative vision and DNA preferences",
    },
    library: {
      icon: Library,
      title: "Track Library",
      description: "Browse and manage your collection of generated tracks",
    },
    "dna-library": {
      icon: Dna,
      title: "DNA Library",
      description: "Explore sonic DNA patterns and build your unique sound palette",
    },
    "my-dna": {
      icon: User,
      title: "My DNA",
      description: "Your personalized sonic identity and generation preferences",
    },
    analysis: {
      icon: Activity,
      title: "Analysis",
      description: "Deep dive into audio analysis and track breakdowns",
    },
  };

  const config = viewConfig[viewId] || {
    icon: Music,
    title: viewId,
    description: "This feature is coming soon",
  };

  const Icon = config.icon;

  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-primary/10 border border-primary/20 mb-6">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-['Inter'] mb-2">{config.title}</h2>
        <p className="text-muted-foreground mb-6">{config.description}</p>
        <div className="inline-block px-4 py-2 rounded bg-muted/30 border border-border">
          <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider">
            COMING SOON
          </p>
        </div>
      </div>
    </div>
  );
}
