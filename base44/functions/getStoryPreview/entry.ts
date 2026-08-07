import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public lookup used to pre-fill the questionnaire recap/purchase flow when a parent
// clicks "Continue the story" from a preview email or from My Stories.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { id } = await req.json();
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    const preview = await base44.asServiceRole.entities.StoryPreview.get(id);
    if (!preview) return Response.json({ error: 'Not found' }, { status: 404 });

    return Response.json({
      preview: {
        id: preview.id,
        child_name: preview.child_name,
        child_age: preview.child_age,
        gender: preview.gender,
        child_image_url: preview.child_image_url,
        parent_image_url: preview.parent_image_url,
        parent_relation: preview.parent_relation,
        setting: preview.setting,
        challenge_type: preview.challenge_type,
        custom_challenge: preview.custom_challenge,
        trigger_desc: preview.trigger_desc,
        reaction_type: preview.reaction_type,
        hobbies: preview.hobbies,
        contact_email: preview.contact_email,
        contact_phone: preview.contact_phone,
        lang: preview.lang,
        status: preview.status,
        preview_link: preview.preview_link,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}