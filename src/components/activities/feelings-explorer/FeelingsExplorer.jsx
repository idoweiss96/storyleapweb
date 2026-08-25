import SaveToSpace from '../shared/SaveToSpace';
import React, { useState } from 'react';
import { Printer, RotateCcw, Undo2 } from 'lucide-react';
import { ANSWER_STYLES } from '../shared/cardStyles';
import { PrintableAnswer } from '../shared/ActivityCards';
import { CORE, UI } from './feelingsExplorerContent';

// Donut geometry. Angles are degrees from 12 o'clock, growing clockwise.
const SIZE = 340;
const C = SIZE / 2;
const R_OUT = 162;
const R_IN = 62;
const R_LABEL = (R_OUT + R_IN) / 2;

const STYLE = `
  .fx-wrap{width:100%;max-width:400px;margin:0 auto}
  .fx-svg{width:100%;height:auto;display:block;filter:drop-shadow(0 8px 24px rgba(26,26,110,.12))}

  .fx-seg{cursor:pointer;transition:opacity .16s}
  .fx-seg:hover .fx-seg-path{opacity:.82}
  .fx-seg:focus-visible{outline:none}
  .fx-seg:focus-visible .fx-seg-path{stroke:#1A1A6E;stroke-width:3.5}

  .fx-ring{animation:fx-in .32s cubic-bezier(.22,1,.36,1) both}
  @keyframes fx-in{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}

  .fx-hub{cursor:default}
  .fx-hub.can-back{cursor:pointer}
  .fx-hub.can-back:hover circle{fill:#FFF0F7}

  .fx-crumbs{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:7px;margin-bottom:16px;min-height:30px}
  .fx-crumb{
    display:inline-flex;align-items:center;gap:5px;
    font-size:13.5px;font-weight:600;color:#1A1A6E;
    background:rgba(26,26,110,.06);border-radius:999px;padding:5px 12px;
  }
  .fx-sep{color:rgba(26,26,46,.3);font-size:12px}

  .fx-step{text-align:center;font-size:16px;font-weight:700;color:#334155;margin:0 0 14px}

  .fx-result{
    background:#fff;border:1.5px solid #EDE9F8;border-radius:20px;
    padding:26px 22px;box-shadow:0 6px 24px rgba(26,26,110,.08);
    break-inside:avoid;
  }
  .fx-path{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;margin-bottom:20px}
  .fx-path-item{
    display:inline-flex;align-items:center;gap:6px;
    font-size:15px;font-weight:700;color:#1A1A6E;
    border-radius:999px;padding:7px 14px;
  }
  .fx-means{
    font-size:16px;line-height:1.65;color:#334155;text-align:center;
    margin:0 0 20px;
  }
  .fx-block{border-top:1px solid #F1F1F8;padding-top:16px;margin-top:4px}
  .fx-block h3{
    font-size:12px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.42);margin:0 0 5px;text-align:center;
  }
  .fx-block p{font-size:16px;line-height:1.6;color:#1A1A6E;margin:0;text-align:center;font-weight:600}

  @media (prefers-reduced-motion:reduce){
    .fx-ring{animation:none}
  }

  @media print{
    .fx-result{box-shadow:none}
    /* Outrank ".fx-block p", which styles the question and would otherwise
       render the child's own answer as a bold centred heading. */
    .fx-block .ac-answer-print{
      font-weight:400;color:#334155;font-size:15px;margin-top:10px;text-align:start;
    }
  }
`;

function pointOnCircle(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: C + radius * Math.sin(rad), y: C - radius * Math.cos(rad) };
}

