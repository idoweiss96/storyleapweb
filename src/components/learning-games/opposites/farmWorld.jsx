import React from 'react';
import * as THREE from 'three';
import { World, V, pick } from '../world3d/engine';
import { inked } from '../world3d/models';
import { makeBillboard, setCard } from '../world3d/cards';
import { decorate, makeFloorRect, makeGround, makeTree } from '../world3d/props';
import Critter from '../../games/shared/art/Critter';
import LearnArt from '../shared/LearnArt';
import { chime, hmm } from '../shared/sound';
import { PAIRS, ROUNDS } from './oppositesContent';

/** The 2D drawing for each card, rendered onto 3D signs. */
function art(id) {
  switch (id) {
    case 'happy': return <Critter species="bear" expression="happy" size={120} />;
    case 'sad': return <Critter species="bear" expression="sad" size={120} />;
    case 'awake': return <Critter species="panda" expression="neutral" size={120} />;
    case 'asleep': return <Critter species="panda" expression="asleep" size={120} />;
    case 'big': return <Critter species="bunny" expression="happy" size={120} />;
    case 'small':
      return (
        <svg viewBox="0 0 120 120" width="120" height="120">
          <g transform="translate(38 56) scale(.38)"><Critter species="bunny" expression="happy" size={120} /></g>
        </svg>
      );
    case 'hot': return <LearnArt name="fire" size={120} />;
    case 'cold': return <LearnArt name="snow" size={120} />;
    default: return <LearnArt name={id} size={120} />;
  }
}

const DAY = { sky: new THREE.Color(0xcfeffc), hemi: 1.7, sun: 2.1 };
const NIGHT = { sky: new THREE.Color(0x2e2a6b), hemi: 0.75, sun: 0.55 };
const SIDE_X = 2.6; // both signs must fit a phone screen at once

function makeSignPost() {
  const g = new THREE.Group();
  const pole = inked(new THREE.CylinderGeometry(0.08, 0.08, 1.6, 8), 0xb98a63, 0.02);
  pole.position.y = 0.8;
  g.add(pole);
  return g;
}

