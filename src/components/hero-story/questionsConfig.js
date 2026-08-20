// Content config for the "hero_story" gift-book questionnaire.
// Structure mirrors src/components/moving-house/questionsConfig.js (intro Qs + pages),
// rendered by the shared kita-alef QuestionCard. Those files are never touched.
//
// ⚠️ Every `key` here is a column in the order sheet. The mapping lives in
// base44/shared/heroStorySheet.ts (rowFromStory), and the Python pipeline reads the
// resulting columns in hero_story/data_processor.py. Renaming a key without changing
// both of those makes the answer vanish silently — the book still gets written, just
// without the thing the family typed.
//
// Unlike the therapeutic questionnaires, nothing here asks about a difficulty. This is a
// gift: the questions exist to make the story unmistakably about THIS child.

// The 17 worlds of hero_story/themes.py. The labels must match Theme.label_he /
// Theme.label_en exactly — match_theme() matches on the full label first.
const WORLDS_HE = [
  { emoji: '🦖', label: 'עולם הדינוזאורים' },
  { emoji: '🚀', label: 'חלל ומסע בין כוכבים' },
  { emoji: '🦄', label: 'חד-קרן וקסם' },
  { emoji: '🦸', label: 'גיבורי על' },
  { emoji: '🏴‍☠️', label: 'פיראטים ואוצרות' },
  { emoji: '🐠', label: 'עולם תת-ימי' },
  { emoji: '🐘', label: "ג'ונגל וספארי" },
  { emoji: '🏰', label: 'ממלכה, ארמון ואבירים' },
  { emoji: '🌲', label: 'יער קסום וחיות מדברות' },
  { emoji: '⚽', label: 'עולם הספורט' },
  { emoji: '🎵', label: 'מוזיקה וריקוד' },
  { emoji: '🚂', label: 'רכבות, מכוניות וכלי תחבורה' },
  { emoji: '🐴', label: 'חווה וחיות' },
  { emoji: '❄️', label: 'ארץ הקרח והשלג' },
  { emoji: '🍭', label: 'ארץ הממתקים' },
  { emoji: '🔍', label: 'בלש ותעלומות' },
  { emoji: '🏡', label: 'סיפור מהחיים האמיתיים' },
];

const WORLDS_EN = [
  { emoji: '🦖', label: 'Dinosaur world' },
  { emoji: '🚀', label: 'Space and interstellar travel' },
  { emoji: '🦄', label: 'Unicorns and magic' },
  { emoji: '🦸', label: 'Superheroes' },
  { emoji: '🏴‍☠️', label: 'Pirates and treasure' },
  { emoji: '🐠', label: 'Ocean and underwater world' },
  { emoji: '🐘', label: 'Jungle and safari' },
  { emoji: '🏰', label: 'Kingdom, castle and knights' },
  { emoji: '🌲', label: 'Magical forest and talking animals' },
  { emoji: '⚽', label: 'Sports world' },
  { emoji: '🎵', label: 'Music and dance' },
  { emoji: '🚂', label: 'Trains, cars and vehicles' },
  { emoji: '🐴', label: 'Farm and animals' },
  { emoji: '❄️', label: 'Snow and ice world' },
  { emoji: '🍭', label: 'Candy land' },
  { emoji: '🔍', label: 'Detective and mysteries' },
  { emoji: '🏡', label: 'Real life story' },
];

export const INTRO_QUESTIONS_HE = [
  { key: 'name', tag: 'child', question: 'מה השם של הגיבור/ה שלנו?', type: 'text' },
  { key: 'age', tag: 'child', question: 'בן/בת כמה?', type: 'chips', options: ['3', '4', '5', '6', '7', '8', '9', '10+'] },
  { key: 'gender', tag: 'child', question: 'מי אתה/את?', type: 'chips', options: ['ילד', 'ילדה', 'אחר/ת'] },
  // אופציונלי, ומגיע לספר: הפרומפט משתמש בכינוי בדיאלוג בלבד, בעוד הכותרת
  // והנרטיב נשארים עם השם המלא.
  { key: 'nickname', tag: 'child', question: 'איך קוראים לך בבית? (לא חובה)', type: 'text' },
];

