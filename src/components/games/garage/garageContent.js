/**
 * garageContent.js — all content for the Garage game.
 *
 * Four kinds of fault, one tool that fixes each, and a fixed queue of cars.
 * The car itself is drawn as SVG (not an emoji) so it can actually get dirty,
 * lose a tyre, and be repainted.
 */

export const FAULTS = {
  dirty: { tool: 'sponge', he: 'הרכב מלוכלך', en: 'The car is dirty' },
  flat: { tool: 'wrench', he: 'יש פנצ׳ר בגלגל', en: 'There is a flat tyre' },
  fuel: { tool: 'fuel', he: 'נגמר הדלק', en: 'It is out of fuel' },
  light: { tool: 'bulb', he: 'הפנס שרוף', en: 'The headlight is out' },
};

export const TOOLS = [
  { id: 'sponge', he: 'ספוג', en: 'Sponge' },
  { id: 'wrench', he: 'מפתח', en: 'Wrench' },
  { id: 'fuel', he: 'דלק', en: 'Fuel' },
  { id: 'bulb', he: 'נורה', en: 'Bulb' },
];

export const COLORS = [
  { id: 'pink', value: '#FF6FB5', he: 'ורוד', en: 'Pink' },
  { id: 'blue', value: '#4FC3E8', he: 'תכלת', en: 'Blue' },
  { id: 'yellow', value: '#F5C842', he: 'צהוב', en: 'Yellow' },
  { id: 'green', value: '#5BC98C', he: 'ירוק', en: 'Green' },
  { id: 'purple', value: '#A78BFA', he: 'סגול', en: 'Purple' },
  { id: 'red', value: '#EF6B6B', he: 'אדום', en: 'Red' },
  { id: 'orange', value: '#FF9F5A', he: 'כתום', en: 'Orange' },
  { id: 'white', value: '#E2E8F0', he: 'לבן', en: 'White' },
];

export const CARS = [
  {
    id: 'bunny',
    driver: 'bunny',
    color: '#4FC3E8',
    faults: ['dirty', 'flat'],
    he: { name: 'ארנבי', line: 'נסעתי בשלולית ונתקעתי. אפשר עזרה?' },
    en: { name: 'Bailey', line: 'I drove through a puddle and got stuck. Can you help?' },
  },
  {
    id: 'fox',
    driver: 'fox',
    color: '#EF6B6B',
    faults: ['fuel', 'light'],
    he: { name: 'שועלי', line: 'נגמר לי הדלק בדיוק כשהחשיך' },
    en: { name: 'Foxy', line: 'I ran out of fuel right as it got dark' },
  },
  {
    id: 'bear',
    driver: 'bear',
    color: '#F5C842',
    faults: ['dirty', 'fuel', 'flat'],
    he: { name: 'דובי', line: 'האמת? הכול קצת מקולקל אצלי' },
    en: { name: 'Bruno', line: 'Honestly? A bit of everything is broken on mine' },
  },
  {
    id: 'panda',
    driver: 'panda',
    color: '#E2E8F0',
    faults: ['light', 'dirty'],
    he: { name: 'פנדי', line: 'הפנס לא נדלק ואני לא רואה כלום' },
    en: { name: 'Pandy', line: 'The headlight will not turn on and I cannot see' },
  },
  {
    id: 'koala',
    driver: 'koala',
    color: '#A78BFA',
    faults: ['flat', 'fuel', 'light'],
    he: { name: 'קואלי', line: 'באתי לטיפול גדול לפני הטיול' },
    en: { name: 'Koali', line: 'I came for a big service before our trip' },
  },
];

export const UI = {
  he: {
    back: 'חזרה למשחקים',
    title: 'המוסך',
    subtitle: 'רכבים מגיעים לתיקון. בוחרים את הכלי שמתאים לתקלה, ואז צובעים.',
    carOf: 'רכב {n} מתוך {total}',
    checklist: 'מה צריך לתקן',
    toolsTitle: 'הכלים במוסך',
    paintTitle: 'עכשיו הצבע',
    notThis: 'הכלי הזה לא מתאים לתקלה הזאת',
    allFixed: 'הכול תוקן! אפשר לצבוע ולשלוח לדרך',
    drive: 'לנסוע!',
    nextCar: 'הרכב הבא',
    startOver: 'להתחיל מהתחלה',
    allDoneTitle: 'המוסך סגור להיום',
    allDoneText: 'תיקנתם את כל הרכבים שהגיעו. כולם נסעו הביתה מרוצים.',
    fuelLabel: 'דלק',
    parentTipLabel: 'טיפ להורה',
    parentTip:
      'לכל תקלה יש כלי אחד שמתאים לה, וזה מה שהופך את המשחק לתרגול של התאמה — לא של ניחוש. אם הילד/ה בוחר/ת כלי לא מתאים, שאלו "מה הכלי הזה עושה?" במקום לתקן. אין הפסד ואין ניקוד, אז אפשר לנסות כמה שרוצים.',
  },
  en: {
    back: 'Back to games',
    title: 'The Garage',
    subtitle: 'Cars come in for repair. Pick the tool that matches the fault, then paint.',
    carOf: 'Car {n} of {total}',
    checklist: 'What needs fixing',
    toolsTitle: 'Garage tools',
    paintTitle: 'Now the paint',
    notThis: 'That tool does not match this fault',
    allFixed: 'All fixed! Paint it and send it on its way',
    drive: 'Drive away!',
    nextCar: 'Next car',
    startOver: 'Start over',
    allDoneTitle: 'The garage is closed for today',
    allDoneText: 'You fixed every car that came in. They all drove home happy.',
    fuelLabel: 'Fuel',
    parentTipLabel: 'Parent tip',
    parentTip:
      'Each fault has exactly one matching tool, which makes this a matching game rather than a guessing one. If your child picks the wrong tool, try asking "what does that tool do?" instead of correcting. There is no losing and no score, so trying is free.',
  },
};

export const META = {
  he: {
    title: 'המוסך | משחק תיקון רכבים חינמי לילדים | StoryLeap',
    description:
      'משחק מוסך חינמי לילדים: מתקנים פנצ׳ר, שוטפים, מתדלקים, מחליפים נורה וצובעים את הרכב. בלי ניקוד ובלי הפסד.',
  },
  en: {
    title: 'The Garage | Free Car Repair Game for Kids | StoryLeap',
    description:
      'A free garage game for kids: fix a flat tyre, wash the car, fill it up, change a bulb and repaint it. No scores, no losing.',
  },
};
