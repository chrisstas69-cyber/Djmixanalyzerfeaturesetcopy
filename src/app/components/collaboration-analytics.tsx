import { useState, useEffect } from "react";
import { Users, GitBranch, TrendingUp, ThumbsUp, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Contribution {
  id: string;
  userId: string;
  username: string;
  action: string;
  timestamp: string;
  percentage: number;
}

interface MixCollaboration {
  mixId: string;
  mixName: string;
  contributors: Array<{
    userId: string;
    username: string;
    contributions: Contribution[];
    percentage: number;
  }>;
  totalChanges: number;
  createdAt: string;
  updatedAt: string;
}

export function CollaborationAnalytics() {
  const [selectedMix, setSelectedMix] = useState<string | null>(null);
  const [collaborations, setCollaborations] = useState<MixCollaboration[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);

  useEffect(() => {
    // Load collaborations from localStorage
    try {
      const saved = localStorage.getItem("mixCollaborations");
      if (saved) {
        const data: MixCollaboration[] = JSON.parse(saved);
        setCollaborations(data);
        if (data.length > 0 && !selectedMix) {
          setSelectedMix(data[0].mixId);
        }
      }
    } catch (error) {
      console.error("Error loading collaborations:", error);
    }
  }, [selectedMix]);

  useEffect(() => {
    if (selectedMix) {
      const mix = collaborations.find((c) => c.mixId === selectedMix);
      if (mix) {
        const allContributions: Contribution[] = [];
        mix.contributors.forEach((contributor) => {
          allContributions.push(...contributor.contributions);
        });
        setContributions(allContributions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }
    }
  }, [selectedMix, collaborations]);

  const currentMix = collaborations.find((c) => c.mixId === selectedMix);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Collaboration Analytics
            </h1>
            <p className="text-xs text-white/40">
              Track contributions and collaboration metrics
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Mixes List */}
        <div className="w-80 border-r border-white/5 bg-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white mb-3">Collaborative Mixes</h2>
            {collaborations.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-8">
                No collaborative mixes yet
              </p>
            ) : (
              <div className="space-y-2">
                {collaborations.map((mix) => (
                  <button
                    key={mix.mixId}
                    onClick={() => setSelectedMix(mix.mixId)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedMix === mix.mixId
                        ? "bg-primary/20 border-primary text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{mix.mixName}</p>
                    <p className="text-xs text-white/40">
                      {mix.contributors.length} contributors
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics View */}
        <div className="flex-1 overflow-auto p-6">
          {currentMix ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Contribution Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Contribution Breakdown</h2>
                <div className="space-y-3">
                  {currentMix.contributors.map((contributor, index) => (
                    <div key={contributor.userId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {contributor.username}
                            </p>
                            <p className="text-xs text-white/60">
                              {contributor.contributions.length} contributions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary font-['IBM_Plex_Mono']">
                            {contributor.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${contributor.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contribution Timeline */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Contribution Timeline</h2>
                <div className="space-y-2">
                  {contributions.slice(0, 20).map((contribution) => (
                    <div
                      key={contribution.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <GitBranch className="w-4 h-4 text-white/40" />
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-semibold">{contribution.username}</span>{" "}
                          {contribution.action}
                        </p>
                        <p className="text-xs text-white/40">
                          {new Date(contribution.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">
                        {contribution.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">
                      Total Changes
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                    {currentMix.totalChanges}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">
                      Contributors
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                    {currentMix.contributors.length}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">
                      Last Updated
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white font-['IBM_Plex_Mono']">
                    {new Date(currentMix.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Select a collaborative mix to view analytics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

