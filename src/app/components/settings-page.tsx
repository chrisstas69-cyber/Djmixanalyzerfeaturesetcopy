"use client";
import React from "react";

type Tab = "Playback" | "Display" | "Notifications" | "Privacy" | "Storage";

function Tabs({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: Tab[] = ["Playback", "Display", "Notifications", "Privacy", "Storage"];
  return (
    <div className="flex items-center gap-8 text-sm">
      {tabs.map((t) => {
        const active = tab === t;
        return (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "relative pb-3 transition",
              active ? "text-cyan-200 font-medium" : "text-white/55 hover:text-white/80",
            ].join(" ")}
          >
            {t}
            {active && (
              <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.35)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function CardRow({
  title,
  desc,
  right,
}: {
  title: string;
  desc?: string;
  right: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md px-6 py-5 flex items-center justify-between gap-8">
      <div className="min-w-0">
        <div className="text-white/85 font-medium text-base">{title}</div>
        {desc && <div className="text-sm text-white/45 mt-1">{desc}</div>}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={[
        "w-14 h-8 rounded-full border transition relative",
        value ? "bg-cyan-500/80 border-cyan-500/40" : "bg-white/10 border-white/20",
      ].join(" ")}
      aria-pressed={value}
    >
      <span
        className={[
          "absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full transition",
          value ? "left-7 bg-white" : "left-1 bg-white/70",
        ].join(" ")}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = React.useState<Tab>("Playback");

  const [autoSave, setAutoSave] = React.useState(true);
  const [crossfade, setCrossfade] = React.useState(false);
  const [normalize, setNormalize] = React.useState(true);

  const [particles, setParticles] = React.useState(true);
  const [glow, setGlow] = React.useState(true);
  const [animations, setAnimations] = React.useState(true);

  const [trackComplete, setTrackComplete] = React.useState(true);
  const [mixReady, setMixReady] = React.useState(true);
  const [systemUpdates, setSystemUpdates] = React.useState(false);
  const [emailNotifs, setEmailNotifs] = React.useState(true);

  const [showStats, setShowStats] = React.useState(true);
  const [allowAnalytics, setAllowAnalytics] = React.useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-full max-w-[1400px] px-16 py-16">
        <div className="flex flex-col items-center gap-8 mb-16">
          <div className="text-center">
            <div className="text-white/90 text-3xl font-semibold mb-6">Settings</div>
            <div className="flex justify-center">
              <Tabs tab={tab} setTab={setTab} />
            </div>
          </div>

          <button className="rounded-lg border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm text-white/75 hover:text-white hover:bg-white/[0.06] transition">
            Reset to Default
          </button>
        </div>

        <div className="mt-8 space-y-10 max-w-[1100px] mx-auto">
          {tab === "Playback" && (
            <>
              <div className="text-sm text-white/55 mb-3">Default Duration</div>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {["30s", "1min", "3min", "5min"].map((d) => (
                  <button
                    key={d}
                    className={[
                      "rounded-xl border px-5 py-4 text-sm font-medium transition",
                      d === "3min"
                        ? "bg-cyan-500/80 text-black border-cyan-500/40 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                        : "bg-white/[0.03] text-white/70 border-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="text-sm text-white/55 mb-4">Default Genre</div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/80 mb-12">
                Progressive House
              </div>

              <div className="text-sm text-white/55 mb-4">Default Energy Level</div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/80 mb-12">
                High (7–10)
              </div>

              <CardRow
                title="Auto-save"
                desc="Automatically save your work as you create"
                right={<Toggle value={autoSave} onChange={setAutoSave} />}
              />

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
                <div className="text-white/85 font-medium text-base mb-6">Additional Options</div>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="text-white/80 text-sm">Enable crossfade</div>
                    <Toggle value={crossfade} onChange={setCrossfade} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-white/80 text-sm">Normalize audio levels</div>
                    <Toggle value={normalize} onChange={setNormalize} />
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === "Display" && (
            <>
              <div className="text-sm text-white/55 mb-4">Theme</div>
              <div className="grid grid-cols-2 gap-4 mb-12">
                {["Dark", "Darker"].map((t) => (
                  <button
                    key={t}
                    className={[
                      "rounded-xl border px-5 py-4 text-sm font-medium transition",
                      t === "Dark"
                        ? "bg-cyan-500/80 text-black border-cyan-500/40 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                        : "bg-white/[0.03] text-white/70 border-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <CardRow
                title="Particle Effects"
                desc="Add visual effects to enhance the user experience"
                right={<Toggle value={particles} onChange={setParticles} />}
              />
              <CardRow
                title="Glow Effects"
                desc="Add glowing elements to the interface"
                right={<Toggle value={glow} onChange={setGlow} />}
              />
              <CardRow
                title="Animations"
                desc="Enable smooth animations for a better user experience"
                right={<Toggle value={animations} onChange={setAnimations} />}
              />
            </>
          )}

          {tab === "Notifications" && (
            <>
              <CardRow
                title="Track Complete"
                desc="Notify when a track is complete"
                right={<Toggle value={trackComplete} onChange={setTrackComplete} />}
              />
              <CardRow
                title="Mix Ready"
                desc="Notify when a mix is ready"
                right={<Toggle value={mixReady} onChange={setMixReady} />}
              />
              <CardRow
                title="System Updates"
                desc="Notify about system updates"
                right={<Toggle value={systemUpdates} onChange={setSystemUpdates} />}
              />
              <CardRow
                title="Email Notifications"
                desc="Receive notifications via email"
                right={<Toggle value={emailNotifs} onChange={setEmailNotifs} />}
              />
            </>
          )}

          {tab === "Privacy" && (
            <>
              <div className="text-sm text-white/55 mb-3">Profile Visibility</div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/80 mb-8">
                Public
              </div>

              <CardRow
                title="Show Stats"
                desc="Display statistics on your profile"
                right={<Toggle value={showStats} onChange={setShowStats} />}
              />
              <CardRow
                title="Allow Analytics"
                desc="Allow the collection of usage data"
                right={<Toggle value={allowAnalytics} onChange={setAllowAnalytics} />}
              />
            </>
          )}

          {tab === "Storage" && (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 mb-6">
                <div className="text-white/85 font-medium text-base mb-2">Storage Usage</div>
                <div className="text-xs text-white/45 mb-5">2.4 GB used of 10 GB total</div>

                <div className="h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden mb-3">
                  <div className="h-full bg-orange-500/80" style={{ width: "24%" }} />
                </div>

                <div className="flex justify-between text-xs text-white/40">
                  <span>0 GB</span>
                  <span className="text-cyan-300 font-semibold">24.0% used</span>
                  <span>10 GB</span>
                </div>
              </div>

              <CardRow
                title="Clear Cache"
                desc="Free up space by clearing temporary files"
                right={
                  <button className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-5 py-2.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/15 transition">
                    CLEAR
                  </button>
                }
              />

              <CardRow
                title="External Storage"
                desc="Link external drives or cloud storage to expand capacity"
                right={<Toggle value={false} onChange={() => {}} />}
              />

              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 flex items-center justify-between">
                <div>
                  <div className="text-orange-200 font-medium text-base">Delete All Data</div>
                  <div className="text-xs text-white/45 mt-1">
                    Permanently remove all tracks, mixes, and settings
                  </div>
                </div>
                <button className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-5 py-2.5 text-xs font-semibold text-orange-200 hover:bg-orange-500/15 transition">
                  DELETE
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-20 flex justify-center">
          <button className="rounded-xl bg-orange-500 px-12 py-4 font-semibold text-black text-base shadow-[0_0_26px_rgba(249,115,22,0.25)] hover:bg-orange-400 transition">
            Apply Changes
          </button>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}
