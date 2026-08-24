// The shared library of daily-routine steps.
//
// Two activities are built on it — the routine board and First–Then — so it
// lives in `shared/` rather than inside either one. Unlike the card components
// here, this is DATA, not a component layer: both consumers existed the moment
// it was written, so it is not a speculative abstraction.
//
// `part` groups a step under morning / day / evening in the picker. It is only
// a grouping hint; nothing stops a child putting a bath in the morning.

export const PARTS = ['morning', 'day', 'evening'];

export const PART_LABELS = {
  he: { morning: 'בוקר', day: 'יום', evening: 'ערב' },
  en: { morning: 'Morning', day: 'Day', evening: 'Evening' },
};

export const STEPS = [
  // ---- morning ----
  { id: 'wake', part: 'morning', emoji: '☀️', he: 'קמים', en: 'Wake up' },
  { id: 'toilet', part: 'morning', emoji: '🚽', he: 'שירותים', en: 'Toilet' },
  { id: 'wash_face', part: 'morning', emoji: '💦', he: 'שוטפים פנים', en: 'Wash face' },
  { id: 'brush_morning', part: 'morning', emoji: '🪥', he: 'מצחצחים שיניים', en: 'Brush teeth' },
  { id: 'dressed', part: 'morning', emoji: '👕', he: 'מתלבשים', en: 'Get dressed' },
  { id: 'breakfast', part: 'morning', emoji: '🥣', he: 'ארוחת בוקר', en: 'Breakfast' },
  { id: 'pack_bag', part: 'morning', emoji: '🎒', he: 'מכינים תיק', en: 'Pack the bag' },
  { id: 'shoes', part: 'morning', emoji: '👟', he: 'נועלים נעליים', en: 'Put on shoes' },
  { id: 'goodbye', part: 'morning', emoji: '👋', he: 'נפרדים', en: 'Say goodbye' },
  { id: 'travel', part: 'morning', emoji: '🚗', he: 'בדרך', en: 'On the way' },

  // ---- day ----
  { id: 'school', part: 'day', emoji: '🏫', he: 'גן או בית ספר', en: 'School or nursery' },
  { id: 'lunch', part: 'day', emoji: '🍽️', he: 'ארוחת צהריים', en: 'Lunch' },
  { id: 'rest', part: 'day', emoji: '🛋️', he: 'מנוחה', en: 'Rest' },
  { id: 'homework', part: 'day', emoji: '📚', he: 'שיעורי בית', en: 'Homework' },
  { id: 'play', part: 'day', emoji: '🧩', he: 'משחק', en: 'Play' },
  { id: 'outside', part: 'day', emoji: '🌳', he: 'בחוץ', en: 'Outside' },
  { id: 'friends', part: 'day', emoji: '👫', he: 'חברים', en: 'Friends' },
  { id: 'club', part: 'day', emoji: '⚽', he: 'חוג', en: 'Activity club' },
  { id: 'screen', part: 'day', emoji: '📺', he: 'זמן מסך', en: 'Screen time' },
  { id: 'snack', part: 'day', emoji: '🍎', he: 'חטיף', en: 'Snack' },

  // ---- evening ----
  { id: 'dinner', part: 'evening', emoji: '🍝', he: 'ארוחת ערב', en: 'Dinner' },
  { id: 'tidy', part: 'evening', emoji: '🧺', he: 'מסדרים', en: 'Tidy up' },
  { id: 'bath', part: 'evening', emoji: '🛁', he: 'מקלחת', en: 'Bath' },
  { id: 'pajamas', part: 'evening', emoji: '🩳', he: 'פיג׳מה', en: 'Pyjamas' },
  { id: 'brush_night', part: 'evening', emoji: '🪥', he: 'מצחצחים שיניים', en: 'Brush teeth' },
  { id: 'story', part: 'evening', emoji: '📖', he: 'סיפור', en: 'Story' },
  { id: 'hug', part: 'evening', emoji: '🤗', he: 'חיבוק לילה טוב', en: 'Goodnight hug' },
  { id: 'sleep', part: 'evening', emoji: '🌙', he: 'שינה', en: 'Sleep' },
];

export const CUSTOM_EMOJI = '⭐';

export function stepLabel(step, lang) {
  return typeof step[lang] === 'string' ? step[lang] : step.he;
}

export function stepsByPart(part) {
  return STEPS.filter((step) => step.part === part);
}
