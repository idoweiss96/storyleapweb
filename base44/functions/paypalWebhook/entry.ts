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

    // Send "story in progress" email + trigger generation (same as capturePaypalOrder)
    const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');
    if (story.contact_email) {
      await sendStoryInProgressEmail(story.contact_email, story.child_name, isHebrew).catch(() => {});
    }
    base44.asServiceRole.functions.invoke('processStoryGeneration', { story_id: order.story_id, order_id: order.id }).catch(() => {});

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});