import React, { useState } from 'react';
import { RotateCcw, ShoppingBasket } from 'lucide-react';
import Critter from '../shared/art/Critter';
import Icon from '../shared/art/Icon';
import Scene from '../shared/art/Scene';
import { COINS, ITEMS, UI } from './storeContent';

const STYLE = `
  .st *{box-sizing:border-box}

  .st-role{
    display:inline-flex;align-items:center;gap:7px;
    font-size:13px;font-weight:800;color:#3A3357;
    background:#fff;border:2.4px solid #3A3357;border-radius:999px;
    padding:5px 16px;box-shadow:0 3px 0 rgba(58,51,87,.16);
  }

  .st-keeper{display:flex;align-items:center;gap:10px}

  .st-title{font-size:13px;font-weight:700;color:rgba(26,26,46,.45);margin:22px 0 10px}

  .st-shelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:9px}
  .st-item{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
    min-height:104px;padding:11px 6px;text-align:center;
    background:#fff;border:2.4px solid #3A3357;border-radius:16px;
    box-shadow:0 3px 0 rgba(58,51,87,.16);
    font-family:inherit;cursor:pointer;transition:.12s;
  }
  .st-item:hover{background:#F1FBF4;transform:translateY(-3px);box-shadow:0 6px 0 rgba(58,51,87,.16)}
  .st-item:active{transform:translateY(0);box-shadow:0 2px 0 rgba(58,51,87,.16)}
  .st-item:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}
  .st-item-text{font-size:12px;font-weight:700;color:#3A3357;line-height:1.3}
  .st-price{
    font-size:12.5px;font-weight:800;color:#7A5000;
    background:#FFE9A3;border:1.6px solid #3A3357;border-radius:999px;padding:1px 9px;
  }

  .st-basket{
    width:100%;max-width:420px;padding:14px 16px;
    background:rgba(255,255,255,.94);border:2.4px solid #3A3357;border-radius:18px;
  }
  .st-basket-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:10px}
  .st-basket-head h3{font-size:15px;font-weight:800;color:#1A1A6E;margin:0}
  .st-basket-count{font-size:12.5px;font-weight:700;color:#6B6486}
  .st-basket-empty{font-size:14.5px;color:#6B6486;line-height:1.5}
  .st-chips{display:flex;flex-wrap:wrap;gap:7px}
  .st-chip{
    display:inline-flex;align-items:center;gap:6px;
    min-height:44px;padding:0 12px;
    font-family:inherit;font-size:13.5px;font-weight:700;color:#3A3357;
    background:#fff;border:2px solid #3A3357;border-radius:12px;cursor:pointer;transition:.12s;
  }
  .st-chip:hover{background:#FFECEC;border-color:#EF6B6B;color:#C0392B}
  .st-chip:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}
  .st-hint{font-size:12.5px;color:#6B6486;margin-top:8px}

  .st-total{
    display:flex;align-items:baseline;justify-content:space-between;
    margin-top:12px;padding-top:11px;border-top:2px dashed #3A3357;
  }
  .st-total-label{font-size:14px;font-weight:700;color:#4A4468}
  .st-total-value{font-size:26px;font-weight:800;color:#1A1A6E}

  .st-amounts{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
  .st-amount{
    text-align:center;min-width:86px;padding:8px 12px;
    background:#fff;border:2.4px solid #3A3357;border-radius:14px;
  }
  .st-amount span{display:block;font-size:12px;font-weight:700;color:#6B6486}
  .st-amount strong{display:block;font-size:26px;font-weight:800;color:#1A1A6E;line-height:1.2}
  .st-amount.need strong{color:#EF6B6B}
  .st-amount.ok strong{color:#0F7B57}

  .st-coins{display:flex;flex-wrap:wrap;gap:11px;justify-content:center}
  .st-coin{
    display:grid;place-items:center;
    width:64px;height:64px;border-radius:999px;
    font-family:inherit;font-size:18px;font-weight:800;color:#7A5000;
    background:radial-gradient(circle at 34% 30%,#FFE9A3,#F5C842);
    border:2.6px solid #3A3357;box-shadow:0 4px 0 #3A3357;
    cursor:pointer;transition:.12s;
  }
  .st-coin:hover{transform:translateY(-3px);box-shadow:0 7px 0 #3A3357}
  .st-coin:active{transform:translateY(2px);box-shadow:0 2px 0 #3A3357}
  .st-coin:focus-visible{outline:3px solid #1A1A6E;outline-offset:3px}

  .st-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:20px}
  .st-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:46px;padding:0 24px;
    font-family:inherit;font-size:15px;font-weight:700;color:#fff;
    background:#5BC98C;border:2.4px solid #3A3357;border-radius:14px;
    box-shadow:0 4px 0 #3A3357;cursor:pointer;transition:.12s;
  }
  .st-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 0 #3A3357}
  .st-btn:active:not(:disabled){transform:translateY(2px);box-shadow:0 2px 0 #3A3357}
  .st-btn.ghost{color:#3A3357;background:#fff}
  .st-btn:disabled{opacity:.45;cursor:not-allowed}
  .st-btn:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}

  .st-done h2{font-size:21px;font-weight:800;color:#1A1A6E;margin:0}
  .st-done p{font-size:15px;line-height:1.55;color:#4A4468;max-width:330px;margin:0;text-align:center}

  @media (prefers-reduced-motion:reduce){
    .st-item,.st-item:hover,.st-coin,.st-coin:hover,.st-btn,.st-btn:hover{transition:none;transform:none}
  }
`;

