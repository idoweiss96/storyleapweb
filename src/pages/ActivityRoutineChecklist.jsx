import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import RoutineChecklist from '@/components/activities/routine-checklist/RoutineChecklist';
import { UI, META } from '@/components/activities/routine-checklist/routineChecklistContent';

export default function ActivityRoutineChecklist() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="routine-checklist" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <RoutineChecklist lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
