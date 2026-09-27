import React from 'react';
import * as THREE from 'three';
import { World, V, pick, shuffle } from '../world3d/engine';
import { inked } from '../world3d/models';
import { makeBillboard } from '../world3d/cards';
import { decorate, makeCargo, makeEngine, makeFloorRect, makeGround, makeRails, makeTree, makeWagon, smokePuff } from '../world3d/props';
import LearnArt from '../shared/LearnArt';
import { chime, hmm, tap, tone } from '../shared/sound';
import { ROUNDS, SHAPES } from './patternsContent';

const RAIL_Z = -2.3;
const WAGON = 1.55;
const CRATE_Z = 1.9;
const DELIVER_Z = -0.8;

/* ---------- the patterns themselves (same rules as before) ---------- */
function makeRepeat(level) {
  const tpl = pick(level.templates);
  const letters = [...new Set(tpl.split(''))];
  const shapes = shuffle(SHAPES).slice(0, letters.length);
  const map = Object.fromEntries(letters.map((l, i) => [l, shapes[i]]));
  const length = 6; // six wagons fit one phone screen
  const seq = Array.from({ length }, (_, i) => map[tpl[i % tpl.length]]);
  const gap = level.gapAtEnd ? length - 1 : Math.min(length - 1, tpl.length + Math.floor(Math.random() * (length - tpl.length)));
  const answer = seq[gap];
  const extras = shuffle(SHAPES.filter((s) => s !== answer));
  return { kind: 'shape', seq, gap, answer, options: shuffle([answer, ...extras.slice(0, level.options - 1)]) };
}

function makeNumber() {
  const type = pick(['add', 'add', 'add', 'sub', 'double']);
  let seq;
  if (type === 'double') {
    const start = pick([1, 2, 3, 5]);
    seq = Array.from({ length: 5 }, (_, i) => start * 2 ** i);
  } else {
    const step = pick([2, 3, 4, 5, 10, 25]);
    const start = type === 'sub' ? step * 5 + pick([0, 1, 2]) * step + pick([0, 1, 7]) : pick([0, 1, 2, 3, 5, 10, 11]);
    seq = Array.from({ length: 5 }, (_, i) => (type === 'sub' ? start - i * step : start + i * step));
  }
  const gap = Math.random() < 0.6 ? 4 : 1 + Math.floor(Math.random() * 3);
  const answer = seq[gap];
  const diff = Math.abs(seq[1] - seq[0]) || 1;
  const wrong = shuffle([answer + 1, answer - 1, answer + diff, answer - diff, answer + 2 * diff, answer * 2])
    .filter((n, i, a) => n !== answer && n >= 0 && a.indexOf(n) === i)
    .slice(0, 3);
  return { kind: 'number', seq, gap, answer, options: shuffle([answer, ...wrong]) };
}

const cardFor = (round, v) => (round.kind === 'number' ? { text: v, bg: '#FFF8EC' } : { art: <LearnArt name={v} size={120} />, bg: '#FFFFFF', artScale: 0.8 });

