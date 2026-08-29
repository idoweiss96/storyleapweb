/*
 * homeNewContent.js — every user-facing string for the Home-new prototype,
 * in one bilingual map. No inline `lang === 'he' ? ...` ternaries in the JSX.
 *
 * Positioning language follows the approved brand doc
 * (03_Content Studio/Content Studio Resources/01_StoryLeap_Brand_and_Messaging.md v3.0),
 * Section 2 short description and Section 9B Parent -> Child -> Together.
 *
 * All routes below already exist in the live app. The picker links carry a
 * `from=home_new` marker so prototype traffic is distinguishable; unknown query
 * params are ignored by the existing flows.
 */

export const HOME_NEW_META = {
  en: {
    title: "StoryLeap - Helping Families Through Childhood's Moments",
    description:
      "StoryLeap helps families navigate the emotional moments of childhood - starting school, moving house, a new sibling, a parent traveling, bedtime fears - with guidance for parents, tools and activities for children, and personalized stories that bring the two together.",
  },
  he: {
    title: 'סטוריליפ - מלווים משפחות ברגעים הרגשיים של הילדות',
    description:
      'סטוריליפ מלווה משפחות ברגעים הרגשיים של הילדות - התחלת בית ספר, מעבר דירה, אח או אחות חדשים, הורה שנוסע, פחדים לפני השינה - עם הכוונה להורים, כלים ופעילויות לילדים, וסיפורים מותאמים אישית שמחברים בין השניים.',
  },
};

export const NAV = {
  en: {
    moments: 'Moments',
    activities: 'Activities',
    how: 'How it works',
    approach: 'Our approach',
    professionals: 'For Professionals',
    login: 'Log in',
    start: 'Start',
    menu: 'Menu',
    language: 'עברית',
  },
  he: {
    moments: 'רגעים',
    activities: 'פעילויות',
    how: 'איך זה עובד',
    approach: 'הגישה שלנו',
    professionals: 'לאנשי מקצוע',
    login: 'התחברות',
    start: 'להתחיל',
    menu: 'תפריט',
    language: 'English',
  },
};

export const HERO = {
  en: {
    eyebrow: 'A family emotional-wellbeing platform',
    h1: 'Your child is going through something. We help you know how to approach it.',
    lead:
      'Tell us the moment your child is in. StoryLeap gives you guidance to understand it, a gentle way for your child to explore it, and something to do together afterwards.',
    pickerLabel: 'What is your child going through right now?',
  },
  he: {
    eyebrow: 'פלטפורמה לרווחה רגשית של המשפחה',
    h1: 'הילד/ה שלכם מתמודד/ת עם משהו. אנחנו עוזרים לכם לדעת איך לגשת לזה.',
    lead:
      'ספרו לנו על הרגע שהילד/ה שלכם נמצא/ת בו. סטוריליפ נותנת לכם הכוונה להבין אותו, דרך עדינה לילד/ה לחקור אותו, ומשהו לעשות יחד אחר כך.',
    pickerLabel: 'עם מה הילד/ה שלכם מתמודד/ת כרגע?',
  },
};

/* Picker chips -> existing prefilled flows (mirrors the logic in src/pages/Home.jsx). */
export const MOMENTS = [
  { key: 'school',     to: '/KitaAlef',                                              en: 'Starting school',      he: 'מתחילים בית ספר' },
  { key: 'fears',      to: '/CreateStory?from=home_new&challenge=fears',              en: 'Fears and worries',    he: 'פחדים ודאגות' },
  { key: 'separation', to: '/CreateStory?from=home_new&challenge=separation_anxiety', en: 'Separation',           he: 'פרידה' },
  { key: 'moving',     to: '/PrepareStory?from=home_new&topic=moving_home',           en: 'Moving house',         he: 'מעבר דירה' },
  { key: 'friends',    to: '/CreateStory?from=home_new&challenge=social_difficulty',  en: 'Friendships',          he: 'חברויות' },
  { key: 'bigfeel',    to: '/CreateStory?from=home_new&challenge=emotional_regulation',en: 'Big feelings',        he: 'רגשות גדולים' },
  { key: 'bedtime',    to: '/CreateStory?from=home_new&challenge=sleep_issues',       en: 'Bedtime',              he: 'שעת השינה' },
  { key: 'sibling',    to: '/PrepareStory?from=home_new&topic=new_sibling',           en: 'A new sibling',        he: 'אח או אחות חדשים' },
  { key: 'other',      to: '/CreateStory?from=home_new',                              en: 'Something else',       he: 'משהו אחר', muted: true },
];

