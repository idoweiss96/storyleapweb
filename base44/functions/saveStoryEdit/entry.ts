import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const EDIT_SHEET_ID = '1dPdK1zPcDSHOntvl5PYcn-BFyc6qu-8WGojHJ9Y7fiQ';
const PAGES_SHEET = 'pages';
const EDITS_SHEET = 'edits';

function colLetter(index) {
  if (index < 26) return String.fromCharCode(65 + index);
  return 'A' + String.fromCharCode(65 + (index - 26));
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { order_id, product = 'stories', language = 'he', pages } = await req.json();
    if (!order_id || !Array.isArray(pages) || pages.length === 0) {
      return Response.json({ error: 'order_id and pages required' }, { status: 400 });
    }

    // הסיפור חייב להיות של המשתמש המחובר. בלי הבדיקה הזו כל משתמש רשום
    // יכול לקרוא ולדרוס סיפור של משפחה אחרת לפי order_id בלבד.
    const owned = await base44.asServiceRole.entities.Story.filter({ order_id });
    const mine = owned.find((s) => s.contact_email === user.email || s.created_by_id === user.id);
    if (!mine) return Response.json({ error: 'Not found' }, { status: 404 });

    // Safety rule 1: an empty cell tells the pipeline "leave this page alone" — never send blank text.
    const nonEmpty = pages.filter((p) => p && Number.isInteger(p.page) && String(p.text || '').trim().length > 0);
    if (nonEmpty.length === 0) {
      return Response.json({ error: 'No non-empty page edits provided' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Locate the existing rows for this order/product/language so we know which ones we may touch.
    const listRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${EDIT_SHEET_ID}/values/${encodeURIComponent(PAGES_SHEET)}!A2:G`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    if (!listRes.ok) {
      const err = await listRes.text();
      return Response.json({ error: err }, { status: 500 });
    }
    const listJson = await listRes.json();
    const rows = listJson.values || [];

    const rowByPage = {};
    rows.forEach((r, i) => {
      if ((r[0] || '') === order_id && (r[1] || 'stories') === product && (r[2] || '') === language) {
        const page = parseInt(r[3], 10);
        if (!Number.isNaN(page)) rowByPage[page] = i + 2; // +2: header row + 1-indexing
      }
    });

    // Safety rule 2: never write a page number that doesn't already exist (a new page has no illustration).
    const applicable = nonEmpty.filter((p) => rowByPage[p.page] !== undefined);
    if (applicable.length === 0) {
      return Response.json({ error: 'No matching pages found for this order' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const data = [];
    applicable.forEach((p) => {
      const rowNum = rowByPage[p.page];
      data.push({ range: `${PAGES_SHEET}!${colLetter(4)}${rowNum}`, values: [[p.text]] });
      data.push({ range: `${PAGES_SHEET}!${colLetter(5)}${rowNum}`, values: [[nowIso]] });
    });

    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${EDIT_SHEET_ID}/values:batchUpdate`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ valueInputOption: 'USER_ENTERED', data }),
      }
    );
    if (!updateRes.ok) {
      const err = await updateRes.text();
      return Response.json({ error: err }, { status: 500 });
    }

    // Append a row to `edits` — this is what triggers the external pipeline.
    // done_at / story_url / note are filled by the pipeline, never by us.
    const editedPages = applicable.map((p) => p.page);
    const editRow = [order_id, product, language, 'edit', nowIso, '', '', ''];
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${EDIT_SHEET_ID}/values/${encodeURIComponent(EDITS_SHEET)}!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [editRow] }),
      }
    );
    if (!appendRes.ok) {
      const err = await appendRes.text();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ success: true, pages_updated: editedPages });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}