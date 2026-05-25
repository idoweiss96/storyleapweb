import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const story = payload.data;
    if (!story || !story.story_link || !story.contact_email) {
      return Response.json({ skipped: true });
    }

    const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');

    await base44.asServiceRole.functions.invoke('sendStoryReadyEmail', {
      to: story.contact_email,
      childName: story.child_name,
      storyLink: story.story_link,
      isHebrew,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});