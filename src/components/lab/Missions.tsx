import { useMemo, useState } from "react";
import { MISSIONS, type Mission } from "@/lib/missions";
import { useLab } from "@/lib/labStore";

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function MissionPlayer({ mission, onBack }: { mission: Mission; onBack: () => void }) {
  const { state, solveMission, markTricky, tinyStep } = useLab();
  const deck = useMemo(() => shuffled(mission.challenges), [mission]);
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const card = deck[idx];
  const solvedCount = state.missionsSolved[mission.id] ?? 0;

  function next() {
    setReveal(false);
    setIdx((i) => (i + 1) % deck.length);
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm font-bold text-muted-foreground hover:text-foreground">
        ← All missions
      </button>

      <header className="pop-card p-6 text-ink relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: mission.gradient, opacity: 0.9 }} />
        <div className="relative flex items-center gap-4">
          <div className="text-6xl">{mission.emoji}</div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold">{mission.title}</h1>
            <p className="text-sm font-semibold opacity-90">{mission.tagline}</p>
          </div>
          <div className="chip">✅ {solvedCount} solved</div>
        </div>
      </header>

      <section className="pop-card p-6">
        <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
          <span>Card {idx + 1} / {deck.length}</span>
          <span>{mission.title}</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold leading-snug min-h-24">
          {card.prompt}
        </div>
        {card.answer && reveal && (
          <div className="mt-3 inline-block px-3 py-1.5 rounded-full bg-secondary text-sm font-bold">
            💡 One idea: {card.answer}
          </div>
        )}
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <button onClick={() => { solveMission(mission.id, mission.title); next(); }}
            className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90">
            ✅ Mark solved
          </button>
          {card.answer && (
            <button onClick={() => setReveal((v) => !v)}
              className="px-4 py-3 rounded-xl bg-card border-2 border-border font-bold hover:border-primary/40">
              {reveal ? "Hide hint" : "Show a hint"}
            </button>
          )}
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-secondary/60 border-2 border-border">
          <div className="font-bold mb-2">Brain getting stuck?</div>
          <div className="grid sm:grid-cols-3 gap-2">
            <button onClick={() => markTricky(`${mission.title}: ${card.prompt.slice(0, 40)}`)}
              className="px-3 py-2 rounded-xl bg-card border-2 border-border text-sm font-bold hover:border-primary/40">
              🤔 This feels tricky
            </button>
            <button onClick={() => markTricky(`Use a reset — ${mission.title}`)}
              className="px-3 py-2 rounded-xl bg-card border-2 border-border text-sm font-bold hover:border-primary/40">
              🧰 Use a reset
            </button>
            <button onClick={() => tinyStep(`${mission.title}: tiny step`)}
              className="px-3 py-2 rounded-xl bg-card border-2 border-border text-sm font-bold hover:border-primary/40">
              👣 One tiny step
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <button onClick={next} className="px-4 py-2 rounded-full text-sm font-bold border-2 border-border bg-card hover:border-primary/40">
            Skip card →
          </button>
        </div>
      </section>
    </div>
  );
}

export function Missions() {
  const { state } = useLab();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = MISSIONS.find((m) => m.id === activeId);

  if (active) return <MissionPlayer mission={active} onBack={() => setActiveId(null)} />;

  return (
    <div className="space-y-6">
      <header className="pop-card p-6">
        <h1 className="text-3xl font-extrabold">🗺️ Mission Modules</h1>
        <p className="text-muted-foreground mt-1">
          Pick a mission. Each one is 5–8 minutes of brain adventure.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-5">
        {MISSIONS.map((m) => (
          <button key={m.id} onClick={() => setActiveId(m.id)}
            className="pop-card overflow-hidden text-left hover:-translate-y-1 transition-transform">
            <div className="p-6 text-ink relative" style={{ background: m.gradient }}>
              <div className="absolute -right-4 -bottom-6 text-8xl opacity-30">{m.emoji}</div>
              <div className="relative">
                <div className="text-5xl">{m.emoji}</div>
                <h2 className="font-extrabold text-2xl mt-2">{m.title}</h2>
                <p className="text-sm font-semibold opacity-90 mt-1">{m.tagline}</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="chip">✅ {state.missionsSolved[m.id] ?? 0} solved</span>
              <span className="text-sm font-bold text-primary">Play →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
