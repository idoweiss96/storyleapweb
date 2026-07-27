import React from 'react';
import { Button } from '@/components/ui/button';
import BackLink from '../BackLink';

export default function ActionScreen({ text, isEn, actions, state, selectSingle, onBack, onNext }) {
  const canContinue = !!state.actionChoice;
  return (
    <div>
      <BackLink label={text.back} isEn={isEn} onClick={onBack} />
      <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A6E' }}>{text.actionTitle}</h2>
      <p className="text-sm text-[#1a1a2e]/60 mb-4">{text.actionInstruction}</p>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((a) => {
          const selected = state.actionChoice === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => selectSingle('actionChoice', a.id)}
              className={`flex items-center gap-2.5 rounded-2xl border-2 px-4 py-3.5 text-[15px] shadow-sm transition-all hover:-translate-y-0.5 text-start ${
                selected ? 'bg-[#FFD6EC] border-[#1A1A6E]' : 'bg-white border-[#ede9f8]'
              }`}
            >
              <span className="text-xl leading-none flex-none">{a.emoji}</span>
              <span className="flex-1 text-[#1a1a2e]">{a.label}</span>
            </button>
          );
        })}
      </div>
      <Button onClick={onNext} disabled={!canContinue} className="w-full h-14 rounded-full text-white font-semibold text-base mt-6" style={{ background: '#1A1A6E' }}>
        {text.actionNext}
      </Button>
    </div>
  );
}