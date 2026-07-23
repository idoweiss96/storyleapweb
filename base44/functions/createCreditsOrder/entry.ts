import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getPaypalAccessToken } from '../../shared/paypal.ts';

const PAYPAL_BASE = 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');

// Creates a PayPal Order with the amount read in real time from the CreditPackage
// in the database (by package_id), NOT from a fixed payment link or client-supplied
// amount. The DB-sourced credits are persisted on the local Order record so that
// captureCreditsOrder and paypalWebhook grant exactly what was paid for.
//
// Backward compatibility: if package_id is omitted, falls back to the legacy
// client-supplied amount (used by the coupon custom-price flow).

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { package_id, currency = 'ILS', return_url, cancel_url } = body;

    let amount;
    let credits;
    let description;
    let packageId = package_id || null;

    if (package_id) {
      // Dynamic pricing: read price + credits from the CreditPackage in the DB
      const pkg = await base44.asServiceRole.entities.CreditPackage.get(package_id);
      if (!pkg) return Response.json({ error: 'Package not found' }, { status: 404 });
      amount = Number(pkg.price);
      credits = Number(pkg.credits);
      description = `StoryLeap - ${pkg.name || (credits + ' Credits')}`;
    } else {
      // Legacy fallback (coupon custom-price flow): client-supplied amount
      amount = Number(body.amount);
      credits = Number(body.credits) || 100;
      description = `StoryLeap - ${credits} Credits`;
    }

    if (!amount || amount <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const accessToken = await getPaypalAccessToken();
    const origin = req.headers.get('origin') || 'https://storyleapai.com';
    const ppRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `credits-${user.email}-${Date.now()}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          description,
          amount: { currency_code: currency, value: amount.toFixed(2) },
        }],
        application_context: {
          brand_name: 'StoryLeap AI',
          user_action: 'PAY_NOW',
          return_url: return_url || `${origin}/Pricing`,
          cancel_url: cancel_url || `${origin}/Pricing`,
        },
      }),
    });

    const ppData = await ppRes.json();
    if (!ppRes.ok || !ppData.id) {
      return Response.json({ error: ppData.message || 'PayPal error', details: ppData }, { status: 500 });
    }

    // Persist a local Order so capture/webhook can grant the exact DB-sourced credits
    const order = await base44.asServiceRole.entities.Order.create({
      user_email: user.email,
      paypal_order_id: ppData.id,
      status: 'pending_payment',
      amount,
      currency,
      credits,
      package_id: packageId,
    });

    const approveLink = (ppData.links || []).find((l) => l.rel === 'approve');

    return Response.json({
      order_id: order.id,
      paypal_order_id: ppData.id,
      approval_url: approveLink ? approveLink.href : null,
      client_id: PAYPAL_CLIENT_ID,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});