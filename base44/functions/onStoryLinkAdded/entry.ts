import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const story = payload.data;
    if (!story || !story.story_link) {
      return Response.json({ skipped: true });
    }

    // Use contact_email if available, otherwise fall back to the creator's email
    let recipientEmail = story.contact_email;
    if (!recipientEmail && story.created_by_id) {
      try {
        const creator = await base44.asServiceRole.entities.User.get(story.created_by_id);
        if (creator?.email) recipientEmail = creator.email;
      } catch (_) {}
    }
    if (!recipientEmail) {
      return Response.json({ skipped: true, reason: 'no_email' });
    }

    const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');

    await base44.asServiceRole.functions.invoke('sendStoryReadyEmail', {
      to: recipientEmail,
      childName: story.child_name,
      storyLink: story.story_link,
      isHebrew,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});