import { useMemo, useState } from "react";
import { MISSIONS, RESETS, type Mission } from "@/lib/missions";
import { useLab } from "@/lib/labStore";
import type { ResetKey } from "@/lib/labStore";

// ─── Difficulty badge ─────────────────────────────────────────────────────────

const DIFF = {
  easy:   { label: "🟢 Easy",   cls: "bg-green-100 text-green-800 border-green-200" },
  medium: { label: "🟡 Medium", cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  hard:   { label: "🔴 Hard",   cls: "bg-red-100 text-red-800 border-red-200" },
};

// ─── Brain Check overlay ──────────────────────────────────────────────────────

type BrainFeeling = "good" | "tired" | "frustrated" | "stop";

const FEELINGS: { key: BrainFeeling; emoji: string; label: string }[] = [
  { key: "good",       emoji: "🟢", label: "Still good!" },
  { key: "tired",      emoji: "🟡", label: "Getting tired" },
  { key: "frustrated", emoji: "🔴", label: "Pretty frustrated" },
  { key: "stop",       emoji: "🛑", label: "I want to stop" },
];

function BrainCheck({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const { recordReset, logEvent } = useLab();
  const [feeling, setFeeling] = useState<BrainFeeling | null>(null);
  const [chosenReset, setChosenReset] = useState<(typeof RESETS)[number] | null>(null);
  const [resetDone, setResetDone] = useState(false);

  const needsReset = feeling === "frustrated" || feeling === "stop";
  const canContinue = feeling === "good" || feeling === "tired" || resetDone;

  function pickFeeling(f: BrainFeeling) {
    setFeeling(f);
    logEvent({ type: "clue", payload: `Brain Check: ${f}` });
  }

  function pickReset(r: (typeof RESETS)[number]) {
    setChosenReset(r);
    recordReset(r.key as ResetKey, `Mission Brain Check: ${r.title}`);
  }

  return (
    <div className="pop-card p-6 border-2 border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-60" style={{ background: "var(--gradient-hero)" }} />
      <div className="relative space-y-4">
        <div className="chip w-fit"><span>🧠</span><span>Brain Check!</span></div>
        <h2 className="text-2xl font-extrabold text-ink">You're halfway through. How's your brain right now?</h2>

        {!feeling && (
          <div className="grid grid-cols-2 gap-3">
            {FEELINGS.map((f) => (
              <button
                key={f.key}
                onClick={() => pickFeeling(f.key)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 border-2 border-white font-bold text-ink hover:scale-[1.02] transition-transform"
              >
                <span className="text-2xl">{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        )}

        {feeling && !needsReset && (
          <div className="space-y-3">
            <p className="font-bold text-ink">
              {feeling === "good"  ? "Nice! Keep that energy going. 💪" : "Good catch! It's smart to notice when you're getting tired."}
            </p>
            <button
              onClick={onContinue}
              className="px-5 py-3 rounded-full bg-ink text-background font-bold"
            >
              Keep going →
            </button>
          </div>
        )}

        {feeling && needsReset && !chosenReset && (
          <div className="space-y-3">
            <p className="font-bold text-ink">
              Smart to notice that! 🎯 Pick a reset before the next challenge.
            </p>
            <div className="grid gap-2">
              {RESETS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => pickReset(r)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 border-2 border-white font-bold text-ink text-left hover:scale-[1.01] transition-transform"
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <div>
                    <div className="text-sm font-bold">{r.title}</div>
                    <div className="text-xs font-normal opacity-70">{r.when}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {chosenReset && !resetDone && (
          <div className="space-y-3 rounded-2xl p-4 bg-white/70">
            <div className="text-2xl">{chosenReset.emoji}</div>
            <div className="font-extrabold text-ink">{chosenReset.title}</div>
            <ol className="space-y-1.5">
              {chosenReset.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-ink/10 flex items-center justify-center font-bold text-xs">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setResetDone(true)}
              className="mt-2 px-4 py-2 rounded-full bg-ink text-background text-sm font-bold"
            >
              I'm back 💪
            </button>
          </div>
        )}

        {resetDone && (
          <div className="space-y-3">
            <p className="font-bold text-ink">
              🎉 That's a brave brain move — noticing AND doing something about it. Let's keep going.
            </p>
            <button
              onClick={onContinue}
              className="px-5 py-3 rounded-full bg-ink text-background font-bold"
            >
              Back to the mission →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mission player ───────────────────────────────────────────────────────────

function MissionPlayer({ mission, onBack }: { mission: Mission; onBack: () => void }) {
  const { state, solveMission, markTricky, tinyStep } = useLab();
  const deck = useMemo(() => mission.challenges, [mission]);
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [showBrainCheck, setShowBrainCheck] = useState(false);
  const [brainCheckDone, setBrainCheckDone] = useState(false);

  const card = deck[idx];
  const solvedCount = state.missionsSolved[mission.id] ?? 0;
  const diff = DIFF[card.difficulty];

  function advance() {
    setReveal(false);
    const next = (idx + 1) % deck.length;
    setIdx(next);
    // Trigger brain check after challenge brainCheckAt (if not yet shown)
    if (
      mission.brainCheckAt > 0 &&
      !brainCheckDone &&
      (idx + 1) >= mission.brainCheckAt
    ) {
      setShowBrainCheck(true);
    }
  }

  function handleSolve() {
    solveMission(mission.id, mission.title);
    advance();
  }

  if (showBrainCheck) {
    return (
      <div className="space-y-5">
        <button onClick={onBack} className="text-sm font-bold text-muted-foreground hover:text-foreground">
          ← All missions
        </button>
        <BrainCheck
          onContinue={() => {
            setShowBrainCheck(false);
            setBrainCheckDone(true);
          }}
        />
      </div>
    );
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
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-3">
          <span>Card {idx + 1} / {deck.length}</span>
          <span className={`px-2 py-1 rounded-full border text-xs font-bold ${diff.cls}`}>
            {diff.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-4">
          {deck.map((c, i) => (
            <div
              key={c.id}
              className={`h-1.5 flex-1 rounded-full ${
                i < idx ? "bg-primary" : i === idx ? "bg-primary/40" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="text-xl sm:text-2xl font-bold leading-snug min-h-24 whitespace-pre-line">
          {card.prompt}
        </div>

        {card.answer && reveal && (
          <div className="mt-3 inline-block px-3 py-1.5 rounded-full bg-secondary text-sm font-bold">
            💡 One idea: {card.answer}
          </div>
        )}

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <button
            onClick={handleSolve}
            className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90"
          >
            ✅ Mark solved
          </button>
          {card.hint && (
            <button
              onClick={() => setReveal((v) => !v)}
              className="px-4 py-3 rounded-xl bg-card border-2 border-border font-bold hover:border-primary/40"
            >
              {reveal ? "Hide hint" : "Show a hint"}
            </button>
          )}
        </div>

        {/* Stuck tools */}
        <div className="mt-5 p-4 rounded-2xl bg-secondary/60 border-2 border-border">
          <div className="font-bold mb-2">Brain getting stuck?</div>
          <div className="grid sm:grid-cols-3 gap-2">
            <button
              onClick={() => markTricky(`${mission.title}: ${card.prompt.slice(0, 40)}`)}
              className="px-3 py-2 rounded-xl bg-card border-2 border-border text-sm font-bold hover:border-primary/40"
            >
              🤔 This feels tricky
            </button>
            <button
              onClick={() => markTricky(`Use a reset — ${mission.title}`)}
              className="px-3 py-2 rounded-xl bg-card border-2 border-border text-sm font-bold hover:border-primary/40"
            >
              🧰 Use a reset
            </button>
            <button
              onClick={() => tinyStep(`${mission.title}: tiny step`)}
              className="px-3 py-2 rounded-xl bg-card border-2 border-border text-sm font-bold hover:border-primary/40"
            >
              👣 One tiny step
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={advance}
            className="px-4 py-2 rounded-full text-sm font-bold border-2 border-border bg-card hover:border-primary/40"
          >
            Skip card →
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Mission browser ──────────────────────────────────────────────────────────

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
          Pick a mission. Each one is 8–12 minutes — challenges get harder as you go.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-5">
        {MISSIONS.map((m) => {
          const solved = state.missionsSolved[m.id] ?? 0;
          return (
            <button
              key={m.id}
              onClick={() => setActiveId(m.id)}
              className="pop-card overflow-hidden text-left hover:-translate-y-1 transition-transform"
            >
              <div className="p-6 text-ink relative" style={{ background: m.gradient }}>
                <div className="absolute -right-4 -bottom-6 text-8xl opacity-30">{m.emoji}</div>
                <div className="relative">
                  <div className="text-5xl">{m.emoji}</div>
                  <h2 className="font-extrabold text-2xl mt-2">{m.title}</h2>
                  <p className="text-sm font-semibold opacity-90 mt-1">{m.tagline}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="chip">✅ {solved} solved</span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {m.challenges.length} challenges · 🟢🟡🔴
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">Play →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
