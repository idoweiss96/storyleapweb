import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import VisualTimer from '@/components/activities/visual-timer/VisualTimer';
import { UI, META } from '@/components/activities/visual-timer/visualTimerContent';

export default function ActivityVisualTimer() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="visual-timer" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <VisualTimer lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
