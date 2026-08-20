// Content config for the "prepare-story" (סיפור הכנה) questionnaire.
// Structure mirrors src/components/hero-story/questionsConfig.js (intro Qs + pages),
// rendered by the shared kita-alef QuestionCard. Those files are never touched.
//
// ⚠️ Every `key` here becomes a column in the order sheet. The mapping lives in
// base44/shared/prepareStorySheet.ts (rowFromStory), and the Python pipeline reads the
// resulting columns in perpare_child_story/data_processor.py. Renaming a key without
// changing both of those makes the answer vanish silently — the book still gets written,
// just without the thing the family typed.
//
// ── What this product is, and why the questions look like this ───────────────────────
// This is NOT a therapeutic questionnaire. Nothing here asks what is wrong with the
// child, because nothing is. The event has not happened yet, and the book exists to make
// it FAMILIAR before it arrives. Four kinds of information do that, and pages 2-3 exist
// entirely to collect them:
//
//   1. PROCEDURAL  — what happens, in order. Without it the book describes a feeling
//                    rather than an event, and the child still does not know what is coming.
//   2. SENSORY     — what they will see, hear and feel. This is what prevents the surprise
//                    that actually frightens: the chair tipping back, the suction noise.
//   3. AGENCY      — what the child can choose, hold, say or do.
//   4. CONTINUITY  — what stays exactly the same. The emotional anchor of the book.
//
// ── And why page 4 asks about a worry with a hard yes/no ─────────────────────────────
// The documented failure in `stories`: a questionnaire held an event and a behaviour with
// no feeling anywhere, the CBT prompt demanded an explicit distressing thought, and the
// model INVENTED one — a belief that the girl would not be seen, which nobody had
// reported. A book can PLANT a worry, not only process one. So it is asked outright, the
// follow-up only appears on "yes", and the pipeline turns the worry on only when BOTH the
// answer is yes AND the parent wrote what was actually said.

// ⚠️ נוצר אוטומטית מ-perpare_child_story/topics.py. אל תערוך ידנית —
//    ערוך שם והרץ מחדש את הגנרטור, אחרת שני הצדדים ייפרדו בשקט.
//    51 נושאים ב-6 קטגוריות.

export const CATEGORIES = [
  { key: "family", emoji: "\ud83c\udfe0", he: "משפחה ובית", en: "Family & home" },
  { key: "school", emoji: "\ud83c\udf92", he: "מסגרות חינוכיות", en: "School & childcare" },
  { key: "body", emoji: "\ud83e\udea5", he: "גוף, שגרה ועצמאות", en: "Body & independence" },
  { key: "medical", emoji: "\ud83e\ude7a", he: "בריאות ורפואה", en: "Health & medical" },
  { key: "firsts", emoji: "\u2728", he: "פעמים ראשונות", en: "First times" },
  { key: "sensitive", emoji: "\ud83d\udc9b", he: "אירועים רגישים", en: "Sensitive events" },
];

