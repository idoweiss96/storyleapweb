import SaveToSpace from '../shared/SaveToSpace';
import React, { useRef, useState } from 'react';
import { Plus, Printer, RotateCcw, X } from 'lucide-react';
import { CUSTOM_EMOJI, MAX_RULES, MIN_RULES, RULES, UI } from './visualRulesContent';

const STYLE = `
  .vr *{box-sizing:border-box}

  .vr-title{
    text-align:center;font-size:25px;font-weight:800;color:#1A1A6E;
    margin:0 0 20px;line-height:1.35;
  }

  .vr-board{display:grid;grid-template-columns:1fr;gap:11px}
  @media (min-width:560px){.vr-board{grid-template-columns:1fr 1fr}}

  .vr-rule{
    position:relative;
    display:flex;align-items:center;gap:14px;
    padding:16px 18px;
    background:linear-gradient(160deg,#fff 0%,#FFF8FB 100%);
    border:2px solid #FF6FB5;border-radius:16px;
    box-shadow:0 4px 16px rgba(255,111,181,.13);
    break-inside:avoid;
  }
  .vr-emoji{font-size:34px;line-height:1;flex:0 0 auto}
  .vr-text{flex:1;min-width:0;font-size:16.5px;font-weight:700;color:#1A1A6E;line-height:1.35}

  .vr-remove{
    position:absolute;top:7px;inset-inline-end:7px;
    display:grid;place-items:center;width:24px;height:24px;border-radius:999px;
    background:#fff;border:1.5px solid #EDE9F8;color:#94a3b8;cursor:pointer;transition:.15s;
  }
  .vr-remove:hover{color:#1A1A6E;border-color:#FF6FB5}
  .vr-remove:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .vr-empty{
    text-align:center;color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;
    background:rgba(255,255,255,.6);border:1.5px dashed #EDE9F8;border-radius:16px;
    padding:26px 20px;
  }

  .vr-limit{
    text-align:center;font-size:13.5px;line-height:1.55;
    color:#7A5000;background:#FFF8EC;border:1.5px solid #F5C842;
    border-radius:12px;padding:10px 14px;margin-top:14px;
  }

  .vr-tiles{display:grid;grid-template-columns:1fr;gap:8px;margin-top:12px}
  @media (min-width:560px){.vr-tiles{grid-template-columns:1fr 1fr}}
  .vr-tile{
    display:flex;align-items:center;gap:11px;text-align:start;
    padding:12px 14px;min-height:58px;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:13px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .vr-tile:hover:not(:disabled){border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .vr-tile:disabled{opacity:.4;cursor:not-allowed}
  .vr-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .vr-tile-emoji{font-size:24px;line-height:1;flex:0 0 auto}
  .vr-tile-text{font-size:14.5px;font-weight:600;color:#475569;line-height:1.35}

  .vr-custom{
    margin-top:20px;padding:16px 18px;
    background:rgba(255,255,255,.72);border:1.5px dashed #FFD6EC;border-radius:16px;
  }
  .vr-custom label{display:block;font-size:14px;font-weight:600;color:#1A1A6E;margin-bottom:4px}
  .vr-custom .hint{font-size:12.5px;color:rgba(26,26,46,.45);margin:0 0 9px}
  .vr-custom-row{display:flex;gap:8px}
  .vr-custom input{
    flex:1;min-width:0;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;padding:11px 13px;
  }
  .vr-custom input:focus{border-color:#FF6FB5;outline:none}
  .vr-custom button{
    display:inline-flex;align-items:center;gap:5px;
    font-family:inherit;font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:11px;padding:0 18px;cursor:pointer;
  }
  .vr-custom button:disabled{opacity:.45;cursor:not-allowed}

  @media (prefers-reduced-motion:reduce){
    .vr-tile,.vr-tile:hover{transition:none;transform:none}
  }

  @media print{
    .vr-rule{box-shadow:none;padding:20px}
    .vr-remove{display:none}
    .vr-board{grid-template-columns:1fr 1fr;gap:14px}
    .vr-title{font-size:29px}
  }
`;

export default function VisualRules({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [board, setBoard] = useState([]);
  const [custom, setCustom] = useState('');
  const uid = useRef(0);

  const label = (rule) => (typeof rule[lang] === 'string' ? rule[lang] : rule.he);
  const full = board.length >= MAX_RULES;

  const add = (emoji, text) => {
    if (full) return;
    uid.current += 1;
    setBoard((prev) => [...prev, { key: `r${uid.current}`, emoji, text }]);
  };

  const addCustom = () => {
    const text = custom.trim();
    if (!text || full) return;
    add(CUSTOM_EMOJI, text);
    setCustom('');
  };

  const remove = (index) => setBoard((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="vr">
      <style>{STYLE}</style>

      {board.length === 0 ? (
        <p className="vr-empty site-chrome">{copy.empty}</p>
      ) : (
        <>
          <p className="vr-title">{copy.boardTitle}</p>
          <div className="vr-board">
            {board.map((rule, index) => (
              <div key={rule.key} className="vr-rule">
                <button
                  type="button"
                  className="vr-remove site-chrome"
                  onClick={() => remove(index)}
                  aria-label={copy.remove}
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="vr-emoji">{rule.emoji}</span>
                <span className="vr-text">{rule.text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {full && <p className="vr-limit site-chrome">{copy.limitReached}</p>}

      {board.length >= MIN_RULES && (
        <div className="site-chrome flex flex-wrap gap-3 justify-center mt-7">
          <button
            type="button"
            onClick={() => setBoard([])}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {copy.clear}
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
            slug="visual-rules"
            lang={lang}
            getEntry={() => (board.length > 0 ? {
              summary: `${board.length} ${lang === 'he' ? 'כללים' : 'rules'}`,
              payload: { board },
            } : null)}
          />
        </div>
      )}

      <div className="site-chrome">
        <h2 className="text-center text-lg font-bold text-slate-700 mt-12 mb-1">
          {copy.libraryTitle}
        </h2>

        <div className="vr-tiles">
          {RULES.map((rule) => (
            <button
              key={rule.id}
              type="button"
              className="vr-tile"
              disabled={full}
              onClick={() => add(rule.emoji, label(rule))}
            >
              <span className="vr-tile-emoji">{rule.emoji}</span>
              <span className="vr-tile-text">{label(rule)}</span>
            </button>
          ))}
        </div>

        <div className="vr-custom">
          <label htmlFor="vr-custom-input">
            {CUSTOM_EMOJI} {copy.customLabel}
          </label>
          <p className="hint">{copy.customHint}</p>
          <div className="vr-custom-row">
            <input
              id="vr-custom-input"
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
              disabled={full}
            />
            <button type="button" onClick={addCustom} disabled={!custom.trim() || full}>
              <Plus className="w-4 h-4" />
              {copy.customAdd}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
