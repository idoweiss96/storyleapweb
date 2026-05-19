import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE = 'https://api-m.paypal.com';

const STORY_PRICE = 99; // ILS

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

    const { story_id } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    // Verify the story belongs to this user
    const story = await base44.entities.Story.get(story_id);
    if (!story) return Response.json({ error: 'Story not found' }, { status: 404 });

    // Check for existing unpaid order for this story (idempotency)
    const existingOrders = await base44.asServiceRole.entities.Order.filter({
      story_id,
      user_email: user.email,
    });
    const existingPending = existingOrders.find(o => o.status === 'pending_payment' && o.paypal_order_id);
    if (existingPending) {
      return Response.json({ order_id: existingPending.id, paypal_order_id: existingPending.paypal_order_id });
    }

    // Create PayPal order
    const accessToken = await getPaypalAccessToken();
    const ppRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `storyleap-${story_id}-${Date.now()}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: story_id,
          description: `Personalized Therapeutic Story by StoryLeap for ${story.child_name}`,
          amount: {
            currency_code: 'ILS',
            value: STORY_PRICE.toFixed(2),
          },
        }],
        application_context: {
          brand_name: 'StoryLeap AI',
          user_action: 'PAY_NOW',
          return_url: `${req.headers.get('origin')}/PaymentSuccess?story_id=${story_id}`,
          cancel_url: `${req.headers.get('origin')}/PaymentCancel`,
        },
      }),
    });

    const ppData = await ppRes.json();
    if (!ppRes.ok || !ppData.id) {
      return Response.json({ error: ppData.message || 'PayPal error' }, { status: 500 });
    }

    // Create local Order record
    const order = await base44.asServiceRole.entities.Order.create({
      story_id,
      user_email: user.email,
      paypal_order_id: ppData.id,
      status: 'pending_payment',
      amount: STORY_PRICE,
      currency: 'ILS',
    });

    return Response.json({ order_id: order.id, paypal_order_id: ppData.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});