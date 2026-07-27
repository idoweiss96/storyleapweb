import { useEffect } from 'react';

// Adds a noindex, nofollow robots meta tag while mounted, and removes/restores
// it on unmount. Used only by internal pages that must never appear in search
// results or the sitemap (e.g. /design-system).

export default function NoIndexMeta() {
  useEffect(() => {
    let el = document.head.querySelector('meta[name="robots"]');
    const created = !el;
    const originalContent = el ? el.getAttribute('content') : null;

    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'robots');
      document.head.appendChild(el);
    }
    el.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (created) {
        el.remove();
      } else if (originalContent !== null) {
        el.setAttribute('content', originalContent);
      }
    };
  }, []);

  return null;
}