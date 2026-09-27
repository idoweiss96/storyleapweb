// Shapes — "בונים תמונה". Fill a picture's silhouette with shapes: spatial
// assembly, the skill tangram and block play train.
//
// Geometry lives on a unit grid. A piece is one of the base polygons below,
// turned `rot` quarter-turns clockwise and placed so its bounding box starts
// at (x, y). Two orientations that give the same outline (a square at any
// angle, a rectangle at 0° and 180°) are treated as the same — see geometry.js.

const SEMI = [[0, 1]]
  .concat(Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI + ((i + 1) * Math.PI) / 12;
    return [1 + Math.cos(a), 1 + Math.sin(a)];
  }))
  .concat([[2, 1]]);

export const BASE = {
  sq1: [[0, 0], [1, 0], [1, 1], [0, 1]],
  sq2: [[0, 0], [2, 0], [2, 2], [0, 2]],
  rect: [[0, 0], [2, 0], [2, 1], [0, 1]],
  roof: [[1, 0], [2, 1], [0, 1]],
  roof4: [[2, 0], [4, 2], [0, 2]],
  tri1: [[0, 0], [1, 1], [0, 1]],
  tri2: [[0, 0], [2, 2], [0, 2]],
  semi: SEMI,
};

export const PALETTE = ['#FF6FB5', '#4FC3E8', '#F5C842', '#5BC98C', '#A78BFA', '#FF9F5A', '#EF6B6B'];

export const PUZZLES = {
  house: {
    he: 'בית', en: 'House',
    slots: [
      { type: 'roof4', x: 0, y: 0, rot: 0, color: '#EF6B6B' },
      { type: 'sq2', x: 0, y: 2, rot: 0, color: '#F5C842' },
      { type: 'sq2', x: 2, y: 2, rot: 0, color: '#4FC3E8' },
    ],
  },
  icecream: {
    he: 'גלידה', en: 'Ice cream',
    slots: [
      { type: 'semi', x: 0, y: 0, rot: 0, color: '#FF9CC8' },
      { type: 'rect', x: 0, y: 1, rot: 0, color: '#A78BFA' },
      { type: 'roof', x: 0, y: 2, rot: 2, color: '#F2C27B' },
    ],
  },
  tree: {
    he: 'עץ', en: 'Tree',
    slots: [
      { type: 'semi', x: 0, y: 0, rot: 0, color: '#5BC98C' },
      { type: 'semi', x: 0, y: 1, rot: 2, color: '#3E9E68' },
      { type: 'rect', x: 0.5, y: 2, rot: 1, color: '#B98A63' },
    ],
  },
  treeGround: {
    he: 'עץ על דשא', en: 'Tree on grass',
    slots: [
      { type: 'semi', x: 1, y: 0, rot: 0, color: '#5BC98C' },
      { type: 'semi', x: 1, y: 1, rot: 2, color: '#3E9E68' },
      { type: 'rect', x: 1.5, y: 2, rot: 1, color: '#B98A63' },
      { type: 'rect', x: 1, y: 4, rot: 0, color: '#8FDB9C' },
    ],
  },
  boat: {
    he: 'סירה', en: 'Boat',
    slots: [
      { type: 'tri2', x: 1, y: 0, rot: 0, color: '#FFFFFF' },
      { type: 'tri1', x: 0, y: 2, rot: 2, color: '#EF6B6B' },
      { type: 'rect', x: 1, y: 2, rot: 0, color: '#FF9F5A' },
      { type: 'tri1', x: 3, y: 2, rot: 1, color: '#EF6B6B' },
    ],
  },
  fish: {
    he: 'דג', en: 'Fish',
    slots: [
      { type: 'semi', x: 0, y: 0, rot: 0, color: '#4FC3E8' },
      { type: 'semi', x: 0, y: 1, rot: 2, color: '#8FD4F0' },
      { type: 'roof', x: 2, y: 0, rot: 3, color: '#FF9F5A' },
    ],
  },
  rocket: {
    he: 'חללית', en: 'Rocket',
    slots: [
      { type: 'roof', x: 1, y: 0, rot: 0, color: '#EF6B6B' },
      { type: 'sq2', x: 1, y: 1, rot: 0, color: '#FFFFFF' },
      { type: 'sq2', x: 1, y: 3, rot: 0, color: '#8FD4F0' },
      { type: 'tri1', x: 0, y: 4, rot: 3, color: '#FF6FB5' },
      { type: 'tri1', x: 3, y: 4, rot: 0, color: '#FF6FB5' },
      { type: 'roof', x: 1, y: 5, rot: 2, color: '#F5C842' },
    ],
  },
};

