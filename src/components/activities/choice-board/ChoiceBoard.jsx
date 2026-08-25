import SaveToSpace from '../shared/SaveToSpace';
import React, { useRef, useState } from 'react';
import { Plus, Printer, RotateCcw, X } from 'lucide-react';
import { CARD_STYLES } from '../shared/cardStyles';
import { PickerCard } from '../shared/ActivityCards';
import {
  CUSTOM_EMOJI,
  MAX_OPTIONS,
  MIN_OPTIONS,
  SITUATIONS,
  UI,
} from './choiceBoardContent';

const STYLE = `
  .cb *{box-sizing:border-box}

  .cb-question{
    text-align:center;font-size:24px;font-weight:700;color:#1A1A6E;
    margin:0 0 20px;line-height:1.35;
  }

  .cb-board{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  @media (min-width:560px){
    .cb-board.of-3{grid-template-columns:repeat(3,1fr)}
    .cb-board.of-4{grid-template-columns:repeat(4,1fr)}
  }

  .cb-opt{
    position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
    min-height:150px;padding:18px 12px;text-align:center;
    background:linear-gradient(160deg,#fff 0%,#FFF8FB 100%);
    border:2px solid #FF6FB5;border-radius:18px;
    box-shadow:0 4px 18px rgba(255,111,181,.14);
    break-inside:avoid;
  }
  .cb-opt-emoji{font-size:46px;line-height:1}
  .cb-opt-text{font-size:16px;font-weight:700;color:#1A1A6E;line-height:1.35}

  .cb-remove{
    position:absolute;top:8px;inset-inline-end:8px;
    display:grid;place-items:center;width:26px;height:26px;border-radius:999px;
    background:#fff;border:1.5px solid #EDE9F8;color:#94a3b8;cursor:pointer;transition:.15s;
  }
  .cb-remove:hover{color:#1A1A6E;border-color:#FF6FB5}
  .cb-remove:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .cb-empty{
    text-align:center;color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;
    background:rgba(255,255,255,.6);border:1.5px dashed #EDE9F8;border-radius:16px;
    padding:26px 20px;
  }

  .cb-limit{
    text-align:center;font-size:13.5px;line-height:1.55;
    color:#7A5000;background:#FFF8EC;border:1.5px solid #F5C842;
    border-radius:12px;padding:10px 14px;margin-top:14px;
  }

  .cb-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;margin-top:12px}
  .cb-tile{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    min-height:82px;padding:10px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .cb-tile:hover:not(:disabled){border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .cb-tile:disabled{opacity:.4;cursor:not-allowed}
  .cb-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .cb-tile-emoji{font-size:26px;line-height:1}
  .cb-tile-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}

  .cb-custom{
    margin-top:20px;padding:16px 18px;
    background:rgba(255,255,255,.72);border:1.5px dashed #FFD6EC;border-radius:16px;
  }
  .cb-custom label{display:block;font-size:14px;font-weight:600;color:#1A1A6E;margin-bottom:8px}
  .cb-custom-row{display:flex;gap:8px}
  .cb-custom input{
    flex:1;min-width:0;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;padding:11px 13px;
    transition:border-color .18s;
  }
  .cb-custom input::placeholder{color:rgba(26,26,46,.34)}
  .cb-custom input:focus{border-color:#FF6FB5;outline:none}
  .cb-custom button{
    display:inline-flex;align-items:center;gap:5px;
    font-family:inherit;font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:11px;padding:0 18px;cursor:pointer;
  }
  .cb-custom button:disabled{opacity:.45;cursor:not-allowed}

  .cb-own{margin-top:18px}
  .cb-own input{
    width:100%;font-family:inherit;font-size:16px;color:#1a1a2e;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;padding:14px 16px;
    transition:border-color .18s;
  }
  .cb-own input:focus{border-color:#FF6FB5;outline:none}

  @media (prefers-reduced-motion:reduce){
    .cb-tile,.cb-tile:hover{transition:none;transform:none}
  }

  @media print{
    .cb-opt{box-shadow:none;min-height:200px}
    .cb-remove{display:none}
    .cb-question{font-size:28px;margin-bottom:26px}
    .cb-board{gap:16px}
  }
`;

