import React from 'react';
import WorldView from '../world3d/WorldView';
import { RiverWorld } from './riverWorld';
import { LEVELS, UI } from './numberPathContent';

// The whole line, always on screen: the camera only shows a few stones at a
// time, and seeing 1…N as one straight row is the representation the game
// exists to build.
const STYLE = `
  .rv-map{position:absolute;top:54px;left:50%;transform:translateX(-50%);direction:ltr;display:flex;gap:3px;
    background:rgba(255,255,255,.92);border:2.4px solid #3A3357;border-radius:14px;padding:5px 7px;pointer-events:none;
    max-width:calc(100% - 24px);box-shadow:0 3px 0 rgba(58,51,87,.18)}
  .rv-cell{flex:1 1 0;min-width:10px;height:20px;border-radius:5px;background:#EDE9F8;display:flex;align-items:center;justify-content:center;
    font-size:10px;font-weight:900;color:#8F86B8;position:relative}
  .rv-cell.up{background:#CFEAF7;color:#1A1A6E}
  .rv-cell.done{background:#FF9CC8;color:#fff}
  .rv-cell.here::after{content:'';position:absolute;top:-8px;left:50%;width:10px;height:10px;margin-left:-5px;border-radius:999px;
    background:#FF6FB5;border:2px solid #3A3357}
`;

export default function NumberPath({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  return (
    <WorldView
      GameClass={RiverWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="frog"
      style={STYLE}
      doneText={(s) => copy.doneText.replace('{n}', s.size)}
      renderOverlay={(s) => (
        <div className="rv-map" aria-hidden="true">
          {Array.from({ length: s.size }, (_, i) => i + 1).map((n) => (
            <span key={n} className={`rv-cell${n <= s.pos ? ' done' : n <= s.allowed ? ' up' : ''}${n === s.pos ? ' here' : ''}`}>
              {s.size <= 10 || n % 5 === 0 || n === 1 ? n : ''}
            </span>
          ))}
        </div>
      )}
      actions={(s, g) =>
        s.phase === 'spin' ? (
          <button type="button" className="w3-act" onClick={() => g.spin()}>
            <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#fff" stroke="#3A3357" strokeWidth="2" />
              <path d="M12 12 12 2A10 10 0 0 1 21 16Z" fill="#8FD4F0" stroke="#3A3357" strokeWidth="1.5" />
              <path d="M12 12 21 16A10 10 0 0 1 3 16Z" fill="#FFE07A" stroke="#3A3357" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="#3A3357" />
            </svg>
            {copy.spin}
          </button>
        ) : null
      }
    />
  );
}
