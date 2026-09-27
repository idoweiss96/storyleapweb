// Echo — "הקונצרט". Repeat a growing tune by running to the musicians in the
// same order: sequential working memory. Adaptive by design — two slips at
// the same length shorten the tune by one, so the child plays at the edge of
// what they can hold. Running between musicians adds the delay that makes
// rehearsal ("frog, bear, frog…") worth doing.

export const SINGERS = [
  { id: 'frog', species: 'frog', color: 0x8fdb9c, note: 392.0, he: 'צפרדע', en: 'Frog' },
  { id: 'bunny', species: 'bunny', color: 0xffb3d6, note: 523.25, he: 'ארנבת', en: 'Bunny' },
  { id: 'bear', species: 'bear', color: 0xffd98a, note: 659.25, he: 'דובי', en: 'Bear' },
  { id: 'penguin', species: 'penguin', color: 0x9fddf5, note: 783.99, he: 'פינגווין', en: 'Penguin' },
];

export const LEVELS = [
  { id: 'a', singers: 3, start: 2, gap: 0.8, goal: 5, he: '3 נגנים', en: '3 musicians', ages: '4–5' },
  { id: 'b', singers: 4, start: 2, gap: 0.68, goal: 6, he: '4 נגנים', en: '4 musicians', ages: '6–8' },
  { id: 'c', singers: 4, start: 3, gap: 0.5, goal: 8, he: 'מהיר', en: 'Fast', ages: '9–11' },
];

export const MAX_TUNES = 12;

export const UI = {
  he: {
    title: 'הקונצרט',
    subtitle: 'הנגנים מנגנים מנגינה קצרה. מקשיבים, ואז רצים אליהם באותו סדר. המנגינה גדלה בכל פעם.',
    intro: 'הנגנים צריכים מנצח/ת! הקשיבו למנגינה, ואז רוצו אל הנגנים באותו סדר שבו ניגנו.',
    back: 'לכל המשחקים',
    start: 'להתחיל קונצרט!',
    listen: 'הקשיבו והסתכלו טוב…',
    yourTurn: 'תורכם! רוצו אל הנגנים באותו סדר',
    good: 'יפה! עכשיו המנגינה ארוכה יותר',
    oops: 'אופס — נקשיב שוב',
    shorter: 'ננגן מנגינה קצרה יותר, ואז נגדל שוב',
    length: 'אורך: {n}',
    best: 'שיא: {n}',
    doneTitle: 'איזה קונצרט!',
    doneText: 'המנגינה הכי ארוכה שזכרתם: {n} צלילים.',
    again: 'עוד קונצרט',
    harder: 'לרמה הבאה',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'אם זה קשה, עודדו את הילד לומר את שמות הנגנים בקול בזמן שהוא מקשיב ("צפרדע, דובי"). חזרה בקול היא האסטרטגיה הטבעית להחזקת רצף בזיכרון.',
    whyLabel: 'למה זה עוזר',
    why: 'חזרה על רצף שגדל היא התרגיל הקלאסי לזיכרון עבודה רציף, כמו משימות טווח הזיכרון שבמבחנים. התאמת האורך ליכולת הילד — להאריך אחרי הצלחה ולקצר אחרי קושי — היא העיקרון של אימוני זיכרון עבודה מסתגלים.',
  },
  en: {
    title: 'The Concert',
    subtitle: 'The musicians play a short tune. Listen, then run to them in the same order. The tune grows each time.',
    intro: 'The musicians need a conductor! Listen to the tune, then run to the musicians in the order they played.',
    back: 'All games',
    start: 'Start the concert!',
    listen: 'Listen and watch closely…',
    yourTurn: 'Your turn! Run to the musicians in the same order',
    good: 'Lovely! Now the tune is longer',
    oops: "Oops — let's listen again",
    shorter: "Let's play a shorter tune, then grow it again",
    length: 'Length: {n}',
    best: 'Best: {n}',
    doneTitle: 'What a concert!',
    doneText: 'The longest tune you remembered: {n} notes.',
    again: 'Another concert',
    harder: 'Next level',
    parentTipLabel: 'Tip for parents',
    parentTip:
      'If it gets hard, encourage your child to say the musicians\' names out loud while listening ("frog, bear"). Rehearsing out loud is the natural strategy for holding a sequence in mind.',
    whyLabel: 'Why it helps',
    why: 'Repeating a growing sequence is the classic exercise for sequential working memory, like the span tasks used in assessments. Matching the length to the child — longer after success, shorter after a struggle — is the principle behind adaptive working-memory training.',
  },
};

export const META = {
  he: { title: 'הקונצרט | משחק זיכרון רצפים תלת-ממדי | StoryLeap', description: 'רצים אל הנגנים באותו סדר שבו ניגנו — משחק זיכרון עבודה מסתגל בתלת-ממד לגילאי 4–11.' },
  en: { title: 'The Concert | 3D Sequence Memory Game | StoryLeap', description: 'Run to the musicians in the order they played — an adaptive 3D working-memory game for ages 4–11.' },
};
