import SaveToSpace from '../shared/SaveToSpace';
import React, { useState } from 'react';
import { Plus, Printer, RotateCcw } from 'lucide-react';
import { ACTIONS, CUSTOM_EMOJI, PHRASES, UI } from './breakCardContent';

const STYLE = `
  .bc *{box-sizing:border-box}

  /* ---- the card itself ---- */
  .bc-card{
    position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
    width:100%;max-width:400px;margin:0 auto;
    padding:30px 24px;text-align:center;
    background:#fff;border-radius:22px;
    border:3px solid var(--bc-accent,#FF6FB5);
    box-shadow:0 8px 30px rgba(26,26,110,.12);
    break-inside:avoid;
  }
  .bc-card::before{
    content:'';position:absolute;inset:9px;
    border:1.5px dashed var(--bc-accent,#FF6FB5);border-radius:14px;opacity:.4;pointer-events:none;
  }
  .bc-card-emoji{font-size:64px;line-height:1}
  .bc-card-text{font-size:27px;font-weight:800;color:#1A1A6E;line-height:1.3;margin:0}

  .bc-card-do{
    width:100%;margin-top:6px;padding-top:14px;
    border-top:1.5px solid rgba(26,26,46,.10);
  }
  .bc-card-do h4{
    font-size:11.5px;font-weight:700;letter-spacing:.03em;
    color:rgba(26,26,46,.42);margin:0 0 8px;
  }
  .bc-card-do ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
  .bc-card-do li{
    display:inline-flex;align-items:center;gap:6px;
    font-size:14.5px;font-weight:600;color:#334155;
    background:#F7F7FC;border-radius:999px;padding:6px 13px;
  }

  /* Second copy: print only */
  .bc-copy2{display:none}

  .bc-hint{text-align:center;font-size:13.5px;color:rgba(26,26,46,.45);margin-top:14px}

  /* ---- pickers ---- */
  .bc-step{text-align:center;font-size:17px;font-weight:700;color:#334155;margin:0 0 14px}

  .bc-phrases{display:grid;grid-template-columns:1fr;gap:10px;max-width:440px;margin:0 auto}
  @media (min-width:520px){.bc-phrases{grid-template-columns:1fr 1fr}}
  .bc-phrase{
    display:flex;align-items:center;gap:12px;
    padding:15px 16px;text-align:start;
    background:#fff;border:2px solid #EDE9F8;border-radius:16px;
    font-family:inherit;cursor:pointer;transition:.15s;min-height:64px;
  }
  .bc-phrase:hover{transform:translateY(-2px)}
  .bc-phrase[aria-pressed="true"]{box-shadow:0 6px 20px rgba(26,26,110,.12)}
  .bc-phrase:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .bc-phrase-emoji{font-size:28px;line-height:1;flex:0 0 auto}
  .bc-phrase-text{font-size:16px;font-weight:700;color:#1A1A6E;line-height:1.3}

  .bc-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}
  .bc-tile{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    min-height:86px;padding:10px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .bc-tile:hover{border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .bc-tile[aria-pressed="true"]{border-color:#FF6FB5;background:#FFD6EC}
  .bc-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .bc-tile-emoji{font-size:24px;line-height:1}
  .bc-tile-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}

  .bc-custom{
    margin-top:18px;padding:16px 18px;
    background:rgba(255,255,255,.72);border:1.5px dashed #FFD6EC;border-radius:16px;
  }
  .bc-custom label{display:block;font-size:14px;font-weight:600;color:#1A1A6E;margin-bottom:8px}
  .bc-custom-row{display:flex;gap:8px}
  .bc-custom input{
    flex:1;min-width:0;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;padding:11px 13px;
    transition:border-color .18s;
  }
  .bc-custom input::placeholder{color:rgba(26,26,46,.34)}
  .bc-custom input:focus{border-color:#FF6FB5;outline:none}
  .bc-custom button{
    display:inline-flex;align-items:center;gap:5px;
    font-family:inherit;font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:11px;padding:0 18px;cursor:pointer;
  }
  .bc-custom button:disabled{opacity:.45;cursor:not-allowed}

  @media (prefers-reduced-motion:reduce){
    .bc-phrase,.bc-phrase:hover,.bc-tile,.bc-tile:hover{transition:none;transform:none}
  }

  @media print{
    .bc-card{box-shadow:none;max-width:none;margin-bottom:22px}
    .bc-copy2{display:flex}
  }
`;

