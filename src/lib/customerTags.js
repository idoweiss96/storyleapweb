// Shared tag logic used by the unified Customer view (CustomersTab, CustomerDetailDialog)
// and the CSV export in Admin.jsx.

export const FIXED_TAG_OPTIONS = ['Kita Alef 2026', 'Paid', 'Pending Payment', 'Gifted Credits', 'Hebrew', 'English', 'Preview Requested', 'Preview Sent'];

function isHebrewText(text) {
  return /[\u0590-\u05FF]/.test(text || '');
}

// Computes the tags we can confidently infer automatically for one customer,
// based on their stories, Kita Alef submissions, and whether they've redeemed a gift coupon.
export function computeAutoTags({ stories = [], kitaStories = [], previews = [], hasGiftedCredits = false }) {
  const tags = new Set();
  if (kitaStories.length > 0) tags.add('Kita Alef 2026');
  if (hasGiftedCredits) tags.add('Gifted Credits');

  const allSubmissions = [...stories, ...kitaStories].sort(
    (a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0)
  );
  if (allSubmissions.length > 0) {
    const latest = allSubmissions[0];
    tags.add(latest.payment_status === 'paid' ? 'Paid' : 'Pending Payment');
    const isHe = latest.lang === 'he' || isHebrewText(latest.child_name) || isHebrewText(latest.trigger_desc) || isHebrewText(latest.hobbies);
    tags.add(isHe ? 'Hebrew' : 'English');
  }

  if (previews.length > 0) {
    const latestPreview = [...previews].sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0))[0];
    tags.add(latestPreview.status === 'ready' ? 'Preview Sent' : 'Preview Requested');
  }
  return Array.from(tags);
}

export function mergeTags(manual = [], auto = []) {
  return Array.from(new Set([...(manual || []), ...(auto || [])]));
}