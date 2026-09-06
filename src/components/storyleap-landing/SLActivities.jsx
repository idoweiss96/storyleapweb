import React from 'react';
import { SmilePlus, Thermometer, Paintbrush } from 'lucide-react';
import { ACTIVITIES } from './landingContent';

const ICONS = { SmilePlus, Thermometer, Paintbrush };

export default function SLActivities() {
  return (
    <section id="activities" style={{ maxWidth: 1200, margin: '0 auto', padding: '112px 32px 0' }}>
      <div style={{ background: '#fafdff', borderRadius: 32, padding: 56 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 24, marginBottom: 40 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 44, lineHeight: 1.14, letterSpacing: '-0.025em', fontWeight: 500 }}>Activities you can do today</h2>
            <p style={{ margin: '14px 0 0', maxWidth: 520, fontSize: 17, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Short tools for naming and sizing feelings. Free, no account needed.</p>
          </div>
          <a href="/concept-activities" style={{ fontSize: 15, color: '#0a0d12', background: '#ebf5ff', padding: '12px 24px', borderRadius: 9999 }}>See all activities</a>
        </div>
        <div className="sl-grid-3b">
          {ACTIVITIES.map((a) => {
            const Icon = ICONS[a.icon];
            return (
              <div key={a.title} className="sl-tile" style={{ background: '#fff', border: '2px solid #ebf5ff', boxShadow: '0 8px 24px rgba(10,13,18,0.05)', borderRadius: 24, padding: 32, minHeight: 210, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {Icon && <Icon size={26} color="#0a0d12" strokeWidth={1.75} />}
                </div>
                <h3 style={{ margin: 0, fontSize: 22, letterSpacing: '-0.02em', fontWeight: 500 }}>{a.title}</h3>
                <p style={{ margin: '8px 0 0', fontSize: 17, lineHeight: 1.5, color: '#4a4d55', fontWeight: 400 }}>{a.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}