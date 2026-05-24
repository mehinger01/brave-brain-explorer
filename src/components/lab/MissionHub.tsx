import { useLab } from "@/lib/labStore";
import type { View } from "./NavBar";
import { useState } from "react";

export function MissionHub({ setView }: { setView: (v: View) => void }) {
  const { state, reset } = useLab();
  const [justReset, setJustReset] = useState(false);
  const totalMissions = Object.values(state.missionsSolved).reduce((a, b) => a + b, 0);

  function handleReset() {
    if (window.confirm("Start fresh for a new student? This will clear all progress, badges, and notes.")) {
      reset();
      setJustReset(true);
      setTimeout(() => setJustReset(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="pop-card overflow-hidden relative">
        <div className="absolute inset-0 opacity-90" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative p-6 sm:p-10 text-ink">
          <div className="chip mb-4"><span>🌟</span><span>Today's Mission</span></div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            Catch It Early
          </h1>
          <p className="mt-3 text-base sm:text-lg max-w-xl font-semibold">
            Hard means <span className="underline decoration-wavy decoration-coral">new</span>. Hard does <em>not</em> mean impossible.
          </p>
          <p className="mt-1 text-sm sm:text-base max-w-xl">
            A reset is not quitting. A reset helps your brain come back. 🧠💪
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => setView("missions")}
              className="px-5 py-3 rounded-full bg-ink text-background font-bold shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-transform">
              🗺️ Start a Mission
            </button>
            <button onClick={() => setView("toolbox")}
              className="px-5 py-3 rounded-full bg-background text-ink font-bold border-2 border-ink/10 shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-transform">
              🧰 Open Reset Toolbox
            </button>
          </div>
        </div>
      </section>

      {/* Brave Brain Meter */}
      <section className="pop-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">🧠 Brave Brain Meter</h2>
          <span className="chip">{state.braveBrain} / 100</span>
        </div>
        <div className="h-5 rounded-full bg-secondary overflow-hidden border-2 border-border">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${state.braveBrain}%`, background: "var(--gradient-jungle)" }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Every reset, clue, and mission charges your brain. ⚡
        </p>
      </section>

      {/* Progress + Badges */}
      <div className="grid sm:grid-cols-2 gap-6">
        <section className="pop-card p-6">
          <h2 className="text-lg font-bold mb-3">🗺️ Mission Progress</h2>
          <div className="text-4xl font-extrabold text-foreground">{totalMissions}</div>
          <div className="text-sm text-muted-foreground">challenges solved so far</div>
          <button onClick={() => setView("missions")}
            className="mt-4 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90">
            Go to Missions →
          </button>
        </section>
        <section className="pop-card p-6">
          <h2 className="text-lg font-bold mb-3">🏅 Badges & Unlocks</h2>
          {state.badges.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No badges yet — try a reset, notice a clue, or solve a mission!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {state.badges.map((b) => (
                <span key={b} className="chip" style={{ background: "var(--gradient-sun)" }}>
                  🏅 {b}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick links */}
      <section className="grid sm:grid-cols-3 gap-4">
        {[
          { v: "toolbox", emoji: "🧰", title: "Reset Toolbox", desc: "Turtle, Shake, Balloon", grad: "var(--gradient-jungle)" },
          { v: "detective", emoji: "🕵️", title: "Body Detective", desc: "Catch your clues", grad: "var(--gradient-grape)" },
          { v: "boss", emoji: "👾", title: "Stuck Zone Boss", desc: state.bossDone ? "Champion! ✅" : "Final challenge", grad: "var(--gradient-coral)" },
        ].map((c) => (
          <button key={c.v} onClick={() => setView(c.v as View)}
            className="pop-card p-5 text-left hover:-translate-y-1 transition-transform relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-7xl opacity-20">{c.emoji}</div>
            <div className="text-2xl">{c.emoji}</div>
            <div className="mt-2 font-bold text-lg">{c.title}</div>
            <div className="text-sm text-muted-foreground">{c.desc}</div>
            <div className="mt-3 inline-flex text-xs font-bold px-2 py-1 rounded-full text-ink" style={{ background: c.grad }}>
              Open →
            </div>
          </button>
        ))}
      </section>

      {/* Start Fresh */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="text-xs font-bold text-muted-foreground hover:text-coral underline decoration-dotted transition-colors"
        >
          {justReset ? "✅ Progress cleared!" : "Start fresh for new student"}
        </button>
      </div>
    </div>
  );
}
