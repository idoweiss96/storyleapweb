import React from 'react';
import DSSection from './DSSection';
import { componentInventory } from './designSystemData';

const statusColor = {
  Keep: 'bg-green-100 text-green-700',
  Merge: 'bg-amber-100 text-amber-700',
  Replace: 'bg-red-100 text-red-700',
  Deprecated: 'bg-slate-200 text-slate-600',
};

export default function ComponentInventory() {
  return (
    <DSSection id="inventory" title="12. Reusable Component Inventory">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-200">
              <th className="py-2 pr-4">Component</th>
              <th className="py-2 pr-4">File</th>
              <th className="py-2 pr-4">Used in</th>
              <th className="py-2 pr-4">Variants</th>
              <th className="py-2 pr-4">Responsive</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {componentInventory.map((c) => (
              <tr key={c.name} className="border-b border-slate-100 align-top">
                <td className="py-2 pr-4 font-semibold text-slate-700">{c.name}</td>
                <td className="py-2 pr-4 font-mono text-slate-500">{c.file}</td>
                <td className="py-2 pr-4 text-slate-500">{c.pages}</td>
                <td className="py-2 pr-4 text-slate-500">{c.variants}</td>
                <td className="py-2 pr-4 text-slate-500">{c.responsive}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${statusColor[c.status.split(' ')[0]] || 'bg-slate-100 text-slate-600'}`}>
                    {c.status.split(' — ')[0]}
                  </span>
                  {c.status.includes(' — ') && <p className="text-slate-400 mt-1">{c.status.split(' — ')[1]}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DSSection>
  );
}