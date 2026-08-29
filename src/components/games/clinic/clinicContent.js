/**
 * clinicContent.js — all content for the Clinic game.
 *
 * Every string a child sees lives here, in both languages. The patients and
 * their treatment steps are fixed data: the same patient always needs the same
 * tools in the same order, so the game is fully testable and works offline.
 */

// The tray. Order here is the order on screen.
export const TOOLS = [
  { id: 'stethoscope', he: 'סטטוסקופ', en: 'Stethoscope' },
  { id: 'thermometer', he: 'מדחום', en: 'Thermometer' },
  { id: 'drops', he: 'טיפות', en: 'Drops' },
  { id: 'medicine', he: 'תרופה', en: 'Medicine' },
  { id: 'ice', he: 'קרח', en: 'Ice pack' },
  { id: 'ointment', he: 'משחה', en: 'Ointment' },
  { id: 'bandage', he: 'פלסטר', en: 'Bandage' },
  { id: 'syringe', he: 'חיסון', en: 'Shot' },
];

// Each patient is a short, predictable sequence of two or three steps.
// `ask` is what the patient says while waiting for that tool; `done` is the
// reply once it has been used. There is no wrong path — only "not yet".
export const PATIENTS = [
  {
    id: 'bear',
    species: 'bear',
    he: { name: 'דובי', problem: 'נפלתי מהעץ והברך שלי כואבת', farewell: 'תודה! עכשיו אני יכול ללכת לבד' },
    en: { name: 'Bruno', problem: 'I fell out of the tree and my knee hurts', farewell: 'Thank you! Now I can walk on my own' },
    steps: [
      {
        tool: 'ice',
        he: { ask: 'אפשר לשים משהו קר על הברך?', done: 'אההה, הקור מרגיע את הכאב' },
        en: { ask: 'Can you put something cold on my knee?', done: 'Ahhh, the cold makes it hurt less' },
      },
      {
        tool: 'bandage',
        he: { ask: 'ועכשיו משהו שיכסה את השריטה', done: 'עכשיו היא מכוסה ומוגנת' },
        en: { ask: 'And now something to cover the scratch', done: 'Now it is covered and safe' },
      },
    ],
  },
  {
    id: 'bunny',
    species: 'bunny',
    he: { name: 'ארנבי', problem: 'אני מרגיש חם מאוד ועייף', farewell: 'אני הולך לישון קצת. ביי!' },
    en: { name: 'Bailey', problem: 'I feel very hot and tired', farewell: 'I am going to rest a bit. Bye!' },
    steps: [
      {
        tool: 'thermometer',
        he: { ask: 'אפשר לבדוק כמה חום יש לי?', done: 'יש לך קצת חום. עכשיו אנחנו יודעים' },
        en: { ask: 'Can you check how hot I am?', done: 'You have a little fever. Now we know' },
      },
      {
        tool: 'medicine',
        he: { ask: 'יש משהו שיוריד את החום?', done: 'בלעתי. תכף ארגיש יותר טוב' },
        en: { ask: 'Is there something to bring the fever down?', done: 'All swallowed. I will feel better soon' },
      },
    ],
  },
  {
    id: 'puppy',
    species: 'dog',
    he: { name: 'פאדי', problem: 'האוזן שלי מזמזמת וכואבת', farewell: 'האוזן שקטה עכשיו. תודה!' },
    en: { name: 'Pudi', problem: 'My ear is buzzing and it hurts', farewell: 'My ear is quiet now. Thanks!' },
    steps: [
      {
        tool: 'stethoscope',
        he: { ask: 'אפשר להקשיב ולבדוק מה קורה?', done: 'הקשבנו. הכול בסדר בפנים' },
        en: { ask: 'Can you listen and check what is going on?', done: 'We listened. Everything is fine inside' },
      },
      {
        tool: 'drops',
        he: { ask: 'אפשר לשים משהו בתוך האוזן?', done: 'קר וטוב. הזמזום נעלם' },
        en: { ask: 'Can you put something in my ear?', done: 'Cool and nice. The buzzing is gone' },
      },
    ],
  },
  {
    id: 'cat',
    species: 'cat',
    he: { name: 'מיצי', problem: 'אני משתעלת כל הזמן ולא מצליחה לנשום טוב', farewell: 'אני נושמת חופשי. תודה רבה!' },
    en: { name: 'Mitzi', problem: 'I keep coughing and I cannot breathe well', farewell: 'I can breathe freely. Thank you!' },
    steps: [
      {
        tool: 'stethoscope',
        he: { ask: 'אפשר להקשיב לנשימות שלי?', done: 'שמעתי. החזה קצת עמוס' },
        en: { ask: 'Can you listen to my breathing?', done: 'I heard it. Your chest is a bit busy' },
      },
      {
        tool: 'medicine',
        he: { ask: 'יש משהו שיעזור לשיעול?', done: 'הגרון כבר פחות מגרד' },
        en: { ask: 'Is there something for the cough?', done: 'My throat is less scratchy already' },
      },
      {
        tool: 'thermometer',
        he: { ask: 'ורק נבדוק שאין לי חום', done: 'אין חום. מצוין' },
        en: { ask: 'And just check that I have no fever', done: 'No fever. Excellent' },
      },
    ],
  },
  {
    id: 'koala',
    species: 'koala',
    he: { name: 'קואלי', problem: 'באתי לקבל חיסון ואני קצת מפחד', farewell: 'זה היה מהיר. הייתי אמיץ!' },
    en: { name: 'Koali', problem: 'I came for a shot and I am a little scared', farewell: 'That was quick. I was brave!' },
    steps: [
      {
        tool: 'stethoscope',
        he: { ask: 'קודם נבדוק שאני בריא, בסדר?', done: 'אתה בריא לגמרי. אפשר להמשיך' },
        en: { ask: 'First check that I am healthy, okay?', done: 'You are perfectly healthy. We can go on' },
      },
      {
        tool: 'syringe',
        he: { ask: 'עכשיו החיסון. אני סופר עד שלוש', done: 'אחת, שתיים, שלוש — וזהו! כמעט לא הרגשתי' },
        en: { ask: 'Now the shot. I will count to three', done: 'One, two, three — done! I barely felt it' },
      },
      {
        tool: 'bandage',
        he: { ask: 'אפשר פלסטר על המקום?', done: 'פלסטר יפה. עכשיו כולם ידעו שהייתי אמיץ' },
        en: { ask: 'Can I have a bandage on the spot?', done: 'A nice bandage. Now everyone knows I was brave' },
      },
    ],
  },
  {
    id: 'frog',
    species: 'frog',
    he: { name: 'קווקי', problem: 'יש לי פריחה על היד והיא מגרדת נורא', farewell: 'זה כבר לא מגרד. תודה!' },
    en: { name: 'Croaky', problem: 'I have a rash on my arm and it itches a lot', farewell: 'It stopped itching. Thank you!' },
    steps: [
      {
        tool: 'ointment',
        he: { ask: 'אפשר למרוח משהו שיפסיק את הגירוד?', done: 'קריר ונעים. הגירוד נרגע' },
        en: { ask: 'Can you rub on something to stop the itch?', done: 'Cool and pleasant. The itch is calming down' },
      },
      {
        tool: 'bandage',
        he: { ask: 'ונכסה כדי שלא אגרד שוב', done: 'מכוסה. עכשיו זה יחלים בשקט' },
        en: { ask: 'And cover it so I do not scratch again', done: 'Covered. Now it can heal quietly' },
      },
    ],
  },
];

