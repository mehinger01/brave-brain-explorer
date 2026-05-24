import { useLab } from "@/lib/labStore";

export function Reflection() {
  const { state, updateReflection } = useLab();
  const r = state.reflection;

  return (
    <div className="space-y-5">
      <header className="pop-card p-6">
        <h1 className="text-3xl font-extrabold">⭐ Reflection</h1>
        <p className="text-muted-foreground mt-1">Look back at your adventure. Brave brains know themselves.</p>
      </header>

      <div className="pop-card p-6 space-y-5">
        {[
          { k: "hard", label: "Something that felt hard", ph: "Like… a tricky pattern, or…" },
          { k: "clue", label: "My body clue was", ph: "Like… I wanted to stop, or…" },
          { k: "reset", label: "Reset I used", ph: "Turtle, Shake-Out, Balloon Breath…" },
          { k: "comeback", label: "How I came back", ph: "I took 3 breaths and tried one tiny step…" },
        ].map((f) => (
          <label key={f.k} className="block">
            <div className="text-sm font-bold mb-1">{f.label}</div>
            <textarea
              value={(r as any)[f.k]}
              onChange={(e) => updateReflection({ [f.k]: e.target.value } as any)}
              placeholder={f.ph}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card focus:border-primary outline-none text-sm"
            />
          </label>
        ))}

        <div>
          <div className="text-sm font-bold mb-2">Brave Brain rating</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => updateReflection({ stars: n })}
                className={`w-12 h-12 rounded-2xl text-2xl border-2 transition ${
                  n <= r.stars ? "bg-accent border-accent-foreground/40 scale-105" : "bg-card border-border"
                }`}
              >
                {n <= r.stars ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl text-ink" style={{ background: "var(--gradient-jungle)" }}>
          <div className="font-bold">Your brave brain is growing every time you do this. 🌱</div>
        </div>
      </div>
    </div>
  );
}
