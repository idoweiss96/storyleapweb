import React from 'react';
import WorldView from '../../learning-games/world3d/WorldView';
import Icon from '../shared/art/Icon';
import { PizzeriaWorld } from './pizzeriaWorld';
import { UI } from './pizzeriaContent';

/**
 * The pizzeria as a 3D kitchen: topping bins, a work table, an oven and a
 * cutting board. Same orders and toppings as before — see pizzeriaContent.js.
 * The fixed sequence (toppings → oven → slice → serve) is now walked, not tapped.
 */
export default function Pizzeria({ lang = 'he' }) {
  const ui = UI[lang] || UI.he;
  const levels = [
    { id: 'orders', he: UI.he.levelOrders, en: UI.en.levelOrders },
    { id: 'free', he: UI.he.levelFree, en: UI.en.levelFree },
  ];
  return (
    <WorldView
      GameClass={PizzeriaWorld}
      levels={levels}
      copy={ui}
      lang={lang}
      host="panda"
      hud={(s) => (s.wants.length ? [{ key: 'o', node: `${ui.orderTitle}: ${Math.min(s.served + 1, s.total)}/${s.total}` }] : [])}
      renderOverlay={(s) =>
        s.line ? (
          <div data-anchor="customer">
            <div className="w3-bubble" style={{ flexDirection: 'column', gap: 6, maxWidth: 280 }}>
              {/* The spoken order shows until work starts; then only the checklist
                  stays, so the bubble doesn't cover the kitchen on a phone. */}
              {(s.on.length === 0 || !s.wants.length) && <span style={{ fontSize: 14, lineHeight: 1.35, fontWeight: 700 }}>{s.line}</span>}
              {s.wants.length > 0 && (
                <span style={{ display: 'flex', gap: 6 }}>
                  {s.wants.map((w) => (
                    <span key={w} style={{ position: 'relative', opacity: s.on.includes(w) ? 1 : 0.55 }}>
                      <Icon name={w} size={32} />
                      {s.on.includes(w) && (
                        <span style={{ position: 'absolute', bottom: -4, insetInlineEnd: -4, background: '#5BC98C', color: '#fff', borderRadius: 999, width: 16, height: 16, fontSize: 11, display: 'grid', placeItems: 'center', border: '2px solid #3A3357' }}>✓</span>
                      )}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        ) : null
      }
    />
  );
}
