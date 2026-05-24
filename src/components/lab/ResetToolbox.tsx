import { useState } from "react";
import { RESETS } from "@/lib/missions";
import { useLab } from "@/lib/labStore";

export function ResetToolbox() {
  const { state, recordReset } = useLab();
  const [justUsed, setJustUsed] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="pop-card p-6">
        <h1 className="text-3xl font-extrabold">🧰 Reset Toolbox</h1>
        <p className="text-muted-foreground mt-1">
          Pick a reset when your brain feels stuck. A reset is NOT quitting — it helps your brain come back. 💪
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {RESETS.map((r) => (
          <article key={r.key} className="pop-card overflow-hidden flex flex-col">
            <div className="p-5 text-ink relative" style={{ background: r.color }}>
              <div className="text-5xl">{r.emoji}</div>
              <h2 className="font-extrabold text-2xl mt-1">{r.title}</h2>
              <div className="text-sm font-semibold opacity-90 mt-1">Used {state.resetsUsed[r.key]}×</div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">When to use</div>
              <p className="text-sm mb-3">{r.when}</p>
              <ol className="space-y-2 mb-4">
                {r.steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={() => { recordReset(r.key, r.title); setJustUsed(r.key); setTimeout(() => setJustUsed(null), 1500); }}
                className="mt-auto py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition"
              >
                {justUsed === r.key ? "🎉 Nice job!" : "I used this reset"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
