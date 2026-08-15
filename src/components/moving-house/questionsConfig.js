// Content config for the "Moving House" companion questionnaire.
// Structure mirrors src/components/kita-alef/questionsConfig.js exactly (intro Qs + 6 pages),
// with topic-adapted content. The KitaAlef config file itself is never touched.

export const INTRO_QUESTIONS_HE = [
  { key: 'name', tag: 'child', question: 'מה השם שלך?', type: 'text' },
  { key: 'gender', tag: 'child', question: 'מי אתה/את?', type: 'chips', options: ['ילד', 'ילדה', 'אחר/ת'] },
  {
    key: 'strength', tag: 'child', question: 'מה הכוח הכי גדול שלך?', type: 'emoji',
    options: [
      { emoji: '🤝', label: 'לעזור' },
      { emoji: '🎨', label: 'ליצור' },
      { emoji: '😄', label: 'להצחיק' },
      { emoji: '💡', label: 'לחשוב' },
      { emoji: '🏃', label: 'לזוז מהר' },
      { emoji: '🤗', label: 'לאהוב' },
    ],
    parentField: { label: 'הורה: ספרו לילד/ה מה הכוח שאתם רואים בו/בה ♥' }
  },
];

const PAGES_HE = [
  {
    id: 1,
    title: 'רגשות',
    questions: [
      {
        key: 'feelings_about_move', tag: 'child', question: 'איך מרגישים לגבי המעבר?', type: 'emoji',
        options: [
          { emoji: '🎉', label: 'סופר מתרגש' },
          { emoji: '😊', label: 'בסדר גמור' },
          { emoji: '🤔', label: 'לא בטוח/ה' },
          { emoji: '😬', label: 'קצת חושש/ת' },
          { emoji: '😰', label: 'חושש/ת מאוד' },
        ],
        parentField: { label: 'הורה — שתפו גם אתם: איזה רגש מגיע אליכם?' }
      },
      {
        key: 'unsettling_things', tag: 'together', question: 'מה עלול להרגיש קצת לא יציב?', type: 'chips', multi: true,
        showIf: { dependsOn: 'feelings_about_move', values: ['לא בטוח/ה', 'קצת חושש/ת', 'חושש/ת מאוד'] },
        options: ['לעזוב את החדר שלי', 'להתרחק מחברים', 'בית ספר/גן חדש', 'לא להכיר את הבית החדש', 'שום דבר, הכל בסדר!']
      },
      {
        key: 'goodbye_hard', tag: 'together', question: 'ממה הכי קשה להיפרד?', type: 'textarea',
        hint: 'כתבו יחד...'
      },
    ]
  },
  {
    id: 2,
    title: 'מי חשוב לך?',
    questions: [
      {
        key: 'favorite_person', tag: 'child', question: 'מי האדם שהכי אוהב/ת לבלות איתו/ה?', type: 'emoji',
        options: [
          { emoji: '👨‍👩‍👧', label: 'אמא/אבא' },
          { emoji: '👴', label: 'סבא/סבתא' },
          { emoji: '👫', label: 'חבר/ה' },
          { emoji: '👦', label: 'אח/ות' },
          { emoji: '🐾', label: 'חיית מחמד' },
        ],
        parentField: { label: 'הורה: ספרו לו/ה מה אותו/ה אדם חושב על המעבר' }
      },
      { key: 'friends_stay_close', tag: 'together', question: 'עם אילו חברים תרצו להישאר בקשר?', type: 'textarea' },
      { key: 'staying_in_touch_idea', tag: 'together', question: 'יש רעיון איך להישאר בקשר? (שיחות וידאו, מכתבים...)', type: 'textarea' },
    ]
  },
  {
    id: 3,
    title: 'מה אוהבים?',
    questions: [
      {
        key: 'activities', tag: 'together', question: 'מה הכי אוהבים לעשות?', type: 'chips', multi: true, maxSelect: 3,
        options: ['לצייר/ליצור', 'לשחק בחוץ', 'לבנות/להרכיב', 'לקרוא/לשמוע סיפורים', 'לשיר/לרקוד', 'לשחק עם חברים', 'משחקי מחשב', 'לעזור למבוגרים']
      },
      { key: 'favorite_thing_from_home', tag: 'child', question: 'יש חפץ או צעצוע אהוב שחשוב לקחת איתך?', type: 'textarea' },
      {
        key: 'comfort', tag: 'together', question: 'כשקצת לא בנוח — מה הכי עוזר?', type: 'emoji',
        options: [
          { emoji: '🤗', label: 'חיבוק' },
          { emoji: '💬', label: 'לדבר' },
          { emoji: '🎮', label: 'משחק' },
          { emoji: '🏠', label: 'חפץ מהבית' },
          { emoji: '😂', label: 'הומור' },
          { emoji: '🌿', label: 'שקט' },
        ],
      },
    ]
  },
  {
    id: 4,
    title: 'המעבר',
    questions: [
      {
        key: 'whats_changing', tag: 'together', question: 'מה משתנה עם המעבר?', type: 'chips', multi: true,
        options: ['חדר חדש', 'גן/בית ספר חדש', 'שכונה חדשה', 'חברים חדשים', 'מרחק מחברים ישנים']
      },
      { key: 'whats_staying_same', tag: 'together', question: 'מה נשאר אותו דבר, גם אחרי המעבר?', type: 'textarea' },
      {
        key: 'new_home_feeling', tag: 'child', question: 'איך מרגישים לגבי הבית החדש?', type: 'emoji',
        options: [
          { emoji: '🤩', label: 'מתרגש/ת' },
          { emoji: '🧐', label: 'סקרן/ית' },
          { emoji: '🤔', label: 'לא בטוח/ה' },
          { emoji: '😟', label: 'קצת עצבני/ת' },
        ],
      },
    ]
  },
  {
    id: 5,
    title: 'משאלות',
    questions: [
      {
        key: 'wish_self', tag: 'child', question: 'מה אתה/את מאחל/ת לעצמך בבית החדש?', type: 'emoji',
        options: [
          { emoji: '🧑‍🤝‍🧑', label: 'חבר טוב' },
          { emoji: '🏠', label: 'להרגיש בבית מהר' },
          { emoji: '😊', label: 'להיות שמח/ה' },
          { emoji: '💪', label: 'להיות אמיץ/ה' },
          { emoji: '🌟', label: 'להאמין בעצמי' },
        ],
        parentField: { label: 'רשמו כאן משאלה נוספת' }
      },
      {
        key: 'wish_parent', tag: 'child', question: 'מה לדעתך ההורה שלך מאחל לך?', type: 'emoji',
        options: [
          { emoji: '❤️', label: 'שתהיה אהוב/ה' },
          { emoji: '💪', label: 'שתהיה חזק/ה' },
          { emoji: '😄', label: 'שתהיה שמח/ה' },
          { emoji: '🤝', label: 'שתמצא חברים' },
        ],
        parentField: { label: 'הורה: זה הרגע לומר לו/ה ישירות ♥' }
      },
    ]
  },
  {
    id: 6,
    title: 'תמונות',
    questions: [
      { key: 'photo', question: 'תמונה שלך', type: 'photo', required: true, consent: true },
      { key: 'family_photos', tag: 'together', question: 'תמונות של בני משפחה (אופציונלי)', type: 'family_photos' },
    ]
  },
];

