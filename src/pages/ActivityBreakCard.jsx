import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import BreakCard from '@/components/activities/break-card/BreakCard';
import { UI, META } from '@/components/activities/break-card/breakCardContent';

export default function ActivityBreakCard() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="break-card" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <BreakCard lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
