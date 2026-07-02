import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE = 'https://api-m.paypal.com';
const CREDITS_AMOUNT = 20;

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

async function sendStoryInProgressEmail(base44, email, childName, isHebrew) {
  if (!email) return;
  const _ = childName;
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
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const raw = buildRawMessage(email, subject, html);
  await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
}


async function processPendingStories(base44, userEmail, userCredits) {
  const pendingStories = await base44.asServiceRole.entities.Story.filter({
    created_by: userEmail,
    payment_status: 'pending_payment',
  });

  let remainingCredits = userCredits;
  let processed = 0;

  for (const story of pendingStories) {
    if (remainingCredits < 20) break;
    remainingCredits -= 20;
    await base44.asServiceRole.entities.Story.update(story.id, { payment_status: 'paid' });

    const isHebrewName = /[\u0590-\u05FF]/.test(story.child_name || '');
    if (story.contact_email) {
      try { await sendStoryInProgressEmail(base44, story.contact_email, story.child_name, isHebrewName); } catch (_) {}
    }

    base44.asServiceRole.functions.invoke('processStoryGeneration', { story_id: story.id }).catch(() => {});
    processed++;
  }

  return { processed, remainingCredits };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { paypal_order_id, credits, coupon } = await req.json();
    if (!paypal_order_id) return Response.json({ error: 'paypal_order_id required' }, { status: 400 });

    const creditsToAdd = credits || CREDITS_AMOUNT;

    if (!coupon) {
      // Capture payment with PayPal
      const accessToken = await getPaypalAccessToken();

      // First check order status to prevent double-capture
      const orderCheckRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const orderData = await orderCheckRes.json();
      console.log('[captureCreditsOrder] Order status:', orderData.status);

      if (orderData.status === 'COMPLETED') {
        // Already captured — idempotent: just ensure credits are added
        console.log('[captureCreditsOrder] Order already completed, skipping capture');
      } else if (orderData.status === 'APPROVED' || orderData.status === 'CREATED') {
        // Proceed with capture
        const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `capture-credits-${paypal_order_id}`,
          },
        });
        const captureData = await captureRes.json();
        console.log('[captureCreditsOrder] Capture result:', JSON.stringify(captureData));
        if (!captureRes.ok || captureData.status !== 'COMPLETED') {
          return Response.json({ error: 'Payment capture failed', details: captureData }, { status: 400 });
        }
      } else {
        return Response.json({ error: `Invalid order status: ${orderData.status}`, details: orderData }, { status: 400 });
      }
    }

    // Add credits to user (using service role for reliability)
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const currentUser = users[0];
    if (!currentUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const newCredits = (currentUser.credits || 0) + creditsToAdd;
    await base44.asServiceRole.entities.User.update(currentUser.id, { credits: newCredits });
    console.log(`[captureCreditsOrder] Credits updated for ${user.email}: ${currentUser.credits || 0} -> ${newCredits}`);

    return Response.json({
      success: true,
      credits_added: creditsToAdd,
      new_total: newCredits,
      stories_activated: 0,
    });
  } catch (error) {
    console.error('[captureCreditsOrder] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});