import React from 'react';

export default function ProgressDots({ screen }) {
  if (screen === 1 || screen === 8) return null;
  const total = 6; // screens 2-7
  const current = screen - 1;
  return (
    <div className="flex justify-center gap-2 pb-5 print:hidden">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i + 1 <= current;
        return (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-200"
            style={{ width: filled ? 20 : 8, background: filled ? '#1A1A6E' : 'rgba(45,47,51,0.18)' }}
          />
        );
      })}
    </div>
  );
}