const PAGES_HE = [
  {
    id: 1,
    title: 'העולם',
    questions: [
      {
        key: 'world', tag: 'child', question: 'לאיזה עולם יוצאים להרפתקה?', type: 'emoji',
        required: true, options: WORLDS_HE,
      },
    ],
  },
  {
    id: 2,
    title: 'מה אוהבים',
    questions: [
      {
        key: 'loves', tag: 'child', question: 'מה הכי אוהבים לעשות?', type: 'chips', multi: true, maxSelect: 3,
        required: true,
        options: ['לצייר וליצור', 'לבנות ולהרכיב', 'לשחק בחוץ', 'חיות', 'ספרים וסיפורים',
                  'לשיר ולרקוד', 'ספורט', 'לבשל ולאפות', 'מספרים וחידות', 'לעזור לאחרים'],
        parentField: { label: 'הורים — ספרו לנו בדיוק מה זה אצלו/ה. זה מה שיפתור את העלילה בסיפור ♥' },
      },
      {
        key: 'personality', tag: 'together', question: 'איך היית מתאר/ת את האופי שלו/ה?', type: 'textarea',
        hint: 'למשל: סקרנית, שמה לב לפרטים שאף אחד לא רואה, קצת עקשנית כשמשהו חשוב לה',
      },
      {
        key: 'personal_details', tag: 'together', question: 'פרטים קטנים שיעשו את הסיפור אישי',
        type: 'textarea', hint: 'צבע אהוב, אוכל אהוב, מקום אהוב, משפט שהוא/היא תמיד אומר/ת...',
      },
      { key: 'favorite_character', tag: 'child', question: 'דמות אהובה מספר או מסרט?', type: 'text' },
    ],
  },
  {
    id: 3,
    title: 'מי מצטרף',
    questions: [
      {
        key: 'companions', tag: 'child', question: 'מי מצטרף להרפתקה?', type: 'chips', multi: true,
        options: ['אמא/אבא', 'אח/אחות', 'סבא/סבתא', 'חיית מחמד', 'חבר/ה', 'חפץ אהוב', 'אף אחד — הרפתקה לבד'],
      },
      {
        key: 'sibling_name', tag: 'child', question: 'איך קוראים לאח/אחות?', type: 'text',
        showIf: { dependsOn: 'companions', values: ['אח/אחות'] },
      },
      {
        key: 'pet_kind', tag: 'child', question: 'איזו חיה?', type: 'text',
        hint: 'כלב, חתולה, אוגר…',
        showIf: { dependsOn: 'companions', values: ['חיית מחמד'] },
      },
      {
        key: 'pet_name', tag: 'child', question: 'ואיך קוראים לה?', type: 'text',
        showIf: { dependsOn: 'companions', values: ['חיית מחמד'] },
      },
    ],
  },
  {
    id: 4,
    title: 'המתנה',
    questions: [
      {
        key: 'occasion', tag: 'together', question: 'לאיזה אירוע הספר?', type: 'chips',
        options: ['יום הולדת', 'חג', 'סיום גן/כיתה', 'לידת אח/אחות', 'סתם, מתוך אהבה'],
      },
      { key: 'gift_from', tag: 'together', question: 'ממי המתנה?', type: 'text', hint: 'סבא וסבתא, אמא ואבא…' },
      {
        key: 'dedication', tag: 'together', question: 'הקדשה אישית לעמוד הפתיחה',
        type: 'textarea',
        hint: 'לרוני שלנו, שרואה את כל מה שאחרים מפספסים. באהבה, סבא וסבתא',
      },
      { key: 'notes', tag: 'together', question: 'עוד משהו שנשמח לדעת?', type: 'textarea' },
    ],
  },
  {
    id: 5,
    title: 'תמונות',
    questions: [
      { key: 'photo', question: 'תמונה של הגיבור/ה', type: 'photo', required: true, consent: true },
      {
        key: 'parent_photo', tag: 'together',
        question: 'תמונה של אמא או אבא (אופציונלי — רק כך נוכל לצייר אותם בספר)',
        type: 'family_photos',
      },
    ],
  },
];

