import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import ChoiceBoard from '@/components/activities/choice-board/ChoiceBoard';
import { UI, META } from '@/components/activities/choice-board/choiceBoardContent';

export default function ActivityChoiceBoard() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="choice-board" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <ChoiceBoard lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