function Card({ phrase, text, actions, copy }) {
  return (
    <div className="bc-card" style={{ '--bc-accent': phrase.color }}>
      <span className="bc-card-emoji">{phrase.emoji}</span>
      <p className="bc-card-text">{text}</p>

      {actions.length > 0 && (
        <div className="bc-card-do">
          <h4>{copy.breakIs}</h4>
          <ul>
            {actions.map((action) => (
              <li key={action.key}>
                <span>{action.emoji}</span>
                {action.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function BreakCard({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [actions, setActions] = useState([]);
  const [custom, setCustom] = useState('');

  const label = (item) => (typeof item[lang] === 'string' ? item[lang] : item.he);

  const toggle = (action) => {
    setActions((prev) =>
      prev.some((a) => a.key === action.id)
        ? prev.filter((a) => a.key !== action.id)
        : [...prev, { key: action.id, emoji: action.emoji, label: label(action) }]
    );
  };

  const addCustom = () => {
    const text = custom.trim();
    if (!text) return;
    setActions((prev) => [...prev, { key: `custom-${prev.length}`, emoji: CUSTOM_EMOJI, label: text }]);
    setCustom('');
  };

  const restart = () => {
    setPhrase(PHRASES[0]);
    setActions([]);
    setCustom('');
  };

  const cardText = label(phrase);

  return (
    <div className="bc">
      <style>{STYLE}</style>

      <Card phrase={phrase} text={cardText} actions={actions} copy={copy} />
      {/* Printed sheet carries two identical cards: one to keep, one to hand over */}
      <div className="bc-copy2">
        <Card phrase={phrase} text={cardText} actions={actions} copy={copy} />
      </div>

      <p className="bc-hint site-chrome">{copy.printHint}</p>

      <div className="site-chrome flex flex-wrap gap-3 justify-center mt-6">
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
        <SaveToSpace
          slug="break-card"
          lang={lang}
          getEntry={() => (actions.length > 0 ? {
            summary: `${actions.length} ${lang === 'he' ? 'דרכים שעוזרות' : 'things that help'}`,
            payload: { phrase, actions },
          } : null)}
        />
      </div>

      <div className="site-chrome">
        <h2 className="bc-step mt-12">{copy.step1}</h2>
        <div className="bc-phrases">
          {PHRASES.map((item) => {
            const on = item.id === phrase.id;
            return (
              <button
                key={item.id}
                type="button"
                className="bc-phrase"
                aria-pressed={on}
                onClick={() => setPhrase(item)}
                style={on ? { borderColor: item.color, background: '#FFF8FB' } : undefined}
              >
                <span className="bc-phrase-emoji">{item.emoji}</span>
                <span className="bc-phrase-text">{label(item)}</span>
              </button>
            );
          })}
        </div>

        <h2 className="bc-step mt-10">{copy.step2}</h2>
        <div className="bc-tiles">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className="bc-tile"
              aria-pressed={actions.some((a) => a.key === action.id)}
              onClick={() => toggle(action)}
            >
              <span className="bc-tile-emoji">{action.emoji}</span>
              <span className="bc-tile-text">{label(action)}</span>
            </button>
          ))}
        </div>

        <div className="bc-custom">
          <label htmlFor="bc-custom-input">
            {CUSTOM_EMOJI} {copy.customLabel}
          </label>
          <div className="bc-custom-row">
            <input
              id="bc-custom-input"
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustom();
                }
              }}
              placeholder={copy.customPlaceholder}
            />
            <button type="button" onClick={addCustom} disabled={!custom.trim()}>
              <Plus className="w-4 h-4" />
              {copy.customAdd}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
