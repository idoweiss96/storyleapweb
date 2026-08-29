import React from 'react';
import { FOOD, LINE, SURFACE } from './artTokens';

/**
 * Scene — the drawn room each game is played inside.
 *
 * A white card with a character on it reads as a form. The same character in a
 * drawn room reads as a game, and that is most of the difference between this
 * and a web page. Each backdrop is decorative only: it carries no information,
 * so it is hidden from assistive tech and safe to restyle freely.
 *
 * The SVG is sized with `slice`, so the room crops rather than distorts on
 * narrow screens.
 */

const C = LINE.color;

function Brick({ x, y }) {
  return <rect x={x} y={y} width="26" height="12" rx="2" fill="#C9714E" stroke={C} strokeWidth="1" />;
}

const BACKDROPS = {
  clinic: (
    <>
      <rect x="0" y="0" width="400" height="196" fill={SURFACE.wallWarm} />
      <rect x="0" y="196" width="400" height="64" fill={SURFACE.floor} />
      <path d="M0 196h400" stroke={C} strokeWidth="2.5" />
      <rect x="0" y="150" width="400" height="46" fill="#fff" opacity=".55" />

      {/* Window */}
      <rect x="34" y="34" width="94" height="74" rx="8" fill={SURFACE.glass} stroke={C} strokeWidth="2.5" />
      <path d="M81 34v74M34 71h94" stroke={C} strokeWidth="2" />
      <circle cx="108" cy="52" r="9" fill="#FFE9A3" />
      <rect x="28" y="106" width="106" height="7" rx="3" fill="#fff" stroke={C} strokeWidth="2" />

      {/* Poster */}
      <rect x="176" y="38" width="58" height="72" rx="6" fill="#fff" stroke={C} strokeWidth="2.5" />
      <path d="M205 54v40M188 74h34" stroke={FOOD.red} strokeWidth="8" strokeLinecap="round" />

      {/* Shelf with jars */}
      <rect x="272" y="96" width="104" height="8" rx="3" fill={SURFACE.shelf} stroke={C} strokeWidth="2" />
      <rect x="282" y="70" width="20" height="26" rx="4" fill={SURFACE.glass} stroke={C} strokeWidth="2" />
      <rect x="310" y="62" width="22" height="34" rx="4" fill="#FFD9E8" stroke={C} strokeWidth="2" />
      <rect x="340" y="76" width="24" height="20" rx="4" fill="#C9E9D2" stroke={C} strokeWidth="2" />

      {/* Clock */}
      <circle cx="322" cy="30" r="16" fill="#fff" stroke={C} strokeWidth="2.5" />
      <path d="M322 20v10l7 4" stroke={C} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),

  garage: (
    <>
      <rect x="0" y="0" width="400" height="196" fill={SURFACE.wallCool} />
      <rect x="0" y="196" width="400" height="64" fill="#CBD3DA" />
      <path d="M0 196h400" stroke={C} strokeWidth="2.5" />
      <path d="M0 224h400" stroke="#A9B4BE" strokeWidth="3" />

      {/* Pegboard */}
      <rect x="30" y="28" width="122" height="86" rx="6" fill="#E3D2BC" stroke={C} strokeWidth="2.5" />
      <g fill="#B9A88F">
        {[46, 66, 86, 106, 126].map((x) =>
          [44, 62, 80, 98].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />)
        )}
      </g>
      <path d="M56 40v30l-8 8" stroke={C} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M96 40v34" stroke={C} strokeWidth="5" strokeLinecap="round" />
      <rect x="112" y="38" width="24" height="10" rx="3" fill={SURFACE.metal} stroke={C} strokeWidth="2" />

      {/* Tyre stack */}
      <g stroke={C} strokeWidth="2.5">
        <ellipse cx="342" cy="176" rx="42" ry="15" fill="#3A4250" />
        <ellipse cx="342" cy="160" rx="42" ry="15" fill="#4A5462" />
        <ellipse cx="342" cy="144" rx="42" ry="15" fill="#3A4250" />
        <ellipse cx="342" cy="144" rx="16" ry="6" fill={SURFACE.metal} />
      </g>

      {/* Oil drum */}
      <rect x="196" y="118" width="46" height="78" rx="8" fill={FOOD.red} stroke={C} strokeWidth="2.5" />
      <path d="M196 142h46M196 168h46" stroke={C} strokeWidth="2" />
    </>
  ),

  pizzeria: (
    <>
      <rect x="0" y="0" width="400" height="196" fill={SURFACE.wallSand} />
      <rect x="0" y="196" width="400" height="64" fill="#B9744A" />
      <path d="M0 196h400" stroke={C} strokeWidth="2.5" />

      {/* Brick oven */}
      <path d="M232 178V96a56 56 0 0 1 112 0v82Z" fill="#D98A5F" stroke={C} strokeWidth="2.5" />
      <path d="M262 178v-52a26 26 0 0 1 52 0v52Z" fill="#4A3325" stroke={C} strokeWidth="2.5" />
      <path d="M275 178c0-14 5-22 13-22s13 8 13 22Z" fill={FOOD.orange} />
      <path d="M281 178c0-9 3-14 7-14s7 5 7 14Z" fill={FOOD.cheese} />
      <g>
        <Brick x="238" y="60" />
        <Brick x="268" y="60" />
        <Brick x="298" y="60" />
        <Brick x="328" y="60" />
        <Brick x="252" y="76" />
        <Brick x="282" y="76" />
        <Brick x="312" y="76" />
      </g>

      {/* Hanging lamps */}
      <g stroke={C} strokeWidth="2.5">
        <path d="M60 0v34M130 0v22" fill="none" />
        <path d="M42 34h36l-8 16H50Z" fill={FOOD.cheese} />
        <path d="M114 22h32l-7 14h-18Z" fill={FOOD.cheese} />
      </g>

      {/* Flour sacks */}
      <g stroke={C} strokeWidth="2.5">
        <path d="M28 196v-40c0-8 6-12 14-12s14 4 14 12v40Z" fill="#F1E3CC" />
        <path d="M66 196v-30c0-7 5-10 11-10s11 3 11 10v30Z" fill="#E6D5BA" />
      </g>
    </>
  ),

  store: (
    <>
      <rect x="0" y="0" width="400" height="196" fill={SURFACE.wallMint} />
      <rect x="0" y="196" width="400" height="64" fill="#EDE4D6" />
      <path d="M0 196h400" stroke={C} strokeWidth="2.5" />
      <g fill="#DCCFBD">
        {[0, 64, 128, 192, 256, 320].map((x) => (
          <rect key={x} x={x + 32} y="196" width="32" height="32" />
        ))}
        {[0, 64, 128, 192, 256, 320].map((x) => (
          <rect key={`b${x}`} x={x} y="228" width="32" height="32" />
        ))}
      </g>

      {/* Awning */}
      <path d="M0 24h400v12H0Z" fill="#fff" stroke={C} strokeWidth="2.5" />
      <g stroke={C} strokeWidth="2">
        {[0, 50, 100, 150, 200, 250, 300, 350].map((x) => (
          <path key={x} d={`M${x} 36h25v14a12 12 0 0 1-25 0Z`} fill={x % 100 === 0 ? FOOD.red : '#fff'} />
        ))}
      </g>

      {/* Shelves */}
      <g stroke={C} strokeWidth="2.5">
        <rect x="26" y="118" width="130" height="8" rx="3" fill={SURFACE.shelf} />
        <rect x="244" y="118" width="130" height="8" rx="3" fill={SURFACE.shelf} />
        <rect x="36" y="92" width="24" height="26" rx="4" fill="#F5C842" />
        <rect x="68" y="86" width="22" height="32" rx="4" fill="#7FC5E8" />
        <rect x="98" y="96" width="26" height="22" rx="4" fill="#F08A8A" />
        <rect x="130" y="90" width="20" height="28" rx="4" fill="#A9DCB6" />
        <rect x="252" y="88" width="26" height="30" rx="4" fill="#C9A7F0" />
        <rect x="286" y="96" width="22" height="22" rx="4" fill="#FFB27A" />
        <rect x="316" y="84" width="24" height="34" rx="4" fill="#8FD4C4" />
        <rect x="348" y="94" width="20" height="24" rx="4" fill="#F5C842" />
      </g>
    </>
  ),

  stage: (
    <>
      <defs>
        <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DFF3FC" />
          <stop offset="100%" stopColor="#F7EAF6" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="260" fill="url(#gs-sky)" />
      <circle cx="330" cy="52" r="30" fill="#FFE9A3" stroke={C} strokeWidth="2.5" />
      <g fill="#fff" stroke={C} strokeWidth="2.5">
        <path d="M56 74a17 17 0 0 1 33-6 14 14 0 0 1 22 6Z" />
        <path d="M196 46a13 13 0 0 1 25-5 11 11 0 0 1 17 5Z" />
      </g>
      <path d="M0 210q100-34 200-6t200-14v70H0Z" fill="#A9DCB6" stroke={C} strokeWidth="2.5" />
      <g stroke="#6FBF86" strokeWidth="2.5" strokeLinecap="round">
        <path d="M46 226v-12M60 230v-14M300 222v-13M316 226v-12" />
      </g>
    </>
  ),
};

const STYLE = `
  .gs-scene{
    position:relative;overflow:hidden;
    border:2.5px solid ${C};border-radius:24px;
    box-shadow:0 10px 28px rgba(26,26,110,.13);
  }
  .gs-scene-bg{position:absolute;inset:0;width:100%;height:100%;display:block}
  .gs-scene-body{
    position:relative;
    display:flex;flex-direction:column;align-items:center;gap:12px;
    padding:22px 18px 24px;
  }
`;

export default function Scene({ variant = 'clinic', children, minHeight = 320 }) {
  return (
    <div className="gs-scene" style={{ minHeight }}>
      <style>{STYLE}</style>
      <svg className="gs-scene-bg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        {BACKDROPS[variant] || BACKDROPS.clinic}
      </svg>
      <div className="gs-scene-body">{children}</div>
    </div>
  );
}
