// Content for the Coping Cards activity.
//
// Authored once, read at runtime, never generated.
//
// SAFETY NOTE — read before adding a card.
// In the tools map, "Coping Cards" is rated as carrying no clinical sensitivity,
// while "Sensory Menu / תפריט ויסות" is explicitly flagged as needing care because
// sensory strategies must be fitted by a professional. These are easy to confuse.
// Every card here is a general, widely-used calming strategy that any child can try
// safely without supervision. Do NOT add sensory-regulation prescriptions
// (weighted items, specific proprioceptive or vestibular input, oral-motor tools) —
// those belong to an occupational therapist, not to a free web activity.

export const COPING = [
  {
    id: 'balloon_breath',
    emoji: '🎈',
    he: { label: 'נשימת בלון', how: 'שאיפה עמוקה דרך האף, הבטן מתנפחת כמו בלון. נשיפה איטית דרך הפה.' },
    en: { label: 'Balloon breathing', how: 'Breathe in through your nose until your tummy puffs up like a balloon. Breathe out slowly through your mouth.' },
  },
  {
    id: 'count_ten',
    emoji: '🔟',
    he: { label: 'לספור עד עשר', how: 'לעצום עיניים ולספור לאט עד עשר. אפשר גם אחורה, מעשר לאחד.' },
    en: { label: 'Count to ten', how: 'Close your eyes and count slowly to ten. You can also count backwards from ten.' },
  },
  {
    id: 'water',
    emoji: '💧',
    he: { label: 'כוס מים', how: 'ללכת לשתות כוס מים לאט, לגימה אחרי לגימה.' },
    en: { label: 'A glass of water', how: 'Go and drink a glass of water slowly, sip after sip.' },
  },
  {
    id: 'hug',
    emoji: '🤗',
    he: { label: 'חיבוק', how: 'לבקש חיבוק ממישהו שאני סומך/ת עליו. אפשר גם לחבק דובי או כרית.' },
    en: { label: 'A hug', how: 'Ask someone you trust for a hug. Hugging a teddy or a pillow works too.' },
  },
  {
    id: 'move',
    emoji: '🤸',
    he: { label: 'לזוז', how: 'לקפוץ, לרקוד או לנער את הידיים חזק, עד שהגוף מרגיש קצת אחרת.' },
    en: { label: 'Move', how: 'Jump, dance, or shake your hands hard until your body feels a bit different.' },
  },
  {
    id: 'quiet_spot',
    emoji: '🌙',
    he: { label: 'מקום שקט', how: 'ללכת לפינה שקטה לכמה דקות, בלי שאף אחד ידבר איתי.' },
    en: { label: 'A quiet spot', how: 'Go to a quiet corner for a few minutes, with nobody talking to you.' },
  },
  {
    id: 'draw',
    emoji: '🎨',
    he: { label: 'לצייר', how: 'לקחת דף ולצייר מה שיש בפנים. לא צריך שיצא יפה.' },
    en: { label: 'Draw it', how: 'Take a page and draw what is inside you. It does not have to look nice.' },
  },
  {
    id: 'tell_someone',
    emoji: '🗣️',
    he: { label: 'לספר למישהו', how: 'למצוא מבוגר שאני סומך/ת עליו ולהגיד לו מה קרה.' },
    en: { label: 'Tell someone', how: 'Find a grown-up you trust and tell them what happened.' },
  },
  {
    id: 'music',
    emoji: '🎧',
    he: { label: 'מוזיקה', how: 'לשים שיר שאני אוהב/ת ולהקשיב לו עד הסוף.' },
    en: { label: 'Music', how: 'Put on a song you love and listen to it all the way through.' },
  },
  {
    id: 'five_things',
    emoji: '👀',
    he: { label: 'חמישה דברים שאני רואה', how: 'להסתכל מסביב ולמנות בשקט חמישה דברים שאני רואה עכשיו.' },
    en: { label: 'Five things I can see', how: 'Look around and quietly name five things you can see right now.' },
  },
  {
    id: 'squeeze',
    emoji: '🛏️',
    he: { label: 'ללחוץ כרית', how: 'ללחוץ כרית חזק-חזק, לספור עד שלוש, ואז לשחרר.' },
    en: { label: 'Squeeze a pillow', how: 'Squeeze a pillow really tight, count to three, then let go.' },
  },
  {
    id: 'outside',
    emoji: '🌳',
    he: { label: 'לצאת החוצה', how: 'לצאת לאוויר לכמה דקות, אפילו רק למרפסת או לחצר.' },
    en: { label: 'Go outside', how: 'Step outside for a few minutes, even just to the balcony or the yard.' },
  },
  {
    id: 'comfort_object',
    emoji: '🧸',
    he: { label: 'חפץ שמרגיע אותי', how: 'להחזיק את החפץ שתמיד מרגיע אותי, ולהישאר איתו קצת.' },
    en: { label: 'My comfort object', how: 'Hold the thing that always calms you down, and stay with it a while.' },
  },
  {
    id: 'write_it',
    emoji: '📝',
    he: { label: 'לכתוב את זה', how: 'לכתוב על דף מה מרגיז אותי, ואז לקמט את הדף ולזרוק.' },
    en: { label: 'Write it down', how: 'Write on a page what is bothering you, then crumple it up and throw it away.' },
  },
];

