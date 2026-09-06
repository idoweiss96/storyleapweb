import React from 'react';

const Cloud = ({ style }) => (
  <div
    style={{
      position: 'absolute',
      background: 'radial-gradient(ellipse at 32% 28%, #ffffff 0%, #f3f8fd 65%, #e6eef8 100%)',
      borderRadius: '999px',
      boxShadow: '0 18px 32px -8px rgba(140,165,200,0.22)',
      filter: 'blur(0.5px)',
      opacity: 0.85,
      ...style,
    }}
  />
);

export default function SLFloatingClouds() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <style>{`
        @keyframes sl-cloud-drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(120px, -45px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      <div style={{ position: 'absolute', top: '6%', left: '5%', width: 280, height: 92, animation: 'sl-cloud-drift 9s ease-in-out infinite' }}>
        <Cloud style={{ width: 180, height: 78, top: 10, left: 0 }} />
        <Cloud style={{ width: 110, height: 62, top: -20, left: 70 }} />
        <Cloud style={{ width: 130, height: 54, top: 16, left: 130 }} />
        <Cloud style={{ width: 90, height: 40, top: 22, left: 40 }} />
      </div>
      <div style={{ position: 'absolute', top: '16%', right: '8%', width: 220, height: 80, animation: 'sl-cloud-drift 11s ease-in-out infinite 2s' }}>
        <Cloud style={{ width: 140, height: 60, top: 10, left: 0 }} />
        <Cloud style={{ width: 95, height: 50, top: -14, left: 60 }} />
        <Cloud style={{ width: 70, height: 36, top: 18, left: 30 }} />
      </div>
      <div style={{ position: 'absolute', top: '38%', left: '15%', width: 200, height: 72, animation: 'sl-cloud-drift 10s ease-in-out infinite 1s' }}>
        <Cloud style={{ width: 120, height: 52, top: 8, left: 0 }} />
        <Cloud style={{ width: 85, height: 42, top: -12, left: 56 }} />
        <Cloud style={{ width: 60, height: 30, top: 16, left: 24 }} />
      </div>
      <div style={{ position: 'absolute', top: '55%', right: '12%', width: 260, height: 88, animation: 'sl-cloud-drift 12s ease-in-out infinite 3s' }}>
        <Cloud style={{ width: 160, height: 70, top: 8, left: 0 }} />
        <Cloud style={{ width: 100, height: 54, top: -18, left: 68 }} />
        <Cloud style={{ width: 110, height: 46, top: 18, left: 118 }} />
        <Cloud style={{ width: 75, height: 34, top: 24, left: 40 }} />
      </div>
      <div style={{ position: 'absolute', top: '75%', left: '25%', width: 200, height: 72, animation: 'sl-cloud-drift 9.5s ease-in-out infinite 0.5s' }}>
        <Cloud style={{ width: 120, height: 52, top: 8, left: 0 }} />
        <Cloud style={{ width: 85, height: 42, top: -12, left: 56 }} />
        <Cloud style={{ width: 55, height: 28, top: 14, left: 20 }} />
      </div>
    </div>
  );
}