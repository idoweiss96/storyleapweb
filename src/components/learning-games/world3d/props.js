import * as THREE from 'three';
import { basic, inked, toon } from './models';
import { makeCard } from './cards';

/**
 * props.js — scenery shared by the 3D learning games. Same rules as
 * models.js: primitives, toon material, ink outline, site palette.
 */

const sphere = (r, w = 18, h = 14) => new THREE.SphereGeometry(r, w, h);

export function makeGround(scene, { color = 0xa9dcb6, size = 80 } = {}) {
  const g = new THREE.Mesh(new THREE.PlaneGeometry(size, size), toon(color));
  g.rotation.x = -Math.PI / 2;
  g.position.y = -0.01;
  g.receiveShadow = true;
  scene.add(g);
  return g;
}

/** A flat rectangle on the floor (paths, platforms, rugs). */
export function makeFloorRect(w, d, color, { y = 0.01, outline = false } = {}) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), toon(color));
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  m.receiveShadow = true;
  if (!outline) return m;
  const g = new THREE.Group();
  const edge = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.12, d + 0.12), basic(0x3a3357));
  edge.rotation.x = -Math.PI / 2;
  edge.position.y = y - 0.002;
  g.add(edge, m);
  return g;
}

export function makeTree(scale = 1, color = 0x5bc98c) {
  const g = new THREE.Group();
  const trunk = inked(new THREE.CylinderGeometry(0.16, 0.22, 1.1, 10), 0xb98a63, 0.035);
  trunk.position.y = 0.55;
  g.add(trunk);
  [[0, 1.55, 0, 0.72], [-0.38, 1.25, 0.12, 0.48], [0.4, 1.3, -0.08, 0.5], [0.05, 2.0, 0.05, 0.46]].forEach(([x, y, z, r]) => {
    const b = inked(sphere(r), color, 0.04);
    b.position.set(x, y, z);
    g.add(b);
  });
  g.scale.setScalar(scale);
  return g;
}

export function makeBush(scale = 1, color = 0x6fcf8f) {
  const g = new THREE.Group();
  [[0, 0.3, 0, 0.38], [-0.3, 0.22, 0.05, 0.28], [0.32, 0.24, -0.02, 0.3]].forEach(([x, y, z, r]) => {
    const b = inked(sphere(r), color, 0.035);
    b.position.set(x, y, z);
    g.add(b);
  });
  g.scale.setScalar(scale);
  return g;
}

export function makeFlower(color = 0xff9cc8) {
  const g = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 5), toon(0x4e9e62));
  stem.position.y = 0.15;
  g.add(stem);
  for (let i = 0; i < 5; i += 1) {
    const p = new THREE.Mesh(sphere(0.06, 8, 6), toon(color));
    const a = (i / 5) * Math.PI * 2;
    p.position.set(Math.cos(a) * 0.07, 0.32, Math.sin(a) * 0.07);
    p.scale.set(1, 0.5, 1);
    g.add(p);
  }
  const c = new THREE.Mesh(sphere(0.045, 8, 6), toon(0xf5c842));
  c.position.y = 0.33;
  g.add(c);
  return g;
}

/** Scatter flowers and bushes on a ring around the play area. */
export function decorate(scene, { minR = 9, maxR = 16, count = 40, avoid = () => false } = {}) {
  const colors = [0xff9cc8, 0xffffff, 0xc9b2fa, 0xffe07a];
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = minR + Math.random() * (maxR - minR);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r * 0.8;
    if (avoid(x, z)) continue;
    const o = i % 5 === 0 ? makeTree(0.8 + Math.random() * 0.5) : i % 3 === 0 ? makeBush(0.8 + Math.random() * 0.6) : makeFlower(colors[i % colors.length]);
    o.position.set(x, 0, z);
    o.rotation.y = Math.random() * 6;
    scene.add(o);
  }
}

export function makeHouse(color = 0xffb3d6, roof = 0xef6b6b, { number = null, scale = 1 } = {}) {
  const g = new THREE.Group();
  const body = inked(new THREE.BoxGeometry(1.6, 1.3, 1.4), color, 0.04);
  body.position.y = 0.65;
  g.add(body);
  const r = inked(new THREE.ConeGeometry(1.35, 0.9, 4), roof, 0.04);
  r.position.y = 1.75;
  r.rotation.y = Math.PI / 4;
  r.scale.set(1, 1, 0.85);
  g.add(r);
  const door = inked(new THREE.BoxGeometry(0.46, 0.72, 0.06), 0x4fc3e8, 0.02);
  door.position.set(0, 0.36, 0.71);
  g.add(door);
  const win = inked(new THREE.BoxGeometry(0.34, 0.34, 0.06), 0xfff3c4, 0.02);
  win.position.set(0.5, 0.9, 0.71);
  g.add(win);
  if (number !== null) {
    const sign = makeCard({ text: number, bg: '#ffffff' }, 0.7, 0.7);
    sign.position.set(-0.45, 0.95, 0.75);
    g.add(sign);
    g.userData.sign = sign;
  }
  g.scale.setScalar(scale);
  return g;
}

