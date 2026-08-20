import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { sendGmailRawEmail } from '../../shared/gmailRawEmail.ts';
import { CREDITS_PER_BOOK, makeOrderId } from '../../shared/heroStorySheet.ts';

// Mirrors submitMovingHouseStoryWithCredits (credit deduction + notification), for the
// hero_story gift book. The one real difference: this flow also writes the questionnaire
// row into the hero_story order sheet, because that sheet IS the hand-off to the Python
// pipeline — without it the payment succeeds and nothing is ever produced.

async function sendStoryInProgressEmail(serviceRole, email, childName, lang, gender) {
  if (!email) return;
  const isEn = lang === 'en';
  const her = /בת|girl|Girl/.test(gender || '');

  const subject = isEn
    ? `${childName}'s adventure is on its way! ✨`
    : `ההרפתקה של ${childName} בדרך! ✨`;

  const body = isEn
    ? `<div dir="ltr" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
    <p style="font-size:16px;line-height:1.7;">Hi there, we've got ${childName}'s details and we're writing the story where ${her ? 'she' : 'he'} is the hero. We'll email you the moment the book is ready.</p>
    <p style="margin-top:24px;font-size:15px;">Thank you,<br/>The StoryLeap Team</p>
  </div>`
    : `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
    <p style="font-size:16px;line-height:1.7;">היי, קיבלנו את הפרטים של ${childName} ואנחנו כותבים את הסיפור ש${her ? 'בו היא הגיבורה' : 'בו הוא הגיבור'}. נעדכן אתכם במייל ברגע שהספר מוכן.</p>
    <p style="margin-top:24px;font-size:15px;">תודה,<br/>צוות StoryLeap</p>
  </div>`;

  await sendGmailRawEmail(serviceRole, email, subject, body);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { story_id, lang } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const dbUser = users[0];
    if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const currentCredits = dbUser.credits || 0;
    if (currentCredits < CREDITS_PER_BOOK) {
      return Response.json({ success: false, reason: 'insufficient_credits', credits: currentCredits });
    }

    const story = await base44.asServiceRole.entities.KitaAlefStory.get(story_id);
    if (!story) return Response.json({ error: 'Story not found' }, { status: 404 });

    const effectiveLang = lang || story.lang || 'he';
    const orderId = (story.order_id || '').trim() || makeOrderId(effectiveLang);

    // Charge only after we know the record exists — a failed lookup must not cost credits.
    await base44.asServiceRole.entities.User.update(dbUser.id, { credits: currentCredits - CREDITS_PER_BOOK });

    await base44.asServiceRole.entities.KitaAlefStory.update(story_id, {
      payment_status: 'paid',
      order_id: orderId,
      ...(effectiveLang ? { lang: effectiveLang } : {}),
    });

    // The hand-off to the pipeline. Awaited, not fire-and-forget: if the sheet write fails
    // the customer has paid and nothing downstream will ever pick the order up, so the
    // failure has to be visible in this response.
    let sheet_written = false;
    let sheet_error = '';
    try {
      const res = await base44.asServiceRole.functions.invoke('addHeroStoryToSheet', {
        story_id,
        status: 'paid',
        order_id: orderId,
      });
      sheet_written = !!res?.data?.success;
      if (!sheet_written) sheet_error = res?.data?.error || 'unknown';
    } catch (e) {
      sheet_error = e.message;
    }

    if (story.contact_email) {
      await sendStoryInProgressEmail(
        base44.asServiceRole, story.contact_email, story.child_name, effectiveLang, story.gender
      ).catch(() => {});
    }

    base44.asServiceRole.functions.invoke('notifyNewStory', {
      story_id,
      entity_name: 'KitaAlefStory',
      child_name: story.child_name,
    }).catch(() => {});

    return Response.json({
      success: true,
      credits_remaining: currentCredits - CREDITS_PER_BOOK,
      order_id: orderId,
      sheet_written,
      ...(sheet_error ? { sheet_error } : {}),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
