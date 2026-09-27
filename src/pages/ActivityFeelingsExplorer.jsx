import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import FeelingsExplorer from '@/components/activities/feelings-explorer/FeelingsExplorer';
import { UI, META } from '@/components/activities/feelings-explorer/feelingsExplorerContent';

export default function ActivityFeelingsExplorer() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="feelings-explorer" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <FeelingsExplorer lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
