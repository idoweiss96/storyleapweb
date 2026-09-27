import * as THREE from 'three';
import { PELT } from '../../games/shared/art/artTokens';

/**
 * models.js — every 3D object in the fruit stand, built from primitives.
 *
 * No model files: characters, fruit and furniture are spheres, capsules and
 * boxes with a cel-shaded (toon) material and an inked back-face outline.
 * The outline colour is the site's LINE colour, so the 3D world reads as the
 * same family as the drawn 2D games.
 */

export const INK = 0x3a3357;

let gradient = null;
function toonGradient() {
  if (gradient) return gradient;
  const data = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
  gradient = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  gradient.minFilter = THREE.NearestFilter;
  gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}

const matCache = new Map();
export function toon(color) {
  const key = `t${color}`;
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshToonMaterial({ color, gradientMap: toonGradient() }));
  return matCache.get(key);
}
const inkMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
export function basic(color, opts = {}) {
  return new THREE.MeshBasicMaterial({ color, ...opts });
}

/** A mesh plus its ink outline (the same geometry, inflated, back faces only). */
export function inked(geometry, color, outline = 0.045, { shadow = true } = {}) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(geometry, toon(color));
  m.castShadow = shadow;
  m.receiveShadow = true;
  g.add(m);
  if (outline > 0) {
    const o = new THREE.Mesh(geometry, inkMat);
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere.radius || 1;
    o.scale.setScalar(1 + outline / r);
    g.add(o);
  }
  return g;
}

const sphere = (r, w = 20, h = 16) => new THREE.SphereGeometry(r, w, h);
const capsule = (r, len) => new THREE.CapsuleGeometry(r, len, 6, 14);

const hex = (s) => parseInt(s.replace('#', ''), 16);

/* ------------------------------------------------------------------ *
 * Characters
 * ------------------------------------------------------------------ */

const EARS = {
  bear: 'round', panda: 'round', koala: 'fluffy', bunny: 'long', cat: 'point', fox: 'point',
  dog: 'flop', topi: 'round',
};

function ears(kind, fur, inner, dark) {
  const g = new THREE.Group();
  const add = (obj, x, y, z, rx = 0, rz = 0) => {
    obj.position.set(x, y, z);
    obj.rotation.set(rx, 0, rz);
    g.add(obj);
    return obj;
  };
  if (kind === 'round' || kind === 'fluffy') {
    const r = kind === 'fluffy' ? 0.19 : 0.15;
    [-1, 1].forEach((s) => {
      add(inked(sphere(r), dark || fur, 0.035), s * 0.33, 0.36, -0.02).scale.set(1, 1, 0.6);
      add(inked(sphere(r * 0.55), dark ? 0x6b6f7c : inner, 0), s * 0.33, 0.36, 0.06).scale.set(1, 1, 0.4);
    });
  } else if (kind === 'long') {
    [-1, 1].forEach((s) => {
      add(inked(capsule(0.09, 0.42), fur, 0.035), s * 0.17, 0.66, -0.02, 0, -s * 0.18);
      add(inked(capsule(0.045, 0.3), inner, 0), s * 0.17, 0.66, 0.05, 0, -s * 0.18);
    });
  } else if (kind === 'point') {
    [-1, 1].forEach((s) => {
      add(inked(new THREE.ConeGeometry(0.15, 0.3, 4), fur, 0.035), s * 0.28, 0.44, 0, 0, -s * 0.35).rotation.y = Math.PI / 4;
    });
  } else if (kind === 'flop') {
    [-1, 1].forEach((s) => {
      add(inked(capsule(0.1, 0.24), fur, 0.035), s * 0.45, 0.02, 0, 0, s * 0.35).scale.set(1, 1, 0.55);
    });
  }
  return g;
}

/**
 * A chibi character: big head, small body, swinging limbs. Returns the group
 * and an `animate(t, dt, state)` that the game calls every frame.
 *   state: { moving, carrying, mood: 'idle'|'happy'|'think' }
 */
