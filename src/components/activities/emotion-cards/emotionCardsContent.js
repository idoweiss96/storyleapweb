// Content for the Emotion Cards activity.
//
// Authored once, read at runtime, never generated.
//
// WHY THIS IS NOT A THIRD VERSION OF THE EMOTION WHEEL.
// The wheel and the feelings explorer are both on-screen experiences. This one
// exists to produce a PHYSICAL OBJECT: a printed deck the family cuts out and
// uses away from a screen — sorting, picking, matching, leaving on the fridge.
// In the tools map this row is noted as "מתאים מאוד לספריית תוכן חינמית",
// and a printable library is exactly what it is.
//
// So the whole design points at the printed page. The screen is a deck builder,
// not a game.

export const EMOTIONS = [
  { id: 'happy', emoji: '😄', color: '#FFC94D', he: 'שמח/ה', en: 'Happy' },
  { id: 'sad', emoji: '😢', color: '#7BA7D9', he: 'עצוב/ה', en: 'Sad' },
  { id: 'angry', emoji: '😠', color: '#FF8A6B', he: 'כועס/ת', en: 'Angry' },
  { id: 'scared', emoji: '😨', color: '#9B8FD8', he: 'מפחד/ת', en: 'Scared' },
  { id: 'calm', emoji: '😌', color: '#6FD0C4', he: 'רגוע/ה', en: 'Calm' },
  { id: 'excited', emoji: '🤩', color: '#FF6FB5', he: 'נרגש/ת', en: 'Excited' },
  { id: 'proud', emoji: '🦁', color: '#7DCE82', he: 'גאה', en: 'Proud' },
  { id: 'shy', emoji: '😳', color: '#F0A9C0', he: 'מתבייש/ת', en: 'Shy' },
  { id: 'tired', emoji: '🥱', color: '#B0B7C9', he: 'עייף/ה', en: 'Tired' },
  { id: 'confused', emoji: '😕', color: '#C4C0D8', he: 'מבולבל/ת', en: 'Confused' },
  { id: 'lonely', emoji: '🥺', color: '#8FB8D9', he: 'בודד/ה', en: 'Lonely' },
  { id: 'jealous', emoji: '😒', color: '#A8C48A', he: 'מקנא/ת', en: 'Jealous' },
  { id: 'frustrated', emoji: '😤', color: '#E89B8C', he: 'מתוסכל/ת', en: 'Frustrated' },
  { id: 'worried', emoji: '😟', color: '#9FB3DE', he: 'דואג/ת', en: 'Worried' },
  { id: 'surprised', emoji: '😮', color: '#84C7E8', he: 'מופתע/ת', en: 'Surprised' },
  { id: 'loved', emoji: '🥰', color: '#F5A9C8', he: 'אהוב/ה', en: 'Loved' },
  { id: 'curious', emoji: '🔍', color: '#8FD0C0', he: 'סקרן/ית', en: 'Curious' },
  { id: 'bored', emoji: '😑', color: '#C8C8D4', he: 'משועמם/ת', en: 'Bored' },
  { id: 'safe', emoji: '🏡', color: '#A8D8B4', he: 'בטוח/ה', en: 'Safe' },
  { id: 'hurt', emoji: '💔', color: '#E8A0A8', he: 'נפגע/ת', en: 'Hurt' },
];

export const UI = {
  he: {
    title: 'קלפי הרגשות שלנו',
    subtitle: 'בוחרים אילו רגשות ייכנסו לחפיסה, מדפיסים, גוזרים, ויש לכם קלפי רגשות אמיתיים לשולחן.',
    pickTitle: 'אילו רגשות ייכנסו לחפיסה?',
    selectAll: 'לבחור הכול',
    selectNone: 'לנקות הכול',
    countNone: 'עדיין לא בחרת קלפים',
    countOne: 'קלף אחד בחפיסה',
    countMany: '{n} קלפים בחפיסה',
    printHint: 'הקלפים מודפסים עם קווי גזירה מקווקווים, שלושה בשורה.',
    print: 'להדפיס את החפיסה',
    usesTitle: 'מה עושים עם החפיסה?',
    uses: [
      'שולפים קלף ומספרים מתי הרגשתם ככה',
      'בוחרים בסוף היום איזה קלף הכי מתאים להיום',
      'מסדרים את הקלפים מהנעים לפחות נעים, ומגלים שאין הסכמה',
      'מחביאים קלף ומנסים לנחש אותו לפי הבעת פנים',
      'משאירים כמה על המקרר, כדי שיהיה במה להצביע כשאין מילים',
    ],
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הכוח של הקלפים הוא דווקא בזה שהם לא במסך. קלף שאפשר להחזיק, להעביר למישהו או להפוך על השולחן עושה משהו שמסך לא עושה, במיוחד לילדים שקשה להם לדבר על רגשות.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Our Emotion Cards',
    subtitle: 'Choose which feelings go in the deck, print, cut them out, and you have a real set of emotion cards for the table.',
    pickTitle: 'Which feelings go in the deck?',
    selectAll: 'Select all',
    selectNone: 'Clear all',
    countNone: 'No cards chosen yet',
    countOne: 'One card in the deck',
    countMany: '{n} cards in the deck',
    printHint: 'Cards print with dashed cutting lines, three to a row.',
    print: 'Print the deck',
    usesTitle: 'What do you do with the deck?',
    uses: [
      'Draw a card and tell about a time you felt that way',
      'At the end of the day, pick the card that fits today best',
      'Sort the cards from nicest to least nice, and discover you disagree',
      'Hide a card and guess it from the face someone makes',
      'Leave a few on the fridge, so there is something to point at when words are hard',
    ],
    parentTipLabel: 'Tip for parents',
    parentTip: 'The strength of the cards is precisely that they are not on a screen. A card you can hold, hand to someone, or turn face down does something a screen does not, especially for children who find talking about feelings hard.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'קלפי רגשות להדפסה | פעילות חינמית לילדים | StoryLeap',
    description: 'בונים חפיסת קלפי רגשות מותאמת, מדפיסים וגוזרים. 20 רגשות לבחירה, קווי גזירה מוכנים. חינם וללא הרשמה.',
  },
  en: {
    title: 'Printable Emotion Cards | Free Activity for Kids | StoryLeap',
    description: 'Build a custom deck of emotion cards, print and cut them out. 20 feelings to choose from, cutting lines included. Free, no signup.',
  },
};