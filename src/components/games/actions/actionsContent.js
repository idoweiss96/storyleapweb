/**
 * actionsContent.js — all content for the Actions game.
 *
 * A verb-practice game: tap a word, the creature does it. Built for children
 * working on action words, which is why the verb is always shown large in
 * writing as well as acted out.
 *
 * `face` is a Critter expression and `motion` a CSS animation name; `prop` is an
 * Icon name. All three are plain strings, so adding a verb never means touching
 * the component.
 */

export const ACTIONS = [
  { id: 'jump', prop: null, face: 'happy', motion: 'jump', he: { verb: 'קופץ', line: 'טופי קופץ גבוה!' }, en: { verb: 'jumping', line: 'Topi is jumping high!' } },
  { id: 'eat', prop: 'apple', face: 'happy', motion: 'chew', he: { verb: 'אוכל', line: 'טופי אוכל תפוח' }, en: { verb: 'eating', line: 'Topi is eating an apple' } },
  { id: 'drink', prop: 'cup', face: 'happy', motion: 'tilt', he: { verb: 'שותה', line: 'טופי שותה מים' }, en: { verb: 'drinking', line: 'Topi is drinking water' } },
  { id: 'sleep', prop: 'zzz', face: 'asleep', motion: 'breathe', he: { verb: 'ישן', line: 'שששש… טופי ישן' }, en: { verb: 'sleeping', line: 'Shhh… Topi is sleeping' } },
  { id: 'run', prop: 'wind', face: 'happy', motion: 'run', he: { verb: 'רץ', line: 'טופי רץ מהר מאוד' }, en: { verb: 'running', line: 'Topi is running very fast' } },
  { id: 'dance', prop: 'note', face: 'happy', motion: 'dance', he: { verb: 'רוקד', line: 'טופי רוקד לפי המוזיקה' }, en: { verb: 'dancing', line: 'Topi is dancing to the music' } },
  { id: 'wash', prop: 'soap', face: 'happy', motion: 'scrub', he: { verb: 'מתרחץ', line: 'טופי מתרחץ ומתנקה' }, en: { verb: 'washing', line: 'Topi is washing and getting clean' } },
  { id: 'brush', prop: 'toothbrush', face: 'happy', motion: 'scrub', he: { verb: 'מצחצח שיניים', line: 'טופי מצחצח שיניים' }, en: { verb: 'brushing teeth', line: 'Topi is brushing their teeth' } },
  { id: 'read', prop: 'book', face: 'neutral', motion: 'tilt', he: { verb: 'קורא', line: 'טופי קורא ספר' }, en: { verb: 'reading', line: 'Topi is reading a book' } },
  { id: 'sing', prop: 'mic', face: 'surprised', motion: 'dance', he: { verb: 'שר', line: 'טופי שר בקול רם' }, en: { verb: 'singing', line: 'Topi is singing out loud' } },
  { id: 'laugh', prop: null, face: 'happy', motion: 'chew', he: { verb: 'צוחק', line: 'טופי צוחק המון' }, en: { verb: 'laughing', line: 'Topi is laughing a lot' } },
  { id: 'cry', prop: 'tear', face: 'sad', motion: 'breathe', he: { verb: 'בוכה', line: 'טופי בוכה. גם זה בסדר' }, en: { verb: 'crying', line: 'Topi is crying. That is okay too' } },
  { id: 'wave', prop: 'hand', face: 'happy', motion: 'wave', he: { verb: 'מנופף לשלום', line: 'טופי מנופף לשלום' }, en: { verb: 'waving', line: 'Topi is waving hello' } },
  { id: 'hug', prop: 'teddy', face: 'neutral', motion: 'squeeze', he: { verb: 'מחבק', line: 'טופי מחבק חזק' }, en: { verb: 'hugging', line: 'Topi is giving a big hug' } },
];

export const UI = {
  he: {
    back: 'חזרה למשחקים',
    title: 'מה טופי עושה?',
    subtitle: 'לוחצים על מילה — וטופי עושה אותה. משחק פעלים לתרגול שפה.',
    idle: 'טופי מחכה. מה נעשה?',
    idleVerb: 'מחכה',
    wordsTitle: 'המילים',
    soundOn: 'להשמיע את המילה',
    soundOff: 'בלי קול',
    again: 'עוד פעם',
    parentTipLabel: 'טיפ להורה',
    parentTip:
      'המשחק בנוי סביב פעלים, שהם לרוב השלב הקשה יותר אחרי שמות עצם. אמרו את המילה יחד עם הלחיצה, ואחר כך נסו הפוך: אתם עושים את הפעולה והילד/ה מוצא/ת את המילה. אפשר להפעיל קול כדי לשמוע את המילה בקול רם.',
  },
  en: {
    back: 'Back to games',
    title: 'What is Topi Doing?',
    subtitle: 'Tap a word and Topi does it. A verb game for language practice.',
    idle: 'Topi is waiting. What shall we do?',
    idleVerb: 'waiting',
    wordsTitle: 'The words',
    soundOn: 'Say the word out loud',
    soundOff: 'Sound off',
    again: 'Again',
    parentTipLabel: 'Parent tip',
    parentTip:
      'This game is built around verbs, usually the harder step after nouns. Say the word out loud together with the tap, then try it in reverse: you act it out and your child finds the word. Turn the sound on to hear each word spoken.',
  },
};

export const META = {
  he: {
    title: 'מה טופי עושה? | משחק פעלים חינמי לילדים | StoryLeap',
    description:
      'משחק פעלים חינמי לילדים: לוחצים על מילה והדמות מבצעת אותה. תרגול שפה ופעלים, בעברית ובאנגלית, בלי ניקוד ובלי לחץ.',
  },
  en: {
    title: 'What is Topi Doing? | Free Verb Game for Kids | StoryLeap',
    description:
      'A free verb game for kids: tap a word and the character acts it out. Language and action-word practice in English and Hebrew, with no scores.',
  },
};
