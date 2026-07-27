import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DSSection from './DSSection';

export default function FormsSection() {
  return (
    <DSSection id="forms" title="6. Form Components" description="Shared shadcn form inputs plus the Kita Alef custom-styled equivalents (rounded-[10px], kita-input-bg).">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">Shared inputs (ui/input, ui/textarea, ui/label)</h3>
          <div>
            <Label>Email</Label>
            <Input placeholder="you@example.com" className="mt-1" />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea placeholder="Write to us..." className="mt-1" />
          </div>
          <div>
            <Label>Disabled</Label>
            <Input disabled placeholder="Disabled" className="mt-1" />
          </div>
          <p className="text-xs text-red-500">Please fill in all required fields (validation message pattern used across CreateStory/Contact)</p>
          <p className="text-xs text-green-600">Request sent successfully! 🎉 (success message pattern)</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">Kita Alef custom inputs</h3>
          <input
            placeholder="כתבו כאן..."
            className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg text-kita-text focus:outline-none"
            style={{ borderColor: '#F0E8F5' }}
          />
          <div className="flex flex-wrap gap-2">
            {['ילד', 'ילדה', 'אחר/ת'].map((opt, i) => (
              <button key={opt} className="px-4 py-2 rounded-full text-sm font-medium"
                style={i === 0 ? { background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)', color: '#fff' } : { background: '#fff', color: '#6b6b8a', border: '1px solid #F0E8F5' }}>
                {opt}
              </button>
            ))}
          </div>
          <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner border border-slate-100">
            <div className="h-full rounded-full" style={{ width: '60%', background: 'linear-gradient(to left, #4FC3E8, #FF6FB5)' }} />
          </div>
          <p className="text-xs text-slate-400">Progress indicator — Questionnaire.jsx</p>
        </div>
      </div>
    </DSSection>
  );
}