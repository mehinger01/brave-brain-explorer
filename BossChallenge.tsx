import { useState } from "react";
import { BOSS_CLUES, RESETS } from "@/lib/missions";
import { useLab } from "@/lib/labStore";
import type { ResetKey } from "@/lib/labStore";

export function BossChallenge() {
  const { state, completeBoss, recordReset } = useLab();
  const [step, setStep] = useState(0); // 0..BOSS_CLUES.length
  const [showResetPicker, setShowResetPicker] = useState(false);
  const [chosenReset, setChosenReset] = useState<(typeof RESETS)[number] | null>(null);
  const done = step >= BOSS_CLUES.length;

  function solve() {
    // Dismiss any open reset panel before advancing.
    setShowResetPicker(false);
    setChosenReset(null);
    if (step < BOSS_CLUES.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      if (!state.bossDone) completeBoss();
    }
  }

  function pickReset(r: (typeof RESETS)[number]) {
    setChosenReset(r);
    recordReset(r.key as ResetKey, `Boss: ${r.title}`);
    setShowResetPicker(false);
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
          <button
            onClick={() => { setStep(0); setChosenReset(null); setShowResetPicker(false); }}
            className="mt-5 px-5 py-3 rounded-full bg-ink text-background font-bold"
          >
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
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          {BOSS_CLUES.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < step ? "bg-primary" : i === step ? "bg-primary/50" : "bg-secondary"}`} />
          ))}
        </div>
        <div className="text-xs font-bold text-muted-foreground">CLUE {step + 1} OF {BOSS_CLUES.length}</div>
        <div className="text-xl sm:text-2xl font-bold mt-2 min-h-20">{clue.prompt}</div>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-bold text-primary">Peek a tiny hint</summary>
          <div className="mt-2 text-sm">💡 One idea: <span className="font-bold">{clue.answer}</span></div>
        </details>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <button
            onClick={solve}
            className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90"
          >
            ✅ I solved it
          </button>
          <button
            onClick={() => { setShowResetPicker((v) => !v); setChosenReset(null); }}
            className="px-4 py-3 rounded-xl bg-card border-2 border-border font-bold hover:border-primary/40"
          >
            🧰 Use a reset
          </button>
        </div>

        {/* Reset picker */}
        {showResetPicker && !chosenReset && (
          <div className="mt-4 p-4 rounded-2xl border-2 border-border bg-secondary/60">
            <div className="font-bold mb-3 text-ink">Pick your reset:</div>
            <div className="grid gap-2">
              {RESETS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => pickReset(r)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border-2 border-border font-bold text-left hover:border-primary/40 transition"
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <div>
                    <div className="text-sm font-bold">{r.title}</div>
                    <div className="text-xs text-muted-foreground font-normal">{r.when}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chosen reset steps */}
        {chosenReset && (
          <div
            className="mt-4 p-5 rounded-2xl border-2 border-border"
            style={{ background: chosenReset.color }}
          >
            <div className="text-2xl mb-1">{chosenReset.emoji}</div>
            <div className="font-extrabold text-ink text-lg">{chosenReset.title}</div>
            <ol className="mt-3 space-y-2">
              {chosenReset.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-ink/10 flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setChosenReset(null)}
              className="mt-4 px-4 py-2 rounded-full bg-ink text-background text-sm font-bold"
            >
              I'm back — keep going 💪
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
