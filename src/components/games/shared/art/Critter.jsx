import React from 'react';
import { CHEEK, LINE, PELT } from './artTokens';

/**
 * Critter — one drawn animal rig, re-skinned per species.
 *
 * Every animal in every game comes from this component: the clinic patients,
 * the garage drivers, the pizzeria customers. Ten species out of one rig is
 * what keeps the art consistent without drawing ten characters by hand.
 *
 * Props:
 *   species    key of PELT ('bear', 'bunny', …)
 *   expression 'happy' | 'neutral' | 'hurt' | 'sad' | 'asleep' | 'surprised'
 *   accessory  'bandage' | 'plaster' | 'ice' | null — worn on the head
 *   size       rendered pixel width (the drawing is square)
 *   label      accessible name; omit to mark the drawing decorative
 */

const EAR = {
  bear: 'round',
  bunny: 'long',
  cat: 'point',
  dog: 'flop',
  koala: 'fluffy',
  frog: 'none',
  fox: 'point',
  panda: 'round',
  penguin: 'none',
  turtle: 'none',
};

function Ears({ kind, fur, inner, dark }) {
  const stroke = { stroke: LINE.color, strokeWidth: LINE.width };
  if (kind === 'round') {
    return (
      <g {...stroke}>
        <circle cx="34" cy="34" r="14" fill={dark || fur} />
        <circle cx="86" cy="34" r="14" fill={dark || fur} />
        <circle cx="34" cy="34" r="6.5" fill={dark ? 'rgba(255,255,255,.25)' : inner} strokeWidth={LINE.thin} />
        <circle cx="86" cy="34" r="6.5" fill={dark ? 'rgba(255,255,255,.25)' : inner} strokeWidth={LINE.thin} />
      </g>
    );
  }
  if (kind === 'long') {
    return (
      <g {...stroke}>
        <ellipse cx="44" cy="22" rx="9" ry="24" fill={fur} transform="rotate(-11 44 22)" />
        <ellipse cx="76" cy="22" rx="9" ry="24" fill={fur} transform="rotate(11 76 22)" />
        <ellipse cx="44" cy="24" rx="4" ry="15" fill={inner} strokeWidth={LINE.thin} transform="rotate(-11 44 24)" />
        <ellipse cx="76" cy="24" rx="4" ry="15" fill={inner} strokeWidth={LINE.thin} transform="rotate(11 76 24)" />
      </g>
    );
  }
  if (kind === 'point') {
    return (
      <g {...stroke}>
        <path d="M30 44 L34 16 L56 32 Z" fill={fur} strokeLinejoin="round" />
        <path d="M90 44 L86 16 L64 32 Z" fill={fur} strokeLinejoin="round" />
        <path d="M36 39 L38 25 L49 33 Z" fill={inner} strokeWidth={LINE.thin} strokeLinejoin="round" />
        <path d="M84 39 L82 25 L71 33 Z" fill={inner} strokeWidth={LINE.thin} strokeLinejoin="round" />
      </g>
    );
  }
  if (kind === 'flop') {
    return (
      <g {...stroke}>
        <ellipse cx="26" cy="62" rx="11" ry="22" fill={fur} transform="rotate(12 26 62)" />
        <ellipse cx="94" cy="62" rx="11" ry="22" fill={fur} transform="rotate(-12 94 62)" />
      </g>
    );
  }
  if (kind === 'fluffy') {
    return (
      <g {...stroke}>
        <circle cx="28" cy="42" r="18" fill={fur} />
        <circle cx="92" cy="42" r="18" fill={fur} />
        <circle cx="28" cy="42" r="9" fill={inner} strokeWidth={LINE.thin} />
        <circle cx="92" cy="42" r="9" fill={inner} strokeWidth={LINE.thin} />
      </g>
    );
  }
  return null;
}

function Eyes({ expression, species }) {
  const dark = '#2A2340';
  // Frogs get their eyes up on domes; everyone else keeps them on the face.
  const y = species === 'frog' ? 38 : 58;
  const lx = species === 'frog' ? 42 : 47;
  const rx = species === 'frog' ? 78 : 73;

  if (expression === 'asleep') {
    return (
      <g stroke={dark} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d={`M${lx - 7} ${y} q7 6 14 0`} />
        <path d={`M${rx - 7} ${y} q7 6 14 0`} />
      </g>
    );
  }
  if (expression === 'happy') {
    return (
      <g stroke={dark} strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d={`M${lx - 7} ${y + 2} q7 -8 14 0`} />
        <path d={`M${rx - 7} ${y + 2} q7 -8 14 0`} />
      </g>
    );
  }
  const r = expression === 'surprised' ? 9 : 7.5;
  const pupil = expression === 'surprised' ? 4 : 4.2;
  return (
    <g>
      <circle cx={lx} cy={y} r={r} fill="#fff" stroke={LINE.color} strokeWidth={LINE.thin} />
      <circle cx={rx} cy={y} r={r} fill="#fff" stroke={LINE.color} strokeWidth={LINE.thin} />
      <circle cx={lx + 1} cy={y + 1} r={pupil} fill={dark} />
      <circle cx={rx + 1} cy={y + 1} r={pupil} fill={dark} />
      <circle cx={lx + 2.6} cy={y - 1.6} r="1.5" fill="#fff" />
      <circle cx={rx + 2.6} cy={y - 1.6} r="1.5" fill="#fff" />
      {expression === 'sad' && (
        <g stroke={LINE.color} strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d={`M${lx - 9} ${y - 11} q8 -4 15 -1`} />
          <path d={`M${rx + 9} ${y - 11} q-8 -4 -15 -1`} />
        </g>
      )}
    </g>
  );
}

