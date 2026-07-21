import { createPageUrl } from '@/utils';

// Single source of truth for the five marketing route pairs (English <-> Hebrew).
const EN_TO_HE = {
  '/': '/he',
  '/Pricing': '/he/pricing',
  '/Vision': '/he/about',
  '/Contact': '/he/contact',
  '/KitaAlef': '/he/kita-alef',
};

const HE_TO_EN = Object.fromEntries(
  Object.entries(EN_TO_HE).map(([en, he]) => [he, en])
);

// Nav item name -> English marketing path. Only these items are locale-aware;
// every other nav item (CreateStory, MyStories, Admin) keeps its existing destination.
const NAV_EN_PATH = {
  Home: '/',
  Pricing: '/Pricing',
  Contact: '/Contact',
  Vision: '/Vision',
  KitaAlef: '/KitaAlef',
};

export function isHebrewRoute(pathname) {
  return pathname === '/he' || pathname.startsWith('/he/');
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
  if (EN_TO_HE[pathname]) return { path: EN_TO_HE[pathname], lang: 'he' };
  if (HE_TO_EN[pathname]) return { path: HE_TO_EN[pathname], lang: 'en' };
  return null;
}