export const INTRO_QUESTIONS_EN = [
  { key: 'name', tag: 'child', question: "What's your name?", type: 'text' },
  { key: 'gender', tag: 'child', question: 'Are you a boy or a girl?', type: 'chips', options: ['Boy', 'Girl', 'Other'] },
  {
    key: 'strength', tag: 'child', question: "What's your biggest strength?", type: 'emoji',
    options: [
      { emoji: '🤝', label: 'Helping' },
      { emoji: '🎨', label: 'Creating' },
      { emoji: '😄', label: 'Making people laugh' },
      { emoji: '💡', label: 'Thinking' },
      { emoji: '🏃', label: 'Running fast' },
      { emoji: '🤗', label: 'Loving' },
    ],
    parentField: { label: "Parent: tell your child what strength you see in them ♥" }
  },
];

const PAGES_EN = [
  {
    id: 1,
    title: 'Feelings',
    questions: [
      {
        key: 'feelings_about_move', tag: 'child', question: 'How do you feel about the move?', type: 'emoji',
        options: [
          { emoji: '🎉', label: 'Super excited' },
          { emoji: '😊', label: 'Fine' },
          { emoji: '🤔', label: 'Not sure' },
          { emoji: '😬', label: 'A little worried' },
          { emoji: '😰', label: 'Very worried' },
        ],
        parentField: { label: 'Parent — share too: what feeling comes up for you?' }
      },
      {
        key: 'unsettling_things', tag: 'together', question: 'What might feel a little unsettling?', type: 'chips', multi: true,
        showIf: { dependsOn: 'feelings_about_move', values: ['Not sure', 'A little worried', 'Very worried'] },
        options: ['Leaving my room', 'Being far from friends', 'A new school/kindergarten', 'Not knowing the new home', "Nothing, it's all fine!"]
      },
      {
        key: 'goodbye_hard', tag: 'together', question: "What's hardest to say goodbye to?", type: 'textarea',
        hint: 'Write together...'
      },
    ]
  },
  {
    id: 2,
    title: 'Who matters to you?',
    questions: [
      {
        key: 'favorite_person', tag: 'child', question: 'Who do you love spending time with the most?', type: 'emoji',
        options: [
          { emoji: '👨‍👩‍👧', label: 'Mom/Dad' },
          { emoji: '👴', label: 'Grandpa/Grandma' },
          { emoji: '👫', label: 'Friend' },
          { emoji: '👦', label: 'Brother/Sister' },
          { emoji: '🐾', label: 'Pet' },
        ],
        parentField: { label: 'Parent: tell them what that person thinks about the move' }
      },
      { key: 'friends_stay_close', tag: 'together', question: "Which friends do you want to stay in touch with?", type: 'textarea' },
      { key: 'staying_in_touch_idea', tag: 'together', question: 'Any idea how to stay in touch? (video calls, letters...)', type: 'textarea' },
    ]
  },
  {
    id: 3,
    title: 'What do you love?',
    questions: [
      {
        key: 'activities', tag: 'together', question: 'What do you love doing most?', type: 'chips', multi: true, maxSelect: 3,
        options: ['Drawing/Creating', 'Playing outside', 'Building/Assembling', 'Reading/Hearing stories', 'Singing/Dancing', 'Playing with friends', 'Computer games', 'Helping adults']
      },
      { key: 'favorite_thing_from_home', tag: 'child', question: 'Is there a favorite toy or object important to bring along?', type: 'textarea' },
      {
        key: 'comfort', tag: 'together', question: "When you're a bit uncomfortable — what helps most?", type: 'emoji',
        options: [
          { emoji: '🤗', label: 'Hug' },
          { emoji: '💬', label: 'Talking' },
          { emoji: '🎮', label: 'Play' },
          { emoji: '🏠', label: 'Object from home' },
          { emoji: '😂', label: 'Humor' },
          { emoji: '🌿', label: 'Quiet' },
        ],
      },
    ]
  },
  {
    id: 4,
    title: 'The Move',
    questions: [
      {
        key: 'whats_changing', tag: 'together', question: "What's changing with the move?", type: 'chips', multi: true,
        options: ['New room', 'New school/kindergarten', 'New neighborhood', 'New friends', 'Distance from old friends']
      },
      { key: 'whats_staying_same', tag: 'together', question: "What will stay the same, even after the move?", type: 'textarea' },
      {
        key: 'new_home_feeling', tag: 'child', question: 'How do you feel about the new home?', type: 'emoji',
        options: [
          { emoji: '🤩', label: 'Excited' },
          { emoji: '🧐', label: 'Curious' },
          { emoji: '🤔', label: 'Not sure' },
          { emoji: '😟', label: 'A little nervous' },
        ],
      },
    ]
  },
  {
    id: 5,
    title: 'Wishes',
    questions: [
      {
        key: 'wish_self', tag: 'child', question: 'What do you wish for yourself in the new home?', type: 'emoji',
        options: [
          { emoji: '🧑‍🤝‍🧑', label: 'A good friend' },
          { emoji: '🏠', label: 'To feel at home quickly' },
          { emoji: '😊', label: 'To be happy' },
          { emoji: '💪', label: 'To be brave' },
          { emoji: '🌟', label: 'To believe in myself' },
        ],
        parentField: { label: 'Write an additional wish here' }
      },
      {
        key: 'wish_parent', tag: 'child', question: 'What do you think your parent wishes for you?', type: 'emoji',
        options: [
          { emoji: '❤️', label: 'That you will be loved' },
          { emoji: '💪', label: 'That you will be strong' },
          { emoji: '😄', label: 'That you will be happy' },
          { emoji: '🤝', label: 'That you will make friends' },
        ],
        parentField: { label: 'Parent: this is the moment to tell them directly ♥' }
      },
    ]
  },
  {
    id: 6,
    title: 'Photos',
    questions: [
      { key: 'photo', question: 'Your photo', type: 'photo', required: true, consent: true },
      { key: 'family_photos', tag: 'together', question: 'Photos of family members (optional)', type: 'family_photos' },
    ]
  },
];

export function getPages(lang) {
  return lang === 'en' ? PAGES_EN : PAGES_HE;
}

export function getIntroQuestions(lang) {
  return lang === 'en' ? INTRO_QUESTIONS_EN : INTRO_QUESTIONS_HE;
}