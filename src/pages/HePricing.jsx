import React from 'react';
import Pricing from './Pricing';

// Thin wrapper so /he/pricing is a Base44-managed page that reuses the existing Pricing component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HePricing() {
  return <Pricing />;
}