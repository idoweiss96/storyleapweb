import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Printer, RotateCcw, X } from 'lucide-react';
import { CUSTOM_EMOJI, PARTS, PART_LABELS, stepLabel, stepsByPart } from '../shared/routineSteps';
import { DAYS, PRESETS, UI } from './routineChecklistContent';

const STYLE = `
  .rc *{box-sizing:border-box}

  .rc-sheet{
    background:#fff;border:1.5px solid #EDE9F8;border-radius:18px;
    padding:22px 18px;box-shadow:0 4px 18px rgba(26,26,110,.07);
    break-inside:avoid;
  }
  .rc-sheet h2{
    text-align:center;font-size:23px;font-weight:800;color:#1A1A6E;
    margin:0 0 18px;line-height:1.35;
  }

  .rc-daysrow{
    display:flex;justify-content:flex-end;gap:6px;margin-bottom:8px;padding-inline-end:2px;
  }
  .rc-daysrow span{
    width:30px;text-align:center;font-size:11.5px;font-weight:700;
    color:rgba(26,26,46,.42);
  }

  .rc-item{
    display:flex;align-items:center;gap:12px;
    border-bottom:1.5px solid #F2F0F9;padding:11px 2px;
    break-inside:avoid;
  }
  .rc-item:last-child{border-bottom:0}
  .rc-emoji{font-size:26px;line-height:1;flex:0 0 auto}
  .rc-text{flex:1;min-width:0;font-size:16.5px;font-weight:600;color:#334155}

  .rc-boxes{display:flex;gap:6px;flex:0 0 auto}
  .rc-box{
    width:30px;height:30px;border-radius:8px;
    border:2px solid #D9D4E8;background:#fff;
  }

  .rc-ctrl{display:flex;gap:4px;flex:0 0 auto}
  .rc-icon{
    display:grid;place-items:center;width:30px;height:30px;border-radius:9px;
    background:#fff;border:1.5px solid #EDE9F8;color:#64748b;cursor:pointer;transition:.15s;
  }
  .rc-icon:hover:not(:disabled){background:#f8fafc;color:#1A1A6E}
  .rc-icon:disabled{opacity:.35;cursor:not-allowed}
  .rc-icon:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .rc-empty{
    text-align:center;color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;
    background:rgba(255,255,255,.6);border:1.5px dashed #EDE9F8;border-radius:16px;
    padding:26px 20px;
  }

  .rc-field{margin-bottom:14px}
  .rc-field label{display:block;font-size:13.5px;font-weight:600;color:#1A1A6E;margin-bottom:7px}
  .rc-field input{
    width:100%;font-family:inherit;font-size:16px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;padding:12px 14px;
    transition:border-color .18s;
  }
  .rc-field input:focus{border-color:#FF6FB5;outline:none}

  .rc-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px}
  .rc-chip{
    display:inline-flex;align-items:center;gap:7px;
    font-family:inherit;font-size:14px;font-weight:600;color:#1A1A6E;
    background:rgba(26,26,110,.055);border:1.5px solid transparent;border-radius:999px;
    padding:9px 15px;cursor:pointer;transition:.15s;
  }
  .rc-chip:hover{background:rgba(26,26,110,.1)}
  .rc-chip:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .rc-seg{
    display:flex;gap:6px;background:rgba(26,26,110,.05);border-radius:999px;
    padding:5px;max-width:320px;margin:0 auto;
  }
  .rc-seg button{
    flex:1;font-family:inherit;font-size:14.5px;color:rgba(26,26,46,.7);
    background:transparent;border:0;border-radius:999px;padding:9px 6px;cursor:pointer;transition:.18s;
  }
  .rc-seg button[aria-pressed="true"]{
    background:#fff;color:#1A1A6E;font-weight:700;box-shadow:0 4px 14px rgba(26,26,110,.10);
  }

  .rc-part{margin-top:20px}
  .rc-part h3{
    font-size:13px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.45);margin:0 0 10px;
  }
  .rc-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}
  .rc-tile{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    min-height:82px;padding:10px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .rc-tile:hover{border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .rc-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .rc-tile-emoji{font-size:26px;line-height:1}
  .rc-tile-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}

  .rc-custom{
    margin-top:20px;padding:16px 18px;
    background:rgba(255,255,255,.72);border:1.5px dashed #FFD6EC;border-radius:16px;
  }
  .rc-custom label{display:block;font-size:14px;font-weight:600;color:#1A1A6E;margin-bottom:8px}
  .rc-custom-row{display:flex;gap:8px}
  .rc-custom input{
    flex:1;min-width:0;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;padding:11px 13px;
  }
  .rc-custom input:focus{border-color:#FF6FB5;outline:none}
  .rc-custom button{
    display:inline-flex;align-items:center;gap:5px;
    font-family:inherit;font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:11px;padding:0 18px;cursor:pointer;
  }
  .rc-custom button:disabled{opacity:.45;cursor:not-allowed}

  @media (prefers-reduced-motion:reduce){
    .rc-tile,.rc-tile:hover{transition:none;transform:none}
  }

  @media print{
    .rc-sheet{box-shadow:none;border:none;padding:0}
    .rc-ctrl{display:none}
    .rc-item{padding:13px 2px}
  }
`;

