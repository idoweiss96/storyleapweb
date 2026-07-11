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

async function sendStoryInProgressEmail(base44ServiceRole, email, childName) {
  if (!email) return;
  const subject = 'הקסם מתחיל! אנחנו כבר עובדים על הסיפור שלך 📝✨';
  const body = `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
    <h2>היי,</h2>
    <p style="font-size:16px;line-height:1.7;">איזה כיף! קיבלנו את התשובות שלכם משאלון ההכנה לכיתה א׳.</p>
    <p style="font-size:16px;line-height:1.7;">אנחנו כבר עובדים על יצירת הסיפור המיוחד של ${childName}.</p>
    <p style="font-size:16px;line-height:1.7;">ברגע שהסיפור יהיה מוכן, נשלח לך מייל עדכון נוסף עם קישור ישיר לקריאה.</p>
    <p style="margin-top:24px;font-size:15px;">תודה,<br/>צוות StoryLeap</p>
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

    // Not enough credits
    if (currentCredits < 20) {
      return Response.json({ success: false, reason: 'insufficient_credits', credits: currentCredits });
    }

    // Deduct credits atomically
    await base44.asServiceRole.entities.User.update(dbUser.id, { credits: currentCredits - 20 });

    // Mark story as paid
    await base44.asServiceRole.entities.KitaAlefStory.update(story_id, { payment_status: 'paid' });

    // Send "story in progress" email
    const story = await base44.asServiceRole.entities.KitaAlefStory.get(story_id);
    if (story.contact_email) {
      await sendStoryInProgressEmail(base44.asServiceRole, story.contact_email, story.child_name).catch(() => {});
    }

    // Notify admin about new KitaAlef story
    base44.asServiceRole.functions.invoke('notifyNewStory', {
      story_id,
      entity_name: 'KitaAlefStory',
      child_name: story.child_name,
    }).catch(() => {});

    return Response.json({ success: true, credits_remaining: currentCredits - 20 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});