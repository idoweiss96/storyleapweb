import React from 'react';
import Pricing from './Pricing';

// Thin wrapper so /pricing is a Base44-managed page that reuses the existing Pricing component.
// English language and LTR are forced by LanguageContext based on the explicit English route map.
export default function EnPricing() {
  return <Pricing />;
}