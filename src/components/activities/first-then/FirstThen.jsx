import React, { useState } from 'react';
import { ArrowLeftRight, Plus, Printer, RotateCcw, X } from 'lucide-react';
import { CUSTOM_EMOJI, PARTS, PART_LABELS, stepLabel, stepsByPart } from '../shared/routineSteps';
import { UI } from './firstThenContent';

const STYLE = `
  .ft *{box-sizing:border-box}

  .ft-slots{display:grid;grid-template-columns:1fr;gap:14px}
  @media (min-width:560px){.ft-slots{grid-template-columns:1fr 1fr}}

  .ft-slot{
    position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
    min-height:210px;padding:22px 18px;text-align:center;
    background:#fff;border:2px solid #EDE9F8;border-radius:20px;
    box-shadow:0 4px 18px rgba(26,26,110,.08);
    break-inside:avoid;
  }
  .ft-slot.filled{border-color:#FF6FB5;background:linear-gradient(160deg,#fff 0%,#FFF8FB 100%)}
  .ft-slot.next{border-style:dashed;border-color:#FF6FB5;background:#FFF8FB}

  .ft-tag{
    position:absolute;top:-13px;
    font-size:13px;font-weight:700;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border-radius:999px;padding:4px 16px;
  }
  .ft-emoji{font-size:62px;line-height:1}
  .ft-word{font-size:19px;font-weight:700;color:#1A1A6E;line-height:1.35}
  .ft-hint{font-size:14.5px;color:rgba(26,26,46,.42);line-height:1.5}

  .ft-clearslot{
    position:absolute;top:10px;inset-inline-end:10px;
    display:grid;place-items:center;width:28px;height:28px;border-radius:999px;
    background:#fff;border:1.5px solid #EDE9F8;color:#94a3b8;cursor:pointer;transition:.15s;
  }
  .ft-clearslot:hover{color:#1A1A6E;border-color:#FF6FB5}
  .ft-clearslot:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .ft-arrow{
    display:grid;place-items:center;font-size:22px;color:#FF6FB5;
  }

  .ft-part{margin-top:22px}
  .ft-part h3{
    font-size:13px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.45);margin:0 0 10px;
  }
  .ft-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}
  .ft-tile{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    min-height:82px;padding:10px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .ft-tile:hover:not(:disabled){border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .ft-tile:disabled{opacity:.4;cursor:not-allowed}
  .ft-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .ft-tile-emoji{font-size:26px;line-height:1}
  .ft-tile-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}

  .ft-custom{
    margin-top:22px;padding:16px 18px;
    background:rgba(255,255,255,.72);border:1.5px dashed #FFD6EC;border-radius:16px;
  }
  .ft-custom label{display:block;font-size:14px;font-weight:600;color:#1A1A6E;margin-bottom:8px}
  .ft-custom-row{display:flex;gap:8px}
  .ft-custom input{
    flex:1;min-width:0;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;padding:11px 13px;
    transition:border-color .18s;
  }
  .ft-custom input::placeholder{color:rgba(26,26,46,.34)}
  .ft-custom input:focus{border-color:#FF6FB5;outline:none}
  .ft-custom button{
    display:inline-flex;align-items:center;gap:5px;
    font-family:inherit;font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:11px;padding:0 18px;cursor:pointer;
  }
  .ft-custom button:disabled{opacity:.45;cursor:not-allowed}

  @media (prefers-reduced-motion:reduce){
    .ft-tile,.ft-tile:hover{transition:none;transform:none}
  }

  @media print{
    .ft-slot{box-shadow:none;min-height:260px}
    .ft-clearslot{display:none}
    .ft-slots{grid-template-columns:1fr 1fr;gap:18px}
    .ft-emoji{font-size:78px}
    .ft-word{font-size:22px}
  }
`;

function Slot({ tag, item, hint, isNext, onClear, clearLabel }) {
  const className = `ft-slot${item ? ' filled' : isNext ? ' next' : ''}`;
  return (
    <div className={className}>
      <span className="ft-tag">{tag}</span>
      {item ? (
        <>
          <button type="button" className="ft-clearslot site-chrome" onClick={onClear} aria-label={clearLabel}>
            <X className="w-3.5 h-3.5" />
          </button>
          <span className="ft-emoji">{item.emoji}</span>
          <span className="ft-word">{item.label}</span>
        </>
      ) : (
        <span className="ft-hint">{hint}</span>
      )}
    </div>
  );
}

export default function FirstThen({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const partLabels = PART_LABELS[lang] || PART_LABELS.he;

  const [first, setFirst] = useState(null);
  const [then, setThen] = useState(null);
  const [custom, setCustom] = useState('');

  // Taps fill the first empty slot, so a child never has to aim at a target.
  const nextSlot = !first ? 'first' : !then ? 'then' : null;

  const place = (emoji, label) => {
    const item = { emoji, label };
    if (!first) setFirst(item);
    else if (!then) setThen(item);
  };

  const addCustom = () => {
    const text = custom.trim();
    if (!text || !nextSlot) return;
    place(CUSTOM_EMOJI, text);
    setCustom('');
  };

  const swap = () => {
    setFirst(then);
    setThen(first);
  };

  const clear = () => {
    setFirst(null);
    setThen(null);
  };

  const full = Boolean(first && then);

  return (
    <div className="ft">
      <style>{STYLE}</style>

      <div className="ft-slots">
        <Slot
          tag={copy.firstLabel}
          item={first}
          hint={copy.emptyFirst}
          isNext={nextSlot === 'first'}
          onClear={() => setFirst(null)}
          clearLabel={copy.clear}
        />
        <Slot
          tag={copy.thenLabel}
          item={then}
          hint={copy.emptyThen}
          isNext={nextSlot === 'then'}
          onClear={() => setThen(null)}
          clearLabel={copy.clear}
        />
      </div>

      {full && (
        <div className="site-chrome flex flex-wrap gap-3 justify-center mt-8">
          <button
            type="button"
            onClick={swap}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
            {copy.swap}
          </button>
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

      <div className="site-chrome">
        <h2 className="text-center text-lg font-bold text-slate-700 mt-12 mb-1">
          {copy.libraryTitle}
        </h2>
        <p aria-live="polite" className="text-center text-sm text-slate-400 mb-2">
          {nextSlot === 'first' ? copy.fillsFirst : nextSlot === 'then' ? copy.fillsThen : ''}
        </p>

        {PARTS.map((part) => (
          <div key={part} className="ft-part">
            <h3>{partLabels[part]}</h3>
            <div className="ft-tiles">
              {stepsByPart(part).map((step) => (
                <button
                  key={step.id}
                  type="button"
                  className="ft-tile"
                  disabled={!nextSlot}
                  onClick={() => place(step.emoji, stepLabel(step, lang))}
                >
                  <span className="ft-tile-emoji">{step.emoji}</span>
                  <span className="ft-tile-text">{stepLabel(step, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="ft-custom">
          <label htmlFor="ft-custom-input">
            {CUSTOM_EMOJI} {copy.customLabel}
          </label>
          <div className="ft-custom-row">
            <input
              id="ft-custom-input"
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
              disabled={!nextSlot}
            />
            <button type="button" onClick={addCustom} disabled={!custom.trim() || !nextSlot}>
              <Plus className="w-4 h-4" />
              {copy.customAdd}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
