import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE = 'https://api-m.paypal.com';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

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





Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { paypal_order_id, order_id, story_id } = await req.json();
    if (!paypal_order_id) return Response.json({ error: 'paypal_order_id required' }, { status: 400 });

    // Get our order record — either by order_id or by story_id (for Hosted Buttons flow)
    let order;
    if (order_id) {
      const orders = await base44.asServiceRole.entities.Order.filter({ id: order_id });
      order = orders[0];
    } else if (story_id) {
      // Hosted Button flow: create or find order for this story
      const existingOrders = await base44.asServiceRole.entities.Order.filter({ story_id, status: 'pending_payment' });
      if (existingOrders.length > 0) {
        order = existingOrders[0];
      } else {
        // Create a new order record
        const story = await base44.asServiceRole.entities.Story.get(story_id);
        if (!story) return Response.json({ error: 'Story not found' }, { status: 404 });
        order = await base44.asServiceRole.entities.Order.create({
          story_id,
          user_email: user.email,
          paypal_order_id,
          status: 'pending_payment',
          amount: 45,
          currency: 'ILS',
        });
      }
    }
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
        'PayPal-Request-Id': `capture-${order.id}`,
      },
    });

    const captureData = await captureRes.json();

    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      await base44.asServiceRole.entities.Order.update(order.id, {
        status: 'failed',
        error_message: captureData.message || 'Capture failed',
      });
      return Response.json({ error: 'Payment capture failed', details: captureData }, { status: 400 });
    }

    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    // Mark order as paid
    await base44.asServiceRole.entities.Order.update(order.id, {
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

    return Response.json({ success: true, status: 'story_generating', capture_id: captureId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});