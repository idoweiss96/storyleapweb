import React, { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import Critter from '../shared/art/Critter';
import Icon from '../shared/art/Icon';
import Scene from '../shared/art/Scene';
import { LINE, SURFACE } from '../shared/art/artTokens';
import { CARS, COLORS, FAULTS, TOOLS, UI } from './garageContent';

const STYLE = `
  .gr *{box-sizing:border-box}

  .gr-counter{
    font-size:12.5px;font-weight:700;color:#5B5578;
    background:rgba(255,255,255,.85);border-radius:999px;padding:4px 14px;
  }

  .gr-driver{
    display:flex;align-items:center;gap:10px;text-align:start;
    background:rgba(255,255,255,.9);border:2.4px solid #3A3357;border-radius:16px;
    padding:8px 14px 8px 8px;max-width:340px;
  }
  .gr-driver-name{font-size:12.5px;font-weight:700;color:#6B6486}
  .gr-driver-line{font-size:14.5px;font-weight:600;color:#1A1A6E;line-height:1.4}

  .gr-car{width:min(80vw,300px);height:auto;display:block;filter:drop-shadow(0 8px 14px rgba(26,26,110,.2))}
  .gr-car.away{animation:gr-away .9s ease forwards}

  .gr-fuel{display:flex;align-items:center;gap:9px;width:min(80vw,300px)}
  .gr-fuel-label{font-size:12px;font-weight:700;color:#3A3357;flex-shrink:0}
  .gr-fuel-bar{flex:1;height:14px;border-radius:999px;background:#fff;border:2.4px solid #3A3357;overflow:hidden}
  .gr-fuel-bar i{display:block;height:100%;background:#5BC98C;transition:width .45s ease}
  .gr-fuel-bar.empty i{background:#EF6B6B}

  .gr-list{display:flex;flex-direction:column;gap:6px;width:min(80vw,300px)}
  .gr-item{
    display:flex;align-items:center;gap:9px;
    padding:8px 12px;font-size:14px;font-weight:700;
    background:#fff;border:2.4px solid #3A3357;border-radius:12px;color:#3A3357;
    transition:.2s;
  }
  .gr-item.done{background:#E8F8EE;color:#0F7B57;text-decoration:line-through}
  .gr-item-tick{
    display:grid;place-items:center;width:22px;height:22px;border-radius:999px;
    background:#EDE9F8;border:2px solid #3A3357;color:transparent;flex-shrink:0;
  }
  .gr-item.done .gr-item-tick{background:#5BC98C;color:#fff}

  .gr-status{
    font-size:14.5px;font-weight:700;color:#1A1A6E;text-align:center;min-height:21px;
    background:rgba(255,255,255,.85);border-radius:999px;padding:3px 14px;
  }
  .gr-status:empty{background:none;padding:0}
  .gr-status.nudge{color:#7A5000;background:#FFF8EC}

  .gr-title{font-size:13px;font-weight:700;color:rgba(26,26,46,.45);margin:24px 0 10px}
  .gr-tools{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:9px}
  .gr-tool{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
    min-height:96px;padding:11px 6px;text-align:center;
    background:#fff;border:2.4px solid #3A3357;border-radius:16px;
    box-shadow:0 3px 0 rgba(58,51,87,.16);
    font-family:inherit;cursor:pointer;transition:.12s;
  }
  .gr-tool:hover:not(:disabled){background:#F1FAFE;transform:translateY(-3px);box-shadow:0 6px 0 rgba(58,51,87,.16)}
  .gr-tool:active:not(:disabled){transform:translateY(0);box-shadow:0 2px 0 rgba(58,51,87,.16)}
  .gr-tool:disabled{opacity:.4;cursor:not-allowed}
  .gr-tool:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}
  .gr-tool-text{font-size:12px;font-weight:700;color:#3A3357;line-height:1.3}

  .gr-colors{display:flex;flex-wrap:wrap;gap:9px}
  .gr-color{
    width:48px;height:48px;border-radius:14px;
    border:2.4px solid #3A3357;box-shadow:0 3px 0 rgba(58,51,87,.16);
    cursor:pointer;transition:.12s;
  }
  .gr-color:hover{transform:translateY(-3px)}
  .gr-color[aria-pressed="true"]{outline:3px solid #FF6FB5;outline-offset:2px}
  .gr-color:focus-visible{outline:3px solid #1A1A6E;outline-offset:3px}

  .gr-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:22px}
  .gr-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:46px;padding:0 24px;
    font-family:inherit;font-size:15px;font-weight:700;color:#fff;
    background:#4FC3E8;border:2.4px solid #3A3357;border-radius:14px;
    box-shadow:0 4px 0 #3A3357;cursor:pointer;transition:.12s;
  }
  .gr-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 #3A3357}
  .gr-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #3A3357}
  .gr-btn.ghost{color:#3A3357;background:#fff}
  .gr-btn:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}

  .gr-done h2{font-size:21px;font-weight:800;color:#1A1A6E;margin:0}
  .gr-done p{font-size:15px;line-height:1.55;color:#4A4468;max-width:340px;margin:0;text-align:center}

  @keyframes gr-away{to{transform:translateX(120%);opacity:0}}

  @media (prefers-reduced-motion:reduce){
    .gr-car.away{animation:none;opacity:0}
    .gr-tool,.gr-tool:hover,.gr-color,.gr-color:hover,.gr-btn,.gr-btn:hover{transition:none;transform:none}
  }
`;

// Fixed dirt splotches — the same car always gets dirty the same way.
const DIRT = [
  { cx: 48, cy: 58, r: 7 },
  { cx: 74, cy: 66, r: 5 },
  { cx: 112, cy: 55, r: 6 },
  { cx: 140, cy: 64, r: 4.5 },
  { cx: 96, cy: 70, r: 5.5 },
];

function Car({ color, dirty, flat, lightOn, away }) {
  const stroke = { stroke: LINE.color, strokeWidth: 2.6, strokeLinejoin: 'round' };
  return (
    <svg className={`gr-car${away ? ' away' : ''}`} viewBox="0 0 200 100" role="img" aria-hidden="true">
      <ellipse cx="100" cy="90" rx="82" ry="6" fill="rgba(26,26,110,.12)" />
      <path d="M52 46 L68 24 Q71 20 78 20 L128 20 Q135 20 138 24 L152 46 Z" fill={color} {...stroke} />
      <rect x="18" y="44" width="164" height="32" rx="13" fill={color} {...stroke} />
      <rect x="73" y="26" width="25" height="18" rx="4" fill={SURFACE.glass} {...stroke} strokeWidth="2" />
      <rect x="104" y="26" width="25" height="18" rx="4" fill={SURFACE.glass} {...stroke} strokeWidth="2" />
      {dirty && (
        <g fill="#7A5A2E" opacity="0.5">
          {DIRT.map((d) => (
            <circle key={`${d.cx}-${d.cy}`} cx={d.cx} cy={d.cy} r={d.r} />
          ))}
        </g>
      )}
      {lightOn && <ellipse cx="180" cy="56" rx="13" ry="11" fill="#FFE9A3" opacity="0.4" />}
      <ellipse cx="180" cy="56" rx="7" ry="6" fill={lightOn ? '#FFE9A3' : SURFACE.metalDark} {...stroke} strokeWidth="2" />
      <circle cx="146" cy="76" r="14" fill="#2F3542" {...stroke} />
      <circle cx="146" cy="76" r="6" fill={SURFACE.metal} {...stroke} strokeWidth="2" />
      <ellipse cx="58" cy={flat ? 80 : 76} rx={flat ? 16 : 14} ry={flat ? 9 : 14} fill="#2F3542" {...stroke} />
      <ellipse cx="58" cy={flat ? 80 : 76} rx="6" ry={flat ? 4 : 6} fill={SURFACE.metal} {...stroke} strokeWidth="2" />
    </svg>
  );
}

export default function Garage({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [index, setIndex] = useState(0);
  const [fixed, setFixed] = useState([]);
  const [color, setColor] = useState(null);
  const [nudge, setNudge] = useState(false);
  const [away, setAway] = useState(false);

  const finished = index >= CARS.length;

  if (finished) {
    return (
      <div className="gr">
        <style>{STYLE}</style>
        <Scene variant="garage" minHeight={300}>
          <div className="gr-done" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Critter species="fox" expression="happy" size={110} />
            <h2>{copy.allDoneTitle}</h2>
            <p>{copy.allDoneText}</p>
            <button
              type="button"
              className="gr-btn site-chrome"
              onClick={() => {
                setIndex(0);
                setFixed([]);
                setColor(null);
                setAway(false);
              }}
            >
              <RotateCcw className="w-4 h-4" />
              {copy.startOver}
            </button>
          </div>
        </Scene>
      </div>
    );
  }

  const car = CARS[index];
  const info = car[lang] || car.he;
  const allFixed = car.faults.every((f) => fixed.includes(f));
  const hasFuelFault = car.faults.includes('fuel');

  const applyTool = (toolId) => {
    // A tool only does something if this car actually has the matching fault.
    const match = car.faults.find((f) => FAULTS[f].tool === toolId && !fixed.includes(f));
    if (!match) {
      setNudge(true);
      return;
    }
    setNudge(false);
    setFixed((prev) => [...prev, match]);
  };

  const driveAway = () => {
    setAway(true);
    window.setTimeout(() => {
      setIndex((prev) => prev + 1);
      setFixed([]);
      setColor(null);
      setNudge(false);
      setAway(false);
    }, 900);
  };

  const fuelPct = !hasFuelFault || fixed.includes('fuel') ? 100 : 8;

  return (
    <div className="gr">
      <style>{STYLE}</style>

      <Scene variant="garage" minHeight={430}>
        <span className="gr-counter">
          {copy.carOf.replace('{n}', String(index + 1)).replace('{total}', String(CARS.length))}
        </span>

        <div className="gr-driver">
          <Critter species={car.driver} expression={allFixed ? 'happy' : 'neutral'} size={52} label={info.name} />
          <div>
            <div className="gr-driver-name">{info.name}</div>
            <div className="gr-driver-line">{info.line}</div>
          </div>
        </div>

        <Car
          color={color || car.color}
          dirty={car.faults.includes('dirty') && !fixed.includes('dirty')}
          flat={car.faults.includes('flat') && !fixed.includes('flat')}
          lightOn={!car.faults.includes('light') || fixed.includes('light')}
          away={away}
        />

        {hasFuelFault && (
          <div className="gr-fuel">
            <span className="gr-fuel-label">{copy.fuelLabel}</span>
            <div className={`gr-fuel-bar${fuelPct < 50 ? ' empty' : ''}`}>
              <i style={{ width: `${fuelPct}%` }} />
            </div>
          </div>
        )}

        <div className="gr-list">
          {car.faults.map((fault) => (
            <div key={fault} className={`gr-item${fixed.includes(fault) ? ' done' : ''}`}>
              <span className="gr-item-tick">
                <Check className="w-3 h-3" />
              </span>
              {FAULTS[fault][lang] || FAULTS[fault].he}
            </div>
          ))}
        </div>

        <p className={`gr-status${nudge && !allFixed ? ' nudge' : ''}`} aria-live="polite">
          {allFixed ? copy.allFixed : nudge ? copy.notThis : ''}
        </p>

        {allFixed && (
          <button type="button" className="gr-btn site-chrome" onClick={driveAway}>
            {copy.drive}
          </button>
        )}
      </Scene>

      <h3 className="gr-title">{copy.toolsTitle}</h3>
      <div className="gr-tools">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className="gr-tool site-chrome"
            onClick={() => applyTool(tool.id)}
            disabled={allFixed}
          >
            {/* The tool id doubles as the Icon name. */}
            <Icon name={tool.id} size={36} />
            <span className="gr-tool-text">{tool[lang] || tool.he}</span>
          </button>
        ))}
      </div>

      {allFixed && (
        <>
          <h3 className="gr-title">{copy.paintTitle}</h3>
          <div className="gr-colors">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="gr-color site-chrome"
                style={{ background: c.value }}
                aria-pressed={(color || car.color) === c.value}
                aria-label={c[lang] || c.he}
                onClick={() => setColor(c.value)}
              />
            ))}
          </div>
        </>
      )}

      <div className="gr-actions">
        <button
          type="button"
          className="gr-btn ghost site-chrome"
          onClick={() => {
            setFixed([]);
            setColor(null);
            setNudge(false);
          }}
        >
          <RotateCcw className="w-4 h-4" />
          {copy.startOver}
        </button>
      </div>
    </div>
  );
}
