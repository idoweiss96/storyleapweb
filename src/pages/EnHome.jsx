import React from 'react';
import Home from './Home';

// Thin wrapper so /en is a Base44-managed page that reuses the existing Home component.
// English language and LTR are forced by LanguageContext based on the /en/* URL path.
export default function EnHome() {
  return <Home />;
}