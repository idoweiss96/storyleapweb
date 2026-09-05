import React from 'react';

export default function SLParentSupport() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '112px 32px 0' }}>
      <div className="sl-grid-2" style={{ alignItems: 'center' }}>
        <div className="sl-img-ph" style={{ borderRadius: 32, height: 420, backgroundImage: "url(https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&q=80)" }}></div>
        <div>
          <h2 style={{ margin: 0, fontSize: 48, lineHeight: 1.12, letterSpacing: '-0.025em', fontWeight: 500 }}>You get the words too</h2>
          <p style={{ margin: '18px 0 0', fontSize: 18, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>StoryLeap supports the parent as much as the child. Alongside every story you get small, practical guidance: how to ask an open question, how to talk about a drawing, how to name an emotion, what to do when your child says they're scared.</p>
          <p style={{ margin: '20px 0 0', fontSize: 20, lineHeight: 1.5, color: '#0a0d12', fontWeight: 500 }}>"Now I have a way to talk about this with my child."</p>
        </div>
      </div>
    </section>
  );
}