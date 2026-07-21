import React from 'react';
import Contact from './Contact';

// Thin wrapper so /he/contact is a Base44-managed page that reuses the existing Contact component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HeContact() {
  return <Contact />;
}