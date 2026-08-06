// Shared helper for computing the "Tags" column added to the Story Google Sheet
// exports (initSheet, addStoryToSheet). Mirrors the logic in src/lib/customerTags.js
// so the sheet exports and the in-app Customer view agree on the same tags.
// Deliberately scoped to Story-entity data only (no KitaAlefStory/Order/Coupon
// lookups here) — this only feeds the general Story sheets.

function isHebrewText(text) {
  return /[\u0590-\u05FF]/.test(text || '');
}

export function computeAutoTagsForStories(storiesForEmail) {
  const tags = new Set();
  const sorted = [...storiesForEmail].sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  if (sorted.length > 0) {
    const latest = sorted[0];
    tags.add(latest.payment_status === 'paid' ? 'Paid' : 'Pending Payment');
    const isHe = isHebrewText(latest.child_name) || isHebrewText(latest.trigger_desc) || isHebrewText(latest.hobbies);
    tags.add(isHe ? 'Hebrew' : 'English');
  }
  return Array.from(tags);
}

// Builds an email -> combined tags (auto + manual) map for a full Story list.
export function buildTagsMapForStories(allStories, customerTags) {
  const byEmail = new Map();
  allStories.forEach((s) => {
    if (!s.contact_email) return;
    const key = s.contact_email.toLowerCase();
    if (!byEmail.has(key)) byEmail.set(key, []);
    byEmail.get(key).push(s);
  });

  const manualByEmail = new Map((customerTags || []).map((ct) => [(ct.email || '').toLowerCase(), ct.tags || []]));

  const tagsMap = new Map();
  byEmail.forEach((storiesForEmail, email) => {
    const auto = computeAutoTagsForStories(storiesForEmail);
    const manual = manualByEmail.get(email) || [];
    tagsMap.set(email, Array.from(new Set([...manual, ...auto])));
  });
  return tagsMap;
}