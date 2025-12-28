import { ArrowRight, Info } from "lucide-react";
import { Button } from "./ui/button";

interface LandingScreenProps {
  onEnter: () => void;
}

export function LandingScreen({ onEnter }: LandingScreenProps) {
  return (
    <div className="h-full flex items-center justify-center p-6 relative overflow-hidden">
      {/* Controlled radial gradient from center */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(168,85,247,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl text-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="inline-block relative">
            <div 
              className="absolute inset-0 blur-xl opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)",
              }}
            />
            <h1 
              className="relative font-['Roboto_Condensed'] tracking-tight text-6xl"
              style={{ fontWeight: 700 }}
            >
              SYNTAX
            </h1>
          </div>
          <div className="font-['IBM_Plex_Mono'] text-xs text-muted-foreground mt-2 tracking-[0.3em] uppercase">
            Audio Intelligence
          </div>
        </div>

        {/* Main Headline */}
        <h2 
          className="font-['Roboto_Condensed'] text-4xl mb-4 tracking-tight"
          style={{ fontWeight: 600 }}
        >
          Music isn't generated. It's decided.
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          A music intelligence system that understands DJ and producer decision-making.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onEnter}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 group"
          >
            <span className="font-['Roboto_Condensed'] tracking-wide">ENTER THE SYSTEM</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 border-border hover:border-primary/50"
          >
            <Info className="w-4 h-4 mr-2" />
            <span className="font-['Roboto_Condensed'] tracking-wide">HOW IT WORKS</span>
          </Button>
        </div>

        {/* Bottom text */}
        <div className="mt-16 font-['IBM_Plex_Mono'] text-xs text-muted-foreground space-y-1">
          <div>Professional DJ and producer tools</div>
          <div className="text-primary/60">Underground edition</div>
        </div>
      </div>
    </div>
  );
}
