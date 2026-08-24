// Content for the Visual Rules activity.
//
// Authored once, read at runtime, never generated.
//
// EVERY RULE IS PHRASED AS WHAT TO DO, NEVER AS WHAT NOT TO DO.
// "מדברים בקול רגוע" and not "לא צועקים". This is not politeness — a child
// hearing "don't shout" has to work out what to do instead, in the exact moment
// they are least able to. A rule that names the wanted behaviour is a rule they
// can follow rather than one they can only break.
//
// Any rule added here must pass that test.
//
// HOW THIS DIFFERS FROM THE CHOICE BOARD.
// The choice board offers options a child picks between. This states what holds
// in the house regardless of choice — different job, similar printed shape.

export const RULES = [
  { id: 'calm_voice', emoji: '🗣️', he: 'מדברים בקול רגוע', en: 'We speak in a calm voice' },
  { id: 'gentle_hands', emoji: '🤲', he: 'הידיים נשארות עדינות', en: 'Hands stay gentle' },
  { id: 'listen', emoji: '👂', he: 'מקשיבים כשמישהו מדבר', en: 'We listen when someone is talking' },
  { id: 'ask', emoji: '🙋', he: 'מבקשים לפני שלוקחים', en: 'We ask before taking' },
  { id: 'tidy', emoji: '🧺', he: 'מחזירים למקום אחרי ששיחקנו', en: 'We put things back after playing' },
  { id: 'walk', emoji: '🚶', he: 'הולכים בתוך הבית', en: 'We walk inside the house' },
  { id: 'help', emoji: '🤝', he: 'עוזרים אחד לשני', en: 'We help each other' },
  { id: 'tell', emoji: '💬', he: 'מספרים למבוגר כשקשה', en: 'We tell a grown-up when it is hard' },
  { id: 'wait_turn', emoji: '⏳', he: 'מחכים לתור', en: 'We wait for our turn' },
  { id: 'knock', emoji: '🚪', he: 'דופקים לפני שנכנסים', en: 'We knock before coming in' },
  { id: 'wash', emoji: '🧼', he: 'שוטפים ידיים לפני האוכל', en: 'We wash hands before eating' },
  { id: 'sorry', emoji: '🕊️', he: 'אומרים סליחה כשפגענו', en: 'We say sorry when we hurt someone' },
  { id: 'together_table', emoji: '🍽️', he: 'יושבים יחד בארוחה', en: 'We sit together at meals' },
  { id: 'quiet_night', emoji: '🌙', he: 'שומרים על שקט בלילה', en: 'We keep it quiet at night' },
];

export const MAX_RULES = 6;
export const MIN_RULES = 2;
export const CUSTOM_EMOJI = '⭐';

export const UI = {
  he: {
    title: 'כללי הבית שלנו',
    subtitle: 'בוחרים עד שישה כללים, מדפיסים, ותולים במקום שרואים. כלל שתלוי על הקיר לא צריך להיאמר כל יום מחדש.',
    boardTitle: 'הכללים שלנו',
    empty: 'בחרו לפחות שני כללים מהרשימה למטה.',
    libraryTitle: 'אילו כללים חשובים אצלכם?',
    customLabel: 'כלל משלנו',
    customPlaceholder: 'למשל: נועלים נעליים לפני שיוצאים',
    customAdd: 'להוסיף',
    customHint: 'לנסח מה כן עושים, ולא מה לא.',
    limitReached: 'שישה כללים זה המקסימום. רשימה ארוכה יותר אף ילד לא זוכר — ואז אף כלל לא באמת קיים.',
    remove: 'להוריד מהלוח',
    clear: 'לנקות',
    print: 'להדפיס את הכללים',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'שווה לבחור את הכללים יחד עם הילדים, ולתת להם לנסח לפחות אחד. כלל שילד ניסח בעצמו הוא כלל שהוא יזכיר לאחרים — ובדרך כלל בהתלהבות מפתיעה.',
    back: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Our House Rules',
    subtitle: 'Pick up to six rules, print them, and hang them where they can be seen. A rule on the wall does not need saying again every day.',
    boardTitle: 'Our rules',
    empty: 'Pick at least two rules from the list below.',
    libraryTitle: 'Which rules matter in your house?',
    customLabel: 'Our own rule',
    customPlaceholder: 'For example: we put shoes on before going out',
    customAdd: 'Add',
    customHint: 'Phrase what you do, not what you do not.',
    limitReached: 'Six rules is the maximum. No child remembers a longer list — and then no rule really exists.',
    remove: 'Remove from the board',
    clear: 'Clear',
    print: 'Print the rules',
    parentTipLabel: 'Tip for parents',
    parentTip: 'Choose the rules together with your children, and let them phrase at least one. A rule a child wrote themselves is a rule they will remind others about — usually with surprising enthusiasm.',
    back: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'כללי בית חזותיים לילדים | להדפסה חינם | StoryLeap',
    description: 'בונים לוח כללי בית מצויר לילדים — עד שישה כללים מנוסחים בחיוב, להדפסה ולתלייה. חינם וללא הרשמה.',
  },
  en: {
    title: 'Visual House Rules for Kids | Free Printable | StoryLeap',
    description: 'Build a picture house-rules board for children — up to six positively phrased rules, ready to print and hang. Free, no signup.',
  },
};
