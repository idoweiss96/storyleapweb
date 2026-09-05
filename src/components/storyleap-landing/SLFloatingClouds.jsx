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
          0% { transform: translateX(0); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div style={{ position: 'absolute', top: '6%', left: '5%', width: 140, height: 46, animation: 'sl-cloud-drift 18s ease-in-out infinite' }}>
        <Cloud style={{ width: 90, height: 40, top: 0, left: 0 }} />
        <Cloud style={{ width: 60, height: 34, top: -14, left: 40 }} />
        <Cloud style={{ width: 70, height: 30, top: 6, left: 70 }} />
      </div>
      <div style={{ position: 'absolute', top: '16%', right: '8%', width: 110, height: 40, animation: 'sl-cloud-drift 22s ease-in-out infinite 2s' }}>
        <Cloud style={{ width: 70, height: 32, top: 0, left: 0 }} />
        <Cloud style={{ width: 50, height: 28, top: -10, left: 35 }} />
      </div>
      <div style={{ position: 'absolute', top: '38%', left: '15%', width: 100, height: 36, animation: 'sl-cloud-drift 20s ease-in-out infinite 1s' }}>
        <Cloud style={{ width: 65, height: 28, top: 0, left: 0 }} />
        <Cloud style={{ width: 45, height: 24, top: -8, left: 32 }} />
      </div>
      <div style={{ position: 'absolute', top: '55%', right: '12%', width: 130, height: 44, animation: 'sl-cloud-drift 24s ease-in-out infinite 3s' }}>
        <Cloud style={{ width: 85, height: 38, top: 0, left: 0 }} />
        <Cloud style={{ width: 55, height: 30, top: -12, left: 38 }} />
        <Cloud style={{ width: 60, height: 26, top: 8, left: 65 }} />
      </div>
      <div style={{ position: 'absolute', top: '75%', left: '25%', width: 100, height: 36, animation: 'sl-cloud-drift 19s ease-in-out infinite 0.5s' }}>
        <Cloud style={{ width: 65, height: 28, top: 0, left: 0 }} />
        <Cloud style={{ width: 45, height: 24, top: -8, left: 32 }} />
      </div>
    </div>
  );
}