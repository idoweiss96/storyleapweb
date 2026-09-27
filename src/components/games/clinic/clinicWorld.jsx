import React from 'react';
import * as THREE from 'three';
import { World, V } from '../../learning-games/world3d/engine';
import { inked } from '../../learning-games/world3d/models';
import { Carry, headPatch, station } from '../../learning-games/world3d/kit';
import { makeFloorRect, makeGround, makeTree } from '../../learning-games/world3d/props';
import { chime, hmm, speak, tap } from '../../learning-games/shared/sound';
import Icon from '../shared/art/Icon';
import { PATIENTS, TOOLS } from './clinicContent';

const SPOT = V(0, 0, 0.7); // where the patient stands to be treated
const BENCH = V(5.6, 0, 2.6); // waiting room
const EXIT = V(-9, 0, 3.2);
const PATCH = { bandage: 0xffe2c4, ice: 0xbfe8f7, ointment: 0xc9e9d2 };

export class ClinicWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [0, 0, 2.6],
        bounds: { minX: -6.6, maxX: 6.6, minZ: -2.6, maxZ: 4 },
        player: { apron: 0xffffff, hat: null },
        camera: { clampX: [-2.5, 2.5], narrowClampX: [-4.2, 4.2], clampZ: [-0.8, 0.4], offset: [0, 10.5, 9], narrowOffset: [0, 11.5, 9.5], narrowLead: 0.6 },
      },
    });
  }

  build() {
    makeGround(this.scene, { color: 0xa9dcb6 });
    const floor = makeFloorRect(15, 8.4, 0xe9f7ee, { outline: true });
    floor.position.set(0, 0, 0.6);
    this.scene.add(floor);
    const wall = inked(new THREE.BoxGeometry(15, 2.4, 0.3), 0xfdeff5, 0.03);
    wall.position.set(0, 1.2, -3.8);
    this.scene.add(wall);
    [-5.2, 5.2].forEach((x) => {
      const w = inked(new THREE.BoxGeometry(2, 1, 0.05), 0xcfeaf7, 0.03);
      w.position.set(x, 1.6, -3.62);
      this.scene.add(w);
    });
    // A red cross on the wall.
    const cross = new THREE.Group();
    [[0.8, 0.26], [0.26, 0.8]].forEach(([w, h]) => {
      const b = inked(new THREE.BoxGeometry(w, h, 0.06), 0xef6b6b, 0.02);
      cross.add(b);
    });
    cross.position.set(0, 1.75, -3.6);
    this.scene.add(cross);
    // Treatment bed and mat.
    const bed = inked(new THREE.BoxGeometry(2.4, 0.55, 1.1), 0xffffff, 0.04);
    bed.position.set(0, 0.28, -0.6);
    const pillow = inked(new THREE.BoxGeometry(0.6, 0.18, 0.8), 0xbfe8f7, 0.02);
    pillow.position.set(-0.85, 0.64, -0.6);
    const mat = new THREE.Mesh(new THREE.CircleGeometry(0.9, 32), new THREE.MeshToonMaterial({ color: 0xffd6ec }));
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(SPOT.x, 0.02, SPOT.z);
    this.scene.add(bed, pillow, mat);
    this.collide(V(0, 0, -0.6), 0.9);
    // Waiting-room benches and a plant.
    [2.1, 3.1].forEach((z) => {
      const bench = inked(new THREE.BoxGeometry(0.6, 0.4, 2.4), 0xd4a373, 0.03);
      bench.position.set(6.3, 0.2, z);
      this.scene.add(bench);
    });
    const tree = makeTree(0.8);
    tree.position.set(-6.4, 0, -2.8);
    this.scene.add(tree);

    // The tool cabinets along the back wall.
    const n = TOOLS.length;
    this.stations = TOOLS.map((tool, i) => {
      const pos = V(-((n - 1) * 1.5) / 2 + i * 1.5, 0, -2.0);
      return {
        tool,
        ...station(this, {
          pos,
          art: <Icon name={tool.id} size={120} />,
          text: tool[this.lang] || tool.he,
          color: i % 2 ? 0xffd6e8 : 0xdff1fb,
          onPick: () => this.pickTool(tool),
        }),
      };
    });
    this.carry = new Carry(this);
    // The doctor stands beside the patient, not in front: from the camera's
    // angle, in front would hide the patient completely.
    this.deliver = this.pad({ pos: V(SPOT.x + 1.45, 0, SPOT.z + 0.4), r: 0.7, color: 0xff6fb5, dwell: 0.15, onEnter: () => this.useTool() });

    // Everyone who comes today waits on the benches.
    this.queue = PATIENTS.map((pt, i) => {
      const npc = this.npc(pt.species, { at: V(BENCH.x + (i % 2) * 0.1, 0, BENCH.z - 1.6 + i * 0.75), face: -Math.PI / 2 });
      return { pt, npc, step: 0, patches: [] };
    });
    this.index = 0;
    this.phase = 'waiting'; // waiting | coming | treat | leaving | done
    this.line = '';
    this.wrong = false;
  }

  onStart() {
    this.callNext();
  }

  info(x) {
    return x[this.lang] || x.he;
  }

  setLine(text, say = true) {
    this.line = text;
    if (say) speak(text, this.lang, { rate: 0.95 });
    this.emit();
  }

  callNext() {
    const q = this.queue[this.index];
    if (!q) {
      this.finish();
      return;
    }
    this.phase = 'coming';
    this.line = '';
    q.npc.face = 0; // on arrival, turn to face the doctor and the camera
    q.npc.walk([V(3.2, 0, 2.6), SPOT], () => {
      this.phase = 'treat';
      const step = q.pt.steps[0];
      this.setLine(`${this.info(q.pt).problem}. ${this.info(step).ask}`);
    });
    this.emit();
  }

  pickTool(tool) {
    if (this.carry.what?.id === tool.id) return;
    tap();
    this.carry.set(tool, { art: <Icon name={tool.id} size={120} /> });
  }

  useTool() {
    const q = this.queue[this.index];
    const tool = this.carry.what;
    if (!q || this.phase !== 'treat' || !tool) return;
    const step = q.pt.steps[q.step];
    if (tool.id !== step.tool) {
      hmm();
      this.wrong = true;
      q.npc.mood = 'think';
      this.setLine(this.copy.notYet);
      return;
    }
    chime();
    this.wrong = false;
    this.carry.clear();
    this.burst(q.npc.pos.clone().setY(1.6), [0xffffff, 0xff9cc8, 0x9fddf5], 10);
    if (PATCH[tool.id]) q.patches.push(headPatch(q.npc.char, PATCH[tool.id], { x: 0.24 - q.patches.length * 0.2 }));
    q.step += 1;
    const next = q.pt.steps[q.step];
    if (next) {
      q.npc.mood = 'idle';
      this.setLine(`${this.info(step).done}. ${this.info(next).ask}`);
      return;
    }
    // All steps done: a happy farewell, then off through the door.
    this.phase = 'leaving';
    q.npc.mood = 'happy';
    this.setLine(this.info(q.pt).farewell);
    setTimeout(() => {
      if (this.disposed) return;
      q.npc.mood = 'idle';
      q.npc.walk([V(-2.5, 0, 2.8), EXIT], () => q.npc.remove());
      this.index += 1;
      setTimeout(() => !this.disposed && this.callNext(), 1200);
    }, 2200);
  }

  tick(dt, t) {
    this.carry.update(t);
    const q = this.queue[this.index];
    // After a wrong try, the arrow shows the right cabinet — help, not a penalty.
    if (this.phase === 'treat' && q) {
      const need = q.pt.steps[q.step]?.tool;
      if (this.carry.what?.id === need) this.guide = this.deliver.pos;
      else if (this.wrong) this.guide = this.stations.find((s) => s.tool.id === need)?.pos || null;
      else this.guide = this.carry.what ? this.deliver.pos : null;
    } else this.guide = null;
  }

  anchor(id) {
    if (id === 'patient') {
      const q = this.queue[this.index];
      return q ? q.npc.pos.clone().add(V(0, 2.4, 0)) : null;
    }
    return null;
  }

  hint() {
    if (this.phase !== 'treat') return '';
    return this.carry.what ? this.copy.bringTool : this.copy.pickTool;
  }

  snapshot() {
    return { line: this.line || '', index: this.index || 0, total: PATIENTS.length, phase: this.phase };
  }
}
