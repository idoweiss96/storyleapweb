import SaveToSpace from '../shared/SaveToSpace';
import React, { useState } from 'react';
import { Printer, RotateCcw } from 'lucide-react';
import { QUESTIONS, UI } from './safePlaceContent';

const STYLE = `
  .sp *{box-sizing:border-box}

  .sp-card{
    background:linear-gradient(160deg,#ffffff 0%,#F6FBFD 100%);
    border:2px solid #4FC3E8;border-radius:22px;
    padding:26px 22px;box-shadow:0 6px 26px rgba(79,195,232,.18);
    break-inside:avoid;
  }
  .sp-card h2{
    text-align:center;font-size:23px;font-weight:800;color:#1A1A6E;
    margin:0 0 18px;line-height:1.35;
  }

  .sp-lines{display:flex;flex-direction:column;gap:13px}
  .sp-line{display:flex;gap:12px;align-items:flex-start}
  .sp-line-emoji{font-size:24px;line-height:1.2;flex:0 0 auto}
  .sp-line-body{flex:1;min-width:0}
  .sp-line-q{
    font-size:12.5px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.42);margin:0 0 2px;
  }
  .sp-line-a{font-size:16.5px;line-height:1.5;color:#1A1A6E;font-weight:600;margin:0}

  .sp-draw{display:none}

  .sp-empty{
    text-align:center;color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;
    background:rgba(255,255,255,.6);border:1.5px dashed #EDE9F8;border-radius:16px;
    padding:26px 20px;
  }

  .sp-q{margin-bottom:20px}
  .sp-q label{
    display:flex;align-items:center;gap:8px;
    font-size:15.5px;font-weight:600;color:#1A1A6E;margin-bottom:8px;
  }
  .sp-q label span{font-size:20px}
  .sp-q input{
    width:100%;font-family:inherit;font-size:16px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;padding:12px 14px;
    transition:border-color .18s;
  }
  .sp-q input::placeholder{color:rgba(26,26,46,.32)}
  .sp-q input:focus{border-color:#4FC3E8;outline:none}

  .sp-quicks{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}
  .sp-quick{
    font-family:inherit;font-size:13.5px;font-weight:600;color:#1A1A6E;
    background:rgba(79,195,232,.12);border:1.5px solid transparent;border-radius:999px;
    padding:7px 13px;cursor:pointer;transition:.15s;
  }
  .sp-quick:hover{background:rgba(79,195,232,.22)}
  .sp-quick:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .sp-hint{text-align:center;font-size:13.5px;color:rgba(26,26,46,.45);margin-top:12px}

  @media print{
    .sp-card{box-shadow:none}
    .sp-draw{
      display:block;margin-top:20px;
      border:2px dashed #9fb8c8;border-radius:14px;height:260px;
      position:relative;
    }
    .sp-draw span{
      position:absolute;top:10px;inset-inline-start:14px;
      font-size:12.5px;font-weight:600;color:rgba(26,26,46,.38);
    }
  }
`;

export default function SafePlace({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const [answers, setAnswers] = useState({});

  const pick = (question) => question[lang] || question.he;
  const options = (question) => question.options[lang] || question.options.he;

  const set = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const clear = () => {
    if (Object.values(answers).some((v) => v && v.trim()) && !window.confirm(copy.clearConfirm)) return;
    setAnswers({});
  };

  const filled = QUESTIONS.filter((q) => (answers[q.id] || '').trim());

  return (
    <div className="sp">
      <style>{STYLE}</style>

      {filled.length === 0 ? (
        <p className="sp-empty site-chrome">{copy.empty}</p>
      ) : (
        <div className="sp-card">
          <h2>{copy.cardTitle}</h2>
          <div className="sp-lines">
            {filled.map((question) => (
              <div key={question.id} className="sp-line">
                <span className="sp-line-emoji">{question.emoji}</span>
                <div className="sp-line-body">
                  <p className="sp-line-q">{pick(question).label}</p>
                  <p className="sp-line-a">{answers[question.id].trim()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sp-draw" aria-hidden="true">
            <span>{copy.drawHere}</span>
          </div>
        </div>
      )}

      {filled.length > 0 && (
        <>
          <p className="sp-hint site-chrome">{copy.printHint}</p>
          <div className="site-chrome flex flex-wrap gap-3 justify-center mt-5">
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
              slug="safe-place"
              lang={lang}
              getEntry={() => (Object.keys(answers).length > 0 ? {
                summary: `${Object.keys(answers).length} ${lang === 'he' ? 'תשובות' : 'answers'}`,
                payload: { answers },
              } : null)}
            />
          </div>
        </>
      )}

      <div className="site-chrome mt-12">
        <p className="text-center text-sm text-slate-400 mb-6">{copy.hint}</p>

        {QUESTIONS.map((question) => (
          <div key={question.id} className="sp-q">
            <label htmlFor={`sp-${question.id}`}>
              <span>{question.emoji}</span>
              {pick(question).label}
            </label>
            <input
              id={`sp-${question.id}`}
              type="text"
              value={answers[question.id] || ''}
              onChange={(e) => set(question.id, e.target.value)}
              placeholder={pick(question).placeholder}
            />
            <div className="sp-quicks">
              {options(question).map((option) => (
                <button
                  key={option}
                  type="button"
                  className="sp-quick"
                  onClick={() => set(question.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
