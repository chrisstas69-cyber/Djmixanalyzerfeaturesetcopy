import { useState } from "react";
import { GitBranch, Play, Pause, FileText, Download } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface MixVersion {
  id: string;
  name: string;
  notes: string;
  createdAt: string;
  isSelected: boolean;
}

export function ABTestingPanel() {
  const [versions, setVersions] = useState<MixVersion[]>([
    { id: "v1", name: "Version A", notes: "", createdAt: new Date().toISOString(), isSelected: true },
    { id: "v2", name: "Version B", notes: "", createdAt: new Date().toISOString(), isSelected: false },
  ]);
  const [selectedVersion, setSelectedVersion] = useState<string>("v1");
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCreateVersion = () => {
    const newVersion: MixVersion = {
      id: `v${versions.length + 1}`,
      name: `Version ${String.fromCharCode(64 + versions.length + 1)}`,
      notes: "",
      createdAt: new Date().toISOString(),
      isSelected: false,
    };
    setVersions([...versions, newVersion]);
    toast.success(`Created ${newVersion.name}`);
  };

  const handleSwitchVersion = (versionId: string) => {
    setSelectedVersion(versionId);
    setVersions(versions.map((v) => ({ ...v, isSelected: v.id === versionId })));
    toast.info(`Switched to ${versions.find((v) => v.id === versionId)?.name}`);
  };

  const handleUpdateNotes = (versionId: string, notes: string) => {
    setVersions(versions.map((v) => (v.id === versionId ? { ...v, notes } : v)));
  };

  const handleExport = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      const data = {
        version: version.name,
        notes: version.notes,
        createdAt: version.createdAt,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${version.name.toLowerCase().replace(" ", "-")}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${version.name}`);
    }
  };

  const currentVersion = versions.find((v) => v.id === selectedVersion);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              A/B Testing for Mixes
            </h1>
            <p className="text-xs text-white/40">
              Compare different versions of your mix side-by-side
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBlindMode}
                onChange={(e) => setIsBlindMode(e.target.checked)}
                className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
              />
              <span className="text-sm text-white/80">Blind Mode</span>
            </label>
            <Button
              onClick={handleCreateVersion}
              size="sm"
              className="bg-primary hover:bg-primary/80 text-white"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Create Version
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Versions List */}
        <div className="w-80 border-r border-white/5 bg-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white mb-3">Versions</h2>
            <div className="space-y-2">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => handleSwitchVersion(version.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    version.id === selectedVersion
                      ? "bg-primary/20 border-primary text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {isBlindMode ? `Version ${version.id.slice(1)}` : version.name}
                    </span>
                    {version.isSelected && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-white/40">
                    {new Date(version.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison View */}
        <div className="flex-1 overflow-auto p-6">
          {currentVersion ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Side-by-Side Waveforms */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Waveform Comparison</h2>
                <div className="grid grid-cols-2 gap-4">
                  {versions.map((version) => (
                    <div key={version.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          {isBlindMode ? `Version ${version.id.slice(1)}` : version.name}
                        </span>
                        {version.id === selectedVersion && (
                          <span className="text-xs text-primary font-['IBM_Plex_Mono']">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="h-24 bg-black/40 border border-white/10 rounded-lg relative overflow-hidden">
                        {/* Mock Waveform */}
                        <svg width="100%" height="100%" className="absolute inset-0">
                          {Array.from({ length: 100 }).map((_, i) => {
                            const amplitude = Math.random() * 0.8 + 0.1;
                            const x = (i / 100) * 100;
                            const y = 50 - (amplitude * 40);
                            return (
                              <rect
                                key={i}
                                x={`${x}%`}
                                y={y}
                                width="1%"
                                height={amplitude * 80}
                                fill={version.id === selectedVersion ? "var(--primary)" : "rgba(255,255,255,0.3)"}
                              />
                            );
                          })}
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                        >
                          {isPlaying && version.id === selectedVersion ? (
                            <Pause className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <button
                          onClick={() => handleExport(version.id)}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                        >
                          <Download className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notes for {isBlindMode ? `Version ${currentVersion.id.slice(1)}` : currentVersion.name}
                </h3>
                <textarea
                  value={currentVersion.notes}
                  onChange={(e) => handleUpdateNotes(currentVersion.id, e.target.value)}
                  placeholder="Add notes about this version (e.g., 'Used more reverb on transitions', 'Lowered bass on track 3')..."
                  rows={6}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>

              {/* Version Info */}
              <div className="grid grid-cols-2 gap-4">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-4 rounded-lg border ${
                      version.id === selectedVersion
                        ? "bg-primary/10 border-primary/30"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">
                        {isBlindMode ? `Version ${version.id.slice(1)}` : version.name}
                      </span>
                      {version.id === selectedVersion && (
                        <span className="text-xs text-primary font-['IBM_Plex_Mono']">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mb-2">
                      Created: {new Date(version.createdAt).toLocaleString()}
                    </p>
                    {version.notes && (
                      <p className="text-xs text-white/70 mt-2 line-clamp-2">
                        {version.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Final Choice */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Final Choice</h3>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedVersion}
                    onChange={(e) => handleSwitchVersion(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    {versions.map((v) => (
                      <option key={v.id} value={v.id}>
                        {isBlindMode ? `Version ${v.id.slice(1)}` : v.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={() => {
                      const chosen = versions.find((v) => v.id === selectedVersion);
                      toast.success(`Selected ${chosen?.name} as final version!`);
                    }}
                    className="bg-primary hover:bg-primary/80 text-white"
                  >
                    Confirm Final Choice
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <GitBranch className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Create a version to start A/B testing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

