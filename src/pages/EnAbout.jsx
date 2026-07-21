import React from 'react';
import Vision from './Vision';

// Thin wrapper so /en/about is a Base44-managed page that reuses the existing Vision component.
// English language and LTR are forced by LanguageContext based on the /en/* URL path.
export default function EnAbout() {
  return <Vision />;
}