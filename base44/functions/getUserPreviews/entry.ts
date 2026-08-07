import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const allPreviews = await base44.asServiceRole.entities.StoryPreview.list('-created_date', 500);
    const userPreviews = allPreviews.filter(
      (p) => (p.contact_email || '').toLowerCase() === (user.email || '').toLowerCase() || p.created_by_id === user.id
    );

    return Response.json({ previews: userPreviews });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}