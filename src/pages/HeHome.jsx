import React from 'react';
import Home from './Home';

// Thin wrapper so /he is a Base44-managed page that reuses the existing Home component.
// Hebrew language and RTL are forced by LanguageContext based on the /he URL path.
export default function HeHome() {
  return <Home />;
}