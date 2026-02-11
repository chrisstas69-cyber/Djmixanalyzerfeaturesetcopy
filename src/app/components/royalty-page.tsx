"use client";
import React from "react";
import { DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";

function MoneyCard({
  icon,
  title,
  value,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  accent: "cyan" | "orange";
}) {
  const ring =
    accent === "orange"
      ? "border-orange-500/25 shadow-[0_0_0_1px_rgba(249,115,22,0.18)]"
      : "border-cyan-500/25 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]";

  return (
    <div className={`rounded-2xl border ${ring} bg-white/[0.03] backdrop-blur-md p-8 min-h-[120px]`}>
      <div className="flex items-start justify-between mb-4">
        <div className="opacity-90">{icon}</div>
      </div>
      <div className="text-xs text-white/55 tracking-widest uppercase mb-2">{title}</div>
      <div className={`text-4xl font-semibold ${accent === "orange" ? "text-orange-300" : "text-cyan-300"}`}>
        {value}
      </div>
    </div>
  );
}

function BarRow({
  label,
  pct,
  value,
  accent,
}: {
  label: string;
  pct: string;
  value: string;
  accent: "orange" | "cyan" | "white";
}) {
  const bar =
    accent === "orange"
      ? "bg-orange-500/80"
      : accent === "cyan"
      ? "bg-cyan-500/80"
      : "bg-white/50";

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-3">
        <div className="text-white/80 font-medium">{label}</div>
        <div className={accent === "orange" ? "text-orange-300 font-semibold" : accent === "cyan" ? "text-cyan-300 font-semibold" : "text-white/70 font-semibold"}>
          {value}
        </div>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
        <div className={`h-full ${bar}`} style={{ width: pct }} />
      </div>
      <div className="mt-2 text-xs text-white/45">{pct} of total revenue</div>
    </div>
  );
}

export default function RoyaltyPage() {
  return (
    <div className="flex justify-center min-h-screen py-16">
      <div className="w-full max-w-[1400px] px-16">
        <div className="text-white/90 text-3xl font-semibold mb-16 text-center">Royalty &amp; Revenue</div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 mb-16">
          <MoneyCard
            icon={<DollarSign className="h-6 w-6 text-cyan-300" />}
            title="Total earnings"
            value="$47,582.50"
            accent="cyan"
          />
          <MoneyCard
            icon={<TrendingUp className="h-6 w-6 text-orange-300" />}
            title="This month"
            value="$8,245.80"
            accent="orange"
          />
          <MoneyCard
            icon={<Clock className="h-6 w-6 text-white/70" />}
            title="Last month"
            value="$6,892.30"
            accent="cyan"
          />
          <MoneyCard
            icon={<Wallet className="h-6 w-6 text-cyan-300" />}
            title="Pending"
            value="$2,156.40"
            accent="cyan"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8">
            <div className="text-white/85 font-semibold text-xl mb-10">Revenue Breakdown</div>

            <div className="space-y-12">
              <BarRow label="Marketplace" pct="60%" value="$28,450.2" accent="orange" />
              <BarRow label="Streaming" pct="30%" value="$14,274.15" accent="cyan" />
              <BarRow label="Royalties" pct="10%" value="$4,858.15" accent="white" />
            </div>

            <div className="mt-10 border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-xs text-white/45 tracking-widest uppercase mb-4">Marketplace</div>
                <div className="space-y-3">
                  <div className="text-white/70 flex justify-between"><span>Track Sales</span><span className="text-orange-300 font-semibold">$18,240</span></div>
                  <div className="text-white/70 flex justify-between"><span>Sample Packs</span><span className="text-orange-300 font-semibold">$7,895</span></div>
                  <div className="text-white/70 flex justify-between"><span>Stems</span><span className="text-orange-300 font-semibold">$2,315</span></div>
                </div>
              </div>

              <div>
                <div className="text-xs text-white/45 tracking-widest uppercase mb-4">Streaming</div>
                <div className="space-y-3">
                  <div className="text-white/70 flex justify-between"><span>Spotify</span><span className="text-cyan-300 font-semibold">$8,456</span></div>
                  <div className="text-white/70 flex justify-between"><span>Apple Music</span><span className="text-cyan-300 font-semibold">$4,123</span></div>
                  <div className="text-white/70 flex justify-between"><span>SoundCloud</span><span className="text-cyan-300 font-semibold">$1,695</span></div>
                </div>
              </div>

              <div>
                <div className="text-xs text-white/45 tracking-widest uppercase mb-4">Royalties</div>
                <div className="space-y-3">
                  <div className="text-white/70 flex justify-between"><span>Performance</span><span className="text-white/70 font-semibold">$2,845</span></div>
                  <div className="text-white/70 flex justify-between"><span>Mechanical</span><span className="text-white/70 font-semibold">$1,456</span></div>
                  <div className="text-white/70 flex justify-between"><span>Sync</span><span className="text-white/70 font-semibold">$557</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8">
            <div className="text-white/85 font-semibold text-xl mb-6">Payout Methods</div>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                <div className="text-white/85 font-medium mb-1">Direct Deposit</div>
                <div className="text-xs text-white/45">Bank transfer (2–3 business days)</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                <div className="text-white/85 font-medium mb-1">Cryptocurrency</div>
                <div className="text-xs text-white/45">Instant transfer (BTC, ETH, USDC)</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm space-y-3">
                <div className="flex justify-between text-white/70"><span>Available Balance</span><span className="text-cyan-300 font-semibold">$8,245.80</span></div>
                <div className="flex justify-between text-white/70"><span>Next Payout</span><span>Jan 15, 2026</span></div>
                <div className="flex justify-between text-white/70"><span>Minimum Threshold</span><span>$50.00</span></div>
              </div>

              <button className="w-full rounded-xl bg-orange-500 px-5 py-4 font-semibold text-black shadow-[0_0_24px_rgba(249,115,22,0.25)] hover:bg-orange-400 transition">
                Request Payout
              </button>

              <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="text-cyan-200 font-medium text-sm mb-1">Tax Information Required</div>
                <div className="text-xs text-white/50">
                  Complete your tax forms to receive payouts and stay compliant.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}
