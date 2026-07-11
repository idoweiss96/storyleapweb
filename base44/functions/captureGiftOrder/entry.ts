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

function generateGiftCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GIFT-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function sendGiftEmail(base44, recipientEmail, giftCode, senderEmail) {
  const subject = '🎁 קיבלת מתנה! קרדיטים לסיפור מותאם אישית ב-StoryLeap';
  const senderLine = senderEmail ? `<p style="font-size:16px;line-height:1.7;">מתנה זו נשלחה אליך על ידי <strong>${senderEmail}</strong></p>` : '';
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
    <h2 style="color:#c07028;">🎁 יש לך מתנה!</h2>
    ${senderLine}
    <p style="font-size:16px;line-height:1.7;">קיבלת <strong>${CREDITS_AMOUNT} קרדיטים</strong> ליצירת סיפור מותאם אישית לילד/ה שלך ב-StoryLeap.</p>
    <div style="background:#fff8ed;border:2px dashed #c07028;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
      <p style="font-size:14px;color:#c07028;margin-bottom:8px;">קוד המתנה שלך:</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:2px;color:#1e293b;margin:0;">${giftCode}</p>
    </div>
    <p style="font-size:16px;line-height:1.7;">למימוש המתנה:</p>
    <ol style="font-size:16px;line-height:1.7;padding-right:20px;">
      <li>הירשמו / התחברו לאתר StoryLeap</li>
      <li>עברו לעמוד הרכישה</li>
      <li>הזינו את הקוד בשדה "קוד פרומו"</li>
    </ol>
    <p style="font-size:16px;line-height:1.7;margin-top:24px;">בהנאה! ✨</p>
    <p style="margin-top:24px;font-size:15px;">צוות StoryLeap</p>
  </div>`;
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const raw = buildRawMessage(recipientEmail, subject, html);
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

    const { paypal_order_id, recipient_email, credits } = await req.json();
    if (!paypal_order_id) return Response.json({ error: 'paypal_order_id required' }, { status: 400 });
    if (!recipient_email) return Response.json({ error: 'recipient_email required' }, { status: 400 });

    const creditsToAdd = credits || CREDITS_AMOUNT;

    // Capture payment with PayPal
    const accessToken = await getPaypalAccessToken();
    const orderCheckRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const orderData = await orderCheckRes.json();
    console.log('[captureGiftOrder] Order status:', orderData.status);

    if (orderData.status === 'COMPLETED') {
      console.log('[captureGiftOrder] Order already completed, skipping capture');
    } else if (orderData.status === 'APPROVED' || orderData.status === 'CREATED') {
      const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `capture-gift-${paypal_order_id}`,
        },
      });
      const captureData = await captureRes.json();
      if (!captureRes.ok || captureData.status !== 'COMPLETED') {
        return Response.json({ error: 'Payment capture failed', details: captureData }, { status: 400 });
      }
    } else {
      return Response.json({ error: `Invalid order status: ${orderData.status}` }, { status: 400 });
    }

    // Create a unique gift coupon
    const giftCode = generateGiftCode();
    await base44.asServiceRole.entities.Coupon.create({
      code: giftCode,
      credits: creditsToAdd,
      price_ils: 0,
      price_usd: 0,
      is_gift: true,
      gift_sender_email: user.email,
      max_uses: 1,
      max_per_user: 1,
      is_active: true,
    });

    // Send gift email to recipient
    try {
      await sendGiftEmail(base44, recipient_email, giftCode, user.email);
    } catch (emailErr) {
      console.error('[captureGiftOrder] Email send failed:', emailErr.message);
    }

    return Response.json({
      success: true,
      code: giftCode,
      recipient_email,
      credits: creditsToAdd,
    });
  } catch (error) {
    console.error('[captureGiftOrder] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});