export default function ChoiceBoard({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [situation, setSituation] = useState(null);
  const [ownQuestion, setOwnQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [custom, setCustom] = useState('');
  const uid = useRef(0);

  const pick = (item) => item[lang] || item.he;
  const optionText = (o) => (typeof o[lang] === 'string' ? o[lang] : o.he);

  const full = options.length >= MAX_OPTIONS;

  const add = (emoji, label) => {
    if (full) return;
    uid.current += 1;
    setOptions((prev) => [...prev, { key: `o${uid.current}`, emoji, label }]);
  };

  const addCustom = () => {
    const text = custom.trim();
    if (!text || full) return;
    add(CUSTOM_EMOJI, text);
    setCustom('');
  };

  const remove = (index) => setOptions((prev) => prev.filter((_, i) => i !== index));

  const reset = () => {
    setSituation(null);
    setOwnQuestion('');
    setOptions([]);
    setCustom('');
  };

  // ---- Step 1: which moment ----
  if (!situation) {
    return (
      <div className="ac-deck cb">
        <style>{CARD_STYLES + STYLE}</style>
        <h2 className="text-center text-lg font-bold text-slate-700 mb-5">{copy.pickTitle}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {SITUATIONS.map((item) => (
            <PickerCard
              key={item.id}
              emoji={item.emoji}
              label={pick(item).label}
              selected={false}
              onClick={() => setSituation(item)}
            />
          ))}
          <PickerCard
            emoji="✍️"
            label={copy.ownQuestion}
            selected={false}
            onClick={() => setSituation({ id: '__own__', options: [] })}
          />
        </div>
      </div>
    );
  }

  const isOwn = situation.id === '__own__';
  const question = isOwn ? ownQuestion.trim() : pick(situation).question;
  // Every situation's own options, plus the generic ones, give a custom question
  // something to start from instead of an empty library.
  const library = isOwn
    ? SITUATIONS.flatMap((s) => s.options).filter(
        (o, i, all) => all.findIndex((x) => x.id === o.id && x.emoji === o.emoji) === i
      )
    : situation.options;

  return (
    <div className="cb">
      <style>{STYLE}</style>

      <h2 className="site-chrome text-center text-lg font-bold text-slate-700 mb-4">
        {copy.boardTitle}
      </h2>

      {isOwn && (
        <div className="cb-own site-chrome mb-6">
          <input
            type="text"
            value={ownQuestion}
            onChange={(e) => setOwnQuestion(e.target.value)}
            placeholder={copy.ownQuestionPlaceholder}
            aria-label={copy.ownQuestion}
          />
        </div>
      )}

      {question && <p className="cb-question">{question}</p>}

      {options.length === 0 ? (
        <p className="cb-empty site-chrome">{copy.boardEmpty}</p>
      ) : (
        <div className={`cb-board of-${options.length}`}>
          {options.map((option, index) => (
            <div key={option.key} className="cb-opt">
              <button
                type="button"
                className="cb-remove site-chrome"
                onClick={() => remove(index)}
                aria-label={copy.remove}
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="cb-opt-emoji">{option.emoji}</span>
              <span className="cb-opt-text">{option.label}</span>
            </div>
          ))}
        </div>
      )}

      {full && <p className="cb-limit site-chrome">{copy.limitReached}</p>}

      {options.length >= MIN_OPTIONS && question && (
        <div className="site-chrome flex flex-wrap gap-3 justify-center mt-7">
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
            slug="choice-board"
            lang={lang}
            getEntry={() => (options.length > 0 ? {
              summary: ownQuestion || situation?.[lang] || situation?.he || situation?.label || undefined,
              payload: { situation, ownQuestion, options },
            } : null)}
          />
        </div>
      )}

      <div className="site-chrome">
        <h2 className="text-center text-lg font-bold text-slate-700 mt-12 mb-1">
          {copy.libraryTitle}
        </h2>

        <div className="cb-tiles">
          {library.map((option) => (
            <button
              key={`${option.id}-${option.emoji}`}
              type="button"
              className="cb-tile"
              disabled={full}
              onClick={() => add(option.emoji, optionText(option))}
            >
              <span className="cb-tile-emoji">{option.emoji}</span>
              <span className="cb-tile-text">{optionText(option)}</span>
            </button>
          ))}
        </div>

        <div className="cb-custom">
          <label htmlFor="cb-custom-input">
            {CUSTOM_EMOJI} {copy.customLabel}
          </label>
          <div className="cb-custom-row">
            <input
              id="cb-custom-input"
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

        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {copy.changeSituation}
          </button>
          {options.length > 0 && (
            <button
              type="button"
              onClick={() => setOptions([])}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {copy.clear}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
