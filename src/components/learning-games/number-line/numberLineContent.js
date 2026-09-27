// Number line — "הדוור". Number-line estimation (Siegler & Booth) as a walk:
// a street where only the first and the last house are built. The child
// carries a letter for house N and leaves it where they think N stands; the
// real house then grows out of the ground in its true place. Only the ends
// are labelled — numbering every spot would turn estimation into counting.

export const LEVELS = [
  { id: '10', max: 10, ticks: true, he: '0–10', en: '0–10', ages: '5–6' },
  { id: '20', max: 20, ticks: true, he: '0–20', en: '0–20', ages: '6–7' },
  { id: '100', max: 100, ticks: false, he: '0–100', en: '0–100', ages: '7–9' },
  { id: '1000', max: 1000, ticks: false, he: '0–1000', en: '0–1000', ages: '9–11' },
];

export const ROUNDS = 6;
export const RESIDENTS = ['bear', 'cat', 'dog', 'fox', 'panda', 'koala', 'frog', 'penguin', 'bunny', 'turtle'];

export const UI = {
  he: {
    title: 'הדוור',
    subtitle: 'ברחוב יש רק את הבית הראשון והבית האחרון. לוקחים מכתב ומשאירים אותו איפה שחושבים שהבית שלו יהיה.',
    intro: 'אתם הדוורים של הרחוב! רק שני בתים כבר בנויים — הראשון והאחרון. הביאו כל מכתב למקום שבו אתם חושבים שהבית שלו עומד.',
    back: 'לכל המשחקים',
    start: 'לחלק מכתבים!',
    carry: 'מכתב לבית {n}. לכו לאן שאתם חושבים שהוא, ולחצו "כאן!"',
    drop: 'כאן!',
    bullseye: 'בול! בית {n} בדיוק כאן',
    close: 'ממש קרוב! בית {n} ממש ליד',
    far: 'הנה בית {n}. שמתם את המכתב ליד {g} — בפעם הבאה נתקרב',
    round: 'מכתב {n}/{total}',
    doneTitle: 'כל המכתבים חולקו!',
    doneText: 'הרחוב התמלא בבתים. הדגלים מראים איפה שמתם את המכתבים — ראו כמה קרוב!',
    again: 'רחוב חדש',
    harder: 'רחוב ארוך יותר',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'לפני שהילד עוצר, שאלו: "זה יותר קרוב לבית הראשון, לאחרון, או לאמצע?" — השאלה הזו היא בדיוק המיומנות שהמשחק מאמן.',
    whyLabel: 'למה זה עוזר',
    why: 'הדיוק של ילדים בהערכה על ישר המספרים מנבא את ההישגים שלהם בחשבון. מחקרים של סיגלר ועמיתיו מראים שתרגול קצר עם משוב — "הנה איפה שהמספר באמת גר" — משפר את התחושה לגודל של מספרים.',
  },
  en: {
    title: 'The Postman',
    subtitle: 'Only the first and last houses are built. Take a letter and leave it where you think its house will stand.',
    intro: "You're the street's postman! Only two houses are built — the first and the last. Take each letter to where you think its house stands.",
    back: 'All games',
    start: 'Deliver letters!',
    carry: 'A letter for house {n}. Walk to where you think it is and press "Here!"',
    drop: 'Here!',
    bullseye: 'Spot on! House {n} is right here',
    close: 'So close! House {n} is right next to it',
    far: "Here's house {n}. You left the letter near {g} — next time we'll get closer",
    round: 'Letter {n}/{total}',
    doneTitle: 'Every letter delivered!',
    doneText: 'The street is full of houses. The flags show where you left each letter — see how close!',
    again: 'New street',
    harder: 'A longer street',
    parentTipLabel: 'Tip for parents',
    parentTip:
      'Before your child stops, ask: "Is it closer to the first house, the last one, or the middle?" That question is exactly the skill the game trains.',
    whyLabel: 'Why it helps',
    why: "How accurately children place numbers on a line predicts their maths achievement. Studies by Siegler and colleagues show that brief practice with feedback — \"here is where the number really lives\" — sharpens children's sense of how big numbers are.",
  },
};

export const META = {
  he: { title: 'הדוור | משחק ישר מספרים תלת-ממדי | StoryLeap', description: 'מחלקים מכתבים ברחוב שבו רק הבית הראשון והאחרון בנויים — משחק הערכה על ישר המספרים לגילאי 5–11.' },
  en: { title: 'The Postman | 3D Number Line Game | StoryLeap', description: 'Deliver letters on a street where only the first and last houses are built — a number-line estimation game for ages 5–11.' },
};
