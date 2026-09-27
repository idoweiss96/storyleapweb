import React from 'react';
import * as THREE from 'three';
import { World, V, shuffle } from '../world3d/engine';
import { basic } from '../world3d/models';
import { makeBillboard, setCard } from '../world3d/cards';
import { decorate, makeDrum, makeFloorRect, makeGround, makeStage, makeTree } from '../world3d/props';
import Critter from '../../games/shared/art/Critter';
import Icon from '../../games/shared/art/Icon';
import { chime, drum, hmm, speak } from '../shared/sound';
import { ROUNDS, WORDS } from './syllablesContent';

const DRUM = V(1.3, 0, -1.2);
const HOST = V(-2.2, 0, -2.4); // close enough to the drum that both fit a phone screen

function picture(pic) {
  if (pic.critter) return <Critter species={pic.critter} expression="happy" size={120} />;
  return <Icon name={pic.icon} size={120} />;
}

function makeSet(level, lang) {
  const pool = WORDS.filter((w) => (w[lang] || w.he).length <= level.max);
  const weighted = level.max > 3 ? [...pool, ...pool.filter((w) => (w[lang] || w.he).length >= 3)] : pool;
  const seen = new Set();
  return shuffle(weighted).filter((w) => (seen.has(w.id) ? false : seen.add(w.id))).slice(0, ROUNDS);
}

export class ParadeWorld extends World {
  constructor(opts) {
    super({
      ...opts,
      config: {
        start: [0.8, 0, 2.2],
        bounds: { minX: -5.6, maxX: 5.6, minZ: -1.6, maxZ: 3.4 },
        camera: { clampX: [-0.5, 0], narrowClampX: [-0.5, 0], clampZ: [-0.6, -0.6], offset: [0, 10.5, 10], narrowOffset: [0, 14, 12] },
      },
    });
  }

