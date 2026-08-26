// Content for the Body Map activity.
//
// Authored once, read at runtime, never generated.
//
// NOTHING HERE INTERPRETS THE MAP. A child who marks anger in their hands is not
// told what that means about them. The output is a description the child made
// plus a question about what would help — never an analysis. Reading meaning
// into where a child feels an emotion is professional territory.

export const EMOTIONS = [
  { id: 'anger', emoji: '😠', color: '#FF8A6B', he: 'כעס', en: 'Anger' },
  { id: 'fear', emoji: '😨', color: '#9B8FD8', he: 'פחד', en: 'Fear' },
  { id: 'worry', emoji: '😟', color: '#7BA7D9', he: 'דאגה', en: 'Worry' },
  { id: 'sad', emoji: '😢', color: '#7FC5C0', he: 'עצב', en: 'Sadness' },
  { id: 'joy', emoji: '😄', color: '#FFC94D', he: 'שמחה', en: 'Joy' },
  { id: 'excited', emoji: '🤩', color: '#FF6FB5', he: 'התרגשות', en: 'Excitement' },
];

// Order matters only for the printed summary reading head-to-toe.
export const REGIONS = [
  { id: 'head', he: 'בראש', en: 'in my head' },
  { id: 'throat', he: 'בגרון', en: 'in my throat' },
  { id: 'chest', he: 'בחזה', en: 'in my chest' },
  { id: 'tummy', he: 'בבטן', en: 'in my tummy' },
  { id: 'arms', he: 'בידיים', en: 'in my arms' },
  { id: 'hands', he: 'בכפות הידיים', en: 'in my hands' },
  { id: 'legs', he: 'ברגליים', en: 'in my legs' },
  { id: 'feet', he: 'בכפות הרגליים', en: 'in my feet' },
];

export const UI = {
  he: {
    title: 'מפת הגוף שלי',
    subtitle: 'בוחרים רגש, ומסמנים על הגוף איפה מרגישים אותו. אין מקום נכון.',
    pickTitle: 'איזה רגש נסמן?',
    mapTitle: 'איפה בגוף מרגישים את זה?',
    mapHint: 'אפשר לסמן כמה מקומות. לחיצה נוספת מבטלת.',
    nothingMarked: 'עדיין לא סימנת. לחצו על הגוף במקום שמרגישים בו.',
    summaryPrefix: 'אני מרגיש/ה',
    question: 'מה יכול לעזור לחלק הזה בגוף להירגע?',
    questionLabel: 'שאלה לשיחה',
    answerPlaceholder: 'אפשר לכתוב כאן את התשובה...',
    changeEmotion: 'לסמן רגש אחר',
    clear: 'לנקות את הסימונים',
    print: 'להדפיס את המפה',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'אין משמעות "נכונה" למקום שהילד/ה בחר/ה, ולא כדאי לפרש אותו. הערך הוא בעצם ההבחנה שרגש מורגש בגוף, ילד שיודע לזהות את הכיווץ בבטן לפני ההתפרצות מקבל כמה שניות יקרות.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'My Body Map',
    subtitle: 'Pick a feeling and mark on the body where you feel it. There is no right place.',
    pickTitle: 'Which feeling shall we mark?',
    mapTitle: 'Where in the body do you feel it?',
    mapHint: 'You can mark several places. Tap again to unmark.',
    nothingMarked: 'Nothing marked yet. Tap the body where you feel it.',
    summaryPrefix: 'I feel',
    question: 'What could help that part of your body settle down?',
    questionLabel: 'A question to talk about',
    answerPlaceholder: 'You can write your answer here...',
    changeEmotion: 'Mark another feeling',
    clear: 'Clear the marks',
    print: 'Print my map',
    parentTipLabel: 'Tip for parents',
    parentTip: 'There is no "correct" meaning to where your child marks, and it is best not to interpret it. The value is in noticing at all that feelings live in the body, a child who recognises the tightening in their tummy before the outburst gains a few precious seconds.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'מפת גוף לילדים | פעילות רגשית חינמית | StoryLeap',
    description: 'פעילות חינמית שעוזרת לילדים לזהות איפה בגוף הם מרגישים רגשות — מסמנים על מפת גוף ומדפיסים. ללא הרשמה.',
  },
  en: {
    title: 'Body Map for Kids | Free Emotional Activity | StoryLeap',
    description: 'A free activity that helps children notice where in the body they feel emotions — mark a body map and print it. No signup.',
  },
};