export const TOPICS = [
  { key: "moving_home", category: "family", emoji: "\ud83d\udce6", he: "מעבר דירה", en: "Moving to a new home" },
  { key: "relocation_abroad", category: "family", emoji: "\u2708\ufe0f", he: "מעבר לעיר או למדינה אחרת", en: "Moving to another city or country" },
  { key: "new_sibling", category: "family", emoji: "\ud83d\udc76", he: "אח או אחות חדשים", en: "A new baby brother or sister" },
  { key: "new_pet", category: "family", emoji: "\ud83d\udc36", he: "חיית מחמד חדשה", en: "A new pet" },
  { key: "own_room", category: "family", emoji: "\ud83d\udecf\ufe0f", he: "מעבר לחדר משלו", en: "Moving into their own room" },
  { key: "big_bed", category: "family", emoji: "\ud83c\udf19", he: "מעבר ממיטת תינוק למיטה גדולה", en: "Moving from a cot to a big bed" },
  { key: "sleep_alone", category: "family", emoji: "\ud83d\udca4", he: "שינה עצמאית בחדר", en: "Falling asleep independently" },
  { key: "two_homes", category: "sensitive", emoji: "\ud83c\udfe1", he: "מעבר בין שני בתים (פרידת הורים)", en: "Living in two homes (parents separating)" },
  { key: "blended_family", category: "family", emoji: "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66", he: "משפחה חדשה — בן/בת זוג של הורה", en: "A parent's new partner joining the family" },
  { key: "grandparent_moves_in", category: "family", emoji: "\ud83d\udc75", he: "סבא או סבתא עוברים לגור איתנו", en: "A grandparent moving in" },
  { key: "parent_away", category: "sensitive", emoji: "\ud83c\udf92", he: "הורה שנוסע לתקופה (עבודה/מילואים)", en: "A parent going away for a while" },
  { key: "starting_daycare", category: "school", emoji: "\ud83e\uddf8", he: "כניסה למעון או לגן", en: "Starting daycare or kindergarten" },
  { key: "changing_kindergarten", category: "school", emoji: "\ud83d\udd04", he: "מעבר לגן אחר או גננת חדשה", en: "Changing kindergarten or teacher" },
  { key: "first_grade", category: "school", emoji: "\ud83c\udf92", he: "כניסה לכיתה א'", en: "Starting first grade" },
  { key: "new_school", category: "school", emoji: "\ud83c\udfeb", he: "מעבר לבית ספר חדש", en: "Moving to a new school" },
  { key: "school_bus", category: "school", emoji: "\ud83d\ude8c", he: "נסיעה בהסעה לבד", en: "Riding the school bus alone" },
  { key: "afterschool", category: "school", emoji: "\ud83d\udd52", he: "צהרון או מטפלת חדשה", en: "Afterschool club or a new carer" },
  { key: "sleepaway_camp", category: "school", emoji: "\u26fa", he: "קייטנה או מחנה עם לינה", en: "Camp or a sleepover trip" },
  { key: "new_activity", category: "school", emoji: "\ud83e\udd4b", he: "חוג חדש", en: "Starting a new activity or class" },
  { key: "performance", category: "firsts", emoji: "\ud83c\udfa4", he: "הופעה או מסיבת סיום", en: "A show or end-of-year performance" },
  { key: "potty_training", category: "body", emoji: "\ud83d\udebd", he: "גמילה מחיתולים — מעבר לסיר ולשירותים", en: "Potty training" },
  { key: "toothbrushing", category: "body", emoji: "\ud83e\udea5", he: "צחצוח שיניים", en: "Brushing teeth" },
  { key: "giving_up_dummy", category: "body", emoji: "\ud83c\udf7c", he: "פרידה ממוצץ, בקבוק או שמיכי", en: "Giving up the dummy, bottle or comfort blanket" },
  { key: "weaning", category: "body", emoji: "\ud83e\udd31", he: "גמילה מהנקה", en: "Weaning from breastfeeding" },
  { key: "first_haircut", category: "body", emoji: "\u2702\ufe0f", he: "תספורת ראשונה", en: "A first haircut" },
  { key: "first_glasses", category: "body", emoji: "\ud83d\udc53", he: "משקפיים ראשונים", en: "First glasses" },
  { key: "screens_and_phone", category: "body", emoji: "\ud83d\udcf1", he: "טלפון ראשון וכללי מסכים", en: "A first phone and screen rules" },
  { key: "staying_alone_briefly", category: "body", emoji: "\ud83d\udeaa", he: "להישאר לבד לזמן קצר", en: "Staying alone for a short while" },
  { key: "chores", category: "body", emoji: "\ud83e\uddfa", he: "אחריות ומטלות בבית", en: "First chores and responsibility" },
  { key: "morning_routine", category: "body", emoji: "\u23f0", he: "שגרת בוקר חדשה", en: "A new morning routine" },
  { key: "dentist_visit", category: "medical", emoji: "\ud83e\uddb7", he: "ביקור אצל רופא/ת שיניים", en: "A visit to the dentist" },
  { key: "doctor_visit", category: "medical", emoji: "\ud83e\ude7a", he: "ביקור אצל רופא/ה", en: "A visit to the doctor" },
  { key: "vaccination", category: "medical", emoji: "\ud83d\udc89", he: "חיסון או זריקה", en: "A vaccination or injection" },
  { key: "blood_test", category: "medical", emoji: "\ud83e\ude78", he: "בדיקת דם", en: "A blood test" },
  { key: "hospital_stay", category: "medical", emoji: "\ud83c\udfe5", he: "אשפוז או ניתוח", en: "A hospital stay or an operation" },
  { key: "cast_or_crutches", category: "medical", emoji: "\ud83e\uddb4", he: "גבס או קביים", en: "A cast or crutches" },
  { key: "therapy_sessions", category: "medical", emoji: "\ud83e\udde9", he: "התחלת טיפול (קלינאית, ריפוי בעיסוק, פסיכולוג/ית)", en: "Starting therapy sessions" },
  { key: "hearing_aid", category: "medical", emoji: "\ud83d\udc42", he: "מכשיר שמיעה", en: "A hearing aid" },
  { key: "first_flight", category: "firsts", emoji: "\ud83d\udeeb", he: "טיסה ראשונה", en: "A first flight" },
  { key: "long_trip", category: "firsts", emoji: "\ud83d\ude97", he: "נסיעה ארוכה או חופשה", en: "A long trip or holiday" },
  { key: "first_sleepover", category: "firsts", emoji: "\ud83c\udf1f", he: "לינה ראשונה אצל חבר או סבתא", en: "A first sleepover" },
  { key: "swimming_lesson", category: "firsts", emoji: "\ud83c\udfca", he: "שיעור שחייה או ים ראשון", en: "A first swimming lesson or the sea" },
  { key: "learning_to_ride", category: "firsts", emoji: "\ud83d\udeb2", he: "רכיבה על אופניים בלי גלגלי עזר", en: "Riding a bike without training wheels" },
  { key: "birthday_party", category: "firsts", emoji: "\ud83c\udf82", he: "יום הולדת עם אורחים", en: "A birthday party with guests" },
  { key: "family_event", category: "firsts", emoji: "\ud83c\udf89", he: "אירוע משפחתי (חתונה, ברית, בר מצווה)", en: "A family event (wedding, brit, bar mitzvah)" },
  { key: "zoo_or_museum", category: "firsts", emoji: "\ud83e\udd81", he: "יציאה לגן חיות, מוזיאון או הופעה", en: "A trip to the zoo, museum or a show" },
  { key: "friend_moving_away", category: "sensitive", emoji: "\ud83d\udc8c", he: "חבר או חברה שעוברים למקום אחר", en: "A close friend moving away" },
  { key: "goodbye_to_teacher", category: "sensitive", emoji: "\ud83c\udf38", he: "פרידה מגננת או ממורה אהובים", en: "Saying goodbye to a beloved teacher" },
  { key: "parent_illness", category: "sensitive", emoji: "\ud83d\udc9b", he: "הורה או קרוב שחולה או מאושפז", en: "A parent or relative who is ill" },
  { key: "pet_illness", category: "sensitive", emoji: "\ud83d\udc3e", he: "חיית מחמד מבוגרת או חולה", en: "An old or ill pet" },
  { key: "body_privacy", category: "sensitive", emoji: "\ud83d\udee1\ufe0f", he: "כללי פרטיות בגוף", en: "Body privacy rules" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Topic pickers
// ─────────────────────────────────────────────────────────────────────────────
// 51 topics is far too many for one grid, so the picker is two steps: a category
// question, then one topic question per category revealed by `showIf`. The parent sees
// six choices and then six-to-ten, instead of a wall of fifty-one.
//
// The chip VALUE is the display label, because that is what QuestionInput stores and what
// the parent sees. The stable key is recovered by topicKeyFromLabel() below and written to
// answers.topic_key by Questionnaire.jsx — a label can be reworded, a key cannot, and the
// sheet must carry the key.

const catLabel = (c, isEn) => `${c.emoji} ${isEn ? c.en : c.he}`;
const topicLabel = (t, isEn) => `${t.emoji} ${isEn ? t.en : t.he}`;

const OTHER_HE = '✍️ אחר — נספר במילים שלנו';
const OTHER_EN = '✍️ Other — we\'ll describe it ourselves';

function categoryQuestion(isEn) {
  return {
    key: 'topic_category',
    tag: 'together',
    question: isEn ? 'What are we getting ready for?' : 'לקראת מה מתכוננים?',
    type: 'emoji',
    required: true,
    options: [
      ...CATEGORIES.map((c) => ({ emoji: c.emoji, label: isEn ? c.en : c.he })),
      { emoji: '✍️', label: isEn ? 'Something else' : 'משהו אחר' },
    ],
  };
}

function topicQuestionsFor(isEn) {
  return CATEGORIES.map((c) => ({
    key: 'topic',
    tag: 'together',
    question: isEn ? 'Which one exactly?' : 'מה בדיוק?',
    type: 'chips',
    required: true,
    showIf: { dependsOn: 'topic_category', values: [isEn ? c.en : c.he] },
    options: [
      ...TOPICS.filter((t) => t.category === c.key).map((t) => topicLabel(t, isEn)),
      isEn ? OTHER_EN : OTHER_HE,
    ],
    // Two categories carry topics we will not invent content for. The pipeline refuses to
    // add anything the family did not state, so the questionnaire says so up front rather
    // than letting a parent discover it in the finished book.
    ...(c.key === 'sensitive'
      ? {
          hint: isEn
            ? 'For these, the book stays strictly with what you write below — it never adds an outcome, a diagnosis, or a goodbye you did not describe.'
            : 'בנושאים האלה הספר נצמד בדיוק למה שתכתבו למטה — הוא לא מוסיף תוצאה, אבחנה או פרידה שלא תיארתם.',
        }
      : {}),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Intro questions
// ─────────────────────────────────────────────────────────────────────────────
export const INTRO_QUESTIONS_HE = [
  { key: 'name', tag: 'child', question: 'מה שם הילד/ה?', type: 'text' },
  { key: 'age', tag: 'child', question: 'בן/בת כמה?', type: 'chips', options: ['2', '3', '4', '5', '6', '7', '8', '9', '10+'] },
  { key: 'gender', tag: 'child', question: 'מי אתה/את?', type: 'chips', options: ['ילד', 'ילדה', 'אחר/ת'] },
];

export const INTRO_QUESTIONS_EN = [
  { key: 'name', tag: 'child', question: "What's the child's name?", type: 'text' },
  { key: 'age', tag: 'child', question: 'How old are they?', type: 'chips', options: ['2', '3', '4', '5', '6', '7', '8', '9', '10+'] },
  { key: 'gender', tag: 'child', question: 'Are you a boy or a girl?', type: 'chips', options: ['Boy', 'Girl', 'Other'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Pages
// ─────────────────────────────────────────────────────────────────────────────
const PAGES_HE = [
  {
    id: 1,
    title: 'הנושא',
    questions: [
      categoryQuestion(false),
      ...topicQuestionsFor(false),
      {
        key: 'topic_free_text', tag: 'together', question: 'ספרו במילים שלכם מה הולך לקרות',
        type: 'textarea',
        hint: 'אם בחרתם "אחר" — כאן המקום. גם אם בחרתם נושא מהרשימה, שורה משלכם עוזרת.',
      },
      {
        key: 'when_it_happens', tag: 'together', question: 'מתי זה קורה?', type: 'text',
        hint: 'בעוד שבועיים · ב-1 בספטמבר · אחרי החג',
      },
    ],
  },
  {
    id: 2,
    title: 'מה יקרה',
    questions: [
      {
        key: 'steps_reported', tag: 'parent', question: 'מה בדיוק הולך לקרות — שלב אחרי שלב',
        type: 'textarea', required: true,
        hint: 'זו השאלה החשובה ביותר בשאלון. כתבו את הרצף כמו רשימה: קודם… אחר כך… ובסוף…',
      },
      {
        key: 'place_and_people', tag: 'parent', question: 'איפה זה יקרה ומי יהיה שם?',
        type: 'textarea',
        hint: 'המקום, ומי מהמבוגרים יהיה לצידו/ה — כדי שיֵדע/תדע למי לפנות',
      },
    ],
  },
  {
    id: 3,
    title: 'איך זה ירגיש',
    questions: [
      {
        key: 'sensory_reported', tag: 'parent', question: 'מה יראו, ישמעו או ירגישו בגוף?',
        type: 'textarea',
        hint: 'הפרטים הקטנים הם מה שמונע הפתעה: מנורה חזקה מלמעלה, רעש של מכשיר, ריח של בית חולים, עקצוץ של שנייה',
      },
      {
        key: 'child_role', tag: 'parent', question: 'מה התפקיד של הילד/ה — מה יוכל/תוכל לבחור או לעשות?',
        type: 'textarea',
        hint: 'אירוע שיש בו תפקיד הוא אירוע שמשתתפים בו: לארוז ארגז משלו, לבחור טעם, להרים יד כדי לעצור',
      },
      {
        key: 'staying_same', tag: 'parent', question: 'מה נשאר בדיוק אותו דבר?',
        type: 'textarea',
        hint: 'דברים קונקרטיים ובשמם — המיטה שלו/ה, מי מקריא סיפור בערב, שאמא נשארת בחדר',
      },
      {
        key: 'looking_forward', tag: 'together', question: 'משהו טוב אחד לצפות לו?',
        type: 'textarea',
        hint: 'רק אם באמת קיים. אם אין — עדיף להשאיר ריק מאשר להמציא.',
      },
    ],
  },
  {
    id: 4,
    title: 'שאלות שעלו',
    questions: [
      {
        key: 'has_worry', tag: 'parent', question: 'האם הילד/ה שאל/ה משהו או הביע/ה חשש?',
        type: 'chips', required: true, options: ['לא', 'כן'],
        hint: 'אם התשובה "לא" — הספר לא יזכיר שום חשש. זה מכוון: ספר יכול לשתול דאגה, לא רק לענות עליה.',
      },
      {
        key: 'worry_text', tag: 'parent', question: 'מה בדיוק נאמר — במילים של הילד/ה',
        type: 'textarea',
        showIf: { dependsOn: 'has_worry', values: ['כן'] },
        hint: 'ציטוט, לא פרשנות. "שאל אם אמא תחכה בחוץ" ולא "הוא חרד מנטישה".',
      },
      {
        key: 'what_helps', tag: 'together', question: 'מה בדרך כלל מרגיע אותו/ה?', type: 'emoji',
        options: [
          { emoji: '🤗', label: 'חיבוק' },
          { emoji: '📋', label: 'לדעת מראש' },
          { emoji: '❓', label: 'לשאול שאלות' },
          { emoji: '🧸', label: 'חפץ מהבית' },
          { emoji: '😂', label: 'הומור' },
          { emoji: '🌿', label: 'שקט' },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'על הילד/ה',
    questions: [
      {
        key: 'hobbies', tag: 'child', question: 'מה הכי אוהבים לעשות?', type: 'chips',
        multi: true, maxSelect: 3,
        options: ['לצייר וליצור', 'לבנות ולהרכיב', 'לשחק בחוץ', 'חיות', 'ספרים וסיפורים',
                  'לשיר ולרקוד', 'ספורט', 'לבשל ולאפות', 'מספרים וחידות', 'לעזור לאחרים'],
        parentField: { label: 'הורים — ספרו לנו בדיוק איך זה נראה אצלו/ה ♥' },
      },
      {
        key: 'strengths', tag: 'parent', question: 'במה הילד/ה טוב/ה?', type: 'textarea',
        hint: 'האנרגיה של הספר מגיעה מכאן — לא מהתגברות על קושי. סבלן, שם לב לפרטים, מסביר לאחרים.',
      },
      {
        key: 'theme', tag: 'child', question: 'באיזה עולם הסיפור מתרחש?', type: 'emoji',
        options: [
          { emoji: '🏡', label: 'סיפור מהחיים האמיתיים' },
          { emoji: '🌲', label: 'יער קסום וחיות מדברות' },
          { emoji: '🚀', label: 'חלל ומסע בין כוכבים' },
          { emoji: '🏰', label: 'ממלכה, ארמון ואבירים' },
          { emoji: '⚽', label: 'עולם הספורט' },
          { emoji: '🐠', label: 'עולם תת-ימי' },
        ],
        hint: 'ברירת המחדל היא "מהחיים האמיתיים", ולא סתם: ספר הכנה עובד הכי טוב כשהמקום בציור דומה למקום האמיתי.',
      },
      {
        key: 'companions', tag: 'child', question: 'מי מצטרף לסיפור?', type: 'chips', multi: true,
        options: ['הורים', 'אח/אחות', 'סבא/סבתא', 'חיית מחמד', 'חפץ אהוב'],
        hint: 'מי שלא הועלתה תמונה שלו יופיע בקול ובשם בלבד ולא יצויר — אנחנו לא ממציאים פנים של אדם אמיתי.',
      },
      { key: 'notes', tag: 'together', question: 'עוד משהו שנשמח לדעת? (או משהו שעדיף שלא יופיע)', type: 'textarea' },
    ],
  },
  {
    id: 6,
    title: 'תמונות',
    questions: [
      { key: 'photo', question: 'תמונה של הילד/ה', type: 'photo', required: true, consent: true },
      { key: 'family_photos', tag: 'together', question: 'תמונה של הורה (לא חובה)', type: 'family_photos' },
    ],
  },
];

const PAGES_EN = [
  {
    id: 1,
    title: 'The Topic',
    questions: [
      categoryQuestion(true),
      ...topicQuestionsFor(true),
      {
        key: 'topic_free_text', tag: 'together', question: 'Tell us in your own words what is coming up',
        type: 'textarea',
        hint: 'If you chose "Other", this is the place. Even if you picked from the list, a line of your own helps.',
      },
      {
        key: 'when_it_happens', tag: 'together', question: 'When is it happening?', type: 'text',
        hint: 'In two weeks · On September 1st · After the holiday',
      },
    ],
  },
  {
    id: 2,
    title: 'What Happens',
    questions: [
      {
        key: 'steps_reported', tag: 'parent', question: 'What exactly will happen — step by step',
        type: 'textarea', required: true,
        hint: 'This is the most important question here. Write the sequence like a list: first… then… and at the end…',
      },
      {
        key: 'place_and_people', tag: 'parent', question: 'Where will it happen, and who will be there?',
        type: 'textarea',
        hint: 'The place, and which grown-up will be beside them — so they know who to turn to',
      },
    ],
  },
  {
    id: 3,
    title: 'How It Will Feel',
    questions: [
      {
        key: 'sensory_reported', tag: 'parent', question: 'What will they see, hear or feel in their body?',
        type: 'textarea',
        hint: 'The small details are what prevent a surprise: a bright lamp overhead, the noise of a machine, a hospital smell, a pinch that lasts a second',
      },
      {
        key: 'child_role', tag: 'parent', question: 'What is their role — what can they choose or do?',
        type: 'textarea',
        hint: 'An event you have a job in is one you take part in: packing their own box, choosing a flavour, raising a hand to pause',
      },
      {
        key: 'staying_same', tag: 'parent', question: 'What stays exactly the same?',
        type: 'textarea',
        hint: 'Concrete things, by name — their own bed, who reads the bedtime story, that Mum stays in the room',
      },
      {
        key: 'looking_forward', tag: 'together', question: 'One good thing to look forward to?',
        type: 'textarea',
        hint: 'Only if there really is one. If not, better to leave it empty than to invent it.',
      },
    ],
  },
  {
    id: 4,
    title: 'Questions Raised',
    questions: [
      {
        key: 'has_worry', tag: 'parent', question: 'Has the child asked about it or expressed a worry?',
        type: 'chips', required: true, options: ['No', 'Yes'],
        hint: 'If "No", the book will mention no worry at all. That is deliberate: a book can plant a worry, not only answer one.',
      },
      {
        key: 'worry_text', tag: 'parent', question: "What exactly was said — in the child's own words",
        type: 'textarea',
        showIf: { dependsOn: 'has_worry', values: ['Yes'] },
        hint: 'A quote, not an interpretation. "Asked if Mum will wait outside", not "he has separation anxiety".',
      },
      {
        key: 'what_helps', tag: 'together', question: 'What usually helps them settle?', type: 'emoji',
        options: [
          { emoji: '🤗', label: 'A hug' },
          { emoji: '📋', label: 'Knowing in advance' },
          { emoji: '❓', label: 'Asking questions' },
          { emoji: '🧸', label: 'Something from home' },
          { emoji: '😂', label: 'Humour' },
          { emoji: '🌿', label: 'Quiet' },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'About Them',
    questions: [
      {
        key: 'hobbies', tag: 'child', question: 'What do you love doing most?', type: 'chips',
        multi: true, maxSelect: 3,
        options: ['Drawing and creating', 'Building', 'Playing outside', 'Animals', 'Books and stories',
                  'Singing and dancing', 'Sports', 'Cooking and baking', 'Numbers and puzzles', 'Helping others'],
        parentField: { label: 'Parents — tell us exactly what this looks like for them ♥' },
      },
      {
        key: 'strengths', tag: 'parent', question: 'What are they good at?', type: 'textarea',
        hint: 'The energy of this book comes from here — not from overcoming a difficulty. Patient, notices details, explains things to others.',
      },
      {
        key: 'theme', tag: 'child', question: 'Which world does the story happen in?', type: 'emoji',
        options: [
          { emoji: '🏡', label: 'Real life story' },
          { emoji: '🌲', label: 'Magical forest and talking animals' },
          { emoji: '🚀', label: 'Space and intergalactic travel' },
          { emoji: '🏰', label: 'Kingdom, castle and knights' },
          { emoji: '⚽', label: 'Sports world' },
          { emoji: '🐠', label: 'Ocean and underwater world' },
        ],
        hint: 'The default is "real life", and for good reason: a preparation book works best when the place in the pictures resembles the real one.',
      },
      {
        key: 'companions', tag: 'child', question: 'Who joins the story?', type: 'chips', multi: true,
        options: ['Parents', 'Brother/Sister', 'Grandparent', 'Pet', 'A favourite toy'],
        hint: 'Anyone without an uploaded photo appears by voice and name only, never drawn — we do not invent a real person\'s face.',
      },
      { key: 'notes', tag: 'together', question: 'Anything else we should know? (or anything to leave out)', type: 'textarea' },
    ],
  },
  {
    id: 6,
    title: 'Photos',
    questions: [
      { key: 'photo', question: "The child's photo", type: 'photo', required: true, consent: true },
      { key: 'family_photos', tag: 'together', question: 'A parent\'s photo (optional)', type: 'family_photos' },
    ],
  },
];

export function getPages(lang) {
  return lang === 'en' ? PAGES_EN : PAGES_HE;
}

export function getIntroQuestions(lang) {
  return lang === 'en' ? INTRO_QUESTIONS_EN : INTRO_QUESTIONS_HE;
}

/**
 * Display label → stable topic key ("🦷 ביקור אצל רופא/ת שיניים" → "dentist_visit").
 *
 * The chip stores the label because that is what the parent sees, but the sheet must
 * carry the key: labels get reworded, keys do not, and perpare_child_story/topics.py
 * looks the topic up by key. Questionnaire.jsx calls this whenever the topic answer
 * changes and stores the result in answers.topic_key.
 *
 * Returns '' for the "Other" chip — deliberate. An unrecognised topic is a real case:
 * data_processor falls back to identifying it from topic_free_text, and if that fails
 * too the book is written from the family's own words with no topic-specific guidance.
 */
export function topicKeyFromLabel(label) {
  if (!label) return '';
  const hit = TOPICS.find((t) => label.includes(t.he) || label.includes(t.en));
  return hit ? hit.key : '';
}