  build() {
    makeGround(this.scene, { color: 0xa9dcb6 });
    const plaza = makeFloorRect(13, 7.4, 0xfbe7d2, { outline: true });
    plaza.position.set(0, 0, 0.6);
    this.scene.add(plaza);
    const stage = makeStage(12, 2.6);
    stage.position.set(0, 0, -4.4);
    this.scene.add(stage);
    decorate(this.scene, { minR: 9, maxR: 20, count: 50, avoid: (x, z) => Math.abs(x) < 7.5 && z > -7 && z < 5 });
    [[-7.8, 3], [7.8, 3], [-7.5, -3], [7.5, -3]].forEach(([x, z]) => {
      const t = makeTree(1.2);
      t.position.set(x, 0, z);
      this.scene.add(t);
    });
    // Bunting over the plaza.
    for (let i = 0; i < 14; i += 1) {
      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 3), basic([0xff6fb5, 0x4fc3e8, 0xf5c842, 0x5bc98c][i % 4]));
      flag.rotation.x = Math.PI;
      flag.position.set(-6.2 + i * 0.95, 3.5 - Math.sin((i / 13) * Math.PI) * 0.4, -3);
      this.scene.add(flag);
    }

    this.bigDrum = makeDrum(1.25);
    this.bigDrum.position.copy(DRUM);
    this.scene.add(this.bigDrum);
    this.host = this.npc('fox', { at: HOST, face: 0.4 });
    this.card = makeBillboard({ text: '' }, 2.2, 2.2);
    this.card.position.set(HOST.x, 3.5, HOST.z);
    this.scene.add(this.card);
    // Two more band members for atmosphere.
    [['bear', 3.8], ['panda', 5.0]].forEach(([sp, x]) => {
      const n = this.npc(sp, { at: V(x, 0.3, -4.2), face: 0 });
      n.lift = 0.3;
    });

    this.words = makeSet(this.level, this.lang);
    this.n = 0;
    this.beats = 0;
    this.phase = 'drum'; // drum | teach | next
    this.onDrum = false;
    this.beads = [];
    this.drumPad = this.pad({
      pos: DRUM.clone(), r: 0.95, color: 0xff6fb5,
      onEnter: () => { this.onDrum = true; this.emit(); },
      onLeave: () => { this.onDrum = false; this.emit(); },
    });
    this.reportPad = this.pad({ pos: V(HOST.x, 0, HOST.z + 1.7), r: 0.9, color: 0x5bc98c, dwell: 0.15, onEnter: () => this.report() });
    this.showWord();
  }

  get word() {
    return this.words[this.n];
  }

  parts() {
    return this.word ? this.word[this.lang] || this.word.he : [];
  }

  showWord() {
    const w = this.word;
    if (!w) return;
    setCard(this.card, { art: picture(w.pic), text: this.parts().join(''), bg: '#ffffff' });
    this.clearBeads();
    this.beats = 0;
    this.phase = 'drum';
    this.result = null;
    this.emit();
  }

  sayWord() {
    speak(this.parts().join(''), this.lang, { rate: 0.7 });
  }

  clearBeads() {
    this.beads.forEach((b) => this.scene.remove(b));
    this.beads = [];
  }

  /** The on-screen "Jump!" button, while standing on the drum. */
  hit() {
    if (this.phase !== 'drum' || !this.onDrum || this.beats >= 6) return;
    this.beats += 1;
    drum();
    this.jumpT = 0.32;
    const skin = this.bigDrum.userData.skin;
    this.animateValue(0.18, (k) => { skin.scale.y = 1 - Math.sin(k * Math.PI) * 0.6; this.bigDrum.scale.y = 1.25 * (1 - Math.sin(k * Math.PI) * 0.08); });
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), basic([0xff6fb5, 0x4fc3e8, 0xf5c842, 0x5bc98c, 0xa78bfa, 0xff9f5a][this.beats - 1]));
    bead.position.set(DRUM.x - 1.25 + this.beats * 0.42, 3.4, DRUM.z - 0.4);
    this.scene.add(bead);
    this.beads.push(bead);
    this.pop(String(this.beats), DRUM.clone().add(V(0, 3.9, 0)));
    this.emit();
  }

  resetBeats() {
    this.beats = 0;
    this.clearBeads();
    this.emit();
  }

  report() {
    if (this.phase !== 'drum' || this.beats === 0) return;
    const parts = this.parts();
    const ok = this.beats === parts.length;
    this.phase = 'teach';
    this.result = ok ? 'right' : 'together';
    if (ok) {
      chime();
      this.host.mood = 'happy';
      this.say(parts.length === 1 ? this.copy.rightOne : this.copy.right.replace('{n}', parts.length), 2.6);
      this.burst(this.card.position.clone());
    } else {
      hmm();
      this.say(this.copy.together, 3);
    }
    // The fox drums the word together with the child, one jump per part.
    this.teachAt = -1;
    parts.forEach((_, i) => setTimeout(() => {
      if (this.disposed) return;
      this.teachAt = i;
      this.host.jumpT = 0.3;
      drum();
      this.emit();
    }, 600 + i * 650));
    setTimeout(() => {
      if (this.disposed) return;
      this.host.mood = 'idle';
      this.teachAt = -1;
      this.n += 1;
      if (this.n >= this.words.length) {
        this.finish();
        return;
      }
      this.showWord();
    }, 900 + parts.length * 650 + 900);
    this.emit();
  }

  tick(dt, t) {
    // The player's jump on the drum.
    this.jumpT = Math.max(0, (this.jumpT || 0) - dt);
    // Standing on the drum = standing on its skin, a step up.
    const onTop = Math.hypot(this.p.x - DRUM.x, this.p.z - DRUM.z) < 0.95;
    const base = onTop ? 1.03 : 0;
    this.p.y = base + Math.sin(((0.32 - this.jumpT) / 0.32) * Math.PI) * 0.7 * (this.jumpT > 0 ? 1 : 0);
    this.playerMood = this.jumpT > 0 ? 'happy' : 'idle';
    this.host.jumpT = Math.max(0, (this.host.jumpT || 0) - dt);
    this.host.lift = this.host.jumpT > 0 ? Math.sin(((0.3 - this.host.jumpT) / 0.3) * Math.PI) * 0.6 : 0;
    this.beads.forEach((b, i) => { b.position.y = 3.4 + Math.sin(t * 4 + i) * 0.06; });
    this.card.position.y = 3.5 + Math.sin(t * 2) * 0.05;
    this.guide = this.phase !== 'drum' ? null : this.beats > 0 && !this.onDrum ? this.reportPad.pos : !this.onDrum ? this.drumPad.pos : null;
  }

  hint() {
    if (this.phase !== 'drum') return '';
    if (this.onDrum) return this.copy.onDrum;
    if (this.beats > 0) return this.copy.report.replace('{n}', this.beats);
    return this.copy.goDrum;
  }

  anchor(id) {
    if (id === 'host') return this.card.position.clone().add(V(0, 1.4, 0));
    return null;
  }

  snapshot() {
    return {
      n: this.n || 0,
      total: this.words?.length || ROUNDS,
      beats: this.beats || 0,
      onDrum: !!this.onDrum,
      phase: this.phase,
      result: this.result || null,
      parts: this.parts(),
      teachAt: this.teachAt ?? -1,
    };
  }
}
