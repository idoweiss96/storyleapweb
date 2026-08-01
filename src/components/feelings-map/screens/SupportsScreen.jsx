import React from 'react';
import { Button } from '@/components/ui/button';
import OptionCard from '../OptionCard';
import BackLink from '../BackLink';

export default function SupportsScreen({ text, isEn, supports, state, toggle, updateCustom, onBack, onNext }) {
  const showOther = state.supports.includes('other');
  return (
    <div>
      <BackLink label={text.back} isEn={isEn} onClick={onBack} />
      <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A6E' }}>{text.supportsTitle}</h2>
      <p className="text-sm text-[#1a1a2e]/60 mb-4">{text.supportsInstruction}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {supports.map((s) => (
          <OptionCard key={s.id} item={s} selected={state.supports.includes(s.id)} onClick={() => toggle('supports', s.id)} />
        ))}
        <OptionCard item={text.supportOther} selected={state.supports.includes('other')} onClick={() => toggle('supports', 'other')} dashed />
      </div>
      {showOther && (
        <div className="mt-4 animate-in fade-in">
          <label className="block text-sm text-[#1a1a2e]/65 mb-1.5">{text.supportOtherLabel}</label>
          <input
            className="w-full rounded-xl border-2 border-[#ede9f8] px-3.5 py-3 text-[15px] focus:outline-none focus:border-[#1A1A6E]"
            value={state.supportCustom}
            onChange={(e) => updateCustom('supportCustom', e.target.value)}
            placeholder={text.supportOtherPlaceholder}
          />
        </div>
      )}
      <Button onClick={onNext} className="w-full h-14 rounded-full text-white font-semibold text-base mt-6" style={{ background: 'linear-gradient(135deg, #4FC3E8, #6BB6E8)' }}>
        {text.next}
      </Button>
    </div>
  );
}