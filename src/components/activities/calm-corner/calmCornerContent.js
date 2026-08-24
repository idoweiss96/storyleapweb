// Content for the Calm Corner Kit activity.
//
// Authored once, read at runtime, never generated.
//
// HOW THIS DIFFERS FROM "הקלפים שעוזרים לי" (Coping Cards).
// Coping Cards is about ACTIONS — what I do when it is hard. This is about a
// PLACE — what physically goes in the corner, and the agreement about how it
// works. One produces a strategy kit, the other produces a room setup and a
// poster to hang in it.
//
// The map notes "יכול לחבר physical + digital", and that is exactly the output:
// a shopping-and-setup list plus a sign for the wall.
//
// SAFETY NOTE: same boundary as Coping Cards. Everything here is an ordinary
// household object. Nothing weighted, nothing prescribed by dose, nothing that
// needs an occupational therapist to fit. See ../coping-cards/README.md.

export const ITEMS = [
  { id: 'pillow', emoji: '🛏️', he: 'כרית רכה', en: 'A soft pillow' },
  { id: 'blanket', emoji: '🧸', he: 'שמיכה או דובי', en: 'A blanket or teddy' },
  { id: 'lamp', emoji: '💡', he: 'אור רך', en: 'A soft light' },
  { id: 'books', emoji: '📖', he: 'כמה ספרים', en: 'A few books' },
  { id: 'paper', emoji: '🎨', he: 'דפים וצבעים', en: 'Paper and crayons' },
  { id: 'water', emoji: '💧', he: 'בקבוק מים', en: 'A bottle of water' },
  { id: 'squeeze', emoji: '🫧', he: 'משהו ללחוץ', en: 'Something to squeeze' },
  { id: 'headphones', emoji: '🎧', he: 'אוזניות', en: 'Headphones' },
  { id: 'photo', emoji: '🖼️', he: 'תמונה של מישהו אהוב', en: 'A photo of someone you love' },
  { id: 'timer', emoji: '⏳', he: 'שעון חול', en: 'A sand timer' },
  { id: 'cards', emoji: '🃏', he: 'קלפי הרגשות', en: 'The emotion cards' },
  { id: 'plant', emoji: '🪴', he: 'צמח קטן', en: 'A small plant' },
];

// The agreement is what makes a calm corner work. Without it, it becomes
// a punishment chair — which is the single most common way it fails.
export const AGREEMENTS = [
  { id: 'anytime', emoji: '🚪', he: 'אפשר להיכנס מתי שרוצים', en: 'You can go in whenever you want' },
  { id: 'not_punishment', emoji: '💛', he: 'זו לא ענישה ולא הרחקה', en: 'It is not a punishment or a time-out' },
  { id: 'no_time_limit', emoji: '⏳', he: 'אפשר להישאר כמה שצריך', en: 'You can stay as long as you need' },
  { id: 'no_questions', emoji: '🤫', he: 'לא שואלים שאלות כשיוצאים', en: 'No questions when you come out' },
  { id: 'can_join', emoji: '🫂', he: 'אפשר לבקש שמישהו ייכנס איתי', en: 'You can ask someone to come in with you' },
  { id: 'adults_too', emoji: '👪', he: 'גם מבוגרים יכולים להשתמש', en: 'Grown-ups can use it too' },
];

export const CUSTOM_EMOJI = '⭐';

export const UI = {
  he: {
    title: 'פינת הרוגע',
    subtitle: 'מקימים פינה בבית שאפשר ללכת אליה כשקשה. בוחרים מה יהיה בה ומה מוסכם לגביה, ומדפיסים שלט לתלות.',
    nameLabel: 'איך נקרא לפינה?',
    namePlaceholder: 'למשל: הפינה של יובל, מערת הרוגע',
    itemsTitle: 'מה יהיה בפינה?',
    agreementsTitle: 'מה מוסכם לגביה?',
    agreementsHint: 'זה החלק שקובע אם הפינה תעבוד. פינה בלי הסכמות הופכת מהר לכיסא עונש.',
    posterItems: 'מה יש בפינה',
    posterRules: 'ההסכמות שלנו',
    empty: 'בחרו לפחות פריט אחד או הסכמה אחת, והשלט יתחיל להיבנות.',
    customLabel: 'משהו משלנו',
    customPlaceholder: 'למשל: הכרית של סבתא',
    customAdd: 'להוסיף',
    clear: 'לנקות',
    print: 'להדפיס את השלט',
    printHint: 'שווה לתלות את השלט בתוך הפינה עצמה, בגובה של הילד/ה.',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הטעות הנפוצה היא לשלוח לפינה. פינת רוגע שמשמשת גם כעונש מפסיקה לעבוד תוך שבוע — הילד לומד שהמקום הזה הוא לא מקלט אלא תוצאה. אם צריך, לכו אליה יחד.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'The Calm Corner',
    subtitle: 'Set up a corner at home to go to when things are hard. Choose what goes in it and what is agreed about it, then print a sign to hang up.',
    nameLabel: 'What shall we call the corner?',
    namePlaceholder: 'For example: Yuval’s corner, the calm cave',
    itemsTitle: 'What goes in the corner?',
    agreementsTitle: 'What is agreed about it?',
    agreementsHint: 'This is the part that decides whether the corner works. A corner without agreements quickly becomes a punishment chair.',
    posterItems: 'What is in the corner',
    posterRules: 'Our agreements',
    empty: 'Pick at least one item or one agreement, and the sign will start to build.',
    customLabel: 'Something of our own',
    customPlaceholder: 'For example: grandma’s cushion',
    customAdd: 'Add',
    clear: 'Clear',
    print: 'Print the sign',
    printHint: 'Hang the sign inside the corner itself, at your child’s height.',
    parentTipLabel: 'Tip for parents',
    parentTip: 'The common mistake is sending a child to the corner. A calm corner that doubles as a punishment stops working within a week — the child learns the place is a consequence, not a refuge. If needed, go there together.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'פינת רוגע לילדים | מדריך והדפסה חינם | StoryLeap',
    description: 'מקימים פינת רוגע בבית — בוחרים מה יהיה בה ומה מוסכם לגביה, ומדפיסים שלט לתלייה. חינם וללא הרשמה.',
  },
  en: {
    title: 'Calm Corner for Kids | Free Guide and Printable | StoryLeap',
    description: 'Set up a calm corner at home — choose what goes in it and what is agreed about it, then print a sign to hang. Free, no signup.',
  },
};
