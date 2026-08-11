import { useEffect } from 'react';

// Injects a single <script type="application/ld+json"> tag into <head>, keyed by `id`
// so repeated mounts/updates (e.g. language toggles) update the same tag in place
// instead of stacking duplicates. Removed on unmount.

export default function JsonLd({ id, data }) {
  useEffect(() => {
    let el = document.head.querySelector(`script[data-jsonld="${id}"]`);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-jsonld', id);
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => { el?.remove(); };
  }, [id, data]);

  return null;
}