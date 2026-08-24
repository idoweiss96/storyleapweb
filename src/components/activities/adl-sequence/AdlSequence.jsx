import React, { useState } from 'react';
import { Printer, RotateCcw } from 'lucide-react';
import { CARD_STYLES } from '../shared/cardStyles';
import { PickerCard } from '../shared/ActivityCards';
import { SEQUENCES, UI } from './adlSequenceContent';

const STYLE = `
  .adl *{box-sizing:border-box}

  .adl-title{
    text-align:center;font-size:24px;font-weight:800;color:#1A1A6E;
    margin:0 0 20px;line-height:1.35;
  }
  .adl-title span{font-size:30px;margin-inline-end:8px}

  .adl-steps{display:flex;flex-direction:column;gap:10px}

  .adl-step{
    display:flex;align-items:center;gap:14px;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:16px;
    padding:14px 16px;box-shadow:0 2px 10px rgba(26,26,110,.06);
    break-inside:avoid;
  }
  .adl-num{
    flex:0 0 32px;height:32px;border-radius:999px;
    background:#FFF0F7;color:#1A1A6E;
    display:grid;place-items:center;font-size:14px;font-weight:800;
  }
  .adl-emoji{font-size:34px;line-height:1;flex:0 0 auto}
  .adl-text{flex:1;min-width:0;font-size:17px;font-weight:600;color:#334155;line-height:1.35}

  .adl-hint{text-align:center;font-size:13.5px;color:rgba(26,26,46,.45);margin-top:14px}

  @media print{
    .adl-step{box-shadow:none;padding:16px}
    .adl-title{font-size:28px}
    .adl-steps{gap:8px}
  }
`;

export default function AdlSequence({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const [sequence, setSequence] = useState(null);

  const pick = (item) => item[lang] || item.he;

  if (!sequence) {
    return (
      <div className="ac-deck adl">
        <style>{CARD_STYLES + STYLE}</style>
        <h2 className="text-center text-lg font-bold text-slate-700 mb-5">{copy.pickTitle}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {SEQUENCES.map((item) => (
            <PickerCard
              key={item.id}
              emoji={item.emoji}
              label={pick(item).label}
              selected={false}
              onClick={() => setSequence(item)}
            />
          ))}
        </div>
      </div>
    );
  }

  const text = pick(sequence);

  return (
    <div className="adl">
      <style>{STYLE}</style>

      <h2 className="adl-title">
        <span>{sequence.emoji}</span>
        {text.label}
      </h2>

      <ol className="adl-steps">
        {text.steps.map((step, index) => (
          <li key={`${step.emoji}-${step.text}`} className="adl-step">
            <span className="adl-num">{index + 1}</span>
            <span className="adl-emoji">{step.emoji}</span>
            <span className="adl-text">{step.text}</span>
          </li>
        ))}
      </ol>

      <p className="adl-hint site-chrome">{copy.printHint}</p>

      <div className="site-chrome flex flex-wrap gap-3 justify-center mt-6">
        <button
          type="button"
          onClick={() => setSequence(null)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {copy.changeSequence}
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
