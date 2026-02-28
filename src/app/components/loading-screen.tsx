import { Activity } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="h-full flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-primary/10 border border-primary/20 mb-6 relative overflow-hidden">
          <Activity className="w-10 h-10 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
        </div>
        <h2 className="font-['Inter'] mb-2">Syntax Audio Intelligence</h2>
        <p className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground tracking-wider uppercase">
          Initializing System
        </p>
      </div>
    </div>
  );
}
