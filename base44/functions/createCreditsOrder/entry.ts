import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE = 'https://api-m.paypal.com';

const CREDITS_PRICE = 99; // ILS
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

    const accessToken = await getPaypalAccessToken();
    const ppRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `credits-${user.email}-${Date.now()}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          description: `StoryLeap - ${CREDITS_AMOUNT} Credits`,
          amount: {
            currency_code: 'ILS',
            value: CREDITS_PRICE.toFixed(2),
          },
        }],
        application_context: {
          brand_name: 'StoryLeap AI',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const ppData = await ppRes.json();
    if (!ppRes.ok || !ppData.id) {
      return Response.json({ error: ppData.message || 'PayPal error', details: ppData }, { status: 500 });
    }

    return Response.json({ paypal_order_id: ppData.id, client_id: PAYPAL_CLIENT_ID });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});