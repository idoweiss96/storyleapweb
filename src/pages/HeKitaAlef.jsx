import React from 'react';
import KitaAlef from './KitaAlef';

// Thin wrapper so /he/kita-alef is a Base44-managed page that reuses the existing KitaAlef component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HeKitaAlef() {
  return <KitaAlef />;
}