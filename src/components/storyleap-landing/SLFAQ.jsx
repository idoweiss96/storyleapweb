import React from 'react';
import { FAQ_ITEMS } from './landingContent';

export default function SLFAQ() {
  return (
    <section id="faq" style={{ maxWidth: 860, margin: '0 auto', padding: '112px 32px 0' }}>
      <h2 style={{ margin: '0 0 32px', fontSize: 44, lineHeight: 1.14, letterSpacing: '-0.025em', fontWeight: 500, textAlign: 'center' }}>Questions parents ask</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FAQ_ITEMS.map((f) => (
          <details key={f.q} style={{ background: '#fafdff', borderRadius: 24, padding: '28px 32px' }}>
            <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, fontSize: 19, letterSpacing: '-0.02em', cursor: 'pointer', listStyle: 'none' }}>
              {f.q}
              <span style={{ display: 'block', color: '#93979f' }}>+</span>
            </summary>
            <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.6, color: '#535862', fontWeight: 400 }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}