export function makeCharacter(species = 'bear', { apron = null, hat = null } = {}) {
  const pelt = PELT[species] || PELT.bear;
  const fur = hex(pelt.fur);
  const inner = hex(pelt.inner);
  const nose = hex(pelt.nose);
  const penguin = species === 'penguin';
  const frog = species === 'frog';
  const turtle = species === 'turtle';

  const root = new THREE.Group();
  const rig = new THREE.Group();
  root.add(rig);

  // Legs, pivoting at the hip.
  const legs = [-1, 1].map((s) => {
    const hip = new THREE.Group();
    hip.position.set(s * 0.15, 0.42, 0);
    const leg = inked(capsule(0.1, 0.16), turtle ? 0xa6d8a3 : fur, 0.035);
    leg.position.y = -0.16;
    const foot = inked(sphere(0.12), penguin || species === 'topi' ? nose : frog ? 0x6db87a : fur, 0.035);
    foot.position.set(0, -0.33, 0.05);
    foot.scale.set(1, 0.6, 1.3);
    hip.add(leg, foot);
    rig.add(hip);
    return hip;
  });

  // Body
  const body = inked(capsule(0.31, 0.2), turtle ? 0x6fae72 : fur, 0.045);
  body.position.y = 0.72;
  body.scale.set(1, 1, 0.9);
  rig.add(body);
  const belly = inked(sphere(0.25), turtle ? 0xcbe8c8 : inner, 0);
  belly.position.set(0, 0.68, 0.17);
  belly.scale.set(penguin ? 1.15 : 1, 1.1, 0.55);
  rig.add(belly);
  if (apron) {
    const a = inked(new THREE.BoxGeometry(0.46, 0.4, 0.05), apron, 0.02);
    a.position.set(0, 0.66, 0.28);
    rig.add(a);
  }

  // Arms, pivoting at the shoulder.
  const arms = [-1, 1].map((s) => {
    const sh = new THREE.Group();
    sh.position.set(s * 0.33, 0.95, 0);
    const arm = inked(capsule(0.085, 0.2), fur, 0.035);
    arm.position.y = -0.17;
    const hand = inked(sphere(0.1), penguin ? fur : fur, 0.03);
    hand.position.y = -0.34;
    sh.add(arm, hand);
    sh.rotation.z = s * 0.25;
    rig.add(sh);
    return sh;
  });

  // Head
  const head = new THREE.Group();
  head.position.y = 1.42;
  rig.add(head);
  const skull = inked(sphere(0.47, 28, 22), fur, 0.05);
  skull.scale.set(1.05, 0.95, 0.95);
  head.add(skull);
  if (species === 'panda') {
    [-1, 1].forEach((s) => {
      const patch = inked(sphere(0.12), 0x2f3542, 0);
      patch.position.set(s * 0.17, 0.03, 0.37);
      patch.scale.set(1, 1.2, 0.5);
      patch.rotation.z = s * 0.4;
      head.add(patch);
    });
  }
  if (penguin) {
    const face = inked(sphere(0.36), inner, 0);
    face.position.set(0, -0.06, 0.2);
    face.scale.set(1, 0.95, 0.7);
    head.add(face);
    const beak = inked(new THREE.ConeGeometry(0.08, 0.18, 12), nose, 0.03);
    beak.position.set(0, -0.08, 0.5);
    beak.rotation.x = Math.PI / 2;
    head.add(beak);
  } else if (!frog) {
    const muzzle = inked(sphere(0.2), inner, 0.03);
    muzzle.position.set(0, -0.13, 0.36);
    muzzle.scale.set(1.2, 0.82, 0.7);
    head.add(muzzle);
    const n = inked(sphere(0.07), nose, 0);
    n.position.set(0, -0.06, 0.5);
    n.scale.set(1.3, 1, 1);
    head.add(n);
  }
  if (frog) {
    [-1, 1].forEach((s) => {
      const bump = inked(sphere(0.17), fur, 0.035);
      bump.position.set(s * 0.2, 0.36, 0.12);
      head.add(bump);
    });
  }
  const e = EARS[species];
  if (e) head.add(ears(e, fur, inner, species === 'panda' ? 0x2f3542 : null));

  // Eyes (blink by squashing Y)
  const eyes = [-1, 1].map((s) => {
    const eg = new THREE.Group();
    eg.position.set(s * 0.16, frog ? 0.4 : 0.05, frog ? 0.25 : 0.42);
    const ball = new THREE.Mesh(sphere(0.07, 12, 10), basic(0x2a2340));
    ball.scale.set(1, 1.25, 0.6);
    const shine = new THREE.Mesh(sphere(0.024, 8, 6), basic(0xffffff));
    shine.position.set(0.025, 0.035, 0.045);
    eg.add(ball, shine);
    head.add(eg);
    return eg;
  });
  // Cheeks and smile
  [-1, 1].forEach((s) => {
    const ch = new THREE.Mesh(sphere(0.075, 10, 8), basic(0xff9cc8, { transparent: true, opacity: 0.75 }));
    ch.position.set(s * 0.29, -0.1, 0.33);
    ch.scale.set(1.2, 0.7, 0.4);
    head.add(ch);
  });
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.016, 6, 16, Math.PI), basic(0x2a2340));
  smile.position.set(0, penguin ? -0.2 : -0.17, penguin ? 0.46 : 0.5);
  smile.rotation.z = Math.PI;
  head.add(smile);

  if (hat === 'chef') {
    const band = inked(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 20), 0xffffff, 0.03);
    band.position.y = 0.42;
    const puff = inked(sphere(0.3), 0xffffff, 0.03);
    puff.position.y = 0.62;
    puff.scale.set(1.15, 0.8, 1.15);
    head.add(band, puff);
  }

  if (hat === 'helmet' || hat === 'cap') {
    const dome = inked(new THREE.SphereGeometry(0.44, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), hat === 'helmet' ? 0xf5c842 : 0x4f6fd8, 0.03);
    dome.position.y = 0.16;
    dome.scale.set(1.08, 0.85, 1.05);
    const brim = inked(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 20, 1, false, -Math.PI / 2, Math.PI), hat === 'helmet' ? 0xf5c842 : 0x3a55b8, 0.02);
    brim.position.set(0, 0.17, 0.3);
    head.add(dome, brim);
  }

  // Tail
  if (['bunny', 'bear', 'panda', 'koala'].includes(species)) {
    const t = inked(sphere(0.11), species === 'bunny' ? 0xffffff : fur, 0.03);
    t.position.set(0, 0.55, -0.3);
    rig.add(t);
  } else if (['cat', 'fox', 'dog'].includes(species)) {
    const t = inked(capsule(0.07, 0.34), fur, 0.03);
    t.position.set(0, 0.7, -0.36);
    t.rotation.x = -0.9;
    rig.add(t);
    if (species === 'fox') {
      const tip = inked(sphere(0.09), 0xffffff, 0.02);
      tip.position.set(0, 0.86, -0.52);
      rig.add(tip);
    }
  }

  root.traverse((o) => { if (o.isMesh && o.material !== inkMat) o.castShadow = true; });

  let blinkAt = 1 + Math.random() * 3;
  const animate = (t, dt, { moving = false, carrying = false, mood = 'idle' } = {}) => {
    const walk = moving ? Math.sin(t * 11) : 0;
    legs[0].rotation.x = walk * 0.75;
    legs[1].rotation.x = -walk * 0.75;
    if (carrying) {
      arms.forEach((a, i) => {
        a.rotation.x = THREE.MathUtils.lerp(a.rotation.x, -1.35, 0.25);
        a.rotation.z = THREE.MathUtils.lerp(a.rotation.z, (i ? 1 : -1) * -0.05, 0.25);
      });
    } else if (mood === 'happy') {
      arms.forEach((a, i) => {
        a.rotation.x = THREE.MathUtils.lerp(a.rotation.x, 0, 0.3);
        a.rotation.z = (i ? 1 : -1) * (2.5 + Math.sin(t * 14) * 0.25);
      });
    } else {
      arms.forEach((a, i) => {
        const s = i ? 1 : -1;
        a.rotation.x = THREE.MathUtils.lerp(a.rotation.x, moving ? (i ? walk : -walk) * 0.8 : Math.sin(t * 2 + i) * 0.06, 0.3);
        a.rotation.z = THREE.MathUtils.lerp(a.rotation.z, s * (mood === 'think' ? 0.1 : 0.25), 0.3);
      });
    }
    rig.position.y = moving ? Math.abs(Math.sin(t * 11)) * 0.06 : mood === 'happy' ? Math.abs(Math.sin(t * 7)) * 0.35 : 0;
    rig.scale.y = moving ? 1 : 1 + Math.sin(t * 2.4) * 0.018;
    head.rotation.z = moving ? 0 : Math.sin(t * 1.6) * 0.06;
    head.rotation.x = mood === 'think' ? Math.sin(t * 3) * 0.08 : 0;
    blinkAt -= dt;
    const closing = blinkAt < 0.13 && blinkAt > 0;
    eyes.forEach((ey) => { ey.scale.y = closing ? 0.12 : 1; });
    if (blinkAt <= 0) blinkAt = 2.5 + Math.random() * 3;
  };

  return { root, head, animate, handAnchor: arms };
}

