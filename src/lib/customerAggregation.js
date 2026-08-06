import { computeAutoTags, mergeTags } from './customerTags';

// Builds one unified record per customer email from all the entities that
// separately reference that email today (Story, KitaAlefStory, User credits,
// Order/Coupon redemptions). Purely a read-side aggregation — it never writes
// back to Story/KitaAlefStory/Order/Coupon, per the "don't change how credits,
// coupons or payment status work" requirement.
export function aggregateCustomers({ stories = [], kitaStories = [], users = [], orders = [], coupons = [], customerTags = [] }) {
  const byEmail = new Map();

  const ensure = (rawEmail) => {
    if (!rawEmail) return null;
    const key = rawEmail.toLowerCase();
    if (!byEmail.has(key)) {
      byEmail.set(key, {
        email: rawEmail,
        name: '',
        credits: 0,
        stories: [],
        kitaStories: [],
        coupons: [],
        hasGiftedCredits: false,
        manualTags: [],
        tagRecordId: null,
      });
    }
    return byEmail.get(key);
  };

  stories.forEach((s) => { const c = ensure(s.contact_email); if (c) c.stories.push(s); });
  kitaStories.forEach((s) => { const c = ensure(s.contact_email); if (c) c.kitaStories.push(s); });

  users.forEach((u) => {
    const c = ensure(u.email);
    if (c) {
      c.credits = u.credits || 0;
      c.name = u.full_name || c.name;
      c.userId = u.id;
    }
  });

  const couponByCode = new Map(coupons.map((cp) => [(cp.code || '').toUpperCase(), cp]));
  orders.forEach((o) => {
    if (!o.user_email || !(o.paypal_order_id || '').startsWith('COUPON:')) return;
    const c = ensure(o.user_email);
    if (!c) return;
    const code = o.paypal_order_id.replace('COUPON:', '').toUpperCase();
    const coupon = couponByCode.get(code);
    c.coupons.push({ code, coupon, order: o });
    if (coupon?.is_gift) c.hasGiftedCredits = true;
  });

  customerTags.forEach((ct) => {
    const c = ensure(ct.email);
    if (c) { c.manualTags = ct.tags || []; c.tagRecordId = ct.id; }
  });

  return Array.from(byEmail.values())
    .map((c) => {
      const autoTags = computeAutoTags({ stories: c.stories, kitaStories: c.kitaStories, hasGiftedCredits: c.hasGiftedCredits });
      return { ...c, autoTags, allTags: mergeTags(c.manualTags, autoTags) };
    })
    .sort((a, b) => (b.stories.length + b.kitaStories.length) - (a.stories.length + a.kitaStories.length));
}