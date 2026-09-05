import React from 'react';

export default function SLHeader({ onStart }) {
  const navLink = (href, label) => <a href={href} style={{ color: '#535862' }}>{label}</a>;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(12px)', background: 'rgba(235,245,255,0.82)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="https://media.base44.com/images/public/697f4b704975c71e9cf56f59/449f3427e_Storyleap.jpg" alt="StoryLeap" style={{ height: 28, width: 'auto' }} />
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