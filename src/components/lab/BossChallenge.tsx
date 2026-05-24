import { useState } from "react";
import { BOSS_CLUES, RESETS } from "@/lib/missions";
import { useLab } from "@/lib/labStore";

export function BossChallenge() {
  const { state, completeBoss, recordReset } = useLab();
  const [step, setStep] = useState(0); // 0..3
  const [usedReset, setUsedReset] = useState(false);
  const done = step >= BOSS_CLUES.length;

  function solve() {
    if (step < BOSS_CLUES.length - 1) setStep(step + 1);
    else { setStep(step + 1); if (!state.bossDone) completeBoss(); }
  }

  if (done) {
    return (
      <div className="pop-card p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-90" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative text-ink">
          <div className="text-7xl">🏆</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">Stuck Zone Champion!</h1>
          <p className="mt-2 font-semibold max-w-lg mx-auto">
            You noticed when it was hard, you reset your brain, and you came BACK to finish.
            That is the bravest brain move there is. 🧠💪
          </p>
          <button onClick={() => setStep(0)} className="mt-5 px-5 py-3 rounded-full bg-ink text-background font-bold">
            Play again
          </button>
        </div>
      </div>
    );
  }

  const clue = BOSS_CLUES[step];

  return (
    <div className="space-y-5">
      <header className="pop-card p-6 text-ink relative overflow-hidden">
        <div className="absolute inset-0 opacity-90" style={{ background: "var(--gradient-coral)" }} />
        <div className="relative">
          <div className="chip mb-2"><span>👾</span><span>Boss Challenge</span></div>
          <h1 className="text-3xl font-extrabold">The Stuck Zone Boss</h1>
          <p className="font-semibold opacity-90 mt-1">Solve 3 clues. If you get stuck, use a reset and come back.</p>
        </div>
      </header>

      <div className="pop-card p-6">
        <div className="flex items-center gap-2 mb-3">
          {BOSS_CLUES.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>
        <div className="text-xs font-bold text-muted-foreground">CLUE {step + 1} OF {BOSS_CLUES.length}</div>
        <div className="text-xl sm:text-2xl font-bold mt-2 min-h-20">{clue.prompt}</div>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-bold text-primary">Peek a tiny hint</summary>
          <div className="mt-2 text-sm">💡 One idea: <span className="font-bold">{clue.answer}</span></div>
        </details>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <button onClick={solve}
            className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90">
            ✅ I solved it
          </button>
          <button
            onClick={() => { setUsedReset(true); recordReset("balloon", "Boss: Balloon Breath"); }}
            className="px-4 py-3 rounded-xl bg-card border-2 border-border font-bold hover:border-primary/40"
          >
            🎈 Use a reset
          </button>
        </div>

        {usedReset && (
          <div className="mt-4 p-4 rounded-2xl border-2 border-border" style={{ background: "var(--gradient-sun)" }}>
            <div className="font-bold text-ink">Nice reset! 🌬️</div>
            <div className="text-sm text-ink/80">
              Try Balloon Breath: belly in… belly out… 3 times. Then come back to the clue. You can do this.
            </div>
            <div className="mt-2 text-xs text-ink/70">Other resets: {RESETS.map(r => r.title).join(" · ")}</div>
            <button onClick={() => setUsedReset(false)} className="mt-3 px-4 py-2 rounded-full bg-ink text-background text-sm font-bold">
              I'm back — keep going
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
