// Content + copy for the Feelings Map experience, in Hebrew (1st grade) and English (kindergarten).

const EMOTIONS_HE = [
  { id: 'happy', label: 'שמח/ה', emoji: '😊' },
  { id: 'excited', label: 'נרגש/ת', emoji: '🤩' },
  { id: 'worried', label: 'חושש/ת', emoji: '😟' },
  { id: 'curious', label: 'סקרן/ית', emoji: '🤔' },
  { id: 'confused', label: 'מבולבל/ת', emoji: '😵' },
  { id: 'calm', label: 'רגוע/ה', emoji: '😌' },
  { id: 'shy', label: 'מתבייש/ת', emoji: '😳' },
  { id: 'proud', label: 'גאה', emoji: '🦁' },
  { id: 'sad', label: 'עצוב/ה', emoji: '😢' },
  { id: 'angry', label: 'כועס/ת', emoji: '😠' },
  { id: 'frustrated', label: 'מתוסכל/ת', emoji: '😤' },
  { id: 'lonely', label: 'בודד/ה', emoji: '🥺' },
];
const EMOTIONS_EN = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'excited', label: 'Excited', emoji: '🤩' },
  { id: 'worried', label: 'Worried', emoji: '😟' },
  { id: 'curious', label: 'Curious', emoji: '🤔' },
  { id: 'confused', label: 'Confused', emoji: '😵' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'shy', label: 'Shy', emoji: '😳' },
  { id: 'proud', label: 'Proud', emoji: '🦁' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'frustrated', label: 'Frustrated', emoji: '😤' },
  { id: 'lonely', label: 'Lonely', emoji: '🥺' },
];

const BODY_HE = [
  { id: 'stomach', label: 'בבטן', emoji: '🌀' },
  { id: 'heart', label: 'בלב', emoji: '💗' },
  { id: 'head', label: 'בראש', emoji: '💭' },
  { id: 'throat', label: 'בגרון', emoji: '🎈' },
  { id: 'hands', label: 'בידיים', emoji: '🤲' },
  { id: 'legs', label: 'ברגליים', emoji: '🦵' },
  { id: 'wholebody', label: 'בכל הגוף', emoji: '✨' },
  { id: 'unsure', label: 'אני לא יודע/ת וזה בסדר', emoji: '🤷' },
];
const BODY_EN = [
  { id: 'stomach', label: 'In my tummy', emoji: '🌀' },
  { id: 'heart', label: 'In my heart', emoji: '💗' },
  { id: 'head', label: 'In my head', emoji: '💭' },
  { id: 'throat', label: 'In my throat', emoji: '🎈' },
  { id: 'hands', label: 'In my hands', emoji: '🤲' },
  { id: 'legs', label: 'In my legs', emoji: '🦵' },
  { id: 'wholebody', label: 'In my whole body', emoji: '✨' },
  { id: 'unsure', label: "I'm not sure, and that's okay", emoji: '🤷' },
];

const STORY_CARDS_HE = [
  { id: 'loved', label: 'איזה רגע בסיפור הכי אהבתי?' },
  { id: 'important', label: 'איזה רגע בסיפור הרגיש לי חשוב?' },
  { id: 'remember', label: 'איזה רגע בסיפור הייתי רוצה לזכור ביום הראשון?' },
  { id: 'power', label: 'איזה כוח היה לי בסיפור?' },
  { id: 'try', label: 'מה מהסיפור אני רוצה לנסות גם באמת?' },
];
const STORY_CARDS_EN = [
  { id: 'loved', label: 'Which moment in the story did I love most?' },
  { id: 'important', label: 'Which moment in the story felt important to me?' },
  { id: 'remember', label: 'Which moment would I like to remember on the first day?' },
  { id: 'power', label: 'What strength did I have in the story?' },
  { id: 'try', label: 'What from the story do I want to try for real?' },
];

const SUPPORTS_HE = [
  { id: 'balloon_breath', label: 'נשימת בלון', emoji: '🌬️' },
  { id: 'five_things', label: 'חמישה דברים שאני רואה', emoji: '👀' },
  { id: 'hug', label: 'חיבוק קצר', emoji: '🤗' },
  { id: 'companion_object', label: 'חפץ קטן שמלווה אותי', emoji: '🧸' },
  { id: 'draw_inside', label: 'לצייר מה שבפנים', emoji: '🎨' },
  { id: 'name_worry', label: 'לתת שם למפלצת הדאגה', emoji: '👹' },
  { id: 'safe_place', label: 'לדמיין מקום בטוח', emoji: '🏡' },
  { id: 'shake_it_out', label: 'לזוז ולנער את זה', emoji: '🤸' },
  { id: 'know_whats_next', label: 'לדעת מה מחכה לי', emoji: '🗓️' },
  { id: 'talk_trusted_adult', label: 'לדבר עם מבוגר שסומכים עליו', emoji: '🗣️' },
  { id: 'quiet_alone', label: 'רגע שקט לבד', emoji: '🌙' },
  { id: 'small_step', label: 'צעד אחד קטן, לא הכול בבת אחת', emoji: '🐾' },
];
const SUPPORTS_EN = [
  { id: 'balloon_breath', label: 'Balloon breathing', emoji: '🌬️' },
  { id: 'five_things', label: 'Five things I can see', emoji: '👀' },
  { id: 'hug', label: 'A quick hug', emoji: '🤗' },
  { id: 'companion_object', label: 'A small object that comes with me', emoji: '🧸' },
  { id: 'draw_inside', label: "Draw what's inside", emoji: '🎨' },
  { id: 'name_worry', label: 'Give the worry monster a name', emoji: '👹' },
  { id: 'safe_place', label: 'Imagine a safe place', emoji: '🏡' },
  { id: 'shake_it_out', label: 'Move and shake it out', emoji: '🤸' },
  { id: 'know_whats_next', label: "Knowing what's coming next", emoji: '🗓️' },
  { id: 'talk_trusted_adult', label: 'Talk to a trusted adult', emoji: '🗣️' },
  { id: 'quiet_alone', label: 'A quiet moment alone', emoji: '🌙' },
  { id: 'small_step', label: 'One small step, not all at once', emoji: '🐾' },
];

