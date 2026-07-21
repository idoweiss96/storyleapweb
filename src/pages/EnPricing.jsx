import React from 'react';
import Pricing from './Pricing';

// Thin wrapper so /en/pricing is a Base44-managed page that reuses the existing Pricing component.
// English language and LTR are forced by LanguageContext based on the /en/* URL path.
export default function EnPricing() {
  return <Pricing />;
}