import { BASE } from './shapesContent';

const r3 = (n) => Math.round(n * 1000) / 1000;

/** Base polygon turned `rot` quarter-turns clockwise, bounding box at (0,0). */
export function shapePoints(type, rot = 0) {
  let pts = BASE[type];
  for (let k = 0; k < ((rot % 4) + 4) % 4; k += 1) pts = pts.map(([x, y]) => [-y, x]);
  const mx = Math.min(...pts.map((p) => p[0]));
  const my = Math.min(...pts.map((p) => p[1]));
  return pts.map(([x, y]) => [r3(x - mx), r3(y - my)]);
}

export function shapeSize(type, rot = 0) {
  const pts = shapePoints(type, rot);
  return [Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
}

const outlineKey = (type, rot) =>
  shapePoints(type, rot)
    .map((p) => p.join(','))
    .sort()
    .join(';');

/** Same outline? A square fits at any angle; a rectangle at 0° and 180°. */
export function sameOrientation(type, a, b) {
  return outlineKey(type, a) === outlineKey(type, b);
}

/** The distinct orientations of a type (1 for a square, 2 for a rectangle…). */
export function orientations(type) {
  const seen = [];
  for (let r = 0; r < 4; r += 1) {
    if (!seen.some((s) => sameOrientation(type, s, r))) seen.push(r);
  }
  return seen;
}

export function polygonPath(type, rot, x = 0, y = 0) {
  return (
    shapePoints(type, rot)
      .map(([px, py], i) => `${i ? 'L' : 'M'}${r3(px + x)} ${r3(py + y)}`)
      .join('') + 'Z'
  );
}

export function puzzleBounds(slots) {
  let w = 0;
  let h = 0;
  slots.forEach((s) => {
    const [sw, sh] = shapeSize(s.type, s.rot);
    w = Math.max(w, s.x + sw);
    h = Math.max(h, s.y + sh);
  });
  return [w, h];
}
