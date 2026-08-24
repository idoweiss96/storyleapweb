// Content for the Task Analysis activity.
//
// Authored once, read at runtime, never generated.
//
// HOW THIS DIFFERS FROM THE OTHER SEQUENCE ACTIVITIES.
// The routine board covers a whole day. First–Then covers two steps. The ADL
// sequences hand over a ready-made strip. This one is a BUILDER: you take one
// task that is hard in your house and break it down yourself — and then mark,
// per step, how much help it currently needs.
//
// That last column is the point. A task is rarely "hard" as a whole; usually two
// steps out of seven are, and those are the ones worth working on.

// Parent-facing wording for what professionals call prompt levels.
export const HELP_LEVELS = [
  { id: 'alone', emoji: '🌟', color: '#7DCE82', he: 'לבד', en: 'On my own' },
  { id: 'reminder', emoji: '💬', color: '#FFC94D', he: 'עם תזכורת', en: 'With a reminder' },
  { id: 'show', emoji: '👀', color: '#FF8A6B', he: 'עם הדגמה', en: 'With a demonstration' },
  { id: 'hands', emoji: '🤝', color: '#9B8FD8', he: 'עם עזרה', en: 'With hands-on help' },
];

// Only a few examples — the free-text path is the main one here.
export const EXAMPLES = [
  {
    id: 'morning',
    emoji: '🎒',
    he: { label: 'להתארגן בבוקר', steps: ['לקום מהמיטה', 'ללכת לשירותים', 'להתלבש', 'לאכול ארוחת בוקר', 'לצחצח שיניים', 'לקחת את התיק', 'לנעול נעליים'] },
    en: { label: 'Getting ready in the morning', steps: ['Get out of bed', 'Go to the toilet', 'Get dressed', 'Eat breakfast', 'Brush teeth', 'Take the bag', 'Put on shoes'] },
  },
  {
    id: 'bedtime',
    emoji: '🌙',
    he: { label: 'להתארגן לשינה', steps: ['לסדר את הצעצועים', 'להתקלח', 'ללבוש פיג׳מה', 'לצחצח שיניים', 'לבחור ספר', 'לקרוא ביחד', 'לכבות אור'] },
    en: { label: 'Getting ready for bed', steps: ['Tidy the toys', 'Have a bath', 'Put on pyjamas', 'Brush teeth', 'Choose a book', 'Read together', 'Lights out'] },
  },
  {
    id: 'homework',
    emoji: '📚',
    he: { label: 'לשבת לשיעורי בית', steps: ['לפנות את השולחן', 'להוציא את הציוד', 'לבדוק מה צריך לעשות', 'להתחיל מהמשימה הקלה', 'לעשות הפסקה קצרה', 'לסיים את השאר', 'להחזיר לתיק'] },
    en: { label: 'Sitting down to homework', steps: ['Clear the desk', 'Get the supplies out', 'Check what needs doing', 'Start with the easy one', 'Take a short break', 'Finish the rest', 'Pack it back in the bag'] },
  },
];

export const UI = {
  he: {
    title: 'פירוק משימה',
    subtitle: 'לוקחים משימה אחת שקשה בבית, מפרקים אותה לצעדים קטנים, ומסמנים לכל צעד כמה עזרה הוא צריך היום.',
    taskLabel: 'איזו משימה נפרק?',
    taskPlaceholder: 'למשל: להתארגן לחוג',
    examplesLabel: 'או להתחיל מדוגמה',
    stepsTitle: 'הצעדים',
    stepPlaceholder: 'מה הצעד הבא?',
    addStep: 'להוסיף צעד',
    removeStep: 'להוריד את הצעד',
    moveUp: 'להזיז למעלה',
    moveDown: 'להזיז למטה',
    helpTitle: 'כמה עזרה צריך היום?',
    helpHint: 'לוחצים על הרמה שמתאימה לכל צעד. אפשר גם להשאיר ריק ולמלא ביד על הדף המודפס.',
    empty: 'עדיין אין צעדים. הוסיפו את הצעד הראשון, או בחרו דוגמה.',
    stepCount: '{n} צעדים',
    stepCountOne: 'צעד אחד',
    clear: 'להתחיל מחדש',
    clearConfirm: 'למחוק את כל הצעדים?',
    print: 'להדפיס',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'הערך הגדול הוא בגילוי שהמשימה לא קשה — רק שניים מהצעדים קשים. משם אפשר לעבוד על שני צעדים במקום להילחם על כל הבוקר, ולראות אחרי חודש שאחד מהם עבר ל"לבד".',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Break Down a Task',
    subtitle: 'Take one task that is hard at home, break it into small steps, and mark how much help each step needs today.',
    taskLabel: 'Which task shall we break down?',
    taskPlaceholder: 'For example: getting ready for football',
    examplesLabel: 'Or start from an example',
    stepsTitle: 'The steps',
    stepPlaceholder: 'What is the next step?',
    addStep: 'Add step',
    removeStep: 'Remove step',
    moveUp: 'Move up',
    moveDown: 'Move down',
    helpTitle: 'How much help is needed today?',
    helpHint: 'Tap the level that fits each step. You can also leave it blank and fill it in by hand on the printed sheet.',
    empty: 'No steps yet. Add the first one, or pick an example.',
    stepCount: '{n} steps',
    stepCountOne: 'One step',
    clear: 'Start over',
    clearConfirm: 'Delete all the steps?',
    print: 'Print',
    parentTipLabel: 'Tip for parents',
    parentTip: 'The real value is discovering the task is not hard — only two of the steps are. From there you can work on two steps instead of fighting about the whole morning, and see a month later that one of them has moved to "on my own".',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'פירוק משימה לילדים | פעילות חינמית | StoryLeap',
    description: 'מפרקים משימה יומיומית לצעדים קטנים ומסמנים כמה עזרה כל צעד צריך. דף להדפסה, חינם וללא הרשמה.',
  },
  en: {
    title: 'Task Breakdown for Kids | Free Activity | StoryLeap',
    description: 'Break an everyday task into small steps and mark how much help each one needs. Printable sheet, free, no signup.',
  },
};
