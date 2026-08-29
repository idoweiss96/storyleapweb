import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Critter from '../shared/art/Critter';
import Icon from '../shared/art/Icon';
import Scene from '../shared/art/Scene';
import { ORDERS, SLOTS, TOPPINGS, UI } from './pizzeriaContent';

const STYLE = `
  .pz *{box-sizing:border-box}

  .pz-order{
    display:flex;align-items:center;gap:11px;
    padding:10px 14px 10px 10px;margin-bottom:16px;
    background:#fff;border:2.4px solid #3A3357;border-radius:18px;
    box-shadow:0 3px 0 rgba(58,51,87,.16);
  }
  .pz-order-body{flex:1;min-width:0}
  .pz-order-name{font-size:12.5px;font-weight:700;color:#6B6486}
  .pz-order-line{font-size:15px;font-weight:600;color:#1A1A6E;line-height:1.4}
  .pz-order-need{font-size:13px;color:#6B6486;margin-top:4px}
  .pz-order-need.ready{color:#0F7B57;font-weight:700}

  .pz-pizza{
    position:relative;width:min(70vw,250px);aspect-ratio:1;
    border-radius:50%;
    background:#E8B96B;
    border:2.6px solid #3A3357;
    filter:drop-shadow(0 8px 14px rgba(26,26,110,.2));
    transition:background .4s;
  }
  .pz-pizza.baked{background:#D69B45}
  .pz-inner{
    position:absolute;inset:8%;border-radius:50%;
    background:#F2D9A8;border:2px solid rgba(58,51,87,.35);transition:background .3s;
  }
  .pz-inner.sauce{background:#D8452F}
  .pz-inner.cheese{background:#F5C842}
  .pz-inner.sauce.cheese{background:#EFAE3B}
  .pz-piece{
    position:absolute;line-height:0;
    transform:translate(-50%,-50%);
    animation:pz-drop .28s ease;
  }
  .pz-slice{position:absolute;inset:8%;border-radius:50%;pointer-events:none}
  .pz-slice span{
    position:absolute;top:0;bottom:0;left:50%;width:3px;margin-inline-start:-1.5px;
    background:rgba(58,51,87,.55);transform-origin:50% 50%;
  }

  .pz-oven{
    width:min(70vw,250px);height:16px;border-radius:999px;
    background:#fff;border:2.4px solid #3A3357;overflow:hidden;
  }
  .pz-oven i{display:block;height:100%;background:#FF9F5A;transition:width .18s linear}

  .pz-status{
    font-size:14.5px;font-weight:700;color:#1A1A6E;text-align:center;min-height:21px;
    background:rgba(255,255,255,.9);border-radius:999px;padding:3px 14px;
  }
  .pz-status:empty{background:none;padding:0}

  .pz-title{font-size:13px;font-weight:700;color:rgba(26,26,46,.45);margin:24px 0 10px}
  .pz-toppings{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:9px}
  .pz-top{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
    min-height:92px;padding:10px 6px;text-align:center;
    background:#fff;border:2.4px solid #3A3357;border-radius:16px;
    box-shadow:0 3px 0 rgba(58,51,87,.16);
    font-family:inherit;cursor:pointer;transition:.12s;
  }
  .pz-top:hover{background:#FFF8EE;transform:translateY(-3px);box-shadow:0 6px 0 rgba(58,51,87,.16)}
  .pz-top:active{transform:translateY(0);box-shadow:0 2px 0 rgba(58,51,87,.16)}
  .pz-top:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}
  .pz-top[aria-pressed="true"]{background:#FFF0D6}
  .pz-top-text{font-size:12px;font-weight:700;color:#3A3357;line-height:1.3}

  .pz-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:20px}
  .pz-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:46px;padding:0 24px;
    font-family:inherit;font-size:15px;font-weight:700;color:#fff;
    background:#FF9F5A;border:2.4px solid #3A3357;border-radius:14px;
    box-shadow:0 4px 0 #3A3357;cursor:pointer;transition:.12s;
  }
  .pz-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 0 #3A3357}
  .pz-btn:active:not(:disabled){transform:translateY(2px);box-shadow:0 2px 0 #3A3357}
  .pz-btn.ghost{color:#3A3357;background:#fff}
  .pz-btn.small{min-height:38px;padding:0 14px;font-size:13px;box-shadow:0 3px 0 #3A3357}
  .pz-btn:disabled{opacity:.45;cursor:not-allowed}
  .pz-btn:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}

  .pz-served{display:flex;flex-direction:column;align-items:center;gap:11px;text-align:center}
  .pz-served h2{font-size:20px;font-weight:800;color:#1A1A6E;margin:0}
  .pz-served p{font-size:15px;line-height:1.55;color:#4A4468;max-width:320px;margin:0}

  @keyframes pz-drop{from{opacity:0;transform:translate(-50%,-160%) scale(.6)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}

  @media (prefers-reduced-motion:reduce){
    .pz-piece{animation:none}
    .pz-top,.pz-top:hover,.pz-btn,.pz-btn:hover{transition:none;transform:none}
    .pz-oven i{transition:none}
  }
`;

const BAKE_MS = 3200;

export default function Pizzeria({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [orderIndex, setOrderIndex] = useState(0);
  const [freePlay, setFreePlay] = useState(false);
  const [layers, setLayers] = useState([]); // 'sauce' / 'cheese'
  const [pieces, setPieces] = useState([]); // { key, id, slot }
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
      prev.length >= SLOTS.length ? prev : [...prev, { key: `${topping.id}-${prev.length}`, id: topping.id, slot: prev.length }]
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
        {order ? (
          <Critter species={order.customer} expression="happy" size={54} label={orderCopy.name} />
        ) : (
          <Critter species="topi" expression="happy" size={54} />
        )}
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
          className="pz-btn ghost small site-chrome"
          onClick={() => {
            setFreePlay((prev) => !prev);
            reset(false);
          }}
        >
          {freePlay ? copy.withOrder : copy.freePlay}
        </button>
      </div>

      <Scene variant="pizzeria" minHeight={stage === 'served' ? 300 : 380}>
        {stage === 'served' ? (
          <div className="pz-served">
            <Critter species={order ? order.customer : 'topi'} expression="happy" size={110} />
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
                  style={{ left: `${SLOTS[piece.slot].x}%`, top: `${SLOTS[piece.slot].y}%` }}
                >
                  <Icon name={piece.id} size={30} />
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

            <div className="pz-actions" style={{ marginTop: 0 }}>
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
      </Scene>

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
                {/* The topping id doubles as the Icon name. */}
                <Icon name={topping.id} size={34} />
                <span className="pz-top-text">{topping[lang] || topping.he}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
