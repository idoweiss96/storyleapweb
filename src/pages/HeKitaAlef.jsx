import React from 'react';
import KitaAlef from './KitaAlef';
import HebrewPageMeta from '@/components/SEO/HebrewPageMeta';

// Thin wrapper so /he/kita-alef is a Base44-managed page that reuses the existing KitaAlef component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HeKitaAlef() {
  return (
    <>
      <HebrewPageMeta
        title="הכנה רגשית לכיתה א׳ | כלים להורים ולילדים | StoryLeap"
        description="המעבר לכיתה א׳ מביא איתו הרבה רגשות, גם להורים וגם לילדים. StoryLeap מציעה הדרכה וסיפור מותאם אישית שעוזרים לילד להרגיש מוכן ובטוח."
      />
      <KitaAlef />
    </>
  );
}