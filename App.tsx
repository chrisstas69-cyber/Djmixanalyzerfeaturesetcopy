import React, { useState, useEffect, useRef } from 'react';
import { Page, BrandColor, LibraryItem, Track, DNAProfile, SavedPrompt } from './types';
import { Icons } from './components/Icons';
import { Button } from './components/Button';

// Charts
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

// Service
import { generatePromptFromDNA } from './services/geminiService';

// --- Constants ---
const UNDERGROUND_GENRES = [
  "Afro House",
  "Amapiano",
  "Bass House",
  "Breaks",
  "Chill Out",
  "Club Dance",
  "Deep House",
  "DJ Tools",
  "Downtempo",
  "Drum & Bass",
  "Dubstep",
  "Electro (Classic / Detroit / Modern)",
  "Electro House",
  "Electronica",
  "Future House",
  "Garage",
  "Hard Techno",
  "House",
  "Indie Dance",
  "Jackin House",
  "Mashups",
  "Melodic House / Techno",
  "Minimal / Deep Tech",
  "Nu Disco",
  "Organic House",
  "Pop / Dance",
  "Progressive",
  "Soulful / Funk / Disco",
  "Tech House",
  "Techno (Peak Time / Driving / Hard)",
  "Techno (Raw / Deep / Hypnotic)",
  "Trance"
];

// --- Utilities ---

const generateHash = (str: string) => {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number, offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * 50) + 50; // Returns 50-100
};

// Improved deterministic random generator that uses Track metadata
const generateDNAStats = (track: Track): DNAProfile => {
  const seed = generateHash(track.name);
  
  let rhythm = seededRandom(seed, 1);
  let harmonic = seededRandom(seed, 2);
  let texture = seededRandom(seed, 3);
  let drums = seededRandom(seed, 4);
  let emotion = seededRandom(seed, 5);

  // Intelligent Overrides based on extracted metadata
  const bpm = track.bpm || 124;
  
  if (bpm > 132) {
      rhythm = Math.min(98, rhythm + 15); // Fast tempo increases rhythm score
      drums = Math.min(98, drums + 10);
      texture = Math.max(40, texture - 10);
  } else if (bpm < 118) {
      rhythm = Math.max(50, rhythm - 10); // Slow tempo reduces rhythm intensity
      texture = Math.min(98, texture + 20); // Slower usually means more texture/atmo
      emotion = Math.min(98, emotion + 10);
  }

  if (track.key) {
      const k = track.key.toUpperCase();
      // Camelot Minor (A) vs Major (B)
      // Match 1A through 12A (Minor)
      const isCamelotMinor = /^(?:1[0-2]|[1-9])A$/.test(k);
      const isCamelotMajor = /^(?:1[0-2]|[1-9])B$/.test(k);
      
      // Standard Minor detection
      const isStandardMinor = k.includes("MINOR") || (k.includes("M") && !k.includes("MAJ") && !k.includes("MAJOR"));

      if (isCamelotMinor || isStandardMinor) {
          harmonic = Math.min(98, harmonic + 15); // Minor keys increase "Darkness/Harmonic" score
          emotion = Math.min(98, emotion + 10);
      } else if (isCamelotMajor || k.includes('MAJOR')) {
          harmonic = Math.max(30, harmonic - 20); // Major keys reduce darkness
          emotion = Math.max(50, emotion - 10);
      }
  }
  
  // Genre Bias
  if (track.genre) {
      const g = track.genre.toLowerCase();
      if (g.includes("techno")) {
          drums = Math.min(99, drums + 15);
          harmonic = Math.min(99, harmonic + 10);
          rhythm = Math.min(99, rhythm + 5);
      } else if (g.includes("house")) {
          rhythm = Math.min(99, rhythm + 10);
          drums = Math.min(95, drums + 5);
          texture = Math.max(40, texture - 5);
      } else if (g.includes("ambient") || g.includes("chill")) {
          texture = Math.min(99, texture + 30);
          drums = Math.max(10, drums - 40);
          rhythm = Math.max(20, rhythm - 30);
      } else if (g.includes("bass") || g.includes("dubstep")) {
          drums = Math.min(99, drums + 20);
          texture = Math.min(95, texture + 10);
      }
  }

  return { rhythm, harmonic, texture, drums, emotion };
};

// --- Harmonic Mixing Logic ---
const getCamelotColor = (key: string) => {
    // Basic mapping of Camelot keys to rough colors
    const map: Record<string, string> = {
        '8B': '#FF0000', '8A': '#FF0055', // C Maj / A Min (Redish)
        '9B': '#FFCC00', '9A': '#FF9900', // G Maj / E Min (Orange/Yellow)
        '10B': '#FFFF00', '10A': '#CCFF00', // D Maj / B Min
        '11B': '#00FF00', '11A': '#00FF66', // A Maj / F# Min (Green)
        '12B': '#00FFFF', '12A': '#00CCFF', // E Maj / C# Min (Cyan)
        '1B': '#0000FF', '1A': '#3300FF', // B Maj / G# Min (Blue)
        '2B': '#FF00FF', '2A': '#CC00FF', // F# Maj / D# Min (Purple)
        '3B': '#FF00CC', '3A': '#FF0099', // Db Maj / Bb Min (Pink)
        // ... simplified for prototype
    };
    
    // Fallback for generated "8B" if not found
    return map[key] || '#E0AA3E';
};

const getMixingRecommendations = (currentKey: string) => {
    // Expecting format like "8B"
    const match = currentKey.match(/^(\d{1,2})([AB])$/);
    if (!match) return null;
    
    const num = parseInt(match[1]);
    const letter = match[2];
    
    const prevNum = num === 1 ? 12 : num - 1;
    const nextNum = num === 12 ? 1 : num + 1;
    
    // Harmonic Mixing Rules
    return [
        { label: 'Perfect Match', key: `${num}${letter}`, desc: 'Same Key' },
        { label: 'Harmonic Shift', key: `${num}${letter === 'A' ? 'B' : 'A'}`, desc: 'Major/Minor Swap' },
        { label: 'Energy Boost', key: `${nextNum}${letter}`, desc: '+1 Hour (Energy Up)' },
        { label: 'Deep Mix', key: `${prevNum}${letter}`, desc: '-1 Hour (Relax)' },
    ];
};


// --- Components Definitions ---

