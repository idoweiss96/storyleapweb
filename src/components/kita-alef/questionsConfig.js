const PAGES_HE = [
  {
    id: 1,
    title: 'מי אתה/את?',
    questions: [
      { key: 'name', tag: 'together', question: 'מה השם שלך?', type: 'text' },
      { key: 'gender', tag: 'together', question: 'מי אתה/את?', type: 'chips', options: ['ילד', 'ילדה', 'אחר/ת'] },
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
        parentField: { label: 'הורה — ספרו לילד/ה מה הכוח שאתם רואים בו/בה ♥' }
      },
      { key: 'photo', tag: 'together', question: 'תמונה שלך (אופציונלי)', type: 'photo' },
    ]
  },
  {
    id: 2,
    title: 'רגשות',
    questions: [
      {
        key: 'feelings_before', tag: 'child', question: 'איך מרגישים לקראת כיתה א?', type: 'emoji',
        options: [
          { emoji: '🎉', label: 'סופר מתרגש' },
          { emoji: '😊', label: 'בסדר גמור' },
          { emoji: '🤔', label: 'לא בטוח/ה' },
          { emoji: '😬', label: 'קצת מפחד/ת' },
          { emoji: '😰', label: 'מפחד/ת' },
        ],
        parentField: { label: 'הורה — שתפו גם אתם: איזה רגש מגיע אליכם?' }
      },
      {
        key: 'scary_things', tag: 'together', question: 'מה נראה קצת מפחיד?', type: 'chips', multi: true,
        showIf: { dependsOn: 'feelings_before', values: ['קצת מפחד/ת', 'מפחד/ת'] },
        options: ['פרידה מאמא/אבא', 'לא למצוא חברים', 'שהלמידה תהיה קשה', 'המורה', 'לא לדעת לקרוא', 'שום דבר — הכל בסדר!']
      },
      {
        key: 'separation_feelings', tag: 'together', question: 'איך מרגישים בפרידות?', type: 'emoji',
        showIf: { dependsOn: 'feelings_before', values: ['קצת מפחד/ת', 'מפחד/ת'] },
        options: [
          { emoji: '😎', label: 'קל לי' },
          { emoji: '🙂', label: 'קצת קשה' },
          { emoji: '😟', label: 'קשה לי' },
          { emoji: '😢', label: 'מאוד קשה' },
        ],
        parentField: { label: 'רשמו כאן מילה או משפט שיכולים לעזור' }
      },
    ]
  },
  {
    id: 3,
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
        parentField: { label: 'הורה — ספרו לו/ה מה אותו/ה אדם חושב על כיתה א׳' }
      },
      { key: 'gan_friends', tag: 'together', question: 'יש חברים מהגן שגם עולים לכיתה א׳?', type: 'textarea' },
      { key: 'sibling_experience', tag: 'together', question: 'יש אח/ות גדול/ה שעבר/ה את זה? מה הוא/היא אמר/ה?', type: 'textarea' },
      { key: 'family_photos', tag: 'together', question: 'תמונות של בני משפחה (אופציונלי)', type: 'family_photos' },
    ]
  },
  {
    id: 4,
    title: 'מה אוהבים?',
    questions: [
      {
        key: 'activities', tag: 'together', question: 'מה הכי אוהבים לעשות?', type: 'chips', multi: true, maxSelect: 3,
        options: ['לצייר/ליצור', 'לשחק בחוץ', 'לבנות/להרכיב', 'לקרוא/לשמוע סיפורים', 'לשיר/לרקוד', 'לשחק עם חברים', 'משחקי מחשב', 'לעזור למבוגרים']
      },
      {
        key: 'hero', tag: 'child', question: 'יש גיבור/ה שהכי אוהב/ת?', type: 'textarea',
        hint: 'הורה — שאלו: למה הוא/היא הגיבור/ה שלך?'
      },
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
    id: 5,
    title: 'כיתה א׳',
    questions: [
      {
        key: 'looking_forward', tag: 'child', question: 'מה הכי מחכים לו/לה בכיתה א׳?', type: 'emoji',
        options: [
          { emoji: '📖', label: 'ללמוד לקרוא' },
          { emoji: '🧑‍🤝‍🧑', label: 'חברים חדשים' },
          { emoji: '✏️', label: 'לכתוב' },
          { emoji: '🍱', label: 'הפסקה' },
          { emoji: '🎒', label: 'התיק החדש' },
          { emoji: '🤷', label: 'לא יודע/ת' },
        ],
        parentField: { label: 'הורה — שתפו ממה הייתם מתרגשים בגיל הזה' }
      },
      {
        key: 'one_worry', tag: 'together', question: 'איזה דבר אחד קצת מדאיג?', type: 'textarea',
        showIf: { dependsOn: 'feelings_before', values: ['קצת מפחד/ת', 'מפחד/ת'] },
        hint: 'כתבו יחד...'
      },
      {
        key: 'visited_school', tag: 'together', question: 'ביקרתם כבר בבית הספר?', type: 'chips',
        options: ['כן כמה פעמים', 'פעם אחת', 'עוד לא', 'לא מתכננים']
      },
    ]
  },
  {
    id: 6,
    title: 'משאלות',
    questions: [
      {
        key: 'wish_self', tag: 'child', question: 'מה אתה/את מאחל/ת לעצמך לכיתה א׳?', type: 'emoji',
        options: [
          { emoji: '🧑‍🤝‍🧑', label: 'חבר טוב' },
          { emoji: '😊', label: 'להיות שמח/ה' },
          { emoji: '📚', label: 'ללמוד הרבה' },
          { emoji: '🌈', label: 'כיף כל יום' },
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
          { emoji: '🌟', label: 'שתאמין בעצמך' },
          { emoji: '🤝', label: 'שתמצא חברים' },
        ],
        parentField: { label: 'הורה — זה הרגע לומר לו/ה ישירות ♥' }
      },
    ]
  },
];

