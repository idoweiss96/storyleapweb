import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { verifyPaypalWebhook } from '../../shared/paypal.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

// PayPal webhook endpoint. Verifies the payment succeeded (optionally via
// signature verification when PAYPAL_WEBHOOK_ID is configured) and updates the
// database:
//  - Credits-purchase orders (have `credits`, no `story_id`): grant the DB-sourced
//    credits and mark the Order paid.
//  - Story-purchase orders (have `story_id`): existing flow — mark story paid,
//    grant credits, email the user, add to sheet, trigger generation.

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
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'StoryLeap AI <stories@storyleapai.com>', to: email, subject, html }),
  });
}

Deno.serve(async (req) => {
  try {
    const body = await req.text();

    // Verify webhook signature (when PAYPAL_WEBHOOK_ID is configured)
    const verified = await verifyPaypalWebhook(req.headers, body);
    if (verified === false) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }
    if (verified === null) {
      console.warn('[paypalWebhook] PAYPAL_WEBHOOK_ID not set — signature verification skipped');
    }

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
    const order = orders[0];

    if (!order) {
      console.log('[paypalWebhook] Order not found for paypal_order_id:', paypalOrderId);
      return Response.json({ received: true });
    }

    // Idempotency check
    if (order.status === 'paid' || order.status === 'story_generating' || order.status === 'story_ready') {
      return Response.json({ received: true, already_processed: true });
    }

    // Credits-only order (no story_id, has credits): grant DB-sourced credits
    if (!order.story_id && order.credits) {
      const users = await base44.asServiceRole.entities.User.filter({ email: order.user_email });
      const dbUser = users[0];
      if (dbUser) {
        await base44.asServiceRole.entities.User.update(dbUser.id, {
          credits: (dbUser.credits || 0) + Number(order.credits),
        });
      }
      await base44.asServiceRole.entities.Order.update(order.id, {
        status: 'paid',
        paypal_capture_id: capture.id,
      });
      return Response.json({ received: true });
    }

    // Story-purchase order: existing flow
    await base44.asServiceRole.entities.Order.update(order.id, {
      status: 'story_generating',
      paypal_capture_id: capture.id,
    });

    const users = await base44.asServiceRole.entities.User.filter({ email: order.user_email });
    if (users[0]) {
      await base44.asServiceRole.entities.User.update(users[0].id, { credits: (users[0].credits || 0) + 20 });
    }

    const story = await base44.asServiceRole.entities.Story.get(order.story_id);
    if (!story) {
      console.error('[paypalWebhook] Story not found:', order.story_id);
      return Response.json({ received: true });
    }

    await base44.asServiceRole.entities.Story.update(order.story_id, { payment_status: 'paid' });

    const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');
    if (story.contact_email) {
      await sendStoryInProgressEmail(story.contact_email, story.child_name, isHebrew).catch(() => {});
    }

    try {
      await base44.asServiceRole.functions.invoke('addStoryToSheet', story);
    } catch (_) {}

    base44.asServiceRole.functions.invoke('processStoryGeneration', { story_id: order.story_id, order_id: order.id }).catch(() => {});

    return Response.json({ received: true });
  } catch (error) {
    console.error('[paypalWebhook] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});