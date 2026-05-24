import { useEffect, useState, useCallback } from "react";

export type ResetKey = "turtle" | "shake" | "balloon";
export type ClueKey =
  | "stop" | "silly" | "dont-know" | "moves" | "mouth"
  | "look-away" | "mad" | "worried" | "rush" | "break";

export interface LogEntry {
  ts: number;
  type: "reset" | "clue" | "mission-solved" | "mission-tricky" | "tiny-step" | "boss-done";
  payload: string;
}

export interface LabState {
  braveBrain: number;          // 0–100
  badges: string[];
  missionsSolved: Record<string, number>;
  resetsUsed: Record<ResetKey, number>;
  cluesNoticed: Record<ClueKey, number>;
  log: LogEntry[];
  reflection: {
    hard: string;
    clue: string;
    reset: string;
    comeback: string;
    stars: number;
  };
  bossDone: boolean;
}

const KEY = "brave-brain-lab-v1";

const initial: LabState = {
  braveBrain: 20,
  badges: [],
  missionsSolved: {},
  resetsUsed: { turtle: 0, shake: 0, balloon: 0 },
  cluesNoticed: {
    stop: 0, silly: 0, "dont-know": 0, moves: 0, mouth: 0,
    "look-away": 0, mad: 0, worried: 0, rush: 0, break: 0,
  },
  log: [],
  reflection: { hard: "", clue: "", reset: "", comeback: "", stars: 0 },
  bossDone: false,
};

// ---------- module-level store (client-only) ----------

let listeners: Array<() => void> = [];
let _state: LabState = { ...initial };
let hydrated = false;

function isClient() {
  return typeof window !== "undefined";
}

function load(): LabState {
  if (!isClient()) return { ...initial };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...initial };
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return { ...initial };
  }
}

function persist(s: LabState) {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch { /* quota exceeded — silent */ }
}

function notify() {
  listeners.forEach((l) => l());
}

/** Immutably update state, persist, and notify React subscribers. */
function setState(updater: (s: LabState) => LabState) {
  if (!isClient()) return; // no-op during SSR
  _state = updater(_state);
  persist(_state);
  notify();
}

// ---------- helpers (run inside setState so they see up-to-date state) ----------

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function withBump(s: LabState, delta: number): LabState {
  return { ...s, braveBrain: clamp(s.braveBrain + delta) };
}

function withLog(s: LabState, entry: Omit<LogEntry, "ts">): LabState {
  return { ...s, log: [{ ts: Date.now(), ...entry }, ...s.log].slice(0, 200) };
}

function withBadge(s: LabState, badge: string): LabState {
  if (s.badges.includes(badge)) return s;
  return { ...s, badges: [...s.badges, badge] };
}

// ---------- hook ----------

export function useLab() {
  // Single counter to force re-renders when store changes.
  const [, force] = useState(0);

  useEffect(() => {
    // Hydrate from localStorage exactly once on the client.
    if (!hydrated) {
      _state = load();
      hydrated = true;
    }
    const l = () => force((n) => n + 1);
    listeners.push(l);
    // Trigger an immediate render with the loaded state.
    l();
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

  // ---------- actions ----------

  const bump = useCallback((delta: number) => {
    setState((s) => withBump(s, delta));
  }, []);

  const logEvent = useCallback((entry: Omit<LogEntry, "ts">) => {
    setState((s) => withLog(s, entry));
  }, []);

  const addBadge = useCallback((badge: string) => {
    setState((s) => withBadge(s, badge));
  }, []);

  const recordReset = useCallback((k: ResetKey, name: string) => {
    setState((s) => {
      let next = { ...s, resetsUsed: { ...s.resetsUsed, [k]: s.resetsUsed[k] + 1 } };
      next = withLog(next, { type: "reset", payload: name });
      next = withBump(next, 8);
      const totalResets = next.resetsUsed.turtle + next.resetsUsed.shake + next.resetsUsed.balloon;
      if (totalResets >= 3) next = withBadge(next, "Reset Ranger");
      return next;
    });
  }, []);

  const recordClue = useCallback((k: ClueKey, label: string) => {
    setState((s) => {
      let next = { ...s, cluesNoticed: { ...s.cluesNoticed, [k]: s.cluesNoticed[k] + 1 } };
      next = withLog(next, { type: "clue", payload: label });
      next = withBump(next, 4);
      next = withBadge(next, "Body Detective");
      return next;
    });
  }, []);

  const solveMission = useCallback((id: string, label: string) => {
    setState((s) => {
      let next = {
        ...s,
        missionsSolved: { ...s.missionsSolved, [id]: (s.missionsSolved[id] ?? 0) + 1 },
      };
      next = withLog(next, { type: "mission-solved", payload: label });
      next = withBump(next, 10);
      const total = Object.values(next.missionsSolved).reduce((a, b) => a + b, 0);
      if (total >= 1) next = withBadge(next, "First Find");
      if (total >= 5) next = withBadge(next, "Mission Pro");
      return next;
    });
  }, []);

  const markTricky = useCallback((label: string) => {
    setState((s) => {
      let next = withLog(s, { type: "mission-tricky", payload: label });
      next = withBump(next, 2);
      next = withBadge(next, "Tricky Spotter");
      return next;
    });
  }, []);

  const tinyStep = useCallback((label: string) => {
    setState((s) => {
      let next = withLog(s, { type: "tiny-step", payload: label });
      next = withBump(next, 3);
      next = withBadge(next, "Tiny Step Hero");
      return next;
    });
  }, []);

  const completeBoss = useCallback(() => {
    setState((s) => {
      let next = { ...s, bossDone: true };
      next = withLog(next, { type: "boss-done", payload: "Stuck Zone Boss" });
      next = withBump(next, 20);
      next = withBadge(next, "Stuck Zone Champion");
      return next;
    });
  }, []);

  const updateReflection = useCallback((patch: Partial<LabState["reflection"]>) => {
    setState((s) => ({ ...s, reflection: { ...s.reflection, ...patch } }));
  }, []);

  const reset = useCallback(() => {
    setState(() => ({ ...initial }));
  }, []);

  return {
    state: _state,
    bump, logEvent, addBadge,
    recordReset, recordClue, solveMission, markTricky, tinyStep,
    completeBoss, updateReflection, reset,
  };
}
