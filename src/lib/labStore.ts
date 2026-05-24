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

function load(): LabState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch { return initial; }
}

let listeners: Array<() => void> = [];
let state: LabState = initial;
let hydrated = false;

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

function setState(updater: (s: LabState) => LabState) {
  state = updater(state);
  persist();
}

export function useLab() {
  const [, force] = useState(0);
  useEffect(() => {
    if (!hydrated) { state = load(); hydrated = true; }
    const l = () => force((n) => n + 1);
    listeners.push(l);
    l();
    return () => { listeners = listeners.filter((x) => x !== l); };
  }, []);

  const bump = useCallback((delta: number) => {
    setState((s) => ({ ...s, braveBrain: Math.max(0, Math.min(100, s.braveBrain + delta)) }));
  }, []);

  const logEvent = useCallback((entry: Omit<LogEntry, "ts">) => {
    setState((s) => ({ ...s, log: [{ ts: Date.now(), ...entry }, ...s.log].slice(0, 200) }));
  }, []);

  const addBadge = useCallback((b: string) => {
    setState((s) => s.badges.includes(b) ? s : ({ ...s, badges: [...s.badges, b] }));
  }, []);

  const recordReset = useCallback((k: ResetKey, name: string) => {
    setState((s) => ({ ...s, resetsUsed: { ...s.resetsUsed, [k]: s.resetsUsed[k] + 1 } }));
    logEvent({ type: "reset", payload: name });
    bump(8);
    if (state.resetsUsed.turtle + state.resetsUsed.shake + state.resetsUsed.balloon >= 3) {
      addBadge("Reset Ranger");
    }
  }, [logEvent, bump, addBadge]);

  const recordClue = useCallback((k: ClueKey, label: string) => {
    setState((s) => ({ ...s, cluesNoticed: { ...s.cluesNoticed, [k]: s.cluesNoticed[k] + 1 } }));
    logEvent({ type: "clue", payload: label });
    bump(4);
    addBadge("Body Detective");
  }, [logEvent, bump, addBadge]);

  const solveMission = useCallback((id: string, label: string) => {
    setState((s) => ({
      ...s,
      missionsSolved: { ...s.missionsSolved, [id]: (s.missionsSolved[id] ?? 0) + 1 },
    }));
    logEvent({ type: "mission-solved", payload: label });
    bump(10);
    const totals = Object.values(state.missionsSolved).reduce((a, b) => a + b, 0);
    if (totals >= 1) addBadge("First Find");
    if (totals >= 5) addBadge("Mission Pro");
  }, [logEvent, bump, addBadge]);

  const markTricky = useCallback((label: string) => {
    logEvent({ type: "mission-tricky", payload: label });
    bump(2);
    addBadge("Tricky Spotter");
  }, [logEvent, bump, addBadge]);

  const tinyStep = useCallback((label: string) => {
    logEvent({ type: "tiny-step", payload: label });
    bump(3);
    addBadge("Tiny Step Hero");
  }, [logEvent, bump, addBadge]);

  const completeBoss = useCallback(() => {
    setState((s) => ({ ...s, bossDone: true }));
    logEvent({ type: "boss-done", payload: "Stuck Zone Boss" });
    bump(20);
    addBadge("Stuck Zone Champion");
  }, [logEvent, bump, addBadge]);

  const updateReflection = useCallback((patch: Partial<LabState["reflection"]>) => {
    setState((s) => ({ ...s, reflection: { ...s.reflection, ...patch } }));
  }, []);

  const reset = useCallback(() => { setState(() => initial); }, []);

  return {
    state,
    bump, logEvent, addBadge,
    recordReset, recordClue, solveMission, markTricky, tinyStep,
    completeBoss, updateReflection, reset,
  };
}
