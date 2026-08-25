// Single source of truth for the prepare-story ("סיפור הכנה") order sheet.
//
// Why this file exists: the questionnaire is filled here, but the book is produced by an
// external Python pipeline (perpare_child_story/ in the StoryLeap repo) that reads the
// sheet by COLUMN HEADER, not by position. If a header here drifts from the header that
// perpare_child_story/data_processor.py looks for, the field is read as empty — silently,
// with no error — and the family gets a generic book. So every writer of this sheet
// imports the header list from here, and the pipeline side mirrors it in
// perpare_child_story/sheet_schema.py.
//
// Rules when changing this file:
//   1. Append new columns at the END of the content block and never reorder existing ones —
//      rows already written keep their positions, and the pipeline reads old rows too.
//   2. Change a header string only together with perpare_child_story/sheet_schema.py.
//   3. Keep HEADERS and rowFromStory in the same order.
//
// ── What this product is, and why the questionnaire looks like this ──────────────────
// This is NOT a therapeutic book. `stories` builds a CBT arc — an unhelpful thought, a
// skill, a behavioural experiment. There is a problem there and it gets solved. Here
// there is no problem: the event has not happened yet, and the book exists to make it
// FAMILIAR before it arrives.
//
// Four kinds of information do that, and each one has its own column:
//   1. PROCEDURAL — what happens, in order, step by step. Without it the book describes
//      a feeling rather than an event, and the child still does not know what is coming.
//   2. SENSORY — what they will see, hear and feel in their body. This is what prevents
//      the surprise that actually frightens: the chair tipping back, the suction noise.
//   3. AGENCY — what the child can choose, hold, say or do. An event you have a job in
//      is an event you take part in, not one that happens to you.
//   4. CONTINUITY — what stays exactly the same. The emotional anchor of the book.
//
// ── And why the worry is a separate yes/no question ──────────────────────────────────
// The documented failure in `stories`: a questionnaire contained an event and a behaviour
// with no feeling anywhere, the CBT block demanded an explicit distressing thought, and
// so the model INVENTED one — a belief that the girl would not be seen, which nobody in
// the family had ever reported. A book can PLANT a worry, not only process one. So the
// worry is asked outright, and only if the answer is yes — and only in the child's own
// words — does it enter the book at all.

export const PREPARE_SHEET_NAME = 'שאלון';
export const PREPARE_SHEET_NAME_EN = 'Questionnaire';

// Separate spreadsheet per language, exactly like every other product. NOT one sheet with
// a language column: the English watcher picks a row by status without looking at the
// language, so it would happily pick up Hebrew rows and write them an English book.
// Created by perpare_child_story/setup_sheets.py.
export const PREPARE_SPREADSHEET_ID_HE = '1ONsavdVJadvre2PAsdEJB7p6eGP684CSqmFOn5J-MVU';
export const PREPARE_SPREADSHEET_ID_EN = '1aznjrvFat12MRrOjXWL0bP4ZiTjXKg9llOTAs0RMQBQ';

/** (spreadsheetId, tab name, headers) for a language. */
export function sheetFor(language: string) {
  return language === 'en'
    ? { spreadsheetId: PREPARE_SPREADSHEET_ID_EN, sheetName: PREPARE_SHEET_NAME_EN, headers: HEADERS_EN }
    : { spreadsheetId: PREPARE_SPREADSHEET_ID_HE, sheetName: PREPARE_SHEET_NAME, headers: HEADERS };
}

/** Column headers, in sheet order. Mirrored by perpare_child_story/sheet_schema.py. */
export const HEADERS = [
  'תאריך',                                                  // A
  'שפה',                                                    // B
  'מזהה הזמנה',                                             // C
  'אימייל משתמש',                                           // D
  'קרדיטים',                                                // E
  'שם הילד/ה',                                              // F
  'גיל',                                                    // G
  'מגדר',                                                   // H
  'קישור לתמונת הילד/ה',                                    // I
  'אישור צילום',                                            // J
  'קישור לתמונת ההורה',                                     // K
  'מי בתמונה (אמא/אבא)',                                    // L
  'נושא ההכנה',                                             // M
  'הנושא במילים שלכם',                                      // N
  'מתי זה קורה',                                            // O
  'מה בדיוק הולך לקרות — שלב אחרי שלב',                     // P
  'איפה זה יקרה ומי יהיה שם',                               // Q
  'מה יראו, ישמעו או ירגישו בגוף',                          // R
  'מה התפקיד של הילד/ה — מה יוכל/תוכל לבחור או לעשות',      // S
  'מה נשאר בדיוק אותו דבר',                                 // T
  'משהו טוב אחד לצפות לו',                                  // U
  'האם הילד/ה שאל/ה או הביע/ה חשש?',                        // V
  'מה בדיוק נאמר — במילים של הילד/ה',                       // W
  'מה בדרך כלל מרגיע אותו/ה',                               // X
  'מה הילד/ה אוהב/ת (תחביבים, משחקים, צעצועים)',            // Y
  'במה הילד/ה טוב/ה',                                       // Z
  'עולם הסיפור',                                            // AA
  'מי מצטרף לסיפור',                                        // AB
  'הערות ההורה',                                            // AC
  'אימייל לקשר',                                            // AD
  'טלפון לקשר',                                             // AE
  'סטטוס',                                                  // AF
  'קישור לתצוגה מקדימה',                                    // AG
  'קישור לסיפור',                                           // AH
  'אימייל נשלח',                                            // AI
];

/**
 * English headers. Same order as HEADERS, so the two sheets read side by side, and the
 * exact vocabulary perpare_child_story/sheet_schema.py looks for (HEADERS_EN).
 */
