import React, { useState } from 'react';
import { RotateCcw, ShoppingBasket } from 'lucide-react';
import { COINS, ITEMS, UI } from './storeContent';

const STYLE = `
  .st *{box-sizing:border-box}

  .st-role{
    display:inline-flex;align-items:center;gap:7px;
    font-size:13px;font-weight:700;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border-radius:999px;padding:6px 16px;margin-bottom:14px;
  }

  .st-title{font-size:13px;font-weight:700;color:rgba(26,26,46,.45);margin:22px 0 10px}

  .st-shelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:9px}
  .st-item{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
    min-height:96px;padding:11px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:15px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .st-item:hover{border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .st-item:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .st-item-emoji{font-size:30px;line-height:1}
  .st-item-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}
  .st-price{
    font-size:12.5px;font-weight:700;color:#1A1A6E;
    background:#FFF0F7;border-radius:999px;padding:2px 9px;
  }

  .st-basket{
    padding:16px 18px;
    background:linear-gradient(160deg,#fff 0%,#FFF8FB 100%);
    border:2px solid #FFD6EC;border-radius:20px;
  }
  .st-basket-head{
    display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:11px;
  }
  .st-basket-head h3{font-size:15px;font-weight:700;color:#1A1A6E;margin:0}
  .st-basket-count{font-size:12.5px;font-weight:600;color:rgba(26,26,46,.45)}
  .st-basket-empty{font-size:14.5px;color:rgba(26,26,46,.42);line-height:1.5}
  .st-chips{display:flex;flex-wrap:wrap;gap:7px}
  .st-chip{
    display:inline-flex;align-items:center;gap:6px;
    min-height:44px;padding:0 13px;
    font-family:inherit;font-size:14px;font-weight:600;color:#1A1A6E;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;cursor:pointer;transition:.15s;
  }
  .st-chip:hover{border-color:#EF6B6B;color:#EF6B6B}
  .st-chip:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .st-hint{font-size:12.5px;color:rgba(26,26,46,.4);margin-top:9px}

  .st-total{
    display:flex;align-items:baseline;justify-content:space-between;
    margin-top:14px;padding-top:13px;border-top:1.5px dashed #FFD6EC;
  }
  .st-total-label{font-size:14px;font-weight:600;color:rgba(26,26,46,.5)}
  .st-total-value{font-size:26px;font-weight:800;color:#1A1A6E}

  .st-till{
    display:flex;flex-direction:column;align-items:center;gap:14px;
    padding:24px 18px;
    background:linear-gradient(160deg,#fff 0%,#F2FBFE 100%);
    border:2px solid #EDE9F8;border-radius:22px;
  }
  .st-amounts{display:flex;gap:26px;flex-wrap:wrap;justify-content:center}
  .st-amount{text-align:center}
  .st-amount span{display:block;font-size:12.5px;font-weight:700;color:rgba(26,26,46,.45)}
  .st-amount strong{display:block;font-size:30px;font-weight:800;color:#1A1A6E;line-height:1.2}
  .st-amount.need strong{color:#EF6B6B}
  .st-amount.ok strong{color:#0F7B57}

  .st-coins{display:flex;flex-wrap:wrap;gap:11px;justify-content:center}
  .st-coin{
    display:grid;place-items:center;
    width:62px;height:62px;border-radius:999px;
    font-family:inherit;font-size:19px;font-weight:800;color:#7A5000;
    background:radial-gradient(circle at 34% 30%,#FFE9A3,#F5C842);
    border:2.5px solid #E0A93B;cursor:pointer;transition:.15s;
  }
  .st-coin:hover{transform:translateY(-3px)}
  .st-coin:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:3px}

  .st-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:20px}
  .st-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:44px;padding:0 22px;
    font-family:inherit;font-size:15px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:12px;cursor:pointer;
  }
  .st-btn.ghost{color:#1A1A6E;background:#fff;border:1.5px solid #EDE9F8}
  .st-btn:disabled{opacity:.45;cursor:not-allowed}
  .st-btn:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .st-done{
    display:flex;flex-direction:column;align-items:center;gap:12px;
    padding:44px 22px;text-align:center;
    background:linear-gradient(160deg,#fff 0%,#FFF0F7 100%);
    border:2px solid #FFD6EC;border-radius:22px;
  }
  .st-done h2{font-size:21px;font-weight:700;color:#1A1A6E;margin:0}
  .st-done p{font-size:15px;line-height:1.55;color:rgba(26,26,46,.6);max-width:360px;margin:0}

  @media (prefers-reduced-motion:reduce){
    .st-item,.st-item:hover,.st-coin,.st-coin:hover{transition:none;transform:none}
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
        <div className="st-done">
          <span style={{ fontSize: 58, lineHeight: 1 }} role="img" aria-hidden="true">
            🛍️
          </span>
          <h2>{copy.doneTitle}</h2>
          <p>{copy.doneText}</p>
          {change > 0 && (
            <p style={{ fontWeight: 700, color: '#1A1A6E' }}>
              {copy.change}: {money(change)}
            </p>
          )}
          <button type="button" className="st-btn site-chrome" onClick={startOver}>
            <RotateCcw className="w-4 h-4" />
            {copy.newShop}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'pay') {
    return (
      <div className="st">
        <style>{STYLE}</style>

        <span className="st-role">{copy.roleSeller}</span>

        <div className="st-till">
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A6E', margin: 0 }}>{copy.payTitle}</h3>

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

          <p style={{ fontSize: 14, color: 'rgba(26,26,46,.5)', margin: 0 }}>{copy.payHint}</p>

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
        </div>

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
                    <span role="img" aria-hidden="true">
                      {item.emoji}
                    </span>
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

      <h3 className="st-title">{copy.shelfTitle}</h3>
      <div className="st-shelf">
        {ITEMS.map((item) => (
          <button key={item.id} type="button" className="st-item site-chrome" onClick={() => addItem(item)}>
            <span className="st-item-emoji" role="img" aria-hidden="true">
              {item.emoji}
            </span>
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
