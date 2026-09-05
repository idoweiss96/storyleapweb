import React from 'react';
import { GALLERY } from './landingContent';

export default function SLGallery() {
  return (
    <section id="gallery" style={{ maxWidth: 1200, margin: '0 auto', padding: '112px 32px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.12, letterSpacing: '-0.025em', fontWeight: 500 }}>Stories other families made</h2>
        <p style={{ margin: '16px auto 0', maxWidth: 560, fontSize: 18, lineHeight: 1.5, color: '#535862', fontWeight: 400 }}>Examples of what StoryLeap creates. Names and details changed.</p>
      </div>
      <div className="sl-grid-3">
        {GALLERY.map((g) => (
          <div key={g.title} style={{ background: '#fafdff', borderRadius: 32, padding: 16 }}>
            <div className="sl-img-ph" style={{ borderRadius: 24, height: 260, backgroundImage: `url(${g.img})` }}></div>
            <div style={{ padding: '22px 22px 14px' }}>
              <h3 style={{ margin: 0, fontSize: 21, letterSpacing: '-0.02em', fontWeight: 500 }}>{g.title}</h3>
              <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.5, color: '#535862', fontWeight: 400 }}>{g.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}