import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { COL, colLetter, rowFromStory, makeOrderId, sheetFor } from '../../shared/prepareStorySheet.ts';

// Writes one prepare-story order into the order sheet the Python pipeline watches.
//
// One spreadsheet per language — the ids and the reason for the split live in
// prepareStorySheet.ts (sheetFor). The same ids sit in
// perpare_child_story/sheet_id_he.txt and sheet_id_en.txt: here the site writes, there the
// pipeline reads. Changing one side without the other breaks the chain silently — orders
// keep being accepted and no book is ever produced.

// Same two-stage flow as every other product: a row with status "preview" makes the
// watcher produce the full text but only PREVIEW_PAGES illustrations; "paid" makes it
// finish the rest. A row with an empty status is never picked up.
type Status = 'preview' | 'paid';

async function findRowByOrderId(
  accessToken: string, orderId: string, spreadsheetId: string, sheetName: string
): Promise<number | null> {
  if (!orderId) return null;
  // A3 and not A2: row 2 of this sheet is the per-column explanation row that
  // setup_sheets.py writes, and it must never be mistaken for data.
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A3:AI`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  const rows = (await res.json()).values || [];
  for (let i = rows.length - 1; i >= 0; i--) {
    if ((rows[i][COL.ORDER_ID] || '').trim() === orderId) return i + 3; // +3: header + notes + 1-indexed
  }
  return null;
}

export default async function(req) {
  try {
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
    const lang = story.lang === 'en' ? 'en' : 'he';
    const { spreadsheetId, sheetName, headers } = sheetFor(lang);
    const orderId = (story.order_id || body.order_id || makeOrderId(lang)).trim();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const authHeaders = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // An order that already has a preview row must be UPDATED, not appended again:
    // two rows with the same order id would make the watcher generate (and charge for)
    // the same book twice, and story_edit would not know which row is authoritative.
    const existingRow = await findRowByOrderId(accessToken, orderId, spreadsheetId, sheetName);
    if (existingRow) {
      const statusCol = colLetter(COL.STATUS);
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${statusCol}${existingRow}?valueInputOption=RAW`,
        { method: 'PUT', headers: authHeaders, body: JSON.stringify({ values: [[status]] }) }
      );
      if (!res.ok) return Response.json({ error: await res.text() }, { status: 500 });
      return Response.json({ success: true, action: 'status_updated', row: existingRow, order_id: orderId, status, lang });
    }

    const row = rowFromStory(story, {
      status,
      orderId,
      userEmail: story.contact_email || story.created_by,
      credits: status === 'paid' ? 110 : undefined,
    });

    if (row.length !== headers.length) {
      return Response.json({ error: `row/header length mismatch: ${row.length} vs ${headers.length}` }, { status: 500 });
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:append?valueInputOption=USER_ENTERED`,
        { method: 'POST', headers: authHeaders, body: JSON.stringify({ values: [row] }) }
      );
      if (res.ok) {
        // The id must go back onto the record, otherwise the next call (preview → paid)
        // generates a different one and appends a duplicate row.
        if (story.id && !story.order_id) {
          await base44.asServiceRole.entities.KitaAlefStory.update(story.id, { order_id: orderId }).catch(() => {});
        }
        return Response.json({ success: true, action: 'appended', order_id: orderId, status, lang });
      }
      console.error(`[addPrepareStoryToSheet] attempt ${attempt}:`, res.status, await res.text());
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
    }

    return Response.json({ error: 'Failed after 3 attempts' }, { status: 500 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
