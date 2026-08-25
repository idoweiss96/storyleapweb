import SaveToSpace from '../shared/SaveToSpace';
import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Printer, RotateCcw, X } from 'lucide-react';
import { CUSTOM_EMOJI, PARTS, PART_LABELS, stepLabel, stepsByPart } from '../shared/routineSteps';
import { UI } from './routineBoardContent';

const STYLE = `
  .rb *{box-sizing:border-box}

  /* ---- the board being built ---- */
  .rb-board{display:flex;flex-direction:column;gap:10px}

  .rb-item{
    display:flex;align-items:center;gap:14px;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:16px;
    padding:12px 14px;
    box-shadow:0 2px 10px rgba(26,26,110,.06);
    break-inside:avoid;
  }
  .rb-num{
    flex:0 0 30px;height:30px;border-radius:999px;
    background:#FFF0F7;color:#1A1A6E;
    display:grid;place-items:center;font-size:14px;font-weight:700;
  }
  .rb-emoji{font-size:30px;line-height:1;flex:0 0 auto}
  .rb-text{flex:1;min-width:0;font-size:16.5px;font-weight:600;color:#334155}

  .rb-ctrl{display:flex;gap:4px;flex:0 0 auto}
  .rb-icon{
    display:grid;place-items:center;width:32px;height:32px;border-radius:10px;
    background:#fff;border:1.5px solid #EDE9F8;color:#64748b;cursor:pointer;transition:.15s;
  }
  .rb-icon:hover:not(:disabled){background:#f8fafc;color:#1A1A6E}
  .rb-icon:disabled{opacity:.35;cursor:not-allowed}
  .rb-icon:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  /* Tick circle: decoration for the printed copy, so the day can be ticked off */
  .rb-tick{display:none}

  .rb-empty{
    text-align:center;color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;
    background:rgba(255,255,255,.6);border:1.5px dashed #EDE9F8;border-radius:16px;
    padding:26px 20px;
  }

  /* ---- the picker ---- */
  .rb-part{margin-top:22px}
  .rb-part h3{
    font-size:13px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.45);margin:0 0 10px;
  }
  .rb-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}
  .rb-tile{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    min-height:82px;padding:10px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .rb-tile:hover{border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .rb-tile:active{transform:none}
  .rb-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .rb-tile-emoji{font-size:26px;line-height:1}
  .rb-tile-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}

  .rb-custom{
    margin-top:22px;padding:16px 18px;
    background:rgba(255,255,255,.72);border:1.5px dashed #FFD6EC;border-radius:16px;
  }
  .rb-custom label{display:block;font-size:14px;font-weight:600;color:#1A1A6E;margin-bottom:8px}
  .rb-custom-row{display:flex;gap:8px}
  .rb-custom input{
    flex:1;min-width:0;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;padding:11px 13px;
    transition:border-color .18s;
  }
  .rb-custom input::placeholder{color:rgba(26,26,46,.34)}
  .rb-custom input:focus{border-color:#FF6FB5;outline:none}
  .rb-custom button{
    display:inline-flex;align-items:center;gap:5px;
    font-family:inherit;font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:11px;padding:0 18px;cursor:pointer;
  }
  .rb-custom button:disabled{opacity:.45;cursor:not-allowed}

  @media (prefers-reduced-motion:reduce){
    .rb-tile,.rb-tile:hover{transition:none;transform:none}
  }

  @media print{
    .rb-item{box-shadow:none;padding:14px 16px;border-color:#ddd8ea}
    .rb-ctrl{display:none}
    .rb-tick{
      display:block;flex:0 0 26px;height:26px;border-radius:999px;
      border:2px solid #d8a9c4;
    }
    .rb-board{gap:8px}
  }
`;

export default function RoutineBoard({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const partLabels = PART_LABELS[lang] || PART_LABELS.he;

  const [board, setBoard] = useState([]);
  const [custom, setCustom] = useState('');
  // A step may legitimately appear twice (brush teeth, snack), so rows need a
  // key of their own rather than reusing the step id.
  const uid = useRef(0);

  const add = (emoji, label) => {
    uid.current += 1;
    setBoard((prev) => [...prev, { key: `r${uid.current}`, emoji, label }]);
  };

  const addCustom = () => {
    const text = custom.trim();
    if (!text) return;
    add(CUSTOM_EMOJI, text);
    setCustom('');
  };

  const move = (index, delta) => {
    setBoard((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (index) => setBoard((prev) => prev.filter((_, i) => i !== index));

  const clear = () => {
    if (board.length > 0 && !window.confirm(copy.clearConfirm)) return;
    setBoard([]);
  };

  const countText =
    board.length === 1 ? copy.stepCountOne : copy.stepCount.replace('{n}', board.length);

  return (
    <div className="rb">
      <style>{STYLE}</style>

      <h2 className="text-center text-lg font-bold text-slate-700 mb-4">{copy.boardTitle}</h2>

      {board.length === 0 ? (
        <p className="rb-empty site-chrome">{copy.boardEmpty}</p>
      ) : (
        <>
          <ol className="rb-board">
            {board.map((row, index) => (
              <li key={row.key} className="rb-item">
                <span className="rb-num">{index + 1}</span>
                <span className="rb-emoji">{row.emoji}</span>
                <span className="rb-text">{row.label}</span>
                <span className="rb-tick" aria-hidden="true" />
                <span className="rb-ctrl">
                  <button
                    type="button"
                    className="rb-icon"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={copy.moveUp}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="rb-icon"
                    onClick={() => move(index, 1)}
                    disabled={index === board.length - 1}
                    aria-label={copy.moveDown}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="rb-icon"
                    onClick={() => remove(index)}
                    aria-label={copy.remove}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              </li>
            ))}
          </ol>

          <div className="site-chrome flex flex-wrap gap-3 justify-center items-center mt-6">
            <p aria-live="polite" className="text-sm text-slate-500 w-full text-center">
              {countText}
            </p>
            <button
              type="button"
              onClick={clear}
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
              slug="routine-board"
              lang={lang}
              getEntry={() => (board.length > 0 ? {
                summary: `${board.length} ${lang === 'he' ? 'שלבים' : 'steps'}`,
                payload: { board },
              } : null)}
            />
          </div>
        </>
      )}

      <div className="site-chrome">
        <h2 className="text-center text-lg font-bold text-slate-700 mt-12 mb-1">
          {copy.libraryTitle}
        </h2>

        {PARTS.map((part) => (
          <div key={part} className="rb-part">
            <h3>{partLabels[part]}</h3>
            <div className="rb-tiles">
              {stepsByPart(part).map((step) => (
                <button
                  key={step.id}
                  type="button"
                  className="rb-tile"
                  onClick={() => add(step.emoji, stepLabel(step, lang))}
                >
                  <span className="rb-tile-emoji">{step.emoji}</span>
                  <span className="rb-tile-text">{stepLabel(step, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="rb-custom">
          <label htmlFor="rb-custom-input">
            {CUSTOM_EMOJI} {copy.customLabel}
          </label>
          <div className="rb-custom-row">
            <input
              id="rb-custom-input"
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
