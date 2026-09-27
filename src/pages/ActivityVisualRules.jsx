import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import ActivityShell from '@/components/activities/shared/ActivityShell';
import VisualRules from '@/components/activities/visual-rules/VisualRules';
import { UI, META } from '@/components/activities/visual-rules/visualRulesContent';

export default function ActivityVisualRules() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  return (
    <ActivityShell slug="visual-rules" copy={isHe ? UI.he : UI.en} meta={isHe ? META.he : META.en} isHe={isHe}>
      <VisualRules lang={isHe ? 'he' : 'en'} />
    </ActivityShell>
  );
}
