// Content for the Visual ADL Sequence activity.
//
// Authored once, read at runtime, never generated.
//
// HOW THIS DIFFERS FROM "פירוק משימה" (Task Analysis).
// Task Analysis is a BUILDER — you break down whatever is hard in your house.
// This one is a READY-MADE LIBRARY: six self-care sequences already written,
// step by step, so a parent who just needs a hand-washing strip for the bathroom
// wall does not have to sit down and author one.
//
// Same engine, opposite ends of the effort scale. The map rates this one
// "מוצר B2C שימושי במיוחד" precisely because it asks nothing of the parent.

export const SEQUENCES = [
  {
    id: 'handwash',
    emoji: '🧼',
    he: {
      label: 'לשטוף ידיים',
      steps: [
        { emoji: '💧', text: 'לפתוח את הברז' },
        { emoji: '🤲', text: 'להרטיב את הידיים' },
        { emoji: '🧼', text: 'לשים סבון' },
        { emoji: '🔄', text: 'לשפשף — גם בין האצבעות' },
        { emoji: '🎵', text: 'לספור עד 20 או לשיר' },
        { emoji: '🚿', text: 'לשטוף את הסבון' },
        { emoji: '🧻', text: 'לנגב טוב' },
      ],
    },
    en: {
      label: 'Washing hands',
      steps: [
        { emoji: '💧', text: 'Turn on the tap' },
        { emoji: '🤲', text: 'Wet your hands' },
        { emoji: '🧼', text: 'Put on soap' },
        { emoji: '🔄', text: 'Rub — between the fingers too' },
        { emoji: '🎵', text: 'Count to 20 or sing' },
        { emoji: '🚿', text: 'Rinse the soap off' },
        { emoji: '🧻', text: 'Dry them well' },
      ],
    },
  },
  {
    id: 'teeth',
    emoji: '🪥',
    he: {
      label: 'לצחצח שיניים',
      steps: [
        { emoji: '🪥', text: 'לקחת את המברשת' },
        { emoji: '💧', text: 'להרטיב אותה' },
        { emoji: '🧴', text: 'לשים קצת משחה' },
        { emoji: '⬆️', text: 'לצחצח למעלה' },
        { emoji: '⬇️', text: 'לצחצח למטה' },
        { emoji: '😁', text: 'לצחצח גם מאחורה' },
        { emoji: '🥤', text: 'לשטוף את הפה' },
        { emoji: '✨', text: 'לשטוף את המברשת ולהחזיר' },
      ],
    },
    en: {
      label: 'Brushing teeth',
      steps: [
        { emoji: '🪥', text: 'Get the toothbrush' },
        { emoji: '💧', text: 'Wet it' },
        { emoji: '🧴', text: 'Put on a little paste' },
        { emoji: '⬆️', text: 'Brush the top' },
        { emoji: '⬇️', text: 'Brush the bottom' },
        { emoji: '😁', text: 'Brush the back too' },
        { emoji: '🥤', text: 'Rinse your mouth' },
        { emoji: '✨', text: 'Rinse the brush and put it back' },
      ],
    },
  },
  {
    id: 'toilet',
    emoji: '🚽',
    he: {
      label: 'ללכת לשירותים',
      steps: [
        { emoji: '🚪', text: 'להיכנס ולסגור את הדלת' },
        { emoji: '👖', text: 'להוריד את המכנסיים' },
        { emoji: '🚽', text: 'לשבת' },
        { emoji: '🧻', text: 'לנגב' },
        { emoji: '👕', text: 'להרים את המכנסיים' },
        { emoji: '🌊', text: 'להוריד את המים' },
        { emoji: '🧼', text: 'לשטוף ידיים' },
      ],
    },
    en: {
      label: 'Going to the toilet',
      steps: [
        { emoji: '🚪', text: 'Go in and close the door' },
        { emoji: '👖', text: 'Pull your trousers down' },
        { emoji: '🚽', text: 'Sit down' },
        { emoji: '🧻', text: 'Wipe' },
        { emoji: '👕', text: 'Pull your trousers up' },
        { emoji: '🌊', text: 'Flush' },
        { emoji: '🧼', text: 'Wash your hands' },
      ],
    },
  },
  {
    id: 'dressing',
    emoji: '👕',
    he: {
      label: 'להתלבש',
      steps: [
        { emoji: '👚', text: 'להוציא את הבגדים' },
        { emoji: '🩲', text: 'תחתונים' },
        { emoji: '👕', text: 'חולצה' },
        { emoji: '👖', text: 'מכנסיים' },
        { emoji: '🧦', text: 'גרביים' },
        { emoji: '👟', text: 'נעליים' },
        { emoji: '🧺', text: 'לשים את הפיג׳מה במקום' },
      ],
    },
    en: {
      label: 'Getting dressed',
      steps: [
        { emoji: '👚', text: 'Get the clothes out' },
        { emoji: '🩲', text: 'Underwear' },
        { emoji: '👕', text: 'Top' },
        { emoji: '👖', text: 'Trousers' },
        { emoji: '🧦', text: 'Socks' },
        { emoji: '👟', text: 'Shoes' },
        { emoji: '🧺', text: 'Put the pyjamas away' },
      ],
    },
  },
  {
    id: 'shower',
    emoji: '🚿',
    he: {
      label: 'להתקלח',
      steps: [
        { emoji: '🧺', text: 'להוריד בגדים לסל' },
        { emoji: '🌡️', text: 'לבדוק שהמים נעימים' },
        { emoji: '💦', text: 'להירטב' },
        { emoji: '🧴', text: 'סבון על הגוף' },
        { emoji: '🧴', text: 'שמפו על הראש' },
        { emoji: '🚿', text: 'לשטוף הכול' },
        { emoji: '🧻', text: 'להתנגב' },
        { emoji: '🩳', text: 'ללבוש פיג׳מה' },
      ],
    },
    en: {
      label: 'Taking a shower',
      steps: [
        { emoji: '🧺', text: 'Clothes into the basket' },
        { emoji: '🌡️', text: 'Check the water feels nice' },
        { emoji: '💦', text: 'Get wet' },
        { emoji: '🧴', text: 'Soap on your body' },
        { emoji: '🧴', text: 'Shampoo on your hair' },
        { emoji: '🚿', text: 'Rinse it all off' },
        { emoji: '🧻', text: 'Dry yourself' },
        { emoji: '🩳', text: 'Put on pyjamas' },
      ],
    },
  },
  {
    id: 'table',
    emoji: '🍽️',
    he: {
      label: 'לסדר אחרי האוכל',
      steps: [
        { emoji: '🍽️', text: 'לקחת את הצלחת' },
        { emoji: '🗑️', text: 'לזרוק שאריות' },
        { emoji: '🚰', text: 'לשים בכיור' },
        { emoji: '🧽', text: 'לנגב את המקום' },
        { emoji: '🪑', text: 'להחזיר את הכיסא' },
      ],
    },
    en: {
      label: 'Clearing up after eating',
      steps: [
        { emoji: '🍽️', text: 'Take your plate' },
        { emoji: '🗑️', text: 'Scrape the leftovers' },
        { emoji: '🚰', text: 'Put it in the sink' },
        { emoji: '🧽', text: 'Wipe your place' },
        { emoji: '🪑', text: 'Push the chair back in' },
      ],
    },
  },
];

