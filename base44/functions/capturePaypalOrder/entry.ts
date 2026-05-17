import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE = 'https://api-m.paypal.com';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

async function getPaypalAccessToken() {
  const credentials = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

async function generateStoryWithAI(story) {
  const genderHe = { boy: 'ילד', girl: 'ילדה', other: 'ילד' };
  const settingMap = { space: 'חלל', forest: 'יער קסום', castle: 'ארמון', sports: 'אצטדיון הספורט', real_life: 'עולם אמיתי' };
  const challengeMap = { fears: 'פחדים', social_difficulty: 'קשיים חברתיים', changes: 'שינויים בחיים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' };

  const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');
  const lang = isHebrew ? 'Hebrew' : 'English';

  const prompt = `You are a professional child therapist and storyteller. Write a personalized therapeutic story in ${lang} for a child.

Child details:
- Name: ${story.child_name}
- Age: ${story.child_age}
- Gender: ${story.gender}
- Story setting/world: ${settingMap[story.setting] || story.setting}
- Emotional challenge: ${challengeMap[story.challenge_type] || story.challenge_type}
${story.trigger_desc ? `- What triggers the challenge: ${story.trigger_desc}` : ''}
${story.reaction_type ? `- How the child typically reacts: ${story.reaction_type}` : ''}
${story.hobbies ? `- Child's hobbies and interests: ${story.hobbies}` : ''}

Requirements:
- Write a complete, engaging therapeutic story (800-1200 words)
- The child (${story.child_name}) is the hero of the story
- The story should naturally address their emotional challenge
- Include age-appropriate language for a ${story.child_age}-year-old
- The story should have a positive, empowering resolution
- Incorporate their interests/hobbies naturally
- Use the ${settingMap[story.setting] || story.setting} as the backdrop
- End with a clear moral/lesson about overcoming the challenge
- Write entirely in ${lang}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function sendStoryInProgressEmail(email, childName, isHebrew) {
  if (!email || !RESEND_API_KEY) return;
  const subject = isHebrew
    ? 'הקסם מתחיל! אנחנו כבר עובדים על הסיפור שלך 📝✨'
    : "The magic begins! We're working on your story 📝✨";
  const html = isHebrew
    ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <h2>היי,</h2>
        <p style="font-size:16px;line-height:1.7;">איזה כיף! קיבלנו את הפרטים בהצלחה.</p>
        <p style="font-size:16px;line-height:1.7;">אנחנו כבר עובדים על יצירת הסיפור המיוחד שלכם.</p>
        <p style="font-size:16px;line-height:1.7;">ברגע שהסיפור יהיה מוכן, נשלח לך מייל עדכון נוסף עם קישור ישיר לקריאה.</p>
        <p style="margin-top:24px;font-size:15px;">תודה,<br/>צוות StoryLeap</p>
      </div>`
    : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <h2>Hi there,</h2>
        <p style="font-size:16px;line-height:1.7;">Exciting news! We have successfully received your details.</p>
        <p style="font-size:16px;line-height:1.7;">We are already working on creating your special story.</p>
        <p style="font-size:16px;line-height:1.7;">As soon as the story is ready, we will send you another email with a direct link to read it.</p>
        <p style="margin-top:24px;font-size:15px;">Best regards,<br/>StoryLeap</p>
      </div>`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'StoryLeap AI <stories@storyleapai.com>', to: email, subject, html }),
  });
}

async function sendStoryReadyEmail(email, childName, storyContent) {
  if (!email || !RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'StoryLeap AI <stories@storyleapai.com>',
      to: email,
      subject: `✨ ${childName}'s Personalized Story is Ready!`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1e293b;">הסיפור של ${childName} מוכן! ✨</h1>
          <p style="color: #475569; font-size: 16px;">שלום! הסיפור המותאם אישית של ${childName} נוצר בהצלחה.</p>
          <p style="color: #475569; font-size: 16px;">תוכלו לצפות בסיפור המלא באזור הסיפורים שלכם באתר.</p>
          <a href="https://storyleapai.com/MyStories" style="display: inline-block; background: #1e293b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
            לצפייה בסיפור →
          </a>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">תודה שבחרתם StoryLeap 💛</p>
        </div>
      `,
    }),
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { paypal_order_id, order_id } = await req.json();
    if (!paypal_order_id || !order_id) return Response.json({ error: 'paypal_order_id and order_id required' }, { status: 400 });

    // Get our order record
    const orders = await base44.asServiceRole.entities.Order.filter({ id: order_id });
    const order = orders[0];
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    // Idempotency: already paid
    if (order.status === 'paid' || order.status === 'story_generating' || order.status === 'story_ready') {
      return Response.json({ success: true, status: order.status, already_processed: true });
    }

    // Capture payment with PayPal
    const accessToken = await getPaypalAccessToken();
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `capture-${order_id}`,
      },
    });

    const captureData = await captureRes.json();

    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      await base44.asServiceRole.entities.Order.update(order_id, {
        status: 'failed',
        error_message: captureData.message || 'Capture failed',
      });
      return Response.json({ error: 'Payment capture failed', details: captureData }, { status: 400 });
    }

    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    // Mark order as paid
    await base44.asServiceRole.entities.Order.update(order_id, {
      status: 'story_generating',
      paypal_capture_id: captureId,
    });

    // Fetch the story
    const story = await base44.asServiceRole.entities.Story.get(order.story_id);
    if (!story) return Response.json({ error: 'Story not found' }, { status: 404 });

    // Update story status to indicate payment done
    await base44.asServiceRole.entities.Story.update(order.story_id, { payment_status: 'paid' });

    // Add 20 credits to user after successful payment
    try {
      const users = await base44.asServiceRole.entities.User.filter({ email: order.user_email });
      if (users[0]) {
        const newCredits = (users[0].credits || 0) + 20;
        await base44.asServiceRole.entities.User.update(users[0].id, { credits: newCredits });
      }
    } catch (_) {}

    // Send "story in progress" email immediately after payment confirmed
    const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');
    if (story.contact_email) {
      await sendStoryInProgressEmail(story.contact_email, story.child_name, isHebrew).catch(() => {});
    }

    // Generate story with AI (async - don't block)
    (async () => {
      try {
        const storyContent = await generateStoryWithAI(story);
        await base44.asServiceRole.entities.Story.update(order.story_id, {
          content: storyContent,
        });
        await base44.asServiceRole.entities.Order.update(order_id, { status: 'story_ready' });

        // Send email notification
        if (story.contact_email) {
          await sendStoryReadyEmail(story.contact_email, story.child_name, storyContent);
        }

        // Also notify admin
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'storyleapai@gmail.com',
            subject: `✅ סיפור נוצר אוטומטית: ${story.child_name}`,
            body: `סיפור חדש נוצר בהצלחה ל-${story.child_name}!\n\nOrder ID: ${order_id}\nPayPal Capture: ${captureId}`,
          });
        } catch (_) {}
      } catch (genErr) {
        console.error('Story generation failed:', genErr.message);
        await base44.asServiceRole.entities.Order.update(order_id, {
          status: 'paid',
          error_message: `Story generation failed: ${genErr.message}`,
        });
      }
    })();

    return Response.json({ success: true, status: 'story_generating', capture_id: captureId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});