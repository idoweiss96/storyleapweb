import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public create — used by the KitaAlef questionnaire so guest (non-logged-in)
// visitors can save their answers and reach the checkout/price screen. Entity RLS
// requires created_by_id to match a logged-in user, which blocks anonymous
// creates from the client SDK; this function creates via asServiceRole instead.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { child_space_id, child_name, gender, child_image_url, answers, lang, contact_email, contact_phone } = body;

    const story = await base44.asServiceRole.entities.KitaAlefStory.create({
      child_space_id: child_space_id || undefined,
      child_name: child_name || '',
      gender: gender || '',
      child_image_url: child_image_url || null,
      answers: answers || {},
      lang,
      contact_email: contact_email || null,
      contact_phone: contact_phone || null,
      content: null,
      story_link: null,
      payment_status: 'draft',
    });

    return Response.json({ id: story.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}