import React, { useState } from 'react';
import { Check, Printer, RotateCcw } from 'lucide-react';
import { STRENGTHS, UI } from './strengthCardsContent';

function countLabel(copy, n) {
  if (n === 0) return copy.selectedNone;
  if (n === 1) return copy.selectedOne;
  return copy.selectedMany.replace('{n}', n);
}

export default function StrengthCards({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const restart = () => {
    setSelected([]);
    setRevealed(false);
  };

  // Keep the deck order rather than the tap order, so the result reads consistently.
  const chosen = STRENGTHS.filter((s) => selected.includes(s.id));

  if (revealed) {
    return (
      <div>
        <div className="rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#1A1A6E' }}>
            {copy.myStrengths}
          </h2>
          <p className="text-center text-slate-500 mb-7">{copy.revealIntro}</p>

          <ul className="flex flex-col gap-4">
            {chosen.map((strength) => {
              const text = strength[lang] || strength.he;
              return (
                <li
                  key={strength.id}
                  className="flex gap-4 items-start rounded-xl p-4"
                  style={{ background: '#FFF0F7' }}
                >
                  <span className="text-3xl leading-none shrink-0">{strength.emoji}</span>
                  <div>
                    <p className="font-bold text-slate-800">{text.label}</p>
                    <p className="text-slate-600 mt-1">{text.prompt}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="site-chrome flex flex-wrap gap-3 justify-center mt-7">
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {copy.restart}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg active:scale-[.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
          >
            <Printer className="w-4 h-4" />
            {copy.print}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {STRENGTHS.map((strength) => {
          const text = strength[lang] || strength.he;
          const isOn = selected.includes(strength.id);
          return (
            <button
              key={strength.id}
              type="button"
              onClick={() => toggle(strength.id)}
              aria-pressed={isOn}
              className="relative flex flex-col items-center text-center gap-2 rounded-2xl p-4 min-h-[124px] justify-center transition-all active:scale-[.98]"
              style={{
                background: isOn ? '#FFD6EC' : '#fff',
                border: `1.5px solid ${isOn ? '#FF6FB5' : '#EDE9F8'}`,
                boxShadow: isOn ? '0 4px 20px rgba(255,111,181,.18)' : '0 2px 10px rgba(79,195,232,.06)',
              }}
            >
              {isOn && (
                <span
                  className="absolute top-2 flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ background: '#1A1A6E', insetInlineEnd: '0.5rem' }}
                >
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
              <span className="text-3xl leading-none">{strength.emoji}</span>
              <span className="text-sm font-medium text-slate-700 leading-snug">{text.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4 mt-8">
        <p aria-live="polite" className="text-sm text-slate-500">
          {countLabel(copy, selected.length)}
        </p>
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={selected.length === 0}
          className="px-8 py-3.5 rounded-full text-white text-base font-semibold shadow-lg transition-transform disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]"
          style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
        >
          {copy.reveal}
        </button>
      </div>
    </div>
  );
}
