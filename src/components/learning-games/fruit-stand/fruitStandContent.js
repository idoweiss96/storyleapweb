// Fruit stand — a 3D management game (the "serve the customers" genre) with
// counting as the core mechanic, not a quiz glued on top:
//   - a customer asks for N fruit;
//   - the player stands at a crate and fruit stacks up one at a time, each
//     with its number and a rising tone — the child decides when to stop;
//   - delivering the exact amount earns coins, coins unlock new crates.
// The "memory" level hides the order after a few seconds (working memory).

export const FRUITS = {
  apple: { he: 'תפוחים', heOne: 'תפוח', en: 'apples', enOne: 'apple', icon: 'apple' },
  banana: { he: 'בננות', heOne: 'בננה', en: 'bananas', enOne: 'banana', icon: 'banana' },
  carrot: { he: 'גזרים', heOne: 'גזר', en: 'carrots', enOne: 'carrot', icon: 'carrot' },
};

// Crates along the back wall. `price` 0 = open from the start.
export const STATIONS = [
  { type: 'apple', x: -4.2, price: 0 },
  { type: 'banana', x: 0, price: 5 },
  { type: 'carrot', x: 4.2, price: 12 },
];

export const CUSTOMER_SPECIES = ['bear', 'cat', 'dog', 'fox', 'panda', 'koala', 'frog', 'penguin', 'bunny', 'turtle'];

export const LEVELS = [
  { id: 'count', mode: 'count', max: 5, he: 'סופרים', en: 'Counting', ages: '3–6' },
  { id: 'mix', mode: 'mix', max: 4, he: 'הזמנה כפולה', en: 'Double orders', ages: '5–8' },
  { id: 'memory', mode: 'memory', max: 5, he: 'מהזיכרון', en: 'From memory', ages: '7–11' },
];

export const CUSTOMERS_PER_ROUND = 8;
export const MAX_CARRY = 10;

export const UI = {
  he: {
    title: 'דוכן הפירות',
    subtitle: 'לקוחות מגיעים לדוכן ומבקשים פירות. אוספים בדיוק כמה שביקשו, מגישים, ומרוויחים מטבעות לפתוח ארגזים חדשים.',
    back: 'לכל המשחקים',
    start: 'לפתוח את הדוכן!',
    howTo: 'שימו אצבע על המשחק וגררו כדי ללכת (או חצים במקלדת)',
    goPick: 'לכו לארגז ה{fruit} ועמדו עליו',
    picking: 'עומדים על הארגז — כל פרי נערם על הידיים. עוצרים כשיש מספיק!',
    goServe: 'יש לכם {n} {fruit}. לכו ללקוח שמחכה!',
    thanks: 'תודה! בדיוק מה שביקשתי',
    tooMany: 'ביקשתי רק {need} — נשארו לכם עוד {extra} {fruit}. את מה שמיותר מחזירים לסל',
    tooManyOne: 'ביקשתי רק {need} — נשאר לכם עוד {fruit} אחד. אפשר להחזיר אותו לסל',
    needMore: 'עוד {n} {fruit}, בבקשה',
    wrongFruit: 'אני צריך/ה {fruit}, לא את זה',
    full: 'הידיים מלאות!',
    trash: 'הסל מחזיר פירות מיותרים',
    unlockHint: 'יש לכם מספיק מטבעות — עמדו על המשבצת כדי לפתוח ארגז חדש',
    unlocked: 'נפתח ארגז {fruit}!',
    coins: 'מטבעות',
    served: 'לקוחות: {n}/{total}',
    carrying: 'בידיים',
    memoryHide: 'זכרו את ההזמנה — היא תיעלם עוד רגע!',
    peek: 'לחצו להציץ',
    doneTitle: 'יום עבודה מוצלח!',
    doneText: 'שירתם {n} לקוחות והרווחתם {coins} מטבעות.',
    again: 'יום חדש',
    harder: 'לרמה הבאה',
    joystick: 'גררו כדי ללכת',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'שבו ליד הילד ותספרו יחד בקול כשהפירות נערמים: "אחד, שתיים, שלוש — עוצרים!". ההחלטה מתי לעצור היא בדיוק הרגע שבו הספירה הופכת לכמות.',
    whyLabel: 'למה זה עוזר',
    why: 'איסוף מספר מבוקש של חפצים ("תביא לי שלושה") הוא משימה קלאסית להערכת הבנת כמות אצל ילדים — הילד צריך להבין שהמספר האחרון שנספר הוא כמה יש (עקרון הקרדינליות). כאן זה קורה עשרות פעמים, עם משוב מיידי, בתוך משחק שהילד רוצה להמשיך בו. ברמה העליונה ההזמנה נעלמת ומאמנת גם זיכרון עבודה.',
  },
  en: {
    title: 'The Fruit Stand',
    subtitle: 'Customers come to the stand and ask for fruit. Collect exactly what they asked for, serve it, and earn coins to open new crates.',
    back: 'All games',
    start: 'Open the stand!',
    howTo: 'Put a finger on the game and drag to walk (or use the arrow keys)',
    goPick: 'Walk to the {fruit} crate and stand on it',
    picking: 'Standing on the crate — each fruit stacks up in your arms. Stop when you have enough!',
    goServe: 'You have {n} {fruit}. Take them to the waiting customer!',
    thanks: 'Thank you! Exactly what I asked for',
    tooMany: 'I only asked for {need} — you still have {extra} {fruit}. Extra fruit goes back in the basket',
    tooManyOne: 'I only asked for {need} — you have one {fruit} left over. The basket takes it back',
    needMore: '{n} more {fruit}, please',
    wrongFruit: 'I need {fruit}, not that',
    full: 'Your arms are full!',
    trash: 'The basket takes back extra fruit',
    unlockHint: 'You have enough coins — stand on the tile to open a new crate',
    unlocked: 'The {fruit} crate is open!',
    coins: 'Coins',
    served: 'Customers: {n}/{total}',
    carrying: 'Carrying',
    memoryHide: 'Remember the order — it will disappear in a moment!',
    peek: 'Tap to peek',
    doneTitle: 'A great day at the stand!',
    doneText: 'You served {n} customers and earned {coins} coins.',
    again: 'New day',
    harder: 'Next level',
    joystick: 'Drag to walk',
    parentTipLabel: 'Tip for parents',
    parentTip:
      'Sit with your child and count out loud as the fruit stacks up: "one, two, three — stop!". Deciding when to stop is exactly the moment counting turns into quantity.',
    whyLabel: 'Why it helps',
    why: 'Collecting a requested number of objects ("give me three") is the classic task for checking whether a child understands quantity — that the last number counted is how many there are (the cardinality principle). Here it happens dozens of times, with instant feedback, inside a game the child wants to keep playing. The top level hides the order, adding working memory.',
  },
};

export const META = {
  he: { title: 'דוכן הפירות | משחק ניהול תלת-ממדי לספירה | StoryLeap', description: 'משחק תלת-ממדי לילדים: מנהלים דוכן פירות, סופרים הזמנות ללקוחות ופותחים ארגזים חדשים. גילאי 3–11.' },
  en: { title: 'The Fruit Stand | 3D Counting Game | StoryLeap', description: 'A 3D game for kids: run a fruit stand, count out orders for customers and unlock new crates. Ages 3–11.' },
};