const POWER_SENTENCES_HE = [
  'מותר לי להתחיל לאט.',
  'אני לא חייב/ת לדעת הכול ביום הראשון.',
  'אפשר לבקש עזרה.',
  'אני יכול/ה להיות אמיץ/ה גם כשאני מתרגש/ת.',
  'צעד קטן הוא גם צעד אמיץ.',
  'יש לי דברים שעוזרים לי להירגע.',
  'אמא/אבא חוזרים לקחת אותי.',
];
const POWER_SENTENCES_EN = [
  "I'm allowed to start slowly.",
  "I don't have to know everything on the first day.",
  'I can ask for help.',
  'I can be brave even when I feel excited.',
  'A small step is also a brave step.',
  'I have things that help me calm down.',
  'Mom/Dad come back to pick me up.',
];

const ACTIONS_HE = [
  { id: 'a1', label: 'לבחור שיר לבוקר', emoji: '🎵' },
  { id: 'a2', label: 'לבחור מה יהיה בסנדוויץ׳', emoji: '🥪' },
  { id: 'a3', label: 'להכין פתק קטן לתיק', emoji: '💌' },
  { id: 'a4', label: 'לצייר את הדרך לבית הספר', emoji: '🎨' },
  { id: 'a5', label: 'להכין את התיק יחד', emoji: '🎒' },
  { id: 'a6', label: 'לתרגל טקס פרידה קצר', emoji: '👋' },
  { id: 'a7', label: 'לבחור חפץ קטן שמרגיע אותי', emoji: '🧸' },
];
const ACTIONS_EN = [
  { id: 'a1', label: 'Choose a morning song', emoji: '🎵' },
  { id: 'a2', label: "Choose what's in the sandwich", emoji: '🥪' },
  { id: 'a3', label: 'Make a small note for the bag', emoji: '💌' },
  { id: 'a4', label: 'Draw the way to school', emoji: '🎨' },
  { id: 'a5', label: 'Pack the bag together', emoji: '🎒' },
  { id: 'a6', label: 'Practice a short goodbye ritual', emoji: '👋' },
  { id: 'a7', label: 'Choose a small comforting object', emoji: '🧸' },
];

const TEXT_HE = {
  eyebrow: 'מפת הרגשות שלי',
  introTitle: 'מפת הרגשות שלי בדרך לכיתה א׳',
  introBody: 'אחרי שקראתם את הסיפור האישי, אפשר לעצור לכמה דקות ולגלות יחד מה הילד/ה מרגיש/ה ומה יכול לעזור לו/לה להתחיל את כיתה א׳ בתחושת ביטחון.',
  tips: [
    'לא חייבים לענות במילים, אפשר גם להצביע.',
    'מותר להרגיש כמה רגשות יחד.',
    'קודם מקשיבים ומתקפים, אחר כך מחפשים מה יכול לעזור.',
    'זו לא שיחה שצריך להצליח בה, אלא רגע קטן ביחד.',
  ],
  startBtn: 'מתחילים יחד',
  back: 'חזרה',
  next: 'הבא',

  emotionsTitle: 'כשאני חושב/ת על כיתה א׳, אני מרגיש/ה…',
  emotionsInstruction: 'אפשר לבחור יותר מרגש אחד.',
  emotionOtherLabel: 'איך קוראים לרגש שלך?',
  emotionOtherPlaceholder: 'אפשר לכתוב במילים שלכם',
  emotionOther: { id: 'other', label: 'אחר: תרשמו בעצמכם', emoji: '✏️' },
  emotionsNote: 'לפעמים הלב מרגיש כמה דברים ביחד. זה טבעי במיוחד כשמתחילים משהו חדש.',

  bodyTitle: 'איפה אני מרגיש/ה את זה בגוף?',
  bodyInstruction: 'אפשר גם לדלג על השלב הזה.',
  bodySkip: 'אפשר לדלג ולהמשיך',

  storyTitle: 'עכשיו ניזכר רגע בסיפור שלך.',
  storyInstruction: 'אפשר לבחור כרטיס אחד או כמה.',
  storyTextLabel: 'אפשר לכתוב כאן משהו קטן שנרצה לזכור מהסיפור.',

  supportsTitle: 'כשאני מרגיש/ה ככה, מה יכול לעזור לי?',
  supportsInstruction: 'אפשר לבחור יותר מדבר אחד.',
  supportOther: { id: 'other', label: 'משהו אחר שעוזר לי', emoji: '➕' },
  supportOtherLabel: 'מה עוד עוזר?',
  supportOtherPlaceholder: 'למשל: לשחק עם הכלב לפני שיוצאים',

  powerTitle: 'משפט הכוח שלי',
  powerInstruction: 'בחרו משפט קצר שאפשר לזכור בבוקר או בדרך לבית הספר.',
  powerCustomLabel: 'או כתבו משפט משלכם',
  powerCustomPlaceholder: 'למשל: אני מוכן/ה לצעד הראשון',

  actionTitle: 'פעולה קטנה למחר',
  actionInstruction: 'נבחר דבר אחד קטן שיעזור לבוקר להתחיל טוב.',
  actionNext: 'לסיכום',

  summaryHeading: 'מה עוזר לי להתחיל טוב',
  labelEmotions: 'רגשות שבחרתי',
  labelBody: 'איפה אני מרגיש/ה את זה',
  labelStory: 'מה אני רוצה לזכור מהסיפור שלי',
  labelSupports: 'מה עוזר לי',
  labelPower: 'משפט הכוח שלי',
  labelAction: 'הפעולה הקטנה שלי למחר',
  closingText: 'אפשר לשמור את הכרטיס בטלפון, להדפיס או לחזור אליו לפני היום הראשון.',
  printBtn: 'הדפסה / שמירה כ־PDF',
  restartBtn: 'להתחיל מחדש',
  returnBtn: 'חזרה לסיפורים שלי',
};

