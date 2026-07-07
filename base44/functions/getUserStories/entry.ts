import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch all stories via service role (bypasses RLS), then filter in code
    const allStories = await base44.asServiceRole.entities.Story.list('-created_date', 500);
    const userStories = allStories.filter(s => s.contact_email === user.email || s.created_by_id === user.id);

    return Response.json({ stories: userStories });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});