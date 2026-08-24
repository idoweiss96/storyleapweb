import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Square } from 'lucide-react';
import { CARD_STYLES } from '../shared/cardStyles';
import { PickerCard } from '../shared/ActivityCards';
import { PATTERNS, PHASE_WORDS, ROUNDS, UI } from './breathingContent';

const STYLE = `
  .br *{box-sizing:border-box}

  .br-stage{display:flex;flex-direction:column;align-items:center;gap:20px}

  .br-orb{
    position:relative;width:100%;max-width:290px;aspect-ratio:1;
    display:grid;place-items:center;
  }
  .br-ring{
    position:absolute;inset:0;border-radius:999px;
    border:2px dashed rgba(26,26,110,.14);
  }
  .br-ball{
    border-radius:999px;
    display:grid;place-items:center;
    width:38%;height:38%;
    box-shadow:0 10px 34px rgba(255,111,181,.28);
  }
  .br-ball-inner{font-size:38px;line-height:1}

  .br-phase{
    text-align:center;font-size:26px;font-weight:800;color:#1A1A6E;
    margin:0;min-height:34px;
  }
  .br-count{
    text-align:center;font-size:15px;color:rgba(26,26,46,.45);margin:0;min-height:22px;
    font-variant-numeric:tabular-nums;
  }

  .br-note{
    text-align:center;font-size:15px;line-height:1.6;color:rgba(26,26,46,.6);
    max-width:420px;margin:0 auto;
  }

  .br-rounds{display:flex;gap:8px;justify-content:center;margin-top:10px}
  .br-round{
    min-width:64px;padding:11px 16px;
    font-family:inherit;font-size:15px;font-weight:700;color:#1A1A6E;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    cursor:pointer;transition:.15s;
  }
  .br-round:hover{border-color:#FF6FB5;background:#FFF8FB}
  .br-round[aria-pressed="true"]{border-color:#FF6FB5;border-width:2.5px;background:#FFD6EC}
  .br-round:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  @media (prefers-reduced-motion:reduce){
    .br-ball{transition:none !important}
  }
`;

export default function Breathing({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const words = PHASE_WORDS[lang] || PHASE_WORDS.he;

  const [pattern, setPattern] = useState(null);
  const [rounds, setRounds] = useState(ROUNDS[0]);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [left, setLeft] = useState(0);
  const [finished, setFinished] = useState(false);

  const timer = useRef(null);

  const pick = (item) => item[lang] || item.he;

  const stop = () => {
    clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => () => stop(), []);

  // One interval drives the whole session: it counts a phase down, then hands
  // over to the next phase, and bumps the round when the pattern wraps.
  const run = () => {
    setRunning(true);
    setFinished(false);
    setRound(1);
    setPhaseIndex(0);
    setLeft(pattern.phases[0].seconds);

    let currentPhase = 0;
    let currentRound = 1;
    let remaining = pattern.phases[0].seconds;

    stop();
    timer.current = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setLeft(remaining);
        return;
      }

      currentPhase += 1;
      if (currentPhase >= pattern.phases.length) {
        currentPhase = 0;
        currentRound += 1;
        if (currentRound > rounds) {
          stop();
          setRunning(false);
          setFinished(true);
          setLeft(0);
          return;
        }
        setRound(currentRound);
      }

      remaining = pattern.phases[currentPhase].seconds;
      setPhaseIndex(currentPhase);
      setLeft(remaining);
    }, 1000);
  };

  const halt = () => {
    stop();
    setRunning(false);
    setFinished(false);
    setRound(0);
    setPhaseIndex(0);
    setLeft(0);
  };

  if (!pattern) {
    return (
      <div className="ac-deck br">
        <style>{CARD_STYLES + STYLE}</style>
        <h2 className="text-center text-lg font-bold text-slate-700 mb-5">{copy.pickTitle}</h2>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {PATTERNS.map((item) => (
            <PickerCard
              key={item.id}
              emoji={item.emoji}
              label={pick(item).label}
              selected={false}
              onClick={() => setPattern(item)}
            />
          ))}
        </div>
      </div>
    );
  }

  const text = pick(pattern);
  const phase = pattern.phases[phaseIndex];
  // The ball is large on the in-breath, small on the out-breath, and holds where
  // it is during a hold — so the shape itself tells you what to do.
  const scale = !running ? 0.62 : phase.kind === 'in' ? 1 : phase.kind === 'out' ? 0.5 : undefined;

  return (
    <div className="br">
      <style>{STYLE}</style>

      <div className="br-stage">
        <div className="br-orb">
          <span className="br-ring" />
          <span
            className="br-ball"
            style={{
              background: `linear-gradient(145deg, ${pattern.color}, ${pattern.color}99)`,
              transform: `scale(${scale ?? 1})`,
              width: running ? '100%' : '38%',
              height: running ? '100%' : '38%',
              transition: running ? `transform ${phase.seconds}s ease-in-out` : 'transform .4s',
            }}
          >
            <span className="br-ball-inner">{pattern.emoji}</span>
          </span>
        </div>

        <div aria-live="polite" className="w-full">
          <p className="br-phase">{running ? words[phase.kind] : finished ? copy.done : text.label}</p>
          <p className="br-count">
            {running
              ? `${left} · ${copy.roundOf.replace('{n}', round).replace('{total}', rounds)}`
              : finished
                ? copy.doneNote
                : ''}
          </p>
        </div>

        {!running && !finished && <p className="br-note site-chrome">{text.note}</p>}

        {!running && (
          <div className="site-chrome">
            <h3 className="text-center text-sm font-bold text-slate-500 mb-2">{copy.roundsTitle}</h3>
            <div className="br-rounds">
              {ROUNDS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className="br-round"
                  aria-pressed={rounds === n}
                  onClick={() => setRounds(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="site-chrome flex flex-wrap gap-3 justify-center mt-2">
          {running ? (
            <button
              type="button"
              onClick={halt}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Square className="w-4 h-4" />
              {copy.stop}
            </button>
          ) : (
            <button
              type="button"
              onClick={run}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-base font-semibold shadow-lg active:scale-[.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
            >
              <Play className="w-4 h-4" />
              {finished ? copy.again : copy.start}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              halt();
              setPattern(null);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {copy.change}
          </button>
        </div>
      </div>
    </div>
  );
}
