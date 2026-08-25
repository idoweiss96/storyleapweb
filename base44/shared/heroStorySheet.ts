// Single source of truth for the hero_story ("ספר הגיבור/ה") order sheet.
//
// Why this file exists: the questionnaire is filled here, but the book is produced by an
// external Python pipeline (hero_story/ in the StoryLeap repo) that reads the sheet by
// COLUMN HEADER, not by position. If a header here drifts from the header that
// hero_story/data_processor.py looks for, the field is read as empty — silently, with no
// error — and the family gets a generic book. So every writer of this sheet imports the
// header list from here, and the pipeline side mirrors it in hero_story/sheet_schema.py.
//
// Rules when changing this file:
//   1. Append new columns at the END and never reorder existing ones — rows already
//      written keep their positions, and the pipeline reads old rows too.
//   0. Removed 2026-08-20 (do not re-add without changing the questionnaire too):
//      parent photo + whose photo, favourite character, who joins the adventure,
//      sibling name, pet type, pet name. The hero now travels alone and meets the
//      invented creature companion — so no illustration ever needs a real face other
//      than the child's own, which is exactly the case we can actually get right.
//   2. Change a header string only together with hero_story/data_processor.py.
//   3. Keep HEADERS and rowFromStory in the same order. The tests in
//      hero_story/sheet_schema.py compare both sides.

export const HERO_SHEET_NAME = 'שאלון';
export const HERO_SHEET_NAME_EN = 'Questionnaire';

// Separate spreadsheet per language, exactly like every other product. NOT one sheet with
// a language column: the English watcher picks a row by an empty "story link" cell without
// looking at the language, so it would happily pick up Hebrew rows and write them an
// English book. Created by hero_story/setup_sheet.py on 2026-08-20.
export const HERO_SPREADSHEET_ID_HE = '1IiQNdmqhLppQctejSY3rmST8CAhPQTtKfnZyzER18cU';
export const HERO_SPREADSHEET_ID_EN = '1qgL88JuIIs2eCD6cgXKa6JtBk2seOPct3ad5Bvx21K8';

/** (spreadsheetId, tab name, headers) for a language. */
export function sheetFor(language: string) {
  return language === 'en'
    ? { spreadsheetId: HERO_SPREADSHEET_ID_EN, sheetName: HERO_SHEET_NAME_EN, headers: HEADERS_EN }
    : { spreadsheetId: HERO_SPREADSHEET_ID_HE, sheetName: HERO_SHEET_NAME, headers: HEADERS };
}

/** Column headers, in sheet order. Mirrored by hero_story/sheet_schema.py. */
export const HEADERS = [
  'תאריך',                                    // A
  'שפה',                                      // B
  'מזהה הזמנה',                               // C
  'אימייל משתמש',                             // D
  'קרדיטים',                                  // E
  'שם הילד/ה',                                // F
  'גיל',                                      // G
  'מגדר',                                     // H
  'כינוי',                                    // I
  'קישור לתמונת הילד/ה',                      // J
  'אישור צילום',                              // K
  'איזה עולם הכי מתאים?',                     // L
  'מה הילד/ה הכי אוהב/ת',                     // M
  'איך היית מתאר/ת את האופי של הילד/ה',       // N
  'פרטים אישיים שנשמח לשלב בסיפור',           // O
  'לאיזה אירוע הספר?',                        // P
  'ממי המתנה?',                               // Q
  'הקדשה אישית',                              // R
  'הערות',                                    // S
  'אימייל לקשר',                              // T
  'טלפון לקשר',                               // U
  'סטטוס',                                    // V
  'קישור לתצוגה מקדימה',                      // W
  'קישור לסיפור',                             // X
  'אימייל נשלח',                              // Y
];

/**
 * English headers. Same order as HEADERS, so the two sheets read side by side, and the
 * exact vocabulary hero_story/data_processor._process_english_row looks for.
 * Mirrored by hero_story/sheet_schema.py (HEADERS_EN).
 */
