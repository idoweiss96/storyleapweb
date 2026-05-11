import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { to, childName, storyLink } = await req.json();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      subject: `${childName}'s Story is Ready! ✨`,
      body: `Hi there! ✨<br><br>${childName} personalized story is ready.<br><br>You can read it here: ${storyLink}<br><br>Please open this in a landscape mode.<br><br>Thanks for choosing StoryLeap 💛<br><br>The StoryLeap Team`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});