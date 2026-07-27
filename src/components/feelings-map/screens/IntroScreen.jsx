import React from 'react';
import { Button } from '@/components/ui/button';

export default function IntroScreen({ text, onStart }) {
  return (
    <div>
      <div className="rounded-3xl p-9 px-7 text-center shadow-lg" style={{ background: 'linear-gradient(135deg, #F5CFC3 0%, #FFD6EC 40%, #DADCF8 75%, #B8EBF7 100%)' }}>
        <p className="text-sm font-semibold mb-1.5" style={{ color: '#1A1A6E' }}>{text.eyebrow}</p>
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#1A1A6E' }}>{text.introTitle}</h1>
        <p className="text-base text-[#1a1a2e]/85">{text.introBody}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-[#ede9f8] p-5 mt-4">
        <ul className="space-y-0">
          {text.tips.map((tip, i) => (
            <li key={i} className={`flex items-start gap-2.5 text-[15px] text-[#1a1a2e]/90 py-2.5 ${i > 0 ? 'border-t border-[#2D2F33]/[0.08]' : ''}`}>
              <span className="flex-none w-1.5 h-1.5 rounded-full mt-2" style={{ background: '#1A1A6E' }} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <Button onClick={onStart} className="w-full h-14 rounded-full text-white font-semibold text-base shadow-lg" style={{ background: '#1A1A6E' }}>
          {text.startBtn}
        </Button>
      </div>
    </div>
  );
}