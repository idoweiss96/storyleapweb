import React from 'react';
import { FOOD, LINE, SURFACE } from './artTokens';

/**
 * Icon — the drawn object set for the games.
 *
 * Every tool, topping, prop and product in the five games is drawn here rather
 * than typed as an emoji. Emoji render differently on every device and read as
 * text; these read as artwork, and they all share one outline weight.
 *
 * All icons are drawn on a 32×32 grid. Add a new one by adding a key to ICONS.
 */

const C = LINE.color;

// Applied to every icon so the whole set shares one line treatment.
const OUTLINE = {
  stroke: C,
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
};

const ICONS = {
  /* ---------- clinic ---------- */
  stethoscope: (
    <>
      <path d="M9 5v7a7 7 0 0 0 14 0V5" fill="none" />
      <circle cx="9" cy="4.5" r="2" fill={SURFACE.metal} />
      <circle cx="23" cy="4.5" r="2" fill={SURFACE.metal} />
      <path d="M16 19v4a4 4 0 0 0 8 0v-2" fill="none" />
      <circle cx="24" cy="19" r="4" fill={FOOD.red} />
      <circle cx="24" cy="19" r="1.6" fill="#fff" stroke="none" />
    </>
  ),
  thermometer: (
    <>
      <rect x="13" y="3" width="6" height="19" rx="3" fill="#fff" />
      <circle cx="16" cy="25" r="4.5" fill={FOOD.red} />
      <path d="M16 12v11" stroke={FOOD.red} strokeWidth="3" />
      <path d="M20 8h3M20 12h3M20 16h3" strokeWidth="1.2" />
    </>
  ),
  drops: (
    <>
      <rect x="11" y="9" width="10" height="16" rx="3" fill={SURFACE.glass} />
      <rect x="13" y="4" width="6" height="5" rx="1.5" fill={SURFACE.metalDark} />
      <path d="M16 4V2" strokeWidth="1.2" />
      <path d="M26 12c0 1.6-1.1 2.5-2.2 2.5S21.6 13.6 21.6 12s2.2-3.6 2.2-3.6S26 10.4 26 12Z" fill={SURFACE.glass} />
    </>
  ),
  medicine: (
    <>
      <rect x="4" y="12" width="24" height="9" rx="4.5" fill="#fff" transform="rotate(-20 16 16)" />
      <path d="M12.5 8.5 19.5 23" strokeWidth="1.5" />
      <rect x="4" y="12" width="12" height="9" rx="4.5" fill={FOOD.red} transform="rotate(-20 16 16)" />
    </>
  ),
  ice: (
    <>
      <rect x="6" y="7" width="20" height="18" rx="5" fill="#BFE8F7" />
      <path d="M11 16h10M16 11v10" stroke="#69B6D6" strokeWidth="2" />
      <path d="M10 11.5l2-2" strokeWidth="1.2" stroke="#fff" />
    </>
  ),
  ointment: (
    <>
      <path d="M10 12h12l-1.5 14a2 2 0 0 1-2 1.8h-5A2 2 0 0 1 11.5 26Z" fill={SURFACE.white} />
      <rect x="12" y="4" width="8" height="8" rx="2" fill={SURFACE.metal} />
      <path d="M13 17h6" stroke={FOOD.green} strokeWidth="2.4" />
    </>
  ),
  bandage: (
    <>
      <rect x="3" y="11" width="26" height="10" rx="5" fill="#FFE2C4" transform="rotate(-25 16 16)" />
      <g stroke="none" fill="#D8A87A">
        <circle cx="13" cy="18.5" r="1.2" />
        <circle cx="16" cy="16" r="1.2" />
        <circle cx="19" cy="13.5" r="1.2" />
        <circle cx="16.5" cy="20.5" r="1.2" />
        <circle cx="19.5" cy="18" r="1.2" />
      </g>
    </>
  ),
  syringe: (
    <>
      <rect x="8" y="11" width="14" height="8" rx="1.5" fill="#fff" transform="rotate(-40 16 16)" />
      <path d="M22 8l4-4M5 24l3 3" strokeWidth="1.8" />
      <path d="M9.5 17.5 14 22" strokeWidth="1.2" />
      <rect x="8" y="11" width="7" height="8" rx="1.5" fill={SURFACE.glass} transform="rotate(-40 16 16)" />
    </>
  ),

  /* ---------- garage ---------- */
  sponge: (
    <>
      <rect x="4" y="9" width="24" height="15" rx="4" fill={FOOD.cheese} />
      <path d="M4 16h24" strokeWidth="1.2" />
      <rect x="4" y="9" width="24" height="7" rx="4" fill="#9BD9EE" />
      <g stroke="none" fill="rgba(58,51,87,.2)">
        <circle cx="10" cy="20" r="1.4" />
        <circle cx="16" cy="21" r="1.4" />
        <circle cx="22" cy="19.5" r="1.4" />
      </g>
    </>
  ),
  wrench: (
    <>
      <path
        d="M22.5 4a6.5 6.5 0 0 0-6.2 8.5L4.6 24.2a2.2 2.2 0 0 0 3.2 3.2L19.5 15.7A6.5 6.5 0 0 0 27 6.9l-3.6 3.6-3.3-3.3L23.7 3.6A6.6 6.6 0 0 0 22.5 4Z"
        fill={SURFACE.metal}
      />
    </>
  ),
  fuel: (
    <>
      <path d="M7 27V8a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v19Z" fill={FOOD.red} />
      <rect x="9" y="8" width="7" height="6" rx="1.2" fill="#fff" />
      <path d="M18 12h4a2 2 0 0 1 2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-8l-3-3" fill="none" />
      <path d="M5 27h15" strokeWidth="2" />
    </>
  ),
  bulb: (
    <>
      <path d="M16 3a8 8 0 0 0-5 14.3V21h10v-3.7A8 8 0 0 0 16 3Z" fill={FOOD.cheese} />
      <rect x="11.5" y="21" width="9" height="6" rx="2" fill={SURFACE.metal} />
      <path d="M12.5 24h7" strokeWidth="1.2" />
    </>
  ),

  /* ---------- pizzeria ---------- */
  sauce: (
    <>
      <circle cx="16" cy="17" r="10" fill={FOOD.sauce} />
      <path d="M9 13c2-3 5-4 8-3.5" stroke="#fff" strokeWidth="1.6" opacity=".55" fill="none" />
      <path d="M16 7V4M12 8 10 5.5M20 8l2-2.5" strokeWidth="1.4" />
    </>
  ),
  cheese: (
    <>
      <path d="M4 21 26 8v10a3 3 0 0 1-3 3Z" fill={FOOD.cheese} />
      <g stroke="none" fill="#E0A93B">
        <circle cx="12" cy="18" r="1.8" />
        <circle cx="18" cy="15.5" r="1.4" />
        <circle cx="21" cy="19" r="1.6" />
      </g>
    </>
  ),
  mushroom: (
    <>
      <path d="M5 16a11 8 0 0 1 22 0Z" fill="#C9714E" />
      <path d="M12 16h8v8a4 4 0 0 1-8 0Z" fill="#F1DCC4" />
      <g stroke="none" fill="rgba(255,255,255,.5)">
        <ellipse cx="11" cy="12" rx="2.4" ry="1.6" />
        <ellipse cx="19" cy="10.5" rx="2" ry="1.4" />
      </g>
    </>
  ),
  olive: (
    <>
      <ellipse cx="16" cy="16" rx="8" ry="10" fill="#4E6B32" />
      <ellipse cx="16" cy="16" rx="3" ry="4.5" fill={FOOD.red} />
      <path d="M11 10c1.5-1.5 3-2.2 4.5-2.4" stroke="#fff" strokeWidth="1.4" opacity=".4" fill="none" />
    </>
  ),
  tomato: (
    <>
      <circle cx="16" cy="18" r="10" fill={FOOD.red} />
      <path d="M16 8c-3-3-6-2.5-6-2.5s.6 3.4 3.4 4.2M16 8c3-3 6-2.5 6-2.5s-.6 3.4-3.4 4.2" fill={FOOD.green} />
      <path d="M11 15c1-2 2.6-3 4-3.2" stroke="#fff" strokeWidth="1.6" opacity=".4" fill="none" />
    </>
  ),
  pepper: (
    <>
      <path d="M8 15a8 8 0 0 1 16 0c0 7-3 12-8 12S8 22 8 15Z" fill={FOOD.green} />
      <path d="M16 7V4" strokeWidth="2" />
      <path d="M12 6h8" strokeWidth="1.6" />
      <path d="M12 14c0 5 .6 8 1.6 10" stroke="#3E9E68" strokeWidth="1.4" fill="none" />
    </>
  ),
  corn: (
    <>
      <ellipse cx="16" cy="16" rx="6.5" ry="12" fill={FOOD.cheese} />
      <path d="M9.5 22C5 21 3 16 4 11c4 0 7 3 7 7" fill={FOOD.green} />
      <g stroke="#E0A93B" strokeWidth="1.1">
        <path d="M13 8v16M16 6.5v19M19 8v16" />
      </g>
    </>
  ),
  pineapple: (
    <>
      <ellipse cx="16" cy="20" rx="8" ry="9" fill={FOOD.cheese} />
      <path d="M16 11c-1-4-4-6-4-6s0 4 1.5 6M16 11c1-4 4-6 4-6s0 4-1.5 6" fill={FOOD.green} />
      <g stroke="#C08E3B" strokeWidth="1.1">
        <path d="M10 16l12 8M22 16l-12 8" />
      </g>
    </>
  ),
  broccoli: (
    <>
      <path d="M8 14a5 5 0 0 1 3-4.6 5 5 0 0 1 10 0A5 5 0 0 1 24 14a5 5 0 0 1-4 4.9H12A5 5 0 0 1 8 14Z" fill={FOOD.green} />
      <path d="M13 19v5a3 3 0 0 0 6 0v-5" fill="#B9DFA4" />
    </>
  ),
  egg: (
    <>
      <path d="M16 5c6 0 10 8 10 13a10 9 0 0 1-20 0C6 13 10 5 16 5Z" fill="#fff" />
      <circle cx="16" cy="18" r="5" fill={FOOD.cheese} />
    </>
  ),
  basil: (
    <>
      <path d="M16 27c0-8 3-13 10-15 0 8-4 13-10 15Z" fill={FOOD.green} />
      <path d="M16 27c0-6-2-10-8-11.5C8 21 11 25 16 27Z" fill={FOOD.greenDark} />
      <path d="M16 27V15" strokeWidth="1.4" />
    </>
  ),

  /* ---------- store ---------- */
  banana: (
    <>
      <path d="M6 9c1 10 7 16 17 16 2 0 3-1.4 2.6-2.6C21 21 13 16 11 7Z" fill={FOOD.cheese} />
      <path d="M11 7 9 5" strokeWidth="2" />
    </>
  ),
  carrot: (
    <>
      <path d="M13 12h6l-2 15a1 1 0 0 1-2 0Z" fill={FOOD.orange} />
      <path d="M16 12c0-4-3-7-3-7s4-1 6 2M16 12c1-4 5-6 5-6s.5 4-2 6" fill={FOOD.green} />
      <path d="M14 17h3M14.5 21h2.4" strokeWidth="1.1" stroke="#D97B34" />
    </>
  ),
  apple: (
    <>
      <path d="M16 9c5-3 11 1 10 8-.7 5-4 11-6.5 11-1.5 0-2.3-.8-3.5-.8s-2 .8-3.5.8C10 28 6.3 22 6 17c-.8-7 5-11 10-8Z" fill={FOOD.red} />
      <path d="M16 9V5" strokeWidth="1.8" />
      <path d="M16 7c3-3 6-3 6-3s0 4-4 4.4" fill={FOOD.green} />
    </>
  ),
  pencil: (
    <>
      <path d="M6 26l1.5-5L21 7.5l3.5 3.5L11 24.5Z" fill={FOOD.cheese} />
      <path d="m21 7.5 2-2a2.5 2.5 0 0 1 3.5 3.5l-2 2Z" fill={FOOD.red} />
      <path d="m7.5 21 3.5 3.5" strokeWidth="1.2" />
      <path d="M6 26l1.5-5 3.5 3.5Z" fill="#3A3357" />
    </>
  ),
  juice: (
    <>
      <path d="M9 10h14l-1.4 16a2 2 0 0 1-2 1.8h-7.2a2 2 0 0 1-2-1.8Z" fill={FOOD.orange} />
      <path d="M9 10 11 5h10l2 5Z" fill="#FFC48A" />
      <path d="M19 5V2h3" strokeWidth="1.8" />
      <path d="M11 16h10" strokeWidth="1.2" stroke="#fff" opacity=".6" />
    </>
  ),
  chocolate: (
    <>
      <rect x="6" y="7" width="20" height="18" rx="2.5" fill={FOOD.brown} />
      <path d="M16 7v18M6 13h20M6 19h20" strokeWidth="1.2" />
      <rect x="6" y="7" width="20" height="4" rx="2" fill="#C0392B" />
    </>
  ),
  bread: (
    <>
      <path d="M5 16a6 6 0 0 1 4-5.7A6 6 0 0 1 23 10.3 6 6 0 0 1 27 16v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" fill="#D9A05B" />
      <path d="M9 10.3c1.4 1 2 2.7 2 5.7v9M23 10.3c-1.4 1-2 2.7-2 5.7v9" strokeWidth="1.2" />
    </>
  ),
  cookies: (
    <>
      <circle cx="16" cy="16" r="11" fill="#DFA96A" />
      <g stroke="none" fill="#5A3E2B">
        <circle cx="12" cy="13" r="1.8" />
        <circle cx="20" cy="12.5" r="1.5" />
        <circle cx="17" cy="19" r="1.8" />
        <circle cx="11" cy="20" r="1.4" />
      </g>
    </>
  ),
  milk: (
    <>
      <path d="M10 12h12v14a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2Z" fill="#fff" />
      <path d="M10 12 12 5h8l2 7Z" fill={SURFACE.glass} />
      <path d="M12 18h8" strokeWidth="1.2" stroke="#9CC6DA" />
    </>
  ),
  book: (
    <>
      <path d="M6 5h13a3 3 0 0 1 3 3v19H9a3 3 0 0 1-3-3Z" fill="#C0392B" />
      <path d="M22 8h4v19h-4Z" fill="#E07B67" />
      <path d="M9 27a3 3 0 0 1 0-6h13" fill="none" strokeWidth="1.4" />
    </>
  ),
  teddy: (
    <>
      <circle cx="9" cy="8" r="4" fill="#C08E63" />
      <circle cx="23" cy="8" r="4" fill="#C08E63" />
      <circle cx="16" cy="12" r="8" fill="#C08E63" />
      <ellipse cx="16" cy="14.5" rx="4" ry="3" fill="#EBD2B6" />
      <circle cx="16" cy="12.5" r="1.4" fill="#5A3E2B" stroke="none" />
      <circle cx="12.5" cy="9.5" r="1.2" fill="#3A3357" stroke="none" />
      <circle cx="19.5" cy="9.5" r="1.2" fill="#3A3357" stroke="none" />
      <path d="M10 22a6 6 0 0 1 12 0v3a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3Z" fill="#C08E63" />
    </>
  ),

  /* ---------- action props ---------- */
  cup: (
    <>
      <path d="M9 9h14l-1.5 16a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8Z" fill={SURFACE.glass} />
      <path d="M9 9h14" strokeWidth="1.8" />
      <path d="M19 9 21 3" strokeWidth="2" stroke={FOOD.red} />
    </>
  ),
  zzz: (
    <>
      <path d="M6 20h7l-7 7h7" fill="none" strokeWidth="2" />
      <path d="M15 11h7l-7 8h7" fill="none" strokeWidth="2" />
      <path d="M23 4h6l-6 7h6" fill="none" strokeWidth="2" />
    </>
  ),
  wind: (
    <>
      <path d="M3 11h15a4 4 0 1 0-4-4" fill="none" strokeWidth="2" />
      <path d="M3 18h20a4 4 0 1 1-4 4" fill="none" strokeWidth="2" />
      <path d="M3 25h11" fill="none" strokeWidth="2" />
    </>
  ),
  note: (
    <>
      <path d="M13 24V6l13-3v18" fill="none" strokeWidth="2" />
      <ellipse cx="9" cy="24" rx="5" ry="4" fill={FOOD.purple} />
      <ellipse cx="22" cy="21" rx="5" ry="4" fill={FOOD.purple} />
    </>
  ),
  soap: (
    <>
      <rect x="6" y="14" width="20" height="12" rx="4" fill="#9BD9EE" />
      <g fill="#fff" opacity=".85">
        <circle cx="11" cy="8" r="3.5" />
        <circle cx="19" cy="6" r="2.5" />
        <circle cx="24" cy="10" r="2" />
      </g>
    </>
  ),
  toothbrush: (
    <>
      <rect x="4" y="6" width="9" height="6" rx="2" fill="#4FC3E8" transform="rotate(35 8.5 9)" />
      <path d="M11 13 26 27" strokeWidth="3.5" stroke="#4FC3E8" strokeLinecap="round" />
      <path d="M4 4l3 3M8 2l3 3" strokeWidth="1.8" stroke="#fff" />
    </>
  ),
  mic: (
    <>
      <rect x="12" y="3" width="8" height="15" rx="4" fill={SURFACE.metalDark} />
      <path d="M8 15a8 8 0 0 0 16 0" fill="none" strokeWidth="2" />
      <path d="M16 23v6M12 29h8" strokeWidth="2" />
    </>
  ),
  tear: (
    <>
      <path d="M16 4c0 0 9 11 9 16a9 9 0 0 1-18 0c0-5 9-16 9-16Z" fill="#7FC5E8" />
      <ellipse cx="12.5" cy="19" rx="2" ry="3" fill="#fff" opacity=".55" stroke="none" />
    </>
  ),
  hand: (
    <>
      <path d="M11 27a7 7 0 0 1-3-5.7V13a2 2 0 0 1 4 0V8a2 2 0 0 1 4 0v4V6a2 2 0 0 1 4 0v6V9a2 2 0 0 1 4 0v11a7 7 0 0 1-7 7Z" fill="#F1D8B3" />
      <path d="M6 8l-2-2M9 5 8 2M13 4V1" strokeWidth="1.5" />
    </>
  ),

  /* ---------- hub cards ---------- */
  pizza: (
    <>
      <path d="M16 3 29 27a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" fill={FOOD.dough} />
      <path d="M16 8 25.5 26H6.5Z" fill={FOOD.sauce} />
      <g stroke="none">
        <circle cx="16" cy="15" r="2.2" fill={FOOD.cheese} />
        <circle cx="11.5" cy="22" r="2" fill={FOOD.green} />
        <circle cx="20.5" cy="22" r="2" fill={FOOD.cheese} />
      </g>
    </>
  ),
  basket: (
    <>
      <path d="M4 12h24l-2.5 13a3 3 0 0 1-3 2.4H9.5a3 3 0 0 1-3-2.4Z" fill={FOOD.orange} />
      <path d="M10 12 14 4M22 12 18 4" strokeWidth="2" fill="none" />
      <path d="M11 17v6M16 17v6M21 17v6" strokeWidth="1.4" />
    </>
  ),
};

export default function Icon({ name, size = 32, label }) {
  const art = ICONS[name];
  if (!art) return null;
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      <g {...OUTLINE}>{art}</g>
    </svg>
  );
}

export const ICON_NAMES = Object.keys(ICONS);
