// Content for the Emotion Drawing activity.
//
// Authored once, read at runtime, never generated. The drawing itself lives only
// in the browser canvas — nothing is uploaded, stored, or analyzed.
//
// The prompts deliberately ask about form and colour ("is it round or spiky?")
// rather than about meaning. A child drawing anger should not feel they are being
// asked to explain themselves, and nothing here interprets what they drew.

export const EMOTIONS = [
  {
    id: 'anger',
    emoji: '😠',
    he: {
      label: 'כעס',
      prompt: 'באיזה צבע הכעס שלך? הוא עגול או משונן? קטן, או ממלא את כל הדף?',
    },
    en: {
      label: 'Anger',
      prompt: 'What colour is your anger? Is it round or spiky? Small, or does it fill the whole page?',
    },
  },
  {
    id: 'joy',
    emoji: '😄',
    he: {
      label: 'שמחה',
      prompt: 'איך נראית השמחה שלך? היא זזה או עומדת במקום? יש לה צורה אחת או הרבה?',
    },
    en: {
      label: 'Joy',
      prompt: 'What does your joy look like? Does it move or stay still? One shape, or many?',
    },
  },
  {
    id: 'fear',
    emoji: '😨',
    he: {
      label: 'פחד',
      prompt: 'איפה הפחד יושב בדף? הוא בפינה או באמצע? כהה או בהיר?',
    },
    en: {
      label: 'Fear',
      prompt: 'Where does the fear sit on the page? In a corner or in the middle? Dark or light?',
    },
  },
  {
    id: 'sad',
    emoji: '😢',
    he: {
      label: 'עצב',
      prompt: 'איך נראה העצב שלך? הוא כבד או קל? יורד למטה או נשאר במקום?',
    },
    en: {
      label: 'Sadness',
      prompt: 'What does your sadness look like? Heavy or light? Does it sink down or stay put?',
    },
  },
  {
    id: 'calm',
    emoji: '😌',
    he: {
      label: 'רוגע',
      prompt: 'איזה צבע הכי רגוע בעיניך? צייר/י דף שלם של רוגע.',
    },
    en: {
      label: 'Calm',
      prompt: 'Which colour feels calmest to you? Draw a whole page of calm.',
    },
  },
  {
    id: 'excited',
    emoji: '🤩',
    he: {
      label: 'התרגשות',
      prompt: 'התרגשות זזה מהר או לאט? צייר/י איך היא נראית כשהיא בתוך הבטן.',
    },
    en: {
      label: 'Excitement',
      prompt: 'Does excitement move fast or slow? Draw what it looks like inside your tummy.',
    },
  },
];

// Kid-friendly palette. Ordered warm → cool so the row reads as a rainbow.
export const COLORS = [
  '#1a1a2e',
  '#E85A5A',
  '#FF8A6B',
  '#FFC94D',
  '#7DCE82',
  '#6FD0C4',
  '#4FC3E8',
  '#7BA7D9',
  '#9B8FD8',
  '#FF6FB5',
];

export const BRUSHES = [
  { id: 'thin', width: 6 },
  { id: 'medium', width: 16 },
  { id: 'thick', width: 34 },
];

export const UI = {
  he: {
    title: 'ציור הרגש',
    subtitle: 'בוחרים רגש, ומציירים איך הוא נראה. אין דרך נכונה לצייר רגש.',
    pickTitle: 'איזה רגש נצייר?',
    colors: 'צבע',
    brush: 'עובי',
    eraser: 'מחק',
    undo: 'אחורה',
    clear: 'לנקות הכול',
    clearConfirm: 'לנקות את כל הציור?',
    print: 'להדפיס את הציור',
    changeEmotion: 'לצייר רגש אחר',
    drawingOf: 'הציור שלי על',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'לא לשאול "מה ציירת?" אלא "תספר/י לי על הציור". השאלה הראשונה מבקשת הסבר, השנייה מזמינה סיפור — ולפעמים אין מה להסביר בכלל, וזה בסדר.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Draw the Feeling',
    subtitle: 'Pick a feeling and draw what it looks like. There is no right way to draw a feeling.',
    pickTitle: 'Which feeling shall we draw?',
    colors: 'Colour',
    brush: 'Size',
    eraser: 'Eraser',
    undo: 'Undo',
    clear: 'Clear all',
    clearConfirm: 'Clear the whole drawing?',
    print: 'Print my drawing',
    changeEmotion: 'Draw another feeling',
    drawingOf: 'My drawing of',
    parentTipLabel: 'Tip for parents',
    parentTip: 'Do not ask "what did you draw?" — ask "tell me about your drawing". The first asks for an explanation, the second invites a story. And sometimes there is nothing to explain, which is fine.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'ציור הרגש | פעילות חינמית לילדים | StoryLeap',
    description: 'פעילות חינמית שבה ילדים מציירים איך נראה רגש — כעס, שמחה, פחד או עצב. ציור חופשי בדפדפן, אפשר להדפיס. ללא הרשמה.',
  },
  en: {
    title: 'Draw the Feeling | Free Activity for Kids | StoryLeap',
    description: 'A free activity where children draw what a feeling looks like — anger, joy, fear or sadness. Free drawing in the browser, printable. No signup.',
  },
};
