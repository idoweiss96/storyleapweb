import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public lookup by story_id — treated as an unguessable capability token, same
// pattern as getStoryPreview/sendKitaAlefResumeLink. Lets guest (non-logged-in)
// visitors reload the checkout/price screen for their own in-progress KitaAlefStory
// without hitting entity RLS (which requires a matching logged-in user).
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { story_id } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    const story = await base44.asServiceRole.entities.KitaAlefStory.get(story_id);
    if (!story) return Response.json({ error: 'Not found' }, { status: 404 });

    return Response.json({ story });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}