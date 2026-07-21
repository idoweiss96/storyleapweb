import React from 'react';
import Vision from './Vision';

// Thin wrapper so /he/about is a Base44-managed page that reuses the existing Vision component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HeAbout() {
  return <Vision />;
}