const TEXT_EN = {
  eyebrow: 'My Feelings Map',
  introTitle: 'My Feelings Map on the Way to Kindergarten',
  introBody: "After reading the personal story together, take a few minutes to discover together what your child feels and what can help them start kindergarten feeling safe and confident.",
  tips: [
    "You don't have to answer in words, pointing works too.",
    "It's okay to feel a few things at once.",
    'First we listen and validate, then we look for what can help.',
    "This isn't a conversation to get right, just a small moment together.",
  ],
  startBtn: "Let's start together",
  back: 'Back',
  next: 'Next',

  emotionsTitle: 'When I think about starting kindergarten, I feel…',
  emotionsInstruction: 'You can choose more than one feeling.',
  emotionOtherLabel: "What's your feeling called?",
  emotionOtherPlaceholder: 'You can write it in your own words',
  emotionOther: { id: 'other', label: 'Something else: write your own', emoji: '✏️' },
  emotionsNote: 'Sometimes the heart feels a few things together. That\u2019s natural, especially when starting something new.',

  bodyTitle: 'Where do I feel this in my body?',
  bodyInstruction: 'You can also skip this step.',
  bodySkip: 'Skip and continue',

  storyTitle: "Now let's remember a moment from your story.",
  storyInstruction: 'You can choose one card or a few.',
  storyTextLabel: 'You can write here something small you want to remember from the story.',

  supportsTitle: 'When I feel this way, what can help me?',
  supportsInstruction: 'You can choose more than one thing.',
  supportOther: { id: 'other', label: 'Something else that helps me', emoji: '➕' },
  supportOtherLabel: 'What else helps?',
  supportOtherPlaceholder: 'For example: playing with the dog before we leave',

  powerTitle: 'My power sentence',
  powerInstruction: 'Choose a short sentence to remember in the morning or on the way to school.',
  powerCustomLabel: 'Or write your own sentence',
  powerCustomPlaceholder: "For example: I'm ready for the first step",

  actionTitle: 'One small action for tomorrow',
  actionInstruction: "Let's choose one small thing to help the morning start well.",
  actionNext: 'To summary',

  summaryHeading: 'What helps me start well',
  labelEmotions: 'Feelings I chose',
  labelBody: 'Where I feel it in my body',
  labelStory: 'What I want to remember from my story',
  labelSupports: 'What helps me',
  labelPower: 'My power sentence',
  labelAction: 'My small action for tomorrow',
  closingText: 'You can save this card on your phone, print it, or come back to it before the first day.',
  printBtn: 'Print / Save as PDF',
  restartBtn: 'Start again',
  returnBtn: 'Return to My Stories',
};

export function getFeelingsMapContent(lang) {
  const isEn = lang === 'en';
  return {
    isEn,
    text: isEn ? TEXT_EN : TEXT_HE,
    emotions: isEn ? EMOTIONS_EN : EMOTIONS_HE,
    body: isEn ? BODY_EN : BODY_HE,
    storyCards: isEn ? STORY_CARDS_EN : STORY_CARDS_HE,
    supports: isEn ? SUPPORTS_EN : SUPPORTS_HE,
    powerSentences: isEn ? POWER_SENTENCES_EN : POWER_SENTENCES_HE,
    actions: isEn ? ACTIONS_EN : ACTIONS_HE,
  };
}