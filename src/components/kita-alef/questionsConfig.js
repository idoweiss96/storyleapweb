export const PAGES = [
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
      { key: 'photo', tag: 'together', question: 'תמונה (אופציונלי)', type: 'photo' },
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
        options: ['פרידה מאמא/אבא', 'לא למצוא חברים', 'שהלמידה תהיה קשה', 'המורה', 'לא לדעת לקרוא', 'שום דבר — הכל בסדר!']
      },
      {
        key: 'separation_feelings', tag: 'together', question: 'איך מרגישים בפרידות?', type: 'emoji',
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