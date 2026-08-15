// Quick check-in result copy per situation category.
// DRAFT copy — not clinically reviewed. Keep wording as "may/often/can", never diagnostic.
export const CHECKIN_SITUATIONS = [
  { key: 'chip_new', en: 'Starting something new', he: 'מתחילים משהו חדש' },
  { key: 'chip_fear', en: 'Dealing with fear', he: 'מתמודדים עם פחד' },
  { key: 'chip_moving', en: 'Moving house', he: 'עוברים דירה' },
  { key: 'chip_friendship', en: 'Friendship challenges', he: 'קשיים חברתיים' },
  { key: 'chip_separation', en: 'Separation', he: 'פרידה' },
  { key: 'chip_emotions', en: 'Big emotions', he: 'רגשות גדולים' },
  { key: 'chip_other', en: 'Something else', he: 'משהו אחר' },
];

export const CHECKIN_FEELINGS = [
  { key: 'worried', en: 'Worried', he: 'דואג/ת' },
  { key: 'sad', en: 'Sad', he: 'עצוב/ה' },
  { key: 'angry', en: 'Angry', he: 'כועס/ת' },
  { key: 'unsure', en: 'Not sure yet', he: 'עדיין לא ברור' },
];

export const CHECKIN_RESULTS = {
  chip_new: {
    en: 'Starting something new often brings a mix of excitement and worry, even when a child seems fine on the surface. A personalized story and a simple routine together can make the unfamiliar feel a little more familiar.',
    he: 'התחלה של משהו חדש לרוב מביאה תערובת של התרגשות ודאגה, גם כשהילד/ה נראה/ית בסדר כלפי חוץ. סיפור מותאם אישית ושגרה פשוטה ביחד יכולים לעזור להפוך את הבלתי מוכר למוכר יותר.',
  },
  chip_fear: {
    en: "Fears at this age are common and usually pass with time, patience, and a sense of being understood. A personalized story can give your child gentle language for what they're feeling, and a starting point for talking about it together.",
    he: 'פחדים בגיל הזה נפוצים ולרוב חולפים עם זמן, סבלנות ותחושה של הבנה. סיפור מותאם אישית יכול לתת לילד/ה שפה עדינה למה שהוא/היא מרגיש/ה, ונקודת פתיחה לדבר על זה יחד.',
  },
  chip_moving: {
    en: 'At this age, children often worry less about the move itself and more about what will stay the same. A personalized story and a short activity together can help open that conversation.',
    he: 'בגיל הזה ילדים לרוב דואגים פחות מהמעבר עצמו ויותר ממה שישאר כמו שהיה. סיפור מותאם אישית ופעילות קצרה ביחד יכולים לעזור לפתוח את השיחה הזו.',
  },
  chip_friendship: {
    en: 'Friendship difficulties can feel very big to a child, even when they seem small from the outside. A personalized story can help your child feel understood, and open the door to talking about what happened.',
    he: 'קשיים חברתיים יכולים להרגיש לילד/ה גדולים מאוד, גם כשהם נראים קטנים מבחוץ. סיפור מותאם אישית יכול לעזור לילד/ה להרגיש מובנ/ת, ולפתוח פתח לשיחה על מה שקרה.',
  },
  chip_separation: {
    en: 'Separation moments, like morning goodbyes, are one of the most common challenges families navigate. A consistent routine and a personalized story can make those moments feel calmer for both of you.',
    he: 'רגעי פרידה, כמו פרידות בוקר, הם אחד האתגרים הנפוצים ביותר שמשפחות מתמודדות איתם. שגרה עקבית וסיפור מותאם אישית יכולים לעזור להפוך את הרגעים האלה לרגועים יותר עבור שניכם.',
  },
  chip_emotions: {
    en: "Big emotions are a normal part of growing up, even when they feel overwhelming in the moment. A personalized story can help your child find words for what they're feeling, and help you both navigate it together.",
    he: 'רגשות גדולים הם חלק טבעי מהגדילה, גם כשהם מרגישים מציפים ברגע נתון. סיפור מותאם אישית יכול לעזור לילד/ה למצוא מילים למה שהוא/היא מרגיש/ה, ולעזור לשניכם להתמודד עם זה ביחד.',
  },
  chip_other: {
    en: 'Every family goes through moments like this. A personalized story, built around what your child is going through right now, can be a gentle way to start the conversation.',
    he: 'כל משפחה עוברת רגעים כאלה. סיפור מותאם אישית, שנבנה סביב מה שהילד/ה שלכם עובר/ת עכשיו, יכול להיות דרך עדינה לפתוח את השיחה.',
  },
};