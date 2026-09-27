import React from 'react';
import * as THREE from 'three';
import { World, V } from '../../learning-games/world3d/engine';
import { inked } from '../../learning-games/world3d/models';
import { makeBillboard } from '../../learning-games/world3d/cards';
import { makeFloorRect, makeGround } from '../../learning-games/world3d/props';
import { chime, hmm, speak, tap, tone } from '../../learning-games/shared/sound';
import Icon from '../shared/art/Icon';
import { ITEMS } from './storeContent';

const TILL = V(4.2, 0, 1.6); // where the shopper stands to pay
const MAX_BASKET = 6;

function makeShelf(w = 3.4) {
  const g = new THREE.Group();
  const back = inked(new THREE.BoxGeometry(w, 1.6, 0.25), 0xd4a373, 0.035);
  back.position.set(0, 0.8, -0.3);
  g.add(back);
  [0.35, 0.95].forEach((y) => {
    const board = inked(new THREE.BoxGeometry(w, 0.08, 0.6), 0xb98a63, 0.02);
    board.position.set(0, y, 0);
    g.add(board);
  });
  return g;
}

export class StoreWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [0, 0, 2],
        bounds: { minX: -6, maxX: 6, minZ: -1.9, maxZ: 3.2 },
        player: { apron: 0x5bc98c, hat: null },
        camera: { clampX: [-1.5, 1.5], narrowClampX: [-3.6, 3.6], clampZ: [-0.3, 0.4], offset: [0, 10.5, 9.5], narrowOffset: [0, 12, 10.5], narrowLead: 0.8 },
      },
    });
  }

  build() {
    makeGround(this.scene, { color: 0xa9dcb6 });
    const floor = makeFloorRect(13.4, 7.4, 0xeef7ee, { outline: true });
    floor.position.set(0, 0, 0.6);
    this.scene.add(floor);
    const wall = inked(new THREE.BoxGeometry(13.4, 2.6, 0.3), 0xe9f7ee, 0.03);
    wall.position.set(0, 1.3, -3.2);
    this.scene.add(wall);
    // Striped awning on the wall.
    for (let i = 0; i < 12; i += 1) {
      const s = inked(new THREE.BoxGeometry(1.1, 0.35, 0.3), i % 2 ? 0xffffff : 0xef6b6b, 0.012);
      s.position.set(-6.05 + i * 1.1, 2.45, -2.95);
      this.scene.add(s);
    }
    // Till with the shopkeeper behind it.
    const till = inked(new THREE.BoxGeometry(1.6, 1, 1), 0xffb3d6, 0.04);
    till.position.set(TILL.x + 0.9, 0.5, TILL.z - 1.4);
    const reg = inked(new THREE.BoxGeometry(0.6, 0.35, 0.45), 0x4fc3e8, 0.03);
    reg.position.set(TILL.x + 1.1, 1.18, TILL.z - 1.4);
    this.scene.add(till, reg);
    this.collide(V(TILL.x + 0.9, 0, TILL.z - 1.4), 0.8);
    this.keeper = this.npc('cat', { at: V(TILL.x + 0.9, 0, TILL.z - 2.3), face: 0, apron: 0xef6b6b });

    // Three shelves along the back wall, four items each.
    this.items = [];
    [-3.9, -0.3, 3.3].forEach((sx, k) => {
      if (k === 2) return; // the right-hand wall space belongs to the till
      const shelf = makeShelf(3.4);
      shelf.position.set(sx, 0, -2.45);
      this.scene.add(shelf);
      this.collide(V(sx - 1.2, 0, -2.45), 0.5);
      this.collide(V(sx, 0, -2.45), 0.5);
      this.collide(V(sx + 1.2, 0, -2.45), 0.5);
    });
    // A free-standing shelf in the middle for the rest.
    const mid = makeShelf(3.4);
    mid.position.set(-2.1, 0, 0.9);
    mid.rotation.y = Math.PI;
    this.scene.add(mid);
    this.collide(V(-3.3, 0, 0.9), 0.5);
    this.collide(V(-2.1, 0, 0.9), 0.5);
    this.collide(V(-0.9, 0, 0.9), 0.5);
    const spots = [
      ...[-5.1, -4.3, -3.5, -2.7].map((x) => ({ x, z: -1.2, cardZ: -2.25 })),
      ...[-1.5, -0.7, 0.1, 0.9].map((x) => ({ x, z: -1.2, cardZ: -2.25 })),
      ...[-3.3, -2.5, -1.7, -0.9].map((x) => ({ x, z: 2.1, cardZ: 0.75 })),
    ];
    ITEMS.forEach((item, i) => {
      const sp = spots[i];
      const card = makeBillboard({ art: <Icon name={item.id} size={120} />, text: `${item.price}${this.copy.currency}`, bg: '#ffffff' }, 0.78, 0.78);
      card.position.set(sp.x, 1.55, sp.cardZ);
      this.scene.add(card);
      const pad = this.pad({ pos: V(sp.x, 0, sp.z), r: 0.38, color: 0x5bc98c, dwell: 0.2, onEnter: () => this.take(item) });
      this.items.push({ item, card, pad });
    });
    this.tillPad = this.pad({ pos: TILL, r: 0.8, color: 0xff6fb5, dwell: 0.2, onEnter: () => this.checkout() });

    this.basket = [];
    this.phase = 'shop'; // shop | pay | paid
    this.paid = [];
    this.basketCards = [];
  }

  total() {
    return this.basket.reduce((a, it) => a + it.price, 0);
  }

  take(item) {
    if (this.phase !== 'shop') return;
    if (this.basket.length >= MAX_BASKET) {
      hmm();
      this.say(this.copy.basketFull, 2);
      return;
    }
    tap();
    this.basket.push(item);
    speak(item[this.lang] || item.he, this.lang);
    this.pop(`+${item.price}`, this.p.clone().add(V(0, 2.6, 0)), 'small');
    const c = makeBillboard({ art: <Icon name={item.id} size={120} />, bg: null, border: null }, 0.5, 0.5);
    this.scene.add(c);
    this.basketCards.push(c);
    this.carrying = true;
    this.emit();
  }

  putBack() {
    if (this.phase !== 'shop' || !this.basket.length) return;
    this.basket.pop();
    this.scene.remove(this.basketCards.pop());
    this.carrying = this.basket.length > 0;
    tone(330, { dur: 0.08, type: 'sine' });
    this.emit();
  }

  checkout() {
    if (this.phase !== 'shop' || !this.basket.length) return;
    this.phase = 'pay';
    this.frozen = true;
    this.paid = [];
    speak(this.copy.roleSeller, this.lang); // the top chip shows it too; no hint line over the till panel
    this.emit();
  }

  addCoin(v) {
    if (this.phase !== 'pay') return;
    this.paid.push(v);
    tone(880 + v * 20, { dur: 0.09, type: 'sine', gain: 0.08 });
    this.emit();
  }

  resetCoins() {
    this.paid = [];
    this.emit();
  }

  pay() {
    const sum = this.paid.reduce((a, b) => a + b, 0);
    if (this.phase !== 'pay' || sum < this.total()) return;
    this.phase = 'paid';
    chime();
    this.keeper.mood = 'happy';
    this.burst(this.keeper.pos.clone().setY(2));
    this.emit();
    setTimeout(() => !this.disposed && this.finish(), 1600);
  }

  tick(dt, t) {
    // The basket's contents bob over the shopper's head in a little row.
    this.basketCards.forEach((c, i) => {
      const n = this.basketCards.length;
      c.position.set(this.p.x + (i - (n - 1) / 2) * 0.42, 2.9 + Math.sin(t * 4 + i) * 0.05, this.p.z);
    });
    this.guide = this.phase === 'shop' && this.basket.length ? this.tillPad.pos : null;
  }

  anchor(id) {
    if (id === 'keeper') return this.keeper.pos.clone().add(V(0, 2.4, 0));
    return null;
  }

  hint() {
    if (this.phase === 'shop') return this.basket.length ? this.copy.shopMore : this.copy.shopHint;
    return '';
  }

  snapshot() {
    const paid = (this.paid || []).reduce((a, b) => a + b, 0);
    return {
      phase: this.phase,
      basket: (this.basket || []).map((b) => b.id),
      total: this.basket ? this.total() : 0,
      paid,
    };
  }
}
