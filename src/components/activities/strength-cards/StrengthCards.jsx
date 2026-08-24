import React, { useState } from 'react';
import { Check, Printer, RotateCcw } from 'lucide-react';
import { STRENGTHS, UI } from './strengthCardsContent';

const STYLE = `
  .sc-deck *{box-sizing:border-box}

  /* ---- Picker card: the deck the child chooses from ---- */
  .sc-card{
    position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
    width:100%;aspect-ratio:5/7;padding:14px 10px;
    background:linear-gradient(160deg,#ffffff 0%,#FFFCF8 100%);
    border:1.5px solid #EDE9F8;border-radius:16px;
    box-shadow:0 3px 12px rgba(26,26,110,.08), 0 1px 3px rgba(26,26,110,.04);
    cursor:pointer;text-align:center;
    transition:transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s, border-color .18s, background .18s;
  }
  /* Inner frame, the way a printed card has a border inside its edge */
  .sc-card::before{
    content:'';position:absolute;inset:7px;
    border:1px solid rgba(26,26,110,.10);border-radius:10px;pointer-events:none;
    transition:border-color .18s;
  }
  .sc-card:hover{transform:translateY(-5px) rotate(-1deg);box-shadow:0 10px 26px rgba(26,26,110,.14)}
  .sc-card:active{transform:translateY(-2px) scale(.99)}
  .sc-card:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:3px}

  .sc-card[aria-pressed="true"]{
    background:linear-gradient(160deg,#FFF0F7 0%,#FFD6EC 100%);
    border-color:#FF6FB5;
    transform:translateY(-6px);
    box-shadow:0 12px 28px rgba(255,111,181,.28);
  }
  .sc-card[aria-pressed="true"]::before{border-color:rgba(255,111,181,.45)}
  .sc-card[aria-pressed="true"]:hover{transform:translateY(-9px) rotate(-1deg)}

  .sc-emoji{font-size:34px;line-height:1}
  .sc-label{font-size:12.5px;font-weight:600;color:#3f3f56;line-height:1.35}

  /* Corner pips, mirrored like the indices on a playing card */
  .sc-pip{position:absolute;font-size:9px;color:rgba(26,26,110,.28);line-height:1}
  .sc-pip-a{top:11px;inset-inline-start:12px}
  .sc-pip-b{bottom:11px;inset-inline-end:12px;transform:rotate(180deg)}
  .sc-card[aria-pressed="true"] .sc-pip{color:rgba(255,111,181,.75)}

  .sc-check{
    position:absolute;top:-9px;inset-inline-end:-9px;
    width:26px;height:26px;border-radius:999px;background:#1A1A6E;
    display:grid;place-items:center;border:2.5px solid #fff;
    box-shadow:0 2px 8px rgba(26,26,110,.3);
  }

  /* ---- Result card: same card language, but it carries the question and the answer ---- */
  .sc-result-grid{display:grid;grid-template-columns:1fr;gap:16px}
  @media (min-width:560px){.sc-result-grid{grid-template-columns:1fr 1fr}}

  .sc-bigcard{
    position:relative;display:flex;flex-direction:column;
    padding:22px 18px 18px;min-height:250px;
    background:linear-gradient(160deg,#ffffff 0%,#FFF8FB 100%);
    border:1.5px solid #FF6FB5;border-radius:16px;
    box-shadow:0 4px 18px rgba(255,111,181,.16);
    break-inside:avoid;
  }
  .sc-bigcard::before{
    content:'';position:absolute;inset:7px;
    border:1px solid rgba(255,111,181,.32);border-radius:10px;pointer-events:none;
  }
  .sc-bigcard .sc-pip{color:rgba(255,111,181,.6)}

  .sc-bighead{display:flex;flex-direction:column;align-items:center;text-align:center;gap:7px}
  .sc-bigemoji{font-size:36px;line-height:1}
  .sc-biglabel{font-size:15px;font-weight:700;color:#1A1A6E;line-height:1.35}

  .sc-rule{
    height:1px;margin:14px 6px 12px;
    background:linear-gradient(90deg,transparent,rgba(255,111,181,.38),transparent);
  }

  .sc-bigq{
    font-size:13.5px;line-height:1.55;text-align:center;
    color:rgba(26,26,46,.62);margin:0 0 12px;
  }

  /* Answer field. On screen a textarea; in print it becomes plain text,
     or ruled lines when nothing was typed, so the card can be filled by hand. */
  .sc-answer{
    width:100%;margin-top:auto;
    font-family:inherit;font-size:14.5px;color:#1a1a2e;line-height:1.55;
    background:rgba(255,255,255,.75);border:1.5px solid #FFD6EC;border-radius:11px;
    padding:10px 12px;resize:vertical;min-height:66px;
    transition:border-color .18s;
  }
  .sc-answer::placeholder{color:rgba(26,26,46,.34)}
  .sc-answer:focus{border-color:#FF6FB5;outline:none;background:#fff}
  .sc-answer-print,.sc-answer-blank{display:none}

  @media (prefers-reduced-motion:reduce){
    .sc-card,.sc-card:hover,.sc-card:active{transition:none;transform:none}
  }

  @media print{
    .sc-card{box-shadow:none}
    .sc-result-grid{grid-template-columns:1fr 1fr;gap:14px}
    .sc-bigcard{box-shadow:none;min-height:0;padding:18px 16px 16px}
    .sc-answer{display:none}
    .sc-answer-print{
      display:block;margin-top:6px;font-size:14px;color:#1a1a2e;line-height:1.6;
      white-space:pre-wrap;overflow-wrap:anywhere;
    }
    .sc-answer-blank{display:block;margin-top:8px}
    .sc-answer-blank i{display:block;border-bottom:1px dashed #d8a9c4;height:21px}
  }
`;

