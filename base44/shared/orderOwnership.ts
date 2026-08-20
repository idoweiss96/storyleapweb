// Which entity holds the order record for a given story_edit `product`.
//
// The three story_edit functions (getStoryPages / saveStoryEdit / getStoryEditStatus) all
// verify that the caller owns the order before touching the shared edit sheet. They used
// to look the order up in the `Story` entity only — which is correct for the therapeutic
// product, and silently wrong for every questionnaire-based product, whose records live
// in `KitaAlefStory`. The symptom was not an error message but a plain "Not found": the
// pipeline had written the pages, the sheet had the rows, and the edit screen insisted the
// story did not exist.
//
// `product` is the same string the pipeline passes to publish_page_texts (watcher_he.py:
// PRODUCT = "stories" / "first_grade" / "hero_story" ...), so this table is the single
// place where the two systems agree on where an order lives.

const PRODUCT_ENTITY: Record<string, string> = {
  stories: 'Story',
  first_grade: 'KitaAlefStory',
  moving: 'KitaAlefStory',
  hero_story: 'KitaAlefStory',
};

// Order matters: the entity a product maps to is tried first, then the other one. The
// fallback exists because a product may be renamed on one side before the other, and a
// paying customer losing access to their own book is worse than one extra query.
const ALL_ENTITIES = ['Story', 'KitaAlefStory'];

function isOwner(record: any, user: any): boolean {
  if (!record) return false;
  return record.contact_email === user.email || record.created_by_id === user.id;
}

/**
 * The caller's own order with this id, or null.
 * Never returns someone else's record — ownership is checked here, not by the caller.
 */
export async function findOwnedOrder(base44: any, orderId: string, product: string, user: any) {
  if (!orderId || !user) return null;

  const preferred = PRODUCT_ENTITY[product] || 'Story';
  const order = [preferred, ...ALL_ENTITIES.filter((e) => e !== preferred)];

  for (const entityName of order) {
    try {
      const rows = await base44.asServiceRole.entities[entityName].filter({ order_id: orderId });
      const mine = (rows || []).find((r: any) => isOwner(r, user));
      if (mine) return mine;
    } catch (_) {
      // An entity without an order_id field throws on filter — that is expected while a
      // product is mid-migration, and must not break the lookup in the other entity.
    }
  }
  return null;
}
