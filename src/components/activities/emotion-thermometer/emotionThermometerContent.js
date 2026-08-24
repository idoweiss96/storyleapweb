// Content for the Emotion Thermometer activity.
//
// Authored once, read at runtime, never generated.
//
// The point of this tool is NOT the slider — a slider on its own is just a
// slider. The value is in the bands: each level range says what that intensity
// tends to look like, and what tends to help at that intensity. That is what
// turns a number into something a child and parent can act on.
//
// Band copy is deliberately written to hold for any of the feelings below, so a
// child measuring worry and a child measuring anger both get something true.

export const FEELINGS = [
  {
    id: 'anger',
    emoji: '😠',
    he: { label: 'כעס' },
    en: { label: 'Anger' },
  },
  {
    id: 'worry',
    emoji: '😟',
    he: { label: 'דאגה' },
    en: { label: 'Worry' },
  },
  {
    id: 'sad',
    emoji: '😢',
    he: { label: 'עצב' },
    en: { label: 'Sadness' },
  },
  {
    id: 'frustration',
    emoji: '😤',
    he: { label: 'תסכול' },
    en: { label: 'Frustration' },
  },
  {
    id: 'excitement',
    emoji: '🤩',
    he: { label: 'התרגשות' },
    en: { label: 'Excitement' },
  },
];

// Five bands over levels 1–10. `max` is the highest level in the band.
export const BANDS = [
  {
    id: 'calm',
    max: 2,
    color: '#6FD0C4',
    he: {
      label: 'כמעט רגוע',
      looks: 'הרגש שם, אבל קטן. אפשר לחשוב על דברים אחרים בלי בעיה.',
      helps: 'זה הזמן הכי טוב לדבר על מה שקרה, כי הכול עוד ברור.',
    },
    en: {
      label: 'Almost calm',
      looks: 'The feeling is there, but small. You can still think about other things easily.',
      helps: 'This is the best time to talk about what happened, while everything is still clear.',
    },
  },
  {
    id: 'noticeable',
    max: 4,
    color: '#7DCE82',
    he: {
      label: 'מרגישים אותו',
      looks: 'הרגש מורגש, אבל עדיין אפשר להמשיך במה שעושים.',
      helps: 'אפשר להמשיך — ופשוט לשים לב אם זה מתחיל לעלות.',
    },
    en: {
      label: 'Noticeable',
      looks: 'You can feel it, but you can still carry on with what you are doing.',
      helps: 'Carry on — just keep an eye out for whether it starts climbing.',
    },
  },
  {
    id: 'middle',
    max: 6,
    color: '#FFC94D',
    he: {
      label: 'באמצע',
      looks: 'הרגש תופס הרבה מקום. קשה יותר להתרכז, והגוף מתחיל להרגיש אותו.',
      helps: 'שווה לעצור לרגע ולנשום, לפני שזה עולה עוד.',
    },
    en: {
      label: 'In the middle',
      looks: 'The feeling takes up a lot of room. Focusing is harder, and your body starts to feel it.',
      helps: 'Worth stopping for a moment and breathing, before it climbs further.',
    },
  },
  {
    id: 'strong',
    max: 8,
    color: '#FF8A6B',
    he: {
      label: 'חזק',
      looks: 'הרגש ממלא כמעט הכול. קשה לחשוב על דברים אחרים, והגוף מרגיש את זה חזק.',
      helps: 'כדאי לקחת הפסקה ולעשות משהו שמרגיע, לפני שמנסים לפתור משהו.',
    },
    en: {
      label: 'Strong',
      looks: 'The feeling fills almost everything. Other thoughts are hard, and your body feels it strongly.',
      helps: 'Take a break and do something calming, before trying to solve anything.',
    },
  },
  {
    id: 'peak',
    max: 10,
    color: '#E85A5A',
    he: {
      label: 'הכי חזק שיש',
      looks: 'הרגש לוקח את כל המקום. בשלב הזה קשה מאוד להקשיב או להסביר.',
      helps: 'עכשיו זה לא הזמן לדבר על מה שקרה. קודם להירגע — ורק אחר כך לדבר.',
    },
    en: {
      label: 'As strong as it gets',
      looks: 'The feeling takes all the room. At this point listening or explaining is very hard.',
      helps: 'This is not the moment to talk about what happened. Calm first, talk after.',
    },
  },
];

export function bandFor(level) {
  return BANDS.find((band) => level <= band.max) || BANDS[BANDS.length - 1];
}

export const UI = {
  he: {
    title: 'מד החום של הרגשות',
    subtitle: 'בוחרים רגש, ומסמנים כמה הוא חזק עכשיו. אין מספר נכון.',
    pickTitle: 'איזה רגש נמדוד?',
    scaleTitle: 'כמה חזק ה{feeling} עכשיו?',
    scaleHint: 'לוחצים על הגובה שמרגיש נכון',
    looksLabel: 'ככה זה בדרך כלל נראה',
    helpsLabel: 'מה יכול לעזור עכשיו',
    levelWord: 'רמה',
    changeFeeling: 'למדוד רגש אחר',
    print: 'להדפיס',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הכי שימושי להכיר את מד החום ברגע רגוע. ילד שכבר יודע איך הוא נראה יכול להצביע על מספר בזמן אמת — וזה הרבה יותר קל מלמצוא מילים כשקשה.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'The Feelings Thermometer',
    subtitle: 'Pick a feeling and mark how strong it is right now. There is no right number.',
    pickTitle: 'Which feeling shall we measure?',
    scaleTitle: 'How strong is the {feeling} right now?',
    scaleHint: 'Tap the height that feels right',
    looksLabel: 'What this usually looks like',
    helpsLabel: 'What can help right now',
    levelWord: 'Level',
    changeFeeling: 'Measure another feeling',
    print: 'Print',
    parentTipLabel: 'Tip for parents',
    parentTip: 'The thermometer is most useful when you meet it in a calm moment. A child who already knows what it looks like can point to a number in real time — much easier than finding words when things are hard.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'מד חום רגשי לילדים | פעילות חינמית | StoryLeap',
    description: 'כלי חינמי שעוזר לילדים לסמן כמה חזק הרגש שלהם עכשיו, ומה יכול לעזור בכל עוצמה. ללא הרשמה.',
  },
  en: {
    title: 'Feelings Thermometer for Kids | Free Activity | StoryLeap',
    description: 'A free tool that helps children mark how strong their feeling is right now, and what can help at each intensity. No signup.',
  },
};
