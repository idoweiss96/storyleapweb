import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { ORDERS, SLOTS, TOPPINGS, UI } from './pizzeriaContent';

const STYLE = `
  .pz *{box-sizing:border-box}

  .pz-order{
    display:flex;align-items:center;gap:13px;
    padding:14px 16px;margin-bottom:16px;
    background:#fff;border:2px solid #FFD6EC;border-radius:18px;
  }
  .pz-order-emoji{font-size:38px;line-height:1;flex-shrink:0}
  .pz-order-body{flex:1;min-width:0}
  .pz-order-name{font-size:13px;font-weight:700;color:rgba(26,26,46,.45)}
  .pz-order-line{font-size:15.5px;font-weight:600;color:#1A1A6E;line-height:1.4}
  .pz-order-need{font-size:13.5px;color:rgba(26,26,46,.55);margin-top:5px}
  .pz-order-need.ready{color:#0F7B57;font-weight:600}

  .pz-stage{
    display:flex;flex-direction:column;align-items:center;gap:16px;
    padding:24px 18px;
    background:linear-gradient(160deg,#fff 0%,#FFF8FB 100%);
    border:2px solid #EDE9F8;border-radius:22px;
    box-shadow:0 4px 18px rgba(26,26,110,.08);
  }

  .pz-pizza{
    position:relative;width:min(78vw,290px);aspect-ratio:1;
    border-radius:50%;
    background:#E8B96B;
    box-shadow:0 6px 22px rgba(26,26,110,.14);
    transition:filter .5s,background .3s;
  }
  .pz-pizza.baked{filter:saturate(1.15) brightness(.94);background:#D69B45}
  .pz-inner{
    position:absolute;inset:7%;border-radius:50%;
    background:#F2D9A8;transition:background .3s;
  }
  .pz-inner.sauce{background:#D8452F}
  .pz-inner.cheese{background:#F5C842}
  .pz-inner.sauce.cheese{background:#EFAE3B}
  .pz-piece{
    position:absolute;font-size:25px;line-height:1;
    transform:translate(-50%,-50%);
    animation:pz-drop .28s ease;
  }
  .pz-slice{
    position:absolute;inset:7%;border-radius:50%;
    pointer-events:none;
  }
  .pz-slice span{
    position:absolute;top:0;bottom:0;left:50%;width:3px;margin-inline-start:-1.5px;
    background:rgba(120,72,20,.5);transform-origin:50% 50%;
  }

  .pz-oven{
    width:min(78vw,290px);height:11px;border-radius:999px;
    background:#EDE9F8;overflow:hidden;
  }
  .pz-oven i{
    display:block;height:100%;border-radius:999px;
    background:linear-gradient(90deg,#F5C842,#FF6FB5);
    transition:width .18s linear;
  }
  .pz-status{font-size:15px;font-weight:600;color:#1A1A6E;text-align:center;min-height:22px}

  .pz-title{
    font-size:13px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.45);margin:24px 0 10px;
  }
  .pz-toppings{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:9px}
  .pz-top{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
    min-height:84px;padding:10px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:15px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .pz-top:hover:not(:disabled){border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .pz-top:disabled{opacity:.35;cursor:not-allowed}
  .pz-top:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .pz-top[aria-pressed="true"]{border-color:#4FC3E8;background:#F2FBFE}
  .pz-top-emoji{font-size:28px;line-height:1}
  .pz-top-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}

  .pz-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:20px}
  .pz-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:44px;padding:0 22px;
    font-family:inherit;font-size:15px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:12px;cursor:pointer;
  }
  .pz-btn.ghost{color:#1A1A6E;background:#fff;border:1.5px solid #EDE9F8}
  .pz-btn:disabled{opacity:.45;cursor:not-allowed}
  .pz-btn:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .pz-served{
    display:flex;flex-direction:column;align-items:center;gap:11px;
    text-align:center;
  }
  .pz-served h2{font-size:20px;font-weight:700;color:#1A1A6E;margin:0}
  .pz-served p{font-size:15px;line-height:1.55;color:rgba(26,26,46,.6);max-width:340px;margin:0}

  @keyframes pz-drop{from{opacity:0;transform:translate(-50%,-160%) scale(.6)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}

  @media (prefers-reduced-motion:reduce){
    .pz-piece{animation:none}
    .pz-top,.pz-top:hover{transition:none;transform:none}
    .pz-oven i{transition:none}
  }
`;

const BAKE_MS = 3200;

