import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { LABELS, PRESETS, UI } from './visualTimerContent';

const SIZE = 260;
const C = SIZE / 2;
const R = 112;

const STYLE = `
  .vt *{box-sizing:border-box}

  .vt-stage{display:flex;flex-direction:column;align-items:center;gap:18px}
  .vt-label{
    text-align:center;font-size:20px;font-weight:700;color:#1A1A6E;
    margin:0;line-height:1.35;min-height:28px;
  }
  .vt-label span{font-size:26px;margin-inline-end:8px}

  .vt-dial{width:100%;max-width:300px}
  .vt-svg{width:100%;height:auto;display:block;filter:drop-shadow(0 8px 26px rgba(26,26,110,.13))}

  .vt-clock{font-size:44px;font-weight:800;fill:#1A1A6E;font-variant-numeric:tabular-nums}
  .vt-done{font-size:22px;font-weight:800;fill:#1A1A6E}

  .vt-field{max-width:380px;margin:0 auto 18px}
  .vt-field label{display:block;font-size:13.5px;font-weight:600;color:#1A1A6E;margin-bottom:7px;text-align:center}
  .vt-field input{
    width:100%;font-family:inherit;font-size:16px;color:#1a1a2e;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;padding:12px 14px;
    transition:border-color .18s;
  }
  .vt-field input:focus{border-color:#FF6FB5;outline:none}

  .vt-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:9px}
  .vt-chip{
    display:inline-flex;align-items:center;gap:7px;
    font-family:inherit;font-size:14px;font-weight:600;color:#1A1A6E;
    background:rgba(26,26,110,.055);border:1.5px solid transparent;border-radius:999px;
    padding:9px 15px;cursor:pointer;transition:.15s;
  }
  .vt-chip:hover{background:rgba(26,26,110,.1)}
  .vt-chip:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .vt-times{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;max-width:380px;margin:0 auto}
  @media (min-width:520px){.vt-times{grid-template-columns:repeat(6,1fr)}}
  .vt-time{
    display:grid;place-items:center;min-height:56px;
    font-family:inherit;font-size:15px;font-weight:700;color:#1A1A6E;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    cursor:pointer;transition:.15s;
  }
  .vt-time:hover{border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .vt-time[aria-pressed="true"]{border-color:#FF6FB5;border-width:2.5px;background:#FFD6EC}
  .vt-time:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  @media (prefers-reduced-motion:reduce){
    .vt-time,.vt-time:hover{transition:none;transform:none}
    .vt-arc{transition:none !important}
  }
`;

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function VisualTimer({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [label, setLabel] = useState('');
  const [minutes, setMinutes] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);

  const tick = useRef(null);
  const deadline = useRef(null);

  const chipLabel = (item) => (typeof item[lang] === 'string' ? item[lang] : item.he);

  useEffect(() => () => clearInterval(tick.current), []);

  const stopTicking = () => {
    clearInterval(tick.current);
    tick.current = null;
  };

  // Drive from a wall-clock deadline rather than by decrementing a counter:
  // setInterval drifts, and a backgrounded tab throttles it badly.
  const startTicking = (seconds) => {
    deadline.current = Date.now() + seconds * 1000;
    stopTicking();
    tick.current = setInterval(() => {
      const left = Math.max(0, Math.round((deadline.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        stopTicking();
        setRunning(false);
      }
    }, 200);
    setRunning(true);
  };

  const choose = (preset) => {
    stopTicking();
    setRunning(false);
    setMinutes(preset.minutes);
    setRemaining(preset.minutes * 60);
  };

  const toggle = () => {
    if (running) {
      stopTicking();
      setRunning(false);
    } else if (remaining > 0) {
      startTicking(remaining);
    }
  };

  const reset = () => {
    stopTicking();
    setRunning(false);
    setRemaining(minutes ? minutes * 60 : 0);
  };

  const total = minutes ? minutes * 60 : 0;
  const fraction = total > 0 ? remaining / total : 0;
  const finished = total > 0 && remaining === 0;

  // The arc shrinks clockwise from a full circle, drawn with a dash offset so
  // there is no arc-flag edge case at exactly 100%.
  const circumference = 2 * Math.PI * R;

  return (
    <div className="vt">
      <style>{STYLE}</style>

      <div className="vt-stage">
        <p className="vt-label">
          {label.trim() ? label.trim() : ' '}
        </p>

        <div className="vt-dial">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="vt-svg" role="img" aria-label={copy.title}>
            <circle cx={C} cy={C} r={R} fill="#fff" stroke="#F0EDF8" strokeWidth="22" />
            <circle
              className="vt-arc"
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke={finished ? '#CFC9E4' : '#FF6FB5'}
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - fraction)}
              transform={`rotate(-90 ${C} ${C})`}
              style={{ transition: 'stroke-dashoffset .3s linear, stroke .3s' }}
            />
            {finished ? (
              <text x={C} y={C} textAnchor="middle" dominantBaseline="central" className="vt-done">
                {copy.done}
              </text>
            ) : (
              <text x={C} y={C} textAnchor="middle" dominantBaseline="central" className="vt-clock">
                {Math.floor(remaining / 60)}:{pad(remaining % 60)}
              </text>
            )}
          </svg>
        </div>

        <div aria-live="polite" className="text-center min-h-[24px]">
          {finished && <p className="text-slate-500">{copy.doneNote}</p>}
        </div>

        {minutes && (
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={toggle}
              disabled={finished}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-base font-semibold shadow-lg transition-transform disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]"
              style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? copy.pause : remaining === total ? copy.start : copy.resume}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {copy.reset}
            </button>
          </div>
        )}
      </div>

      <div className="mt-12">
        <div className="vt-field">
          <label htmlFor="vt-label-input">{copy.labelTitle}</label>
          <input
            id="vt-label-input"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={copy.labelPlaceholder}
          />
          <div className="vt-chips">
            {LABELS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="vt-chip"
                onClick={() => setLabel(chipLabel(item))}
              >
                <span>{item.emoji}</span>
                {chipLabel(item)}
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-center text-lg font-bold text-slate-700 mb-4">{copy.timeTitle}</h2>
        <div className="vt-times">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="vt-time"
              aria-pressed={minutes === preset.minutes}
              onClick={() => choose(preset)}
            >
              {chipLabel(preset)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
