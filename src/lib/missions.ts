export interface Challenge {
  id: string;
  prompt: string;
  hint?: string;
  answer?: string; // optional short answer (for self-check)
}

export interface Mission {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  gradient: string; // CSS var name like --gradient-sun
  challenges: Challenge[];
}

export const MISSIONS: Mission[] = [
  {
    id: "animal-rescue",
    title: "Animal Rescue Lab",
    emoji: "🦦",
    tagline: "Use the clue cards to find each lost animal.",
    gradient: "var(--gradient-jungle)",
    challenges: [
      { id: "ar1", prompt: "Clues: lives in cold water, has flippers, loves fish. Who is it?", answer: "penguin" },
      { id: "ar2", prompt: "Clues: long neck, eats leaves up high, has spots. Who is it?", answer: "giraffe" },
      { id: "ar3", prompt: "Clues: nocturnal, big eyes, hoots at night. Who is it?", answer: "owl" },
      { id: "ar4", prompt: "Clues: 8 arms, lives in the sea, can change color. Who is it?", answer: "octopus" },
      { id: "ar5", prompt: "Clues: hops, carries babies in a pouch, lives in Australia. Who is it?", answer: "kangaroo" },
      { id: "ar6", prompt: "Clues: stripes, big cat, hunts alone. Who is it?", answer: "tiger" },
    ],
  },
  {
    id: "dino-pattern",
    title: "Dino Pattern Cave",
    emoji: "🦖",
    tagline: "Crack the dino patterns to light the cave.",
    gradient: "var(--gradient-grape)",
    challenges: [
      { id: "dp1", prompt: "What comes next? 🦕 🦖 🦕 🦖 🦕 ___", answer: "🦖" },
      { id: "dp2", prompt: "What comes next? 2, 4, 6, 8, ___", answer: "10" },
      { id: "dp3", prompt: "What comes next? 🥚 🥚🥚 🥚🥚🥚 ___", answer: "🥚🥚🥚🥚" },
      { id: "dp4", prompt: "Pattern: A B A B A ___", answer: "B" },
      { id: "dp5", prompt: "What comes next? 1, 3, 5, 7, ___", answer: "9" },
      { id: "dp6", prompt: "Pattern: 🌋🦖🌿 🌋🦖🌿 🌋___🌿", answer: "🦖" },
    ],
  },
  {
    id: "builder-brain",
    title: "Builder Brain Lab",
    emoji: "🛠️",
    tagline: "Design, build, and draw it your way.",
    gradient: "var(--gradient-coral)",
    challenges: [
      { id: "bb1", prompt: "Design a vehicle that goes on land AND water. Draw it or describe 3 parts." },
      { id: "bb2", prompt: "Build a tower in your mind using only triangles. How many would you stack?" },
      { id: "bb3", prompt: "Invent a robot that helps animals. Give it 1 job and 1 funny feature." },
      { id: "bb4", prompt: "Draw a treehouse with 3 rooms. What's in each room?" },
      { id: "bb5", prompt: "Design a backpack with 1 awesome new feature. What does it do?" },
      { id: "bb6", prompt: "Build a bridge made of pillows. What keeps it from falling?" },
    ],
  },
  {
    id: "science-explorer",
    title: "Science Explorer Mystery",
    emoji: "🔬",
    tagline: "Sort, compare, and solve the mystery.",
    gradient: "var(--gradient-sun)",
    challenges: [
      { id: "se1", prompt: "Odd one out: shark, dolphin, whale, eagle. Which doesn't belong?", answer: "eagle" },
      { id: "se2", prompt: "Which animal has the BEST camouflage in snow: polar bear, parrot, or frog?", answer: "polar bear" },
      { id: "se3", prompt: "Sort by size (smallest first): elephant, ant, dog, mouse.", answer: "ant, mouse, dog, elephant" },
      { id: "se4", prompt: "Odd one out: apple, banana, carrot, grape. Which is not a fruit?", answer: "carrot" },
      { id: "se5", prompt: "Why do ducks have webbed feet?", answer: "to swim" },
      { id: "se6", prompt: "Which is heavier: 1 pound of feathers or 1 pound of rocks?", answer: "same" },
    ],
  },
];

export const RESETS = [
  {
    key: "turtle" as const,
    title: "Turtle Reset",
    emoji: "🐢",
    color: "var(--gradient-jungle)",
    when: "When your brain feels too fast or too loud.",
    steps: [
      "Tuck your chin gently like a turtle.",
      "Pull your shoulders up to your ears… and drop them slow.",
      "Take 3 slow turtle breaths.",
      "Peek your head back out, ready to try again.",
    ],
  },
  {
    key: "shake" as const,
    title: "Shake-Out Reset",
    emoji: "🦘",
    color: "var(--gradient-coral)",
    when: "When your body has too many wiggles.",
    steps: [
      "Stand up tall like a kangaroo.",
      "Shake your hands for 5 seconds. Wiggle them out.",
      "Shake your legs, one at a time.",
      "Big stretch up high, then sit back down.",
    ],
  },
  {
    key: "balloon" as const,
    title: "Balloon Breath",
    emoji: "🎈",
    color: "var(--gradient-sun)",
    when: "When you feel worried, mad, or rushy.",
    steps: [
      "Put your hands on your belly.",
      "Breathe IN slow — fill your belly like a balloon.",
      "Breathe OUT slow — let the balloon get tiny.",
      "Do it 3 times. Then come back.",
    ],
  },
];

export const CLUES = [
  { key: "stop" as const, label: "I want to stop", emoji: "🛑" },
  { key: "silly" as const, label: "I get silly", emoji: "🤪" },
  { key: "dont-know" as const, label: "I say \"I don't know\"", emoji: "🤷" },
  { key: "moves" as const, label: "My body moves a lot", emoji: "🤸" },
  { key: "mouth" as const, label: "My mouth/teeth get busy", emoji: "👄" },
  { key: "look-away" as const, label: "I look away", emoji: "👀" },
  { key: "mad" as const, label: "I feel mad", emoji: "😠" },
  { key: "worried" as const, label: "I feel worried", emoji: "😟" },
  { key: "rush" as const, label: "I rush", emoji: "💨" },
  { key: "break" as const, label: "I want a break", emoji: "🛋️" },
];

export const CLUE_PLANS = [
  "use a Turtle Reset 🐢",
  "try a Shake-Out 🦘",
  "do 3 Balloon Breaths 🎈",
  "go back to one tiny step",
  "tell my coach what I notice",
  "drink a sip of water and try again",
];

export const BOSS_CLUES = [
  { id: "b1", prompt: "Clue 1: I am an animal. I have a shell and I move slow. Who am I?", answer: "turtle" },
  { id: "b2", prompt: "Clue 2: What number comes next? 5, 10, 15, 20, ___", answer: "25" },
  { id: "b3", prompt: "Clue 3: Odd one out: jet, plane, helicopter, submarine. Which doesn't fly?", answer: "submarine" },
];
