/**
 * captureSnapshot — freeze what an activity looks like at the moment it is saved.
 *
 * Rendering a saved entry as a list of fields loses the activity: a body map is
 * a drawing, a routine board is a row of cards. Rather than teaching the space
 * how to re-render nineteen different activities, this captures the markup the
 * activity already produced — the same markup the print button puts on paper.
 *
 * Each activity injects its own <style> into the DOM, so cloning the subtree
 * carries the styling along with the content.
 */

/** Above this the snapshot is dropped and the entry falls back to field rows. */
const MAX_SNAPSHOT_BYTES = 400 * 1024;

/**
 * Values of form controls live on the DOM property, not the attribute, so a
 * naive clone renders every answer box empty. Each control is swapped for the
 * text it was holding.
 */
function inlineControlValues(root, clone) {
  const originals = root.querySelectorAll('input, textarea, select');
  const copies = clone.querySelectorAll('input, textarea, select');
  originals.forEach((el, i) => {
    const copy = copies[i];
    if (!copy) return;

    if (el.type === 'checkbox' || el.type === 'radio') {
      if (el.checked) copy.setAttribute('checked', 'checked');
      else copy.removeAttribute('checked');
      return;
    }

    const value = el.tagName === 'SELECT'
      ? (el.selectedOptions?.[0]?.textContent || '')
      : (el.value || '');
    const replacement = document.createElement('div');
    replacement.className = copy.className || '';
    replacement.textContent = value;
    copy.replaceWith(replacement);
  });
}

/** Stored markup is re-rendered later, so nothing executable may survive. */
function stripActiveContent(clone) {
  clone.querySelectorAll('script, iframe, object, embed, link[rel="import"]').forEach((n) => n.remove());
  clone.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      if ((name === 'href' || name === 'src' || name === 'xlink:href')
        && /^\s*javascript:/i.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    });
  });
}

/**
 * @param {Element} root  the activity's container, usually the page <main>
 * @returns {string|null} self-contained markup, or null when there is nothing
 *                        worth keeping
 */
export function capturePrintable(root) {
  if (!root) return null;
  try {
    const clone = root.cloneNode(true);

    // App chrome never reaches paper, and shouldn't reach the saved copy either.
    clone.querySelectorAll('.site-chrome, .site-decor, .no-print').forEach((n) => n.remove());

    inlineControlValues(root, clone);
    stripActiveContent(clone);

    const html = clone.innerHTML.trim();
    if (!html) return null;
    if (html.length > MAX_SNAPSHOT_BYTES) {
      console.warn('[captureSnapshot] snapshot too large, skipping:', html.length);
      return null;
    }
    return html;
  } catch (e) {
    console.error('[captureSnapshot] capture failed:', e);
    return null;
  }
}

/**
 * Build the document shown in the preview iframe.
 *
 * The app's own stylesheets are linked in so Tailwind classes resolve, and the
 * activity's print-only rules are promoted to always-on so the preview matches
 * what the printer would produce rather than what the screen showed.
 */
export function buildPreviewDoc(html, { rtl = true } = {}) {
  const sheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((l) => `<link rel="stylesheet" href="${l.href}">`)
    .join('');

  const promoted = String(html).replace(/@media\s+print/gi, '@media all');

  return `<!doctype html><html dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${sheets}
<style>
  html, body { margin: 0; padding: 0; background: #fff; }
  body { padding: 12px; }
  a { pointer-events: none; text-decoration: none; }
</style>
</head><body>${promoted}</body></html>`;
}
