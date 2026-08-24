// Content for the Choice Board activity.
//
// Authored once, read at runtime, never generated.
//
// The suggested options are deliberately generic. What a child actually chooses
// between is family-specific — which shirts are in the drawer, which games are
// on the shelf — so the library is a starting point and the free-text field is
// a first-class path, not an afterthought.

export const SITUATIONS = [
  {
    id: 'dress',
    emoji: '👕',
    he: { label: 'מה נלבש?', question: 'מה נלבש היום?' },
    en: { label: 'What to wear', question: 'What shall we wear today?' },
    options: [
      { id: 'tshirt', emoji: '👕', he: 'חולצה קצרה', en: 'Short sleeves' },
      { id: 'longsleeve', emoji: '🧥', he: 'חולצה ארוכה', en: 'Long sleeves' },
      { id: 'trousers', emoji: '👖', he: 'מכנסיים', en: 'Trousers' },
      { id: 'dress', emoji: '👗', he: 'שמלה', en: 'A dress' },
      { id: 'sneakers', emoji: '👟', he: 'נעלי ספורט', en: 'Trainers' },
      { id: 'sandals', emoji: '🩴', he: 'סנדלים', en: 'Sandals' },
      { id: 'hat', emoji: '🧢', he: 'כובע', en: 'A hat' },
      { id: 'warm', emoji: '🧣', he: 'משהו חם', en: 'Something warm' },
    ],
  },
  {
    id: 'eat',
    emoji: '🍽️',
    he: { label: 'מה נאכל?', question: 'מה נאכל?' },
    en: { label: 'What to eat', question: 'What shall we eat?' },
    options: [
      { id: 'sandwich', emoji: '🥪', he: 'לחם עם גבינה', en: 'Bread and cheese' },
      { id: 'cereal', emoji: '🥣', he: 'דגני בוקר', en: 'Cereal' },
      { id: 'egg', emoji: '🍳', he: 'ביצה', en: 'An egg' },
      { id: 'yogurt', emoji: '🥛', he: 'יוגורט', en: 'Yoghurt' },
      { id: 'fruit', emoji: '🍎', he: 'פרי', en: 'Fruit' },
      { id: 'pancake', emoji: '🥞', he: 'פנקייק', en: 'Pancakes' },
      { id: 'rice', emoji: '🍚', he: 'אורז', en: 'Rice' },
      { id: 'pasta', emoji: '🍝', he: 'פסטה', en: 'Pasta' },
    ],
  },
  {
    id: 'play',
    emoji: '🧩',
    he: { label: 'במה נשחק?', question: 'במה נשחק עכשיו?' },
    en: { label: 'What to play', question: 'What shall we play now?' },
    options: [
      { id: 'lego', emoji: '🧱', he: 'לגו', en: 'Lego' },
      { id: 'puzzle', emoji: '🧩', he: 'פאזל', en: 'A puzzle' },
      { id: 'draw', emoji: '🎨', he: 'לצייר', en: 'Drawing' },
      { id: 'ball', emoji: '⚽', he: 'כדור', en: 'Ball' },
      { id: 'boardgame', emoji: '🎲', he: 'משחק קופסה', en: 'A board game' },
      { id: 'dolls', emoji: '🧸', he: 'בובות', en: 'Dolls' },
      { id: 'music', emoji: '🎵', he: 'מוזיקה', en: 'Music' },
      { id: 'build', emoji: '🪀', he: 'לבנות משהו', en: 'Build something' },
    ],
  },
  {
    id: 'now',
    emoji: '⏰',
    he: { label: 'מה נעשה עכשיו?', question: 'מה נעשה עכשיו?' },
    en: { label: 'What to do now', question: 'What shall we do now?' },
    options: [
      { id: 'outside', emoji: '🌳', he: 'לצאת החוצה', en: 'Go outside' },
      { id: 'book', emoji: '📖', he: 'לקרוא ספר', en: 'Read a book' },
      { id: 'draw', emoji: '🎨', he: 'לצייר', en: 'Draw' },
      { id: 'play', emoji: '🧩', he: 'לשחק', en: 'Play' },
      { id: 'rest', emoji: '🛋️', he: 'לנוח', en: 'Rest' },
      { id: 'help', emoji: '🧺', he: 'לעזור בבית', en: 'Help at home' },
    ],
  },
  {
    id: 'calm',
    emoji: '🌿',
    he: { label: 'איך נירגע?', question: 'מה יעזור לך עכשיו?' },
    en: { label: 'How to calm down', question: 'What would help you right now?' },
    options: [
      { id: 'breathe', emoji: '🎈', he: 'נשימה', en: 'Breathing' },
      { id: 'hug', emoji: '🤗', he: 'חיבוק', en: 'A hug' },
      { id: 'water', emoji: '💧', he: 'מים', en: 'Water' },
      { id: 'quiet', emoji: '🌙', he: 'מקום שקט', en: 'A quiet spot' },
      { id: 'music', emoji: '🎧', he: 'מוזיקה', en: 'Music' },
      { id: 'draw', emoji: '🎨', he: 'לצייר', en: 'Draw' },
    ],
  },
  {
    id: 'how',
    emoji: '👥',
    he: { label: 'איך נעשה את זה?', question: 'איך נעשה את זה?' },
    en: { label: 'How shall we do it', question: 'How shall we do this?' },
    options: [
      { id: 'alone', emoji: '🙋', he: 'אני לבד', en: 'I do it myself' },
      { id: 'together', emoji: '🤝', he: 'ביחד', en: 'Together' },
      { id: 'help', emoji: '👪', he: 'עם עזרה', en: 'With help' },
      { id: 'i_start', emoji: '▶️', he: 'אני מתחיל/ה', en: 'I start' },
      { id: 'you_start', emoji: '⏩', he: 'אתם מתחילים', en: 'You start' },
      { id: 'now_or_later', emoji: '⏳', he: 'עוד חמש דקות', en: 'In five minutes' },
    ],
  },
];

