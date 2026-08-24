// Content for the Strength Cards activity.
//
// Authored once, read at runtime, never generated. Each strength carries the
// question shown once the child has chosen it, so the reveal is personal
// without anything being written on the fly.

export const STRENGTHS = [
  {
    id: 'friend',
    emoji: '🤝',
    he: { label: 'אני חבר/ה טוב/ה', prompt: 'מתי היית חבר/ה טוב/ה לאחרונה?' },
    en: { label: 'I am a good friend', prompt: 'When were you a good friend lately?' },
  },
  {
    id: 'persistent',
    emoji: '🧗',
    he: { label: 'אני לא מוותר/ת בקלות', prompt: 'על מה לא ויתרת, גם כשהיה קשה?' },
    en: { label: 'I do not give up easily', prompt: 'What did you stick with, even when it was hard?' },
  },
  {
    id: 'funny',
    emoji: '😹',
    he: { label: 'אני מצחיק/ה', prompt: 'את מי הצחקת השבוע?' },
    en: { label: 'I am funny', prompt: 'Who did you make laugh this week?' },
  },
  {
    id: 'curious',
    emoji: '🔍',
    he: { label: 'אני סקרן/ית', prompt: 'איזו שאלה את/ה הכי רוצה לדעת עליה תשובה?' },
    en: { label: 'I am curious', prompt: 'What question would you most like answered?' },
  },
  {
    id: 'helpful',
    emoji: '🫶',
    he: { label: 'אני עוזר/ת לאחרים', prompt: 'למי עזרת לאחרונה, גם בדבר קטן?' },
    en: { label: 'I help others', prompt: 'Who did you help lately, even in a small way?' },
  },
  {
    id: 'listener',
    emoji: '👂',
    he: { label: 'אני יודע/ת להקשיב', prompt: 'מתי מישהו סיפר לך משהו חשוב?' },
    en: { label: 'I know how to listen', prompt: 'When did someone tell you something important?' },
  },
  {
    id: 'brave',
    emoji: '🦁',
    he: { label: 'אני אמיץ/ה גם כשמפחיד', prompt: 'מה עשית למרות שקצת פחדת?' },
    en: { label: 'I am brave even when it is scary', prompt: 'What did you do even though you were a bit scared?' },
  },
  {
    id: 'creative',
    emoji: '🎨',
    he: { label: 'אני יצירתי/ת', prompt: 'מה יצרת לאחרונה שאת/ה אוהב/ת?' },
    en: { label: 'I am creative', prompt: 'What did you make lately that you like?' },
  },
  {
    id: 'caring',
    emoji: '💗',
    he: { label: 'אני שם/ה לב לאחרים', prompt: 'איך ידעת פעם שמישהו הרגיש לא טוב?' },
    en: { label: 'I notice how others feel', prompt: 'How did you once know that someone felt bad?' },
  },
  {
    id: 'apologize',
    emoji: '🕊️',
    he: { label: 'אני יודע/ת לומר סליחה', prompt: 'מתי אמרת סליחה, ואיך זה הרגיש אחר כך?' },
    en: { label: 'I know how to say sorry', prompt: 'When did you say sorry, and how did it feel after?' },
  },
  {
    id: 'patient',
    emoji: '⏳',
    he: { label: 'אני סבלני/ת', prompt: 'על מה חיכית הרבה זמן?' },
    en: { label: 'I am patient', prompt: 'What did you wait a long time for?' },
  },
  {
    id: 'honest',
    emoji: '💎',
    he: { label: 'אני אומר/ת את האמת', prompt: 'מתי אמרת אמת גם כשזה היה לא נעים?' },
    en: { label: 'I tell the truth', prompt: 'When did you tell the truth even though it was uncomfortable?' },
  },
  {
    id: 'learner',
    emoji: '📚',
    he: { label: 'אני לומד/ת דברים חדשים', prompt: 'מה למדת לאחרונה שלא ידעת קודם?' },
    en: { label: 'I learn new things', prompt: 'What did you learn recently that you did not know before?' },
  },
  {
    id: 'self_calm',
    emoji: '🌿',
    he: { label: 'אני יודע/ת להירגע לבד', prompt: 'מה עוזר לך להירגע כשאת/ה לבד?' },
    en: { label: 'I can calm myself down', prompt: 'What helps you calm down when you are on your own?' },
  },
  {
    id: 'try_again',
    emoji: '🌱',
    he: { label: 'אני מנסה שוב אחרי שנפלתי', prompt: 'במה הצלחת רק אחרי שניסית עוד פעם?' },
    en: { label: 'I try again after I fall', prompt: 'What worked out only after you tried again?' },
  },
];

export const UI = {
  he: {
    title: 'קלפי החוזקות שלי',
    subtitle: 'עוברים על הקלפים ובוחרים את אלה שמרגישים כמוך. אפשר לבחור כמה שרוצים.',
    selectedNone: 'עדיין לא בחרת קלפים',
    selectedOne: 'בחרת קלף אחד',
    selectedMany: 'בחרת {n} קלפים',
    reveal: 'אלה החוזקות שלי',
    myStrengths: 'החוזקות שלי',
    revealIntro: 'אלה הכוחות שבחרת. על כל אחד יש שאלה — כדאי לענות עליה יחד.',
    restart: 'לבחור מחדש',
    print: 'להדפסה',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'שווה לבחור גם אתם קלף אחד שאתם רואים אצל הילד/ה, ולספר למה. ילדים זוכרים את זה הרבה זמן.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'My Strength Cards',
    subtitle: 'Go through the cards and pick the ones that feel like you. Choose as many as you want.',
    selectedNone: 'No cards chosen yet',
    selectedOne: 'You chose one card',
    selectedMany: 'You chose {n} cards',
    reveal: 'These are my strengths',
    myStrengths: 'My strengths',
    revealIntro: 'These are the strengths you chose. Each one has a question — it is worth answering them together.',
    restart: 'Choose again',
    print: 'Print',
    parentTipLabel: 'Tip for parents',
    parentTip: 'Pick a card yourself too — one you see in your child — and say why. Children remember that for a long time.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'קלפי חוזקות לילדים | פעילות חינמית | StoryLeap',
    description: 'פעילות חינמית שעוזרת לילדים לזהות את הכוחות שלהם. בוחרים קלפים, מקבלים שאלות לשיחה ואפשר להדפיס. ללא הרשמה.',
  },
  en: {
    title: 'Strength Cards for Kids | Free Activity | StoryLeap',
    description: 'A free activity that helps children recognize their own strengths. Pick cards, get conversation questions, and print the result. No signup.',
  },
};
