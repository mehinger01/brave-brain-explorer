import { useState } from "react";
import { CLUES, CLUE_PLANS } from "@/lib/missions";
import { useLab, type ClueKey } from "@/lib/labStore";

export function BodyDetective() {
  const { state, recordClue } = useLab();
  const [picked, setPicked] = useState<Record<ClueKey, boolean>>(
    Object.fromEntries(CLUES.map((c) => [c.key, false])) as Record<ClueKey, boolean>
  );
  const [plan, setPlan] = useState<string>("");
  const [saved, setSaved] = useState(false);

  function toggle(k: ClueKey, label: string) {
    setPicked((p) => ({ ...p, [k]: !p[k] }));
    if (!picked[k]) recordClue(k, label);
  }

  function savePlan() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="space-y-6">
      <header className="pop-card p-6">
        <h1 className="text-3xl font-extrabold">🕵️ Body Signal Detective</h1>
        <p className="text-muted-foreground mt-1">
          Your body sends clues when something is hard. Catching the clue is a SUPERPOWER. ⚡
        </p>
      </header>

      <section className="pop-card p-6">
        <h2 className="font-bold text-lg mb-3">Tap every clue you notice today</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CLUES.map((c) => {
            const on = picked[c.key];
            return (
              <button key={c.key} onClick={() => toggle(c.key, c.label)}
                className={`p-4 rounded-2xl border-2 text-left transition-all font-bold ${
                  on
                    ? "bg-accent border-accent-foreground/30 scale-[1.02] shadow-[var(--shadow-soft)]"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <div className="text-2xl mb-1">{c.emoji}</div>
                <div className="text-sm">{c.label}</div>
                {state.cluesNoticed[c.key] > 0 && (
                  <div className="text-xs text-muted-foreground mt-1 font-normal">caught {state.cluesNoticed[c.key]}×</div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="pop-card p-6">
        <h2 className="font-bold text-lg mb-3">When I notice that clue, I can…</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {CLUE_PLANS.map((p) => (
            <button key={p} onClick={() => setPlan(p)}
              className={`px-4 py-3 rounded-xl text-left text-sm font-semibold border-2 transition ${
                plan === p ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        {plan && (
          <div className="mt-4 p-4 rounded-2xl border-2 border-jungle/30" style={{ background: "var(--gradient-sun)" }}>
            <div className="text-xs font-bold uppercase">My plan</div>
            <div className="font-bold text-ink">{plan}</div>
            <button onClick={savePlan}
              className="mt-3 px-4 py-2 rounded-full bg-ink text-background text-sm font-bold">
              {saved ? "🎉 Saved!" : "Lock in my plan"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