export const MAX_OPTIONS = 4;
export const MIN_OPTIONS = 2;
export const CUSTOM_EMOJI = '⭐';

export const UI = {
  he: {
    title: 'לוח הבחירה',
    subtitle: 'בוחרים רגע מהיום, מרכיבים שתיים עד ארבע אפשרויות, ומדפיסים לוח שהילד/ה בוחר/ת ממנו.',
    pickTitle: 'על מה הבחירה?',
    ownQuestion: 'שאלה משלי',
    ownQuestionPlaceholder: 'למשל: איזה ספר נקרא הערב?',
    boardTitle: 'הלוח שלי',
    boardEmpty: 'בחרו לפחות שתי אפשרויות מהרשימה למטה.',
    libraryTitle: 'מה נציע לבחירה?',
    customLabel: 'אפשרות משלי',
    customPlaceholder: 'למשל: החולצה עם הדינוזאור',
    customAdd: 'להוסיף',
    limitReached: 'ארבע אפשרויות זה המקסימום — וזה בכוונה. יותר מזה כבר לא מרגיש כמו בחירה.',
    remove: 'להוריד מהלוח',
    changeSituation: 'לבחור רגע אחר',
    clear: 'לנקות את הלוח',
    print: 'להדפיס את הלוח',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הכלל היחיד שחייבים לשמור: כל אפשרות על הלוח היא אפשרות שאתם באמת מוכנים שתיבחר. לוח שיש בו אופציה שתיפסל ברגע האמת שובר את האמון בכלי כולו.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'The Choice Board',
    subtitle: 'Pick a moment in the day, put together two to four options, and print a board your child chooses from.',
    pickTitle: 'What is the choice about?',
    ownQuestion: 'My own question',
    ownQuestionPlaceholder: 'For example: which book shall we read tonight?',
    boardTitle: 'My board',
    boardEmpty: 'Pick at least two options from the list below.',
    libraryTitle: 'What shall we offer?',
    customLabel: 'My own option',
    customPlaceholder: 'For example: the dinosaur shirt',
    customAdd: 'Add',
    limitReached: 'Four options is the maximum — and that is on purpose. More than that stops feeling like a choice.',
    remove: 'Remove from board',
    changeSituation: 'Pick another moment',
    clear: 'Clear the board',
    print: 'Print my board',
    parentTipLabel: 'Tip for parents',
    parentTip: 'The one rule to keep: every option on the board is one you are genuinely willing to have chosen. A board with an option you would veto in the moment breaks trust in the whole tool.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'לוח בחירה לילדים | פעילות חינמית | StoryLeap',
    description: 'בונים לוח בחירה מצויר לילדים — שתיים עד ארבע אפשרויות לרגע קשה ביום, להדפסה ולתלייה. חינם וללא הרשמה.',
  },
  en: {
    title: 'Choice Board for Kids | Free Activity | StoryLeap',
    description: 'Build a picture choice board for children — two to four options for a tricky moment in the day, ready to print and hang. Free, no signup.',
  },
};