export default function RoutineChecklist({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const partLabels = PART_LABELS[lang] || PART_LABELS.he;
  const days = DAYS[lang] || DAYS.he;

  const [name, setName] = useState('');
  const [mode, setMode] = useState('day');
  const [items, setItems] = useState([]);
  const [custom, setCustom] = useState('');
  const uid = useRef(0);

  const presetLabel = (preset) => (typeof preset[lang] === 'string' ? preset[lang] : preset.he);
  const boxes = mode === 'week' ? days.length : 1;

  const add = (emoji, label) => {
    uid.current += 1;
    setItems((prev) => [...prev, { key: `c${uid.current}`, emoji, label }]);
  };

  const addCustom = () => {
    const text = custom.trim();
    if (!text) return;
    add(CUSTOM_EMOJI, text);
    setCustom('');
  };

  const move = (index, delta) =>
    setItems((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const remove = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const clear = () => {
    if (items.length > 0 && !window.confirm(copy.clearConfirm)) return;
    setItems([]);
  };

  const countText =
    items.length === 1 ? copy.stepCountOne : copy.stepCount.replace('{n}', items.length);

  return (
    <div className="rc">
      <style>{STYLE}</style>

      {items.length === 0 ? (
        <p className="rc-empty site-chrome">{copy.empty}</p>
      ) : (
        <div className="rc-sheet">
          <h2>{name.trim() || copy.title}</h2>

          {mode === 'week' && (
            <div className="rc-daysrow" aria-hidden="true">
              {days.map((day, i) => (
                <span key={`${day}-${i}`}>{day}</span>
              ))}
            </div>
          )}

          <ul>
            {items.map((item, index) => (
              <li key={item.key} className="rc-item">
                <span className="rc-emoji">{item.emoji}</span>
                <span className="rc-text">{item.label}</span>

                <span className="rc-boxes" aria-hidden="true">
                  {Array.from({ length: boxes }, (_, i) => (
                    <span key={i} className="rc-box" />
                  ))}
                </span>

                <span className="rc-ctrl">
                  <button
                    type="button"
                    className="rc-icon"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={copy.moveUp}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="rc-icon"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={copy.moveDown}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="rc-icon"
                    onClick={() => remove(index)}
                    aria-label={copy.remove}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {items.length > 0 && (
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
        </div>
      )}

      <div className="site-chrome mt-12">
        <div className="rc-field">
          <label htmlFor="rc-name">{copy.nameLabel}</label>
          <input
            id="rc-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={copy.namePlaceholder}
          />
          <div className="rc-chips">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="rc-chip"
                onClick={() => setName(presetLabel(preset))}
              >
                <span>{preset.emoji}</span>
                {presetLabel(preset)}
              </button>
            ))}
          </div>
        </div>

        <div className="rc-field">
          <label>{copy.modeLabel}</label>
          <div className="rc-seg">
            <button type="button" aria-pressed={mode === 'day'} onClick={() => setMode('day')}>
              {copy.modeDay}
            </button>
            <button type="button" aria-pressed={mode === 'week'} onClick={() => setMode('week')}>
              {copy.modeWeek}
            </button>
          </div>
          <p className="text-center text-sm text-slate-400 mt-2">{copy.modeHint}</p>
        </div>

        <h2 className="text-center text-lg font-bold text-slate-700 mt-10 mb-1">
          {copy.libraryTitle}
        </h2>

        {PARTS.map((part) => (
          <div key={part} className="rc-part">
            <h3>{partLabels[part]}</h3>
            <div className="rc-tiles">
              {stepsByPart(part).map((step) => (
                <button
                  key={step.id}
                  type="button"
                  className="rc-tile"
                  onClick={() => add(step.emoji, stepLabel(step, lang))}
                >
                  <span className="rc-tile-emoji">{step.emoji}</span>
                  <span className="rc-tile-text">{stepLabel(step, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="rc-custom">
          <label htmlFor="rc-custom-input">
            {CUSTOM_EMOJI} {copy.customLabel}
          </label>
          <div className="rc-custom-row">
            <input
              id="rc-custom-input"
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
