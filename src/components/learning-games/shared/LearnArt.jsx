import React from 'react';
import { LINE } from '../../games/shared/art/artTokens';

/**
 * LearnArt — drawn objects the learning games need and the games' Icon set
 * does not have: sky objects, arrows, pattern shapes, a drum, a train.
 *
 * Same rules as games/shared/art/Icon.jsx: one outline colour, one weight,
 * everything on a fixed grid (here 64×64), no emoji and no image files.
 */

const C = LINE.color;
const O = { stroke: C, strokeWidth: 2.6, strokeLinejoin: 'round', strokeLinecap: 'round' };

export const SHAPE_COLORS = {
  circle: '#FF6FB5',
  square: '#4FC3E8',
  triangle: '#F5C842',
  star: '#A78BFA',
  heart: '#EF6B6B',
  diamond: '#5BC98C',
};

const ART = {
  sun: (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M32 5v7" stroke="#F5B942" strokeWidth="3.4" strokeLinecap="round" transform={`rotate(${i * 30} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="16" fill="#FFE07A" {...O} />
      <path d="M25 31q2-3 4 0M35 31q2-3 4 0" fill="none" stroke={C} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M26 37q6 5 12 0" fill="none" stroke={C} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  moon: (
    <>
      <path d="M38 8a24 24 0 1 0 18 38A20 20 0 1 1 38 8Z" fill="#FFE9A3" {...O} />
      <path d="M22 33q2 3 4 0" fill="none" stroke={C} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M52 14l1.4 3 3 1.4-3 1.4-1.4 3-1.4-3-3-1.4 3-1.4Z" fill="#FFE9A3" stroke={C} strokeWidth="1.4" />
    </>
  ),
  fire: (
    <>
      <path d="M32 6c4 10 16 16 16 32a16 16 0 0 1-32 0c0-8 4-12 7-15 0 6 3 9 6 9-2-10 1-19 3-26Z" fill="#FF8A4C" {...O} />
      <path d="M32 30c3 5 8 8 8 15a8 8 0 0 1-16 0c0-5 5-8 8-15Z" fill="#FFD166" stroke={C} strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  snow: (
    <>
      <circle cx="32" cy="32" r="26" fill="#DDF3FC" {...O} />
      <g stroke="#3F8FC2" strokeWidth="3.4" strokeLinecap="round" fill="none">
        {[0, 60, 120].map((a) => (
          <g key={a} transform={`rotate(${a} 32 32)`}>
            <path d="M32 12v40" />
            <path d="M26 16l6 5 6-5M26 48l6-5 6 5" />
          </g>
        ))}
      </g>
    </>
  ),
  up: (
    <path d="M32 8 54 32H41v24H23V32H10Z" fill="#5BC98C" {...O} />
  ),
  down: (
    <path d="M32 56 10 32h13V8h18v24h13Z" fill="#FF9F5A" {...O} />
  ),

  /* ---------- pattern shapes ---------- */
  circle: <circle cx="32" cy="32" r="20" fill={SHAPE_COLORS.circle} {...O} />,
  square: <rect x="13" y="13" width="38" height="38" rx="7" fill={SHAPE_COLORS.square} {...O} />,
  triangle: <path d="M32 10 54 52H10Z" fill={SHAPE_COLORS.triangle} {...O} />,
  star: (
    <path d="M32 8l6.9 14.3 15.7 2.1-11.4 11 2.8 15.6L32 43.6 18 51l2.8-15.6-11.4-11 15.7-2.1Z" fill={SHAPE_COLORS.star} {...O} />
  ),
  heart: (
    <path d="M32 53S10 40 10 24a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 16-22 29-22 29Z" fill={SHAPE_COLORS.heart} {...O} />
  ),
  diamond: <path d="M32 8 54 32 32 56 10 32Z" fill={SHAPE_COLORS.diamond} {...O} />,

  /* ---------- props ---------- */
  drum: (
    <>
      <path d="M8 24v22c0 7 11 12 24 12s24-5 24-12V24" fill="#FF6FB5" {...O} />
      <path d="M8 30l10 22M24 34l-6 22M24 34l16 22M40 34l-6 22M40 34l16 12" stroke="#fff" strokeWidth="2.2" fill="none" opacity=".75" />
      <ellipse cx="32" cy="24" rx="24" ry="10" fill="#FFF4E6" {...O} />
      <ellipse cx="32" cy="24" rx="15" ry="5.5" fill="none" stroke="#E8D3BA" strokeWidth="2" />
    </>
  ),
  balloon: (
    <>
      <path d="M32 44q-3 8 2 18" fill="none" stroke={C} strokeWidth="2" />
      <path d="M32 4c12 0 20 9 20 20 0 12-10 20-20 20S12 36 12 24C12 13 20 4 32 4Z" fill="#FF6FB5" {...O} />
      <path d="M29 44h6l-3 4Z" fill="#FF6FB5" {...O} strokeWidth="1.8" />
      <ellipse cx="24" cy="16" rx="4" ry="6" fill="#fff" opacity=".6" />
    </>
  ),
  flag: (
    <>
      <path d="M16 60V6" stroke={C} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M17 7h32l-8 10 8 10H17Z" fill="#4FC3E8" {...O} />
    </>
  ),
  house: (
    <>
      <path d="M8 30 32 8l24 22" fill="#FF8EB8" {...O} />
      <path d="M13 28v28h38V28L32 11Z" fill="#FFE3EE" {...O} />
      <path d="M8 30 32 8l24 22" fill="none" {...O} />
      <rect x="27" y="38" width="11" height="18" rx="2" fill="#4FC3E8" {...O} strokeWidth="2.2" />
      <rect x="17" y="33" width="7" height="7" rx="1.5" fill="#FFE07A" stroke={C} strokeWidth="2" />
    </>
  ),
  note: (
    <>
      <path d="M26 46V14l24-6v30" fill="none" stroke={C} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="20" cy="47" rx="8" ry="6" fill="#A78BFA" {...O} />
      <ellipse cx="44" cy="39" rx="8" ry="6" fill="#A78BFA" {...O} />
    </>
  ),
};

export default function LearnArt({ name, size = 48, label, style }) {
  const art = ART[name];
  if (!art) return null;
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      style={style}
    >
      {art}
    </svg>
  );
}