export const UI = {
  he: {
    title: 'רצף בתמונות',
    subtitle: 'רצפים מוכנים לפעולות היומיום — בוחרים אחד, מדפיסים, ותולים במקום שבו הוא קורה.',
    pickTitle: 'איזה רצף צריך?',
    stepsTitle: 'הרצף',
    changeSequence: 'לבחור רצף אחר',
    print: 'להדפיס את הרצף',
    printHint: 'שווה לתלות את הדף בדיוק במקום שבו הפעולה קורה — ליד הכיור, על דלת השירותים.',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הרצף לא נועד להיקרא אלא להיות מוצבע. במקום להגיד "שכחת לנגב", אפשר להצביע על השלב — וזה מוריד את התחושה של נזיפה, ומשאיר את הילד/ה עצמאי/ת.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Picture Sequence',
    subtitle: 'Ready-made sequences for everyday actions — pick one, print it, and hang it where it happens.',
    pickTitle: 'Which sequence do you need?',
    stepsTitle: 'The sequence',
    changeSequence: 'Pick another sequence',
    print: 'Print the sequence',
    printHint: 'Hang the sheet exactly where the action happens — by the sink, on the bathroom door.',
    parentTipLabel: 'Tip for parents',
    parentTip: 'The sequence is not meant to be read, it is meant to be pointed at. Instead of "you forgot to dry them", point at the step — it takes the telling-off out of it and leaves your child independent.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'רצף חזותי לילדים | לוחות שגרה להדפסה | StoryLeap',
    description: 'רצפים מצוירים מוכנים לשטיפת ידיים, צחצוח שיניים, התלבשות ועוד. להדפסה ולתלייה, חינם וללא הרשמה.',
  },
  en: {
    title: 'Visual Sequences for Kids | Printable Routine Strips | StoryLeap',
    description: 'Ready-made picture sequences for hand washing, brushing teeth, getting dressed and more. Print and hang, free, no signup.',
  },
};
