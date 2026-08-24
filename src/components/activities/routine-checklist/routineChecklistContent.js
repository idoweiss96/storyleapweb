// UI strings for the Routine Checklist activity.
// The step library lives in `../shared/routineSteps.js`, shared with the routine
// board and First–Then.
//
// HOW THIS DIFFERS FROM THE ROUTINE BOARD.
// The routine board is a DISPLAY — a picture of the day, hung up to be looked at.
// This is a TICK SHEET — one named routine with boxes to mark off, designed to be
// laminated or reprinted and used again tomorrow.
//
// The week mode is what makes that real: seven columns on one page means a single
// print lasts a week, which is the difference between a tool that gets used and
// one that gets printed once.

export const DAYS = {
  he: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

export const PRESETS = [
  { id: 'morning', emoji: '☀️', he: 'הבוקר שלי', en: 'My morning' },
  { id: 'evening', emoji: '🌙', he: 'הערב שלי', en: 'My evening' },
  { id: 'school', emoji: '🎒', he: 'לפני בית הספר', en: 'Before school' },
  { id: 'homework', emoji: '📚', he: 'שיעורי בית', en: 'Homework' },
];

export const UI = {
  he: {
    title: 'צ׳ק-ליסט שגרה',
    subtitle: 'רשימה אחת עם משבצות לסימון. מדפיסים פעם אחת ומשתמשים שוב ושוב.',
    nameLabel: 'איך נקרא לרשימה?',
    namePlaceholder: 'למשל: הבוקר שלי',
    presetsLabel: 'או להתחיל מאחת מאלה',
    modeLabel: 'לכמה זמן להדפיס?',
    modeDay: 'יום אחד',
    modeWeek: 'שבוע שלם',
    modeHint: 'שבוע שלם נותן שבע משבצות לכל שלב — דף אחד מספיק לשבוע.',
    listTitle: 'השלבים ברשימה',
    empty: 'עדיין אין שלבים. בחרו מהספרייה למטה או הוסיפו משלכם.',
    libraryTitle: 'מה נוסיף לרשימה?',
    customLabel: 'שלב משלי',
    customPlaceholder: 'למשל: לתת אוכל לחתול',
    customAdd: 'להוסיף',
    remove: 'להוריד מהרשימה',
    moveUp: 'להזיז למעלה',
    moveDown: 'להזיז למטה',
    stepCount: '{n} שלבים',
    stepCountOne: 'שלב אחד',
    clear: 'לנקות',
    clearConfirm: 'לנקות את כל הרשימה?',
    print: 'להדפיס',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'שווה למלמן את הדף או לשים אותו בניילון, ולתת טוש מחיק. הפעולה של לסמן ✓ בעצמו היא חצי מהערך — היא מה שהופך את הרשימה משלכם לשלו.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Routine Checklist',
    subtitle: 'One list with boxes to tick. Print it once and use it again and again.',
    nameLabel: 'What shall we call the list?',
    namePlaceholder: 'For example: My morning',
    presetsLabel: 'Or start from one of these',
    modeLabel: 'How long should it cover?',
    modeDay: 'One day',
    modeWeek: 'A whole week',
    modeHint: 'A whole week gives seven boxes per step — one page lasts the week.',
    listTitle: 'The steps on the list',
    empty: 'No steps yet. Pick from the library below or add your own.',
    libraryTitle: 'What shall we add?',
    customLabel: 'My own step',
    customPlaceholder: 'For example: feed the cat',
    customAdd: 'Add',
    remove: 'Remove from list',
    moveUp: 'Move up',
    moveDown: 'Move down',
    stepCount: '{n} steps',
    stepCountOne: 'One step',
    clear: 'Clear',
    clearConfirm: 'Clear the whole list?',
    print: 'Print',
    parentTipLabel: 'Tip for parents',
    parentTip: 'Laminate the sheet or slip it into a plastic sleeve, and hand over a wipeable pen. The act of ticking it off themselves is half the value — it is what turns your list into their list.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'צ׳ק-ליסט שגרה לילדים | להדפסה חינם | StoryLeap',
    description: 'בונים רשימת שגרה עם משבצות סימון לילדים — בוקר, ערב או שיעורי בית. גרסת יום או שבוע שלם, להדפסה. ללא הרשמה.',
  },
  en: {
    title: 'Routine Checklist for Kids | Free Printable | StoryLeap',
    description: 'Build a tick-box routine checklist for children — morning, evening or homework. Day or full-week version, printable. No signup.',
  },
};
