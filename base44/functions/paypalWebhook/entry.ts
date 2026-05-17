import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE = 'https://api-m.paypal.com';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

async function getPaypalAccessToken() {
  const credentials = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

async function verifyWebhookSignature(headers, body, webhookId, accessToken) {
  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: headers.get('paypal-auth-algo'),
      cert_url: headers.get('paypal-cert-url'),
      transmission_id: headers.get('paypal-transmission-id'),
      transmission_sig: headers.get('paypal-transmission-sig'),
      transmission_time: headers.get('paypal-transmission-time'),
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });
  const data = await res.json();
  return data.verification_status === 'SUCCESS';
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

async function generateStoryWithAI(story, base44ServiceRole) {
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
- End with a clear moral/lesson about overcoming the challenge
- Write entirely in ${lang}`;

  return await base44ServiceRole.integrations.Core.InvokeLLM({ prompt, model: 'gpt_5_4' });
}

async function sendStoryReadyEmail(email, childName, isHebrew) {
  if (!email || !RESEND_API_KEY) return;
  const subject = isHebrew ? `✨ הסיפור של ${childName} מוכן!` : `✨ ${childName}'s story is ready!`;
  const html = isHebrew
    ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <h1>הסיפור של ${childName} מוכן! ✨</h1>
        <p style="font-size:16px;">הסיפור המותאם אישית נוצר בהצלחה.</p>
        <a href="https://storyleapai.com/MyStories" style="display:inline-block;background:#1e293b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">לצפייה בסיפור →</a>
      </div>`
    : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <h1>${childName}'s story is ready! ✨</h1>
        <p style="font-size:16px;">Your personalized story has been created successfully.</p>
        <a href="https://storyleapai.com/MyStories" style="display:inline-block;background:#1e293b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">View Story →</a>
      </div>`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'StoryLeap AI <stories@storyleapai.com>', to: email, subject, html }),
  });
}

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    // Only handle completed payment captures
    if (event.event_type !== 'PAYMENT.CAPTURE.COMPLETED') {
      return Response.json({ received: true });
    }

    const base44 = createClientFromRequest(req);
    const capture = event.resource;
    const paypalOrderId = capture.supplementary_data?.related_ids?.order_id || capture.id;

    // Look up our Order by paypal_order_id
    const orders = await base44.asServiceRole.entities.Order.filter({ paypal_order_id: paypalOrderId });
    let order = orders[0];

    // If not found by order ID, try by capture ID (fallback)
    if (!order) {
      console.log('Order not found for paypal_order_id:', paypalOrderId);
      return Response.json({ received: true });
    }

    // Idempotency check
    if (order.status === 'paid' || order.status === 'story_generating' || order.status === 'story_ready') {
      return Response.json({ received: true, already_processed: true });
    }

    // Mark order as paid
    await base44.asServiceRole.entities.Order.update(order.id, {
      status: 'story_generating',
      paypal_capture_id: capture.id,
    });

    // Add 20 credits to user
    const users = await base44.asServiceRole.entities.User.filter({ email: order.user_email });
    const dbUser = users[0];
    if (dbUser) {
      await base44.asServiceRole.entities.User.update(dbUser.id, { credits: (dbUser.credits || 0) + 20 });
    }

    // Get the story
    const story = await base44.asServiceRole.entities.Story.get(order.story_id);
    if (!story) {
      console.error('Story not found:', order.story_id);
      return Response.json({ received: true });
    }

    // Mark story as paid
    await base44.asServiceRole.entities.Story.update(order.story_id, { payment_status: 'paid' });

    // Send "story in progress" email immediately
    const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');
    if (story.contact_email) {
      await sendStoryInProgressEmail(story.contact_email, story.child_name, isHebrew).catch(() => {});
    }

    // Generate story async
    (async () => {
      try {
        const storyContent = await generateStoryWithAI(story, base44.asServiceRole);
        await base44.asServiceRole.entities.Story.update(order.story_id, { content: storyContent });
        await base44.asServiceRole.entities.Order.update(order.id, { status: 'story_ready' });

        if (story.contact_email) {
          await sendStoryReadyEmail(story.contact_email, story.child_name, isHebrew);
        }

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'storyleapai@gmail.com',
          subject: `✅ סיפור נוצר: ${story.child_name}`,
          body: `סיפור חדש נוצר ל-${story.child_name}! Order ID: ${order.id}`,
        }).catch(() => {});
      } catch (err) {
        console.error('Story generation error:', err.message);
      }
    })();

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});