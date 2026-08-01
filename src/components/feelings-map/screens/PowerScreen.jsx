import React from 'react';
import { Button } from '@/components/ui/button';
import BackLink from '../BackLink';

export default function PowerScreen({ text, isEn, powerSentences, state, selectSingle, updateCustom, onBack, onNext }) {
  const canContinue = !!state.powerSentence;
  return (
    <div>
      <BackLink label={text.back} isEn={isEn} onClick={onBack} />
      <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A6E' }}>{text.powerTitle}</h2>
      <p className="text-sm text-[#1a1a2e]/60 mb-4">{text.powerInstruction}</p>
      <div className="grid grid-cols-1 gap-3">
        {powerSentences.map((s) => {
          const selected = state.powerSentence === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => selectSingle('powerSentence', s)}
              className={`text-start rounded-2xl border-2 px-4 py-3.5 text-[15px] shadow-sm transition-all hover:-translate-y-0.5 ${
                selected ? 'bg-[#FFD6EC] border-[#1A1A6E]' : 'bg-white border-[#ede9f8]'
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        <label className="block text-sm text-[#1a1a2e]/65 mb-1.5">{text.powerCustomLabel}</label>
        <input
          className="w-full rounded-xl border-2 border-[#ede9f8] px-3.5 py-3 text-[15px] focus:outline-none focus:border-[#1A1A6E]"
          value={state.powerCustom}
          onChange={(e) => updateCustom('powerCustom', e.target.value)}
          placeholder={text.powerCustomPlaceholder}
        />
      </div>
      <Button onClick={onNext} disabled={!canContinue} className="w-full h-14 rounded-full text-white font-semibold text-base mt-6" style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)' }}>
        {text.next}
      </Button>
    </div>
  );
}