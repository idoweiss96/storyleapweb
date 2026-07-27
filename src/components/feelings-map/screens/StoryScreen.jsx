import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import OptionCard from '../OptionCard';
import BackLink from '../BackLink';

export default function StoryScreen({ text, isEn, storyCards, state, toggle, updateCustom, onBack, onNext }) {
  return (
    <div>
      <BackLink label={text.back} isEn={isEn} onClick={onBack} />
      <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A6E' }}>{text.storyTitle}</h2>
      <p className="text-sm text-[#1a1a2e]/60 mb-4">{text.storyInstruction}</p>
      <div className="grid grid-cols-1 gap-3">
        {storyCards.map((c) => (
          <OptionCard key={c.id} item={c} selected={state.storyCards.includes(c.id)} onClick={() => toggle('storyCards', c.id)} singleCol />
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm text-[#1a1a2e]/65 mb-1.5">{text.storyTextLabel}</label>
        <Textarea
          rows={3}
          value={state.storyText}
          onChange={(e) => updateCustom('storyText', e.target.value)}
          className="rounded-xl border-2 border-[#ede9f8] focus-visible:ring-0 focus-visible:border-[#1A1A6E]"
        />
      </div>
      <Button onClick={onNext} className="w-full h-14 rounded-full text-white font-semibold text-base mt-6" style={{ background: '#1A1A6E' }}>
        {text.next}
      </Button>
    </div>
  );
}