export default function Store({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const money = (n) => `${copy.currency}${n}`;

  const [basket, setBasket] = useState([]); // { key, id }
  const [phase, setPhase] = useState('shop'); // shop | pay | done
  const [paid, setPaid] = useState(0);

  const itemById = (id) => ITEMS.find((i) => i.id === id);
  const total = basket.reduce((sum, entry) => sum + itemById(entry.id).price, 0);
  const remaining = Math.max(0, total - paid);
  const change = Math.max(0, paid - total);

  const addItem = (item) => setBasket((prev) => [...prev, { key: `${item.id}-${prev.length}`, id: item.id }]);
  const removeItem = (key) => setBasket((prev) => prev.filter((entry) => entry.key !== key));

  const startOver = () => {
    setBasket([]);
    setPaid(0);
    setPhase('shop');
  };

  if (phase === 'done') {
    return (
      <div className="st">
        <style>{STYLE}</style>
        <Scene variant="store" minHeight={320}>
          <div className="st-done" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Critter species="panda" expression="happy" size={110} />
            <h2>{copy.doneTitle}</h2>
            <p>{copy.doneText}</p>
            {change > 0 && (
              <p style={{ fontWeight: 800, color: '#1A1A6E' }}>
                {copy.change}: {money(change)}
              </p>
            )}
            <button type="button" className="st-btn site-chrome" onClick={startOver}>
              <RotateCcw className="w-4 h-4" />
              {copy.newShop}
            </button>
          </div>
        </Scene>
      </div>
    );
  }

  if (phase === 'pay') {
    return (
      <div className="st">
        <style>{STYLE}</style>

        <Scene variant="store" minHeight={420}>
          <span className="st-role">{copy.roleSeller}</span>

          <div className="st-keeper">
            <Critter species="panda" expression={remaining > 0 ? 'neutral' : 'happy'} size={72} />
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1A1A6E', margin: 0 }}>{copy.payTitle}</h3>
          </div>

          <div className="st-amounts" aria-live="polite">
            <div className="st-amount">
              <span>{copy.total}</span>
              <strong>{money(total)}</strong>
            </div>
            <div className="st-amount">
              <span>{copy.paid}</span>
              <strong>{money(paid)}</strong>
            </div>
            <div className={`st-amount ${remaining > 0 ? 'need' : 'ok'}`}>
              <span>{remaining > 0 ? copy.stillNeed : copy.change}</span>
              <strong>{money(remaining > 0 ? remaining : change)}</strong>
            </div>
          </div>

          <p style={{ fontSize: 14, fontWeight: 600, color: '#3A3357', margin: 0 }}>{copy.payHint}</p>

          <div className="st-coins">
            {COINS.map((coin) => (
              <button
                key={coin}
                type="button"
                className="st-coin site-chrome"
                onClick={() => setPaid((prev) => prev + coin)}
                aria-label={`${money(coin)}`}
              >
                {money(coin)}
              </button>
            ))}
          </div>
        </Scene>

        <div className="st-actions">
          <button type="button" className="st-btn site-chrome" disabled={paid < total} onClick={() => setPhase('done')}>
            {copy.pay}
          </button>
          <button type="button" className="st-btn ghost site-chrome" onClick={() => setPaid(0)}>
            <RotateCcw className="w-4 h-4" />
            {copy.resetCoins}
          </button>
          <button
            type="button"
            className="st-btn ghost site-chrome"
            onClick={() => {
              setPaid(0);
              setPhase('shop');
            }}
          >
            {copy.backToShelf}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="st">
      <style>{STYLE}</style>

      <Scene variant="store" minHeight={300}>
        <span className="st-role">{copy.roleShopper}</span>

        <div className="st-basket">
          <div className="st-basket-head">
            <h3>{copy.basketTitle}</h3>
            <span className="st-basket-count">
              {basket.length} {copy.items}
            </span>
          </div>

          {basket.length === 0 ? (
            <p className="st-basket-empty">{copy.basketEmpty}</p>
          ) : (
            <>
              <div className="st-chips">
                {basket.map((entry) => {
                  const item = itemById(entry.id);
                  return (
                    <button
                      key={entry.key}
                      type="button"
                      className="st-chip site-chrome"
                      onClick={() => removeItem(entry.key)}
                    >
                      <Icon name={item.id} size={22} />
                      {item[lang] || item.he}
                      <span className="st-price">{money(item.price)}</span>
                    </button>
                  );
                })}
              </div>
              <p className="st-hint">{copy.removeHint}</p>
            </>
          )}

          <div className="st-total" aria-live="polite">
            <span className="st-total-label">{copy.total}</span>
            <span className="st-total-value">{money(total)}</span>
          </div>
        </div>
      </Scene>

      <h3 className="st-title">{copy.shelfTitle}</h3>
      <div className="st-shelf">
        {ITEMS.map((item) => (
          <button key={item.id} type="button" className="st-item site-chrome" onClick={() => addItem(item)}>
            {/* The item id doubles as the Icon name. */}
            <Icon name={item.id} size={36} />
            <span className="st-item-text">{item[lang] || item.he}</span>
            <span className="st-price">{money(item.price)}</span>
          </button>
        ))}
      </div>

      <div className="st-actions">
        <button
          type="button"
          className="st-btn site-chrome"
          disabled={basket.length === 0}
          onClick={() => setPhase('pay')}
        >
          <ShoppingBasket className="w-4 h-4" />
          {copy.toCheckout}
        </button>
        {basket.length > 0 && (
          <button type="button" className="st-btn ghost site-chrome" onClick={startOver}>
            <RotateCcw className="w-4 h-4" />
            {copy.newShop}
          </button>
        )}
      </div>
    </div>
  );
}
