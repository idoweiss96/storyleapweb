import { useEffect } from 'react';

// Generic per-page <title>/description/og override, for pages that render both
// languages from a single route (Pricing, Vision, Our Methods, FAQ) via the
// lang toggle rather than a separate /he/* URL. Same restore-on-unmount pattern
// as HebrewPageMeta, but not tied to a specific language or route.

function getOrCreateMeta(selector, attr) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attr).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
}

export default function PageMeta({ title, description }) {
  useEffect(() => {
    const originalTitle = document.title;

    const descEl = getOrCreateMeta('meta[name="description"]', { name: 'description' });
    const ogTitleEl = getOrCreateMeta('meta[property="og:title"]', { property: 'og:title' });
    const ogDescEl = getOrCreateMeta('meta[property="og:description"]', { property: 'og:description' });

    const originalDesc = descEl.getAttribute('content');
    const originalOgTitle = ogTitleEl.getAttribute('content');
    const originalOgDesc = ogDescEl.getAttribute('content');

    document.title = title;
    descEl.setAttribute('content', description);
    ogTitleEl.setAttribute('content', title);
    ogDescEl.setAttribute('content', description);

    return () => {
      document.title = originalTitle;
      if (originalDesc !== null) descEl.setAttribute('content', originalDesc);
      else descEl.removeAttribute('content');
      if (originalOgTitle !== null) ogTitleEl.setAttribute('content', originalOgTitle);
      else ogTitleEl.removeAttribute('content');
      if (originalOgDesc !== null) ogDescEl.setAttribute('content', originalOgDesc);
      else ogDescEl.removeAttribute('content');
    };
  }, [title, description]);

  return null;
}