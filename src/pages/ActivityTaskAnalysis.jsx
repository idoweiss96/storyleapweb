import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import TaskAnalysis from '@/components/activities/task-analysis/TaskAnalysis';
import { UI, META } from '@/components/activities/task-analysis/taskAnalysisContent';

export default function ActivityTaskAnalysis() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="task-analysis" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <TaskAnalysis lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
