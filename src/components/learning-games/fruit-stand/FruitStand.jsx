import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import Icon from '../../games/shared/art/Icon';
import Critter from '../../games/shared/art/Critter';
import { Celebrate, LG_STYLE, Toolbar } from '../shared/GameShell';
import { Game } from './game';
import { FRUITS, LEVELS, UI } from './fruitStandContent';

const STYLE = `
  .fs-wrap{position:relative;width:100%;height:min(72vh,620px);min-height:440px;border:2.5px solid #3A3357;border-radius:24px;
    overflow:hidden;box-shadow:0 10px 28px rgba(26,26,110,.16);background:#CFEFFC;user-select:none;-webkit-user-select:none}
  .fs-mount{position:absolute;inset:0}
  .fs-canvas{display:block;width:100%;height:100%;touch-action:none;outline:none}
  .fs-ov{position:absolute;inset:0;pointer-events:none;overflow:hidden}
  .fs-ov [data-anchor]{position:absolute;left:0;top:0;will-change:transform}

  .fs-hud{position:absolute;top:10px;inset-inline:10px;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;pointer-events:none}
  .fs-chip{display:inline-flex;align-items:center;gap:6px;background:#fff;border:2.4px solid #3A3357;border-radius:999px;
    padding:3px 12px 3px 6px;font-weight:900;font-size:18px;color:#1A1A6E;box-shadow:0 3px 0 rgba(58,51,87,.2)}
  .fs-coin{width:24px;height:24px;border-radius:999px;background:#F5C842;border:2.4px solid #3A3357;box-shadow:inset 0 0 0 4px #FFE07A}
  .fs-chip.bump{animation:fs-bump .25s ease}
  .fs-hint{position:absolute;bottom:12px;inset-inline:12px;display:flex;align-items:center;gap:8px;pointer-events:none}
  .fs-hint p{margin:0;background:rgba(255,255,255,.95);border:2.4px solid #3A3357;border-radius:16px;padding:8px 12px;
    font-size:15px;font-weight:700;line-height:1.35;color:#1a1a2e;box-shadow:0 3px 0 rgba(58,51,87,.18)}

  .fs-order{pointer-events:auto;background:#fff;border:2.6px solid #3A3357;border-radius:18px;padding:6px 10px;
    display:flex;gap:10px;align-items:center;box-shadow:0 4px 0 rgba(58,51,87,.2);position:relative;animation:fs-in .3s ease}
  .fs-order::after{content:'';position:absolute;bottom:-9px;left:50%;width:14px;height:14px;background:#fff;
    border-right:2.6px solid #3A3357;border-bottom:2.6px solid #3A3357;transform:translateX(-50%) rotate(45deg)}
  .fs-line{display:flex;flex-direction:column;align-items:center;gap:2px}
  .fs-line b{font-size:22px;line-height:1;color:#1A1A6E;font-weight:900}
  .fs-dots{display:flex;gap:3px}
  .fs-dots i{width:8px;height:8px;border-radius:999px;border:1.6px solid #3A3357;background:#fff;display:block}
  .fs-dots i.on{background:#5BC98C}
  .fs-order.hidden{background:#EFE8FD;cursor:pointer}
  .fs-order.hidden::after{background:#EFE8FD}
  .fs-order.hidden b{font-size:26px;color:#7A5BC4}
  .fs-order.happy{background:#EFFBF3}
  .fs-order.happy::after{background:#EFFBF3}

  .fs-carry{background:#1A1A6E;color:#fff;border-radius:999px;padding:2px 10px;font-weight:900;font-size:17px;
    border:2.4px solid #fff;display:flex;gap:6px;align-items:center;box-shadow:0 3px 0 rgba(26,26,110,.35)}

  .fs-pop{position:absolute;left:0;top:0;font-weight:900;font-size:40px;color:#fff;pointer-events:none;
    -webkit-text-stroke:2.5px #3A3357;paint-order:stroke;animation:fs-pop .9s ease-out forwards;text-shadow:0 3px 0 rgba(58,51,87,.35)}

  .fs-stick{position:absolute;left:0;top:0;width:96px;height:96px;margin:-48px 0 0 -48px;border-radius:999px;
    background:rgba(255,255,255,.35);border:3px solid rgba(58,51,87,.35);opacity:0;transition:opacity .15s;pointer-events:none}
  .fs-stick.on{opacity:1}
  .fs-knob{position:absolute;left:50%;top:50%;width:44px;height:44px;border-radius:999px;background:#FF6FB5;border:3px solid #3A3357;
    box-shadow:0 3px 0 rgba(58,51,87,.3)}

  .fs-screen{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
    background:rgba(207,239,252,.72);backdrop-filter:blur(3px);text-align:center;padding:20px;pointer-events:auto}
  .fs-screen h2{margin:0;font-size:26px;font-weight:900;color:#1A1A6E}
  .fs-screen p{margin:0;max-width:340px;font-size:16px;color:#3A3357;font-weight:600;line-height:1.5}

  @keyframes fs-pop{0%{transform:translate(-50%,-50%) scale(.5);opacity:0}20%{transform:translate(-50%,-80%) scale(1.25);opacity:1}100%{transform:translate(-50%,-190%) scale(1);opacity:0}}
  @keyframes fs-in{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes fs-bump{50%{transform:scale(1.15)}}
  @media (prefers-reduced-motion:reduce){.fs-pop,.fs-order,.fs-chip.bump{animation:none}}
`;

