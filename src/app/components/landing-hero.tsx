import { Sparkles, Sliders } from "lucide-react";

interface LandingHeroProps {
  onNavigate?: (view: string) => void;
}

export function LandingHero({ onNavigate }: LandingHeroProps) {
  const handleGenerateTrack = () => {
    if (onNavigate) {
      onNavigate("create-track-modern");
    }
  };

  const handleOpenMixer = () => {
    if (onNavigate) {
      onNavigate("auto-dj-mixer-pro-v3");
    }
  };

  return (
    <div 
      className="h-full w-full flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'var(--bg-0)',
        color: 'var(--text)'
      }}
    >
      {/* Subtle Brand Signal Background - Abstract S-energy glow at extremely low opacity */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg
          width="1400"
          height="1400"
          viewBox="0 0 1400 1400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            opacity: 0.015,
            filter: "blur(120px)"
          }}
        >
          {/* Abstract "S" curve - S-energy glow */}
          <path
            d="M300 700 Q400 300, 700 300 Q1000 300, 1100 700"
            stroke="var(--orange)"
            strokeWidth="180"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M300 700 Q400 1100, 700 1100 Q1000 1100, 1100 700"
            stroke="var(--orange)"
            strokeWidth="180"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Calm Center Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Primary CTA - Generate Track */}
        <button
          onClick={handleGenerateTrack}
          className="flex items-center gap-3 px-8 py-4 font-semibold text-base transition-all"
          style={{
            background: 'linear-gradient(180deg, var(--orange), var(--orange-2))',
            color: 'var(--bg-0)',
            border: '1px solid var(--orange-2)',
            borderRadius: 'var(--r-md)',
            boxShadow: 'var(--glow-orange)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, var(--orange-2), var(--orange))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, var(--orange), var(--orange-2))';
          }}
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate Track</span>
        </button>

        {/* Secondary CTA - Open Mixer */}
        <button
          onClick={handleOpenMixer}
          className="flex items-center gap-3 px-8 py-4 font-medium text-base transition-all"
          style={{
            background: 'var(--panel)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--panel-2)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--panel)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <Sliders className="w-5 h-5" />
          <span>Open Mixer</span>
        </button>
      </div>
    </div>
  );
}
