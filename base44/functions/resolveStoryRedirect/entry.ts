import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public on purpose: parents open the permanent /story/{order_id} link (e.g. from WhatsApp)
// without necessarily being logged in. Only ever returns a redirect URL, nothing else.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { order_id } = await req.json();
    if (!order_id) return Response.json({ error: 'order_id required' }, { status: 400 });

    const stories = await base44.asServiceRole.entities.Story.filter({ order_id });
    const story = stories[0];
    if (!story || !story.story_link) {
      return Response.json({ error: 'not_found' }, { status: 404 });
    }

    return Response.json({ url: story.story_link });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}