export const PCT = {
  en: {
    eyebrow: 'How StoryLeap helps',
    h2: 'Not something the child does alone. Something you move through together.',
    lead: 'Every moment has three sides. StoryLeap supports all of them.',
    cols: [
      { tag: 'For the parent', h3: 'Understand what is happening', p: 'Plain-language guidance on what may be underneath the moment, what to notice, and what to try - so you are not guessing.' },
      { tag: 'For the child',  h3: 'A gentle way in',              p: 'A personalized story, plus activities and tools that let your child explore the feeling without being put on the spot.' },
      { tag: 'Together',       h3: 'Turn it into connection',      p: 'Conversation starters, small rituals and shared activities that bring the experience back into real life, off the screen.' },
    ],
  },
  he: {
    eyebrow: 'איך סטוריליפ עוזרת',
    h2: 'לא משהו שהילד/ה עושה לבד. משהו שעוברים יחד.',
    lead: 'לכל רגע יש שלושה צדדים. סטוריליפ תומכת בכולם.',
    cols: [
      { tag: 'להורה',  h3: 'להבין מה קורה',          p: 'הכוונה בשפה פשוטה על מה שאולי עומד מאחורי הרגע, על מה לשים לב, ומה כדאי לנסות - כדי שלא תנחשו.' },
      { tag: 'לילד/ה', h3: 'דרך כניסה עדינה',        p: 'סיפור מותאם אישית, ולצידו פעילויות וכלים שמאפשרים לילד/ה לחקור את הרגש בלי לחץ.' },
      { tag: 'ביחד',   h3: 'להפוך את זה לחיבור',     p: 'פתיחות לשיחה, טקסים קטנים ופעילויות משותפות שמחזירים את החוויה לחיים האמיתיים, מחוץ למסך.' },
    ],
  },
};

export const TRY = {
  en: {
    eyebrow: 'Try something now',
    h2: 'Small tools you can use today - no signup',
    lead: 'Short activities to do with your child in a few minutes. Each one points you somewhere next.',
    seeAll: 'See all activities',
    cards: [
      { to: '/activities/emotion-wheel',     h3: 'The Emotion Wheel',    p: 'Spin the wheel and talk about the feeling it lands on.',        next: 'Then: try the Feelings Thermometer' },
      { to: '/activities/emotion-drawing',   h3: 'Draw the Feeling',     p: 'Pick a feeling and draw what it looks like, together.',         next: 'Then: save it to your family space' },
      { to: '/FreeActivityGoodbye',          h3: 'Our Goodbye Ritual',   p: 'Build a calm, consistent goodbye for the school gate.',         next: 'Then: explore the Starting school moment' },
    ],
  },
  he: {
    eyebrow: 'לנסות משהו עכשיו',
    h2: 'כלים קטנים לשימוש כבר היום - בלי הרשמה',
    lead: 'פעילויות קצרות לעשות עם הילד/ה בכמה דקות. כל אחת מובילה לצעד הבא.',
    seeAll: 'לכל הפעילויות',
    cards: [
      { to: '/activities/emotion-wheel',   h3: 'גלגל הרגשות',        p: 'מסובבים את הגלגל ומדברים על הרגש שיצא.',                 next: 'אחר כך: מד החום של הרגשות' },
      { to: '/activities/emotion-drawing', h3: 'ציור הרגש',          p: 'בוחרים רגש ומציירים יחד איך הוא נראה.',                  next: 'אחר כך: לשמור במרחב המשפחתי' },
      { to: '/FreeActivityGoodbye',        h3: 'טקס הפרידה שלנו',    p: 'בונים פרידה רגועה וקבועה לשער בית הספר.',                next: 'אחר כך: הרגע של התחלת בית ספר' },
    ],
  },
};