export function makeWater(w, d) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d, 24, 8), new THREE.MeshToonMaterial({ color: 0x7fcdee, transparent: true, opacity: 0.92 }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = -0.05;
  m.receiveShadow = true;
  const base = m.geometry.attributes.position.array.slice();
  m.userData.wave = (t) => {
    const a = m.geometry.attributes.position.array;
    for (let i = 0; i < a.length; i += 3) a[i + 2] = Math.sin(base[i] * 0.9 + t * 1.6) * 0.05 + Math.cos(base[i + 1] * 1.3 + t) * 0.04;
    m.geometry.attributes.position.needsUpdate = true;
  };
  return m;
}

/** A round stepping stone with its number painted on top. */
export function makeStone(n, color = 0xd6dce4) {
  const g = new THREE.Group();
  const s = inked(new THREE.CylinderGeometry(0.78, 0.9, 0.42, 20), color, 0.04);
  s.position.y = 0.0;
  g.add(s);
  const face = makeCard({ text: n, bg: null, border: null, textColor: '#1A1A6E' }, 1.25, 1.25);
  face.rotation.x = -Math.PI / 2;
  face.position.y = 0.215;
  g.add(face);
  return g;
}

export function makeDrum(scale = 1) {
  const g = new THREE.Group();
  const shell = inked(new THREE.CylinderGeometry(0.8, 0.8, 0.8, 24), 0xff6fb5, 0.045);
  shell.position.y = 0.4;
  g.add(shell);
  const skin = inked(new THREE.CylinderGeometry(0.78, 0.78, 0.06, 24), 0xfff4e6, 0.02);
  skin.position.y = 0.82;
  g.add(skin);
  g.userData.skin = skin;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 5), toon(0xffffff));
    rope.position.set(Math.cos(a) * 0.81, 0.4, Math.sin(a) * 0.81);
    rope.rotation.z = 0.35 * (i % 2 ? 1 : -1);
    g.add(rope);
  }
  g.scale.setScalar(scale);
  return g;
}

/** A gift box whose lid can open (userData.lid). */
export function makeGiftBox(color = 0xff9cc8, ribbon = 0xffffff) {
  const g = new THREE.Group();
  const box = inked(new THREE.BoxGeometry(1.3, 0.95, 1.3), color, 0.045);
  box.position.y = 0.475;
  g.add(box);
  const band = inked(new THREE.BoxGeometry(0.22, 0.97, 1.32), ribbon, 0);
  band.position.y = 0.475;
  g.add(band);
  const lid = new THREE.Group();
  const top = inked(new THREE.BoxGeometry(1.44, 0.26, 1.44), color, 0.045);
  lid.add(top);
  const lb = inked(new THREE.BoxGeometry(0.24, 0.28, 1.46), ribbon, 0);
  lid.add(lb);
  [-1, 1].forEach((s) => {
    const bow = inked(new THREE.TorusGeometry(0.16, 0.06, 8, 16), ribbon, 0.02);
    bow.position.set(s * 0.14, 0.22, 0);
    bow.rotation.y = Math.PI / 2;
    bow.rotation.x = s * 0.5;
    lid.add(bow);
  });
  lid.position.y = 1.08;
  g.add(lid);
  g.userData.lid = lid;
  return g;
}

export function makeLamp() {
  const g = new THREE.Group();
  const pole = inked(new THREE.CylinderGeometry(0.06, 0.08, 2.2, 8), 0x5b5578, 0.02);
  pole.position.y = 1.1;
  const head = inked(sphere(0.2), 0xfff3c4, 0.03);
  head.position.y = 2.3;
  g.add(pole, head);
  return g;
}

export function makeStage(w = 10, d = 4) {
  const g = new THREE.Group();
  const deck = inked(new THREE.BoxGeometry(w, 0.3, d), 0xd9a56e, 0.04);
  deck.position.y = 0.15;
  g.add(deck);
  for (let i = 0; i < Math.floor(w / 1.2); i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, d), toon(0xb9824f));
    plank.position.set(-w / 2 + 1.2 * (i + 1), 0.31, 0);
    g.add(plank);
  }
  const back = inked(new THREE.BoxGeometry(w, 2.6, 0.3), 0xe4577e, 0.04);
  back.position.set(0, 1.4, -d / 2);
  g.add(back);
  for (let i = 0; i < 6; i += 1) {
    const bulb = new THREE.Mesh(sphere(0.1, 8, 6), basic(0xfff3a0));
    bulb.position.set(-w / 2 + (w / 6) * (i + 0.5), 2.6, -d / 2 + 0.2);
    g.add(bulb);
  }
  return g;
}

