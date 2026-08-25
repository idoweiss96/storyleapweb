import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getPaypalAccessToken } from '../../shared/paypal.ts';

// Lets a parent buy exactly ONE story with just an email, no account required.
// Deliberately public (no base44.auth.me() check) — that's the whole point of this
// function. The Story is created with the service role since the Story entity's RLS
// requires created_by_id, which a guest doesn't have.

const PAYPAL_BASE = 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const GUEST_STORY_PRICE_USD = 29;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { storyData, lang } = body;

    if (!storyData || !storyData.child_name || !storyData.contact_email) {
      return Response.json({ error: 'storyData with child_name and contact_email is required' }, { status: 400 });
    }

    // Create the draft Story record for this guest order.
    const story = await base44.asServiceRole.entities.Story.create({
      ...storyData,
      payment_status: 'draft',
    });

    const accessToken = await getPaypalAccessToken();
    const origin = req.headers.get('origin') || 'https://storyleapai.com';
    const ppRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `guest-story-${story.id}-${Date.now()}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: story.id,
          description: `StoryLeap - Personalized story for ${storyData.child_name}`,
          amount: { currency_code: 'USD', value: GUEST_STORY_PRICE_USD.toFixed(2) },
        }],
        application_context: {
          brand_name: 'StoryLeap AI',
          user_action: 'PAY_NOW',
          return_url: `${origin}/CreateStory`,
          cancel_url: `${origin}/CreateStory`,
        },
      }),
    });

    const ppData = await ppRes.json();
    if (!ppRes.ok || !ppData.id) {
      return Response.json({ error: ppData.message || 'PayPal error', details: ppData }, { status: 500 });
    }

    await base44.asServiceRole.entities.Order.create({
      story_id: story.id,
      user_email: storyData.contact_email,
      paypal_order_id: ppData.id,
      status: 'pending_payment',
      amount: GUEST_STORY_PRICE_USD,
      currency: 'USD',
    });

    return Response.json({ story_id: story.id, paypal_order_id: ppData.id, client_id: PAYPAL_CLIENT_ID });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});