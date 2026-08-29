/**
 * pizzeriaContent.js — all content for the Pizzeria game.
 *
 * Toppings, customer orders and every visible string. Orders are a fixed list
 * played in order, not random, so the game behaves the same way every time.
 */

// `layer: true` toppings paint the whole pizza instead of dropping pieces.
export const TOPPINGS = [
  { id: 'sauce', emoji: '🥫', layer: true, he: 'רוטב', en: 'Sauce' },
  { id: 'cheese', emoji: '🧀', layer: true, he: 'גבינה', en: 'Cheese' },
  { id: 'mushroom', emoji: '🍄', he: 'פטריות', en: 'Mushrooms' },
  { id: 'olive', emoji: '🫒', he: 'זיתים', en: 'Olives' },
  { id: 'tomato', emoji: '🍅', he: 'עגבניות', en: 'Tomatoes' },
  { id: 'pepper', emoji: '🫑', he: 'פלפל', en: 'Pepper' },
  { id: 'corn', emoji: '🌽', he: 'תירס', en: 'Corn' },
  { id: 'pineapple', emoji: '🍍', he: 'אננס', en: 'Pineapple' },
  { id: 'broccoli', emoji: '🥦', he: 'ברוקולי', en: 'Broccoli' },
  { id: 'egg', emoji: '🥚', he: 'ביצה', en: 'Egg' },
  { id: 'basil', emoji: '🌿', he: 'בזיליקום', en: 'Basil' },
];

// Where each piece lands, in order. Fixed so the same taps always draw the
// same pizza. Percentages inside the pizza circle.
export const SLOTS = [
  { x: 50, y: 50 }, { x: 32, y: 34 }, { x: 50, y: 28 }, { x: 68, y: 34 },
  { x: 26, y: 52 }, { x: 74, y: 52 }, { x: 32, y: 70 }, { x: 50, y: 74 },
  { x: 68, y: 70 }, { x: 40, y: 44 }, { x: 60, y: 44 }, { x: 40, y: 60 },
  { x: 60, y: 60 }, { x: 50, y: 38 }, { x: 36, y: 52 }, { x: 64, y: 52 },
  { x: 50, y: 64 }, { x: 44, y: 32 }, { x: 56, y: 32 }, { x: 44, y: 72 },
  { x: 56, y: 72 },
];

// Extra toppings are never wrong — an order is filled once everything on the
// list is on the pizza.
export const ORDERS = [
  {
    id: 'margherita',
    customer: '🐼',
    wants: ['sauce', 'cheese', 'basil'],
    he: { name: 'פנדי', line: 'רוטב, גבינה וקצת בזיליקום בבקשה' },
    en: { name: 'Pandy', line: 'Sauce, cheese and a bit of basil please' },
  },
  {
    id: 'veggie',
    customer: '🐧',
    wants: ['sauce', 'cheese', 'mushroom', 'pepper'],
    he: { name: 'פינגי', line: 'אני רוצה פטריות ופלפל על רוטב וגבינה' },
    en: { name: 'Pingy', line: 'I would like mushrooms and pepper on sauce and cheese' },
  },
  {
    id: 'sweet',
    customer: '🐨',
    wants: ['sauce', 'cheese', 'corn', 'pineapple'],
    he: { name: 'קואלי', line: 'תירס ואננס! אני אוהב מתוק' },
    en: { name: 'Koali', line: 'Corn and pineapple! I like it sweet' },
  },
  {
    id: 'green',
    customer: '🐢',
    wants: ['cheese', 'broccoli', 'olive'],
    he: { name: 'טורטי', line: 'ברוקולי וזיתים על גבינה, בלי רוטב' },
    en: { name: 'Torty', line: 'Broccoli and olives on cheese, no sauce' },
  },
  {
    id: 'everything',
    customer: '🦊',
    wants: ['sauce', 'cheese', 'tomato', 'egg'],
    he: { name: 'שועלי', line: 'עגבניות וביצה, ותודה מראש!' },
    en: { name: 'Foxy', line: 'Tomatoes and an egg, and thanks in advance!' },
  },
];

export const UI = {
  he: {
    back: 'חזרה למשחקים',
    title: 'הפיצרייה',
    subtitle: 'מכינים פיצה: מוסיפים תוספות, אופים בתנור, חותכים ומגישים.',
    orderTitle: 'ההזמנה',
    freePlay: 'משחק חופשי',
    freePlayLine: 'אין הזמנה — מכינים בדיוק מה שרוצים',
    withOrder: 'לקחת הזמנה',
    toppingsTitle: 'התוספות',
    stillNeeds: 'עוד חסר:',
    orderReady: 'ההזמנה מוכנה! אפשר להכניס לתנור',
    emptyHint: 'הבצק מוכן. מה שמים עליו?',
    bake: 'להכניס לתנור',
    baking: 'נאפית בתנור…',
    slice: 'לחתוך לפרוסות',
    serve: 'להגיש',
    servedTitle: 'הפיצה הוגשה!',
    servedText: 'הלקוח אכל הכול ואמר תודה. אפשר להכין עוד אחת.',
    newPizza: 'פיצה חדשה',
    clear: 'לנקות הכול',
    parentTipLabel: 'טיפ להורה',
    parentTip:
      'המשחק בנוי כרצף קבוע — תוספות, תנור, חיתוך, הגשה. אפשר לתת לילד/ה לספר בקול מה השלב הבא, וזה תרגול טבעי של רצף פעולות. אין נכון ולא נכון בתוספות: גם פיצה עם ברוקולי ואננס תתקבל בשמחה.',
  },
  en: {
    back: 'Back to games',
    title: 'The Pizzeria',
    subtitle: 'Make a pizza: add toppings, bake it, slice it and serve.',
    orderTitle: 'The order',
    freePlay: 'Free play',
    freePlayLine: 'No order — make exactly what you feel like',
    withOrder: 'Take an order',
    toppingsTitle: 'Toppings',
    stillNeeds: 'Still needs:',
    orderReady: 'The order is ready! Into the oven it goes',
    emptyHint: 'The dough is ready. What goes on it?',
    bake: 'Into the oven',
    baking: 'Baking…',
    slice: 'Slice it',
    serve: 'Serve it',
    servedTitle: 'The pizza is served!',
    servedText: 'The customer ate it all and said thank you. You can make another one.',
    newPizza: 'New pizza',
    clear: 'Clear it all',
    parentTipLabel: 'Parent tip',
    parentTip:
      'The game follows a fixed sequence — toppings, oven, slicing, serving. Let your child say the next step out loud; that is sequencing practice without it feeling like practice. No topping is wrong: a broccoli and pineapple pizza is welcomed just as warmly.',
  },
};

export const META = {
  he: {
    title: 'הפיצרייה | משחק הכנת פיצה חינמי לילדים | StoryLeap',
    description:
      'משחק פיצה חינמי לילדים: בוחרים תוספות, אופים בתנור, חותכים ומגישים ללקוח. בלי ניקוד, בלי טיימר ובלי הפסד.',
  },
  en: {
    title: 'The Pizzeria | Free Pizza Making Game for Kids | StoryLeap',
    description:
      'A free pizza game for kids: choose toppings, bake in the oven, slice and serve the customer. No scores, no timers, no losing.',
  },
};