export const UI = {
  he: {
    title: 'הקלפים שעוזרים לי',
    subtitle: 'עוברים על הקלפים ובוחרים את מה שבאמת עוזר לך כשקשה. בסוף מקבלים ערכה אישית להדפיס.',
    selectedNone: 'עדיין לא בחרת קלפים',
    selectedOne: 'בחרת קלף אחד',
    selectedMany: 'בחרת {n} קלפים',
    customLabel: 'משהו אחר שעוזר לי',
    customPlaceholder: 'למשל: לשחק עם הכלב, לשבת עם אמא...',
    customEmoji: '⭐',
    reveal: 'זו הערכה שלי',
    myKit: 'ערכת ההרגעה שלי',
    revealIntro: 'אלה הדברים שעוזרים לך כשקשה. אפשר להדפיס ולתלות במקום שרואים.',
    restart: 'לבחור מחדש',
    print: 'להדפיס את הערכה',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הכי חשוב לבנות את הערכה ברגע רגוע, ולא באמצע התפרצות. ככה, כשיהיה קשה, יש כבר משהו מוכן לחזור אליו, ולא צריך להמציא פתרון בזמן אמת.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Cards That Help Me',
    subtitle: 'Go through the cards and pick what really helps you when things are hard. You will get a personal kit to print.',
    selectedNone: 'No cards chosen yet',
    selectedOne: 'You chose one card',
    selectedMany: 'You chose {n} cards',
    customLabel: 'Something else that helps me',
    customPlaceholder: 'For example: playing with the dog, sitting with mum...',
    customEmoji: '⭐',
    reveal: 'This is my kit',
    myKit: 'My calm-down kit',
    revealIntro: 'These are the things that help you when it is hard. Print it and hang it somewhere you can see.',
    restart: 'Choose again',
    print: 'Print my kit',
    parentTipLabel: 'Tip for parents',
    parentTip: 'Build the kit in a calm moment, not in the middle of a meltdown. That way, when things get hard, there is already something ready to turn to instead of having to invent a solution on the spot.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'ערכת הרגעה לילדים | פעילות חינמית | StoryLeap',
    description: 'פעילות חינמית שעוזרת לילדים לבנות ערכת הרגעה אישית — בוחרים מה עוזר כשקשה, מדפיסים ותולים. ללא הרשמה.',
  },
  en: {
    title: 'Calm-Down Kit for Kids | Free Activity | StoryLeap',
    description: 'A free activity that helps children build a personal calm-down kit — pick what helps when things are hard, print it and hang it up. No signup.',
  },
};