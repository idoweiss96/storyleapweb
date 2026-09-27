import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import CalmCorner from '@/components/activities/calm-corner/CalmCorner';
import { UI, META } from '@/components/activities/calm-corner/calmCornerContent';

export default function ActivityCalmCorner() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="calm-corner" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <CalmCorner lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
