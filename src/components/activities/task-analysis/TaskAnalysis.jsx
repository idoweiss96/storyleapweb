import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Printer, RotateCcw, X } from 'lucide-react';
import { EXAMPLES, HELP_LEVELS, UI } from './taskAnalysisContent';

const STYLE = `
  .ta *{box-sizing:border-box}

  .ta-title{
    text-align:center;font-size:23px;font-weight:800;color:#1A1A6E;
    margin:0 0 18px;line-height:1.35;
  }

  .ta-row{
    display:flex;align-items:center;gap:12px;flex-wrap:wrap;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    padding:12px 14px;box-shadow:0 2px 10px rgba(26,26,110,.05);
    break-inside:avoid;
  }
  .ta-num{
    flex:0 0 28px;height:28px;border-radius:999px;
    background:#FFF0F7;color:#1A1A6E;
    display:grid;place-items:center;font-size:13px;font-weight:700;
  }
  .ta-text{flex:1;min-width:130px;font-size:16px;font-weight:600;color:#334155}

  .ta-levels{display:flex;gap:5px;flex:0 0 auto}
  .ta-level{
    display:grid;place-items:center;width:36px;height:36px;border-radius:10px;
    background:#fff;border:1.5px solid #EDE9F8;font-size:16px;
    cursor:pointer;transition:.15s;
  }
  .ta-level:hover{border-color:#c9c2e0}
  .ta-level[aria-pressed="true"]{border-width:2.5px}
  .ta-level:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .ta-ctrl{display:flex;gap:4px;flex:0 0 auto}
  .ta-icon{
    display:grid;place-items:center;width:30px;height:30px;border-radius:9px;
    background:#fff;border:1.5px solid #EDE9F8;color:#64748b;cursor:pointer;transition:.15s;
  }
  .ta-icon:hover:not(:disabled){background:#f8fafc;color:#1A1A6E}
  .ta-icon:disabled{opacity:.35;cursor:not-allowed}
  .ta-icon:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .ta-legend{
    display:flex;flex-wrap:wrap;gap:10px;justify-content:center;
    margin:18px 0 0;padding:14px;
    background:rgba(255,255,255,.66);border:1.5px solid #EDE9F8;border-radius:14px;
  }
  .ta-legend span{
    display:inline-flex;align-items:center;gap:6px;
    font-size:13.5px;font-weight:600;color:#475569;
  }
  .ta-legend i{
    display:grid;place-items:center;width:26px;height:26px;border-radius:8px;
    border:2px solid;font-style:normal;font-size:13px;
  }

  .ta-empty{
    text-align:center;color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;
    background:rgba(255,255,255,.6);border:1.5px dashed #EDE9F8;border-radius:16px;
    padding:26px 20px;
  }

  .ta-field{margin-bottom:16px}
  .ta-field label{display:block;font-size:13.5px;font-weight:600;color:#1A1A6E;margin-bottom:7px}
  .ta-field input{
    width:100%;font-family:inherit;font-size:16px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;padding:12px 14px;
    transition:border-color .18s;
  }
  .ta-field input::placeholder{color:rgba(26,26,46,.34)}
  .ta-field input:focus{border-color:#FF6FB5;outline:none}

  .ta-add{display:flex;gap:8px;margin-top:14px}
  .ta-add input{
    flex:1;min-width:0;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;padding:11px 13px;
  }
  .ta-add input:focus{border-color:#FF6FB5;outline:none}
  .ta-add button{
    display:inline-flex;align-items:center;gap:5px;
    font-family:inherit;font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:11px;padding:0 18px;cursor:pointer;
  }
  .ta-add button:disabled{opacity:.45;cursor:not-allowed}

  .ta-examples{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:6px}
  .ta-example{
    display:inline-flex;align-items:center;gap:7px;
    font-family:inherit;font-size:14px;font-weight:600;color:#1A1A6E;
    background:rgba(26,26,110,.055);border:1.5px solid transparent;border-radius:999px;
    padding:9px 15px;cursor:pointer;transition:.15s;
  }
  .ta-example:hover{background:rgba(26,26,110,.1)}
  .ta-example:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  @media print{
    .ta-row{box-shadow:none;padding:14px}
    .ta-ctrl{display:none}
    .ta-level{width:32px;height:32px}
  }
`;

