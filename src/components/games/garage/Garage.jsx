import React, { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { CARS, COLORS, FAULTS, TOOLS, UI } from './garageContent';

const STYLE = `
  .gr *{box-sizing:border-box}

  .gr-bay{
    display:flex;flex-direction:column;align-items:center;gap:14px;
    padding:22px 18px;
    background:linear-gradient(160deg,#fff 0%,#F2FBFE 100%);
    border:2px solid #EDE9F8;border-radius:22px;
    box-shadow:0 4px 18px rgba(26,26,110,.08);
  }
  .gr-counter{font-size:12.5px;font-weight:700;color:rgba(26,26,46,.42)}

  .gr-driver{display:flex;align-items:center;gap:11px;text-align:start}
  .gr-driver-emoji{font-size:34px;line-height:1}
  .gr-driver-name{font-size:13px;font-weight:700;color:rgba(26,26,46,.45)}
  .gr-driver-line{font-size:15px;font-weight:600;color:#1A1A6E;line-height:1.4}

  .gr-car{width:min(84vw,320px);height:auto;display:block}
  .gr-car.away{animation:gr-away .9s ease forwards}

  .gr-fuel{
    display:flex;align-items:center;gap:9px;
    width:min(84vw,320px);
  }
  .gr-fuel-label{font-size:12px;font-weight:700;color:rgba(26,26,46,.45);flex-shrink:0}
  .gr-fuel-bar{flex:1;height:11px;border-radius:999px;background:#EDE9F8;overflow:hidden}
  .gr-fuel-bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#5BC98C,#4FC3E8);transition:width .45s ease}
  .gr-fuel-bar.empty i{background:#EF6B6B}

  .gr-list{display:flex;flex-direction:column;gap:7px;width:min(84vw,320px)}
  .gr-item{
    display:flex;align-items:center;gap:9px;
    padding:9px 13px;font-size:14.5px;font-weight:600;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;color:#1A1A6E;
    transition:.2s;
  }
  .gr-item.done{border-color:#5BC98C;background:#F2FCF7;color:#0F7B57;text-decoration:line-through}
  .gr-item-tick{
    display:grid;place-items:center;width:21px;height:21px;border-radius:999px;
    background:#EDE9F8;color:transparent;flex-shrink:0;
  }
  .gr-item.done .gr-item-tick{background:#5BC98C;color:#fff}

  .gr-status{font-size:15px;font-weight:600;color:#1A1A6E;text-align:center;min-height:22px}
  .gr-status.nudge{color:#7A5000}

  .gr-title{font-size:13px;font-weight:700;color:rgba(26,26,46,.45);margin:24px 0 10px}
  .gr-tools{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:9px}
  .gr-tool{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    min-height:88px;padding:11px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:15px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .gr-tool:hover:not(:disabled){border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .gr-tool:disabled{opacity:.35;cursor:not-allowed}
  .gr-tool:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .gr-tool-emoji{font-size:30px;line-height:1}
  .gr-tool-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}

  .gr-colors{display:flex;flex-wrap:wrap;gap:9px}
  .gr-color{
    width:46px;height:46px;border-radius:14px;
    border:2.5px solid #fff;box-shadow:0 0 0 1.5px #EDE9F8;
    cursor:pointer;transition:.15s;
  }
  .gr-color:hover{transform:translateY(-2px)}
  .gr-color[aria-pressed="true"]{box-shadow:0 0 0 3px #1A1A6E}
  .gr-color:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:3px}

  .gr-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:22px}
  .gr-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:44px;padding:0 22px;
    font-family:inherit;font-size:15px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:12px;cursor:pointer;
  }
  .gr-btn.ghost{color:#1A1A6E;background:#fff;border:1.5px solid #EDE9F8}
  .gr-btn:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .gr-done{
    display:flex;flex-direction:column;align-items:center;gap:12px;
    padding:44px 22px;text-align:center;
    background:linear-gradient(160deg,#fff 0%,#F2FBFE 100%);
    border:2px solid #EDE9F8;border-radius:22px;
  }
  .gr-done h2{font-size:21px;font-weight:700;color:#1A1A6E;margin:0}
  .gr-done p{font-size:15px;line-height:1.55;color:rgba(26,26,46,.6);max-width:360px;margin:0}

  @keyframes gr-away{to{transform:translateX(120%);opacity:0}}

  @media (prefers-reduced-motion:reduce){
    .gr-car.away{animation:none;opacity:0}
    .gr-tool,.gr-tool:hover,.gr-color,.gr-color:hover{transition:none;transform:none}
  }
`;

// Fixed dirt splotches — same car always gets dirty the same way.
const DIRT = [
  { cx: 48, cy: 58, r: 7 },
  { cx: 74, cy: 66, r: 5 },
  { cx: 112, cy: 55, r: 6 },
  { cx: 140, cy: 64, r: 4.5 },
  { cx: 96, cy: 70, r: 5.5 },
];

function Car({ color, dirty, flat, lightOn, away }) {
  return (
    <svg className={`gr-car${away ? ' away' : ''}`} viewBox="0 0 200 100" role="img" aria-hidden="true">
      <ellipse cx="100" cy="88" rx="80" ry="6" fill="rgba(26,26,110,.08)" />
      <path d="M52 46 L68 24 Q71 20 78 20 L128 20 Q135 20 138 24 L152 46 Z" fill={color} />
      <rect x="18" y="44" width="164" height="32" rx="13" fill={color} />
      <rect x="73" y="26" width="25" height="18" rx="4" fill="#CFEAF7" />
      <rect x="104" y="26" width="25" height="18" rx="4" fill="#CFEAF7" />
      {dirty && (
        <g fill="#7A5A2E" opacity="0.45">
          {DIRT.map((d) => (
            <circle key={`${d.cx}-${d.cy}`} cx={d.cx} cy={d.cy} r={d.r} />
          ))}
        </g>
      )}
      <ellipse cx="180" cy="56" rx="7" ry="6" fill={lightOn ? '#FFE9A3' : '#8A9099'} />
      {lightOn && <ellipse cx="180" cy="56" rx="12" ry="10" fill="#FFE9A3" opacity="0.35" />}
      <circle cx="146" cy="76" r="14" fill="#2F3542" />
      <circle cx="146" cy="76" r="6" fill="#C7CDD6" />
      <ellipse cx="58" cy={flat ? 80 : 76} rx={flat ? 16 : 14} ry={flat ? 9 : 14} fill="#2F3542" />
      <ellipse cx="58" cy={flat ? 80 : 76} rx={flat ? 6 : 6} ry={flat ? 4 : 6} fill="#C7CDD6" />
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
        <div className="gr-done">
          <span style={{ fontSize: 58, lineHeight: 1 }} role="img" aria-hidden="true">
            🔧
          </span>
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

      <div className="gr-bay">
        <span className="gr-counter">
          {copy.carOf.replace('{n}', String(index + 1)).replace('{total}', String(CARS.length))}
        </span>

        <div className="gr-driver">
          <span className="gr-driver-emoji" role="img" aria-hidden="true">
            {car.driver}
          </span>
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

        <p className={`gr-status${nudge ? ' nudge' : ''}`} aria-live="polite">
          {allFixed ? copy.allFixed : nudge ? copy.notThis : ''}
        </p>

        {allFixed && (
          <button type="button" className="gr-btn site-chrome" onClick={driveAway}>
            {copy.drive}
          </button>
        )}
      </div>

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
            <span className="gr-tool-emoji" role="img" aria-hidden="true">
              {tool.emoji}
            </span>
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