export class FarmWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [0, 0, 2.4],
        bounds: { minX: -4.2, maxX: 4.2, minZ: -1.6, maxZ: 3.6 },
        camera: { clampX: [0, 0], narrowClampX: [0, 0], clampZ: [0, 0], offset: [0, 10.5, 10], narrowOffset: [0, 14.5, 12.5] },
      },
    });
  }

  build() {
    makeGround(this.scene, { color: 0xa9dcb6 });
    const yard = makeFloorRect(12.5, 6.8, 0xf1e3c8, { outline: true });
    yard.position.set(0, 0, 1);
    this.scene.add(yard);
    decorate(this.scene, { minR: 9, maxR: 20, count: 50, avoid: (x, z) => Math.abs(x) < 7.5 && z > -7 && z < 5 });
    // Barn behind the host.
    const barn = inked(new THREE.BoxGeometry(4.2, 2.4, 2.2), 0xe4577e, 0.04);
    barn.position.set(0, 1.2, -5.2);
    const roof = inked(new THREE.ConeGeometry(3.2, 1.4, 4), 0x9e3a5a, 0.04);
    roof.position.set(0, 3.1, -5.2);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1, 1, 0.6);
    const door = inked(new THREE.BoxGeometry(1.2, 1.5, 0.08), 0xffffff, 0.02);
    door.position.set(0, 0.75, -4.08);
    this.scene.add(barn, roof, door);
    [[-7, -3], [7, -3], [-8, 2.5], [8, 2.5]].forEach(([x, z]) => {
      const t = makeTree(1.2);
      t.position.set(x, 0, z);
      this.scene.add(t);
    });
    // Stars that only show at night.
    this.stars = new THREE.Group();
    for (let i = 0; i < 40; i += 1) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), new THREE.MeshBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0 }));
      s.position.set((Math.random() - 0.5) * 40, 8 + Math.random() * 6, -12 - Math.random() * 10);
      this.stars.add(s);
    }
    this.scene.add(this.stars);

    this.host = this.npc('topi', { at: V(0, 0, -2.7), face: 0 });
    this.card = makeBillboard({ text: '' }, 2.2, 2.2);
    this.card.position.set(0, 3.5, -2.7);
    this.scene.add(this.card);

    this.options = [-1, 1].map((side) => {
      const post = makeSignPost();
      post.position.set(side * SIDE_X, 0, -0.9);
      this.scene.add(post);
      const sign = makeBillboard({ text: '' }, 1.7, 1.7);
      sign.position.set(side * SIDE_X, 2.35, -0.9);
      this.scene.add(sign);
      const opt = { side, sign, id: null };
      opt.pad = this.pad({ pos: V(side * SIDE_X, 0, 0.4), r: 1.05, color: 0xff6fb5, onEnter: () => this.choose(opt) });
      return opt;
    });
    this.readyPad = this.pad({ pos: V(0, 0, 2.3), r: 0.9, color: 0xf5c842, onEnter: () => this.ready() });

    this.round = 0;
    this.phase = 'ready';
    this.night = 0;
    this.nightTarget = 0;
  }

  onStart() {
    // Start standing on the middle circle: the first card comes straight away.
    this.readyPad.inside = true;
    this.deal();
  }

  ready() {
    if (this.phase === 'ready') this.deal();
  }

  deal() {
    const lv = this.level;
    let pair;
    let side;
    do {
      pair = pick(PAIRS);
      side = Math.random() < 0.5 ? 'a' : 'b';
    } while (this.cur && pair[side] === this.cur.shown);
    const shown = pair[side];
    const other = side === 'a' ? pair.b : pair.a;
    const rule = lv.rule === 'mix' ? (Math.random() < 0.5 ? 'same' : 'opp') : lv.rule;
    this.cur = { pair, shown, other, rule, answer: rule === 'same' ? shown : other };
    const frame = lv.rule === 'mix' ? (rule === 'same' ? '#5BC98C' : '#A78BFA') : '#3A3357';
    setCard(this.card, { art: art(shown), bg: '#ffffff', border: frame });
    const order = Math.random() < 0.5 ? [shown, other] : [other, shown];
    this.options.forEach((o, i) => {
      o.id = order[i];
      const names = pair[this.lang] || pair.he;
      setCard(o.sign, { art: art(o.id), text: o.id === pair.a ? names[0] : names[1], bg: '#ffffff' });
      o.pad.inside = false;
    });
    this.nightTarget = rule === 'opp' ? 1 : 0;
    this.phase = 'choose';
    this.host.mood = 'idle';
    this.emit();
  }

  choose(opt) {
    if (this.phase !== 'choose') return;
    if (opt.id !== this.cur.answer) {
      hmm();
      this.say(this.cur.rule === 'opp' ? this.copy.oopsOpp : this.copy.oopsSame, 2.6);
      this.host.mood = 'think';
      return;
    }
    chime();
    this.burst(opt.sign.position.clone());
    this.host.mood = 'happy';
    this.say(this.copy.good, 1.2);
    this.round += 1;
    this.phase = 'ready';
    setCard(this.card, { text: '?', bg: '#FFF8EC' });
    if (this.round >= ROUNDS) setTimeout(() => !this.disposed && this.finish(), 900);
    this.emit();
  }

  tick(dt) {
    // Day and night fade into each other.
    this.night += (this.nightTarget - this.night) * Math.min(1, dt * 3);
    this.scene.background.copy(DAY.sky).lerp(NIGHT.sky, this.night);
    this.scene.fog.color.copy(this.scene.background);
    this.hemi.intensity = DAY.hemi + (NIGHT.hemi - DAY.hemi) * this.night;
    this.sun.intensity = DAY.sun + (NIGHT.sun - DAY.sun) * this.night;
    this.stars.children.forEach((s) => { s.material.opacity = this.night; });
    this.card.position.y = 3.5 + Math.sin(this.time * 2) * 0.06;
    this.guide = this.phase === 'ready' ? this.readyPad.pos : null;
  }

  hint() {
    if (this.phase === 'ready') return this.copy.ready;
    return this.cur?.rule === 'opp' ? this.copy.ruleOpp : this.copy.ruleSame;
  }

  snapshot() {
    return { round: this.round || 0 };
  }
}
