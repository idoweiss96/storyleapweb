import React, { useState } from 'react';
import { Check, Printer } from 'lucide-react';
import { EMOTIONS, UI } from './emotionCardsContent';

const STYLE = `
  .ec *{box-sizing:border-box}

  /* ---- deck builder (screen only) ---- */
  .ec-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:9px}
  .ec-tile{
    position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;
    min-height:96px;padding:12px 8px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:15px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .ec-tile:hover{transform:translateY(-2px)}
  .ec-tile[aria-pressed="true"]{border-width:2.5px}
  .ec-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .ec-tile-emoji{font-size:28px;line-height:1}
  .ec-tile-text{font-size:12.5px;font-weight:600;color:#475569;line-height:1.3}
  .ec-tick{
    position:absolute;top:6px;inset-inline-end:6px;
    display:grid;place-items:center;width:20px;height:20px;border-radius:999px;
    background:#1A1A6E;
  }

  /* ---- the printable deck ---- */
  .ec-sheet{display:none}

  .ec-card{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
    aspect-ratio:5/7;padding:14px 10px;text-align:center;
    border:2px dashed #9a9ab0;border-radius:10px;
    break-inside:avoid;
  }
  .ec-card-emoji{font-size:46px;line-height:1}
  .ec-card-text{font-size:15px;font-weight:700;color:#1a1a2e;line-height:1.3}
  .ec-card-bar{width:44%;height:5px;border-radius:999px}

  .ec-hint{text-align:center;font-size:13.5px;color:rgba(26,26,46,.45);margin-top:14px}

  .ec-uses{
    margin-top:32px;padding:20px 22px;
    background:rgba(255,255,255,.72);border:1.5px solid #EDE9F8;border-radius:18px;
  }
  .ec-uses h3{font-size:16px;font-weight:700;color:#1A1A6E;margin:0 0 12px;text-align:center}
  .ec-uses ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px}
  .ec-uses li{
    display:flex;gap:10px;align-items:flex-start;
    font-size:15px;line-height:1.55;color:#334155;
  }
  .ec-uses li::before{content:'✦';color:#FF6FB5;flex:0 0 auto;font-size:12px;margin-top:4px}

  @media (prefers-reduced-motion:reduce){
    .ec-tile,.ec-tile:hover{transition:none;transform:none}
  }

  @media print{
    .ec-sheet{
      display:grid;grid-template-columns:repeat(3,1fr);gap:10px;
    }
  }
`;

function countLabel(copy, n) {
  if (n === 0) return copy.countNone;
  if (n === 1) return copy.countOne;
  return copy.countMany.replace('{n}', n);
}

export default function EmotionCards({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const [selected, setSelected] = useState([]);

  const label = (item) => (typeof item[lang] === 'string' ? item[lang] : item.he);

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Keep library order so the printed sheet is stable regardless of tap order.
  const deck = EMOTIONS.filter((e) => selected.includes(e.id));

  return (
    <div className="ec">
      <style>{STYLE}</style>

      {/* The printed sheet: hidden on screen, this is the actual deliverable */}
      <div className="ec-sheet">
        {deck.map((emotion) => (
          <div key={emotion.id} className="ec-card">
            <span className="ec-card-emoji">{emotion.emoji}</span>
            <span className="ec-card-text">{label(emotion)}</span>
            <span className="ec-card-bar" style={{ background: emotion.color }} />
          </div>
        ))}
      </div>

      <div className="site-chrome">
        <h2 className="text-center text-lg font-bold text-slate-700 mb-1">{copy.pickTitle}</h2>
        <p aria-live="polite" className="text-center text-sm text-slate-400 mb-4">
          {countLabel(copy, selected.length)}
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-5">
          <button
            type="button"
            onClick={() => setSelected(EMOTIONS.map((e) => e.id))}
            className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {copy.selectAll}
          </button>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {copy.selectNone}
          </button>
        </div>

        <div className="ec-tiles">
          {EMOTIONS.map((emotion) => {
            const on = selected.includes(emotion.id);
            return (
              <button
                key={emotion.id}
                type="button"
                className="ec-tile"
                aria-pressed={on}
                onClick={() => toggle(emotion.id)}
                style={on ? { borderColor: emotion.color, background: `${emotion.color}22` } : undefined}
              >
                {on && (
                  <span className="ec-tick" aria-hidden="true">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
                <span className="ec-tile-emoji">{emotion.emoji}</span>
                <span className="ec-tile-text">{label(emotion)}</span>
              </button>
            );
          })}
        </div>

        {deck.length > 0 && (
          <>
            <div className="flex justify-center mt-8">
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
            <p className="ec-hint">{copy.printHint}</p>
          </>
        )}

        <div className="ec-uses">
          <h3>{copy.usesTitle}</h3>
          <ul>
            {copy.uses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