function Mouth({ expression }) {
  const stroke = { stroke: LINE.color, strokeWidth: 2.6, strokeLinecap: 'round', fill: 'none' };
  if (expression === 'sad' || expression === 'hurt') return <path d="M51 82 q9 -7 18 0" {...stroke} />;
  if (expression === 'surprised') return <ellipse cx="60" cy="80" rx="6" ry="7.5" fill="#B4467A" stroke={LINE.color} strokeWidth={LINE.thin} />;
  if (expression === 'asleep') return <ellipse cx="60" cy="80" rx="5" ry="4" fill="#B4467A" stroke={LINE.color} strokeWidth={LINE.thin} />;
  if (expression === 'neutral') return <path d="M53 80 h14" {...stroke} />;
  return <path d="M50 77 q10 10 20 0" {...stroke} />;
}

function Accessory({ kind }) {
  if (kind === 'bandage' || kind === 'plaster') {
    return (
      <g transform="rotate(-18 84 40)">
        <rect x="72" y="33" width="26" height="12" rx="6" fill="#FFE2C4" stroke={LINE.color} strokeWidth={LINE.thin} />
        <circle cx="80" cy="39" r="1.4" fill="#D8A87A" />
        <circle cx="85" cy="36" r="1.4" fill="#D8A87A" />
        <circle cx="85" cy="42" r="1.4" fill="#D8A87A" />
        <circle cx="90" cy="39" r="1.4" fill="#D8A87A" />
      </g>
    );
  }
  if (kind === 'ice') {
    return (
      <g>
        <rect x="70" y="30" width="24" height="18" rx="6" fill="#BFE8F7" stroke={LINE.color} strokeWidth={LINE.thin} />
        <path d="M76 39 h12 M82 34 v10" stroke="#69B6D6" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }
  return null;
}

export default function Critter({ species = 'bear', expression = 'happy', accessory = null, size = 120, label }) {
  const pelt = PELT[species] || PELT.bear;
  const earKind = EAR[species] || 'round';
  const stroke = { stroke: LINE.color, strokeWidth: LINE.width };

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      {earKind === 'flop' ? null : <Ears kind={earKind} fur={pelt.fur} inner={pelt.inner} dark={species === 'panda' ? '#2F3542' : null} />}

      {/* Head */}
      <circle cx="60" cy="62" r="37" fill={pelt.fur} {...stroke} />

      {earKind === 'flop' && <Ears kind="flop" fur={pelt.fur} inner={pelt.inner} />}

      {/* Frog eye domes sit on top of the head */}
      {species === 'frog' && (
        <g {...stroke}>
          <circle cx="42" cy="38" r="14" fill={pelt.fur} />
          <circle cx="78" cy="38" r="14" fill={pelt.fur} />
        </g>
      )}

      {/* Panda eye patches read as the animal before anything else does */}
      {species === 'panda' && (
        <g fill="#2F3542">
          <ellipse cx="47" cy="58" rx="12" ry="14" transform="rotate(-14 47 58)" />
          <ellipse cx="73" cy="58" rx="12" ry="14" transform="rotate(14 73 58)" />
        </g>
      )}

      {/* Penguin face patch */}
      {species === 'penguin' && <ellipse cx="60" cy="68" rx="26" ry="27" fill={pelt.inner} {...stroke} strokeWidth={LINE.thin} />}

      {/* Muzzle */}
      {species !== 'penguin' && species !== 'frog' && (
        <ellipse cx="60" cy="78" rx="19" ry="14" fill={pelt.inner} stroke={LINE.color} strokeWidth={LINE.thin} />
      )}

      <Eyes expression={expression} species={species} />

      {/* Nose or beak */}
      {species === 'penguin' ? (
        <path d="M52 72 L68 72 L60 84 Z" fill={pelt.nose} {...stroke} strokeWidth={LINE.thin} strokeLinejoin="round" />
      ) : (
        <ellipse cx="60" cy="71" rx="6.5" ry="5" fill={pelt.nose} />
      )}

      {species !== 'penguin' && <Mouth expression={expression} />}

      {/* Cheeks */}
      <ellipse cx="33" cy="74" rx="7.5" ry="5.5" fill={CHEEK} />
      <ellipse cx="87" cy="74" rx="7.5" ry="5.5" fill={CHEEK} />

      {/* Cat and fox get whiskers */}
      {(species === 'cat' || species === 'fox') && (
        <g stroke={LINE.color} strokeWidth="1.6" strokeLinecap="round">
          <path d="M28 70 h12 M28 77 h12 M92 70 h-12 M92 77 h-12" />
        </g>
      )}

      {accessory && <Accessory kind={accessory} />}
    </svg>
  );
}
