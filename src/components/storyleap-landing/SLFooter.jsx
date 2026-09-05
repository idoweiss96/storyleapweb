import React from 'react';

export default function SLFooter() {
  const col = (label, links) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: '#535862' }}>
      <span style={{ color: '#93979f' }}>{label}</span>
      {links.map(([href, text]) => <a key={text} href={href} style={{ color: '#535862' }}>{text}</a>)}
    </div>
  );
  return (
    <footer style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px 56px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 9999, background: '#181d27', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13 }}>S</div>
            <span style={{ fontSize: 17, letterSpacing: '-0.03em' }}>StoryLeap</span>
          </div>
          <p style={{ margin: '14px 0 0', maxWidth: 280, fontSize: 14, lineHeight: 1.55, color: '#93979f', fontWeight: 400 }}>Personalized emotional stories that help families talk about the hard parts of growing up.</p>
        </div>
        {col('Product', [['#situations', 'Create a story'], ['#gallery', 'Story gallery'], ['#activities', 'Activities'], ['#how', 'Pricing']])}
        {col('Company', [['#how', 'Vision'], ['#faq', 'FAQ'], ['#faq', 'Contact']])}
        {col('Legal', [['#faq', 'Privacy'], ['#faq', 'Terms']])}
      </div>
      <div style={{ marginTop: 48, fontSize: 13, color: '#93979f', fontWeight: 400 }}>© 2026 StoryLeap</div>
    </footer>
  );
}