import React from 'react';

const Cloud = ({ style }) => (
  <div
    style={{
      position: 'absolute',
      background: '#fff',
      borderRadius: '999px',
      filter: 'blur(1px)',
      opacity: 0.8,
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
          50% { transform: translate(40px, -18px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      <div style={{ position: 'absolute', top: '6%', left: '5%', width: 280, height: 92, animation: 'sl-cloud-drift 18s ease-in-out infinite' }}>
        <Cloud style={{ width: 180, height: 80, top: 0, left: 0 }} />
        <Cloud style={{ width: 120, height: 68, top: -28, left: 80 }} />
        <Cloud style={{ width: 140, height: 60, top: 12, left: 140 }} />
      </div>
      <div style={{ position: 'absolute', top: '16%', right: '8%', width: 220, height: 80, animation: 'sl-cloud-drift 22s ease-in-out infinite 2s' }}>
        <Cloud style={{ width: 140, height: 64, top: 0, left: 0 }} />
        <Cloud style={{ width: 100, height: 56, top: -20, left: 70 }} />
      </div>
      <div style={{ position: 'absolute', top: '38%', left: '15%', width: 200, height: 72, animation: 'sl-cloud-drift 20s ease-in-out infinite 1s' }}>
        <Cloud style={{ width: 130, height: 56, top: 0, left: 0 }} />
        <Cloud style={{ width: 90, height: 48, top: -16, left: 64 }} />
      </div>
      <div style={{ position: 'absolute', top: '55%', right: '12%', width: 260, height: 88, animation: 'sl-cloud-drift 24s ease-in-out infinite 3s' }}>
        <Cloud style={{ width: 170, height: 76, top: 0, left: 0 }} />
        <Cloud style={{ width: 110, height: 60, top: -24, left: 76 }} />
        <Cloud style={{ width: 120, height: 52, top: 16, left: 130 }} />
      </div>
      <div style={{ position: 'absolute', top: '75%', left: '25%', width: 200, height: 72, animation: 'sl-cloud-drift 19s ease-in-out infinite 0.5s' }}>
        <Cloud style={{ width: 130, height: 56, top: 0, left: 0 }} />
        <Cloud style={{ width: 90, height: 48, top: -16, left: 64 }} />
      </div>
    </div>
  );
}