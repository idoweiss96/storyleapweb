import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Read credits from DB (source of truth) using service role
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const dbUser = users[0];
    const credits = dbUser?.credits ?? 0;

    // Sync session if different
    if (dbUser && dbUser.credits !== user.credits) {
      try { await base44.auth.updateMe({ credits: dbUser.credits }); } catch (_) {}
    }

    return Response.json({ credits, user_id: dbUser?.id || user.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});