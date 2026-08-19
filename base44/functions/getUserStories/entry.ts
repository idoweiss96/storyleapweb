import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const EDIT_SHEET_ID = '1dPdK1zPcDSHOntvl5PYcn-BFyc6qu-8WGojHJ9Y7fiQ';

// {order_id: status} מהשורה האחרונה של כל הזמנה בלשונית edits.
// כישלון כאן לא מפיל את הרשימה — במקרה הגרוע הכרטיס לא יראה 'מתעדכן'.
async function fetchEditStatuses(base44) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${EDIT_SHEET_ID}/values/edits!A2:H`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    if (!res.ok) return {};
    const rows = (await res.json()).values || [];
    const byOrder = {};
    // סריקה קדימה — השורה האחרונה של כל הזמנה גוברת
    for (const r of rows) {
      const oid = (r[0] || '').trim();
      if (oid) byOrder[oid] = { status: (r[3] || '').trim(), story_url: r[6] || '' };
    }
    return byOrder;
  } catch (_) {
    return {};
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch all stories via service role (bypasses RLS), then filter in code
    const allStories = await base44.asServiceRole.entities.Story.list('-created_date', 500);
    const userStories = allStories.filter(s => s.contact_email === user.email || s.created_by_id === user.id);

    // Also fetch KitaAlefStory records belonging to the user (1st-grade questionnaire)
    const allKitaStories = await base44.asServiceRole.entities.KitaAlefStory.list('-created_date', 500);
    const userKitaStories = allKitaStories
      .filter(s => s.contact_email === user.email || s.created_by_id === user.id)
      .map(s => ({ ...s, source: 'kitaalef' }));

    const merged = [...userStories, ...userKitaStories]
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    // מצב עריכה לכל סיפור: 'edit' או 'running' = הפייפליין בונה עכשיו
    const editStatuses = await fetchEditStatuses(base44);
    const withStatus = [];

    for (const s of merged) {
      const e = s.order_id ? editStatuses[s.order_id] : null;
      if (!e) { withStatus.push(s); continue; }

      // עריכה שהסתיימה בזמן שההורה לא היה במסך — הקישור בגיליון חדש יותר
      // מזה שעל הישות. הגיליון הוא מקור האמת; מיישרים את הישות אליו.
      let story = { ...s };
      if (e.status === 'done' && e.story_url && e.story_url !== s.story_link) {
        try {
          await base44.asServiceRole.entities.Story.update(s.id, { story_link: e.story_url });
          story.story_link = e.story_url;
        } catch (_) { /* לא קריטי — ייושר בטעינה הבאה */ }
      }

      story.edit_status = e.status;
      story.edit_pending = e.status === 'edit' || e.status === 'running';
      withStatus.push(story);
    }

    return Response.json({ stories: withStatus });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});