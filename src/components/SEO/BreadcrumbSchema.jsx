import JsonLd from './JsonLd';

const ORIGIN = 'https://storyleapai.com';

// Renders a BreadcrumbList JSON-LD schema. `items` is the list of levels after Home,
// each with an explicit clean `name` (never derived from a raw/truncated page title)
// and the current route's own `path` so /he/* routes get their real URL.
export default function BreadcrumbSchema({ items }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'StoryLeap', item: `${ORIGIN}/` },
      ...items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: it.name,
        item: `${ORIGIN}${it.path}`,
      })),
    ],
  };
  return <JsonLd id="breadcrumb-schema" data={data} />;
}