function countLabel(copy, n) {
  if (n === 0) return copy.selectedNone;
  if (n === 1) return copy.selectedOne;
  return copy.selectedMany.replace('{n}', n);
}

function Pips() {
  return (
    <>
      <span className="sc-pip sc-pip-a" aria-hidden="true">✦</span>
      <span className="sc-pip sc-pip-b" aria-hidden="true">✦</span>
    </>
  );
}

function PickerCard({ strength, label, selected, onClick }) {
  return (
    <button type="button" className="sc-card" aria-pressed={selected} onClick={onClick}>
      <Pips />
      {selected && (
        <span className="sc-check" aria-hidden="true">
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </span>
      )}
      <span className="sc-emoji">{strength.emoji}</span>
      <span className="sc-label">{label}</span>
    </button>
  );
}

function ResultCard({ strength, text, value, onChange, placeholder }) {
  const written = (value || '').trim();
  return (
    <div className="sc-bigcard">
      <Pips />

      <div className="sc-bighead">
        <span className="sc-bigemoji">{strength.emoji}</span>
        <p className="sc-biglabel">{text.label}</p>
      </div>

      <div className="sc-rule" />

      <p className="sc-bigq">{text.prompt}</p>

      <textarea
        className="sc-answer"
        rows={3}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={text.prompt}
      />

      {written ? (
        <p className="sc-answer-print">{written}</p>
      ) : (
        <span className="sc-answer-blank" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </div>
  );
}

export default function StrengthCards({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState({});

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const restart = () => {
    setSelected([]);
    setAnswers({});
    setRevealed(false);
  };

  // Keep the deck order rather than the tap order, so the result reads consistently.
  const chosen = STRENGTHS.filter((s) => selected.includes(s.id));

  if (revealed) {
    return (
      <div className="sc-deck">
        <style>{STYLE}</style>

        <div className="text-center mb-7">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A6E' }}>
            {copy.myStrengths}
          </h2>
          <p className="text-slate-500">{copy.revealIntro}</p>
        </div>

        <div className="sc-result-grid">
          {chosen.map((strength) => (
            <ResultCard
              key={strength.id}
              strength={strength}
              text={strength[lang] || strength.he}
              value={answers[strength.id]}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [strength.id]: value }))}
              placeholder={copy.answerPlaceholder}
            />
          ))}
        </div>

        <div className="site-chrome flex flex-wrap gap-3 justify-center mt-8">
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
    <div className="sc-deck">
      <style>{STYLE}</style>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {STRENGTHS.map((strength) => (
          <PickerCard
            key={strength.id}
            strength={strength}
            label={(strength[lang] || strength.he).label}
            selected={selected.includes(strength.id)}
            onClick={() => toggle(strength.id)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 mt-9">
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
