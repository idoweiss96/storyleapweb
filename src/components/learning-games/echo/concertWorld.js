import * as THREE from 'three';
import { World, V } from '../world3d/engine';
import { basic, inked } from '../world3d/models';
import { decorate, makeFloorRect, makeGround, makeLamp, makeStage, makeTree } from '../world3d/props';
import { chime, hmm, tone } from '../shared/sound';
import { MAX_TUNES, SINGERS } from './echoContent';

const PAD_Z = -0.6;
const STAGE_Z = -3.6;

export class ConcertWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [0, 0, 2.4],
        bounds: { minX: -6.5, maxX: 6.5, minZ: -1.4, maxZ: 3.6 },
        camera: { clampX: [0, 0], narrowClampX: [-1.8, 1.8], clampZ: [-0.4, -0.4], offset: [0, 11, 10], narrowOffset: [0, 14.5, 11.5] },
      },
    });
  }

  build() {
    const n = this.level.singers;
    makeGround(this.scene);
    const lawn = makeFloorRect(15, 7, 0xfff4e6, { outline: true });
    lawn.position.set(0, 0, 1);
    this.scene.add(lawn);
    const stage = makeStage(n === 3 ? 10.5 : 13, 3.2);
    stage.position.set(0, 0, STAGE_Z);
    this.scene.add(stage);
    decorate(this.scene, { minR: 9, maxR: 20, count: 50, avoid: (x, z) => Math.abs(x) < 8 && z > -6 && z < 5 });
    [[-7.8, 3], [7.8, 3]].forEach(([x, z]) => {
      const t = makeTree(1.2);
      t.position.set(x, 0, z);
      this.scene.add(t);
    });
    [-5.5, 5.5].forEach((x) => {
      const l = makeLamp();
      l.position.set(x, 0, 1.8);
      this.scene.add(l);
    });

    const xs = n === 3 ? [-3.3, 0, 3.3] : [-4.6, -1.55, 1.55, 4.6];
    this.singers = SINGERS.slice(0, n).map((s, i) => {
      const x = xs[i];
      const who = this.npc(s.species, { at: V(x, 0.3, STAGE_Z + 0.2), face: 0 });
      who.lift = 0.3;
      // A coloured spot under each musician, lit while they play.
      const spot = new THREE.Mesh(new THREE.CircleGeometry(1.0, 32), basic(s.color, { transparent: true, opacity: 0.35 }));
      spot.rotation.x = -Math.PI / 2;
      spot.position.set(x, 0.32, STAGE_Z + 0.2);
      this.scene.add(spot);
      // dwell: running across a musician's circle on the way must not count.
      const pad = this.pad({ pos: V(x, 0, PAD_Z), r: 0.95, color: s.color, dwell: 0.25, onEnter: () => this.press(i) });
      return { ...s, x, who, spot, pad, glow: 0 };
    });

    this.seq = [];
    this.idx = 0;
    this.slips = 0;
    this.best = 0;
    this.tunes = 0;
    this.phase = 'idle'; // idle | listen | play | wait
    this.timers = [];
  }

  later(fn, ms) {
    this.timers.push(setTimeout(() => { if (!this.disposed) fn(); }, ms));
  }

  onStart() {
    const first = Array.from({ length: this.level.start }, () => Math.floor(Math.random() * this.level.singers));
    this.seq = first;
    this.later(() => this.playTune(), 700);
  }

  sing(k, dur = 0.45) {
    const s = this.singers[k];
    tone(s.note, { dur, type: 'triangle', gain: 0.18 });
    s.glow = 1;
    s.who.mood = 'happy';
    this.later(() => { s.who.mood = 'idle'; }, 420);
    this.pop('♪', s.who.pos.clone().add(V(0, 2.5, 0)), 'small');
  }

  playTune() {
    this.phase = 'listen';
    this.frozen = true;
    this.idx = 0;
    const gap = this.level.gap * 1000;
    this.seq.forEach((k, i) => this.later(() => this.sing(k), 400 + i * gap));
    this.later(() => {
      this.phase = 'play';
      this.frozen = false;
      // Step off any pad the player happens to be standing on.
      this.pads.forEach((p) => {
        p.inside = Math.hypot(this.p.x - p.pos.x, this.p.z - p.pos.z) < p.r;
        p.armed = p.inside;
      });
      this.emit();
    }, 400 + this.seq.length * gap);
    this.emit();
  }

  press(k) {
    if (this.phase !== 'play') return;
    this.sing(k, 0.3);
    if (this.seq[this.idx] !== k) {
      hmm();
      this.phase = 'wait';
      const slips = this.slips + 1;
      if (slips >= 2 && this.seq.length > this.level.start) {
        this.seq = this.seq.slice(0, -1);
        this.slips = 0;
        this.say(this.copy.shorter, 2.6);
      } else {
        this.slips = slips;
        this.say(this.copy.oops, 2);
      }
      this.later(() => this.playTune(), 1700);
      this.emit();
      return;
    }
    this.idx += 1;
    this.pop(String(this.idx), this.p.clone().add(V(0, 2.7, 0)), 'small');
    if (this.idx === this.seq.length) {
      this.phase = 'wait';
      this.slips = 0;
      this.tunes += 1;
      if (this.seq.length > this.best) {
        this.best = this.seq.length;
        if (this.best >= 4) this.burst(V(0, 2.2, STAGE_Z));
      }
      this.later(chime, 250);
      this.singers.forEach((s) => { s.who.mood = 'happy'; });
      this.later(() => this.singers.forEach((s) => { s.who.mood = 'idle'; }), 1100);
      if (this.best >= this.level.goal || this.tunes >= MAX_TUNES) {
        this.later(() => this.finish(), 1200);
      } else {
        this.say(this.copy.good, 1.6);
        this.seq = [...this.seq, Math.floor(Math.random() * this.level.singers)];
        this.later(() => this.playTune(), 1600);
      }
    }
    this.emit();
  }

  tick(dt) {
    for (const s of this.singers) {
      s.glow = Math.max(0, s.glow - dt * 2.2);
      s.spot.material.opacity = 0.3 + s.glow * 0.6;
      s.spot.scale.setScalar(1 + s.glow * 0.25);
      s.pad.enabled = this.phase === 'play';
    }
    // During play, point at nothing — remembering the order is the game.
    this.guide = null;
  }

  dispose() {
    this.timers.forEach(clearTimeout);
    super.dispose();
  }

  hint() {
    if (this.phase === 'listen') return this.copy.listen;
    if (this.phase === 'play') return this.copy.yourTurn;
    return '';
  }

  snapshot() {
    return { len: this.seq?.length || this.level.start, best: this.best || 0, phase: this.phase, idx: this.idx || 0 };
  }
}
