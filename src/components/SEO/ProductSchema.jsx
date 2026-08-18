import JsonLd from './JsonLd';

const ORIGIN = 'https://storyleapai.com';

// Renders a Product/Offer JSON-LD schema for the Pricing page. `price` and `currency`
// are passed in from the page's own live pricing state (CreditPackage / coupon / fallback),
// never hardcoded here, so the schema always matches whatever price is actually on screen.
export default function ProductSchema({ name, description, price, currency, path }) {
  if (!price || !currency) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    offers: {
      '@type': 'Offer',
      price: String(price),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url: `${ORIGIN}${path}`,
    },
  };
  return <JsonLd id="product-schema" data={data} />;
}