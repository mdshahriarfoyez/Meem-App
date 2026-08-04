/**
 * Every word in the app lives here, so the writing can be edited without
 * touching a single component.
 */

export const HER_NAME = 'Meem';
export const HIS_NAME = 'Pranto';

/* --- Chapter 1 — Tiny Love Story ---------------------------------------- */
export const STORY_LINES = [
  'I still smile every time I think about you.',
  'You make ordinary days feel special.',
  "You've been my safest place.",
  'My favourite notification has always been your message.',
  'And somehow, you keep getting more wonderful.',
] as const;

/* --- Chapter 2 — Memory Game -------------------------------------------- */
export interface MemoryCard {
  id: string;
  emoji: string;
  label: string;
  message: string;
}

export const MEMORY_CARDS: MemoryCard[] = [
  {
    id: 'pizza',
    emoji: '🍕',
    label: 'Pizza Date',
    message: 'You always make pizza taste better. Even the burnt-crust ones.',
  },
  {
    id: 'coffee',
    emoji: '☕',
    label: 'Coffee',
    message: 'Half of mine is always yours. I stopped fighting it years ago.',
  },
  {
    id: 'movie',
    emoji: '🎬',
    label: 'Movie Night',
    message: 'You fall asleep halfway through. It is my favourite part.',
  },
  {
    id: 'calls',
    emoji: '🌙',
    label: 'Late Night Calls',
    message: '"Five more minutes" has never once meant five minutes.',
  },
  {
    id: 'laugh',
    emoji: '😂',
    label: 'Your Laugh',
    message: 'I say silly things on purpose, just to hear it again.',
  },
  {
    id: 'rain',
    emoji: '🌧️',
    label: 'Rainy Days',
    message: 'One umbrella, two people, zero complaints.',
  },
  {
    id: 'music',
    emoji: '🎧',
    label: 'Our Song',
    message: 'Some songs are just yours now. I gave up on them willingly.',
  },
  {
    id: 'us',
    emoji: '❤️',
    label: 'Us',
    message: 'My favourite thing I have ever been part of.',
  },
];

/* --- Chapter 3 — Choose Our Adventure ----------------------------------- */
export interface Adventure {
  id: string;
  emoji: string;
  title: string;
  blurb: string;
}

export const ADVENTURES: Adventure[] = [
  { id: 'sunset', emoji: '🌅', title: 'Watch the sunset', blurb: 'Somewhere quiet. Just us.' },
  { id: 'food', emoji: '🍜', title: 'Try a new restaurant', blurb: "Something we can't pronounce." },
  { id: 'random', emoji: '🎡', title: 'Random adventure', blurb: 'No plan. That is the plan.' },
];

export const ADVENTURE_REPLY = "I knew you'd pick that 😄";

/* --- Chapter 4 — Love Meter --------------------------------------------- */
export const METER_STEPS = [
  'Analyzing…',
  'Loading…',
  'Calculating…',
  'Searching…',
  "Loading wife's cuteness…",
  'Detecting smile…',
  'Cross-checking with my heart…',
] as const;

/* --- Chapter 5 — The Impossible Question -------------------------------- */
export const QUESTION = 'Would you let me steal a few more beautiful memories with you?';

/** Each tap on "Maybe" swaps in the next excuse and shrinks the button a little. */
export const MAYBE_EXCUSES = [
  'Maybe 🤍',
  'Are you sureee?',
  "What if there's dessert?",
  "I'll hold your hand.",
  'Pretty please?',
  'I already planned everything.',
  'You know you want to 😏',
] as const;

export const YES_LABEL = 'Absolutely ❤️';

/* --- Chapter 6 — Secret Letter ------------------------------------------ */
export const LETTER_LINES = [
  `My dearest ${HER_NAME},`,
  'Thank you for making my life brighter.',
  'Thank you for believing in me.',
  'Thank you for standing beside me through everything.',
  'You are my home, my peace, and my favourite person.',
  'No matter how busy life becomes,',
  'I promise to keep choosing you.',
  'Again and again.',
  'Forever.',
  'I love you.',
] as const;

export const LETTER_SIGNATURE = `— ${HIS_NAME} ❤️`;

/* --- Finale -------------------------------------------------------------- */
export const FINALE_LEAD = 'So…';
export const FINALE_QUESTION =
  'Will you go on another little adventure with me this weekend?';
export const FINALE_YES = 'YES ❤️';
export const FINALE_REPLY = "I can't wait ❤️";

/** Revealed only by holding the final heart for three seconds. */
export const HIDDEN_MESSAGE = `${HER_NAME}, no matter where life takes us, if I could choose again, I'd still choose you. Every single time. — ${HIS_NAME} ❤️`;

/* --- Easter egg — five taps on the title --------------------------------- */
export const SECRET_TITLE = "Things I'll Never Stop Loving About You";

export const SECRET_REASONS = [
  'Your smile.',
  'Your kindness.',
  'Your tiny reactions.',
  'How excited you get about small things.',
  'How safe you make me feel.',
  'The way you say my name.',
  'Your terrible, wonderful sense of timing.',
  'How you fix my collar without saying anything.',
  'The face you make when food is really good.',
  'How you remember things I forgot I said.',
  'Your sleepy voice in the morning.',
  'The way you laugh at your own jokes first.',
  'How stubborn you get when you are right.',
  'How stubborn you get when you are wrong.',
  'The way you hum when you are happy.',
  'How you make every room feel warmer.',
  'Your patience with me on my worst days.',
  'How proud you get of the smallest things I do.',
  'The way you hold my hand a little tighter in crowds.',
  'That you chose me. Still, every day.',
] as const;
