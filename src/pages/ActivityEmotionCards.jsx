import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import EmotionCards from '@/components/activities/emotion-cards/EmotionCards';
import { UI, META } from '@/components/activities/emotion-cards/emotionCardsContent';

export default function ActivityEmotionCards() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="emotion-cards" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <EmotionCards lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
