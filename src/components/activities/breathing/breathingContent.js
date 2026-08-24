// Content for the Breathing Exercises activity.
//
// Authored once, read at runtime, never generated.
//
// SAFETY NOTE.
// All four patterns here are gentle, widely-taught breathing rhythms with no
// breath-holding beyond four seconds and no hyperventilation phase. Do NOT add
// patterns with long holds, forced exhalation, or rapid breathing — those carry
// real physiological risk for children and belong with a professional.
//
// The map rates this "שוק צפוף; בידול דרך personalization והקשר" — there are a
// thousand breathing apps. What differentiates this one is that it sits inside a
// toolbox the family already uses, asks for no signup, and names the pattern in
// a child's language rather than a yoga teacher's.

export const PATTERNS = [
  {
    id: 'balloon',
    emoji: '🎈',
    color: '#FF6FB5',
    phases: [
      { kind: 'in', seconds: 4 },
      { kind: 'out', seconds: 6 },
    ],
    he: { label: 'נשימת בלון', note: 'שאיפה שממלאת את הבטן, נשיפה ארוכה יותר. הכי טוב להירגע.' },
    en: { label: 'Balloon breathing', note: 'A breath that fills your tummy, then a longer breath out. Best for calming down.' },
  },
  {
    id: 'square',
    emoji: '⬛',
    color: '#4FC3E8',
    phases: [
      { kind: 'in', seconds: 4 },
      { kind: 'hold', seconds: 4 },
      { kind: 'out', seconds: 4 },
      { kind: 'hold', seconds: 4 },
    ],
    he: { label: 'נשימת ריבוע', note: 'ארבע פינות שוות. טובה כשקשה להתרכז.' },
    en: { label: 'Square breathing', note: 'Four equal corners. Good when focusing is hard.' },
  },
  {
    id: 'flower',
    emoji: '🌸',
    color: '#9B8FD8',
    phases: [
      { kind: 'in', seconds: 3 },
      { kind: 'out', seconds: 3 },
    ],
    he: { label: 'להריח פרח', note: 'שאיפה דרך האף כמו מריחים פרח, נשיפה דרך הפה. הכי קלה להתחלה.' },
    en: { label: 'Smell the flower', note: 'Breathe in through your nose like smelling a flower, out through your mouth. The easiest to start with.' },
  },
  {
    id: 'candle',
    emoji: '🕯️',
    color: '#FFC94D',
    phases: [
      { kind: 'in', seconds: 4 },
      { kind: 'out', seconds: 8 },
    ],
    he: { label: 'לכבות נר', note: 'נשיפה ארוכה מאוד, לאט, כאילו מכבים נר בלי להפיל אותו.' },
    en: { label: 'Blow out the candle', note: 'A very long, slow breath out, as if blowing out a candle without knocking it over.' },
  },
];

export const PHASE_WORDS = {
  he: { in: 'שאיפה', hold: 'להחזיק', out: 'נשיפה' },
  en: { in: 'Breathe in', hold: 'Hold', out: 'Breathe out' },
};

export const ROUNDS = [3, 5, 8];

export const UI = {
  he: {
    title: 'נשימות',
    subtitle: 'בוחרים נשימה, עוקבים אחרי העיגול, ונושמים איתו. אין מה לעשות נכון.',
    pickTitle: 'איזו נשימה?',
    roundsTitle: 'כמה סיבובים?',
    roundsWord: 'סיבובים',
    start: 'להתחיל',
    stop: 'לעצור',
    again: 'עוד פעם',
    roundOf: 'סיבוב {n} מתוך {total}',
    done: 'סיימנו',
    doneNote: 'שווה לשים לב איך הגוף מרגיש עכשיו, לעומת לפני.',
    change: 'לבחור נשימה אחרת',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'לנשום יחד ולא לצדד. ילד שרואה מבוגר נושם איתו לומד שזה משהו שעושים, לא משהו שמפעילים עליו — וזה גם מאט אתכם, מה שבדרך כלל עוזר לשניכם.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Breathing',
    subtitle: 'Pick a breath, follow the circle, and breathe with it. There is nothing to get right.',
    pickTitle: 'Which breath?',
    roundsTitle: 'How many rounds?',
    roundsWord: 'rounds',
    start: 'Start',
    stop: 'Stop',
    again: 'Again',
    roundOf: 'Round {n} of {total}',
    done: 'All done',
    doneNote: 'Worth noticing how your body feels now, compared to before.',
    change: 'Pick another breath',
    parentTipLabel: 'Tip for parents',
    parentTip: 'Breathe along, do not supervise. A child who sees an adult breathing with them learns this is something you do, not something done to you — and it slows you down too, which usually helps both of you.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'תרגילי נשימה לילדים | כלי הרגעה חינמי | StoryLeap',
    description: 'תרגילי נשימה מונפשים לילדים — נשימת בלון, ריבוע, פרח ונר. עוקבים אחרי העיגול ונרגעים. חינם וללא הרשמה.',
  },
  en: {
    title: 'Breathing Exercises for Kids | Free Calming Tool | StoryLeap',
    description: 'Animated breathing exercises for children — balloon, square, flower and candle breaths. Follow the circle and settle. Free, no signup.',
  },
};