export const JOURNEY = {
  en: {
    eyebrow: 'One full example',
    h2: 'What a moment looks like, start to finish',
    lead: 'Take "starting school." Here is the whole path, not just a story.',
    cta: 'Start with your child’s moment',
    steps: [
      { h3: 'Parent insight',      p: 'What the first weeks of school actually ask of a child, and where the worry usually sits.' },
      { h3: 'Child activity',      p: 'A short activity that lets your child show what they are picturing about the classroom.' },
      { h3: 'Personalized story',  p: 'A story built around your child, their world, and this exact moment.' },
      { h3: 'Talk together',       p: 'A few questions to ask after reading, and a goodbye ritual to practise before day one.' },
    ],
  },
  he: {
    eyebrow: 'דוגמה שלמה אחת',
    h2: 'איך נראה רגע, מההתחלה ועד הסוף',
    lead: 'ניקח את "התחלת בית ספר". זה כל המסלול, לא רק סיפור.',
    cta: 'להתחיל עם הרגע של הילד/ה שלכם',
    steps: [
      { h3: 'תובנה להורה',        p: 'מה השבועות הראשונים בבית הספר באמת דורשים מילד/ה, ואיפה הדאגה בדרך כלל יושבת.' },
      { h3: 'פעילות לילד/ה',      p: 'פעילות קצרה שנותנת לילד/ה להראות מה הוא/היא מדמיין/ת לגבי הכיתה.' },
      { h3: 'סיפור מותאם אישית',  p: 'סיפור שנבנה סביב הילד/ה, העולם שלו/שלה, והרגע המדויק הזה.' },
      { h3: 'לדבר יחד',          p: 'כמה שאלות לשאול אחרי הקריאה, וטקס פרידה לתרגל לפני היום הראשון.' },
    ],
  },
};

export const APPROACH = {
  en: {
    eyebrow: 'Why this works',
    h2: 'Built on approaches professionals already trust',
    lead:
      'StoryLeap is not therapy and does not replace it. Each story draws on established, evidence-informed ideas - used as a way of telling a story, not as treatment.',
    cta: 'Read about our approach',
    methods: ['Bibliotherapy', 'Narrative approaches', 'CBT-informed structure', 'Developmental psychology', 'Storytelling craft', 'Positive psychology'],
  },
  he: {
    eyebrow: 'למה זה עובד',
    h2: 'בנוי על גישות שאנשי מקצוע כבר סומכים עליהן',
    lead:
      'סטוריליפ אינה טיפול ואינה מחליפה אותו. כל סיפור נשען על רעיונות מבוססים ומגובי מחקר - כדרך לספר סיפור, לא כטיפול.',
    cta: 'לקרוא על הגישה שלנו',
    methods: ['ביבליותרפיה', 'גישות נרטיביות', 'מבנה בהשראת CBT', 'פסיכולוגיה התפתחותית', 'אומנות הסיפור', 'פסיכולוגיה חיובית'],
  },
};

export const TRUST = {
  en: {
    eyebrow: 'Made for families',
    h2: 'Careful with your child, by design',
    items: [
      { t: 'Parent-guided', d: 'You lead. StoryLeap gives you something to notice, ask, or try - it never speaks past you.' },
      { t: 'Child privacy', d: 'What you share is used to shape your child’s experience, and nothing else.' },
      { t: 'Grounded, not clinical', d: 'Built on child-development principles and evidence-informed approaches - never a diagnosis or a promise to "fix" anything.' },
      { t: 'Real families', d: 'In use by parents in Hebrew and English, across everyday moments of childhood.' },
      { t: 'A named team', d: 'Built by three founders - product, business and technology - who put their names to it.' },
      { t: 'No dark patterns', d: 'One clear next step per page. Pricing is shown when it is relevant, not before.' },
    ],
    foundersLink: 'Meet the team',
  },
  he: {
    eyebrow: 'נבנה למשפחות',
    h2: 'זהירים עם הילד/ה שלכם, מתוך כוונה',
    items: [
      { t: 'בהובלת ההורה', d: 'אתם מובילים. סטוריליפ נותנת לכם על מה לשים לב, מה לשאול ומה לנסות - היא לא מדברת במקומכם.' },
      { t: 'פרטיות הילד/ה', d: 'מה שאתם משתפים משמש לעיצוב החוויה של הילד/ה, ולשום דבר אחר.' },
      { t: 'מבוסס, לא קליני', d: 'בנוי על עקרונות התפתחות הילד וגישות מגובות מחקר - לא אבחון ולא הבטחה "לתקן" משהו.' },
      { t: 'משפחות אמיתיות', d: 'בשימוש אצל הורים בעברית ובאנגלית, ברגעים היומיומיים של הילדות.' },
      { t: 'צוות עם שם', d: 'נבנה בידי שלושה מייסדים - מוצר, עסקים וטכנולוגיה - שחתומים עליו בשמם.' },
      { t: 'בלי דפוסים מניפולטיביים', d: 'צעד הבא אחד וברור בכל עמוד. מחיר מוצג כשהוא רלוונטי, לא לפני.' },
    ],
    foundersLink: 'להכיר את הצוות',
  },
};

