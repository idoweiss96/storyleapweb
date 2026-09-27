import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import EmotionDrawing from '@/components/activities/emotion-drawing/EmotionDrawing';
import { UI, META } from '@/components/activities/emotion-drawing/emotionDrawingContent';

export default function ActivityEmotionDrawing() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="emotion-drawing" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe} wide>
      <EmotionDrawing lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
