import React from 'react';
import { TESTIMONIALS } from './landingContent';

export default function SLTestimonials() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '112px 32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 44, lineHeight: 1.14, letterSpacing: '-0.025em', fontWeight: 500 }}>What parents say</h2>
      </div>
      <div className="sl-grid-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.by} style={{ background: '#fafdff', borderRadius: 32, padding: 36 }}>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#535862', fontWeight: 400 }}>{t.quote}</p>
            <div style={{ marginTop: 24, fontSize: 15 }}>{t.by}</div>
          </div>
        ))}
      </div>
    </section>
  );
}