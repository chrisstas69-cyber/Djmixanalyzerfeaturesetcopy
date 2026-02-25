import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { Slider } from './ui/Slider';
import { Dropdown } from './ui/Dropdown';
import { Button } from './ui/Button';
import { PresetCard } from './PresetCard';

interface ControlsPanelProps {
  onGenerate: () => void;
  isGenerating: boolean;
  musicDNAMode?: 'off' | 'my-dna' | 'custom';
  onMusicDNAChange?: (mode: 'off' | 'my-dna' | 'custom') => void;
}

interface PresetConfig {
  emoji: string;
  name: string;
  genre: string;
  subgenre: string;
  energy: number;
  darkness: number;
  bpmMin: number;
  bpmMax: number;
}

const presets: PresetConfig[] = [
  {
    emoji: '🎧',
    name: 'Joeski Techno',
    genre: 'techno',
    subgenre: 'dub',
    energy: 78,
    darkness: 68,
    bpmMin: 125,
    bpmMax: 128
  },
  {
    emoji: '🌊',
    name: 'Minimal Dub',
    genre: 'techno',
    subgenre: 'minimal',
    energy: 65,
    darkness: 72,
    bpmMin: 123,
    bpmMax: 126
  },
  {
    emoji: '🔥',
    name: 'Hard Techno',
    genre: 'hard-techno',
    subgenre: 'industrial',
    energy: 92,
    darkness: 85,
    bpmMin: 135,
    bpmMax: 140
  },
  {
    emoji: '🌙',
    name: 'Deep House',
    genre: 'deep-house',
    subgenre: 'minimal',
    energy: 68,
    darkness: 45,
    bpmMin: 120,
    bpmMax: 124
  },
  {
    emoji: '🎹',
    name: 'Melodic Techno',
    genre: 'melodic-house-techno',
    subgenre: 'hypnotic',
    energy: 75,
    darkness: 55,
    bpmMin: 123,
    bpmMax: 127
  },
  {
    emoji: '⚡',
    name: 'Peak Time',
    genre: 'techno-peak-time-driving-hard',
    subgenre: 'dub',
    energy: 88,
    darkness: 70,
    bpmMin: 128,
    bpmMax: 132
  },
  {
    emoji: '🏭',
    name: 'Warehouse',
    genre: 'techno-raw-deep-hypnotic',
    subgenre: 'industrial',
    energy: 82,
    darkness: 80,
    bpmMin: 130,
    bpmMax: 135
  },
  {
    emoji: '🌀',
    name: 'Hypnotic',
    genre: 'techno-raw-deep-hypnotic',
    subgenre: 'hypnotic',
    energy: 72,
    darkness: 75,
    bpmMin: 125,
    bpmMax: 129
  }
];

