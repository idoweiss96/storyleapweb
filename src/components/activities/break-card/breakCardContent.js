// Content for the Break Card activity.
//
// Authored once, read at runtime, never generated.
//
// A break card is something a child hands over or points to instead of having to
// explain themselves out loud — at the exact moment when explaining is hardest.
// Everything here is phrased in the child's own voice for that reason.

export const PHRASES = [
  {
    id: 'break',
    emoji: '✋',
    color: '#FF8A6B',
    he: 'אני צריך/ה הפסקה',
    en: 'I need a break',
  },
  {
    id: 'moment',
    emoji: '⏸️',
    color: '#FFC94D',
    he: 'אני צריך/ה רגע',
    en: 'I need a moment',
  },
  {
    id: 'leave',
    emoji: '🚪',
    color: '#4FC3E8',
    he: 'אני צריך/ה לצאת רגע',
    en: 'I need to step out',
  },
  {
    id: 'quiet',
    emoji: '🤫',
    color: '#9B8FD8',
    he: 'אני צריך/ה שקט',
    en: 'I need quiet',
  },
];

export const ACTIONS = [
  { id: 'water', emoji: '💧', he: 'לשתות מים', en: 'Get a drink of water' },
  { id: 'corridor', emoji: '🚶', he: 'לצאת למסדרון', en: 'Step into the corridor' },
  { id: 'corner', emoji: '🪑', he: 'לשבת בפינה', en: 'Sit in the corner' },
  { id: 'breathe', emoji: '🎈', he: 'לנשום עמוק', en: 'Take deep breaths' },
  { id: 'toilet', emoji: '🚽', he: 'ללכת לשירותים', en: 'Go to the toilet' },
  { id: 'adult', emoji: '🧑', he: 'לשבת ליד מבוגר', en: 'Sit near a grown-up' },
  { id: 'stretch', emoji: '🤸', he: 'למתוח את הגוף', en: 'Stretch my body' },
  { id: 'object', emoji: '🧸', he: 'להחזיק משהו מרגיע', en: 'Hold something calming' },
];

export const CUSTOM_EMOJI = '⭐';

export const UI = {
  he: {
    title: 'כרטיס ההפסקה שלי',
    subtitle: 'כרטיס קטן שאפשר להראות במקום להסביר. בוחרים מה כתוב עליו ומה עושים בהפסקה, ומדפיסים.',
    step1: 'מה כתוב על הכרטיס?',
    step2: 'ומה עושים בהפסקה?',
    breakIs: 'בהפסקה אני',
    customLabel: 'משהו אחר',
    customPlaceholder: 'למשל: הולך/ת לשתות ליד המזכירות',
    customAdd: 'להוסיף',
    printHint: 'הכרטיס מודפס פעמיים — אחד לתיק ואחד להשאיר בכיתה או בבית.',
    print: 'להדפיס את הכרטיס',
    restart: 'להתחיל מחדש',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הכרטיס עובד רק אם הוא תמיד מכובד. ילד שהראה כרטיס וקיבל "עוד מעט" לומד תוך פעמיים שהוא לא שווה כלום. שווה לתאם מראש עם הגננת או המורה לפני שנותנים אותו לילד.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'My Break Card',
    subtitle: 'A small card to show instead of having to explain. Choose what it says and what happens on the break, then print it.',
    step1: 'What does the card say?',
    step2: 'And what happens on the break?',
    breakIs: 'On my break I',
    customLabel: 'Something else',
    customPlaceholder: 'For example: go for a drink by the office',
    customAdd: 'Add',
    printHint: 'The card prints twice — one for the bag and one to leave in class or at home.',
    print: 'Print my card',
    restart: 'Start over',
    parentTipLabel: 'Tip for parents',
    parentTip: 'The card only works if it is always honoured. A child who shows the card and hears "in a minute" learns within two tries that it means nothing. Agree it with the teacher before giving it to your child.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'כרטיס בקשת הפסקה לילדים | פעילות חינמית | StoryLeap',
    description: 'יוצרים כרטיס הפסקה אישי לילד — כרטיס קטן להראות במקום להסביר, מוכן להדפסה. חינם וללא הרשמה.',
  },
  en: {
    title: 'Break Request Card for Kids | Free Activity | StoryLeap',
    description: 'Create a personal break card for your child — a small card to show instead of explaining, ready to print. Free, no signup.',
  },
};
