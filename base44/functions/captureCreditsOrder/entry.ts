import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getPaypalAccessToken } from '../../shared/paypal.ts';

const PAYPAL_BASE = 'https://api-m.paypal.com';

// Captures a PayPal order created by createCreditsOrder and grants the credits
// that were persisted on the Order record (DB-sourced via CreditPackage).
// Falls back to the client-supplied credits param for legacy/hosted-button orders
// that have no local Order record.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { paypal_order_id, credits: creditsParam, coupon } = await req.json();
    if (!paypal_order_id) return Response.json({ error: 'paypal_order_id required' }, { status: 400 });

    // Look up our Order record (created by createCreditsOrder) to read DB-sourced credits
    const orders = await base44.asServiceRole.entities.Order.filter({ paypal_order_id });
    const order = orders[0];

    // Credits to grant: prefer the stored DB value, fall back to client param (legacy/hosted-button)
    const creditsToAdd = (order && order.credits) ? Number(order.credits) : (Number(creditsParam) || 100);

    if (!coupon) {
      const accessToken = await getPaypalAccessToken();

      // Idempotency: check PayPal order status first to prevent double-capture
      const orderCheckRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const orderData = await orderCheckRes.json();
      console.log('[captureCreditsOrder] PayPal order status:', orderData.status);

      if (orderData.status === 'COMPLETED') {
        console.log('[captureCreditsOrder] Order already completed, skipping capture');
      } else if (orderData.status === 'APPROVED' || orderData.status === 'CREATED') {
        const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `capture-credits-${paypal_order_id}`,
          },
        });
        const captureData = await captureRes.json();
        console.log('[captureCreditsOrder] Capture result:', JSON.stringify(captureData));
        if (!captureRes.ok || captureData.status !== 'COMPLETED') {
          if (order) {
            await base44.asServiceRole.entities.Order.update(order.id, {
              status: 'failed',
              error_message: captureData.message || 'Capture failed',
            });
          }
          return Response.json({ error: 'Payment capture failed', details: captureData }, { status: 400 });
        }
      } else {
        return Response.json({ error: `Invalid order status: ${orderData.status}`, details: orderData }, { status: 400 });
      }
    }

    // Idempotency: don't grant credits twice for an already-paid Order
    if (order && order.status === 'paid') {
      const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
      return Response.json({
        success: true,
        credits_added: 0,
        new_total: (users[0] && users[0].credits) || 0,
        already_processed: true,
      });
    }

    // Grant credits to the user
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const currentUser = users[0];
    if (!currentUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const newCredits = (currentUser.credits || 0) + creditsToAdd;
    await base44.asServiceRole.entities.User.update(currentUser.id, { credits: newCredits });
    console.log(`[captureCreditsOrder] Credits updated for ${user.email}: ${currentUser.credits || 0} -> ${newCredits}`);

    // Mark our Order as paid
    if (order) {
      await base44.asServiceRole.entities.Order.update(order.id, { status: 'paid' });
    }

    return Response.json({ success: true, credits_added: creditsToAdd, new_total: newCredits });
  } catch (error) {
    console.error('[captureCreditsOrder] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});