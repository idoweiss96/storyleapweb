import React from 'react';
import * as THREE from 'three';
import { World, V } from '../../learning-games/world3d/engine';
import { basic, inked, toon } from '../../learning-games/world3d/models';
import { Carry, station } from '../../learning-games/world3d/kit';
import { makeFloorRect, makeGround, smokePuff } from '../../learning-games/world3d/props';
import { chime, speak, tap, tone } from '../../learning-games/shared/sound';
import Icon from '../shared/art/Icon';
import { ORDERS, SLOTS, TOPPINGS } from './pizzeriaContent';

const TABLE = V(-1.6, 0, 0.3); // the work table with the dough
const OVEN = V(3.6, 0, -1.3);
const CUT = V(3.6, 0, 1.6);
const COUNTER = V(-1.6, 0, 3.4); // where the customer waits (behind the counter)

// Colours of the pieces dropped on the pizza.
const PIECE = {
  mushroom: 0xd9c3a5, olive: 0x3a3357, tomato: 0xef6b6b, pepper: 0x5bc98c, corn: 0xf5c842,
  pineapple: 0xffd98a, broccoli: 0x3e9e68, egg: 0xffffff, basil: 0x4e9e62,
};

export class PizzeriaWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [-1.6, 0, 1.6],
        bounds: { minX: -6.4, maxX: 5.4, minZ: -2.4, maxZ: 2.3 },
        player: { apron: 0xef6b6b, hat: 'chef' },
        camera: { clampX: [-1.5, 1.5], narrowClampX: [-3.8, 3.2], clampZ: [-0.3, 0.3], offset: [0, 10.5, 9.5], narrowOffset: [0, 12, 10.5], narrowLead: 0.9 },
      },
    });
  }

  build() {
    makeGround(this.scene, { color: 0xa9dcb6 });
    const floor = makeFloorRect(14, 8, 0xfbf1df, { outline: true });
    floor.position.set(-0.5, 0, 0.4);
    this.scene.add(floor);
    const wall = inked(new THREE.BoxGeometry(14, 2.4, 0.3), 0xfbe0c8, 0.03);
    wall.position.set(-0.5, 1.2, -3.6);
    this.scene.add(wall);
    // Front counter the customers stand behind.
    const counter = inked(new THREE.BoxGeometry(7, 0.95, 0.8), 0xffb3d6, 0.04);
    counter.position.set(-1.8, 0.47, 2.75);
    this.scene.add(counter);
    // Brick oven.
    const oven = inked(new THREE.BoxGeometry(1.8, 1.6, 1.4), 0xd98a5f, 0.04);
    oven.position.set(OVEN.x, 0.8, OVEN.z - 0.6);
    const mouth = inked(new THREE.BoxGeometry(0.9, 0.55, 0.1), 0x3a2a25, 0.02);
    mouth.position.set(OVEN.x, 0.75, OVEN.z + 0.12);
    this.fire = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), basic(0xff9f5a));
    this.fire.position.set(OVEN.x, 0.62, OVEN.z + 0.05);
    const chimney = inked(new THREE.CylinderGeometry(0.2, 0.2, 0.9, 12), 0xb96a45, 0.03);
    chimney.position.set(OVEN.x + 0.4, 2.0, OVEN.z - 0.8);
    this.scene.add(oven, mouth, this.fire, chimney);
    this.chimneyTop = V(OVEN.x + 0.4, 2.5, OVEN.z - 0.8);
    this.collide(V(OVEN.x, 0, OVEN.z - 0.6), 0.9);
    // Cutting board.
    const board = inked(new THREE.BoxGeometry(1.4, 0.8, 1.1), 0xd4a373, 0.04);
    board.position.set(CUT.x, 0.4, CUT.z + 0.1);
    this.scene.add(board);
    this.collide(V(CUT.x, 0, CUT.z + 0.1), 0.6);
    // Work table and the pizza on it.
    const table = inked(new THREE.BoxGeometry(1.8, 0.9, 1.3), 0xfff4e6, 0.04);
    table.position.set(TABLE.x, 0.45, TABLE.z - 0.9);
    this.scene.add(table);
    this.collide(V(TABLE.x, 0, TABLE.z - 0.9), 0.8);
    this.pizza = new THREE.Group();
    this.dough = inked(new THREE.CylinderGeometry(0.62, 0.66, 0.1, 32), 0xe8b96b, 0.03);
    this.pizza.add(this.dough);
    this.sauce = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.02, 32), toon(0xd8452f));
    this.sauce.position.y = 0.06;
    this.cheese = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.02, 32), toon(0xf5c842));
    this.cheese.position.y = 0.075;
    this.sauce.visible = this.cheese.visible = false;
    this.pizza.add(this.sauce, this.cheese);
    this.pieces = new THREE.Group();
    this.pizza.add(this.pieces);
    this.cuts = new THREE.Group();
    this.pizza.add(this.cuts);
    this.scene.add(this.pizza);

    // Topping bins along the back wall.
    const n = TOPPINGS.length;
    this.bins = TOPPINGS.map((tp, i) => ({
      tp,
      ...station(this, {
        pos: V(-6 + i * 0.98, 0, -2.2),
        art: <Icon name={tp.id} size={120} />,
        text: tp[this.lang] || tp.he,
        color: i % 2 ? 0xffe3c8 : 0xfff4d6,
        cardSize: 0.82,
        back: 0.9,
        onPick: () => this.pickTopping(tp),
      }),
    }));
    this.carry = new Carry(this);
    this.tablePad = this.pad({ pos: TABLE, r: 0.7, color: 0xff6fb5, dwell: 0.15, onEnter: () => this.atTable() });
    this.ovenPad = this.pad({ pos: V(OVEN.x, 0, OVEN.z + 1.0), r: 0.7, color: 0xff9f5a, dwell: 0.15, onEnter: () => this.atOven() });
    this.cutPad = this.pad({ pos: V(CUT.x - 1.2, 0, CUT.z + 0.2), r: 0.65, color: 0xd4a373, dwell: 0.15, onEnter: () => this.atBoard() });
    this.servePad = this.pad({ pos: V(COUNTER.x, 0, COUNTER.z - 1.3), r: 0.7, color: 0x5bc98c, dwell: 0.15, onEnter: () => this.serve() });

    this.orderIndex = 0;
    this.newPizza();
  }

  onStart() {
    this.nextCustomer();
  }

  get order() {
    return this.level.id === 'free' ? null : ORDERS[this.orderIndex % ORDERS.length];
  }

  newPizza() {
    this.on = new Set();
    this.pieceCount = 0;
    this.state = 'dough'; // dough | carried | baking | baked | cutting | sliced | served
    this.sauce.visible = this.cheese.visible = false;
    this.dough.children[0].material = toon(0xe8b96b);
    this.cheese.material = toon(0xf5c842);
    this.pieces.clear();
    this.cuts.clear();
    this.pizza.position.set(TABLE.x, 0.97, TABLE.z - 0.9);
    this.pizza.scale.setScalar(1);
  }

  nextCustomer() {
    const o = this.order;
    const species = o ? o.customer : ['bear', 'cat', 'dog', 'bunny', 'frog'][this.orderIndex % 5];
    this.customer = this.npc(species, { at: V(-8, 0, COUNTER.z), face: Math.PI });
    this.customer.walk([COUNTER], () => {
      this.line = o ? (o[this.lang] || o.he).line : this.copy.freePlayLine;
      speak(this.line, this.lang, { rate: 0.95 });
      this.emit();
    });
    this.line = '';
    this.emit();
  }

  pickTopping(tp) {
    if (this.state !== 'dough') return;
    tap();
    this.carry.set(tp, { art: <Icon name={tp.id} size={120} /> });
  }

  atTable() {
    const tp = this.carry.what;
    if (this.state === 'dough' && tp && tp.id) {
      this.addTopping(tp);
      this.carry.clear();
      return;
    }
    // Ready to bake: pick the whole pizza up.
    if (this.state === 'dough' && this.readyToBake()) {
      this.state = 'carried';
      this.carry.set({ pizza: true }, { art: <Icon name="pizza" size={120} /> });
      this.pizza.visible = false;
      this.emit();
    }
  }

  addTopping(tp) {
    tone(520 + this.on.size * 40, { dur: 0.12, type: 'sine' });
    this.on.add(tp.id);
    if (tp.layer) {
      (tp.id === 'sauce' ? this.sauce : this.cheese).visible = true;
    } else {
      for (let k = 0; k < 3; k += 1) {
        const slot = SLOTS[this.pieceCount % SLOTS.length];
        this.pieceCount += 1;
        const m = inked(new THREE.SphereGeometry(tp.id === 'olive' ? 0.05 : 0.065, 10, 8), PIECE[tp.id] || 0xffffff, 0.012, { shadow: false });
        m.scale.set(1, 0.45, 1);
        m.position.set(((slot.x - 50) / 50) * 0.46, 0.1, ((slot.y - 50) / 50) * 0.46);
        this.pieces.add(m);
      }
    }
    this.burst(this.pizza.position.clone().add(V(0, 0.2, 0)), [0xffffff, 0xf5c842], 6);
    this.emit();
  }

  missing() {
    const o = this.order;
    return o ? o.wants.filter((w) => !this.on.has(w)) : [];
  }

  readyToBake() {
    return this.on.size > 0 && this.missing().length === 0;
  }

  atOven() {
    if (this.state !== 'carried') return;
    this.carry.clear();
    this.state = 'baking';
    this.pizza.visible = true;
    this.pizza.position.set(OVEN.x, 0.62, OVEN.z - 0.2);
    this.pizza.scale.setScalar(0.7);
    this.bakeT = 0;
    this.emit();
  }

  atBoard() {
    if (this.state === 'baked') {
      this.state = 'cutting';
      this.pizza.position.set(CUT.x, 0.88, CUT.z + 0.1);
      this.pizza.scale.setScalar(1);
      // Four cuts, one after another.
      [0, 1, 2, 3].forEach((i) => setTimeout(() => {
        if (this.disposed) return;
        const cut = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.03, 0.03), basic(0x7a4a2a));
        cut.position.y = 0.1;
        cut.rotation.y = (i * Math.PI) / 4;
        this.cuts.add(cut);
        tone(300, { dur: 0.06, type: 'square', gain: 0.04 });
        if (i === 3) {
          this.state = 'sliced';
          this.emit();
        }
      }, 250 + i * 280));
      this.emit();
    } else if (this.state === 'sliced') {
      this.state = 'toServe';
      this.carry.set({ pizza: true }, { art: <Icon name="pizza" size={120} /> });
      this.pizza.visible = false;
      this.emit();
    }
  }

  serve() {
    if (this.state !== 'toServe' || !this.customer) return;
    this.carry.clear();
    this.state = 'served';
    chime();
    this.pizza.visible = true;
    this.pizza.position.set(COUNTER.x, 1.02, COUNTER.z - 0.6);
    this.customer.mood = 'happy';
    this.burst(this.customer.pos.clone().setY(1.8));
    this.line = this.copy.servedTitle;
    speak(this.copy.servedTitle, this.lang);
    this.emit();
    const who = this.customer;
    setTimeout(() => {
      if (this.disposed) return;
      who.mood = 'idle';
      who.walk([V(-8, 0, COUNTER.z)], () => who.remove());
      this.orderIndex += 1;
      this.newPizza();
      if (this.level.id !== 'free' && this.orderIndex >= ORDERS.length) {
        this.finish();
        return;
      }
      setTimeout(() => !this.disposed && this.nextCustomer(), 900);
    }, 2200);
  }

  tick(dt, t) {
    this.carry.update(t);
    // Whoever is still standing at the table / board when the step is ready
    // picks the pizza up without having to step off and on again.
    this.holdT = this.tablePad.inside && this.state === 'dough' && this.level.id !== 'free' && this.readyToBake() && !this.carry.what
      ? (this.holdT || 0) + dt : 0;
    if (this.holdT > 0.7) this.atTable();
    if (this.state === 'sliced' && this.cutPad.inside) this.atBoard();
    this.fire.scale.setScalar(1 + Math.sin(t * 9) * 0.15 + (this.state === 'baking' ? 0.5 : 0));
    if (this.state === 'baking') {
      this.bakeT += dt;
      this.puffT = (this.puffT || 0) + dt;
      if (this.puffT > 0.3) {
        this.puffT = 0;
        smokePuff(this, this.chimneyTop.clone());
      }
      if (this.bakeT > 2.4) {
        this.state = 'baked';
        this.dough.children[0].material = toon(0xd69b45);
        this.cheese.material = toon(0xefae3b);
        tone(880, { dur: 0.2, type: 'sine' });
        tone(1175, { dur: 0.3, type: 'sine', delay: 0.15 });
        this.pizza.position.set(OVEN.x, 0.62, OVEN.z + 0.35);
        this.emit();
      }
    }
    const s = this.state;
    const need = this.missing()[0];
    this.guide = s === 'dough' ? (this.carry.what ? this.tablePad.pos : this.readyToBake() ? this.tablePad.pos : need ? this.bins.find((b) => b.tp.id === need)?.pos : null)
      : s === 'carried' ? this.ovenPad.pos
        : s === 'baked' || s === 'sliced' ? this.cutPad.pos
          : s === 'toServe' ? this.servePad.pos : null;
  }

  anchor(id) {
    if (id === 'customer' && this.customer) return this.customer.pos.clone().add(V(0, 2.4, 0));
    return null;
  }

  hint() {
    const c = this.copy;
    switch (this.state) {
      case 'dough':
        if (this.carry.what) return c.toTable;
        return this.readyToBake() ? c.pickPizza : this.on.size ? c.moreToppings : c.emptyHint;
      case 'carried': return c.toOven;
      case 'baking': return c.baking;
      case 'baked': return c.toBoard;
      case 'cutting': return c.cutting;
      case 'sliced': return c.pickSlices;
      case 'toServe': return c.toCustomer;
      default: return '';
    }
  }

  snapshot() {
    return { line: this.line || '', wants: this.order?.wants || [], on: [...(this.on || [])], served: this.orderIndex || 0, total: ORDERS.length };
  }
}
