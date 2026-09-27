import * as THREE from 'three';
import { World, V, pick, shuffle } from '../world3d/engine';
import { basic, inked } from '../world3d/models';
import { decorate, makeFloorRect, makeGround, makeTree } from '../world3d/props';
import { chime, hmm, tap } from '../shared/sound';
import { orientations, puzzleBounds, sameOrientation, shapePoints, shapeSize } from './geometry';
import { PUZZLES } from './shapesContent';

const U = 1.3; // one puzzle unit in world units
const PRINT_Z = -1.8; // centre of the blueprint
const YARD_Z = 3.4;

/** A flat or extruded shape whose bounding box starts at its local (0,0). */
function shapeFrom(type, rot) {
  const pts = shapePoints(type, rot);
  // Puzzle y grows "down" = world +z. Shape y maps to world -z after the
  // rotation below, so it is negated here.
  return new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x * U, -y * U)));
}

function flatMesh(type, rot, color, opacity) {
  const m = new THREE.Mesh(new THREE.ShapeGeometry(shapeFrom(type, rot)), basic(color, { transparent: true, opacity, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

function outline(type, rot, color) {
  const pts = shapePoints(type, rot).map(([x, y]) => new THREE.Vector3(x * U, 0.03, y * U));
  pts.push(pts[0].clone());
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color, dashSize: 0.16, gapSize: 0.1 }));
  line.computeLineDistances();
  return line;
}

function blockMesh(type, rot, color) {
  const geo = new THREE.ExtrudeGeometry(shapeFrom(type, rot), { depth: 0.42, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 1 });
  const g = inked(geo, color, 0.04);
  g.rotation.x = -Math.PI / 2;
  return g;
}

export class SiteWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [0, 0, 1.3],
        bounds: { minX: -7, maxX: 7, minZ: -5.2, maxZ: 5 },
        player: { hat: 'helmet', apron: 0xff9f5a },
        camera: { clampX: [-1, 1], narrowClampX: [-3, 3], clampZ: [-1, 1.5], offset: [0, 12, 9.5], narrowOffset: [0, 15.5, 10.5] },
      },
    });
  }

  build() {
    makeGround(this.scene, { color: 0xb9e0b0 });
    const dirt = makeFloorRect(15, 11.5, 0xe8d3b4, { outline: true });
    dirt.position.set(0, 0, 0);
    this.scene.add(dirt);
    const yard = makeFloorRect(13, 2.8, 0xd9bf98);
    yard.position.set(0, 0.012, YARD_Z);
    this.scene.add(yard);
    decorate(this.scene, { minR: 10, maxR: 20, count: 45, avoid: (x, z) => Math.abs(x) < 8.5 && Math.abs(z) < 6.5 });
    // Fence posts and cones around the site.
    for (let x = -7.2; x <= 7.2; x += 1.8) {
      [-5.9, 5.9].forEach((z) => {
        const post = inked(new THREE.BoxGeometry(0.14, 0.7, 0.14), 0xffffff, 0.02);
        post.position.set(x, 0.35, z);
        this.scene.add(post);
      });
    }
    [[-6.5, -4.8], [6.5, -4.8], [6.5, 1]].forEach(([x, z]) => {
      const cone = inked(new THREE.ConeGeometry(0.28, 0.7, 14), 0xff9f5a, 0.03);
      cone.position.set(x, 0.35, z);
      this.scene.add(cone);
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.12, 14), basic(0xffffff));
      stripe.position.set(x, 0.35, z);
      this.scene.add(stripe);
    });
    [[-9, -3], [9, -3]].forEach(([x, z]) => {
      const t = makeTree(1.2);
      t.position.set(x, 0, z);
      this.scene.add(t);
    });
    this.boss = this.npc('bear', { at: V(-5.6, 0, -2.4), face: 0.5, hat: 'helmet' });

    this.pIndex = 0;
    this.loadPuzzle();
  }

  clearPuzzle() {
    (this.slotObjs || []).forEach((o) => this.scene.remove(o));
    (this.pieces || []).forEach((pc) => this.scene.remove(pc.obj));
    [...this.pads].forEach((pd) => this.removePad(pd));
  }

  loadPuzzle() {
    this.clearPuzzle();
    const id = this.level.puzzles[this.pIndex];
    this.puzzle = PUZZLES[id];
    const [W, H] = puzzleBounds(this.puzzle.slots);
    this.origin = V((-W * U) / 2, 0, PRINT_Z - (H * U) / 2);
    this.slotObjs = [];

    // Blueprint paper under the puzzle.
    const paper = makeFloorRect(W * U + 1.4, H * U + 1.4, 0xdcefff, { outline: true, y: 0.015 });
    paper.position.set(0, 0, PRINT_Z);
    this.scene.add(paper);
    this.slotObjs.push(paper);

    this.slots = this.puzzle.slots.map((s, si) => {
      const at = V(this.origin.x + s.x * U, 0.025, this.origin.z + s.y * U);
      const fill = flatMesh(s.type, s.rot, 0x4fc3e8, this.level.outlines ? 0.3 : 0.55);
      fill.position.copy(at);
      this.scene.add(fill);
      this.slotObjs.push(fill);
      if (this.level.outlines) {
        const line = outline(s.type, s.rot, 0x2e6fa8);
        line.position.copy(at);
        this.scene.add(line);
        this.slotObjs.push(line);
      }
      const pts = shapePoints(s.type, s.rot);
      const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const cz = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      const slot = { ...s, si, at, filled: false };
      slot.pad = this.pad({
        pos: V(at.x + cx * U, 0, at.z + cz * U),
        r: 0.55,
        color: 0x2e6fa8,
        visible: false,
        dwell: 0.2,
        onEnter: () => this.tryPlace(slot),
      });
      return slot;
    });

    // Pieces lie in the yard; some are turned the wrong way on harder levels.
    const xs = shuffle(this.puzzle.slots.map((_, i) => i));
    const spread = Math.min(2.2, 11 / this.puzzle.slots.length);
    this.pieces = this.puzzle.slots.map((s, i) => {
      let rot = s.rot;
      if (this.level.turned) {
        const others = orientations(s.type).filter((r) => !sameOrientation(s.type, r, s.rot));
        if (others.length && (i % 2 === 0 || this.puzzle.slots.length <= 3)) rot = pick(others);
      }
      const spot = V((xs[i] - (this.puzzle.slots.length - 1) / 2) * spread, 0, YARD_Z);
      const pc = { type: s.type, rot, color: s.color, spot, state: 'yard' };
      this.buildPiece(pc);
      this.placeInYard(pc);
      pc.pad = this.pad({ pos: spot, r: 0.6, color: 0xff9f5a, dwell: 0.2, onEnter: () => this.pickUp(pc) });
      return pc;
    });
    this.carried = null;
    this.emit();
  }

  buildPiece(pc) {
    if (pc.obj) this.scene.remove(pc.obj);
    pc.obj = new THREE.Group();
    pc.mesh = blockMesh(pc.type, pc.rot, pc.color);
    pc.obj.add(pc.mesh);
    this.scene.add(pc.obj);
  }

  placeInYard(pc) {
    const [w, h] = shapeSize(pc.type, pc.rot);
    pc.obj.scale.setScalar(0.8);
    pc.obj.position.set(pc.spot.x - (w * U * 0.8) / 2, 0.02, pc.spot.z - (h * U * 0.8) / 2);
  }

  pickUp(pc) {
    if (pc.state !== 'yard') return;
    if (this.carried) {
      // Swap: put the carried piece down where this one was.
      const old = this.carried;
      old.state = 'yard';
      old.spot = pc.spot.clone();
      old.pad.pos.copy(old.spot);
      old.pad.ring.position.set(old.spot.x, 0.02, old.spot.z);
      old.pad.enabled = true;
      old.pad.inside = true;
      this.placeInYard(old);
    }
    tap();
    pc.state = 'carried';
    pc.pad.enabled = false;
    this.carried = pc;
    this.emit();
  }

  /** The on-screen "Turn" button. */
  rotate() {
    const pc = this.carried;
    if (!pc) return;
    tap();
    pc.rot = (pc.rot + 1) % 4;
    this.buildPiece(pc);
    this.emit();
  }

  tryPlace(slot) {
    const pc = this.carried;
    if (!pc || slot.filled) return;
    if (pc.type !== slot.type) {
      hmm();
      this.say(this.copy.notHere, 2);
      return;
    }
    // Two identical slots are interchangeable; prefer one this piece fits as it is.
    let target = slot;
    if (!sameOrientation(slot.type, slot.rot, pc.rot)) {
      const alt = this.slots.find((s) => !s.filled && s.type === pc.type && sameOrientation(s.type, s.rot, pc.rot));
      if (!alt || Math.hypot(alt.pad.pos.x - slot.pad.pos.x, alt.pad.pos.z - slot.pad.pos.z) > 0.2) {
        hmm();
        this.say(this.copy.turnIt, 2);
        return;
      }
      target = alt;
    }
    target.filled = true;
    target.pad.enabled = false;
    this.carried = null;
    pc.state = 'placed';
    pc.obj.scale.setScalar(1);
    this.tween(pc.obj, target.at.clone().setY(0.03), { dur: 0.3, arc: 0.8, spin: false });
    chime();
    this.burst(target.pad.pos.clone().setY(0.8), [0x4fc3e8, 0xffffff, 0xf5c842], 10);
    this.say(this.copy.placed, 1.4);
    if (this.slots.every((s) => s.filled)) this.completed();
    this.emit();
  }

  completed() {
    const name = this.puzzle[this.lang] || this.puzzle.he;
    this.boss.mood = 'happy';
    this.burst(V(0, 2, PRINT_Z));
    this.say(this.copy.built.replace('{name}', name), 2.6);
    setTimeout(() => {
      if (this.disposed) return;
      this.boss.mood = 'idle';
      if (this.pIndex >= this.level.puzzles.length - 1) {
        this.finish();
        return;
      }
      this.pIndex += 1;
      this.loadPuzzle();
    }, 2600);
  }

  tick(dt, t) {
    const pc = this.carried;
    this.carrying = !!pc;
    if (pc) {
      const [w, h] = shapeSize(pc.type, pc.rot);
      // Carried small and high, like a sign held overhead, so the player
      // underneath stays visible from the camera above.
      const s = 0.48;
      pc.obj.scale.setScalar(s);
      pc.obj.position.set(this.p.x - (w * U * s) / 2, 2.9 + Math.sin(t * 4) * 0.05, this.p.z - (h * U * s) / 2 - 0.35);
    }
    this.slots.forEach((s) => { s.pad.enabled = !!pc && !s.filled; });
    // Guide: a piece to pick, or (on easy) the matching slot.
    if (!pc) {
      const next = this.pieces.find((x) => x.state === 'yard');
      this.guide = next ? next.spot : null;
    } else if (this.level.id === 'easy') {
      const sl = this.slots.find((s) => !s.filled && s.type === pc.type);
      this.guide = sl ? sl.pad.pos : null;
    } else this.guide = null;
  }

  hint() {
    return this.carried ? this.copy.carryHint : this.copy.pickHint;
  }

  snapshot() {
    return { carrying: !!this.carried, pIndex: this.pIndex || 0, total: this.level.puzzles.length, canTurn: this.level.turned && !!this.carried && orientations(this.carried.type).length > 1 };
  }
}