export const HEADERS_EN = [
  'Timestamp',                                              // A
  'Language',                                               // B
  'Order ID',                                               // C
  'User Email',                                             // D
  'Credits',                                                // E
  "Child's Name",                                           // F
  'Age',                                                    // G
  'Gender',                                                 // H
  "Child's Photo Link",                                     // I
  'Photo Consent',                                          // J
  "Parent's Photo Link",                                    // K
  'Whose Photo (Mom/Dad)',                                  // L
  'Preparation Topic',                                      // M
  'Topic In Your Own Words',                                // N
  'When Is It Happening',                                   // O
  'What Exactly Will Happen — Step By Step',                // P
  'Where It Happens And Who Will Be There',                 // Q
  'What They Will See, Hear Or Feel',                       // R
  "The Child's Role — What They Can Choose Or Do",          // S
  'What Stays Exactly The Same',                            // T
  'One Good Thing To Look Forward To',                      // U
  'Has The Child Asked Or Expressed A Worry?',              // V
  "What Exactly Was Said — In The Child's Own Words",       // W
  'What Usually Helps Them Settle',                         // X
  'What The Child Loves (Hobbies, Games, Toys)',            // Y
  'What The Child Is Good At',                              // Z
  'Story World',                                            // AA
  'Who Joins The Story',                                    // AB
  'Parent Notes',                                           // AC
  'Contact Email',                                          // AD
  'Contact Phone',                                          // AE
  'status',                                                 // AF
  'preview link',                                           // AG
  'story link',                                             // AH
  'Email Sent',                                             // AI
];

// Column indexes the writers need by name (0-based, matching HEADERS above).
// Identical in both languages — the two header lists are kept in the same order.
export const COL = {
  ORDER_ID: 2,
  TOPIC: 12,
  CONTACT_EMAIL: 29,
  STATUS: 31,
  PREVIEW_LINK: 32,
  STORY_LINK: 33,
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
// perpare_child_story/data_processor reads 'בת' in Hebrew and 'girl'/'female' in English,
// so a row written in the wrong vocabulary silently produces a book about a boy.
const GENDER: Record<string, Record<string, string>> = {
  he: { 'ילד': 'בן', 'ילדה': 'בת', 'אחר/ת': 'אחר', Boy: 'בן', Girl: 'בת', Other: 'אחר' },
  en: { 'ילד': 'Boy', 'ילדה': 'Girl', 'אחר/ת': 'Other', Boy: 'Boy', Girl: 'Girl', Other: 'Other' },
};

// The worry gate, on this side of the wire.
//
// The pipeline turns the worry on only when BOTH the answer is yes AND there is text —
// "yes" with no words leaves the model to invent the content, which is the one failure
// this product exists to prevent. We write the same pair of cells honestly: if the parent
// said no, or said yes and wrote nothing, the worry columns go out empty and the book
// contains no worry at all.
const YES_HE = 'כן';
const NO_HE = 'לא';

function worryCells(a: Record<string, any>, lang: string): [string, string] {
  const said = a.worry_text || '';
  const flagged = a.has_worry === true
    || a.has_worry === YES_HE
    || String(a.has_worry || '').toLowerCase() === 'yes';
  if (!flagged || !said.trim()) {
    return [lang === 'en' ? 'No' : NO_HE, ''];
  }
  return [lang === 'en' ? 'Yes' : YES_HE, said];
}

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
  const created = story.created_date
    ? new Date(story.created_date).toLocaleString('he-IL')
    : new Date().toLocaleString('he-IL');

  const joinList = (v: any) => (Array.isArray(v) ? v.filter(Boolean).join(', ') : (v || ''));
  const [worryFlag, worrySaid] = worryCells(a, lang);

  // family_photos is a single {role, customLabel, photo} object (FamilyPhotosInput).
  // Only a parent's photo is usable downstream — the pipeline refuses to draw any other
  // real person without a photo, and inventing a grandparent's face is worse than omitting.
  const fp = a.family_photos || {};
  const parentPhoto = fp.photo || '';
  const parentWho = fp.role === 'father' || fp.role === 'אבא'
    ? (lang === 'en' ? 'Dad' : 'אבא')
    : parentPhoto
      ? (lang === 'en' ? 'Mom' : 'אמא')
      : '';

  // The topic is stored as the stable key ("dentist_visit"), never the translated label.
  // data_processor splits on the em dash, so "key — 🦷 label" is also accepted, but the
  // bare key is what we write: a label can be reworded, a key cannot.
  const topicKey = a.topic_key || a.topic || '';

  return [
    created,
    lang === 'he' ? 'עברית' : 'English',
    opts.orderId || story.order_id || '',
    opts.userEmail || story.contact_email || '',
    opts.credits !== undefined ? String(opts.credits) : '',
    a.name || story.child_name || '',
    a.age || '',
    (GENDER[lang] || GENDER.he)[a.gender] || a.gender || story.gender || '',
    a.photo || story.child_image_url || '',
    a.photo_consent ? (lang === 'en' ? 'Yes' : YES_HE) : '',
    parentPhoto,
    parentWho,
    topicKey,
    a.topic_free_text || '',
    a.when_it_happens || '',
    a.steps_reported || '',
    a.place_and_people || '',
    a.sensory_reported || '',
    a.child_role || '',
    a.staying_same || '',
    a.looking_forward || '',
    worryFlag,
    worrySaid,
    a.what_helps || '',
    joinList(a.hobbies) + (a.hobbies_parent ? ` | ${a.hobbies_parent}` : ''),
    a.strengths || '',
    joinList(a.theme),
    joinList(a.companions),
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