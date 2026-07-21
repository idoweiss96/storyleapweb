import React from 'react';
import Contact from './Contact';
import HebrewPageMeta from '@/components/SEO/HebrewPageMeta';

// Thin wrapper so /he/contact is a Base44-managed page that reuses the existing Contact component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HeContact() {
  return (
    <>
      <HebrewPageMeta
        title="יצירת קשר עם StoryLeap | שאלות, שותפויות ותמיכה"
        description="צרו קשר עם צוות StoryLeap לשאלות על סיפורים מותאמים אישית, שיתופי פעולה, שימוש מקצועי או תמיכה."
      />
      <Contact />
    </>
  );
}