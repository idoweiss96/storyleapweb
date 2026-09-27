import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import FirstThen from '@/components/activities/first-then/FirstThen';
import { UI, META } from '@/components/activities/first-then/firstThenContent';

export default function ActivityFirstThen() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="first-then" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <FirstThen lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