const PAGES_EN = [
  {
    id: 1,
    title: 'Who are you?',
    questions: [
      { key: 'name', tag: 'together', question: "What's your name?", type: 'text' },
      { key: 'gender', tag: 'together', question: 'Are you a boy or a girl?', type: 'chips', options: ['Boy', 'Girl', 'Other'] },
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
        parentField: { label: "Parent — tell your child what strength you see in them ♥" }
      },
      { key: 'photo', tag: 'together', question: 'Your photo (optional)', type: 'photo' },
    ]
  },
  {
    id: 2,
    title: 'Feelings',
    questions: [
      {
        key: 'feelings_before', tag: 'child', question: 'How do you feel about starting 1st grade?', type: 'emoji',
        options: [
          { emoji: '🎉', label: 'Super excited' },
          { emoji: '😊', label: 'Fine' },
          { emoji: '🤔', label: 'Not sure' },
          { emoji: '😬', label: 'A little scared' },
          { emoji: '😰', label: 'Scared' },
        ],
        parentField: { label: 'Parent — share too: what feeling comes up for you?' }
      },
      {
        key: 'scary_things', tag: 'together', question: 'What seems a little scary?', type: 'chips', multi: true,
        showIf: { dependsOn: 'feelings_before', values: ['A little scared', 'Scared'] },
        options: ['Separation from mom/dad', 'Not making friends', 'That learning will be hard', 'The teacher', 'Not knowing how to read', "Nothing — it's all fine!"]
      },
      {
        key: 'separation_feelings', tag: 'together', question: 'How do separations feel?', type: 'emoji',
        showIf: { dependsOn: 'feelings_before', values: ['A little scared', 'Scared'] },
        options: [
          { emoji: '😎', label: 'Easy for me' },
          { emoji: '🙂', label: 'A little hard' },
          { emoji: '😟', label: 'Hard' },
          { emoji: '😢', label: 'Very hard' },
        ],
        parentField: { label: 'Write a word or sentence that could help' }
      },
    ]
  },
  {
    id: 3,
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
        parentField: { label: "Parent — tell them what that person thinks about 1st grade" }
      },
      { key: 'gan_friends', tag: 'together', question: 'Are there friends from kindergarten also going to 1st grade?', type: 'textarea' },
      { key: 'sibling_experience', tag: 'together', question: 'Is there an older sibling who went through this? What did they say?', type: 'textarea' },
      { key: 'family_photos', tag: 'together', question: 'Photos of family members (optional)', type: 'family_photos' },
    ]
  },
  {
    id: 4,
    title: 'What do you love?',
    questions: [
      {
        key: 'activities', tag: 'together', question: 'What do you love doing most?', type: 'chips', multi: true, maxSelect: 3,
        options: ['Drawing/Creating', 'Playing outside', 'Building/Assembling', 'Reading/Hearing stories', 'Singing/Dancing', 'Playing with friends', 'Computer games', 'Helping adults']
      },
      {
        key: 'hero', tag: 'child', question: 'Is there a hero/heroine you love?', type: 'textarea',
        hint: 'Parent — ask: why are they your hero?'
      },
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
    id: 5,
    title: '1st Grade',
    questions: [
      {
        key: 'looking_forward', tag: 'child', question: 'What are you most looking forward to in 1st grade?', type: 'emoji',
        options: [
          { emoji: '📖', label: 'Learning to read' },
          { emoji: '🧑‍🤝‍🧑', label: 'New friends' },
          { emoji: '✏️', label: 'Writing' },
          { emoji: '🍱', label: 'Recess' },
          { emoji: '🎒', label: 'The new bag' },
          { emoji: '🤷', label: "Don't know" },
        ],
        parentField: { label: 'Parent — share what you would have been excited about at this age' }
      },
      {
        key: 'one_worry', tag: 'together', question: 'What one thing is a bit worrying?', type: 'textarea',
        showIf: { dependsOn: 'feelings_before', values: ['A little scared', 'Scared'] },
        hint: 'Write together...'
      },
      {
        key: 'visited_school', tag: 'together', question: 'Have you visited the school yet?', type: 'chips',
        options: ['Yes, a few times', 'Once', 'Not yet', 'Not planning to']
      },
    ]
  },
  {
    id: 6,
    title: 'Wishes',
    questions: [
      {
        key: 'wish_self', tag: 'child', question: 'What do you wish for yourself for 1st grade?', type: 'emoji',
        options: [
          { emoji: '🧑‍🤝‍🧑', label: 'A good friend' },
          { emoji: '😊', label: 'To be happy' },
          { emoji: '📚', label: 'To learn a lot' },
          { emoji: '🌈', label: 'Fun every day' },
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
          { emoji: '🌟', label: 'That you will believe in yourself' },
          { emoji: '🤝', label: 'That you will make friends' },
        ],
        parentField: { label: 'Parent — this is the moment to tell them directly ♥' }
      },
    ]
  },
];

export function getPages(lang) {
  return lang === 'en' ? PAGES_EN : PAGES_HE;
}

export const PAGES = PAGES_HE;