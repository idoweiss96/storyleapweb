import React from 'react';
import KitaAlef from './KitaAlef';
import HebrewPageMeta from '@/components/SEO/HebrewPageMeta';

// Thin wrapper so /he/kita-alef is a Base44-managed page that reuses the existing KitaAlef component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HeKitaAlef() {
  return (
    <>
      <HebrewPageMeta
        title="סיפור מותאם אישית לקראת כיתה א׳ | StoryLeap"
        description="עזרו לילד להתכונן רגשית לכיתה א׳ בעזרת סיפור אישי שנבנה סביב הרגשות, השאלות והחוויה שמחכה לו בבית הספר."
      />
      <KitaAlef />
    </>
  );
}