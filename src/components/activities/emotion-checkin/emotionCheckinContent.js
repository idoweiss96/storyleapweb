// Content for the Emotion Check-in activity.
//
// Authored once, read at runtime, never generated.
//
// THE PROBLEM THIS DESIGN SOLVES.
// A daily emotional check-in is only worth anything if it accumulates — the map
// notes its value as "entry point יומי". But these activities deliberately store
// nothing, so an on-screen daily check-in would forget every refresh: a check-in
// that does not remember is not a check-in.
//
// So the tool does not try to be the check-in. It BUILDS the check-in: a weekly
// chart the family prints once and fills in by hand, day by day. The
// accumulation happens on paper, on the fridge, where it is actually looked at —
// and nothing about a child's week is ever stored on a server.

export const EMOTIONS = [
  { id: 'happy', emoji: '😄', color: '#FFC94D', he: 'שמח/ה', en: 'Happy' },
  { id: 'calm', emoji: '😌', color: '#6FD0C4', he: 'רגוע/ה', en: 'Calm' },
  { id: 'excited', emoji: '🤩', color: '#FF6FB5', he: 'נרגש/ת', en: 'Excited' },
  { id: 'proud', emoji: '🦁', color: '#7DCE82', he: 'גאה', en: 'Proud' },
  { id: 'tired', emoji: '🥱', color: '#B0B7C9', he: 'עייף/ה', en: 'Tired' },
  { id: 'sad', emoji: '😢', color: '#7BA7D9', he: 'עצוב/ה', en: 'Sad' },
  { id: 'angry', emoji: '😠', color: '#FF8A6B', he: 'כועס/ת', en: 'Angry' },
  { id: 'worried', emoji: '😟', color: '#9FB3DE', he: 'דואג/ת', en: 'Worried' },
  { id: 'scared', emoji: '😨', color: '#9B8FD8', he: 'מפחד/ת', en: 'Scared' },
  { id: 'lonely', emoji: '🥺', color: '#8FB8D9', he: 'בודד/ה', en: 'Lonely' },
];

export const DAYS = {
  he: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export const MAX_EMOTIONS = 6;
export const MIN_EMOTIONS = 2;

export const UI = {
  he: {
    title: 'הצ׳ק-אין השבועי',
    subtitle: 'בונים לוח צ׳ק-אין אישי, מדפיסים, ומסמנים בו כל יום איך היה. שבוע שלם על דף אחד.',
    pickTitle: 'אילו רגשות ייכנסו ללוח?',
    nameLabel: 'שם הילד/ה (לא חובה)',
    namePlaceholder: 'למשל: יובל',
    chartTitleWith: 'השבוע של {name}',
    chartTitle: 'השבוע שלי',
    dayCol: 'יום',
    notesCol: 'משהו שקרה היום',
    countNone: 'עדיין לא בחרת רגשות',
    countOne: 'רגש אחד בלוח',
    countMany: '{n} רגשות בלוח',
    needMore: 'בחרו לפחות שני רגשות כדי לבנות את הלוח.',
    limitReached: 'שישה רגשות זה המקסימום — יותר מזה והלוח כבר לא נכנס לדף ברוחב קריא.',
    print: 'להדפיס את הלוח',
    clear: 'לנקות',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הכוח הוא בשבוע השלם, לא ביום הבודד. אחרי שבוע רואים דפוס — שהימים הקשים הם דווקא ראשון, או שאחרי החוג תמיד עייפים — וזה מידע ששום שיחה אחת לא הייתה נותנת.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'The Weekly Check-in',
    subtitle: 'Build a personal check-in chart, print it, and mark each day how it went. A whole week on one page.',
    pickTitle: 'Which feelings go on the chart?',
    nameLabel: "Child's name (optional)",
    namePlaceholder: 'For example: Yuval',
    chartTitleWith: "{name}'s week",
    chartTitle: 'My week',
    dayCol: 'Day',
    notesCol: 'Something that happened today',
    countNone: 'No feelings chosen yet',
    countOne: 'One feeling on the chart',
    countMany: '{n} feelings on the chart',
    needMore: 'Pick at least two feelings to build the chart.',
    limitReached: 'Six feelings is the maximum — beyond that the chart no longer fits the page at a readable width.',
    print: 'Print the chart',
    clear: 'Clear',
    parentTipLabel: 'Tip for parents',
    parentTip: 'The power is in the whole week, not the single day. After a week you see a pattern — that the hard days are actually Sundays, or that after the activity club everyone is tired — and that is information no single conversation would have given you.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'לוח צ׳ק-אין רגשי שבועי לילדים | חינם להדפסה | StoryLeap',
    description: 'בונים לוח צ׳ק-אין רגשי שבועי מותאם לילד, מדפיסים ותולים. מסמנים כל יום איך היה ורואים דפוס אחרי שבוע. ללא הרשמה.',
  },
  en: {
    title: 'Weekly Emotional Check-in Chart for Kids | Free Printable | StoryLeap',
    description: 'Build a custom weekly emotional check-in chart, print it and hang it up. Mark each day and see the pattern after a week. No signup.',
  },
};
