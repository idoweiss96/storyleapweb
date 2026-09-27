import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import BodyMap from '@/components/activities/body-map/BodyMap';
import { UI, META } from '@/components/activities/body-map/bodyMapContent';

export default function ActivityBodyMap() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="body-map" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <BodyMap lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
