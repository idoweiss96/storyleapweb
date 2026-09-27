import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import EmotionCheckin from '@/components/activities/emotion-checkin/EmotionCheckin';
import { UI, META } from '@/components/activities/emotion-checkin/emotionCheckinContent';

export default function ActivityEmotionCheckin() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="emotion-checkin" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <EmotionCheckin lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
