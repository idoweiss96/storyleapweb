import React from 'react';

export default function SLHero({ onStart }) {
  const badge = (bg, pos, animClass, text) =>
  <div style={{ position: 'absolute', zIndex: 2, ...pos, background: bg, color: '#0a0d12', fontSize: 19, padding: '18px 30px', borderRadius: 9999, boxShadow: '0 8px 18px rgba(4,69,144,0.10)' }} className={animClass}>{text}</div>;

  return (
    <section style={{ position: 'relative', maxWidth: 1120, margin: '0 auto', padding: '72px 32px 40px', textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fafdff', borderRadius: 9999, padding: '7px 16px', fontSize: 13, color: '#535862', marginBottom: 36 }}>
        <span style={{ width: 7, height: 7, borderRadius: 9999, background: '#d3f6e3', display: 'block' }}></span>
        Personalized emotional stories for children ages 3–9
      </div>
      <h1 style={{ margin: 0, fontSize: 'clamp(38px,7.2vw,88px)', lineHeight: 1.06, letterSpacing: '-0.03em', fontWeight: 500 }}>What is your child<br />going through right now?</h1>
      <p style={{ maxWidth: 620, margin: '28px auto 0', fontSize: 19, lineHeight: 1.5, color: '#535862', fontWeight: 400 }} className="text-xl">Children do not always have the words to explain what they are feeling. StoryLeap turns those moments into an illustrated story built around your child, and gives you a natural way to talk about it together.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 36 }}>
        <button type="button" onClick={onStart} style={{ border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 16, letterSpacing: '-0.01em', background: '#181d27', color: '#fff', padding: '15px 34px', borderRadius: 9999, boxShadow: '0 1px 2px rgba(10,13,18,0.4)' }}>Create your child's story</button>
        <a href="#activities" style={{ fontSize: 16, color: '#0a0d12', background: '#fafdff', padding: '15px 30px', borderRadius: 9999 }}>Try a free activity</a>
      </div>
      <div style={{ position: 'relative', marginTop: 64, background: '#fafdff', borderRadius: 32, padding: 14, boxShadow: '0 14px 30px 4px rgba(4,69,144,0.07)' }}>
        {badge('#f1e6ff', { top: -22, left: -26 }, 'sl-float-a', 'Personalized emotional story')}
        {badge('#d3f6e3', { top: -18, right: -24 }, 'sl-float-b', 'Shared parent-child experience')}
        {badge('#cce7ff', { bottom: -20, left: -30 }, 'sl-drift', 'Based on psychological therapy methods')}
        {badge('#ffe9d9', { bottom: -24, right: -22 }, 'sl-float-a', 'Digital guidance')}
        <div className="sl-img-ph" style={{ borderRadius: 24, height: 480, backgroundImage: "url(https://media.base44.com/images/public/697f4b704975c71e9cf56f59/998da025d_ChatGPTImageSep5202608_18_44PM.png)" }}></div>
      </div>
    </section>);

}