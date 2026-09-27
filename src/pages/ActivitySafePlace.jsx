import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import SafePlace from '@/components/activities/safe-place/SafePlace';
import { UI, META } from '@/components/activities/safe-place/safePlaceContent';

export default function ActivitySafePlace() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="safe-place" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <SafePlace lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
