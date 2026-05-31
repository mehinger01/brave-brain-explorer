import { useState } from "react";

type ChallengeOption = {
  id: string;
  title: string;
  emoji: string;
  why: string;
  roundOneTitle: string;
  roundOne: string[];
  roundTwoTitle: string;
  roundTwo: string[];
  coachMoves: string[];
};

const AGENDA = [
  {
    time: "5 min",
    title: "Welcome & Check-In",
    doing: "Start with a quick connection, one success, and a calm entry into the session.",
    why: "Beginning with success lowers pressure and helps Zach feel ready to work through challenge instead of brace against it.",
    emoji: "👋",
  },
  {
    time: "5 min",
    title: "Turtle Strategy Review",
    doing: "Practice the Turtle Reset before the work gets hard.",
    why: "A reset is easiest to use during frustration when it has already been practiced while calm.",
    emoji: "🐢",
  },
  {
    time: "15 min",
    title: "Challenge Choice — Round 1",
    doing: "Zach chooses one activity from the challenge menu.",
    why: "Choice increases buy-in. Mild frustration creates a safe chance to notice body signals, pause, and keep going.",
    emoji: "🎯",
  },
  {
    time: "3–5 min",
    title: "Movement Reset",
    doing: "Use a quick movement break before the harder round.",
    why: "Movement helps reset attention, release tension, and prepare the brain for the next stretch.",
    emoji: "⚡",
  },
  {
    time: "15 min",
    title: "Challenge Choice — Round 2",
    doing: "Use the same activity type Zach chose earlier, but with a harder version.",
    why: "Keeping the format familiar reduces unnecessary confusion while still stretching persistence and flexible thinking.",
    emoji: "🧗",
  },
  {
    time: "10 min",
    title: "Reflect & Celebrate",
    doing: "Name what got hard, what strategy helped, and what Zach did instead of quitting.",
    why: "Reflection turns the session into transferable self-awareness: ‘I noticed it, I reset, and I came back.’",
    emoji: "⭐",
  },
];

const CHALLENGES: ChallengeOption[] = [
  {
    id: "pattern-detective",
    title: "Pattern Detective",
    emoji: "🕵️",
    why: "Great for practicing slow thinking, noticing rules, and explaining how he knows.",
    roundOneTitle: "Round 1 — Find the Rule",
    roundOne: [
      "2, 4, 6, 8, ___",
      "5, 10, 15, 20, ___",
      "1, 3, 5, 7, ___",
      "Stretch: Make your own pattern for the coach to solve.",
    ],
    roundTwoTitle: "Round 2 — Same Game, Harder Rule",
    roundTwo: [
      "3, 6, 12, 24, ___",
      "1, 4, 9, 16, ___",
      "2, 5, 10, 17, 26, ___",
      "Stretch: Create a pattern that takes at least three clues to figure out.",
    ],
    coachMoves: ["Ask: ‘What changed each time?’", "Have him point to evidence.", "Praise the strategy, not just the answer."],
  },
  {
    id: "logic-grid",
    title: "Logic Lineup",
    emoji: "🧩",
    why: "Builds working memory, sequencing, and calm persistence when clues feel tangled.",
    roundOneTitle: "Round 1 — Animal Lineup",
    roundOne: [
      "Three animals are lined up: dog, cat, rabbit.",
      "The dog is not first.",
      "The cat is before the rabbit.",
      "The rabbit is last.",
      "Who is first, second, and third?",
    ],
    roundTwoTitle: "Round 2 — Pet Match",
    roundTwo: [
      "Three kids — Alex, Ben, and Chloe — each have a different pet: dog, fish, cat.",
      "Alex does not own the dog.",
      "Ben owns neither the fish nor the dog.",
      "Chloe does not own the cat.",
      "Who owns each pet?",
    ],
    coachMoves: ["Use scratch paper or tokens.", "Cross out what cannot be true.", "Pause when frustration rises, then return to one clue."],
  },
  {
    id: "mystery-box",
    title: "Mystery Number Box",
    emoji: "🔢",
    why: "Gives lots of chances to eliminate possibilities and recover from wrong guesses.",
    roundOneTitle: "Round 1 — Narrow It Down",
    roundOne: [
      "I am thinking of a number.",
      "It is greater than 10.",
      "It is less than 20.",
      "It is even.",
      "What numbers could it be?",
    ],
    roundTwoTitle: "Round 2 — More Clues",
    roundTwo: [
      "The number is greater than 20 and less than 50.",
      "It is a multiple of 3.",
      "It is odd.",
      "Its digits add to 9.",
      "What numbers fit? Explain how you eliminated choices.",
    ],
    coachMoves: ["List all possibilities first.", "Let him eliminate one clue at a time.", "Celebrate narrowing the list, even before the final answer."],
  },
  {
    id: "tower-challenge",
    title: "Tower Challenge",
    emoji: "🏗️",
    why: "Creates productive frustration through hands-on trial, error, rebuilding, and flexible thinking.",
    roundOneTitle: "Round 1 — Tallest Tower",
    roundOne: [
      "Use blocks, cups, LEGOs, paper, or nearby materials.",
      "Build the tallest tower possible in 3 minutes.",
      "It must stand for 10 seconds.",
      "It may not lean against anything.",
    ],
    roundTwoTitle: "Round 2 — Trickier Build",
    roundTwo: [
      "Build the tallest tower again.",
      "It must support a small object on top.",
      "It must stand for 20 seconds.",
      "You may only use one hand while building.",
    ],
    coachMoves: ["Expect collapse and normalize it.", "Ask: ‘What did the tower teach us?’", "Use the Turtle Reset after a failed build."],
  },
  {
    id: "spot-rule",
    title: "Spot the Rule",
    emoji: "👀",
    why: "Helps Zach tolerate uncertainty while searching for structure.",
    roundOneTitle: "Round 1 — Simple Rules",
    roundOne: [
      "Red, Blue, Red, Blue, Red, ___",
      "Circle, Square, Circle, Square, ___",
      "Clap, Stomp, Clap, Stomp, ___",
      "Then create your own rule.",
    ],
    roundTwoTitle: "Round 2 — Sneakier Rules",
    roundTwo: [
      "2, 4, 8, 16, ___",
      "1, 3, 6, 10, 15, ___",
      "A, C, F, J, ___",
      "Invent a rule that takes at least three clues before someone can identify it.",
    ],
    coachMoves: ["Ask him to test one possible rule.", "Make guessing safe.", "Separate ‘wrong answer’ from ‘bad thinking.’"],
  },
  {
    id: "escape-code",
    title: "Mini Escape Code",
    emoji: "🔐",
    why: "Adds excitement while practicing multi-step reasoning and patience.",
    roundOneTitle: "Round 1 — Three-Digit Code",
    roundOne: [
      "You need a 3-digit code.",
      "The first digit is 4.",
      "The last digit is 2.",
      "The middle digit is 1 more than the first digit.",
      "What is the code?",
    ],
    roundTwoTitle: "Round 2 — Harder Code",
    roundTwo: [
      "The hundreds digit is twice the tens digit.",
      "The tens digit is one less than the ones digit.",
      "All digits are different.",
      "The digits add to 15.",
      "What is the code?",
    ],
    coachMoves: ["Write each clue on its own line.", "Check one clue at a time.", "Use a reset before giving a hint."],
  },
];

