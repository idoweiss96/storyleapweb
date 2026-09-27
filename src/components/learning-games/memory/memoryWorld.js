import * as THREE from 'three';
import { World, V, shuffle } from '../world3d/engine';
import { makeCharacter } from '../world3d/models';
import { decorate, makeFloorRect, makeGiftBox, makeGround, makeTree } from '../world3d/props';
import { chime, hmm, speak, tone } from '../shared/sound';
import { BOX_COLORS, FACES } from './memoryContent';

const GAP_X = 2.6;
const GAP_Z = 2.9;

export class MemoryWorld extends World {
  constructor(opts) {
    const { cols, pairs } = opts.level;
    const rows = Math.ceil((pairs * 2) / cols);
    const halfW = ((cols - 1) * GAP_X) / 2;
    const depth = (rows - 1) * GAP_Z;
    super({
      ...opts,
      config: {
        start: [0, 0, depth / 2 + 1.6],
        bounds: { minX: -halfW - 1.6, maxX: halfW + 1.6, minZ: -depth / 2 - 0.4, maxZ: depth / 2 + 2.2 },
        camera: {
          clampX: [-halfW + 2, halfW - 2], narrowClampX: [-halfW + 1, halfW - 1],
          clampZ: [-depth / 2, depth / 2], offset: [0, 12.5, 9], narrowOffset: [0, 15, 9.5],
        },
      },
    });
  }

  build() {
    const { cols, pairs } = this.level;
    makeGround(this.scene);
    const rows = Math.ceil((pairs * 2) / cols);
    const halfW = ((cols - 1) * GAP_X) / 2;
    const depth = (rows - 1) * GAP_Z;
    const lawn = makeFloorRect(halfW * 2 + 4, depth + 4.4, 0xfff4e6, { outline: true });
    lawn.position.set(0, 0, 0.4);
    this.scene.add(lawn);
    decorate(this.scene, { minR: Math.max(halfW, depth) + 4, maxR: Math.max(halfW, depth) + 12, count: 50 });
    [[-halfW - 3, -depth / 2], [halfW + 3, -depth / 2], [-halfW - 3, depth / 2 + 1], [halfW + 3, depth / 2 + 1]].forEach(([x, z]) => {
      const t = makeTree(1.1);
      t.position.set(x, 0, z);
      this.scene.add(t);
      this.collide(V(x, 0, z), 0.5);
    });

    const faces = shuffle(FACES).slice(0, pairs);
    const deck = shuffle(faces.flatMap((f) => [f, f]));
    this.pairsFound = 0;
    this.open = [];
    this.busy = false;
    this.boxes = deck.map((face, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const pos = V(-halfW + c * GAP_X, 0, -depth / 2 + r * GAP_Z);
      const box = makeGiftBox(BOX_COLORS[i % BOX_COLORS.length], i % 2 ? 0xffffff : 0xfff3a0);
      box.position.copy(pos);
      this.scene.add(box);
      this.collide(pos, 0.75);
      const animal = makeCharacter(face.id);
      animal.root.position.set(pos.x, -1.4, pos.z);
      animal.root.scale.setScalar(0.85);
      animal.root.visible = false;
      this.scene.add(animal.root);
      const b = { face, pos, box, animal, state: 'closed', lift: -1.4 };
      b.pad = this.pad({
        pos: V(pos.x, 0, pos.z + 1.25),
        r: 0.62,
        color: 0xff6fb5,
        dwell: 0.2,
        onEnter: () => this.openBox(b),
      });
      return b;
    });
  }

  name(face) {
    return face[this.lang] || face.he;
  }

  // Open: the lid slides off and leans against the box, so the camera above
  // sees straight in. (Lifting it would hide the animal from this angle.)
  setLid(b, openIt) {
    const lid = b.box.userData.lid;
    const from = { x: lid.position.x, y: lid.position.y, r: lid.rotation.z };
    const to = openIt ? { x: 1.05, y: 0.55, r: -1.25 } : { x: 0, y: 1.08, r: 0 };
    this.animateValue(0.35, (k) => {
      lid.position.x = from.x + (to.x - from.x) * k;
      lid.position.y = from.y + (to.y - from.y) * k + Math.sin(k * Math.PI) * 0.5;
      lid.rotation.z = from.r + (to.r - from.r) * k;
    });
  }

  rise(b, up) {
    b.animal.root.visible = true;
    const from = b.lift;
    const to = up ? 0.95 : -1.4; // up = standing on top of the box
    this.animateValue(0.4, (k) => {
      b.lift = from + (to - from) * (up ? 1 - (1 - k) ** 3 : k * k);
    }, () => { if (!up) b.animal.root.visible = false; });
  }

  openBox(b) {
    if (this.busy || b.state !== 'closed' || this.open.length >= 2) return;
    b.state = 'open';
    this.open.push(b);
    this.setLid(b, true);
    this.rise(b, true);
    tone(523 + this.open.length * 130, { dur: 0.2 });
    speak(this.name(b.face), this.lang);
    this.pop(this.name(b.face), b.pos.clone().add(V(0, 2.6, 0)), 'small');
    if (this.open.length === 2) {
      this.busy = true;
      const [a, c] = this.open;
      if (a.face.id === c.face.id) {
        setTimeout(() => {
          if (this.disposed) return;
          [a, c].forEach((x) => { x.state = 'matched'; x.happy = 2.2; });
          this.burst(a.pos.clone().setY(1.8));
          this.burst(c.pos.clone().setY(1.8));
          chime();
          this.pairsFound += 1;
          this.say(this.copy.found.replace('{name}', this.name(a.face)), 2.2);
          this.open = [];
          this.busy = false;
          if (this.pairsFound === this.level.pairs) setTimeout(() => !this.disposed && this.finish(), 1400);
          this.emit();
        }, 500);
      } else {
        setTimeout(() => {
          if (this.disposed) return;
          hmm();
          this.say(this.copy.miss, 2.2);
          setTimeout(() => {
            if (this.disposed) return;
            [a, c].forEach((x) => { x.state = 'closed'; this.setLid(x, false); this.rise(x, false); });
            this.open = [];
            this.busy = false;
            this.emit();
          }, 1100);
        }, 450);
      }
    }
    this.emit();
  }

  tick(dt, t) {
    for (const b of this.boxes) {
      b.animal.root.position.y = b.lift;
      if (b.happy > 0) b.happy -= dt;
      const mood = b.state === 'matched' ? (b.happy > 0 ? 'happy' : 'idle') : b.state === 'open' ? 'idle' : 'idle';
      b.animal.animate(t + b.pos.x, dt, { mood });
      // Matched twins stay up on their open box, turning to wave at each other.
      if (b.state === 'matched') b.animal.root.rotation.y = Math.sin(t * 1.5 + b.pos.x) * 0.4;
      else b.animal.root.rotation.y = 0;
    }
  }

  hint() {
    if (this.open.length === 1) return this.copy.second.replace('{name}', this.name(this.open[0].face));
    return this.copy.first;
  }

  snapshot() {
    return { pairs: this.pairsFound || 0, total: this.level.pairs };
  }
}
