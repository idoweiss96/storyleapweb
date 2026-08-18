import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Shared spreadsheet used by the external story-editing pipeline.
// DO NOT touch the order-tracking sheets from here — this is a separate sheet.
const EDIT_SHEET_ID = '1dPdK1zPcDSHOntvl5PYcn-BFyc6qu-8WGojHJ9Y7fiQ';
const PAGES_SHEET = 'pages';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { order_id, product = 'stories', language = 'he' } = await req.json();
    if (!order_id) return Response.json({ error: 'order_id required' }, { status: 400 });

    // הסיפור חייב להיות של המשתמש המחובר. בלי הבדיקה הזו כל משתמש רשום
    // יכול לקרוא ולדרוס סיפור של משפחה אחרת לפי order_id בלבד.
    const owned = await base44.asServiceRole.entities.Story.filter({ order_id });
    const mine = owned.find((s) => s.contact_email === user.email || s.created_by_id === user.id);
    if (!mine) return Response.json({ error: 'Not found' }, { status: 404 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${EDIT_SHEET_ID}/values/${encodeURIComponent(PAGES_SHEET)}!A2:G`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }
    const json = await res.json();
    const rows = json.values || [];

    // Rows aren't sorted by page in the sheet — filter for this order, then sort ourselves.
    const matches = rows.filter((r) => (r[0] || '') === order_id && (r[1] || 'stories') === product && (r[2] || '') === language);

    let cover = null;
    const pages = [];
    matches.forEach((r) => {
      const page = parseInt(r[3], 10);
      if (Number.isNaN(page)) return;
      const image_url = r[6] || '';
      if (page === 0) {
        cover = { page: 0, image_url };
      } else {
        pages.push({ page, text: r[4] || '', image_url });
      }
    });
    pages.sort((a, b) => a.page - b.page);

    return Response.json({ cover, pages });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}