export const UI = {
  he: {
    back: 'חזרה למשחקים',
    title: 'הקליניקה שלי',
    subtitle: 'חיות באות לביקור, ואתם הרופא/ה. בוחרים את הכלי שהן מבקשות.',
    waiting: 'בחדר ההמתנה',
    toolsTitle: 'הכלים שלי',
    notYet: 'זה לא מה שאני צריך עכשיו',
    treated: 'טופל/ה',
    nextPatient: 'המטופל הבא',
    startOver: 'להתחיל מהתחלה',
    allDoneTitle: 'כל החיות טופלו!',
    allDoneText: 'טיפלתם בכל מי שהגיע היום לקליניקה. אפשר לפתוח אותה שוב מחר.',
    patientOf: 'מטופל {n} מתוך {total}',
    parentTipLabel: 'טיפ להורה',
    parentTip:
      'המשחק הזה נועד להכין לביקור אמיתי אצל רופא. שחקו בו לפני התור, ותנו לילד/ה להיות הרופא/ה — מי שמחזיק את המדחום פחות מפחד ממנו. אפשר לעצור בכל שלב ולשאול "מה הוא מרגיש עכשיו?".',
  },
  en: {
    back: 'Back to games',
    title: 'My Clinic',
    subtitle: 'Animals come for a visit and you are the doctor. Pick the tool they ask for.',
    waiting: 'In the waiting room',
    toolsTitle: 'My tools',
    notYet: 'That is not what I need right now',
    treated: 'Treated',
    nextPatient: 'Next patient',
    startOver: 'Start over',
    allDoneTitle: 'Every animal has been treated!',
    allDoneText: 'You took care of everyone who came to the clinic today. You can open it again tomorrow.',
    patientOf: 'Patient {n} of {total}',
    parentTipLabel: 'Parent tip',
    parentTip:
      'This game is made for preparing a child for a real doctor visit. Play it before the appointment and let your child be the doctor — whoever holds the thermometer is less afraid of it. You can pause any time and ask "how do you think he feels now?".',
  },
};

export const META = {
  he: {
    title: 'הקליניקה שלי | משחק רופא חינמי לילדים | StoryLeap',
    description:
      'משחק רופא חינמי לילדים: מטפלים בחיות, בוחרים כלים ומכינים את הילד/ה לביקור אמיתי אצל הרופא. בלי ניקוד ובלי לחץ.',
  },
  en: {
    title: 'My Clinic | Free Doctor Game for Kids | StoryLeap',
    description:
      'A free doctor game for kids: treat the animals, pick the right tools, and get ready for a real visit to the doctor. No scores, no pressure.',
  },
};
