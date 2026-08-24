// Content for the Safe Place activity.
//
// Authored once, read at runtime, never generated.
//
// HOW THIS DIFFERS FROM "ציור הרגש" (Draw the Feeling).
// Both are on the canvas engine, but Draw the Feeling is a blank page — free
// drawing with no structure. This one is GUIDED: the child answers five short
// questions about a place that feels safe, and the answers assemble into a card
// they can keep. The drawing box on the printed sheet is optional, not the task.
//
// That structure matters. A child asked to "draw a safe place" often freezes;
// a child asked "what can you hear there?" usually has an answer immediately.
//
// The place can be real or imaginary — the prompts never require it to exist.

export const QUESTIONS = [
  {
    id: 'where',
    emoji: '📍',
    he: { label: 'איפה המקום שלי?', placeholder: 'למשל: מתחת לשמיכה, על העץ בחצר, בחדר של סבתא' },
    en: { label: 'Where is my place?', placeholder: 'For example: under the duvet, up the tree in the garden, in grandma’s room' },
    options: {
      he: ['במיטה שלי', 'בחדר שלי', 'בחוץ בטבע', 'אצל סבא וסבתא', 'מקום שהמצאתי'],
      en: ['In my bed', 'In my room', 'Outside in nature', 'At my grandparents', 'A place I made up'],
    },
  },
  {
    id: 'see',
    emoji: '👀',
    he: { label: 'מה רואים שם?', placeholder: 'למשל: אור חלש, הרבה כריות, עצים גבוהים' },
    en: { label: 'What can you see there?', placeholder: 'For example: soft light, lots of pillows, tall trees' },
    options: {
      he: ['אור רך', 'הרבה כריות', 'עצים', 'כוכבים', 'צבעים שאני אוהב/ת'],
      en: ['Soft light', 'Lots of pillows', 'Trees', 'Stars', 'Colours I love'],
    },
  },
  {
    id: 'hear',
    emoji: '👂',
    he: { label: 'מה שומעים שם?', placeholder: 'למשל: שקט, גשם, מוזיקה חלשה' },
    en: { label: 'What can you hear there?', placeholder: 'For example: quiet, rain, soft music' },
    options: {
      he: ['שקט', 'גשם', 'מוזיקה חלשה', 'ציפורים', 'הים'],
      en: ['Quiet', 'Rain', 'Soft music', 'Birds', 'The sea'],
    },
  },
  {
    id: 'who',
    emoji: '🫂',
    he: { label: 'מי איתי שם?', placeholder: 'למשל: אף אחד, הדובי שלי, אמא' },
    en: { label: 'Who is there with me?', placeholder: 'For example: nobody, my teddy, mum' },
    options: {
      he: ['אף אחד, רק אני', 'הדובי שלי', 'מישהו מהמשפחה', 'חיה שאני אוהב/ת', 'חבר/ה טוב/ה'],
      en: ['Nobody, just me', 'My teddy', 'Someone from my family', 'An animal I love', 'A good friend'],
    },
  },
  {
    id: 'feel',
    emoji: '💗',
    he: { label: 'איך אני מרגיש/ה שם?', placeholder: 'למשל: רגוע, חמים, שאף אחד לא ימהר אותי' },
    en: { label: 'How do I feel there?', placeholder: 'For example: calm, warm, like nobody will rush me' },
    options: {
      he: ['רגוע/ה', 'חמים ונעים', 'בטוח/ה', 'שאף אחד לא ממהר אותי', 'שאני יכול/ה להיות עצמי'],
      en: ['Calm', 'Warm and cosy', 'Safe', 'Like nobody is rushing me', 'Like I can be myself'],
    },
  },
];

export const UI = {
  he: {
    title: 'המקום הבטוח שלי',
    subtitle: 'עונים על חמש שאלות קצרות, ומקבלים כרטיס של מקום שאפשר לחזור אליו בדמיון כשקשה.',
    hint: 'המקום יכול להיות אמיתי או מומצא. שני הסוגים עובדים.',
    quickLabel: 'רעיונות מהירים',
    cardTitle: 'המקום הבטוח שלי',
    drawHere: 'כאן אפשר לצייר אותו',
    empty: 'ענו לפחות על שאלה אחת, והכרטיס יתחיל להיבנות.',
    clear: 'להתחיל מחדש',
    clearConfirm: 'למחוק את כל התשובות?',
    print: 'להדפיס את הכרטיס',
    printHint: 'בדף המודפס יש מסגרת ריקה לציור המקום.',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הכי חשוב לבנות את המקום ברגע רגוע, ולתרגל "ללכת" אליו בדמיון כמה פעמים כשהכול בסדר. מקום בטוח שנבנה לראשונה באמצע התקף חרדה כמעט אף פעם לא עובד.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'My Safe Place',
    subtitle: 'Answer five short questions and get a card for a place you can return to in your mind when things are hard.',
    hint: 'The place can be real or made up. Both work.',
    quickLabel: 'Quick ideas',
    cardTitle: 'My safe place',
    drawHere: 'You can draw it here',
    empty: 'Answer at least one question and the card will start to build.',
    clear: 'Start over',
    clearConfirm: 'Delete all the answers?',
    print: 'Print the card',
    printHint: 'The printed sheet has an empty frame for drawing the place.',
    parentTipLabel: 'Tip for parents',
    parentTip: 'Build the place in a calm moment, and practise "going" there in your mind a few times while everything is fine. A safe place invented for the first time in the middle of a panic almost never works.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'המקום הבטוח שלי | פעילות הרגעה חינמית לילדים | StoryLeap',
    description: 'בונים עם הילד/ה מקום בטוח בדמיון — איפה הוא, מה רואים ושומעים שם, ומי נמצא. כרטיס להדפסה עם מקום לציור. ללא הרשמה.',
  },
  en: {
    title: 'My Safe Place | Free Calming Activity for Kids | StoryLeap',
    description: 'Build an imaginary safe place with your child — where it is, what you see and hear there, and who is with you. Printable card with space to draw. No signup.',
  },
};
