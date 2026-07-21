import React from 'react';
import Pricing from './Pricing';
import HebrewPageMeta from '@/components/SEO/HebrewPageMeta';

// Thin wrapper so /he/pricing is a Base44-managed page that reuses the existing Pricing component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HePricing() {
  return (
    <>
      <HebrewPageMeta
        title="מחירים | סיפורים רגשיים מותאמים אישית | StoryLeap"
        description="הכירו את המחיר של סיפור רגשי מותאם אישית שנבנה סביב הילד, החוויה שלו והאתגר שהוא מתמודד איתו."
      />
      <Pricing />
    </>
  );
}