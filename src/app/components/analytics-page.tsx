"use client";
import React from "react";
import { Heart, Music2, Hash, Play, TrendingUp } from "lucide-react";

function StatCard({
  icon,
  value,
  label,
  accent = "cyan",
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  accent?: "cyan" | "orange";
}) {
  const accentClasses =
    accent === "orange"
      ? "border-orange-500/25 shadow-[0_0_0_1px_rgba(249,115,22,0.18)]"
      : "border-cyan-500/25 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]";

  return (
    <div
      className={[
        "rounded-2xl border bg-white/[0.03] backdrop-blur-md",
        "px-8 py-6 min-h-[120px]",
        "flex items-center gap-5",
        accentClasses,
      ].join(" ")}
    >
      <div className="shrink-0 opacity-90">{icon}</div>
      <div className="min-w-0">
        <div className="text-4xl font-semibold leading-none">{value}</div>
        <div className="mt-2 text-xs text-white/60 tracking-wide uppercase">
          {label}
        </div>
      </div>
    </div>
  );
}

function PillTabs({
  left,
  right,
  active,
  onChange,
}: {
  left: string;
  right: string;
  active: "left" | "right";
  onChange: (v: "left" | "right") => void;
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <button
        onClick={() => onChange("left")}
        className={[
          "px-5 py-2.5 rounded-lg text-sm font-medium transition",
          active === "left"
            ? "bg-orange-500/15 text-orange-200 border border-orange-500/30 shadow-[0_0_18px_rgba(249,115,22,0.12)]"
            : "bg-white/[0.03] text-white/70 border border-white/10 hover:text-white",
        ].join(" ")}
      >
        {left}
      </button>
      <button
        onClick={() => onChange("right")}
        className={[
          "px-5 py-2.5 rounded-lg text-sm font-medium transition",
          active === "right"
            ? "bg-white/[0.06] text-white border border-white/15"
            : "bg-white/[0.03] text-white/70 border border-white/10 hover:text-white",
        ].join(" ")}
      >
        {right}
      </button>
    </div>
  );
}

export default function AnalyticsPage() {
  const [tab, setTab] = React.useState<"left" | "right">("left");

  const topTracks = [
    { rank: 1, title: "Midnight Resonance", artist: "Adam Beyer", plays: "1,240 plays" },
    { rank: 2, title: "Electric Dreams", artist: "Charlotte de Witte", plays: "1,120 plays" },
    { rank: 3, title: "Deep Horizon", artist: "Tale Of Us", plays: "980 plays" },
    { rank: 4, title: "Neon Pulse", artist: "Amelie Lens", plays: "850 plays" },
    { rank: 5, title: "Cosmic Journey", artist: "AI Generated", plays: "720 plays" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-full max-w-[1400px] px-16 py-16">
        <div className="text-center mb-12">
          <div className="text-white/90 text-3xl font-semibold">Analytics &amp; Stats</div>
          <div className="mt-2 text-sm text-white/55">
            A single stats page where users view their tracks
          </div>
        </div>

        <div className="flex justify-center mt-8 mb-12">
          <PillTabs
            left="Stats Overview"
            right="Analytics"
            active={tab}
            onChange={setTab}
          />
        </div>

        <div className="mt-12">
          <div className="text-white/85 text-xl font-semibold">Analytics Dashboard</div>
          <div className="text-sm text-white/50 mt-1">Monitor your music analytics in real-time</div>
        </div>

        <div className="mt-12">
          <div className="text-xs text-white/45 tracking-widest uppercase mb-6">
            Personal Stats
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            <StatCard
              icon={<Music2 className="h-6 w-6 text-orange-300" />}
              value="46"
              label="Total tracks created"
              accent="orange"
            />
            <StatCard
              icon={<Heart className="h-6 w-6 text-cyan-300" />}
              value="46"
              label="Total likes / favs"
              accent="cyan"
            />
            <StatCard
              icon={<Hash className="h-6 w-6 text-orange-300" />}
              value="Groove"
              label="Top genre used"
              accent="orange"
            />
            <StatCard
              icon={<Play className="h-6 w-6 text-cyan-300" />}
              value="129"
              label="Total plays / views"
              accent="cyan"
            />
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8">
          <div className="text-xs text-white/55 tracking-widest uppercase mb-6 text-center">
            Usage Chart (last 7 days)
          </div>

          <div className="h-[240px] rounded-xl bg-black/20 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-60">
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
            </div>
            <div className="absolute bottom-6 left-8 right-8 flex justify-between text-xs text-white/40">
              <span>1 day</span><span>2 days</span><span>3 days</span><span>4 days</span><span>5 days</span><span>6 days</span><span>7 days</span>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8">
          <div className="text-xs text-white/55 tracking-widest uppercase mb-6 text-center">
            Top 5 most played tracks
          </div>

          <div className="space-y-6">
            {topTracks.map((t) => (
              <div
                key={t.rank}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-5 py-4"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div
                    className={[
                      "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-semibold",
                      t.rank === 1 ? "bg-orange-500 text-black" : "bg-cyan-500 text-black",
                    ].join(" ")}
                  >
                    {t.rank}
                  </div>

                  <div className="min-w-0">
                    <div className="text-white/90 font-medium truncate">{t.title}</div>
                    <div className="text-sm text-white/45 truncate">{t.artist}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  {t.plays}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}
