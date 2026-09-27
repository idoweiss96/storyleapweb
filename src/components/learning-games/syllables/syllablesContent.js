// Syllables — "תוף ההברות". Beat the drum once per syllable: phonological
// awareness, the strongest single early predictor of learning to read.
//
// `parts` is the word split into spoken syllables, with niqqud in Hebrew so a
// parent reading aloud says it the same way the split counts it. The count
// comes from parts.length — never written separately, so it cannot drift.
// Words whose syllable count is disputed (צפרדע, זית, chocolate) are left out.

export const WORDS = [
  { id: 'bear', pic: { critter: 'bear' }, he: ['דֹּב'], en: ['bear'] },
  { id: 'turtle', pic: { critter: 'turtle' }, he: ['צָב'], en: ['tur', 'tle'] },
  { id: 'cup', pic: { icon: 'cup' }, he: ['כּוֹס'], en: ['cup'] },
  { id: 'juice', pic: { icon: 'juice' }, he: ['מִיץ'], en: ['juice'] },
  { id: 'dog', pic: { critter: 'dog' }, he: ['כֶּ', 'לֶב'], en: ['dog'] },
  { id: 'cat', pic: { critter: 'cat' }, he: ['חָ', 'תוּל'], en: ['cat'] },
  { id: 'bunny', pic: { critter: 'bunny' }, he: ['אַרְ', 'נָב'], en: ['bun', 'ny'] },
  { id: 'fox', pic: { critter: 'fox' }, he: ['שׁוּ', 'עָל'], en: ['fox'] },
  { id: 'panda', pic: { critter: 'panda' }, he: ['פַּנְ', 'דָּה'], en: ['pan', 'da'] },
  { id: 'carrot', pic: { icon: 'carrot' }, he: ['גֶּ', 'זֶר'], en: ['car', 'rot'] },
  { id: 'pizza', pic: { icon: 'pizza' }, he: ['פִּי', 'צָה'], en: ['piz', 'za'] },
  { id: 'egg', pic: { icon: 'egg' }, he: ['בֵּי', 'צָה'], en: ['egg'] },
  { id: 'bread', pic: { icon: 'bread' }, he: ['לֶ', 'חֶם'], en: ['bread'] },
  { id: 'milk', pic: { icon: 'milk' }, he: ['חָ', 'לָב'], en: ['milk'] },
  { id: 'book', pic: { icon: 'book' }, he: ['סֵ', 'פֶר'], en: ['book'] },
  { id: 'apple', pic: { icon: 'apple' }, he: ['תַּ', 'פּוּחַ'], en: ['ap', 'ple'] },
  { id: 'soap', pic: { icon: 'soap' }, he: ['סַ', 'בּוֹן'], en: ['soap'] },
  { id: 'teddy', pic: { icon: 'teddy' }, he: ['דּוּ', 'בִּי'], en: ['ted', 'dy'] },
  { id: 'pepper', pic: { icon: 'pepper' }, he: ['פִּלְ', 'פֵּל'], en: ['pep', 'per'] },
  { id: 'corn', pic: { icon: 'corn' }, he: ['תִּי', 'רָס'], en: ['corn'] },
  { id: 'koala', pic: { critter: 'koala' }, he: ['קוֹ', 'אָ', 'לָה'], en: ['ko', 'a', 'la'] },
  { id: 'banana', pic: { icon: 'banana' }, he: ['בָּ', 'נָ', 'נָה'], en: ['ba', 'na', 'na'] },
  { id: 'pineapple', pic: { icon: 'pineapple' }, he: ['אֲ', 'נָ', 'נָס'], en: ['pine', 'ap', 'ple'] },
  { id: 'pencil', pic: { icon: 'pencil' }, he: ['עִ', 'פָּ', 'רוֹן'], en: ['pen', 'cil'] },
  { id: 'mushroom', pic: { icon: 'mushroom' }, he: ['פִּטְ', 'רִ', 'יָּה'], en: ['mush', 'room'] },
  { id: 'cookies', pic: { icon: 'cookies' }, he: ['עוּ', 'גִ', 'יּוֹת'], en: ['cook', 'ies'] },
  { id: 'mic', pic: { icon: 'mic' }, he: ['מִי', 'קְרוֹ', 'פוֹן'], en: ['mi', 'cro', 'phone'] },
  { id: 'broccoli', pic: { icon: 'broccoli' }, he: ['בְּרוֹ', 'קוֹ', 'לִי'], en: ['broc', 'co', 'li'] },
  { id: 'tomato', pic: { icon: 'tomato' }, he: ['עַגְ', 'בָ', 'נִ', 'יָּה'], en: ['to', 'ma', 'to'] },
  { id: 'thermometer', pic: { icon: 'thermometer' }, he: ['מַדְ', 'חֹם'], en: ['ther', 'mom', 'e', 'ter'] },
];

