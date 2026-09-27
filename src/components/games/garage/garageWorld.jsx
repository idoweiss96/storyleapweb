import React from 'react';
import * as THREE from 'three';
import { World, V } from '../../learning-games/world3d/engine';
import { basic, inked, toon } from '../../learning-games/world3d/models';
import { makeBillboard } from '../../learning-games/world3d/cards';
import { Carry, station } from '../../learning-games/world3d/kit';
import { makeFloorRect, makeGround, smokePuff } from '../../learning-games/world3d/props';
import { chime, hmm, speak, tap, tone } from '../../learning-games/shared/sound';
import Icon from '../shared/art/Icon';
import { CARS, COLORS, FAULTS, TOOLS } from './garageContent';

const LIFT = V(-0.6, 0, -0.2); // where the car parks
const FIX = V(1.7, 0, 0.6); // where the mechanic stands to use a tool
const hex = (s) => parseInt(s.replace('#', ''), 16);

/** A chunky toy car. userData holds the parts that faults change. */
function makeCar(color) {
  const g = new THREE.Group();
  const body = inked(new THREE.BoxGeometry(2.4, 0.55, 1.2), hex(color), 0.045);
  body.position.y = 0.6;
  const cabin = inked(new THREE.BoxGeometry(1.3, 0.5, 1.05), hex(color), 0.04);
  cabin.position.set(-0.15, 1.1, 0);
  const glass = inked(new THREE.BoxGeometry(1.34, 0.32, 1.08), 0xcfeaf7, 0);
  glass.position.set(-0.15, 1.13, 0);
  g.add(body, cabin, glass);
  const wheels = [[-0.75, -0.62], [0.75, -0.62], [-0.75, 0.62], [0.75, 0.62]].map(([x, z]) => {
    const w = inked(new THREE.CylinderGeometry(0.3, 0.3, 0.22, 18), 0x3a3357, 0.02);
    w.rotation.x = Math.PI / 2;
    w.position.set(x, 0.3, z);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 12), toon(0xc7cdd6));
    hub.rotation.x = Math.PI / 2;
    hub.position.copy(w.position);
    g.add(w, hub);
    return w;
  });
  const lights = [-0.35, 0.35].map((z) => {
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), basic(0xfff3a0));
    l.position.set(1.21, 0.66, z);
    g.add(l);
    return l;
  });
  // Mud spots (shown while the car is dirty).
  const mud = new THREE.Group();
  [[0.6, 0.62, 0.61, 0.16], [-0.5, 0.5, 0.61, 0.12], [0.1, 0.72, 0.61, 0.1], [-0.2, 1.15, 0.53, 0.1], [0.8, 0.5, -0.61, 0.14]].forEach(([x, y, z, r]) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 12), basic(0x8b5e3c));
    m.position.set(x, y, z);
    if (z < 0) m.rotation.y = Math.PI;
    mud.add(m);
  });
  g.add(mud);
  g.userData = { body, cabin, wheels, lights, mud, color };
  return g;
}

function paint(car, color) {
  const c = hex(color);
  [car.userData.body, car.userData.cabin].forEach((part) => { part.children[0].material = toon(c); });
  car.userData.color = color;
}