/* ------------------------------------------------------------------ *
 * Fruit
 * ------------------------------------------------------------------ */

export function makeFruit(type) {
  const g = new THREE.Group();
  if (type === 'apple') {
    const a = inked(sphere(0.17), 0xef5a5a, 0.025);
    a.scale.set(1.05, 0.95, 1.05);
    const stem = inked(new THREE.CylinderGeometry(0.015, 0.015, 0.09, 6), 0x7a4a2a, 0);
    stem.position.y = 0.19;
    const leaf = inked(sphere(0.06, 8, 6), 0x5bc98c, 0.015);
    leaf.position.set(0.06, 0.2, 0);
    leaf.scale.set(1.4, 0.4, 0.8);
    g.add(a, stem, leaf);
  } else if (type === 'banana') {
    const b = inked(new THREE.TorusGeometry(0.16, 0.055, 10, 20, Math.PI * 0.85), 0xf5c842, 0.02);
    b.rotation.z = Math.PI * 1.08;
    const tip = inked(sphere(0.03, 6, 5), 0x6b4a2a, 0);
    tip.position.set(-0.155, 0.04, 0);
    g.add(b, tip);
  } else if (type === 'carrot') {
    const c = inked(new THREE.ConeGeometry(0.09, 0.36, 12), 0xff8a3d, 0.02);
    c.rotation.x = Math.PI;
    c.rotation.z = 0.3;
    const top = inked(new THREE.ConeGeometry(0.06, 0.14, 6), 0x5bc98c, 0.015);
    top.position.set(0.05, 0.19, 0);
    top.rotation.z = 0.3;
    g.add(c, top);
  } else if (type === 'pear') {
    const p = inked(sphere(0.15), 0xb6d65a, 0.025);
    p.position.y = -0.04;
    const t = inked(sphere(0.1), 0xb6d65a, 0.02);
    t.position.y = 0.12;
    g.add(p, t);
  }
  return g;
}

