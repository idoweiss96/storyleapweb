import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { HEADERS, HERO_SHEET_NAME, COL, colLetter, rowFromStory, makeOrderId } from '../../shared/heroStorySheet.ts';

// Writes one hero_story order into the order sheet the Python pipeline watches.
//
// ⚠️ SPREADSHEET_ID is empty until someone runs initHeroStorySheet once and pastes the id
// it returns here. Empty on purpose: a wrong-but-plausible default would send real orders
// into another product's sheet, and both products would then generate the same book.
const SPREADSHEET_ID = '';

// Same two-stage flow as the therapeutic product: a row with status "preview" makes the
// watcher produce the full text but only PREVIEW_PAGES illustrations; "paid" makes it
// finish the rest. A row with an empty status is never picked up.
type Status = 'preview' | 'paid';

async function findRowByOrderId(accessToken: string, orderId: string): Promise<number | null> {
  if (!orderId) return null;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(HERO_SHEET_NAME)}!A2:AF`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  const rows = (await res.json()).values || [];
  for (let i = rows.length - 1; i >= 0; i--) {
    if ((rows[i][COL.ORDER_ID] || '').trim() === orderId) return i + 2; // +2: header + 1-indexed
  }
  return null;
}

export default async function(req) {
  try {
    if (!SPREADSHEET_ID) {
      return Response.json({
        error: 'SPREADSHEET_ID is not set — run initHeroStorySheet once and paste the id into ' +
               'base44/functions/addHeroStoryToSheet/entry.ts and hero_story/sheets_reader.py',
      }, { status: 500 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Accepts either { story_id } (preferred — we re-read the record) or an entity
    // automation payload { data: {...} }.
    let story = body.data || body.story || null;
    if (!story && body.story_id) {
      story = await base44.asServiceRole.entities.KitaAlefStory.get(body.story_id);
    }
    if (!story) return Response.json({ error: 'story_id or story data required' }, { status: 400 });

    const status: Status = body.status === 'paid' ? 'paid' : 'preview';
    const orderId = (story.order_id || body.order_id || makeOrderId(story.lang || 'he')).trim();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const authHeaders = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // An order that already has a preview row must be UPDATED, not appended again:
    // two rows with the same order id would make the watcher generate (and charge for)
    // the same book twice, and story_edit would not know which row is authoritative.
    const existingRow = await findRowByOrderId(accessToken, orderId);
    if (existingRow) {
      const statusCol = colLetter(COL.STATUS);
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(HERO_SHEET_NAME)}!${statusCol}${existingRow}?valueInputOption=RAW`,
        { method: 'PUT', headers: authHeaders, body: JSON.stringify({ values: [[status]] }) }
      );
      if (!res.ok) return Response.json({ error: await res.text() }, { status: 500 });
      return Response.json({ success: true, action: 'status_updated', row: existingRow, order_id: orderId, status });
    }

    const row = rowFromStory(story, {
      status,
      orderId,
      userEmail: story.contact_email || story.created_by,
      credits: status === 'paid' ? 110 : undefined,
    });

    if (row.length !== HEADERS.length) {
      return Response.json({ error: `row/header length mismatch: ${row.length} vs ${HEADERS.length}` }, { status: 500 });
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(HERO_SHEET_NAME)}!A1:append?valueInputOption=USER_ENTERED`,
        { method: 'POST', headers: authHeaders, body: JSON.stringify({ values: [row] }) }
      );
      if (res.ok) {
        // The id must go back onto the record, otherwise the next call (preview → paid)
        // generates a different one and appends a duplicate row.
        if (story.id && !story.order_id) {
          await base44.asServiceRole.entities.KitaAlefStory.update(story.id, { order_id: orderId }).catch(() => {});
        }
        return Response.json({ success: true, action: 'appended', order_id: orderId, status });
      }
      console.error(`[addHeroStoryToSheet] attempt ${attempt}:`, res.status, await res.text());
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
    }

    return Response.json({ error: 'Failed after 3 attempts' }, { status: 500 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
