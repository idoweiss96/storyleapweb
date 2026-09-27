import * as THREE from 'three';
import { World, V, shuffle } from '../world3d/engine';
import { inked, basic } from '../world3d/models';
import { makeBillboard } from '../world3d/cards';
import { decorate, makeFloorRect, makeGround, makeHouse, makeLamp, makeTree } from '../world3d/props';
import { chime, hmm, tone } from '../shared/sound';
import { RESIDENTS, ROUNDS } from './numberLineContent';

const X0 = -12;
const X1 = 12;
const HOUSE_Z = -2.6;
const COLORS = [[0xffb3d6, 0xef6b6b], [0x9fddf5, 0x4f6fd8], [0xffe07a, 0xff9f5a], [0xa9e5b8, 0x3e9e68], [0xc9b2fa, 0x7a5bc4], [0xffd0b0, 0xd9795a]];

function makeTargets(max) {
  const slices = shuffle(Array.from({ length: ROUNDS }, (_, i) => i));
  return slices.map((s) => {
    const lo = Math.max(1, Math.floor((s / ROUNDS) * max));
    const hi = Math.min(max - 1, Math.floor(((s + 1) / ROUNDS) * max));
    return lo + Math.floor(Math.random() * Math.max(1, hi - lo + 1));
  });
}

function makeFlag(color = 0x4fc3e8) {
  const g = new THREE.Group();
  const pole = inked(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), 0x3a3357, 0);
  pole.position.y = 0.7;
  const flag = inked(new THREE.BoxGeometry(0.6, 0.36, 0.04), color, 0.02);
  flag.position.set(0.3, 1.2, 0);
  g.add(pole, flag);
  return g;
}

