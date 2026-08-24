import React, { useState } from 'react';
import { Check, Printer } from 'lucide-react';
import {
  DAYS,
  EMOTIONS,
  MAX_EMOTIONS,
  MIN_EMOTIONS,
  UI,
} from './emotionCheckinContent';

const STYLE = `
  .ck *{box-sizing:border-box}

  .ck-chart{
    background:#fff;border:1.5px solid #EDE9F8;border-radius:18px;
    padding:20px 16px;box-shadow:0 4px 18px rgba(26,26,110,.07);
    overflow-x:auto;break-inside:avoid;
  }
  .ck-chart h2{
    font-size:21px;font-weight:800;color:#1A1A6E;text-align:center;margin:0 0 16px;
  }

  .ck-table{width:100%;border-collapse:collapse;min-width:420px}
  .ck-table th,.ck-table td{border:1px solid #E6E2F2;padding:0}
  .ck-table thead th{
    padding:8px 4px;font-size:12px;font-weight:700;color:rgba(26,26,46,.5);
    background:#FAFAFE;
  }
  .ck-head-emoji{display:block;font-size:22px;line-height:1.1}
  .ck-head-text{display:block;font-size:11px;font-weight:600;margin-top:2px}

  .ck-day{
    padding:0 12px;font-size:14px;font-weight:700;color:#1A1A6E;
    text-align:start;background:#FAFAFE;white-space:nowrap;
  }
  .ck-cell{height:46px;text-align:center}
  .ck-dot{
    display:inline-block;width:22px;height:22px;border-radius:999px;
    border:2px solid #D9D4E8;
  }
  .ck-notes{min-width:150px}

  .ck-needmore{
    text-align:center;color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;
    background:rgba(255,255,255,.6);border:1.5px dashed #EDE9F8;border-radius:16px;
    padding:26px 20px;
  }

  .ck-limit{
    text-align:center;font-size:13.5px;line-height:1.55;
    color:#7A5000;background:#FFF8EC;border:1.5px solid #F5C842;
    border-radius:12px;padding:10px 14px;margin-top:14px;
  }

  .ck-name{max-width:320px;margin:0 auto 22px}
  .ck-name label{display:block;font-size:13.5px;font-weight:600;color:#1A1A6E;margin-bottom:7px;text-align:center}
  .ck-name input{
    width:100%;font-family:inherit;font-size:16px;color:#1a1a2e;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;padding:11px 14px;
    transition:border-color .18s;
  }
  .ck-name input:focus{border-color:#FF6FB5;outline:none}

  .ck-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:9px}
  .ck-tile{
    position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;
    min-height:92px;padding:12px 8px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:15px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .ck-tile:hover:not(:disabled){transform:translateY(-2px)}
  .ck-tile:disabled{opacity:.4;cursor:not-allowed}
  .ck-tile[aria-pressed="true"]{border-width:2.5px}
  .ck-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .ck-tile-emoji{font-size:27px;line-height:1}
  .ck-tile-text{font-size:12.5px;font-weight:600;color:#475569;line-height:1.3}
  .ck-tick{
    position:absolute;top:6px;inset-inline-end:6px;
    display:grid;place-items:center;width:20px;height:20px;border-radius:999px;background:#1A1A6E;
  }

  @media (prefers-reduced-motion:reduce){
    .ck-tile,.ck-tile:hover{transition:none;transform:none}
  }

  @media print{
    .ck-chart{box-shadow:none;border:none;padding:0;overflow:visible}
    .ck-table{min-width:0}
    .ck-cell{height:54px}
  }
`;

function countLabel(copy, n) {
  if (n === 0) return copy.countNone;
  if (n === 1) return copy.countOne;
  return copy.countMany.replace('{n}', n);
}

export default function EmotionCheckin({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const days = DAYS[lang] || DAYS.he;

  const [selected, setSelected] = useState([]);
  const [name, setName] = useState('');

  const label = (item) => (typeof item[lang] === 'string' ? item[lang] : item.he);
  const full = selected.length >= MAX_EMOTIONS;

  const toggle = (id) =>
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_EMOTIONS) return prev;
      return [...prev, id];
    });

  // Library order, not tap order, so the printed columns stay stable.
  const columns = EMOTIONS.filter((e) => selected.includes(e.id));
  const ready = columns.length >= MIN_EMOTIONS;

  const trimmedName = name.trim();
  const chartTitle = trimmedName
    ? copy.chartTitleWith.replace('{name}', trimmedName)
    : copy.chartTitle;

  return (
    <div className="ck">
      <style>{STYLE}</style>

      {ready ? (
        <div className="ck-chart">
          <h2>{chartTitle}</h2>
          <table className="ck-table">
            <thead>
              <tr>
                <th scope="col" className="ck-day">
                  {copy.dayCol}
                </th>
                {columns.map((emotion) => (
                  <th key={emotion.id} scope="col" style={{ background: `${emotion.color}22` }}>
                    <span className="ck-head-emoji">{emotion.emoji}</span>
                    <span className="ck-head-text">{label(emotion)}</span>
                  </th>
                ))}
                <th scope="col" className="ck-notes">
                  {copy.notesCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <th scope="row" className="ck-day">
                    {day}
                  </th>
                  {columns.map((emotion) => (
                    <td key={emotion.id} className="ck-cell">
                      <span className="ck-dot" style={{ borderColor: `${emotion.color}99` }} />
                    </td>
                  ))}
                  <td className="ck-cell ck-notes" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="ck-needmore site-chrome">{copy.needMore}</p>
      )}

      {ready && (
        <div className="site-chrome flex justify-center mt-7">
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
        <div className="ck-name mt-12">
          <label htmlFor="ck-name-input">{copy.nameLabel}</label>
          <input
            id="ck-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={copy.namePlaceholder}
          />
        </div>

        <h2 className="text-center text-lg font-bold text-slate-700 mb-1">{copy.pickTitle}</h2>
        <p aria-live="polite" className="text-center text-sm text-slate-400 mb-4">
          {countLabel(copy, selected.length)}
        </p>

        <div className="ck-tiles">
          {EMOTIONS.map((emotion) => {
            const on = selected.includes(emotion.id);
            return (
              <button
                key={emotion.id}
                type="button"
                className="ck-tile"
                aria-pressed={on}
                disabled={!on && full}
                onClick={() => toggle(emotion.id)}
                style={on ? { borderColor: emotion.color, background: `${emotion.color}22` } : undefined}
              >
                {on && (
                  <span className="ck-tick" aria-hidden="true">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
                <span className="ck-tile-emoji">{emotion.emoji}</span>
                <span className="ck-tile-text">{label(emotion)}</span>
              </button>
            );
          })}
        </div>

        {full && <p className="ck-limit">{copy.limitReached}</p>}

        {selected.length > 0 && (
          <div className="flex justify-center mt-7">
            <button
              type="button"
              onClick={() => setSelected([])}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {copy.clear}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
