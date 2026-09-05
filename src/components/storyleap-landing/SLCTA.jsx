import React from 'react';

export default function SLCTA({ onStart }) {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '112px 32px 0' }}>
      <div style={{ background: '#181d27', borderRadius: 32, padding: 'clamp(40px,8vw,88px) clamp(24px,6vw,56px)', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(30px,6vw,56px)', lineHeight: 1.15, letterSpacing: '-0.03em', fontWeight: 500 }}>Turn what your child is going<br />through into something<br />you can read together</h2>
        <button type="button" onClick={onStart} style={{ marginTop: 36, border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em', background: '#fff', color: '#0a0d12', padding: '16px 38px', borderRadius: 9999 }}>Start your child's story</button>
      </div>
    </section>
  );
}