import React, { useState } from 'react';
import { Check, Printer, RotateCcw } from 'lucide-react';
import { STRENGTHS, UI } from './strengthCardsContent';

const STYLE = `
  .sc-deck *{box-sizing:border-box}

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

  /* Chosen cards laid out as a hand, each tilted a little */
  .sc-hand{display:flex;flex-wrap:wrap;justify-content:center;gap:14px}
  .sc-hand .sc-hand-slot{width:104px}
  .sc-hand .sc-card{cursor:default}
  .sc-hand .sc-card:hover{transform:none;box-shadow:0 3px 12px rgba(26,26,110,.08), 0 1px 3px rgba(26,26,110,.04)}
  .sc-hand .sc-hand-slot:nth-child(4n+1) .sc-card{transform:rotate(-3deg)}
  .sc-hand .sc-hand-slot:nth-child(4n+2) .sc-card{transform:rotate(2deg)}
  .sc-hand .sc-hand-slot:nth-child(4n+3) .sc-card{transform:rotate(-1.5deg)}
  .sc-hand .sc-hand-slot:nth-child(4n+4) .sc-card{transform:rotate(3deg)}

  @media (prefers-reduced-motion:reduce){
    .sc-card,.sc-card:hover,.sc-card:active{transition:none;transform:none}
    .sc-hand .sc-card{transform:none}
  }

  @media print{
    .sc-card{box-shadow:none;break-inside:avoid}
    .sc-hand .sc-card{transform:none}
  }
`;

function countLabel(copy, n) {
  if (n === 0) return copy.selectedNone;
  if (n === 1) return copy.selectedOne;
  return copy.selectedMany.replace('{n}', n);
}

function CardFace({ strength, label, selected, onClick, interactive }) {
  const Tag = interactive ? 'button' : 'div';
  return (
    <Tag
      className="sc-card"
      {...(interactive
        ? { type: 'button', onClick, 'aria-pressed': selected }
        : { 'aria-pressed': selected || undefined })}
    >
      <span className="sc-pip sc-pip-a" aria-hidden="true">✦</span>
      <span className="sc-pip sc-pip-b" aria-hidden="true">✦</span>
      {selected && interactive && (
        <span className="sc-check" aria-hidden="true">
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </span>
      )}
      <span className="sc-emoji">{strength.emoji}</span>
      <span className="sc-label">{label}</span>
    </Tag>
  );
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
      <div className="sc-deck">
        <style>{STYLE}</style>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#1A1A6E' }}>
            {copy.myStrengths}
          </h2>
          <p className="text-center text-slate-500 mb-8">{copy.revealIntro}</p>

          <div className="sc-hand mb-8">
            {chosen.map((strength) => (
              <div key={strength.id} className="sc-hand-slot">
                <CardFace
                  strength={strength}
                  label={(strength[lang] || strength.he).label}
                  interactive={false}
                />
              </div>
            ))}
          </div>

          <ul className="flex flex-col gap-4">
            {chosen.map((strength) => {
              const text = strength[lang] || strength.he;
              return (
                <li
                  key={strength.id}
                  className="flex gap-4 items-start rounded-xl p-4"
                  style={{ background: '#FFF0F7' }}
                >
                  <span className="text-2xl leading-none shrink-0">{strength.emoji}</span>
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
    <div className="sc-deck">
      <style>{STYLE}</style>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {STRENGTHS.map((strength) => (
          <CardFace
            key={strength.id}
            strength={strength}
            label={(strength[lang] || strength.he).label}
            selected={selected.includes(strength.id)}
            onClick={() => toggle(strength.id)}
            interactive
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
