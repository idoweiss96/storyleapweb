import React from 'react';
import { TRUST_POINTS } from './landingContent';

export default function SLTrust() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px 0' }}>
      <div style={{ background: '#f1e6ff', borderRadius: 32, padding: 56, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.14, letterSpacing: '-0.025em', fontWeight: 500 }}>What you tell us stays between us</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 24 }}>
          {TRUST_POINTS.map((p) => (
            <div key={p.title}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>{p.title}</h3>
              <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.55, color: '#4a4d55', fontWeight: 400 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}