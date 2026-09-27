import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import AdlSequence from '@/components/activities/adl-sequence/AdlSequence';
import { UI, META } from '@/components/activities/adl-sequence/adlSequenceContent';

export default function ActivityAdlSequence() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="adl-sequence" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <AdlSequence lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