export function ZachSession() {
  const [selectedId, setSelectedId] = useState(CHALLENGES[0].id);
  const selected = CHALLENGES.find((c) => c.id === selectedId) ?? CHALLENGES[0];

  return (
    <div className="space-y-6">
      <section className="pop-card overflow-hidden relative">
        <div className="absolute inset-0 opacity-90" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative p-6 sm:p-10 text-ink">
          <div className="chip mb-4"><span>🐢</span><span>Zach Session Plan</span></div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">Turtle Reset + Brave Challenge</h1>
          <p className="mt-3 text-base sm:text-lg max-w-2xl font-semibold">
            Today’s target is not perfect answers. The target is noticing frustration early, using a reset, and coming back to the work.
          </p>
        </div>
      </section>

      <section className="pop-card p-6">
        <h2 className="text-2xl font-extrabold mb-4">Client-Facing Agenda</h2>
        <div className="grid gap-3">
          {AGENDA.map((item) => (
            <div key={item.title} className="rounded-2xl border-2 border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-2xl">{item.emoji}</span>
                <span className="chip">{item.time}</span>
                <h3 className="font-extrabold text-lg">{item.title}</h3>
              </div>
              <p className="text-sm"><span className="font-bold">What we’re doing:</span> {item.doing}</p>
              <p className="text-sm text-muted-foreground mt-1"><span className="font-bold text-foreground">Why:</span> {item.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pop-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-extrabold">Step 3 Choice Menu</h2>
            <p className="text-sm text-muted-foreground">Pick one. Step 5 will use the same choice, just harder.</p>
          </div>
          <div className="chip">Choice builds buy-in</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CHALLENGES.map((challenge) => {
            const active = challenge.id === selected.id;
            return (
              <button
                key={challenge.id}
                onClick={() => setSelectedId(challenge.id)}
                className={`pop-card p-4 text-left hover:-translate-y-1 transition-all ${active ? "ring-4 ring-primary/30 border-primary" : ""}`}
              >
                <div className="text-3xl">{challenge.emoji}</div>
                <div className="font-extrabold mt-2">{challenge.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{challenge.why}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="pop-card p-6">
          <div className="chip mb-3"><span>🎯</span><span>Step 3</span></div>
          <h2 className="text-2xl font-extrabold">{selected.emoji} {selected.roundOneTitle}</h2>
          <ul className="mt-4 space-y-3">
            {selected.roundOne.map((line) => (
              <li key={line} className="rounded-xl bg-secondary/60 border-2 border-border px-4 py-3 font-semibold whitespace-pre-line">
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="pop-card p-6">
          <div className="chip mb-3"><span>🧗</span><span>Step 5</span></div>
          <h2 className="text-2xl font-extrabold">{selected.emoji} {selected.roundTwoTitle}</h2>
          <ul className="mt-4 space-y-3">
            {selected.roundTwo.map((line) => (
              <li key={line} className="rounded-xl bg-secondary/60 border-2 border-border px-4 py-3 font-semibold whitespace-pre-line">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pop-card p-6">
        <h2 className="text-2xl font-extrabold mb-3">Coach Moves for This Choice</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {selected.coachMoves.map((move) => (
            <div key={move} className="rounded-2xl bg-card border-2 border-border p-4 text-sm font-semibold">
              {move}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl p-4 bg-secondary/70 border-2 border-border">
          <div className="font-extrabold">Main data point to watch:</div>
          <p className="text-sm text-muted-foreground mt-1">
            How quickly does Zach notice frustration, choose a reset, and return to the challenge compared with the last session?
          </p>
        </div>
      </section>
    </div>
  );
}
