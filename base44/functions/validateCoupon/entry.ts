import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const STORY_CREDIT_COST = 20;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, validate_only } = await req.json();
    if (!code) return Response.json({ valid: false, error: 'Coupon code required' }, { status: 400 });

    const normalizedCode = code.trim().toUpperCase();
    const allCoupons = await base44.asServiceRole.entities.Coupon.filter({ is_active: true });
    const coupon = allCoupons.find(c => (c.code || '').toUpperCase() === normalizedCode);

    if (!coupon) return Response.json({ valid: false, error: 'Coupon not found' }, { status: 200 });

    // Check expiration
    if (coupon.expiration_date) {
      const expiry = new Date(coupon.expiration_date);
      if (expiry < new Date()) return Response.json({ valid: false, error: 'Coupon expired' }, { status: 200 });
    }

    // Check max uses (global)
    if (coupon.max_uses && (coupon.used_count || 0) >= coupon.max_uses) {
      return Response.json({ valid: false, error: 'Coupon usage limit reached' }, { status: 200 });
    }

    // Check per-user limit by looking at orders with this coupon
    const userOrders = await base44.asServiceRole.entities.Order.filter({
      user_email: user.email,
      paypal_order_id: `COUPON:${normalizedCode}`,
    });
    if (coupon.max_per_user && userOrders.length >= coupon.max_per_user) {
      return Response.json({ valid: false, error: 'Coupon usage limit reached for this user' }, { status: 200 });
    }

    const isFree = !coupon.price_ils || coupon.price_ils === 0;

    // Discount coupons: just return price info (redemption happens after PayPal payment)
    if (!isFree) {
      return Response.json({
        valid: true,
        type: 'discount',
        price_ils: coupon.price_ils,
        price_usd: coupon.price_usd || 0,
      });
    }

    // Free coupon — if validate_only, just return info without redeeming
    if (validate_only) {
      return Response.json({
        valid: true,
        type: 'free',
        price_ils: 0,
        price_usd: 0,
      });
    }

    // Redeem free coupon: increment used_count
    await base44.asServiceRole.entities.Coupon.update(coupon.id, {
      used_count: (coupon.used_count || 0) + 1,
    });

    // Add credits to user
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const dbUser = users[0];
    if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const creditsToAdd = coupon.credits || STORY_CREDIT_COST;
    const newCredits = (dbUser.credits || 0) + creditsToAdd;
    await base44.asServiceRole.entities.User.update(dbUser.id, { credits: newCredits });

    // Create an order record for audit
    await base44.asServiceRole.entities.Order.create({
      story_id: `COUPON:${normalizedCode}`,
      user_email: user.email,
      paypal_order_id: `COUPON:${normalizedCode}`,
      status: 'paid',
      amount: 0,
      currency: 'ILS',
    });

    return Response.json({
      valid: true,
      type: 'free',
      credits_added: creditsToAdd,
      new_total: newCredits,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});