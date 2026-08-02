import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public redirect endpoint: parents click this link from the "story ready" email instead of
// linking directly to the external flipbook. It logs the first-open timestamp (link_opened_at)
// on the matching Story/KitaAlefStory record, then forwards them to the real story_link.
// This is what lets us later detect "story opened" (not just "email delivered") for the
// feedback-survey trigger, and it only records the FIRST open so repeat visits don't reset it.
export default async function(req) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get('id');
    let type = url.searchParams.get('type');

    // Fallback to a JSON body (used when testing this function directly via invoke/POST) —
    // in production the real email links always hit this as a GET with query params.
    if (!id || !type) {
      try {
        const body = await req.json();
        id = id || body.id;
        type = type || body.type;
      } catch (_) {}
    }

    if (!id || !type) {
      return new Response('Missing link parameters', { status: 400 });
    }

    const entityName = type === 'kita' ? 'KitaAlefStory' : 'Story';
    const base44 = createClientFromRequest(req);
    const record = await base44.asServiceRole.entities[entityName].get(id);

    if (!record || !record.story_link) {
      return new Response('Story link not found', { status: 404 });
    }

    if (!record.link_opened_at) {
      await base44.asServiceRole.entities[entityName].update(id, { link_opened_at: new Date().toISOString() });
    }

    return new Response(null, { status: 302, headers: { Location: record.story_link } });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}