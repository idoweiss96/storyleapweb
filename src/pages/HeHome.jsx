import React from 'react';
import Home from './Home';
import HebrewPageMeta from '@/components/SEO/HebrewPageMeta';

// Thin wrapper so /he is a Base44-managed page that reuses the existing Home component.
// Hebrew language and RTL are forced by LanguageContext based on the /he URL path.
export default function HeHome() {
  return (
    <>
      <HebrewPageMeta
        title="StoryLeap | סיפורים רגשיים מותאמים אישית לילדים"
        description="סיפורים מותאמים אישית לילדים בגילי 3–9, שעוזרים להבין רגשות, להתכונן למעברים ולפתוח שיחה משמעותית עם ההורים."
      />
      <Home />
    </>
  );
}