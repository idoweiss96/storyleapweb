import React, { useState } from 'react';
import { X } from 'lucide-react';

const SLIDES = [
  {
    emoji: '📖',
    title: 'What is a social story?',
    text: "A short, personalized story that puts your child at the center of a familiar situation, helping them understand and process what they're feeling.",
  },
  {
    emoji: '💛',
    title: 'Why it matters',
    text: 'It gives you and your child a natural way to start talking about it together, often opening conversations that are hard to begin any other way.',
  },
  {
    emoji: '📩',
    title: "It's yours to keep",
    text: "After purchase, we'll email you the digital story together with conversation questions to go through with your child.",
  },
];

export default function QuestionnaireIntroModal({ onClose }) {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,13,18,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fafdff', borderRadius: 28, padding: 36, maxWidth: 420, width: '100%', textAlign: 'center', position: 'relative' }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: 16, right: 16, border: 0, background: 'transparent', color: '#93979f', cursor: 'pointer', display: 'flex' }}
        >
          <X size={20} />
        </button>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{current.emoji}</div>
        <h3 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.02em', fontWeight: 500 }}>{current.title}</h3>
        <p style={{ margin: '12px 0 0', fontSize: 17, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>{current.text}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '24px 0' }}>
          {SLIDES.map((_, i) => (
            <span key={i} style={{ width: i === slide ? 20 : 8, height: 8, borderRadius: 9999, background: i === slide ? '#181d27' : '#dbe9fb', transition: 'width 0.2s' }} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => (isLast ? onClose() : setSlide((s) => s + 1))}
          style={{ border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 16, letterSpacing: '-0.01em', background: '#181d27', color: '#fff', padding: '14px 32px', borderRadius: 9999, width: '100%' }}
        >
          {isLast ? "Let's start" : 'Next'}
        </button>
        {!isLast && (
          <button type="button" onClick={onClose} style={{ border: 0, background: 'transparent', color: '#93979f', fontSize: 14, marginTop: 12, cursor: 'pointer' }}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}