export class GarageWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [2.2, 0, 1.8],
        bounds: { minX: -5.8, maxX: 5.8, minZ: -2.3, maxZ: 3.4 },
        player: { apron: 0x4f6fd8, hat: 'cap' },
        camera: { clampX: [-1, 1], narrowClampX: [-3, 3], clampZ: [-0.2, 0.6], offset: [0, 11, 9.5], narrowOffset: [0, 12.5, 10.5], narrowLead: 0.8 },
      },
    });
  }

  build() {
    makeGround(this.scene, { color: 0xa9dcb6 });
    const floor = makeFloorRect(13, 7.6, 0xd6dde4, { outline: true });
    floor.position.set(0, 0, 0.5);
    this.scene.add(floor);
    const wall = inked(new THREE.BoxGeometry(13, 2.6, 0.3), 0xe8f6fc, 0.03);
    wall.position.set(0, 1.3, -3.4);
    this.scene.add(wall);
    const lift = makeFloorRect(3.4, 2.2, 0xf5c842, { y: 0.015 });
    lift.position.set(LIFT.x, 0, LIFT.z);
    this.scene.add(lift);
    // Tyre stack and an oil drum for atmosphere.
    [0, 0.28, 0.56].forEach((y) => {
      const t = inked(new THREE.TorusGeometry(0.4, 0.16, 10, 20), 0x3a4250, 0.02);
      t.rotation.x = Math.PI / 2;
      t.position.set(-5.2, 0.16 + y, -2.4);
      this.scene.add(t);
    });
    const drum = inked(new THREE.CylinderGeometry(0.4, 0.4, 1, 16), 0xef6b6b, 0.03);
    drum.position.set(5.2, 0.5, -2.4);
    this.scene.add(drum);

    this.tools = TOOLS.map((tool, i) => ({
      tool,
      ...station(this, {
        pos: V(-2.4 + i * 1.6, 0, -2.2),
        art: <Icon name={tool.id} size={120} />,
        text: tool[this.lang] || tool.he,
        color: 0xc7cdd6,
        back: 0.95,
        onPick: () => this.pickTool(tool),
      }),
    }));
    this.carry = new Carry(this);
    this.fixPad = this.pad({ pos: FIX, r: 0.7, color: 0xff6fb5, dwell: 0.15, onEnter: () => this.useTool() });

    // Paint pads in a row at the front.
    this.paints = COLORS.map((c, i) => {
      const pos = V(-4.3 + i * 1.22, 0, 2.7);
      const pad = this.pad({ pos, r: 0.52, color: hex(c.value), dwell: 0.15, enabled: false, onEnter: () => this.paintCar(c) });
      pad.ring.userData.fill.material.opacity = 0.9;
      return { c, pad };
    });

    this.index = 0;
    this.phase = 'arriving';
    this.line = '';
  }

  onStart() {
    this.bringCar();
  }

  info(x) {
    return x[this.lang] || x.he;
  }

  bringCar() {
    const spec = CARS[this.index];
    if (!spec) {
      this.finish();
      return;
    }
    this.spec = spec;
    this.faults = new Set(spec.faults);
    const car = makeCar(spec.color);
    car.position.set(-12, 0, LIFT.z);
    this.scene.add(car);
    this.car = car;
    if (!this.faults.has('dirty')) car.userData.mud.visible = false;
    if (this.faults.has('flat')) {
      const w = car.userData.wheels[1];
      w.scale.set(1, 1, 1);
      w.position.y = 0.2;
      w.scale.set(1.15, 1, 0.62);
    }
    if (this.faults.has('light')) car.userData.lights.forEach((l) => { l.material = basic(0x5b5578); });
    this.gauge = this.faults.has('fuel') ? makeBillboard({ art: <Icon name="fuel" size={120} />, text: 'E', bg: '#FFE3E3', border: '#EF6B6B', textColor: '#C0392B' }, 0.8, 0.8) : null;
    if (this.gauge) this.scene.add(this.gauge);
    this.driver = this.npc(spec.driver, { at: V(-11, 0, 1.4), face: Math.PI / 2 });
    this.phase = 'arriving';
    this.animateValue(2, (k) => { car.position.x = -12 + (LIFT.x + 12) * (1 - (1 - k) ** 3); }, () => {
      this.phase = 'fix';
      this.line = this.info(spec).line;
      speak(this.line, this.lang, { rate: 0.95 });
      this.emit();
    });
    this.driver.face = 0;
    this.driver.walk([V(-3.4, 0, 1.4)]);
    this.emit();
  }

  pickTool(tool) {
    if (this.phase !== 'fix') return;
    tap();
    this.carry.set(tool, { art: <Icon name={tool.id} size={120} /> });
  }

  useTool() {
    const tool = this.carry.what;
    if (this.phase !== 'fix' || !tool) return;
    const fault = [...this.faults].find((f) => FAULTS[f].tool === tool.id);
    if (!fault) {
      hmm();
      this.line = this.copy.notThis;
      this.emit();
      return;
    }
    chime();
    this.faults.delete(fault);
    this.carry.clear();
    const car = this.car;
    this.burst(car.position.clone().add(V(0, 1.2, 0)), [0xffffff, 0x9fddf5, 0xf5c842], 12);
    if (fault === 'dirty') car.userData.mud.visible = false;
    if (fault === 'flat') {
      const w = car.userData.wheels[1];
      w.scale.set(1, 1, 1);
      w.position.y = 0.3;
    }
    if (fault === 'light') car.userData.lights.forEach((l) => { l.material = basic(0xfff3a0); });
    if (fault === 'fuel' && this.gauge) {
      this.scene.remove(this.gauge);
      this.gauge = null;
    }
    if (this.faults.size === 0) {
      this.phase = 'paint';
      this.line = this.copy.allFixed;
      this.paints.forEach((p) => { p.pad.enabled = true; });
    } else {
      this.line = this.faultText();
    }
    this.emit();
  }

  faultText() {
    return [...this.faults].map((f) => this.info(FAULTS[f])).join(' · ');
  }

  paintCar(c) {
    if (this.phase !== 'paint') return;
    tone(440 + COLORS.indexOf(c) * 60, { dur: 0.15, type: 'sine' });
    paint(this.car, c.value);
    this.burst(this.car.position.clone().add(V(0, 1.4, 0)), [hex(c.value), 0xffffff], 10);
    this.painted = true;
    this.emit();
  }

  /** The on-screen "Drive!" button once the car is fixed. */
  drive() {
    if (this.phase !== 'paint') return;
    this.phase = 'leaving';
    this.paints.forEach((p) => { p.pad.enabled = false; });
    this.driver.remove();
    chime();
    const car = this.car;
    this.line = '';
    this.animateValue(2.2, (k) => {
      car.position.x = LIFT.x + k * k * 16;
      if (Math.random() < 0.3) smokePuff(this, car.position.clone().add(V(-1.3, 0.4, 0)));
    }, () => {
      this.scene.remove(car);
      this.index += 1;
      this.painted = false;
      this.bringCar();
    });
    this.emit();
  }

  tick(dt, t) {
    this.carry.update(t);
    if (this.gauge && this.car) this.gauge.position.set(this.car.position.x + 1.2, 2.2 + Math.sin(t * 3) * 0.08, this.car.position.z);
    this.car?.userData.wheels.forEach((w) => { if (this.phase === 'arriving' || this.phase === 'leaving') w.rotation.y += dt * 12; });
    this.guide = this.phase === 'fix' && this.carry.what ? this.fixPad.pos : null;
  }

  anchor(id) {
    if (id === 'driver' && this.driver && this.phase !== 'leaving') return this.driver.pos.clone().add(V(0, 2.4, 0));
    return null;
  }

  hint() {
    if (this.phase === 'fix') return this.carry.what ? this.copy.bringTool : this.copy.pickTool;
    if (this.phase === 'paint') return this.copy.paintHint;
    return '';
  }

  snapshot() {
    return {
      line: this.line || '', phase: this.phase, index: this.index || 0, total: CARS.length,
      faults: [...(this.faults || [])], painted: !!this.painted,
    };
  }
}