export function ControlsPanel({ onGenerate, isGenerating, musicDNAMode = 'off', onMusicDNAChange }: ControlsPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string>('audio-dna');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const [controls, setControls] = useState({
    genre: 'techno',
    subgenre: 'dub',
    energy: [70],
    darkness: [60],
    bpmMin: [128],
    bpmMax: [132],
    swing: [30],
    grooveTightness: [65],
    drumDensity: [60],
    highFreqRestraint: [40],
    subEnergy: [75],
    bassMotion: [55],
    sidechainDepth: [70],
    harmonicActivity: [45],
    textureWarmth: [60],
    padPresence: [40],
    trackLength: [7],
    introLength: [32],
    outroLength: [64],
    progressionSpeed: [50],
    fxDensity: [45],
    reverbCharacter: [50],
    delayCharacter: [50],
    randomness: [30]
  });

  const genreOptions = [
    'ALL',
    'HOUSE',
    'AFRO HOUSE',
    'AMAPIANO',
    'DEEP HOUSE',
    'TECH HOUSE',
    'JACKIN HOUSE',
    'SOULFUL/FUNK/DISCO',
    'NU DISCO',
    'MELODIC HOUSE/TECHNO',
    'INDIE DANCE',
    'PROGRESSIVE',
    'ELECTRO (CLASSIC / DETROIT / MODERN)',
    'TECHNO (PEAK TIME/DRIVING/HARD)',
    'TECHNO (RAW/DEEP/HYPNOTIC)',
    'HARD TECHNO',
    'MINIMAL / DEEP TECH',
    'ELECTRONICA',
    'GARAGE',
    'ELECTRO HOUSE',
    'BASS HOUSE',
    'FUTURE HOUSE',
    'BREAKS',
    'DUBSTEP',
    'TRANCE',
    'DJ TOOLS',
    'ORGANIC HOUSE / DOWNTEMPO',
    'CHILL OUT'
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(section === expandedSection ? '' : section);
  };

  const updateControl = (key: string, value: number[]) => {
    setControls(prev => ({ ...prev, [key]: value }));
  };

  const getSectionSummary = (sectionId: string): string => {
    switch (sectionId) {
      case 'audio-dna':
        const genreLabel = controls.subgenre.charAt(0).toUpperCase() + controls.subgenre.slice(1);
        const energyLevel = controls.energy[0] > 70 ? 'High' : controls.energy[0] > 40 ? 'Medium' : 'Low';
        const darknessLevel = controls.darkness[0] > 60 ? 'Dark' : 'Bright';
        return `${genreLabel} ${controls.genre.charAt(0).toUpperCase() + controls.genre.slice(1)} · ${energyLevel} energy · ${darknessLevel}`;
      
      case 'tempo':
        const swingLevel = controls.swing[0] > 60 ? 'Heavy' : controls.swing[0] > 30 ? 'Moderate' : 'Subtle';
        return `${controls.bpmMin[0]}–${controls.bpmMax[0]} BPM · ${swingLevel} swing`;
      
      case 'rhythm':
        const drumLevel = controls.drumDensity[0] > 70 ? 'Dense' : controls.drumDensity[0] > 40 ? 'Moderate' : 'Sparse';
        const highsLevel = controls.highFreqRestraint[0] > 60 ? 'Very restrained' : controls.highFreqRestraint[0] > 30 ? 'Restrained' : 'Open';
        return `${drumLevel} drums · ${highsLevel} highs`;
      
      case 'bass':
        const subLevel = controls.subEnergy[0] > 70 ? 'Strong' : controls.subEnergy[0] > 40 ? 'Medium' : 'Light';
        const motionLevel = controls.bassMotion[0] > 70 ? 'Fast' : controls.bassMotion[0] > 40 ? 'Medium' : 'Slow';
        return `${subLevel} sub · ${motionLevel} motion`;
      
      case 'harmony':
        const harmonyLevel = controls.harmonicActivity[0] > 60 ? 'Complex' : controls.harmonicActivity[0] > 30 ? 'Moderate' : 'Minimal';
        const textureLevel = controls.textureWarmth[0] > 60 ? 'Warm' : controls.textureWarmth[0] > 40 ? 'Neutral' : 'Cold';
        return `${harmonyLevel} harmony · ${textureLevel} textures`;
      
      case 'arrangement':
        return `${controls.trackLength[0]} min · ${controls.introLength[0]}/${controls.outroLength[0]} bar intro/outro`;
      
      case 'advanced':
        const fxLevel = controls.fxDensity[0] > 60 ? 'Heavy' : controls.fxDensity[0] > 30 ? 'Moderate' : 'Minimal';
        return `${fxLevel} FX · ${controls.randomness[0]}% randomness`;
      
      default:
        return '';
    }
  };

  interface SectionProps {
    id: string;
    title: string;
    children: React.ReactNode;
  }

  const Section = ({ id, title, children }: SectionProps) => {
    const isExpanded = expandedSection === id;
    
    return (
      <Collapsible.Root 
        open={isExpanded} 
        onOpenChange={() => toggleSection(id)}
        className="border-b border-[var(--border-subtle)]"
      >
        <Collapsible.Trigger className="flex items-start justify-between w-full p-4 text-left hover:bg-[var(--surface-panel)]/30 transition-colors group">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-sm text-[var(--text-primary)] mb-1">{title}</h3>
            {!isExpanded && (
              <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                {getSectionSummary(id)}
              </p>
            )}
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform flex-shrink-0 mt-0.5 group-hover:text-[var(--text-secondary)] ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </Collapsible.Trigger>
        <Collapsible.Content className="px-4 pb-4 space-y-4">
          {children}
        </Collapsible.Content>
      </Collapsible.Root>
    );
  };

  return (
    <div className="w-80 h-screen bg-[var(--surface-charcoal)] border-r border-[var(--border-subtle)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border-subtle)]">
        <h2 className="text-[var(--text-primary)] mb-1">Audio DNA</h2>
        <p className="text-sm text-[var(--text-tertiary)]">Configure generation parameters</p>
      </div>

      {/* Scrollable controls */}
      <div className="flex-1 overflow-y-auto">
        {/* Music DNA Selector */}
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <label className="text-xs text-[var(--text-secondary)] mb-2 block">Music DNA</label>
          <div className="flex gap-1 p-1 bg-[var(--surface-panel)] rounded-lg">
            <button
              onClick={() => onMusicDNAChange?.('off')}
              className={`flex-1 px-3 py-2 rounded-md text-xs transition-colors ${
                musicDNAMode === 'off'
                  ? 'bg-[var(--surface-charcoal)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Off
            </button>
            <button
              onClick={() => onMusicDNAChange?.('my-dna')}
              className={`flex-1 px-3 py-2 rounded-md text-xs transition-colors ${
                musicDNAMode === 'my-dna'
                  ? 'bg-[var(--surface-charcoal)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              My Music DNA
            </button>
            <button
              onClick={() => onMusicDNAChange?.('custom')}
              className={`flex-1 px-3 py-2 rounded-md text-xs transition-colors ${
                musicDNAMode === 'custom'
                  ? 'bg-[var(--surface-charcoal)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Custom
            </button>
          </div>
          {musicDNAMode === 'my-dna' && (
            <div className="mt-3 px-3 py-2 bg-[var(--accent-amber)]/5 border border-[var(--accent-amber)]/20 rounded-lg">
              <p className="text-xs text-[var(--accent-amber)]">
                Personalized
              </p>
            </div>
          )}
        </div>

        {/* Presets */}
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <label className="text-xs text-[var(--text-secondary)] mb-2 block">Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map(preset => (
              <PresetCard
                key={preset.name}
                emoji={preset.emoji}
                name={preset.name}
                isActive={activePreset === preset.name}
                onClick={() => {
                  setActivePreset(preset.name);
                  setControls(prev => ({
                    ...prev,
                    genre: preset.genre,
                    subgenre: preset.subgenre,
                    energy: [preset.energy],
                    darkness: [preset.darkness],
                    bpmMin: [preset.bpmMin],
                    bpmMax: [preset.bpmMax]
                  }));
                }}
              />
            ))}
          </div>
        </div>

        {/* Audio DNA */}
        <Section id="audio-dna" title="Audio DNA">
          <Dropdown
            label="Genre"
            value={controls.genre}
            onValueChange={(value) => setControls(prev => ({ ...prev, genre: value }))}
            options={genreOptions.map(genre => ({ 
              value: genre.toLowerCase().replace(/\s+/g, '-').replace(/[()\/]/g, ''), 
              label: genre 
            }))}
          />
          <Dropdown
            label="Subgenre"
            value={controls.subgenre}
            onValueChange={(value) => setControls(prev => ({ ...prev, subgenre: value }))}
            options={[
              { value: 'minimal', label: 'Minimal' },
              { value: 'dub', label: 'Dub' },
              { value: 'hypnotic', label: 'Hypnotic' },
              { value: 'industrial', label: 'Industrial' }
            ]}
          />
          <Slider
            label="Energy"
            value={controls.energy}
            onValueChange={(value) => updateControl('energy', value)}
            max={100}
          />
          <Slider
            label="Darkness"
            value={controls.darkness}
            onValueChange={(value) => updateControl('darkness', value)}
            max={100}
          />
        </Section>

        {/* Tempo & Groove */}
        <Section id="tempo" title="Tempo & Groove">
          <Slider
            label="BPM Min"
            value={controls.bpmMin}
            onValueChange={(value) => updateControl('bpmMin', value)}
            min={100}
            max={150}
          />
          <Slider
            label="BPM Max"
            value={controls.bpmMax}
            onValueChange={(value) => updateControl('bpmMax', value)}
            min={100}
            max={150}
          />
          <Slider
            label="Swing"
            value={controls.swing}
            onValueChange={(value) => updateControl('swing', value)}
            max={100}
          />
          <Slider
            label="Groove Tightness"
            value={controls.grooveTightness}
            onValueChange={(value) => updateControl('grooveTightness', value)}
            max={100}
          />
        </Section>

        {/* Rhythm Density */}
        <Section id="rhythm" title="Rhythm Density">
          <Slider
            label="Drum Density"
            value={controls.drumDensity}
            onValueChange={(value) => updateControl('drumDensity', value)}
            max={100}
          />
          <Slider
            label="High-Frequency Restraint"
            value={controls.highFreqRestraint}
            onValueChange={(value) => updateControl('highFreqRestraint', value)}
            max={100}
            tooltip="Controls hats, shakers, and top-end clutter."
          />
        </Section>

        {/* Bass & Low End */}
        <Section id="bass" title="Bass & Low End">
          <Slider
            label="Sub Energy"
            value={controls.subEnergy}
            onValueChange={(value) => updateControl('subEnergy', value)}
            max={100}
          />
          <Slider
            label="Bass Motion"
            value={controls.bassMotion}
            onValueChange={(value) => updateControl('bassMotion', value)}
            max={100}
          />
          <Slider
            label="Sidechain Depth"
            value={controls.sidechainDepth}
            onValueChange={(value) => updateControl('sidechainDepth', value)}
            max={100}
          />
        </Section>

        {/* Harmony & Texture */}
        <Section id="harmony" title="Harmony & Texture">
          <Slider
            label="Harmonic Activity"
            value={controls.harmonicActivity}
            onValueChange={(value) => updateControl('harmonicActivity', value)}
            max={100}
          />
          <Slider
            label="Texture Warmth"
            value={controls.textureWarmth}
            onValueChange={(value) => updateControl('textureWarmth', value)}
            max={100}
          />
          <Slider
            label="Pad Presence"
            value={controls.padPresence}
            onValueChange={(value) => updateControl('padPresence', value)}
            max={100}
          />
        </Section>

        {/* Arrangement */}
        <Section id="arrangement" title="Arrangement">
          <Slider
            label="Track Length (min)"
            value={controls.trackLength}
            onValueChange={(value) => updateControl('trackLength', value)}
            min={3}
            max={12}
          />
          <Slider
            label="Intro Length (bars)"
            value={controls.introLength}
            onValueChange={(value) => updateControl('introLength', value)}
            min={8}
            max={64}
            step={8}
          />
          <Slider
            label="Outro Length (bars)"
            value={controls.outroLength}
            onValueChange={(value) => updateControl('outroLength', value)}
            min={8}
            max={64}
            step={8}
          />
          <Slider
            label="Progression Speed"
            value={controls.progressionSpeed}
            onValueChange={(value) => updateControl('progressionSpeed', value)}
            max={100}
          />
        </Section>

        {/* Advanced */}
        <Section id="advanced" title="Advanced">
          <Slider
            label="FX Density"
            value={controls.fxDensity}
            onValueChange={(value) => updateControl('fxDensity', value)}
            max={100}
          />
          <Slider
            label="Reverb Character"
            value={controls.reverbCharacter}
            onValueChange={(value) => updateControl('reverbCharacter', value)}
            max={100}
          />
          <Slider
            label="Delay Character"
            value={controls.delayCharacter}
            onValueChange={(value) => updateControl('delayCharacter', value)}
            max={100}
          />
          <Slider
            label="Randomness"
            value={controls.randomness}
            onValueChange={(value) => updateControl('randomness', value)}
            max={100}
          />
        </Section>
      </div>

      {/* Bottom actions - Always pinned */}
      <div className="p-4 border-t border-[var(--border-subtle)] space-y-2 bg-[var(--surface-charcoal)]">
        <Button 
          variant="primary" 
          state={isGenerating ? 'loading' : 'default'}
          onClick={onGenerate}
          className="w-full"
        >
          Generate Track
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1">Save DNA</Button>
          <Button variant="ghost" className="flex-1">Reset</Button>
        </div>
      </div>
    </div>
  );
}