import React from 'react';
import DSSection from './DSSection';
import { zIndexScale, durations } from './designSystemData';

export default function TokensSection() {
  return (
    <DSSection id="tokens" title="11. Design Tokens" description="Centralized in src/styles/design-tokens.css, src/styles/typography.css and src/styles/components.css (imported only by this page — production pages are untouched).">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Z-index scale</h3>
          <ul className="text-sm text-slate-500 space-y-1">
            {zIndexScale.map((z) => <li key={z.token}><span className="font-mono text-slate-700">{z.token}</span> — {z.usage}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Animation durations</h3>
          <ul className="text-sm text-slate-500 space-y-1">
            {durations.map((d) => <li key={d.token}><span className="font-mono text-slate-700">{d.token}</span> — {d.usage}</li>)}
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-4 text-xs font-mono text-slate-500 overflow-x-auto">
        <pre>{`src/styles/design-tokens.css   → colors, spacing, radius, shadows, breakpoints, z-index, durations
src/styles/typography.css      → heading/body/caption/button text styles
src/styles/components.css      → .ds-btn-*, .ds-card-* reference recipes
All classes are scoped under .ds-root and only affect this page.`}</pre>
      </div>
    </DSSection>
  );
}