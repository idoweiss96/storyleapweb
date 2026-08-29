/**
 * artTokens.js — the palette the game illustrations are drawn from.
 *
 * The games are drawn in code (inline SVG), not loaded as images, so these
 * tokens are the only place a colour is decided. Keeping them here is what
 * makes five separately-written games look like one set.
 *
 * Brand colours live in tailwind/index.css and are re-stated here because the
 * artwork needs them as plain strings inside SVG attributes.
 */

export const BRAND = {
  pink: '#FF6FB5',
  blue: '#4FC3E8',
  ink: '#1A1A6E',
  border: '#EDE9F8',
  blush: '#FFD6EC',
  cream: '#FFF0F7',
};

// Every drawn shape uses this one outline colour and width. A single stroke
// treatment across all five games does more for "these belong together" than
// any amount of shared colour.
export const LINE = {
  color: '#3A3357',
  width: 2.4,
  thin: 1.6,
};

// Warm, low-saturation surfaces for rooms and props.
export const SURFACE = {
  wallWarm: '#FDEFF5',
  wallCool: '#E8F6FC',
  wallMint: '#E9F7EE',
  wallSand: '#FBF1DF',
  floor: '#E4D6C6',
  floorCool: '#D6E3EA',
  shelf: '#D4A373',
  shelfDark: '#B98A63',
  metal: '#C7CDD6',
  metalDark: '#8A9099',
  glass: '#CFEAF7',
  white: '#FFFFFF',
};

export const FOOD = {
  dough: '#E8B96B',
  doughBaked: '#D69B45',
  crustInner: '#F2D9A8',
  sauce: '#D8452F',
  cheese: '#F5C842',
  cheeseBaked: '#EFAE3B',
  green: '#5BC98C',
  greenDark: '#3E9E68',
  red: '#EF6B6B',
  brown: '#8B5E3C',
  purple: '#A78BFA',
  orange: '#FF9F5A',
};

// Fur/skin sets for the critter rig. `inner` is the muzzle and ear lining.
export const PELT = {
  bear: { fur: '#C08E63', inner: '#EBD2B6', nose: '#5A3E2B' },
  bunny: { fur: '#EFE9F4', inner: '#F9CFE0', nose: '#E58AA8' },
  cat: { fur: '#F0A860', inner: '#FBDFB9', nose: '#E58AA8' },
  dog: { fur: '#CE9457', inner: '#F1D8B3', nose: '#4A3325' },
  koala: { fur: '#AEB7C2', inner: '#DCE1E7', nose: '#4A4F57' },
  frog: { fur: '#83CB90', inner: '#BEE5C5', nose: '#3F7A4B' },
  fox: { fur: '#F08A4B', inner: '#FBE3D0', nose: '#4A3325' },
  panda: { fur: '#F7F7F9', inner: '#E7E7EC', nose: '#2F3542' },
  penguin: { fur: '#46536B', inner: '#FFFFFF', nose: '#F5A742' },
  turtle: { fur: '#8CC98F', inner: '#CBE8C8', nose: '#4A7A4F' },
  // Topi is the actions game's own character rather than a real animal, so it
  // gets the brand colours instead of a fur tone.
  topi: { fur: '#FFA9D2', inner: '#FFE1EF', nose: '#C4407A' },
};

export const CHEEK = 'rgba(255,111,181,.38)';
