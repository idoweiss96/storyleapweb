import * as THREE from 'three';
import { World, V } from '../world3d/engine';
import { inked } from '../world3d/models';
import { decorate, makeBush, makeFloorRect, makeFlower, makeStone, makeTree, makeWater } from '../world3d/props';
import { makeFruit } from '../world3d/models';
import { chime, speak, tone } from '../shared/sound';
import { CHEERERS } from './numberPathContent';

const GAP = 2.2;
const SUNK = -0.75;

export class RiverWorld extends World {
  constructor(opts) {
    const n = opts.level.size;
    const end = (n + 1) * GAP;
    super({
      ...opts,
      config: {
        start: [-0.9, 0, 0],
        bounds: { minX: -2.6, maxX: 0.1, minZ: -0.45, maxZ: 0.45 },
        camera: {
          clampX: [0, end], narrowClampX: [0, end], clampZ: [0, 0],
          offset: [0, 9, 9], narrowOffset: [0, 12.5, 10.5], lead: 0.4, narrowLead: 0.8,
        },
      },
    });
  }

  build() {
    const n = this.level.size;
    this.end = (n + 1) * GAP;
    // Two grassy banks with an open channel between them for the river.
    [-1, 1].forEach((side) => {
      const bank = makeFloorRect(260, 60, 0xa9dcb6);
      bank.position.set(this.end / 2, 0, side * (2.5 + 30));
      this.scene.add(bank);
    });
    const bed = makeFloorRect(260, 5.2, 0x4f9fc4, { y: -0.4 });
    bed.position.set(this.end / 2, 0, 0);
    this.scene.add(bed);
    this.water = makeWater(260, 5.1);
    this.water.position.set(this.end / 2, -0.12, 0);
    this.scene.add(this.water);
    // Banks along the river, with the path's two ends on land.
    const startBank = inked(new THREE.BoxGeometry(3, 0.3, 5.4), 0xc9e8b8, 0.03);
    startBank.position.set(-1.8, -0.1, 0);
    this.scene.add(startBank);
    const endBank = inked(new THREE.BoxGeometry(5, 0.3, 5.4), 0xc9e8b8, 0.03);
    endBank.position.set(this.end + 1.5, -0.1, 0);
    this.scene.add(endBank);
    decorate(this.scene, { minR: 5, maxR: 14, count: 30, avoid: (x, z) => Math.abs(z) < 3.4 });
    for (let x = -3; x < this.end + 6; x += 3.4) {
      [-1, 1].forEach((s) => {
        const o = (x / 3.4) % 2 ? makeBush(0.9) : makeFlower(0xff9cc8);
        o.position.set(x + Math.random(), 0, s * (3.2 + Math.random() * 0.8));
        this.scene.add(o);
      });
      if (Math.round(x) % 4 === 0) {
        const t = makeTree(1.1);
        t.position.set(x + 1.5, 0, -5.2);
        this.scene.add(t);
      }
    }

    // Carrot garden on the far bank.
    this.carrots = [];
    for (let i = 0; i < 5; i += 1) {
      const c = makeFruit('carrot');
      c.scale.setScalar(2.2);
      c.position.set(this.end + 0.6 + (i % 3) * 0.7, 0.5, -0.9 + Math.floor(i / 3) * 1.4 + (i % 2) * 0.3);
      this.scene.add(c);
      this.carrots.push(c);
    }

    // Stones, all under water to begin with.
    this.stones = [];
    for (let i = 1; i <= n; i += 1) {
      const s = makeStone(i, i % 2 ? 0xdbe2ea : 0xe8dccb);
      s.position.set(i * GAP, SUNK, 0);
      this.scene.add(s);
      this.stones.push({ n: i, obj: s, y: SUNK, up: false });
    }

    // Cheering animals on the far bank, facing the river.
    this.cheerers = [];
    const every = n <= 10 ? 3 : 4;
    for (let i = every, k = 0; i < n; i += every, k += 1) {
      const npc = this.npc(CHEERERS[k % CHEERERS.length], { at: V(i * GAP + 0.6, 0, -3.1), face: 0 });
      this.cheerers.push({ at: i, npc, said: false });
    }

    this.pos = 0; // the stone the player is on (0 = start bank)
    this.allowed = 0; // furthest risen stone
    this.phase = 'spin'; // spin | walk | done
    this.spinResult = 0;
    this.wheelAngle = 0;
    this.cheerIndex = 0;
  }

