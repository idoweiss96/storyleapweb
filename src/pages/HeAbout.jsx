import React from 'react';
import Vision from './Vision';
import HebrewPageMeta from '@/components/SEO/HebrewPageMeta';

// Thin wrapper so /he/about is a Base44-managed page that reuses the existing Vision component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HeAbout() {
  return (
    <>
      <HebrewPageMeta
        title="אודות StoryLeap | תמיכה רגשית דרך סיפורים"
        description="הכירו את StoryLeap ואת הדרך שבה אנחנו משלבים סיפורים מותאמים אישית, חשיבה רגשית ובינה מלאכותית לטובת ילדים, הורים ואנשי מקצוע."
      />
      <Vision />
    </>
  );
}