import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import EmotionWheel from '@/components/activities/emotion-wheel/EmotionWheel';
import { UI, META } from '@/components/activities/emotion-wheel/emotionWheelContent';

export default function ActivityEmotionWheel() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="emotion-wheel" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <EmotionWheel lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
