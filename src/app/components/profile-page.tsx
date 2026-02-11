"use client";
import React from "react";
import { Music2, Heart, Zap, KeyRound, Download } from "lucide-react";

function DNAStat({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: "orange" | "cyan";
}) {
  const ring =
    accent === "orange"
      ? "border-orange-500/25 shadow-[0_0_0_1px_rgba(249,115,22,0.18)]"
      : "border-cyan-500/25 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]";

  return (
    <div className={`rounded-2xl border ${ring} bg-white/[0.03] backdrop-blur-md p-8 min-h-[120px]`}>
      <div className="opacity-90 mb-4">{icon}</div>
      <div className={`text-4xl font-semibold mb-2 ${accent === "orange" ? "text-orange-300" : "text-cyan-300"}`}>
        {value}
      </div>
      <div className="text-xs text-white/55 tracking-widest uppercase">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-full max-w-[1400px] px-16 py-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 flex items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6 min-w-0">
            <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-cyan-400 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              AR
              <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-cyan-300 border-2 border-black/60" />
            </div>

            <div className="min-w-0">
              <div className="text-white/90 text-3xl font-semibold truncate">Alex Riverstone</div>
              <div className="text-sm text-white/45 truncate mt-1">alex.riverstone@syntax.audio</div>

              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="px-3 py-1.5 rounded-md bg-cyan-500/15 border border-cyan-500/25 text-cyan-200 font-semibold">
                  PRO MEMBER
                </span>
                <span className="text-white/45">Member since January 2024</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-12">
            <div className="text-right">
              <div className="text-orange-300 text-4xl font-semibold leading-none">247</div>
              <div className="text-xs text-white/50 tracking-widest uppercase mt-2">Tracks created</div>
            </div>
            <div className="text-right">
              <div className="text-cyan-300 text-4xl font-semibold leading-none">38</div>
              <div className="text-xs text-white/50 tracking-widest uppercase mt-2">Mixes created</div>
            </div>
          </div>
        </div>

        <div className="text-white/90 text-xl font-semibold mb-12 text-center">Your Music DNA</div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 mb-16">
          <DNAStat icon={<Music2 className="h-6 w-6 text-orange-300" />} value="247" label="Tracks created" accent="orange" />
          <DNAStat icon={<Heart className="h-6 w-6 text-cyan-300" />} value="1.5K" label="Tracks saved" accent="cyan" />
          <DNAStat icon={<Zap className="h-6 w-6 text-orange-300" />} value="8/10" label="Dominant energy" accent="orange" />
          <DNAStat icon={<KeyRound className="h-6 w-6 text-cyan-300" />} value="C#m" label="Most used key" accent="cyan" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8">
            <div className="text-xs text-white/55 tracking-widest uppercase mb-3">Average BPM</div>
            <div className="text-white/90 text-4xl font-semibold">128</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8">
            <div className="text-xs text-white/55 tracking-widest uppercase mb-3">Favorite Genre</div>
            <div className="text-white/90 text-2xl font-semibold">Progressive House</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8">
            <div className="text-xs text-white/55 tracking-widest uppercase mb-3">Total playtime</div>
            <div className="text-white/90 text-4xl font-semibold">342 hrs</div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button className="inline-flex items-center gap-3 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-black shadow-[0_0_24px_rgba(249,115,22,0.25)] hover:bg-orange-400 transition">
            <Download className="h-5 w-5" />
            Export Profile Data (JSON)
          </button>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}
