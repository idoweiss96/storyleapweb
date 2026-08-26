import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public update, scoped to story_id — used by the KitaAlef checkout screen so
// guest (non-logged-in) visitors can persist contact details / answers on their
// own in-progress KitaAlefStory. Entity RLS requires a matching logged-in user,
// which blocks anonymous updates from the client SDK; this function updates via
// asServiceRole instead. story_id is an unguessable capability token (same
// pattern as getKitaAlefStory / createKitaAlefStory).
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { story_id, contact_email, contact_phone, lang, answers } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    const updates = {};
    if (contact_email !== undefined) updates.contact_email = contact_email;
    if (contact_phone !== undefined) updates.contact_phone = contact_phone;
    if (lang !== undefined) updates.lang = lang;
    if (answers !== undefined) updates.answers = answers;

    await base44.asServiceRole.entities.KitaAlefStory.update(story_id, updates);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}