export class StationWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [0, 0, 0.6],
        bounds: { minX: -6.8, maxX: 6.8, minZ: -1.3, maxZ: 3.3 },
        player: { hat: 'cap', apron: 0x4f6fd8 },
        camera: { clampX: [-1.5, 1.5], narrowClampX: [-3.2, 3.2], clampZ: [-0.6, -0.6], offset: [0, 12, 10.5], narrowOffset: [0, 16, 13] },
      },
    });
  }

  build() {
    this.dir = this.lang === 'he' ? 1 : -1; // the way the engine faces and leaves
    makeGround(this.scene, { color: 0xa9dcb6 });
    const platform = makeFloorRect(17, 4.8, 0xe6e1ea, { outline: true, y: 0.06 });
    platform.position.set(0, 0, 1);
    this.scene.add(platform);
    const edge = makeFloorRect(17, 0.28, 0xf5c842, { y: 0.07 });
    edge.position.set(0, 0, -1.3);
    this.scene.add(edge);
    const rails = makeRails(80);
    rails.position.set(0, 0, RAIL_Z);
    this.scene.add(rails);
    const gravel = makeFloorRect(80, 2.2, 0xcdbfa8, { y: 0.02 });
    gravel.position.set(0, 0, RAIL_Z);
    this.scene.add(gravel);
    decorate(this.scene, { minR: 10, maxR: 22, count: 50, avoid: (x, z) => z > -6 && z < 5 });
    // Station building with a canopy, behind the rails.
    const house = inked(new THREE.BoxGeometry(5, 2.2, 2), 0xffd6e8, 0.04);
    house.position.set(0, 1.1, -5.6);
    const roof = inked(new THREE.BoxGeometry(5.6, 0.3, 2.5), 0xff6fb5, 0.04);
    roof.position.set(0, 2.35, -5.6);
    const clock = inked(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 20), 0xffffff, 0.03);
    clock.rotation.x = Math.PI / 2;
    clock.position.set(0, 1.6, -4.55);
    this.scene.add(house, roof, clock);
    [[-8.5, -5], [8.5, -5], [-8.5, 4.5], [8.5, 4.5]].forEach(([x, z]) => {
      const t = makeTree(1.2);
      t.position.set(x, 0, z);
      this.scene.add(t);
    });
    // Benches and passengers.
    this.conductor = this.npc('penguin', { at: V(-5.8 * this.dir, 0.06, -0.4), face: 0, hat: 'cap' });
    this.conductor.lift = 0.06;
    ['cat', 'bunny'].forEach((sp, i) => {
      const n = this.npc(sp, { at: V((5 + i * 1.1) * this.dir, 0.06, 2.9), face: Math.PI });
      n.lift = 0.06;
    });

    this.round = 0;
    this.phase = 'arriving';
    this.carried = null;
    this.newTrain();
  }

  newTrain() {
    if (this.train) this.scene.remove(this.train);
    (this.crates || []).forEach((c) => this.scene.remove(c.obj));
    [...this.pads].forEach((p) => this.removePad(p));

    const r = this.level.kind === 'number' ? makeNumber() : makeRepeat(this.level);
    this.cur = r;
    const L = r.seq.length;
    const train = new THREE.Group();
    const engine = makeEngine();
    // The engine leads in the reading direction and the wagons trail behind
    // it, so the pattern reads right-to-left in Hebrew and left-to-right in
    // English. (No mirror scale: that would flip the art on the cargo too.)
    engine.position.x = 0;
    engine.rotation.y = this.dir > 0 ? 0 : Math.PI;
    train.add(engine);
    this.wheels = [...engine.userData.wheels];
    this.chimney = engine.userData.chimney;
    this.wagons = r.seq.map((v, i) => {
      const w = makeWagon([0xffd98a, 0x9fddf5, 0xffb3d6, 0xa9e5b8][i % 4]);
      w.position.x = -this.dir * (1.9 + i * WAGON);
      train.add(w);
      this.wheels.push(...w.userData.wheels);
      if (i !== r.gap) {
        const cargo = makeCargo(cardFor(r, v));
        cargo.scale.setScalar(0.85);
        cargo.position.set(w.position.x, w.userData.cargoY, 0);
        train.add(cargo);
      }
      return w;
    });
    this.q = makeBillboard({ text: '?', bg: '#FFFFFF', border: '#FF6FB5', textColor: '#FF6FB5' }, 0.9, 0.9);
    this.q.position.set(this.wagons[r.gap].position.x, 2.0, 0);
    train.add(this.q);
    // Centre the train, face it along this language's reading direction.
    const len = 1.9 + (L - 1) * WAGON;
    this.trainHome = V((len / 2 - 1.05) * this.dir, 0, RAIL_Z);
    train.position.copy(this.trainHome).add(V(-34 * this.dir, 0, 0));
    this.scene.add(train);
    this.train = train;
    this.gapX = this.trainHome.x + this.wagons[r.gap].position.x;

    // Crates on the platform.
    const n = r.options.length;
    this.crates = r.options.map((v, i) => {
      const obj = makeCargo(cardFor(r, v));
      const spot = V((i - (n - 1) / 2) * 2.2, 0.06, CRATE_Z);
      obj.position.copy(spot);
      this.scene.add(obj);
      const c = { v, obj, spot, state: 'platform' };
      c.pad = this.pad({ pos: spot, r: 0.7, color: 0x4fc3e8, dwell: 0.2, onEnter: () => this.pickUp(c) });
      return c;
    });
    this.deliver = this.pad({ pos: V(this.gapX, 0, DELIVER_Z), r: 0.9, color: 0xff6fb5, dwell: 0.15, onEnter: () => this.tryDeliver() });
    this.carried = null;

    this.phase = 'arriving';
    this.move(this.trainHome, 2.2, 'in', () => {
      this.phase = 'waiting';
      tone(660, { dur: 0.15, type: 'sine' });
      this.emit();
    });
    this.emit();
  }

  /** Slide the train: 'in' brakes into the station, 'out' pulls away. */
  move(to, dur, how, onDone) {
    const from = this.train.position.clone();
    this.trainMoving = true;
    this.animateValue(dur, (k) => {
      const e = how === 'out' ? k * k : 1 - (1 - k) ** 2;
      this.train.position.lerpVectors(from, to, e);
    }, () => {
      this.trainMoving = false;
      onDone?.();
    });
  }

  pickUp(c) {
    if (this.phase !== 'waiting' || c.state !== 'platform') return;
    if (this.carried) {
      const old = this.carried;
      old.state = 'platform';
      old.obj.scale.setScalar(1);
      old.obj.position.copy(old.spot);
      old.pad.enabled = true;
    }
    tap();
    c.state = 'carried';
    c.pad.enabled = false;
    this.carried = c;
    this.emit();
  }

  tryDeliver() {
    const c = this.carried;
    if (!c || this.phase !== 'waiting') return;
    if (c.v !== this.cur.answer) {
      hmm();
      this.say(this.cur.kind === 'number' ? this.copy.lookNumbers : this.copy.look, 3);
      this.conductor.mood = 'think';
      this.carried = null;
      c.state = 'platform';
      this.tween(c.obj, c.spot.clone(), { dur: 0.5, arc: 1.4, spin: false, onDone: () => { c.obj.scale.setScalar(1); c.pad.enabled = true; } });
      this.emit();
      return;
    }
    this.carried = null;
    c.state = 'loaded';
    const w = this.wagons[this.cur.gap];
    const target = () => this.train.localToWorld(V(w.position.x, w.userData.cargoY, 0));
    this.tween(c.obj, target, {
      dur: 0.45,
      arc: 1.2,
      spin: false,
      onDone: () => {
        this.scene.remove(c.obj);
        const cargo = makeCargo(cardFor(this.cur, c.v));
        cargo.scale.setScalar(0.85);
        cargo.position.set(w.position.x, w.userData.cargoY, 0);
        this.train.add(cargo);
        this.q.visible = false;
      },
    });
    chime();
    this.phase = 'leaving';
    this.conductor.mood = 'happy';
    this.npcs.forEach((n) => { n.mood = 'happy'; });
    this.say(this.copy.good, 2.4);
    // Whistle, then away.
    setTimeout(() => { if (!this.disposed) { tone(880, { dur: 0.25, type: 'square', gain: 0.05 }); tone(1175, { dur: 0.35, type: 'square', gain: 0.05, delay: 0.25 }); } }, 500);
    setTimeout(() => {
      if (this.disposed) return;
      this.move(this.trainHome.clone().add(V(36 * this.dir, 0, 0)), 2.4, 'out', () => {
        this.npcs.forEach((n) => { n.mood = 'idle'; });
        this.round += 1;
        if (this.round >= ROUNDS) {
          this.finish();
          return;
        }
        this.newTrain();
      });
    }, 1100);
    this.emit();
  }

  tick(dt, t) {
    const c = this.carried;
    this.carrying = !!c;
    if (c) {
      c.obj.scale.setScalar(0.65);
      c.obj.position.set(this.p.x, 2.35 + Math.sin(t * 4) * 0.05, this.p.z - 0.2);
    }
    if (this.trainMoving || this.phase === 'arriving') {
      this.wheels.forEach((w) => { w.rotation.y += dt * 9; });
      this.puffT = (this.puffT || 0) + dt;
      if (this.puffT > 0.18) {
        this.puffT = 0;
        smokePuff(this, this.train.localToWorld(this.chimney.clone()));
      }
    }
    if (this.q) this.q.position.y = 2.0 + Math.sin(t * 3) * 0.1;
    this.deliver.enabled = this.phase === 'waiting';
    this.deliver.ring.visible = this.phase === 'waiting';
    this.guide = this.phase !== 'waiting' ? null : c ? this.deliver.pos : null;
  }

  hint() {
    if (this.phase === 'arriving') return this.copy.arriving;
    if (this.phase !== 'waiting') return '';
    return this.carried ? this.copy.carryHint : this.copy.pickHint;
  }

  snapshot() {
    return { round: this.round || 0 };
  }
}
