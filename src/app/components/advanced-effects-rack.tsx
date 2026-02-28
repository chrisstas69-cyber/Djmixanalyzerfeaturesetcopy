import { useState } from "react";
import { GripVertical, Plus, Trash2, Save, Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

interface Effect {
  id: string;
  type: "eq" | "reverb" | "delay" | "compressor" | "filter" | "distortion";
  enabled: boolean;
  wet: number; // 0-100%
  dry: number; // 0-100%
  params: Record<string, number>;
}

interface EffectPreset {
  name: string;
  effects: Effect[];
}

export function AdvancedEffectsRack() {
  const [effects, setEffects] = useState<Effect[]>([]);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [presets, setPresets] = useState<EffectPreset[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const effectTypes = [
    { id: "eq", label: "EQ", description: "3-band equalizer" },
    { id: "reverb", label: "Reverb", description: "Room simulation" },
    { id: "delay", label: "Delay", description: "Echo effect" },
    { id: "compressor", label: "Compressor", description: "Dynamic range control" },
    { id: "filter", label: "Filter", description: "Frequency filtering" },
    { id: "distortion", label: "Distortion", description: "Saturation/overdrive" },
  ];

  const defaultParams: Record<string, Record<string, number>> = {
    eq: { low: 0, mid: 0, high: 0 },
    reverb: { roomSize: 50, damping: 50, wetLevel: 30 },
    delay: { time: 250, feedback: 30, mix: 30 },
    compressor: { threshold: -12, ratio: 4, attack: 10, release: 100 },
    filter: { cutoff: 1000, resonance: 1, type: 0 },
    distortion: { drive: 0, tone: 50, level: 50 },
  };

  const handleAddEffect = (type: Effect["type"]) => {
    const newEffect: Effect = {
      id: `effect-${Date.now()}-${Math.random()}`,
      type,
      enabled: true,
      wet: 50,
      dry: 50,
      params: { ...defaultParams[type] },
    };
    setEffects([...effects, newEffect]);
    setSelectedEffect(newEffect);
    toast.success(`${effectTypes.find((e) => e.id === type)?.label} added to rack`);
  };

  const handleRemoveEffect = (id: string) => {
    setEffects(effects.filter((e) => e.id !== id));
    if (selectedEffect?.id === id) {
      setSelectedEffect(null);
    }
    toast.info("Effect removed");
  };

  const handleUpdateEffect = (id: string, updates: Partial<Effect>) => {
    const updated = effects.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setEffects(updated);
    if (selectedEffect?.id === id) {
      setSelectedEffect({ ...selectedEffect, ...updates });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newEffects = [...effects];
    const [removed] = newEffects.splice(draggedIndex, 1);
    newEffects.splice(dropIndex, 0, removed);
    setEffects(newEffects);
    setDraggedIndex(null);
  };

  const handleSavePreset = () => {
    const name = prompt("Preset name:");
    if (name && effects.length > 0) {
      const preset: EffectPreset = { name, effects: [...effects] };
      setPresets([...presets, preset]);
      localStorage.setItem("effectPresets", JSON.stringify([...presets, preset]));
      toast.success(`Preset "${name}" saved!`);
    }
  };

  const handleLoadPreset = (preset: EffectPreset) => {
    setEffects([...preset.effects]);
    toast.success(`Preset "${preset.name}" loaded!`);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Advanced Effects Rack
            </h1>
            <p className="text-xs text-white/40">
              Chain multiple effects with automation and presets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSavePreset}
              size="sm"
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preset
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Effects Chain */}
        <div className="w-80 border-r border-white/5 bg-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white mb-3">Effects Chain</h2>
            <div className="space-y-2">
              {effectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleAddEffect(type.id as Effect["type"])}
                  className="w-full p-2 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm text-white"
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-white/60">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-2">
            {effects.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-8">
                No effects in chain. Add effects above.
              </p>
            ) : (
              effects.map((effect, index) => {
                const effectType = effectTypes.find((e) => e.id === effect.type);
                return (
                  <div
                    key={effect.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => setSelectedEffect(effect)}
                    className={`p-3 rounded-lg border transition-all cursor-move ${
                      selectedEffect?.id === effect.id
                        ? "bg-primary/20 border-primary"
                        : effect.enabled
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-white/5 border-white/10 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="w-4 h-4 text-white/40" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">
                            {effectType?.label || effect.type}
                          </span>
                          <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveEffect(effect.id);
                        }}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={effect.enabled}
                        onChange={(e) =>
                          handleUpdateEffect(effect.id, { enabled: e.target.checked })
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-3.5 h-3.5 rounded bg-white/5 border-white/10 text-primary"
                      />
                      <span className="text-xs text-white/60">
                        {effect.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </label>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Effect Editor */}
        <div className="flex-1 overflow-auto p-6">
          {selectedEffect ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    {effectTypes.find((e) => e.id === selectedEffect.type)?.label} Settings
                  </h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEffect.enabled}
                      onChange={(e) =>
                        handleUpdateEffect(selectedEffect.id, { enabled: e.target.checked })
                      }
                      className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                    />
                    <span className="text-sm text-white/80">Enabled</span>
                  </label>
                </div>

                {/* Wet/Dry Mix */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                      Wet: {selectedEffect.wet}%
                    </label>
                    <Slider
                      value={[selectedEffect.wet]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) =>
                        handleUpdateEffect(selectedEffect.id, { wet: value[0] })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                      Dry: {selectedEffect.dry}%
                    </label>
                    <Slider
                      value={[selectedEffect.dry]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) =>
                        handleUpdateEffect(selectedEffect.id, { dry: value[0] })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Effect-Specific Parameters */}
                <div className="space-y-4">
                  {Object.entries(selectedEffect.params).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        {key === "time" || key === "attack" || key === "release"
                          ? "ms"
                          : key === "cutoff"
                          ? "Hz"
                          : "%"}
                      </label>
                      <Slider
                        value={[value]}
                        min={0}
                        max={
                          key === "time" ? 2000 : key === "cutoff" ? 20000 : key === "ratio" ? 20 : 100
                        }
                        step={key === "time" || key === "cutoff" ? 1 : 0.1}
                        onValueChange={(newValue) => {
                          const updatedParams = {
                            ...selectedEffect.params,
                            [key]: newValue[0],
                          };
                          handleUpdateEffect(selectedEffect.id, { params: updatedParams });
                        }}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Automation Curve */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Automation Curve</h3>
                <div className="h-32 bg-black/40 border border-white/10 rounded-lg relative overflow-hidden">
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <polyline
                      points="0,100 50,80 100,60 150,70 200,50 250,40 300,45 350,35 400,30"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2"
                    />
                  </svg>
                  <p className="absolute bottom-2 left-2 text-xs text-white/40">
                    Draw automation curve (coming soon)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Settings2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Select an effect to edit its parameters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

