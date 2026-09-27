import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import Breathing from '@/components/activities/breathing/Breathing';
import { UI, META } from '@/components/activities/breathing/breathingContent';

export default function ActivityBreathing() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="breathing" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <Breathing lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
