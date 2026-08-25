import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) { binary += String.fromCharCode(byte); }
  return btoa(binary);
}

function buildRawMessage(to, subject, html) {
  const encodedSubject = `=?UTF-8?B?${utf8ToBase64(subject)}?=`;
  const message = [`To: ${to}`, `Subject: ${encodedSubject}`, 'Content-Type: text/html; charset=utf-8', 'MIME-Version: 1.0', '', html].join('\r\n');
  return utf8ToBase64(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sendStoryInProgressEmail(base44ServiceRole, email, childName, isHebrew, gender) {
  if (!email) return;
  const subject = isHebrew
    ? `קיבלנו את הפרטים של ${childName}! ✨`
    : `We received ${childName}'s details! ✨`;
  const pronoun = gender === 'girl' ? 'עבורה' : 'עבורו';
  const body = isHebrew
    ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <p style="font-size:16px;line-height:1.7;">היי, קיבלנו את הפרטים של ${childName} ואנחנו כבר יוצרים ${pronoun} סיפור קסום ומיוחד. נעדכן אתכם ברגע שהוא מוכן!</p>
        <p style="margin-top:24px;font-size:15px;">תודה,<br/>צוות StoryLeap</p>
      </div>`
    : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <p style="font-size:16px;line-height:1.7;">Hi there, we've received ${childName}'s details and we're already creating a special, magical story just for them. We'll let you know the moment it's ready!</p>
        <p style="margin-top:24px;font-size:15px;">Best regards,<br/>StoryLeap</p>
      </div>`;
  const { accessToken } = await base44ServiceRole.connectors.getConnection('gmail');
  const raw = buildRawMessage(email, subject, body);
  await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { story_id } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    // Server-side: get fresh user data for authoritative credit check
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const dbUser = users[0];
    if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const currentCredits = dbUser.credits || 0;

    // Not enough credits — stop here, frontend should redirect to Pricing
    if (currentCredits < 60) {
      return Response.json({ success: false, reason: 'insufficient_credits', credits: currentCredits });
    }

    // Deduct credits atomically
    await base44.asServiceRole.entities.User.update(dbUser.id, { credits: currentCredits - 60 });

    // Mark story as paid
    await base44.asServiceRole.entities.Story.update(story_id, { payment_status: 'paid' });

    // Send "story in progress" email immediately after credit deduction
    const storyForEmail = await base44.asServiceRole.entities.Story.get(story_id);
    const isHebrew = /[\u0590-\u05FF]/.test(storyForEmail.child_name || '');
    if (storyForEmail.contact_email) {
      await sendStoryInProgressEmail(base44.asServiceRole, storyForEmail.contact_email, storyForEmail.child_name, isHebrew, storyForEmail.gender).catch(() => {});
    }

    // Add story to Google Sheet (shared function — keeps row format consistent with the PayPal capture path)
    await base44.asServiceRole.functions.invoke('addStoryToSheet', storyForEmail).catch(() => {});

    // Trigger story generation asynchronously
    base44.asServiceRole.functions.invoke('processStoryGeneration', { story_id }).catch(() => {});

    return Response.json({ success: true, credits_remaining: currentCredits - 60 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});