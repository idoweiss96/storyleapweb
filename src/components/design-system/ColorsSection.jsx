import React from 'react';
import DSSection from './DSSection';
import { semanticColors, kitaColors, hardcodedInlineColors, gradients } from './designSystemData';

function Swatch({ hex, name, usage, rgb, hsl }) {
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden bg-white">
      <div className="h-14" style={{ background: hex }} />
      <div className="p-3 text-xs space-y-0.5">
        {name && <p className="font-mono font-semibold text-slate-700">{name}</p>}
        <p className="text-slate-500 font-mono">{hex}</p>
        {rgb && <p className="text-slate-400 font-mono">rgb({rgb})</p>}
        {hsl && <p className="text-slate-400 font-mono">hsl({hsl})</p>}
        {usage && <p className="text-slate-500 mt-1">{usage}</p>}
      </div>
    </div>
  );
}

export default function ColorsSection() {
  return (
    <DSSection id="colors" title="1. Brand Colors" description="Every color currently in use, grouped by role. Hardcoded hex values found duplicating an existing token are flagged.">
      <h3 className="font-semibold text-slate-700 mb-3">Semantic tokens (src/index.css)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {semanticColors.map((c) => <Swatch key={c.name} {...c} />)}
      </div>

      <h3 className="font-semibold text-slate-700 mb-3">Kita Alef brand palette (tailwind.config.js)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {kitaColors.map((c) => <Swatch key={c.name} name={c.name} hex={c.hex} usage={c.usage} />)}
      </div>

      <h3 className="font-semibold text-slate-700 mb-3">Gradients in use</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {gradients.map((g) => (
          <div key={g.name} className="rounded-xl border border-slate-100 overflow-hidden bg-white">
            <div className="h-14" style={{ background: g.css }} />
            <div className="p-3 text-xs space-y-0.5">
              <p className="font-semibold text-slate-700">{g.name}</p>
              <p className="text-slate-400 font-mono break-all">{g.css}</p>
              <p className="text-slate-500">{g.usage}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-slate-700 mb-3">⚠️ Hardcoded / inconsistent colors</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {hardcodedInlineColors.map((c) => (
          <div key={c.hex} className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="w-10 h-10 rounded-lg shrink-0 border border-white" style={{ background: c.hex.split(' / ')[0] }} />
            <div className="text-xs">
              <p className="font-mono font-semibold text-amber-800">{c.hex}</p>
              <p className="text-amber-700">{c.note}</p>
            </div>
          </div>
        ))}
      </div>
    </DSSection>
  );
}