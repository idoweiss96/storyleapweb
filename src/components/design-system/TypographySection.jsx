import React from 'react';
import DSSection from './DSSection';
import { typography } from './designSystemData';

export default function TypographySection() {
  return (
    <DSSection id="typography" title="2. Typography" description="No custom font is loaded — the app uses the Tailwind default sans stack everywhere. Sizes below are the actual Tailwind classes found in use.">
      <div className="space-y-6">
        {typography.map((t) => (
          <div key={t.role} className="border border-slate-100 rounded-xl p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.role}</span>
              <span className="text-xs font-mono text-slate-400">{t.classes}</span>
            </div>
            <p className={t.classes.split(' ').filter(c => !c.includes('#')).join(' ')}>{t.example}</p>
            <p className="text-xs text-slate-400 mt-2">Used in: {t.where}</p>
          </div>
        ))}
      </div>
    </DSSection>
  );
}