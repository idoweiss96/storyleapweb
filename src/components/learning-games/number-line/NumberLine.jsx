import React, { useEffect, useRef, useState } from 'react';
import WorldView from '../world3d/WorldView';
import { StreetWorld } from './streetWorld';
import { LEVELS, ROUNDS, UI } from './numberLineContent';

// The street as a strip at the top: 0 and max at the ends, a marker for the
// postman, and (after each letter) a star for the real house and a flag for
// the guess. The camera can only show part of a long street; the strip keeps
// both ends in view, which estimation needs.
const STYLE = `
  .st-map{position:absolute;top:54px;left:12px;right:12px;direction:ltr;height:40px;background:rgba(255,255,255,.92);
    border:2.4px solid #3A3357;border-radius:14px;pointer-events:none;box-shadow:0 3px 0 rgba(58,51,87,.18)}
  .st-line{position:absolute;left:30px;right:30px;top:19px;height:5px;border-radius:9px;background:#D9D2EE}
  .st-end{position:absolute;top:8px;font-size:13px;font-weight:900;color:#1A1A6E}
  .st-mk{position:absolute;top:10px;width:14px;height:14px;margin-left:-7px;border-radius:999px;border:2px solid #3A3357}
  .st-me{background:#FF6FB5;top:7px;width:18px;height:18px;margin-left:-9px}
  .st-star{background:#F5C842;border-radius:3px;transform:rotate(45deg);width:11px;height:11px;margin-left:-5px;top:13px}
  .st-flag{background:#4FC3E8;width:8px;height:8px;margin-left:-4px;top:15px}
`;

function useLive(game, key) {
  // The postman's position changes every frame; poll it lightly for the strip.
  const [v, setV] = useState(0);
  const g = useRef(game);
  g.current = game;
  useEffect(() => {
    const id = setInterval(() => {
      const w = g.current;
      if (w?.p) setV(Math.max(0, Math.min(1, (w.p.x + 12) / 24)));
    }, 80);
    return () => clearInterval(id);
  }, [key]);
  return v;
}

function Strip({ s, game }) {
  const frac = useLive(game, s.max);
  const at = (f) => `calc(30px + (100% - 60px) * ${f})`;
  return (
    <div className="st-map" aria-hidden="true">
      <span className="st-end" style={{ left: 8 }}>0</span>
      <span className="st-end" style={{ right: 6 }}>{s.max}</span>
      <div className="st-line" />
      {s.history.map((h, i) => (
        <React.Fragment key={i}>
          <span className="st-mk st-star" style={{ left: at(h.target / s.max) }} />
          <span className="st-mk st-flag" style={{ left: at(h.guess / s.max) }} />
        </React.Fragment>
      ))}
      <span className="st-mk st-me" style={{ left: at(frac) }} />
    </div>
  );
}

export default function NumberLine({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  return (
    <WorldView
      GameClass={StreetWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="dog"
      style={STYLE}
      hud={(s) => [{ key: 'r', node: copy.round.replace('{n}', Math.min(s.round + 1, ROUNDS)).replace('{total}', ROUNDS) }]}
      renderOverlay={(s, g) => <Strip s={s} game={g} />}
      actions={(s, g) =>
        s.phase === 'carry' ? (
          <button type="button" className="w3-act" onClick={() => g.drop()} style={{ fontSize: 18 }}>
            <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
              <rect x="3" y="6" width="18" height="13" rx="2" fill="#fff" stroke="#3A3357" strokeWidth="2" />
              <path d="M3 7l9 7 9-7" fill="none" stroke="#3A3357" strokeWidth="2" />
            </svg>
            {copy.drop}
          </button>
        ) : null
      }
    />
  );
}
