import React from 'react';
import * as THREE from 'three';
import { World, V } from '../../learning-games/world3d/engine';
import { basic } from '../../learning-games/world3d/models';
import { makeBillboard } from '../../learning-games/world3d/cards';
import { decorate, makeFloorRect, makeGround, makeTree } from '../../learning-games/world3d/props';
import { speak, tone } from '../../learning-games/shared/sound';
import Icon from '../shared/art/Icon';
import { ACTIONS } from './actionsContent';

const DUR = 2.6; // seconds each verb is acted out

/**
 * Topi acts out a verb in 3D. Each action is a pose applied on top of the
 * character's normal animation, plus (sometimes) a prop drawn from the
 * site's Icon set.
 */
export class ActionsWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [0, 0, 0.4],
        bounds: { minX: -5, maxX: 5, minZ: -2.5, maxZ: 2.8 },
        player: { species: 'topi', apron: null, hat: null },
        camera: { clampX: [-1, 1], narrowClampX: [-2, 2], clampZ: [0, 0.6], offset: [0, 6.5, 8.5], narrowOffset: [0, 7.5, 9.5], lead: 0.2, narrowLead: 0.4, fov: 36, narrowFov: 46 },
      },
    });
  }

  build() {
    makeGround(this.scene, { color: 0xa9dcb6 });
    const sand = makeFloorRect(11, 6.4, 0xfbe7c6, { outline: true });
    sand.position.set(0, 0, 0.2);
    this.scene.add(sand);
    decorate(this.scene, { minR: 7, maxR: 18, count: 55, avoid: (x, z) => Math.abs(x) < 6 && z > -4 && z < 4 });
    [[-5.8, -2.6], [5.8, -2.6], [-6.4, 2], [6.4, 2]].forEach(([x, z]) => {
      const t = makeTree(1.25);
      t.position.set(x, 0, z);
      this.scene.add(t);
    });
    this.prop = makeBillboard({ text: '' }, 0.7, 0.7);
    this.prop.visible = false;
    this.scene.add(this.prop);
    this.action = null;
    this.actT = 0;
  }

  /** Called by the verb buttons. */
  act(id) {
    const a = ACTIONS.find((x) => x.id === id);
    if (!a || !this.running) return;
    this.action = a;
    this.actT = 0;
    this.frozen = a.id !== 'run';
    this.base = this.p.clone();
    const words = a[this.lang] || a.he;
    this.say(words.line, DUR + 0.4);
    speak(words.verb, this.lang, { rate: 0.9 });
    this.pop(words.verb, this.p.clone().add(V(0, 2.9, 0)));
    if (a.prop) {
      this.prop.material.map?.dispose();
      this.prop.material.map = null;
      this.scene.remove(this.prop);
      this.prop = makeBillboard({ art: <Icon name={a.prop} size={120} />, bg: null, border: null }, 0.75, 0.75);
      this.scene.add(this.prop);
      this.prop.visible = true;
    } else this.prop.visible = false;
    this.emit();
  }

  tick(dt, t) {
    const a = this.action;
    const pl = this.player;
    const [armL, armR] = pl.handAnchor;
    // Reset anything a previous action bent.
    pl.root.rotation.z = 0;
    pl.head.rotation.x = 0;
    if (!a) return;
    this.actT += dt;
    const k = this.actT;
    const p = this.p;
    const face = new THREE.Vector3(Math.sin(pl.root.rotation.y), 0, Math.cos(pl.root.rotation.y));
    const at = (fwd, up) => p.clone().addScaledVector(face, fwd).add(V(0, up, 0));
    switch (a.id) {
      case 'jump':
        p.y = Math.abs(Math.sin(k * 5)) * 1.1;
        armL.rotation.z = -2.6; armR.rotation.z = 2.6;
        break;
      case 'eat': case 'drink':
        this.prop.position.copy(at(0.45, 1.25));
        armR.rotation.x = -2.2;
        pl.head.rotation.x = a.id === 'drink' ? -0.35 : Math.sin(k * 12) * 0.12;
        break;
      case 'sleep':
        pl.root.rotation.z = Math.min(1, k * 2) * (Math.PI / 2);
        p.y = Math.min(1, k * 2) * 0.35;
        this.prop.position.copy(p.clone().add(V(0.4, 1.4 + (k % 1.2), 0)));
        break;
      case 'run': {
        const ang = k * 3.2;
        p.x = this.base.x + Math.sin(ang) * 1.4;
        p.z = this.base.z + (1 - Math.cos(ang)) * 1.0;
        pl.root.rotation.y = ang + Math.PI / 2;
        pl.animate(t, 0, { moving: true });
        if (this.prop.visible) this.prop.position.copy(at(-0.6, 1));
        break;
      }
      case 'dance':
        pl.root.rotation.y += dt * 6;
        p.y = Math.abs(Math.sin(k * 7)) * 0.35;
        armL.rotation.z = -2.2 + Math.sin(k * 7) * 0.5; armR.rotation.z = 2.2 - Math.sin(k * 7) * 0.5;
        this.prop.position.copy(p.clone().add(V(0.6, 2.2 + Math.sin(k * 3) * 0.2, 0)));
        if (Math.floor(k * 3) !== Math.floor((k - dt) * 3)) tone(523 + (Math.floor(k * 3) % 4) * 131, { dur: 0.15, type: 'triangle', gain: 0.08 });
        break;
      case 'wash': case 'brush':
        this.prop.position.copy(at(0.45, a.id === 'brush' ? 1.3 : 0.9 + Math.sin(k * 10) * 0.2));
        armR.rotation.x = -1.8 + Math.sin(k * 16) * 0.35;
        if (a.id === 'wash' && Math.random() < 0.15) this.burst(p.clone().add(V((Math.random() - 0.5) * 0.8, 1.2, 0)), [0xffffff, 0xdff1fb], 3);
        break;
      case 'read':
        this.prop.position.copy(at(0.55, 1.05));
        armL.rotation.x = -1.3; armR.rotation.x = -1.3;
        pl.head.rotation.x = 0.3;
        break;
      case 'sing':
        this.prop.position.copy(at(0.45, 1.25));
        armR.rotation.x = -2.0;
        pl.head.rotation.x = -0.15 + Math.sin(k * 6) * 0.08;
        if (Math.floor(k * 2.5) !== Math.floor((k - dt) * 2.5)) this.pop('♪', p.clone().add(V(0.5, 2.4, 0)), 'small');
        break;
      case 'laugh':
        pl.root.rotation.z = Math.sin(k * 18) * 0.08;
        p.y = Math.abs(Math.sin(k * 9)) * 0.12;
        break;
      case 'cry':
        pl.head.rotation.x = 0.25;
        this.prop.position.copy(p.clone().add(V(0.25, 1.45 - (k % 0.8) * 0.8, 0.35)));
        break;
      case 'wave':
        armR.rotation.z = 2.5 + Math.sin(k * 10) * 0.35;
        if (this.prop.visible) this.prop.position.copy(p.clone().add(V(0.7, 2.1, 0)));
        break;
      case 'hug':
        this.prop.position.copy(at(0.4, 0.95));
        armL.rotation.x = -1.2; armR.rotation.x = -1.2;
        armL.rotation.z = 0.5; armR.rotation.z = -0.5;
        pl.root.scale.setScalar(1 + Math.sin(k * 4) * 0.03);
        break;
      default:
        break;
    }
    if (k > DUR) {
      this.action = null;
      this.frozen = false;
      p.y = 0;
      pl.root.scale.setScalar(1);
      this.prop.visible = false;
      this.emit();
    }
  }

  hint() {
    return this.copy.idle;
  }

  snapshot() {
    return { acting: this.action?.id || null };
  }
}
