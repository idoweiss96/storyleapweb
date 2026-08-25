import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getPaypalAccessToken } from '../../shared/paypal.ts';

// Captures the PayPal payment for a guest single-story order (no account), marks the
// Story paid, and hands it off to the sheet + generation pipeline exactly like the
// logged-in credits flow. Deliberately public — a guest has no session to authenticate.

const PAYPAL_BASE = 'https://api-m.paypal.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { paypal_order_id } = await req.json();
    if (!paypal_order_id) return Response.json({ error: 'paypal_order_id required' }, { status: 400 });

    const orders = await base44.asServiceRole.entities.Order.filter({ paypal_order_id });
    const order = orders[0];
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    // Idempotency: already captured
    if (['paid', 'story_generating', 'story_ready'].includes(order.status)) {
      const existingStory = await base44.asServiceRole.entities.Story.get(order.story_id);
      return Response.json({ success: true, already_processed: true, story: existingStory ? { id: existingStory.id, child_name: existingStory.child_name } : null });
    }

    const accessToken = await getPaypalAccessToken();
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    await base44.asServiceRole.entities.Order.update(order.id, {
      status: 'story_generating',
      paypal_capture_id: captureId,
    });

    const story = await base44.asServiceRole.entities.Story.get(order.story_id);
    if (!story) return Response.json({ error: 'Story not found' }, { status: 404 });

    // This is the real, verified payment event — the only thing allowed to flip
    // payment_status to 'paid' and move the sheet row from "pending" to "in preparation".
    await base44.asServiceRole.entities.Story.update(order.story_id, { payment_status: 'paid' });
    const paidStory = await base44.asServiceRole.entities.Story.get(order.story_id);

    await base44.asServiceRole.functions.invoke('addStoryToSheet', paidStory).catch(() => {});
    base44.asServiceRole.functions.invoke('processStoryGeneration', { story_id: order.story_id }).catch(() => {});

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: story.contact_email,
        subject: story.lang === 'en' ? `We received ${story.child_name}'s details! ✨` : `קיבלנו את הפרטים של ${story.child_name}! ✨`,
        body: story.lang === 'en'
          ? `Hi there, we've received ${story.child_name}'s details and we're already creating a special story just for them. We'll let you know the moment it's ready!`
          : `היי, קיבלנו את הפרטים של ${story.child_name} ואנחנו כבר יוצרים סיפור קסום ומיוחד. נעדכן אתכם ברגע שהוא מוכן!`,
      });
    } catch (_) {}

    return Response.json({ success: true, story: { id: story.id, child_name: story.child_name } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});