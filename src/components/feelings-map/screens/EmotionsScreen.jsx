import React from 'react';
import { Button } from '@/components/ui/button';
import OptionCard from '../OptionCard';
import BackLink from '../BackLink';

export default function EmotionsScreen({ text, isEn, emotions, state, toggle, updateCustom, onBack, onNext }) {
  const showOther = state.emotions.includes('other');
  const hasSelection = state.emotions.length > 0;
  return (
    <div>
      <BackLink label={text.back} isEn={isEn} onClick={onBack} />
      <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A6E' }}>{text.emotionsTitle}</h2>
      <p className="text-sm text-[#1a1a2e]/60 mb-4">{text.emotionsInstruction}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {emotions.map((e) => (
          <OptionCard key={e.id} item={e} selected={state.emotions.includes(e.id)} onClick={() => toggle('emotions', e.id)} />
        ))}
        <OptionCard item={text.emotionOther} selected={state.emotions.includes('other')} onClick={() => toggle('emotions', 'other')} dashed />
      </div>
      {showOther && (
        <div className="mt-4 animate-in fade-in">
          <label className="block text-sm text-[#1a1a2e]/65 mb-1.5">{text.emotionOtherLabel}</label>
          <input
            className="w-full rounded-xl border-2 border-[#ede9f8] px-3.5 py-3 text-[15px] focus:outline-none focus:border-[#1A1A6E]"
            value={state.emotionCustom}
            onChange={(e) => updateCustom('emotionCustom', e.target.value)}
            placeholder={text.emotionOtherPlaceholder}
          />
        </div>
      )}
      <div className="rounded-2xl px-4 py-3.5 text-sm mt-4 border" style={{ background: '#FFF8EC', borderColor: '#F5C842', color: '#7A5000' }}>
        {text.emotionsNote}
      </div>
      <Button onClick={onNext} disabled={!hasSelection} className="w-full h-14 rounded-full text-white font-semibold text-base mt-6" style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)' }}>
        {text.next}
      </Button>
    </div>
  );
}