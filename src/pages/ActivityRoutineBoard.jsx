import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import RoutineBoard from '@/components/activities/routine-board/RoutineBoard';
import { UI, META } from '@/components/activities/routine-board/routineBoardContent';

export default function ActivityRoutineBoard() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="routine-board" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <RoutineBoard lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