export class StreetWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [X0 + 1.2, 0, 0.2],
        bounds: { minX: X0 - 0.4, maxX: X1 + 0.4, minZ: -0.6, maxZ: 0.9 },
        player: { hat: 'cap', apron: 0x4f6fd8 },
        camera: {
          clampX: [X0 + 4, X1 - 4], narrowClampX: [X0 + 1.5, X1 - 1.5], clampZ: [-0.6, -0.6],
          offset: [0, 10, 10], narrowOffset: [0, 13.5, 11.5], lead: 0.4, narrowLead: 0.4,
        },
      },
    });
  }

  toX(v) {
    return X0 + (v / this.level.max) * (X1 - X0);
  }

  build() {
    const max = this.level.max;
    makeGround(this.scene, { size: 140 });
    const road = makeFloorRect(X1 - X0 + 6, 1.9, 0xefe4d2, { outline: true });
    road.position.set(0, 0, 0.15);
    this.scene.add(road);
    decorate(this.scene, { minR: 8, maxR: 22, count: 60, avoid: (x, z) => z > -4.5 && z < 3 });
    for (let x = X0 - 2; x <= X1 + 2; x += 4.5) {
      const t = makeTree(1 + Math.random() * 0.3);
      t.position.set(x + Math.random(), 0, 5.2 + Math.random());
      this.scene.add(t);
    }

    // The two houses that exist from the start: 0 and max.
    [[0, 0], [max, 1]].forEach(([v, k]) => {
      const h = makeHouse(COLORS[k][0], COLORS[k][1], { number: v, scale: 1.1 });
      h.position.set(this.toX(v), 0, HOUSE_Z);
      this.scene.add(h);
    });
    // Ticks: small lamp posts on the far side, unlabelled (only for 0–10 / 0–20).
    if (this.level.ticks) {
      for (let v = 1; v < max; v += 1) {
        const l = makeLamp();
        l.scale.setScalar(0.55);
        l.position.set(this.toX(v), 0, 1.45);
        this.scene.add(l);
      }
    } else {
      const mid = makeLamp();
      mid.position.set(this.toX(max / 2), 0, 1.45);
      this.scene.add(mid);
    }

    this.targets = makeTargets(max);
    this.round = 0;
    this.history = [];
    this.phase = 'carry';
    this.letter = makeBillboard({ text: this.targets[0], bg: '#FFFFFF', textColor: '#C4407A' }, 0.9, 0.9);
    this.scene.add(this.letter);
  }

  /** The on-screen "Here!" button. */
  drop() {
    if (!this.running || this.phase !== 'carry') return;
    this.phase = 'reveal';
    this.frozen = true;
    const target = this.targets[this.round];
    const gx = THREE.MathUtils.clamp(this.p.x, X0, X1);
    const guess = ((gx - X0) / (X1 - X0)) * this.level.max;
    const shown = Math.round(guess);
    const error = Math.abs(guess - target) / this.level.max;

    // The letter goes into a mailbox where the child stopped.
    const flag = makeFlag(0x4fc3e8);
    flag.position.set(gx, 0, -1.05);
    this.scene.add(flag);
    this.tween(this.letter, V(gx, 0.9, -1.05), { dur: 0.4, arc: 0.8, spin: false, onDone: () => { this.letter.visible = false; } });
    tone(523, { dur: 0.12, type: 'sine' });

    // Then the real house grows out of the ground.
    const tx = this.toX(target);
    const [wall, roof] = COLORS[(this.round + 2) % COLORS.length];
    const house = makeHouse(wall, roof, { number: target, scale: 0.85 });
    house.position.set(tx, 0, HOUSE_Z);
    house.scale.setScalar(0.01);
    this.scene.add(house);
    this.camFocus = V((gx + tx) / 2, 0, 0);
    setTimeout(() => {
      if (this.disposed) return;
      this.animateValue(0.55, (k) => house.scale.setScalar(0.85 * (1 - (1 - k) ** 3) + Math.sin(k * Math.PI) * 0.12));
      this.burst(V(tx, 1.4, HOUSE_Z));
      // A dotted trail between the guess and the real house.
      const steps = Math.max(1, Math.round(Math.abs(tx - gx) / 0.45));
      for (let i = 0; i <= steps; i += 1) {
        const dot = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), basic(0xff6fb5));
        dot.rotation.x = -Math.PI / 2;
        dot.position.set(gx + ((tx - gx) * i) / steps, 0.03, -1.05);
        this.scene.add(dot);
      }
      // The resident comes out to collect the letter.
      const who = this.npc(RESIDENTS[this.round % RESIDENTS.length], { at: V(tx, 0, HOUSE_Z + 0.9), face: 0 });
      who.mood = error <= 0.1 ? 'happy' : 'idle';
      if (error <= 0.1) chime();
      else hmm();
      const text = error <= 0.04 ? this.copy.bullseye : error <= 0.1 ? this.copy.close : this.copy.far;
      this.say(text.replace('{n}', target).replace('{g}', shown), 3.4);
      this.history.push({ target, guess });
      this.emit();
      setTimeout(() => {
        if (this.disposed) return;
        who.mood = 'idle';
        this.round += 1;
        this.camFocus = null;
        this.frozen = false;
        if (this.round >= ROUNDS) {
          this.finish();
          return;
        }
        this.phase = 'carry';
        this.letter.visible = true;
        this.letter.material.map.dispose();
        this.scene.remove(this.letter);
        this.letter = makeBillboard({ text: this.targets[this.round], bg: '#FFFFFF', textColor: '#C4407A' }, 0.9, 0.9);
        this.scene.add(this.letter);
        this.emit();
      }, 3300);
    }, 550);
    this.emit();
  }

  tick(dt, t) {
    if (this.phase === 'carry') this.letter.position.set(this.p.x, 2.75 + Math.sin(t * 3) * 0.06, this.p.z);
    this.carrying = this.phase === 'carry';
  }

  hint() {
    return this.phase === 'carry' ? this.copy.carry.replace('{n}', this.targets[this.round]) : '';
  }

  snapshot() {
    const gx = THREE.MathUtils.clamp(this.p?.x ?? X0, X0, X1);
    return {
      phase: this.phase,
      round: this.round,
      max: this.level.max,
      frac: (gx - X0) / (X1 - X0),
      history: [...(this.history || [])],
    };
  }
}
