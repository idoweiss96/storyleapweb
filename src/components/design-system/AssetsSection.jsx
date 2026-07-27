import React from 'react';
import DSSection from './DSSection';
import { assets } from './designSystemData';

export default function AssetsSection() {
  return (
    <DSSection id="assets" title="9. Images & Assets" description="Static images referenced directly by URL in the codebase.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {assets.map((a) => (
          <div key={a.name} className="rounded-xl border border-slate-100 overflow-hidden bg-white">
            {!a.path.includes('...') ? (
              <img src={a.path} alt={a.name} className="w-full h-28 object-contain bg-slate-50" />
            ) : (
              <div className="w-full h-28 bg-slate-50 flex items-center justify-center text-xs text-slate-400">gallery set</div>
            )}
            <div className="p-2 text-xs">
              <p className="font-semibold text-slate-700">{a.name}</p>
              <p className="text-slate-400 break-all font-mono text-[10px]">{a.path}</p>
              <p className="text-slate-500 mt-1">{a.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </DSSection>
  );
}