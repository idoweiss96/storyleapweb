import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import Critter from '../../games/shared/art/Critter';
import { Celebrate, LG_STYLE, Toolbar } from '../shared/GameShell';
import { fanfare } from '../shared/sound';

/**
 * WorldView — the React frame every 3D learning game shares: level chips,
 * the stage, start and end screens, the hint line and floating numbers.
 *
 * A game passes its World subclass and, optionally:
 *   renderOverlay(state, game)  bubbles etc. (elements with data-anchor)
 *   hud(state)                  chips for the top bar: [{ key, node }]
 *   actions(state, game)        big on-screen buttons (drum, rotate…)
 */

export const W3_STYLE = `
  .w3-wrap{position:relative;width:100%;height:min(72vh,620px);min-height:440px;border:2.5px solid #3A3357;border-radius:24px;
    overflow:hidden;box-shadow:0 10px 28px rgba(26,26,110,.16);background:#CFEFFC;user-select:none;-webkit-user-select:none}
  .w3-mount{position:absolute;inset:0}
  .w3-canvas{display:block;width:100%;height:100%;touch-action:none;outline:none}
  .w3-ov{position:absolute;inset:0;pointer-events:none;overflow:hidden}
  .w3-ov [data-anchor]{position:absolute;left:0;top:0;will-change:transform}

  .w3-hud{position:absolute;top:10px;inset-inline:10px;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;pointer-events:none;flex-wrap:wrap}
  .w3-chip{display:inline-flex;align-items:center;gap:6px;background:#fff;border:2.4px solid #3A3357;border-radius:999px;
    padding:4px 12px;font-weight:900;font-size:15px;color:#1A1A6E;box-shadow:0 3px 0 rgba(58,51,87,.2)}
  .w3-hint{position:absolute;bottom:12px;inset-inline:12px;display:flex;align-items:center;gap:8px;pointer-events:none}
  .w3-hint p{margin:0;background:rgba(255,255,255,.95);border:2.4px solid #3A3357;border-radius:16px;padding:8px 12px;
    font-size:15px;font-weight:700;line-height:1.35;color:#1a1a2e;box-shadow:0 3px 0 rgba(58,51,87,.18)}
  .w3-actions{position:absolute;bottom:78px;inset-inline-end:12px;display:flex;flex-direction:column;gap:10px;pointer-events:auto}
  .w3-act{min-width:74px;min-height:74px;border-radius:999px;border:3px solid #3A3357;background:#FF6FB5;color:#fff;
    font-family:inherit;font-weight:900;font-size:15px;box-shadow:0 5px 0 #3A3357;cursor:pointer;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:2px;padding:6px}
  .w3-act:active{transform:translateY(3px);box-shadow:0 2px 0 #3A3357}
  .w3-act.blue{background:#4FC3E8}
  .w3-act:disabled{opacity:.45}

  .w3-bubble{pointer-events:auto;background:#fff;border:2.6px solid #3A3357;border-radius:18px;padding:6px 10px;
    display:flex;gap:10px;align-items:center;box-shadow:0 4px 0 rgba(58,51,87,.2);position:relative;animation:w3-in .3s ease;
    font-weight:900;color:#1A1A6E}
  .w3-bubble::after{content:'';position:absolute;bottom:-9px;left:50%;width:14px;height:14px;background:inherit;
    border-right:2.6px solid #3A3357;border-bottom:2.6px solid #3A3357;transform:translateX(-50%) rotate(45deg)}
  .w3-bubble.good{background:#EFFBF3}
  .w3-bubble.warm{background:#FFF8EC}
  .w3-bubble.purple{background:#EFE8FD}

  .w3-pop{position:absolute;left:0;top:0;font-weight:900;font-size:40px;color:#fff;pointer-events:none;
    -webkit-text-stroke:2.5px #3A3357;paint-order:stroke;animation:w3-pop .9s ease-out forwards;text-shadow:0 3px 0 rgba(58,51,87,.35)}

  .fs-stick{position:absolute;left:0;top:0;width:96px;height:96px;margin:-48px 0 0 -48px;border-radius:999px;
    background:rgba(255,255,255,.35);border:3px solid rgba(58,51,87,.35);opacity:0;transition:opacity .15s;pointer-events:none}
  .fs-stick.on{opacity:1}
  .fs-knob{position:absolute;left:50%;top:50%;width:44px;height:44px;border-radius:999px;background:#FF6FB5;border:3px solid #3A3357;
    box-shadow:0 3px 0 rgba(58,51,87,.3)}

  .w3-screen{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
    background:rgba(207,239,252,.72);backdrop-filter:blur(3px);text-align:center;padding:20px;pointer-events:auto}
  .w3-screen h2{margin:0;font-size:26px;font-weight:900;color:#1A1A6E}
  .w3-screen p{margin:0;max-width:360px;font-size:16px;color:#3A3357;font-weight:600;line-height:1.5}

  @keyframes w3-pop{0%{transform:translate(-50%,-50%) scale(.5);opacity:0}20%{transform:translate(-50%,-80%) scale(1.25);opacity:1}100%{transform:translate(-50%,-190%) scale(1);opacity:0}}
  @keyframes w3-in{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
  @media (prefers-reduced-motion:reduce){.w3-pop,.w3-bubble{animation:none}}
`;

