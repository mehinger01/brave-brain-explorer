import { useLab } from "@/lib/labStore";

export type View = "hub" | "toolbox" | "detective" | "missions" | "boss" | "reflect" | "notes";

const TABS: { id: View; label: string; emoji: string }[] = [
  { id: "hub", label: "Mission Hub", emoji: "🏕️" },
  { id: "toolbox", label: "Reset Toolbox", emoji: "🧰" },
  { id: "detective", label: "Body Detective", emoji: "🕵️" },
  { id: "missions", label: "Missions", emoji: "🗺️" },
  { id: "boss", label: "Boss", emoji: "👾" },
  { id: "reflect", label: "Reflect", emoji: "⭐" },
  { id: "notes", label: "Coach Notes", emoji: "📝" },
];

export function NavBar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const { state } = useLab();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b-2 border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => setView("hub")} className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🧠</span>
            <div className="leading-tight text-left">
              <div className="font-display font-bold text-lg text-foreground">Brave Brain</div>
              <div className="text-xs text-muted-foreground -mt-1">Adventure Lab</div>
            </div>
          </button>
          <div className="hidden sm:flex chip">
            <span>🏅</span>
            <span>{state.badges.length} badges</span>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
          {TABS.map((t) => {
            const active = view === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-soft)] scale-105"
                    : "bg-card text-foreground border-border hover:border-primary/40"
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
