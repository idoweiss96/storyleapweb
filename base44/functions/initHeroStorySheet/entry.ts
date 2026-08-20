import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { sheetFor } from '../../shared/heroStorySheet.ts';

// Repairs the headers of an existing hero_story order sheet. Admin only.
//
// This function used to CREATE the spreadsheet too. It no longer can, on purpose: the two
// sheets already exist (created by hero_story/setup_sheet.py on 2026-08-20) and their ids
// are wired into both the site and the pipeline. A second creator would happily make a
// third spreadsheet with the right name and the right headers, that nothing reads — and
// the only symptom would be orders that quietly never turn into books.
//
// hero_story/setup_sheet.py remains the single tool that creates sheets.
//
// What this is for: a header row that got edited, sorted or deleted by hand. Rewriting row
// 1 fixes it, because the pipeline reads columns BY HEADER NAME — a renamed header is read
// as an empty field, silently, and the family gets a generic book.

const WORLDS = [
  ['key', 'World (Hebrew)', 'World (English)', 'Tags'],
  ['dinosaurs', 'עולם הדינוזאורים', 'Dinosaur world', 'adventure, animals'],
  ['space', 'חלל ומסע בין כוכבים', 'Space and interstellar travel', 'adventure, science'],
  ['unicorns', 'חד-קרן וקסם', 'Unicorns and magic', 'fantasy, magic'],
  ['superhero', 'גיבורי על', 'Superheroes', 'adventure, city'],
  ['pirates', 'פיראטים ואוצרות', 'Pirates and treasure', 'adventure, sea'],
  ['ocean', 'עולם תת-ימי', 'Ocean and underwater world', 'adventure, animals'],
  ['jungle', "ג'ונגל וספארי", 'Jungle and safari', 'adventure, animals'],
  ['kingdom', 'ממלכה, ארמון ואבירים', 'Kingdom, castle and knights', 'fantasy, adventure'],
  ['forest', 'יער קסום וחיות מדברות', 'Magical forest and talking animals', 'fantasy, animals'],
  ['sports', 'עולם הספורט', 'Sports world', 'real-life'],
  ['dance_music', 'מוזיקה וריקוד', 'Music and dance', 'real-life, arts'],
  ['trains_vehicles', 'רכבות, מכוניות וכלי תחבורה', 'Trains, cars and vehicles', 'adventure, vehicles'],
  ['farm', 'חווה וחיות', 'Farm and animals', 'real-life, animals'],
  ['snow', 'ארץ הקרח והשלג', 'Snow and ice world', 'adventure, animals'],
  ['sweets', 'ארץ הממתקים', 'Candy land', 'fantasy'],
  ['detective', 'בלש ותעלומות', 'Detective and mysteries', 'real-life, mystery'],
  ['everyday', 'סיפור מהחיים האמיתיים', 'Real life story', 'real-life'],
];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const language = body.language === 'en' ? 'en' : 'he';
    const { spreadsheetId, sheetName, headers } = sheetFor(language);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const authHeaders = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1?valueInputOption=RAW`,
      { method: 'PUT', headers: authHeaders, body: JSON.stringify({ values: [headers] }) }
    );
    if (!writeRes.ok) {
      return Response.json({ error: await writeRes.text(), step: 'headers', spreadsheetId }, { status: 500 });
    }

    // Reference tab — the exact world names the questionnaire offers, so a row filled in
    // by hand carries a value themes.match_theme() actually recognises.
    const worldsTab = language === 'en' ? 'Worlds' : 'עולמות';
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(worldsTab)}!A1?valueInputOption=RAW`,
      { method: 'PUT', headers: authHeaders, body: JSON.stringify({ values: WORLDS }) }
    ).catch(() => {});

    return Response.json({
      success: true,
      language,
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      headersCount: headers.length,
      note: 'Headers rewritten. This function never creates a spreadsheet — use hero_story/setup_sheet.py for that.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
