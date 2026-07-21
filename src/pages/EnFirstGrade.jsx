import React from 'react';
import KitaAlef from './KitaAlef';

// Thin wrapper so /first-grade-transition is a Base44-managed page that reuses the existing KitaAlef component.
// English language and LTR are forced by LanguageContext based on the explicit English route map.
// The existing KitaAlef questionnaire behavior and language persistence are unchanged.
export default function EnFirstGrade() {
  return <KitaAlef />;
}