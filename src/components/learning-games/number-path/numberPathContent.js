// Number path — "אבני הנהר". The Siegler & Ramani linear board game as a
// 3D world. What made their game work, and what this one keeps:
//   1. the stones run in one straight line, left to right, like a ruler;
//   2. every stone the child steps on says ITS number ("5, 6"), not "1, 2";
//   3. a spinner with small values (1–2 or 1–3) keeps each turn short.

export const LEVELS = [
  { id: '10', size: 10, spin: 2, he: '1 עד 10', en: '1 to 10', ages: '3–5' },
  { id: '20', size: 20, spin: 3, he: '1 עד 20', en: '1 to 20', ages: '5–6' },
];

export const CHEERERS = ['frog', 'turtle', 'fox', 'penguin', 'cat', 'bear', 'koala', 'dog'];

export const UI = {
  he: {
    title: 'אבני הנהר',
    subtitle: 'מסובבים את הגלגל, האבנים עולות מהמים — וקופצים אבן אחרי אבן עד הגזר בצד השני.',
    intro: 'הגזר מחכה בצד השני של הנהר. סובבו את הגלגל, ואבנים יעלו מהמים. כל אבן שקופצים עליה — אומרים את המספר שלה!',
    back: 'לכל המשחקים',
    start: 'יוצאים לדרך!',
    spin: 'לסובב',
    spinHint: 'לחצו על הגלגל כדי לדעת כמה אבנים יעלו',
    rolled: 'יצא {n}! לכו קדימה על האבנים וספרו בקול',
    walk: 'קדימה! כל אבן — אומרים את המספר שלה',
    cheer: ['{n}! איזו קפיצה!', '{n}! כל הכבוד!', '{n}! עברת כבר חצי דרך!', '{n}! עוד קצת והגזר שלך!'],
    last: 'הגעת לאבן האחרונה — עוד צעד אל הגזר!',
    doneTitle: 'הגענו לגזר!',
    doneText: 'קפצתם מ־1 עד {n} על אבני הנהר.',
    again: 'עוד מסע',
    harder: 'נהר ארוך יותר',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'הקפידו שהילד יגיד את המספר של האבן ("שש, שבע") ולא "אחת, שתיים". זה ההבדל שגרם למשחק הזה לעבוד במחקר.',
    whyLabel: 'למה זה עוזר',
    why: 'במחקרים של סיגלר ורמאני, ילדי גן ששיחקו כשעה במשחק לוח עם מספרים בשורה ישרה השתפרו בהשוואת מספרים, בהערכה על ישר המספרים, בספירה ובזיהוי ספרות — והשיפור נשמר גם אחרי תשעה שבועות. לוח עגול לא נתן את אותה תוצאה.',
  },
  en: {
    title: 'River Stones',
    subtitle: 'Spin the wheel, stones rise out of the water — hop stone by stone to the carrot on the far side.',
    intro: 'The carrot waits across the river. Spin the wheel and stones will rise from the water. On every stone you land — say its number!',
    back: 'All games',
    start: "Let's go!",
    spin: 'Spin',
    spinHint: 'Tap the wheel to see how many stones rise',
    rolled: 'You got {n}! Walk forward on the stones and count out loud',
    walk: 'Go on! Every stone — say its number',
    cheer: ['{n}! What a hop!', '{n}! Well done!', "{n}! You're halfway there!", '{n}! Your carrot is close!'],
    last: 'That was the last stone — one more step to the carrot!',
    doneTitle: 'We reached the carrot!',
    doneText: 'You hopped from 1 to {n} across the river.',
    again: 'Another trip',
    harder: 'A longer river',
    parentTipLabel: 'Tip for parents',
    parentTip:
      'Make sure your child says the number on the stone ("six, seven") rather than "one, two". That detail is what made this game work in the research.',
    whyLabel: 'Why it helps',
    why: 'In studies by Siegler and Ramani, preschoolers who played a straight-line number board game for about an hour improved at comparing numbers, placing them on a number line, counting and reading numerals — and the gains lasted nine weeks. A circular board did not do the same.',
  },
};

export const META = {
  he: { title: 'אבני הנהר | משחק מספרים תלת-ממדי לגן | StoryLeap', description: 'משחק לוח מספרים ליניארי בתלת-ממד לגילאי 3–6, מבוסס על מחקרי סיגלר ורמאני.' },
  en: { title: 'River Stones | 3D Number Board Game | StoryLeap', description: 'A linear number board game in 3D for ages 3–6, based on Siegler & Ramani.' },
};
