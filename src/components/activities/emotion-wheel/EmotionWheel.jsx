import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EMOTIONS, UI } from './emotionWheelContent';

// Geometry, in viewBox units. Angles are measured in degrees from 12 o'clock,
// growing clockwise, which is also the direction the wheel spins.
const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 118;
const EMOJI_RADIUS = 82;
const SEGMENT = 360 / EMOTIONS.length;

const SPIN_ROUNDS = 5;
const SPIN_MS = 3800;

function pointOnCircle(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
}

function segmentPath(index) {
  const start = index * SEGMENT;
  const from = pointOnCircle(start, RADIUS);
  const to = pointOnCircle(start + SEGMENT, RADIUS);
  const largeArc = SEGMENT > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${from.x.toFixed(2)} ${from.y.toFixed(2)} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${to.x.toFixed(2)} ${to.y.toFixed(2)} Z`;
}

export default function EmotionWheel({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  // How many times each emotion has come up, so its prompts cycle instead of repeating.
  const landings = useRef({});
  const timer = useRef(null);

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  const spin = () => {
    if (spinning) return;

    const index = Math.floor(Math.random() * EMOTIONS.length);

    // Land the chosen segment's midpoint under the pointer at 12 o'clock, then
    // add whole turns on top so the wheel always travels forward.
    const target = (360 - (index * SEGMENT + SEGMENT / 2)) % 360;
    const current = ((rotation % 360) + 360) % 360;
    const delta = (target - current + 360) % 360;

    setResult(null);
    setSpinning(true);
    setRotation(rotation + delta + 360 * SPIN_ROUNDS);

    const emotion = EMOTIONS[index];
    const seen = landings.current[emotion.id] || 0;
    landings.current[emotion.id] = seen + 1;

    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        const text = emotion[lang] || emotion.he;
        setResult({
          emotion,
          label: text.label,
          prompt: text.prompts[seen % text.prompts.length],
        });
        setSpinning(false);
      },
      reduceMotion ? 0 : SPIN_MS
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: '100%', maxWidth: 340 }}>
        {/* Pointer, sitting above the wheel and never rotating with it */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-10">
          <svg width="28" height="24" viewBox="0 0 28 24" aria-hidden="true">
            <path d="M14 24 L2 2 Q14 8 26 2 Z" fill="#1A1A6E" />
          </svg>
        </div>

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full h-auto"
          role="img"
          aria-label={copy.title}
          style={{ filter: 'drop-shadow(0 8px 24px rgba(26,26,110,.14))' }}
        >
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${CENTER}px ${CENTER}px`,
              transition: reduceMotion ? 'none' : `transform ${SPIN_MS}ms cubic-bezier(.16,1,.3,1)`,
            }}
          >
            {EMOTIONS.map((emotion, index) => {
              const emojiAt = pointOnCircle(index * SEGMENT + SEGMENT / 2, EMOJI_RADIUS);
              return (
                <g key={emotion.id}>
                  <path d={segmentPath(index)} fill={emotion.color} stroke="#fff" strokeWidth="2" />
                  <text
                    x={emojiAt.x}
                    y={emojiAt.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: 26 }}
                  >
                    {emotion.emoji}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Hub, drawn outside the rotating group so it stays still */}
          <circle cx={CENTER} cy={CENTER} r="26" fill="#fff" />
          <circle cx={CENTER} cy={CENTER} r="26" fill="none" stroke="#F0E8F5" strokeWidth="2" />
          <text x={CENTER} y={CENTER} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 22 }}>
            ✨
          </text>
        </svg>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="mt-7 px-8 py-3.5 rounded-full text-white text-base font-semibold shadow-lg transition-transform disabled:opacity-60 disabled:cursor-not-allowed active:scale-[.98]"
        style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
      >
        {spinning ? copy.spinning : result ? copy.again : copy.spin}
      </button>

      <div aria-live="polite" className="w-full mt-7 min-h-[132px]">
        {result ? (
          <div
            className="rounded-2xl bg-white border p-6 text-center"
            style={{ borderColor: result.emotion.color, boxShadow: '0 4px 20px rgba(255,111,181,.10)' }}
          >
            <div className="text-5xl mb-2">{result.emotion.emoji}</div>
            <div className="text-sm text-slate-400 mb-1">{copy.landedOn}</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A1A6E' }}>
              {result.label}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">{result.prompt}</p>
          </div>
        ) : (
          <p className="text-center text-slate-400">{copy.instructions}</p>
        )}
      </div>
    </div>
  );
}
