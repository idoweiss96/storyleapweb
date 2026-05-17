import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE = 'https://api-m.paypal.com';
const CREDITS_AMOUNT = 20;

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

    const { paypal_order_id, credits, coupon } = await req.json();
    if (!paypal_order_id) return Response.json({ error: 'paypal_order_id required' }, { status: 400 });

    const creditsToAdd = credits || CREDITS_AMOUNT;

    if (!coupon) {
      // Capture payment with PayPal
      const accessToken = await getPaypalAccessToken();
      const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `capture-credits-${paypal_order_id}`,
        },
      });

      const captureData = await captureRes.json();

      if (!captureRes.ok || captureData.status !== 'COMPLETED') {
        return Response.json({ error: 'Payment capture failed', details: captureData }, { status: 400 });
      }
    }

    // Add credits to user
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const currentUser = users[0];
    if (!currentUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const newCredits = (currentUser.credits || 0) + creditsToAdd;
    await base44.asServiceRole.entities.User.update(currentUser.id, { credits: newCredits });

    return Response.json({ success: true, credits_added: creditsToAdd, new_total: newCredits });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});