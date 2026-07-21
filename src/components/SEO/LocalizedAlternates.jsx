import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Centralized reciprocal hreflang tags for the English/Hebrew marketing route pairs.
// Mounted once in the shared Layout. Only the 10 marketing paths receive tags;
// all other routes (CreateStory, MyStories, Payment*, Admin, etc.) get none.
// Tags created here are marked with data-storyleap-hreflang="true" and only those
// are ever removed — canonical, robots, og:url, hreflang from the platform, etc.
// are never touched.

const ORIGIN = 'https://storyleapai.com';
const MARKER = 'data-storyleap-hreflang';

// Normalized path → { en, he } absolute path pair
const ROUTE_PAIRS = {
  '/':             { en: '/',             he: '/he' },
  '/pricing':      { en: '/pricing',      he: '/he/pricing' },
  '/vision':       { en: '/vision',       he: '/he/about' },
  '/contact':      { en: '/contact',      he: '/he/contact' },
  '/kitaalef':     { en: '/kitaalef',     he: '/he/kita-alef' },
  '/he':           { en: '/',             he: '/he' },
  '/he/pricing':   { en: '/pricing',      he: '/he/pricing' },
  '/he/about':     { en: '/vision',       he: '/he/about' },
  '/he/contact':   { en: '/contact',      he: '/he/contact' },
  '/he/kita-alef': { en: '/kitaalef',     he: '/he/kita-alef' },
};

function normalizePath(pathname) {
  let p = (pathname || '').split('?')[0].split('#')[0].toLowerCase();
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  if (p === '') p = '/';
  return p;
}

function clearOwnTags() {
  document.head.querySelectorAll(`link[${MARKER}="true"]`).forEach(el => el.remove());
}

export default function LocalizedAlternates() {
  const location = useLocation();

  useEffect(() => {
    const path = normalizePath(location.pathname);
    const pair = ROUTE_PAIRS[path];
    if (!pair) return undefined; // no marketing pair → leave no tags

    const specs = [
      { hreflang: 'en', href: ORIGIN + pair.en },
      { hreflang: 'he', href: ORIGIN + pair.he },
      { hreflang: 'x-default', href: ORIGIN + pair.en },
    ];
    specs.forEach(({ hreflang, href }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      link.setAttribute(MARKER, 'true');
      document.head.appendChild(link);
    });

    // Remove only this component's tags before the next run or on unmount
    return () => clearOwnTags();
  }, [location.pathname]);

  return null;
}