/* ---------------- train ---------------- */

export function makeEngine() {
  const g = new THREE.Group();
  const chassis = inked(new THREE.BoxGeometry(2.1, 0.25, 1.1), 0x3a3357, 0.02);
  chassis.position.y = 0.45;
  g.add(chassis);
  const cab = inked(new THREE.BoxGeometry(0.9, 1.1, 1.05), 0xff6fb5, 0.04);
  cab.position.set(-0.55, 1.1, 0);
  g.add(cab);
  const roof = inked(new THREE.BoxGeometry(1.1, 0.12, 1.2), 0xffffff, 0.02);
  roof.position.set(-0.55, 1.72, 0);
  g.add(roof);
  const boiler = inked(new THREE.CylinderGeometry(0.42, 0.42, 1.25, 18), 0x4fc3e8, 0.04);
  boiler.rotation.z = Math.PI / 2;
  boiler.position.set(0.45, 0.95, 0);
  g.add(boiler);
  const stack = inked(new THREE.CylinderGeometry(0.16, 0.12, 0.5, 12), 0x3a3357, 0.02);
  stack.position.set(0.75, 1.55, 0);
  g.add(stack);
  g.userData.chimney = new THREE.Vector3(0.75, 1.85, 0);
  const wheels = [];
  [-0.65, 0.05, 0.75].forEach((x) => {
    [-1, 1].forEach((s) => {
      const w = inked(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 16), 0x5b5578, 0.02);
      w.rotation.x = Math.PI / 2;
      w.position.set(x, 0.3, s * 0.56);
      g.add(w);
      wheels.push(w);
    });
  });
  g.userData.wheels = wheels;
  return g;
}

export function makeWagon(color = 0xffd98a) {
  const g = new THREE.Group();
  const chassis = inked(new THREE.BoxGeometry(1.3, 0.2, 1.0), 0x3a3357, 0.02);
  chassis.position.y = 0.45;
  g.add(chassis);
  const bed = inked(new THREE.BoxGeometry(1.25, 0.35, 0.95), color, 0.035);
  bed.position.y = 0.72;
  g.add(bed);
  const wheels = [];
  [-0.4, 0.4].forEach((x) => {
    [-1, 1].forEach((s) => {
      const w = inked(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 14), 0x5b5578, 0.02);
      w.rotation.x = Math.PI / 2;
      w.position.set(x, 0.28, s * 0.5);
      g.add(w);
      wheels.push(w);
    });
  });
  g.userData.wheels = wheels;
  g.userData.cargoY = 0.9;
  return g;
}

/** A cargo crate with art on its front and top. */
export function makeCargo(cardOpts, color = 0xd4a373) {
  const g = new THREE.Group();
  const box = inked(new THREE.BoxGeometry(0.8, 0.8, 0.8), color, 0.035);
  box.position.y = 0.4;
  g.add(box);
  const front = makeCard(cardOpts, 0.7, 0.7);
  front.position.set(0, 0.4, 0.405);
  g.add(front);
  const top = makeCard(cardOpts, 0.7, 0.7);
  top.rotation.x = -Math.PI / 2;
  top.position.set(0, 0.805, 0);
  g.add(top);
  return g;
}

export function makeRails(length) {
  const g = new THREE.Group();
  for (let x = -length / 2; x <= length / 2; x += 0.7) {
    const tie = inked(new THREE.BoxGeometry(0.28, 0.08, 1.5), 0xa9825e, 0);
    tie.position.set(x, 0.04, 0);
    g.add(tie);
  }
  [-0.5, 0.5].forEach((z) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.08), toon(0x7b8794));
    rail.position.set(0, 0.12, z);
    rail.receiveShadow = true;
    g.add(rail);
  });
  return g;
}

/** Puffs of smoke for a chimney: call puff(worldPos) now and then. */
export function smokePuff(world, at) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }));
  m.position.copy(at);
  world.scene.add(m);
  world.animateValue(1.4, (k) => {
    m.position.y = at.y + k * 1.6;
    m.position.x = at.x - k * 0.4;
    m.scale.setScalar(1 + k * 1.8);
    m.material.opacity = 0.9 * (1 - k);
  }, () => world.scene.remove(m));
}
