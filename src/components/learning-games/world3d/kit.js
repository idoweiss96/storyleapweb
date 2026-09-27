import * as THREE from 'three';
import { V } from './engine';
import { inked } from './models';
import { makeBillboard, setCard } from './cards';

/**
 * kit.js — pieces the role-play worlds share: a station you pick something
 * up from, and the thing the player carries overhead.
 */

export function makeCabinet(color = 0xffd6e8, w = 1.1) {
  const g = new THREE.Group();
  const body = inked(new THREE.BoxGeometry(w, 0.9, 0.7), color, 0.035);
  body.position.y = 0.45;
  const top = inked(new THREE.BoxGeometry(w + 0.12, 0.08, 0.8), 0xfff4e6, 0.02);
  top.position.y = 0.94;
  const handle = inked(new THREE.BoxGeometry(w * 0.4, 0.06, 0.04), 0xffffff, 0.01);
  handle.position.set(0, 0.62, 0.36);
  g.add(body, top, handle);
  return g;
}

/**
 * A station: a cabinet against the wall with a floating card showing what it
 * holds, and a pad in front of it. Standing on the pad calls onPick().
 * `pos` is where the player stands; the cabinet sits `back` units behind it.
 */
export function station(world, { pos, art, text, color = 0xffd6e8, padColor = 0x4fc3e8, onPick, back = 1.05, cardSize = 0.95 }) {
  const cab = makeCabinet(color);
  cab.position.set(pos.x, 0, pos.z - back);
  world.scene.add(cab);
  world.collide(V(pos.x, 0, pos.z - back), 0.45);
  const card = makeBillboard({ art, text, bg: '#ffffff' }, cardSize, cardSize);
  card.position.set(pos.x, 1.75, pos.z - back);
  world.scene.add(card);
  const pad = world.pad({ pos, r: 0.6, color: padColor, dwell: 0.2, onEnter: () => onPick?.() });
  return { cab, card, pad, pos: pos.clone() };
}

/** The thing the player carries, drawn as a card floating over their head. */
export class Carry {
  constructor(world) {
    this.world = world;
    this.card = makeBillboard({ text: '' }, 0.9, 0.9);
    this.card.visible = false;
    world.scene.add(this.card);
    this.what = null;
  }

  set(what, cardOpts) {
    this.what = what;
    setCard(this.card, { bg: '#ffffff', border: '#FF6FB5', ...cardOpts });
    this.card.visible = true;
    this.world.carrying = true;
  }

  clear() {
    this.what = null;
    this.card.visible = false;
    this.world.carrying = false;
  }

  update(t) {
    const p = this.world.p;
    this.card.position.set(p.x, 2.95 + Math.sin(t * 4) * 0.06, p.z);
  }
}

/** Something small to stick on a character's head (plaster, ice pack…). */
export function headPatch(char, color, { x = 0.26, y = 0.18, w = 0.26, h = 0.12 } = {}) {
  const m = inked(new THREE.BoxGeometry(w, h, 0.08), color, 0.015, { shadow: false });
  m.position.set(x, y, 0.4);
  m.rotation.z = -0.4;
  char.head.add(m);
  return m;
}
