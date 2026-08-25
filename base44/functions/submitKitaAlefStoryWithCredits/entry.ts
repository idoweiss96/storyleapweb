import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { sendGmailRawEmail } from '../../shared/gmailRawEmail.ts';

async function sendStoryInProgressEmail(base44ServiceRole, email, childName, lang, gender) {
  if (!email) return;
  const isEn = lang === 'en';
  const pronoun = /בת/.test(gender || '') ? 'עבורה' : 'עבורו';

  const subject = isEn
    ? `We received ${childName}'s details! 🎒`
    : `קיבלנו את הפרטים של ${childName}! 🎒`;

  const body = isEn
    ? `<div dir="ltr" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
    <p style="font-size:16px;line-height:1.7;">Hi there, we've received ${childName}'s details and we're creating a special story to help them get ready for kindergarten. We'll let you know the moment it's ready!</p>
    <p style="margin-top:24px;font-size:15px;">Thank you,<br/>The StoryLeap Team</p>
  </div>`
    : `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
    <p style="font-size:16px;line-height:1.7;">היי, קיבלנו את הפרטים של ${childName} ואנחנו יוצרים ${pronoun} סיפור מיוחד שילווה ${pronoun === 'עבורה' ? 'אותה' : 'אותו'} לקראת העלייה לכיתה א׳. נעדכן אתכם ברגע שהוא מוכן!</p>
    <p style="margin-top:24px;font-size:15px;">תודה,<br/>צוות StoryLeap</p>
  </div>`;

  await sendGmailRawEmail(base44ServiceRole, email, subject, body);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { story_id, lang } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    // Server-side: get fresh user data for authoritative credit check
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const dbUser = users[0];
    if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const currentCredits = dbUser.credits || 0;

    // Not enough credits
    if (currentCredits < 60) {
      return Response.json({ success: false, reason: 'insufficient_credits', credits: currentCredits });
    }

    // Deduct credits atomically
    await base44.asServiceRole.entities.User.update(dbUser.id, { credits: currentCredits - 60 });

    // Fetch story, persist lang durably on the record, then mark as paid
    const story = await base44.asServiceRole.entities.KitaAlefStory.get(story_id);
    const effectiveLang = lang || story.lang;
    await base44.asServiceRole.entities.KitaAlefStory.update(story_id, {
      payment_status: 'paid',
      ...(effectiveLang ? { lang: effectiveLang } : {}),
    });

    // Send "story in progress" email using the authoritative record lang
    if (story.contact_email) {
      await sendStoryInProgressEmail(base44.asServiceRole, story.contact_email, story.child_name, effectiveLang, story.gender).catch(() => {});
    }

    // Notify admin about new KitaAlef story
    base44.asServiceRole.functions.invoke('notifyNewStory', {
      story_id,
      entity_name: 'KitaAlefStory',
      child_name: story.child_name,
    }).catch(() => {});

    // Update the Kita Alef sheet's Payment Status column, now that payment is confirmed
    base44.asServiceRole.functions.invoke('updateKitaAlefSheetPaymentStatus', {
      story_id,
      lang: effectiveLang,
    }).catch(() => {});

    return Response.json({ success: true, credits_remaining: currentCredits - 60 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});