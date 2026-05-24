export interface Challenge {
  id: string;
  prompt: string;
  hint?: string;
  answer?: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Mission {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  gradient: string;
  brainCheckAt: number; // show brain check after this many solved (0 = disabled)
  challenges: Challenge[];
}

// ─── MISSIONS ────────────────────────────────────────────────────────────────

export const MISSIONS: Mission[] = [
  {
    id: "animal-rescue",
    title: "Animal Rescue Lab",
    emoji: "🦦",
    tagline: "Use the clue cards to find each lost animal.",
    gradient: "var(--gradient-jungle)",
    brainCheckAt: 5,
    challenges: [
      // Easy (1-3)
      { id: "ar1",  difficulty: "easy",   prompt: "Clues: lives in cold water, has flippers, loves fish. Who is it?",                                                                        answer: "penguin" },
      { id: "ar2",  difficulty: "easy",   prompt: "Clues: long neck, eats leaves up high, has spots. Who is it?",                                                                           answer: "giraffe" },
      { id: "ar3",  difficulty: "easy",   prompt: "Clues: nocturnal, big round eyes, hoots at night. Who is it?",                                                                           answer: "owl" },
      // Medium (4-6)
      { id: "ar4",  difficulty: "medium", prompt: "Clues: 8 arms, lives in the sea, squirts ink, can change color. Who is it?",                                                             answer: "octopus" },
      { id: "ar5",  difficulty: "medium", prompt: "Clues: hops, carries babies in a pouch, lives in Australia, kicks hard. Who is it?",                                                     answer: "kangaroo" },
      { id: "ar6",  difficulty: "medium", prompt: "Clues: I'm a mammal, I lay eggs, I have a bill like a duck and a tail like a beaver, I live in Australia. Who am I?",                   answer: "platypus",  hint: "Think of a very unusual Australian mammal." },
      // Hard (7-10)
      { id: "ar7",  difficulty: "hard",   prompt: "Clues: I'm the only mammal that can truly fly. I sleep upside down. I use sound to see in the dark. Who am I?",                         answer: "bat",       hint: "I come out at night and live in caves." },
      { id: "ar8",  difficulty: "hard",   prompt: "Clues: I look like a horse but live in the ocean. I swim upright. The DAD carries the babies. Who am I?",                               answer: "seahorse",  hint: "I'm tiny and I drift with currents." },
      { id: "ar9",  difficulty: "hard",   prompt: "Three animals: Animal A is bigger than B. Animal B is smaller than C. Animal C is a house cat. Animal A is an insect. Animal B barks. Who is Animal B?", answer: "dog", hint: "Work through each clue one at a time." },
      { id: "ar10", difficulty: "hard",   prompt: "I have a mane but I'm not a lion. I live in water but I'm not a fish. I'm black and white but I'm not a zebra. My name has two animal names in it. Who am I?", answer: "seahorse or killer whale (orca)", hint: "Think of animals whose names combine two other things." },
    ],
  },

  {
    id: "dino-pattern",
    title: "Dino Pattern Cave",
    emoji: "🦖",
    tagline: "Crack the dino patterns to light the cave.",
    gradient: "var(--gradient-grape)",
    brainCheckAt: 5,
    challenges: [
      // Easy (1-3)
      { id: "dp1", difficulty: "easy",   prompt: "What comes next? 🦕 🦖 🦕 🦖 🦕 ___",                                            answer: "🦖" },
      { id: "dp2", difficulty: "easy",   prompt: "What comes next? 2, 4, 6, 8, ___",                                               answer: "10" },
      { id: "dp3", difficulty: "easy",   prompt: "What comes next? 🥚 🥚🥚 🥚🥚🥚 ___",                                            answer: "🥚🥚🥚🥚 (four eggs)" },
      // Medium (4-6)
      { id: "dp4", difficulty: "medium", prompt: "What comes next? 1, 3, 5, 7, ___",                                               answer: "9" },
      { id: "dp5", difficulty: "medium", prompt: "Pattern: 🌋🦖🌿 🌋🦖🌿 🌋___🌿",                                                 answer: "🦖" },
      { id: "dp6", difficulty: "medium", prompt: "What comes next? 3, 6, 12, 24, ___",                                             answer: "48",  hint: "Each number doubles." },
      // Hard (7-10)
      { id: "dp7", difficulty: "hard",   prompt: "What comes next? 100, 90, 81, 73, 66, ___",                                       answer: "60",  hint: "The differences between numbers are changing: 10, 9, 8, 7, 6…" },
      { id: "dp8", difficulty: "hard",   prompt: "What comes next? 1, 1, 2, 3, 5, 8, ___",                                          answer: "13",  hint: "Add the two numbers before it to get the next one." },
      { id: "dp9", difficulty: "hard",   prompt: "Pattern rule: each number = the one before it × 2, then −1. Start: 1, 1, 3, 5, 11, 21, ___", answer: "41", hint: "21 × 2 = 42, then subtract 1." },
      { id: "dp10",difficulty: "hard",   prompt: "🌟 ⭐ 🌟🌟 ⭐ 🌟🌟🌟 ⭐ ___ ⭐\nHow many 🌟 come next, and what's the rule?",   answer: "4 stars — each group adds one more star", hint: "Count the stars in each group." },
    ],
  },

  {
    id: "builder-brain",
    title: "Builder Brain Lab",
    emoji: "🛠️",
    tagline: "Design, build, and solve it your way.",
    gradient: "var(--gradient-coral)",
    brainCheckAt: 5,
    challenges: [
      // Easy (1-3)
      { id: "bb1", difficulty: "easy",   prompt: "Design a vehicle that goes on land AND water. Describe 3 parts." },
      { id: "bb2", difficulty: "easy",   prompt: "Invent a robot that helps animals. Give it 1 job and 1 funny feature." },
      { id: "bb3", difficulty: "easy",   prompt: "Design a backpack with 1 awesome new feature. What does it do?" },
      // Medium (4-6)
      { id: "bb4", difficulty: "medium", prompt: "Draw or describe a treehouse with 3 rooms. What's in each room and why?" },
      { id: "bb5", difficulty: "medium", prompt: "Build a bridge across a river using only pillows and blankets. What keeps it from falling? What's your biggest worry about it?" },
      { id: "bb6", difficulty: "medium", prompt: "You have $20 and must make a gift for your best friend. You can only buy things from a grocery store. What do you make?" },
      // Hard (7-10)
      { id: "bb7", difficulty: "hard",   prompt: "Design a classroom for kids who have a hard time sitting still. What are 3 things that would be different from your classroom right now? Why those 3?" },
      { id: "bb8", difficulty: "hard",   prompt: "Invent a machine that helps your brain when it gets stuck or frustrated. What does it do? How does it work? Give it a name." },
      { id: "bb9", difficulty: "hard",   prompt: "You must design a game that can only be played with pencil and paper, that teaches someone to be patient. Write at least 3 rules." },
      { id: "bb10",difficulty: "hard",   prompt: "Design a city where every building has one job: to help people feel calm when they're overwhelmed. Describe 3 buildings and what happens inside each one." },
    ],
  },

  {
    id: "science-explorer",
    title: "Science Explorer Mystery",
    emoji: "🔬",
    tagline: "Sort, compare, and solve the mystery.",
    gradient: "var(--gradient-sun)",
    brainCheckAt: 5,
    challenges: [
      // Easy (1-3)
      { id: "se1", difficulty: "easy",   prompt: "Odd one out: shark, dolphin, whale, eagle. Which doesn't belong and why?",         answer: "eagle (not a water animal / doesn't have fins)" },
      { id: "se2", difficulty: "easy",   prompt: "Sort smallest to largest: elephant, ant, dog, mouse.",                             answer: "ant, mouse, dog, elephant" },
      { id: "se3", difficulty: "easy",   prompt: "Odd one out: apple, banana, carrot, grape. Which is NOT a fruit?",                 answer: "carrot" },
      // Medium (4-6)
      { id: "se4", difficulty: "medium", prompt: "Which is heavier: 1 pound of feathers or 1 pound of rocks?",                      answer: "same — both weigh 1 pound", hint: "Don't be tricked by the word 'feathers.'" },
      { id: "se5", difficulty: "medium", prompt: "Why do ducks have webbed feet? Give 2 reasons.",                                   answer: "to swim / paddle through water; to walk on muddy surfaces" },
      { id: "se6", difficulty: "medium", prompt: "True or False: Bats are birds. Dolphins are fish. Penguins can fly.\nHow many of these are true?", answer: "zero — all three are false", hint: "Think carefully about each one." },
      // Hard (7-10)
      { id: "se7", difficulty: "hard",   prompt: "If you drop a heavy rock and a light feather from the same height in a vacuum (no air at all), which lands first?", answer: "they land at the same time", hint: "Air resistance is the difference — take it away and think again." },
      { id: "se8", difficulty: "hard",   prompt: "8 frogs are in a pond. Half are green. A quarter are brown. The rest are spotted. How many spotted frogs are there?", answer: "2 spotted frogs", hint: "Half of 8 = 4. A quarter of 8 = 2. 8 − 4 − 2 = ?" },
      { id: "se9", difficulty: "hard",   prompt: "A farmer has 17 sheep. All but 9 run away. How many sheep does the farmer have left?", answer: "9", hint: "'All but 9' means 9 stay." },
      { id: "se10",difficulty: "hard",   prompt: "You have a candle, a match, and a piece of paper in a dark cave. Which do you light FIRST?",  answer: "the match", hint: "You need something to light the others with." },
    ],
  },

  {
    id: "word-wizard",
    title: "Word Wizard Lab",
    emoji: "🧙",
    tagline: "Riddles, wordplay, and sneaky language puzzles.",
    gradient: "var(--gradient-jungle)",
    brainCheckAt: 5,
    challenges: [
      // Easy (1-3)
      { id: "ww1", difficulty: "easy",   prompt: "I rhyme with 'cat' and you wear me on your head. What am I?",                     answer: "hat" },
      { id: "ww2", difficulty: "easy",   prompt: "Change ONE letter in FISH to make something you eat off of.",                     answer: "DISH" },
      { id: "ww3", difficulty: "easy",   prompt: "What 3-letter word means the opposite of night?",                                 answer: "day" },
      // Medium (4-6)
      { id: "ww4", difficulty: "medium", prompt: "I have keys but no locks. I have space but no room. You can enter but can't go inside. What am I?", answer: "a keyboard", hint: "Think about computers." },
      { id: "ww5", difficulty: "medium", prompt: "The more you take, the more you leave behind. What am I?",                        answer: "footsteps", hint: "Think about walking." },
      { id: "ww6", difficulty: "medium", prompt: "What word becomes SHORTER when you add two letters to it?",                       answer: "SHORT (short + er = shorter)", hint: "The answer is hidden in the question." },
      // Hard (7-10)
      { id: "ww7", difficulty: "hard",   prompt: "A rooster is sitting on top of a barn. It lays an egg. Which way does the egg roll?", answer: "roosters don't lay eggs", hint: "Read very carefully." },
      { id: "ww8", difficulty: "hard",   prompt: "How many months have 28 days?",                                                   answer: "all 12 months have at least 28 days", hint: "Don't just think about February." },
      { id: "ww9", difficulty: "hard",   prompt: "There are 3 apples on the table. You take 2. How many apples do YOU have?",       answer: "2 — you took them", hint: "Who has the apples now?" },
      { id: "ww10",difficulty: "hard",   prompt: "Unscramble this word: S I L E N T\nHint: it's something you do when you listen carefully.", answer: "LISTEN (also: ENLIST, TINSEL)", hint: "6 letters. Starts with L." },
    ],
  },

  {
    id: "code-cracker",
    title: "Code Cracker HQ",
    emoji: "🔐",
    tagline: "Decode the messages. Crack the spy codes.",
    gradient: "var(--gradient-grape)",
    brainCheckAt: 5,
    challenges: [
      // Easy (1-3)
      { id: "cc1", difficulty: "easy",   prompt: "Letter number code: A=1, B=2, C=3...\nWhat does 3 - 1 - 20 spell?",              answer: "CAT", hint: "C=3, A=1, T=20" },
      { id: "cc2", difficulty: "easy",   prompt: "Shift code: each letter in the message = the letter BEFORE it (B→A, C→B...).\nDecode: DBU",  answer: "CAT", hint: "D→C, B→A, U→T" },
      { id: "cc3", difficulty: "easy",   prompt: "Backwards words: What is ELPPA spelled backwards?",                              answer: "APPLE" },
      // Medium (4-6)
      { id: "cc4", difficulty: "medium", prompt: "First letter code: take the first letter of each word.\n'Cats Always Travel.' What animal is the secret message?", answer: "CAT" },
      { id: "cc5", difficulty: "medium", prompt: "Mirror code: A↔Z, B↔Y, C↔X, D↔W, E↔V, F↔U, G↔T...\nDecode: XZG",               answer: "CAT",  hint: "X=C, A=Z, G=T" },
      { id: "cc6", difficulty: "medium", prompt: "First letter code: take the FIRST letter of each word to find the hidden animal.\n'Frogs Often Xylophone.'", answer: "FOX 🦊", hint: "F — O — X" },
      // Hard (7-10)
      { id: "cc7", difficulty: "hard",   prompt: "+3 cipher: each letter shifts forward 3 (A→D, B→E, C→F...)\nDecode: FDWFK",      answer: "CATCH", hint: "Shift each letter back 3 spots: F→C, D→A, W→T, F→C, K→H" },
      { id: "cc8", difficulty: "hard",   prompt: "Three boxes: one holds apples, one holds oranges, one holds both.\nAll 3 labels are WRONG.\nThe box in front of you says 'MIXED.'\nYou reach in and pull out an apple.\nWhat's actually in each box?",  answer: "The MIXED box = apples. The APPLES box = oranges. The ORANGES box = mixed.", hint: "Since all labels are wrong, the MIXED box can't be mixed — it must be one thing. You pulled an apple, so it's all apples. Work from there." },
      { id: "cc9", difficulty: "hard",   prompt: "Two-step decode:\nStep 1 — reverse the word.\nStep 2 — shift each letter back 1.\nDecode: SPPE",  answer: "DOOR", hint: "SPPE reversed = EPPS. Then shift each back 1: E→D, P→O, P→O, S→R = DOOR" },
      { id: "cc10",difficulty: "hard",   prompt: "Logic lock: I am thinking of a number.\nIt is between 1 and 20.\nIt is even.\nIt is greater than 10.\nIt is NOT 12 or 16.\nThe digits add up to more than 4.\nWhat is the number?", answer: "14 or 18 (14: digits add to 5 ✓ | 18: digits add to 9 ✓ — both work, discuss with your coach!)", hint: "List the even numbers between 10 and 20, then cross off the ones that break the rules." },
    ],
  },
];

// ─── RESETS ───────────────────────────────────────────────────────────────────

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

// ─── BODY CLUES ───────────────────────────────────────────────────────────────

export const CLUES = [
  { key: "stop"      as const, label: "I want to stop",         emoji: "🛑" },
  { key: "silly"     as const, label: "I get silly",            emoji: "🤪" },
  { key: "dont-know" as const, label: "I say \"I don't know\"", emoji: "🤷" },
  { key: "moves"     as const, label: "My body moves a lot",    emoji: "🤸" },
  { key: "mouth"     as const, label: "My mouth/teeth get busy",emoji: "👄" },
  { key: "look-away" as const, label: "I look away",            emoji: "👀" },
  { key: "mad"       as const, label: "I feel mad",             emoji: "😠" },
  { key: "worried"   as const, label: "I feel worried",         emoji: "😟" },
  { key: "rush"      as const, label: "I rush",                 emoji: "💨" },
  { key: "break"     as const, label: "I want a break",         emoji: "🛋️" },
];

export const CLUE_PLANS = [
  "use a Turtle Reset 🐢",
  "try a Shake-Out 🦘",
  "do 3 Balloon Breaths 🎈",
  "go back to one tiny step",
  "tell my coach what I notice",
  "drink a sip of water and try again",
];

// ─── BOSS ─────────────────────────────────────────────────────────────────────

export const BOSS_CLUES = [
  { id: "b1", prompt: "Clue 1: I am an animal. I have a shell and I move slow. Who am I?",               answer: "turtle" },
  { id: "b2", prompt: "Clue 2: What number comes next? 5, 10, 15, 20, ___",                             answer: "25" },
  { id: "b3", prompt: "Clue 3: Odd one out — jet, plane, helicopter, submarine. Which doesn't fly?",    answer: "submarine" },
];
