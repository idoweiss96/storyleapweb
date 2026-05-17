import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { paypal_order_id } = await req.json();
    if (!paypal_order_id) return Response.json({ error: 'paypal_order_id required' }, { status: 400 });

    const orders = await base44.asServiceRole.entities.Order.filter({ paypal_order_id });
    const order = orders[0];
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    return Response.json({ order_id: order.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});