// Opposites — "יום הפוך". Inhibitory control, after the Day–Night task
// (Gerstadt, Hong & Diamond): see the sun, choose the moon. The pull to tap
// what you see is the thing being practised — stopping it.
// The "switch" level adds a changing rule (same / opposite) signalled by the
// card's frame — cognitive flexibility, as in the Dimensional Change Card Sort.
//
// Deliberately no timer: speed pressure turns an inhibition game into a
// frustration game for the children this site is for.

export const PAIRS = [
  { a: 'sun', b: 'moon', he: ['שמש', 'ירח'], en: ['Sun', 'Moon'] },
  { a: 'happy', b: 'sad', he: ['שמח', 'עצוב'], en: ['Happy', 'Sad'] },
  { a: 'big', b: 'small', he: ['גדול', 'קטן'], en: ['Big', 'Small'] },
  { a: 'up', b: 'down', he: ['למעלה', 'למטה'], en: ['Up', 'Down'] },
  { a: 'hot', b: 'cold', he: ['חם', 'קר'], en: ['Hot', 'Cold'] },
  { a: 'awake', b: 'asleep', he: ['ער', 'ישן'], en: ['Awake', 'Asleep'] },
];

export const LEVELS = [
  { id: 'same', rule: 'same', he: 'אותו דבר', en: 'Same', ages: '3–4' },
  { id: 'opp', rule: 'opp', he: 'יום הפוך', en: 'Opposite day', ages: '4–7' },
  { id: 'mix', rule: 'mix', he: 'מתחלף', en: 'Switching', ages: '7–9' },
];

export const ROUNDS = 10;

export const UI = {
  he: {
    title: 'יום הפוך',
    subtitle: 'טופי מרים שלט. ביום רגיל רצים לשלט עם אותו דבר — וכשיורד לילה, רצים להפך!',
    intro: 'טופי ירים שלט, ושני שלטים יחכו לכם בצדדים. ביום — רוצו לאותו דבר. כשיורד לילה — רוצו להפך! בין שלט לשלט חוזרים לעיגול באמצע.',
    back: 'לכל המשחקים',
    start: 'להתחיל!',
    ready: 'חזרו לעיגול הצהוב באמצע',
    ruleSame: 'יום! רוצו לשלט עם אותו הדבר',
    ruleOpp: 'לילה — יום הפוך! רוצו לשלט עם ההפך',
    good: 'יפה!',
    oopsOpp: 'אופס, זה אותו דבר. בלילה בוחרים את ההפך — נסו את השלט השני',
    oopsSame: 'אופס, זה ההפך. ביום בוחרים אותו דבר — נסו את השלט השני',
    round: 'שלט {n}/{total}',
    doneTitle: 'כל הכבוד!',
    doneText: 'עצרתם את הרגליים בדיוק כשצריך.',
    again: 'עוד סיבוב',
    harder: 'לרמה הבאה',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'אפשר לשחק את זה גם בלי מסך: "כשאני אומר יום — תגידו לילה". בחיים עצמם, המשפט "רגע, בוא נעצור ונחשוב" מאמן בדיוק את אותו שריר.',
    whyLabel: 'למה זה עוזר',
    why: 'עיכוב תגובה — היכולת לעצור את מה שבא אוטומטית ולעשות את מה שנכון — מתפתח מאוד בין גיל 3 ל־7. משחקים כמו "יום-לילה" ו"שמעון אומר" משמשים גם למדידה וגם לאימון שלו, וקשורים למוכנות ללימודים.',
  },
  en: {
    title: 'Opposite Day',
    subtitle: 'Topi holds up a sign. By day, run to the sign with the same thing — when night falls, run to the opposite!',
    intro: 'Topi will hold up a sign, with two signs waiting on either side. By day, run to the same thing. When night falls, run to the opposite! Between signs, go back to the circle in the middle.',
    back: 'All games',
    start: 'Start!',
    ready: 'Go back to the yellow circle in the middle',
    ruleSame: 'Day! Run to the sign with the same thing',
    ruleOpp: 'Night — opposite day! Run to the opposite',
    good: 'Nice!',
    oopsOpp: "Oops, that's the same. At night we pick the opposite — try the other sign",
    oopsSame: "Oops, that's the opposite. By day we pick the same — try the other sign",
    round: 'Sign {n}/{total}',
    doneTitle: 'Well done!',
    doneText: 'You stopped your feet exactly when you needed to.',
    again: 'Another round',
    harder: 'Next level',
    parentTipLabel: 'Tip for parents',
    parentTip:
      `Play it without a screen too: "When I say day — you say night." In real life, "wait, let's stop and think" trains exactly the same muscle.`,
    whyLabel: 'Why it helps',
    why: 'Inhibitory control — stopping the automatic response and doing the right one — grows fast between ages 3 and 7. Games like Day–Night and Simon Says are used both to measure and to practise it, and it is linked to school readiness.',
  },
};

export const META = {
  he: { title: 'יום הפוך | משחק ויסות תלת-ממדי | StoryLeap', description: 'רצים לשלט הנכון — ביום אותו דבר, בלילה ההפך. משחק עיכוב תגובה וגמישות בתלת-ממד לגילאי 3–9.' },
  en: { title: 'Opposite Day | 3D Self-Control Game | StoryLeap', description: 'Run to the right sign — the same by day, the opposite by night. A 3D self-control game for ages 3–9.' },
};
