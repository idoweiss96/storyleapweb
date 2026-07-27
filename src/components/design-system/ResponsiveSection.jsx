import React from 'react';
import DSSection from './DSSection';
import { breakpoints } from './designSystemData';

export default function ResponsiveSection() {
  return (
    <DSSection id="responsive" title="10. Responsive Behavior" description="Breakpoints are Tailwind defaults — no custom breakpoints are configured in tailwind.config.js.">
      <div className="space-y-3 mb-6">
        {breakpoints.map((b) => (
          <div key={b.name} className="flex items-start gap-4 border-b border-slate-50 pb-2">
            <span className="w-16 font-mono font-semibold text-slate-700 text-sm">{b.name}</span>
            <span className="w-20 text-sm text-slate-500">{b.value}</span>
            <span className="flex-1 text-sm text-slate-500">{b.usage}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="rounded-xl border border-slate-100 p-4">
          <p className="font-semibold text-slate-700 mb-1">Hero heading</p>
          <p className="text-slate-500">Mobile: text-4xl · Desktop (md): text-6xl</p>
        </div>
        <div className="rounded-xl border border-slate-100 p-4">
          <p className="font-semibold text-slate-700 mb-1">Feature grid</p>
          <p className="text-slate-500">Mobile: hidden (hidden md:block) · Desktop: grid-cols-3</p>
        </div>
        <div className="rounded-xl border border-slate-100 p-4">
          <p className="font-semibold text-slate-700 mb-1">Emoji answer grid</p>
          <p className="text-slate-500">Mobile: grid-cols-3 · sm and up: grid-cols-6</p>
        </div>
      </div>
    </DSSection>
  );
}