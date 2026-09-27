import React from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';
import WorldView from '../../learning-games/world3d/WorldView';
import Icon from '../shared/art/Icon';
import { StoreWorld } from './storeWorld';
import { COINS, UI } from './storeContent';

const LEVELS = [{ id: 'play', he: '', en: '' }];

const STYLE = `
  .sw-basket{position:absolute;top:54px;left:50%;transform:translateX(-50%);display:flex;gap:4px;align-items:center;
    background:rgba(255,255,255,.94);border:2.4px solid #3A3357;border-radius:14px;padding:3px 10px;pointer-events:none;
    font-weight:900;color:#1A1A6E;box-shadow:0 3px 0 rgba(58,51,87,.18)}
  .sw-pay{position:absolute;inset-inline:12px;bottom:12px;background:#fff;border:2.6px solid #3A3357;border-radius:20px;
    padding:12px;pointer-events:auto;box-shadow:0 6px 0 rgba(58,51,87,.2);display:flex;flex-direction:column;gap:10px;align-items:center}
  .sw-pay h3{margin:0;font-size:17px;font-weight:900;color:#1A1A6E}
  .sw-coins{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
  .sw-coin{width:58px;height:58px;border-radius:999px;border:3px solid #3A3357;background:radial-gradient(circle at 35% 30%,#FFE9A3,#F5C842 60%,#D9A21F);
    font-family:inherit;font-weight:900;font-size:20px;color:#6B4A00;cursor:pointer;box-shadow:0 4px 0 #3A3357}
  .sw-coin:active{transform:translateY(3px);box-shadow:0 1px 0 #3A3357}
  .sw-sums{display:flex;gap:14px;font-weight:800;color:#3A3357;font-size:15px;flex-wrap:wrap;justify-content:center}
  .sw-sums b{color:#1A1A6E;font-size:18px}
`;

/**
 * The store as a 3D shop for two players at one screen: the shopper walks the
 * aisles filling a basket, the shopkeeper counts coins at the till.
 * Same items and prices as before — see storeContent.js.
 */
export default function Store({ lang = 'he' }) {
  const ui = UI[lang] || UI.he;
  const copy = { ...ui, again: ui.newShop };
  const cur = ui.currency;
  return (
    <WorldView
      GameClass={StoreWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="cat"
      style={STYLE}
      hud={(s) => [{ key: 'r', node: s.phase === 'shop' ? ui.roleShopper : ui.roleSeller }]}
      renderOverlay={(s, g) => (
        <>
          {s.basket.length > 0 && (
            <div className="sw-basket">
              <Icon name="basket" size={26} />
              {s.basket.map((id, i) => <Icon key={i} name={id} size={24} />)}
              <span style={{ marginInlineStart: 6 }}>{ui.total}: {s.total}{cur}</span>
            </div>
          )}
          {s.phase === 'pay' && (
            <div className="sw-pay" data-ui>
              <h3>{ui.payTitle} — {ui.total}: {s.total}{cur}</h3>
              <span style={{ fontSize: 13, color: '#5B5578', fontWeight: 600 }}>{ui.payHint}</span>
              <div className="sw-coins">
                {COINS.map((c) => (
                  <button key={c} type="button" className="sw-coin" onClick={() => g.addCoin(c)} aria-label={`${c}${cur}`}>{c}</button>
                ))}
              </div>
              <div className="sw-sums">
                <span>{ui.paid}: <b>{s.paid}{cur}</b></span>
                {s.paid < s.total ? <span>{ui.stillNeed}: <b>{s.total - s.paid}{cur}</b></span> : <span>{ui.change}: <b>{s.paid - s.total}{cur}</b></span>}
              </div>
              <div className="lg-row">
                <button type="button" className="lg-btn" disabled={s.paid < s.total} onClick={() => g.pay()}>{ui.pay}</button>
                <button type="button" className="lg-btn ghost" onClick={() => g.resetCoins()}><RotateCcw className="w-4 h-4" />{ui.resetCoins}</button>
              </div>
            </div>
          )}
        </>
      )}
      actions={(s, g) =>
        s.phase === 'shop' && s.basket.length ? (
          <button type="button" className="w3-act blue" onClick={() => g.putBack()} style={{ minWidth: 62, minHeight: 62, fontSize: 13 }}>
            <Undo2 className="w-5 h-5" />
            {ui.putBack}
          </button>
        ) : null
      }
    />
  );
}
