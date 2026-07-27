import React from 'react';
import DSSection from './DSSection';
import { spacingScale, radiusScale, shadowScale } from './designSystemData';

function Row({ label, sub, bar }) {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
      <div className="w-40 shrink-0 text-xs font-mono text-slate-600">{label}</div>
      <div className="flex-1 text-xs text-slate-500">{sub}</div>
      {bar && <div className="h-3 bg-violet-300 rounded shrink-0" style={{ width: bar }} />}
    </div>
  );
}

export default function SpacingSection() {
  return (
    <DSSection id="spacing" title="3. Spacing, Radius & Shadows" description="The spacing, radius and shadow values actually used across pages.">
      <h3 className="font-semibold text-slate-700 mb-2">Spacing scale</h3>
      <div className="mb-8">
        {spacingScale.map((s) => (
          <Row key={s.token} label={s.token} sub={`${s.px} — ${s.usage}`} bar={s.px.split(' ')[0]} />
        ))}
      </div>

      <h3 className="font-semibold text-slate-700 mb-2">Border radius scale</h3>
      <div className="mb-8">
        {radiusScale.map((r) => (
          <Row key={r.token} label={r.token} sub={`${r.px} — ${r.usage}`} />
        ))}
      </div>

      <h3 className="font-semibold text-slate-700 mb-2">Shadows</h3>
      <div>
        {shadowScale.map((s) => (
          <Row key={s.token} label="" sub={<span><span className="font-mono">{s.token}</span> — {s.usage}</span>} />
        ))}
      </div>
    </DSSection>
  );
}