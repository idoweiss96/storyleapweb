import React from 'react';
import { Button } from '@/components/ui/button';
import OptionCard from '../OptionCard';
import BackLink from '../BackLink';

export default function BodyScreen({ text, isEn, body, state, toggle, onBack, onNext }) {
  const hasSelection = state.bodyFeelings.length > 0;
  return (
    <div>
      <BackLink label={text.back} isEn={isEn} onClick={onBack} />
      <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A6E' }}>{text.bodyTitle}</h2>
      <p className="text-sm text-[#1a1a2e]/60 mb-4">{text.bodyInstruction}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {body.map((b) => (
          <OptionCard key={b.id} item={b} selected={state.bodyFeelings.includes(b.id)} onClick={() => toggle('bodyFeelings', b.id)} />
        ))}
      </div>
      <Button onClick={onNext} className="w-full h-14 rounded-full text-white font-semibold text-base mt-6" style={{ background: 'linear-gradient(135deg, #4FC3E8, #6BB6E8)' }}>
        {hasSelection ? text.next : text.bodySkip}
      </Button>
    </div>
  );
}