export default function TaskAnalysis({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [task, setTask] = useState('');
  const [steps, setSteps] = useState([]);
  const [draft, setDraft] = useState('');
  const uid = useRef(0);

  const pick = (item) => item[lang] || item.he;
  const levelLabel = (level) => (typeof level[lang] === 'string' ? level[lang] : level.he);

  const addStep = (text) => {
    const value = text.trim();
    if (!value) return;
    uid.current += 1;
    setSteps((prev) => [...prev, { key: `s${uid.current}`, text: value, level: null }]);
  };

  const loadExample = (example) => {
    const text = pick(example);
    setTask(text.label);
    setSteps(
      text.steps.map((step) => {
        uid.current += 1;
        return { key: `s${uid.current}`, text: step, level: null };
      })
    );
  };

  const setLevel = (index, levelId) =>
    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, level: step.level === levelId ? null : levelId } : step
      )
    );

  const move = (index, delta) =>
    setSteps((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const remove = (index) => setSteps((prev) => prev.filter((_, i) => i !== index));

  const clear = () => {
    if (steps.length > 0 && !window.confirm(copy.clearConfirm)) return;
    setTask('');
    setSteps([]);
    setDraft('');
  };

  const countText =
    steps.length === 1 ? copy.stepCountOne : copy.stepCount.replace('{n}', steps.length);

  return (
    <div className="ta">
      <style>{STYLE}</style>

      <div className="ta-field site-chrome">
        <label htmlFor="ta-task">{copy.taskLabel}</label>
        <input
          id="ta-task"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={copy.taskPlaceholder}
        />
        <div className="ta-examples">
          {EXAMPLES.map((example) => (
            <button
              key={example.id}
              type="button"
              className="ta-example"
              onClick={() => loadExample(example)}
            >
              <span>{example.emoji}</span>
              {pick(example).label}
            </button>
          ))}
        </div>
      </div>

      {task.trim() && <p className="ta-title">{task.trim()}</p>}

      {steps.length === 0 ? (
        <p className="ta-empty site-chrome">{copy.empty}</p>
      ) : (
        <>
          <ol className="flex flex-col gap-2.5">
            {steps.map((step, index) => (
              <li key={step.key} className="ta-row">
                <span className="ta-num">{index + 1}</span>
                <span className="ta-text">{step.text}</span>

                <span className="ta-levels">
                  {HELP_LEVELS.map((level) => {
                    const on = step.level === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        className="ta-level"
                        aria-pressed={on}
                        aria-label={levelLabel(level)}
                        onClick={() => setLevel(index, level.id)}
                        style={on ? { borderColor: level.color, background: `${level.color}26` } : undefined}
                      >
                        {level.emoji}
                      </button>
                    );
                  })}
                </span>

                <span className="ta-ctrl">
                  <button
                    type="button"
                    className="ta-icon"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={copy.moveUp}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="ta-icon"
                    onClick={() => move(index, 1)}
                    disabled={index === steps.length - 1}
                    aria-label={copy.moveDown}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="ta-icon"
                    onClick={() => remove(index)}
                    aria-label={copy.removeStep}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              </li>
            ))}
          </ol>

          <div className="ta-legend">
            {HELP_LEVELS.map((level) => (
              <span key={level.id}>
                <i style={{ borderColor: level.color, background: `${level.color}26` }}>
                  {level.emoji}
                </i>
                {levelLabel(level)}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="site-chrome">
        <div className="ta-add">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addStep(draft);
                setDraft('');
              }
            }}
            placeholder={copy.stepPlaceholder}
            aria-label={copy.addStep}
          />
          <button
            type="button"
            onClick={() => {
              addStep(draft);
              setDraft('');
            }}
            disabled={!draft.trim()}
          >
            <Plus className="w-4 h-4" />
            {copy.addStep}
          </button>
        </div>

        {steps.length > 0 && (
          <>
            <p aria-live="polite" className="text-center text-sm text-slate-500 mt-6">
              {countText}
            </p>
            <p className="text-center text-sm text-slate-400 mt-1">{copy.helpHint}</p>
            <div className="flex flex-wrap gap-3 justify-center mt-5">
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
          </>
        )}
      </div>
    </div>
  );
}
