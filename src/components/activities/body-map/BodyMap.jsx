import SaveToSpace from '../shared/SaveToSpace';
import React, { useState } from 'react';
import { Printer, RotateCcw } from 'lucide-react';
import { ANSWER_STYLES, CARD_STYLES } from '../shared/cardStyles';
import { PickerCard, PrintableAnswer } from '../shared/ActivityCards';
import { EMOTIONS, REGIONS, UI } from './bodyMapContent';

const IDLE = '#EFEFF6';
const OUTLINE = '#CFC9E4';

const STYLE = `
  .bm *{box-sizing:border-box}

  .bm-stage{display:flex;flex-wrap:wrap;gap:26px;align-items:flex-start;justify-content:center}
  .bm-figure{width:100%;max-width:250px;flex:0 0 auto}
  .bm-svg{width:100%;height:auto;display:block;filter:drop-shadow(0 6px 20px rgba(26,26,110,.10))}

  .bm-region{cursor:pointer}
  .bm-region shape,.bm-region *{transition:fill .18s}
  .bm-region:hover *{opacity:.85}
  .bm-region:focus-visible{outline:none}
  .bm-region:focus-visible *{stroke:#1A1A6E;stroke-width:3}

  .bm-side{flex:1;min-width:250px;max-width:360px}

  .bm-summary{
    background:#fff;border:1.5px solid #EDE9F8;border-radius:18px;
    padding:20px 18px;box-shadow:0 4px 18px rgba(26,26,110,.07);
    break-inside:avoid;
  }
  .bm-summary-line{
    font-size:18px;line-height:1.6;color:#1A1A6E;font-weight:700;margin:0 0 4px;
  }
  .bm-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
  .bm-chip{
    display:inline-flex;align-items:center;
    font-size:14.5px;font-weight:600;color:#1A1A6E;
    border-radius:999px;padding:6px 13px;
  }
  .bm-none{color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;margin:0}

  .bm-block{border-top:1px solid #F1F1F8;padding-top:14px;margin-top:16px}
  .bm-block h3{
    font-size:12px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.42);margin:0 0 5px;
  }
  .bm-block p{font-size:16px;line-height:1.55;color:#1A1A6E;margin:0;font-weight:600}

  .bm-hint{text-align:center;font-size:13.5px;color:rgba(26,26,46,.45);margin:10px 0 0}

  @media (prefers-reduced-motion:reduce){
    .bm-region *{transition:none}
  }

  @media print{
    .bm-svg{filter:none}
    .bm-summary{box-shadow:none}
    .bm-stage{gap:20px}
  }
`;

/**
 * A deliberately simple, friendly figure built from primitives rather than
 * hand-written paths — easier to keep symmetrical, and it reads at any size.
 * Each region is one <g>, so arms (two shapes) toggle as a single place.
 */
function Figure({ marked, color, onToggle, regionLabel }) {
  const fill = (id) => (marked.includes(id) ? color : IDLE);

  const region = (id) => ({
    className: 'bm-region',
    role: 'button',
    tabIndex: 0,
    'aria-pressed': marked.includes(id),
    'aria-label': regionLabel(id),
    onClick: () => onToggle(id),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle(id);
      }
    },
  });

  const stroke = { stroke: OUTLINE, strokeWidth: 2 };

  return (
    <svg viewBox="0 0 200 400" className="bm-svg" role="group">
      {/* legs first so the torso overlaps their tops cleanly */}
      <g {...region('legs')}>
        <rect x="66" y="216" width="28" height="120" rx="14" fill={fill('legs')} {...stroke} />
        <rect x="106" y="216" width="28" height="120" rx="14" fill={fill('legs')} {...stroke} />
      </g>
      <g {...region('feet')}>
        <ellipse cx="80" cy="348" rx="18" ry="13" fill={fill('feet')} {...stroke} />
        <ellipse cx="120" cy="348" rx="18" ry="13" fill={fill('feet')} {...stroke} />
      </g>

      <g {...region('arms')}>
        <rect x="30" y="104" width="24" height="104" rx="12" fill={fill('arms')} {...stroke} />
        <rect x="146" y="104" width="24" height="104" rx="12" fill={fill('arms')} {...stroke} />
      </g>
      <g {...region('hands')}>
        <circle cx="42" cy="220" r="15" fill={fill('hands')} {...stroke} />
        <circle cx="158" cy="220" r="15" fill={fill('hands')} {...stroke} />
      </g>

      <g {...region('tummy')}>
        <rect x="60" y="160" width="80" height="62" rx="20" fill={fill('tummy')} {...stroke} />
      </g>
      <g {...region('chest')}>
        <rect x="58" y="98" width="84" height="66" rx="22" fill={fill('chest')} {...stroke} />
      </g>
      <g {...region('throat')}>
        <rect x="86" y="76" width="28" height="26" rx="11" fill={fill('throat')} {...stroke} />
      </g>
      <g {...region('head')}>
        <circle cx="100" cy="46" r="34" fill={fill('head')} {...stroke} />
      </g>
    </svg>
  );
}