/** Donut wedge: out along the outer arc, in along the inner arc, closed. */
function wedgePath(start, sweep) {
  const end = start + sweep;
  const large = sweep > 180 ? 1 : 0;
  const o1 = pointOnCircle(start, R_OUT);
  const o2 = pointOnCircle(end, R_OUT);
  const i2 = pointOnCircle(end, R_IN);
  const i1 = pointOnCircle(start, R_IN);
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${R_OUT} ${R_OUT} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${R_IN} ${R_IN} 0 ${large} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

/** Mix a hex colour toward white. Saves authoring a palette per level. */
function tint(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift) => {
    const c = (n >> shift) & 255;
    return Math.round(c + (255 - c) * amount);
  };
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

/** Greedy wrap so long situation labels stay inside their wedge. */
function wrapLabel(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function WedgeLabel({ x, y, lines, size }) {
  const lead = size * 1.18;
  const start = -((lines.length - 1) / 2) * lead;
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: size, fontWeight: 600, fill: '#1a1a2e', pointerEvents: 'none' }}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? start : lead}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function FeelingsExplorer({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [core, setCore] = useState(null);
  const [branch, setBranch] = useState(null);
  const [leaf, setLeaf] = useState(null);

  // Answers are keyed by the full path, so stepping back to explore another
  // route and returning brings the child's own words back with them.
  const [answers, setAnswers] = useState({});

  const pick = (t) => t[lang] || t.he;
  const leafText = (l) => (typeof l[lang] === 'string' ? l[lang] : l.he);

  const stepBack = () => {
    if (leaf) setLeaf(null);
    else if (branch) setBranch(null);
    else if (core) setCore(null);
  };

  const restart = () => {
    setCore(null);
    setBranch(null);
    setLeaf(null);
    setAnswers({});
  };

  // Which options the wheel is showing right now
  let options;
  let stepLabel;
  let fontSize;
  let maxChars;

  if (!core) {
    options = CORE.map((item) => ({
      key: item.id,
      label: pick(item).label,
      emoji: item.emoji,
      fill: item.color,
      onPick: () => setCore(item),
    }));
    stepLabel = copy.stepCore;
    fontSize = 15;
    maxChars = 8;
  } else if (!branch) {
    options = core.branches.map((b, i) => ({
      key: b.id,
      label: pick(b).label,
      emoji: b.emoji,
      fill: tint(core.color, 0.14 + i * 0.1),
      onPick: () => setBranch(b),
    }));
    stepLabel = copy.stepBranch;
    fontSize = 14;
    maxChars = 10;
  } else {
    const withOther = [...branch.leaves, { id: '__other__', he: copy.otherOption, en: copy.otherOption }];
    options = withOther.map((l, i) => ({
      key: l.id,
      label: leafText(l),
      fill: tint(core.color, 0.34 + i * 0.09),
      onPick: () => setLeaf(l),
    }));
    stepLabel = copy.stepLeaf;
    fontSize = 12;
    maxChars = 13;
  }

  const crumbs = [
    core && { key: 'c', label: pick(core).label, emoji: core.emoji, fill: tint(core.color, 0.55) },
    branch && { key: 'b', label: pick(branch).label, emoji: branch.emoji, fill: tint(core.color, 0.7) },
    leaf && { key: 'l', label: leafText(leaf), fill: tint(core.color, 0.82) },
  ].filter(Boolean);

  // ---- Result ----
  if (leaf) {
    const branchText = pick(branch);
    const isOther = leaf.id === '__other__';
    const pathKey = `${core.id}:${branch.id}:${leaf.id}`;
    return (
      <div>
        <style>{ANSWER_STYLES + STYLE}</style>

        <h2 className="fx-step">{copy.resultTitle}</h2>

        <div className="fx-result">
          <div className="fx-path">
            {crumbs.map((crumb, i) => (
              <React.Fragment key={crumb.key}>
                {i > 0 && <span className="fx-sep">←</span>}
                <span className="fx-path-item" style={{ background: crumb.fill }}>
                  {crumb.emoji && <span>{crumb.emoji}</span>}
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>

          <p className="fx-means">{isOther ? copy.otherMeans : branchText.means}</p>

          <div className="fx-block">
            <h3>{copy.talkAbout}</h3>
            <p>{branchText.question}</p>
            <PrintableAnswer
              value={answers[pathKey]}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [pathKey]: value }))}
              placeholder={copy.answerPlaceholder}
              ariaLabel={branchText.question}
            />
          </div>
        </div>

        <div className="site-chrome flex flex-wrap gap-3 justify-center mt-7">
          <button
            type="button"
            onClick={stepBack}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
            {copy.back}
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {copy.restart}
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
            slug="feelings-explorer"
            lang={lang}
            getEntry={() => (leaf || branch || core ? {
              summary: (leaf || branch || core)?.[lang] || (leaf || branch || core)?.he || (leaf || branch || core)?.label || undefined,
              payload: { core, branch, leaf, answers },
            } : null)}
          />
        </div>
      </div>
    );
  }

  // ---- Wheel ----
  const sweep = 360 / options.length;

  return (
    <div>
      <style>{STYLE}</style>

      <div className="fx-crumbs site-chrome">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.key}>
            {i > 0 && <span className="fx-sep">←</span>}
            <span className="fx-crumb" style={{ background: crumb.fill }}>
              {crumb.emoji && <span>{crumb.emoji}</span>}
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </div>

      <h2 className="fx-step">{stepLabel}</h2>

      <div className="fx-wrap">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="fx-svg" role="group" aria-label={stepLabel}>
          <g className="fx-ring" key={`${core?.id || 'root'}-${branch?.id || ''}`}>
            {options.map((option, i) => {
              const start = i * sweep;
              const at = pointOnCircle(start + sweep / 2, R_LABEL);
              const lines = wrapLabel(option.label, maxChars);
              return (
                <g
                  key={option.key}
                  className="fx-seg"
                  role="button"
                  tabIndex={0}
                  aria-label={option.label}
                  onClick={option.onPick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      option.onPick();
                    }
                  }}
                >
                  <path
                    className="fx-seg-path"
                    d={wedgePath(start, sweep)}
                    fill={option.fill}
                    stroke="#fff"
                    strokeWidth="2.5"
                  />
                  {option.emoji && (
                    <text
                      x={pointOnCircle(start + sweep / 2, R_LABEL + 34).x}
                      y={pointOnCircle(start + sweep / 2, R_LABEL + 34).y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: 17, pointerEvents: 'none' }}
                    >
                      {option.emoji}
                    </text>
                  )}
                  <WedgeLabel x={at.x} y={at.y} lines={lines} size={fontSize} />
                </g>
              );
            })}
          </g>

          {/* Hub doubles as the back control once there is somewhere to go back to */}
          <g
            className={`fx-hub${core ? ' can-back' : ''}`}
            onClick={core ? stepBack : undefined}
            role={core ? 'button' : undefined}
            tabIndex={core ? 0 : undefined}
            aria-label={core ? copy.back : undefined}
            onKeyDown={(e) => {
              if (core && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                stepBack();
              }
            }}
          >
            <circle cx={C} cy={C} r={R_IN - 4} fill="#fff" stroke="#F0E8F5" strokeWidth="2" />
            <text
              x={C}
              y={C}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fontSize: 13, fontWeight: 700, fill: '#1A1A6E', pointerEvents: 'none' }}
            >
              {core ? (
                <tspan x={C} dy={0}>↩</tspan>
              ) : (
                wrapLabel(copy.centerStart, 10).map((line, i) => (
                  <tspan key={line} x={C} dy={i === 0 ? -7 : 16}>
                    {line}
                  </tspan>
                ))
              )}
            </text>
          </g>
        </svg>
      </div>

      {core && (
        <div className="site-chrome flex flex-wrap gap-3 justify-center mt-7">
          <button
            type="button"
            onClick={stepBack}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
            {copy.back}
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {copy.restart}
          </button>
        </div>
      )}
    </div>
  );
}
