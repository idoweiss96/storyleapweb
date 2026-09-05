import React from 'react';

export default function SLHeader({ onStart }) {
  const navLink = (href, label) => <a href={href} style={{ color: '#535862' }}>{label}</a>;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(12px)', background: 'rgba(235,245,255,0.82)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9999, background: '#181d27', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15 }}>S</div>
          <span style={{ fontSize: 19, letterSpacing: '-0.03em', color: '#0a0d12' }}>StoryLeap</span>
        </a>
        <nav className="sl-nav">
          {navLink('#situations', 'Situations')}
          {navLink('#how', 'How it works')}
          {navLink('#gallery', 'Examples')}
          {navLink('#activities', 'Activities')}
          {navLink('#faq', 'FAQ')}
        </nav>
        <button type="button" onClick={onStart} style={{ border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em', background: '#181d27', color: '#fff', padding: '11px 24px', borderRadius: 9999, boxShadow: '0 1px 2px rgba(10,13,18,0.4)' }}>Start a story</button>
      </div>
    </header>
  );
}