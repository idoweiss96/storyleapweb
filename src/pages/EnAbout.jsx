import React from 'react';
import Vision from './Vision';

// Thin wrapper so /about is a Base44-managed page that reuses the existing Vision component.
// English language and LTR are forced by LanguageContext based on the explicit English route map.
export default function EnAbout() {
  return <Vision />;
}