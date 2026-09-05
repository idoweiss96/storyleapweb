import React from 'react';
import { HOW_STEPS } from './landingContent';

export default function SLHowItWorks({ onStart }) {
  return (
    <section id="how" style={{ maxWidth: 1200, margin: '0 auto', padding: '112px 32px 0' }}>
      <div className="sl-grid-2">
        <div>
          <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.12, letterSpacing: '-0.025em', fontWeight: 500 }}>How it works</h2>
          <p style={{ margin: '18px 0 0', fontSize: 18, lineHeight: 1.55, color: '#535862', fontWeight: 400, maxWidth: 420 }}>Around ten minutes from the first question to a story you can read together tonight.</p>
          <button type="button" onClick={onStart} style={{ marginTop: 28, border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 16, letterSpacing: '-0.01em', background: '#181d27', color: '#fff', padding: '15px 32px', borderRadius: 9999, boxShadow: '0 1px 2px rgba(10,13,18,0.4)' }}>Begin the questionnaire</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {HOW_STEPS.map((s) => (
            <div key={s.title} style={{ background: '#fafdff', borderRadius: 32, padding: '36px 40px' }}>
              <div style={{ fontSize: 13, color: '#93979f', fontWeight: 400, marginBottom: 12 }}>{s.step}</div>
              <h3 style={{ margin: 0, fontSize: 26, letterSpacing: '-0.02em', fontWeight: 500 }}>{s.title}</h3>
              <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}