export default function BodyMap({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [emotion, setEmotion] = useState(null);
  const [marked, setMarked] = useState([]);
  const [answer, setAnswer] = useState('');

  const label = (item) => (typeof item[lang] === 'string' ? item[lang] : item.he);
  const regionLabel = (id) => label(REGIONS.find((r) => r.id === id));

  const toggle = (id) =>
    setMarked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  if (!emotion) {
    return (
      <div className="ac-deck bm">
        <style>{CARD_STYLES + STYLE}</style>
        <h2 className="text-center text-lg font-bold text-slate-700 mb-5">{copy.pickTitle}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {EMOTIONS.map((item) => (
            <PickerCard
              key={item.id}
              emoji={item.emoji}
              label={label(item)}
              selected={false}
              onClick={() => setEmotion(item)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Read head-to-toe rather than in tap order, so the printed line reads naturally.
  const orderedMarks = REGIONS.filter((r) => marked.includes(r.id));

  return (
    <div className="bm">
      <style>{ANSWER_STYLES + STYLE}</style>

      <h2 className="site-chrome text-center text-lg font-bold text-slate-700 mb-1">
        {copy.mapTitle}
      </h2>
      <p className="site-chrome bm-hint mb-5">{copy.mapHint}</p>

      <div className="bm-stage">
        <div className="bm-figure">
          <Figure
            marked={marked}
            color={emotion.color}
            onToggle={toggle}
            regionLabel={regionLabel}
          />
        </div>

        <div className="bm-side">
          <div className="bm-summary">
            {orderedMarks.length === 0 ? (
              <p className="bm-none">{copy.nothingMarked}</p>
            ) : (
              <>
                <p className="bm-summary-line">
                  {copy.summaryPrefix} {emotion.emoji} {label(emotion)}
                </p>
                <div className="bm-chips">
                  {orderedMarks.map((r) => (
                    <span
                      key={r.id}
                      className="bm-chip"
                      style={{ background: `${emotion.color}44` }}
                    >
                      {label(r)}
                    </span>
                  ))}
                </div>

                <div className="bm-block">
                  <h3>{copy.questionLabel}</h3>
                  <p>{copy.question}</p>
                  <PrintableAnswer
                    value={answer}
                    onChange={setAnswer}
                    placeholder={copy.answerPlaceholder}
                    ariaLabel={copy.question}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="site-chrome flex flex-wrap gap-3 justify-center mt-8">
        <button
          type="button"
          onClick={() => {
            setEmotion(null);
            setMarked([]);
            setAnswer('');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {copy.changeEmotion}
        </button>
        {marked.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setMarked([])}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
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
              slug="body-map"
              lang={lang}
              getEntry={() => (emotion && marked.length > 0 ? {
                summary: `${emotion?.emoji || ''} ${marked.length} ${lang === 'he' ? 'מקומות בגוף' : 'body spots'}`.trim(),
                payload: { emotion, marked, answer },
              } : null)}
            />
          </>
        )}
      </div>
    </div>
  );
}
