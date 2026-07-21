import React from 'react';
import Contact from './Contact';

// Thin wrapper so /en/contact is a Base44-managed page that reuses the existing Contact component.
// English language and LTR are forced by LanguageContext based on the /en/* URL path.
export default function EnContact() {
  return <Contact />;
}