  /** Called by the on-screen "spin" button. */
  spin() {
    if (!this.running || this.phase !== 'spin') return;
    const result = 1 + Math.floor(Math.random() * this.level.spin);
    this.spinResult = result;
    this.phase = 'spinning';
    let last = 0;
    this.animateValue(1.1, (k) => {
      const ticks = Math.floor(k * 14 * (1 - k * 0.4));
      if (ticks !== last) {
        last = ticks;
        tone(700 + (ticks % 3) * 90, { dur: 0.04, type: 'sine', gain: 0.05 });
      }
    }, () => {
      const target = Math.min(this.level.size, this.allowed + result);
      this.say(this.copy.rolled.replace('{n}', result), 3);
      this.pop(String(result), this.p.clone().add(V(0, 2.8, 0)));
      // Raise the next stones one after another, with a splash each.
      for (let i = this.allowed + 1; i <= target; i += 1) {
        const st = this.stones[i - 1];
        setTimeout(() => {
          if (this.disposed) return;
          st.up = true;
          this.burst(st.obj.position.clone().setY(0.2), [0xffffff, 0x9fd8f5, 0xcfeffc], 10);
          tone(392 + i * 18, { dur: 0.12, type: 'sine', gain: 0.08 });
        }, (i - this.allowed - 1) * 260);
      }
      this.allowed = target;
      this.phase = 'walk';
      this.cfg.bounds.maxX = target * GAP;
      this.emit();
    });
    this.emit();
  }

  land(i) {
    this.pos = i;
    // Pitch rises with the number: bigger numbers literally sound higher.
    tone(262 * 2 ** ((i - 1) / (this.level.size + 2)), { dur: 0.28 });
    speak(i, this.lang, { rate: 1.05 });
    this.pop(String(i), this.stones[i - 1].obj.position.clone().add(V(0, 2.9, 0)));
    const c = this.cheerers.find((x) => x.at === i && !x.said);
    if (c) {
      c.said = true;
      c.npc.mood = 'happy';
      setTimeout(() => { c.npc.mood = 'idle'; }, 1800);
      const lines = this.copy.cheer;
      const idx = i >= this.level.size - 2 ? 3 : i >= this.level.size / 2 && this.cheerIndex < 2 ? 2 : this.cheerIndex % 2;
      this.cheerIndex += 1;
      this.say(lines[idx].replace('{n}', i), 2.2);
    }
    if (i === this.level.size) {
      this.cfg.bounds.maxX = this.end + 1.5;
      this.say(this.copy.last, 3);
    } else if (i === this.allowed) {
      this.phase = 'spin';
    }
    this.emit();
  }

  tick(dt, t) {
    this.water.userData.wave(t);
    for (const st of this.stones) {
      const target = st.up ? 0.02 : SUNK;
      st.y += (target - st.y) * Math.min(1, dt * 7);
      st.obj.position.y = st.y + (st.up ? Math.sin(t * 1.8 + st.n) * 0.015 : 0);
    }
    // Hop: over water the player arcs from stone to stone (0 on a stone,
    // highest halfway), and stands on the stone's top when landed.
    const x = this.p.x;
    const overRiver = x > GAP * 0.55 && x < this.level.size * GAP + GAP * 0.45;
    const d = Math.abs(x / GAP - Math.round(x / GAP));
    this.p.y = overRiver ? 0.22 + Math.sin(d * Math.PI) * 0.6 : 0;
    const on = Math.round(this.p.x / GAP);
    if (on >= 1 && on <= this.allowed && Math.abs(this.p.x - on * GAP) < 0.55 && on === this.pos + 1) this.land(on);
    if (this.pos === this.level.size && this.p.x > this.end - 0.3 && !this.done) {
      chime();
      this.carrots.forEach((c, k) => this.tween(c, c.position.clone().add(V(0, 1.2, 0)), { dur: 0.5 + k * 0.08, arc: 0.6 }));
      this.cheerers.forEach((c) => { c.npc.mood = 'happy'; });
      this.finish();
    }
    this.carrots.forEach((c, k) => { c.rotation.y = Math.sin(t * 2 + k) * 0.3; });
    this.guide = this.phase === 'walk' && this.pos < this.allowed ? this.stones[this.pos].obj.position.clone().setY(0.2)
      : this.pos === this.level.size ? V(this.end + 1, 0, 0) : null;
  }

  hint() {
    if (this.phase === 'spin' || this.phase === 'spinning') return this.copy.spinHint;
    return this.copy.walk;
  }

  snapshot() {
    return { pos: this.pos, allowed: this.allowed, size: this.level.size, phase: this.phase };
  }
}