export const SPACE = {
  en: {
    eyebrow: 'Somewhere to return to',
    h2: 'Your family space',
    lead:
      'Everything for one child in one place - the moment you are working on, their stories and saved activities, a daily check-in, and a gentle nudge on what to try next.',
    cta: 'See your space',
    rows: ['This week’s moment', 'Stories and saved activities', 'Daily mood check-in', 'Reminders for the two of you', 'Recommended next step'],
  },
  he: {
    eyebrow: 'מקום לחזור אליו',
    h2: 'המרחב המשפחתי שלכם',
    lead:
      'הכול לילד/ה אחד/ת במקום אחד - הרגע שאתם עובדים עליו, הסיפורים והפעילויות השמורות, צ’ק-אין יומי, ורמז עדין למה לנסות בהמשך.',
    cta: 'למרחב שלכם',
    rows: ['הרגע של השבוע', 'סיפורים ופעילויות שמורות', 'צ’ק-אין רגשי יומי', 'תזכורות לשניכם', 'הצעד הבא המומלץ'],
  },
};

export const PRO = {
  en: {
    eyebrow: 'For professionals',
    h3: 'Work with children professionally?',
    p: 'We are building personalized tools for therapists, educators and child-development professionals - social stories, custom activities, home-practice materials, and continuity between the session and home. Some of this exists today; much is in active development.',
    note: 'Honest about what is live and what we are still building. Not a diagnostic or clinical-treatment system.',
    cta: 'Talk to us about early access',
  },
  he: {
    eyebrow: 'לאנשי מקצוע',
    h3: 'עובדים עם ילדים באופן מקצועי?',
    p: 'אנחנו בונים כלים מותאמים אישית למטפלים, מחנכים ואנשי התפתחות הילד - סיפורים חברתיים, פעילויות בהתאמה, חומרי תרגול לבית, ורצף בין המפגש לבית. חלק מזה קיים היום; הרבה נמצא בפיתוח פעיל.',
    note: 'שקופים לגבי מה שכבר פעיל ומה עוד בבנייה. לא מערכת אבחון או טיפול קליני.',
    cta: 'לדבר איתנו על גישה מוקדמת',
  },
};

export const CLOSE = {
  en: {
    h2: 'Start with the moment your child is in',
    lead: 'A few minutes together, and you will have guidance, something for your child, and a way to talk about it.',
    cta: 'Tell us what is going on',
  },
  he: {
    h2: 'להתחיל מהרגע שהילד/ה שלכם נמצא/ת בו',
    lead: 'כמה דקות יחד, ויהיו לכם הכוונה, משהו לילד/ה, ודרך לדבר על זה.',
    cta: 'ספרו לנו מה קורה',
  },
};

export const FOOTER = {
  en: {
    tagline: "Helping families through childhood's moments.",
    exploreTitle: 'Explore',
    explore: [
      { label: 'Moments', to: '#moments' },
      { label: 'Activities', to: '/activities' },
      { label: 'How it works', to: '#how' },
      { label: 'Our approach', to: '/our-methods' },
      { label: 'For professionals', to: '#professionals' },
    ],
    companyTitle: 'Company',
    company: [
      { label: 'Our vision', to: '/Vision' },
      { label: 'Pricing', to: '/Pricing' },
      { label: 'FAQ', to: '/FAQ' },
      { label: 'Contact', to: '/Contact' },
    ],
    legal: [
      { label: 'Privacy Policy', to: '/PrivacyPolicy' },
      { label: 'Terms of Use', to: '/TermsOfUse' },
    ],
    note: 'Prototype - Home-new redesign. Not linked from production navigation.',
  },
  he: {
    tagline: 'מלווים משפחות ברגעים של הילדות.',
    exploreTitle: 'לחקור',
    explore: [
      { label: 'רגעים', to: '#moments' },
      { label: 'פעילויות', to: '/activities' },
      { label: 'איך זה עובד', to: '#how' },
      { label: 'הגישה שלנו', to: '/our-methods' },
      { label: 'לאנשי מקצוע', to: '#professionals' },
    ],
    companyTitle: 'החברה',
    company: [
      { label: 'החזון שלנו', to: '/Vision' },
      { label: 'מחירים', to: '/Pricing' },
      { label: 'שאלות נפוצות', to: '/FAQ' },
      { label: 'צור קשר', to: '/Contact' },
    ],
    legal: [
      { label: 'מדיניות פרטיות', to: '/PrivacyPolicy' },
      { label: 'תנאי שימוש', to: '/TermsOfUse' },
    ],
    note: 'אב-טיפוס - עיצוב מחדש של דף הבית. לא מקושר מהניווט בפרודקשן.',
  },
};

export const LOGO_URL =
  'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e41c4f352_Storyleap.svg';
