// Content for the Visual Timer activity.
//
// Authored once, read at runtime, never generated.
//
// This is the first activity in the folder with no printable output — the whole
// point is what happens on screen while time passes. It is also the first one
// that runs on a clock rather than on taps.
//
// The map notes "קל לבנייה אך בידול מוגבל לבד" — a timer on its own is a
// commodity. What earns its place here is the framing: it is always attached to
// a named thing ("עוד חמש דקות של משחק"), because a child arguing with a number
// is a different conversation from a child watching a colour disappear.

export const PRESETS = [
  { id: '1', minutes: 1, he: 'דקה', en: '1 min' },
  { id: '2', minutes: 2, he: '2 דקות', en: '2 min' },
  { id: '3', minutes: 3, he: '3 דקות', en: '3 min' },
  { id: '5', minutes: 5, he: '5 דקות', en: '5 min' },
  { id: '10', minutes: 10, he: '10 דקות', en: '10 min' },
  { id: '15', minutes: 15, he: '15 דקות', en: '15 min' },
];

export const LABELS = [
  { id: 'play', emoji: '🧩', he: 'עוד קצת משחק', en: 'A bit more playing' },
  { id: 'screen', emoji: '📺', he: 'זמן מסך', en: 'Screen time' },
  { id: 'tidy', emoji: '🧺', he: 'זמן לסדר', en: 'Tidying time' },
  { id: 'homework', emoji: '📚', he: 'שיעורי בית', en: 'Homework' },
  { id: 'calm', emoji: '🌿', he: 'זמן להירגע', en: 'Calming down' },
  { id: 'wait', emoji: '⏳', he: 'לחכות לתור', en: 'Waiting for my turn' },
];

export const UI = {
  he: {
    title: 'הטיימר החזותי',
    subtitle: 'הזמן נראה במקום להיספר. הצבע נעלם לאט, וכשהוא נגמר — נגמר.',
    labelTitle: 'על מה הטיימר?',
    labelPlaceholder: 'למשל: עוד קצת בפארק',
    timeTitle: 'כמה זמן?',
    start: 'להתחיל',
    pause: 'עצירה',
    resume: 'להמשיך',
    reset: 'לאפס',
    done: 'הזמן נגמר',
    doneNote: 'עכשיו עוברים לדבר הבא.',
    change: 'לשנות את הטיימר',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'להראות את הטיימר לפני שמתחילים, ולא ברגע שצריך להפסיק. ילד שראה את העיגול מתמלא בהתחלה מבין שהסוף נקבע מראש — ולא שההורה החליט לעצור כי נמאס לו.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'The Visual Timer',
    subtitle: 'Time you can see instead of count. The colour disappears slowly, and when it is gone, it is gone.',
    labelTitle: 'What is the timer for?',
    labelPlaceholder: 'For example: a bit longer at the park',
    timeTitle: 'How long?',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    done: 'Time is up',
    doneNote: 'Now we move on to the next thing.',
    change: 'Change the timer',
    parentTipLabel: 'Tip for parents',
    parentTip: 'Show the timer before you start, not at the moment you need to stop. A child who watched the circle fill at the beginning understands the ending was set in advance — not that a parent decided to stop because they had had enough.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'טיימר חזותי לילדים | כלי חינמי | StoryLeap',
    description: 'טיימר חזותי שעוזר לילדים לראות כמה זמן נשאר — במקום לספור דקות. חינמי, ללא הרשמה.',
  },
  en: {
    title: 'Visual Timer for Kids | Free Tool | StoryLeap',
    description: 'A visual timer that helps children see how much time is left instead of counting minutes. Free, no signup.',
  },
};
