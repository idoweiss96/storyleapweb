import React from 'react';

const TIP_EMOJIS = ['💬', '💗', '👂', '🤍'];

export default function IntroScreen({ text, onStart }) {
  return (
    <div>
      <div
        className="bg-white rounded-[24px] p-6 shadow-xl"
        style={{ boxShadow: '0 10px 40px rgba(255,111,181,0.15), 0 4px 20px rgba(79,195,232,0.1)' }}
      >
        <div className="flex justify-center mb-4">
          <span
            className="px-4 py-1.5 rounded-[20px] text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
          >
            {text.eyebrow}
          </span>
        </div>
        <h1 className="text-xl font-bold text-center mb-2" style={{ color: '#1A1A6E' }}>{text.introTitle}</h1>
        <p className="text-[13px] text-center leading-relaxed" style={{ color: '#1a1a2e', opacity: 0.85 }}>
          {text.introBody}
        </p>
      </div>

      <div className="mt-4 rounded-2xl p-4 border" style={{ background: '#FFF8EC', borderColor: '#F5C842' }}>
        <ul className="space-y-1.5">
          {text.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px]" style={{ color: '#7A5000' }}>
              <span>{TIP_EMOJIS[i] || '💡'}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)' }}
        >
          {text.startBtn}
        </button>
      </div>
    </div>
  );
}