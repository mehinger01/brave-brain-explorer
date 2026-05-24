import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar, type View } from "@/components/lab/NavBar";
import { MissionHub } from "@/components/lab/MissionHub";
import { ResetToolbox } from "@/components/lab/ResetToolbox";
import { BodyDetective } from "@/components/lab/BodyDetective";
import { Missions } from "@/components/lab/Missions";
import { BossChallenge } from "@/components/lab/BossChallenge";
import { Reflection } from "@/components/lab/Reflection";
import { CoachNotes } from "@/components/lab/CoachNotes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brave Brain Adventure Lab" },
      { name: "description", content: "A playful puzzle adventure that helps kids notice stuck feelings, reset their brain, and come back to finish." },
      { property: "og:title", content: "Brave Brain Adventure Lab" },
      { property: "og:description", content: "Adventure puzzles for focus, resets, and brave brain growth." },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<View>("hub");

  return (
    <div className="min-h-screen">
      <NavBar view={view} setView={setView} />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {view === "hub" && <MissionHub setView={setView} />}
        {view === "toolbox" && <ResetToolbox />}
        {view === "detective" && <BodyDetective />}
        {view === "missions" && <Missions />}
        {view === "boss" && <BossChallenge />}
        {view === "reflect" && <Reflection />}
        {view === "notes" && <CoachNotes />}
      </main>
      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-muted-foreground">
        Brave Brain Adventure Lab · Hard means new. 🧠💪
      </footer>
    </div>
  );
}