const Logo = () => (
  <div className="flex flex-col items-center justify-center py-2 select-none cursor-pointer group">
    <div className="relative flex items-center justify-center mb-2">
      {/* Decorative Left Line with Waveform simulation */}
      <div className="flex items-center gap-[2px] mr-4 opacity-80">
         <div className="h-[2px] w-4 bg-[#E0AA3E]"></div>
         <div className="h-4 w-[2px] bg-[#E0AA3E]"></div>
         <div className="h-2 w-[2px] bg-[#E0AA3E]"></div>
         <div className="h-6 w-[2px] bg-[#E0AA3E]"></div>
         <div className="h-3 w-[2px] bg-[#E0AA3E]"></div>
         <div className="h-[2px] w-2 bg-[#E0AA3E]"></div>
      </div>
      
      {/* Top Triangle */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
         <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
             <path d="M6 0L12 8H0L6 0Z" stroke="#E0AA3E" strokeWidth="1" fill="none" />
             <circle cx="6" cy="5" r="1" fill="#E0AA3E" />
         </svg>
      </div>

      <span className="font-family-sora font-bold text-4xl tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFE59E] to-[#E0AA3E] drop-shadow-[0_0_10px_rgba(224,170,62,0.3)]">
        SYNTAX
      </span>

      {/* Bottom Triangle */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
         <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
             <path d="M6 8L0 0H12L6 8Z" stroke="#E0AA3E" strokeWidth="1" fill="none" />
             <circle cx="6" cy="3" r="1" fill="#E0AA3E" />
         </svg>
      </div>

       {/* Decorative Right Line with Waveform simulation */}
      <div className="flex items-center gap-[2px] ml-4 opacity-80">
         <div className="h-[2px] w-2 bg-[#E0AA3E]"></div>
         <div className="h-3 w-[2px] bg-[#E0AA3E]"></div>
         <div className="h-6 w-[2px] bg-[#E0AA3E]"></div>
         <div className="h-2 w-[2px] bg-[#E0AA3E]"></div>
         <div className="h-4 w-[2px] bg-[#E0AA3E]"></div>
         <div className="h-[2px] w-4 bg-[#E0AA3E]"></div>
      </div>
    </div>
    <span className="font-serif text-[#FFE59E] text-sm tracking-[0.2em] mt-1 font-light opacity-90">
      Audio Intelligence
    </span>
  </div>
);

const NavItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-l-2 ${
      active 
        ? 'border-[#E0AA3E] bg-[#101010] text-[#E0AA3E]' 
        : 'border-transparent text-[#666] hover:text-[#E0AA3E] hover:bg-[#0a0a0a]'
    }`}
  >
    <Icon size={18} className={active ? 'text-[#E0AA3E]' : ''} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// --- Pages ---

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const demoData = [
    { subject: 'Rhythm', A: 120, fullMark: 150 },
    { subject: 'Harmonic', A: 98, fullMark: 150 },
    { subject: 'Texture', A: 86, fullMark: 150 },
    { subject: 'Drums', A: 99, fullMark: 150 },
    { subject: 'Emotion', A: 85, fullMark: 150 },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans">
      {/* Abstract Background - Gold Theme */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#E0AA3E] rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FFE59E] rounded-full blur-[150px]"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-[#141414] backdrop-blur-sm">
        <div className="scale-75 origin-left">
            <Logo />
        </div>
        <div className="hidden md:flex gap-8 text-sm text-[#888] font-mono">
          <a href="#" className="hover:text-[#E0AA3E] transition">IDENTITY_ENGINE</a>
          <a href="#" className="hover:text-[#E0AA3E] transition">MODELS</a>
          <a href="#" className="hover:text-[#E0AA3E] transition">PRICING</a>
        </div>
        <div className="flex gap-4">
           <Button variant="ghost" size="sm">LOG IN</Button>
           <Button variant="primary" size="sm" onClick={onStart}>LAUNCH APP</Button>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-12 pb-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-3 py-1 border border-[#E0AA3E]/30 bg-[#E0AA3E]/10 rounded-full text-[#E0AA3E] text-xs font-mono mb-6">
              V2.0 IDENTITY ENGINE LIVE
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-family-sora">
              AI Music That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0AA3E] to-[#FFE59E]">Knows Who You Are.</span>
            </h1>
            <p className="text-[#C8C8C8] text-lg md:text-xl mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Creator Identity → Beat DNA → Precision Prompting.
              Stop prompting from scratch. Train Syntax on your sound to drive external engines.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="primary" size="lg" onClick={onStart}>Start My DNA Scan</Button>
              <Button variant="outline" size="lg">Watch Demo</Button>
            </div>
          </div>

          {/* Hero Visualization */}
          <div className="flex-1 w-full max-w-lg relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#E0AA3E]/10 to-[#FFE59E]/10 rounded-full blur-3xl"></div>
             <div className="bg-[#101010]/80 border border-[#333] backdrop-blur-md p-8 rounded-2xl relative shadow-[0_0_30px_rgba(224,170,62,0.05)]">
                <h3 className="text-center font-serif text-[#E0AA3E] mb-4 text-xs tracking-widest">BEAT DNA VISUALIZATION</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={demoData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontFamily: 'Roboto Mono' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name="Identity" dataKey="A" stroke="#E0AA3E" strokeWidth={2} fill="#E0AA3E" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 border-t border-[#141414] pt-16">
          {[
            { title: "Identity Engine", desc: "Analyzes your raw audio files to extract rhythm, harmony, and texture DNA.", icon: Icons.DNA },
            { title: "Precision Prompting", desc: "Routes your DNA to generate optimized prompts for MusicGen, Stable Audio, and more.", icon: Icons.Layers },
            { title: "Custom Underground Model", desc: "Phase 3: Fine-tuned internal model on Detroit Techno and Deep House datasets.", icon: Icons.Architecture }
          ].map((item, idx) => (
            <div key={idx} className="group p-8 border border-[#141414] hover:border-[#E0AA3E] bg-[#050505] transition-all duration-300 rounded-xl">
              <item.icon className="text-[#E0AA3E] mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3 font-family-sora">{item.title}</h3>
              <p className="text-[#888] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24 text-center">
           <h2 className="text-2xl font-bold mb-12 font-family-sora">How It Works</h2>
           <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0">
              <div className="px-6 py-4 bg-[#101010] rounded-lg border border-[#222]">Upload Reference Tracks</div>
              <Icons.ChevronRight className="text-[#333] rotate-90 md:rotate-0" />
              <div className="px-6 py-4 bg-[#101010] rounded-lg border border-[#222]">Analyze Identity</div>
              <Icons.ChevronRight className="text-[#333] rotate-90 md:rotate-0" />
              <div className="px-6 py-4 bg-[#101010] rounded-lg border border-[#E0AA3E] text-[#E0AA3E]">Generate Prompts</div>
           </div>
        </div>
      </main>
    </div>
  );
};

const DashboardPage = ({ 
    onChangePage, 
    dnaProfile,
    onResetDNA
}: { 
    onChangePage: (p: Page) => void, 
    dnaProfile: DNAProfile | null,
    onResetDNA: () => void
}) => {
  const [copied, setCopied] = useState(false);
  const currentStats = dnaProfile || { rhythm: 0, harmonic: 0, texture: 0, drums: 0, emotion: 0 };
  const completion = dnaProfile ? 100 : 0; 

  // Updated with Camelot-style colors instead of monochromatic gold
  const dnaMetrics = [
    { label: 'Rhythm', percent: currentStats.rhythm, color: '#FF0055', icon: Icons.Waves }, // Red-Pink
    { label: 'Harmony', percent: currentStats.harmonic, color: '#00CCFF', icon: Icons.Layers }, // Cyan
    { label: 'Texture', percent: currentStats.texture, color: '#CC00FF', icon: Icons.Grid },   // Purple
    { label: 'Drums', percent: currentStats.drums, color: '#FF9900', icon: Icons.Disc },       // Orange
    { label: 'Emotion', percent: currentStats.emotion, color: '#00FF66', icon: Icons.Heart },  // Green
  ];

  return (
    <div className="p-8 animate-fade-in h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2 font-family-sora">Welcome back, Creator</h2>
        <p className="text-[#888]">Your studio session is active.</p>
      </header>

      <div className="bg-[#101010] border border-[#141414] p-6 rounded-lg mb-8 relative overflow-hidden group">
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-white">DNA Profile Completion</h3>
            <div className="flex items-center gap-2">
              {dnaProfile ? (
                  <span className="flex items-center gap-1 text-xs text-[#E0AA3E] font-mono bg-[#E0AA3E]/10 px-2 py-0.5 rounded border border-[#E0AA3E]/30">
                      <Icons.CheckCircle size={10} /> ANALYSIS VERIFIED
                  </span>
              ) : (
                  <span className="flex items-center gap-1 text-xs text-[#666] font-mono bg-[#222] px-2 py-0.5 rounded border border-[#333]">
                      <Icons.Loader size={10} /> SYSTEM IDLE / READY
                  </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
             {dnaProfile && (
                 <div className="flex gap-2">
                     <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            navigator.clipboard.writeText(JSON.stringify(dnaProfile, null, 2));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-xs text-[#666] hover:text-[#E0AA3E] flex items-center gap-1 border border-transparent hover:border-[#E0AA3E]/30 hover:bg-[#E0AA3E]/10 px-2 py-1 rounded transition"
                        title="Copy DNA Configuration"
                     >
                         {copied ? <Icons.CheckCircle size={12} /> : <Icons.Copy size={12} />}
                         {copied ? 'Copied' : 'Copy'}
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); onResetDNA(); }}
                        className="text-xs text-[#666] hover:text-red-500 flex items-center gap-1 border border-transparent hover:border-red-900/30 hover:bg-red-900/10 px-2 py-1 rounded transition"
                        title="Reset Identity"
                     >
                         <Icons.Trash size={12} /> Reset
                     </button>
                 </div>
             )}
             <span className={`font-mono text-xl ${dnaProfile ? 'text-[#E0AA3E]' : 'text-[#444]'}`}>{completion}%</span>
          </div>
        </div>
        
        <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden relative z-10 mb-8">
          <div className={`h-full transition-all duration-1000 ${dnaProfile ? 'bg-gradient-to-r from-[#E0AA3E] to-[#FFE59E]' : 'bg-[#333]'}`} style={{ width: `${completion}%` }}></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10 border-t border-[#1f1f1f] pt-6">
          {dnaMetrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center gap-3 group">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 overflow-visible">
                   <defs>
                     <filter id={`glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                       <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                       <feMerge>
                         <feMergeNode in="coloredBlur"/>
                         <feMergeNode in="SourceGraphic"/>
                       </feMerge>
                     </filter>
                   </defs>
                   <circle cx="40" cy="40" r="32" stroke="#1a1a1a" strokeWidth="4" fill="transparent" />
                   <circle 
                     cx="40" cy="40" r="32" 
                     stroke={dnaProfile ? metric.color : '#333'} 
                     strokeWidth="4" 
                     fill="transparent" 
                     strokeDasharray="201" 
                     strokeDashoffset={dnaProfile ? 201 * (1 - metric.percent / 100) : 201} 
                     strokeLinecap="round" 
                     className="transition-all duration-1000 ease-out"
                     filter={dnaProfile ? `url(#glow-${index})` : ''}
                     opacity={dnaProfile ? 1 : 0.2}
                   />
                </svg>
                
                <div className={`absolute inset-0 flex items-center justify-center rounded-full transition-colors ${dnaProfile ? 'bg-transparent' : 'bg-[#111]'}`}>
                    {dnaProfile ? (
                         <metric.icon size={24} style={{ color: metric.color }} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                    ) : (
                         <Icons.Lock size={18} className="text-[#333]" />
                    )}
                </div>
                {dnaProfile && (
                    <div className="absolute -bottom-1 -right-1 bg-[#080808] rounded-full p-0.5 border border-[#1f1f1f] shadow-lg z-20">
                        <Icons.CheckCircle size={16} style={{ color: metric.color }} className="fill-black/50" />
                    </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-xs font-bold text-[#C8C8C8] uppercase tracking-wider">{metric.label}</div>
                <div className={`text-[10px] font-mono mt-1`} style={{ color: dnaProfile ? metric.color : '#333' }}>
                    {dnaProfile ? `${metric.percent}% ANALYZED` : 'LOCKED'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#E0AA3E]/5 to-transparent pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <button onClick={() => onChangePage(Page.UPLOAD)} className="bg-[#050505] border border-[#141414] hover:border-[#E0AA3E] p-6 rounded-lg text-left transition group">
          <div className="w-10 h-10 bg-[#101010] rounded flex items-center justify-center mb-4 text-[#C8C8C8] group-hover:text-[#E0AA3E] group-hover:bg-[#E0AA3E]/10 transition">
            <Icons.Upload size={20} />
          </div>
          <h4 className="font-semibold mb-1 text-white">Upload Track</h4>
          <p className="text-xs text-[#666]">Analyze new audio DNA</p>
        </button>
        
        <button onClick={() => onChangePage(Page.DNA_REPORT)} className="bg-[#050505] border border-[#141414] hover:border-[#FFE59E] p-6 rounded-lg text-left transition group">
          <div className="w-10 h-10 bg-[#101010] rounded flex items-center justify-center mb-4 text-[#C8C8C8] group-hover:text-[#FFE59E] group-hover:bg-[#FFE59E]/10 transition">
            <Icons.DNA size={20} />
          </div>
          <h4 className="font-semibold mb-1 text-white">View DNA</h4>
          <p className="text-xs text-[#666]">Inspect your sonic signature</p>
        </button>

        <button onClick={() => onChangePage(Page.GENERATOR)} className="bg-[#050505] border border-[#141414] hover:border-[#F8F8F8] p-6 rounded-lg text-left transition group">
          <div className="w-10 h-10 bg-[#101010] rounded flex items-center justify-center mb-4 text-[#C8C8C8] group-hover:text-white group-hover:bg-white/10 transition">
            <Icons.Generator size={20} />
          </div>
          <h4 className="font-semibold mb-1 text-white">Generate</h4>
          <p className="text-xs text-[#666]">Create with Multi-Model Layer</p>
        </button>
      </div>
    </div>
  );
};

const UploadPage = ({ onComplete, onUpload }: { onComplete: () => void, onUpload: (files: File[], genre: string) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(UNDERGROUND_GENRES[0]);
  const [fileProgress, setFileProgress] = useState<number[]>([]);
  
  const folderInputRef = React.useRef<HTMLInputElement>(null);
  const uploadIntervalRef = React.useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files) as File[];
      const audioFiles = fileList.filter(f => 
        f.name.toLowerCase().endsWith('.mp3') || 
        f.name.toLowerCase().endsWith('.wav') || 
        f.name.toLowerCase().endsWith('.aiff') ||
        f.name.toLowerCase().endsWith('.flac')
      );
      
      if (audioFiles.length > 50) {
          alert("Limit is 50 files for this prototype. First 50 selected.");
          const selected = audioFiles.slice(0, 50);
          setFiles(selected);
          setFileProgress(new Array(selected.length).fill(0));
      } else {
          setFiles(audioFiles);
          setFileProgress(new Array(audioFiles.length).fill(0));
      }
    }
  };

  const startUpload = () => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    
    // Initialize progress array
    setFileProgress(new Array(files.length).fill(0));

    const totalFiles = files.length;
    let processedCount = 0;
    
    // Duration configuration
    const totalDuration = 4000; 
    const stepTime = Math.max(50, totalDuration / totalFiles);

    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);

    uploadIntervalRef.current = setInterval(() => {
      setFileProgress(prev => {
          const next = [...prev];
          // Mark previous as 100% complete
          if (processedCount > 0) next[processedCount - 1] = 100;
          
          // Mark current as "Processing" (e.g. 60%)
          if (processedCount < totalFiles) next[processedCount] = 60;
          return next;
      });

      // Update global progress based on how many are fully processed
      const pct = Math.round((processedCount / totalFiles) * 100);
      setUploadProgress(pct);

      processedCount++;

      if (processedCount > totalFiles) {
         clearInterval(uploadIntervalRef.current);
         setFileProgress(new Array(totalFiles).fill(100));
         setUploadProgress(100);
         setTimeout(() => {
             onUpload(files, selectedGenre); 
             setUploading(false);
             onComplete();
         }, 800);
      }
    }, stepTime);
  };

  const handleCancel = () => {
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }
    setUploading(false);
    setFiles([]); 
    setFileProgress([]);
    setUploadProgress(0);
  };

  // Helper to drop files
  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault(); 
      setIsDragging(false); 
      if (e.dataTransfer.files) {
           const dropped = (Array.from(e.dataTransfer.files) as File[]).filter(f => f.type.startsWith('audio/') || f.name.endsWith('.wav') || f.name.endsWith('.mp3'));
           const selected = dropped.slice(0, 50);
           setFiles(selected);
           setFileProgress(new Array(selected.length).fill(0));
      }
  };

  return (
    <div className="p-8 h-full flex flex-col animate-fade-in">
      <h2 className="text-3xl font-bold mb-2 font-family-sora">Upload Audio</h2>
      <p className="text-[#888] mb-8">Drag and drop reference tracks to categorize them into your digital crates.</p>

      <div className="mb-6">
        <label className="text-xs text-[#E0AA3E] uppercase font-bold mb-2 block">Target Genre Folder</label>
        <select 
            className="w-full md:w-1/2 bg-[#141414] border border-[#333] rounded px-4 py-3 text-white focus:border-[#E0AA3E] outline-none"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            disabled={uploading}
        >
            {UNDERGROUND_GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
            ))}
        </select>
        <p className="text-[10px] text-[#666] mt-2">Files will be analyzed and tagged with this genre for specific model training.</p>
      </div>

      <div 
        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${
          isDragging ? 'border-[#E0AA3E] bg-[#E0AA3E]/5' : 'border-[#1f1f1f] bg-[#080808]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          onChange={handleFileChange} 
          className="hidden" 
          id="file-upload" 
          disabled={uploading}
        />
        <input 
            type="file"
            // @ts-ignore
            webkitdirectory=""
            directory=""
            onChange={handleFileChange}
            className="hidden"
            ref={folderInputRef}
            disabled={uploading}
        />
        
        {files.length === 0 ? (
          <div className="text-center z-10">
            <div className="w-16 h-16 bg-[#101010] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#222]">
              <Icons.Upload className="text-[#666]" />
            </div>
            <div className="flex gap-4 justify-center">
                <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-[#1a1a1a] rounded border border-[#333] hover:border-[#E0AA3E] transition">
                    <span className="text-sm font-medium text-white">Select Files</span>
                </label>
                <button 
                    onClick={() => folderInputRef.current?.click()}
                    className="px-4 py-2 bg-[#1a1a1a] rounded border border-[#333] hover:border-[#E0AA3E] transition"
                >
                    <span className="text-sm font-medium text-white">Select Folder</span>
                </button>
            </div>
            <span className="text-[#666] block mt-4 text-xs">or drag and drop up to 50 tracks</span>
          </div>
        ) : (
          <div className="w-full h-full absolute inset-0 overflow-y-auto custom-scrollbar p-4">
             <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#080808] p-2 z-20 border-b border-[#222]">
                 <span className="text-[#E0AA3E] font-mono text-sm">{files.length} Tracks Selected</span>
                 {!uploading && (
                    <button onClick={() => { setFiles([]); setFileProgress([]); }} className="text-xs text-red-500 hover:underline">Clear All</button>
                 )}
             </div>
             <div className="grid gap-2">
                {files.map((f, i) => {
                    const progress = fileProgress[i] || 0;
                    const isComplete = progress === 100;
                    const isProcessing = progress > 0 && progress < 100;
                    const isPending = progress === 0;
                    
                    return (
                        <div key={i} className="relative bg-[#141414] p-3 rounded border border-[#222] overflow-hidden group hover:border-[#333]">
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-3 truncate">
                                    <div className="w-5 flex-shrink-0 flex justify-center">
                                        {isComplete ? (
                                            <Icons.CheckCircle size={16} className="text-[#E0AA3E]" />
                                        ) : isProcessing ? (
                                            <Icons.Loader size={16} className="text-[#E0AA3E] animate-spin" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-[#333]" title="Pending"></div>
                                        )}
                                    </div>
                                    <span className={`text-sm truncate ${isComplete ? 'text-[#E0AA3E]' : isProcessing ? 'text-white font-bold' : 'text-[#888]'}`}>
                                        {f.name}
                                    </span>
                                </div>
                                <span className="text-xs text-[#666] font-mono flex-shrink-0 ml-2 w-20 text-right">
                                    {isComplete ? 'Ready' : isProcessing ? 'Analyzing...' : 'Queue'}
                                </span>
                            </div>
                            {/* Individual File Progress Bar at Bottom */}
                            <div className="absolute bottom-0 left-0 h-[2px] bg-[#222] w-full">
                                <div 
                                    className="h-full bg-[#E0AA3E] transition-all duration-200 ease-out" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center gap-4">
        <div className="text-xs text-[#666] hidden md:block">
            Targeting: <span className="text-[#E0AA3E]">{selectedGenre}</span>
        </div>
        <div className="flex gap-3 w-full md:w-auto justify-end items-center">
            {uploading && (
                <div className="hidden md:block w-48 mr-4 animate-fade-in">
                    <div className="flex justify-between text-[10px] text-[#666] mb-1 font-mono uppercase">
                        <span>Batch Progress</span>
                        <span className="text-[#E0AA3E]">{uploadProgress}%</span>
                    </div>
                    <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-[#E0AA3E] transition-all duration-100" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </div>
            )}
            
            {uploading && (
                <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6"
                >
                    Cancel Batch
                </Button>
            )}
            <Button 
              onClick={startUpload} 
              disabled={files.length === 0 || uploading} 
              isLoading={uploading}
              loadingText="Processing Batch..."
              className="w-full md:w-auto min-w-[160px]"
            >
              {uploading ? 'Analyzing...' : `Analyze ${files.length > 0 ? files.length : ''} Tracks`}
            </Button>
        </div>
      </div>
    </div>
  );
};

const LoadingAnalysisPage = ({ 
    onFinish, 
    onCancel,
    tracks, 
    analyzingTrackId,
    onAnalysisComplete 
}: { 
    onFinish: () => void, 
    onCancel: () => void,
    tracks: Track[], 
    analyzingTrackId: string | null,
    onAnalysisComplete: (dna: DNAProfile) => void 
}) => {
  const [step, setStep] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const steps = [
    "Reading Binary Data...",
    "Extracting Tempo & Groove...",
    "Analyzing Harmonic Structures...",
    "Building Texture Profile...",
    "Finalizing DNA Sequence..."
  ];

  const targetTrack = tracks.find(t => t.id === analyzingTrackId) || (tracks.length > 0 ? tracks[tracks.length - 1] : { name: "Unknown Audio Source" } as Track);
  
  useEffect(() => {
    const stepTimer = setInterval(() => {
        setStep(s => {
            if (s >= steps.length) {
                clearInterval(stepTimer);
                return s;
            }
            return s + 1;
        });
    }, 400);

    const fileTimer = setInterval(() => {
        setCurrentFileIndex(prev => (prev + 1) % (tracks.length || 1));
    }, 100);

    return () => {
        clearInterval(stepTimer);
        clearInterval(fileTimer);
    };
  }, [steps.length, tracks.length]);

  useEffect(() => {
      if (step >= steps.length) {
          const generatedDNA = generateDNAStats(targetTrack);
          onAnalysisComplete(generatedDNA);
          setTimeout(onFinish, 500);
      }
  }, [step, onFinish, targetTrack, onAnalysisComplete]);

  const progress = Math.min(((step + 0.5) / steps.length) * 100, 100);
  const displayFileName = tracks.length > 0 ? tracks[currentFileIndex % tracks.length].name : "Buffering...";

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden animate-fade-in">
      <button 
        onClick={onCancel}
        className="absolute top-8 right-8 text-xs text-[#666] hover:text-red-500 flex items-center gap-2 transition-colors z-20 border border-transparent hover:border-red-500/20 px-3 py-2 rounded"
      >
         <Icons.Close size={14} /> Cancel Analysis
      </button>

      <div className="w-32 h-32 relative mb-12">
        <div className="absolute inset-0 border-4 border-transparent border-t-[#E0AA3E] border-b-[#FFE59E] rounded-full animate-spin duration-[2s]"></div>
        <div className="absolute inset-4 border-4 border-transparent border-r-[#E0AA3E] border-l-[#FFE59E] rounded-full animate-spin duration-[1s] reverse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
             <Icons.DNA size={32} className="text-[#E0AA3E] animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-family-sora font-bold mb-2 text-center">
          {tracks.length > 1 ? 'Batch Processing Audio Identity' : 'Analyzing Audio Identity'}
      </h2>
      <p className="text-[#E0AA3E] font-mono text-sm mb-8 h-6">{steps[Math.min(step, steps.length - 1)]}</p>

      <div className="w-64 h-1 bg-[#141414] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#E0AA3E] to-[#FFE59E] transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="mt-4 flex gap-2">
          {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= step ? 'bg-white' : 'bg-[#222]'}`} />
          ))}
      </div>
      
      <div className="absolute bottom-8 text-xs font-mono text-[#444] text-center">
          <div>Scanning: {displayFileName}</div>
          <button onClick={onCancel} className="mt-4 text-red-900 hover:text-red-500 text-[10px] uppercase">Force Quit Analysis</button>
      </div>
    </div>
  );
};

const DNAReportPage = ({ dnaProfile }: { dnaProfile: DNAProfile | null }) => {
  const [showMixingTips, setShowMixingTips] = useState(false);
  if (!dnaProfile) return <div className="p-8 text-[#888]">No DNA Profile available. Please upload tracks to analyze.</div>;

  const data = [
    { subject: 'Rhythm', A: dnaProfile.rhythm, fullMark: 100 },
    { subject: 'Harmonic', A: dnaProfile.harmonic, fullMark: 100 },
    { subject: 'Texture', A: dnaProfile.texture, fullMark: 100 },
    { subject: 'Drums', A: dnaProfile.drums, fullMark: 100 },
    { subject: 'Emotion', A: dnaProfile.emotion, fullMark: 100 },
  ];
  
  // Mock current key for prototype - in real app this would come from DNA metadata
  const currentKey = "8B"; 
  const recommendations = getMixingRecommendations(currentKey);

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-fade-in">
      <h2 className="text-3xl font-bold mb-2 font-family-sora">Sonic DNA Report</h2>
      <p className="text-[#888] mb-8">Visual representation of your extracted artist identity.</p>

      {/* --- NEW: Music Analysis Results Section --- */}
      <div className="bg-[#101010] border border-[#141414] rounded-xl p-8 mb-8 relative overflow-hidden">
          {/* Decor blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E0AA3E] rounded-full blur-[100px] opacity-5 pointer-events-none"></div>
          
          <h3 className="text-2xl font-bold text-white mb-8 font-family-sora border-b border-[#222] pb-4">Music Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Key */}
              <div className="bg-[#050505] border border-[#333] rounded-lg p-6 flex flex-col items-center justify-center relative group hover:border-[#E0AA3E] transition-colors">
                  <span className="text-xs text-[#888] uppercase tracking-widest mb-2">Camelot Key</span>
                  <div className="text-4xl font-bold text-[#E0AA3E] font-mono mb-1">{currentKey}</div>
                  <div className="text-sm text-[#C8C8C8]">C Major</div>
                  <Icons.Music className="absolute top-4 right-4 text-[#222] group-hover:text-[#E0AA3E]/20 transition-colors" size={24} />
              </div>

              {/* BPM */}
              <div className="bg-[#050505] border border-[#333] rounded-lg p-6 flex flex-col items-center justify-center relative group hover:border-[#E0AA3E] transition-colors">
                  <span className="text-xs text-[#888] uppercase tracking-widest mb-2">Tempo</span>
                  <div className="text-4xl font-bold text-white font-mono mb-1">128.0</div>
                  <div className="text-sm text-[#C8C8C8]">BPM</div>
                  <Icons.DNA className="absolute top-4 right-4 text-[#222] group-hover:text-[#E0AA3E]/20 transition-colors" size={24} />
              </div>

              {/* Energy */}
              <div className="bg-[#050505] border border-[#333] rounded-lg p-6 flex flex-col items-center justify-center relative group hover:border-[#E0AA3E] transition-colors w-full">
                  <span className="text-xs text-[#888] uppercase tracking-widest mb-4">Energy Level</span>
                  <div className="w-full h-4 bg-[#222] rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-[#E0AA3E] to-[#FFE59E]" style={{ width: '90%' }}></div>
                  </div>
                  <div className="text-xl font-bold text-white">9 / 10</div>
                  <div className="absolute top-4 right-4 text-[#222] group-hover:text-[#E0AA3E]/20 transition-colors">
                       <Icons.Generator size={24} />
                  </div>
              </div>
          </div>

          <div className="flex justify-center md:justify-start flex-col gap-4">
              <Button 
                variant="outline" 
                className="gap-2 group self-start"
                onClick={() => setShowMixingTips(!showMixingTips)}
              >
                  <span>{showMixingTips ? 'HIDE TIPS' : 'MIXING TIPS'}</span>
                  <Icons.ChevronRight size={16} className={`transition-transform ${showMixingTips ? 'rotate-90' : ''} group-hover:translate-x-1`} />
              </Button>
              
              {showMixingTips && recommendations && (
                  <div className="mt-4 bg-[#050505] border border-[#222] p-4 rounded-lg animate-fade-in">
                      <h4 className="text-white font-bold mb-4 text-sm uppercase">Harmonic Mixing Recommendations ({currentKey})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {recommendations.map((rec, idx) => (
                              <div key={idx} className="flex flex-col items-center p-3 rounded border border-[#222] bg-[#101010]">
                                  <div className="text-[10px] text-[#666] uppercase mb-1">{rec.label}</div>
                                  <div 
                                    className="text-2xl font-bold font-mono mb-1"
                                    style={{ color: getCamelotColor(rec.key) }}
                                  >
                                      {rec.key}
                                  </div>
                                  <div className="text-[10px] text-[#888]">{rec.desc}</div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </div>
      {/* --- END NEW SECTION --- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#101010] border border-[#141414] rounded-xl p-6 flex items-center justify-center min-h-[400px]">
           <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Identity" dataKey="A" stroke="#E0AA3E" strokeWidth={3} fill="#E0AA3E" fillOpacity={0.3} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#E0AA3E' }}
                />
              </RadarChart>
           </ResponsiveContainer>
        </div>

        <div className="space-y-6">
           {data.map((item, i) => (
               <div key={i} className="bg-[#101010] p-4 rounded-lg border border-[#141414]">
                   <div className="flex justify-between mb-2">
                       <span className="text-white font-medium">{item.subject}</span>
                       <span className="text-[#E0AA3E] font-mono">{item.A}%</span>
                   </div>
                   <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                       <div className="h-full bg-[#E0AA3E]" style={{ width: `${item.A}%` }}></div>
                   </div>
               </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const GeneratorPage = ({ 
  dnaProfile, 
  onSaveToLibrary, 
  onSavePrompt, 
  savedPrompts,
  tracks,
  customFolders
}: { 
  dnaProfile: DNAProfile | null, 
  onSaveToLibrary: (track: Track) => void, 
  onSavePrompt: (prompt: SavedPrompt) => void,
  savedPrompts: SavedPrompt[],
  tracks: Track[],
  customFolders: string[]
}) => {
  const [settings, setSettings] = useState({
      bpm: 124,
      key: 'A Minor',
      energy: 70,
      weirdness: 40,
      analogHeat: 60,
      instruments: [] as string[]
  });
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Combine default genres with custom folders/genres from saved prompts for the dropdown
  const allGenres = Array.from(new Set([...UNDERGROUND_GENRES, ...customFolders])).sort();

  // Mock user profiles
  const userProfiles = [
      { id: 'profile-1', name: 'Detroit Techno Focus', bpm: 135, key: 'F Minor', energy: 85, weirdness: 30 },
      { id: 'profile-2', name: 'Deep House Vibes', bpm: 122, key: 'A# Minor', energy: 60, weirdness: 20 },
      { id: 'profile-3', name: 'Ambient Textures', bpm: 90, key: 'C Major', energy: 30, weirdness: 80 },
      { id: 'profile-4', name: 'Peak Time Energy', bpm: 128, key: 'G Minor', energy: 95, weirdness: 50 },
  ];
  
  // Dynamic Key List
  const availableKeys = [
      "C Minor", "C# Minor", "D Minor", "Eb Minor", "E Minor", "F Minor", 
      "F# Minor", "G Minor", "Ab Minor", "A Minor", "Bb Minor", "B Minor",
      "C Major", "G Major", "D Major", "A Major", "E Major"
  ];

  // Initialize settings from DNA on mount
  useEffect(() => {
      if (dnaProfile) {
          // Smart defaults based on DNA
          let defaultKey = 'A Minor';
          if (dnaProfile.harmonic > 70) defaultKey = 'F# Minor'; // Darker
          if (dnaProfile.harmonic < 40) defaultKey = 'C Major'; // Brighter
          
          let defaultInstruments: string[] = [];
          if (dnaProfile.rhythm > 70) defaultInstruments.push("TB-303 Bassline");
          if (dnaProfile.texture > 70) defaultInstruments.push("Modular Synth Textures");
          if (dnaProfile.drums > 80) defaultInstruments.push("909 Drum Kit");
          
          setSettings(s => ({
              ...s,
              key: defaultKey,
              instruments: defaultInstruments
          }));
      }
  }, [dnaProfile]);

  const generate = async () => {
     if (!dnaProfile) return;
     setIsGenerating(true);
     const result = await generatePromptFromDNA(dnaProfile, settings);
     setPrompt(result || "");
     setIsGenerating(false);
  };
  
  const [selectedContextId, setSelectedContextId] = useState("");
  const [dnaTagName, setDnaTagName] = useState(dnaProfile ? "Custom DNA" : "Raw Analysis");
  const [trackTitle, setTrackTitle] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSavePromptDialog, setShowSavePromptDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync when context changes
  useEffect(() => {
      if (!selectedContextId) return;
      
      // Check if it's a track
      const refTrack = tracks.find(t => t.id === selectedContextId);
      if (refTrack) {
          setSettings(prev => ({
              ...prev,
              bpm: refTrack.bpm || 124,
              key: refTrack.key || 'A Minor'
          }));
          setDnaTagName(`Ref: ${refTrack.name.substring(0, 20)}`);
          return;
      }
      
      // Check if it's a profile
      const refProfile = userProfiles.find(p => p.id === selectedContextId);
      if (refProfile) {
           setSettings(prev => ({
              ...prev,
              bpm: refProfile.bpm,
              key: refProfile.key,
              energy: refProfile.energy,
              weirdness: refProfile.weirdness
          }));
          setDnaTagName(refProfile.name);
      }
      
      // Check if it's a Genre Mode
      if (selectedContextId.startsWith('genre-')) {
          const genreName = selectedContextId.replace('genre-', '');
          // Mock genre settings
          if (genreName.includes('Techno')) {
               setSettings(prev => ({ ...prev, bpm: 132, key: 'F Minor', energy: 85 }));
          } else if (genreName.includes('House')) {
               setSettings(prev => ({ ...prev, bpm: 124, key: 'A Minor', energy: 70 }));
          } else if (genreName.includes('Ambient')) {
               setSettings(prev => ({ ...prev, bpm: 90, key: 'C Major', energy: 40 }));
          }
          setDnaTagName(`Genre Focus: ${genreName}`);
      }

  }, [selectedContextId, tracks]);

  const savePrompt = () => {
      if (!prompt) return;
      setShowSavePromptDialog(true);
  };
  
  const [savePromptGenre, setSavePromptGenre] = useState(UNDERGROUND_GENRES[0]);
  const [savePromptRating, setSavePromptRating] = useState(0);
  
  const confirmSavePrompt = () => {
      onSavePrompt({
          id: Math.random().toString(36).substr(2, 9),
          text: prompt,
          genre: savePromptGenre,
          rating: savePromptRating,
          createdAt: new Date().toISOString(),
          bpm: settings.bpm,
          key: settings.key
      });
      setShowSavePromptDialog(false);
  };
  
  const handleSave = async () => {
      if (!trackTitle) return;
      setSaving(true);
      await new Promise(r => setTimeout(r, 1000)); // Sim
      
      // Random duration between 3:30 and 8:00
      const minSec = 210; 
      const maxSec = 480;
      const totalSec = Math.floor(Math.random() * (maxSec - minSec + 1)) + minSec;
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      const durationStr = `${min}:${sec < 10 ? '0' + sec : sec}`;

      onSaveToLibrary({
          id: Math.random().toString(36).substr(2, 9),
          name: trackTitle,
          size: '14.2 MB',
          status: 'complete',
          progress: 100,
          date: 'Just now',
          dnaName: dnaTagName, // Use the custom tag
          bpm: settings.bpm,
          key: settings.key,
          genre: savePromptGenre, // Re-use genre from context
          duration: durationStr
      });
      setSaving(false);
      setShowSaveDialog(false);
      setTrackTitle("");
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar animate-fade-in flex flex-col lg:flex-row gap-6 md:gap-8">
       <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-0">
             <div>
                 <h2 className="text-2xl md:text-3xl font-bold mb-2 font-family-sora">Prompt Generator</h2>
                 <p className="text-[#888]">Generates optimized prompts for external models based on your DNA.</p>
             </div>
             {/* Moved Copy Prompt button to header for accessibility */}
             <div className="flex gap-2 items-center self-start md:self-end">
                 <span className="text-xs font-bold text-[#E0AA3E] uppercase">Output</span>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {if(prompt) navigator.clipboard.writeText(prompt)}}
                    className={`text-xs py-1 ${!prompt ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!prompt}
                 >
                    <Icons.Copy size={12} className="mr-1" /> Copy Prompt
                 </Button>
             </div>
          </div>

          <div className="bg-[#101010] p-6 rounded-xl border border-[#141414] space-y-6">
             {/* Context Selector */}
             <div>
                 <label className="text-xs text-[#888] uppercase mb-2 block">Reference Context (Production Mode)</label>
                 <div className="relative">
                     <select 
                        className="w-full bg-[#222] border border-[#333] text-white p-3 rounded appearance-none outline-none focus:border-[#E0AA3E]"
                        value={selectedContextId}
                        onChange={(e) => setSelectedContextId(e.target.value)}
                     >
                         <option value="">Use Raw DNA Profile (Default)</option>
                         <optgroup label="Saved DNA Profiles">
                             {userProfiles.map(p => (
                                 <option key={p.id} value={p.id}>{p.name}</option>
                             ))}
                         </optgroup>
                         <optgroup label="Production Mode / Genre Focus">
                             {UNDERGROUND_GENRES.map(g => (
                                 <option key={`genre-${g}`} value={`genre-${g}`}>Genre Focus: {g}</option>
                             ))}
                         </optgroup>
                         <optgroup label="Library Reference Tracks">
                             {tracks.map(t => (
                                 <option key={t.id} value={t.id}>Track: {t.name}</option>
                             ))}
                         </optgroup>
                     </select>
                     <Icons.ChevronDown className="absolute right-3 top-3 text-[#666] pointer-events-none" size={16} />
                 </div>
                 {selectedContextId && (
                     <div className="text-[10px] text-[#E0AA3E] mt-2 flex items-center gap-1">
                         <Icons.CheckCircle size={10} /> 
                         {selectedContextId.startsWith('profile') ? ' User Identity Loaded' : 
                          selectedContextId.startsWith('genre') ? ' Genre Constraints Applied' : ' Track Metadata Synced'}
                     </div>
                 )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <div className="flex justify-between mb-2">
                        <label className="text-xs text-[#888] uppercase">Target BPM</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                min="60" 
                                max="180" 
                                value={settings.bpm}
                                onChange={e => setSettings({...settings, bpm: Math.max(60, Math.min(180, parseInt(e.target.value) || 124))})}
                                className="bg-[#050505] border border-[#333] rounded px-2 py-0.5 text-[#E0AA3E] font-mono text-xs w-16 text-center focus:outline-none focus:border-[#E0AA3E]"
                            />
                            <span className="text-[10px] text-[#444]">BPM</span>
                        </div>
                     </div>
                     <input 
                        type="range" 
                        min="60" 
                        max="180" 
                        value={settings.bpm} 
                        onChange={e => setSettings({...settings, bpm: parseInt(e.target.value)})} 
                        className="w-full accent-[#E0AA3E] h-1 bg-[#333] rounded-lg appearance-none cursor-pointer" 
                     />
                 </div>
                 
                 <div>
                     <div className="flex justify-between mb-2">
                        <label className="text-xs text-[#888] uppercase">Musical Key</label>
                        <span className="text-xs text-[#E0AA3E] font-mono">{settings.key}</span>
                     </div>
                     <div className="relative">
                         <select 
                            className="w-full bg-[#222] border border-[#333] text-white p-2 pr-8 rounded appearance-none text-sm focus:border-[#E0AA3E] outline-none"
                            value={settings.key} 
                            onChange={e => setSettings({...settings, key: e.target.value})}
                         >
                             {availableKeys.map(k => (
                                 <option key={k} value={k}>{k}</option>
                             ))}
                         </select>
                         <Icons.ChevronDown className="absolute right-2 top-2.5 text-[#666] pointer-events-none" size={14} />
                     </div>
                 </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-[#888] uppercase mb-2">Energy</label>
                    <input type="range" value={settings.energy} onChange={e => setSettings({...settings, energy: parseInt(e.target.value)})} className="w-full accent-[#E0AA3E]" />
                </div>
                <div>
                    <label className="block text-xs text-[#888] uppercase mb-2">Weirdness</label>
                    <input type="range" value={settings.weirdness} onChange={e => setSettings({...settings, weirdness: parseInt(e.target.value)})} className="w-full accent-[#E0AA3E]" />
                </div>
             </div>

             <Button 
                  onClick={generate} 
                  disabled={!dnaProfile || isGenerating} 
                  isLoading={isGenerating} 
                  loadingText="Synthesizing..."
                  className="w-full"
              >
                  {isGenerating ? 'Synthesizing...' : 'Generate Prompt'}
              </Button>
          </div>
       </div>

       <div className="flex-1 bg-[#101010] border border-[#141414] rounded-xl p-4 md:p-6 flex flex-col min-h-[400px] lg:min-h-0">
           
           {/* Editable Prompt Area */}
           <div className="flex-1 relative group mt-2">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={dnaProfile ? "Ready to generate..." : "DNA Profile required."}
                    className="w-full h-full bg-[#050505] border border-[#222] rounded-lg p-4 text-[#C8C8C8] font-mono text-sm leading-relaxed resize-none focus:border-[#E0AA3E] focus:outline-none min-h-[300px]"
                />
           </div>

           {/* Action Buttons */}
           <div className="mt-4 flex justify-end gap-2">
               <Button variant="secondary" size="sm" onClick={savePrompt} disabled={!prompt}>Save Prompt</Button>
               <Button variant="primary" size="sm" onClick={() => setShowSaveDialog(true)} disabled={!prompt}>Generate Track</Button>
           </div>
       </div>

       {/* Save Prompt Dialog Overlay */}
       {showSavePromptDialog && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
               <div className="bg-[#101010] border border-[#E0AA3E] p-8 rounded-xl w-full max-w-md relative shadow-[0_0_50px_rgba(224,170,62,0.1)]">
                   <h3 className="text-2xl font-bold font-family-sora mb-6">Save Prompt to Bank</h3>
                   
                   <div className="space-y-4">
                       <div>
                           <label className="text-xs text-[#888] uppercase block mb-2">Genre Folder</label>
                           <select 
                                className="w-full bg-[#050505] border border-[#333] p-3 rounded text-white focus:border-[#E0AA3E] outline-none"
                                value={savePromptGenre}
                                onChange={(e) => setSavePromptGenre(e.target.value)}
                           >
                               {allGenres.map(g => (
                                   <option key={g} value={g}>{g}</option>
                               ))}
                           </select>
                       </div>
                       <div>
                           <label className="text-xs text-[#888] uppercase block mb-2">Rating</label>
                           <div className="flex gap-2">
                               {[1,2,3,4,5].map(star => (
                                   <button key={star} onClick={() => setSavePromptRating(star)} className="focus:outline-none transform hover:scale-110 transition-transform">
                                       <Icons.Star size={24} className={star <= savePromptRating ? "text-[#E0AA3E] fill-[#E0AA3E]" : "text-[#333]"} />
                                   </button>
                               ))}
                           </div>
                       </div>
                   </div>

                   <div className="mt-8 flex gap-4">
                       <Button 
                            variant="ghost" 
                            className="flex-1" 
                            onClick={() => setShowSavePromptDialog(false)}
                       >
                           Cancel
                       </Button>
                       <Button 
                            variant="primary" 
                            className="flex-1" 
                            onClick={confirmSavePrompt}
                       >
                           Save
                       </Button>
                   </div>
               </div>
           </div>
       )}

       {/* Save Track Dialog Overlay */}
       {showSaveDialog && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
               <div className="bg-[#101010] border border-[#E0AA3E] p-8 rounded-xl w-full max-w-md relative shadow-[0_0_50px_rgba(224,170,62,0.1)]">
                   <h3 className="text-2xl font-bold font-family-sora mb-6">Generation Complete</h3>
                   
                   <div className="space-y-4">
                       <div>
                           <label className="text-xs text-[#888] uppercase block mb-2">Track Title</label>
                           <input 
                                type="text" 
                                className="w-full bg-[#050505] border border-[#333] p-3 rounded text-white focus:border-[#E0AA3E] outline-none"
                                placeholder="Enter title..."
                                value={trackTitle}
                                onChange={e => setTrackTitle(e.target.value)}
                                autoFocus
                           />
                       </div>
                       <div>
                           <label className="text-xs text-[#888] uppercase block mb-2">DNA Profile Tag</label>
                           <input 
                                type="text" 
                                className="w-full bg-[#050505] border border-[#333] p-3 rounded text-[#E0AA3E] focus:border-[#E0AA3E] outline-none font-mono text-sm"
                                value={dnaTagName}
                                onChange={e => setDnaTagName(e.target.value)}
                           />
                           <p className="text-[10px] text-[#666] mt-1">Metadata tag for the generated file.</p>
                       </div>
                   </div>

                   <div className="mt-8 flex gap-4">
                       <Button 
                            variant="ghost" 
                            className="flex-1" 
                            onClick={() => setShowSaveDialog(false)}
                       >
                           Discard
                       </Button>
                       <Button 
                            variant="primary" 
                            className="flex-1" 
                            onClick={handleSave}
                            isLoading={saving}
                            loadingText="Saving..."
                            disabled={!trackTitle}
                       >
                           Save to Library
                       </Button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

const LibraryPage = ({ 
  tracks, 
  onDeleteTrack,
  savedPrompts,
  onUpdatePrompt,
  onDeletePrompt,
  customFolders,
  onCreateFolder
}: { 
  tracks: Track[], 
  onDeleteTrack: (id: string) => void,
  savedPrompts: SavedPrompt[],
  onUpdatePrompt: (p: SavedPrompt) => void,
  onDeletePrompt: (id: string) => void,
  customFolders: string[],
  onCreateFolder: (name: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'prompts'>('tracks');
  const [selectedFolder, setSelectedFolder] = useState<string>(UNDERGROUND_GENRES[0]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editPromptText, setEditPromptText] = useState("");
  const [editPromptGenre, setEditPromptGenre] = useState("");

  const filteredPrompts = savedPrompts.filter(p => p.genre === selectedFolder);

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-fade-in flex flex-col">
      <div className="flex justify-between items-end mb-8">
          <div>
              <h2 className="text-3xl font-bold mb-2 font-family-sora">Library</h2>
              <p className="text-[#888]">Manage your audio assets and creative prompts.</p>
          </div>
          <div className="flex gap-2 bg-[#101010] p-1 rounded-lg border border-[#222]">
              <button 
                  onClick={() => setActiveTab('tracks')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'tracks' ? 'bg-[#E0AA3E] text-black shadow-lg' : 'text-[#888] hover:text-white'}`}
              >
                  Audio Tracks
              </button>
              <button 
                  onClick={() => setActiveTab('prompts')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'prompts' ? 'bg-[#E0AA3E] text-black shadow-lg' : 'text-[#888] hover:text-white'}`}
              >
                  Prompt Bank
              </button>
          </div>
      </div>

      {activeTab === 'tracks' ? (
          <div className="bg-[#101010] border border-[#141414] rounded-xl overflow-hidden flex-1">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#222] text-xs text-[#666] font-bold uppercase tracking-wider bg-[#080808]">
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-4">Track Name</div>
                  <div className="col-span-3">DNA Profile / Source</div>
                  <div className="col-span-2 text-right">Duration</div>
                  <div className="col-span-2 text-right">Actions</div>
              </div>
              <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-250px)]">
                 {tracks.length === 0 ? (
                     <div className="p-8 text-center text-[#444] italic">No tracks in library.</div>
                 ) : (
                     tracks.map((track, idx) => {
                         const isGenerated = track.dnaName && track.dnaName !== "Raw Analysis";
                         return (
                             <div key={track.id} className={`grid grid-cols-12 gap-4 p-3 items-center border-b border-[#1f1f1f] hover:bg-[#1a1a1a] transition-colors group text-sm ${idx % 2 === 0 ? 'bg-[#0d0d0d]' : 'bg-[#101010]'}`}>
                                 <div className="col-span-1 flex justify-center">
                                     {track.status === 'complete' ? (
                                         <Icons.CheckCircle size={14} className="text-[#E0AA3E]" />
                                     ) : (
                                         <Icons.Loader size={14} className="text-[#666] animate-spin" />
                                     )}
                                 </div>
                                 <div className="col-span-4 font-medium text-white truncate pr-2">
                                     {track.name}
                                     <div className="text-[10px] text-[#666] font-normal">{track.genre || 'Unknown'} • {track.bpm} BPM • {track.key}</div>
                                 </div>
                                 <div className="col-span-3 truncate flex items-center gap-2" title={track.dnaName}>
                                     {isGenerated ? <Icons.DNA size={12} className="text-[#E0AA3E]" /> : null}
                                     <span className={isGenerated ? "text-[#E0AA3E]" : "text-[#666]"}>
                                         {track.dnaName || 'Raw Analysis'}
                                     </span>
                                 </div>
                                 <div className="col-span-2 text-right font-mono text-[#C8C8C8]">{track.duration || '--:--'}</div>
                                 <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button className="p-1 hover:text-[#E0AA3E] transition-colors"><Icons.Download size={14} /></button>
                                     <button 
                                        onClick={() => onDeleteTrack(track.id)}
                                        className="p-1 hover:text-red-500 transition-colors"
                                     >
                                         <Icons.Trash size={14} />
                                     </button>
                                 </div>
                             </div>
                         );
                     })
                 )}
              </div>
          </div>
      ) : (
          <div className="flex gap-6 h-full min-h-0">
              {/* Folders Sidebar */}
              <div className="w-64 bg-[#101010] border border-[#141414] rounded-xl flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-[#222] flex justify-between items-center bg-[#080808]">
                      <span className="text-xs font-bold text-[#666] uppercase">Genre Folders</span>
                      <button 
                        onClick={() => setIsCreatingFolder(true)} 
                        className="text-[#E0AA3E] hover:bg-[#E0AA3E]/10 p-1 rounded"
                      >
                          <Icons.Plus size={14} />
                      </button>
                  </div>
                  
                  {isCreatingFolder && (
                      <div className="p-2 bg-[#1a1a1a] border-b border-[#333]">
                          <input 
                            autoFocus
                            className="w-full bg-black border border-[#333] text-white text-xs p-1 rounded mb-2 outline-none focus:border-[#E0AA3E]"
                            placeholder="Folder Name..."
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') {
                                    onCreateFolder(newFolderName);
                                    setNewFolderName("");
                                    setIsCreatingFolder(false);
                                }
                            }}
                          />
                          <div className="flex gap-1">
                              <button onClick={() => setIsCreatingFolder(false)} className="text-[10px] text-[#666] px-2 py-1 bg-[#222] rounded">Cancel</button>
                              <button onClick={() => { onCreateFolder(newFolderName); setNewFolderName(""); setIsCreatingFolder(false); }} className="text-[10px] bg-[#E0AA3E] text-black px-2 py-1 rounded">Add</button>
                          </div>
                      </div>
                  )}

                  <div className="overflow-y-auto custom-scrollbar flex-1 p-2 space-y-1">
                      {customFolders.map(folder => {
                          // Count items in this folder
                          const count = savedPrompts.filter(p => p.genre === folder).length;
                          return (
                              <button
                                  key={folder}
                                  onClick={() => setSelectedFolder(folder)}
                                  className={`w-full text-left px-3 py-2 rounded flex justify-between items-center text-sm ${selectedFolder === folder ? 'bg-[#E0AA3E]/10 text-[#E0AA3E] border border-[#E0AA3E]/30' : 'text-[#888] hover:bg-[#1a1a1a] hover:text-white border border-transparent'}`}
                              >
                                  <span className="truncate">{folder}</span>
                                  <span className="text-[10px] opacity-50 font-mono bg-black/30 px-1.5 rounded-full">{count}</span>
                              </button>
                          );
                      })}
                  </div>
              </div>

              {/* Prompts List */}
              <div className="flex-1 bg-[#101010] border border-[#141414] rounded-xl overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-[#222] bg-[#080808] flex justify-between items-center">
                      <h3 className="font-bold text-white">{selectedFolder} <span className="text-[#666] font-normal text-sm">({filteredPrompts.length} Prompts)</span></h3>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 content-start">
                      {filteredPrompts.length === 0 ? (
                          <div className="col-span-full text-center py-12 text-[#444] italic">No saved prompts in this folder.</div>
                      ) : (
                          filteredPrompts.map(prompt => (
                              <div key={prompt.id} className="bg-[#050505] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-colors group flex flex-col h-[220px]">
                                  {editingPromptId === prompt.id ? (
                                      <div className="flex-1 flex flex-col">
                                          <textarea 
                                              className="flex-1 bg-[#111] border border-[#333] text-xs text-[#C8C8C8] p-2 rounded mb-2 outline-none focus:border-[#E0AA3E]"
                                              value={editPromptText}
                                              onChange={(e) => setEditPromptText(e.target.value)}
                                          />
                                          <div className="flex justify-between items-center mt-2">
                                              <select 
                                                  className="bg-[#111] border border-[#333] text-xs text-[#888] p-1 rounded outline-none"
                                                  value={editPromptGenre}
                                                  onChange={(e) => setEditPromptGenre(e.target.value)}
                                              >
                                                  {customFolders.map(f => <option key={f} value={f}>{f}</option>)}
                                              </select>
                                              <div className="flex gap-2">
                                                  <button onClick={() => setEditingPromptId(null)} className="text-xs text-[#666] hover:text-white">Cancel</button>
                                                  <button 
                                                    onClick={() => {
                                                        onUpdatePrompt({ ...prompt, text: editPromptText, genre: editPromptGenre });
                                                        setEditingPromptId(null);
                                                    }} 
                                                    className="text-xs text-[#E0AA3E] font-bold hover:underline"
                                                  >Save</button>
                                              </div>
                                          </div>
                                      </div>
                                  ) : (
                                      <>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex gap-1">
                                                {[1,2,3,4,5].map(star => (
                                                    <button 
                                                        key={star} 
                                                        onClick={() => onUpdatePrompt({ ...prompt, rating: star })}
                                                        className="focus:outline-none"
                                                    >
                                                        <Icons.Star 
                                                            size={12} 
                                                            className={star <= prompt.rating ? "text-[#E0AA3E] fill-[#E0AA3E]" : "text-[#222]"} 
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => {
                                                        setEditingPromptId(prompt.id);
                                                        setEditPromptText(prompt.text);
                                                        setEditPromptGenre(prompt.genre);
                                                    }}
                                                    className="text-[#666] hover:text-white"
                                                ><Icons.Edit size={14} /></button>
                                                <button onClick={() => navigator.clipboard.writeText(prompt.text)} className="text-[#666] hover:text-white"><Icons.Copy size={14} /></button>
                                                <button onClick={() => onDeletePrompt(prompt.id)} className="text-[#666] hover:text-red-500"><Icons.Trash size={14} /></button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#C8C8C8] font-mono leading-relaxed line-clamp-6 flex-1">{prompt.text}</p>
                                        <div className="mt-3 pt-3 border-t border-[#1f1f1f] flex justify-between items-center text-[10px] text-[#555]">
                                            <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                                            <span className="font-mono">{prompt.bpm} BPM • {prompt.key}</span>
                                        </div>
                                      </>
                                  )}
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const SettingsPage = () => (
    <div className="p-8 h-full animate-fade-in">
        <h2 className="text-3xl font-bold mb-2 font-family-sora">Settings</h2>
        <p className="text-[#888]">Configure your studio preferences.</p>
        <div className="mt-8 p-6 border border-[#222] rounded bg-[#101010]">
            <p className="text-[#666]">Settings configuration not implemented in this preview.</p>
            <div className="mt-8 pt-8 border-t border-[#222]">
                 <h4 className="text-red-500 font-bold mb-4 flex items-center gap-2"><Icons.Trash size={16}/> Danger Zone</h4>
                 <p className="text-xs text-[#666] mb-4">Permanently remove your identity analysis.</p>
                 <Button variant="outline" className="border-red-900 text-red-900 hover:bg-red-900/20">Reset Beat DNA</Button>
            </div>
        </div>
    </div>
  );

const ArchitecturePage = () => (
    <div className="p-8 h-full animate-fade-in overflow-y-auto custom-scrollbar">
        <h2 className="text-3xl font-bold mb-2 font-family-sora">Model Architecture</h2>
        <p className="text-[#888] mb-8">Under the hood of the Identity Engine.</p>
        
        <div className="space-y-12">
            {/* Phase 1 */}
            <div className="bg-[#101010] border border-[#141414] rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 bg-[#E0AA3E] h-full"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-[#E0AA3E] text-black text-xs px-2 py-1 rounded font-mono">PHASE 1</span> 
                    Identity Extraction Engine
                </h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="bg-[#050505] border border-[#333] p-4 rounded-lg w-48 text-center">
                        <Icons.Upload className="mx-auto mb-2 text-[#666]" />
                        <div className="text-sm font-bold text-white">Raw Audio</div>
                        <div className="text-xs text-[#666] mt-1">MP3 / WAV Batch</div>
                    </div>
                    <div className="h-8 w-[2px] md:w-12 md:h-[2px] bg-[#333]"></div>
                    <div className="bg-[#1a1a1a] border border-[#E0AA3E] p-6 rounded-lg flex-1 text-center relative shadow-[0_0_20px_rgba(224,170,62,0.1)]">
                         <div className="absolute inset-0 bg-[#E0AA3E]/5 animate-pulse"></div>
                         <Icons.Cpu className="mx-auto mb-2 text-[#E0AA3E]" />
                         <div className="text-lg font-bold text-[#E0AA3E]">Analysis Core</div>
                         <div className="text-xs text-[#888] mt-2">FFT Spectrum • Transient Detection • Key Analysis</div>
                    </div>
                    <div className="h-8 w-[2px] md:w-12 md:h-[2px] bg-[#333]"></div>
                    <div className="bg-[#050505] border border-[#333] p-4 rounded-lg w-48 text-center">
                        <Icons.DNA className="mx-auto mb-2 text-[#00CCFF]" />
                        <div className="text-sm font-bold text-white">Beat DNA JSON</div>
                        <div className="text-xs text-[#666] mt-1">Parametric Profile</div>
                    </div>
                </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-[#101010] border border-[#141414] rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 bg-[#FFE59E] h-full"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-[#FFE59E] text-black text-xs px-2 py-1 rounded font-mono">PHASE 2</span> 
                    Multi-Model Prompt Layer
                </h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="bg-[#050505] border border-[#333] p-4 rounded-lg w-40 text-center">
                         <div className="text-xs font-mono text-[#E0AA3E] mb-1">INPUT</div>
                         <div className="font-bold text-white">DNA Profile</div>
                    </div>
                    <div className="h-8 w-[2px] md:w-8 md:h-[2px] bg-[#333]"></div>
                    <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg w-48 text-center">
                         <Icons.GitBranch className="mx-auto mb-2 text-white" />
                         <div className="text-sm font-bold">Context Router</div>
                    </div>
                    <div className="h-8 w-[2px] md:w-8 md:h-[2px] bg-[#333]"></div>
                     <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg flex-1 text-center">
                         <div className="flex justify-center gap-4 mb-2 opacity-50">
                             <Icons.Cloud size={16} /> <Icons.Zap size={16} />
                         </div>
                         <div className="text-sm font-bold text-[#FFE59E]">Prompt Engineering</div>
                         <div className="text-xs text-[#666] mt-1">Gemini LLM Optimization</div>
                    </div>
                    <div className="h-8 w-[2px] md:w-8 md:h-[2px] bg-[#333]"></div>
                     <div className="bg-[#050505] border border-[#333] p-4 rounded-lg w-48 text-center">
                        <Icons.FileText className="mx-auto mb-2 text-[#FFE59E]" />
                        <div className="text-sm font-bold text-white">Optimized Prompts</div>
                        <div className="text-xs text-[#666] mt-1">External Audio</div>
                    </div>
                </div>
            </div>

            {/* Phase 3 */}
            <div className="border-2 border-dashed border-[#222] rounded-xl p-8 opacity-60 hover:opacity-100 transition-opacity">
                 <h3 className="text-xl font-bold text-[#666] mb-6 flex items-center gap-3">
                    <span className="bg-[#333] text-[#888] text-xs px-2 py-1 rounded font-mono">PHASE 3</span> 
                    Syntax Custom Model (In Development)
                </h3>
                <div className="flex justify-center items-center">
                    <div className="text-center">
                         <Icons.Lock className="mx-auto mb-4 text-[#333]" size={48} />
                         <div className="text-sm text-[#666] max-w-md">
                             Proprietary diffusion model trained on 50,000+ hours of curated underground electronic music. 
                             Will allow direct audio-to-audio generation bypassing text prompts.
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Main Layout wrapper - extracted from App to fix prop typing issues
const MainLayout = ({ 
  children,
  currentPage,
  setCurrentPage
}: { 
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
}) => (
  <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
    <aside className="w-64 border-r border-[#141414] flex flex-col bg-[#050505]">
      <div className="p-6 cursor-pointer" onClick={() => setCurrentPage(Page.LANDING)}>
          <Logo />
      </div>
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        <div className="px-4 mb-2 text-xs font-bold text-[#444] uppercase tracking-wider">Studio</div>
        <NavItem icon={Icons.Grid} label="Dashboard" active={currentPage === Page.DASHBOARD} onClick={() => setCurrentPage(Page.DASHBOARD)} />
        <NavItem icon={Icons.Upload} label="Upload Source" active={currentPage === Page.UPLOAD} onClick={() => setCurrentPage(Page.UPLOAD)} />
        <NavItem icon={Icons.DNA} label="DNA Report" active={currentPage === Page.DNA_REPORT} onClick={() => setCurrentPage(Page.DNA_REPORT)} />
        
        <div className="px-4 mb-2 mt-6 text-xs font-bold text-[#444] uppercase tracking-wider">Creation</div>
        <NavItem icon={Icons.Generator} label="Generator" active={currentPage === Page.GENERATOR} onClick={() => setCurrentPage(Page.GENERATOR)} />
        <NavItem icon={Icons.Library} label="Library" active={currentPage === Page.LIBRARY} onClick={() => setCurrentPage(Page.LIBRARY)} />
        
        <div className="px-4 mb-2 mt-6 text-xs font-bold text-[#444] uppercase tracking-wider">System</div>
        <NavItem icon={Icons.Architecture} label="Architecture" active={currentPage === Page.ARCHITECTURE} onClick={() => setCurrentPage(Page.ARCHITECTURE)} />
        <NavItem icon={Icons.Settings} label="Settings" active={currentPage === Page.SETTINGS} onClick={() => setCurrentPage(Page.SETTINGS)} />
      </div>
      <div className="p-4 border-t border-[#141414]">
          <div className="flex items-center gap-3 p-2 rounded hover:bg-[#111] cursor-pointer transition">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E0AA3E] to-[#FFE59E]"></div>
              <div>
                  <div className="text-sm font-bold">Creator</div>
                  <div className="text-xs text-[#666]">Pro Plan</div>
              </div>
          </div>
      </div>
    </aside>
    <main className="flex-1 bg-black relative overflow-hidden">
       {/* Background Ambient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[-50%] right-[-50%] w-[1000px] h-[1000px] bg-[#E0AA3E] rounded-full blur-[200px] opacity-[0.03]"></div>
           <div className="absolute bottom-[-50%] left-[-50%] w-[1000px] h-[1000px] bg-[#FFE59E] rounded-full blur-[200px] opacity-[0.03]"></div>
      </div>
      <div className="relative z-10 h-full">
          {children}
      </div>
    </main>
  </div>
);

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [analyzingTrackId, setAnalyzingTrackId] = useState<string | null>(null);

  // Lazy Initialization for persistence to prevent overwrite on refresh
  const [tracks, setTracks] = useState<Track[]>(() => {
      try {
          const saved = localStorage.getItem('syntax_tracks');
          return saved ? JSON.parse(saved) : [];
      } catch (e) { return []; }
  });

  const [dnaProfile, setDnaProfile] = useState<DNAProfile | null>(() => {
      try {
          const saved = localStorage.getItem('syntax_dna');
          return saved ? JSON.parse(saved) : null;
      } catch (e) { return null; }
  });

  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
      try {
          const saved = localStorage.getItem('syntax_prompts');
          return saved ? JSON.parse(saved) : [];
      } catch (e) { return []; }
  });

  const [userFolders, setUserFolders] = useState<string[]>(() => {
      try {
          const saved = localStorage.getItem('syntax_folders');
          return saved ? JSON.parse(saved) : [];
      } catch (e) { return []; }
  });

  // Mount effect
  useEffect(() => {
      setIsLoaded(true);
  }, []);

  // Persistence Effects
  useEffect(() => {
      if (isLoaded) localStorage.setItem('syntax_tracks', JSON.stringify(tracks));
  }, [tracks, isLoaded]);

  useEffect(() => {
      if (isLoaded) localStorage.setItem('syntax_dna', JSON.stringify(dnaProfile));
  }, [dnaProfile, isLoaded]);
  
  useEffect(() => {
      if (isLoaded) localStorage.setItem('syntax_prompts', JSON.stringify(savedPrompts));
  }, [savedPrompts, isLoaded]);

  useEffect(() => {
      if (isLoaded) localStorage.setItem('syntax_folders', JSON.stringify(userFolders));
  }, [userFolders, isLoaded]);


  const handleUpload = (files: File[], genre: string) => {
      const newTracks = files.map(f => {
          // Improved Regex for Metadata
          // BPM: Looks for numbers 60-200, avoiding "01", "2024" etc.
          const bpmMatch = f.name.match(/\b(6[0-9]|[7-9][0-9]|1[0-9]{2}|200)\s?(?:bpm|BPM)?\b/);
          
          // Key: Supports Camelot (8A, 11B) or standard (Cm, F#min)
          // Camelot: 1-12 followed by A or B
          const camelotMatch = f.name.match(/\b([1-9]|1[0-2])[AB]\b/);
          // Standard: C, C#, Db, etc followed by Maj/Min/m
          const standardKeyMatch = f.name.match(/\b([A-G][#b]?)\s?(maj|min|m)\b/i);
          
          let detectedKey = camelotMatch ? camelotMatch[0] : (standardKeyMatch ? standardKeyMatch[0] : undefined);
          let detectedBpm = bpmMatch ? parseInt(bpmMatch[1]) : undefined;

          // Fallback Deterministic generation if no metadata found
          if (!detectedKey || !detectedBpm) {
               const seed = generateHash(f.name);
               if (!detectedBpm) detectedBpm = seededRandom(seed, 10) + 70; // 70-170 range
               if (!detectedKey) {
                   const keys = ["8A", "5A", "1A", "4A", "9A", "6A"]; // Common underground keys
                   detectedKey = keys[seed % keys.length];
               }
          }

          return {
              id: Math.random().toString(36).substr(2, 9),
              name: f.name,
              size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
              status: 'complete' as const,
              progress: 100,
              date: new Date().toLocaleDateString(),
              genre: genre,
              dnaName: 'Raw Analysis',
              bpm: detectedBpm,
              key: detectedKey,
              duration: 'Original'
          };
      });
      
      setTracks(prev => [...prev, ...newTracks]);
      // Set ID for the LoadingAnalysisPage to focus on
      if (newTracks.length > 0) {
          setAnalyzingTrackId(newTracks[newTracks.length - 1].id);
      }
  };

  const handleAnalysisComplete = (dna: DNAProfile) => {
      setDnaProfile(dna);
  };

  const handleSaveToLibrary = (track: Track) => {
      setTracks(prev => [track, ...prev]);
      setCurrentPage(Page.LIBRARY);
  };

  const handleSavePrompt = (prompt: SavedPrompt) => {
      setSavedPrompts(prev => [prompt, ...prev]);
  };
  
  // --- Library Handlers ---
  const handleDeleteTrack = (id: string) => {
    if (window.confirm("Are you sure you want to delete this track?")) {
       setTracks(prev => prev.filter(t => t.id !== id));
    }
  };
  
  const handleUpdatePrompt = (updated: SavedPrompt) => {
      setSavedPrompts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeletePrompt = (id: string) => {
      if (window.confirm("Delete this prompt?")) {
          setSavedPrompts(prev => prev.filter(p => p.id !== id));
      }
  };

  const handleCreateFolder = (name: string) => {
      if (name && !userFolders.includes(name)) {
          setUserFolders(prev => [...prev, name]);
      }
  };
  
  // Combine generic genres + user created folders + any genres found on tracks
  const allFolders = Array.from(new Set([...UNDERGROUND_GENRES, ...userFolders, ...tracks.map(t => t.genre || '').filter(Boolean)])).sort();


  if (currentPage === Page.LANDING) {
      return <LandingPage onStart={() => setCurrentPage(Page.DASHBOARD)} />;
  }

  return (
      <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
          {currentPage === Page.DASHBOARD && (
              <DashboardPage 
                  onChangePage={setCurrentPage} 
                  dnaProfile={dnaProfile} 
                  onResetDNA={() => {
                      if (confirm("Reset all identity data? This cannot be undone.")) {
                        setDnaProfile(null);
                        setAnalyzingTrackId(null);
                        localStorage.removeItem('syntax_dna');
                      }
                  }} 
              />
          )}
          {currentPage === Page.UPLOAD && (
              <UploadPage 
                  onComplete={() => setCurrentPage(Page.DNA_LOADING)} 
                  onUpload={handleUpload} 
              />
          )}
          {currentPage === Page.DNA_LOADING && (
              <LoadingAnalysisPage 
                  tracks={tracks}
                  analyzingTrackId={analyzingTrackId}
                  onFinish={() => setCurrentPage(Page.DNA_REPORT)}
                  onCancel={() => setCurrentPage(Page.DASHBOARD)}
                  onAnalysisComplete={handleAnalysisComplete}
              />
          )}
          {currentPage === Page.DNA_REPORT && (
              <DNAReportPage dnaProfile={dnaProfile} />
          )}
          {currentPage === Page.GENERATOR && (
              <GeneratorPage 
                  dnaProfile={dnaProfile} 
                  onSaveToLibrary={handleSaveToLibrary} 
                  onSavePrompt={handleSavePrompt}
                  savedPrompts={savedPrompts}
                  tracks={tracks}
                  customFolders={allFolders}
              />
          )}
          {currentPage === Page.LIBRARY && (
              <LibraryPage 
                tracks={tracks} 
                onDeleteTrack={handleDeleteTrack}
                savedPrompts={savedPrompts}
                onUpdatePrompt={handleUpdatePrompt}
                onDeletePrompt={handleDeletePrompt}
                customFolders={allFolders}
                onCreateFolder={handleCreateFolder}
              />
          )}
          {currentPage === Page.SETTINGS && <SettingsPage />}
          {currentPage === Page.ARCHITECTURE && <ArchitecturePage />}
      </MainLayout>
  );
};

export default App;