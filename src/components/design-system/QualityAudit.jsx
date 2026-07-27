import React from 'react';
import { AlertTriangle } from 'lucide-react';
import DSSection from './DSSection';
import { auditItems } from './designSystemData';

const severityColor = {
  high: 'border-red-200 bg-red-50 text-red-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  low: 'border-slate-200 bg-slate-50 text-slate-600',
};

export default function QualityAudit() {
  return (
    <DSSection id="audit" title="14. Quality Audit" description="Issues found while documenting the current implementation — not yet fixed.">
      <div className="space-y-3">
        {auditItems.map((item, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${severityColor[item.severity]}`}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm flex items-center gap-2">
                {item.title}
                <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-white/60">{item.severity}</span>
              </p>
              <p className="text-sm mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </DSSection>
  );
}