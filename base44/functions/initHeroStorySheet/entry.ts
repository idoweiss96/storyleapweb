import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { HEADERS, HERO_SHEET_NAME } from '../../shared/heroStorySheet.ts';

// Creates the hero_story order spreadsheet from scratch and writes its headers.
//
// Unlike initKitaAlefSheet, which writes headers into a spreadsheet someone created by
// hand, this one CREATES the file — there is nothing to point at yet. It returns the new
// spreadsheetId, which must then be pasted into two places:
//   1. base44/functions/addHeroStoryToSheet/entry.ts   → SPREADSHEET_ID
//   2. hero_story/sheets_reader.py                     → HE_SHEET_ID
//
// Running it twice creates a SECOND spreadsheet — it is not idempotent, deliberately:
// silently reusing "some sheet with a similar name" is how orders end up in the wrong file.
// Pass { spreadsheet_id } to (re)write headers into an existing sheet instead.

const WORLDS = [
  ['מפתח', 'שם העולם', 'למי זה מתאים'],
  ['dinosaurs', 'עולם הדינוזאורים', 'הרפתקה, חיות'],
  ['space', 'חלל ומסע בין כוכבים', 'הרפתקה, מדע'],
  ['unicorns', 'חד-קרן וקסם', 'פנטזיה'],
  ['superhero', 'גיבורי על', 'הרפתקה, עיר'],
  ['pirates', 'פיראטים ואוצרות', 'הרפתקה, ים'],
  ['ocean', 'עולם תת-ימי', 'הרפתקה, חיות'],
  ['jungle', "ג'ונגל וספארי", 'הרפתקה, חיות'],
  ['kingdom', 'ממלכה, ארמון ואבירים', 'פנטזיה'],
  ['forest', 'יער קסום וחיות מדברות', 'פנטזיה, חיות'],
  ['sports', 'עולם הספורט', 'מהחיים'],
  ['dance_music', 'מוזיקה וריקוד', 'מהחיים, אמנות'],
  ['trains_vehicles', 'רכבות, מכוניות וכלי תחבורה', 'הרפתקה'],
  ['farm', 'חווה וחיות', 'מהחיים, חיות'],
  ['snow', 'ארץ הקרח והשלג', 'הרפתקה, חיות'],
  ['sweets', 'ארץ הממתקים', 'פנטזיה'],
  ['detective', 'בלש ותעלומות', 'מהחיים, תעלומה'],
  ['everyday', 'סיפור מהחיים האמיתיים', 'מהחיים'],
];

const WORLDS_SHEET = 'עולמות';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const existingId = (body.spreadsheet_id || '').trim();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const authHeaders = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    let spreadsheetId = existingId;

    if (!spreadsheetId) {
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          properties: { title: 'StoryLeap — הזמנות ספר הגיבור/ה', locale: 'iw_IL' },
          sheets: [
            { properties: { title: HERO_SHEET_NAME, gridProperties: { frozenRowCount: 1 }, rightToLeft: true } },
            { properties: { title: WORLDS_SHEET, rightToLeft: true } },
          ],
        }),
      });
      if (!createRes.ok) {
        return Response.json({ error: await createRes.text(), step: 'create' }, { status: 500 });
      }
      spreadsheetId = (await createRes.json()).spreadsheetId;
    }

    // Headers of the questionnaire tab
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(HERO_SHEET_NAME)}!A1?valueInputOption=RAW`,
      { method: 'PUT', headers: authHeaders, body: JSON.stringify({ values: [HEADERS] }) }
    );
    if (!writeRes.ok) {
      return Response.json({ error: await writeRes.text(), step: 'headers', spreadsheetId }, { status: 500 });
    }

    // Reference tab — the exact world names the questionnaire offers, so whoever fills a
    // row by hand writes a value themes.match_theme() will actually recognise.
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(WORLDS_SHEET)}!A1?valueInputOption=RAW`,
      { method: 'PUT', headers: authHeaders, body: JSON.stringify({ values: WORLDS }) }
    ).catch(() => {});

    return Response.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      headersCount: HEADERS.length,
      created: !existingId,
      next_steps: [
        'הדביקו את spreadsheetId ב-base44/functions/addHeroStoryToSheet/entry.ts (SPREADSHEET_ID)',
        'הדביקו את אותו spreadsheetId ב-hero_story/sheets_reader.py (HE_SHEET_ID)',
        'שתפו את הגיליון עם חשבון ה-Google שמריץ את הפייפליין',
      ],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