export const LEVELS = [
  { id: 'a', max: 2, he: 'עד 2 הברות', en: 'Up to 2 beats', ages: '3–4' },
  { id: 'b', max: 3, he: 'עד 3 הברות', en: 'Up to 3 beats', ages: '4–6' },
  { id: 'c', max: 6, he: 'כל המילים', en: 'All words', ages: '5–7' },
];

export const ROUNDS = 8;

export const UI = {
  he: {
    title: 'מצעד התופים',
    subtitle: 'השועל מראה תמונה ומילה. עולים על התוף הגדול, קופצים פעם אחת לכל חלק במילה — ומדווחים לשועל.',
    intro: 'השועל צריך מתופפים למצעד! לכל מילה: אמרו אותה בקול, עלו על התוף וקפצו פעם אחת לכל חלק שלה. בָּ-נָ-נָה = שלוש קפיצות!',
    back: 'לכל המשחקים',
    start: 'למצעד!',
    goDrum: 'אמרו את המילה בקול ועלו על התוף הגדול',
    onDrum: 'קפצו על התוף פעם אחת לכל חלק במילה — ואז לכו לשועל',
    report: 'תופפתם {n}. לכו לשועל לדווח!',
    right: 'בדיוק! {n} חלקים',
    rightOne: 'בדיוק! חלק אחד',
    together: 'בואו נתופף יחד — שימו לב כמה חלקים',
    drum: 'לקפוץ!',
    clear: 'מחדש',
    listen: 'להקשיב',
    round: 'מילה {n}/{total}',
    doneTitle: 'איזה מצעד!',
    doneText: 'תופפתם {total} מילים.',
    again: 'עוד מצעד',
    harder: 'לרמה הבאה',
    parentTipLabel: 'טיפ להורים',
    parentTip:
      'אמרו את המילה לאט ובקצב, כמו שיר: "בָּ… נָ… נָה". אפשר גם למחוא כפיים או לקפוץ באמת על כל הברה. בשלב הזה שומעים — לא קוראים, אז לא צריך שהילד יזהה אותיות.',
    whyLabel: 'למה זה עוזר',
    why: 'מודעות פונולוגית — היכולת לשמוע ולפרק מילים לחלקים — היא מהמנבאים החזקים ביותר להצלחה ברכישת קריאה. חלוקה להברות היא השלב הראשון בה, ומטא-אנליזות מראות שאימון משחקי שלה בגן משפר אותה באופן מובהק.',
  },
  en: {
    title: 'The Drum Parade',
    subtitle: 'The fox shows a picture and a word. Get on the big drum, jump once for each part of the word — and report to the fox.',
    intro: 'The fox needs drummers for the parade! For each word: say it out loud, get on the drum and jump once for each part. ba-na-na = three jumps!',
    back: 'All games',
    start: 'To the parade!',
    goDrum: 'Say the word out loud and get on the big drum',
    onDrum: 'Jump on the drum once for each part of the word — then go to the fox',
    report: 'You drummed {n}. Go and tell the fox!',
    right: 'Exactly! {n} parts',
    rightOne: 'Exactly! One part',
    together: "Let's drum it together — listen for the parts",
    drum: 'Jump!',
    clear: 'Again',
    listen: 'Listen',
    round: 'Word {n}/{total}',
    doneTitle: 'What a parade!',
    doneText: 'You drummed {total} words.',
    again: 'Another parade',
    harder: 'Next level',
    parentTipLabel: 'Tip for parents',
    parentTip:
      'Say the word slowly and rhythmically, like a song: "ba… na… na". You can also clap, or really jump, on each syllable. This is about hearing, not reading — your child does not need to know letters.',
    whyLabel: 'Why it helps',
    why: 'Phonological awareness — hearing and splitting words into parts — is one of the strongest predictors of learning to read. Syllables are its first step, and meta-analyses show playful training in kindergarten reliably improves it.',
  },
};

export const META = {
  he: { title: 'מצעד התופים | משחק הברות תלת-ממדי | StoryLeap', description: 'קופצים על התוף פעם אחת לכל הברה — משחק מודעות פונולוגית בתלת-ממד לגילאי 3–7, בעברית ובאנגלית.' },
  en: { title: 'The Drum Parade | 3D Syllables Game | StoryLeap', description: 'Jump on the drum once for each syllable — a 3D phonological-awareness game for ages 3–7.' },
};
