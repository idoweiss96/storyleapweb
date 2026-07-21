import React from 'react';
import KitaAlef from './KitaAlef';

// Thin wrapper so /en/first-grade-transition is a Base44-managed page that reuses the existing KitaAlef component.
// English language and LTR are forced by LanguageContext based on the /en/* URL path.
// The existing KitaAlef questionnaire behavior and language persistence are unchanged.
export default function EnFirstGrade() {
  return <KitaAlef />;
}