export const FRUIT_HEIGHT = { apple: 0.3, banana: 0.2, carrot: 0.26, pear: 0.34 };

/* ------------------------------------------------------------------ *
 * Furniture & props
 * ------------------------------------------------------------------ */

export function makeCrate(type) {
  const g = new THREE.Group();
  const wood = 0xd4a373;
  const box = inked(new THREE.BoxGeometry(1.3, 0.6, 1.0), wood, 0.04);
  box.position.y = 0.3;
  g.add(box);
  for (let i = -1; i <= 1; i += 1) {
    const slat = inked(new THREE.BoxGeometry(1.34, 0.07, 0.04), 0xb98a63, 0);
    slat.position.set(0, 0.16 + (i + 1) * 0.16, 0.51);
    g.add(slat);
  }
  // A heap of the fruit on top, so the station says what it sells.
  const spots = [[-0.35, -0.2], [0, -0.22], [0.35, -0.2], [-0.2, 0.15], [0.2, 0.15], [0, 0], [-0.4, 0.2], [0.4, 0.18]];
  spots.forEach(([x, z], i) => {
    const f = makeFruit(type);
    f.position.set(x, 0.72 + (i % 3) * 0.05, z);
    f.rotation.y = i * 1.3;
    g.add(f);
  });
  return g;
}

