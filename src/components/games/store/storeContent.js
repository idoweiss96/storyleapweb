/**
 * storeContent.js — all content for the Store game.
 *
 * The shop is built for two players at one screen: one fills the basket, the
 * other takes the money. Prices are small whole numbers so counting coins
 * stays within reach for a young child.
 */

export const ITEMS = [
  { id: 'banana', emoji: '🍌', price: 1, he: 'בננה', en: 'Banana' },
  { id: 'carrot', emoji: '🥕', price: 1, he: 'גזר', en: 'Carrot' },
  { id: 'apple', emoji: '🍎', price: 2, he: 'תפוח', en: 'Apple' },
  { id: 'pencil', emoji: '✏️', price: 2, he: 'עיפרון', en: 'Pencil' },
  { id: 'juice', emoji: '🧃', price: 3, he: 'מיץ', en: 'Juice' },
  { id: 'chocolate', emoji: '🍫', price: 3, he: 'שוקולד', en: 'Chocolate' },
  { id: 'bread', emoji: '🍞', price: 4, he: 'לחם', en: 'Bread' },
  { id: 'cookies', emoji: '🍪', price: 4, he: 'עוגיות', en: 'Cookies' },
  { id: 'milk', emoji: '🥛', price: 5, he: 'חלב', en: 'Milk' },
  { id: 'cheese', emoji: '🧀', price: 6, he: 'גבינה', en: 'Cheese' },
  { id: 'book', emoji: '📕', price: 8, he: 'ספר', en: 'Book' },
  { id: 'teddy', emoji: '🧸', price: 10, he: 'דובי', en: 'Teddy bear' },
];

export const COINS = [1, 2, 5, 10];

export const UI = {
  he: {
    back: 'חזרה למשחקים',
    title: 'החנות',
    subtitle: 'משחק לשניים: אחד קונה, אחד מוכר. ממלאים סל, סופרים מטבעות ומשלמים.',
    currency: '₪',
    shelfTitle: 'המדפים',
    basketTitle: 'הסל',
    basketEmpty: 'הסל ריק. מה לוקחים?',
    removeHint: 'לוחצים על פריט בסל כדי להחזיר אותו למדף',
    total: 'סך הכול',
    toCheckout: 'לקופה',
    backToShelf: 'לחזור למדפים',
    roleShopper: 'תור הקונה',
    roleSeller: 'תור המוכר',
    payTitle: 'משלמים',
    payHint: 'לוחצים על מטבעות עד שמגיעים לסכום',
    paid: 'שילמנו',
    stillNeed: 'עוד צריך',
    change: 'עודף',
    pay: 'לשלם',
    resetCoins: 'להתחיל את הספירה מחדש',
    doneTitle: 'תודה על הקנייה!',
    doneText: 'הסל ארוז והכסף בקופה. אפשר להחליף תפקידים ולשחק שוב.',
    newShop: 'קנייה חדשה',
    items: 'פריטים',
    parentTipLabel: 'טיפ להורה',
    parentTip:
      'המשחק הזה הכי טוב בשניים — שבו מול אותו מסך והחליפו תפקידים אחרי כל קנייה. הקונה מתאמן בבחירה ובוויתור, והמוכר בספירה ובעודף. אם הספירה קשה, התחילו מסל של פריט אחד בשקל אחד.',
  },
  en: {
    back: 'Back to games',
    title: 'The Store',
    subtitle: 'A game for two: one shops, one sells. Fill a basket, count coins and pay.',
    currency: '$',
    shelfTitle: 'The shelves',
    basketTitle: 'The basket',
    basketEmpty: 'The basket is empty. What are we taking?',
    removeHint: 'Tap an item in the basket to put it back on the shelf',
    total: 'Total',
    toCheckout: 'To the till',
    backToShelf: 'Back to the shelves',
    roleShopper: "Shopper's turn",
    roleSeller: "Shopkeeper's turn",
    payTitle: 'Paying',
    payHint: 'Tap coins until you reach the amount',
    paid: 'Paid',
    stillNeed: 'Still need',
    change: 'Change',
    pay: 'Pay',
    resetCoins: 'Start counting again',
    doneTitle: 'Thanks for shopping!',
    doneText: 'The basket is packed and the money is in the till. Swap roles and play again.',
    newShop: 'New shopping trip',
    items: 'items',
    parentTipLabel: 'Parent tip',
    parentTip:
      'This game works best with two people — sit at the same screen and swap roles after each trip. The shopper practises choosing and letting go; the shopkeeper practises counting and giving change. If counting is hard, start with a basket holding one item that costs one coin.',
  },
};

export const META = {
  he: {
    title: 'החנות | משחק חנות חינמי לילדים לשניים | StoryLeap',
    description:
      'משחק חנות חינמי לילדים: ממלאים סל, סופרים מטבעות ומשלמים. משחק לשניים שמתרגל בחירה, ספירה והחלפת תפקידים.',
  },
  en: {
    title: 'The Store | Free Two-Player Shop Game for Kids | StoryLeap',
    description:
      'A free shop game for kids: fill a basket, count coins and pay. A two-player game that practises choosing, counting and taking turns.',
  },
};
