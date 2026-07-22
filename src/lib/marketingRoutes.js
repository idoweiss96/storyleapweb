import { createPageUrl } from '@/utils';

// Single source of truth for the five marketing route pairs (English <-> Hebrew).
const EN_TO_HE = {
  '/': '/he',
  '/pricing': '/he/pricing',
  '/vision': '/he/about',
  '/contact': '/he/contact',
  '/kitaalef': '/he/kita-alef',
};

const HE_TO_EN = Object.fromEntries(
  Object.entries(EN_TO_HE).map(([en, he]) => [he, en])
);

const EN_MARKETING_ROUTES = Object.keys(EN_TO_HE);
const EN_MARKETING_ROUTES_LC = EN_MARKETING_ROUTES.map((r) => r.toLowerCase());

// Centralized canonical URL map.
// English marketing routes always use the lowercase canonical (any casing of
// the request URL is normalized). Hebrew routes are intentionally NOT listed
// here — they keep their platform-injected self-referencing lowercase canonicals.
const ORIGIN = 'https://storyleapai.com';
const EN_CANONICAL = {
  '/': ORIGIN + '/',
  '/pricing': ORIGIN + '/pricing',
  '/vision': ORIGIN + '/vision',
  '/contact': ORIGIN + '/contact',
  '/kitaalef': ORIGIN + '/kitaalef',
};

// Normalize a pathname for language matching only (does not change the browser URL):
// strip query/hash, remove a trailing slash except for root, and lowercase.
function normalizePath(pathname) {
  if (!pathname) return '/';
  let p = pathname.split('?')[0].split('#')[0];
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p.toLowerCase();
}

// Centralized route-language resolver.
// Returns 'he' for /he routes, 'en' for the original marketing routes,
// and null for shared functional/noindex routes (which keep the stored preference).
// Matching is case-insensitive so /pricing and /Pricing resolve identically.
export function resolveRouteLang(pathname) {
  const p = normalizePath(pathname);
  if (p === '/he' || p.startsWith('/he/')) return 'he';
  if (EN_MARKETING_ROUTES_LC.includes(p)) return 'en';
  return null;
}

// Nav item name -> English marketing path. Only these items are locale-aware;
// every other nav item (CreateStory, MyStories, Admin) keeps its existing destination.
const NAV_EN_PATH = {
  Home: '/',
  Pricing: '/pricing',
  Contact: '/contact',
  Vision: '/vision',
  KitaAlef: '/kitaalef',
};

export function isHebrewRoute(pathname) {
  const p = normalizePath(pathname);
  return p === '/he' || p.startsWith('/he/');
}

// Resolve a nav item destination for the current locale.
// Marketing items are locale-aware; non-marketing items fall back to createPageUrl (unchanged).
export function navPathFor(name, pathname, lang) {
  const enPath = NAV_EN_PATH[name];
  if (enPath) {
    // Hebrew when on a /he route OR when the active language is Hebrew.
    // The lang check covers shared functional/noindex pages (e.g. /MyStories)
    // whose URL is not /he but whose user is browsing in Hebrew.
    const hebrew = isHebrewRoute(pathname) || lang === 'he';
    return hebrew ? EN_TO_HE[enPath] : enPath;
  }
  return createPageUrl(name);
}

// Language switcher: if the current path is one of the five marketing pairs,
// return the counterpart path and the language to persist. Otherwise null
// (caller preserves the existing preference-only toggle behavior).
export function getLangSwitchTarget(pathname) {
  const p = normalizePath(pathname);
  if (EN_TO_HE[p]) return { path: EN_TO_HE[p], lang: 'he' };
  if (HE_TO_EN[p]) return { path: HE_TO_EN[p], lang: 'en' };
  return null;
}

// Centralized canonical resolver. Returns the absolute lowercase canonical URL
// for the five English marketing routes (any casing), or null for Hebrew and
// non-marketing routes (which keep the platform-injected canonical untouched).
export function getCanonicalUrl(pathname) {
  return EN_CANONICAL[normalizePath(pathname)] || null;
}