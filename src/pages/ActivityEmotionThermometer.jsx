import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import EmotionThermometer from '@/components/activities/emotion-thermometer/EmotionThermometer';
import { UI, META } from '@/components/activities/emotion-thermometer/emotionThermometerContent';

export default function ActivityEmotionThermometer() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="emotion-thermometer" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <EmotionThermometer lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