// easy: outlines of every piece shown, pieces already turned the right way.
// medium: outlines shown, some pieces need turning.
// hard: only the silhouette, pieces need turning.
export const LEVELS = [
  { id: 'easy', outlines: true, turned: false, puzzles: ['house', 'icecream', 'tree'], he: 'קל', en: 'Easy', ages: '3–5' },
  { id: 'mid', outlines: true, turned: true, puzzles: ['fish', 'boat', 'treeGround'], he: 'בינוני', en: 'Medium', ages: '5–7' },
  { id: 'hard', outlines: false, turned: true, puzzles: ['fish', 'house', 'boat', 'rocket'], he: 'צללית', en: 'Silhouette', ages: '7–10' },
];

export const UI = {
  he: {
    title: 'אתר הבנייה',
    subtitle: 'על הרצפה יש שרטוט. מרימים חלקים מהחצר, מסובבים אותם ומניחים כל אחד במקום שלו.',
    intro: 'הדובה הבנאית צריכה עזרה! הרימו חלק מהחצר, הביאו אותו לשרטוט הכחול ועמדו על המקום שלו. אם הוא לא נכנס — סובבו אותו.',
    back: 'לכל המשחקים',
    start: 'לבנות!',
    pickHint: 'עמדו על חלק בחצר כדי להרים אותו',
    carryHint: 'הביאו את החלק לשרטוט ועמדו על המקום שלו. לא מתאים? לחצו "לסובב"',
    placed: 'נכנס בול!',
    turnIt: 'הצורה נכונה — צריך לסובב אותה',
    notHere: 'החלק הזה לא מתאים לכאן. נסו מקום אחר',
    rotate: 'לסובב',
    built: '{name}! בניתם את זה מצורות',
    picture: 'בנייה {n}/{total}',
    doneTitle: 'כל הבניינים עומדים!',
    doneText: 'בניתם את כל התמונות ברמה הזו.',
    again: 'מההתחלה',
    harder: 'לרמה הבאה',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'דברו על החלקים במילים של מקום וכיוון: "המשולש הולך למעלה", "סובב אותו הצידה". שפה מרחבית כזו קשורה בעצמה ליכולות מרחביות טובות יותר.',
    whyLabel: 'למה זה עוזר',
    why: 'הרכבת צורות לתוך צללית היא אחת המשימות שבהן מודדים חשיבה מרחבית בגיל הגן. חשיבה מרחבית קשורה להישגים במתמטיקה, ומחקרים מצאו שאפילו תרגול קצר בסיבוב צורות שיפר ביצועי חשבון אצל ילדים בגילאי 6–8.',
  },
  en: {
    title: 'The Building Site',
    subtitle: 'There is a blueprint on the ground. Pick up pieces from the yard, turn them, and put each one in its place.',
    intro: 'The builder bear needs help! Pick up a piece from the yard, bring it to the blue blueprint and stand on its spot. If it will not fit — turn it.',
    back: 'All games',
    start: 'Build!',
    pickHint: 'Stand on a piece in the yard to pick it up',
    carryHint: 'Bring the piece to the blueprint and stand on its spot. No fit? Press "Turn"',
    placed: 'A perfect fit!',
    turnIt: 'Right shape — it needs turning',
    notHere: "That piece doesn't fit there. Try another spot",
    rotate: 'Turn',
    built: '{name}! You built it out of shapes',
    picture: 'Build {n}/{total}',
    doneTitle: 'Every building stands!',
    doneText: 'You built every picture on this level.',
    again: 'Start over',
    harder: 'Next level',
    parentTipLabel: 'Tip for parents',
    parentTip:
      'Talk about the pieces with place and direction words: "the triangle goes on top", "turn it sideways". That kind of spatial language is itself linked to stronger spatial skills.',
    whyLabel: 'Why it helps',
    why: 'Fitting shapes into a silhouette is one of the tasks used to measure spatial thinking in preschoolers. Spatial thinking is linked to maths achievement, and one study found even a short session of shape-rotation puzzles improved arithmetic in 6- to 8-year-olds.',
  },
};

export const META = {
  he: { title: 'אתר הבנייה | משחק חשיבה מרחבית תלת-ממדי | StoryLeap', description: 'מרימים חלקים, מסובבים ומניחים בשרטוט — משחק טנגרם תלת-ממדי לגילאי 3–10.' },
  en: { title: 'The Building Site | 3D Spatial Thinking Game | StoryLeap', description: 'Pick up pieces, turn them and fit them into the blueprint — a 3D tangram-style game for ages 3–10.' },
};