function OrderBubble({ c, lang, copy, onPeek }) {
  const cls = c.happy ? ' happy' : c.hidden ? ' hidden' : '';
  return (
    <div data-anchor={`c${c.id}`} data-ui>
      <div
        className={`fs-order${cls}`}
        onClick={c.hidden ? () => onPeek(c.id) : undefined}
        role={c.hidden ? 'button' : undefined}
        aria-label={c.hidden ? copy.peek : undefined}
      >
        {c.happy ? (
          <Critter species="topi" expression="happy" size={34} />
        ) : c.hidden ? (
          <b>?</b>
        ) : (
          Object.entries(c.order).map(([type, n]) => (
            <div className="fs-line" key={type}>
              <Icon name={FRUITS[type].icon} size={34} label={lang === 'he' ? FRUITS[type].he : FRUITS[type].en} />
              <b>{n}</b>
              <span className="fs-dots">
                {Array.from({ length: n }, (_, i) => <i key={i} className={i < (c.got[type] || 0) ? 'on' : ''} />)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function FruitStand({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const [levelId, setLevelId] = useState('count');
  const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const gameRef = useRef(null);
  const [state, setState] = useState(null);
  const [pops, setPops] = useState([]);
  const [burst, setBurst] = useState(0);
  const [coinBump, setCoinBump] = useState(0);
  const [failed, setFailed] = useState(false);
  const [round, setRound] = useState(0);
  const lastCoins = useRef(0);

  const onPop = useCallback((p) => {
    const id = Math.random().toString(36).slice(2);
    setPops((list) => [...list.slice(-6), { ...p, id }]);
    setTimeout(() => setPops((list) => list.filter((x) => x.id !== id)), 950);
  }, []);

  useEffect(() => {
    let game;
    try {
      game = new Game({ mount: mountRef.current, overlay: overlayRef.current, level, lang, onState: setState, onPop });
    } catch (e) {
      // No WebGL (very old device, or blocked): say so instead of a blank box.
      console.error('[FruitStand] WebGL unavailable', e);
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
    if (!state) return;
    if (state.coins > lastCoins.current) setCoinBump((b) => b + 1);
    lastCoins.current = state.coins;
  }, [state?.coins]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state?.done) setBurst((b) => b + 1);
  }, [state?.done]);

  const idx = LEVELS.findIndex((l) => l.id === levelId);
  const next = LEVELS[idx + 1];
  const carrying = state ? Object.entries(state.carrying) : [];

  return (
    <div className="lg">
      <style>{LG_STYLE + STYLE}</style>
      <Toolbar levels={LEVELS} level={levelId} onLevel={setLevelId} lang={lang} />

      <div className="fs-wrap">
        <div className="fs-mount" ref={mountRef} />
        <div className="fs-ov" ref={overlayRef}>
          {state?.customers.map((c) => (
            <OrderBubble key={c.id} c={c} lang={lang} copy={copy} onPeek={(id) => gameRef.current?.peek(id)} />
          ))}
          {carrying.length > 0 && (
            <div data-anchor="player">
              <div className="fs-carry">
                {carrying.map(([type, n]) => (
                  <span key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                    <Icon name={FRUITS[type].icon} size={22} />
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pops.map((p) => (
            <span key={p.id} className="fs-pop" style={{ left: p.x, top: p.y }}>{p.text}</span>
          ))}
        </div>

        {state && (
          <div className="fs-hud">
            <span className={`fs-chip${coinBump ? ' bump' : ''}`} key={coinBump} aria-label={`${copy.coins}: ${state.coins}`}>
              <span className="fs-coin" />
              {state.coins}
            </span>
            <span className="fs-chip" style={{ fontSize: 14, padding: '5px 12px' }}>
              {copy.served.replace('{n}', state.served).replace('{total}', state.total)}
            </span>
          </div>
        )}

        {state?.running && !state.done && (
          <div className="fs-hint" aria-live="polite">
            <Critter species="topi" expression="happy" size={44} />
            <p>{state.message}</p>
          </div>
        )}

        {failed && (
          <div className="fs-screen">
            <p>{lang === 'he' ? 'המכשיר הזה לא תומך בגרפיקה תלת-ממדית. נסו בדפדפן אחר.' : 'This device does not support 3D graphics. Try another browser.'}</p>
          </div>
        )}

        {state && !state.running && !failed && (
          <div className="fs-screen" data-ui>
            <Critter species="topi" expression="happy" size={96} />
            <h2>{copy.title}</h2>
            <p>{copy.howTo}</p>
            <button type="button" className="lg-btn big site-chrome" onClick={() => gameRef.current?.start()}>
              <Play className="w-5 h-5" />
              {copy.start}
            </button>
          </div>
        )}

        {state?.done && (
          <div className="fs-screen" data-ui>
            <Celebrate burst={burst} />
            <Critter species="topi" expression="happy" size={96} />
            <h2>{copy.doneTitle}</h2>
            <p>{copy.doneText.replace('{n}', state.served).replace('{coins}', state.earned)}</p>
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
