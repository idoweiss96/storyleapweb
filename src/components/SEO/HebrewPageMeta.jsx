import { useEffect } from 'react';

// Centralized Hebrew metadata for the /he marketing routes.
// Updates existing tags in place (creates exactly one if missing) and
// restores the original values on unmount so English pages are not left
// with Hebrew metadata after client-side navigation.
// Canonical, robots, og:url, hreflang and structured data are never touched.

function getOrCreateMeta(selector, attr) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attr).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
}

export default function HebrewPageMeta({ title, description }) {
  useEffect(() => {
    const titleEl = document.title;
    const originalTitle = titleEl;

    const descEl = getOrCreateMeta('meta[name="description"]', { name: 'description' });
    const ogTitleEl = getOrCreateMeta('meta[property="og:title"]', { property: 'og:title' });
    const ogDescEl = getOrCreateMeta('meta[property="og:description"]', { property: 'og:description' });

    const originalDesc = descEl.getAttribute('content');
    const originalOgTitle = ogTitleEl.getAttribute('content');
    const originalOgDesc = ogDescEl.getAttribute('content');

    // Apply Hebrew metadata
    document.title = title;
    descEl.setAttribute('content', description);
    ogTitleEl.setAttribute('content', title);
    ogDescEl.setAttribute('content', description);

    // Cleanup: restore originals so English pages aren't left with Hebrew metadata
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