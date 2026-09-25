// mirrorToSupabase — אוטומציה על כל ישות (create / update / delete):
// כל שמירה באתר נדחפת מיד למראה ב-Supabase (db/supabase/schema_part8.sql).
//
// המקור של הקובץ הזה: db/push/mirrorToSupabase/entry.ts במאגר. אותו קובץ
// בדיוק רץ בשני האתרים; האסימון (MIRROR_PUSH_TOKEN) קובע לאיזה אתר זה נרשם.
//
// לא סומכים על מה שנשלח: הכתובת של פונקציה ב-Base44 ציבורית, ולכן הרשומה
// נקראת מחדש מ-Base44 לפי המזהה, והיא — לא ה-payload — מה שנשלח ל-DB. מי
// שקורא לפונקציה מבחוץ יכול לכל היותר לגרום לסנכרון חוזר של רשומה אמיתית.
//
// הפונקציה לא משנה שום דבר באתר, ואף פעם לא מכשילה את השמירה עצמה:
// כשל נרשם בלוג ומוחזר בתשובה, והשמירה באתר כבר הצליחה.
//
// סודות (base44 secrets): SUPABASE_URL, SUPABASE_ANON_KEY, MIRROR_PUSH_TOKEN

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const event = payload?.event ?? {};
  const entity: string = event.entity_name ?? payload?.entity_name ?? '';
  const id: string = payload?.data?.id ?? event.entity_id ?? payload?.entity_id ?? '';
  const type = String(event.type ?? payload?.type ?? '').toLowerCase();

  if (!/^[A-Z][A-Za-z0-9_]{0,63}$/.test(entity) || !id) {
    return Response.json({ ok: false, error: 'missing entity or id' }, { status: 400 });
  }

  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  const token = Deno.env.get('MIRROR_PUSH_TOKEN');
  if (!url || !anon || !token) {
    console.error('[mirrorToSupabase] missing secrets');
    return Response.json({ ok: false, error: 'mirror secrets missing' });
  }

  // המצב האמיתי של הרשומה עכשיו. לא נמצאה = נמחקה.
  let record: any = null;
  try {
    const base44 = createClientFromRequest(req);
    record = await base44.asServiceRole.entities[entity].get(id);
  } catch (e) {
    const status = (e as any)?.response?.status ?? (e as any)?.status;
    if (status && status !== 404) {
      console.error('[mirrorToSupabase] read failed', entity, id, status);
      return Response.json({ ok: false, error: `read failed (${status})` });
    }
  }

  let pushEvent: string;
  if (!record) {
    if (!type.includes('delete')) {
      // לא נמצאה ולא נמחקה — כנראה קריאה מבחוץ עם מזהה שלא קיים
      return Response.json({ ok: false, error: 'record not found' }, { status: 404 });
    }
    pushEvent = 'delete';
    record = { id };
  } else {
    pushEvent = type.includes('create') ? 'create' : 'update';
  }

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/mirror_push`, {
      method: 'POST',
      headers: { apikey: anon, Authorization: `Bearer ${anon}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_token: token, p_entity: entity, p_event: pushEvent, p_record: record }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.ok) {
      console.error('[mirrorToSupabase] push failed', entity, id, res.status, JSON.stringify(body)?.slice(0, 300));
    }
    return Response.json({ ok: res.ok && !!body?.ok, entity, id, event: pushEvent, result: body });
  } catch (e) {
    console.error('[mirrorToSupabase] network error', entity, id, String(e));
    return Response.json({ ok: false, error: 'network error' });
  }
});