export const HEADERS_EN = [
  'Timestamp',                                // A
  'Language',                                 // B
  'Order ID',                                 // C
  'User Email',                               // D
  'Credits',                                  // E
  "Child's Name",                             // F
  'Age',                                      // G
  'Gender',                                   // H
  'Nickname',                                 // I
  "Child's Photo Link",                       // J
  'Photo Consent',                            // K
  'Story World',                              // L
  'What the Child Loves',                     // M
  'Personality',                              // N
  'Personal Details',                         // O
  'Occasion',                                 // P
  'Gift From',                                // Q
  'Dedication',                               // R
  'Notes',                                    // S
  'Contact Email',                            // T
  'Contact Phone',                            // U
  'status',                                   // V
  'preview link',                             // W
  'story link',                               // X
  'Email Sent',                               // Y
];

// Column indexes the writers need by name (0-based, matching HEADERS above).
// Identical in both languages — the two header lists are kept in the same order.
export const COL = {
  ORDER_ID: 2,
  CONTACT_EMAIL: 19,
  STATUS: 21,
  PREVIEW_LINK: 22,
  STORY_LINK: 23,
};

export const CREDITS_PER_BOOK = 60;

/** A1 column letter for a 0-based index (supports up to ZZ). */
export function colLetter(index: number): string {
  let n = index;
  let out = '';
  while (n >= 0) {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  }
  return out;
}

// The questionnaire answer ('ילד' / 'Boy') → the value written in the sheet, per language.
// hero_story/data_processor reads 'בת' in Hebrew and 'girl'/'female' in English, so a row
// written in the wrong vocabulary silently produces a book about a boy.
const GENDER: Record<string, Record<string, string>> = {
  he: { 'ילד': 'בן', 'ילדה': 'בת', 'אחר/ת': 'אחר', Boy: 'בן', Girl: 'בת', Other: 'אחר' },
  en: { 'ילד': 'Boy', 'ילדה': 'Girl', 'אחר/ת': 'Other', Boy: 'Boy', Girl: 'Girl', Other: 'Other' },
};


/**
 * The site stores every questionnaire answer in `answers`, keyed by the question `key`
 * from questionsConfig.js. This maps that object onto the sheet row.
 *
 * `status` is passed in rather than derived: a free preview and a paid book write the
 * same answers, and only the watcher's behaviour differs.
 */
export function rowFromStory(
  story: Record<string, any>,
  opts: { status: string; userEmail?: string; orderId?: string; credits?: number } = { status: '' }
): string[] {
  const a = story.answers || {};
  const lang = story.lang || 'he';
  const created = story.created_date ? new Date(story.created_date).toLocaleString('he-IL') : new Date().toLocaleString('he-IL');

  // family_photos is a single {role, customLabel, photo} object (FamilyPhotosInput).
  // Only a parent's photo is usable downstream — the pipeline refuses to draw any other
  // real person without a photo, and inventing a grandparent's face is worse than omitting.
  const joinList = (v: any) => (Array.isArray(v) ? v.filter(Boolean).join(', ') : (v || ''));

  return [
    created,
    lang === 'he' ? 'עברית' : 'English',
    opts.orderId || story.order_id || '',
    opts.userEmail || story.contact_email || '',
    opts.credits !== undefined ? String(opts.credits) : '',
    a.name || story.child_name || '',
    a.age || '',
    (GENDER[lang] || GENDER.he)[a.gender] || a.gender || story.gender || '',
    a.nickname || '',
    a.photo || story.child_image_url || '',
    a.photo_consent ? 'כן' : '',
    joinList(a.world),
    joinList(a.loves) + (a.loves_parent ? ` | ${a.loves_parent}` : ''),
    a.personality || '',
    a.personal_details || '',
    joinList(a.occasion),
    a.gift_from || '',
    a.dedication || '',
    a.notes || '',
    story.contact_email || a.contact_email || '',
    story.contact_phone || a.contact_phone || '',
    opts.status,
    '', // קישור לתצוגה מקדימה — נכתב ע"י הפייפליין
    '', // קישור לסיפור — נכתב ע"י הפייפליין
    '', // אימייל נשלח — נכתב ע"י אוטומציית ההתראות
  ];
}

/** SL-HE-260820-K4T9 — same shape story_edit/ids.py generates, so both sides agree. */
export function makeOrderId(lang = 'he'): string {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O — visually ambiguous
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `SL-${lang.toUpperCase()}-${stamp}-${suffix}`;
}