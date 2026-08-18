import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const EDIT_SHEET_ID = '1dPdK1zPcDSHOntvl5PYcn-BFyc6qu-8WGojHJ9Y7fiQ';
const EDITS_SHEET = 'edits';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { order_id, product = 'stories', language = 'he' } = await req.json();
    if (!order_id) return Response.json({ error: 'order_id required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${EDIT_SHEET_ID}/values/${encodeURIComponent(EDITS_SHEET)}!A2:H`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }
    const json = await res.json();
    const rows = json.values || [];

    // Most recent matching row wins — a story can be edited more than once.
    let latest = null;
    for (let i = rows.length - 1; i >= 0; i--) {
      const r = rows[i];
      if ((r[0] || '') === order_id && (r[1] || 'stories') === product && (r[2] || '') === language) {
        latest = r;
        break;
      }
    }
    if (!latest) return Response.json({ status: null });

    return Response.json({
      status: latest[3] || '',
      requested_at: latest[4] || '',
      done_at: latest[5] || '',
      story_url: latest[6] || '',
      note: latest[7] || '',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}