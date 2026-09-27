// Memory — "קופסאות ההפתעה". Pair matching as a 3D world: walk to a gift box,
// an animal pops out; find its twin. Walking between boxes stretches the time
// the first animal must be held in mind — working memory under load.

export const LEVELS = [
  { id: 's', pairs: 3, cols: 3, he: '3 זוגות', en: '3 pairs', ages: '3–4' },
  { id: 'm', pairs: 6, cols: 4, he: '6 זוגות', en: '6 pairs', ages: '5–7' },
  { id: 'l', pairs: 10, cols: 5, he: '10 זוגות', en: '10 pairs', ages: '8–11' },
];

export const FACES = [
  { id: 'bear', he: 'דובי', en: 'Bear' },
  { id: 'bunny', he: 'ארנבת', en: 'Bunny' },
  { id: 'cat', he: 'חתולה', en: 'Cat' },
  { id: 'dog', he: 'כלבלב', en: 'Puppy' },
  { id: 'koala', he: 'קואלה', en: 'Koala' },
  { id: 'frog', he: 'צפרדע', en: 'Frog' },
  { id: 'fox', he: 'שועל', en: 'Fox' },
  { id: 'panda', he: 'פנדה', en: 'Panda' },
  { id: 'penguin', he: 'פינגווין', en: 'Penguin' },
  { id: 'turtle', he: 'צב', en: 'Turtle' },
];

export const BOX_COLORS = [0xff9cc8, 0x8fd4f0, 0xffe07a, 0xa9e5b8, 0xc9b2fa, 0xffb88a];

export const UI = {
  he: {
    title: 'קופסאות ההפתעה',
    subtitle: 'בכל קופסה מחכה חיה. עומדים מול קופסה והיא נפתחת — מוצאים שתי חיות זהות.',
    intro: 'בכל קופסה מסתתרת חיה, ולכל חיה יש תאום. עמדו מול קופסה כדי לפתוח אותה.',
    back: 'לכל המשחקים',
    start: 'בואו נפתח!',
    first: 'עמדו על העיגול שמול קופסה כדי לפתוח אותה',
    second: 'עכשיו קופסה שנייה — איפה התאום של {name}?',
    found: '{name} מצא/ה את התאום!',
    miss: 'לא תאומים — זכרו מי מסתתר איפה',
    pairs: 'זוגות: {n}/{total}',
    doneTitle: 'כל התאומים נמצאו!',
    doneText: 'מצאתם {total} זוגות. הזיכרון שלכם עבד קשה!',
    again: 'לסדר מחדש',
    harder: 'יותר קופסאות',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'כשהילד פותח קופסה, אמרו בקול משפט מקום: "הפנדה בקופסה הכחולה, ליד העץ". ככה הוא שומע איך מחזיקים מידע בראש — ומתחיל לעשות את זה בעצמו.',
    whyLabel: 'למה זה עוזר',
    why: 'משחקי זיכרון מאמנים זיכרון עבודה — להחזיק מידע בראש ולהשתמש בו. זיכרון עבודה בגיל הגן קשור ליכולות בחשבון ובקריאה בהמשך. ההליכה בין הקופסאות מאריכה את הזמן שצריך לזכור, כמו בחיים.',
  },
  en: {
    title: 'Surprise Boxes',
    subtitle: 'An animal waits in every box. Stand in front of a box to open it — find two that match.',
    intro: 'Every box hides an animal, and every animal has a twin. Stand in front of a box to open it.',
    back: 'All games',
    start: "Let's open!",
    first: 'Stand on the circle in front of a box to open it',
    second: "Now a second box — where is {name}'s twin?",
    found: '{name} found its twin!',
    miss: 'Not twins — remember who hides where',
    pairs: 'Pairs: {n}/{total}',
    doneTitle: 'Every twin is found!',
    doneText: 'You found {total} pairs. Your memory worked hard!',
    again: 'Shuffle again',
    harder: 'More boxes',
    parentTipLabel: 'Tip for parents',
    parentTip:
      'When your child opens a box, say where it is out loud: "the panda is in the blue box, by the tree". They hear how to hold information in mind — and start doing it themselves.',
    whyLabel: 'Why it helps',
    why: 'Memory games train working memory — holding information in mind and using it. Working memory in preschool is linked to later maths and reading. Walking between boxes stretches how long you must remember, like real life.',
  },
};

export const META = {
  he: { title: 'קופסאות ההפתעה | משחק זיכרון תלת-ממדי | StoryLeap', description: 'משחק זיכרון תלת-ממדי לילדים בגילאי 3–11: פותחים קופסאות ומוצאים חיות תאומות.' },
  en: { title: 'Surprise Boxes | 3D Memory Game | StoryLeap', description: 'A 3D memory game for ages 3–11: open gift boxes and find the twin animals.' },
};
