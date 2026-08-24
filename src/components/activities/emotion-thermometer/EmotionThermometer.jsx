import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import { CARD_STYLES } from '../shared/cardStyles';
import { PickerCard } from '../shared/ActivityCards';
import { FEELINGS, UI, bandFor } from './emotionThermometerContent';

const LEVELS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const STYLE = `
  .et-stage{display:flex;gap:22px;align-items:stretch;justify-content:center}

  .et-tube{
    display:flex;flex-direction:column;gap:4px;
    width:76px;padding:8px;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:999px;
    box-shadow:0 4px 18px rgba(26,26,110,.10);
  }
  .et-seg{
    flex:1;min-height:26px;border-radius:999px;cursor:pointer;
    background:#F4F4F9;border:0;
    display:grid;place-items:center;
    font-family:inherit;font-size:12px;font-weight:700;color:rgba(26,26,46,.30);
    transition:background .16s, color .16s, transform .12s;
  }
  .et-seg:hover{transform:scale(1.04)}
  .et-seg:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .et-seg.on{color:#fff}

  .et-bulb{
    width:60px;height:60px;border-radius:999px;margin:2px auto 0;
    border:1.5px solid #EDE9F8;background:#F4F4F9;
    display:grid;place-items:center;font-size:26px;
    transition:background .16s;
  }

  .et-readout{flex:1;max-width:340px;display:flex;flex-direction:column;justify-content:center}

  .et-level{
    display:inline-flex;align-items:baseline;gap:8px;
    font-size:15px;color:rgba(26,26,46,.55);margin-bottom:6px;
  }
  .et-level b{font-size:34px;line-height:1;color:#1A1A6E}

  .et-band{font-size:20px;font-weight:700;margin:0 0 16px}

  .et-block{margin-bottom:14px}
  .et-block h3{
    font-size:12px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.42);margin:0 0 4px;
  }
  .et-block p{font-size:15px;line-height:1.6;color:#334155;margin:0}

  .et-empty{
    display:grid;place-items:center;text-align:center;
    color:rgba(26,26,46,.4);font-size:15px;line-height:1.6;padding:20px 10px;
  }

  @media (max-width:520px){
    .et-stage{gap:16px}
    .et-tube{width:62px}
    .et-seg{min-height:22px;font-size:11px}
  }

  @media (prefers-reduced-motion:reduce){
    .et-seg,.et-seg:hover{transition:none;transform:none}
  }

  @media print{
    .et-tube{box-shadow:none}
    .et-stage{break-inside:avoid}
  }
`;

export default function EmotionThermometer({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [feeling, setFeeling] = useState(null);
  const [level, setLevel] = useState(null);

  if (!feeling) {
    return (
      <div className="ac-deck">
        <style>{CARD_STYLES}</style>
        <h2 className="text-center text-lg font-bold text-slate-700 mb-5">{copy.pickTitle}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {FEELINGS.map((item) => (
            <PickerCard
              key={item.id}
              emoji={item.emoji}
              label={(item[lang] || item.he).label}
              selected={false}
              onClick={() => setFeeling(item)}
            />
          ))}
        </div>
      </div>
    );
  }

  const feelingText = feeling[lang] || feeling.he;
  const band = level ? bandFor(level) : null;
  const bandText = band ? band[lang] || band.he : null;

  return (
    <div>
      <style>{STYLE}</style>

      <h2 className="text-center text-lg font-bold text-slate-700 mb-1">
        {copy.scaleTitle.replace('{feeling}', feelingText.label)}
      </h2>
      <p className="site-chrome text-center text-sm text-slate-400 mb-6">{copy.scaleHint}</p>

      <div className="et-stage">
        <div>
          <div className="et-tube">
            {LEVELS.map((value) => {
              const filled = level !== null && value <= level;
              return (
                <button
                  key={value}
                  type="button"
                  className={`et-seg${filled ? ' on' : ''}`}
                  style={filled ? { background: bandFor(level).color } : undefined}
                  aria-pressed={level === value}
                  aria-label={`${copy.levelWord} ${value}`}
                  onClick={() => setLevel(value)}
                >
                  {value}
                </button>
              );
            })}
          </div>
          <div
            className="et-bulb"
            style={level !== null ? { background: bandFor(level).color } : undefined}
            aria-hidden="true"
          >
            {feeling.emoji}
          </div>
        </div>

        <div className="et-readout" aria-live="polite">
          {band ? (
            <>
              <span className="et-level">
                {copy.levelWord} <b>{level}</b>
              </span>
              <p className="et-band" style={{ color: band.color }}>
                {bandText.label}
              </p>

              <div className="et-block">
                <h3>{copy.looksLabel}</h3>
                <p>{bandText.looks}</p>
              </div>

              <div className="et-block">
                <h3>{copy.helpsLabel}</h3>
                <p>{bandText.helps}</p>
              </div>
            </>
          ) : (
            <p className="et-empty">{copy.scaleHint}</p>
          )}
        </div>
      </div>

      <div className="site-chrome flex flex-wrap gap-3 justify-center mt-9">
        <button
          type="button"
          onClick={() => {
            setFeeling(null);
            setLevel(null);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {copy.changeFeeling}
        </button>
        {band && (
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg active:scale-[.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
          >
            <Printer className="w-4 h-4" />
            {copy.print}
          </button>
        )}
      </div>
    </div>
  );
}
