import React from 'react';
import FAQ from './FAQ';
import HebrewPageMeta from '@/components/SEO/HebrewPageMeta';

// Thin wrapper so /he/faq is a Base44-managed page that reuses the existing FAQ component.
// Hebrew language and RTL are forced by LanguageContext based on the /he/* URL path.
export default function HeFAQ() {
  return (
    <>
      <HebrewPageMeta
        title="שאלות נפוצות | StoryLeap"
        description="תשובות על יצירת סיפור מותאם אישית ב-StoryLeap: איך זה עובד, מחירים, תשלום, ותמונות הילד/ה."
      />
      <FAQ />
    </>
  );
}