const HOW_TO = {
  he: 'שימו אצבע על המשחק וגררו כדי ללכת (או חצים במקלדת)',
  en: 'Put a finger on the game and drag to walk (or use the arrow keys)',
};
const NO_GL = {
  he: 'המכשיר הזה לא תומך בגרפיקה תלת-ממדית. נסו בדפדפן אחר.',
  en: 'This device does not support 3D graphics. Try another browser.',
};

export default function WorldView({
  GameClass, levels, copy, lang = 'he', startLevel, renderOverlay, hud, actions, doneText, host = 'topi', style = '',
}) {
  const [levelId, setLevelId] = useState(startLevel || levels[0].id);
  const level = levels.find((l) => l.id === levelId) || levels[0];
  const [round, setRound] = useState(0);
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const gameRef = useRef(null);
  const [state, setState] = useState(null);
  const [pops, setPops] = useState([]);
  const [burst, setBurst] = useState(0);
  const [failed, setFailed] = useState(false);

  const onPop = useCallback((p) => {
    const id = Math.random().toString(36).slice(2);
    setPops((list) => [...list.slice(-6), { ...p, id }]);
    setTimeout(() => setPops((list) => list.filter((x) => x.id !== id)), 950);
  }, []);

  useEffect(() => {
    let game;
    try {
      game = new GameClass({ mount: mountRef.current, overlay: overlayRef.current, level, lang, copy, onState: setState, onPop });
    } catch (e) {
      console.error('[WorldView] WebGL unavailable', e);
      setFailed(true);
      return undefined;
    }
    gameRef.current = game;
    return () => {
      game.dispose();
      gameRef.current = null;
    };
  }, [levelId, lang, round]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state?.done) {
      fanfare();
      setBurst((b) => b + 1);
    }
  }, [state?.done]);

  const next = levels[levels.findIndex((l) => l.id === levelId) + 1];
  const g = gameRef.current;

  return (
    <div className="lg">
      <style>{LG_STYLE + W3_STYLE + style}</style>
      {/* A game with a single level gets only the sound switch, not one lonely chip. */}
      <Toolbar levels={levels.length > 1 ? levels : []} level={levelId} onLevel={setLevelId} lang={lang} />

      <div className="w3-wrap">
        <div className="w3-mount" ref={mountRef} />
        <div className="w3-ov" ref={overlayRef}>
          {state && g && renderOverlay?.(state, g)}
          {pops.map((p) => (
            <span key={p.id} className="w3-pop" style={{ left: p.x, top: p.y, fontSize: p.kind === 'small' ? 26 : undefined }}>{p.text}</span>
          ))}
        </div>

        {state && hud && (
          <div className="w3-hud">
            {hud(state).map((h) => <span key={h.key} className="w3-chip">{h.node}</span>)}
          </div>
        )}

        {state?.running && !state.done && actions && g && (
          <div className="w3-actions" data-ui>{actions(state, g)}</div>
        )}

        {state?.running && !state.done && state.message && (
          <div className="w3-hint" aria-live="polite">
            <Critter species={host} expression="happy" size={44} />
            <p>{state.message}</p>
          </div>
        )}

        {failed && (
          <div className="w3-screen"><p>{NO_GL[lang] || NO_GL.he}</p></div>
        )}

        {state && !state.running && !failed && (
          <div className="w3-screen" data-ui>
            <Critter species={host} expression="happy" size={96} />
            <h2>{copy.title}</h2>
            <p>{copy.intro || copy.subtitle}</p>
            <p style={{ fontSize: 14, opacity: 0.8 }}>{HOW_TO[lang] || HOW_TO.he}</p>
            <button type="button" className="lg-btn big site-chrome" onClick={() => gameRef.current?.start()}>
              <Play className="w-5 h-5" />
              {copy.start}
            </button>
          </div>
        )}

        {state?.done && (
          <div className="w3-screen" data-ui>
            <Celebrate burst={burst} />
            <Critter species={host} expression="happy" size={96} />
            <h2>{copy.doneTitle}</h2>
            <p>{doneText ? doneText(state) : copy.doneText}</p>
            <div className="lg-row">
              <button type="button" className="lg-btn site-chrome" onClick={() => setRound((r) => r + 1)}>
                <RotateCcw className="w-4 h-4" />
                {copy.again}
              </button>
              {next && (
                <button type="button" className="lg-btn blue site-chrome" onClick={() => setLevelId(next.id)}>
                  {copy.harder}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
