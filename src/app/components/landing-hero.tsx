import { ArrowRight, Play } from "lucide-react";

export function LandingHero() {
  return (
    <div className="h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Subtle Background Accent - Abstract "S" curve only (extracted from logo concept) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg
          width="1400"
          height="1400"
          viewBox="0 0 1400 1400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-[0.05]"
          style={{ filter: "blur(100px)" }}
        >
          {/* Abstract "S" curve - inspired by logo's arc element */}
          <path
            d="M300 700 Q400 300, 700 300 Q1000 300, 1100 700"
            stroke="#FF6B35"
            strokeWidth="180"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M300 700 Q400 1100, 700 1100 Q1000 1100, 1100 700"
            stroke="#FF6B35"
            strokeWidth="180"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top Navigation Header */}
      <nav className="border-b border-border px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Clean Flat Logo - Top Left */}
          <div className="flex items-center gap-3">
            {/* Simple waveform icon - flat, no glow */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              {/* Minimal "S" waveform - clean lines, no effects */}
              <path
                d="M5 11 Q9 7, 13 11 T21 11"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 21 Q9 17, 13 21 T21 21"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            
            {/* Wordmark - flat, clean, professional */}
            <div>
              <div 
                className="font-['Roboto_Condensed'] text-white font-semibold tracking-tight leading-none" 
                style={{ fontSize: "20px" }}
              >
                SYNTAX
              </div>
              <div className="font-['IBM_Plex_Mono'] text-muted-foreground text-[9px] tracking-wider uppercase mt-1">
                Audio Intelligence
              </div>
            </div>
          </div>

          {/* Navigation - Right */}
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors font-medium">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors font-medium">
              Pricing
            </a>
            <a href="#generator" className="text-sm text-muted-foreground hover:text-white transition-colors font-medium">
              Generator
            </a>
            <a href="#analyzer" className="text-sm text-muted-foreground hover:text-white transition-colors font-medium">
              Analyzer
            </a>
            <button
              className="text-sm text-muted-foreground hover:text-white border border-border px-4 py-2 hover:border-white transition-all font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean, content-first */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center px-3 py-1.5 border border-primary">
              <span className="text-xs font-medium tracking-wider text-primary uppercase font-['IBM_Plex_Mono']">
                AI-Powered Underground Sound
              </span>
            </div>
          </div>

          {/* Main Headline - PRIMARY FOCUS */}
          <div className="space-y-4">
            <h1 className="text-7xl font-semibold tracking-tight text-white leading-[1.1] font-['Roboto_Condensed']">
              Generate Underground <br />Dance Music
            </h1>

            
            {/* Accent Sub-Headline */}
            <h2 className="text-5xl font-semibold tracking-tight text-primary leading-[1.1] font-['Roboto_Condensed']">
              From Your DNA
            </h2>
          </div>

          {/* Supporting Copy */}
          <div className="max-w-[650px] mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              The first AI platform trained exclusively on underground dance music.
              Analyze producer DNA, generate authentic tracks, and push electronic sound forward.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 pt-4">
            {/* Primary CTA */}
            <button className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-black text-base font-medium transition-all group">
              <span>Generate a Track</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA */}
            <button className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-white transition-colors group">
              <Play className="w-5 h-5" />
              <span className="text-base font-medium">Watch Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="pb-8 flex justify-center relative z-10">
        <div className="w-px h-16 bg-border" />
      </div>
    </div>
  );
}