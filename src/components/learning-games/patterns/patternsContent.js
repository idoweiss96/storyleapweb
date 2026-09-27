// Patterns — "רכבת הדפוסים". What comes next? Repeating patterns for the
// youngest, then a missing piece in the middle, then number sequences.
// Pattern knowledge in preschool predicts later maths (Rittle-Johnson et al.).

export const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];

export const SHAPE_NAMES = {
  he: { circle: 'עיגול ורוד', square: 'ריבוע תכלת', triangle: 'משולש צהוב', star: 'כוכב סגול', heart: 'לב אדום', diamond: 'מעוין ירוק' },
  en: { circle: 'pink circle', square: 'blue square', triangle: 'yellow triangle', star: 'purple star', heart: 'red heart', diamond: 'green diamond' },
};

export const LEVELS = [
  { id: 'a', kind: 'repeat', templates: ['AB', 'AAB', 'ABB'], gapAtEnd: true, options: 3, he: 'צבעים וצורות', en: 'Colours & shapes', ages: '3–5' },
  { id: 'b', kind: 'repeat', templates: ['ABC', 'AABB', 'ABBC', 'ABAC'], gapAtEnd: false, options: 3, he: 'חסר באמצע', en: 'Missing middle', ages: '5–7' },
  { id: 'c', kind: 'number', he: 'מספרים', en: 'Numbers', ages: '7–11' },
];

export const ROUNDS = 8;

export const UI = {
  he: {
    title: 'תחנת הרכבת',
    subtitle: 'הרכבת מגיעה עם קרונות מסודרים בדפוס — וקרון אחד ריק. מביאים מהרציף את הארגז שחסר, והרכבת יוצאת לדרך.',
    intro: 'הפינגווין הכרטיסן צריך עזרה! לכל רכבת יש קרון ריק. מצאו את הדפוס, הרימו מהרציף את הארגז הנכון והביאו אותו לקרון.',
    back: 'לכל המשחקים',
    start: 'לתחנה!',
    pickHint: 'מה חסר בקרון הריק? עמדו על הארגז הנכון כדי להרים אותו',
    carryHint: 'הביאו את הארגז לעיגול שמול הקרון הריק',
    good: 'בדיוק! כולם לעלות — הרכבת יוצאת!',
    look: 'הממ… זה לא מתאים. הסתכלו שוב על הקרונות — מה חוזר על עצמו?',
    lookNumbers: 'הממ… בכמה המספר גדל או קטן כל פעם?',
    arriving: 'רכבת נכנסת לתחנה…',
    round: 'רכבת {n}/{total}',
    doneTitle: 'כל הרכבות יצאו לדרך!',
    doneText: 'מצאתם את כל הדפוסים.',
    again: 'עוד יום בתחנה',
    harder: 'לרמה הבאה',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'בקשו מהילד "לקרוא" את הקרונות בקול — "עיגול, ריבוע, עיגול, ריבוע". אחרי כן חפשו יחד דפוסים בבית: פסים על חולצה, אריחים, מחיאות כפיים.',
    whyLabel: 'למה זה עוזר',
    why: 'זיהוי דפוסים והשלמתם הם הבסיס לחשיבה אלגברית — להבין "כלל" שחוזר. מחקרים של ריטל-ג׳ונסון ועמיתיה מצאו שידע על דפוסים בגן מנבא הישגים במתמטיקה שנים אחר כך, גם אחרי שמביאים בחשבון יכולות אחרות.',
  },
  en: {
    title: 'The Train Station',
    subtitle: 'A train arrives with its wagons in a pattern — and one wagon empty. Bring the missing crate from the platform and the train sets off.',
    intro: 'The conductor penguin needs help! Every train has one empty wagon. Find the pattern, pick up the right crate from the platform and bring it to the wagon.',
    back: 'All games',
    start: 'To the station!',
    pickHint: 'What is missing in the empty wagon? Stand on the right crate to pick it up',
    carryHint: 'Bring the crate to the circle in front of the empty wagon',
    good: 'Exactly! All aboard — the train is off!',
    look: "Hmm… that doesn't fit. Look at the wagons again — what keeps repeating?",
    lookNumbers: 'Hmm… by how much does the number grow or shrink each time?',
    arriving: 'A train is pulling in…',
    round: 'Train {n}/{total}',
    doneTitle: 'Every train is on its way!',
    doneText: 'You found every pattern.',
    again: 'Another day at the station',
    harder: 'Next level',
    parentTipLabel: 'Tip for parents',
    parentTip:
      'Ask your child to "read" the wagons out loud — "circle, square, circle, square". Then hunt for patterns at home together: stripes on a shirt, floor tiles, clapping rhythms.',
    whyLabel: 'Why it helps',
    why: 'Spotting and extending patterns is the root of algebraic thinking — grasping a rule that repeats. Research by Rittle-Johnson and colleagues found preschool pattern knowledge predicts maths achievement years later, even after accounting for other skills.',
  },
};

export const META = {
  he: { title: 'תחנת הרכבת | משחק דפוסים תלת-ממדי | StoryLeap', description: 'משלימים את הקרון החסר ברכבת — דפוסי צורות וסדרות מספרים בתלת-ממד, לגילאי 3–11.' },
  en: { title: 'The Train Station | 3D Patterns Game | StoryLeap', description: 'Fill the missing wagon — shape patterns and number sequences in 3D, for ages 3–11.' },
};