/** The locomotive for the pattern train. `facing` is 'left' or 'right'. */
export function Engine({ size = 96, facing = 'right' }) {
  return (
    <svg viewBox="0 0 120 96" width={size} height={size * 0.8} aria-hidden="true"
      style={{ transform: facing === 'left' ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      <g className="lg-smoke">
        <circle cx="86" cy="10" r="7" fill="#fff" stroke={C} strokeWidth="2" />
        <circle cx="98" cy="4" r="5" fill="#fff" stroke={C} strokeWidth="2" />
      </g>
      <rect x="80" y="18" width="14" height="18" rx="3" fill="#3A3357" />
      <rect x="10" y="12" width="44" height="52" rx="8" fill="#FF6FB5" stroke={C} strokeWidth="2.6" />
      <rect x="18" y="20" width="28" height="20" rx="5" fill="#DDF3FC" stroke={C} strokeWidth="2.2" />
      <path d="M54 34h44a10 10 0 0 1 10 10v20H54Z" fill="#4FC3E8" stroke={C} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M108 60l8 10H100Z" fill="#F5C842" stroke={C} strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="4" y="62" width="106" height="8" rx="3" fill="#3A3357" />
      {[26, 62, 92].map((x) => (
        <g key={x}>
          <circle cx={x} cy="78" r="12" fill="#5B5578" stroke={C} strokeWidth="2.6" />
          <circle cx={x} cy="78" r="4" fill="#C7CDD6" />
        </g>
      ))}
    </svg>
  );
}