export const INTRO_QUESTIONS_EN = [
  { key: 'name', tag: 'child', question: "What's our hero's name?", type: 'text' },
  { key: 'age', tag: 'child', question: 'How old are they?', type: 'chips', options: ['3', '4', '5', '6', '7', '8', '9', '10+'] },
  { key: 'gender', tag: 'child', question: 'Are you a boy or a girl?', type: 'chips', options: ['Boy', 'Girl', 'Other'] },
  { key: 'nickname', tag: 'child', question: 'What do they call you at home? (optional)', type: 'text' },
];

const PAGES_EN = [
  {
    id: 1,
    title: 'The World',
    questions: [
      { key: 'world', tag: 'child', question: 'Which world are we going on an adventure in?', type: 'emoji', required: true, options: WORLDS_EN },
    ],
  },
  {
    id: 2,
    title: 'What they love',
    questions: [
      {
        key: 'loves', tag: 'child', question: 'What do you love doing most?', type: 'chips', multi: true, maxSelect: 3,
        required: true,
        options: ['Drawing and creating', 'Building', 'Playing outside', 'Animals', 'Books and stories',
                  'Singing and dancing', 'Sports', 'Cooking and baking', 'Numbers and puzzles', 'Helping others'],
        parentField: { label: 'Parents — tell us exactly what this looks like for them. This is what solves the plot ♥' },
      },
      { key: 'personality', tag: 'together', question: 'How would you describe them?', type: 'textarea', hint: 'e.g. curious, notices details nobody else does, stubborn when something matters' },
      { key: 'personal_details', tag: 'together', question: 'Little details that make the story theirs', type: 'textarea', hint: 'Favourite colour, favourite food, a place they love, something they always say...' },
      { key: 'favorite_character', tag: 'child', question: 'A favourite character from a book or film?', type: 'text' },
    ],
  },
  {
    id: 3,
    title: 'Who comes along',
    questions: [
      {
        key: 'companions', tag: 'child', question: 'Who joins the adventure?', type: 'chips', multi: true,
        options: ['Mom/Dad', 'Sibling', 'Grandparent', 'Pet', 'A friend', 'A beloved toy', 'Nobody — a solo adventure'],
      },
      { key: 'sibling_name', tag: 'child', question: "What's the sibling's name?", type: 'text', showIf: { dependsOn: 'companions', values: ['Sibling'] } },
      { key: 'pet_kind', tag: 'child', question: 'What kind of pet?', type: 'text', hint: 'dog, cat, hamster…', showIf: { dependsOn: 'companions', values: ['Pet'] } },
      { key: 'pet_name', tag: 'child', question: "And what's their name?", type: 'text', showIf: { dependsOn: 'companions', values: ['Pet'] } },
    ],
  },
  {
    id: 4,
    title: 'The Gift',
    questions: [
      { key: 'occasion', tag: 'together', question: "What's the occasion?", type: 'chips', options: ['Birthday', 'Holiday', 'Graduation', 'A new sibling', 'Just because'] },
      { key: 'gift_from', tag: 'together', question: 'Who is the gift from?', type: 'text' },
      { key: 'dedication', tag: 'together', question: 'A personal dedication for the opening page', type: 'textarea', hint: 'For our Roni, who sees everything everyone else misses. With love, Grandma and Grandpa' },
      { key: 'notes', tag: 'together', question: 'Anything else we should know?', type: 'textarea' },
    ],
  },
  {
    id: 5,
    title: 'Photos',
    questions: [
      { key: 'photo', question: "The hero's photo", type: 'photo', required: true, consent: true },
      { key: 'parent_photo', tag: 'together', question: 'A photo of Mom or Dad (optional — only then can we draw them in the book)', type: 'family_photos' },
    ],
  },
];

export function getPages(lang) {
  return lang === 'en' ? PAGES_EN : PAGES_HE;
}

export function getIntroQuestions(lang) {
  return lang === 'en' ? INTRO_QUESTIONS_EN : INTRO_QUESTIONS_HE;
}

export function getWorlds(lang) {
  return lang === 'en' ? WORLDS_EN : WORLDS_HE;
}
