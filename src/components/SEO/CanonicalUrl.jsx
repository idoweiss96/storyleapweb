import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCanonicalUrl } from '@/lib/marketingRoutes';

// Forces the single existing platform-injected <link rel="canonical"> and
// <meta property="og:url"> to the lowercase canonical for the five English
// marketing routes, regardless of the casing used in the request URL.
//
// Hebrew and non-marketing routes are left untouched: Hebrew canonicals are
// already lowercase and self-referencing, and functional pages keep the
// platform default.
//
// This component never creates a second canonical or og:url tag — it only
// updates the href/content of the existing tag in place. A MutationObserver
// re-applies after late platform injection or client-side re-injection so the
// override survives direct access, refresh, client-side navigation, and
// browser back/forward.

export default function CanonicalUrl() {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(location.pathname);
    if (!canonicalUrl) return undefined; // non-marketing or Hebrew: do nothing

    const apply = () => {
      const link = document.head.querySelector('link[rel="canonical"]');
      if (link && link.getAttribute('href') !== canonicalUrl) {
        link.setAttribute('href', canonicalUrl);
      }
      const og = document.head.querySelector('meta[property="og:url"]');
      if (og && og.getAttribute('content') !== canonicalUrl) {
        og.setAttribute('content', canonicalUrl);
      }
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'content'],
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}