export function makeCoin() {
  const g = inked(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 20), 0xf5c842, 0.02);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.055, 16), toon(0xffe07a));
  g.add(face);
  g.rotation.x = Math.PI / 2;
  return g;
}

export function makeRing(color, radius = 0.85) {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.RingGeometry(radius * 0.82, radius, 40), basic(color, { transparent: true, opacity: 0.9 }));
  ring.rotation.x = -Math.PI / 2;
  const fill = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.82, 40), basic(color, { transparent: true, opacity: 0.22 }));
  fill.rotation.x = -Math.PI / 2;
  g.add(ring, fill);
  g.position.y = 0.02;
  g.userData.fill = fill;
  return g;
}

export function makePlant(scale = 1) {
  const g = new THREE.Group();
  const pot = inked(new THREE.CylinderGeometry(0.3, 0.24, 0.45, 16), 0xe98c6a, 0.035);
  pot.position.y = 0.22;
  g.add(pot);
  [[0, 0.75, 0, 0.38], [-0.2, 0.62, 0.1, 0.26], [0.22, 0.6, -0.05, 0.28]].forEach(([x, y, z, r]) => {
    const b = inked(sphere(r), 0x5bc98c, 0.035);
    b.position.set(x, y, z);
    g.add(b);
  });
  g.scale.setScalar(scale);
  return g;
}

/** A price label that floats over an unlock pad: coin + number, on a canvas. */
export function makeLabel(text, { bg = '#ffffff', fg = '#1A1A6E', coin = false, w = 1.6 } = {}) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = bg;
  x.strokeStyle = '#3A3357';
  x.lineWidth = 10;
  x.beginPath();
  x.roundRect(8, 8, 240, 112, 40);
  x.fill();
  x.stroke();
  if (coin) {
    x.fillStyle = '#F5C842';
    x.beginPath();
    x.arc(70, 64, 32, 0, Math.PI * 2);
    x.fill();
    x.stroke();
    x.fillStyle = '#FFE07A';
    x.beginPath();
    x.arc(70, 64, 18, 0, Math.PI * 2);
    x.fill();
  }
  x.fillStyle = fg;
  x.font = '900 70px Assistant, Segoe UI, sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(text, coin ? 165 : 128, 70);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  s.scale.set(w, w / 2, 1);
  s.renderOrder = 10;
  s.userData.redraw = (t) => {
    x.clearRect(0, 0, 256, 128);
    x.fillStyle = bg;
    x.beginPath();
    x.roundRect(8, 8, 240, 112, 40);
    x.fill();
    x.stroke();
    if (coin) {
      x.fillStyle = '#F5C842';
      x.beginPath();
      x.arc(70, 64, 32, 0, Math.PI * 2);
      x.fill();
      x.stroke();
      x.fillStyle = '#FFE07A';
      x.beginPath();
      x.arc(70, 64, 18, 0, Math.PI * 2);
      x.fill();
    }
    x.fillStyle = fg;
    x.fillText(t, coin ? 165 : 128, 70);
    tex.needsUpdate = true;
  };
  return s;
}

export function makeArrow() {
  const g = new THREE.Group();
  const cone = inked(new THREE.ConeGeometry(0.28, 0.5, 4), 0xff6fb5, 0.04, { shadow: false });
  cone.rotation.x = Math.PI;
  cone.rotation.y = Math.PI / 4;
  const shaft = inked(new THREE.BoxGeometry(0.16, 0.36, 0.16), 0xff6fb5, 0.03, { shadow: false });
  shaft.position.y = 0.4;
  g.add(cone, shaft);
  return g;
}
