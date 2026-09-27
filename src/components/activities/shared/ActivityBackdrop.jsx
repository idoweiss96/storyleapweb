import React from 'react';

/**
 * ActivityBackdrop — the drawn place behind an activity's banner and hub
 * card. Decorative only (aria-hidden), drawn in the same ink and palette as
 * the games so the whole site reads as one illustrated world.
 * The SVG is sliced, not stretched, so it crops cleanly on narrow screens.
 */

const C = '#3A3357';

function Cloud({ x, y, s = 1 }) {
  return (
    <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 22a13 13 0 0 1 18-12 17 17 0 0 1 32 1 11 11 0 0 1 16 11Z"
      fill="#fff" stroke={C} strokeWidth="2.2" strokeLinejoin="round" />
  );
}

function Flower({ x, y, color }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0v12" stroke="#4E9E62" strokeWidth="2" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-5" rx="3.2" ry="4.6" fill={color} stroke={C} strokeWidth="1" transform={`rotate(${a})`} />
      ))}
      <circle r="2.6" fill="#F5C842" stroke={C} strokeWidth="1" />
    </g>
  );
}

function Sun({ x, y, r = 22 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d={`M0 ${-r - 6}v-9`} stroke="#F5B942" strokeWidth="3.2" strokeLinecap="round" transform={`rotate(${i * 36})`} />
      ))}
      <circle r={r} fill="#FFE07A" stroke={C} strokeWidth="2.5" />
    </g>
  );
}

const SCENES = {
  meadow: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFEFFC" />
          <stop offset="100%" stopColor="#F4FAFF" />
        </linearGradient>
      </defs>
      <rect width="600" height="220" fill={`url(#${id}-sky)`} />
      <Sun x={520} y={50} />
      <Cloud x={60} y={30} s={1.1} />
      <Cloud x={300} y={18} s={0.8} />
      <path d="M0 150q110-40 230-14t220-6 150 4v86H0Z" fill="#BFE6C4" stroke={C} strokeWidth="2.5" />
      <path d="M0 185q140-26 300-8t300-6v49H0Z" fill="#9FD8A8" stroke={C} strokeWidth="2.5" />
      <Flower x={60} y={196} color="#FF9CC8" />
      <Flower x={96} y={206} color="#FFFFFF" />
      <Flower x={500} y={200} color="#C9B2FA" />
      <Flower x={540} y={208} color="#FF9CC8" />
    </>
  ),
  night: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B3584" />
          <stop offset="100%" stopColor="#8A76C9" />
        </linearGradient>
      </defs>
      <rect width="600" height="220" fill={`url(#${id}-sky)`} />
      <path d="M512 26a26 26 0 1 0 22 42 22 22 0 1 1-22-42Z" fill="#FFE9A3" stroke={C} strokeWidth="2.2" />
      <g fill="#FFF3C4">
        {[[50, 40], [120, 24], [200, 58], [280, 30], [360, 70], [160, 96], [40, 110], [420, 30], [590, 110], [460, 100]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 5}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6Z`} />
        ))}
      </g>
      <path d="M0 168q120-34 260-10t340-10v72H0Z" fill="#4C4396" stroke={C} strokeWidth="2.5" />
      <path d="M0 196q160-18 320-4t280-6v34H0Z" fill="#5A50A8" stroke={C} strokeWidth="2.5" />
    </>
  ),
  room: () => (
    <>
      <rect width="600" height="170" fill="#FDF1E4" />
      <g fill="#F8E2CB">{Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 52} y="0" width="26" height="170" />)}</g>
      <rect y="170" width="600" height="50" fill="#E2C8A8" />
      <path d="M0 170h600" stroke={C} strokeWidth="2.5" />
      <rect x="40" y="34" width="96" height="72" rx="8" fill="#DDF3FC" stroke={C} strokeWidth="2.5" />
      <path d="M88 34v72M40 70h96" stroke={C} strokeWidth="2" />
      <rect x="430" y="96" width="130" height="8" rx="3" fill="#D4A373" stroke={C} strokeWidth="2" />
      <g stroke={C} strokeWidth="2">
        <rect x="442" y="72" width="22" height="24" rx="3" fill="#FF9CC8" />
        <rect x="470" y="78" width="20" height="18" rx="3" fill="#8FD4F0" />
        <path d="M498 96l13-24 13 24Z" fill="#F5C842" strokeLinejoin="round" />
        <circle cx="542" cy="84" r="11" fill="#A9E5B8" />
      </g>
      <ellipse cx="300" cy="200" rx="200" ry="16" fill="#C9E6F5" stroke={C} strokeWidth="2.2" />
    </>
  ),
  morning: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE7C2" />
          <stop offset="100%" stopColor="#FFF6E8" />
        </linearGradient>
      </defs>
      <rect width="600" height="220" fill={`url(#${id}-sky)`} />
      <Sun x={90} y={70} r={26} />
      <Cloud x={380} y={30} s={0.9} />
      {/* A little house on the hill */}
      <path d="M0 160q150-36 300-10t300-8v78H0Z" fill="#C8E7B4" stroke={C} strokeWidth="2.5" />
      <g transform="translate(430 104)" stroke={C} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M0 26 34 0l34 26v36H0Z" fill="#FFD6E8" />
        <path d="M-6 28 34-4l40 32" fill="none" />
        <path d="M-6 28 34-4l40 32Z" fill="#EF6B6B" />
        <rect x="26" y="36" width="16" height="26" rx="2" fill="#4FC3E8" />
        <rect x="8" y="32" width="12" height="12" rx="2" fill="#FFE07A" />
      </g>
      <path d="M0 196q170-20 330-6t270-4v34H0Z" fill="#A9DCA0" stroke={C} strokeWidth="2.5" />
    </>
  ),
  art: () => (
    <>
      <rect width="600" height="220" fill="#FFF4FA" />
      <g opacity=".9">
        {[['#FF9CC8', 60, 40, 30], ['#8FD4F0', 150, 90, 22], ['#FFE07A', 470, 50, 26], ['#A9E5B8', 540, 120, 20], ['#C9B2FA', 330, 30, 18]].map(([c, x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c} stroke={C} strokeWidth="2" />
        ))}
      </g>
      {/* An easel with a canvas */}
      <g stroke={C} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M420 210 460 90M520 210 480 90M470 170v40" fill="none" />
        <rect x="430" y="80" width="80" height="64" rx="4" fill="#fff" />
        <path d="M444 126q14-26 28-6t22-16" fill="none" stroke="#FF6FB5" strokeWidth="4" />
      </g>
      <path d="M0 190q150-16 300-4t300-6v40H0Z" fill="#FFE3C8" stroke={C} strokeWidth="2.5" />
    </>
  ),
};

export default function ActivityBackdrop({ scene = 'meadow', id = 'abd', className, style }) {
  const draw = SCENES[scene] || SCENES.meadow;
  return (
    <svg className={className} style={style} viewBox="0 0 600 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {draw(id)}
    </svg>
  );
}