export default function Pizzeria({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [orderIndex, setOrderIndex] = useState(0);
  const [freePlay, setFreePlay] = useState(false);
  const [layers, setLayers] = useState([]); // 'sauce' / 'cheese'
  const [pieces, setPieces] = useState([]); // { key, emoji, slot }
  const [stage, setStage] = useState('build'); // build | baking | baked | sliced | served
  const [progress, setProgress] = useState(0);
  const timer = useRef(null);

  // The oven runs on a timer; clear it if the component goes away mid-bake.
  useEffect(() => () => clearInterval(timer.current), []);

  const order = freePlay ? null : ORDERS[orderIndex % ORDERS.length];
  const orderCopy = order ? order[lang] || order.he : null;

  const onPizza = [...layers, ...pieces.map((p) => p.id)];
  const missing = order ? order.wants.filter((w) => !onPizza.includes(w)) : [];
  const building = stage === 'build';

  const addTopping = (topping) => {
    if (!building) return;
    if (topping.layer) {
      setLayers((prev) => (prev.includes(topping.id) ? prev.filter((l) => l !== topping.id) : [...prev, topping.id]));
      return;
    }
    setPieces((prev) =>
      prev.length >= SLOTS.length ? prev : [...prev, { key: `${topping.id}-${prev.length}`, id: topping.id, emoji: topping.emoji, slot: prev.length }]
    );
  };

  const bake = () => {
    setStage('baking');
    setProgress(0);
    const started = Date.now();
    timer.current = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - started) / BAKE_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timer.current);
        setStage('baked');
      }
    }, 60);
  };

  const reset = (nextOrder) => {
    clearInterval(timer.current);
    setLayers([]);
    setPieces([]);
    setProgress(0);
    setStage('build');
    if (nextOrder) setOrderIndex((prev) => prev + 1);
  };

  let status = copy.emptyHint;
  if (stage === 'baking') status = copy.baking;
  else if (stage === 'baked') status = copy.slice;
  else if (stage === 'sliced') status = copy.serve;
  else if (building && order && missing.length === 0) status = copy.orderReady;
  else if (building && onPizza.length > 0) status = '';

  return (
    <div className="pz">
      <style>{STYLE}</style>

      <div className="pz-order site-chrome">
        <span className="pz-order-emoji" role="img" aria-hidden="true">
          {order ? order.customer : '🧑‍🍳'}
        </span>
        <div className="pz-order-body">
          <div className="pz-order-name">{order ? orderCopy.name : copy.freePlay}</div>
          <div className="pz-order-line">{order ? orderCopy.line : copy.freePlayLine}</div>
          {order && building && (
            <div className={`pz-order-need${missing.length === 0 ? ' ready' : ''}`} aria-live="polite">
              {missing.length === 0
                ? copy.orderReady
                : `${copy.stillNeeds} ${missing
                    .map((id) => {
                      const t = TOPPINGS.find((x) => x.id === id);
                      return t ? t[lang] || t.he : id;
                    })
                    .join(', ')}`}
            </div>
          )}
        </div>
        <button
          type="button"
          className="pz-btn ghost site-chrome"
          onClick={() => {
            setFreePlay((prev) => !prev);
            reset(false);
          }}
        >
          {freePlay ? copy.withOrder : copy.freePlay}
        </button>
      </div>

      <div className="pz-stage">
        {stage === 'served' ? (
          <div className="pz-served">
            <span style={{ fontSize: 58, lineHeight: 1 }} role="img" aria-hidden="true">
              😋
            </span>
            <h2>{copy.servedTitle}</h2>
            <p>{copy.servedText}</p>
            <button type="button" className="pz-btn site-chrome" onClick={() => reset(true)}>
              {copy.newPizza}
            </button>
          </div>
        ) : (
          <>
            <div className={`pz-pizza${stage === 'baked' || stage === 'sliced' ? ' baked' : ''}`}>
              <div className={`pz-inner${layers.includes('sauce') ? ' sauce' : ''}${layers.includes('cheese') ? ' cheese' : ''}`} />
              {pieces.map((piece) => (
                <span
                  key={piece.key}
                  className="pz-piece"
                  role="img"
                  aria-hidden="true"
                  style={{ left: `${SLOTS[piece.slot].x}%`, top: `${SLOTS[piece.slot].y}%` }}
                >
                  {piece.emoji}
                </span>
              ))}
              {stage === 'sliced' && (
                <div className="pz-slice">
                  {[0, 60, 120].map((deg) => (
                    <span key={deg} style={{ transform: `rotate(${deg}deg)` }} />
                  ))}
                </div>
              )}
            </div>

            {stage === 'baking' && (
              <div className="pz-oven">
                <i style={{ width: `${progress}%` }} />
              </div>
            )}

            <p className="pz-status" aria-live="polite">
              {status}
            </p>

            <div className="pz-actions">
              {building && (
                <button type="button" className="pz-btn site-chrome" onClick={bake} disabled={onPizza.length === 0}>
                  {copy.bake}
                </button>
              )}
              {stage === 'baked' && (
                <button type="button" className="pz-btn site-chrome" onClick={() => setStage('sliced')}>
                  {copy.slice}
                </button>
              )}
              {stage === 'sliced' && (
                <button type="button" className="pz-btn site-chrome" onClick={() => setStage('served')}>
                  {copy.serve}
                </button>
              )}
              {building && onPizza.length > 0 && (
                <button type="button" className="pz-btn ghost site-chrome" onClick={() => reset(false)}>
                  <RotateCcw className="w-4 h-4" />
                  {copy.clear}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {building && (
        <>
          <h3 className="pz-title">{copy.toppingsTitle}</h3>
          <div className="pz-toppings">
            {TOPPINGS.map((topping) => (
              <button
                key={topping.id}
                type="button"
                className="pz-top site-chrome"
                aria-pressed={topping.layer ? layers.includes(topping.id) : undefined}
                onClick={() => addTopping(topping)}
              >
                <span className="pz-top-emoji" role="img" aria-hidden="true">
                  {topping.emoji}
                </span>
                <span className="pz-top-text">{topping[lang] || topping.he}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
