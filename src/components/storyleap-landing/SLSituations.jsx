import React from 'react';
import { SITUATIONS } from './landingContent';

export default function SLSituations({ onPick, onStart }) {
  return (
    <section id="situations" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.12, letterSpacing: '-0.025em', fontWeight: 500 }}>Start with the moment you're in</h2>
        <p style={{ margin: '16px auto 0', maxWidth: 560, fontSize: 18, lineHeight: 1.5, color: '#535862', fontWeight: 400 }}>Pick what's happening at home. Every story is written around your child's own situation, not a template.</p>
      </div>
      <div className="sl-grid-4">
        {SITUATIONS.map((s) => (
          <button key={s.label} type="button" className="sl-tile" onClick={() => onPick(s.label)}
            style={{ textAlign: 'left', border: 0, fontFamily: 'inherit', fontWeight: 500, letterSpacing: '-0.01em', background: s.color, borderRadius: 24, padding: '26px 24px', fontSize: 19, color: '#0a0d12', minHeight: 132, display: 'flex', alignItems: 'flex-end' }}>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <button type="button" onClick={onStart} style={{ border: 0, fontFamily: 'inherit', fontWeight: 400, fontSize: 16, letterSpacing: '-0.01em', background: '#fafdff', color: '#0a0d12', padding: '14px 28px', borderRadius: 9999 }}>Something else my child is going through</button>
      </div>
    </section>
  );
}