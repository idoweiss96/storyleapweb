import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import StrengthCards from '@/components/activities/strength-cards/StrengthCards';
import { UI, META } from '@/components/activities/strength-cards/strengthCardsContent';

export default function ActivityStrengthCards() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="strength-cards" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <StrengthCards lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
